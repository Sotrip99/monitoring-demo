import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 32,
        background: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        zIndex: 1000,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>Made by 김소현</span>
        <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>|</span>
        <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
          © {currentYear} All rights reserved
        </span>
      </div>
    </footer>
  );
};

