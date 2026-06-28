package com.resumeanalyzer.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for {@link FreeAnalysisTracker}.
 */
class FreeAnalysisTrackerTest {

    private FreeAnalysisTracker tracker;

    @BeforeEach
    void setUp() {
        tracker = new FreeAnalysisTracker();
    }

    @Test
    @DisplayName("Should allow FREE_LIMIT analyses then reject")
    void shouldAllowUpToLimit() {
        String ip = "192.168.1.1";
        for (int i = 0; i < FreeAnalysisTracker.FREE_LIMIT; i++) {
            assertTrue(tracker.tryConsume(ip), "Analysis " + (i + 1) + " should be allowed");
        }
        assertFalse(tracker.tryConsume(ip), "Should reject after limit reached");
    }

    @Test
    @DisplayName("Should correctly track limit")
    void shouldTrackLimitCorrectly() {
        String ip = "10.0.0.1";
        assertFalse(tracker.hasUsedFreeAnalysis(ip));
        tracker.tryConsume(ip);
        assertFalse(tracker.hasUsedFreeAnalysis(ip));
        tracker.tryConsume(ip);
        tracker.tryConsume(ip);
        assertTrue(tracker.hasUsedFreeAnalysis(ip));
    }

    @Test
    @DisplayName("Should release a slot on failure")
    void shouldReleaseSlot() {
        String ip = "172.16.0.1";
        tracker.tryConsume(ip);
        tracker.tryConsume(ip);
        tracker.tryConsume(ip); // all 3 used
        assertFalse(tracker.tryConsume(ip));

        tracker.release(ip); // give one back
        assertTrue(tracker.tryConsume(ip), "Should allow after release");
    }

    @Test
    @DisplayName("Should track different IPs independently")
    void shouldTrackIpsIndependently() {
        String ip1 = "1.1.1.1";
        String ip2 = "2.2.2.2";

        // Use all analyses for ip1
        tracker.tryConsume(ip1);
        tracker.tryConsume(ip1);
        tracker.tryConsume(ip1);

        // ip2 should still have all analyses available
        assertTrue(tracker.tryConsume(ip2));
        assertTrue(tracker.tryConsume(ip2));
    }
}
