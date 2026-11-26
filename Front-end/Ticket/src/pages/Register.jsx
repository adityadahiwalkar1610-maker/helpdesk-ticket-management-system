
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../Api/axiosConfig";
import "../styles/Auth.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Name should accept only letters and spaces.
        if (name === "name") {
            const namePattern = /^[A-Za-z ]*$/;

            if (!namePattern.test(value)) {
                return;
            }
        }

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        // Name validation
        if (!name) {
            setError("Please enter your name.");
            return;
        }

        if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name)) {
            setError("Name should contain only letters and spaces.");
            return;
        }

        // Email validation
        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        // Password validation
        if (!password) {
            setError("Please enter your password.");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/api/users/register", {
                name,
                email,
                password
            });

            // Save new user login history
            localStorage.setItem("lastLoginEmail", email);
            localStorage.setItem(`hasLoggedIn_${email}`, "false");

            await Swal.fire({
                icon: "success",
                title: "Registration Successful!",
                text: "Your account has been created successfully. Please login.",
                confirmButtonText: "Go to Login",
                confirmButtonColor: "#3085d6"
            });

            navigate("/login");

        } catch (err) {
            console.error("Registration error:", err);

            let errorMessage = "Registration failed. Please try again.";

            if (err.response?.status === 409) {
                errorMessage = "This email is already registered. Please login.";
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            await Swal.fire({
                icon: "error",
                title: "Registration Failed!",
                text: errorMessage,
                confirmButtonText: "OK",
                confirmButtonColor: "#d33"
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <div className="auth-logo">
                    <div className="logo-icon">H</div>
                    <span>HelpDesk</span>
                </div>

                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Register to access your helpdesk dashboard.
                </p>

                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label>Full Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                minLength={8}
                                required
                                style={{ paddingRight: "65px" }}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    color: "#555",
                                    fontSize: "13px",
                                    padding: "5px"
                                }}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>

            </div>
        </div>
    );
}

export default Register;
