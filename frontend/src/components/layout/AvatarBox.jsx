import React, { useState, useEffect } from "react";
import { uploadAvatar } from "../../api/authApi";

const AvatarBox = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.avatar) setAvatar(user.avatar);
  }, []);

  // 📸 preview handler
  const handleSelect = (e) => {
    const img = e.target.files[0];
    setFile(img);

    if (img) {
      setPreview(URL.createObjectURL(img));
    }
  };

  // 🚀 upload handler
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const res = await uploadAvatar(file);

      setAvatar(res.url);
      setPreview("");

      const user = JSON.parse(localStorage.getItem("user"));
      user.avatar = res.url;
      localStorage.setItem("user", JSON.stringify(user));

    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      
      {/* Avatar Preview */}
      <img
        src={preview || avatar || "/default.png"}
        alt="avatar"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #7C3AED",
        }}
      />

      <br /><br />

      {/* File Input */}
      <input type="file" accept="image/*" onChange={handleSelect} />

      <br /><br />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          padding: "10px 20px",
          background: "#7C3AED",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
        }}
      >
        {uploading ? "Uploading..." : "Upload Avatar"}
      </button>
    </div>
  );
};

export default AvatarBox;