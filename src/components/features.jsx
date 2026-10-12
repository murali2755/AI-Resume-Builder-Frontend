import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X as XIcon, ChevronRight } from "lucide-react";
import ResumePreview from "./ResumePreview";
import "../Styles/features.css";

const gallerySampleData = {
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  phone: "+91 98123 45678",
  location: "Hyderabad, India",
  summary:
    "Product-minded backend engineer with expertise in distributed systems, Spring Boot microservices, and database tuning. Proven record scaling high-throughput transaction pipelines with strict SLA requirements.",
  college: "Indian Institute of Technology",
  degree: "B.Tech",
  branch: "Computer Science",
  cgpa: "9.2",
  year: "2023",
  skills:
    "Java, Spring Boot, PostgreSQL, Redis, Kafka, Docker, Kubernetes, AWS, REST APIs, Microservices, JUnit",
  projects:
    "• Distributed Payment Gateway: Built fault-tolerant reconciliation service processing ₹40M+ daily transactions.\n• Event-Driven Analytics: Architected Kafka-based event streaming pipeline with 99.99% uptime.",
  experience:
    "• Backend Engineer at FinTech Systems (2023 - Present): Engineered core settlement services, reducing p99 latency from 180ms to 42ms; mentored 3 junior engineers.\n• Software Engineering Intern at DataScale (2022 - 2023): Implemented Redis caching layer reducing database CPU load by 45%.",
};

const templatesCatalog = [
  {
    id: "modern",
    name: "Modern ATS",
    tagline: "Serif headers, hairline rules, technical focus",
    bestFor: "Engineering, data, technical specialists",
    isRecommended: true,
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    tagline: "Monochrome sans-serif, maximum whitespace",
    bestFor: "Designers, product managers, startups",
    isRecommended: false,
  },
  {
    id: "executive",
    name: "Executive Elite",
    tagline: "Formal serif typography, balanced margins",
    bestFor: "Leadership, corporate roles, senior talent",
    isRecommended: false,
  },
];

const faqItems = [
  {
    q: "Why is plain linear formatting crucial for ATS compliance?",
    a: "Applicant Tracking Systems parse resumes using automated OCR and text stream extractors. Fancy multi-column tables, floating text boxes, and background graphics frequently cause parsers to scramble contact details and experience chronological order. Our templates enforce strict linear document flow so every line is parsed accurately.",
  },
  {
    q: "Does the PDF export download as real vector text or a raster image?",
    a: "Our PDF generator produces clean, millimeter-accurate A4 documents that preserve typography and vector text fidelity. Hiring managers and OCR software can search, copy, and highlight text seamlessly.",
  },
  {
    q: "Can I save multiple resumes and update them later?",
    a: "Yes. Every resume is stored securely in your workspace. You can edit existing drafts, switch between templates anytime without re-typing your career history, or duplicate resumes for tailored job applications.",
  },
  {
    q: "Are there any hidden watermarks, subscriptions, or paywalls?",
    a: "No. You can build, edit, and export your resumes to PDF completely free with zero watermarks.",
  },
];

function Features() {
  const [selectedGalleryTemplate, setSelectedGalleryTemplate] = useState("modern");

  return (
    <div className="landing-sections-wrapper">
      {/* 1. Numbered 3-Step Section: Workflow */}
      <section id="workflow" className="section-block workflow-section" aria-label="Workflow steps">
        <div className="section-container">
          <div className="section-header-left">
            <span className="section-kicker">01 / Process</span>
            <h2 className="section-heading">Three steps from draft to job application.</h2>
            <p className="section-subtext">
              A deliberate, distraction-free workflow designed to produce an interview-worthy document.
            </p>
          </div>

          <div className="steps-three-grid">
            <div className="step-item-card">
              <span className="step-numeral">01</span>
              <h3 className="step-title">Enter structured career history</h3>
              <p className="step-description">
                Input your education, verified technical skills, and quantified project achievements in focused, validated sections.
              </p>
              <span className="step-sub-note">Inline tag input & helper suggestions</span>
            </div>

            <div className="step-item-card">
              <span className="step-numeral">02</span>
              <h3 className="step-title">Select an ATS-tested template</h3>
              <p className="step-description">
                Switch instantly between Modern ATS, Minimal Clean, and Executive Elite. Zero broken column wraps or misaligned margins.
              </p>
              <span className="step-sub-note">Recruiter-approved typographic hierarchy</span>
            </div>

            <div className="step-item-card">
              <span className="step-numeral">03</span>
              <h3 className="step-title">Export high-resolution vector PDF</h3>
              <p className="step-description">
                Download a crisp, print-standard A4 PDF in one click. Ready for direct email attachment or company portal uploads.
              </p>
              <span className="step-sub-note">Standard A4 aspect ratio & print media rules</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Split Template Gallery */}
      <section id="templates" className="section-block templates-gallery-section" aria-label="Template gallery">
        <div className="section-container">
          <div className="section-header-left">
            <span className="section-kicker">02 / Design Systems</span>
            <h2 className="section-heading">Print-quality templates. Real typography.</h2>
            <p className="section-subtext">
              Every template is built with calibrated line-heights, strict margin proportions, and zero filler decorations.
            </p>
          </div>

          <div className="gallery-split-layout">
            {/* Left: Template selector cards */}
            <div className="gallery-selector-list">
              {templatesCatalog.map((tpl) => {
                const isSelected = selectedGalleryTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    className={`gallery-card-btn ${isSelected ? "is-active" : ""}`}
                    onClick={() => setSelectedGalleryTemplate(tpl.id)}
                  >
                    <div className="gallery-card-top">
                      <h3 className="gallery-card-name">{tpl.name}</h3>
                      {tpl.isRecommended && (
                        <span className="badge badge-accent">Recommended</span>
                      )}
                    </div>
                    <p className="gallery-card-tagline">{tpl.tagline}</p>
                    <div className="gallery-card-bestfor">
                      <span className="bestfor-label">Best for:</span> {tpl.bestFor}
                    </div>
                  </button>
                );
              })}

              <div className="gallery-cta-hint">
                <p>
                  You can change templates at any time without re-entering your data.
                </p>
                <Link to="/resume" className="btn btn-primary btn-sm">
                  <span>Start with {templatesCatalog.find(t => t.id === selectedGalleryTemplate)?.name}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: Rendered small live preview */}
            <div className="gallery-preview-frame">
              <div className="gallery-frame-header">
                <span className="gallery-frame-tag">
                  Active: {templatesCatalog.find((t) => t.id === selectedGalleryTemplate)?.name}
                </span>
                <span className="gallery-frame-a4">Standard A4 Preview</span>
              </div>
              <div className="gallery-sheet-viewport">
                <ResumePreview
                  resumeData={gallerySampleData}
                  template={selectedGalleryTemplate}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Plain Honest Comparison: Standard Builders vs ResumeBuilder */}
      <section className="section-block comparison-section" aria-label="Feature comparison">
        <div className="section-container">
          <div className="section-header-left">
            <span className="section-kicker">03 / Comparison</span>
            <h2 className="section-heading">Why traditional resume builders fail applicants.</h2>
            <p className="section-subtext">
              Most resume tools optimize for visual novelty on a screen. We optimize for recruiter clarity and ATS scanner success.
            </p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th scope="col" className="col-aspect">Design Aspect</th>
                  <th scope="col" className="col-generic">Generic Graphic Builders</th>
                  <th scope="col" className="col-ours">ResumeBuilder</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="row-feature">Document Layout</td>
                  <td className="row-generic">
                    <span className="status-cross"><XIcon size={14} /> Multi-column tables & floating textboxes</span>
                    <span className="status-sub">Frequently causes parser OCR errors</span>
                  </td>
                  <td className="row-ours">
                    <span className="status-check"><Check size={14} /> Clean linear single-column flow</span>
                    <span className="status-sub">100% compliant with standard hiring parsers</span>
                  </td>
                </tr>
                <tr>
                  <td className="row-feature">Typography & Fonts</td>
                  <td className="row-generic">
                    <span className="status-cross"><XIcon size={14} /> Gimmicky custom fonts, irregular line-heights</span>
                    <span className="status-sub">Inconsistent rendering across recruiter viewers</span>
                  </td>
                  <td className="row-ours">
                    <span className="status-check"><Check size={14} /> Editorial serif & humanist sans typography</span>
                    <span className="status-sub">Print-calibrated, high-contrast readability</span>
                  </td>
                </tr>
                <tr>
                  <td className="row-feature">PDF Export Quality</td>
                  <td className="row-generic">
                    <span className="status-cross"><XIcon size={14} /> Low-res raster image snapshots</span>
                    <span className="status-sub">Text cannot be searched or copied</span>
                  </td>
                  <td className="row-ours">
                    <span className="status-check"><Check size={14} /> Clean vector text PDF export</span>
                    <span className="status-sub">Searchable, selectable, and crisp at any scale</span>
                  </td>
                </tr>
                <tr>
                  <td className="row-feature">Pricing & Access</td>
                  <td className="row-generic">
                    <span className="status-cross"><XIcon size={14} /> Free editor until download, then hidden paywall</span>
                    <span className="status-sub">Requires credit card for download</span>
                  </td>
                  <td className="row-ours">
                    <span className="status-check"><Check size={14} /> Always free instant vector PDF download</span>
                    <span className="status-sub">Zero watermarks, zero bait-and-switch</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Accessible FAQ with Native <details> */}
      <section id="faq" className="section-block faq-section" aria-label="Frequently asked questions">
        <div className="section-container">
          <div className="section-header-left">
            <span className="section-kicker">04 / Questions</span>
            <h2 className="section-heading">Frequently asked questions.</h2>
            <p className="section-subtext">
              Straightforward answers about our formatting approach and document exports.
            </p>
          </div>

          <div className="faq-accordion-group">
            {faqItems.map((item, idx) => (
              <details key={idx} className="faq-details-item">
                <summary className="faq-summary">
                  <span className="faq-question-text">{item.q}</span>
                  <ChevronRight size={16} strokeWidth={1.5} className="faq-chevron-icon" />
                </summary>
                <div className="faq-answer-body">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Final Quiet Call-to-Action Banner */}
      <section className="section-block cta-banner-section" aria-label="Final call to action">
        <div className="section-container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <span className="cta-kicker">Career Acceleration</span>
              <h2 className="cta-title">Ready to write a resume that gets interviews?</h2>
              <p className="cta-body">
                Open the builder now. No account setup required to start drafting your first document.
              </p>
              <div className="cta-actions">
                <Link
                  to="/resume"
                  className="btn btn-lg btn-primary"
                  id="cta-create-resume-btn"
                >
                  <span>Create my resume</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/dashboard"
                  className="btn btn-lg btn-secondary"
                  id="cta-dashboard-btn"
                >
                  <span>Open dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;