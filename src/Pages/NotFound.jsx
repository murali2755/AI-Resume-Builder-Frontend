import { Link } from "react-router-dom";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Styles/NotFound.css";

function NotFound() {
  return (
    <div className="notfound-page-wrapper fade-in">
      <Navbar />

      <main id="main-content" className="notfound-main">
        <div className="notfound-card">
          <span className="notfound-kicker">404 Error</span>

          <h1 className="notfound-title">Page not found</h1>

          <p className="notfound-desc">
            The page you requested doesn't exist, may have moved, or the link might be broken.
          </p>

          <div className="notfound-actions">
            <Link to="/" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              <LayoutDashboard size={14} />
              <span>Go to Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;