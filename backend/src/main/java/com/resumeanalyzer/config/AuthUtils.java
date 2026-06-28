package com.resumeanalyzer.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

/**
 * Shared authentication utilities used across controllers.
 */
public final class AuthUtils {

    private AuthUtils() {}

    /**
     * Returns true when the request carries a real, non-anonymous authentication.
     */
    public static boolean isAuthenticated(Authentication auth) {
        return auth != null
            && auth.isAuthenticated()
            && !(auth instanceof AnonymousAuthenticationToken);
    }

    /**
     * Stores the supplied Authentication in the Spring Security context and in
     * the HTTP session so subsequent requests are recognised as logged in.
     * Invalidates any existing session first to prevent session-fixation attacks.
     * Call this after a successful login or registration.
     */
    public static void establishSession(Authentication auth, HttpServletRequest request) {
        // Prevent session fixation: invalidate old session, create a fresh one
        HttpSession oldSession = request.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }
        SecurityContext sc = SecurityContextHolder.createEmptyContext();
        sc.setAuthentication(auth);
        SecurityContextHolder.setContext(sc);
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);
    }
}
