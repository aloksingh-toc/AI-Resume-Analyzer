package com.resumeanalyzer.service;

import com.resumeanalyzer.model.AppUser;
import com.resumeanalyzer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Handles user registration business logic.
 * Separated from {@link AppUserDetailsService} to respect
 * the Single Responsibility Principle.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.username}")
    private String adminUsername;

    /**
     * Registers a new user.
     * @throws RuntimeException if the username is already taken
     */
    public AppUser register(String username, String password, String email) {
        if (adminUsername.equalsIgnoreCase(username) || userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already taken");
        }
        AppUser user = new AppUser();
        user.setUsername(username.trim());
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email != null ? email.trim() : null);
        return userRepository.save(user);
    }
}
