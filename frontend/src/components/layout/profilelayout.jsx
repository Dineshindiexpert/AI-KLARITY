import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import GradientBtn from "../../components/buttons/gradientbtn";
import { uploadAvatar } from "../../api/authApi";
import { toast } from "react-toastify";

const ProfileLayout = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      }));
    }

    console.log("LOCAL USER =", user);
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Upload avatar
  // Upload avatar
  const handleImageChange = async (e) => {
    // 🔴 FIX 1: Index [0] lagana zaruri hai file access karne ke liye
    const file = e.target.files[0];
    if (!file) return;

    // Instant local UI preview (Optional but great for speed)
    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      avatar: previewUrl,
    }));

    try {
      setLoading(true);

      // API call trigger
      const res = await uploadAvatar(file);
      console.log("UPLOAD RESPONSE FROM BACKEND =", res);

      // 🔴 FIX 2: Aapka function already `res.data` return kar raha hai
      // Toh aapko direct `res.url` check karna hai (res.data.url nahi)
      const newAvatar = res?.url;

      if (!newAvatar) {
        throw new Error("Server response me secure_url nahi mila!");
      }

      // Permanent state update with Cloudinary URL
      setProfile((prev) => ({
        ...prev,
        avatar: newAvatar,
      }));

      // LocalStorage sync
      const oldUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...oldUser,
          avatar: newAvatar,
        }),
      );
      toast.success("Avatar uploaded successfully!")
       
    } catch (err) {
      console.error("Upload error details:", err);
      toast.error("Image upload failed!")
      
    } finally {
      setLoading(false);
    }
  };

  const initials = profile.name?.trim()
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleSave = async () => {
    try {
      setLoading(true);

      if (
        profile.new_password &&
        profile.new_password !== profile.confirm_password
      ) {
        toast.error("Password mismatch!")
         
        return;
      }

      // later API call here
      const oldUser = JSON.parse(localStorage.getItem("user"));

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...oldUser,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        }),
      );

      toast.success("Profile updated successfully");
    } catch (err) {
      console.log(err);
      toast.success("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          {/* LEFT SIDE */}
          <Col lg={4} className="text-center mb-4">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="d-block mx-auto"
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #7C3AED",
                  marginBottom: "15px",
                }}
              />
            ) : (
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center text-white"
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#7C3AED,#38BDF8)",
                  fontSize: "42px",
                  fontWeight: "700",
                }}
              >
                {initials}
              </div>
            )}

            <label
              className="d-block mt-2"
              style={{ color: "#7C3AED", cursor: "pointer" }}
            >
              Upload New Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>

            <small className="text-secondary d-block">JPG, PNG (max 5MB)</small>
          </Col>

          {/* RIGHT SIDE */}
          <Col lg={8}>
            <Form>
              <Form.Control
                name="name"
                value={profile.name}
                onChange={handleChange}
                style={inputStyle}
                className="mb-3"
                placeholder="Full Name"
              />

              <Form.Control
                name="email"
                value={profile.email}
                onChange={handleChange}
                style={inputStyle}
                className="mb-3"
                placeholder="Email"
              />

              <Form.Control
                type="password"
                name="old_password"
                placeholder="Old Password"
                value={profile.old_password}
                onChange={handleChange}
                style={inputStyle}
                className="mb-3"
              />

              <Form.Control
                type="password"
                name="new_password"
                placeholder="New Password"
                value={profile.new_password}
                onChange={handleChange}
                style={inputStyle}
                className="mb-3"
              />

              <Form.Control
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={profile.confirm_password}
                onChange={handleChange}
                style={inputStyle}
                className="mb-3"
              />

              <div className="d-flex justify-content-end">
                <GradientBtn onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </GradientBtn>
              </div>
            </Form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const inputStyle = {
  background: "#020617",
  border: "1px solid #1E293B",
  color: "#fff",
  padding: "14px",
  borderRadius: "16px",
};

export default ProfileLayout;
