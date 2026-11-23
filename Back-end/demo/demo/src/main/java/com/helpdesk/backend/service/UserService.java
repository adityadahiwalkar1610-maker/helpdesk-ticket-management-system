//This file handles registration and login logic.
//validates the information.
package com.helpdesk.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    // REGISTER
    public User registerUser(RegisterRequest request) {

        if (request.getName() == null ||
                request.getName().isBlank() ||
                request.getEmail() == null ||
                request.getEmail().isBlank() ||
                request.getPassword() == null ||
                request.getPassword().length() < 8) {

            throw new IllegalArgumentException( // that is invalid, inappropriate 
                    "Enter a name, valid email and password of at least 8 characters"
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);

        // Never store a plain-text password
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // Users cannot choose their own role during registration
        user.setRole("USER");

        return userRepository.save(user);
    }

    // LOGIN
    public LoginResponse loginUser(LoginRequest request) {

        if (request.getEmail() == null ||
                request.getPassword() == null) {

            throw new RuntimeException("Invalid email or password");
        }

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT after successful password verification
        String token = jwtService.generateToken(user);

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }
}
