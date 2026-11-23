
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../Api/axiosConfig";
import "../styles/Auth.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/api/users/login", {
                email: formData.email.trim(),
                password: formData.password,
            });

            const user = response.data;

            if (!user.token || !user.role) {
                setError("Login response is incomplete. Please contact support.");
                return;
            }

            localStorage.setItem("token", user.token);
            localStorage.setItem("userId", user.id);
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("userRole", user.role);

            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                setError("Invalid email or password. Please check your credentials and try again.");
            } else if (!err.response) {
                setError("Unable to connect to the server. Please make sure the backend is running.");
            } else {
                const serverMessage = err.response?.data?.message;

                setError(
                    typeof serverMessage === "string" && serverMessage.trim()
                        ? serverMessage
                        : "Login failed. Please try again."
                );
            }
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

                <h1>Welcome back</h1>

                <p className="auth-subtitle">
                    Login to access your helpdesk dashboard.
                </p>

                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
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
                        {loading ? "Signing In..." : "Login"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
