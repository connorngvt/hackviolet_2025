import React from "react";
import backgroundVideo from "../assets/backgroundvideo.mp4";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-1 opacity-60"
      />
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex justify-center items-center opacity-90"
      >
        <main className="bg-white p-6 rounded-2xl shadow-md max-w-lg text-center flex flex-col justify-around items-center">
          <motion.img
            src={logo}
            className="w-30 mr-2 h-auto object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          <motion.h1
            className="text-green-700 text-4xl mb-5 font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            Save Your Recipes
          </motion.h1>

          <motion.p
            className="text-black mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            Preserve your most delicious recipes so you will never forget!
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-1/2"
          >
            <Link
              to="/recipes"
              className="bg-amber-400 hover:bg-amber-300 shadow-md h-12 rounded-xl cursor-pointer flex items-center justify-center transition-colors duration-300 ease-in-out w-full text-white font-bold"
            >
              Get Recipes Now
            </Link>
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
};

export default HomePage;
