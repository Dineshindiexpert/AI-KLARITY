import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, ProgressBar } from "react-bootstrap";
import {
  CpuFill,
  FileEarmarkCheckFill,
  CheckCircleFill
} from "react-bootstrap-icons";

const InterviewLoading = () => {
  const loadingSteps = [
    "Analyzing resume profile...",
    "Matching skills with job role...",
    "Generating personalized questions...",
    "Preparing AI interview engine...",
    "Finalizing interview session..."
  ];

  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });

      setProgress((prev) => {
        if (prev < 100) {
          return prev + 20;
        }
        return 100;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="vh-100 d-flex align-items-center"
      style={{
        background: "#0B0F19"
      }}
    >
      <Container
        style={{
          maxWidth: "720px"
        }}
      >
        <Card
          className="border-0 rounded-4 p-5 text-center"
          style={{
            background: "#111827"
          }}
        >
          {/* Icon */}

          <div
            className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "90px",
              height: "90px",
              background: "#1E293B"
            }}
          >
            <CpuFill
              size={38}
              color="#8B5CF6"
            />
          </div>

          {/* Title */}

          <h2 className="text-white fw-bold mb-3">
            Preparing Your AI Interview
          </h2>

          <p
            className="mb-4"
            style={{
              color: "#94A3B8"
            }}
          >
            Our AI engine is generating a personalized interview
            based on your resume, skills, and target role.
          </p>

          {/* Loader */}

          <div className="mb-4">
            <Spinner
              animation="border"
              style={{
                width: "3rem",
                height: "3rem",
                color: "#8B5CF6"
              }}
            />
          </div>

          {/* Progress */}

          <ProgressBar
            now={progress}
            style={{
              height: "10px"
            }}
            className="mb-4"
          />

          {/* Current Step */}

          <Card
            className="border-0 rounded-4 p-3 mb-4"
            style={{
              background: "#1E293B"
            }}
          >
            <div className="d-flex align-items-center justify-content-center gap-3">

              <FileEarmarkCheckFill
                color="#34D399"
                size={20}
              />

              <span
                style={{
                  color: "#CBD5E1"
                }}
              >
                {loadingSteps[step]}
              </span>

            </div>
          </Card>

          {/* Steps */}

          <div className="text-start">

            {loadingSteps.map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center gap-3 mb-3"
              >
                {index <= step ? (
                  <CheckCircleFill
                    color="#34D399"
                    size={16}
                  />
                ) : (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#374151"
                    }}
                  />
                )}

                <small
                  style={{
                    color:
                      index <= step
                        ? "#E5E7EB"
                        : "#6B7280"
                  }}
                >
                  {item}
                </small>
              </div>
            ))}

          </div>

          <div
            className="mt-4"
            style={{
              color: "#64748B",
              fontSize: "14px"
            }}
          >
            This usually takes 5–10 seconds
          </div>

        </Card>
      </Container>
    </div>
  );
};

export default InterviewLoading;