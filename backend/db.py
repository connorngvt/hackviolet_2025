import psycopg2
from psycopg2 import sql
from typing import List, Dict

DATABASE_URL = "postgresql://postgres:admin@localhost:5432/hackviolet"

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

def execute_query(query: str, params: tuple = ()) -> List[Dict]:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        result = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        result_dict = [dict(zip(columns, row)) for row in result]
        conn.commit()
        cursor.close()
        conn.close()
        return result_dict
    except Exception as e:
        print(f"Error executing query: {e}")
        return []

def execute_update(query: str, params: tuple = ()) -> None:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error executing update: {e}")
