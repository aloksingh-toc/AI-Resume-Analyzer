package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AIFeedback;
import java.util.Map;

/**
 * Abstraction over the AI/LLM backend so the application is not
 * tightly coupled to a single provider (Groq, OpenAI, Anthropic, etc.).
 * <p>
 * To add a new provider, implement this interface and register it
 * as a Spring bean.  No other code changes are required.
 */
public interface LLMProvider {

    /**
     * Pass 1 — lightweight resume understanding.
     * @param resumeText truncated resume content
     * @return structured understanding map (tier, strengths, weaknesses, etc.)
     */
    Map<String, Object> understandResume(String resumeText) throws Exception;

    /**
     * Pass 2 — full structured analysis with contextual intelligence.
     * @param resumeText    full (possibly truncated) resume text
     * @param jobDescription optional job description
     * @param industry       optional target industry
     * @param understanding  Pass-1 understanding data
     * @return complete AIFeedback DTO ready for persistence
     */
    AIFeedback generateStructuredFeedback(
            String resumeText,
            String jobDescription,
            String industry,
            Map<String, Object> understanding) throws Exception;
}
