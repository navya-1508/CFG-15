import React from "react";
import { Routes, Route } from "react-router-dom";
import HeroPage from "./components/heroPage";
import AboutUs from "./components/AboutUs";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/about" element={<AboutUs />} />
    </Routes>
  );
}
