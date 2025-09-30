import React, { useState, useRef, useEffect } from "react";
import Login from "../Pages/login";
import Register from "../Pages/Register";
import "../Styles/SidebarAuth.css"; // asegúrate de crear este archivo CSS

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="sidebar-container"
      onMouseEnter={() => setIsOpen(true)}
    >
      <div
        ref={sidebarRef}
        className={`sidebar ${isOpen ? "open" : ""}`}
      >
        <div className="sidebar-header">
          <button onClick={() => setShowLogin(true)}>Login</button>
          <button onClick={() => setShowLogin(false)}>Registro</button>
        </div>
        <div className="sidebar-content">
          {showLogin ? (
            <Login onLoginSuccess={() => setIsOpen(false)} />
          ) : (
            <Register onRegisterSuccess={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
