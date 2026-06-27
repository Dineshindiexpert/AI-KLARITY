import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Form,
  Badge,
  Spinner
} from "react-bootstrap";

import {
  MicFill,
  MicMuteFill,
  ClockFill,
  BoxArrowRight,
  ArrowRight,
  CpuFill
} from "react-bootstrap-icons";

import { useLocation, useNavigate } from "react-router-dom";
import { nextQuestion, finishInterview } from "../../api/interviewApi";

const InterviewSession = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // from previous page
  const sessionId = location.state?.sessionId;
  const totalQuestions = location.state?.totalQuestions || 10;

  const [question, setQuestion] = useState(location.state?.question);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  const [loading, setLoading] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const [seconds, setSeconds] = useState(0);

  /* TIMER */

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  /* NEXT QUESTION */

  const handleNext = async () => {
    if (!answer.trim()) {
      alert("Please answer first");
      return;
    }

    try {
      setLoading(true);

      const data = await nextQuestion({
        session_id: sessionId,
        answer: answer
      });

      if (data.is_finished) {
        handleFinish();
        return;
      }

      setQuestion(data.question);
      setCurrentQuestion((prev) => prev + 1);
      setAnswer("");

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* FINISH INTERVIEW */

  const handleFinish = async () => {
    try {
      setFinishing(true);

      const data = await finishInterview({
        session_id: sessionId
      });

      console.log(data);

      navigate("/interview/report", {
        state: {
          report: data.report
        }
      });

    } catch (error) {
      console.log(error);
      alert("Failed to finish interview");
    } finally {
      setFinishing(false);
    }
  };

  return (
    <div
      className="vh-100 d-flex flex-column"
      style={{ background: "#0B0F19" }}
    >

      {/* HEADER */}

      <div
        className="px-4 py-3 border-bottom"
        style={{
          background: "#111827",
          borderColor: "rgba(255,255,255,.08)"
        }}
      >
        <div className="d-flex justify-content-between align-items-center">

          <div>
            <h5 className="text-white mb-1">
              AI Technical Interview
            </h5>

            <small style={{ color: "#94A3B8" }}>
              Real Interview Simulation
            </small>
          </div>

          <div className="d-flex align-items-center gap-4">

            <div className="text-white">
              <ClockFill className="me-2" color="#60A5FA" />
              {formatTime()}
            </div>

            <small style={{ color: "#94A3B8" }}>
              Q {currentQuestion}/{totalQuestions}
            </small>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleFinish}
              disabled={finishing}
            >
              <BoxArrowRight className="me-2" />
              End Interview
            </Button>

          </div>

        </div>
      </div>


      {/* BODY */}

      <Container fluid className="flex-grow-1 p-4">
        <Row className="h-100 g-4">

          {/* LEFT */}

          <Col lg={5}>

            <Card
              className="border-0 h-100 rounded-4 p-4"
              style={{ background: "#111827" }}
            >

              <div className="d-flex align-items-center gap-3 mb-4">

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 60,
                    height: 60,
                    background: "#1E293B"
                  }}
                >
                  <CpuFill color="#8B5CF6" size={24} />
                </div>

                <div>
                  <h6 className="text-white mb-0">
                    AI Interviewer
                  </h6>

                  <small style={{ color: "#34D399" }}>
                    Listening...
                  </small>
                </div>

              </div>


              <div className="mb-4">

                <Badge bg="primary" className="me-2 px-3 py-2">
                  {question?.skill}
                </Badge>

                <Badge bg="warning" text="dark">
                  Difficulty {question?.difficulty}
                </Badge>

              </div>


              <Card
                className="border-0 rounded-4 p-4"
                style={{ background: "#1E293B" }}
              >
                <small style={{ color: "#94A3B8" }}>
                  Current Question
                </small>

                <h4
                  className="text-white mt-3"
                  style={{
                    lineHeight: 1.6,
                    fontSize: "22px"
                  }}
                >
                  {question?.question}
                </h4>

              </Card>

            </Card>

          </Col>


          {/* RIGHT */}

          <Col lg={7}>

            <Card
              className="border-0 h-100 rounded-4 p-4"
              style={{ background: "#111827" }}
            >

              <h5 className="text-white mb-3">
                Your Answer
              </h5>

              <Form.Control
                as="textarea"
                rows={13}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Answer like a real interview..."
                className="border-0 shadow-none rounded-4 p-4"
                style={{
                  background: "#1E293B",
                  color: "white",
                  resize: "none"
                }}
              />

              <div className="mt-4 d-flex justify-content-between align-items-center">

                <Button
                  variant="dark"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <>
                      <MicMuteFill className="me-2" />
                      Mic Off
                    </>
                  ) : (
                    <>
                      <MicFill className="me-2" />
                      Mic On
                    </>
                  )}
                </Button>

                <small style={{ color: "#94A3B8" }}>
                  {answer.length} chars
                </small>

                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="border-0 px-4"
                  style={{
                    background:
                      "linear-gradient(90deg,#7C3AED,#8B5CF6)"
                  }}
                >
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="ms-2" />
                    </>
                  )}
                </Button>

              </div>

            </Card>

          </Col>

        </Row>
      </Container>


      {/* FOOTER */}

      <div
        className="px-4 py-3"
        style={{ background: "#111827" }}
      >

        <ProgressBar
          now={(currentQuestion / totalQuestions) * 100}
          style={{ height: "8px" }}
        />

        <div
          className="mt-2"
          style={{
            color: "#94A3B8",
            fontSize: "14px"
          }}
        >
          Progress {currentQuestion} / {totalQuestions}
        </div>

      </div>

    </div>
  );
};

export default InterviewSession;