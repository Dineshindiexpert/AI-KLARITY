import React from "react";
import { CheckCircleFill, ExclamationTriangleFill } from "react-bootstrap-icons";

const StrengthWeaknessCard = ({ title, items, type }) => {
  const isStrength = type === "strength";

  return (
    <div className="glass-card p-4 h-100">
      <h5 className="section-title mb-4">
        {isStrength ? (
          <CheckCircleFill className="me-2 text-success" />
        ) : (
          <ExclamationTriangleFill className="me-2 text-danger" />
        )}

        {title}
      </h5>

      {items?.map((item, index) => (
        <div key={index} className="mb-3 d-flex gap-3 align-items-start">
          <div>
            {isStrength ? (
              <CheckCircleFill color="#10B981" />
            ) : (
              <ExclamationTriangleFill color="#EF4444" />
            )}
          </div>

          <span className="text-light">{item}</span>
        </div>
      ))}
    </div>
  );
};

export default StrengthWeaknessCard;