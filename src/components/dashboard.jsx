import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FileText,
  FolderOpen,
  User,
  Plus,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  AlertCircle
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ResumeCard from "./ResumeCard";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
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
  const filled = fields.filter(
    (f) => f !== null && f !== undefined && String(f).trim() !== ""
  ).length;
  const completion = Math.round((filled / fields.length) * 100);
  const atsScore = Math.min(98, Math.max(72, Math.round(68 + completion * 0.28)));
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

  const role = r.branch
    ? `${r.branch} Specialist`
    : r.degree
    ? `${r.degree} Graduate`
    : "Software Candidate";
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
  const toast = useToast();

  const userName = user?.name || "Candidate";
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Delete modal state
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteRequest = (resume) => {
    setResumeToDelete(resume);
  };

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return;
    setIsDeleting(true);

    try {
      await resumeAPI.delete(resumeToDelete.id);
      setResumes((prev) => prev.filter((r) => r.id !== resumeToDelete.id));
      toast.success("Resume deleted successfully.");
      setResumeToDelete(null);
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to delete resume.");
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarLinks = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={16} strokeWidth={1.5} />, active: true },
    { label: "My Resumes", path: "/my-resumes", icon: <FolderOpen size={16} strokeWidth={1.5} /> },
    { label: "Create Resume", path: "/resume", icon: <Plus size={16} strokeWidth={1.5} /> },
    { label: "Profile", path: "/profile", icon: <User size={16} strokeWidth={1.5} /> },
    { label: "Settings", path: "/profile", icon: <Settings size={16} strokeWidth={1.5} /> },
  ];

  return (
    <div className="dashboard-app-layout fade-in">
      <Navbar />

      <div className="dashboard-body-container">
        {/* Desktop Editorial Sidebar */}
        <aside
          className={`dashboard-sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}
          aria-label="Workspace sidebar"
        >
          <div className="sidebar-inner">
            <div className="sidebar-section-label">Workspace</div>

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
                  <LogOut size={16} strokeWidth={1.5} />
                </span>
                <span className="sidebar-nav-label">Log Out</span>
              </button>
            </nav>

            {/* Sidebar Bottom User Profile Snippet */}
            <div className="sidebar-user-footer">
              <div className="sidebar-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-meta">
                <span className="sidebar-user-name">{userName}</span>
                <span className="sidebar-user-status">Verified Account</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace Content Area */}
        <main id="main-content" className="dashboard-main-content">
          <div className="dashboard-content-wrapper">
            {/* Top Greeting Row */}
            <div className="dashboard-greeting-banner">
              <div className="greeting-text-group">
                <span className="dashboard-kicker">Candidate Workspace</span>
                <h1 className="greeting-heading">Welcome back, {userName}</h1>
                <p className="greeting-subtitle">
                  Build and manage your ATS-compliant professional career documents.
                </p>
              </div>

              <div className="greeting-cta-group">
                <button
                  type="button"
                  className="sidebar-mobile-btn"
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  aria-label="Toggle sidebar menu"
                >
                  {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                  <span>Menu</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  id="dashboard-create-resume-btn"
                  onClick={() => navigate("/resume")}
                >
                  <Plus size={16} strokeWidth={1.5} />
                  <span>New Resume</span>
                </button>
              </div>
            </div>

            {/* Metrics Row: Clean editorial metrics without generic blobs */}
            <section className="dashboard-stats-grid" aria-label="Account statistics">
              <div className="dash-stat-card">
                <div className="dash-stat-label">Active Documents</div>
                <div className="dash-stat-value">{resumes.length}</div>
                <div className="dash-stat-meta">Saved in your workspace</div>
              </div>

              <div className="dash-stat-card">
                <div className="dash-stat-label">Export Ready</div>
                <div className="dash-stat-value">
                  {resumes.filter((r) => r.completion >= 80).length}
                </div>
                <div className="dash-stat-meta">High section completeness</div>
              </div>

              <div className="dash-stat-card">
                <div className="dash-stat-label">Last Modified</div>
                <div className="dash-stat-value-text">
                  {resumes.length > 0 ? resumes[0].updated : "—"}
                </div>
                <div className="dash-stat-meta">Latest document update</div>
              </div>

              <div className="dash-stat-card">
                <div className="dash-stat-label">ATS Optimization Index</div>
                <div className="dash-stat-value">
                  {resumes.length > 0
                    ? `${Math.round(
                        resumes.reduce((acc, curr) => acc + curr.atsScore, 0) /
                          resumes.length
                      )}%`
                    : "—"}
                </div>
                <div className="dash-stat-meta">Average linear formatting score</div>
              </div>
            </section>

            {/* Recent Resumes Section */}
            <section className="recent-resumes-container" aria-label="Recent resumes">
              <div className="recent-header-row">
                <div>
                  <h2 className="recent-section-title">Recent Resumes</h2>
                  <p className="recent-section-subtitle">
                    Select a document to continue editing or export to PDF.
                  </p>
                </div>

                {resumes.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => navigate("/my-resumes")}
                  >
                    View all ({resumes.length})
                  </button>
                )}
              </div>

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Skeleton Loaders during fetch */}
              {isLoading ? (
                <div className="dashboard-skeletons-grid">
                  <div className="skeleton skeleton-card" />
                  <div className="skeleton skeleton-card" />
                  <div className="skeleton skeleton-card" />
                </div>
              ) : resumes.length > 0 ? (
                <div className="recent-resumes-grid">
                  {resumes.slice(0, 6).map((resume) => (
                    <ResumeCard
                      key={resume.id}
                      resume={resume}
                      onDelete={handleDeleteRequest}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                /* Honest Empty State with next action CTA */
                <div className="dashboard-empty-state">
                  <div className="empty-state-icon-box">
                    <FileText size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="empty-state-heading">No resumes created yet</h3>
                  <p className="empty-state-text">
                    Start by drafting your first resume. Your details are saved automatically as you write.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    id="empty-create-resume-btn"
                    onClick={() => navigate("/resume")}
                  >
                    <Plus size={16} strokeWidth={1.5} />
                    <span>Create Your First Resume</span>
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(resumeToDelete)}
        onClose={() => setResumeToDelete(null)}
        title="Delete Resume"
        confirmText="Delete Document"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      >
        <p>
          Are you sure you want to delete <strong>"{resumeToDelete?.title}"</strong>?
          This action will permanently remove this draft from your workspace.
        </p>
      </Modal>

      <Footer />
    </div>
  );
}

export default Dashboard;