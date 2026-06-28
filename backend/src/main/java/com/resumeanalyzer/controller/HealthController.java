package com.resumeanalyzer.controller;

import com.resumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Lightweight liveness probe.  The total-analysis count is cached for 5 minutes
 * so uptime monitors don't trigger a full table scan on every ping.
 * <p>
 * An external keep-alive pinger (e.g. cron-job.org, UptimeRobot) hitting this
 * endpoint every few days registers as real activity and prevents the database
 * provider's free-tier project from auto-pausing.
 */
@RestController
@RequiredArgsConstructor
public class HealthController {

    private final ResumeRepository resumeRepository;

    private final AtomicLong            cachedCount      = new AtomicLong(0);
    private final AtomicReference<Long> lastFetchMillis   = new AtomicReference<>(0L);
    private static final long           CACHE_TTL_MILLIS  = 5 * 60 * 1000; // 5 minutes

    @GetMapping(value = "/api/health", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> health() {
        long count = getCachedCount();
        return ResponseEntity.ok(Map.of("status", "UP", "totalAnalyses", count));
    }

    private long getCachedCount() {
        long now = System.currentTimeMillis();
        Long last = lastFetchMillis.get();
        if (last == null || now - last > CACHE_TTL_MILLIS) {
            cachedCount.set(resumeRepository.count());
            lastFetchMillis.set(now);
        }
        return cachedCount.get();
    }
}
