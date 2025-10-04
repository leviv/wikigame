import requests
import urllib.parse
import time

# Extended query (without LIMIT/OFFSET)
BASE_QUERY = """
SELECT ?person ?personLabel ?article 
       ?birthDate ?deathDate 
       ?placeOfBirthLabel ?placeOfDeathLabel 
       ?causeOfDeath ?causeOfDeathLabel
       ?citizenshipLabel ?occupationLabel ?genderLabel 
       ?coords
WHERE {
  ?person wdt:P31 wd:Q5.                # humans
  ?person wdt:P509 ?causeOfDeath.       # cause of death
  ?article schema:about ?person ;
           schema:isPartOf <https://en.wikipedia.org/> .

  OPTIONAL { ?person wdt:P569 ?birthDate. }
  OPTIONAL { ?person wdt:P570 ?deathDate. }
  OPTIONAL { ?person wdt:P19 ?placeOfBirth. }
  OPTIONAL { ?person wdt:P20 ?placeOfDeath. }
  OPTIONAL { ?person wdt:P27 ?citizenship. }
  OPTIONAL { ?person wdt:P106 ?occupation. }
  OPTIONAL { ?person wdt:P21 ?gender. }
  OPTIONAL { ?person wdt:P19/wdt:P625 ?coords. }  # coordinates of birthplace if available

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
"""

ENDPOINT_URL = "https://query.wikidata.org/sparql"
BATCH_SIZE = 5000

def fetch_batch(offset):
    query = BASE_QUERY + f"\nLIMIT {BATCH_SIZE}\nOFFSET {offset}"
    url = ENDPOINT_URL + "?query=" + urllib.parse.quote(query)
    headers = {"Accept": "text/csv"}
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    return r.text

def main():
    output_file = "humans_causes_of_death_full.csv"
    offset = 0
    first_batch = True

    with open(output_file, "w", newline="", encoding="utf-8") as f_out:
        while True:
            print(f"Fetching rows {offset}–{offset+BATCH_SIZE} ...")
            try:
                batch_csv = fetch_batch(offset)
            except Exception as e:
                print("Error fetching batch, retrying after 10s:", e)
                time.sleep(10)
                continue

            lines = batch_csv.strip().split("\n")

            # Stop if no results
            if len(lines) <= 1:
                print("No more results. Done!")
                break

            # Write header only for the first batch
            if first_batch:
                f_out.write(batch_csv)
                first_batch = False
            else:
                # Skip header row
                f_out.write("\n".join(lines[1:]) + "\n")

            offset += BATCH_SIZE
            time.sleep(1)  # be kind to the server

    print(f"✅ Saved all results to {output_file}")

if __name__ == "__main__":
    main()
