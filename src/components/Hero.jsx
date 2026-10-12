import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import ResumePreview from "./ResumePreview";
import "../Styles/Hero.css";

const heroSampleResume = {
  name: "Murali Krishna",
  email: "murali.krishna@example.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
  summary:
    "Software engineer with 3+ years of experience engineering responsive React web applications and resilient REST microservices. Focused on performance optimization, clean component architecture, and automated testing.",
  college: "National Institute of Technology",
  degree: "B.Tech",
  branch: "Computer Science & Engineering",
  cgpa: "8.9",
  year: "2024",
  skills:
    "React, TypeScript, JavaScript (ES6+), Node.js, Spring Boot, Java, PostgreSQL, REST APIs, Git, Docker, Vitest",
  projects:
    "• High-Performance Resume Engine: Architected an ATS-compliant document renderer with real-time preview and multi-page vector PDF export.\n• E-Commerce Microservices: Engineered catalog services processing 1,200+ queries per second with sub-40ms latency.",
  experience:
    "• Software Development Engineer at TechCorp (2024 - Present): Built modular design system components used across 4 customer-facing products; reduced client-side bundle size by 34%.\n• Engineering Intern at CloudBase (2023 - 2024): Implemented stateless JWT authentication and integrated automated CI test suites.",
};

function Hero() {
  const [activeTemplate, setActiveTemplate] = useState("modern");

  return (
    <section className="hero-section" aria-label="Introduction">
      <div className="hero-container">
        {/* Left Column: Asymmetric editorial headline, honest copy & CTAs */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            <span>ATS-Compliant Document Studio</span>
          </div>

          <h1 className="hero-title">
            Build a resume recruiters actually read.
          </h1>

          <p className="hero-body">
            No neon gradients, bloated tables, or gimmicks that fail applicant tracking software.
            Just editorial typography, structured career content, and instant vector PDF export.
          </p>

          <div className="hero-actions">
            <Link
              to="/resume"
              className="btn btn-lg btn-primary hero-primary-btn"
              id="hero-create-resume-btn"
            >
              <span>Build my resume</span>
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>

            <a
              href="#templates"
              className="btn btn-lg btn-secondary hero-secondary-btn"
              id="hero-explore-features-btn"
            >
              <span>See templates</span>
            </a>
          </div>

          <div className="hero-guarantees">
            <div className="guarantee-item">
              <Check size={14} strokeWidth={2} className="guarantee-check" />
              <span>Standard A4 vector PDF</span>
            </div>
            <div className="guarantee-item">
              <Check size={14} strokeWidth={2} className="guarantee-check" />
              <span>Linear ATS-safe text flow</span>
            </div>
            <div className="guarantee-item">
              <Check size={14} strokeWidth={2} className="guarantee-check" />
              <span>Zero watermarks or paywalls</span>
            </div>
          </div>
        </div>

        {/* Right Column: Real rendered live resume preview document */}
        <div className="hero-preview-column" aria-label="Interactive live resume preview">
          <div className="hero-preview-stage">
            <div className="hero-stage-toolbar">
              <span className="toolbar-label">Live Template Preview:</span>
              <div className="hero-template-chips">
                <button
                  type="button"
                  className={`hero-chip ${activeTemplate === "modern" ? "active" : ""}`}
                  onClick={() => setActiveTemplate("modern")}
                >
                  Modern ATS
                </button>
                <button
                  type="button"
                  className={`hero-chip ${activeTemplate === "minimal" ? "active" : ""}`}
                  onClick={() => setActiveTemplate("minimal")}
                >
                  Minimal Clean
                </button>
                <button
                  type="button"
                  className={`hero-chip ${activeTemplate === "executive" ? "active" : ""}`}
                  onClick={() => setActiveTemplate("executive")}
                >
                  Executive Elite
                </button>
              </div>
            </div>

            <div className="hero-resume-paper">
              <ResumePreview
                resumeData={heroSampleResume}
                template={activeTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;