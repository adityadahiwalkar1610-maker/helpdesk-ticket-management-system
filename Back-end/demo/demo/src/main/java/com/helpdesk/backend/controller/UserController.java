//receives the request.
package com.helpdesk.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.helpdesk.backend.dto.RegisterRequest;
import com.helpdesk.backend.dto.LoginRequest;
import com.helpdesk.backend.dto.LoginResponse;
import com.helpdesk.backend.entity.User;
import com.helpdesk.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5174")
public class UserController {

    private final UserService userService;

    // Constructor injection
    public UserController(UserService userService) {
        this.userService = userService;
    }

 
    // REGISTER API
 
    @PostMapping("/register") //Post
    public ResponseEntity<?> registerUser(
            @RequestBody RegisterRequest request) {

        try {

            User savedUser = userService.registerUser(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        } catch (RuntimeException e) {

            if ("Email already registered".equals(e.getMessage())) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(e.getMessage());
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

   
    // LOGIN API

    @PostMapping("/login") //Post
    public ResponseEntity<?> loginUser(
            @RequestBody LoginRequest request) {

        try {

            LoginResponse response =
                    userService.loginUser(request);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}
