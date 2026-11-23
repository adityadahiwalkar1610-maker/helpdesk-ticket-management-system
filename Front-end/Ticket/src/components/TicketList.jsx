
import React, { useEffect, useState } from "react";
import {
    updateTicket,
    updateTicketStatus
} from "../services/ticketService";
import "./TicketList.css";

function TicketList({ tickets, onDelete, deletingId }) {
    const [localTickets, setLocalTickets] = useState(tickets || []);

    const [statusUpdatingId, setStatusUpdatingId] = useState(null);
    const [statusError, setStatusError] = useState("");
    const [statusSuccess, setStatusSuccess] = useState("");

    const [editingTicketId, setEditingTicketId] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        description: ""
    });

    const [savingEdit, setSavingEdit] = useState(false);

    const role = localStorage.getItem("userRole")?.toUpperCase();
    const isStaff = role === "SUPPORT" || role === "ADMIN";

    // Regular users receive only their own tickets from the backend.
    const canManageTickets = role === "USER";

    useEffect(() => {
        setLocalTickets(tickets || []);
    }, [tickets]);

    const handleStaffUpdate = async (ticketId, newStatus, newPriority) => {
        setStatusError("");
        setStatusSuccess("");
        setStatusUpdatingId(ticketId);

        try {
            const response = await updateTicketStatus(
                ticketId,
                newStatus,
                newPriority
            );

            setLocalTickets((previousTickets) =>
                previousTickets.map((ticket) =>
                    ticket.id === ticketId ? response.data : ticket
                )
            );

            setStatusSuccess(`Ticket #${ticketId} updated successfully.`);
        } catch (error) {
            console.error("Ticket update error:", error);

            const message = error.response?.data?.message;

            setStatusError(
                typeof message === "string"
                    ? message
                    : "Unable to update ticket. Please try again."
            );
        } finally {
            setStatusUpdatingId(null);
        }
    };

    // Open the edit form
    const handleEditClick = (ticket) => {
        setStatusError("");
        setStatusSuccess("");

        setEditingTicketId(ticket.id);

        setEditForm({
            title: ticket.title || "",
            description: ticket.description || ""
        });
    };

    // Update edit form fields
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Cancel editing
    const handleEditCancel = () => {
        setEditingTicketId(null);

        setEditForm({
            title: "",
            description: ""
        });
    };

    // Save edited ticket
    const handleEditSave = async (e, ticketId) => {
        e.preventDefault();

        if (!editForm.title.trim() || !editForm.description.trim()) {
            setStatusError("Ticket title and description cannot be empty.");
            return;
        }

        setSavingEdit(true);
        setStatusError("");
        setStatusSuccess("");

        try {
            const updatedTicket = {
                title: editForm.title.trim(),
                description: editForm.description.trim()
            };

            const response = await updateTicket(ticketId, updatedTicket);

            setLocalTickets((previousTickets) =>
                previousTickets.map((ticket) =>
                    ticket.id === ticketId
                        ? { ...ticket, ...response.data }
                        : ticket
                )
            );

            setEditingTicketId(null);

            setStatusSuccess(`Ticket #${ticketId} updated successfully.`);
        } catch (error) {
            console.error("Edit ticket error:", error);

            const message = error.response?.data?.message;

            setStatusError(
                typeof message === "string"
                    ? message
                    : "Unable to edit ticket. Please try again."
            );
        } finally {
            setSavingEdit(false);
        }
    };

    if (localTickets.length === 0) {
        return (
            <div className="ticket-empty-state">
                <div className="ticket-empty-icon">▤</div>
                <h3>No tickets found</h3>
                <p>
                    There are no tickets to display.
                    Try another search or create a new ticket.
                </p>
            </div>
        );
    }

    return (
        <div className="table-card">

            {statusError && (
                <div className="ticket-status-message ticket-error-message" role="alert">
                    {statusError}
                </div>
            )}

            {statusSuccess && (
                <div className="ticket-status-message ticket-success-message">
                    {statusSuccess}
                </div>
            )}

            <div className="ticket-table-heading">
                <div>
                    <h3>All Tickets</h3>
                    <p>Manage and track your support requests.</p>
                </div>

                <span className="ticket-count">
                    {localTickets.length}{" "}
                    {localTickets.length === 1 ? "Ticket" : "Tickets"}
                </span>
            </div>

            <div className="table-wrapper">
                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Ticket Details</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {localTickets.map((ticket) => {
                            const priority = (
                                ticket.priority || "MEDIUM"
                            ).toLowerCase();

                            const status = (
                                ticket.status || "OPEN"
                            ).toLowerCase();

                            const isOpen = status === "open";
                            const isEditing = editingTicketId === ticket.id;

                            return (
                                <React.Fragment key={ticket.id}>
                                    <tr>
                                        <td>
                                            <span className="ticket-id">
                                                #{ticket.id}
                                            </span>
                                        </td>

                                        <td className="ticket-details-cell">
                                            <strong>
                                                {ticket.title || "Untitled ticket"}
                                            </strong>

                                            <p className="ticket-description">
                                                {ticket.description || "No description provided."}
                                            </p>
                                        </td>

                                        <td>
                                            {isStaff ? (
                                                <select
                                                    className={`ticket-select priority-select priority-${priority}`}
                                                    value={ticket.priority || "MEDIUM"}
                                                    disabled={statusUpdatingId === ticket.id}
                                                    onChange={(event) =>
                                                        handleStaffUpdate(
                                                            ticket.id,
                                                            ticket.status,
                                                            event.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="LOW">Low</option>
                                                    <option value="MEDIUM">Medium</option>
                                                    <option value="HIGH">High</option>
                                                </select>
                                            ) : (
                                                <span className={`ticket-badge priority-${priority}`}>
                                                    {ticket.priority || "MEDIUM"}
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            {isStaff ? (
                                                <select
                                                    className={`ticket-select status-select status-${status}`}
                                                    value={ticket.status || "OPEN"}
                                                    disabled={statusUpdatingId === ticket.id}
                                                    onChange={(event) =>
                                                        handleStaffUpdate(
                                                            ticket.id,
                                                            event.target.value,
                                                            ticket.priority || "MEDIUM"
                                                        )
                                                    }
                                                >
                                                    <option value="OPEN">Open</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="RESOLVED">Resolved</option>
                                                    <option value="CLOSED">Closed</option>
                                                </select>
                                            ) : (
                                                <span className={`ticket-badge status-${status}`}>
                                                    {(ticket.status || "OPEN").replace("_", " ")}
                                                </span>
                                            )}

                                            {statusUpdatingId === ticket.id && (
                                                <small className="ticket-updating">
                                                    Updating...
                                                </small>
                                            )}
                                        </td>

                                        <td>
                                            {canManageTickets && isOpen ? (
                                                <div className="ticket-action-buttons">
                                                    <button
                                                        className="ticket-edit-button"
                                                        onClick={() => handleEditClick(ticket)}
                                                        disabled={isEditing || savingEdit}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="ticket-delete-button"
                                                        onClick={() => onDelete(ticket.id)}
                                                        disabled={deletingId === ticket.id}
                                                    >
                                                        {deletingId === ticket.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="ticket-no-action">—</span>
                                            )}
                                        </td>
                                    </tr>

                                    {isEditing && (
                                        <tr className="ticket-edit-row">
                                            <td colSpan="5">
                                                <form
                                                    className="ticket-edit-form"
                                                    onSubmit={(e) =>
                                                        handleEditSave(e, ticket.id)
                                                    }
                                                >
                                                    <div className="ticket-edit-heading">
                                                        <h4>Edit Ticket #{ticket.id}</h4>
                                                        <p>
                                                            Update your ticket title and description.
                                                        </p>
                                                    </div>

                                                    <div className="ticket-edit-field">
                                                        <label htmlFor={`edit-title-${ticket.id}`}>
                                                            Ticket Title
                                                        </label>

                                                        <input
                                                            id={`edit-title-${ticket.id}`}
                                                            type="text"
                                                            name="title"
                                                            value={editForm.title}
                                                            onChange={handleEditChange}
                                                            maxLength={150}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="ticket-edit-field">
                                                        <label htmlFor={`edit-description-${ticket.id}`}>
                                                            Description
                                                        </label>

                                                        <textarea
                                                            id={`edit-description-${ticket.id}`}
                                                            name="description"
                                                            value={editForm.description}
                                                            onChange={handleEditChange}
                                                            rows="4"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="ticket-edit-actions">
                                                        <button
                                                            type="button"
                                                            className="ticket-cancel-button"
                                                            onClick={handleEditCancel}
                                                            disabled={savingEdit}
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            type="submit"
                                                            className="ticket-save-button"
                                                            disabled={savingEdit}
                                                        >
                                                            {savingEdit
                                                                ? "Saving..."
                                                                : "Save Changes"}
                                                        </button>
                                                    </div>
                                                </form>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TicketList;
