import os
from dotenv import load_dotenv

with open(".env", "r", encoding="utf-8") as f:
    print("Raw .env contents:", f.read())  # Check for truncation

load_dotenv()

api_key = os.getenv("OPEN_AI_API_KEY")

print(api_key)