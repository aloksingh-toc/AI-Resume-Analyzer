package com.resumeanalyzer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeanalyzer.dto.AIFeedback;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Groq API implementation of {@link LLMProvider}.
 * Contains all Groq-specific configuration, prompt engineering,
 * and HTTP communication logic.
 */
@Component
@Slf4j
public class GroqProvider implements LLMProvider {

    @Value("${groq.api.key}")   private String groqApiKey;
    @Value("${groq.api.url}")   private String groqUrl;
    @Value("${groq.api.model}") private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient   httpClient   = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build();

    // ── Industry-specific keyword domains ───────────────────────────────────
    private static final Map<String, String> INDUSTRY_KEYWORDS = Map.ofEntries(
        Map.entry("Software / IT",           "languages, frameworks, system design, CI/CD, code review, testing, agile, microservices, APIs, cloud, git"),
        Map.entry("Data Science / AI",       "Python, ML, deep learning, statistics, SQL, data pipelines, NLP, TensorFlow, PyTorch, feature engineering, model deployment"),
        Map.entry("DevOps / Cloud",          "AWS, Azure, GCP, Kubernetes, Docker, Terraform, CI/CD, monitoring, Linux, scripting, infrastructure as code"),
        Map.entry("Cybersecurity",           "SIEM, penetration testing, incident response, compliance, NIST, ISO 27001, firewalls, threat hunting, forensics"),
        Map.entry("Banking / Finance",       "risk management, portfolio, financial modeling, Bloomberg, CFA, regulatory compliance, Excel, SQL, valuation"),
        Map.entry("Investment Banking",      "DCF, LBO, M&A, pitch books, financial modeling, due diligence, deal execution, valuation, Excel, PowerPoint"),
        Map.entry("Marketing / Growth",      "SEO, SEM, analytics, content strategy, A/B testing, CRM, social media, lead generation, funnel optimization"),
        Map.entry("Sales / Business Development", "pipeline, CRM, negotiation, account management, prospecting, revenue, quota, cold outreach, closing"),
        Map.entry("Human Resources",         "recruitment, onboarding, HRIS, employee relations, compliance, performance management, benefits, talent acquisition"),
        Map.entry("Healthcare / Clinical",   "patient care, EMR/EHR, clinical protocols, HIPAA, diagnostics, treatment planning, medical terminology"),
        Map.entry("Consulting / Strategy",   "frameworks, slide decks, stakeholder management, problem solving, analysis, presentation, Excel, project management"),
        Map.entry("Legal",                   "contracts, litigation, compliance, legal research, negotiation, drafting, regulatory, case management, Westlaw")
    );

    // ── Rotating reviewer personas ──────────────────────────────────────────
    private static final String[] PERSONAS = {
        "You are a STRICT TECHNICAL RECRUITER with 15 years of experience screening " +
        "thousands of resumes for Fortune 500 tech companies. You are brutally honest, " +
        "detail-oriented, and you've seen every trick candidates try. You focus on " +
        "substantive content, quantified impact, and real skills — not fluff. " +
        "Your feedback is direct and no-nonsense. You call out weak bullet points and " +
        "vague claims immediately.",

        "You are a DEMANDING HIRING MANAGER who reviews 200+ resumes per open role. " +
        "You spend 6-15 seconds on an initial scan and decide immediately whether to " +
        "interview. You value clarity, relevance, and evidence of impact. You are " +
        "skeptical of generic statements and demand proof. Your feedback is sharp, " +
        "actionable, and focused on what would make you stop and actually read further.",

        "You are a SENIOR CAREER COACH who has helped 5000+ professionals land roles " +
        "at Google, Amazon, McKinsey, Goldman Sachs, and top startups. You balance " +
        "honest critique with constructive guidance. You identify not just what's wrong " +
        "but WHY it matters and HOW to fix it. Your feedback is thorough, " +
        "empathetic but direct, and always includes the 'so what' behind each suggestion.",

        "You are a METICULOUS ATS SPECIALIST who has configured and managed hiring " +
        "pipelines for enterprises using Workday, Greenhouse, Lever, and Taleo. You know " +
        "EXACTLY what causes resumes to be rejected before a human ever sees them. " +
        "Your feedback emphasizes practical, fixable ATS issues above all else."
    };

    @PostConstruct
    public void validateConfig() {
        if (groqApiKey == null || groqApiKey.isBlank()) {
            throw new IllegalStateException("GROQ_API_KEY environment variable is not set");
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LLMProvider implementation
    // ═══════════════════════════════════════════════════════════════════════════

    @Override
    public Map<String, Object> understandResume(String resumeText) throws Exception {
        String prompt = String.format("""
            Analyze this resume and return ONLY a JSON object (no markdown, no extra text):

            {
              "resume_tier": "<one of: excellent, good, average, below_average, weak>",
              "experience_level": "<entry, mid, senior, executive>",
              "format_type": "<single_column_clean, multi_column, heavy_formatting, minimal, scanned_image_likely>",
              "top_3_strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
              "top_3_weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
              "primary_role": "<the candidate's apparent current or target role>",
              "has_metrics": <true or false>,
              "has_action_verbs": <true or false>,
              "resume_length_words": <approximate word count>,
              "sections_present": ["<section name>", ...],
              "sections_missing": ["<section name>", ...]
            }

            Resume:
            %s
            """, safeTruncate(resumeText, 2500));

        Map<String, Object> body = Map.of(
            "model",    model,
            "messages", List.of(
                Map.of("role", "system", "content", "You are a resume structure analyzer. Return ONLY valid JSON."),
                Map.of("role", "user",   "content", prompt)
            ),
            "temperature", 0.1,
            "max_tokens",  350
        );

        String content = callGroq(body);
        JsonNode root = objectMapper.readTree(content);
        @SuppressWarnings("unchecked")
        Map<String, Object> result = objectMapper.convertValue(root, Map.class);
        return result;
    }

    @Override
    public AIFeedback generateStructuredFeedback(
            String resumeText,
            String jobDescription,
            String industry,
            Map<String, Object> understanding) throws Exception {

        String resumeTier      = safeStr(understanding.get("resume_tier"), "average");
        String experienceLevel = safeStr(understanding.get("experience_level"), "mid");
        String formatType      = safeStr(understanding.get("format_type"), "standard");
        boolean hasMetrics     = Boolean.TRUE.equals(understanding.get("has_metrics"));
        boolean hasActionVerbs = Boolean.TRUE.equals(understanding.get("has_action_verbs"));
        String strengths       = String.join(", ", safeList(understanding.get("top_3_strengths")));
        String weaknesses      = String.join(", ", safeList(understanding.get("top_3_weaknesses")));

        int personaIdx = Math.abs(resumeText.hashCode()) % PERSONAS.length;
        String persona = PERSONAS[personaIdx];

        String systemMsg = String.format("""
            %s
            You give HONEST, specific, and VARIED feedback tailored to each resume.

            CONTEXT FOR THIS RESUME:
            - Quality tier: %s
            - Experience: %s level
            - Format: %s
            - Has quantified metrics: %s
            - Uses action verbs: %s
            - Key strengths: %s
            - Key weaknesses: %s

            SCORING PHILOSOPHY:
            - weak resumes -> 20-40, below_average -> 41-55, average -> 56-70,
              good -> 71-82, excellent -> 83-100
            - Be CALIBRATED and honest. Don't inflate scores.
            - Every resume must get genuinely DIFFERENT feedback — never regurgitate templates.
            - Focus feedback on THIS resume's specific strengths and weaknesses.

            Return ONLY valid JSON. No markdown. No explanation outside the JSON object.
            """,
            persona, resumeTier, experienceLevel, formatType,
            hasMetrics ? "YES" : "NO", hasActionVerbs ? "YES" : "NO",
            strengths.isEmpty() ? "none identified" : strengths,
            weaknesses.isEmpty() ? "none identified" : weaknesses
        );

        String userPrompt = buildContextualPrompt(resumeText, jobDescription, industry, understanding);

        Map<String, Object> body = Map.of(
            "model",    model,
            "messages", List.of(
                Map.of("role", "system", "content", systemMsg),
                Map.of("role", "user",   "content", userPrompt)
            ),
            "temperature", 0.3,
            "max_tokens",  2000
        );

        String jsonContent = callGroq(body);
        return objectMapper.readValue(jsonContent, AIFeedback.class);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Contextual prompt builder (Groq-specific prompt engineering)
    // ═══════════════════════════════════════════════════════════════════════════

    private String buildContextualPrompt(
            String resumeText, String jobDescription, String industry,
            Map<String, Object> understanding) {

        StringBuilder sb = new StringBuilder();

        if (industry != null && !industry.isBlank()) {
            sb.append("INDUSTRY: The candidate is targeting the ")
              .append(industry.replace("<", "").replace(">", ""))
              .append(" sector.\n");
            String keywords = INDUSTRY_KEYWORDS.getOrDefault(industry, "");
            if (!keywords.isBlank()) {
                sb.append("Industry-relevant skill domains: ").append(keywords).append("\n");
            }
            sb.append("\n");
        }

        sb.append("SCORING RULES (tailored to this resume's tier — ")
          .append(safeStr(understanding.get("resume_tier"), "average"))
          .append("):\n");
        sb.append("- 0-20: Very poor. Missing most sections, no structure.\n");
        sb.append("- 21-40: Weak. Basic info but lacks detail, impact, or clarity.\n");
        sb.append("- 41-55: Below average. Some good parts but many areas need improvement.\n");
        sb.append("- 56-70: Average. Decent resume but missing quantified achievements.\n");
        sb.append("- 71-82: Good. Well-structured with some measurable results.\n");
        sb.append("- 83-92: Very good. Strong resume with clear impact.\n");
        sb.append("- 93-100: Excellent. Outstanding, ready for top companies.\n\n");

        String fmt = safeStr(understanding.get("format_type"), "standard");
        sb.append("ATS SCORING (");
        if (fmt.contains("heavy") || fmt.contains("multi")) {
            sb.append("heavy/multi-column formatting — ATS compatibility is a CONCERN):\n");
        } else if (fmt.contains("clean") || fmt.contains("single")) {
            sb.append("format appears clean — verify ATS friendliness):\n");
        } else {
            sb.append("standard):\n");
        }
        sb.append("- Penalise: tables, columns, graphics, headers/footers, non-standard fonts, etc.\n");
        sb.append("- Reward: clean single-column layout, standard headings, bullet points, keywords.\n\n");

        sb.append("MISSING SECTIONS — the following were DETECTED as absent:\n");
        List<String> missing = safeList(understanding.get("sections_missing"));
        if (!missing.isEmpty()) {
            sb.append("Already known missing: ").append(String.join(", ", missing)).append("\n");
        }
        sb.append("Also check for commonly missing sections by role level.\n\n");

        sb.append("""
            Return ONLY this JSON object — no markdown, no extra text:
            {
              "score": <integer 0-100>,
              "summary_score": <integer 0-20>,
              "skills_score": <integer 0-20>,
              "experience_score": <integer 0-30>,
              "formatting_score": <integer 0-15>,
              "professionalism_score": <integer 0-15>,
              "ats_score": <integer 0-100>,
              "ats_issues": [<up to 5 specific ATS problems, or empty array>],
              "keywords_found": [<up to 8 keywords present>],
              "keywords_missing": [<up to 8 keywords absent>],
              "missing_sections": [<detected missing sections, or empty array>],
              "jd_match_score": <integer 0-100 or null>,
              "summary_feedback": "<specific feedback>",
              "skills_feedback": "<specific feedback>",
              "experience_feedback": "<specific feedback>",
              "formatting_feedback": "<specific feedback>",
              "overall_feedback": "<1-5 specific, actionable, UNIQUE improvements. For excellent resumes give 1-2, for weak give 4-5.>"
            }
            """);

        if (jobDescription != null && !jobDescription.isBlank()) {
            sb.append("\n---JD_START---\n").append(safeTruncate(jobDescription, 2000))
              .append("\n---JD_END---\n");
            sb.append("Calculate jd_match_score from JD requirements vs resume.\n\n");
        } else {
            sb.append("No JD provided. Set jd_match_score to null.\n\n");
        }

        sb.append("---RESUME_START---\n")
          .append(safeTruncate(resumeText, 4000))
          .append("\n---RESUME_END---\n\n");
        sb.append("Your feedback MUST reference specific details from THIS resume. Be honest and critical.");

        return sb.toString();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Groq HTTP communication
    // ═══════════════════════════════════════════════════════════════════════════

    private String callGroq(Map<String, Object> body) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(groqUrl))
            .header("Content-Type",  "application/json")
            .header("Authorization", "Bearer " + groqApiKey)
            .timeout(Duration.ofSeconds(60))
            .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            log.error("Groq API error {}: {}", response.statusCode(), response.body());
            throw new AIService.AIServiceException("AI service unavailable. Please try again later.");
        }

        JsonNode root    = objectMapper.readTree(response.body());
        JsonNode choices = root.path("choices");
        if (!choices.isArray() || choices.isEmpty()) {
            log.error("Groq API returned no choices: {}", response.body());
            throw new AIService.AIServiceException("AI service returned an unexpected response.");
        }

        String content = choices.get(0).path("message").path("content").asText("").trim();
        if (content.isEmpty()) {
            throw new AIService.AIServiceException("AI service returned empty content.");
        }

        if (content.startsWith("```")) {
            content = content.replaceAll("(?s)```json\\s*", "")
                            .replaceAll("(?s)```\\s*", "").trim();
        }

        return content;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Helpers
    // ═══════════════════════════════════════════════════════════════════════════

    @SuppressWarnings("unchecked")
    private List<String> safeList(Object obj) {
        if (obj instanceof List<?> list) {
            return list.stream().filter(String.class::isInstance).map(String.class::cast).toList();
        }
        return List.of();
    }

    private String safeStr(Object obj, String fallback) {
        if (obj instanceof String s && !s.isBlank()) return s;
        return fallback;
    }

    private String safeTruncate(String text, int maxLen) {
        if (text == null) return "";
        if (text.length() <= maxLen) return text;
        return text.substring(0, maxLen) + "\n[...truncated...]";
    }
}
