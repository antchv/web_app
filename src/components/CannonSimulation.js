import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./CannonSimulation.css";

const CannonSimulation = () => {
  const canvasRef = useRef(null);

  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(50);
  const [gravity, setGravity] = useState(9.8);
  const [frames, setFrames] = useState([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const fetchTrajectoryData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/cannon", {
        angle,
        velocity,
        gravity,
        time_step: 0.05,
      });
      setFrames(response.data);
      setFrameIndex(0);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 400;

    let animationFrame;

    const animate = () => {
      if (frames.length === 0 || frameIndex >= frames.length) return;

      const point = frames[frameIndex];
      const nextPoint =
        frameIndex + 1 < frames.length ? frames[frameIndex + 1] : point;

      const speed =
        Math.sqrt(
          Math.pow(nextPoint.x - point.x, 2) +
          Math.pow(nextPoint.y - point.y, 2)
        ) / 0.05;
      setCurrentSpeed(speed);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 20);
      ctx.lineTo(canvas.width, canvas.height - 20);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();

      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height - 20);
        ctx.lineTo(i, canvas.height - 25);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        ctx.fillText(`${i / 10}m`, i - 10, canvas.height - 30);
      }

      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - i - 20);
        ctx.lineTo(5, canvas.height - i - 20);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        ctx.fillText(`${i / 10}m`, 10, canvas.height - i - 15);
      }

      ctx.beginPath();
      ctx.moveTo(0, canvas.height - point.y - 20);
      ctx.lineTo(canvas.width, canvas.height - point.y - 20);
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(point.x, canvas.height - point.y - 20, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [frames, frameIndex]);

  return (
    <div className="cannon-simulation-container">
      <h1>Simulation : Tir d'un boulet de canon</h1>
      <div className="cannon-simulation-layout">
        <div className="simulation-section">
        <div className="cannon-input-container">
          <label>
            Angle (°) :
            <input
              type="number"
              value={angle}
              onChange={(e) => setAngle(+e.target.value)}
            />
          </label>
          <label>
            Vitesse initiale (m/s) :
            <input
              type="number"
              value={velocity}
              onChange={(e) => setVelocity(+e.target.value)}
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
          <button onClick={fetchTrajectoryData}>Tirer</button>
        </div>

          <div className="canvas-container">
            <canvas ref={canvasRef}></canvas>
          </div>
          <p>
            <strong>Vitesse actuelle :</strong> {currentSpeed.toFixed(2)} m/s
          </p>
        </div>
        <div className="cheatsheet-section">
          <h2>📌 Théorie et Formules</h2>
          <ul>
            <li>
              <strong>Portée maximale :</strong> R = (v² × sin(2θ)) / g
            </li>
            <li>
              <strong>Hauteur maximale :</strong> H = (v² × sin²(θ)) / (2g)
            </li>
            <li>
              <strong>Temps de vol :</strong> T = (2v × sin(θ)) / g
            </li>
            <li>
              <strong>Position à un instant t :</strong>
              <ul>
                <li>
                  x(t) = v × cos(θ) × t
                </li>
                <li>
                  y(t) = v × sin(θ) × t - 0.5 × g × t²
                </li>
              </ul>
            </li>
          </ul>
          <p>
            Ajustez les paramètres pour observer comment ils influencent la trajectoire !
          </p>
        </div>
      </div>
    </div>
  );
};

export default CannonSimulation;
