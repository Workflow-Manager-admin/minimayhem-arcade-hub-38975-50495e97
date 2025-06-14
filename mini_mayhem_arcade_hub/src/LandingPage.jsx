import React from "react";
import "./LandingPage.css";

// Pixel arcade fonts (already loaded in App and index)
const GAMES = [
  {
    emoji: "⌨️",
    name: "Typing Challenge",
    desc: "Race the clock with your fastest fingers."
  },
  {
    emoji: "⚡",
    name: "Reaction Speed",
    desc: "Test your reflexes in a neon flash."
  },
  {
    emoji: "🔢",
    name: "Sudoku Master",
    desc: "Classic logic puzzles, arcade style."
  },
  {
    emoji: "🃏",
    name: "Memory Match",
    desc: "Flip, match, and conquer the board."
  },
  {
    emoji: "🎯",
    name: "Speed Tap",
    desc: "Hit targets faster than the rest!"
  },
  {
    emoji: "🧩",
    name: "Tile Slider",
    desc: "Arrange the chaos—fast and smooth."
  }
];

const CTA_TEXT = "Enter the Arcade!";

const LandingPage = ({ onCTAClick }) => {
  // Light/dark mode detection from <body> class
  const darkMode =
    typeof window !== "undefined" &&
    document.body.classList.contains("dark");

  // Neon helpers
  const getNeon = (color, level = 2) =>
    Array.from({ length: level })
      .map((_, i) => `0 0 ${3 + i * 4}px ${color}`)
      .join(",");

  // Arcade color palette
  const COLORS = {
    pink: "#F72585",
    blue: "#4CC9F0",
    purple: "#3A0CA3",
    yellow: "#FFB703",
    black: "#0D0D0D"
  };

  // Handler for CTA button
  const handleClick = () => {
    if (onCTAClick) onCTAClick();
    else window.location.hash = "#games";
  };

  return (
    <div className="mm-landing"
      data-theme={darkMode ? "dark" : "light"}
    >
      {/* Heading */}
      <header className="mm-landing-header">
        <h1
          className="mm-landing-title"
          tabIndex={0}
          style={{
            color: COLORS.pink,
            textShadow: getNeon(COLORS.pink, 4),
            fontFamily: "'Press Start 2P', 'VT323', monospace"
          }}
        >
          <span role="img" aria-label="arcade joystick"
            className="mm-landing-arcade-icon"
            style={{
              color: COLORS.blue,
              fontSize: "2.7em",
              // a little bounce on load
              animation: "icon-bounce 1.5s cubic-bezier(.55,-0.13,.29,1.03)"
            }}
          >🕹️</span>
          MiniMayhem Arcade
        </h1>
        <div
          className="mm-landing-tagline"
          style={{
            color: COLORS.yellow,
            textShadow: getNeon(COLORS.yellow, 2),
          }}
        >
          Where Mini Games Bring Maximum Fun!
        </div>
      </header>
      <section className="mm-landing-intro">
        <p className="mm-landing-description">
          Welcome to <b>MiniMayhem Arcade</b> – a vibrant digital playground loaded with <span className="mm-accent">{GAMES.length} pulse-pounding mini-games</span>, high scores, and surprises. Dive in, compete on the <b>Leaderboard</b>, unlock customizations, and master both mind and reflex!
        </p>
      </section>
      {/* Game List */}
      <section className="mm-landing-games">
        <h2 className="mm-landing-games-title"
          style={{ color: COLORS.blue, textShadow: getNeon(COLORS.blue, 2) }}>
          <span role="img" aria-label="joystick">🎮</span> Games Inside:
        </h2>
        <ul className="mm-landing-games-list">
          {GAMES.map((g, i) => (
            <li key={g.name} className="mm-landing-game-item" tabIndex={0}>
              <span
                className="mm-landing-game-emoji"
                style={{
                  textShadow: getNeon([COLORS.blue, COLORS.pink, COLORS.purple, COLORS.yellow][i % 4], 2)
                }}
              >
                {g.emoji}
              </span>
              <span className="mm-landing-game-name">{g.name}</span>
              <span className="mm-landing-game-desc">{g.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Leaderboard / Scoreboard Promo */}
      <section className="mm-landing-leaderboard">
        <div className="mm-landing-leaderboard-promo"
          style={{ color: COLORS.purple, textShadow: getNeon(COLORS.purple, 1) }}>
          <span role="img" aria-label="trophy" style={{ fontSize: "1.2em" }}>🏆</span>
          Climb the <b>Scoreboard</b> and win bragging rights!
        </div>
      </section>

      {/* Settings / Help / Customization */}
      <section className="mm-landing-settings rowflex">
        <div className="mm-landing-settingblock" tabIndex={0}>
          <span role="img" aria-label="gear" style={{ color: COLORS.yellow, fontSize: "1.3em", marginRight: 8 }}>⚙️</span>
          <b>Customize</b> controls &amp; experience
        </div>
        <div className="mm-landing-settingblock" tabIndex={0}>
          <span role="img" aria-label="help" style={{ color: COLORS.blue, fontSize: "1.3em", marginRight: 8 }}>❓</span>
          <b>Need Help?</b> See our quick start guide
        </div>
      </section>

      {/* Dark/Light Mode Banner */}
      <div className="mm-landing-darkmode-banner"
        style={{
          background: darkMode
            ? "linear-gradient(94deg, #1A1A1A 70%, #3A0CA333 120%)"
            : "linear-gradient(94deg, #fff 60%, #4CC9F033 120%)",
          color: darkMode ? COLORS.yellow : COLORS.purple,
          borderColor: darkMode ? COLORS.yellow : COLORS.purple
        }}
        tabIndex={0}
      >
        <span role="img" aria-label="moon" style={{ marginRight: 6 }}>
          {darkMode ? "🌙" : "☀️"}
        </span>
        <b>Now with {darkMode ? "Dark" : "Light"} Mode!</b>
        <span className="mm-landing-darkmode-switch"
          style={{
            background: darkMode ? COLORS.yellow : COLORS.purple,
            color: darkMode ? "#1A1A1A" : "#FFF",
            textShadow: "none"
          }}
        >{darkMode ? "ON" : "OFF"}</span>
      </div>

      {/* Big CTA */}
      <section className="mm-landing-cta-row">
        <button
          className="mm-landing-cta-btn mm-cta-btn"
          tabIndex={0}
          style={{
            background: `linear-gradient(95deg, ${COLORS.pink} 45%, ${COLORS.blue} 110%)`,
            color: "#fff",
            fontFamily: "'Press Start 2P', 'VT323', monospace",
            boxShadow: getNeon(COLORS.pink, 2),
            border: `3px solid ${COLORS.yellow}`
          }}
          onClick={handleClick}
        >
          {CTA_TEXT}
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
