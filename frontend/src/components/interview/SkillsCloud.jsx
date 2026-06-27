import React from "react";
import { Badge } from "react-bootstrap";

const SkillsCloud = ({ skills }) => {
  return (
    <div className="glass-card p-4">
      <h5 className="section-title mb-4">Detected Skill Stack</h5>

      {skills?.map((skill, index) => (
        <Badge key={index} className="skill-badge me-2 mb-2">
          {skill}
        </Badge>
      ))}
    </div>
  );
};

export default SkillsCloud;