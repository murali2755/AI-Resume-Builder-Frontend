import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Check
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { authAPI, getErrorMessage } from "../api/api";
import "../Styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errorMessage) setErrorMessage("");
    if (infoMessage) setInfoMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = {};
    const emailTrimmed = loginData.email.trim();

    if (!emailTrimmed) {
      errors.email = "Please enter your email.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!loginData.password.trim()) {
      errors.password = "Please enter your password.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage(errors.email || errors.password);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await authAPI.login({
        email: emailTrimmed,
        password: loginData.password,
      });

      if (response && response.token && response.user) {
        login(response.token, response.user);
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
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
    setInfoMessage(
      "Password resets on local environments are managed by system administrators. Please sign in with existing credentials or register a new profile."
    );
  };

  return (
    <div className="auth-page-wrapper fade-in">
      <Navbar />

      <main id="main-content" className="auth-main">
        <div className="auth-card-container">
          {/* Left Column: Form Left (per specification) */}
          <div className="auth-form-column">
            <div className="auth-form-wrapper">
              <div className="auth-header">
                <span className="auth-kicker">Account Access</span>
                <h1 className="auth-title">Log in to your workspace</h1>
                <p className="auth-subtitle">
                  Continue editing your resumes and managing your career drafts.
                </p>
              </div>

              {errorMessage && (
                <div className="auth-error-alert" role="alert">
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {infoMessage && (
                <div className="alert alert-info" role="status">
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{infoMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label">
                    Email address
                  </label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      className={`form-input icon-padded ${fieldErrors.email ? "has-error" : ""}`}
                      placeholder="name@example.com"
                      value={loginData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="form-error-inline" role="alert">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <label htmlFor="login-password">Password</label>
                    <a
                      href="#forgot"
                      onClick={handleForgotPassword}
                      className="forgot-link"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`form-input icon-padded ${fieldErrors.password ? "has-error" : ""}`}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
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
                  {fieldErrors.password && (
                    <p className="form-error-inline" role="alert">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-auth-submit"
                  disabled={isLoading}
                  id="login-submit-btn"
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer-prompt">
                <p>
                  Don't have an account yet?{" "}
                  <Link to="/signup" className="auth-link-bold">
                    Create free account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Quiet Editorial Value Panel (per specification) */}
          <div className="auth-quiet-column">
            <div className="quiet-panel-inner">
              <div className="quiet-brand-header">
                <span className="quiet-tag">ResumeBuilder Studio</span>
                <h2 className="quiet-heading">
                  Designed for candid, verified career progression.
                </h2>
              </div>

              {/* Realistic miniature resume sheet preview */}
              <div className="quiet-mini-sheet" aria-hidden="true">
                <div className="mini-sheet-head">
                  <div className="mini-sheet-name">Murali Krishna</div>
                  <div className="mini-sheet-contact">Bangalore, IN • murali@example.com</div>
                </div>
                <div className="mini-sheet-rule" />
                <div className="mini-sheet-section">
                  <span className="mini-section-title">SUMMARY</span>
                  <p className="mini-section-text">
                    Software engineer building responsive React interfaces and clean REST APIs with tested ATS parsing compliance.
                  </p>
                </div>
                <div className="mini-sheet-section">
                  <span className="mini-section-title">TECHNICAL SKILLS</span>
                  <p className="mini-section-text">
                    React, TypeScript, Node.js, Spring Boot, PostgreSQL, Git
                  </p>
                </div>
              </div>

              <div className="quiet-value-list">
                <div className="quiet-value-item">
                  <Check size={14} className="quiet-check-icon" />
                  <span>Strict single-column text flow prevents ATS parsing drops</span>
                </div>
                <div className="quiet-value-item">
                  <Check size={14} className="quiet-check-icon" />
                  <span>Real vector text export: searchable, copyable, print-ready</span>
                </div>
                <div className="quiet-value-item">
                  <Check size={14} className="quiet-check-icon" />
                  <span>Autosave protection preserves work continuously</span>
                </div>
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