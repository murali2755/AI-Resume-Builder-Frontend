import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  FolderOpen,
  AlertCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ResumeCard from "../components/ResumeCard";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";
import { resumeAPI, getErrorMessage } from "../api/api";
import "../Styles/MyResumes.css";

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

function MyResumes() {
  const navigate = useNavigate();
  const toast = useToast();

  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  // Delete modal state
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResumes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await resumeAPI.getAll();
      const processed = (data || []).map(calculateResumeDetails);
      setResumes(processed);
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to load resumes from server.");
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    resumeAPI.getAll().then((data) => {
      if (!ignore) {
        const processed = (data || []).map(calculateResumeDetails);
        setResumes(processed);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (!ignore) {
        const msg = getErrorMessage(err, "Failed to load resumes from server.");
        setErrorMessage(msg);
        setIsLoading(false);
      }
    });

    return () => {
      ignore = true;
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
      setResumes((prev) => prev.filter((item) => item.id !== resumeToDelete.id));
      toast.success("Resume deleted successfully.");
      setResumeToDelete(null);
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to delete resume.");
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = (resume, e) => {
    e?.stopPropagation();
    navigate(`/resume/${resume.id}?view=preview`);
  };

  const filteredResumes = resumes
    .filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        (item.skills && item.skills.toLowerCase().includes(q)) ||
        (item.college && item.college.toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "ats") return b.atsScore - a.atsScore;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      // latest
      return b.id - a.id;
    });

  return (
    <div className="my-resumes-page-wrapper fade-in">
      <Navbar />

      <main id="main-content" className="my-resumes-main">
        <div className="my-resumes-container">
          {/* Header Row */}
          <div className="resumes-header-bar">
            <div>
              <span className="resumes-page-kicker">Document Library</span>
              <h1 className="resumes-page-title">My Resumes</h1>
              <p className="resumes-page-subtitle">
                Search, customize, and export your tailored career documents.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              id="myresumes-create-btn"
              onClick={() => navigate("/resume")}
            >
              <Plus size={16} strokeWidth={1.5} />
              <span>Create New Resume</span>
            </button>
          </div>

          {/* Search, Filter & Sort Toolbar */}
          <div className="resumes-toolbar-row">
            <div className="search-input-wrapper">
              <Search size={15} className="search-icon" />
              <input
                id="search-resumes-input"
                type="text"
                placeholder="Search by title, role, skills, or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-field"
                aria-label="Search resumes"
              />
            </div>

            <div className="toolbar-controls-right">
              {/* Filter Tabs */}
              <div className="filter-pill-group" role="tablist" aria-label="Filter by status">
                <span className="filter-label">
                  <Filter size={13} />
                  <span>Filter:</span>
                </span>
                {["All", "Completed", "In Progress"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`filter-btn ${statusFilter === status ? "active" : ""}`}
                    onClick={() => setStatusFilter(status)}
                    role="tab"
                    aria-selected={statusFilter === status}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="sort-select-wrapper">
                <ArrowUpDown size={13} className="sort-icon" />
                <select
                  id="sort-resumes-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                  aria-label="Sort resumes"
                >
                  <option value="latest">Latest Modified</option>
                  <option value="ats">Highest ATS Match</option>
                  <option value="title">Title (A–Z)</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="view-toggle-group" aria-label="Display mode">
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                  aria-label="List view"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={fetchResumes}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  color: "inherit",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Skeletons while loading */}
          {isLoading ? (
            <div className="my-resumes-skeletons-grid">
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-card" />
            </div>
          ) : filteredResumes.length > 0 ? (
            <div className={viewMode === "grid" ? "my-resumes-grid" : "my-resumes-list"}>
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onDelete={handleDeleteRequest}
                  onDownload={handleDownload}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            /* Honest Empty State with next action CTA */
            <div className="resumes-empty-card" data-testid="empty-resumes-state">
              <div className="empty-icon-circle">
                <FolderOpen size={36} strokeWidth={1.5} />
              </div>
              <h3 className="empty-heading">
                {searchQuery || statusFilter !== "All"
                  ? "No matching resumes found"
                  : "No resumes in your workspace yet"}
              </h3>
              <p className="empty-subtext">
                {searchQuery || statusFilter !== "All"
                  ? "Try clearing your search query or switching filters to see all drafts."
                  : "Create your first professional resume in minutes. Format directly for applicant tracking software."}
              </p>
              {searchQuery || statusFilter !== "All" ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("All");
                  }}
                >
                  Clear filters
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate("/resume")}
                >
                  <Plus size={16} strokeWidth={1.5} />
                  <span>Create Resume</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(resumeToDelete)}
        onClose={() => setResumeToDelete(null)}
        title="Delete Resume"
        confirmText="Delete Resume"
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

export default MyResumes;