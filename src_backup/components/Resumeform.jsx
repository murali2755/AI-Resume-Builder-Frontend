import { useState } from "react";
import {
  Sparkles,
  User,
  GraduationCap,
  Wrench,
  FolderGit2,
  Briefcase,
  CheckCircle,
  FileDown,
  Save,
  RotateCcw,
  Sparkle,
  ArrowRight,
  ArrowLeft,
  Check,
  Eye,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import { aiAPI, getErrorMessage } from "../api/api";

const skillSuggestions = [
  "React.js",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Spring Boot",
  "Java",
  "Python",
  "SQL",
  "MongoDB",
  "REST APIs",
  "Git & GitHub",
  "Docker",
  "Tailwind CSS",
  "Agile / Scrum"
];

const sampleResumeData = {
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

function ResumeForm({
  resumeData,
  setResumeData,
  onDownload,
  onTogglePreviewMobile,
  onSave,
  isSaving = false,
}) {
  const [activeStep, setActiveStep] = useState("personal");
  const [optimizingField, setOptimizingField] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiMessage, setAiMessage] = useState("");
  const [aiError, setAiError] = useState("");
  const [formError, setFormError] = useState("");

  const steps = [
    { id: "personal", label: "Personal", icon: <User size={15} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={15} /> },
    { id: "skills", label: "Skills", icon: <Wrench size={15} /> },
    { id: "projects", label: "Projects", icon: <FolderGit2 size={15} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={15} /> },
    { id: "finalize", label: "Finalize", icon: <CheckCircle size={15} /> },
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      [name]: value,
    });
  }

  // Genuine AI Improve integration with backend /api/ai/enhance
  const handleAiImprove = async (field) => {
    const currentContent = resumeData[field] || "";
    if (!currentContent.trim()) {
      setFormError(`Please enter some text in the ${field} section before requesting AI enhancement.`);
      setTimeout(() => setFormError(""), 4000);
      return;
    }

    setOptimizingField(field);
    setAiError("");
    setAiMessage("");
    setFormError("");

    try {
      const response = await aiAPI.enhance({
        field,
        content: currentContent,
        targetRole: resumeData.branch || resumeData.degree || "Software Engineer",
        technologies: resumeData.skills || "",
      });

      if (response && response.enhancedContent) {
        setAiSuggestion({
          field,
          original: currentContent,
          suggested: response.enhancedContent,
          provider: response.provider || "AI Provider",
          model: response.model || "Standard",
        });
        setAiMessage(`AI suggestion for ${field} ready! Review and apply below.`);
      } else {
        setAiError("Received empty response from AI service.");
      }
    } catch (err) {
      if (err.response?.status === 503 || err.response?.data?.errorCode === "AI_NOT_CONFIGURED") {
        setAiError("AI service is not configured on the backend. Please configure AI_API_KEY in your backend environment.");
      } else if (err.response?.status === 429 || err.response?.data?.errorCode === "RATE_LIMIT_EXCEEDED") {
        setAiError("AI rate limit reached. Please wait a moment before trying again.");
      } else {
        setAiError(getErrorMessage(err, "Failed to connect to AI service. Please verify backend is running."));
      }
    } finally {
      setOptimizingField(null);
    }
  };

  const handleApplyAiSuggestion = () => {
    if (!aiSuggestion) return;
    setResumeData((prev) => ({
      ...prev,
      [aiSuggestion.field]: aiSuggestion.suggested,
    }));
    setAiMessage(`Applied AI enhancement to ${aiSuggestion.field}! Remember to save your draft.`);
    setAiSuggestion(null);
    setTimeout(() => setAiMessage(""), 4000);
  };

  const handleCancelAiSuggestion = () => {
    setAiSuggestion(null);
  };

  // Add Skill Tag
  const handleAddSkill = (skill) => {
    const current = resumeData.skills || "";
    if (current.toLowerCase().includes(skill.toLowerCase())) return;
    const updated = current.trim() ? `${current.trim()}, ${skill}` : skill;
    setResumeData((prev) => ({ ...prev, skills: updated }));
  };

  // Remove Skill Tag
  const handleRemoveSkill = (skillToRemove) => {
    const currentSkills = (resumeData.skills || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s.toLowerCase() !== skillToRemove.toLowerCase());
    setResumeData((prev) => ({ ...prev, skills: currentSkills.join(", ") }));
  };

  // Parse skill tags for visual representation
  const parsedSkillTags = (resumeData.skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Load Sample Data
  const handleLoadSample = () => {
    setResumeData(sampleResumeData);
  };

  // Clear Form
  const handleClearForm = () => {
    if (window.confirm("Clear all form fields?")) {
      setResumeData({
        name: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
        college: "",
        degree: "",
        branch: "",
        cgpa: "",
        year: "",
        skills: "",
        projects: "",
        experience: "",
      });
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (resumeData.name.trim() === "") {
      setFormError("Please enter your full name.");
      setActiveStep("personal");
      return;
    }

    if (resumeData.email.trim() === "") {
      setFormError("Please enter your email.");
      setActiveStep("personal");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resumeData.email)) {
      setFormError("Please enter a valid email address.");
      setActiveStep("personal");
      return;
    }

    const cleanPhone = (resumeData.phone || "").replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setFormError("Please enter a valid phone number with at least 10 digits.");
      setActiveStep("personal");
      return;
    }

    if (resumeData.location.trim() === "") {
      setFormError("Please enter your location.");
      setActiveStep("personal");
      return;
    }

    if (resumeData.summary.trim() === "") {
      setFormError("Please enter your professional summary.");
      setActiveStep("personal");
      return;
    }

    if (resumeData.college.trim() === "") {
      setFormError("Please enter your college name.");
      setActiveStep("education");
      return;
    }

    if (resumeData.degree.trim() === "") {
      setFormError("Please enter your degree.");
      setActiveStep("education");
      return;
    }

    if (resumeData.branch.trim() === "") {
      setFormError("Please enter your branch.");
      setActiveStep("education");
      return;
    }

    if (resumeData.cgpa.trim() === "") {
      setFormError("Please enter your CGPA.");
      setActiveStep("education");
      return;
    }

    if (resumeData.year.trim() === "") {
      setFormError("Please enter your graduation year.");
      setActiveStep("education");
      return;
    }

    if (resumeData.skills.trim() === "") {
      setFormError("Please enter your skills.");
      setActiveStep("skills");
      return;
    }

    if (resumeData.projects.trim() === "") {
      setFormError("Please enter your projects.");
      setActiveStep("projects");
      return;
    }

    if (resumeData.experience.trim() === "") {
      setFormError("Please enter your experience.");
      setActiveStep("experience");
      return;
    }

    if (onSave) {
      try {
        await onSave(resumeData);
        setAiMessage("Resume saved to database successfully!");
        setActiveStep("finalize");
        setTimeout(() => setAiMessage(""), 4000);
      } catch (err) {
        setFormError(err?.message || "Failed to persist resume to database.");
      }
    } else {
      setActiveStep("finalize");
    }
  }

  // Step navigation helpers
  const stepOrder = ["personal", "education", "skills", "projects", "experience", "finalize"];
  const currentStepIndex = stepOrder.indexOf(activeStep);

  const goToNextStep = () => {
    if (currentStepIndex < stepOrder.length - 1) {
      setActiveStep(stepOrder[currentStepIndex + 1]);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setActiveStep(stepOrder[currentStepIndex - 1]);
    }
  };

  return (
    <div className="resume-form-card">
      {/* Workspace Top Toolbar */}
      <div className="form-top-toolbar">
        <div>
          <h2 className="editor-pane-title">Resume Editor</h2>
          <p className="editor-pane-subtitle">
            Configure your professional details and track live updates.
          </p>
        </div>

        <div className="editor-utility-buttons">
          <button
            type="button"
            className="btn btn-sm btn-outline util-btn"
            onClick={handleLoadSample}
            title="Pre-fill form with sample candidate data"
          >
            <Sparkle size={13} />
            <span>Load Sample Data</span>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-secondary util-btn"
            onClick={handleClearForm}
            title="Clear all fields"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
          {onTogglePreviewMobile && (
            <button
              type="button"
              className="btn btn-sm btn-primary mobile-toggle-preview"
              onClick={onTogglePreviewMobile}
            >
              <Eye size={14} />
              <span>Preview</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Step Navigation */}
      <nav className="editor-progress-nav" aria-label="Resume builder progress">
        <div className="progress-nav-track">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = step.id === activeStep;

            return (
              <button
                key={step.id}
                type="button"
                className={`progress-step-btn ${isCurrent ? "is-current" : ""} ${
                  isCompleted ? "is-completed" : ""
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className="step-circle-icon">
                  {isCompleted ? <Check size={13} /> : step.icon}
                </div>
                <span className="step-name">{step.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Global AI Success Notification Toast */}
      {aiMessage && (
        <div className="ai-feedback-banner">
          <Sparkles size={14} className="banner-sparkle" />
          <span>{aiMessage}</span>
        </div>
      )}

      {/* Global AI / Form Error Notification Toast */}
      {(aiError || formError) && (
        <div
          className="ai-feedback-banner"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "#dc2626",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
          role="alert"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={16} />
            <span>{aiError || formError}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setAiError("");
              setFormError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#dc2626",
              cursor: "pointer",
              padding: "2px",
            }}
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* AI Suggestion Preview & Comparison Card */}
      {aiSuggestion && (
        <div
          className="ai-suggestion-review-card"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            borderRadius: "12px",
            padding: "1.25rem",
            marginBottom: "1.5rem",
            boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <Sparkles size={16} />
              </div>
              <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#1e293b" }}>
                AI Enhancement Preview:{" "}
                <span style={{ textTransform: "capitalize", color: "#7c3aed" }}>
                  {aiSuggestion.field}
                </span>
              </h4>
              <span
                className="badge"
                style={{
                  background: "rgba(124, 58, 237, 0.08)",
                  color: "#7c3aed",
                  border: "1px solid rgba(124, 58, 237, 0.2)",
                  fontSize: "0.72rem",
                }}
              >
                {aiSuggestion.provider} • {aiSuggestion.model}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCancelAiSuggestion}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
                padding: "4px",
              }}
              title="Close preview"
              aria-label="Close suggestion preview"
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: "#64748b",
                  marginBottom: "0.5rem",
                }}
              >
                CURRENT DRAFT
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                  color: "#475569",
                  whiteSpace: "pre-wrap",
                  maxHeight: "180px",
                  overflowY: "auto",
                }}
              >
                {aiSuggestion.original || "(Empty)"}
              </div>
            </div>

            <div
              style={{
                background: "rgba(124, 58, 237, 0.03)",
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                border: "1px solid rgba(124, 58, 237, 0.25)",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: "#7c3aed",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Sparkles size={12} /> AI SUGGESTION
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                  color: "#0f172a",
                  whiteSpace: "pre-wrap",
                  maxHeight: "180px",
                  overflowY: "auto",
                  fontWeight: 500,
                }}
              >
                {aiSuggestion.suggested}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              paddingTop: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Note: Applying updates your editor draft. It is only saved to the database when you click Save.
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={handleCancelAiSuggestion}
              >
                Discard / Keep Original
              </button>
              <button
                type="button"
                className="btn btn-sm btn-ai"
                onClick={handleApplyAiSuggestion}
              >
                <Check size={14} />
                <span>Apply Suggestion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Content Pane */}
      <form onSubmit={handleSubmit} className="editor-sections-form">
        {/* 1. PERSONAL INFORMATION & PROFESSIONAL SUMMARY */}
        {activeStep === "personal" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <User size={17} className="box-title-icon" />
                <h3>Personal Information</h3>
              </div>
              <p className="box-helper">
                Your direct contact info and introductory summary statement.
              </p>
            </div>

            <div className="form-fields-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="field-name">
                  Full Name <span className="req-star">*</span>
                </label>
                <input
                  id="field-name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Murali Krishna"
                  value={resumeData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="field-email">
                  Email Address <span className="req-star">*</span>
                </label>
                <input
                  id="field-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={resumeData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-fields-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="field-phone">
                  Phone Number <span className="req-star">*</span>
                </label>
                <input
                  id="field-phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={resumeData.phone}
                  onChange={handleChange}
                  maxLength={15}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="field-location">
                  Location <span className="req-star">*</span>
                </label>
                <input
                  id="field-location"
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="City, State / Country"
                  value={resumeData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Professional Summary nested in Personal Info */}
            <div className="form-group summary-group">
              <div className="form-label">
                <span>Professional Summary <span className="req-star">*</span></span>
                <button
                  type="button"
                  className="btn btn-sm btn-ai ai-inline-action"
                  onClick={() => handleAiImprove("summary")}
                  disabled={optimizingField !== null}
                  title="Enhance summary with ATS impact keywords"
                >
                  {optimizingField === "summary" ? (
                    <>
                      <Loader2 size={13} className="spin-animate" />
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>Improve with AI</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows="5"
                name="summary"
                className="form-textarea"
                placeholder="Write your professional summary or use 'Improve with AI' to generate a tailored ATS statement..."
                value={resumeData.summary}
                onChange={handleChange}
                required
              />
              <span className="field-hint-text">
                Highlight your core stack, target role, and key technical capabilities in 2-3 sentences.
              </span>
            </div>
          </div>
        )}

        {/* 2. EDUCATION */}
        {activeStep === "education" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <GraduationCap size={17} className="box-title-icon" />
                <h3>Education</h3>
              </div>
              <p className="box-helper">
                Your college, degree program, graduation year, and academic standing.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="field-college">
                College / University Name <span className="req-star">*</span>
              </label>
              <input
                id="field-college"
                type="text"
                name="college"
                className="form-input"
                placeholder="e.g. National Institute of Technology"
                value={resumeData.college}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-fields-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="field-degree">
                  Degree <span className="req-star">*</span>
                </label>
                <input
                  id="field-degree"
                  type="text"
                  name="degree"
                  className="form-input"
                  placeholder="e.g. B.Tech / B.E. / M.S."
                  value={resumeData.degree}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="field-branch">
                  Branch / Major <span className="req-star">*</span>
                </label>
                <input
                  id="field-branch"
                  type="text"
                  name="branch"
                  className="form-input"
                  placeholder="e.g. Computer Science & Engineering"
                  value={resumeData.branch}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-fields-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="field-cgpa">
                  CGPA / Grade <span className="req-star">*</span>
                </label>
                <input
                  id="field-cgpa"
                  type="text"
                  name="cgpa"
                  className="form-input"
                  placeholder="e.g. 8.5 / 85%"
                  value={resumeData.cgpa}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="field-year">
                  Graduation Year <span className="req-star">*</span>
                </label>
                <input
                  id="field-year"
                  type="text"
                  name="year"
                  className="form-input"
                  placeholder="e.g. 2025"
                  value={resumeData.year}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. SKILLS */}
        {activeStep === "skills" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <Wrench size={17} className="box-title-icon" />
                <h3>Skills</h3>
              </div>
              <p className="box-helper">
                Technologies, programming languages, and industry frameworks.
              </p>
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Technical Skills (Comma-Separated) <span className="req-star">*</span></span>
                <button
                  type="button"
                  className="btn btn-sm btn-ai ai-inline-action"
                  onClick={() => handleAiImprove("skills")}
                  disabled={optimizingField !== null}
                  title="Format and standardize skills list with AI"
                >
                  {optimizingField === "skills" ? (
                    <>
                      <Loader2 size={13} className="spin-animate" />
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>Improve with AI</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows="4"
                name="skills"
                className="form-textarea"
                placeholder="React, JavaScript, TypeScript, Node.js, Spring Boot, SQL, Git..."
                value={resumeData.skills}
                onChange={handleChange}
                required
              />
            </div>

            {/* Visual representation of entered skills as tags */}
            {parsedSkillTags.length > 0 && (
              <div className="active-skills-visual-box">
                <div className="skills-visual-header">Active Skills ({parsedSkillTags.length})</div>
                <div className="active-skills-pills-list">
                  {parsedSkillTags.map((skill, index) => (
                    <span key={index} className="active-skill-pill">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="remove-skill-tag-btn"
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Add Suggestions */}
            <div className="suggested-skills-block">
              <div className="suggested-title">
                <Sparkles size={13} />
                <span>Quick-Add Recommended Skills:</span>
              </div>
              <div className="suggested-chips-list">
                {skillSuggestions.map((item) => {
                  const alreadyAdded = (resumeData.skills || "")
                    .toLowerCase()
                    .includes(item.toLowerCase());
                  return (
                    <button
                      key={item}
                      type="button"
                      className={`suggested-chip ${alreadyAdded ? "already-added" : ""}`}
                      onClick={() => handleAddSkill(item)}
                    >
                      <span>{alreadyAdded ? "✓" : "+"}</span>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. PROJECTS */}
        {activeStep === "projects" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <FolderGit2 size={17} className="box-title-icon" />
                <h3>Key Projects</h3>
              </div>
              <p className="box-helper">
                Detail 1-3 impactful technical projects highlighting tools and solutions.
              </p>
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Project Descriptions <span className="req-star">*</span></span>
                <button
                  type="button"
                  className="btn btn-sm btn-ai ai-inline-action"
                  onClick={() => handleAiImprove("projects")}
                  disabled={optimizingField !== null}
                  title="Optimize project bullets with action verbs & metrics"
                >
                  {optimizingField === "projects" ? (
                    <>
                      <Loader2 size={13} className="spin-animate" />
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>Improve with AI</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows="8"
                name="projects"
                className="form-textarea"
                placeholder="• Project Title: Describe technology stack, architecture decisions, and results."
                value={resumeData.projects}
                onChange={handleChange}
                required
              />
              <span className="field-hint-text">
                Tip: Start lines with bullet points (•) and action verbs like "Architected", "Engineered", "Deployed".
              </span>
            </div>
          </div>
        )}

        {/* 5. EXPERIENCE */}
        {activeStep === "experience" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <Briefcase size={17} className="box-title-icon" />
                <h3>Experience & Internships</h3>
              </div>
              <p className="box-helper">
                Corporate internships, freelance work, student leadership, or research.
              </p>
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Experience Details <span className="req-star">*</span></span>
                <button
                  type="button"
                  className="btn btn-sm btn-ai ai-inline-action"
                  onClick={() => handleAiImprove("experience")}
                  disabled={optimizingField !== null}
                  title="Enhance experience achievements for recruiter screening"
                >
                  {optimizingField === "experience" ? (
                    <>
                      <Loader2 size={13} className="spin-animate" />
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>Improve with AI</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows="8"
                name="experience"
                className="form-textarea"
                placeholder="• Software Engineering Intern at TechCorp (Date): Responsibilities, achievements, and impact."
                value={resumeData.experience}
                onChange={handleChange}
                required
              />
              <span className="field-hint-text">
                Quantify results where possible (e.g. "improved load times by 25%", "served 1,000+ daily users").
              </span>
            </div>
          </div>
        )}

        {/* 6. FINALIZE & EXPORT */}
        {activeStep === "finalize" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <CheckCircle size={17} className="box-title-icon" />
                <h3>Review & Finalize</h3>
              </div>
              <p className="box-helper">
                Confirm your resume sections and export your document.
              </p>
            </div>

            <div className="finalize-summary-card">
              <div className="checklist-row">
                <Check size={16} className="checklist-check-icon" />
                <span>Contact details and summary filled</span>
              </div>
              <div className="checklist-row">
                <Check size={16} className="checklist-check-icon" />
                <span>Education credentials documented</span>
              </div>
              <div className="checklist-row">
                <Check size={16} className="checklist-check-icon" />
                <span>Technical skills categorized and formatted</span>
              </div>
              <div className="checklist-row">
                <Check size={16} className="checklist-check-icon" />
                <span>Projects and experience bullets structured</span>
              </div>
              <div className="checklist-row">
                <Check size={16} className="checklist-check-icon" />
                <span>A4 ATS document layout validated</span>
              </div>
            </div>

            <div className="finalize-cta-box">
              <p className="finalize-cta-text">
                Your ATS-ready resume is ready. Download it directly as a vector PDF or save your draft.
              </p>
              {onDownload && (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={onDownload}
                >
                  <FileDown size={18} />
                  <span>Download PDF Document</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Actions: Save Resume (Primary), Preview (Secondary), Download PDF (Export) */}
        <div className="editor-action-footer">
          <div className="action-footer-left">
            {currentStepIndex > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={goToPrevStep}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>
            )}
          </div>

          <div className="action-footer-right">
            {/* Primary Button: Save Resume */}
            <button
              type="submit"
              className="btn btn-primary save-resume-primary-btn"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? "Saving to Database..." : "Save Resume"}</span>
            </button>

            {/* Secondary Action: Next or Finalize */}
            {currentStepIndex < stepOrder.length - 1 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={goToNextStep}
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              onDownload && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onDownload}
                >
                  <FileDown size={16} />
                  <span>Download PDF</span>
                </button>
              )
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResumeForm;