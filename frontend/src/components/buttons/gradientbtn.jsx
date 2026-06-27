import React from "react";
import Button from "react-bootstrap/Button";

const GradientBtn = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{
        background: "linear-gradient(90deg, #7C3AED, #A78BFA)",
        border: "none",
        borderRadius: "14px",
        padding: "12px 28px",
        fontWeight: "600",
        color: "#fff",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow =
          "0 8px 20px rgba(124, 58, 237, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "none";
      }}
    >
      {children}
    </Button>
  );
};

export default GradientBtn;