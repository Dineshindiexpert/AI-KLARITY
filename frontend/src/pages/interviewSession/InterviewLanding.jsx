import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Badge,
    Button,
    Form,
    Spinner
} from "react-bootstrap";

import {
    CheckCircleFill,
    PlayFill,
    ShieldCheck,
    BarChartFill,
    BriefcaseFill,
    Stars
} from "react-bootstrap-icons";

import { getResume } from "../../api/resumeApi";
import { startInterview } from "../../api/interviewApi";
import { useNavigate } from "react-router-dom";
import InterviewLoading from "./InterviewLoading";

const InterviewLanding = () => {
    const navigate = useNavigate();

    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);

    const [selectedRole, setSelectedRole] = useState("");
    const [customRole, setCustomRole] = useState("");

    useEffect(() => {
        fetchResume();
    }, []);

    const fetchResume = async () => {
    try {
        const data = await getResume();
        setResumeData(data);
        
        // Auto-select the first suggested role if available
        if (data?.suggested_roles && data.suggested_roles.length > 0) {
            setSelectedRole(data.suggested_roles[0]);
        }
       
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};
   const recommendedRoles = resumeData?.suggested_roles || [];
    const handleStart = async () => {
        try {
            setStarting(true);

            const finalRole =
                selectedRole === "custom"
                    ? customRole
                    : selectedRole;

            const data = await startInterview({
                job_role: finalRole,
                skills: resumeData.skills
            });

            localStorage.setItem(
                "session_id",
                data.session_id
            );

            navigate("/interview/live", {
                state: {
                    sessionId: data.session_id,
                    question: data.question,
                    totalQuestions: data.total_questions
                }
            });

        } catch (error) {
            console.log(error);
            setStarting(false);
        }
    };


    if (loading) {
        return (
            <div
                className="vh-100 d-flex flex-column justify-content-center align-items-center"
                style={{ background: "#0B0F19" }}
            >
                <Spinner animation="border" />
                <p className="text-white mt-3">
                    AI is analyzing your professional profile...
                </p>
            </div>
        );
    }

    if (starting) {
        return <InterviewLoading />;
    }

    const skills = resumeData?.skills || [];

    return (
        <div
            className="min-vh-100 py-5"
            style={{ background: "#0B0F19" }}
        >
            <Container>

                {/* HEADER */}

                <div className="text-center mb-5">

                    <div className="mb-3">
                        <Badge
                            bg="dark"
                            className="px-3 py-2"
                        >
                            AI Powered Mock Interview Engine
                        </Badge>
                    </div>

                    <h1 className="text-white fw-bold">
                        Technical Interview Simulator
                    </h1>

                    <p
                        className="mx-auto"
                        style={{
                            color: "#94A3B8",
                            maxWidth: "650px"
                        }}
                    >
                        Personalized interview generated from your resume,
                        skills and target job role.
                    </p>
                </div>

                <Row className="g-4">

                    {/* LEFT */}

                    <Col lg={7}>

                        {/* Resume Card */}

                        <Card
                            className="border-0 rounded-4 p-4 mb-4"
                            style={{ background: "#111827" }}
                        >
                            <div className="d-flex gap-3 align-items-center">

                                <div
                                    className="p-3 rounded-3"
                                    style={{ background: "#1E293B" }}
                                >
                                    <CheckCircleFill
                                        size={24}
                                        color="#34D399"
                                    />
                                </div>

                                <div>
                                    <h5 className="text-white">
                                        Resume Successfully Analyzed
                                    </h5>

                                    <small style={{ color: "#94A3B8" }}>
                                        AI extracted technical skills & profile data
                                    </small>
                                </div>

                            </div>
                        </Card>


                        {/* Score */}

                        <Card
                            className="border-0 rounded-4 p-4 mb-4"
                            style={{ background: "#111827" }}
                        >
                            <div className="d-flex gap-3 align-items-center">

                                <BarChartFill
                                    color="#60A5FA"
                                    size={24}
                                />

                                <div>
                                    <h5 className="text-white">
                                        Resume Score : {resumeData?.score}/100
                                    </h5>

                                    <small style={{ color: "#94A3B8" }}>
                                        Hireability : {resumeData?.hireability}
                                    </small>
                                </div>

                            </div>
                        </Card>


                        {/* Skills */}

                        <Card
                            className="border-0 rounded-4 p-4 mb-4"
                            style={{ background: "#111827" }}
                        >
                            <h5 className="text-white mb-3">
                                Skills Detected
                            </h5>

                            <div className="d-flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        style={{
                                            background: "#7C3AED",
                                            padding: "10px 14px"
                                        }}
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </Card>


                        {/* Role */}

                        <Card
                            className="border-0 rounded-4 p-4"
                            style={{ background: "#111827" }}
                        >
                            <h5 className="text-white mb-4">
                                Select Target Role
                            </h5>

                            <Form.Select
                                className="mb-3 bg-dark text-white border-secondary"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">Choose Role</option>

                                {recommendedRoles.map((role, index) => (
                                    <option key={index} value={role}>
                                        {role}
                                    </option>
                                ))}

                                <option value="custom">
                                    Other (Enter Manually)
                                </option>
                            </Form.Select>

                            {selectedRole === "custom" && (
                                <Form.Control
                                    placeholder="Enter your target role"
                                    className="bg-dark text-white border-secondary"
                                    value={customRole}
                                    onChange={(e) => setCustomRole(e.target.value)}
                                />
                            )}
                        </Card>

                    </Col>


                    {/* RIGHT */}

                    <Col lg={5}>

                        <Card
                            className="border-0 rounded-4 p-4 h-100"
                            style={{ background: "#111827" }}
                        >

                            <div className="d-flex gap-3 mb-4">

                                <div
                                    className="p-3 rounded-3"
                                    style={{ background: "#1E293B" }}
                                >
                                    <ShieldCheck
                                        size={24}
                                        color="#8B5CF6"
                                    />
                                </div>

                                <h5 className="text-white">
                                    Interview Guidelines
                                </h5>

                            </div>

                            <ul
                                className="ps-3"
                                style={{
                                    color: "#CBD5E1",
                                    lineHeight: "2"
                                }}
                            >
                                <li>10 AI generated technical questions</li>
                                <li>Questions based on your resume skills</li>
                                <li>Difficulty increases gradually</li>
                                <li>Voice + text supported</li>
                                <li>Do not refresh browser</li>
                                <li>AI performance evaluation at end</li>
                                <li>Communication quality also evaluated</li>
                            </ul>

                            <Card
                                className="border-0 mt-4 p-3"
                                style={{ background: "#0F172A" }}
                            >
                                <div className="d-flex gap-2 align-items-center">
                                    <Stars color="#F59E0B" />
                                    <small style={{ color: "#CBD5E1" }}>
                                        Simulates real company technical screening
                                    </small>
                                </div>
                            </Card>

                            <Button
                                size="lg"
                                disabled={
                                    starting ||
                                    !selectedRole ||
                                    (selectedRole === "custom" && !customRole)
                                }
                                onClick={handleStart}
                                className="border-0 mt-4"
                                style={{
                                    background:
                                        "linear-gradient(90deg,#7C3AED,#8B5CF6)"
                                }}
                            >
                                {starting ? (
                                    "Generating Questions..."
                                ) : (
                                    <>
                                        <PlayFill className="me-2" />
                                        Start Interview
                                    </>
                                )}
                            </Button>

                        </Card>

                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default InterviewLanding;