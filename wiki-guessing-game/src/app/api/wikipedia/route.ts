import { NextRequest, NextResponse } from "next/server";

interface WikipediaPage {
  pageid: number;
  title: string;
  extract: string;
  fullurl: string;
}

interface WikipediaResponse {
  query: {
    pages: Record<string, WikipediaPage>;
  };
}

// List of notable people with interesting causes of death (excluding natural causes like cancer)
const NOTABLE_PEOPLE = [
  "Albert Einstein", // Natural causes
  "Marie Curie", // Aplastic anemia from radiation
  "Leonardo da Vinci", // Natural causes
  "William Shakespeare", // Unknown
  "Isaac Newton", // Natural causes
  "Charles Darwin", // Natural causes
  "Galileo Galilei", // Natural causes
  "Nikola Tesla", // Heart failure
  "Thomas Edison", // Diabetes complications
  "Alexander Graham Bell", // Diabetes complications
  "Wright Brothers", // Wilbur: typhoid fever, Orville: heart attack
  "Henry Ford", // Cerebral hemorrhage
  "Steve Jobs", // Pancreatic cancer (natural)
  "Bill Gates", // Still alive
  "Elon Musk", // Still alive
  "Oprah Winfrey", // Still alive
  "Maya Angelou", // Natural causes
  "Martin Luther King Jr.", // Assassination
  "Nelson Mandela", // Respiratory infection
  "Mother Teresa", // Heart failure
  "Mahatma Gandhi", // Assassination
  "Winston Churchill", // Stroke
  "Franklin D. Roosevelt", // Cerebral hemorrhage
  "John F. Kennedy", // Assassination
  "Abraham Lincoln", // Assassination
  "George Washington", // Epiglottitis
  "Napoleon Bonaparte", // Stomach cancer (natural)
  "Julius Caesar", // Assassination
  "Cleopatra", // Suicide (snake bite)
  "Joan of Arc", // Execution (burning at stake)
  "Mozart", // Unknown (possibly rheumatic fever)
  "Beethoven", // Liver cirrhosis
  "Bach", // Stroke
  "Picasso", // Heart failure
  "Van Gogh", // Suicide (gunshot)
  "Michelangelo", // Natural causes
  "Da Vinci", // Natural causes
  "Shakespeare", // Unknown
  "Mark Twain", // Heart attack
  "Ernest Hemingway", // Suicide (gunshot)
  "Jane Austen", // Addison's disease
  "Virginia Woolf", // Suicide (drowning)
  "Agatha Christie", // Natural causes
  "J.K. Rowling", // Still alive
  "Stephen King", // Still alive
  "George Orwell", // Tuberculosis
  "Aldous Huxley", // Laryngeal cancer (natural)
  "Ray Bradbury", // Natural causes
  "Isaac Asimov", // Heart and kidney failure
  "Arthur C. Clarke", // Heart failure
];

export async function GET(request: NextRequest) {
  try {
    // Get a random person from the list
    const randomPerson =
      NOTABLE_PEOPLE[Math.floor(Math.random() * NOTABLE_PEOPLE.length)];

    // Fetch Wikipedia article
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      randomPerson
    )}`;

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "WikiGuessingGame/1.0 (Educational Game)",
      },
    });

    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.extract) {
      // If no extract, try to get the full article content
      const fullUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(
        randomPerson
      )}`;

      const fullResponse = await fetch(fullUrl, {
        headers: {
          "User-Agent": "WikiGuessingGame/1.0 (Educational Game)",
        },
      });

      if (!fullResponse.ok) {
        throw new Error(`Wikipedia API error: ${fullResponse.status}`);
      }

      const fullData = await fullResponse.json();
      const pages = fullData.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (page.extract) {
        return NextResponse.json({
          title: page.title,
          content: page.extract,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(
            page.title
          )}`,
        });
      }
    }

    return NextResponse.json({
      title: data.title,
      content: data.extract,
      url: data.content_urls?.desktop?.page || data.content_urls?.mobile?.page,
    });
  } catch (error) {
    console.error("Error fetching Wikipedia article:", error);
    return NextResponse.json(
      { error: "Failed to fetch Wikipedia article" },
      { status: 500 }
    );
  }
}
