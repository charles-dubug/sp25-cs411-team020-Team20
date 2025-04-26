# import csv

# csv_filename = "C:/Users/hunterJ/Desktop/Where-Should-I-Go/project3/src/main/resources/script/school_table_new.csv"
# output_filename = "C:/Users/hunterJ/Desktop/Where-Should-I-Go/project3/src/main/resources/script/school_table_new1.csv"
# column_to_clean = "Tuition"  # Column where $ sign should be removed

# # Read CSV, modify the tuition column, and write to a new file
# with open(csv_filename, mode='r', encoding='utf-8') as csv_file:
#     reader = csv.DictReader(csv_file)
#     fieldnames = reader.fieldnames  # Get column names

#     # Open the output file
#     with open(output_filename, mode='w', encoding='utf-8', newline='') as output_file:
#         writer = csv.DictWriter(output_file, fieldnames=fieldnames)
#         writer.writeheader()  # Write the headers
        
#         # Iterate through rows and clean the tuition column
#         for row in reader:
#             if column_to_clean in row:
#                 # Remove $ and commas, then convert to a number
#                 cleaned_value = row[column_to_clean].replace("$", "").replace(",", "").strip()
#                 try:
#                     # Convert to float first, then check if it should be an int
#                     num_value = float(cleaned_value)
#                     # If it's a whole number, convert it to an int, otherwise keep it as a float
#                     row[column_to_clean] = int(num_value) if num_value.is_integer() else num_value
#                 except ValueError:
#                     row[column_to_clean] = 0  # Default if conversion fails (e.g., empty or invalid data)
            
#             writer.writerow(row)

# print(f"Cleaned CSV saved as {output_filename}")
import csv

# File paths
input_csv = "C:/Users/hunterJ/Desktop/Where-Should-I-Go/project3/src/main/resources/script/us_news.csv"
output_csv = "C:/Users/hunterJ/Desktop/Where-Should-I-Go/project3/src/main/resources/script/school_table_incremented.csv"

# Column to increment
column_to_increment = "Ranking"

# Read, modify, and write CSV
with open(input_csv, mode='r', encoding='utf-8') as infile:
    reader = csv.DictReader(infile)
    fieldnames = reader.fieldnames

    with open(output_csv, mode='w', encoding='utf-8', newline='') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            if column_to_increment in row:
                try:
                    value = int(row[column_to_increment])
                    row[column_to_increment] = str(value + 1)
                except ValueError:
                    print(f"Skipping row with invalid value: {row[column_to_increment]}")
            writer.writerow(row)

print(f"Incremented all values in column '{column_to_increment}' by 1. Saved to {output_csv}")
