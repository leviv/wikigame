import requests
import urllib.parse
import time
import csv

ENDPOINT_URL = "https://query.wikidata.org/sparql"
BATCH_SIZE = 5000  # adjust if needed
OUTPUT_FILE = "humans_filtered.csv"

# QIDs to exclude (disease/cancer-related causes)
EXCLUDE_QIDS = [
    "Q12136",  # cancer
    "Q11950",  # myocardial infarction
    "Q11641",  # traffic collision
    "Q12140",  # stroke
    "Q12141",  # lung cancer
    "Q12142",  # tuberculosis
    "Q12143",  # heart failure
    "Q12144",  # leukemia
    "Q12145",  # pancreatic cancer
    "Q12146",  # cerebral hemorrhage
    "Q12147",  # colorectal cancer
    "Q12148",  # prostate cancer
    "Q12149",  # cardiovascular disease
]

# Convert to SPARQL VALUES format
exclude_values = ", ".join(f"wd:{qid}" for qid in EXCLUDE_QIDS)

BASE_QUERY = f"""
SELECT ?person ?personLabel ?causeOfDeath ?causeOfDeathLabel
WHERE {{
  ?person wdt:P31 wd:Q5.  # human
  ?person wdt:P509 ?causeOfDeath.  # cause of death

  # Exclude disease/cancer causes
  FILTER(?causeOfDeath NOT IN ({exclude_values}))

  SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
}}
LIMIT {BATCH_SIZE}
OFFSET {{offset}}
"""

def fetch_batch(offset):
    query = BASE_QUERY.replace("{offset}", str(offset))
    url = ENDPOINT_URL + "?query=" + urllib.parse.quote(query)
    headers = {"Accept": "text/csv"}
    r = requests.get(url, headers=headers, timeout=60)
    r.raise_for_status()
    return r.text

def main():
    offset = 0
    first_batch = True

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f_out:
        writer = None

        while True:
            print(f"Fetching rows {offset}–{offset+BATCH_SIZE} ...")
            try:
                csv_data = fetch_batch(offset)
            except requests.exceptions.RequestException as e:
                print(f"Error fetching batch: {e}. Retrying in 10s...")
                time.sleep(10)
                continue

            lines = csv_data.strip().split("\n")
            if len(lines) <= 1:  # no results
                print("No more results. Done!")
                break

            # Initialize CSV writer with headers
            if first_batch:
                reader = csv.DictReader(lines)
                writer = csv.DictWriter(f_out, fieldnames=reader.fieldnames)
                writer.writeheader()
                first_batch = False
            else:
                lines = lines[1:]  # skip header for subsequent batches
                reader = csv.DictReader(lines, fieldnames=writer.fieldnames)

            # Write rows
            for row in reader:
                writer.writerow(row)

            offset += BATCH_SIZE
            time.sleep(1)  # be kind to Wikidata

    print(f"✅ Saved filtered data to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
