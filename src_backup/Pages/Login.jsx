import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  FileCheck,
  Bot
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { authAPI, getErrorMessage } from "../api/api";
import "../Styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    if (errorMessage) setErrorMessage("");
    if (infoMessage) setInfoMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loginData.email.trim() === "") {
      setErrorMessage("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (loginData.password.trim() === "") {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await authAPI.login({
        email: loginData.email.trim(),
        password: loginData.password,
      });

      if (response && response.token && response.user) {
        login(response.token, response.user);
        navigate("/dashboard");
      } else {
        setErrorMessage("Unexpected authentication response from server.");
      }
    } catch (err) {
      const message = getErrorMessage(err, "Login failed. Please check your credentials.");
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setInfoMessage("Self-service password reset is disabled on this local instance. Please sign in with your known credentials or create a new account.");
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />

      <main className="auth-main">
        <div className="auth-card-container">
          {/* Left Column: Branding / AI resume illustration */}
          <div className="auth-brand-column">
            <div className="auth-brand-content">
              <div className="auth-brand-pill">
                <Sparkles size={13} />
                <span>AI Career Intelligence</span>
              </div>

              <h1 className="auth-brand-title">
                Welcome back to your <span className="highlight-text">smart career</span> workspace.
              </h1>

              <p className="auth-brand-desc">
                Sign in to manage and polish your ATS-optimized resumes, track suggestions, and download print-ready PDFs.
              </p>

              <div className="auth-features-list">
                <div className="auth-feature-item">
                  <CheckCircle2 size={16} className="feat-check" />
                  <span>Real-time ATS keyword matching</span>
                </div>
                <div className="auth-feature-item">
                  <CheckCircle2 size={16} className="feat-check" />
                  <span>One-click AI summary & bullet enhancement</span>
                </div>
                <div className="auth-feature-item">
                  <CheckCircle2 size={16} className="feat-check" />
                  <span>Export high-resolution A4 PDFs instantly</span>
                </div>
              </div>

              {/* Minimalist UI Illustration card */}
              <div className="auth-mini-preview-card">
                <div className="mini-card-head">
                  <Bot size={16} className="mini-bot-icon" />
                  <span>AI Resume Assistant Active</span>
                </div>
                <p className="mini-card-text">
                  "Your resume currently matches 98% of target job keywords in the software engineering track."
                </p>
                <div className="mini-card-stat">
                  <FileCheck size={14} />
                  <span>ATS Standard Layout • High Pass Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Login Form */}
          <div className="auth-form-column">
            <div className="auth-form-wrapper">
              <div className="auth-header">
                <h2>Login</h2>
                <p>Enter your credentials to access your account</p>
              </div>

              {errorMessage && (
                <div className="auth-error-alert" role="alert">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {infoMessage && (
                <div
                  className="auth-error-alert"
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "#2563eb",
                    border: "1px solid rgba(59, 130, 246, 0.25)",
                  }}
                  role="status"
                >
                  <AlertCircle size={16} />
                  <span>{infoMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label">
                    Email
                  </label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      className="form-input icon-padded"
                      placeholder="name@example.com"
                      value={loginData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <label htmlFor="login-password">Password</label>
                    <a
                      href="#forgot"
                      onClick={handleForgotPassword}
                      className="forgot-link"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-input icon-padded"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-auth-submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer-prompt">
                <p>
                  Don't have an account?{" "}
                  <Link to="/signup" className="auth-link-bold">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;