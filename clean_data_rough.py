import pandas as pd

# Load the filtered CSV
df = pd.read_csv("humans_filtered.csv")

# Filter out specific causes of death
excluded_causes = [
    "influenza",
    "Parkinson's disease", 
    "cancer",
    "Alzheimer's disease",
    "myocardial infarction",
    "systemic lupus erythematosus",
    "Crohn's disease",
    "tuberculosis",
    "ulcerative colitis",
    "pneumonia",
    "meningitis",
    "lung cancer",
    "breast cancer",
    "heart failure",
    "stomach cancer",
    "skin cancer",
    "cardiac arrest",
    "asphyxia",
    "gangrene",
]

# Remove rows where causeOfDeathLabel matches any of the excluded causes
# Also filter out any labels containing 'cancer' or 'disease'
filtered_df = df[
    ~df["causeOfDeathLabel"].isin(excluded_causes) &
    ~df["causeOfDeathLabel"].str.contains('cancer', case=False, na=False) &
    ~df["causeOfDeathLabel"].str.contains('disease', case=False, na=False)
]

# Export to JSON
filtered_df.to_json("humans_filtered_cleaned.json", orient="records", indent=2)

print(f"✅ Filtered dataset saved to JSON with {len(filtered_df)} people")
