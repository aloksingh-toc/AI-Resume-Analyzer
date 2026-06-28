package com.resumeanalyzer.config;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Tracks how many free analyses each guest IP has consumed.
 *
 * Each IP gets FREE_LIMIT analyses per WINDOW_HOURS rolling window.
 * Stale entries (outside the window) are purged lazily on every write
 * so the map never grows without bound.
 */
@Component
public class FreeAnalysisTracker {

    public  static final int  FREE_LIMIT    = 3;
    private static final long WINDOW_MILLIS = 24L * 60 * 60 * 1000; // 24 hours
    private static final int  MAX_ENTRIES   = 10_000;                // memory guard

    /** Immutable tracking record: count of analyses used, window start epoch-millis. */
    private record WindowEntry(long count, long windowStart) {
        boolean isExpired() {
            return Instant.now().toEpochMilli() - windowStart > WINDOW_MILLIS;
        }
        WindowEntry increment() {
            return new WindowEntry(count + 1, windowStart);
        }
        WindowEntry decrement() {
            return new WindowEntry(Math.max(0, count - 1), windowStart);
        }
    }

    private final Map<String, WindowEntry> counts = new ConcurrentHashMap<>();

    public boolean hasUsedFreeAnalysis(String ip) {
        WindowEntry rec = counts.get(ip);
        if (rec == null) return false;
        if (rec.isExpired()) { counts.remove(ip); return false; }
        return rec.count() >= FREE_LIMIT;
    }

    /**
     * Atomically checks-and-reserves one free analysis for this IP, returning false if the
     * limit is already reached. Reserving (rather than checking then recording separately)
     * closes the race where two concurrent requests from the same IP could both pass the
     * limit check before either one's usage was recorded.
     */
    public boolean tryConsume(String ip) {
        purgeStale();
        long now = Instant.now().toEpochMilli();
        boolean[] allowed = new boolean[1];
        counts.compute(ip, (key, existing) -> {
            WindowEntry rec = (existing == null || existing.isExpired())
                ? new WindowEntry(0, now)
                : existing;
            if (rec.count() >= FREE_LIMIT) {
                allowed[0] = false;
                return rec;
            }
            allowed[0] = true;
            return rec.increment();
        });
        return allowed[0];
    }

    /** Gives back a reserved slot, e.g. when the analysis that consumed it failed. */
    public void release(String ip) {
        counts.computeIfPresent(ip, (key, rec) -> rec.decrement());
    }

    // ── Internals ────────────────────────────────────────────────────────────

    /** Remove entries whose 24-hour window has passed, and cap map size. */
    private void purgeStale() {
        if (counts.size() < MAX_ENTRIES / 2) return; // skip purge when map is small
        Iterator<Map.Entry<String, WindowEntry>> it = counts.entrySet().iterator();
        int removed = 0;
        while (it.hasNext() && removed < MAX_ENTRIES / 4) {
            if (it.next().getValue().isExpired()) { it.remove(); removed++; }
        }
    }
}
