package com.resumeanalyzer.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "app_users")
@Data
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 150)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(length = 255)
    private String email;

    /**
     * User role for authorization.
     * Default is "USER".  "ADMIN" users can access admin endpoints.
     * Stored as a simple string for forward-compatibility with Spring Security roles.
     */
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        USER,
        ADMIN
    }
}
