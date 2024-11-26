import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./PendulumSimulation.css";

const PendulumSimulation = () => {
  const canvasRef = useRef(null);

  // États pour les paramètres du pendule
  const [length, setLength] = useState(2); // Longueur du pendule (mètres)
  const [gravity, setGravity] = useState(9.8); // Accélération gravitationnelle (m/s²)
  const [initialAngle, setInitialAngle] = useState(30); // Angle initial (degrés)
  const [damping, setDamping] = useState(0.01); // Coefficient d'amortissement
  const [frames, setFrames] = useState([]); // Stocke les frames du backend
  const [frameIndex, setFrameIndex] = useState(0); // Index pour l'animation
  const [isPlaying, setIsPlaying] = useState(false); // Contrôle de l'animation

  // Récupérer les données du pendule
  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

    const fetchPendulumData = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/pendulum`, {
          length,
          gravity,
          initial_angle: initialAngle,
          damping,
          time_step: 0.02,
          num_frames: 200,
        });

        setFrames(response.data);
        setFrameIndex(0);
        setIsPlaying(true); // Démarre l'animation une fois les données reçues
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchPendulumData();
  }, [length, gravity, initialAngle, damping]);

  // Animation du pendule
  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 400;

    const centerX = canvas.width / 2;
    const centerY = 100;
    const scale = 100; // Échelle pour afficher le pendule (1 mètre = 100 px)

    let animationFrame;

    const animate = () => {
      const { angle } = frames[frameIndex];
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Position du poids
      const x = centerX + scale * length * Math.sin(angle);
      const y = centerY + scale * length * Math.cos(angle);

      // Dessiner la corde
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dessiner le poids
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();

      setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length); // Boucle infinie sur les frames
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [frames, frameIndex, isPlaying, length]);

  return (
    <div className="pendulum-simulation-container">
      <h1>Simulation d'un pendule</h1>
      <div className="pendulum-layout">
        {/* Simulation Section: Inputs + Canvas */}
        <div className="simulation-section">
          {/* Inputs */}
          <div className="pendulum-input-container">
            <label>
              Longueur (m) :
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(+e.target.value)}
              />
            </label>
            <label>
              Gravité (m/s²) :
              <input
                type="number"
                value={gravity}
                onChange={(e) => setGravity(+e.target.value)}
              />
            </label>
            <label>
              Angle initial (°) :
              <input
                type="number"
                value={initialAngle}
                onChange={(e) => setInitialAngle(+e.target.value)}
              />
            </label>
            <label>
              Amortissement :
              <input
                type="number"
                value={damping}
                onChange={(e) => setDamping(+e.target.value)}
              />
            </label>
          </div>

  
          {/* Canvas for the Pendulum */}
          <div className="canvas-container">
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
  
        {/* Cheatsheet Section */}
        <div className="description-section">
          <h2>📚 Théorie du pendule</h2>
          <p>
            Un pendule simple est un système mécanique idéal composé d'une masse
            ponctuelle suspendue à un fil inextensible sans masse. Son mouvement
            est influencé par la gravité.
          </p>
          <h3>Formules clés :</h3>
          <ul>
            <li>
              <strong>Période (T) :</strong>{" "}
              <code>T = 2π × √(L / g)</code>, où <em>L</em> est la longueur et{" "}
              <em>g</em> l'accélération gravitationnelle.
            </li>
            <li>
              <strong>Énergie totale :</strong>{" "}
              <code>E = ½ × m × v² + m × g × h</code>, où <em>m</em> est la masse,
              <em>v</em> la vitesse et <em>h</em> la hauteur.
            </li>
            <li>
              <strong>Amplitude angulaire :</strong> La position angulaire
              maximale définie par <code>θ₀</code>.
            </li>
            <li>
              <strong>Mouvement amorti :</strong> Un coefficient d'amortissement{" "}
              <em>γ</em> réduit progressivement l'amplitude.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  
};

export default PendulumSimulation;
