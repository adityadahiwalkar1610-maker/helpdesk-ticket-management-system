// performs login of tickets and checks the user's role.
package com.helpdesk.backend.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.helpdesk.backend.entity.Ticket;
import com.helpdesk.backend.entity.User;
import com.helpdesk.backend.repository.TicketRepository;
import com.helpdesk.backend.repository.UserRepository;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketService(
            TicketRepository ticketRepository,
            UserRepository userRepository) {

        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    private static final List<String> ALLOWED_STATUSES = Arrays.asList(
            "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"
    );

    private static final List<String> ALLOWED_PRIORITIES = Arrays.asList(
            "LOW", "MEDIUM", "HIGH"
    );

    // CHECK USER ROLE
    private void checkUserRole(String role) {
        if (!"USER".equals(role)) {
            throw new AccessDeniedException(
                    "Only USER can create, edit or delete tickets"
            );
        }
    }

    // VALIDATE STATUS
    private void validateStatus(String status) {

        if (status == null ||
                !ALLOWED_STATUSES.contains(status.trim().toUpperCase())) {

            throw new IllegalArgumentException(
                    "Invalid status. Allowed: OPEN, IN_PROGRESS, RESOLVED, CLOSED"
            );
        }
    }

    // VALIDATE PRIORITY
    private void validatePriority(String priority) {

        if (priority == null ||
                !ALLOWED_PRIORITIES.contains(priority.trim().toUpperCase())) {

            throw new IllegalArgumentException(
                    "Invalid priority. Allowed: LOW, MEDIUM, HIGH"
            );
        }
    }

    // CREATE TICKET - USER ONLY
    public Ticket createTicket(
            Ticket ticket,
            String email,
            String role) {

        checkUserRole(role);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ticket.setId(null);
        ticket.setUser(user);

        // Every new ticket starts as OPEN
        ticket.setStatus("OPEN");

        // Default priority
        if (ticket.getPriority() == null ||
                ticket.getPriority().isBlank()) {

            ticket.setPriority("MEDIUM");

        } else {

            validatePriority(ticket.getPriority());
            ticket.setPriority(ticket.getPriority().trim().toUpperCase());
        }

        return ticketRepository.save(ticket);
    }

    // GET ALL TICKETS
    public List<Ticket> getAllTickets(String email, String role) {

        // SUPPORT and ADMIN can view all tickets
        if ("ADMIN".equals(role) || "SUPPORT".equals(role)) {
            return ticketRepository.findAll();
        }

        // USER can view only their own tickets
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ticketRepository.findByUserId(user.getId());
    }

    // GET TICKET BY ID
    public Ticket getTicketById(Long id, String email, String role) {

        // SUPPORT and ADMIN can view any ticket
        if ("ADMIN".equals(role) || "SUPPORT".equals(role)) {

            return ticketRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Ticket not found"));
        }

        // USER can view only their own ticket
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ticketRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    // USER EDITS OWN OPEN TICKET
    public Ticket updateTicket(
            Long id,
            Ticket updatedTicket,
            String email,
            String role) {

        checkUserRole(role);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket existingTicket = ticketRepository
                .findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!"OPEN".equals(existingTicket.getStatus())) {

            throw new AccessDeniedException(
                    "Only OPEN tickets can be edited"
            );
        }

        existingTicket.setTitle(updatedTicket.getTitle());
        existingTicket.setDescription(updatedTicket.getDescription());

        return ticketRepository.save(existingTicket);
    }

    // SUPPORT AND ADMIN UPDATE STATUS AND PRIORITY
    public Ticket updateTicketBySupport(
            Long id,
            String status,
            String priority,
            String role) {

        if (!"ADMIN".equals(role) && !"SUPPORT".equals(role)) {

            throw new AccessDeniedException(
                    "Only SUPPORT or ADMIN can update ticket status and priority"
            );
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (status != null) {

            validateStatus(status);
            ticket.setStatus(status.trim().toUpperCase());
        }

        if (priority != null) {

            validatePriority(priority);
            ticket.setPriority(priority.trim().toUpperCase());
        }

        return ticketRepository.save(ticket);
    }

    // DELETE TICKET - USER CAN DELETE OWN OPEN TICKET ONLY
    public void deleteTicket(
            Long id,
            String email,
            String role) {

        checkUserRole(role);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = ticketRepository
                .findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!"OPEN".equals(ticket.getStatus())) {

            throw new AccessDeniedException(
                    "Only OPEN tickets can be deleted"
            );
        }

        ticketRepository.delete(ticket);
    }
}
