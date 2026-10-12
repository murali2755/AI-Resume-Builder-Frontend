import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  FileDown,
  LayoutTemplate,
  Bot
} from "lucide-react";
import "../Styles/Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column: Headline, Description & CTAs */}
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-sparkle" />
            <span>AI-POWERED RESUME BUILDER</span>
          </div>

          <h1 className="hero-title">
            Build Your ATS Resume <br />
            <span className="hero-blue-accent">in Minutes with AI</span>
          </h1>

          <p className="hero-supporting-text">
            Create professional, recruiter-approved resumes with smart AI suggestions,
            clean ATS templates, and instant vector PDF download.
          </p>

          <div className="hero-actions">
            <Link to="/resume" className="btn btn-lg btn-primary hero-primary-btn" id="hero-create-resume-btn">
              <span>Create My Resume</span>
              <ArrowRight size={18} />
            </Link>

            <a href="#features" className="btn btn-lg btn-secondary hero-secondary-btn" id="hero-explore-features-btn">
              <span>Explore Features</span>
            </a>
          </div>

          {/* Trust Metric Counters */}
          <div className="hero-trust-metrics">
            <div className="trust-metric-item">
              <span className="metric-number">98%</span>
              <span className="metric-label">ATS Screening Pass Rate</span>
            </div>
            <div className="metric-divider" />
            <div className="trust-metric-item">
              <span className="metric-number">5 Min</span>
              <span className="metric-label">Average Build Time</span>
            </div>
            <div className="metric-divider" />
            <div className="trust-metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-label">Instant PDF Export</span>
            </div>
          </div>
        </div>

        {/* Right Column: GoResume-Inspired Live Mockup Illustration */}
        <div className="hero-visual">
          <div className="editor-mockup-frame">
            {/* Mockup Floating Widget 1: Real-time ATS Score */}
            <div className="mockup-floating-card ats-score-widget">
              <div className="widget-icon green-icon">
                <ShieldCheck size={18} />
              </div>
              <div className="widget-body">
                <div className="widget-title">ATS Match: 98%</div>
                <div className="widget-subtitle">Recruiter-ready format</div>
              </div>
            </div>

            {/* Mockup Floating Widget 2: AI Suggestion */}
            <div className="mockup-floating-card ai-suggestion-widget">
              <div className="widget-icon blue-icon">
                <Bot size={18} />
              </div>
              <div className="widget-body">
                <div className="widget-title">AI Suggestion Applied</div>
                <div className="widget-subtitle">Summary tuned with target keywords</div>
              </div>
            </div>

            {/* Mockup Resume Sheet Container */}
            <div className="mockup-sheet">
              <div className="sheet-top-row">
                <div className="sheet-avatar">MK</div>
                <div className="sheet-meta">
                  <h3 className="sheet-name">Murali Krishna</h3>
                  <p className="sheet-headline">Full Stack Software Engineer</p>
                  <p className="sheet-contact">Bangalore, IN • murali@example.com • +91 9876543210</p>
                </div>
              </div>

              {/* Section: Summary */}
              <div className="sheet-section">
                <div className="sheet-section-title">
                  <span>Professional Summary</span>
                  <span className="ai-enhanced-tag">AI Enhanced ✨</span>
                </div>
                <p className="sheet-summary-para">
                  Results-driven Software Engineer with experience developing scalable React web applications, high-performance REST APIs, and clean architectures with optimal ATS compatibility.
                </p>
              </div>

              {/* Section: Skills */}
              <div className="sheet-section">
                <div className="sheet-section-title">Technical Skills</div>
                <div className="sheet-skills-cloud">
                  <span className="sheet-skill-pill">React.js</span>
                  <span className="sheet-skill-pill">TypeScript</span>
                  <span className="sheet-skill-pill">Node.js</span>
                  <span className="sheet-skill-pill">Spring Boot</span>
                  <span className="sheet-skill-pill">PostgreSQL</span>
                  <span className="sheet-skill-pill">REST APIs</span>
                </div>
              </div>

              {/* Section: Experience Highlights */}
              <div className="sheet-section">
                <div className="sheet-section-title">Experience & Projects</div>
                <div className="sheet-exp-item">
                  <div className="sheet-exp-header">
                    <span className="sheet-exp-role">Software Engineering Intern</span>
                    <span className="sheet-exp-date">2024</span>
                  </div>
                  <p className="sheet-exp-bullet">
                    • Accelerated application render latency by 32% through state optimization and component memoization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust / Value Section directly beneath Hero */}
      <div className="hero-trust-section">
        <div className="trust-container">
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon-box">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="trust-title">ATS-Friendly Layouts</h4>
                <p className="trust-desc">Engineered to pass automated screening filters seamlessly.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="trust-title">Smart AI Assistant</h4>
                <p className="trust-desc">Instant bullet points and summary optimization.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <LayoutTemplate size={20} />
              </div>
              <div>
                <h4 className="trust-title">Clean Modern Templates</h4>
                <p className="trust-desc">Recruiter-approved designs with clean typography.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <FileDown size={20} />
              </div>
              <div>
                <h4 className="trust-title">Instant PDF Download</h4>
                <p className="trust-desc">High-resolution standard A4 vector export in 1 click.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;