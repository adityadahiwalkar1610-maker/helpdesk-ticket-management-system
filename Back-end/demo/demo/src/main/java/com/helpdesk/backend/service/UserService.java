//This file handles registration and login logic.
//validates the information.



package com.helpdesk.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.helpdesk.backend.dto.RegisterRequest;
import com.helpdesk.backend.dto.LoginRequest;
import com.helpdesk.backend.dto.LoginResponse;
import com.helpdesk.backend.entity.User;
import com.helpdesk.backend.repository.UserRepository;
import com.helpdesk.backend.security.JwtService;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // REGISTER USER
    public User registerUser(RegisterRequest request) {

        if (request.getName() == null ||
                request.getName().isBlank() ||
                !request.getName().trim()
                        .matches("[A-Za-z]+(?: [A-Za-z]+)*") ||
                request.getEmail() == null ||
                request.getEmail().isBlank() ||
                request.getPassword() == null ||
                request.getPassword().length() < 8) {

            throw new IllegalArgumentException(
                    "Enter a valid name, email and password of at least 8 characters."
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setHasLoggedIn(false);

        return userRepository.save(user);
    }

    // LOGIN USER
    @Transactional
    public LoginResponse loginUser(LoginRequest request) {

        if (request == null ||
                request.getEmail() == null ||
                request.getEmail().isBlank() ||
                request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new IllegalArgumentException(
                    "Please enter your email and password."
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password.")
                );

        // Verify BCrypt password
        if (user.getPassword() == null ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid email or password."
            );
        }

        // First login / returning login
        String welcomeMessage;

        if (!user.isHasLoggedIn()) {
            welcomeMessage = "Welcome";
            user.setHasLoggedIn(true);
            userRepository.save(user);
        } else {
            welcomeMessage = "Welcome back";
        }

        // Generate JWT
        String token = jwtService.generateToken(user);

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                token,
                welcomeMessage
        );
    }

    // CHECK EMAIL
    public boolean checkEmailExists(String email) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "Please enter your email address."
            );
        }

        return userRepository.existsByEmail(
                email.trim().toLowerCase()
        );
    }

    // RESET PASSWORD
    @Transactional
    public void resetPassword(String email, String newPassword) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "Please enter your email address."
            );
        }

        if (newPassword == null || newPassword.length() < 8) {
            throw new IllegalArgumentException(
                    "New password must contain at least 8 characters."
            );
        }

        User user = userRepository.findByEmail(
                email.trim().toLowerCase()
        ).orElseThrow(() ->
                new IllegalArgumentException("Email not registered")
        );

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }
}
