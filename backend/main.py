from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import requests
import openai
import json
import re
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RecipeRequest(BaseModel):
    url: str


class RecipeResponse(BaseModel):
    name: str
    ingredients: list[str]
    instructions: list[str]


def scrape_recipe(url: str):
    try:
        r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(r.text, "html.parser")
        scraped_text = soup.get_text(separator="\n", strip=True)
        return scraped_text
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching URL: {str(e)}")


def ask_openai(prompt: str):
    try:
        load_dotenv()

        api_key = os.getenv("OPEN_AI_API_KEY")

        print(api_key)

        client = openai.OpenAI(api_key=api_key)

        instructions = """Your purpose is to extract the essential instructions 
            of making this recipe, primarily including recipe name, 
            ingredients, instructions, and other essential details to 
            curate the recipe. After curating the recipe, format it into
            a structured json object with exclusively these 3 keys:

            - name
            - ingredients
            - instructions

            If the information extracted is not related or relevant to food
            and recipes, respond with "This is not a recipe" (No JSON needed).
            """

        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "developer", "content": instructions},
                {"role": "user", "content": prompt},
            ],
        )

        result = completion.choices[0].message.content
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error with OpenAI request: {str(e)}"
        )


def extract_json(text):
    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        try:
            dict_object = json.loads(match.group(0).strip())
            return dict_object
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            raise HTTPException(
                status_code=400, detail="Error decoding the extracted JSON."
            )
    else:
        print("No match found")
        raise HTTPException(
            status_code=400, detail="No valid recipe information found in the response."
        )


@app.post("/api/scrape-recipe")
async def scrape_recipe_endpoint(recipe_request: RecipeRequest):
    try:
        scraped_text = scrape_recipe(recipe_request.url)
        result = ask_openai(scraped_text)
        json_result = extract_json(result)
        if json_result:
            return RecipeResponse(**json_result)
        else:
            raise HTTPException(
                status_code=404, detail="Recipe not found or improperly formatted."
            )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
