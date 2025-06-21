import React from "react";
import { Routes, Route } from "react-router-dom";
import HeroPage from "./components/heroPage";
import AboutUs from "./components/AboutUs";
import TrainerDashboard from "./components/TrainerDashboard";
import StudentData from "./components/StudentData";
import UploadResource from "./components/UploadResource";
import UploadSession from "./components/UploadSession";
import TrainerProfile from "./components/TrainerProfile";

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<HeroPage />} />
      <Route path="/about" element={<AboutUs />} /> */}
      <Route path="/" element={<TrainerDashboard />} />
      <Route path="/studentdata" element={<StudentData />} />
      <Route path="/upload-resource" element={<UploadResource />} />
      <Route path="/upload-session" element={<UploadSession />} />
      <Route path="/profile" element={<TrainerProfile />} />

    </Routes>
  );
}
