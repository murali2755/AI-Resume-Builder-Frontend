import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Menu,
  X,
  LayoutDashboard,
  FolderOpen,
  User,
  LogOut,
  ChevronDown,
  Plus
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../Styles/Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const avatarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setAvatarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setAvatarOpen(false);
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className={`site-navbar ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Left: Serif Brand Wordmark + Main Nav */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo-link" aria-label="AI Resume Builder Home">
            <span className="navbar-brand-mark">
              <FileText size={18} strokeWidth={1.5} />
            </span>
            <span className="navbar-brand-text">ResumeBuilder</span>
          </Link>

          <nav className="navbar-nav-links" aria-label="Main Navigation">
            <Link
              to="/"
              className={`nav-link ${isActive("/") && location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
            <a
              href={location.pathname === "/" ? "#templates" : "/#templates"}
              className="nav-link"
            >
              Templates
            </a>
            <a
              href={location.pathname === "/" ? "#workflow" : "/#workflow"}
              className="nav-link"
            >
              How It Works
            </a>
            <a
              href={location.pathname === "/" ? "#faq" : "/#faq"}
              className="nav-link"
            >
              FAQ
            </a>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Authentication & Actions */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="auth-nav-cluster">
              <Link
                to="/resume"
                className="btn btn-sm btn-primary create-resume-nav-btn"
                id="nav-create-resume-btn"
              >
                <Plus size={14} strokeWidth={1.5} />
                <span>New Resume</span>
              </Link>

              {/* Avatar Dropdown */}
              <div className="avatar-dropdown-wrap" ref={avatarRef}>
                <button
                  type="button"
                  className="avatar-trigger-btn"
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  aria-expanded={avatarOpen}
                  aria-haspopup="true"
                  aria-label="User account menu"
                  id="user-menu-button"
                >
                  <span className="avatar-circle">{userInitial}</span>
                  <span className="avatar-user-name">{user?.name || "Account"}</span>
                  <ChevronDown size={14} strokeWidth={1.5} className="avatar-chevron" />
                </button>

                {avatarOpen && (
                  <div className="avatar-menu-popover" role="menu" aria-labelledby="user-menu-button">
                    <div className="avatar-menu-header">
                      <div className="user-header-name">{user?.name || "Candidate"}</div>
                      <div className="user-header-email">{user?.email || "candidate@example.com"}</div>
                    </div>

                    <div className="avatar-menu-divider" />

                    <Link
                      to="/dashboard"
                      className="avatar-menu-item"
                      role="menuitem"
                      onClick={() => setAvatarOpen(false)}
                    >
                      <LayoutDashboard size={15} strokeWidth={1.5} />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/my-resumes"
                      className="avatar-menu-item"
                      role="menuitem"
                      onClick={() => setAvatarOpen(false)}
                    >
                      <FolderOpen size={15} strokeWidth={1.5} />
                      <span>My Resumes</span>
                    </Link>

                    <Link
                      to="/profile"
                      className="avatar-menu-item"
                      role="menuitem"
                      onClick={() => setAvatarOpen(false)}
                    >
                      <User size={15} strokeWidth={1.5} />
                      <span>Profile & Settings</span>
                    </Link>

                    <div className="avatar-menu-divider" />

                    <button
                      type="button"
                      className="avatar-menu-item logout-action"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut size={15} strokeWidth={1.5} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="guest-nav-cluster">
              <Link
                to="/login"
                className={`nav-login-link ${isActive("/login") ? "active" : ""}`}
              >
                Log In
              </Link>
              <Link to="/signup" className="btn btn-sm btn-primary">
                <span>Sign Up</span>
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
            {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Sheet (not full-screen overlay) */}
      {isOpen && (
        <div className="navbar-mobile-sheet" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <ul className="mobile-sheet-menu">
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
                href={location.pathname === "/" ? "#templates" : "/#templates"}
                className="mobile-link"
                onClick={() => setIsOpen(false)}
              >
                Templates
              </a>
            </li>
            <li>
              <a
                href={location.pathname === "/" ? "#workflow" : "/#workflow"}
                className="mobile-link"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href={location.pathname === "/" ? "#faq" : "/#faq"}
                className="mobile-link"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </a>
            </li>

            {isAuthenticated ? (
              <>
                <li className="mobile-divider" />
                <li>
                  <Link
                    to="/dashboard"
                    className={`mobile-link ${isActive("/dashboard") ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard size={16} strokeWidth={1.5} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resume"
                    className={`mobile-link ${isActive("/resume") ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus size={16} strokeWidth={1.5} />
                    <span>New Resume</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-resumes"
                    className={`mobile-link ${isActive("/my-resumes") ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FolderOpen size={16} strokeWidth={1.5} />
                    <span>My Resumes</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className={`mobile-link ${isActive("/profile") ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={16} strokeWidth={1.5} />
                    <span>Profile Settings</span>
                  </Link>
                </li>
                <li className="mobile-divider" />
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mobile-link mobile-logout-action"
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span>Log Out</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="mobile-divider" />
                <li className="mobile-auth-actions">
                  <Link
                    to="/login"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;