import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import HomePage from "./components/HomePage";
import WaveSimulation from "./components/WaveSimulation";
import WaveSuperposition from "./components/WaveSuperposition"; // Import du composant de superposition
import PendulumSimulation from "./components/PendulumSimulation";
import CannonSimulation from "./components/CannonSimulation";
const App = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <SideBar />
        <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wavesimulation" element={<WaveSimulation />} />
            <Route path="/wavesuperposition" element={<WaveSuperposition />} /> {/* Nouvelle route */}
            <Route path="/pendulumsimulation" element={<PendulumSimulation />} />
            <Route path="/cannonsimulation" element={<CannonSimulation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
