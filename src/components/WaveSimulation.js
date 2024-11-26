import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./WaveSimulation.css";

const WaveSimulation = () => {
  const canvasRef = useRef(null);
  const axesCanvasRef = useRef(null);

  // États pour les paramètres d'entrée
  const [amplitude, setAmplitude] = useState(50);
  const [wavelength, setWavelength] = useState(100);
  const [frequency, setFrequency] = useState(1);
  const [waveType, setWaveType] = useState("sin"); // Type d'onde
  const [waveSpeed, setWaveSpeed] = useState(0); // Vitesse de l'onde

  // Animation
  const [frames, setFrames] = useState([]);
  const [frameIndex, setFrameIndex] = useState(0);

  // Recalculer la vitesse de l'onde
  useEffect(() => {
    const speed = wavelength * frequency;
    setWaveSpeed(speed);
  }, [wavelength, frequency]);

  // Récupérer les données de l'onde
  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

    const fetchWaveData = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/wave`, {
          amplitude,
          wavelength,
          frequency,
          wave_type: waveType, // Inclure le type d'onde
          time_step: 0.02,
          num_frames: 50,
        });

        setFrames(response.data);
        setFrameIndex(0);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchWaveData();
  }, [amplitude, wavelength, frequency, waveType]);

  // Dessiner les axes
  useEffect(() => {
    const axesCanvas = axesCanvasRef.current;
    const axesCtx = axesCanvas.getContext("2d");
    axesCanvas.width = 800;
    axesCanvas.height = 400;

    const drawAxes = () => {
      axesCtx.clearRect(0, 0, axesCanvas.width, axesCanvas.height);
      axesCtx.beginPath();
      axesCtx.strokeStyle = "black";
      axesCtx.lineWidth = 1;

      // Axe X
      axesCtx.moveTo(0, axesCanvas.height / 2);
      axesCtx.lineTo(axesCanvas.width, axesCanvas.height / 2);

      // Axe Y
      axesCtx.moveTo(50, 0);
      axesCtx.lineTo(50, axesCanvas.height);

      axesCtx.stroke();

      // Graduation de l'axe X
      for (let x = 50; x <= axesCanvas.width; x += 50) {
        axesCtx.beginPath();
        axesCtx.moveTo(x, axesCanvas.height / 2 - 5);
        axesCtx.lineTo(x, axesCanvas.height / 2 + 5);
        axesCtx.stroke();
        axesCtx.fillText(`${(x - 50) / 10}m`, x - 10, axesCanvas.height / 2 + 20);
      }

      // Graduation de l'axe Y
      for (let y = axesCanvas.height / 2; y >= 0; y -= 50) {
        axesCtx.beginPath();
        axesCtx.moveTo(45, y);
        axesCtx.lineTo(55, y);
        axesCtx.stroke();
        axesCtx.fillText(`${(axesCanvas.height / 2 - y) / 10}`, 10, y + 5);
      }

      for (let y = axesCanvas.height / 2 + 50; y <= axesCanvas.height; y += 50) {
        axesCtx.beginPath();
        axesCtx.moveTo(45, y);
        axesCtx.lineTo(55, y);
        axesCtx.stroke();
        axesCtx.fillText(`${-(y - axesCanvas.height / 2) / 10}`, 10, y + 5);
      }
    };

    drawAxes();
  }, []); // Exécuté une seule fois

  // Animation de l'onde
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 400;

    let animationFrame;

    const animate = () => {
      if (frames.length === 0) return;

      const points = frames[frameIndex];
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      points.forEach((point, index) => {
        const x = point.x + 50;
        const y = canvas.height / 2 + point.y;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();

      setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [frames, frameIndex]);

  return (
    <div className="wave-simulation-container">
      <h1>Simulation de la propagation d'une onde</h1>
      <div className="wave-simulation-layout">
        <div className="simulation-section">
          <div className="wave-input-container">
            <label>
              Type d'onde :
              <select value={waveType} onChange={(e) => setWaveType(e.target.value)}>
                <option value="sin">Sinusoïdale</option>
                <option value="square">Carrée</option>
                <option value="triangle">Triangulaire</option>
              </select>
            </label>
            <label>
              Amplitude :
              <input
                type="number"
                value={amplitude}
                onChange={(e) => setAmplitude(+e.target.value)}
              />
            </label>
            <label>
              Longueur d'onde :
              <input
                type="number"
                value={wavelength}
                onChange={(e) => setWavelength(+e.target.value)}
              />
            </label>
            <label>
              Fréquence :
              <input
                type="number"
                value={frequency}
                onChange={(e) => setFrequency(+e.target.value)}
              />
            </label>
          </div>
          <div className="canvas-container">
            <canvas
              ref={axesCanvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            />
          </div>
          <p><strong>Vitesse de l'onde :</strong> {waveSpeed.toFixed(2)} m/s</p>
        </div>
        <div className="description-section">
          <h2>À propos </h2>
          <p>
            Cette simulation permet de visualiser la propagation d'ondes de différents types en fonction des paramètres configurés. Elle peut être utilisée comme outil d'apprentissage interactif pour explorer les concepts suivants :
          </p>
          <h3>📌 Concepts clés :</h3>
          <ul>
            <li>
              <strong>Amplitude (A) :</strong> La hauteur maximale d'une onde, mesurée depuis sa position d'équilibre. Elle s'exprime en <strong>mètres (m)</strong>.
            </li>
            <li>
              <strong>Longueur d'onde (λ) :</strong> La distance entre deux crêtes ou creux consécutifs. Elle s'exprime en <strong>mètres (m)</strong>.
            </li>
            <li>
              <strong>Fréquence (f) :</strong> Le nombre d'oscillations par seconde. Elle s'exprime en <strong>Hertz (Hz)</strong>.
            </li>
            <li>
              <strong>Période (T) :</strong> Le temps nécessaire pour qu'une oscillation complète se produise.
              Elle est reliée à la fréquence par la formule : <code>T = 1 / f</code>.
            </li>
            <li>
              <strong>Vitesse de propagation (v) :</strong> La vitesse à laquelle une onde se déplace. Elle est calculée par :
              <code>v = λ × f</code>.
            </li>
          </ul>

          <h3>📊 Formules des différents types d'ondes :</h3>
          <ul>
            <li>
              <strong>Onde sinusoïdale :</strong>
              <code>y(x, t) = A × sin(2πf × t - (2π / λ) × x)</code>
            </li>
            <li>
              <strong>Onde carrée :</strong>
              <code>y(x, t) = A × (1 si sin(...) ≥ 0, sinon -1)</code>
            </li>
            <li>
              <strong>Onde triangulaire :</strong>
              <code>y(x, t) = (2A / π) × asin(sin(...))</code>
            </li>
            <li>
              <strong>Onde en dents de scie :</strong>
              <code>y(x, t) = 2A × (x / λ - floor(x / λ + 0.5))</code>
            </li>
          </ul>

          <h3>🔍 Rappel : Relations entre les grandeurs</h3>
          <ul>
            <li>
              <strong>Période et fréquence :</strong>
              <code>T = 1 / f</code>
            </li>
            <li>
              <strong>Vitesse de l'onde :</strong>
              <code>v = λ × f</code>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default WaveSimulation;
