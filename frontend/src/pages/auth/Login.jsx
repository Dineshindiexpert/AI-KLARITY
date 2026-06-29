import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Eye, EyeSlash, Github, Google } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { loginUser } from "../../api/authApi";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser({ email, password });

      console.log("LOGIN RESPONSE:", response);

      const data = response?.data || response;

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");

      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Left Side */}
          <Col lg={6} className="left-panel">
            <div className="logo-area">
              <div className="logo-box">🧠</div>
              <h2>AI Klarity</h2>
            </div>

            <h1 className="hero-title">
              Master Your Tech Interviews with Gemini AI
            </h1>

            <p className="hero-text">
              Track your growth, analyze your resumes, and practice with
              real-time AI evaluation.
            </p>

            <ul className="feature-list">
              <li>Real-time AI interview feedback</li>
              <li>Advanced performance analytics</li>
              <li>Resume optimization tools</li>
            </ul>

            <div className="stats-card">
              <div>
                <h2>10,000+</h2>
              </div>

              <div>
                <h2>95%</h2>
              </div>

              <div>
                <h2>4.9/5</h2>
              </div>
            </div>
          </Col>

          {/* Right Side */}
          <Col lg={6} className="right-panel">
            <div className="login-box">
              <h1 className="fw-bold text-white mb-2">Welcome back</h1>

              <p className="text-secondary">
                Don't have an account?
                <Link to="/register" className="signup-link">
                  Sign up
                </Link>
              </p>

              <Row className="g-3 mt-2">
                <Col>
                  <Button className="social-btn w-100">
                    <Github className="me-2" />
                    GitHub
                  </Button>
                </Col>

                <Col>
                  <Button className="social-btn w-100">
                    <Google className="me-2" />
                    Google
                  </Button>
                </Col>
              </Row>

              <div className="divider">
                <span>or continue with email</span>
              </div>

              <Form>
                <Form.Control
                  type="email"
                  placeholder="dinesh@email.com"
                  className="custom-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between">
                    <Form.Label>Password</Form.Label>

                    <a href="/" className="forgot-link">
                      Forgot Password?
                    </a>
                  </div>

                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="custom-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </Form.Group>

                <Form.Check
                  label="Keep me logged in for 30 days"
                  className="text-light mb-4"
                />

                <Button
                  className="login-btn w-100"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In to Dashboard"}
                </Button>
              </Form>

              <p className="footer-text">
                By signing in, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
