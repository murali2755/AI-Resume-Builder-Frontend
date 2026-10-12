import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Sparkles,
  Menu,
  X,
  LayoutDashboard,
  FolderOpen,
  User,
  LogOut,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../Styles/Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const isAuth = isAuthenticated;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`site-navbar ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* LEFT: Logo + AI Resume Builder */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo-link" aria-label="AI Resume Builder Home">
            <div className="navbar-logo-badge">
              <FileText size={18} className="logo-doc-icon" />
              <Sparkles size={11} className="logo-sparkle-icon" />
            </div>
            <span className="navbar-brand-text">AI Resume Builder</span>
          </Link>
        </div>

        {/* CENTER: Home, Features, Dashboard */}
        <nav className="navbar-center" aria-label="Main Navigation">
          <ul className="nav-center-menu">
            <li>
              <Link
                to="/"
                className={`nav-center-link ${isActive("/") && location.pathname === "/" ? "active" : ""}`}
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href={location.pathname === "/" ? "#features" : "/#features"}
                className="nav-center-link"
              >
                Features
              </a>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={`nav-center-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        {/* RIGHT: Authenticated vs Unauthenticated */}
        <div className="navbar-right">
          {isAuth ? (
            <div className="auth-nav-cluster">
              <Link
                to="/resume"
                className="btn btn-sm btn-primary resume-builder-cta"
              >
                <Sparkles size={14} />
                <span>Resume Builder</span>
              </Link>
              <Link
                to="/my-resumes"
                className={`nav-right-link ${isActive("/my-resumes") ? "active" : ""}`}
              >
                My Resumes
              </Link>
              <Link
                to="/profile"
                className={`nav-right-link ${isActive("/profile") ? "active" : ""}`}
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="nav-logout-btn"
                title="Log out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="guest-nav-cluster">
              <Link
                to="/login"
                className={`nav-login-link ${isActive("/login") ? "active" : ""}`}
              >
                Login
              </Link>
              <Link to="/signup" className="btn btn-sm btn-primary">
                <span>Sign Up</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="navbar-mobile-drawer">
          <ul className="mobile-drawer-links">
            <li>
              <Link
                to="/"
                className={`mobile-link ${isActive("/") && location.pathname === "/" ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href={location.pathname === "/" ? "#features" : "/#features"}
                className="mobile-link"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={`mobile-link ${isActive("/dashboard") ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/resume"
                className={`mobile-link ${isActive("/resume") ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <Sparkles size={17} />
                <span>Resume Builder</span>
              </Link>
            </li>
            {isAuth && (
              <>
                <li>
                  <Link
                    to="/my-resumes"
                    className={`mobile-link ${isActive("/my-resumes") ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FolderOpen size={17} />
                    <span>My Resumes</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className={`mobile-link ${isActive("/profile") ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={17} />
                    <span>Profile</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="mobile-drawer-actions">
            {isAuth ? (
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary mobile-logout-btn"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="mobile-auth-buttons">
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;