import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Save,
  CheckCircle,
  Sliders,
  Shield,
  AlertCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
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
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

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

  const [initialData, setInitialData] = useState(userData);

  // Warn on window close if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

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
    setHasUnsavedChanges(true);
  }

  function handleCancelEdit() {
    if (hasUnsavedChanges) {
      setShowDiscardModal(true);
    } else {
      setIsEditing(false);
    }
  }

  function handleConfirmDiscard() {
    setUserData(initialData);
    setHasUnsavedChanges(false);
    setIsEditing(false);
    setShowDiscardModal(false);
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
    setInitialData(userData);
    setHasUnsavedChanges(false);
    setIsEditing(false);
    setSaveSuccess(true);
    toast.success("Profile details saved successfully.");
    setTimeout(() => setSaveSuccess(false), 3500);
  }

  const userInitials = userData.name
    ? userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "MK";

  return (
    <div className="profile-page-wrapper fade-in">
      <Navbar />

      <main id="main-content" className="profile-main">
        <div className="profile-container">
          {/* Profile Header Hero Card */}
          <div className="profile-hero-card">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-initials">{userInitials}</div>
            </div>

            <div className="profile-hero-info">
              <div className="hero-name-row">
                <h1 className="profile-name-heading">{userData.name}</h1>
                <span className="badge badge-accent">Verified Account</span>
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
                onClick={() => (isEditing ? handleCancelEdit() : setIsEditing(true))}
                id="edit-profile-toggle-btn"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline profile-logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {hasUnsavedChanges && (
            <div className="alert alert-warning" role="alert">
              <AlertCircle size={15} />
              <span>You have unsaved changes. Remember to click "Save Changes" below.</span>
            </div>
          )}

          {saveSuccess && (
            <div className="alert alert-success" role="status">
              <CheckCircle size={15} />
              <span>Profile details updated successfully.</span>
            </div>
          )}

          {/* Grouped Settings Sections */}
          <form onSubmit={handleSave} className="profile-settings-form">
            {/* Section 1: Personal Information */}
            <section className="profile-section-card">
              <div className="section-card-header">
                <div className="section-icon-box">
                  <User size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="section-title-sm">Personal Information</h2>
                  <p className="section-desc-sm">
                    Contact information automatically populated into newly created resumes.
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
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-email">
                    Email Address
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    className="form-input"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-phone">
                    Phone Number
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

            {/* Section 2: Resume Preferences */}
            <section className="profile-section-card">
              <div className="section-card-header">
                <div className="section-icon-box">
                  <Sliders size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="section-title-sm">Resume Preferences</h2>
                  <p className="section-desc-sm">
                    Default template and parser rules for generated drafts.
                  </p>
                </div>
              </div>

              <div className="form-fields-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-template">
                    Default Resume Template
                  </label>
                  <select
                    id="profile-template"
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
                  <label className="form-label" htmlFor="profile-atslevel">
                    ATS Optimization Rule
                  </label>
                  <select
                    id="profile-atslevel"
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

            {/* Section 3: Account & Security */}
            <section className="profile-section-card">
              <div className="section-card-header">
                <div className="section-icon-box">
                  <Shield size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="section-title-sm">Account & Security</h2>
                  <p className="section-desc-sm">
                    Authentication credentials and stateless token management.
                  </p>
                </div>
              </div>

              <div className="security-notice-box">
                <p className="security-notice-text">
                  Your session is authenticated via BCrypt-hashed credentials and stateless JWT bearer tokens.
                  To update credentials or rotate security access, contact your administrator.
                </p>
              </div>
            </section>

            {/* Form Footer */}
            {isEditing && (
              <div className="profile-form-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm btn-save-profile"
                  id="profile-save-btn"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Discard Confirmation Modal */}
      <Modal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        title="Discard Changes"
        confirmText="Discard Changes"
        isDestructive={true}
        onConfirm={handleConfirmDiscard}
      >
        <p>
          You have unsaved edits in your profile. Are you sure you want to discard them?
        </p>
      </Modal>

      <Footer />
    </div>
  );
}

export default Profile;