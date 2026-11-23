import "./TicketForm.css";
import React, { useState } from "react";

function TicketForm({ onAdd, submitting = false }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "MEDIUM"
    });

    const [validationError, setValidationError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setValidationError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim() || !form.description.trim()) {
            setValidationError("Please enter both the ticket title and description.");
            return;
        }

        try {
            await onAdd({
                title: form.title.trim(),
                description: form.description.trim(),
                priority: form.priority
            });

            setForm({
                title: "",
                description: "",
                priority: "MEDIUM"
            });

            setValidationError("");
        } catch (error) {
            console.error("Create ticket error:", error);
        }
    };

    return (
        <div className="form-card">
            <div className="section-title">
                <div>
                    <h3>Create New Ticket</h3>
                    <p>Provide the details below so your support team can help you.</p>
                </div>
            </div>

            {validationError && (
                <div className="ticket-form-error" role="alert">
                    {validationError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-grid">

                    <div className="field full-width">
                        <label htmlFor="ticket-title">Ticket Title</label>

                        <input
                            id="ticket-title"
                            type="text"
                            name="title"
                            placeholder="Example: Unable to access my account"
                            value={form.title}
                            onChange={handleChange}
                            maxLength={150}
                            required
                        />
                    </div>

                    <div className="field full-width">
                        <label htmlFor="ticket-description">Description</label>

                        <textarea
                            id="ticket-description"
                            name="description"
                            placeholder="Explain your issue in detail..."
                            value={form.description}
                            onChange={handleChange}
                            rows={6}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="ticket-priority">Priority</label>

                        <select
                            id="ticket-priority"
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                </div>

                <div className="ticket-form-actions">
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Creating..." : "＋ Create Ticket"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TicketForm;
