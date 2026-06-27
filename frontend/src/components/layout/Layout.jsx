import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // URL se current page nikalne ke liye (e.g., "/settings" me se "settings" nikalega)
  // Agar sirf "/" par hai to "dashboard" active dikhega
  const currentPage = location.pathname.substring(1) || "dashboard";

  // Jab sidebar me kisi item par click hoga, tab ye function chalega
  const handleNavigation = (id) => {
    if (id === "dashboard") {
      navigate("/"); // Dashboard ke liye main path
    } else {
      navigate(`/${id}`); // Baaki pages ke liye path (jaise /settings)
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Yahan aap apna logout ka logic daal sakte hain (jaise localStorage clear karna)
  };

  return (
    <div className="d-flex vh-100 overflow-hidden bg-dark">
      {/* 
        Sidebar ko saari zaroori cheezein pass kar di:
        1. activePage: taki click hone par button purple highlithed dikhe
        2. onNavigate: taki click hone par URL badal sake
      */}
      <Sidebar 
        activePage={currentPage} 
        onNavigate={handleNavigation} 
        onLogout={handleLogout} 
      />

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto" style={{ background: "#020817" }}>
        {/* Page Content */}
        <div  style={{ marginTop: "60px" }}>
          {/* React Router is Outlet ki jagah par aapke switch hone wale pages dikhayega */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
