import React from "react";
import { Card, Spinner } from "react-bootstrap";
import { Stars } from "react-bootstrap-icons";

const QuestionPanel = ({ questionData }) => {
  const question = questionData?.question;
  const skill = questionData?.skill;
  const difficulty = questionData?.difficulty;

  return (
    <Card
      className="h-100 border-0"
      style={{
        background: "#111C34",
        borderRadius: "24px",
        color: "white",
      }}
    >
      <Card.Body className="d-flex flex-column p-4">

        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <div
            className="d-flex align-items-center justify-content-center me-3"
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg,#7C3AED 0%,#A78BFA 50%,#10B981 100%)",
            }}
          >
            <Stars size={22} color="white" />
          </div>

          <div>
            <h2 className="fw-bold mb-1">
              AI Technical Interview
            </h2>

            <p
              className="mb-0"
              style={{
                color: "#9CA3AF",
                fontSize: "0.95rem",
              }}
            >
              {skill || "General"} Assessment
            </p>
          </div>
        </div>

        {/* Question Box */}
        <div
          className="flex-grow-1 d-flex align-items-center"
          style={{
            background: "#0B1220",
            border: "1px solid rgba(255,255,255,.15)",
            borderRadius: "22px",
            padding: "32px",
          }}
        >
          {!question ? (
            <div className="text-center w-100">
              <Spinner />
              <p className="mt-3 mb-0">
                Loading question...
              </p>
            </div>
          ) : (
            <p
              className="mb-0"
              style={{
                fontSize: "1.35rem",
                lineHeight: "1.8",
                color: "#F8FAFC",
              }}
            >
              {question}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center mt-4">

          <div
            className="d-flex align-items-center"
            style={{
              color: "#9CA3AF",
              fontSize: "0.95rem",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10B981",
                marginRight: "8px",
              }}
            />
            AI is listening...
          </div>

          <div style={{ color: "#9CA3AF" }}>
            Difficulty:{" "}
            <span
              style={{
                color: "#F59E0B",
                fontWeight: 600,
              }}
            >
              {difficulty || 1}
            </span>
          </div>

        </div>
      </Card.Body>
    </Card>
  );
};

export default QuestionPanel;