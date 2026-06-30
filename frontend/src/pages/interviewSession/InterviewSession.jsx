import React, { useEffect, useState, useRef } from "react";
import {Container,Row,Col,Card,Button,Form,Badge,Spinner,} from "react-bootstrap";

import {MicFill,ClockFill,BoxArrowRight,ArrowRight,CpuFill, Stopwatch,} from "react-bootstrap-icons";

import { useLocation, useNavigate } from "react-router-dom";
import { nextQuestion, finishInterview } from "../../api/interviewApi";
import { useVoiceInterview } from "../../hooks/useVoiceInterview";
import { toast } from "react-toastify";

const InterviewSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { speak, listen, stopAll } = useVoiceInterview();

  // Route states from setup page
  const sessionId = location.state?.sessionId;
  const totalQuestions = location.state?.totalQuestions || 10;

  const [question, setQuestion] = useState(location.state?.question);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [aiStatus, setAiStatus] = useState("idle"); // 'idle' | 'speaking' | 'listening' | 'processing'

  // Safety lock to prevent simultaneous button and background triggers
  const isTriggeringNext = useRef(false);

  /* TIMER LOGIC */
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* UNMOUNT CLEANUP */
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  /* STRICT CONTROLLED VOICE ROUND FLOW */
  useEffect(() => {
    if (voiceMode && question && !isTriggeringNext.current) {
      runVoiceRound(question);
    } else if (!voiceMode) {
      stopAll();
      setAiStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, voiceMode]);

  const runVoiceRound = (currentQ) => {
    setAiStatus("speaking");

    speak(currentQ.question, () => {
      // Guard Check: ensures user didn't disable voice mode while AI was speaking
      setAiStatus("listening");

      listen((liveCapturedText) => {
        // Stream text strictly without auto-submitting it to next question
        setAnswer(liveCapturedText);
      });
    });
  };

  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  /* SINGLE MANUAL TRIGGER FOR NEXT ROUND */
  const handleNext = async () => {
    if (!answer.trim() || isTriggeringNext.current) {
      toast.error("Please provide or type an answer first!")
      
      return;
    }

    try {
      setLoading(true);
      setAiStatus("processing");
      isTriggeringNext.current = true;
      
      // Clear mic/audio listeners before initiating server state change
      stopAll(); 

      const data = await nextQuestion({
        session_id: sessionId,
        answer: answer.trim(),
      });

      if (data.is_finished) {
        handleFinish();
        return;
      }

      // Reset values cleanly for next loop round
      setAnswer("");
      setQuestion(data.question);
      setCurrentQuestion((prev) => prev + 1);
    } catch (error) {
      console.log("Error loading next question:", error);
      toast.error("Something went wrong. Please check your network or try again.")
      
    } finally {
      setLoading(false);
      isTriggeringNext.current = false;
      if (!voiceMode) setAiStatus("idle");
    }
  };

  /* END INTERVIEW ACTION */
  const handleFinish = async () => {
    try {
      stopAll();
      setVoiceMode(false);
      setAiStatus("idle");
      setFinishing(true);
      isTriggeringNext.current = true;

      const data = await finishInterview({
        session_id: sessionId,
      });

      navigate("/interview/report", {
        state: {
          report: data.report,
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to finish interview session.")
     
    } finally {
      setFinishing(false);
      isTriggeringNext.current = false;
    }
  };

  return (
    <div className="vh-100 d-flex flex-column" style={{ background: "#0B0F19" }}>
      {/* HEADER SECTION */}
      <div
        className="px-4 py-4 border-bottom "
        
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="text-white mb-1">AI Technical Interview</h5>
            <small style={{ color: "#94A3B8" }}>Real Interview Simulation</small>
          </div>

          <div className="d-flex align-items-center gap-4 ">
            <div className="text-success border rounded rounded-4 px-3 py-1 border-success">
              <Stopwatch className="me-2 text-success" size={25} />
              {formatTime()} mins
            </div>

            <small className="text-warning">
              Q {currentQuestion}/{totalQuestions}
            </small>

            <Button
            className="rouded  rounded-4"
              variant="outline-danger"
              size="sm"
              onClick={handleFinish}
              disabled={finishing || loading}
            >
              <BoxArrowRight className="me-2" />
              End Interview
            </Button>
          </div>
        </div>
      </div>

      {/* CORE FRAMEWORK BODY */}
      <Container fluid className="flex-grow-1 p-4">
        <Row className="h-100 g-4">
          {/* INTERVIEWER PANEL (LEFT side) */}
          <Col lg={5}>
            <Card
              className="border-0 h-100 rounded-4 p-4"
              style={{ background: "#111827" }}
            >
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 60, height: 60, background: "#1E293B" }}
                >
                  <CpuFill color="#8B5CF6" size={24} />
                </div>

                <div>
                  <h6 className="text-white mb-0">AI Interviewer</h6>
                  <small
                    style={{
                      color: voiceMode ? "#F59E0B" : "#34D399",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {voiceMode ? `🎙 Mode: ${aiStatus}` : "Text Interview Active"}
                  </small>
                </div>
              </div>

              <div className="mb-4">
                <Badge bg="primary" className="me-2 px-3 py-2">
                  {question?.skill || "General Topic"}
                </Badge>
                <Badge bg="warning" text="dark" className="px-3 py-2">
                  Difficulty {question?.difficulty || "Standard"}
                </Badge>
              </div>

              <Card className="border-0 rounded-4 p-4" style={{ background: "#1E293B" }}>
                <small style={{ color: "#94A3B8" }}>Current Question</small>
                <h4 className="text-white mt-3" style={{ lineHeight: 1.6, fontSize: "21px" }}>
                  {question?.question || "Awaiting question transmission..."}
                </h4>
              </Card>

              <Button
                className="mt-4 py-2"
                variant={voiceMode ? "danger" : "success"}
                disabled={loading || finishing}
                onClick={() => setVoiceMode(!voiceMode)}
              >
                {voiceMode ? " Switch to Keyboard Mode" : " Turn On Voice Assistant"}
              </Button>
            </Card>
          </Col>

          {/* CANDIDATE RESPONSES (RIGHT side) */}
          <Col lg={7}>
            <Card
              className="border-0 h-100 rounded-4 p-4"
              style={{ background: "#111827" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white mb-0">Your Answer Workspace</h5>
                {aiStatus === "listening" && (
                  <Badge bg="danger" className="px-3 py-2 border-0">
                    <MicFill className="me-1" /> Mic Is Live... Speak Freely
                  </Badge>
                )}
              </div>

              <Form.Control
                as="textarea"
                rows={12}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={
                  voiceMode
                    ? "AI is speaking... Once it finishes, mic turns on automatically. Speak, pause, think, and hit Submit below."
                    : "Type your thorough conceptual answer here..."
                }
                style={{
                  background: "#1E293B",
                  color: "#fff",
                  border: "1px solid #334155",
                  resize: "none",
                  fontSize: "16px",
                }}
                disabled={loading || aiStatus === "speaking"}
              />

              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-5 py-2"
                  onClick={handleNext}
                  disabled={loading || !answer.trim() || aiStatus === "speaking"}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      Submit Answer & Next <ArrowRight className="ms-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InterviewSession;
