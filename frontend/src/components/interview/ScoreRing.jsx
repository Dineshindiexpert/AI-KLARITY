import React from "react";

const ScoreRing = ({ score }) => {
  const percentage = score <= 10 ? score * 10 : score;

  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card p-4 text-center h-100">
      <h6 className="section-title mb-4">AI Performance Score</h6>

      <div className="position-relative d-inline-flex justify-content-center align-items-center">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>

        <div className="position-absolute">
          <h2 className="fw-bold text-white">{percentage}%</h2>
          <small className="text-secondary">
            {percentage >= 80 ? "Excellent" : "Good"}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ScoreRing;