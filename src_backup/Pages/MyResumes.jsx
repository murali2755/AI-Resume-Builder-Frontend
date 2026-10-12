import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  TrendingUp,
  Edit3,
  Eye,
  Download,
  Trash2,
  FolderOpen,
  ArrowUpDown
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Styles/MyResumes.css";

import { useEffect, useCallback } from "react";
import { resumeAPI, getErrorMessage } from "../api/api";
import { Loader2, AlertCircle } from "lucide-react";

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

function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

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
    let isMounted = true;
    async function load() {
      try {
        const data = await resumeAPI.getAll();
        if (!isMounted) return;
        const processed = (data || []).map(calculateResumeDetails);
        setResumes(processed);
      } catch (err) {
        if (!isMounted) return;
        const msg = getErrorMessage(err, "Failed to load resumes from server.");
        setErrorMessage(msg);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await resumeAPI.delete(id);
        setResumes((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        alert(getErrorMessage(err, "Failed to delete resume."));
      }
    }
  };

  const handleDownload = (resume, e) => {
    e.stopPropagation();
    navigate(`/resume/${resume.id}?view=preview`);
  };

  const filteredResumes = resumes
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.skills && item.skills.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.college && item.college.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "ats") return b.atsScore - a.atsScore;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return b.id - a.id;
    });

  return (
    <div className="my-resumes-page-wrapper">
      <Navbar />

      <main className="my-resumes-main">
        <div className="my-resumes-container">
          {/* Header Bar */}
          <div className="resumes-header-bar">
            <div>
              <h1 className="resumes-page-title">My Resumes</h1>
              <p className="resumes-page-subtitle">
                Manage, edit, and download your resumes.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              id="myresumes-create-btn"
              onClick={() => navigate("/resume")}
            >
              <Plus size={18} />
              <span>Create New Resume</span>
            </button>
          </div>

          {/* Search, Filter & Sort Toolbar */}
          <div className="resumes-toolbar-row">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search resumes by title or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-field"
              />
            </div>

            <div className="toolbar-controls-right">
              {/* Filter Tabs */}
              <div className="filter-pill-group">
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
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="sort-select-wrapper">
                <ArrowUpDown size={13} className="sort-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="latest">Latest Modified</option>
                  <option value="ats">Highest ATS Match Est.</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="auth-error-alert" style={{ marginBottom: "1.5rem" }} role="alert">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={fetchResumes}
                style={{ marginLeft: "auto", background: "none", border: "none", color: "inherit", textDecoration: "underline", cursor: "pointer" }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading ? (
            <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#64748b" }}>
              <Loader2 size={36} className="spin-animate" style={{ margin: "0 auto 1rem" }} />
              <p>Loading your resumes from database...</p>
            </div>
          ) : filteredResumes.length > 0 ? (
            <div className="my-resumes-grid">
              {filteredResumes.map((resume) => (
                <div key={resume.id} className="resume-doc-card">
                  <div className="doc-card-top">
                    <div className="doc-icon-wrap">
                      <FileText size={20} />
                    </div>
                    <div className="doc-score-pill" title="Rule-based ATS completeness estimate">
                      <TrendingUp size={12} />
                      <span>{resume.atsScore}% Match Est.</span>
                    </div>
                  </div>

                  <h3 className="doc-card-title">{resume.title}</h3>
                  <p className="doc-card-role">{resume.role}</p>

                  <div className="doc-meta-row">
                    <span className="doc-update-time">
                      <Clock size={13} />
                      <span>Last modified: {resume.updated}</span>
                    </span>
                    <span className={`status-pill ${resume.status.toLowerCase().replace(" ", "-")}`}>
                      {resume.status}
                    </span>
                  </div>

                  {/* Completion Progress Bar */}
                  <div className="doc-progress-wrap">
                    <div className="doc-progress-labels">
                      <span>Completion</span>
                      <span>{resume.completion}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${resume.completion}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions: Edit, View, Download, Delete */}
                  <div className="doc-actions-row">
                    <button
                      type="button"
                      className="btn-doc-action edit-btn"
                      onClick={() => navigate(`/resume/${resume.id}`)}
                      title="Edit resume"
                    >
                      <Edit3 size={15} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      className="btn-doc-action view-btn"
                      onClick={() => navigate(`/resume/${resume.id}?view=preview`)}
                      title="View preview"
                    >
                      <Eye size={15} />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      className="btn-doc-action download-btn"
                      onClick={(e) => handleDownload(resume, e)}
                      title="Download PDF"
                    >
                      <Download size={15} />
                      <span>PDF</span>
                    </button>

                    <button
                      type="button"
                      className="btn-doc-action delete-btn"
                      onClick={(e) => handleDelete(resume.id, e)}
                      title="Delete resume"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="resumes-empty-card">
              <div className="empty-icon-circle">
                <FolderOpen size={44} />
              </div>
              <h3 className="empty-heading">No resumes found</h3>
              <p className="empty-subtext">
                {searchQuery || statusFilter !== "All"
                  ? "No resumes match your active search or filter criteria."
                  : "Create your first professional resume in minutes."}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MyResumes;