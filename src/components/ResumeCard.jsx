import { FileText, Clock, Edit3, Download, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResumeCard({
  resume,
  onDelete,
  onDownload,
  viewMode = "grid", // "grid" | "list"
}) {
  const navigate = useNavigate();

  // Try to read custom template from local storage if saved
  let templateName = "Modern ATS";
  try {
    const meta = localStorage.getItem(`resume_meta_${resume.id}`);
    if (meta) {
      const parsed = JSON.parse(meta);
      if (parsed.template === "minimal") templateName = "Minimal Clean";
      else if (parsed.template === "executive") templateName = "Executive Elite";
    }
  } catch {
    // fallback
  }

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/resume/${resume.id}`);
  };

  const handleView = (e) => {
    e.stopPropagation();
    navigate(`/resume/${resume.id}?view=preview`);
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(resume, e);
    } else {
      navigate(`/resume/${resume.id}?view=preview`);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(resume);
  };

  if (viewMode === "list") {
    return (
      <div className="resume-list-row" data-testid={`resume-row-${resume.id}`}>
        <div className="list-row-icon">
          <FileText size={18} strokeWidth={1.5} />
        </div>

        <div className="list-row-info">
          <h3 className="list-row-title">{resume.title}</h3>
          <div className="list-row-meta">
            <span className="meta-tag">{templateName}</span>
            <span className="meta-sep">•</span>
            <span className="meta-time">
              <Clock size={12} />
              <span>{resume.updated}</span>
            </span>
            <span className="meta-sep">•</span>
            <span className="meta-score">{resume.atsScore}% ATS Match</span>
          </div>
        </div>

        <div className="list-row-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleEdit}
            title="Edit resume"
          >
            <Edit3 size={14} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleDownloadClick}
            title="Download PDF"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm btn-delete-action"
            onClick={handleDeleteClick}
            title="Delete resume"
            aria-label={`Delete resume ${resume.title}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-card-box" data-testid={`resume-card-${resume.id}`}>
      {/* Visual Header / Micro Thumbnail */}
      <div className="card-thumb-banner" onClick={handleEdit}>
        <div className="thumb-paper-mock">
          <div className="thumb-paper-name">{resume.title}</div>
          <div className="thumb-paper-sub">{resume.role}</div>
          <div className="thumb-paper-line" />
          <div className="thumb-paper-line short" />
        </div>
        <div className="thumb-template-badge">{templateName}</div>
      </div>

      <div className="card-content-body">
        <div className="card-header-row">
          <h3 className="card-title-text" title={resume.title} onClick={handleEdit}>
            {resume.title}
          </h3>
        </div>

        <p className="card-role-text">{resume.role}</p>

        <div className="card-meta-bar">
          <span className="card-meta-time">
            <Clock size={12} />
            <span>{resume.updated}</span>
          </span>
          <span className="card-meta-score">
            {resume.atsScore}% ATS Match
          </span>
        </div>

        {/* Action Buttons Bar */}
        <div className="card-actions-bar">
          <button
            type="button"
            className="btn btn-secondary btn-sm card-action-btn"
            onClick={handleEdit}
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm card-action-btn"
            onClick={handleView}
            title="Preview"
          >
            <Eye size={13} />
            <span>View</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm card-action-btn"
            onClick={handleDownloadClick}
            title="Download PDF"
          >
            <Download size={13} />
            <span>PDF</span>
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm card-action-btn btn-delete-action"
            onClick={handleDeleteClick}
            title="Delete"
            aria-label={`Delete resume ${resume.title}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
