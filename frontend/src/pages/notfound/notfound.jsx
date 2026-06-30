import React from 'react';
import { Link } from 'react-router-dom';

const Notfound = () => {
  return (
    <div className="notfound-container min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden px-3">
      
      {/* Background Glow Elements */}
      <div className="glow-glow-1 position-absolute"></div>
      <div className="glow-glow-2 position-absolute"></div>

      {/* Main Glassmorphism Card */}
      <div className="card glass-card border-0 text-center text-white p-4 p-md-5 position-relative shadow-lg w-100">
        
        {/* Responsive exact color fluid 404 header */}
        <h1 className="text-404-gradient fw-bold mb-0 lh-1">
          404
        </h1>

        <h2 className="fw-bold mt-2 text-white">
          Page Not Found
        </h2>

        <p className="mx-auto mt-3 mb-4 text-white text-opacity-75" style={{ maxWidth: '500px' }}>
          The page you're looking for doesn't exist or may have been moved.
          Return to your dashboard and continue your journey.
        </p>

        <div>
          {/* Button with premium exact layout look and feel */}
          <Link
            to="/"
            className="btn btn-dashboard-gradient text-white fw-semibold px-4 py-3"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Static Footer Section */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 text-white small opacity-75">
        &copy; {new Date().getFullYear()} AI Klarity. All rights reserved.
      </div>
    </div>
  );
};

export default Notfound;
