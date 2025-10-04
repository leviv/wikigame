"use client";

import { useState, useEffect } from "react";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    title: string;
    type: string;
    content: string;
  } | null;
}

const DocumentModal = ({ isOpen, onClose, document }: DocumentModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible || !document) return null;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    opacity: isOpen ? 1 : 0,
    transition: "opacity 0.3s ease",
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: "#f9fafb",
    border: "3px solid #374151",
    borderRadius: "8px",
    width: "80%",
    maxWidth: "600px",
    maxHeight: "80%",
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    transform: isOpen ? "scale(1)" : "scale(0.9)",
    transition: "transform 0.3s ease",
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: "#1f2937",
    color: "#f9fafb",
    padding: "16px 20px",
    borderBottom: "2px solid #374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const closeButtonStyle: React.CSSProperties = {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "monospace",
    textTransform: "uppercase",
  };

  const contentStyle: React.CSSProperties = {
    padding: "20px",
    fontFamily: "monospace",
    fontSize: "12px",
    lineHeight: "1.6",
    color: "#1f2937",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxHeight: "400px",
    overflow: "auto",
  };

  const getDocumentHeader = () => {
    switch (document.type) {
      case "birth-certificate":
        return "OFFICIAL BIRTH CERTIFICATE";
      case "death-certificate":
        return "OFFICIAL DEATH CERTIFICATE";
      case "passport":
        return "INTERNATIONAL PASSPORT";
      case "medical-record":
        return "CONFIDENTIAL MEDICAL RECORD";
      case "employment-record":
        return "EMPLOYMENT HISTORY RECORD";
      case "criminal-record":
        return "CRIMINAL RECORD - RESTRICTED ACCESS";
      default:
        return "OFFICIAL DOCUMENT";
    }
  };

  const getDocumentIcon = () => {
    switch (document.type) {
      case "birth-certificate":
        return "📋";
      case "death-certificate":
        return "⚰️";
      case "passport":
        return "📘";
      case "medical-record":
        return "🏥";
      case "employment-record":
        return "💼";
      case "criminal-record":
        return "🚨";
      default:
        return "📄";
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div style={titleStyle}>
            {getDocumentIcon()} {getDocumentHeader()}
          </div>
          <button style={closeButtonStyle} onClick={onClose}>
            CLOSE
          </button>
        </div>
        <div style={contentStyle}>
          <div
            style={{
              backgroundColor: "#e5e7eb",
              padding: "12px",
              marginBottom: "16px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          >
            <strong>SUBJECT:</strong> {document.title}
          </div>
          {document.content}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
