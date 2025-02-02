import React from "react";
import backgroundVideo from "../assets/backgroundvideo.mp4"

const HomePage = () => {
  return (
    <div>
      <video src={backgroundVideo} autoPlay loop muted playsInline />
      <div class="flex center justify-center items-center h-full opacity-90 bg-green-200">
        <main class="main-content">
          <div class="recipe-icon">🍽️</div>
          <h1>Save Your Recipes</h1>
          <p>Preserve your most delicious recipes so you will never forget!</p>
          <button class="upload-button">Get Recipes Now</button>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
