import React from "react";
import backgroundVideo from "../assets/backgroundvideo.mp4"
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <video src={backgroundVideo} autoPlay loop muted playsInline className="fixed top-0 left-0 w-full h-full object-cover -z-1 opacity-60"/>
      <div class="flex center justify-center items-center opacity-90">
        <main class="bg-white p-6 rounded-2xl shadow-md max-w-lg text-center flex flex-col justify-around items-center">
          <div class="text-6xl mb-5">🍽️</div>
          <h1 className="text-green-700 text-4xl mb-5 font-bold">Save Your Recipes</h1>
          <p className="text-black mb-5">Preserve your most delicious recipes so you will never forget!</p>
          <Link to="/recipes" className="bg-amber-400 hover:bg-amber-300 w-1/2 shadow-md h-12 rounded-xl cursor-pointer flex items-center justify-center">Get Recipes Now</Link>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
