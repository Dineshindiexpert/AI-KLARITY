import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import {CpuFill,ChatLeftTextFill,AwardFill,Check2Circle,ArrowClockwise} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

import { getLatestReport } from "../../api/interviewApi";

// Components
import ScoreRing from "../../components/interview/ScoreRing";
import MetricCard from "../../components/interview/MetricCard";
import SkillsCloud from "../../components/interview/SkillsCloud";
import StrengthWeaknessCard from "../../components/interview/StrengthWeaknessCard";
import QuestionAnalysis from "../../components/interview/QuestionAnalysis";
import FinalVerdict from "../../components/interview/FinalVerdict";

const InterviewReport = () => {
  const navigate = useNavigate();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);

      const response = await getLatestReport();

      console.log("LIVE REPORT:", response);

      if (response) {
        setReportData(response);
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <Spinner
          animation="border"
          style={{
            color: "#8B5CF6",
            width: "3rem",
            height: "3rem"
          }}
        />
        <p className="mt-3 text-light">
          AI Klarity is analyzing interview performance...
        </p>
      </div>
    );
  }

  // Empty state
  if (!reportData) {
    return (
      <div className="loading-screen">
        <h4 className="text-light">
          No interview report found.
        </h4>

        <Button
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Return Dashboard
        </Button>
      </div>
    );
  }

  // Extracting DB data
  const aiReport = reportData?.report || {};

  const score = aiReport?.score || 0;
  const percentage = score <= 10 ? score * 10 : score;

  const totalQuestions =
    reportData?.questions?.length || 0;

  const totalAnswers =
    reportData?.answers?.length || 0;

  const communication =
    aiReport?.communication || "Average";

  const technicalLevel =
    aiReport?.technical_level || "Intermediate";

  return (
    <div className="report-page">

      {/* Background blur circles */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <Container>

        {/* HEADER */}
        <div className="text-center mb-5">

          <div className="ai-logo mx-auto mb-4">
            <CpuFill size={32} />
          </div>

         <div className="text-center w-100">
            <h1 className="hero-title">
              AI Interview Evaluation Report
            </h1>
          </div>

          <p className="hero-subtitle">
            Advanced candidate analysis powered by AI Klarity engine
          </p>
        </div>

        {/* TOP GRID */}
        <Row className="g-4 mb-4">

          <Col lg={4}>
            <ScoreRing score={score} />
          </Col>

          <Col lg={8}>
            <Row className="g-4">

              <Col md={6}>
                <MetricCard
                  title="Communication"
                  value={communication}
                  icon={
                    <ChatLeftTextFill
                      size={24}
                      color="#8B5CF6"
                    />
                  }
                />
              </Col>

              <Col md={6}>
                <MetricCard
                  title="Technical Level"
                  value={technicalLevel}
                  icon={
                    <AwardFill
                      size={24}
                      color="#10B981"
                    />
                  }
                />
              </Col>

              <Col md={6}>
                <MetricCard
                  title="Questions Answered"
                  value={`${totalAnswers}/${totalQuestions}`}
                  icon={
                    <Check2Circle
                      size={24}
                      color="#60A5FA"
                    />
                  }
                />
              </Col>

              <Col md={6}>
                <MetricCard
                  title="AI Confidence"
                  value={
                    percentage >= 80
                      ? "High"
                      : percentage >= 60
                      ? "Medium"
                      : "Low"
                  }
                  icon={
                    <CpuFill
                      size={24}
                      color="#F59E0B"
                    />
                  }
                />
              </Col>

            </Row>
          </Col>

        </Row>

        {/* JOB ROLE */}
        <div className="glass-card p-4 mb-4">

          <h5 className="section-title mb-3">
            Interview Role
          </h5>

          <h3 className="text-white">
            {reportData?.job_role}
          </h3>

        </div>

        {/* SKILLS */}
        <div className="mb-4">
          <SkillsCloud skills={reportData?.skills} />
        </div>

        {/* STRENGTHS + WEAKNESSES */}
        <Row className="g-4 mb-4">

          <Col lg={6}>
            <StrengthWeaknessCard
              title="Core Strength Analysis"
              items={aiReport?.strengths}
              type="strength"
            />
          </Col>

          <Col lg={6}>
            <StrengthWeaknessCard
              title="Improvement Areas"
              items={aiReport?.weaknesses}
              type="weakness"
            />
          </Col>

        </Row>

        {/* QUESTIONS */}
        <div className="mb-4">

          <QuestionAnalysis
            questions={reportData?.questions}
            answers={reportData?.answers}
          />

        </div>

        {/* FINAL AI VERDICT */}
        <FinalVerdict
          feedback={aiReport?.final_feedback}
        />

        {/* FOOTER BUTTONS */}
        <div className="text-center mt-5 pb-5">

          <Button
            className="action-btn me-3"
            onClick={() =>
              navigate("/interview/landing")
            }
          >
            <ArrowClockwise className="me-2" />
            Retake Interview
          </Button>

          <Button
            variant="outline-light"
            onClick={() => navigate("/")}
          >
            Dashboard
          </Button>

        </div>

      </Container>
    </div>
  );
};

export default InterviewReport;