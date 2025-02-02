import psycopg2
from psycopg2.extras import RealDictCursor

# ✅ Configure Database Connection
DB_CONFIG = {
    "dbname": "recipes_db",
    "user": "your_username",
    "password": "your_password",
    "host": "localhost",  # Change if running on another server
    "port": "5432",
}

def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    return conn
