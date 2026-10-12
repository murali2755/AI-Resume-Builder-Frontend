import { Link } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  LayoutTemplate,
  Eye,
  FolderOpen,
  FileDown,
  ArrowRight,
  UserCheck,
  Wand2,
  Palette,
  CheckSquare2,
  Send
} from "lucide-react";
import FeatureCard from "./featurecard";
import "../Styles/features.css";

const coreFeatures = [
  {
    icon: <Sparkles size={22} />,
    title: "AI Resume Enhancement",
    description: "Transform raw job points into metric-driven, recruiter-tailored statements with smart AI guidance.",
    badge: "Smart AI"
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "ATS Optimization",
    description: "Engineered specifically to pass automated Applicant Tracking Systems without missing critical keywords.",
    badge: "Verified"
  },
  {
    icon: <LayoutTemplate size={22} />,
    title: "Professional Templates",
    description: "Choose from Modern ATS, Minimal Clean, and Executive layouts built following hiring guidelines.",
    badge: "Recruiter Approved"
  },
  {
    icon: <Eye size={22} />,
    title: "Live Resume Preview",
    description: "Edit on the left, watch your document format live on the right in realistic A4 paper view.",
    badge: "Real-time"
  },
  {
    icon: <FolderOpen size={22} />,
    title: "Resume Management",
    description: "Save, duplicate, organize, and update multiple tailored resumes for different roles.",
    badge: "Dashboard"
  },
  {
    icon: <FileDown size={22} />,
    title: "High-Res PDF Export",
    description: "One-click high-resolution PDF download formatted precisely for direct employer submission.",
    badge: "Vector Print"
  }
];

const howItWorksWorkflow = [
  {
    step: "01",
    icon: <UserCheck size={18} />,
    title: "Enter Your Details",
    description: "Fill in your background, education, contact info, and experience in clean structured sections."
  },
  {
    step: "02",
    icon: <Wand2 size={18} />,
    title: "Improve With AI",
    description: "Use one-click AI improvement to boost your summary and highlight measurable achievements."
  },
  {
    step: "03",
    icon: <Palette size={18} />,
    title: "Choose Template",
    description: "Select clean ATS-standard typography and layout preferences that highlight your strengths."
  },
  {
    step: "04",
    icon: <CheckSquare2 size={18} />,
    title: "Live Preview",
    description: "Verify your live A4 preview with real-time formatting checks and readability feedback."
  },
  {
    step: "05",
    icon: <Send size={18} />,
    title: "Download & Apply",
    description: "Export clean, print-ready PDF files immediately and apply to your target roles."
  }
];

function Features() {
  return (
    <div className="landing-features-wrapper">
      {/* 6 Feature Cards */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Core Features</span>
            <h2 className="section-title">Everything You Need to Land Interviews</h2>
            <p className="section-subtitle">
              Built from the ground up for job seekers who value clarity, speed, and proven hiring outcomes.
            </p>
          </div>

          <div className="features-grid-6">
            {coreFeatures.map((feat, index) => (
              <FeatureCard
                key={index}
                icon={feat.icon}
                title={feat.title}
                description={feat.description}
                badge={feat.badge}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5-Step How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Workflow</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Follow a straightforward 5-step path to craft an interview-winning resume in minutes.
            </p>
          </div>

          <div className="workflow-timeline-grid">
            {howItWorksWorkflow.map((item, idx) => (
              <div key={idx} className="workflow-step-card">
                <div className="step-top-badge">
                  <span className="step-order-number">{item.step}</span>
                  <div className="step-icon-circle">{item.icon}</div>
                </div>
                <h3 className="step-heading">{item.title}</h3>
                <p className="step-text">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="landing-cta-banner">
        <div className="section-container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <span className="cta-sub-badge">
                <Sparkles size={14} /> Career Acceleration
              </span>
              <h2 className="cta-headline">Ready to Build Your Next Resume?</h2>
              <p className="cta-subtext">
                Start creating your ATS-compliant resume now and put your best foot forward in front of hiring managers.
              </p>
              <div className="cta-action-row">
                <Link to="/resume" className="btn btn-lg btn-primary cta-primary-btn" id="cta-create-resume-btn">
                  <span>Create My Resume</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/dashboard" className="btn btn-lg btn-secondary cta-secondary-btn" id="cta-dashboard-btn">
                  <span>View Dashboard</span>
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