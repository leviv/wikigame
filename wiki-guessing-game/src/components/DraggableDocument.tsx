"use client";

import React, { useState, useRef } from "react";

interface DraggableDocumentProps {
  id: string;
  title: string;
  type:
    | "birth-certificate"
    | "death-certificate"
    | "passport"
    | "medical-record"
    | "employment-record"
    | "criminal-record";
  content: string;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onOpen: (id: string) => void;
  isOpen: boolean;
  isRevealed: boolean;
}

const DraggableDocument = ({
  id,
  title,
  type,
  content,
  position,
  onPositionChange,
  onOpen,
  isOpen,
  isRevealed,
}: DraggableDocumentProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const documentRef = useRef<HTMLDivElement>(null);

  const getDocumentIcon = () => {
    switch (type) {
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

  const getDocumentColor = () => {
    switch (type) {
      case "birth-certificate":
        return "#fef3c7";
      case "death-certificate":
        return "#f3f4f6";
      case "passport":
        return "#dbeafe";
      case "medical-record":
        return "#fce7f3";
      case "employment-record":
        return "#ecfdf5";
      case "criminal-record":
        return "#fee2e2";
      default:
        return "#ffffff";
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== documentRef.current) return;

    setIsDragging(true);
    const rect = documentRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };

    onPositionChange(id, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const documentStyle: React.CSSProperties = {
    position: "absolute",
    left: position.x,
    top: position.y,
    width: "120px",
    height: "160px",
    backgroundColor: isRevealed ? getDocumentColor() : "#1f2937",
    border: isRevealed ? "2px solid #16a34a" : "2px solid #374151",
    borderRadius: "8px",
    cursor: isDragging ? "grabbing" : "grab",
    boxShadow: isDragging
      ? "0 8px 25px rgba(0,0,0,0.3)"
      : isRevealed
      ? "0 4px 12px rgba(22, 163, 74, 0.3)"
      : "0 4px 12px rgba(0,0,0,0.15)",
    transform: isDragging ? "rotate(2deg)" : "rotate(0deg)",
    transition: isDragging ? "none" : "all 0.2s ease",
    zIndex: isDragging ? 1000 : 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    fontFamily: "monospace",
    fontSize: "12px",
    textAlign: "center",
    userSelect: "none",
    opacity: isRevealed ? 1 : 0.6,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "24px",
    marginBottom: "4px",
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: isRevealed ? "#1f2937" : "#9ca3af",
    marginBottom: "4px",
    lineHeight: "1.2",
  };

  const typeStyle: React.CSSProperties = {
    fontSize: "10px",
    color: isRevealed ? "#6b7280" : "#4b5563",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const openButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    width: "20px",
    height: "20px",
    backgroundColor: isRevealed ? "#16a34a" : "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "50%",
    fontSize: "12px",
    cursor: isRevealed ? "pointer" : "not-allowed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    opacity: isRevealed ? 1 : 0.5,
  };

  return (
    <div ref={documentRef} style={documentStyle} onMouseDown={handleMouseDown}>
      <div style={iconStyle}>{getDocumentIcon()}</div>
      <div style={titleStyle}>{title}</div>
      <div style={typeStyle}>{type.replace("-", " ")}</div>
      <button
        style={openButtonStyle}
        onClick={(e) => {
          e.stopPropagation();
          if (isRevealed) {
            onOpen(id);
          }
        }}
        title={
          isRevealed
            ? "Open document"
            : "Document locked - guess related words to unlock"
        }
        disabled={!isRevealed}
      >
        {isRevealed ? (isOpen ? "✕" : "📖") : "🔒"}
      </button>
    </div>
  );
};

export default DraggableDocument;
