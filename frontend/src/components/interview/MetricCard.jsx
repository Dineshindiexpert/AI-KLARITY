import React from "react";

const MetricCard = ({ title, value, icon }) => {
  return (
    <div className="glass-card p-4 metric-card h-100">
      <div className="mb-3">{icon}</div>

      <h4 className="text-white fw-bold">{value}</h4>

      <small className="text-secondary">{title}</small>
    </div>
  );
};

export default MetricCard;