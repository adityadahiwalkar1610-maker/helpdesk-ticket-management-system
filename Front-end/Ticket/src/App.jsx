
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";

import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";

import {
    getAllTickets,
    createTicket,
    deleteTicket
} from "./services/ticketService";

import "./App.css";

function Dashboard() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName") || "User";
    const userEmail = localStorage.getItem("userEmail") || "";
    const userRole = localStorage.getItem("userRole") || "USER";

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [activePage, setActivePage] = useState("overview");
    const [searchText, setSearchText] = useState("");

    const isStaff = userRole === "SUPPORT" || userRole === "ADMIN";

    // Fetch tickets from backend
    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllTickets();
            setTickets(response.data);

        } catch (err) {
            console.error(err);
            setError("Unable to load tickets. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Load tickets when dashboard opens
    useEffect(() => {
        if (token) {
            fetchTickets();
        }
    }, [token]);

    // Create ticket
    const handleAddTicket = async (ticketData) => {
        try {
            await createTicket(ticketData);
            alert("Ticket created successfully!");
            setActivePage("tickets");
            await fetchTickets();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create ticket.");
        }
    };

    // Delete ticket
    const handleDeleteTicket = async (id) => {
        try {
            setDeletingId(id);
            await deleteTicket(id);
            await fetchTickets();
            alert("Ticket deleted successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete ticket.");
        } finally {
            setDeletingId(null);
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");

        navigate("/login");
    };

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Ticket statistics
    const openCount = tickets.filter(t => t.status === "OPEN").length;
    const progressCount = tickets.filter(t => t.status === "IN_PROGRESS").length;
    const resolvedCount = tickets.filter(t => t.status === "RESOLVED").length;
    const closedCount = tickets.filter(t => t.status === "CLOSED").length;

    // Search tickets filter
    const filteredTickets = tickets.filter((ticket) => {
        const search = searchText.toLowerCase().trim();

        return (
            String(ticket.id || "").toLowerCase().includes(search) ||
            (ticket.title || "").toLowerCase().includes(search) ||
            (ticket.description || "").toLowerCase().includes(search) ||
            (ticket.status || "").toLowerCase().includes(search) ||
            (ticket.priority || "").toLowerCase().includes(search)
        );
    });

    const showPage = (page) => {
        setActivePage(page);
    };

    return (
        <div className="app-shell">

            {/* SIDEBAR */}
            <aside className="sidebar">

                <div className="sidebar-logo">
                    <div className="logo-symbol">H</div>
                    <div>
                        <h2>HelpDesk<span>.</span></h2>
                        <small>SUPPORT CENTER</small>
                    </div>
                </div>

                <div className="sidebar-section-label">WORKSPACE</div>

                <button
                    className={`sidebar-item ${activePage === "overview" ? "selected" : ""}`}
                    onClick={() => showPage("overview")}
                >
                    <span className="nav-icon">◫</span>
                    Overview
                </button>

                <button
                    className={`sidebar-item ${activePage === "tickets" ? "selected" : ""}`}
                    onClick={() => showPage("tickets")}
                >
                    <span className="nav-icon">▤</span>
                    All Tickets
                    <span className="nav-count">{tickets.length}</span>
                </button>

                <button
                    className={`sidebar-item ${activePage === "create" ? "selected" : ""}`}
                    onClick={() => showPage("create")}
                >
                    <span className="nav-icon">＋</span>
                    Create Ticket
                </button>

                <div className="sidebar-section-label management-label">
                    ACCOUNT
                </div>

                <div className="sidebar-item account-nav">
                    <span className="nav-icon">◎</span>
                    My Profile
                </div>

                <div className="sidebar-bottom">

                    <div className="sidebar-help">
                        <div className="help-icon">?</div>
                        <strong>Need help?</strong>
                        <p>Contact your support administrator.</p>
                    </div>

                    <div className="sidebar-profile">
                        <div className="profile-avatar">
                            {userName.charAt(0).toUpperCase()}
                        </div>

                        <div className="profile-details">
                            <strong>{userName}</strong>
                            <small>{userRole}</small>
                        </div>

                        <button
                            className="sidebar-logout"
                            title="Logout"
                            onClick={handleLogout}
                        >
                            ↗
                        </button>
                    </div>

                </div>

            </aside>

            {/* MAIN AREA */}
            <div className="main-area">

                {/* TOPBAR */}
                <header className="topbar">

                    <div className="breadcrumb">
                        Workspace <span>/</span>
                        <strong>
                            {activePage === "overview" ? "Overview" :
                             activePage === "tickets" ? "All Tickets" :
                             activePage === "create" ? "Create Ticket" : "Profile"}
                        </strong>
                    </div>

                    <div className="topbar-right">

                        {/* SEARCH BAR */}
                        <div className="top-search">
                            <span>⌕</span>
                            <input
                                type="text"
                                placeholder="Search by ID, title, description, status or priority..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />

                            {searchText && (
                                <button
                                    type="button"
                                    className="search-clear"
                                    onClick={() => setSearchText("")}
                                    title="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <div className="topbar-divider"></div>

                        {/* USER PROFILE */}
                        <div className="topbar-user">
                            <div className="topbar-avatar">
                                {userName.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <strong>{userName}</strong>
                                <small>{userRole}</small>
                            </div>
                        </div>

                        {/* LOGOUT BUTTON */}
                        <button
                            className="topbar-logout"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <span>↪</span> Logout
                        </button>

                    </div>

                </header>

                <main className="page-content">

                    {/* OVERVIEW */}
                    {activePage === "overview" && (
                        <>

                            <div className="page-heading">
                                <div>
                                    <div className="eyebrow">YOUR WORKSPACE</div>
                                    <h1>Dashboard Overview</h1>
                                    <p>Manage your support requests and track their progress.</p>
                                </div>

                                <button
                                    className="primary-button"
                                    onClick={() => showPage("create")}
                                >
                                    <span>＋</span> Create New Ticket
                                </button>
                            </div>

                            {/* WELCOME BANNER */}
                            <section className="welcome-banner">

                                <div className="welcome-content">

                                    <div className="welcome-tag">
                                        <span></span> HELP DESK PORTAL
                                    </div>

                                    <h2>
                                        Hello, {userName.split(" ")[0]}!
                                        <br />
                                        How can we help you today?
                                    </h2>

                                    <p>
                                        Submit a support request, track existing tickets,
                                        and stay updated on your issues.
                                    </p>

                                    <button
                                        className="banner-button"
                                        onClick={() => showPage("create")}
                                    >
                                        Submit a request <span>→</span>
                                    </button>

                                </div>

                                <div className="banner-art">

                                    <div className="art-circle">
                                        <div className="art-inner">
                                            <span>✓</span>
                                        </div>
                                    </div>

                                    <div className="art-card art-card-one">
                                        <span>●</span> Support active
                                    </div>

                                    <div className="art-card art-card-two">
                                        <span>✦</span> We're here to help
                                    </div>

                                </div>

                            </section>

                            {/* STATISTICS */}
                            <div className="section-title-row">

                                <div>
                                    <h2>Ticket Statistics</h2>
                                    <p>Overview of your ticket activity</p>
                                </div>

                                <span className="live-label">
                                    <span></span> LIVE DATA
                                </span>

                            </div>

                            <section className="stats-grid">

                                <div className="stat-card">
                                    <div className="stat-top">
                                        <div className="stat-icon purple">▤</div>
                                        <span className="stat-caption">ALL TIME</span>
                                    </div>
                                    <h3>{tickets.length}</h3>
                                    <p>Total Tickets</p>
                                    <div className="stat-bottom">
                                        <span className="stat-line purple-line"></span>
                                        <small>All submitted requests</small>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-top">
                                        <div className="stat-icon orange">◷</div>
                                        <span className="stat-caption">PENDING</span>
                                    </div>
                                    <h3>{openCount}</h3>
                                    <p>Open Tickets</p>
                                    <div className="stat-bottom">
                                        <span className="stat-line orange-line"></span>
                                        <small>Waiting for attention</small>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-top">
                                        <div className="stat-icon blue">↻</div>
                                        <span className="stat-caption">ACTIVE</span>
                                    </div>
                                    <h3>{progressCount}</h3>
                                    <p>In Progress</p>
                                    <div className="stat-bottom">
                                        <span className="stat-line blue-line"></span>
                                        <small>Currently being handled</small>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-top">
                                        <div className="stat-icon green">✓</div>
                                        <span className="stat-caption">COMPLETED</span>
                                    </div>
                                    <h3>{resolvedCount + closedCount}</h3>
                                    <p>Resolved Tickets</p>
                                    <div className="stat-bottom">
                                        <span className="stat-line green-line"></span>
                                        <small>Successfully completed</small>
                                    </div>
                                </div>

                            </section>

                            {/* LOWER DASHBOARD */}
                            <div className="dashboard-bottom-grid">

                                <section className="panel recent-panel">

                                    <div className="panel-heading">
                                        <div>
                                            <h2>Recent Tickets</h2>
                                            <p>Your latest support requests</p>
                                        </div>

                                        <button
                                            className="text-button"
                                            onClick={() => showPage("tickets")}
                                        >
                                            View all →
                                        </button>
                                    </div>

                                    {loading ? (
                                        <p className="empty-message">Loading tickets...</p>
                                    ) : error ? (
                                        <p className="error-message">{error}</p>
                                    ) : tickets.length === 0 ? (

                                        <div className="empty-state">
                                            <div>▤</div>
                                            <h3>No tickets yet</h3>
                                            <p>Your submitted tickets will appear here.</p>

                                            <button
                                                className="primary-button"
                                                onClick={() => showPage("create")}
                                            >
                                                Create your first ticket
                                            </button>
                                        </div>

                                    ) : (

                                        <div className="recent-list">

                                            {[...tickets].slice(-5).reverse().map(ticket => (
                                                <div className="recent-ticket" key={ticket.id}>

                                                    <div className="ticket-mini-icon">#</div>

                                                    <div className="recent-ticket-info">
                                                        <strong>
                                                            {ticket.title || `Ticket #${ticket.id}`}
                                                        </strong>
                                                        <small>Ticket #{ticket.id}</small>
                                                    </div>

                                                    <span className={`status-pill ${ticket.status?.toLowerCase()}`}>
                                                        {ticket.status?.replace("_", " ")}
                                                    </span>

                                                </div>
                                            ))}

                                        </div>

                                    )}

                                </section>

                                <section className="panel account-panel">

                                    <div className="panel-heading">
                                        <div>
                                            <h2>Account Details</h2>
                                            <p>Your profile information</p>
                                        </div>
                                    </div>

                                    <div className="account-avatar">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>

                                    <h3 className="account-name">{userName}</h3>
                                    <p className="account-email">{userEmail}</p>

                                    <div className="account-role">
                                        <span>Account role</span>
                                        <strong>{userRole}</strong>
                                    </div>

                                    <div className="account-role">
                                        <span>Access level</span>
                                        <strong>{isStaff ? "Staff access" : "User access"}</strong>
                                    </div>

                                </section>

                            </div>

                        </>
                    )}

                    {/* ALL TICKETS */}
                    {activePage === "tickets" && (

                        <section className="panel full-panel">

                            <div className="page-heading">
                                <div>
                                    <div className="eyebrow">TICKET MANAGEMENT</div>
                                    <h1>All Tickets</h1>
                                    <p>
                                        {isStaff
                                            ? "View and manage support requests."
                                            : "View and manage your support requests."}
                                    </p>
                                </div>

                                <button
                                    className="primary-button"
                                    onClick={() => showPage("create")}
                                >
                                    ＋ New Ticket
                                </button>
                            </div>

                            {loading ? (
                                <p>Loading tickets...</p>
                            ) : error ? (
                                <p className="error-message">{error}</p>
                            ) : (

                                <TicketList
                                    tickets={filteredTickets}
                                    onDelete={handleDeleteTicket}
                                    deletingId={deletingId}
                                />

                            )}

                        </section>

                    )}

                    {/* CREATE TICKET */}
                    {activePage === "create" && (

                        <section className="panel full-panel">

                            <div className="page-heading">
                                <div>
                                    <div className="eyebrow">SUPPORT REQUEST</div>
                                    <h1>Create a Ticket</h1>
                                    <p>Tell us about the issue you are experiencing.</p>
                                </div>
                            </div>

                            <div className="create-ticket-wrapper">
                                <TicketForm onAdd={handleAddTicket} />
                            </div>

                        </section>

                    )}

                </main>

                <footer className="dashboard-footer">
                    <span>© 2026 HelpDesk. All rights reserved.</span>
                    <span>Helpdesk Ticket Management System</span>
                </footer>

            </div>

        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
