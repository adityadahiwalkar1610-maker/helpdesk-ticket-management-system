
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../Api/axiosConfig";
import "../styles/Auth.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [forgotEmail, setForgotEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [forgotMode, setForgotMode] = useState(false);
    const [resetMode, setResetMode] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Welcome / Welcome Back
    const emailKey = formData.email.trim().toLowerCase();
    const previousEmail = localStorage.getItem("lastLoginEmail") || "";

    const isCompleteEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailKey);

    const currentEmail = isCompleteEmail ? emailKey : previousEmail;

    const isReturningUser = currentEmail
        ? localStorage.getItem(`hasLoggedIn_${currentEmail}`) === "true"
        : false;

    const welcomeHeading = isReturningUser
        ? "Welcome Back!"
        : "Welcome!";

    // Backend error messages
    const getErrorMessage = (err, fallback) => {
        const data = err.response?.data;

        if (typeof data === "string") {
            return data;
        }

        if (data?.message) {
            return data.message;
        }

        return fallback;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError("");
    };

    // LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post("/api/users/login", {
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            const user = response.data;

            console.log("Login response:", user);

            // Check whether backend returned JWT token
            if (!user || !user.token) {
                console.error("JWT token missing:", user);

                setError(
                    "Login response does not contain an authentication token. Check LoginResponse.java."
                );
                return;
            }

            const loggedInEmail = (
                user.email || formData.email
            ).trim().toLowerCase();

            const role = (user.role || "USER").replace(/^ROLE_/, "");

            // Store authentication information
            localStorage.setItem("token", user.token);
            localStorage.setItem("userId", user.id ?? "");
            localStorage.setItem(
                "userName",
                user.name || loggedInEmail.split("@")[0]
            );
            localStorage.setItem("userEmail", loggedInEmail);
            localStorage.setItem("userRole", role);
            localStorage.setItem(
                "welcomeMessage",
                user.welcomeMessage || "Welcome back"
            );

            // Remember login greeting
            localStorage.setItem("lastLoginEmail", loggedInEmail);
            localStorage.setItem(
                `hasLoggedIn_${loggedInEmail}`,
                "true"
            );

            console.log("Token saved successfully.");
            console.log("Redirecting to dashboard...");

            // Navigate after saving token
            navigate("/dashboard", { replace: true });

        } catch (err) {
            console.error("Login error:", err);

            setError(
                getErrorMessage(err, "Invalid email or password.")
            );

        } finally {
            setLoading(false);
        }
    };

    // FORGOT PASSWORD
    const handleForgotPassword = () => {
        setForgotMode(true);
        setResetMode(false);

        setForgotEmail(formData.email);
        setNewPassword("");
        setConfirmPassword("");

        setError("");
        setSuccess("");
    };

    // VERIFY EMAIL
    const handleCheckEmail = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!forgotEmail.trim()) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/api/users/check-email",
                {
                    email: forgotEmail.trim().toLowerCase()
                }
            );

            console.log("Email verification:", response.data);

            if (response.data.exists === true) {
                setResetMode(true);

                setSuccess(
                    "Email verified successfully. Enter your new password."
                );
            } else {
                setError("This email is not registered.");
            }

        } catch (err) {
            console.error("Email verification error:", err);

            setError(
                getErrorMessage(
                    err,
                    "Unable to verify email. Check your backend connection."
                )
            );

        } finally {
            setLoading(false);
        }
    };

    // RESET PASSWORD
    const handleResetPassword = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (newPassword.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/api/users/reset-password",
                {
                    email: forgotEmail.trim().toLowerCase(),
                    newPassword: newPassword
                }
            );

            setSuccess(
                response.data.message ||
                "Password updated successfully!"
            );

            setFormData({
                email: forgotEmail.trim().toLowerCase(),
                password: ""
            });

            setForgotEmail("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                setForgotMode(false);
                setResetMode(false);
                setSuccess("");
            }, 1800);

        } catch (err) {
            console.error("Password reset error:", err);

            setError(
                getErrorMessage(
                    err,
                    "Unable to reset password. Please try again."
                )
            );

        } finally {
            setLoading(false);
        }
    };

    // BACK TO LOGIN
    const handleBackToLogin = () => {
        setForgotMode(false);
        setResetMode(false);

        setForgotEmail("");
        setNewPassword("");
        setConfirmPassword("");

        setError("");
        setSuccess("");
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h2 className="auth-logo">HelpDesk</h2>

                {/* LOGIN PAGE */}
                {!forgotMode && (
                    <>
                        <h1>{welcomeHeading}</h1>

                        <p className="auth-subtitle">
                            Login to your account
                        </p>

                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Email</label>

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

                                <div className="password-input">
                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="forgot-password-link">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {error && (
                                <p className="error-message">{error}</p>
                            )}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <p className="auth-footer">
                            Don't have an account?{" "}
                            <Link to="/register">Register</Link>
                        </p>
                    </>
                )}

                {/* VERIFY EMAIL PAGE */}
                {forgotMode && !resetMode && (
                    <>
                        <h1>Forgot Password?</h1>

                        <p className="auth-subtitle">
                            Enter your registered email address.
                        </p>

                        <form onSubmit={handleCheckEmail}>
                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={forgotEmail}
                                    onChange={(e) => {
                                        setForgotEmail(e.target.value);
                                        setError("");
                                        setSuccess("");
                                    }}
                                    required
                                />
                            </div>

                            {error && (
                                <p className="error-message">{error}</p>
                            )}

                            {success && (
                                <p className="success-message">{success}</p>
                            )}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading ? "Checking..." : "Verify Email"}
                            </button>
                        </form>

                        <p className="auth-footer">
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                            >
                                Back to Login
                            </button>
                        </p>
                    </>
                )}

                {/* RESET PASSWORD PAGE */}
                {forgotMode && resetMode && (
                    <>
                        <h1>Reset Password</h1>

                        <p className="auth-subtitle">
                            Enter your new password.
                        </p>

                        <form onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <label>New Password</label>

                                <input
                                    type={
                                        showResetPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setError("");
                                    }}
                                    minLength={8}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>

                                <input
                                    type={
                                        showResetPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError("");
                                    }}
                                    minLength={8}
                                    required
                                />
                            </div>

                            <div className="show-password-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={showResetPassword}
                                        onChange={(e) =>
                                            setShowResetPassword(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Show Password
                                </label>
                            </div>

                            {error && (
                                <p className="error-message">{error}</p>
                            )}

                            {success && (
                                <p className="success-message">{success}</p>
                            )}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Updating..."
                                    : "Update Password"}
                            </button>
                        </form>

                        <p className="auth-footer">
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                            >
                                Back to Login
                            </button>
                        </p>
                    </>
                )}

            </div>
        </div>
    );
}

export default Login;
