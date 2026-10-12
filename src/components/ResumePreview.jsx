import { forwardRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ResumePreview = forwardRef(({ resumeData, template = "modern" }, ref) => {
  const name = resumeData?.name || "Candidate Name";
  const email = resumeData?.email || "candidate@example.com";
  const phone = resumeData?.phone || "+91 98765 43210";
  const location = resumeData?.location || "Bangalore, India";
  const summary =
    resumeData?.summary ||
    "Results-driven software engineer with extensive experience building scalable web applications and high-throughput REST APIs. Dedicated to writing clean, maintainable code and collaborating in agile teams.";
  const college = resumeData?.college || "National Institute of Technology";
  const degree = resumeData?.degree || "B.Tech";
  const branch = resumeData?.branch || "Computer Science & Engineering";
  const cgpa = resumeData?.cgpa || "8.9";
  const year = resumeData?.year || "2024";
  const skills =
    resumeData?.skills ||
    "React, JavaScript, TypeScript, Node.js, Spring Boot, Java, PostgreSQL, REST APIs, Git, Docker";
  const projects =
    resumeData?.projects ||
    "• AI Resume Builder: Architected ATS-compliant resume builder with live preview and multi-page vector PDF export.\n• Microservices Gateway: Built high-throughput routing service processing 1,200+ concurrent requests.";
  const experience =
    resumeData?.experience ||
    "• Software Engineer at TechCorp (2024 - Present): Built modular design system components reducing client bundle size by 30%.\n• Engineering Intern at CloudScale (2023 - 2024): Implemented automated CI/CD deployment pipelines and unit test suites.";

  // Helper to render formatted bullet points
  const renderFormattedBullets = (text) => {
    if (!text) return null;
    const lines = text.split("\n").filter((l) => l.trim() !== "");
    return (
      <div className="resume-bullets-list">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[•\-*]\s*/, "");
          return (
            <div key={idx} className="resume-bullet-row">
              <span className="bullet-symbol">•</span>
              <span className="bullet-text">{cleanLine}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const skillsList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className={`printable-resume-sheet template-${template}`}
      ref={ref}
      id="resume-preview-node"
      data-testid={`preview-template-${template}`}
    >
      {/* Header / Contact Area */}
      <header className="resume-sheet-header">
        <h1 className="resume-sheet-name">{name}</h1>

        <div className="resume-sheet-contact">
          {email && (
            <span className="contact-item">
              <Mail size={12} className="print-icon" />
              <span>{email}</span>
            </span>
          )}
          {phone && (
            <>
              <span className="contact-sep">•</span>
              <span className="contact-item">
                <Phone size={12} className="print-icon" />
                <span>{phone}</span>
              </span>
            </>
          )}
          {location && (
            <>
              <span className="contact-sep">•</span>
              <span className="contact-item">
                <MapPin size={12} className="print-icon" />
                <span>{location}</span>
              </span>
            </>
          )}
        </div>
      </header>

      {/* 1. Professional Summary */}
      {summary && (
        <section className="resume-sheet-section">
          <h2 className="resume-section-heading">Professional Summary</h2>
          <div className="resume-section-body">
            <p className="resume-summary-text">{summary}</p>
          </div>
        </section>
      )}

      {/* 2. Education */}
      {(college || degree || branch) && (
        <section className="resume-sheet-section">
          <h2 className="resume-section-heading">Education</h2>
          <div className="resume-section-body">
            <div className="edu-entry">
              <div className="edu-primary-row">
                <span className="edu-institution">{college}</span>
                {year && <span className="edu-dates">{year}</span>}
              </div>
              <div className="edu-secondary-row">
                <span className="edu-qualification">
                  {degree} {branch ? `in ${branch}` : ""}
                </span>
                {cgpa && <span className="edu-grade">CGPA: {cgpa}</span>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Technical Skills */}
      {skillsList.length > 0 && (
        <section className="resume-sheet-section">
          <h2 className="resume-section-heading">Technical Skills</h2>
          <div className="resume-section-body">
            <p className="resume-skills-text">{skillsList.join(" • ")}</p>
          </div>
        </section>
      )}

      {/* 4. Experience & Internships */}
      {experience && (
        <section className="resume-sheet-section">
          <h2 className="resume-section-heading">Experience & Internships</h2>
          <div className="resume-section-body">
            {renderFormattedBullets(experience)}
          </div>
        </section>
      )}

      {/* 5. Key Projects */}
      {projects && (
        <section className="resume-sheet-section">
          <h2 className="resume-section-heading">Key Projects</h2>
          <div className="resume-section-body">
            {renderFormattedBullets(projects)}
          </div>
        </section>
      )}
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;