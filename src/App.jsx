import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="app">
      <Navbar />
      <main className={isHome ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/auv-technology" element={<AUVTechnology />} />
          <Route path="/robosub" element={<RoboSub />} />
          <Route path="/ourteam" element={<OurTeam />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
