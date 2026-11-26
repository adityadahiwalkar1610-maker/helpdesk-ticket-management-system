//receive requests	

//Register a new user.
//Login an existing user.
//Check whether an email exists.
//Reset the user's password.

package com.helpdesk.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.helpdesk.backend.dto.RegisterRequest;
import com.helpdesk.backend.dto.LoginRequest;
import com.helpdesk.backend.dto.LoginResponse;
import com.helpdesk.backend.dto.CheckEmailRequest;
import com.helpdesk.backend.dto.ResetPasswordRequest;

import com.helpdesk.backend.entity.User;
import com.helpdesk.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5174")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody RegisterRequest request) {

        try {
            User savedUser = userService.registerUser(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody LoginRequest request) {

        try {
            LoginResponse response = userService.loginUser(request);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Login failed due to a server error."
                    ));
        }
    }

    // CHECK EMAIL
    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(
            @RequestBody CheckEmailRequest request) {

        try {
            boolean exists = userService.checkEmailExists(
                    request.getEmail()
            );

            return ResponseEntity.ok(
                    Map.of("exists", exists)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        try {
            userService.resetPassword(
                    request.getEmail(),
                    request.getNewPassword()
            );

            return ResponseEntity.ok(
                    Map.of("message", "Password updated successfully")
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
