package com.resumeanalyzer.config;

import com.resumeanalyzer.config.HttpUtils;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;
import java.time.Instant;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final int  CAPACITY       = 5;
    private static final Duration REFILL_PERIOD = Duration.ofMinutes(1);
    private static final long IDLE_MILLIS    = 10L * 60 * 1000; // entries idle >10min are stale
    private static final int  MAX_ENTRIES    = 10_000;          // memory guard

    /** value = bucket, keyed by client IP; lastSeen tracked alongside for purging */
    private final Map<String, Bucket> buckets  = new ConcurrentHashMap<>();
    private final Map<String, Long>   lastSeen = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String ip = HttpUtils.getClientIp(request);
        purgeStale();
        lastSeen.put(ip, Instant.now().toEpochMilli());
        Bucket bucket = buckets.computeIfAbsent(ip, k -> newBucket());

        if (bucket.tryConsume(1)) {
            return true;
        }

        response.setStatus(429);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"Too many requests. Please wait a minute before analyzing another resume.\"}");
        return false;
    }

    private Bucket newBucket() {
        Bandwidth limit = Bandwidth.builder()
            .capacity(CAPACITY)
            .refillIntervally(CAPACITY, REFILL_PERIOD)
            .build();
        return Bucket.builder().addLimit(limit).build();
    }

    /** Remove buckets idle for more than IDLE_MILLIS, capping map growth. */
    private void purgeStale() {
        if (buckets.size() < MAX_ENTRIES / 2) return; // skip purge when map is small
        long now = Instant.now().toEpochMilli();
        Iterator<Map.Entry<String, Long>> it = lastSeen.entrySet().iterator();
        int removed = 0;
        while (it.hasNext() && removed < MAX_ENTRIES / 4) {
            Map.Entry<String, Long> entry = it.next();
            if (now - entry.getValue() > IDLE_MILLIS) {
                buckets.remove(entry.getKey());
                it.remove();
                removed++;
            }
        }
    }
}
