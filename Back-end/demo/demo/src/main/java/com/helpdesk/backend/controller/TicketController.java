//receives tickets  request
package com.helpdesk.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.helpdesk.backend.entity.Ticket;
import com.helpdesk.backend.service.TicketService;

@RestController  //Handles API request and return response
@RequestMapping("/api/tickets")//Creates API endpoint
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // GET TICKETS ACCORDING TO USER ROLE
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(
            Authentication authentication) {

        String email = authentication.getName();
        String role = getRole(authentication);

        return ResponseEntity.ok(
                ticketService.getAllTickets(email, role)
        );
    }

    // GET TICKET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        String role = getRole(authentication);

        return ResponseEntity.ok(
                ticketService.getTicketById(id, email, role)
        );
    }

    // CREATE TICKET - USER ONLY
    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @RequestBody Ticket ticket,
            Authentication authentication) {

        String role = getRole(authentication);

        Ticket savedTicket = ticketService.createTicket(
                ticket,
                authentication.getName(),
                role
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(savedTicket);
    }

    // EDIT OWN OPEN TICKET - USER ONLY
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable Long id,
            @RequestBody Ticket ticket,
            Authentication authentication) {

        String role = getRole(authentication);

        return ResponseEntity.ok(
                ticketService.updateTicket(
                        id,
                        ticket,
                        authentication.getName(),
                        role
                )
        );
    }

    // SUPPORT / ADMIN UPDATE STATUS AND PRIORITY
    @PatchMapping("/{id}/staff")
    public ResponseEntity<Ticket> updateTicketByStaff(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        String role = getRole(authentication);

        return ResponseEntity.ok(
                ticketService.updateTicketBySupport(
                        id,
                        request.get("status"),
                        request.get("priority"),
                        role
                )
        );
    }

    // DELETE OWN OPEN TICKET - USER ONLY
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTicket(
            @PathVariable Long id,
            Authentication authentication) {

        String role = getRole(authentication);

        ticketService.deleteTicket(
                id,
                authentication.getName(),
                role
        );

        return ResponseEntity.ok("Ticket deleted successfully");
    }

    // GET LOGGED-IN USER'S ROLE
    private String getRole(Authentication authentication) {

        return authentication.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring(5))
                .findFirst()
                .orElse("USER");
    }

    // HANDLE INVALID STATUS AND PRIORITY
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleInvalidStatus(
            IllegalArgumentException exception) {

        return ResponseEntity.badRequest()
                .body(exception.getMessage());
    }

    // HANDLE ACCESS DENIED
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDenied(
            AccessDeniedException exception) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(exception.getMessage());
    }
}
