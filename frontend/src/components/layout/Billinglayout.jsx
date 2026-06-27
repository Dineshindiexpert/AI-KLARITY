import React from "react";
import { Card, Row, Col, Button, Container, } from "react-bootstrap";
import { Calendar3, CreditCard2Front, } from "react-bootstrap-icons";

import GradientBtn from "../buttons/gradientbtn";

const BillingLayout = () => {
    return (
        <>
            {/* Current Subscription */}
            <Card
                className="border-0 mb-4"
                style={{
                    background: "#111C34",
                    borderRadius: "20px",
                }}
            >
                <Card.Body className="p-4">
                    <h4 className="fw-bold mb-4 text-white">
                        Current Subscription
                    </h4>

                    {/* Plan Card */}
                    <div
                        style={{
                            background:
                                "linear-gradient(135deg,#2C215E,#163C43)",
                            border: "1px solid #5B21B6",
                            borderRadius: "20px",
                            padding: "30px",
                        }}
                    >
                        <Row>
                            <Col md={9}>
                                <small className="text-secondary">
                                    Your Plan
                                </small>

                                <h1 className="fw-bold mt-2 text-white">
                                    Premium Developer Pass
                                </h1>

                                <p className="text-white mt-3">
                                    Full access to AI interview platform and
                                    analytics
                                </p>

                                <div className="mt-4 d-flex align-items-center gap-2">
                                    <Calendar3 color="#00E5A0" />
                                    <span className="fw-semibold text-white">
                                        Next Renewal Date: July 08, 2026
                                    </span>
                                </div>
                            </Col>

                            <Col md={3} className="text-md-end mt-4 mt-md-0">
                                <small className="text-secondary">
                                    Monthly Cost
                                </small>

                                <h1 className="fw-bold text-white">$19</h1>

                                <span className="text-secondary">
                                    /month
                                </span>
                            </Col>
                        </Row>

                        <hr
                            style={{
                                borderColor: "rgba(255,255,255,.1)",
                                margin: "30px 0",
                            }}
                        />

                        <Row className="text-center">
                            <Col md={4}>
                                <h2 className="fw-bold text-white">Unlimited</h2>
                                <p className="text-secondary">
                                    AI Interviews
                                </p>
                            </Col>

                            <Col md={4}>
                                <h2 className="fw-bold text-white">Advanced</h2>
                                <p className="text-secondary">
                                    Analytics & Reports
                                </p>
                            </Col>

                            <Col md={4}>
                                <h2 className="fw-bold text-white">Priority</h2>
                                <p className="text-secondary">
                                    Support Access
                                </p>
                            </Col>
                        </Row>
                    </div>

                    {/* Buttons */}
                    <Row className="mt-4">
                        <Col md={6} className="mb-3 mb-md-0">
                            <Button
                                className="w-100 fw-semibold text-white"
                                style={{
                                    background: "#020617",
                                    border: "1px solid #1E293B",
                                    borderRadius: "14px",
                                    height: "55px",
                                }}
                            >
                                Cancel Subscription
                            </Button>
                        </Col>

                        <Col md={6}>
                            <GradientBtn className="w-100 text-white fw-semibold" style={{ height: "55px" }}>
                                Upgrade to Annual Plan
                            </GradientBtn>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Payment Method */}
            <Card
                className="border-0"
                style={{
                    background: "#111C34",
                    borderRadius: "20px",
                }}
            >
                <Card.Body className="p-4">
                    <h4 className="fw-bold mb-4t text-white">
                        Payment Method
                    </h4>

                    <div
                        className="d-flex justify-content-between align-items-center flex-wrap"
                        style={{
                            background: "#091120",
                            borderRadius: "18px",
                            padding: "20px",
                        }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "12px",
                                    background:
                                        "linear-gradient(135deg,#7C3AED,#A78BFA)",
                                }}
                            >
                                <CreditCard2Front size={22} />
                            </div>

                            <div>
                                <h6 className="mb-1 fw-bold text-white">
                                    Visa •••• 4242
                                </h6>
                                <small className="text-secondary">
                                    Expires 12/2028
                                </small>
                            </div>
                        </div>

                        <Button className="fw-semibold text-white"
                            style={{
                                background: "#020617",
                                border: "1px solid #1E293B",
                                borderRadius: "12px",
                                padding: "10px 20px",
                            }}
                        >
                            Update Card
                        </Button>

                    </div>
                    <div className="mt-4">
                        <Button
                            className="w-100"
                            style={{
                                background: "#020617",
                                border: "1px solid #5B21B6",
                                borderRadius: "14px",
                                height: "55px",
                                color: "#fff",
                                fontWeight: "600",
                            }}
                        >
                            Manage Payment Method
                        </Button>
                    </div>

                </Card.Body>
            </Card>
            <Card
                className="border-0 mt-4"
                style={{
                    background: "#111C34",
                    borderRadius: "20px",
                }}
            >
                <Card.Body className="p-4">
                    <h4 className="fw-bold mb-4 text-white">
                        Invoice History
                    </h4>

                    <div className="table-responsive">
                        <table className="table invoice-table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Invoice ID</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    {
                                        date: "Jun 08, 2026",
                                        invoice: "INV-2026-1234",
                                    },
                                    {
                                        date: "May 08, 2026",
                                        invoice: "INV-2026-1189",
                                    },
                                    {
                                        date: "Apr 08, 2026",
                                        invoice: "INV-2026-1142",
                                    },
                                    {
                                        date: "Mar 08, 2026",
                                        invoice: "INV-2026-1098",
                                    },
                                ].map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.date}</td>

                                        <td>{item.invoice}</td>

                                        <td className="fw-bold">
                                            $19.00
                                        </td>

                                        <td>
                                            <span className="status-paid">
                                                Paid
                                            </span>
                                        </td>

                                        <td className="text-end">
                                            <button className="receipt-btn">
                                                Download Receipt
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default BillingLayout;