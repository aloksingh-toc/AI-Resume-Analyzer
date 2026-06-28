package com.resumeanalyzer.service;

import com.resumeanalyzer.model.AppUser;
import com.resumeanalyzer.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Spring Security {@link UserDetailsService} implementation.
 * Handles ONLY authentication concerns — loading users for login.
 */
@Service
@Slf4j
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.username}")
    private String adminUsername;

    @Value("${app.password}")
    private String adminPassword;

    private String encodedAdminPassword;

    public AppUserDetailsService(UserRepository userRepository,
                                  PasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        if (adminPassword == null || adminPassword.isBlank()) {
            log.warn("APP_PASSWORD is not set — admin login will be disabled. " +
                     "Set the APP_PASSWORD environment variable to enable admin access.");
            this.encodedAdminPassword = null;
        } else {
            this.encodedAdminPassword = passwordEncoder.encode(adminPassword);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (adminUsername.equals(username)) {
            if (encodedAdminPassword == null) {
                throw new UsernameNotFoundException("Admin account is not configured.");
            }
            return User.withUsername(adminUsername)
                .password(encodedAdminPassword)
                .roles("USER", "ADMIN")
                .build();
        }

        AppUser user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        String[] roles = user.getRole() == AppUser.Role.ADMIN
            ? new String[]{"USER", "ADMIN"}
            : new String[]{"USER"};
        return User.withUsername(user.getUsername())
            .password(user.getPassword())
            .roles(roles)
            .build();
    }
}
