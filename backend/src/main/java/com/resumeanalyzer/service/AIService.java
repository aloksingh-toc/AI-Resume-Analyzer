package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AIFeedback;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Orchestrates the two-pass resume analysis workflow.
 * <p>
 * All AI/LLM communication is delegated to an {@link LLMProvider}
 * implementation (currently {@link GroqProvider}).  To switch providers
 * (e.g. OpenAI, Anthropic), implement {@link LLMProvider} and change
 * the Spring bean — no other code changes are needed.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    /** Thrown when the AI provider is unreachable or returns an error. */
    public static class AIServiceException extends RuntimeException {
        public AIServiceException(String message) { super(message); }
        public AIServiceException(String message, Throwable cause) { super(message, cause); }
    }

    private final LLMProvider llmProvider;

    // ═══════════════════════════════════════════════════════════════════════════
    // Public API
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Two-pass resume analysis:
     * <ol>
     *   <li>Understand the resume (tier, strengths, weaknesses, format)</li>
     *   <li>Generate structured, contextual feedback using that understanding</li>
     * </ol>
     */
    public AIFeedback analyzeResume(String resumeText,
                                    String jobDescription,
                                    String industry) throws Exception {
        // Pass 1 — understand the resume
        Map<String, Object> understanding = llmProvider.understandResume(resumeText);
        log.debug("Pass 1 understanding: tier={}, level={}, format={}",
            understanding.get("resume_tier"),
            understanding.get("experience_level"),
            understanding.get("format_type"));

        // Pass 2 — generate structured feedback
        return llmProvider.generateStructuredFeedback(
            resumeText, jobDescription, industry, understanding);
    }
}
