import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/backgroundimage.jpeg";
import axios from "axios";
import { toast } from "react-toastify";
import { IoTrashOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

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
    window.scrollTo(0, 0);
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
          toast.success("Recipe found! Please confirm details.");
        } else {
          toast.error("Failed to retrieve recipe data.");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(
              "The provided URL doesn't seem to contain recipe data."
            );
          } else {
            toast.error(
              `Error: ${error.response.data.message || "Something went wrong."}`
            );
          }
        } else {
          toast.error(`Network error: ${error.message}`);
        }
      }
    }
    setLoading(false);
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/recipes");
      setSavedRecipes(response.data);
    } catch (error) {
      toast.error("Error fetching recipes.");
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
          setRecipeData(response.data.recipe);
          setEditMode(false);
          toast.success("Recipe saved successfully.");
        } else {
          toast.error("Recipe failed to save:", response);
        }
      } else {
        
        const response = await axios.put(
          `http://127.0.0.1:8000/api/recipes/${recipeData.id}`,
          recipeData
        );
        

        if (response.status === 200) {
          fetchRecipes();
          setEditMode(false);
          toast.success("Recipe saved successfully.");
        } else {
          toast.error("Recipe failed to update:", response);
        }
      }
    } catch (error) {
      toast.error("Error saving recipe:", error);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/recipes/${id}`);
      setSavedRecipes(savedRecipes.filter((recipe) => recipe.id !== id));
      setShowSearchForm(true);
      setSearchQuery("");
      toast.success("Recipe deleted successfully.");
    } catch (error) {
      toast.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="h-screen">
      <img
        src={backgroundImage}
        alt=""
        className="fixed top-0 left-0 w-full h-full object-cover -z-1 opacity-60"
      />
      <div className="flex h-full">
        <div className="flex-1 flex flex-col bg-gray-300 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-15 px-3 text-xl absolute bg-gray-300 outline-0"
          />
          <ul className="h-full overflow-x-auto pt-15">
            <div
              onClick={() => {setShowSearchForm(true); setSearchQuery("")}}
              className="w-full text-lg md:text-2xl bg-gray-100 hover:bg-gray-50 border-b-1 cursor-pointer h-1/8 flex items-center py-2 px-4 transition-colors duration-300 ease-in-out"
            >
              Add New +
            </div>
            {savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="w-full bg-gray-200 hover:bg-gray-100 border-b-1 cursor-pointer h-1/8 flex items-center justify-between py-2 px-4 transition-colors duration-300 ease-in-out"
                onClick={() => fetchRecipeDetails(recipe.id)}
              >
                <li className="text-lg md:text-2xl">{recipe.name}</li>
                <motion.button
                  className="shadow-md bg-red-700 hover:bg-red-600 text-white text-md p-1 rounded cursor-pointer transition-colors duration-300 ease-in-out"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRecipe(recipe.id);
                  }}
                >
                  <IoTrashOutline className="w-5 h-5" />
                </motion.button>
              </div>
            ))}
          </ul>
        </div>

        <div className="flex-2 p-5 flex flex-col items-center overflow-x-auto">
          {showSearchForm && (
            <form className="flex flex-col items-center justify-center w-full h-full">
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex flex-col items-center justify-around bg-white p-7 rounded-2xl gap-3 shadow-lg"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  className="text-2xl lg:text-3xl text-black font-bold text-center"
                >
                  Enter Recipe Link:
                </motion.h2>
                <motion.input
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  type="link"
                  placeholder="Search for recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-5 px-4 py-3 text-xl w-full rounded-full outline-black outline-2"
                />
                <motion.button
                  type="submit"
                  className="font-bold mt-5 p-3 bg-amber-400 hover:bg-amber-300 text-white border-none cursor-pointer text-xl w-full md:w-1/2 rounded-2xl disabled:cursor-not-allowed disabled:bg-amber-200 transition-colors duration-300 ease-in-out shadow-md"
                  onClick={extractRecipeFromUrl}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" /> Loading
                    </div>
                  ) : (
                    "Search"
                  )}
                </motion.button>
              </motion.div>
            </form>
          )}

          {recipeData && editMode && !showSearchForm && (
            <form className="bg-white w-full md:w-1/2 flex flex-col p-5 gap-2">
              <h3 className="text-3xl font-bold mb-3">Recipe Details</h3>
              <div className="flex items-center">
                <label className="mr-3 text-xl">Recipe Name:</label>
                <input
                  className="text-xl py-2 px-4 bg-gray-200 rounded-full w-2/3 "
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

              <motion.button
                onClick={saveRecipe}
                className="cursor-pointer bg-amber-400 hover:bg-amber-300 text-xl p-3 mt-3 rounded-full text-white font-bold disabled:cursor-not-allowed disabled:bg-amber-200 transition-colors duration-300 ease-in-out"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Loading
                  </>
                ) : (
                  "Confirm"
                )}
              </motion.button>
            </form>
          )}

          {recipeData && !editMode && !showSearchForm && (
            <form className="bg-white w-full md:w-3/4 flex flex-col p-5 gap-5">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl">{recipeData.name}</h3>
                <motion.button
                  onClick={() => setEditMode(true)}
                  className="shadow-md text-xl h-md bg-gray-200 hover:bg-gray-100 px-5 rounded-xl cursor-pointer transition-colors duration-300 ease-in-out"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit
                </motion.button>
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
