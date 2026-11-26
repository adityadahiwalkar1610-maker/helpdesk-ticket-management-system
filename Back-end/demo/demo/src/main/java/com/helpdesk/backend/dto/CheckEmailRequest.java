//Its responsibility is to receive an email address when someone clicks the Verify Email button.
package com.helpdesk.backend.dto;

public class CheckEmailRequest {  //It allows Java to create an object without passing any values.

    private String email;//cannot be directly accessed outside this class.

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
