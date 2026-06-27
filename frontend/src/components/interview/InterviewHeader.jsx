import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { Clock } from "react-bootstrap-icons";

const InterviewHeader = ({ onEndInterview, isRunning = true }) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning]);

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-4"
      style={{ background: "#111C34", borderBottom: "1px solid rgba(255,255,255,.08)" }}>

      <h1 className="text-white fw-bold mb-0">
        Live AI Technical Interview
      </h1>

      <div className="d-flex align-items-center gap-4">

        <div className="d-flex align-items-center px-4 py-3"
          style={{ border: "1px solid rgba(255,255,255,.3)", borderRadius: "50px", background: "#08111F" }}>

          <Clock size={18} color="#00E5B0" className="me-2" />

          <span style={{ color: "#00E5B0", fontWeight: 700 }}>
            {formatTime(seconds)}
          </span>
        </div>

        <Button variant="danger" onClick={() => onEndInterview?.(seconds)}>
          End Interview
        </Button>

      </div>
    </div>
  );
};

export default InterviewHeader;