import { Link } from "react-router-dom";
import { FileText, Sparkles } from "lucide-react";
import "../Styles/Footer.css";

function Footer() {
  return (
    <footer id="footer" className="compact-footer">
      <div className="footer-container">
        {/* Left: Brand info */}
        <div className="footer-left-brand">
          <Link to="/" className="footer-brand-link">
            <div className="footer-logo-box">
              <FileText size={16} />
              <Sparkles size={9} className="footer-sparkle" />
            </div>
            <span className="footer-brand-name">AI Resume Builder</span>
          </Link>
          <span className="footer-copy-text">© 2026 AI Resume Builder</span>
        </div>

        {/* Center / Right: Links */}
        <nav className="footer-nav-menu" aria-label="Footer Navigation">
          <Link to="/" className="footer-nav-link">Home</Link>
          <a href="/#features" className="footer-nav-link">Features</a>
          <Link to="/dashboard" className="footer-nav-link">Dashboard</Link>
          <Link to="/my-resumes" className="footer-nav-link">My Resumes</Link>
          <Link to="/profile" className="footer-nav-link">Profile</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;