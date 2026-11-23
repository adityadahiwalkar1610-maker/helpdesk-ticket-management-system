
import api from "../Api/axiosConfig";

// Get all tickets
export const getAllTickets = () => {
    return api.get("/api/tickets");
};

// Create a new ticket
export const createTicket = (ticket) => {
    return api.post("/api/tickets", ticket);
};

// Get ticket by ID
export const getTicketById = (id) => {
    return api.get(`/api/tickets/${id}`);
};

// Update ticket details
export const updateTicket = (id, ticket) => {
    return api.put(`/api/tickets/${id}`, ticket);
};

// SUPPORT / ADMIN: Update ticket status and priority
export const updateTicketStatus = (id, status, priority) => {
    return api.patch(`/api/tickets/${id}/staff`, {
        status: status,
        priority: priority
    });
};

// Delete a ticket
export const deleteTicket = (id) => {
    return api.delete(`/api/tickets/${id}`);
};
