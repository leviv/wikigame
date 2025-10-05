import pandas as pd

# Load the cleaned JSON file
df = pd.read_json("humans_filtered_cleaned.json")

# Count causes of death and sort by frequency (most to least common)
cause_counts = df["causeOfDeathLabel"].value_counts()

print("Top 100 Most Common Causes of Death:")
print("=" * 50)

# Show top 100 most common causes
for cause, count in cause_counts.head(100).items():
    print(f"{count:4d} - {cause}")

print(f"\nShowing top 100 of {len(cause_counts)} unique causes")
print(f"Total people in dataset: {len(df)}")

# Show some statistics
print(f"\nStatistics:")
print(f"- Causes with only 1 person: {(cause_counts == 1).sum()}")
print(f"- Causes with 2+ people: {(cause_counts >= 2).sum()}")
print(f"- Causes with 5+ people: {(cause_counts >= 5).sum()}")
print(f"- Causes with 10+ people: {(cause_counts >= 10).sum()}")
