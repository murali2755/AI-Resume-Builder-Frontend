import { forwardRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ResumePreview = forwardRef(({ resumeData, template = "modern" }, ref) => {
  const name = resumeData.name || "Your Full Name";
  const email = resumeData.email || "your.email@example.com";
  const phone = resumeData.phone || "+91 98765 43210";
  const location = resumeData.location || "City, State";
  const summary =
    resumeData.summary ||
    "Motivated software engineer with experience developing responsive web applications, clean RESTful services, and modern frontends. Passionate about writing maintainable code and solving algorithmic problems.";
  const college = resumeData.college || "Your University / College Name";
  const degree = resumeData.degree || "B.Tech";
  const branch = resumeData.branch || "Computer Science";
  const cgpa = resumeData.cgpa || "8.5";
  const year = resumeData.year || "2025";
  const skills =
    resumeData.skills ||
    "React, JavaScript (ES6+), TypeScript, Node.js, Spring Boot, HTML5, CSS3, Git, REST APIs, SQL";
  const projects =
    resumeData.projects ||
    "• AI Resume Builder: Developed automated ATS resume builder with real-time preview and PDF export using React.\n• Task Management App: Created a collaborative task scheduler with real-time notifications and JWT authentication.";
  const experience =
    resumeData.experience ||
    "• Software Engineering Intern at Tech Corp: Optimized front-end load times by 30%, implemented modular React components, and collaborated with senior engineers in Agile sprints.";

  // Helper to render lines with line breaks
  const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => (
      <p key={index} className="preview-line-item">
        {line}
      </p>
    ));
  };

  return (
    <div
      className={`printable-resume-sheet template-${template}`}
      ref={ref}
      id="resume-preview-node"
    >
      {/* Header / Contact Section */}
      <header className="resume-sheet-header">
        <h1 className="resume-sheet-name">{name}</h1>
        <div className="resume-sheet-contact">
          <span className="contact-item">
            <Mail size={12} className="ats-print-icon" />
            <span>{email}</span>
          </span>
          <span className="contact-sep">•</span>
          <span className="contact-item">
            <Phone size={12} className="ats-print-icon" />
            <span>{phone}</span>
          </span>
          <span className="contact-sep">•</span>
          <span className="contact-item">
            <MapPin size={12} className="ats-print-icon" />
            <span>{location}</span>
          </span>
        </div>
      </header>

      {/* Professional Summary */}
      <section className="resume-sheet-section">
        <h2 className="resume-section-heading">Professional Summary</h2>
        <div className="resume-section-body">
          <p className="resume-summary-text">{summary}</p>
        </div>
      </section>

      {/* Education */}
      <section className="resume-sheet-section">
        <h2 className="resume-section-heading">Education</h2>
        <div className="resume-section-body">
          <div className="edu-entry">
            <div className="edu-row">
              <span className="edu-degree">
                {degree} {branch ? `in ${branch}` : ""}
              </span>
              <span className="edu-year">{year}</span>
            </div>
            <div className="edu-row sub-row">
              <span className="edu-college">{college}</span>
              {cgpa && <span className="edu-cgpa">CGPA: {cgpa}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Skills */}
      <section className="resume-sheet-section">
        <h2 className="resume-section-heading">Technical Skills</h2>
        <div className="resume-section-body">
          <p className="resume-skills-text">{skills}</p>
        </div>
      </section>

      {/* Projects */}
      <section className="resume-sheet-section">
        <h2 className="resume-section-heading">Key Projects</h2>
        <div className="resume-section-body project-body">
          {renderFormattedText(projects)}
        </div>
      </section>

      {/* Experience */}
      <section className="resume-sheet-section">
        <h2 className="resume-section-heading">Experience & Internships</h2>
        <div className="resume-section-body experience-body">
          {renderFormattedText(experience)}
        </div>
      </section>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;