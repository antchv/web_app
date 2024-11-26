import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Bienvenue dans l'application de simulations pédagogiques</h1>
        <p>
          Explorez les phénomènes physiques grâce à des simulations interactives ! Cette plateforme a pour but de 
          rendre l'apprentissage des concepts scientifiques intuitif et ludique.
        </p>
      </header>

      <section className="homepage-content">
        <h2>🌟 À propos de cette application</h2>
        <p>
          Cette application web a été développée pour deux raisons principales :
        </p>
        <ul>
          <li>
            <strong>Éducation :</strong> Proposer des outils visuels pour mieux comprendre des concepts complexes en physique.
          </li>
          <li>
            <strong>Apprentissage technique :</strong> Construire une application moderne avec des technologies telles que :
            <ul>
              <li>Frontend : JavaScript (React.js)</li>
              <li>Backend : Python (Flask)</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="homepage-simulations">
        <h2>🔍 Simulations disponibles</h2>
        <p>Voici quelques exemples de simulations interactives que vous pouvez explorer :</p>
        <ul>
          <li> 📢 <strong>Propagation d'ondes :</strong> Explorez différents types d'ondes et ajustez leurs paramètres.</li>
          <li>🕰️ <strong>Simulation de pendule :</strong> Étudiez le mouvement oscillatoire avec ou sans amortissement.</li>
          <li>🎯 <strong>Tir de canon :</strong> Découvrez les principes de la balistique à travers une simulation dynamique.</li>
        </ul>
        <p>
          Cliquez sur une simulation dans le menu pour commencer votre exploration !
        </p>
      </section>

      <section className="homepage-contact">
        <h2>📬 Nous contacter</h2>
        <p>
          Vous avez une suggestion, une question ou une idée de simulation ? N'hésitez pas à nous écrire !
        </p>
        <a href="mailto:antoinecharvin2@gmail.com" className="contact-link">
          Contactez-nous
        </a>
      </section>
    </div>
  );
};

export default HomePage;
