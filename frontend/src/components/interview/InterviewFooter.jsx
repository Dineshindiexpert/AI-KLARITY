import React from "react";
import { Button } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";

const InterviewFooter = ({
  currentQuestion = 1,
  totalQuestions = 5,
  onSkip,
  onNext,
  loading = false
}) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 px-lg-5 py-4"
      style={{
        background: "#111C34",
        borderTop: "1px solid rgba(255,255,255,.08)",
        minHeight: "110px",
      }}
    >
      {/* Left Side */}
      <div className="d-flex align-items-center">
        <span className="text-secondary me-3" style={{ fontSize: "1.1rem" }}>
          Question{" "}
          <span className="fw-bold text-white">{currentQuestion}</span> of{" "}
          <span className="fw-bold text-white">{totalQuestions}</span>
        </span>

        <div className="d-flex align-items-center gap-2 ms-2">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <span
              key={index}
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background:
                  index + 1 === currentQuestion
                    ? "#7C3AED"
                    : "rgba(255,255,255,.15)",
                display: "inline-block",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="d-flex align-items-center gap-3">
        <Button
          variant="outline-light"
          onClick={onSkip}
          disabled={loading}
          className="px-4 py-2 fw-semibold"
          style={{
            minWidth: "150px",
            borderRadius: "0",
          }}
        >
          Skip Question
        </Button>

        <Button
          onClick={onNext}
          disabled={loading}
          className="px-4 py-2 fw-semibold border-0"
          style={{
            minWidth: "260px",
            borderRadius: "0",
            background:
              "linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)",
          }}
        >
          {loading ? "Processing..." : "Submit Answer & Next"}
          <ArrowRight className="ms-2" size={18} />
        </Button>
      </div>
    </div>
  );
};

export default InterviewFooter;