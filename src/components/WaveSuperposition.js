import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./WaveSuperposition.css";

const WaveSuperposition = () => {
  const canvasRef = useRef(null);
  const axesCanvasRef = useRef(null);

  // États pour les paramètres de la première onde
  const [amplitude1, setAmplitude1] = useState(50);
  const [wavelength1, setWavelength1] = useState(100);
  const [frequency1, setFrequency1] = useState(1);
  const [waveType1, setWaveType1] = useState("sin");
  const [phase1, setPhase1] = useState(0);

  // États pour les paramètres de la deuxième onde
  const [amplitude2, setAmplitude2] = useState(50);
  const [wavelength2, setWavelength2] = useState(100);
  const [frequency2, setFrequency2] = useState(1);
  const [waveType2, setWaveType2] = useState("sin");
  const [phase2, setPhase2] = useState(0);

  // Animation
  const [frames, setFrames] = useState([]);
  const [frameIndex, setFrameIndex] = useState(0);

  // Récupérer les données des ondes
  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

    const fetchWaveData = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/wave-superposition`, {
          amplitude1,
          wavelength1,
          frequency1,
          phase1,
          wave_type1: waveType1,
          amplitude2,
          wavelength2,
          frequency2,
          phase2,
          wave_type2: waveType2,
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
  }, [
    amplitude1,
    wavelength1,
    frequency1,
    phase1,
    waveType1,
    amplitude2,
    wavelength2,
    frequency2,
    phase2,
    waveType2,
  ]);

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
      // Graduation de l'axe X (temps ou distance)
      for (let x = 50; x <= axesCanvas.width; x += 50) {
        axesCtx.beginPath();
        axesCtx.moveTo(x, axesCanvas.height / 2 - 5);
        axesCtx.lineTo(x, axesCanvas.height / 2 + 5);
        axesCtx.stroke();
        axesCtx.fillText(`${(x - 50) / 10}m`, x - 10, axesCanvas.height / 2 + 20);
      }
      // Graduation de l'axe Y (amplitude)
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
  }, []);

  // Animation des ondes
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

      // Dessiner la première onde
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      points.forEach((point, index) => {
        const x = point.x + 50;
        const y = canvas.height / 2 + point.y1;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dessiner la deuxième onde
      ctx.beginPath();
      ctx.strokeStyle = "red";
      points.forEach((point, index) => {
        const x = point.x + 50;
        const y = canvas.height / 2 + point.y2;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dessiner la somme des deux ondes
      ctx.beginPath();
      ctx.strokeStyle = "green";
      points.forEach((point, index) => {
        const x = point.x + 50;
        const y = canvas.height / 2 + point.y_sum;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      // Dessiner la légende
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText("Légende :", 650, 30);
      ctx.fillStyle = "blue";
      ctx.fillText("Onde 1", 650, 50);
      ctx.fillStyle = "red";
      ctx.fillText("Onde 2", 650, 70);
      ctx.fillStyle = "green";
      ctx.fillText("Onde résultante", 650, 90);

      setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [frames, frameIndex]);

  return (
    <div className="wave-superposition-container">
  <h1>Superposition de deux ondes</h1>
  <div className="wave-superposition-layout">
    {/* Section Simulation: Inputs + Plot */}
    <div className="simulation-section">
      {/* Inputs */}
      <div className="wave-input-container">
        <h3>Paramètres de la première onde</h3>
        <label>
          Type d'onde :
          <select value={waveType1} onChange={(e) => setWaveType1(e.target.value)}>
            <option value="sin">Sinusoïdale</option>
            <option value="square">Carrée</option>
            <option value="triangle">Triangulaire</option>
          </select>
        </label>
        <label>
          Amplitude :
          <input
            type="number"
            value={amplitude1}
            onChange={(e) => setAmplitude1(+e.target.value)}
          />
        </label>
        <label>
          Longueur d'onde :
          <input
            type="number"
            value={wavelength1}
            onChange={(e) => setWavelength1(+e.target.value)}
          />
        </label>
        <label>
          Fréquence :
          <input
            type="number"
            value={frequency1}
            onChange={(e) => setFrequency1(+e.target.value)}
          />
        </label>
        <label>
          Phase :
          <input
            type="number"
            value={phase1}
            onChange={(e) => setPhase1(+e.target.value)}
          />
        </label>
      </div>

      <div className="wave-input-container">
        <h3>Paramètres de la deuxième onde</h3>
        <label>
          Type d'onde :
          <select value={waveType2} onChange={(e) => setWaveType2(e.target.value)}>
            <option value="sin">Sinusoïdale</option>
            <option value="square">Carrée</option>
            <option value="triangle">Triangulaire</option>
          </select>
        </label>
        <label>
          Amplitude :
          <input
            type="number"
            value={amplitude2}
            onChange={(e) => setAmplitude2(+e.target.value)}
          />
        </label>
        <label>
          Longueur d'onde :
          <input
            type="number"
            value={wavelength2}
            onChange={(e) => setWavelength2(+e.target.value)}
          />
        </label>
        <label>
          Fréquence :
          <input
            type="number"
            value={frequency2}
            onChange={(e) => setFrequency2(+e.target.value)}
          />
        </label>
        <label>
          Phase :
          <input
            type="number"
            value={phase2}
            onChange={(e) => setPhase2(+e.target.value)}
          />
        </label>
      </div>

      {/* Canvas Plot */}
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
    </div>

    {/* Description Section */}
    <div className="description-section">
      <h2>📚 Théorie des ondes</h2>
      <p>
        La superposition des ondes est un principe fondamental en physique.
        Lorsque deux ondes se rencontrent, leurs amplitudes s'ajoutent.
      </p>
      <h3>Superposition constructive</h3>
      <p>
        Se produit lorsque les crêtes des deux ondes coïncident, produisant
        une onde résultante de plus grande amplitude.
      </p>
      <h3>Superposition destructive</h3>
      <p>
        Se produit lorsque les crêtes d'une onde coïncident avec les creux
        de l'autre, annulant partiellement ou totalement les amplitudes.
      </p>
      <h3>Formules</h3>
      <ul>
        <li>
          <strong>Onde résultante :</strong>{" "}
          <code>y_sum(x, t) = y1(x, t) + y2(x, t)</code>
        </li>
        <li>
          <strong>Conditions de superposition constructive :</strong>{" "}
          <code>Δφ = n × 2π</code>
        </li>
        <li>
          <strong>Conditions de superposition destructive :</strong>{" "}
          <code>Δφ = (2n + 1) × π</code>
        </li>
      </ul>
    </div>
  </div>
</div>

  );
};

export default WaveSuperposition;
