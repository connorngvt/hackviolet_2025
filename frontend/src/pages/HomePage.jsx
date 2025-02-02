import React from "react";
import videoFile from "../assets/AdobeStock_275526437.mp4";

const HomePage = () => {
  return (
    <div>
      <video autoPlay loop muted playsInline className="">
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
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
