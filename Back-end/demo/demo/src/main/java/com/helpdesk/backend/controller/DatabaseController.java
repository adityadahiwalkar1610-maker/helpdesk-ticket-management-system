
package com.helpdesk.backend.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
public class DatabaseController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/db-check")
    public String checkDatabase() {

        String databaseName = jdbcTemplate.queryForObject(
            "SELECT DATABASE()",
            String.class
        );

        return "Connected to MySQL Database: " + databaseName;
    }
}
