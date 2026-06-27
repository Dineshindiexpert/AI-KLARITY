import React from "react";

const FinalVerdict = ({ feedback }) => {
  return (
    <div className="verdict-card p-5 mt-4">
      <h4 className="text-white fw-bold mb-4">
        AI Hiring Recommendation
      </h4>

      <p className="text-light mb-0">
        {feedback}
      </p>
    </div>
  );
};

export default FinalVerdict;