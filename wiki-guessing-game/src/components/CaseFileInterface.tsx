"use client";

import { useState, useEffect } from "react";
import { useGameLogic } from "./GameLogic";
import PoliceFolder from "./PoliceFolder";
import DraggableDocument from "./DraggableDocument";
import DocumentModal from "./DocumentModal";

interface Document {
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
  isOpen: boolean;
}

const CaseFileInterface = () => {
  const {
    gameState,
    isLoading,
    error,
    fetchNewArticle,
    guessWord,
    guessCauseOfDeath,
    guessOccupation,
    isWordGuessed,
    isDocumentRevealed,
    getAllWords,
    resetGame,
  } = useGameLogic();

  const [guessInput, setGuessInput] = useState("");
  const [causeOfDeathInput, setCauseOfDeathInput] = useState("");
  const [occupationInput, setOccupationInput] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate documents when a new article is loaded
  useEffect(() => {
    if (gameState.currentArticle && gameState.caseData) {
      const newDocuments: Document[] = [
        {
          id: "birth-cert",
          title: "Birth Certificate",
          type: "birth-certificate",
          content: `OFFICIAL BIRTH CERTIFICATE\n\nName: ${
            gameState.currentArticle.title
          }\nDate of Birth: ${
            gameState.caseData?.birthDate
              ? new Date(gameState.caseData.birthDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )
              : "[CLASSIFIED]"
          }\nPlace of Birth: ${
            gameState.caseData?.placeOfBirth || "[CLASSIFIED]"
          }\n\nThis document contains sensitive personal information about the subject's early life and origins.`,
          position: { x: 200, y: 200 },
          isOpen: false,
        },
        {
          id: "death-cert",
          title: "Death Certificate",
          type: "death-certificate",
          content: `OFFICIAL DEATH CERTIFICATE\n\nName: ${
            gameState.currentArticle.title
          }\nDate of Death: ${
            gameState.caseData?.deathDate
              ? new Date(gameState.caseData.deathDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )
              : "[CLASSIFIED]"
          }\nCause of Death: ${
            gameState.caseData?.causeOfDeath || "[CLASSIFIED]"
          }\nPlace of Death: ${
            gameState.caseData?.placeOfDeath || "[CLASSIFIED]"
          }\n\nThis document contains information about the subject's death and final circumstances.`,
          position: { x: 350, y: 300 },
          isOpen: false,
        },
        {
          id: "passport",
          title: "Passport",
          type: "passport",
          content: `INTERNATIONAL PASSPORT\n\nName: ${
            gameState.currentArticle.title
          }\nNationality: ${
            gameState.caseData?.nationality || "[CLASSIFIED]"
          }\nPassport Number: [CLASSIFIED]\nIssue Date: [CLASSIFIED]\nExpiry Date: [CLASSIFIED]\n\nThis document contains travel and citizenship information.`,
          position: { x: 500, y: 150 },
          isOpen: false,
        },
        {
          id: "medical",
          title: "Medical Record",
          type: "medical-record",
          content: `CONFIDENTIAL MEDICAL RECORD\n\nPatient: ${
            gameState.currentArticle.title
          }\nMedical History: [CLASSIFIED]\nKnown Conditions: [CLASSIFIED]\nTreatments: [CLASSIFIED]\nFinal Cause of Death: ${
            gameState.caseData?.causeOfDeath || "[CLASSIFIED]"
          }\n\nThis document contains sensitive medical information about the subject.`,
          position: { x: 650, y: 250 },
          isOpen: false,
        },
        {
          id: "employment",
          title: "Employment Record",
          type: "employment-record",
          content: `EMPLOYMENT HISTORY RECORD\n\nEmployee: ${
            gameState.currentArticle.title
          }\nOccupation: ${
            gameState.occupationGuessed
              ? gameState.extractedOccupation ||
                gameState.caseData?.occupation ||
                "[CLASSIFIED]"
              : gameState.caseData?.occupation
              ? `${gameState.caseData.occupation} (Wikipedia: [CLASSIFIED - GUESS TO REVEAL])`
              : "[CLASSIFIED - GUESS THE OCCUPATION TO REVEAL]"
          }\nEmployer: [CLASSIFIED]\nEmployment Period: [CLASSIFIED]\n\nThis document contains professional and career information.`,
          position: { x: 800, y: 200 },
          isOpen: false,
        },
        {
          id: "criminal",
          title: "Criminal Record",
          type: "criminal-record",
          content: `CRIMINAL RECORD - RESTRICTED ACCESS\n\nSubject: ${
            gameState.currentArticle.title
          }\nCriminal History: [CLASSIFIED]\nConvictions: [CLASSIFIED]\nStatus: ${
            gameState.caseData?.causeOfDeath
              ?.toLowerCase()
              .includes("assassination") ||
            gameState.caseData?.causeOfDeath
              ?.toLowerCase()
              .includes("murder") ||
            gameState.caseData?.causeOfDeath
              ?.toLowerCase()
              .includes("execution")
              ? "DECEASED - VIOLENT DEATH"
              : "[CLASSIFIED]"
          }\n\nThis document contains sensitive legal and criminal information.`,
          position: { x: 950, y: 300 },
          isOpen: false,
        },
      ];
      setDocuments(newDocuments);
    }
  }, [
    gameState.currentArticle,
    gameState.caseData,
    gameState.occupationGuessed,
  ]);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guessInput.trim()) {
      guessWord(guessInput);
      setGuessInput("");
    }
  };

  const handleCauseOfDeathGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (causeOfDeathInput.trim()) {
      const isCorrect = guessCauseOfDeath(causeOfDeathInput);
      if (isCorrect) {
        setCauseOfDeathInput("");
        // Show success message or update UI
      } else {
        // Show error message or update UI
      }
    }
  };

  const handleOccupationGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (occupationInput.trim()) {
      const isCorrect = guessOccupation(occupationInput);
      if (isCorrect) {
        setOccupationInput("");
        // Show success message or update UI
      } else {
        // Show error message or update UI
      }
    }
  };

  const handleWordClick = (word: string) => {
    guessWord(word);
  };

  const handleDocumentPositionChange = (
    id: string,
    position: { x: number; y: number }
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, position } : doc))
    );
  };

  const handleDocumentOpen = (id: string) => {
    const document = documents.find((doc) => doc.id === id);
    if (document) {
      setSelectedDocument(document);
      setModalOpen(true);
    }
  };

  const containerStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#0f172a",
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 198, 121, 0.1) 0%, transparent 50%)
    `,
    fontFamily: "monospace",
    overflow: "hidden",
    position: "relative",
  };

  const headerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1e293b",
    borderBottom: "3px solid #374151",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  };

  const titleStyle: React.CSSProperties = {
    color: "#f1f5f9",
    fontSize: "18px",
    fontWeight: "bold",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: "2px",
  };

  const controlsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.2s ease",
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    border: "2px solid #374151",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "12px",
    fontFamily: "monospace",
    width: "200px",
  };

  const hintsButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#10b981",
  };

  const hintsPanelStyle: React.CSSProperties = {
    position: "absolute",
    top: "60px",
    right: "20px",
    width: "300px",
    maxHeight: "400px",
    backgroundColor: "#1e293b",
    border: "2px solid #374151",
    borderRadius: "8px",
    padding: "16px",
    zIndex: 500,
    overflow: "auto",
  };

  const hintWordStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 8px",
    margin: "2px",
    backgroundColor: "#374151",
    color: "#f1f5f9",
    border: "1px solid #4b5563",
    borderRadius: "4px",
    fontSize: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "monospace",
  };

  const guessedWordStyle: React.CSSProperties = {
    ...hintWordStyle,
    backgroundColor: "#16a34a",
    borderColor: "#22c55e",
    color: "#ffffff",
  };

  const statusStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid #374151",
    fontFamily: "monospace",
    fontSize: "12px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>🔍 CLASSIFIED CASE FILES</div>
        <div style={controlsStyle}>
          <form
            onSubmit={handleGuess}
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <input
              type="text"
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              placeholder="Enter word to reveal..."
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              REVEAL
            </button>
          </form>
          {gameState.caseData && (
            <form
              onSubmit={handleCauseOfDeathGuess}
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <input
                type="text"
                value={causeOfDeathInput}
                onChange={(e) => setCauseOfDeathInput(e.target.value)}
                placeholder="Guess cause of death..."
                style={inputStyle}
              />
              <button
                type="submit"
                style={{
                  ...buttonStyle,
                  backgroundColor: gameState.causeOfDeathGuessed
                    ? "#16a34a"
                    : "#dc2626",
                }}
              >
                {gameState.causeOfDeathGuessed ? "SOLVED" : "GUESS"}
              </button>
            </form>
          )}
          {gameState.extractedOccupation && (
            <form
              onSubmit={handleOccupationGuess}
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <input
                type="text"
                value={occupationInput}
                onChange={(e) => setOccupationInput(e.target.value)}
                placeholder="Guess occupation/job..."
                style={inputStyle}
              />
              <button
                type="submit"
                style={{
                  ...buttonStyle,
                  backgroundColor: gameState.occupationGuessed
                    ? "#16a34a"
                    : "#f59e0b",
                }}
              >
                {gameState.occupationGuessed ? "SOLVED" : "GUESS"}
              </button>
            </form>
          )}
          <button
            style={hintsButtonStyle}
            onClick={() => setShowHints(!showHints)}
          >
            {showHints ? "HIDE" : "SHOW"} HINTS
          </button>
          <button
            style={{ ...buttonStyle, backgroundColor: "#dc2626" }}
            onClick={fetchNewArticle}
            disabled={isLoading}
          >
            {isLoading ? "LOADING..." : "NEW CASE"}
          </button>
          {gameState.gameStarted && (
            <button
              style={{ ...buttonStyle, backgroundColor: "#6b7280" }}
              onClick={resetGame}
            >
              RESET
            </button>
          )}
        </div>
      </div>

      {showHints && (
        <div style={hintsPanelStyle}>
          <div
            style={{
              color: "#f1f5f9",
              marginBottom: "12px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            AVAILABLE CLUES:
          </div>
          {getAllWords().map((word) => (
            <span
              key={word}
              style={isWordGuessed(word) ? guessedWordStyle : hintWordStyle}
              onClick={() => handleWordClick(word)}
            >
              {word}
            </span>
          ))}
        </div>
      )}

      {gameState.currentArticle && (
        <PoliceFolder
          title={gameState.currentArticle.title}
          content={gameState.originalText}
          maskedContent={gameState.maskedText}
          url={gameState.currentArticle.url}
          isOpen={folderOpen}
          onToggle={() => setFolderOpen(!folderOpen)}
        />
      )}

      {documents.map((document) => (
        <DraggableDocument
          key={document.id}
          id={document.id}
          title={document.title}
          type={document.type}
          content={document.content}
          position={document.position}
          onPositionChange={handleDocumentPositionChange}
          onOpen={handleDocumentOpen}
          isOpen={document.isOpen}
          isRevealed={isDocumentRevealed(document.id)}
        />
      ))}

      <div style={statusStyle}>
        <div>
          STATUS: {gameState.gameStarted ? "CASE ACTIVE" : "AWAITING CASE"}
        </div>
        <div>REVEALED WORDS: {gameState.guessedWords.size}</div>
        <div>TOTAL CLUES: {getAllWords().length}</div>
        <div>DOCUMENTS UNLOCKED: {gameState.revealedDocuments.size}/6</div>
        {gameState.caseData && (
          <div>
            CAUSE OF DEATH:{" "}
            {gameState.causeOfDeathGuessed ? "SOLVED" : "UNKNOWN"}
          </div>
        )}
        {gameState.extractedOccupation && (
          <div>
            OCCUPATION: {gameState.occupationGuessed ? "SOLVED" : "UNKNOWN"}
          </div>
        )}
        {gameState.caseData && (
          <div>
            CASE DATA:{" "}
            {gameState.caseData.birthDate
              ? "BIRTH INFO AVAILABLE"
              : "LIMITED DATA"}
          </div>
        )}
      </div>

      <DocumentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        document={selectedDocument}
      />

      {error && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#dc2626",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            border: "2px solid #b91c1c",
            fontFamily: "monospace",
            fontSize: "14px",
            zIndex: 2000,
          }}
        >
          ERROR: {error}
        </div>
      )}

      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#1e293b",
            color: "#f1f5f9",
            padding: "20px",
            borderRadius: "8px",
            border: "2px solid #374151",
            fontFamily: "monospace",
            fontSize: "14px",
            zIndex: 2000,
          }}
        >
          LOADING NEW CASE FILE...
        </div>
      )}
    </div>
  );
};

export default CaseFileInterface;
