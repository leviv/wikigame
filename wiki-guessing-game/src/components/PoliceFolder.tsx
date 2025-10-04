"use client";

import { useState } from "react";

interface PoliceFolderProps {
  title: string;
  content: string;
  maskedContent: string;
  url?: string;
  isOpen: boolean;
  onToggle: () => void;
}

const PoliceFolder = ({
  title,
  content,
  maskedContent,
  url,
  isOpen,
  onToggle,
}: PoliceFolderProps) => {
  const folderStyle: React.CSSProperties = {
    position: "absolute",
    top: "50px",
    left: "50px",
    width: "400px",
    height: isOpen ? "500px" : "60px",
    backgroundColor: "#1f2937",
    border: "3px solid #374151",
    borderRadius: "8px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
    zIndex: 100,
    overflow: "hidden",
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: "#111827",
    color: "#f9fafb",
    padding: "12px 16px",
    borderBottom: "2px solid #374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    userSelect: "none",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: "#dc2626",
    color: "white",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "bold",
    fontFamily: "monospace",
  };

  const contentStyle: React.CSSProperties = {
    padding: "20px",
    backgroundColor: "#f9fafb",
    height: "calc(100% - 60px)",
    overflow: "auto",
    fontFamily: "monospace",
    fontSize: "12px",
    lineHeight: "1.4",
    color: "#1f2937",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  const caseHeaderStyle: React.CSSProperties = {
    backgroundColor: "#1f2937",
    color: "#f9fafb",
    padding: "8px 12px",
    margin: "-20px -20px 16px -20px",
    borderBottom: "2px solid #374151",
    fontFamily: "monospace",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const linkStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "10px",
    textDecoration: "none",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <div style={folderStyle}>
      <div style={headerStyle} onClick={onToggle}>
        <div style={titleStyle}>CASE FILE: {title}</div>
        <div style={badgeStyle}>CLASSIFIED</div>
      </div>

      {isOpen && (
        <>
          <div style={caseHeaderStyle}>
            CONFIDENTIAL POLICE REPORT - UNAUTHORIZED ACCESS PROHIBITED
          </div>
          <div style={contentStyle}>{maskedContent}</div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              VIEW SOURCE
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default PoliceFolder;
