import React, { useState } from "react";
import {LayoutDashboard,FileText,Video,TrendingUp,Settings,LogOut,Brain,Menu,X,} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Sidebar({ activePage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    { icon: FileText, label: "Resume Analyzer", id: "resumeAnalyzer" },
    { icon: Video, label: "Interview Sessions", id: "interview" },
    { icon: TrendingUp, label: "Growth Analytics", id: "growthAnalytics" },
    { icon: Settings, label: "Settings", id: "setting" },
  ];

  const handleNavigation = (id) => {
    onNavigate(id);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/signin", { replace: true });
  };

  return (
    <>
      {/* Styles */}
      <style>{`
        .custom-sidebar {
          background-color: #0B0F19;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          width: 256px;
          height: 100vh;
          transition: transform 0.3s ease;
        }

        .nav-btn {
          width: 100%;
          border: 1px solid transparent;
          color: #9CA3AF;
          background: transparent;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          background-color: #161F30;
          color: #ffffff;
        }

        .nav-btn-active {
          background-color: rgba(124, 58, 237, 0.2);
          color: #ffffff !important;
          border-color: rgba(124, 58, 237, 0.3);
        }

        .profile-box {
          background-color: #161F30;
        }

        .logo-gradient {
          background: linear-gradient(135deg, #7C3AED, #A78BFA);
        }

        .avatar-gradient {
          background: linear-gradient(135deg, #7C3AED, #10B981);
        }

        @media (max-width: 991.98px) {
          .custom-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1040;
            transform: translateX(-100%);
          }
          .custom-sidebar.show {
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="d-lg-none position-fixed top-0 start-0 m-3 btn p-2 text-white profile-box"
        style={{ zIndex: 1050 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`custom-sidebar d-flex flex-column ${
          isOpen ? "show" : ""
        }`}
      >
        {/* Logo */}
        <div className="p-4">
          <div
            className="d-flex align-items-center gap-3"
            onClick={() => handleNavigation("dashboard")}
            style={{ cursor: "pointer" }}
          >
            <div className="logo-gradient rounded-3 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              <Brain size={24} className="text-white" />
            </div>
            <span className="fs-5 fw-semibold text-white">AI Klarity</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-grow-1 p-3 d-flex flex-column gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`nav-btn d-flex align-items-center gap-3 p-2 rounded-3 ${
                  isActive ? "nav-btn-active" : ""
                }`}
              >
                <Icon size={20} />
                <span className="small fw-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3">
          <div className="profile-box rounded-3 p-3 mb-2">
            <div className="d-flex align-items-center gap-3">
              <div
                className="avatar-gradient rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40 }}
              >
                <span className="small fw-bold text-white">DN</span>
              </div>

              <div>
                <div className="small fw-medium text-white">Dinesh</div>
                <div style={{ fontSize: 12 }} className="text-white-50">
                  dinesh@email.com
                </div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="nav-btn d-flex align-items-center gap-3 px-3 py-2 rounded-3"
          >
            <LogOut size={20} />
            <span className="small fw-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="d-lg-none position-fixed bg-black bg-opacity-50"
          style={{ inset: 0, zIndex: 1030 }}
        />
      )}
    </>
  );
}