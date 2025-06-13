import React, { useEffect, useState } from "react";
// PUBLIC_INTERFACE
// Main Landing Page component for MiniMayhem Arcade Hub
// Uses retro arcade look & feel, Google Fonts, API quote/joke, dark mode, and card animation

// Framer Motion for animations (install if missing)
import { motion } from "framer-motion";
// React-icons for pixel/arcade icons (install if missing)
import { FaGamepad, FaUser, FaTrophy, FaSun, FaMoon, FaTerminal } from "react-icons/fa";

import "./LandingPage.css";

// Google Fonts (Press Start 2P, VT323 loaded dynamically)
const addGoogleFonts = () => {
  if (!document.getElementById("google-font-arcadehub")) {
    const link = document.createElement("link");
    link.id = "google-font-arcadehub";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";
    document.head.appendChild(link);
  }
};

const GAME_FEATURES = [
  {
    name: "Typing Challenge",
    icon: <FaTerminal />,
    description: "How fast can you type? Master the leaderboards!",
    color: "#F7C948",
  },
  {
    name: "Reaction Speed",
    icon: <FaGamepad />,
    description: "Test your reflexes in the ultimate speed test.",
    color: "#FF3B81",
  },
  {
    name: "Sudoku",
    icon: <FaTrophy />,
    description: "Solve classic puzzles, from easy to mayhem difficulty.",
    color: "#00FFD0",
  },
  {
    name: "Memory Match",
    icon: <FaUser />,
    description: "Train your brain—match pairs before time runs out.",
    color: "#2D2D72",
  },
];

const ZEN_QUOTES_API = "https://zenquotes.io/api/today";
const JOKE_API = "https://v2.jokeapi.dev/joke/Any?type=single";

// Arcade logo SVG pixel
const ArcadeLogo = () => (
  <span
    style={{
      fontFamily: "'Press Start 2P', monospace",
      color: "#F7C948",
      fontSize: "2rem",
      marginRight: 12,
      filter: "drop-shadow(0 0 4px #F7C948)",
      textShadow: "0 0 8px #F7C948, 0 0 2px #FFFFFF",
      letterSpacing: "1px",
    }}
    aria-label="arcade icon"
  >
    🎮
  </span>
);

// Hero CTA animation (pixel shimmer)
const ctaShimmer = {
  animate: {
    background:
      "linear-gradient(90deg, #2D2D72 20%, #F7C948 50%, #2D2D72 80%)",
    backgroundSize: "200% 100%",
    color: "#2D2D72",
    boxShadow: "0 0 8px #F7C948",
    transition: { repeat: Infinity, duration: 2 },
  },
};

function getInitialTheme() {
  if (localStorage.getItem("arcadehub-theme")) {
    return localStorage.getItem("arcadehub-theme");
  }
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// PUBLIC_INTERFACE
function LandingPage() {
  // State
  const [quote, setQuote] = useState(null);
  const [joke, setJoke] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme());

  // Fetch daily quote
  useEffect(() => {
    addGoogleFonts();
    fetch(ZEN_QUOTES_API)
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (Array.isArray(data) && data[0]) {
          setQuote(`${data[0].q} —${data[0].a}`);
        } else {
          setQuote("Press Start on a good day!");
        }
      })
      .catch(() => setQuote("Ready for some arcade fun?"));
    // Fetch joke
    fetch(JOKE_API)
      .then((res) => res.ok && res.json())
      .then((data) => {
        setJoke(data.joke || "Jokes are on cooldown! Come back soon.");
      })
      .catch(() => setJoke("What's a pixel's favorite music? Chiptune!"));
  }, []);

  // Handle dark mode effect
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("arcadehub-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <div className="arcade-bg">
      <nav className="arcade-navbar">
        <div className="arcade-logo">
          <ArcadeLogo />
          <a
            href="/"
            style={{
              fontFamily: "'Press Start 2P', 'VT323', monospace",
              fontWeight: "bold",
              fontSize: "1.22rem",
              color: "#fff",
              letterSpacing: "1.4px",
              textDecoration: "none"
            }}
            aria-label="Go to Home"
          >
            MiniMayhem Arcade Hub
          </a>
        </div>
        <ul className="arcade-navlinks">
          <li>
            <a href="#games">Our Games</a>
          </li>
          <li>
            <a href="#topgames">Top Games</a>
          </li>
          <li>
            <a href="#settings">Settings</a>
          </li>
          <li>
            <button
              className="arcade-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              title="Toggle dark/light mode"
            >
              {theme === "dark" ? (
                <FaSun style={{ color: "#F7C948" }} />
              ) : (
                <FaMoon style={{ color: "#2D2D72" }} />
              )}
            </button>
          </li>
        </ul>
      </nav>
      <main>
        <section className="arcade-hero">
          <motion.h1
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="arcade-hero-title"
            style={{
              fontFamily: "'Press Start 2P', 'VT323', monospace",
              color: "#F7C948",
            }}
          >
            Welcome to MiniMayhem!
          </motion.h1>
          <motion.p
            className="arcade-hero-desc"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{
              fontFamily: "'VT323', 'Press Start 2P', monospace",
              color: "#fff",
              fontSize: "1.6rem",
              textShadow: "0 0 3px #2D2D72, 0 0 1px #F7C948",
            }}
          >
            Play. Compete. Laugh. Retro fun—every day!
          </motion.p>
          <motion.button
            className="arcade-cta-btn"
            whileHover={{ scale: 1.08, boxShadow: "0 0 18px #F7C948" }}
            style={{
              fontFamily: "'Press Start 2P', 'VT323', monospace",
              background:
                "linear-gradient(90deg, #F7C948, #FF3B81, #00FFD0, #2D2D72)",
              backgroundSize: "180% 100%",
              color: "#2D2D72",
              border: "2px solid #fff",
              textShadow: "0 0 2px #F7C948",
              marginTop: 20,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: "12px",
              transition: "background 0.4s",
              boxShadow: "0 0 7px #F7C948",
              padding: "14px 32px",
            }}
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            PRESS START
          </motion.button>
        </section>
        <section className="arcade-feature-cards" id="games">
          <h2
            className="arcade-section-title"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            Featured Games
          </h2>
          <div className="arcade-cards-grid">
            {GAME_FEATURES.map((feature, idx) => (
              <motion.div
                className="arcade-card"
                whileHover={{
                  scale: 1.06,
                  rotate: [0, 2, -2, 2, 0],
                  boxShadow: `0 0 18px ${feature.color}`,
                  border: `2.5px solid ${feature.color}`,
                  transition: { // Use 'tween' for multi-keyframe (like rotate) to avoid framer-motion error
                    rotate: {
                      type: "tween",
                      duration: 0.49,
                      ease: "easeInOut",
                    },
                    scale: {
                      type: "spring",
                      stiffness: 220,
                      damping: 20,
                    },
                    boxShadow: { type: "tween", duration: 0.15 },
                    border: { type: "tween", duration: 0.15 },
                  },
                }}
                initial={{ opacity: 0, y: 55 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.18 + idx * 0.13,
                  type: "spring",
                  stiffness: 140,
                }}
                key={feature.name}
              >
                <div
                  className="arcade-card-icon"
                  style={{
                    color: feature.color,
                    textShadow: `0 0 8px ${feature.color}, 0 0 3px #222`,
                  }}
                >
                  {feature.icon}
                </div>
                <div className="arcade-card-title">{feature.name}</div>
                <div className="arcade-card-desc">{feature.description}</div>
                <motion.button
                  whileHover={{
                    scale: 1.09,
                    backgroundColor: "#111",
                    color: "#F7C948",
                  }}
                  className="arcade-card-play-btn"
                  style={{
                    fontFamily: "'VT323', 'Press Start 2P', monospace",
                  }}
                  aria-label={`Play ${feature.name}`}
                  tabIndex={0}
                >
                  Play
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>
        <section
          className="arcade-quote-joke"
          id="funzone"
          style={{
            fontFamily: "'VT323','Press Start 2P', monospace",
            marginTop: "34px",
            marginBottom: "26px",
            width: "100%",
            maxWidth: 640,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "21px",
            background: "rgba(20,30,95,0.92)",
            boxShadow: "0 0 24px #2D2D72, 0 0 2px #D7C948",
            padding: "30px 16px",
            border: theme === "light" ? "2px solid #2D2D72" : "2px solid #F7C948",
          }}
        >
          <div
            className="arcade-quote"
            style={{
              fontSize: "1.16rem",
              color: "#F7C948",
              marginBottom: "18px",
              textShadow: "0 0 6px #F7C94890",
            }}
          >
            <strong>Daily Quote:</strong> {quote || "Loading..."}
          </div>
          <div
            className="arcade-joke"
            style={{
              fontSize: "1.13rem",
              color: "#fff",
              textShadow: "0 0 9px #F7C94850",
            }}
          >
            <strong>Joke of the Day:</strong> {joke || "Loading..."}
          </div>
        </section>

        <footer className="arcade-footer">
          <div className="arcade-footer-left">
            <a href="#" className="arcade-footer-link">
              Home
            </a>
            <a href="#games" className="arcade-footer-link">
              Games
            </a>
            <a href="#features" className="arcade-footer-link">
              Features
            </a>
            <a href="#funzone" className="arcade-footer-link">
              FunZone
            </a>
          </div>
          <div className="arcade-footer-center">
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: "#F7C948",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              © {new Date().getFullYear()} MiniMayhem Arcade Hub
            </span>
          </div>
          <div className="arcade-footer-right">
            <button
              className="arcade-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              title="Toggle dark/light mode"
            >
              {theme === "dark" ? (
                <FaSun style={{ color: "#F7C948", fontSize: "1.22rem" }} />
              ) : (
                <FaMoon style={{ color: "#2D2D72", fontSize: "1.18rem" }} />
              )}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default LandingPage;
