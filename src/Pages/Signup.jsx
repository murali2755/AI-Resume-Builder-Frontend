import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Check
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authAPI, getErrorMessage } from "../api/api";
import "../Styles/Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
    if (errorMessage) setErrorMessage("");
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = {};
    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim();

    if (!nameTrimmed) {
      errors.name = "Please enter your full name.";
    }

    if (!emailTrimmed) {
      errors.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!password) {
      errors.password = "Please enter your password.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage(
        errors.name || errors.email || errors.password || errors.confirmPassword
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await authAPI.register({
        name: nameTrimmed,
        email: emailTrimmed,
        password,
      });

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const message = getErrorMessage(err, "Registration failed. Please try again.");
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="signup-page-wrapper fade-in">
      <Navbar />

      <main id="main-content" className="signup-main">
        <div className="signup-card-container">
          {/* Left Column: Form Left (per specification) */}
          <div className="signup-form-column">
            <div className="signup-form-wrapper">
              <div className="signup-header">
                <span className="signup-kicker">New Account</span>
                <h1 className="signup-title">Create your workspace</h1>
                <p className="signup-subtitle">
                  Build ATS-ready resumes in minutes with zero watermarks.
                </p>
              </div>

              {errorMessage && (
                <div className="auth-error-alert" role="alert">
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success" role="status">
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>{successMessage}</span>
                </div>
              )}

              <form className="signup-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-name">
                    Full name
                  </label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon" />
                    <input
                      id="signup-name"
                      type="text"
                      className={`form-input icon-padded ${fieldErrors.name ? "has-error" : ""}`}
                      placeholder="e.g. Murali Krishna"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearFieldError("name");
                      }}
                      autoComplete="name"
                      required
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="form-error-inline" role="alert">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-email">
                    Email address
                  </label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input
                      id="signup-email"
                      type="email"
                      className={`form-input icon-padded ${fieldErrors.email ? "has-error" : ""}`}
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError("email");
                      }}
                      autoComplete="email"
                      required
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="form-error-inline" role="alert">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-password">
                    Password
                  </label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon" />
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      className={`form-input icon-padded ${fieldErrors.password ? "has-error" : ""}`}
                      placeholder="Create a password (min. 6 characters)"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearFieldError("password");
                      }}
                      autoComplete="new-password"
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
                    <p className="form-error-inline" role="alert">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-confirm-password">
                    Confirm password
                  </label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon" />
                    <input
                      id="signup-confirm-password"
                      type={showPassword ? "text" : "password"}
                      className={`form-input icon-padded ${fieldErrors.confirmPassword ? "has-error" : ""}`}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearFieldError("confirmPassword");
                      }}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="form-error-inline" role="alert">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-signup-submit"
                  disabled={isLoading}
                  id="signup-submit-btn"
                >
                  {isLoading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="signup-footer-prompt">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="signup-link-bold">
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Quiet Value List (per specification) */}
          <div className="signup-quiet-column">
            <div className="signup-quiet-inner">
              <span className="signup-quiet-kicker">Standard Compliance</span>
              <h2 className="signup-quiet-title">
                Documents engineered to pass applicant tracking systems.
              </h2>

              <div className="signup-value-stack">
                <div className="signup-value-card">
                  <div className="value-bullet-icon">
                    <Check size={14} />
                  </div>
                  <div>
                    <h3 className="value-card-heading">ATS Standard Compliance</h3>
                    <p className="value-card-body">
                      Linear formatting engineered according to modern enterprise HR software guidelines.
                    </p>
                  </div>
                </div>

                <div className="signup-value-card">
                  <div className="value-bullet-icon">
                    <Check size={14} />
                  </div>
                  <div>
                    <h3 className="value-card-heading">Direct Vector PDF Export</h3>
                    <p className="value-card-body">
                      One-click vector text output with no watermarks or required payment credentials.
                    </p>
                  </div>
                </div>

                <div className="signup-value-card">
                  <div className="value-bullet-icon">
                    <Check size={14} />
                  </div>
                  <div>
                    <h3 className="value-card-heading">Permanent Local Drafts</h3>
                    <p className="value-card-body">
                      Your resume sections and custom templates stay safely stored in your workspace.
                    </p>
                  </div>
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

export default Signup;