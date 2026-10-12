import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  FileDown,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Eye,
  FileEdit,
  Printer,
  LayoutTemplate,
  Loader2,
  AlertCircle
} from "lucide-react";

import ResumeForm from "../components/Resumeform";
import ResumePreview from "../components/ResumePreview";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { resumeAPI, getErrorMessage } from "../api/api";

import "../Styles/ResumeBuilder.css";

const defaultResumeState = {
  name: "Murali Krishna",
  email: "murali.krishna@example.com",
  phone: "9876543210",
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

const templateOptions = [
  { id: "modern", name: "Modern ATS", badge: "Recommended" },
  { id: "minimal", name: "Minimal Clean", badge: "Classic" },
  { id: "executive", name: "Executive Elite", badge: "Senior" },
];

function ResumeBuilder() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");
  const activeResumeId = routeId || queryId;

  const { user } = useAuth();

  const [currentResumeId, setCurrentResumeId] = useState(activeResumeId || null);
  const [resumeData, setResumeData] = useState(() => ({
    ...defaultResumeState,
    name: user?.name || defaultResumeState.name,
    email: user?.email || defaultResumeState.email,
  }));

  const [template, setTemplate] = useState("modern");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("ready"); // "ready" | "saving" | "saved" | "error"
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [mobileTab, setMobileTab] = useState(() =>
    searchParams.get("view") === "preview" ? "preview" : "form"
  );

  const resumeRef = useRef();

  // Load resume from backend if an ID is present
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
            // ignore parse error
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
  const handleSaveResume = async (formData) => {
    setIsSaving(true);
    setSaveStatus("saving");
    setSaveErrorMessage("");

    const dataToSave = formData || resumeData;

    // Convert types strictly matching backend ResumeRequest DTO
    let parsedCgpa = null;
    if (dataToSave.cgpa !== undefined && dataToSave.cgpa !== null && String(dataToSave.cgpa).trim() !== "") {
      const num = parseFloat(dataToSave.cgpa);
      if (!isNaN(num)) parsedCgpa = num;
    }

    let parsedGraduationYear = null;
    if (dataToSave.year !== undefined && dataToSave.year !== null && String(dataToSave.year).trim() !== "") {
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
          // Update URL without triggering page reload
          navigate(`/resume/${savedRecord.id}`, { replace: true });
        }
      }

      const targetId = currentResumeId || savedRecord?.id;
      if (targetId) {
        // Persist extra metadata (phone, location, template, name, email) locally so they are never lost
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
      return savedRecord;
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to save resume. Please try again.");
      setSaveErrorMessage(msg);
      setSaveStatus("error");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = async () => {
    const input = resumeRef.current;

    if (!input) {
      alert("Resume Preview not found!");
      return;
    }

    setIsDownloading(true);

    try {
      // Let DOM settle for canvas capture
      await new Promise((resolve) => setTimeout(resolve, 150));

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.name ? resumeData.name.replace(/\s+/g, "_") : "Resume"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to export PDF: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-builder-page-wrapper">
      <Navbar />

      {/* Top Workspace Command Bar: Resume Title, Save Status, Template, Preview, Download PDF */}
      <div className="builder-top-toolbar">
        <div className="top-toolbar-inner">
          <div className="toolbar-left-group">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-sm btn-secondary back-dash-btn"
              title="Return to Dashboard"
            >
              <ArrowLeft size={15} />
              <span>Dashboard</span>
            </button>

            <div className="doc-metadata">
              <span className="doc-name-text">
                {resumeData.name ? `${resumeData.name}'s Resume` : "Untitled Resume"}
              </span>

              {saveStatus === "saving" && (
                <span className="save-status-pill" style={{ color: "#3b82f6" }}>
                  <Loader2 size={13} className="spin-animate" />
                  <span>Saving...</span>
                </span>
              )}

              {saveStatus === "saved" && (
                <span className="save-status-pill">
                  <CheckCircle2 size={13} className="save-check" />
                  <span>Saved</span>
                </span>
              )}

              {saveStatus === "error" && (
                <span className="save-status-pill" style={{ color: "#ef4444" }}>
                  <AlertCircle size={13} />
                  <span>Error saving</span>
                </span>
              )}

              <span className="ats-check-pill" title="Rule-based ATS completeness estimate">
                <TrendingUp size={12} />
                <span>
                  {Math.min(
                    98,
                    Math.max(
                      70,
                      Math.round(
                        68 +
                          ([
                            resumeData.summary,
                            resumeData.college,
                            resumeData.degree,
                            resumeData.branch,
                            resumeData.cgpa,
                            resumeData.year,
                            resumeData.skills,
                            resumeData.projects,
                            resumeData.experience,
                          ].filter((f) => f && String(f).trim() !== "").length /
                            9) *
                            28
                      )
                    )
                  )}
                  % Match Est.
                </span>
              </span>
            </div>
          </div>

          {/* Template Switcher */}
          <div className="toolbar-template-picker">
            <div className="picker-label">
              <LayoutTemplate size={14} />
              <span>Template:</span>
            </div>
            <div className="template-btn-group">
              {templateOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`template-select-pill ${template === opt.id ? "is-selected" : ""}`}
                  onClick={() => setTemplate(opt.id)}
                >
                  <span>{opt.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Edit / Preview Mode Switcher */}
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

          {/* Toolbar Right Actions: Print & Download PDF */}
          <div className="toolbar-right-group">
            <button
              type="button"
              className="btn btn-sm btn-secondary print-action-btn"
              onClick={handlePrint}
              title="Print document"
            >
              <Printer size={15} />
              <span>Print</span>
            </button>

            <button
              className="btn btn-sm btn-primary download-action-btn"
              onClick={downloadPDF}
              disabled={isDownloading}
            >
              <FileDown size={15} />
              <span>{isDownloading ? "Exporting PDF..." : "Download PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {saveErrorMessage && (
        <div style={{ maxWidth: "1400px", margin: "1rem auto 0", padding: "0 1.5rem" }}>
          <div className="auth-error-alert" role="alert">
            <AlertCircle size={16} />
            <span>{saveErrorMessage}</span>
          </div>
        </div>
      )}

      {/* Main Dual-Column Builder Workspace */}
      <main className="builder-main-workspace">
        <div className="builder-grid-container">
          {/* Left Column: Form Editor */}
          <section
            className={`builder-form-pane ${
              mobileTab === "preview" ? "mobile-hidden" : ""
            }`}
          >
            {isLoadingResume ? (
              <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#64748b" }}>
                <Loader2 size={32} className="spin-animate" style={{ margin: "0 auto 1rem" }} />
                <p>Loading resume details from database...</p>
              </div>
            ) : (
              <ResumeForm
                resumeData={resumeData}
                setResumeData={setResumeData}
                onDownload={downloadPDF}
                onTogglePreviewMobile={() => setMobileTab("preview")}
                onSave={handleSaveResume}
                isSaving={isSaving}
              />
            )}
          </section>

          {/* Right Column: Live Sticky A4 Resume Preview */}
          <section
            className={`builder-preview-pane ${
              mobileTab === "form" ? "mobile-hidden-on-phone" : ""
            }`}
          >
            <div className="sticky-preview-container">
              <div className="preview-top-status-bar">
                <div className="preview-status-indicator">
                  <span className="live-pulse-dot" />
                  <span className="preview-bar-title">Live A4 Resume Preview</span>
                  <span className="preview-template-tag">
                    {templateOptions.find((t) => t.id === template)?.name}
                  </span>
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

              {/* Printable Resume Sheet Canvas Viewport */}
              <div className="resume-sheet-viewport">
                <ResumePreview
                  ref={resumeRef}
                  resumeData={resumeData}
                  template={template}
                />
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