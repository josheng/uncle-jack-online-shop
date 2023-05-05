import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# database configuration parameters from env file
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')

# create the database if it doesn't exist
def create_database():
    conn = psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        database='postgres'
    )
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
    exists = cur.fetchone()
    # create DB if it does not exist, else print that it already exists
    if not exists:
        cur.execute(f"CREATE DATABASE {DB_NAME}")
        print(f"Database {DB_NAME} created")
    else:
        print(f"Database {DB_NAME} already exists")
    cur.close()
    conn.close()
