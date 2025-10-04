# 🔍 Classified Case Files - Wikipedia Guessing Game

A Papers Please-inspired Next.js application that presents Wikipedia articles as classified police case files, with draggable documents and a detective-style interface for revealing information about famous people.

## Features

- **Papers Please Aesthetic**: Dark, monospace interface inspired by the classic game
- **Police Case Files**: Main Wikipedia article displayed in a classified police folder
- **Draggable Documents**: Six different document types that can be moved around the desk
- **Document Types**: Birth Certificate, Death Certificate, Passport, Medical Record, Employment Record, Criminal Record
- **Word Guessing**: Type words to reveal them in the main case file
- **Interactive Documents**: Click documents to view their contents in modal windows
- **Detective Interface**: Immersive case file experience with status tracking

## How to Play

1. Click "NEW CASE" to load a random Wikipedia article about a famous person
2. The main case file appears as a classified police folder - click to open/close
3. Drag the various documents around your desk to organize them
4. Click the 📖 button on any document to view its contents
5. Type words in the "REVEAL" input to uncover information in the main case file
6. Use "SHOW HINTS" to see all available words and click them to reveal
7. Try to uncover as much classified information as possible!
8. Click "NEW CASE" to investigate a different person

## Technical Details

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Inline CSS objects with Papers Please aesthetic
- **API**: Wikipedia REST API for fetching article content
- **Drag & Drop**: Custom drag and drop implementation for documents
- **Modal System**: Document viewing with modal overlays

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

- `GET /api/wikipedia` - Fetches a random Wikipedia article about a notable person

## Game Mechanics

- **Case Files**: Main Wikipedia article displayed in a classified police folder
- **Document System**: Six draggable documents with different types and contents
- **Word Revealing**: Type words to reveal them in the main case file
- **Document Interaction**: Click documents to view detailed information
- **Status Tracking**: Monitor revealed words and total clues available

## Document Types

- **📋 Birth Certificate**: Personal information and origins
- **⚰️ Death Certificate**: Death details and circumstances
- **📘 Passport**: Travel and citizenship information
- **🏥 Medical Record**: Health and medical history
- **💼 Employment Record**: Professional and career information
- **🚨 Criminal Record**: Legal and criminal history

## Notable People Included

The game includes articles about famous scientists, inventors, artists, writers, politicians, and other notable figures from history, including:

- Albert Einstein, Marie Curie, Leonardo da Vinci
- William Shakespeare, Isaac Newton, Charles Darwin
- Steve Jobs, Bill Gates, Elon Musk
- And many more!

## Browser Compatibility

- Modern browsers with ES6+ support
- Responsive design works on mobile and desktop
- No external dependencies beyond Next.js

## Papers Please Inspiration

This game draws inspiration from the classic Papers Please game, featuring:

- Dark, monospace aesthetic
- Government/official document styling
- Drag and drop document management
- Classified information theme
- Detective/investigation atmosphere

Enjoy investigating famous people while playing this immersive case file game!
