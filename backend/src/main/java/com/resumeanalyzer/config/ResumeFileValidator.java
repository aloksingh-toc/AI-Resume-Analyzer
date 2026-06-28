package com.resumeanalyzer.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * Validates an uploaded resume file before it reaches the service layer.
 * Throws {@link InvalidFileException} for any constraint violation.
 * <p>
 * InvalidFileException is a checked exception so callers must explicitly
 * handle validation failures — it cannot be silently ignored.
 */
@Slf4j
@Component
public class ResumeFileValidator {

    public static final long MAX_FILE_BYTES = 5L * 1024 * 1024; // 5 MB

    public void validate(MultipartFile file) throws InvalidFileException {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Please upload a PDF file.");
        }
        String ct = file.getContentType();
        if (ct == null || !ct.equalsIgnoreCase("application/pdf")) {
            throw new InvalidFileException("Only PDF files are supported.");
        }
        if (file.getSize() > MAX_FILE_BYTES) {
            throw new InvalidFileException("File size must be under 5 MB.");
        }
    }

    /** Checked exception — forces callers to handle validation failures explicitly. */
    public static class InvalidFileException extends Exception {
        public InvalidFileException(String message) {
            super(message);
            log.warn("File validation rejected: {}", message);
        }
    }
}
