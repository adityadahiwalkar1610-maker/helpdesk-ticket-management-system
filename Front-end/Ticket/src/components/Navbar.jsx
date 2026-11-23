import React from "react";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="brand">
                <div className="brand-logo">H</div>
                <div>
                    <h2>HelpDesk</h2>
                    <small>Support Management</small>
                </div>
            </div>

            <div className="nav-user">
                <div className="avatar">A</div>
                <span>Admin</span>
            </div>
        </nav>
    );
}

export default Navbar;