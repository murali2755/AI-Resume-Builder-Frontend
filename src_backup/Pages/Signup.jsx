import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle
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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (name.trim() === "") {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (email.trim() === "") {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password === "") {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (confirmPassword !== password) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await authAPI.register({
        name: name.trim(),
        email: email.trim(),
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
    <div className="signup-page-wrapper">
      <Navbar />

      <main className="signup-main">
        <div className="signup-card-container">
          {/* Left Column: Branding / Benefits */}
          <div className="signup-perks-column">
            <div className="signup-perks-content">
              <div className="signup-badge">
                <Sparkles size={13} />
                <span>Join Top Candidates</span>
              </div>

              <h1 className="signup-perks-title">
                Create your account and <span className="highlight-gradient">stand out</span> to employers.
              </h1>

              <p className="signup-perks-subtitle">
                Build ATS-optimized resumes with step-by-step guidance, real-time suggestions, and instant PDF download.
              </p>

              <div className="signup-perks-cards">
                <div className="perk-mini-card">
                  <div className="perk-icon-wrap">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4>ATS Algorithm Compliant</h4>
                    <p>Built according to hiring software guidelines.</p>
                  </div>
                </div>

                <div className="perk-mini-card">
                  <div className="perk-icon-wrap">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4>Smart Content Optimization</h4>
                    <p>Elevate summaries and bullet points with AI assistance.</p>
                  </div>
                </div>

                <div className="perk-mini-card">
                  <div className="perk-icon-wrap">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4>Free Instant PDF Export</h4>
                    <p>Always print-ready with zero watermarks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Registration Form */}
          <div className="signup-form-column">
            <div className="signup-form-wrapper">
              <div className="signup-header">
                <h2>Create Account</h2>
                <p>Enter your details to create your free account</p>
              </div>

              {errorMessage && (
                <div className="auth-error-alert" role="alert">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="auth-error-alert" style={{ background: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.3)", color: "#10b981" }} role="status">
                  <CheckCircle2 size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

              <form className="signup-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-name">
                    Full Name
                  </label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon" />
                    <input
                      id="signup-name"
                      type="text"
                      className="form-input icon-padded"
                      placeholder="e.g. Murali Krishna"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-email">
                    Email
                  </label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input
                      id="signup-email"
                      type="email"
                      className="form-input icon-padded"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      required
                    />
                  </div>
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
                      className="form-input icon-padded"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
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

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-confirm-password">
                    Confirm Password
                  </label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon" />
                    <input
                      id="signup-confirm-password"
                      type={showPassword ? "text" : "password"}
                      className="form-input icon-padded"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Password Requirements Guidance */}
                <div className="password-hints">
                  <div className={`hint-item ${password.length >= 6 ? "hint-valid" : ""}`}>
                    <CheckCircle2 size={13} />
                    <span>Minimum 6 characters</span>
                  </div>
                  <div className={`hint-item ${password && confirmPassword && password === confirmPassword ? "hint-valid" : ""}`}>
                    <CheckCircle2 size={13} />
                    <span>Passwords match</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-signup-submit"
                  disabled={isLoading}
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
                    Login
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

export default Signup;