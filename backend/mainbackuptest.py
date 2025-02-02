from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow GET, POST, PUT, DELETE
    allow_headers=["*"],  # Allow all headers
)

# ✅ Temporary In-Memory Storage (Fake Database)
fake_db = []

id_counter = 1

# ✅ Class for Recipe Data
class Recipe(BaseModel):
    recipe_name: str
    ingredients: list[str]
    instructions: list[str]


# ✅ GET ALL RECIPES
@app.get("/api/recipes")
def get_recipes():
    return fake_db


# ✅ GET RECIPE BY ID
@app.get("/api/recipes/{recipe_id}")
def get_recipe(recipe_id: int):
    for recipe in fake_db:
        if recipe["id"] == recipe_id:
            return recipe
    raise HTTPException(status_code=404, detail="Recipe not found")


# ✅ CREATE A NEW RECIPE
@app.post("/api/recipes")
def create_recipe(recipe: Recipe):
    global id_counter
    new_recipe = {
        "id": id_counter,  # Assign a unique ID
        "recipe_name": recipe.recipe_name,
        "ingredients": recipe.ingredients,
        "instructions": recipe.instructions
    }
    fake_db.append(new_recipe)  # Simulate database insert
    id_counter += 1  # Increment ID counter
    return {
        "message": "Recipe created",
        "recipe": new_recipe
    }


# ✅ UPDATE RECIPE BY ID
@app.put("/api/recipes/{recipe_id}")
def update_recipe(recipe_id: int, updated_recipe: Recipe):
    for i, recipe in enumerate(fake_db):
        if recipe["id"] == recipe_id:
            fake_db[i] = {
                "id": recipe_id,
                "recipe_name": updated_recipe.recipe_name,
                "ingredients": updated_recipe.ingredients,
                "instructions": updated_recipe.instructions
            }
            return {"message": "Recipe updated"}
    raise HTTPException(status_code=404, detail="Recipe not found")

# ✅ DELETE A RECIPE BY ID
@app.delete("/api/recipes/{recipe_id}")
def delete_recipe(recipe_id: int):
    for i, recipe in enumerate(fake_db):
        if recipe["id"] == recipe_id:
            del fake_db[i]  # Simulate database delete
            return {"message": "Recipe deleted"}
    raise HTTPException(status_code=404, detail="Recipe not found")
