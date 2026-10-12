import { Link } from "react-router-dom";
import { FileQuestion, LayoutDashboard } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Styles/NotFound.css";

function NotFound() {
  return (
    <div className="notfound-page-wrapper">
      <Navbar />

      <main className="notfound-main">
        <div className="notfound-card">
          <div className="notfound-icon-bubble">
            <FileQuestion size={44} className="notfound-icon" />
          </div>

          <h1 className="notfound-code">404</h1>

          <h2 className="notfound-title">Looks like this page doesn't exist.</h2>

          <p className="notfound-desc">
            The page you are looking for might have been moved, removed, or never existed.
          </p>

          <div className="notfound-actions">
            <Link to="/dashboard" className="btn btn-lg btn-primary">
              <LayoutDashboard size={18} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;