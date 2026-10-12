import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  FileDown,
  ArrowLeft,
  CheckCircle2,
  Printer,
  FileEdit,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  AlertCircle,
  Save
} from "lucide-react";

import ResumeForm from "../components/Resumeform";
import ResumePreview from "../components/ResumePreview";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resumeAPI, getErrorMessage } from "../api/api";
import "../Styles/ResumeBuilder.css";

const defaultResumeState = {
  name: "Murali Krishna",
  email: "murali.krishna@example.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
  summary:
    "Proactive Software Engineer specializing in modern JavaScript, React ecosystem, and robust REST APIs. Passionate about building responsive user interfaces, optimizing client performance, and collaborating in agile engineering teams.",
  college: "National Institute of Technology",
  degree: "B.Tech",
  branch: "Computer Science & Engineering",
  cgpa: "8.9",
  year: "2025",
  skills:
    "React, JavaScript (ES6+), TypeScript, Node.js, Spring Boot, Java, HTML5, CSS3, SQL, REST APIs, Git",
  projects:
    "• AI Resume Builder: Developed automated ATS resume builder with real-time preview and client-side PDF export using React & Vite.\n• E-Commerce Microservices: Built product catalog and order processing services handling concurrent transactions.",
  experience:
    "• Software Development Intern at TechCorp (May 2024 - Aug 2024): Built modular React frontend components reducing page load latency by 28%; integrated RESTful endpoints and participated in Agile sprints.",
};

const templateCatalog = [
  {
    id: "modern",
    name: "Modern ATS",
    desc: "Serif headers, hairline rules",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    desc: "Understated sans-serif",
  },
  {
    id: "executive",
    name: "Executive Elite",
    desc: "Traditional serif, formal margins",
  },
];

function ResumeBuilder() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");
  const activeResumeId = routeId || queryId;

  const { user } = useAuth();
  const toast = useToast();

  const [currentResumeId, setCurrentResumeId] = useState(activeResumeId || null);
  const [resumeData, setResumeData] = useState(() => ({
    ...defaultResumeState,
    name: user?.name || defaultResumeState.name,
    email: user?.email || defaultResumeState.email,
  }));

  const [template, setTemplate] = useState("modern");
  const [activeSection, setActiveSection] = useState("personal");
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(Boolean(activeResumeId));
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("ready"); // "ready" | "saving" | "saved" | "error"
  const [lastSavedTime, setLastSavedTime] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");

  const [mobileTab, setMobileTab] = useState(() =>
    searchParams.get("view") === "preview" ? "preview" : "form"
  );

  const resumeRef = useRef(null);
  const previewContainerRef = useRef(null);

  // Load existing resume from backend if ID provided
  useEffect(() => {
    let isMounted = true;
    if (activeResumeId) {
      resumeAPI
        .getById(activeResumeId)
        .then((data) => {
          if (!isMounted) return;

          let localMeta = {};
          try {
            const storedMeta = localStorage.getItem(`resume_meta_${activeResumeId}`);
            if (storedMeta) {
              localMeta = JSON.parse(storedMeta);
            }
          } catch {
            // ignore
          }

          setResumeData({
            name: localMeta.name || user?.name || defaultResumeState.name,
            email: localMeta.email || user?.email || defaultResumeState.email,
            phone: localMeta.phone || defaultResumeState.phone,
            location: localMeta.location || defaultResumeState.location,
            summary: data.summary || "",
            college: data.college || "",
            degree: data.degree || "",
            branch: data.branch || "",
            cgpa: data.cgpa !== null && data.cgpa !== undefined ? String(data.cgpa) : "",
            year:
              data.graduationYear !== null && data.graduationYear !== undefined
                ? String(data.graduationYear)
                : "",
            skills: data.skills || "",
            projects: data.projects || "",
            experience: data.experience || "",
          });

          if (localMeta.template) {
            setTemplate(localMeta.template);
          }
          setCurrentResumeId(activeResumeId);
          setSaveStatus("saved");
          const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          setLastSavedTime(now);
        })
        .catch((err) => {
          if (!isMounted) return;
          const msg = getErrorMessage(err, "Failed to load resume details.");
          setSaveErrorMessage(msg);
          setSaveStatus("error");
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingResume(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [activeResumeId, user]);

  // Persist resume to backend MySQL via Spring Boot API
  const handleSaveResume = useCallback(
    async (formData) => {
      setIsSaving(true);
      setSaveStatus("saving");
      setSaveErrorMessage("");

      const dataToSave = formData || resumeData;

      let parsedCgpa = null;
      if (
        dataToSave.cgpa !== undefined &&
        dataToSave.cgpa !== null &&
        String(dataToSave.cgpa).trim() !== ""
      ) {
        const num = parseFloat(dataToSave.cgpa);
        if (!isNaN(num)) parsedCgpa = num;
      }

      let parsedGraduationYear = null;
      if (
        dataToSave.year !== undefined &&
        dataToSave.year !== null &&
        String(dataToSave.year).trim() !== ""
      ) {
        const num = parseInt(dataToSave.year, 10);
        if (!isNaN(num)) parsedGraduationYear = num;
      }

      const payload = {
        summary: dataToSave.summary || "",
        college: dataToSave.college || "",
        degree: dataToSave.degree || "",
        branch: dataToSave.branch || "",
        cgpa: parsedCgpa,
        graduationYear: parsedGraduationYear,
        skills: dataToSave.skills || "",
        projects: dataToSave.projects || "",
        experience: dataToSave.experience || "",
      };

      try {
        let savedRecord;
        if (currentResumeId) {
          savedRecord = await resumeAPI.update(currentResumeId, payload);
        } else {
          savedRecord = await resumeAPI.create(payload);
          if (savedRecord && savedRecord.id) {
            setCurrentResumeId(savedRecord.id);
            navigate(`/resume/${savedRecord.id}`, { replace: true });
          }
        }

        const targetId = currentResumeId || savedRecord?.id;
        if (targetId) {
          localStorage.setItem(
            `resume_meta_${targetId}`,
            JSON.stringify({
              phone: dataToSave.phone || "",
              location: dataToSave.location || "",
              template,
              name: dataToSave.name || "",
              email: dataToSave.email || "",
            })
          );
        }

        setSaveStatus("saved");
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setLastSavedTime(timeStr);
        toast.success("Resume saved successfully.");
        return savedRecord;
      } catch (err) {
        const msg = getErrorMessage(err, "Failed to save resume.");
        setSaveErrorMessage(msg);
        setSaveStatus("error");
        toast.error(msg);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [currentResumeId, navigate, resumeData, template, toast]
  );

  // Template switch handler that also persists template preference in local storage
  const handleSelectTemplate = (newTemplate) => {
    setTemplate(newTemplate);
    if (currentResumeId) {
      try {
        const stored = localStorage.getItem(`resume_meta_${currentResumeId}`);
        const parsed = stored ? JSON.parse(stored) : {};
        localStorage.setItem(
          `resume_meta_${currentResumeId}`,
          JSON.stringify({ ...parsed, template: newTemplate })
        );
      } catch {
        // ignore
      }
    }
  };

  // High-Resolution Multi-Page Capable PDF Export
  const downloadPDF = async () => {
    const previewEl = resumeRef.current;
    if (!previewEl) {
      toast.error("Resume preview element not found.");
      return;
    }

    setIsDownloading(true);

    try {
      // Temporarily remove any zoom scaling for capture
      const originalTransform = previewEl.style.transform;
      previewEl.style.transform = "none";

      await new Promise((resolve) => setTimeout(resolve, 150));

      const canvas = await html2canvas(previewEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Restore zoom
      previewEl.style.transform = originalTransform;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210; // A4 mm width
      const pageHeight = 297; // A4 mm height
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      // Add subsequent pages if content overflows A4 height
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      const fileName = `${
        resumeData.name ? resumeData.name.trim().replace(/\s+/g, "_") : "Resume"
      }.pdf`;

      pdf.save(fileName);
      toast.success("PDF exported successfully.");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-builder-page-wrapper fade-in">
      <Navbar />

      {/* Top Workspace Command Bar */}
      <header className="builder-top-toolbar" aria-label="Builder controls">
        <div className="top-toolbar-inner">
          <div className="toolbar-left-group">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-sm btn-secondary back-dash-btn"
              title="Return to Dashboard"
            >
              <ArrowLeft size={14} />
              <span>Dashboard</span>
            </button>

            <div className="doc-metadata">
              <span className="doc-name-text">
                {resumeData.name ? `${resumeData.name}'s Resume` : "Untitled Draft"}
              </span>

              {/* Autosave Indicator */}
              {saveStatus === "saving" && (
                <span className="save-status-pill status-saving">
                  <Loader2 size={12} className="spin-animate" />
                  <span>Saving…</span>
                </span>
              )}

              {saveStatus === "saved" && (
                <span className="save-status-pill status-saved">
                  <CheckCircle2 size={12} />
                  <span>Saved {lastSavedTime || "recently"}</span>
                </span>
              )}

              {saveStatus === "error" && (
                <button
                  type="button"
                  className="save-status-pill status-error"
                  onClick={() => handleSaveResume()}
                  title="Click to retry saving"
                >
                  <AlertCircle size={12} />
                  <span>Couldn't save — retry</span>
                </button>
              )}
            </div>
          </div>

          {/* Template Switcher Cards */}
          <div className="toolbar-template-picker" role="radiogroup" aria-label="Resume template options">
            <span className="picker-label">Template:</span>
            <div className="template-btn-group">
              {templateCatalog.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`template-select-pill ${template === opt.id ? "is-selected" : ""}`}
                  onClick={() => handleSelectTemplate(opt.id)}
                  role="radio"
                  aria-checked={template === opt.id}
                  data-testid={`template-btn-${opt.id}`}
                >
                  <span>{opt.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Edit / Preview Toggle */}
          <div className="mobile-view-mode-toggle">
            <button
              type="button"
              className={`mode-btn ${mobileTab === "form" ? "active" : ""}`}
              onClick={() => setMobileTab("form")}
            >
              <FileEdit size={14} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${mobileTab === "preview" ? "active" : ""}`}
              onClick={() => setMobileTab("preview")}
            >
              <Eye size={14} />
              <span>Preview</span>
            </button>
          </div>

          {/* Actions: Save, Print, Download PDF */}
          <div className="toolbar-right-group">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => handleSaveResume()}
              disabled={isSaving}
              id="toolbar-save-btn"
            >
              <Save size={14} />
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>

            <button
              type="button"
              className="btn btn-sm btn-secondary print-action-btn"
              onClick={handlePrint}
              title="Print document"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button
              className="btn btn-sm btn-primary download-action-btn"
              onClick={downloadPDF}
              disabled={isDownloading}
              id="toolbar-download-btn"
            >
              <FileDown size={14} />
              <span>{isDownloading ? "Exporting PDF..." : "Download PDF"}</span>
            </button>
          </div>
        </div>
      </header>

      {saveErrorMessage && (
        <div className="builder-alert-container">
          <div className="alert alert-danger" role="alert">
            <AlertCircle size={15} />
            <span>{saveErrorMessage}</span>
          </div>
        </div>
      )}

      {/* Main 3-Zone Builder Workspace */}
      <main id="main-content" className="builder-main-workspace">
        <div className="builder-grid-container">
          {/* Zone 1 & 2: Form Editor */}
          <section
            className={`builder-form-pane ${
              mobileTab === "preview" ? "mobile-hidden" : ""
            }`}
          >
            {isLoadingResume ? (
              <div className="builder-loading-state">
                <Loader2 size={28} className="spin-animate" />
                <p>Loading resume details from workspace...</p>
              </div>
            ) : (
              <ResumeForm
                resumeData={resumeData}
                setResumeData={setResumeData}
                onDownload={downloadPDF}
                onTogglePreviewMobile={() => setMobileTab("preview")}
                onSave={handleSaveResume}
                isSaving={isSaving}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            )}
          </section>

          {/* Zone 3: Sticky Live A4 Preview with Zoom Controls */}
          <section
            className={`builder-preview-pane ${
              mobileTab === "form" ? "mobile-hidden-on-phone" : ""
            }`}
          >
            <div className="sticky-preview-container">
              {/* Preview Status & Zoom Bar */}
              <div className="preview-top-status-bar">
                <div className="preview-status-indicator">
                  <span className="live-pulse-dot" />
                  <span className="preview-bar-title">Live A4 Preview</span>
                  <span className="preview-template-tag">
                    {templateCatalog.find((t) => t.id === template)?.name}
                  </span>
                </div>

                {/* Zoom Controls */}
                <div className="preview-zoom-controls">
                  <button
                    type="button"
                    className="zoom-btn"
                    onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                    title="Zoom Out"
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <span className="zoom-value-label">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    className="zoom-btn"
                    onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                    title="Zoom In"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={13} />
                  </button>
                  {zoomLevel !== 1 && (
                    <button
                      type="button"
                      className="zoom-btn reset-btn"
                      onClick={() => setZoomLevel(1)}
                      title="Reset Zoom"
                      aria-label="Reset zoom"
                    >
                      <RotateCcw size={12} />
                    </button>
                  )}
                </div>

                <div className="preview-panel-actions">
                  <button
                    className="btn btn-sm btn-primary download-preview-btn"
                    onClick={downloadPDF}
                    disabled={isDownloading}
                  >
                    <FileDown size={14} />
                    <span>{isDownloading ? "Exporting..." : "Download PDF"}</span>
                  </button>
                </div>
              </div>

              {/* A4 Sheet Viewport Canvas */}
              <div
                className="resume-sheet-viewport"
                ref={previewContainerRef}
              >
                <div
                  className="resume-sheet-scaler"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "top center",
                    transition: "transform 140ms ease-out",
                  }}
                >
                  <ResumePreview
                    ref={resumeRef}
                    resumeData={resumeData}
                    template={template}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ResumeBuilder;