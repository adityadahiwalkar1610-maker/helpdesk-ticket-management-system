

//handles incoming HTTP requests (Controller)
package com.helpdesk.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {

        return "Welcome to Helpdesk Backend";

    }
}
