
export async function getImageFromWikidata(entityUrl: string): Promise<string | null> {
  const id = entityUrl.split('/').pop();
  if (!id) {
    return null;
  }

  const apiUrl = `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`;
  const res = await fetch(apiUrl);
  const data = await res.json();

  const entity = data.entities[id];
  const imageClaim = entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;

  if (!imageClaim) {
    return null;
  }
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageClaim)}`;
}

export async function getWikipediaSections(entityUrl: string) {
	const id = entityUrl.split('/').pop();
	if (!id) {
    return null
  };

	// Step 1: Fetch Wikidata entity
	const wdRes = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${id}.json`);
	const wdData = await wdRes.json();
	const entity = wdData.entities[id];

	// Step 2: Get English Wikipedia title
	const title = entity.sitelinks?.enwiki?.title;
	if (!title) {
    return null
  }

	// Step 3: Fetch sections list
	const sectionsRes = await fetch(
		`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
			title
		)}&prop=sections&format=json&origin=*`
	);
	const sectionsData = await sectionsRes.json();
	const sectionsList = sectionsData.parse.sections as { line: string; index: string }[];

	const resultSections: { heading: string; text: string }[] = [];

	// Step 4: Fetch plaintext for each section individually
	for (const sec of sectionsList) {
		const secRes = await fetch(
			`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
				title
			)}&section=${sec.index}&prop=text&format=json&origin=*`
		);
		const secData = await secRes.json();
		const textHtml = secData.parse.text['*'] as string;

		// Strip HTML tags
		const text = textHtml.replace(/<[^>]+>/g, '').replace(/\n\s*\n/g, '\n').trim();

		resultSections.push({ heading: sec.line, text });
	}

	return {
		title,
		url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
		sections: resultSections,
	};
}


export function formatWikidataDate(dateStr?: string): string {
	if (!dateStr) return "";

	// Remove leading "+" if present
	const clean = dateStr.startsWith("+") ? dateStr.slice(1) : dateStr;

	// Extract parts safely
	const [year, month, day] = clean.split("-").map((s) => s.replace("T", ""));

	const y = parseInt(year);
	const m = parseInt(month);
	const d = parseInt(day);

	// Handle missing month/day gracefully
	if (!m || m === 0) return `${y}`;
	if (!d || d === 0) {
		// Month known, day unknown
		const monthName = new Date(`${y}-${m}-01`).toLocaleString("en-US", {
			month: "long",
		});
		return `${monthName} ${y}`;
	}

	// Full date known
	const date = new Date(`${y}-${m}-${d}`);
	if (isNaN(date.getTime())) return `${y}`;
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
