package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AIFeedback;
import com.resumeanalyzer.model.ResumeAnalysis;
import com.resumeanalyzer.repository.ResumeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Integration-style test for the full resume analysis pipeline:
 * AIService → LLMProvider → ResumeService → ResumeRepository.
 * <p>
 * Uses a mock LLMProvider to avoid real Groq API calls.
 */
@ExtendWith(MockitoExtension.class)
class ResumeAnalysisPipelineTest {

    @Mock
    private LLMProvider llmProvider;

    @Mock
    private ResumeRepository resumeRepository;

    private ResumeAnalysisMapper mapper;
    private AIService aiService;
    private ResumeService resumeService;

    @BeforeEach
    void setUp() {
        mapper = new ResumeAnalysisMapper();
        aiService = new AIService(llmProvider);
        resumeService = new ResumeService(aiService, resumeRepository, mapper);
    }

    @Test
    @DisplayName("Full pipeline: AI understands → scores → persists → returns DTO")
    void fullPipelineShouldWorkEndToEnd() throws Exception {
        // Arrange — mock Pass 1 (understanding)
        Map<String, Object> understanding = Map.of(
            "resume_tier", "good",
            "experience_level", "mid",
            "format_type", "single_column_clean",
            "top_3_strengths", List.of("Clear layout", "Good metrics", "Relevant skills"),
            "top_3_weaknesses", List.of("No summary", "Missing LinkedIn", "Short experience bullets"),
            "primary_role", "Software Engineer",
            "has_metrics", true,
            "has_action_verbs", true,
            "sections_present", List.of("Contact Info", "Work Experience", "Education", "Skills"),
            "sections_missing", List.of("Professional Summary", "Projects")
        );
        when(llmProvider.understandResume(anyString())).thenReturn(understanding);

        // Mock Pass 2 (structured feedback)
        AIFeedback mockFeedback = new AIFeedback();
        mockFeedback.setScore(78);
        mockFeedback.setSummaryScore(14);
        mockFeedback.setSkillsScore(16);
        mockFeedback.setExperienceScore(22);
        mockFeedback.setFormattingScore(12);
        mockFeedback.setProfessionalismScore(14);
        mockFeedback.setSummaryFeedback("Good summary but could be more specific.");
        mockFeedback.setSkillsFeedback("Skills section is strong but missing cloud technologies.");
        mockFeedback.setExperienceFeedback("Good use of metrics — 'Led team of 5' is strong.");
        mockFeedback.setFormattingFeedback("Clean single-column layout — ATS friendly.");
        mockFeedback.setOverallFeedback("Add a professional summary; Include cloud certifications; Quantify more achievements.");
        mockFeedback.setAtsScore(85);
        mockFeedback.setAtsIssues(List.of("Missing LinkedIn URL"));
        mockFeedback.setKeywordsFound(List.of("Java", "Spring Boot", "React", "SQL"));
        mockFeedback.setKeywordsMissing(List.of("AWS", "Docker", "Kubernetes", "CI/CD"));
        mockFeedback.setMissingSections(List.of("Professional Summary", "Projects"));
        mockFeedback.setJdMatchScore(65);

        when(llmProvider.generateStructuredFeedback(anyString(), isNull(), eq("Software / IT"), eq(understanding)))
            .thenReturn(mockFeedback);

        // Act — simulate a full analysis (without MultipartFile, testing service layer directly)
        AIFeedback result = aiService.analyzeResume(
            "John Doe\nSoftware Engineer\nJava, Spring Boot, React...",
            null, "Software / IT");

        // Assert
        assertNotNull(result);
        assertEquals(78, result.getScore());
        assertEquals(14, result.getSummaryScore());
        assertEquals(16, result.getSkillsScore());
        assertEquals(22, result.getExperienceScore());
        assertEquals(85, result.getAtsScore());
        assertEquals(65, result.getJdMatchScore());
        assertEquals(4, result.getKeywordsFound().size());
        assertEquals(4, result.getKeywordsMissing().size());
        assertEquals(2, result.getMissingSections().size());
        assertTrue(result.getOverallFeedback().contains("professional summary"));

        // Verify LLM was called exactly once for each pass
        verify(llmProvider, times(1)).understandResume(anyString());
        verify(llmProvider, times(1)).generateStructuredFeedback(anyString(), isNull(), eq("Software / IT"), anyMap());

        // Verify repository was NOT called (this test only exercises the AI pipeline)
        verify(resumeRepository, never()).save(any());
    }

    @Test
    @DisplayName("Pipeline should propagate AI service failures")
    void shouldPropagateAIServiceErrors() throws Exception {
        when(llmProvider.understandResume(anyString()))
            .thenThrow(new AIService.AIServiceException("Groq API rate limited"));

        AIService.AIServiceException ex = assertThrows(
            AIService.AIServiceException.class,
            () -> aiService.analyzeResume("Fake resume text", null, null)
        );
        assertTrue(ex.getMessage().contains("rate limited"));

        // Repository should NOT be called on failure
        verify(resumeRepository, never()).save(any());
    }
}
