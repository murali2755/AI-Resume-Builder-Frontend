import "../Styles/dashboardcard.css";

function DashboardCard({ icon, title, description, onClick, badge }) {
  return (
    <div className="dashboard-action-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="dashboard-card-header">
        <div className="dashboard-icon-bubble">
          {icon}
        </div>
        {badge && <span className="action-badge">{badge}</span>}
      </div>

      <h3 className="dashboard-card-title">{title}</h3>
      <p className="dashboard-card-desc">{description}</p>

      <div className="dashboard-card-footer">
        <span className="card-arrow">Open →</span>
      </div>
    </div>
  );
}

export default DashboardCard;