import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  FolderOpen,
  User,
  Plus,
  Eye,
  Edit3,
  Download,
  Trash2,
  LayoutDashboard,
  Settings,
  LogOut,
  FolderKanban,
  Menu,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";
import { resumeAPI, getErrorMessage } from "../api/api";
import "../Styles/dashboard.css";

function calculateResumeDetails(r) {
  const fields = [
    r.summary,
    r.college,
    r.degree,
    r.branch,
    r.cgpa,
    r.graduationYear,
    r.skills,
    r.projects,
    r.experience,
  ];
  const filled = fields.filter((f) => f !== null && f !== undefined && String(f).trim() !== "").length;
  const completion = Math.round((filled / fields.length) * 100);
  const atsScore = Math.min(98, Math.max(72, Math.round(68 + (completion * 0.28))));
  const status = completion >= 90 ? "Completed" : "In Progress";

  let updated = "Recently";
  if (r.createdAt) {
    try {
      const date = new Date(r.createdAt);
      updated = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      // fallback
    }
  }

  const role = r.branch ? `${r.branch} Specialist` : (r.degree ? `${r.degree} Graduate` : "Software Candidate");
  const title = `${r.branch || r.degree || "Professional"} Resume #${r.id}`;

  return {
    ...r,
    title,
    role,
    updated,
    completion,
    atsScore,
    status,
  };
}

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userName = user?.name || "User";
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    resumeAPI
      .getAll()
      .then((data) => {
        if (!isMounted) return;
        const processed = (data || []).map(calculateResumeDetails);
        setResumes(processed);
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMessage(getErrorMessage(err, "Failed to load dashboard data."));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await resumeAPI.delete(id);
        setResumes((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        alert(getErrorMessage(err, "Failed to delete resume."));
      }
    }
  };

  const handleDownload = (resume, e) => {
    e.stopPropagation();
    navigate(`/resume/${resume.id}?view=preview`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarLinks = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} />, active: true },
    { label: "My Resumes", path: "/my-resumes", icon: <FolderOpen size={18} /> },
    { label: "Create Resume", path: "/resume", icon: <Plus size={18} /> },
    { label: "Profile", path: "/profile", icon: <User size={18} /> },
    { label: "Settings", path: "/profile", icon: <Settings size={18} /> },
  ];

  return (
    <div className="dashboard-app-layout">
      {/* Top Navbar */}
      <Navbar />

      <div className="dashboard-body-container">
        {/* Desktop SaaS Sidebar */}
        <aside className={`dashboard-sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}>
          <div className="sidebar-inner">
            <div className="sidebar-section-label">Main Navigation</div>

            <nav className="sidebar-nav-menu">
              {sidebarLinks.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className={`sidebar-nav-item ${item.active ? "active" : ""}`}
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span className="sidebar-nav-label">{item.label}</span>
                </Link>
              ))}

              <button
                type="button"
                className="sidebar-nav-item sidebar-logout-action"
                onClick={handleLogout}
              >
                <span className="sidebar-nav-icon">
                  <LogOut size={18} />
                </span>
                <span className="sidebar-nav-label">Logout</span>
              </button>
            </nav>

            {/* Sidebar Bottom User Profile Snippet */}
            <div className="sidebar-user-footer">
              <div className="sidebar-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-meta">
                <span className="sidebar-user-name">{userName}</span>
                <span className="sidebar-user-status">Pro Member</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main-content">
          <div className="dashboard-content-wrapper">
            {/* Top Greeting Row */}
            <div className="dashboard-greeting-banner">
              <div className="greeting-text-group">
                <h1 className="greeting-heading">Welcome back, {userName}</h1>
                <p className="greeting-subtitle">
                  Build and manage your ATS-optimized professional resumes.
                </p>
              </div>

              <div className="greeting-cta-group">
                <button
                  type="button"
                  className="sidebar-mobile-btn"
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  aria-label="Toggle sidebar menu"
                >
                  {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                  <span>Menu</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  id="dashboard-create-resume-btn"
                  onClick={() => navigate("/resume")}
                >
                  <Plus size={18} />
                  <span>Create New Resume</span>
                </button>
              </div>
            </div>

            {/* Dashboard Statistics: 4 Elegant Cards */}
            <section className="dashboard-stats-grid" aria-label="Dashboard Metrics">
              <div className="dash-stat-card">
                <div className="dash-stat-top">
                  <span className="dash-stat-title">Total Resumes</span>
                  <div className="dash-stat-icon-bubble stat-bubble-indigo">
                    <FileText size={18} />
                  </div>
                </div>
                <div className="dash-stat-value">{resumes.length}</div>
                <div className="dash-stat-meta">Active documents in account</div>
              </div>

              <div className="dash-stat-card">
                <div className="dash-stat-top">
                  <span className="dash-stat-title">Completed</span>
                  <div className="dash-stat-icon-bubble stat-bubble-green">
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                <div className="dash-stat-value">
                  {resumes.filter((r) => r.completion === 100).length}
                </div>
                <div className="dash-stat-meta">Ready for immediate export</div>
              </div>

              <div className="dash-stat-card">
                <div className="dash-stat-top">
                  <span className="dash-stat-title">Last Updated</span>
                  <div className="dash-stat-icon-bubble stat-bubble-amber">
                    <Clock size={18} />
                  </div>
                </div>
                <div className="dash-stat-value-text">
                  {resumes.length > 0 ? resumes[0].updated : "N/A"}
                </div>
                <div className="dash-stat-meta">Recent modification</div>
              </div>

              <div className="dash-stat-card">
                <div className="dash-stat-top">
                  <span className="dash-stat-title">ATS Match Est.</span>
                  <div className="dash-stat-icon-bubble stat-bubble-violet">
                    <TrendingUp size={18} />
                  </div>
                </div>
                <div className="dash-stat-value">
                  {resumes.length > 0
                    ? `${Math.round(
                        resumes.reduce((acc, curr) => acc + curr.atsScore, 0) /
                          resumes.length
                      )}%`
                    : "0%"}
                </div>
                <div className="dash-stat-meta">Rule-based completeness index</div>
              </div>
            </section>

            {/* Recent Resumes Section */}
            <section className="recent-resumes-container">
              <div className="recent-header-row">
                <div>
                  <h2 className="recent-section-title">Recent Resumes</h2>
                  <p className="recent-section-subtitle">
                    Manage, review, and download your latest active drafts.
                  </p>
                </div>

                {resumes.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => navigate("/my-resumes")}
                  >
                    View All ({resumes.length})
                  </button>
                )}
              </div>

              {errorMessage && (
                <div className="auth-error-alert" style={{ marginBottom: "1.5rem" }} role="alert">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isLoading ? (
                <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#64748b" }}>
                  <Loader2 size={36} className="spin-animate" style={{ margin: "0 auto 1rem" }} />
                  <p>Loading your resumes...</p>
                </div>
              ) : resumes.length > 0 ? (
                <div className="recent-resumes-grid">
                  {resumes.slice(0, 6).map((resume) => (
                    <div key={resume.id} className="recent-resume-card">
                      <div className="card-top-header">
                        <div className="resume-icon-badge">
                          <FileText size={18} />
                        </div>
                        <div className="ats-metric-badge" title="Rule-based ATS completeness estimate">
                          <TrendingUp size={12} />
                          <span>{resume.atsScore}% Match Est.</span>
                        </div>
                      </div>

                      <h3 className="resume-card-title">{resume.title}</h3>
                      <p className="resume-card-role">{resume.role}</p>

                      <div className="resume-card-timestamp">
                        <Clock size={13} />
                        <span>Last updated: {resume.updated}</span>
                      </div>

                      {/* Completion Progress Bar */}
                      <div className="resume-progress-block">
                        <div className="progress-labels">
                          <span>Completion</span>
                          <span>{resume.completion}%</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${resume.completion}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions: Edit, View, Download, Delete with tooltips */}
                      <div className="resume-card-actions-bar">
                        <button
                          type="button"
                          className="action-icon-btn action-edit"
                          onClick={() => navigate(`/resume/${resume.id}`)}
                          title="Edit resume"
                          aria-label="Edit resume"
                        >
                          <Edit3 size={15} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          className="action-icon-btn action-view"
                          onClick={() => navigate(`/resume/${resume.id}?view=preview`)}
                          title="View resume"
                          aria-label="View resume"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          className="action-icon-btn action-download"
                          onClick={(e) => handleDownload(resume, e)}
                          title="Download PDF"
                          aria-label="Download PDF"
                        >
                          <Download size={15} />
                          <span>PDF</span>
                        </button>

                        <button
                          type="button"
                          className="action-icon-btn action-delete"
                          onClick={(e) => handleDeleteResume(resume.id, e)}
                          title="Delete resume"
                          aria-label="Delete resume"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="dashboard-empty-state">
                  <div className="empty-state-visual">
                    <FolderKanban size={48} className="empty-state-icon" />
                  </div>
                  <h3 className="empty-state-heading">No resumes yet</h3>
                  <p className="empty-state-text">
                    Create your first professional resume in minutes.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate("/resume")}
                  >
                    <Plus size={18} />
                    <span>Create Resume</span>
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;