import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Save,
  CheckCircle,
  Sparkles,
  Camera,
  Shield,
  Sliders
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "../Styles/Profile.css";

const defaultUserData = {
  name: "Candidate",
  email: "candidate@example.com",
  phone: "9876543210",
  location: "Bangalore, India",
  role: "Full Stack Software Engineer",
  template: "Modern ATS Standard (Recommended)",
  atsLevel: "High Optimization (95%+ match)",
};

function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notice, setNotice] = useState("");

  const [userData, setUserData] = useState(() => {
    let localPrefs = {};
    try {
      const storedPrefs = localStorage.getItem("user_profile_prefs");
      if (storedPrefs) {
        localPrefs = JSON.parse(storedPrefs);
      }
    } catch {
      // ignore
    }

    return {
      name: user?.name || defaultUserData.name,
      email: user?.email || defaultUserData.email,
      phone: localPrefs.phone || defaultUserData.phone,
      location: localPrefs.location || defaultUserData.location,
      role: localPrefs.role || defaultUserData.role,
      template: localPrefs.template || defaultUserData.template,
      atsLevel: localPrefs.atsLevel || defaultUserData.atsLevel,
    };
  });

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave(e) {
    e.preventDefault();
    if (updateUser) {
      updateUser({ name: userData.name });
    }
    localStorage.setItem(
      "user_profile_prefs",
      JSON.stringify({
        phone: userData.phone,
        location: userData.location,
        role: userData.role,
        template: userData.template,
        atsLevel: userData.atsLevel,
      })
    );
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  return (
    <div className="profile-page-wrapper">
      <Navbar />

      <main className="profile-main">
        <div className="profile-container">
          {/* Profile Header Hero Card */}
          <div className="profile-hero-card">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-initials">
                {userData.name
                  ? userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "MK"}
              </div>
              <button
                type="button"
                className="avatar-change-btn"
                title="Change Photo"
                onClick={() => {
                  setNotice("Avatar customization is planned for a future update. Initials are automatically used on generated documents.");
                  setTimeout(() => setNotice(""), 4500);
                }}
                aria-label="Change photo"
              >
                <Camera size={13} />
              </button>
            </div>

            <div className="profile-hero-info">
              <div className="hero-name-row">
                <h1 className="profile-name-heading">{userData.name}</h1>
                <span className="profile-role-badge">
                  <Sparkles size={12} /> Pro Member
                </span>
              </div>
              <p className="profile-sub-role">{userData.role}</p>
              <div className="profile-quick-contacts">
                <span className="quick-item">{userData.email}</span>
                <span className="quick-sep">•</span>
                <span className="quick-item">{userData.phone}</span>
                <span className="quick-sep">•</span>
                <span className="quick-item">{userData.location}</span>
              </div>
            </div>

            <div className="profile-hero-actions">
              <button
                type="button"
                className={`btn btn-sm ${isEditing ? "btn-secondary" : "btn-primary"}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline profile-logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {saveSuccess && (
            <div className="profile-save-alert" role="status">
              <CheckCircle size={16} />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {notice && (
            <div
              className="profile-save-alert"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                color: "#2563eb",
                border: "1px solid rgba(59, 130, 246, 0.25)",
              }}
              role="status"
            >
              <Sparkles size={16} />
              <span>{notice}</span>
            </div>
          )}

          {/* Settings & Sections */}
          <form onSubmit={handleSave} className="profile-settings-form">
            {/* Section 1: Personal Information */}
            <section className="profile-section-card">
              <div className="section-card-header">
                <div className="section-icon-box">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="section-title-sm">Personal Information</h2>
                  <p className="section-desc-sm">
                    Your personal contact and identity information.
                  </p>
                </div>
              </div>

              <div className="form-fields-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-fullname">
                    Full Name
                  </label>
                  <input
                    id="profile-fullname"
                    type="text"
                    name="name"
                    className="form-input"
                    value={userData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-email">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    className="form-input"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-phone">
                    Phone
                  </label>
                  <input
                    id="profile-phone"
                    type="text"
                    name="phone"
                    className="form-input"
                    value={userData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-location">
                    Location
                  </label>
                  <input
                    id="profile-location"
                    type="text"
                    name="location"
                    className="form-input"
                    value={userData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Account Settings */}
            <section className="profile-section-card">
              <div className="section-card-header">
                <div className="section-icon-box">
                  <Shield size={18} />
                </div>
                <div>
                  <h2 className="section-title-sm">Account Settings</h2>
                  <p className="section-desc-sm">
                    Security credentials and account login preferences.
                  </p>
                </div>
              </div>

              <div style={{ padding: "0.25rem 0" }}>
                <p style={{ fontSize: "0.875rem", color: "#475569", margin: "0 0 0.5rem 0" }}>
                  Your account is secured with Spring Security BCrypt hashing and stateless JWT bearer authentication.
                </p>
                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
                  To reset credentials on this development instance, register a new candidate profile or contact your system administrator.
                </p>
              </div>
            </section>

            {/* Section 3: Resume Preferences */}
            <section className="profile-section-card">
              <div className="section-card-header">
                <div className="section-icon-box">
                  <Sliders size={18} />
                </div>
                <div>
                  <h2 className="section-title-sm">Resume Preferences</h2>
                  <p className="section-desc-sm">
                    Default template and formatting rules for your generated resumes.
                  </p>
                </div>
              </div>

              <div className="form-fields-grid">
                <div className="form-group">
                  <label className="form-label">Default Resume Template</label>
                  <select
                    name="template"
                    className="form-select"
                    value={userData.template}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option>Modern ATS Standard (Recommended)</option>
                    <option>Minimal Clean</option>
                    <option>Executive Elite</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">ATS Optimization Level</label>
                  <select
                    name="atsLevel"
                    className="form-select"
                    value={userData.atsLevel}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option>High Optimization (95%+ match)</option>
                    <option>Standard Recruiter Filter</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Bottom Actions Bar */}
            <div className="profile-form-footer">
              <div className="footer-left">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="footer-right">
                <button
                  type="submit"
                  className="btn btn-primary btn-save-profile"
                  disabled={!isEditing}
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;