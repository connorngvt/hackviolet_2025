from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

class RecipeRequest(BaseModel):
    url: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specify which domains can access the API
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.post("/api/scrape-recipe"):