from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import execute_query, execute_update  # Import the DB functions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Class for Recipe Data
class Recipe(BaseModel):
    name: str
    ingredients: list[str]
    instructions: list[str]

# ✅ GET ALL RECIPES
@app.get("/api/recipes")
def get_recipes():
    query = "SELECT * FROM recipes;"
    recipes = execute_query(query)
    return recipes

# ✅ GET RECIPE BY ID
@app.get("/api/recipes/{recipe_id}")
def get_recipe(recipe_id: int):
    query = "SELECT * FROM recipes WHERE id = %s;"
    recipe = execute_query(query, (recipe_id,))
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe[0]

# ✅ CREATE A NEW RECIPE
@app.post("/api/recipes")
def create_recipe(recipe: Recipe):
    query = """
    INSERT INTO recipes (name, ingredients, instructions) 
    VALUES (%s, %s, %s) RETURNING id, name, ingredients, instructions;
    """
    params = (recipe.name, recipe.ingredients, recipe.instructions)
    new_recipe = execute_query(query, params)
    if not new_recipe:
        raise HTTPException(status_code=400, detail="Error creating recipe")
    return {"message": "Recipe created", "recipe": new_recipe[0]}

# ✅ UPDATE RECIPE BY ID
@app.put("/api/recipes/{recipe_id}")
def update_recipe(recipe_id: int, updated_recipe: Recipe):
    query = """
    UPDATE recipes 
    SET name = %s, ingredients = %s, instructions = %s 
    WHERE id = %s;
    """
    params = (updated_recipe.name, updated_recipe.ingredients, updated_recipe.instructions, recipe_id)
    execute_update(query, params)
    return {"message": "Recipe updated"}

# ✅ DELETE A RECIPE BY ID
@app.delete("/api/recipes/{recipe_id}")
def delete_recipe(recipe_id: int):
    query = "DELETE FROM recipes WHERE id = %s;"
    execute_update(query, (recipe_id,))
    return {"message": "Recipe deleted"}
