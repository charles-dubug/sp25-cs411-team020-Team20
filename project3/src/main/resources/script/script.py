import pandas as pd
from sqlalchemy import create_engine

file_path = './ranking.csv'
data = pd.read_csv(file_path)


# Use your own mysql setting. This one is mine
mysql_user = "root"
mysql_password = "789654"
mysql_host = "localhost"
mysql_port = "3306"
mysql_database = "project3db"

engine = create_engine(f"mysql+pymysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_database}")

table_name = "US_colleges"

data.to_sql(name=table_name, con=engine, if_exists='replace', index=False)

print(f"CSV data successfully loaded into MySQL table: {table_name}")
