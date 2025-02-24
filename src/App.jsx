import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import AboutUs from "./Pages/AboutUs";
import Contact from "./Pages/Contact";
import RoboSub from "./Pages/RoboSub";
import AUVTechnology from "./Pages/AUVTechnology";
import Sponsors from "./Pages/Sponsors";
import OurTeam from "./Pages/OurTeam";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/auv-technology" element={<AUVTechnology />} />
        <Route path="/robosub" element={<RoboSub />} />
        <Route path="/OurTeam" element={<OurTeam />} />
        <Route path="/Sponsors" element={<Sponsors />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
