import React from 'react'
import { Card, Row, Col, Form } from 'react-bootstrap'
import { Shield, Upload } from "react-bootstrap-icons";
import GradientBtn from "../../components/buttons/gradientbtn";


const ProfileLayout = () => {
  return (
    <div>
          <Card
          style={{
            background: "#0F172A",
            border: "1px solid #1E293B",
            borderRadius: "24px",
          }}
        >
          <Card.Body className="p-5">
            <h3 className="fw-bold mb-5 text-white">Profile Information</h3>

            <Row>
              {/* Left Side */}
              <Col lg={4} className="text-center mb-4">
                <div
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg,#7C3AED,#38BDF8)",
                    fontSize: "48px",
                    fontWeight: "700",
                  }}
                >
                  DN
                </div>

                <h5
                  style={{
                    color: "#7C3AED",
                    cursor: "pointer",
                  }}
                >
                  Upload New Photo
                </h5>

                <small className="text-secondary">
                  JPG, PNG (max 5MB)
                </small>
              </Col>

              {/* Right Side */}
              <Col lg={8}>
                <Form>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-white">
                      Full Name
                    </Form.Label>

                    <Form.Control
                      type="text"
                      defaultValue="Dinesh"
                      style={{
                        background: "#020617",
                        border: "none",
                        color: "#fff",
                        padding: "14px",
                        borderRadius: "16px",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-white mb-2">
                      Contact Email
                    </Form.Label>

                    <Form.Control
                      type="email"
                      defaultValue="dinesh@email.com"
                      style={{
                        background: "#020617",
                        border: "none",
                        color: "#fff",
                        padding: "14px",
                        borderRadius: "16px",
                      }}
                    />
                  </Form.Group>

                  {/* Upload Section */}
                  <div className="mb-4">
                    <p className="fw-semibold text-white mb-3">
                      <Shield
                        className="me-2 text-success"
                        size={18}
                      />
                      Government ID Verification (Optional)
                    </p>

                    <div
                      className="text-center"
                      style={{
                        border: "2px dashed #7C3AED",
                        borderRadius: "20px",
                        padding: "50px 20px",
                        background: "#020617",
                      }}
                    >
                      <Upload
                        size={45}
                        className="mb-3"
                        color="#7C3AED"
                      />

                      <h5 className="fw-bold text-white mb-2">
                        Upload Government ID / Verification Proof
                      </h5>

                      <p className="text-secondary mb-0">
                        Drag & Drop or Click to Browse
                        (PDF, JPEG)
                      </p>
                    </div>
                  </div>

                  <hr
                    style={{
                      borderColor: "#1E293B",
                    }}
                  />

                  <div className="d-flex justify-content-end">
                   <GradientBtn>
                    save changes
                   </GradientBtn>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      
    </div>
  )
}

export default ProfileLayout;
