import { useState } from "react";
import {
  User,
  FileText,
  GraduationCap,
  Wrench,
  FolderGit2,
  Briefcase,
  CheckCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Loader2,
  RotateCcw,
  Sparkle,
  ArrowRight,
  ArrowLeft,
  Save,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import TagInput from "./TagInput";
import { aiAPI, getErrorMessage } from "../api/api";

const skillSuggestions = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Spring Boot",
  "Java",
  "Python",
  "PostgreSQL",
  "Docker",
  "REST APIs",
  "Git",
  "AWS",
  "Vitest",
  "Tailwind CSS"
];

const sampleResumeData = {
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

function parseBulletItems(text) {
  if (!text) return [];
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  return lines.map((line, idx) => {
    const clean = line.replace(/^[•\-*]\s*/, "");
    const colonIdx = clean.indexOf(":");
    if (colonIdx > 0 && colonIdx < 60) {
      return {
        id: idx + 1,
        title: clean.substring(0, colonIdx).trim(),
        description: clean.substring(colonIdx + 1).trim(),
      };
    }
    return {
      id: idx + 1,
      title: "",
      description: clean,
    };
  });
}

function serializeBulletItems(items) {
  return items
    .map((item) => {
      const t = item.title?.trim();
      const d = item.description?.trim();
      if (t && d) return `• ${t}: ${d}`;
      if (t) return `• ${t}`;
      if (d) return `• ${d}`;
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function ResumeForm({
  resumeData,
  setResumeData,
  onDownload,
  onSave,
  isSaving = false,
  activeSection = "personal",
  onSectionChange,
}) {
  const [internalStep, setInternalStep] = useState("personal");
  const activeStep = activeSection || internalStep;
  const [optimizingField, setOptimizingField] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiMessage, setAiMessage] = useState("");
  const [aiError, setAiError] = useState("");
  const [formError, setFormError] = useState("");

  const changeStep = (stepId) => {
    setInternalStep(stepId);
    if (onSectionChange) onSectionChange(stepId);
  };

  const steps = [
    { id: "personal", label: "Personal", icon: <User size={15} strokeWidth={1.5} /> },
    { id: "summary", label: "Summary", icon: <FileText size={15} strokeWidth={1.5} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={15} strokeWidth={1.5} /> },
    { id: "skills", label: "Skills", icon: <Wrench size={15} strokeWidth={1.5} /> },
    { id: "projects", label: "Projects", icon: <FolderGit2 size={15} strokeWidth={1.5} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={15} strokeWidth={1.5} /> },
    { id: "finalize", label: "Finalize", icon: <CheckCircle size={15} strokeWidth={1.5} /> },
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      [name]: value,
    });
  }

  // Skills tag handling
  const skillsArray = (resumeData.skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleSkillsChange = (newTags) => {
    setResumeData((prev) => ({
      ...prev,
      skills: newTags.join(", "),
    }));
  };

  // Structured Projects handling
  const projectsList = parseBulletItems(resumeData.projects);

  const handleAddProject = () => {
    const updated = [
      ...projectsList,
      { id: projectsList.length + 1, title: "New Project", description: "Describe achievements and technologies." },
    ];
    setResumeData((prev) => ({
      ...prev,
      projects: serializeBulletItems(updated),
    }));
  };

  const handleUpdateProject = (index, field, value) => {
    const updated = [...projectsList];
    updated[index] = { ...updated[index], [field]: value };
    setResumeData((prev) => ({
      ...prev,
      projects: serializeBulletItems(updated),
    }));
  };

  const handleRemoveProject = (index) => {
    const updated = projectsList.filter((_, idx) => idx !== index);
    setResumeData((prev) => ({
      ...prev,
      projects: serializeBulletItems(updated),
    }));
  };

  const handleMoveProject = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= projectsList.length) return;
    const updated = [...projectsList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setResumeData((prev) => ({
      ...prev,
      projects: serializeBulletItems(updated),
    }));
  };

  // Structured Experience handling
  const experienceList = parseBulletItems(resumeData.experience);

  const handleAddExperience = () => {
    const updated = [
      ...experienceList,
      { id: experienceList.length + 1, title: "Software Engineer at Organization", description: "Key responsibilities and quantified impact." },
    ];
    setResumeData((prev) => ({
      ...prev,
      experience: serializeBulletItems(updated),
    }));
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...experienceList];
    updated[index] = { ...updated[index], [field]: value };
    setResumeData((prev) => ({
      ...prev,
      experience: serializeBulletItems(updated),
    }));
  };

  const handleRemoveExperience = (index) => {
    const updated = experienceList.filter((_, idx) => idx !== index);
    setResumeData((prev) => ({
      ...prev,
      experience: serializeBulletItems(updated),
    }));
  };

  const handleMoveExperience = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= experienceList.length) return;
    const updated = [...experienceList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setResumeData((prev) => ({
      ...prev,
      experience: serializeBulletItems(updated),
    }));
  };

  // AI Content Enhancement
  const handleAiImprove = async (field) => {
    const currentContent = resumeData[field] || "";
    if (!currentContent.trim()) {
      setFormError(`Please enter initial content in the ${field} section before requesting enhancement.`);
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
        setAiMessage(`AI enhancement for ${field} ready. Review and apply below.`);
      } else {
        setAiError("Received empty response from AI service.");
      }
    } catch (err) {
      if (err.response?.status === 503 || err.response?.data?.errorCode === "AI_NOT_CONFIGURED") {
        setAiError("AI service is not configured on the backend. Please configure AI_API_KEY in backend environment.");
      } else {
        setAiError(getErrorMessage(err, "Failed to connect to AI service."));
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
    setAiMessage(`Applied enhancement to ${aiSuggestion.field}.`);
    setAiSuggestion(null);
    setTimeout(() => setAiMessage(""), 3500);
  };

  const handleLoadSample = () => {
    setResumeData(sampleResumeData);
  };

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

  const stepOrder = ["personal", "summary", "education", "skills", "projects", "experience", "finalize"];
  const currentStepIndex = stepOrder.indexOf(activeStep);

  const goToNextStep = () => {
    if (currentStepIndex < stepOrder.length - 1) {
      changeStep(stepOrder[currentStepIndex + 1]);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      changeStep(stepOrder[currentStepIndex - 1]);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!resumeData.name?.trim()) {
      setFormError("Please enter your full name.");
      changeStep("personal");
      return;
    }

    if (!resumeData.email?.trim()) {
      setFormError("Please enter your email.");
      changeStep("personal");
      return;
    }

    if (onSave) {
      try {
        await onSave(resumeData);
        setAiMessage("Resume saved to database successfully.");
        setTimeout(() => setAiMessage(""), 3500);
      } catch (err) {
        setFormError(err?.message || "Failed to persist resume.");
      }
    }
  }

  return (
    <div className="resume-form-card" data-testid="resume-form">
      {/* Editor Top Utility Header */}
      <div className="form-top-toolbar">
        <div>
          <h2 className="editor-pane-title">Resume Editor</h2>
          <p className="editor-pane-subtitle">
            Configure your professional history. Changes reflect immediately on the right.
          </p>
        </div>

        <div className="editor-utility-buttons">
          <button
            type="button"
            className="btn btn-sm btn-secondary util-btn"
            onClick={handleLoadSample}
            title="Pre-fill form with sample candidate data"
          >
            <Sparkle size={13} />
            <span>Load Sample</span>
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
        </div>
      </div>

      {/* Section Navigator Bar */}
      <nav className="editor-progress-nav" aria-label="Resume sections navigation">
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
                onClick={() => changeStep(step.id)}
                id={`step-nav-${step.id}`}
              >
                <span className="step-circle-icon">{step.icon}</span>
                <span className="step-name">{step.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Global AI Notification Toast */}
      {aiMessage && (
        <div className="alert alert-success" role="status">
          <Sparkles size={14} style={{ flexShrink: 0 }} />
          <span>{aiMessage}</span>
        </div>
      )}

      {/* Global Form/AI Error Notification */}
      {(aiError || formError) && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{aiError || formError}</span>
          <button
            type="button"
            onClick={() => {
              setAiError("");
              setFormError("");
            }}
            className="alert-dismiss-btn"
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* AI Suggestion Comparison Card */}
      {aiSuggestion && (
        <div className="ai-suggestion-review-card" role="region" aria-label="AI suggestion preview">
          <div className="ai-review-header">
            <div className="ai-review-title">
              <Sparkles size={15} className="ai-icon" />
              <span>AI Suggestion for {aiSuggestion.field}</span>
            </div>
            <button
              type="button"
              className="ai-review-close"
              onClick={() => setAiSuggestion(null)}
              aria-label="Close suggestion preview"
            >
              <X size={15} />
            </button>
          </div>

          <div className="ai-comparison-grid">
            <div className="comparison-box current-box">
              <span className="comparison-label">Current Draft</span>
              <p className="comparison-content">{aiSuggestion.original || "(Empty)"}</p>
            </div>
            <div className="comparison-box suggested-box">
              <span className="comparison-label">AI Enhanced Content</span>
              <p className="comparison-content">{aiSuggestion.suggested}</p>
            </div>
          </div>

          <div className="ai-review-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setAiSuggestion(null)}
            >
              Keep Original
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleApplyAiSuggestion}
            >
              <Check size={14} />
              <span>Apply Suggestion</span>
            </button>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="editor-sections-form">
        {/* 1. PERSONAL INFORMATION */}
        {activeStep === "personal" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <User size={16} strokeWidth={1.5} className="box-title-icon" />
                <h3>Personal Information</h3>
              </div>
              <p className="box-helper">
                Your direct contact details displayed prominently at the top of the resume.
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
                  Phone Number
                </label>
                <input
                  id="field-phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={resumeData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="field-location">
                  Location (City, Country)
                </label>
                <input
                  id="field-location"
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="e.g. Bangalore, India"
                  value={resumeData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. SUMMARY */}
        {activeStep === "summary" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <FileText size={16} strokeWidth={1.5} className="box-title-icon" />
                <h3>Professional Summary</h3>
              </div>
              <p className="box-helper">
                A 2–3 sentence overview of your primary specialization and track record.
              </p>
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Summary Statement</span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm ai-inline-action"
                  onClick={() => handleAiImprove("summary")}
                  disabled={optimizingField !== null}
                  title="Enhance summary with target keywords"
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
                id="field-summary"
                rows="5"
                name="summary"
                className="form-textarea"
                placeholder="Software engineer with experience building..."
                value={resumeData.summary}
                onChange={handleChange}
              />
              <span className="form-hint">
                Avoid generic buzzwords. Highlight specific frameworks, domains, and quantifiable achievements.
              </span>
            </div>
          </div>
        )}

        {/* 3. EDUCATION */}
        {activeStep === "education" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <GraduationCap size={16} strokeWidth={1.5} className="box-title-icon" />
                <h3>Education Credentials</h3>
              </div>
              <p className="box-helper">
                College, degree, major, graduation year, and GPA.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="field-college">
                College or University Name
              </label>
              <input
                id="field-college"
                type="text"
                name="college"
                className="form-input"
                placeholder="e.g. National Institute of Technology"
                value={resumeData.college}
                onChange={handleChange}
              />
            </div>

            <div className="form-fields-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="field-degree">
                  Degree
                </label>
                <input
                  id="field-degree"
                  type="text"
                  name="degree"
                  className="form-input"
                  placeholder="e.g. B.Tech / B.E. / M.S."
                  value={resumeData.degree}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="field-branch">
                  Branch / Major
                </label>
                <input
                  id="field-branch"
                  type="text"
                  name="branch"
                  className="form-input"
                  placeholder="e.g. Computer Science & Engineering"
                  value={resumeData.branch}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-fields-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="field-cgpa">
                  CGPA / Grade
                </label>
                <input
                  id="field-cgpa"
                  type="text"
                  name="cgpa"
                  className="form-input"
                  placeholder="e.g. 8.9"
                  value={resumeData.cgpa}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="field-year">
                  Graduation Year
                </label>
                <input
                  id="field-year"
                  type="text"
                  name="year"
                  className="form-input"
                  placeholder="e.g. 2024"
                  value={resumeData.year}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. SKILLS (TAG INPUT) */}
        {activeStep === "skills" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <Wrench size={16} strokeWidth={1.5} className="box-title-icon" />
                <h3>Technical & Domain Skills</h3>
              </div>
              <p className="box-helper">
                Add skills as tags. Press Enter or comma to add; Backspace or click x to remove.
              </p>
            </div>

            <TagInput
              tags={skillsArray}
              onChange={handleSkillsChange}
              suggestions={skillSuggestions}
              label="Skills Tags"
              id="field-skills"
              placeholder="Type skill (e.g. React) and press Enter..."
              helperText="ATS parsers index these directly against job description keywords."
            />
          </div>
        )}

        {/* 5. KEY PROJECTS (REPEATABLE / COLLAPSIBLE / REORDERABLE) */}
        {activeStep === "projects" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <FolderGit2 size={16} strokeWidth={1.5} className="box-title-icon" />
                <h3>Key Projects</h3>
              </div>
              <p className="box-helper">
                Detail impactful technical projects. Reorder items with up/down arrows.
              </p>
            </div>

            <div className="collapsible-items-stack" data-testid="projects-list">
              {projectsList.map((project, idx) => (
                <div key={project.id || idx} className="collapsible-card" data-testid={`project-item-${idx}`}>
                  <div className="collapsible-card-top">
                    <span className="item-order-badge">#{idx + 1}</span>
                    <input
                      type="text"
                      className="form-input inline-title-input"
                      placeholder="Project Title"
                      value={project.title}
                      onChange={(e) => handleUpdateProject(idx, "title", e.target.value)}
                      aria-label={`Project ${idx + 1} title`}
                    />

                    <div className="item-controls">
                      <button
                        type="button"
                        className="btn btn-secondary btn-icon item-move-btn"
                        onClick={() => handleMoveProject(idx, -1)}
                        disabled={idx === 0}
                        title="Move Up"
                        aria-label="Move project up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-icon item-move-btn"
                        onClick={() => handleMoveProject(idx, 1)}
                        disabled={idx === projectsList.length - 1}
                        title="Move Down"
                        aria-label="Move project down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-icon item-remove-btn"
                        onClick={() => handleRemoveProject(idx)}
                        title="Remove project"
                        aria-label="Remove project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="collapsible-card-body">
                    <textarea
                      rows="3"
                      className="form-textarea"
                      placeholder="Describe technologies used, architecture, and measurable results..."
                      value={project.description}
                      onChange={(e) => handleUpdateProject(idx, "description", e.target.value)}
                      aria-label={`Project ${idx + 1} description`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm add-item-btn"
              onClick={handleAddProject}
              id="add-project-btn"
            >
              <Plus size={14} />
              <span>Add Another Project</span>
            </button>
          </div>
        )}

        {/* 6. EXPERIENCE (REPEATABLE / COLLAPSIBLE / REORDERABLE) */}
        {activeStep === "experience" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <Briefcase size={16} strokeWidth={1.5} className="box-title-icon" />
                <h3>Work Experience & Internships</h3>
              </div>
              <p className="box-helper">
                Corporate roles, research, or internships. Add your most recent role first.
              </p>
            </div>

            <div className="collapsible-items-stack" data-testid="experience-list">
              {experienceList.map((exp, idx) => (
                <div key={exp.id || idx} className="collapsible-card" data-testid={`experience-item-${idx}`}>
                  <div className="collapsible-card-top">
                    <span className="item-order-badge">#{idx + 1}</span>
                    <input
                      type="text"
                      className="form-input inline-title-input"
                      placeholder="Role & Organization (e.g. Software Engineer at TechCorp)"
                      value={exp.title}
                      onChange={(e) => handleUpdateExperience(idx, "title", e.target.value)}
                      aria-label={`Experience ${idx + 1} title`}
                    />

                    <div className="item-controls">
                      <button
                        type="button"
                        className="btn btn-secondary btn-icon item-move-btn"
                        onClick={() => handleMoveExperience(idx, -1)}
                        disabled={idx === 0}
                        title="Move Up"
                        aria-label="Move experience up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-icon item-move-btn"
                        onClick={() => handleMoveExperience(idx, 1)}
                        disabled={idx === experienceList.length - 1}
                        title="Move Down"
                        aria-label="Move experience down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-icon item-remove-btn"
                        onClick={() => handleRemoveExperience(idx)}
                        title="Remove experience"
                        aria-label="Remove experience"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="collapsible-card-body">
                    <textarea
                      rows="3"
                      className="form-textarea"
                      placeholder="Quantified achievements (e.g. Accelerated application render latency by 32%...)"
                      value={exp.description}
                      onChange={(e) => handleUpdateExperience(idx, "description", e.target.value)}
                      aria-label={`Experience ${idx + 1} description`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm add-item-btn"
              onClick={handleAddExperience}
              id="add-experience-btn"
            >
              <Plus size={14} />
              <span>Add Another Role</span>
            </button>
          </div>
        )}

        {/* 7. FINALIZE */}
        {activeStep === "finalize" && (
          <div className="editor-section-box">
            <div className="section-box-header">
              <div className="box-title-wrap">
                <CheckCircle size={16} strokeWidth={1.5} className="box-title-icon" />
                <h3>Review & Export</h3>
              </div>
              <p className="box-helper">
                Confirm your document formatting and download your vector PDF.
              </p>
            </div>

            <div className="finalize-checklist">
              <div className="check-item">
                <Check size={15} className="check-icon" />
                <span>Personal contact details and introductory summary</span>
              </div>
              <div className="check-item">
                <Check size={15} className="check-icon" />
                <span>Verified academic credentials and major</span>
              </div>
              <div className="check-item">
                <Check size={15} className="check-icon" />
                <span>Categorized technical skills tags</span>
              </div>
              <div className="check-item">
                <Check size={15} className="check-icon" />
                <span>Chronological experience & project achievement bullets</span>
              </div>
            </div>

            <div className="finalize-export-bar">
              <p className="finalize-note">
                Your ATS-compliant document is ready. Save it to your workspace or export directly to PDF.
              </p>
              {onDownload && (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={onDownload}
                >
                  <span>Download PDF Document</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="editor-action-footer">
          <div className="action-footer-left">
            {currentStepIndex > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={goToPrevStep}
              >
                <ArrowLeft size={14} />
                <span>Previous Section</span>
              </button>
            )}
          </div>

          <div className="action-footer-right">
            <button
              type="submit"
              className="btn btn-primary btn-sm save-resume-primary-btn"
              disabled={isSaving}
              id="save-resume-btn"
            >
              <Save size={14} />
              <span>{isSaving ? "Saving..." : "Save Resume"}</span>
            </button>

            {currentStepIndex < stepOrder.length - 1 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={goToNextStep}
              >
                <span>Next Section</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResumeForm;