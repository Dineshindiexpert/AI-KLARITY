import React, { useState, useRef, useEffect } from "react";

const VoiceInterview = () => {
  const [question] = useState(
    "Tell me about yourself and your experience with React.",
  );

  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      console.log(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  // AI speaks
  const speakQuestion = (text) => {
    console.log("Speak function called");

    window.speechSynthesis.cancel();

    // ADD THIS
    const voices = window.speechSynthesis.getVoices();

    const femaleVoice =
      voices.find((v) => v.name.includes("Google US English")) ||
      voices.find((v) => v.lang === "en-US");

    const utterance = new SpeechSynthesisUtterance(text);

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log("AI started speaking");
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log("AI finished speaking");
      setIsSpeaking(false);
      startListening();
    };

    utterance.onerror = (e) => {
      console.log("Speech Error:", e);
      setIsSpeaking(false);
    };

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 300);
  };

  // Mic start
  const startListening = () => {
    console.log("Mic starting...");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser does not support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("Mic ON");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const userSpeech = event.results[0][0].transcript;

      console.log("User Answer:", userSpeech);

      setTranscript(userSpeech);
    };

    recognition.onerror = (event) => {
      console.log("Mic Error:", event.error);
    };

    recognition.onend = () => {
      console.log("Mic stopped");
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>🎤 AI Voice Interview</h1>

      {/* Question Box */}
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px",
        }}
      >
        <h3>AI Question:</h3>
        <p>{question}</p>
      </div>

      {/* Start Button */}
      <button
        onClick={() => speakQuestion(question)}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          background: "#7C3AED",
          border: "none",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Start Interview
      </button>

      {/* Status */}
      <div style={{ marginTop: "30px" }}>
        <h3>Status:</h3>

        {isSpeaking && <p style={{ color: "orange" }}>🤖 AI Speaking...</p>}

        {isListening && <p style={{ color: "lime" }}>🎙 Listening...</p>}

        {!isListening && !isSpeaking && <p>Waiting...</p>}
      </div>

      {/* Transcript */}
      <div
        style={{
          marginTop: "30px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h3>Your Answer:</h3>
        <p>{transcript || "No speech detected yet..."}</p>
      </div>
    </div>
  );
};

export default VoiceInterview;
