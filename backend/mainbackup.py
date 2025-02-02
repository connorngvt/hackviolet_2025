from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
from database import get_db_connection
import requests
import openai
import json
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FetchRecipe(BaseModel):
    url: str


class RetrieveRecipe_json(BaseModel):
    recipe_name: str
    ingredients: list[str]
    instructions: list[str]

class Recipe(BaseModel):
    recipe_name: str
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
        client = openai.OpenAI(
            api_key=""
        )

        instructions = """Your purpose is to extract the essential instructions 
            of making this recipe, primarily including recipe name, 
            ingredients, instructions, and other essential details to 
            curate the recipe. After curating the recipe, format it into
            a structured json object with exclusively these 3 keys:

            - recipe_name
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
async def scrape_recipe_endpoint(recipe_request: FetchRecipe):
    try:
        scraped_text = scrape_recipe(recipe_request.url)
        result = ask_openai(scraped_text)
        json_result = extract_json(result)
        if json_result:
            return RetrieveRecipe_json(**json_result)
        else:
            raise HTTPException(
                status_code=404, detail="Recipe not found or improperly formatted."
            )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/recipes")
def get_recipes():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM recipes;")
            recipes = cursor.fetchall()
            return recipes
    finally:
        conn.close()

@app.get("/api/recipes/{recipe_id}")
def get_recipe(recipe_id: int):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM recipes WHERE id = %s;", (recipe_id,))
            recipe = cursor.fetchone()
            if not recipe:
                raise HTTPException(status_code=404, detail="Recipe not found")
            return recipe
    finally:
        conn.close()

@app.post("/api/recipes")
def create_recipe(recipe: Recipe):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO recipes (recipe_name, ingredients, instructions) VALUES (%s, %s, %s) RETURNING id;",
                (recipe.recipe_name, recipe.ingredients, recipe.instructions),
            )
            recipe_id = cursor.fetchone()["id"]
            conn.commit()
            return {
                "message": "Recipe created",
                "id": recipe_id,
                "recipe": {
                    "recipe_name": recipe.recipe_name,
                    "ingredients": recipe.ingredients,
                    "instructions": recipe.instructions,
                },
            }
    finally:
        conn.close()

@app.put("/api/recipes/{recipe_id}")
def update_recipe(recipe_id: int, updated_recipe: Recipe):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE recipes SET recipe_name = %s, ingredients = %s, instructions = %s WHERE id = %s RETURNING id;",
                (updated_recipe.recipe_name, updated_recipe.ingredients, updated_recipe.instructions, recipe_id),
            )
            updated = cursor.fetchone()
            if not updated:
                raise HTTPException(status_code=404, detail="Recipe not found")
            conn.commit()
            return {"message": "Recipe updated"}
    finally:
        conn.close()

@app.delete("/api/recipes/{recipe_id}")
def delete_recipe(recipe_id: int):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM recipes WHERE id = %s RETURNING id;", (recipe_id,))
            deleted = cursor.fetchone()
            if not deleted:
                raise HTTPException(status_code=404, detail="Recipe not found")
            conn.commit()
            return {"message": "Recipe deleted"}
    finally:
        conn.close()
