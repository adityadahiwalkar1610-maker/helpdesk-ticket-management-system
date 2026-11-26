//Its purpose is to receive the user's email and new password from the React frontend when the user wants to reset their password.
package com.helpdesk.backend.dto;

public class ResetPasswordRequest {

    private String email; //stores the email address entered by the user.
    private String newPassword; //This variable stores the new password entered by the user.

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
