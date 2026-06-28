package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AIFeedback;
import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.dto.PagedResponse;
import com.resumeanalyzer.model.ResumeAnalysis;
import com.resumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    /** Thrown when the uploaded PDF cannot be parsed (scanned, encrypted, corrupted). */
    public static class PdfExtractionException extends RuntimeException {
        public PdfExtractionException(String message) { super(message); }
        public PdfExtractionException(String message, Throwable cause) { super(message, cause); }
    }

    private final AIService            aiService;
    private final ResumeRepository     resumeRepository;
    private final ResumeAnalysisMapper mapper;

    public AnalysisResponse analyzeResume(MultipartFile file,
                                          String username,
                                          String jobDescription,
                                          String industry) throws Exception {
        String filename   = sanitizeFilename(file.getOriginalFilename());
        String resumeText = extractText(file);

        log.info("Analyzing resume: {} | user: {} | industry: {}",
                 filename, username != null ? username : "(guest)", industry);

        if (resumeText == null || resumeText.isBlank()) {
            throw new PdfExtractionException(
                "Could not extract text from the uploaded PDF. " +
                "Please ensure the PDF is not scanned or image-based.");
        }

        AIFeedback     feedback = aiService.analyzeResume(resumeText, jobDescription, industry);
        ResumeAnalysis entity   = mapper.toEntity(feedback, filename, username, industry);
        ResumeAnalysis saved    = resumeRepository.save(entity);

        log.info("Saved analysis id: {}", saved.getId());
        return mapper.toResponse(saved);
    }

    public PagedResponse<AnalysisResponse> getHistory(int page, int size, String username) {
        Page<ResumeAnalysis> result = resumeRepository
            .findAllByUsernameOrderBySubmittedAtDesc(username, PageRequest.of(page, Math.min(size, 50)));
        return PagedResponse.<AnalysisResponse>builder()
            .content(result.getContent().stream().map(mapper::toResponse).collect(Collectors.toList()))
            .page(result.getNumber())
            .totalPages(result.getTotalPages())
            .totalElements(result.getTotalElements())
            .last(result.isLast())
            .build();
    }

    /** Only the owning user (matched by username) may fetch a saved analysis by id. */
    public AnalysisResponse getById(Long id, String username) {
        ResumeAnalysis analysis = resumeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Analysis not found."));
        if (username == null || !username.equals(analysis.getUsername())) {
            throw new RuntimeException("Analysis not found.");
        }
        return mapper.toResponse(analysis);
    }

    public long getTotalCount() {
        return resumeRepository.count();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Extracts text from a PDF using streaming to avoid loading the entire
     * file into memory.  Uses PDFBox 3.x RandomAccessReadBuffer.
     */
    private String extractText(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             PDDocument doc = Loader.loadPDF(new RandomAccessReadBuffer(is))) {
            return new PDFTextStripper().getText(doc);
        } catch (IOException e) {
            log.error("Failed to extract text from PDF: {}", e.getMessage());
            throw new PdfExtractionException(
                "Could not read the PDF file. It may be corrupted, encrypted, or scanned.", e);
        }
    }

    /**
     * Sanitises the original filename to prevent path-traversal attacks.
     * Strips directory separators and non-printable characters.
     */
    private String sanitizeFilename(String name) {
        if (name == null || name.isBlank()) return "resume.pdf";
        // Remove path separators and control characters, then clean up
        return name
            .replaceAll("[\\\\/]", "")                     // strip path separators
            .replaceAll("[^a-zA-Z0-9._\\- ]", "")          // allow only safe chars
            .replaceAll("\\.{2,}", ".")                    // collapse multiple dots
            .trim();
    }
}
