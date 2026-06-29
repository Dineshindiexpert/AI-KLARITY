import React from "react";
import { Card, Container, Badge, Button } from "react-bootstrap";
import { CreditCard2Front } from "react-bootstrap-icons";
import { Sparkles } from "lucide-react";

const BillingLayout = () => {
  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center p-3" 
      style={{ 
        minHeight: "100vh", 
        background: "radial-gradient(circle at top right, #1e1b4b 0%, #090d16 60%, #020617 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Premium Background Glow Artifacts */}
      <div style={{
        position: "absolute",
        width: "350px",
        height: "350px",
        background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(0,0,0,0) 70%)",
        top: "10%",
        left: "15%",
        zIndex: 0,
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)",
        bottom: "10%",
        right: "15%",
        zIndex: 0,
        pointerEvents: "none"
      }} />

      <Card 
        className="text-center p-4 p-md-5 border-0 shadow-2xl" 
        style={{ 
          maxWidth: "480px", 
          width: "100%", 
          background: "rgba(22, 31, 48, 0.75)", 
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)", 
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
          zIndex: 1,
          transform: "translateY(0)",
          transition: "transform 0.3s ease"
        }}
      >
        {/* ICON CONTAINER WITH DUAL GLOW */}
        <div className="d-flex justify-content-center mb-4">
          <div 
            className="d-flex align-items-center justify-content-center position-relative" 
            style={{ 
              width: 80, 
              height: 80, 
              borderRadius: 22, 
              background: "linear-gradient(135deg, #7C3AED 0%, #10B981 100%)",
            }}
          >
            {/* Outer Soft Glow */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "linear-gradient(135deg, #7C3AED 0%, #10B981 100%)",
              borderRadius: 22,
              filter: "blur(12px)",
              opacity: 0.5,
              zIndex: -1
            }} />
            <CreditCard2Front size={34} color="#fff" />
          </div>
        </div>

        {/* METALLIC STYLE BADGE */}
        <div className="d-flex justify-content-center mb-3">
          <Badge 
            className="d-flex align-items-center gap-1.5 px-3 py-2 text-uppercase tracking-wider" 
            style={{ 
              background: "linear-gradient(rgba(124,58,237,0.12), rgba(124,58,237,0.05))", 
              border: "1px solid rgba(124,58,237,0.25)", 
              color: "#A78BFA", 
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
              borderRadius: "100px"
            }}
          >
            <Sparkles size={13} className="text-purple-400" /> 
            Billing Module
          </Badge>
        </div>

        {/* TYPOGRAPHY */}
        <h2 className="text-white fw-bold mb-2" style={{ letterSpacing: "-0.02em" }}>
          Coming Soon
        </h2>
        
        <p className="mx-auto mb-4" style={{ color: "#94A3B8", fontSize: "0.925rem", lineHeight: "1.6", maxWidth: "90%" }}>
          We are building a smart billing system with subscription plans, invoices, and AI-powered upgrades.
        </p>

        {/* PREMIUM DISABLED BUTTON */}
        <Button 
          disabled 
          className="w-100 py-2.5 fw-semibold border-0 text-white position-relative overflow-hidden" 
          style={{ 
            background: "linear-gradient(135deg, #7C3AED 0%, #10B981 100%)", 
            borderRadius: "14px",
            opacity: 0.45,
            fontSize: "0.95rem",
            cursor: "not-allowed"
          }}
        >
          Not Available Yet
        </Button>

        {/* LIVE PULSE STATUS */}
        <div className="d-flex align-items-center justify-content-center gap-2 mt-4 pt-2">
          <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: 10, height: 10 }}>
            <span className="position-absolute" style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#F59E0B", opacity: 0.7, animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
          </div>
          <small className="fw-medium" style={{ color: "#64748B", fontSize: "0.8rem", letterSpacing: "0.02em" }}>IN ACTIVE DEVELOPMENT</small>
        </div>

        {/* SMOOTH GLOBAL ANIMATIONS */}
        <style>{`
          @keyframes ping {
            75%, 100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }
        `}</style>
      </Card>
    </Container>
  );
};

export default BillingLayout;
