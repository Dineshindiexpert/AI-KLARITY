import { Brain, Sparkles } from "lucide-react";
import React, { useState } from "react"; // 1. useState import kiya
import { Container, Card, Button } from "react-bootstrap";
import { Cpu, Upload, CheckCircle, CheckCircleFill, FileText, GraphUp } from "react-bootstrap-icons";
import { uploadResume, analyzeResume } from "../../api/resumeApi";
import CircularProgress from '../../components/Progressbar';

const ResumeAnalyzer = () => {

  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const [loading, setLoading] = useState(false);

  const [analysisData, setAnalysisData] =
    useState(null);

  const resetAnalyzer = () => {
    setIsAnalyzed(false);
    setAnalysisData(null);
  };

  // 3. File select hone par chalne wala function
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      // STEP 1: upload
      const uploadResponse = await uploadResume(file);
      console.log("UPLOAD RESPONSE:", uploadResponse);

      // 🔥 SAFE EXTRACTION (MOST IMPORTANT FIX)
      const resumeId =
        uploadResponse?.resume_id ||
        uploadResponse?.data?.resume_id ||
        uploadResponse?._id;

      if (!resumeId) {
        throw new Error("Resume ID not found in response");
      }

      // STEP 2: analyze
      const result = await analyzeResume(resumeId);
      console.log("ANALYSIS:", result);

      setAnalysisData(result);
      setIsAnalyzed(true);

    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      alert(error.message || "Resume upload failed");
    } finally {
      setLoading(false);
    }
  };
  const score = analysisData?.analysis?.score || 0;
  // 4. Agar file upload ho gayi hai (isAnalyzed === true)
  const [activeRoadmapTab, setActiveRoadmapTab] = useState(0);

 
  const hireability = analysisData?.analysis?.hireability || "Medium";
  const summary = analysisData?.analysis?.summary || "";
  const skills = analysisData?.skills || [];
  const suggestedRoles = analysisData?.suggested_roles || [];
  const strengths = analysisData?.analysis?.strengths || [];
  const weaknesses = analysisData?.analysis?.weaknesses || [];
  const improvements = analysisData?.analysis?.areas_for_improvement || [];
  const roadmaps = analysisData?.analysis?.suggested_roadmaps || [];

  if (isAnalyzed) {
    return (
      <Container fluid className="min-vh-100  p-md-5" style={{ background: "#060b13", color: "#f8fafc", fontFamily: "sans-serif" }}>
        <div className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-2">
            <Brain size={35} color="#8B5CF6" />
            <h1 className="text-white fw-bold mb-0"> AI Resume Analyzer </h1>
          </div>
          <p className="text-secondary fs-5">
            Upload your resume to extract skills, detect your target role, and get Gemini AI improvement tips.
          </p>
        </div>

        {/* 1. Top Bar (Analysis Complete) */}
        <div className="d-flex justify-content-between align-items-center rounded-3 p-3 mb-4 border-success border" style={{ background: "#2f48303f" }}>
          <div className="d-flex align-items-center gap-2">
            <div  >
              <CheckCircle size={24} color="#26d741" />
            </div>
            <div>
              <span className="fw-semibold text-white d-block" style={{ fontSize: "14px" }}>Analysis Complete</span>
              <small className="text-secondary" style={{ fontSize: "12px" }}> {analysisData?.file_name || "Resume Uploaded"}</small>
            </div>
          </div>
          <button className="btn btn-link text-primary text-decoration-none fw-semibold p-0" style={{ fontSize: "14px" }}
            onClick={resetAnalyzer}>
            Upload New
          </button>
        </div>

        {/* 2. Main Two Column Layout */}
        <div className="row g-4">

          {/* LEFT COLUMN: Target Role & Core Skills */}
          <div className="col-lg-6 d-flex flex-column gap-4">

            {/* Card: Detected Target Role */}
            <div className="card border-0 p-4 rounded-4" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
              <div className="d-flex align-items-center gap-2 mb-4 text-white">
                <span style={{ color: "#6240c6" }}><Sparkles size={25} /></span>
                <span className="fw-bold fs-1">Detected Target Role</span>
              </div>
              <div className="text-center py-4 rounded-4" style={{ background: "#13192b", border: "1px solid #1e243d" }}>
                <div className="mx-auto rounded-4 d-flex align-items-center justify-content-center mb-3" style={{ width: "50px", height: "50px", background: "#252152", border: "1px solid #4338ca" }}>
                  <span style={{ color: "#a78bfa", fontSize: "20px" }}><Brain /></span>
                </div>
                <h3 className="fw-bold text-white mb-1" style={{ fontSize: "24px" }}>
                  <div className="mt-2 flex gap-1 justify-content-center">
                    {suggestedRoles.slice(1).map((role, rIdx) => (
                      <span key={rIdx} className="badge bg-secondary mx-1 opacity-75" style={{ fontSize: "11px" }}>
                        {role}
                      </span>
                    ))}
                  </div>
                </h3>
                <p className="text-secondary mb-4" style={{ fontSize: "14px" }}>Perfect Role according to resume</p>
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 " style={{ color: "#34d399" }}>
                  <span><GraphUp /></span> High demand role in current market
                </div>
              </div>
            </div>

            {/* Card: Extracted Core Skills */}
            <div className="card border-0 p-4 rounded-4 text-white" style={{ background: "#0f172a", border: "1px solid #1e293b", }}>
              {/* Header */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <FileText color="#34d399" size={25} />
                <span className="fw-bold fs-1" >
                  Extracted Core Skills
                </span>
              </div>

              {/* Skills */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {(analysisData?.skills || []).length > 0 ? (
                  analysisData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 rounded-pill fs-5 m-2"
                      style={{
                        background: "#1c223c",
                        color: "#a5b4fc",
                        fontSize: "13px",
                        border: "1px solid #2e375e",
                        fontWeight: 500,
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-secondary">No skills detected</span>
                )}
              </div>

              {/* Footer */}
              <div
                className="border-top pt-3 text-secondary"
                style={{
                  borderColor: "#1e293b",
                  fontSize: "13px",
                }}
              >
                <span className="text-white fw-semibold">
                  {analysisData?.skills?.length || 0}
                </span>{" "}
                skills detected from your resume
              </div>
            </div>
          </div>


          {/* RIGHT COLUMN: Evaluation & Improvement Suggestions */}
          <div className="col-lg-6 d-flex flex-column gap-4">

            {/* Card: Gemini AI Evaluation */}
            <div className="card border-0 p-4 rounded-4" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2 text-white">
                  <span style={{ color: "#5053f0" }}><Brain size={25} /></span>
                  <span className="fw-semibold fs-2">Gemini AI Evaluation</span>
                </div>
                <span style={{ fontSize: "11px", color: "#818cf8", background: "#252152", padding: "4px 8px", borderRadius: "4px" }}>Powered by Gemini</span>
              </div>

              {/* Score Ring Graphic */}
              <CircularProgress className='my-4' percentage={score} />
            </div>

            {/* Card: Key Improvement Suggestions */}
            <div
              className="card border-0 p-4 rounded-4"
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
              }}
            >

              {/* Header */}
              <div className="d-flex align-items-center gap-2 mb-4 text-white">
                <span style={{ color: "#fbbf24", fontSize: "18px" }}>🛈</span>
                <span className="fw-semibold" style={{ fontSize: "15px" }}>
                  Key Improvement Suggestions
                </span>
              </div>

              {/* Suggestions List */}
              
              <div className="d-flex flex-column gap-3 mb-4">
                {improvements.length > 0 ? (
                  improvements.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-start gap-2 p-3 rounded-3"
                      style={{
                        background: "#13192b",
                        border: "1px solid #1e243d",
                        fontSize: "13.5px",
                        color: "#e2e8f0",
                        lineHeight: "1.5"
                      }}
                    >
                      <span className="text-warning fw-bold me-1" style={{ whiteSpace: "nowrap" }}>
                        #Step {index + 1}:
                      </span>
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-secondary" style={{ fontSize: "13.5px" }}>
                    No explicit target improvement metrics captured.
                  </span>
                )}
              </div>


             {/* Updated Dynamic Tech-Stack Tip Section Container */}
              <div className="p-3 rounded-3" style={{
                  background: "linear-gradient(135deg, #062024, #0b2a2f)",
                  border: "1px solid #0e7490",
                }}>
                <div
                  className="d-flex align-items-center gap-2 mb-2"
                  style={{
                    color: "#22d3ee",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  <span>💡</span>
                  Tailored Profile Blueprint Audit Review
                </div>

                <p
                  className="mb-0 text-secondary"
                  style={{
                    fontSize: "12.8px",
                    lineHeight: "1.6",
                  }}
                >
                  {summary || "Review metrics setup processed without explicit parameters."}
                </p>
              </div>


            </div>
          </div>
        </div>
      </Container >

    );
  }

  // 5. Agar file upload nahi hui hai (Shuruat mein ye dikhega)
  return (
    <Container fluid className=" min-vh-100 p-5">
      {/* Header */}
      <div className="mb-5">
        <div className="d-flex align-items-center gap-3 mb-2">
          <Brain size={32} color="#8B5CF6" />
          <h1 className="text-white fw-bold mb-0"> AI Resume Analyzer </h1>
        </div>
        <p className="text-secondary fs-5">
          Upload your resume to extract skills, detect your target role, and get Gemini AI improvement tips.
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-0 shadow-lg rounded-4 p-4" style={{ background: "#0f172a" }}>
        <Card.Body>
          {/* Label ko clickable banaya taaki file explorer khule */}
          <label htmlFor="resumeUpload" style={{ width: "100%", cursor: "pointer" }}>
            <div
              className="d-flex flex-column justify-content-center align-items-center text-center rounded-4"
              style={{
                minHeight: "450px",
                border: "2px dashed #7C3AED",
                background: "#1e1b4b40",
              }}
            >
              <div
                className="d-flex justify-content-center align-items-center rounded-4 mb-4"
                style={{
                  width: "100px",
                  height: "100px",
                  background: "linear-gradient(135deg,#312e81,#0f766e)",
                }}
              >
                <Upload size={50} className="text-success" />
              </div>
              <h2 className="text-white fw-bold"> Drag and drop your PDF resume here, or browse files </h2>
              <p className="text-secondary fs-5"> Supports PDF up to 5MB </p>

              {/* Hidden File Input */}
              <input
                type="file"
                id="resumeUpload"
                accept=".pdf"
                className="d-none"
                onChange={handleFileUpload}
              />

              <Button
                size="lg"
                disabled={loading}
                className="px-5 py-3 rounded-4 border-0"
                style={{
                  background: "linear-gradient(90deg,#6D28D9,#8B5CF6)",
                }}
                as="span"
              >
                {
                  loading
                    ? "Analyzing Resume..."
                    : "Analyze Resume"
                }
              </Button>
            </div>
          </label>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResumeAnalyzer;

