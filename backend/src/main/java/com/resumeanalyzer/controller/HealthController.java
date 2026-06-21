package com.resumeanalyzer.controller;

import com.resumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Lightweight liveness probe that also touches the database, so an external
 * keep-alive pinger (e.g. cron-job.org, UptimeRobot) hitting this endpoint
 * every few days registers as real activity and prevents Supabase's
 * free-tier project from auto-pausing after 7 days of inactivity.
 */
@RestController
@RequiredArgsConstructor
public class HealthController {

    private final ResumeRepository resumeRepository;

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        long count = resumeRepository.count();
        return ResponseEntity.ok(Map.of("status", "UP", "totalAnalyses", count));
    }
}
