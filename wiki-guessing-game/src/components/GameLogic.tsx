"use client";

import { useState, useEffect, useCallback } from "react";

interface GameState {
  originalText: string;
  maskedText: string;
  guessedWords: Set<string>;
  gameStarted: boolean;
  currentArticle: {
    title: string;
    content: string;
    url: string;
  } | null;
  caseData: {
    name: string;
    causeOfDeath: string;
    birthDate?: string;
    deathDate?: string;
    occupation?: string;
    nationality?: string;
    placeOfBirth?: string;
    placeOfDeath?: string;
  } | null;
  revealedDocuments: Set<string>;
  causeOfDeathGuessed: boolean;
  occupationGuessed: boolean;
  extractedOccupation?: string;
}

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    originalText: "",
    maskedText: "",
    guessedWords: new Set(),
    gameStarted: false,
    currentArticle: null,
    caseData: null,
    revealedDocuments: new Set(),
    causeOfDeathGuessed: false,
    occupationGuessed: false,
    extractedOccupation: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to extract occupation from Wikipedia content
  const extractOccupation = useCallback((content: string) => {
    const text = content.toLowerCase();

    // Common occupation patterns in Wikipedia articles
    const occupationPatterns = [
      // Professions
      {
        pattern:
          /(?:was|is)\s+(?:a|an)\s+([^,\.]+?)(?:\s+(?:and|,|\.|who|that))/i,
        type: "profession",
      },
      {
        pattern:
          /(?:known\s+as\s+)?(?:a|an)\s+([^,\.]+?)(?:\s+(?:and|,|\.|who|that))/i,
        type: "profession",
      },
      {
        pattern:
          /(?:worked\s+as|served\s+as)\s+(?:a|an)?\s*([^,\.]+?)(?:\s+(?:and|,|\.|who|that))/i,
        type: "profession",
      },

      // Specific occupations
      {
        pattern:
          /(?:physicist|scientist|mathematician|chemist|biologist|astronomer)/i,
        type: "scientist",
      },
      {
        pattern: /(?:writer|author|novelist|poet|playwright|journalist)/i,
        type: "writer",
      },
      {
        pattern: /(?:artist|painter|sculptor|musician|composer|singer)/i,
        type: "artist",
      },
      {
        pattern:
          /(?:politician|president|prime minister|king|queen|emperor|empress)/i,
        type: "politician",
      },
      {
        pattern: /(?:inventor|engineer|architect|designer)/i,
        type: "inventor",
      },
      {
        pattern: /(?:actor|actress|director|producer|filmmaker)/i,
        type: "entertainer",
      },
      {
        pattern: /(?:philosopher|theologian|religious leader|priest|minister)/i,
        type: "philosopher",
      },
      { pattern: /(?:explorer|adventurer|navigator)/i, type: "explorer" },
      {
        pattern: /(?:military|soldier|general|admiral|commander)/i,
        type: "military",
      },
      {
        pattern: /(?:businessman|entrepreneur|industrialist|merchant)/i,
        type: "business",
      },
    ];

    for (const { pattern, type } of occupationPatterns) {
      const match = content.match(pattern);
      if (match) {
        if (type === "profession") {
          return match[1].trim();
        } else {
          return type;
        }
      }
    }

    // Fallback: look for common occupation words
    const commonOccupations = [
      "physicist",
      "scientist",
      "mathematician",
      "chemist",
      "biologist",
      "astronomer",
      "writer",
      "author",
      "novelist",
      "poet",
      "playwright",
      "journalist",
      "artist",
      "painter",
      "sculptor",
      "musician",
      "composer",
      "singer",
      "politician",
      "president",
      "prime minister",
      "king",
      "queen",
      "emperor",
      "empress",
      "inventor",
      "engineer",
      "architect",
      "designer",
      "actor",
      "actress",
      "director",
      "producer",
      "filmmaker",
      "philosopher",
      "theologian",
      "religious leader",
      "priest",
      "minister",
      "explorer",
      "adventurer",
      "navigator",
      "military",
      "soldier",
      "general",
      "admiral",
      "commander",
      "businessman",
      "entrepreneur",
      "industrialist",
      "merchant",
    ];

    for (const occupation of commonOccupations) {
      if (text.includes(occupation)) {
        return occupation;
      }
    }

    return "unknown";
  }, []);

  // Function to mask text by replacing words with underscores
  const maskText = useCallback((text: string, guessedWords: Set<string>) => {
    return text
      .split(" ")
      .map((word) => {
        // Clean word of punctuation for comparison
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");

        // If word is guessed or is very short (articles, prepositions), show it
        if (guessedWords.has(cleanWord) || cleanWord.length <= 2) {
          return word;
        }

        // Replace with underscores, preserving punctuation
        return word.replace(/\w/g, "█");
      })
      .join(" ");
  }, []);

  // Fetch new Wikipedia article and case data
  const fetchNewArticle = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [articleResponse, caseDataResponse] = await Promise.all([
        fetch("/api/wikipedia"),
        fetch("/api/case-data?person=" + encodeURIComponent("Albert Einstein")), // We'll update this
      ]);

      if (!articleResponse.ok) {
        throw new Error("Failed to fetch article");
      }

      const article = await articleResponse.json();

      // Extract occupation from Wikipedia content
      const extractedOccupation = extractOccupation(article.content);

      // Fetch case data for the specific person
      const caseDataResponse2 = await fetch(
        "/api/case-data?person=" + encodeURIComponent(article.title)
      );
      let caseData = null;
      if (caseDataResponse2.ok) {
        caseData = await caseDataResponse2.json();
      }

      setGameState((prev) => ({
        ...prev,
        originalText: article.content,
        maskedText: maskText(article.content, new Set()),
        guessedWords: new Set(),
        gameStarted: true,
        currentArticle: article,
        caseData: caseData,
        revealedDocuments: new Set(),
        causeOfDeathGuessed: false,
        occupationGuessed: false,
        extractedOccupation: extractedOccupation,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [maskText]);

  // Guess a word
  const guessWord = useCallback(
    (word: string) => {
      if (!gameState.gameStarted) return;

      const cleanWord = word.toLowerCase().trim().replace(/[^\w]/g, "");
      if (cleanWord.length <= 2) return; // Don't allow guessing very short words

      setGameState((prev) => {
        const newGuessedWords = new Set(prev.guessedWords);
        newGuessedWords.add(cleanWord);

        // Check for document revelation triggers
        const newRevealedDocuments = new Set(prev.revealedDocuments);

        // Birth certificate - reveal when guessing birth-related words
        if (
          ["birth", "born", "date", "place", "location"].some(
            (trigger) =>
              cleanWord.includes(trigger) || trigger.includes(cleanWord)
          )
        ) {
          newRevealedDocuments.add("birth-cert");
        }

        // Death certificate - reveal when guessing death-related words
        if (
          [
            "death",
            "died",
            "died",
            "killed",
            "murdered",
            "assassinated",
            "suicide",
          ].some(
            (trigger) =>
              cleanWord.includes(trigger) || trigger.includes(cleanWord)
          )
        ) {
          newRevealedDocuments.add("death-cert");
        }

        // Passport - reveal when guessing travel/nationality words
        if (
          [
            "travel",
            "country",
            "nationality",
            "citizen",
            "passport",
            "visa",
          ].some(
            (trigger) =>
              cleanWord.includes(trigger) || trigger.includes(cleanWord)
          )
        ) {
          newRevealedDocuments.add("passport");
        }

        // Medical record - reveal when guessing health-related words
        if (
          [
            "health",
            "medical",
            "disease",
            "illness",
            "sick",
            "hospital",
            "doctor",
          ].some(
            (trigger) =>
              cleanWord.includes(trigger) || trigger.includes(cleanWord)
          )
        ) {
          newRevealedDocuments.add("medical");
        }

        // Employment record - reveal when guessing work-related words OR the actual occupation
        if (
          [
            "work",
            "job",
            "career",
            "profession",
            "occupation",
            "employed",
            "business",
          ].some(
            (trigger) =>
              cleanWord.includes(trigger) || trigger.includes(cleanWord)
          ) ||
          (prev.extractedOccupation &&
            cleanWord.includes(prev.extractedOccupation.toLowerCase())) ||
          prev.extractedOccupation.toLowerCase().includes(cleanWord)
        ) {
          newRevealedDocuments.add("employment");
        }

        // Criminal record - reveal when guessing crime-related words
        if (
          [
            "crime",
            "criminal",
            "arrested",
            "prison",
            "jail",
            "convicted",
            "guilty",
          ].some(
            (trigger) =>
              cleanWord.includes(trigger) || trigger.includes(cleanWord)
          )
        ) {
          newRevealedDocuments.add("criminal");
        }

        return {
          ...prev,
          guessedWords: newGuessedWords,
          maskedText: maskText(prev.originalText, newGuessedWords),
          revealedDocuments: newRevealedDocuments,
        };
      });
    },
    [gameState.gameStarted, maskText]
  );

  // Guess cause of death
  const guessCauseOfDeath = useCallback(
    (cause: string) => {
      if (!gameState.gameStarted || !gameState.caseData) return false;

      const cleanCause = cause.toLowerCase().trim();
      const actualCause = gameState.caseData.causeOfDeath.toLowerCase();

      // Check if the guess matches (allowing for partial matches)
      const isCorrect =
        actualCause.includes(cleanCause) ||
        cleanCause.includes(actualCause.split(" ")[0]);

      if (isCorrect) {
        setGameState((prev) => ({
          ...prev,
          causeOfDeathGuessed: true,
        }));
      }

      return isCorrect;
    },
    [gameState.gameStarted, gameState.caseData]
  );

  // Guess occupation
  const guessOccupation = useCallback(
    (occupation: string) => {
      if (!gameState.gameStarted || !gameState.extractedOccupation)
        return false;

      const cleanOccupation = occupation.toLowerCase().trim();
      const actualOccupation = gameState.extractedOccupation.toLowerCase();

      // Check if the guess matches (allowing for partial matches)
      const isCorrect =
        actualOccupation.includes(cleanOccupation) ||
        cleanOccupation.includes(actualOccupation.split(" ")[0]) ||
        // Also check for common synonyms
        (actualOccupation === "scientist" &&
          [
            "physicist",
            "chemist",
            "biologist",
            "mathematician",
            "astronomer",
          ].includes(cleanOccupation)) ||
        (actualOccupation === "writer" &&
          ["author", "novelist", "poet", "playwright", "journalist"].includes(
            cleanOccupation
          )) ||
        (actualOccupation === "artist" &&
          ["painter", "sculptor", "musician", "composer"].includes(
            cleanOccupation
          )) ||
        (actualOccupation === "politician" &&
          [
            "president",
            "prime minister",
            "king",
            "queen",
            "emperor",
            "empress",
          ].includes(cleanOccupation)) ||
        (actualOccupation === "inventor" &&
          ["engineer", "architect", "designer"].includes(cleanOccupation));

      if (isCorrect) {
        setGameState((prev) => ({
          ...prev,
          occupationGuessed: true,
        }));
      }

      return isCorrect;
    },
    [gameState.gameStarted, gameState.extractedOccupation]
  );

  // Check if a word is already guessed
  const isWordGuessed = useCallback(
    (word: string) => {
      const cleanWord = word.toLowerCase().trim().replace(/[^\w]/g, "");
      return gameState.guessedWords.has(cleanWord);
    },
    [gameState.guessedWords]
  );

  // Get all unique words from the text (for potential hints)
  const getAllWords = useCallback(() => {
    if (!gameState.originalText) return [];

    return Array.from(
      new Set(
        gameState.originalText
          .toLowerCase()
          .replace(/[^\w\s]/g, " ")
          .split(/\s+/)
          .filter((word) => word.length > 2)
      )
    ).sort();
  }, [gameState.originalText]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      maskedText: maskText(prev.originalText, new Set()),
      guessedWords: new Set(),
      revealedDocuments: new Set(),
      causeOfDeathGuessed: false,
      occupationGuessed: false,
    }));
  }, [maskText]);

  // Check if document is revealed
  const isDocumentRevealed = useCallback(
    (documentId: string) => {
      return gameState.revealedDocuments.has(documentId);
    },
    [gameState.revealedDocuments]
  );

  return {
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
  };
};
