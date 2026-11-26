//Used to send login information back to the frontend after successful authentication.

package com.helpdesk.backend.dto;



public class LoginResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String token;
    private String welcomeMessage;

    public LoginResponse(
            Long id,
            String name,
            String email,
            String role,
            String token,
            String welcomeMessage) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.token = token;
        this.welcomeMessage = welcomeMessage;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }

    public String getWelcomeMessage() {
        return welcomeMessage;
    }
}
