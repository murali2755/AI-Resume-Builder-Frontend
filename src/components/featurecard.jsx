function FeatureCard({ icon, title, description, badge }) {
  return (
    <div className="feature-card-item">
      <div className="feature-card-top">
        <div className="feature-icon-wrapper">
          {icon}
        </div>
        {badge && <span className="feature-badge">{badge}</span>}
      </div>

      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-desc">{description}</p>
    </div>
  );
}

export default FeatureCard;