import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import "../Styles/Footer.css";

function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <div className="footer-container">
        <div className="footer-left">
          <Link to="/" className="footer-brand" aria-label="ResumeBuilder Home">
            <FileText size={16} strokeWidth={1.5} className="footer-brand-icon" />
            <span className="footer-brand-title">ResumeBuilder</span>
          </Link>
          <span className="footer-divider">•</span>
          <span className="footer-note">Clean, ATS-compliant documents for modern careers</span>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/" className="footer-link">Home</Link>
          <a href="/#templates" className="footer-link">Templates</a>
          <a href="/#workflow" className="footer-link">Workflow</a>
          <a href="/#faq" className="footer-link">FAQ</a>
          <Link to="/dashboard" className="footer-link">Dashboard</Link>
          <Link to="/resume" className="footer-link">Builder</Link>
          <Link to="/profile" className="footer-link">Profile</Link>
        </nav>

        <div className="footer-bottom-copy">
          <span>© {new Date().getFullYear()} ResumeBuilder. Plain text ATS formatting. Zero filler.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;