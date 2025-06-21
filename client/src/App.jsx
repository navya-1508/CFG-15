import React from "react";
import { Routes, Route } from "react-router-dom";
import HeroPage from "./components/heroPage";
import AboutUs from "./components/AboutUs";
import TrainerDashboard from "./components/TrainerDashboard";
import StudentData from "./components/StudentData";
import UploadResource from "./components/UploadResource";
import UploadSession from "./components/UploadSession";
import TrainerProfile from "./components/TrainerProfile";
import Grievance from "./components/Grievence";
import SaathiDashboard from "./components/SaathiDashboard";
import OneOnOne from "./components/OneOnOne";
import DiscussionForum from "./components/DiscussionForum";
import SaathiProfile from "./components/SaathiProfile";
import ChampionDashboard from "./components/ChampionDashboard";
import Registration from "./components/Registration";

export default function App() {
  return (
    <Routes>
       <Route path="/" element={<HeroPage />} />
      <Route path="/about" element={<AboutUs />} /> 

      <Route path="/trainerdashboard" element={<TrainerDashboard />} />
      <Route path="/studentdata" element={<StudentData />} />
      <Route path="/upload-resource" element={<UploadResource />} />
      <Route path="/upload-session" element={<UploadSession />} />
      <Route path="/trainerprofile" element={<TrainerProfile />} /> 
      <Route path="/grievance" element={<Grievance />} /> 

       <Route path="/saathidashboard" element={<SaathiDashboard />}/>
      <Route path="/oneonone" element={<OneOnOne />}/>
      <Route path="/discussionforum" element={<DiscussionForum />}/>
      <Route path="/saathiprofile" element={<SaathiProfile />}/> 


      <Route path="/championdashboard" element={<ChampionDashboard/>}/>
      <Route path="/register" element={<Registration/>}/>

    </Routes>
  );
}
