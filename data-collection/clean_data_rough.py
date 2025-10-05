import pandas as pd

# Load the filtered CSV
df = pd.read_csv("humans_filtered.csv")

# Load allowed causes of death from the cleaned file
allowed_causes = []
with open("causes_of_death.txt", "r") as f:
    for line in f:
        line = line.strip()
        if line and " - " in line:
            # Extract the cause of death (everything after " - ")
            cause = line.split(" - ", 1)[1]
            allowed_causes.append(cause)

print(f"📋 Loaded {len(allowed_causes)} allowed causes of death")

# Filter to only include people who died from causes in our allowlist
filtered_df = df[df["causeOfDeathLabel"].isin(allowed_causes)]

print(f"🔍 Found {len(filtered_df)} people with interesting causes of death")
print(f"📉 Filtered out {len(df) - len(filtered_df)} people with boring medical causes")

# Export to JSON
filtered_df.to_json("humans_filtered_cleaned.json", orient="records", indent=2)

print(f"✅ Filtered dataset saved to JSON with {len(filtered_df)} people")
