import os
import csv

# File names
csv_filename = "C:/Users/hunterJ/Desktop/Where-Should-I-Go/project3/src/main/resources/script/school_table_incremented.csv"
sql_filename = "C:/Users/hunterJ/Desktop/Where-Should-I-Go/project3/src/main/resources/script/insert_command.txt"
if not os.path.exists(csv_filename):
    print(f"Error: File not found at {csv_filename}")
    exit(1)

# Open the CSV file and the output SQL file
with open(csv_filename, mode='r', encoding='utf-8') as csv_file, \
     open(sql_filename, mode='w', encoding='utf-8') as sql_file:
    
    reader = csv.DictReader(csv_file)
    
    # Iterate over each row in the CSV file
    for row in reader:
        # Get the column names from the CSV header
        columns = ", ".join(row.keys())
        
        # Build the values part; we assume that numeric values should not be quoted,
        # while string values are enclosed in single quotes (with internal quotes escaped)
        values = []
        for key in row:
            value = row[key]
            try:
                # Try to convert to a float to check if the value is numeric
                float(value)
                # If conversion is successful, leave it unquoted
                values.append(value)
            except ValueError:
                # Escape any single quotes in the string value and add quotes around it
                escaped_value = value.replace("'", "''")
                values.append(f"'{escaped_value}'")
        
        values_str = ", ".join(values)
        # Create the INSERT SQL command
        sql_command = f"INSERT INTO US_NEWS_RANKING ({columns}) VALUES ({values_str});\n"
        # Write the command to the output file
        sql_file.write(sql_command)

print(f"SQL insert commands have been written to {sql_filename}")
