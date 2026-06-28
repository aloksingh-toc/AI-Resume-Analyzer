package com.resumeanalyzer.config;

import com.resumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Periodic keep-alive task that touches the database to prevent
 * free-tier hosting providers (Supabase, Render, etc.) from
 * auto-pausing the project due to inactivity.
 * <p>
 * Runs every 4 days — well within the typical 7-day inactivity
 * threshold used by most free-tier DB providers.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class KeepAliveScheduler {

    private final ResumeRepository resumeRepository;

    /**
     * Executes a lightweight DB query every 4 days.
     * The query result is intentionally not used — the sole purpose
     * is to register activity on the database connection.
     */
    @Scheduled(fixedRate = 4L * 24 * 60 * 60 * 1000) // 4 days
    public void keepAlive() {
        try {
            long count = resumeRepository.count();
            log.info("Keep-alive ping: database is active ({} analyses stored)", count);
        } catch (Exception e) {
            log.warn("Keep-alive ping failed: {}", e.getMessage());
        }
    }
}
