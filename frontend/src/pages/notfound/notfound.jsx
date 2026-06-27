import React from 'react';
import { Link } from 'react-router-dom';

const Notfound = () => {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden px-3"
      style={{ background: '#050B1A' }}
    >
      {/* Background Glow */}
      <div className="glow glow-1 position-absolute"></div>
      <div className="glow glow-2 position-absolute"></div>

      {/* Main Card */}
      <div
        className="card border-0 text-center text-white p-4 p-md-5 position-relative"
        style={{
          maxWidth: '650px',
          width: '100%',
          background: 'rgba(17,25,40,0.8)',
          backdropFilter: 'blur(18px)',
          borderRadius: '24px',
          zIndex: 2,
        }}
      >
        <h1
          className="fw-bold mb-0"
          style={{
            fontSize: 'clamp(100px,18vw,180px)',
            background:
              'linear-gradient(135deg,#8B5CF6,#A855F7,#00D4FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
        >
          404
        </h1>

        <h2 className="fw-bold mt-2">
          Page Not Found
        </h2>

        <p
          className="mx-auto mt-3 mb-4 text-secondary"
          style={{ maxWidth: '500px' }}
        >
          The page you're looking for doesn't exist or may have been moved.
          Return to your dashboard and continue your journey.
        </p>

        <div>
          <Link
            to="/"
            className="btn text-white fw-semibold px-4 py-3"
            style={{
              borderRadius: '14px',
              background:
                'linear-gradient(135deg,#7C3AED,#A855F7)',
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x mb-3 text-secondary small"
      >
        © {new Date().getFullYear()} AI Klarity. All rights reserved.
      </div>
    </div>
  );
};

export default Notfound;