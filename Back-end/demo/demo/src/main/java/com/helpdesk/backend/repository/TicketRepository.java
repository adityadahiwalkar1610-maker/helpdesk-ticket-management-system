
package com.helpdesk.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.helpdesk.backend.entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Find tickets created by a particular user
    List<Ticket> findByUserId(Long userId);

    // Find a particular ticket belonging to a particular user
    Optional<Ticket> findByIdAndUserId(Long id, Long userId);
}
