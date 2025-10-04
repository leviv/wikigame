import pandas as pd

# Load your raw CSV
df = pd.read_csv("humans_causes_of_death_full.csv")

# First, filter rows with required data
df_filtered = df[
    df["coords"].notna() | df["photo"].notna()  # optional: coords or photo
]

# Ensure required fields exist
df_filtered = df_filtered[
    df_filtered["photo"].notna() &
    df_filtered["deathDate"].notna() &
    df_filtered["placeOfDeathLabel"].notna() &
    df_filtered["occupationLabel"].notna()
]

# Columns to collapse into pipe-separated strings
multi_value_columns = ["citizenshipLabel", "occupationLabel"]

# Group by person QID
cleaned = df_filtered.groupby("person").agg({
    "personLabel": "first",
    "article": "first",
    "birthDate": "first",
    "deathDate": "first",
    "placeOfBirthLabel": "first",
    "placeOfDeathLabel": "first",
    "causeOfDeath": "first",
    "causeOfDeathLabel": "first",
    "genderLabel": "first",
    "coords": "first",
    "photo": "first",
    **{col: lambda x: "|".join(sorted(set(str(v) for v in x if pd.notna(v)))) for col in multi_value_columns}
}).reset_index()

# Optional: filter again to ensure deathDate has a valid year
cleaned = cleaned[cleaned["deathDate"].str[:4].str.isnumeric()]

# Save the cleaned dataset
cleaned.to_csv("humans_causes_of_death_cleaned.csv", index=False)

print(f"✅ Cleaned dataset saved with {len(cleaned)} unique people")
