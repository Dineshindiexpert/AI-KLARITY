import React from 'react';

const CircularProgress=({ percentage = 0, size = 140, strokeWidth = 12 }) =>{
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Animated dot ki position math logic se nikalne ke liye
  const angle = (percentage / 100) * 360 - 90; // -90 deg rotate kiya kyuki progress upar se shuru hoti hai
  const angleRad = (angle * Math.PI) / 180;
  const dotX = size / 2 + radius * Math.cos(angleRad);
  const dotY = size / 2 + radius * Math.sin(angleRad);

  return (
    <>
      {/* Custom Keyframe Animations - Glow aur Pulse effects ke liye */}
      <style>{`
        @keyframes custom-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(1.05); }
        }
        .anim-pulse {
          animation: custom-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .progress-circle-transition {
          transition: stroke-dashoffset 2s ease-out;
        }
        .text-gradient {
          background: linear-gradient(135deg, #ffffff, #A78BFA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Main Wrapper */}
      <div className="position-relative d-inline-flex align-items-center justify-content-center">
        
        {/* Outer glow effect */}
        <div 
          className="position-absolute rounded-circle anim-pulse" 
          style={{
            inset: 0,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(16, 185, 129, 0.2))',
            filter: 'blur(24px)'
          }}
        ></div>

        {/* Main SVG */}
        <svg 
          width={size} 
          height={size} 
          className="position-relative" 
          style={{ zIndex: 10, transform: 'rotate(-90deg)' }}
        >
          {/* Background circle with subtle glow */}
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            stroke="rgba(124, 58, 237, 0.15)" 
            strokeWidth={strokeWidth} 
            fill="none" 
            style={{ filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.3))' }}
          />

          {/* Progress circle with gradient and glow */}
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            stroke="url(#progressGradient)" 
            strokeWidth={strokeWidth} 
            fill="none" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            strokeLinecap="round" 
            className="progress-circle-transition"
            style={{ filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.8))' }}
          />

          {/* Animated dot on the progress line edge */}
          <circle 
            cx={dotX} 
            cy={dotY} 
            r="6" 
            fill="url(#dotGradient)" 
            className="anim-pulse" 
            style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.8))' }}
          />

          <defs>
            {/* Main progress gradient */}
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Dot gradient */}
            <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content with background */}
        <div className="position-absolute text-center">
          <div className="position-relative">
            {/* Background glow for text */}
            <div 
              className="position-absolute rounded-circle" 
              style={{
                inset: 0,
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(16, 185, 129, 0.1))',
                filter: 'blur(16px)',
                transform: 'scale(1.5)'
              }}
            ></div>

            {/* Score display text */}
            <div className="position-relative">
              <div className="display-5 fw-bold text-gradient">
                {percentage}
              </div>
              <div className="small fw-medium mt-1" style={{ color: '#9CA3AF', fontSize: '12px' }}>
                / 100
              </div>
              <div className="fw-semibold mt-1 text-uppercase tracking-wider" style={{ color: '#10B981', fontSize: '10px' }}>
                {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Improving'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default CircularProgress;