// src/components/ToggleButton.js
import React, { useContext } from "react";
import { DarkModeContext } from "./DarkModeContext";
import { motion } from "framer-motion";

const ToggleButton = () => {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="btn btn-glass"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        padding: "10px 20px",
      }}
      onClick={() => setDarkMode((prev) => !prev)}
    >
      {darkMode ? "🌙 Dark Mode" : "🌞 Light Mode"}
    </motion.button>
  );
};

export default ToggleButton;
