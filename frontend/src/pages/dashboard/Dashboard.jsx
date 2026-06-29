import React, { useEffect, useState } from "react";
import {Card,Container,Row,Col,ProgressBar,Button,Spinner,} from "react-bootstrap";

import { Upload } from "react-bootstrap-icons";
import { Target, TrendingUp, Video, Award } from "lucide-react";

import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from "recharts";

import CircularProgress from "../../components/Progressbar";
import GradientBtn from "../../components/buttons/gradientbtn";

import { getResume } from "../../api/resumeApi";
import { getDashboardAnalytics } from "../../api/interviewApi";

const cardStyle = {
  background: "rgba(22, 31, 48, 0.75)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "18px",
  transition: "0.3s",
};

const Dashboard = () => {
  const [resumeData, setResumeData] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resume, dash] = await Promise.all([
        getResume(),
        getDashboardAnalytics(),
      ]);
      setResumeData(resume);
      setDashboard(dash);
    } finally {
      setLoading(false);
    }
  };
  const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      try {
        setLoading(true);
  
        // STEP 1: upload
        const uploadResponse = await uploadResume(file);
        console.log("UPLOAD RESPONSE:", uploadResponse);
  
        
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

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  const chartData = dashboard?.chartData || [];
   const cardStyle = {
    background: "rgba(17, 25, 40, 0.75)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    color: "#fff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
  };


  return (
    <div style={{ background: "#0B1220", minHeight: "100vh" }}>
      <Container fluid className="px-4 py-4">
        {/* HEADER */}
        <Row className="align-items-center mb-4">
          <Col>
            <h2 className="text-white fw-bold mb-1">Welcome back 👋</h2>
            <p className="text-secondary mb-0">
              Track your interview growth in real-time
            </p>
          </Col>

          <Col xs="auto">
            <GradientBtn>✨ Start New Mock Interview</GradientBtn>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          {/* RESUME SCORE */}
          <Col lg={3}>
            <div style={cardStyle} className="p-4 h-100 position-relative">
              <div className="d-flex justify-content-between align-items-start">
                <div
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 12,
                    background: "linear-gradient(135deg,#7C3AED,#4F46E5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Award size={22} color="#fff" />
                </div>

                 
              </div>

              <div className="mt-3">
                <p className="text-secondary mb-1 text-center text-white">Resume Score</p>

                

                <div className="mt-2 d-flex">
                  <CircularProgress className='justify-content-center' percentage={resumeData?.score ?? 0} />
                </div>
              </div>
            </div>
          </Col>

          {/* LATEST SCORE */}
          <Col lg={3}>
            <div style={cardStyle} className="p-4 h-100">
              <div className="d-flex justify-content-between">
                <div
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 12,
                    background: "linear-gradient(135deg,#6366F1,#22C55E)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUp size={22} color="#fff" />
                </div>

                 
              </div>

              <p className="text-secondary mt-3 mb-1">Latest Interview Score</p>

              <h1 className="text-white fw-bold">
                {dashboard?.latestScore ?? 0}%
              </h1>

              <small className="text-secondary">Gemini Evaluated</small>
            </div>
          </Col>

          {/* TOTAL INTERVIEWS */}
          <Col lg={3}>
            <div style={cardStyle} className="p-4 h-100">
              <div className="d-flex justify-content-between">
                <div
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 12,
                    background: "linear-gradient(135deg,#06B6D4,#3B82F6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Video size={22} color="#fff" />
                </div>
              </div>

              <p className="text-secondary mt-3 mb-1">Total Interviews</p>

              <h1 className="text-white fw-bold">
                {dashboard?.totalInterviews ?? 0}
              </h1>

              <small className="text-secondary">Sessions Completed</small>
            </div>
          </Col>

          {/* IMPROVEMENT */}
          <Col lg={3}>
            <div style={cardStyle} className="p-4 h-100 position-relative">
              <div className="d-flex justify-content-between">
                <div
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 12,
                    background: "linear-gradient(135deg,#F59E0B,#EF4444)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Target size={22} color="#fff" />
                </div>

                
              </div>

              <p className="text-secondary mt-3 mb-1">Overall Improvement</p>

              <h1 className="text-white fw-bold">
                {dashboard?.improvement ?? 0}%
              </h1>

              <small className="text-secondary">Since First Interview</small>
            </div>
          </Col>
        </Row>

        {/* CHART + SKILLS */}
 <Row className="g-4 mb-4 align-items-stretch">

      {/* ================= CHART ================= */}
      <Col lg={8}>
        <Card style={cardStyle} className="p-3 h-100">
          <h5 className="mb-3"><span><TrendingUp size={40}  className="me-2 text-success"/></span> Interview Score Progress</h5>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>

              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#scoreGradient)"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Col>

      {/* ================= SKILLS ================= */}
      <Col lg={4}>
        <Card style={cardStyle} className="p-3 h-100">
          <h5 className="mb-3">⚡ Core Skills Progress</h5>

          {[
            { label: "Communication", value: 85, color: "success" },
            { label: "Technical", value: 78, color: "info" },
            { label: "Confidence", value: 82, color: "warning" },
            { label: "Role Alignment", value: 73, color: "primary" },
          ].map((s, i) => (
            <div key={i} className="mb-3">

              <div className="d-flex justify-content-between mb-1">
                <small style={{ opacity: 0.8 }}>{s.label}</small>
                <small style={{ fontWeight: 600 }}>{s.value}%</small>
              </div>

              <ProgressBar
                now={s.value}
                variant={s.color}
                style={{
                  height: "10px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              />
            </div>
          ))}
        </Card>
      </Col>
    </Row>
    </Container>
    </div>
  );
};

export default Dashboard;
