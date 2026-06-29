import { useRef, useCallback } from "react";

export const useVoiceInterview = () => {
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  // ===================================
  // 1. AI SPEAK Logic (Wrapped in useCallback)
  // ===================================
  const speak = useCallback((text, callback) => {
    // Purani kisi bhi speech ko cancel karein
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95; // Thoda normal speed taaki natural lage
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log("AI Started speaking...");
    };

    utterance.onend = () => {
      console.log("AI Finished speaking.");
      // AI ki voice khud mic me capture na ho, isliye 800ms ka buffer delay
      setTimeout(() => {
        if (callback) callback();
      }, 800);
    };

    utterance.onerror = (err) => {
      console.log("Speech synthesis error:", err);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // ===================================
  // 2. USER LISTEN Logic (Fixed for Manual Submit Flow)
  // ===================================
  const listen = useCallback((onTranscriptChange, onStart = null, onEnd = null) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Use Chrome/Edge.");
      return;
    }

    if (isListeningRef.current) {
      console.log("Already listening...");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    
    // FIX: continuous true taaki aapke thode se pause lene par mic band na ho!
    recognition.continuous = true; 
    recognition.interimResults = true; // Live keyboard ki tarah typing dikhane ke liye
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("Mic activated.");
      isListeningRef.current = true;
      if (onStart) onStart();
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript + " ";
      }

      finalTranscript = finalTranscript.trim();
      console.log("Live Speech Input:", finalTranscript);

      // UI component me live text stream karne ke liye callback trigger
      if (onTranscriptChange) {
        onTranscriptChange(finalTranscript);
      }
    };

    recognition.onerror = (err) => {
      console.log("Speech recognition error:", err);
    };

    recognition.onend = () => {
      console.log("Mic deactivated.");
      isListeningRef.current = false;
      if (onEnd) onEnd();
    };

    try {
      recognition.start();
    } catch (err) {
      console.log("Failed to start mic:", err);
      isListeningRef.current = false;
    }
  }, []);

  // ===================================
  // 3. STOP EVERYTHING
  // ===================================
  const stopAll = useCallback(() => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
    console.log("Voice systems fully stopped.");
  }, []);

  return {
    speak,
    listen,
    stopAll,
  };
};
