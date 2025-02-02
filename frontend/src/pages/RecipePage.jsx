import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/backgroundimage.jpeg";
import axios from "axios";

const RecipePage = () => {
  const [loading, setLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipeData, setRecipeData] = useState({
    id: null,
    name: "",
    ingredients: "",
    instructions: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const extractRecipeFromUrl = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (searchQuery) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/scrape-recipe`,
          { url: searchQuery }
        );
        if (response.status === 200) {
          setRecipeData({ id: null, ...response.data });
          setEditMode(true);
          setShowSearchForm(false);
        } else {
          console.error("Unexpected response", response);
        }
      } catch (error) {
        console.error(
          "Error extracting recipe",
          error.response ? error.response.data : error.message
        );
      }
    }
    setLoading(false);
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/recipes");
      setSavedRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchRecipeDetails = (id) => {
    const recipe = savedRecipes.find((recipe) => recipe.id === id);
    setRecipeData(recipe);
    setEditMode(false);
    setShowSearchForm(false);
  };

  const saveRecipe = async (e) => {
    e.preventDefault();
    try {
      if (recipeData.id === null) {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/recipes",
          recipeData
        );

        if (response.status === 200) {
          setSavedRecipes([...savedRecipes, response.data.recipe]);
          setEditMode(false);
        } else {
          console.error("Unexpected response for POST", response);
        }
      } else {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/recipes/${recipeData.id}`,
          recipeData
        );

        if (response.status === 200) {
          fetchRecipes();
          setEditMode(false);
        } else {
          console.error("Unexpected response for PUT", response);
        }
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/recipes/${id}`);
      setSavedRecipes(savedRecipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="h-screen">
      <img
        src={backgroundImage}
        alt=""
        className="fixed top-0 left-0 w-full h-full object-cover -z-1 opacity-60"
      />
      <div class="flex h-full">
        <div class="flex-1 flex flex-col bg-gray-300 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-15 px-3 text-xl absolute bg-gray-300 outline-0"
          />
          <ul className="h-full overflow-x-auto pt-15">
            <div
              onClick={() => setShowSearchForm(true)}
              className="w-full text-2xl bg-gray-100 hover:bg-gray-50 border-b-1 cursor-pointer h-1/8 flex items-center p-2"
            >
              Add New
            </div>
            {savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="w-full bg-gray-200 hover:bg-gray-100 border-b-1 cursor-pointer h-1/8 flex items-center justify-between p-2"
                onClick={() => fetchRecipeDetails(recipe.id)}
              >
                <li className="text-2xl">{recipe.name}</li>
                <button
                  className="bg-red-700 hover:bg-red-600 text-white text-md p-1 rounded-2xl cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRecipe(recipe.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </ul>
        </div>

        <div className="flex-2 p-5 flex flex-col items-center overflow-x-auto">
          {showSearchForm && (
            <form className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-1/2 flex flex-col items-center justify-around bg-white p-7 rounded-2xl gap-3">
                <h2 className="text-3xl text-black font-bold">
                  Enter Recipe Link:
                </h2>
                <input
                  type="link"
                  placeholder="Search for recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-5 px-4 py-3 text-xl w-full rounded-full outline-black outline-2"
                />
                <button
                  type="submit"
                  className="mt-5 p-3 bg-blue-600 hover:bg-blue-500 text-white border-none cursor-pointer text-xl w-1/2 rounded-2xl disabled:cursor-not-allowed disabled:bg-blue-300"
                  onClick={extractRecipeFromUrl}
                  disabled={loading}
                >
                  {loading ? "Loading" : "Search"}
                </button>
              </div>
            </form>
          )}

          {recipeData && editMode && !showSearchForm && (
            <form className="bg-white w-1/2 flex flex-col p-5 gap-2">
              <h3 className="text-3xl font-bold mb-3">Recipe Details</h3>
              <div className="flex items-center">
                <label className="mr-3 text-xl">Recipe Name:</label>
                <input
                  className="text-xl py-2 px-4 bg-gray-200 rounded-full "
                  type="text"
                  value={recipeData.name}
                  onChange={(e) =>
                    setRecipeData({ ...recipeData, name: e.target.value })
                  }
                />
              </div>

              <label className="text-xl">Ingredients:</label>
              <textarea
                className="text-xl p-3 bg-gray-200"
                value={recipeData.ingredients}
                onChange={(e) =>
                  setRecipeData({ ...recipeData, ingredients: e.target.value })
                }
              />

              <label className="text-xl">Instructions:</label>
              <textarea
                className="text-xl p-3 bg-gray-200"
                value={recipeData.instructions}
                onChange={(e) =>
                  setRecipeData({ ...recipeData, instructions: e.target.value })
                }
              />

              <button
                onClick={saveRecipe}
                className="cursor-pointer bg-blue-500 hover:bg-blue-400 text-xl p-3 mt-3 rounded-full text-white font-bold disabled:cursor-not-allowed disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? "Loading" : "Confirm"}
              </button>
            </form>
          )}

          {recipeData && !editMode && !showSearchForm && (
            <form className="bg-white w-3/4 flex flex-col p-5 gap-5">
              <div className="flex justify-between">
                <h3 className="text-3xl">{recipeData.name}</h3>
                <button
                  onClick={() => setEditMode(true)}
                  className="text-xl bg-gray-200 hover:bg-gray-100 px-5 rounded-xl cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <p className="font-bold text-xl">Ingredients:</p>
              <p className="text-lg">{recipeData.ingredients}</p>
              <p className="font-bold text-xl">Instructions:</p>
              <p className="text-lg">{recipeData.instructions}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
