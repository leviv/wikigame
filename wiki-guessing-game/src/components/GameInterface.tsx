"use client";

import { useState, useEffect } from "react";
import { useGameLogic } from "./GameLogic";

const GameInterface = () => {
  const {
    gameState,
    isLoading,
    error,
    fetchNewArticle,
    guessWord,
    isWordGuessed,
    getAllWords,
    resetGame,
  } = useGameLogic();

  const [guessInput, setGuessInput] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guessInput.trim()) {
      guessWord(guessInput);
      setGuessInput("");
    }
  };

  const handleWordClick = (word: string) => {
    guessWord(word);
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: isMobile ? "10px" : "20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  };

  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "30px",
    padding: isMobile ? "15px" : "20px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? "1.8rem" : "2.5rem",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "10px",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    color: "#64748b",
    marginBottom: "20px",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    margin: "0 8px",
    transition: "all 0.2s ease",
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: "#2563eb",
    transform: "translateY(-1px)",
  };

  const gameAreaStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  };

  const textAreaStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: isMobile ? "20px" : "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  const articleTitleStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "20px",
    textAlign: "center",
  };

  const textContentStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: "#374151",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  const controlPanelStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: isMobile ? "15px" : "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    height: "fit-content",
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: "20px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    marginBottom: "10px",
  };

  const hintButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#10b981",
    fontSize: "0.9rem",
    padding: "8px 16px",
  };

  const hintsAreaStyle: React.CSSProperties = {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    maxHeight: "300px",
    overflowY: "auto",
  };

  const hintWordStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 8px",
    margin: "2px",
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const guessedWordStyle: React.CSSProperties = {
    ...hintWordStyle,
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
    color: "#166534",
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "40px",
    fontSize: "1.2rem",
    color: "#64748b",
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Wikipedia Guessing Game</h1>
        <p style={subtitleStyle}>
          Guess words to reveal the Wikipedia article about a famous person!
        </p>
        <div>
          <button
            style={buttonStyle}
            onClick={fetchNewArticle}
            disabled={isLoading}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, buttonHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, buttonStyle)
            }
          >
            {isLoading ? "Loading..." : "New Person"}
          </button>
          {gameState.gameStarted && (
            <button
              style={{ ...buttonStyle, backgroundColor: "#6b7280" }}
              onClick={resetGame}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, {
                  ...buttonHoverStyle,
                  backgroundColor: "#4b5563",
                })
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, {
                  ...buttonStyle,
                  backgroundColor: "#6b7280",
                })
              }
            >
              Reset Game
            </button>
          )}
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {isLoading && <div style={loadingStyle}>Loading new article...</div>}

      {gameState.gameStarted && !isLoading && (
        <div style={gameAreaStyle}>
          <div style={textAreaStyle}>
            <h2 style={articleTitleStyle}>{gameState.currentArticle?.title}</h2>
            <div style={textContentStyle}>{gameState.maskedText}</div>
            {gameState.currentArticle?.url && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <a
                  href={gameState.currentArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#3b82f6",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  View full article on Wikipedia →
                </a>
              </div>
            )}
          </div>

          <div style={controlPanelStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Guess a word:</label>
              <form onSubmit={handleGuess}>
                <input
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder="Enter a word to guess..."
                  style={inputStyle}
                />
                <button
                  type="submit"
                  style={buttonStyle}
                  onMouseEnter={(e) =>
                    Object.assign(e.currentTarget.style, buttonHoverStyle)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.currentTarget.style, buttonStyle)
                  }
                >
                  Guess
                </button>
              </form>
            </div>

            <button
              style={hintButtonStyle}
              onClick={() => setShowHints(!showHints)}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, {
                  ...buttonHoverStyle,
                  backgroundColor: "#059669",
                })
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, hintButtonStyle)
              }
            >
              {showHints ? "Hide" : "Show"} Word Hints
            </button>

            {showHints && (
              <div style={hintsAreaStyle}>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "0.9rem",
                    color: "#64748b",
                  }}
                >
                  Click on words to guess them:
                </p>
                {getAllWords().map((word) => (
                  <span
                    key={word}
                    style={
                      isWordGuessed(word) ? guessedWordStyle : hintWordStyle
                    }
                    onClick={() => handleWordClick(word)}
                    onMouseEnter={(e) => {
                      if (!isWordGuessed(word)) {
                        e.currentTarget.style.backgroundColor = "#e5e7eb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isWordGuessed(word)) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!gameState.gameStarted && !isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#64748b", marginBottom: "20px" }}>
            Ready to start guessing?
          </h2>
          <p style={{ color: "#9ca3af", marginBottom: "30px" }}>
            Click "New Person" to load a Wikipedia article and start the game!
          </p>
        </div>
      )}
    </div>
  );
};

export default GameInterface;
