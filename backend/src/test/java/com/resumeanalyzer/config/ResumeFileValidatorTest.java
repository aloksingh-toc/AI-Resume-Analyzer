package com.resumeanalyzer.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for {@link ResumeFileValidator}.
 */
class ResumeFileValidatorTest {

    private final ResumeFileValidator validator = new ResumeFileValidator();

    @Test
    @DisplayName("Should accept a valid PDF file")
    void validPdfShouldPass() {
        MultipartFile file = new MockMultipartFile(
            "file", "resume.pdf", "application/pdf", "fake pdf content".getBytes()
        );
        assertDoesNotThrow(() -> validator.validate(file));
    }

    @Test
    @DisplayName("Should reject null file")
    void nullFileShouldThrow() {
        ResumeFileValidator.InvalidFileException ex = assertThrows(
            ResumeFileValidator.InvalidFileException.class,
            () -> validator.validate(null)
        );
        assertTrue(ex.getMessage().contains("PDF"));
    }

    @Test
    @DisplayName("Should reject empty file")
    void emptyFileShouldThrow() {
        MultipartFile file = new MockMultipartFile(
            "file", "empty.pdf", "application/pdf", new byte[0]
        );
        ResumeFileValidator.InvalidFileException ex = assertThrows(
            ResumeFileValidator.InvalidFileException.class,
            () -> validator.validate(file)
        );
        assertTrue(ex.getMessage().contains("PDF"));
    }

    @Test
    @DisplayName("Should reject non-PDF content type")
    void nonPdfContentTypeShouldThrow() {
        MultipartFile file = new MockMultipartFile(
            "file", "image.png", "image/png", new byte[100]
        );
        ResumeFileValidator.InvalidFileException ex = assertThrows(
            ResumeFileValidator.InvalidFileException.class,
            () -> validator.validate(file)
        );
        assertTrue(ex.getMessage().contains("PDF"));
    }

    @Test
    @DisplayName("Should reject null content type")
    void nullContentTypeShouldThrow() {
        MultipartFile file = new MockMultipartFile(
            "file", "resume.pdf", null, new byte[100]
        );
        ResumeFileValidator.InvalidFileException ex = assertThrows(
            ResumeFileValidator.InvalidFileException.class,
            () -> validator.validate(file)
        );
        assertTrue(ex.getMessage().contains("PDF"));
    }

    @Test
    @DisplayName("Should reject files over 5 MB")
    void oversizedFileShouldThrow() {
        byte[] bigContent = new byte[(int) (ResumeFileValidator.MAX_FILE_BYTES + 1)];
        MultipartFile file = new MockMultipartFile(
            "file", "big.pdf", "application/pdf", bigContent
        );
        ResumeFileValidator.InvalidFileException ex = assertThrows(
            ResumeFileValidator.InvalidFileException.class,
            () -> validator.validate(file)
        );
        assertTrue(ex.getMessage().contains("5 MB"));
    }

    @Test
    @DisplayName("Should accept file at exactly 5 MB")
    void exactlyMaxSizeShouldPass() {
        byte[] content = new byte[(int) ResumeFileValidator.MAX_FILE_BYTES];
        MultipartFile file = new MockMultipartFile(
            "file", "max.pdf", "application/pdf", content
        );
        assertDoesNotThrow(() -> validator.validate(file));
    }
}
