import { NextRequest, NextResponse } from "next/server";

interface PersonData {
  name: string;
  causeOfDeath: string;
  birthDate?: string;
  deathDate?: string;
  occupation?: string;
  nationality?: string;
  placeOfBirth?: string;
  placeOfDeath?: string;
}

// Enhanced person data with cause of death information
const PERSON_DATABASE: Record<string, PersonData> = {
  "Albert Einstein": {
    name: "Albert Einstein",
    causeOfDeath: "Abdominal aortic aneurysm",
    birthDate: "1879-03-14",
    deathDate: "1955-04-18",
    occupation: "Physicist",
    nationality: "German-American",
    placeOfBirth: "Ulm, Germany",
    placeOfDeath: "Princeton, New Jersey, USA",
  },
  "Marie Curie": {
    name: "Marie Curie",
    causeOfDeath: "Aplastic anemia from radiation exposure",
    birthDate: "1867-11-07",
    deathDate: "1934-07-04",
    occupation: "Physicist and Chemist",
    nationality: "Polish-French",
    placeOfBirth: "Warsaw, Poland",
    placeOfDeath: "Sancellemoz, France",
  },
  "Leonardo da Vinci": {
    name: "Leonardo da Vinci",
    causeOfDeath: "Stroke",
    birthDate: "1452-04-15",
    deathDate: "1519-05-02",
    occupation: "Artist, Inventor, Scientist",
    nationality: "Italian",
    placeOfBirth: "Vinci, Italy",
    placeOfDeath: "Amboise, France",
  },
  "William Shakespeare": {
    name: "William Shakespeare",
    causeOfDeath: "Unknown (possibly typhoid fever)",
    birthDate: "1564-04-26",
    deathDate: "1616-04-23",
    occupation: "Playwright, Poet",
    nationality: "English",
    placeOfBirth: "Stratford-upon-Avon, England",
    placeOfDeath: "Stratford-upon-Avon, England",
  },
  "Isaac Newton": {
    name: "Isaac Newton",
    causeOfDeath: "Natural causes (age-related)",
    birthDate: "1643-01-04",
    deathDate: "1727-03-31",
    occupation: "Physicist, Mathematician",
    nationality: "English",
    placeOfBirth: "Woolsthorpe, England",
    placeOfDeath: "London, England",
  },
  "Charles Darwin": {
    name: "Charles Darwin",
    causeOfDeath: "Heart failure",
    birthDate: "1809-02-12",
    deathDate: "1882-04-19",
    occupation: "Naturalist, Biologist",
    nationality: "English",
    placeOfBirth: "Shrewsbury, England",
    placeOfDeath: "Down House, England",
  },
  "Galileo Galilei": {
    name: "Galileo Galilei",
    causeOfDeath: "Fever and heart palpitations",
    birthDate: "1564-02-15",
    deathDate: "1642-01-08",
    occupation: "Astronomer, Physicist",
    nationality: "Italian",
    placeOfBirth: "Pisa, Italy",
    placeOfDeath: "Arcetri, Italy",
  },
  "Nikola Tesla": {
    name: "Nikola Tesla",
    causeOfDeath: "Coronary thrombosis",
    birthDate: "1856-07-10",
    deathDate: "1943-01-07",
    occupation: "Inventor, Electrical Engineer",
    nationality: "Serbian-American",
    placeOfBirth: "Smiljan, Croatia",
    placeOfDeath: "New York City, USA",
  },
  "Thomas Edison": {
    name: "Thomas Edison",
    causeOfDeath: "Diabetes complications",
    birthDate: "1847-02-11",
    deathDate: "1931-10-18",
    occupation: "Inventor, Businessman",
    nationality: "American",
    placeOfBirth: "Milan, Ohio, USA",
    placeOfDeath: "West Orange, New Jersey, USA",
  },
  "Alexander Graham Bell": {
    name: "Alexander Graham Bell",
    causeOfDeath: "Diabetes complications",
    birthDate: "1847-03-03",
    deathDate: "1922-08-02",
    occupation: "Inventor, Scientist",
    nationality: "Scottish-American",
    placeOfBirth: "Edinburgh, Scotland",
    placeOfDeath: "Nova Scotia, Canada",
  },
  "Martin Luther King Jr.": {
    name: "Martin Luther King Jr.",
    causeOfDeath: "Assassination (gunshot wound)",
    birthDate: "1929-01-15",
    deathDate: "1968-04-04",
    occupation: "Civil Rights Leader, Minister",
    nationality: "American",
    placeOfBirth: "Atlanta, Georgia, USA",
    placeOfDeath: "Memphis, Tennessee, USA",
  },
  "Nelson Mandela": {
    name: "Nelson Mandela",
    causeOfDeath: "Respiratory infection",
    birthDate: "1918-07-18",
    deathDate: "2013-12-05",
    occupation: "Anti-apartheid Activist, Politician",
    nationality: "South African",
    placeOfBirth: "Mvezo, South Africa",
    placeOfDeath: "Johannesburg, South Africa",
  },
  "Mahatma Gandhi": {
    name: "Mahatma Gandhi",
    causeOfDeath: "Assassination (gunshot wound)",
    birthDate: "1869-10-02",
    deathDate: "1948-01-30",
    occupation: "Political Leader, Activist",
    nationality: "Indian",
    placeOfBirth: "Porbandar, India",
    placeOfDeath: "New Delhi, India",
  },
  "Winston Churchill": {
    name: "Winston Churchill",
    causeOfDeath: "Stroke",
    birthDate: "1874-11-30",
    deathDate: "1965-01-24",
    occupation: "Politician, Writer",
    nationality: "British",
    placeOfBirth: "Blenheim Palace, England",
    placeOfDeath: "London, England",
  },
  "Franklin D. Roosevelt": {
    name: "Franklin D. Roosevelt",
    causeOfDeath: "Cerebral hemorrhage",
    birthDate: "1882-01-30",
    deathDate: "1945-04-12",
    occupation: "Politician, Lawyer",
    nationality: "American",
    placeOfBirth: "Hyde Park, New York, USA",
    placeOfDeath: "Warm Springs, Georgia, USA",
  },
  "John F. Kennedy": {
    name: "John F. Kennedy",
    causeOfDeath: "Assassination (gunshot wound)",
    birthDate: "1917-05-29",
    deathDate: "1963-11-22",
    occupation: "Politician, Naval Officer",
    nationality: "American",
    placeOfBirth: "Brookline, Massachusetts, USA",
    placeOfDeath: "Dallas, Texas, USA",
  },
  "Abraham Lincoln": {
    name: "Abraham Lincoln",
    causeOfDeath: "Assassination (gunshot wound)",
    birthDate: "1809-02-12",
    deathDate: "1865-04-15",
    occupation: "Politician, Lawyer",
    nationality: "American",
    placeOfBirth: "Hodgenville, Kentucky, USA",
    placeOfDeath: "Washington, D.C., USA",
  },
  "George Washington": {
    name: "George Washington",
    causeOfDeath: "Epiglottitis",
    birthDate: "1732-02-22",
    deathDate: "1799-12-14",
    occupation: "Politician, Military Officer",
    nationality: "American",
    placeOfBirth: "Westmoreland County, Virginia, USA",
    placeOfDeath: "Mount Vernon, Virginia, USA",
  },
  "Julius Caesar": {
    name: "Julius Caesar",
    causeOfDeath: "Assassination (stabbed 23 times)",
    birthDate: "100 BC",
    deathDate: "44 BC",
    occupation: "Politician, Military Leader",
    nationality: "Roman",
    placeOfBirth: "Rome, Italy",
    placeOfDeath: "Rome, Italy",
  },
  Cleopatra: {
    name: "Cleopatra",
    causeOfDeath: "Suicide (snake bite)",
    birthDate: "69 BC",
    deathDate: "30 BC",
    occupation: "Pharaoh, Politician",
    nationality: "Egyptian",
    placeOfBirth: "Alexandria, Egypt",
    placeOfDeath: "Alexandria, Egypt",
  },
  "Joan of Arc": {
    name: "Joan of Arc",
    causeOfDeath: "Execution (burned at stake)",
    birthDate: "1412",
    deathDate: "1431-05-30",
    occupation: "Military Leader, Saint",
    nationality: "French",
    placeOfBirth: "Domrémy, France",
    placeOfDeath: "Rouen, France",
  },
  Mozart: {
    name: "Wolfgang Amadeus Mozart",
    causeOfDeath: "Unknown (possibly rheumatic fever)",
    birthDate: "1756-01-27",
    deathDate: "1791-12-05",
    occupation: "Composer, Musician",
    nationality: "Austrian",
    placeOfBirth: "Salzburg, Austria",
    placeOfDeath: "Vienna, Austria",
  },
  Beethoven: {
    name: "Ludwig van Beethoven",
    causeOfDeath: "Liver cirrhosis",
    birthDate: "1770-12-17",
    deathDate: "1827-03-26",
    occupation: "Composer, Pianist",
    nationality: "German",
    placeOfBirth: "Bonn, Germany",
    placeOfDeath: "Vienna, Austria",
  },
  Bach: {
    name: "Johann Sebastian Bach",
    causeOfDeath: "Stroke",
    birthDate: "1685-03-31",
    deathDate: "1750-07-28",
    occupation: "Composer, Organist",
    nationality: "German",
    placeOfBirth: "Eisenach, Germany",
    placeOfDeath: "Leipzig, Germany",
  },
  Picasso: {
    name: "Pablo Picasso",
    causeOfDeath: "Heart failure",
    birthDate: "1881-10-25",
    deathDate: "1973-04-08",
    occupation: "Artist, Painter",
    nationality: "Spanish",
    placeOfBirth: "Málaga, Spain",
    placeOfDeath: "Mougins, France",
  },
  "Van Gogh": {
    name: "Vincent van Gogh",
    causeOfDeath: "Suicide (gunshot wound)",
    birthDate: "1853-03-30",
    deathDate: "1890-07-29",
    occupation: "Artist, Painter",
    nationality: "Dutch",
    placeOfBirth: "Zundert, Netherlands",
    placeOfDeath: "Auvers-sur-Oise, France",
  },
  Michelangelo: {
    name: "Michelangelo",
    causeOfDeath: "Fever",
    birthDate: "1475-03-06",
    deathDate: "1564-02-18",
    occupation: "Artist, Sculptor, Architect",
    nationality: "Italian",
    placeOfBirth: "Caprese, Italy",
    placeOfDeath: "Rome, Italy",
  },
  "Mark Twain": {
    name: "Mark Twain",
    causeOfDeath: "Heart attack",
    birthDate: "1835-11-30",
    deathDate: "1910-04-21",
    occupation: "Writer, Humorist",
    nationality: "American",
    placeOfBirth: "Florida, Missouri, USA",
    placeOfDeath: "Redding, Connecticut, USA",
  },
  "Ernest Hemingway": {
    name: "Ernest Hemingway",
    causeOfDeath: "Suicide (gunshot wound)",
    birthDate: "1899-07-21",
    deathDate: "1961-07-02",
    occupation: "Writer, Journalist",
    nationality: "American",
    placeOfBirth: "Oak Park, Illinois, USA",
    placeOfDeath: "Ketchum, Idaho, USA",
  },
  "Jane Austen": {
    name: "Jane Austen",
    causeOfDeath: "Addison's disease",
    birthDate: "1775-12-16",
    deathDate: "1817-07-18",
    occupation: "Writer, Novelist",
    nationality: "English",
    placeOfBirth: "Steventon, England",
    placeOfDeath: "Winchester, England",
  },
  "Virginia Woolf": {
    name: "Virginia Woolf",
    causeOfDeath: "Suicide (drowning)",
    birthDate: "1882-01-25",
    deathDate: "1941-03-28",
    occupation: "Writer, Novelist",
    nationality: "English",
    placeOfBirth: "London, England",
    placeOfDeath: "River Ouse, England",
  },
  "George Orwell": {
    name: "George Orwell",
    causeOfDeath: "Tuberculosis",
    birthDate: "1903-06-25",
    deathDate: "1950-01-21",
    occupation: "Writer, Journalist",
    nationality: "English",
    placeOfBirth: "Motihari, India",
    placeOfDeath: "London, England",
  },
  "Isaac Asimov": {
    name: "Isaac Asimov",
    causeOfDeath: "Heart and kidney failure",
    birthDate: "1920-01-02",
    deathDate: "1992-04-06",
    occupation: "Writer, Biochemist",
    nationality: "American",
    placeOfBirth: "Petrovichi, Russia",
    placeOfDeath: "New York City, USA",
  },
  "Arthur C. Clarke": {
    name: "Arthur C. Clarke",
    causeOfDeath: "Heart failure",
    birthDate: "1917-12-16",
    deathDate: "2008-03-19",
    occupation: "Writer, Futurist",
    nationality: "British-Sri Lankan",
    placeOfBirth: "Minehead, England",
    placeOfDeath: "Colombo, Sri Lanka",
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personName = searchParams.get("person");

    if (!personName) {
      return NextResponse.json(
        { error: "Person name is required" },
        { status: 400 }
      );
    }

    const personData = PERSON_DATABASE[personName];

    if (!personData) {
      return NextResponse.json(
        { error: "Person not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json(personData);
  } catch (error) {
    console.error("Error fetching case data:", error);
    return NextResponse.json(
      { error: "Failed to fetch case data" },
      { status: 500 }
    );
  }
}
