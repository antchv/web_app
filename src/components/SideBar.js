import React from "react";
import { NavLink } from "react-router-dom";
import { FaWaveSquare, FaCalculator, FaChartBar, FaCog, FaCube, FaBrain } from "react-icons/fa"; // Icônes
import "./SideBar.css";

const SideBar = () => {
  return (
    <div className="sidebar">
      {/* Lien sur "Simulations" */}
      <h2>
        <NavLink to="/" activeClassName="active-link" className="title-link">
          Simulations
        </NavLink>
      </h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/wavesimulation" activeClassName="active-link">
              <span className="icon"><FaWaveSquare /></span>
              Wave Simulation
            </NavLink>
          </li>
          <li>
            <NavLink to="/wavesuperposition" activeClassName="active-link">
              <span className="icon"><FaCube /></span>
              Wave superposition
            </NavLink>
          </li>
          <li>
            <NavLink to="/pendulumsimulation" activeClassName="active-link">
              <span className="icon"><FaBrain /></span>
              Pendulum Simulation
            </NavLink>
          </li>
          <li>
            <NavLink to="/cannonsimulation" activeClassName="active-link">
              <span className="icon"><FaChartBar /></span>
              Cannon Simulation
            </NavLink>
          </li>
          <li>
            <NavLink to="/calculator" activeClassName="active-link">
              <span className="icon"><FaCalculator /></span>
              Calculator Tool
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" activeClassName="active-link">
              <span className="icon"><FaCog /></span>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
