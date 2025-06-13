import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCube, FaBrain, FaBolt, FaKeyboard, FaTable, FaThLarge } from "react-icons/fa";
import { MdNightlightRound, MdWbSunny } from "react-icons/md";

// Neon arcade/pixel font settings (Pulled from App.css root)
const arcadeFont = "'Press Start 2P', 'VT323', 'Orbitron', monospace";
const neonColors = ["#4CC9F0", "#00FF99", "#F72585"];

// PUBLIC_INTERFACE
function GamesPage() {
  const navigate = useNavigate();

  // Theme persistence (localStorage) and theme state
  const [darkMode, setDarkMode] = useState(() => {
    // Default: dark, sync with localStorage
    const local = window.localStorage.getItem("mm-arcade-theme");
    return local ? JSON.parse(local) : true;
  });

  // Sync theme class on <body> & localStorage
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    document.body.classList.toggle("light", !darkMode);
    window.localStorage.setItem("mm-arcade-theme", JSON.stringify(darkMode));
  }, [darkMode]);

  // Neon glowing box-shadow builder
  const neonShadow = (color, intensity = 3) =>
    Array.from({ length: intensity }).map((_, i) => `0 0 ${4 + i * 5}px ${color}`).join(",");

  // Games data
  const games = [
    {
      icon: <FaCube size={38} color={neonColors[0]} style={{ filter: "drop-shadow(0 0 6px #4CC9F0)", marginBottom: 5 }} />,
      title: "Block Builder",
      description: "Stack falling blocks and aim for a high score.",
      route: "/block-game",
      color: neonColors[0]
    },
    {
      icon: <FaBrain size={38} color={neonColors[1]} style={{ filter: "drop-shadow(0 0 9px #37ffce)", marginBottom: 5 }} />,
      title: "Memory Flip",
      description: "Match the pairs as fast as you can!",
      route: "/memory-game",
      color: neonColors[1]
    },
    {
      icon: <FaBolt size={38} color={neonColors[2]} style={{ filter: "drop-shadow(0 0 8px #F72585)", marginBottom: 5 }} />,
      title: "Speed Tap",
      description: "Test your reaction time!",
      route: "/reaction-speed",
      color: neonColors[2]
    },
    {
      icon: <FaKeyboard size={38} color={neonColors[0]} style={{ filter: "drop-shadow(0 0 9px #4CC9F0)", marginBottom: 5 }} />,
      title: "TypeMaster",
      description: "Test your typing speed and accuracy.",
      route: "/typing-challenge",
      color: neonColors[0]
    },
    {
      icon: <FaTable size={38} color={neonColors[1]} style={{ filter: "drop-shadow(0 0 9px #00FF99)", marginBottom: 5 }} />,
      title: "Sudoku",
      description: "Solve puzzles and level up your logic.",
      route: "/sudoku",
      color: neonColors[1]
    },
    {
      icon: <FaThLarge size={38} color={neonColors[2]} style={{ filter: "drop-shadow(0 0 8px #F72585)", marginBottom: 5 }} />,
      title: "Sliding Tiles",
      description: "Arrange all pieces to solve the puzzle!",
      route: "/sliding-tiles",
      color: neonColors[2]
    }
  ];

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setDarkMode((dm) => !dm);
  }

  // Card background/light/dark
  const getCardBg = (color) =>
    darkMode
      ? `linear-gradient(134deg, #232335 60%, ${color}19 150%)`
      : `linear-gradient(134deg, #fffefd 80%, ${color}20 140%)`;

  // Card text color
  const getCardDescColor = () => (darkMode ? "#B7F7FF" : "#252525");

  // Card shadow
  const getCardShadow = (color, extra = 0) =>
    neonShadow(color, darkMode ? 4 + extra : 3 + extra) +
    (darkMode ? ",0 0 18px 2px #fff2" : ",0 0 14px 2px #9ec6f844");

  // Button appearance
  const getBtnStyle = (gameColor) =>
    darkMode
      ? {
          background: `linear-gradient(90deg, ${neonColors[0]} 40%, ${neonColors[1]} 80%)`,
          color: "#051f22",
          boxShadow: `0 0 13px 3px ${gameColor}, 0 0 8px 1.5px #fff4`,
        }
      : {
          background: `linear-gradient(90deg, #fff 5%, ${gameColor} 90%)`,
          color: "#232232",
          boxShadow: `0 0 13px 2px ${gameColor}33, 0 0 7px 1px #fff9`,
        };

  // Theme toggle button color/position
  const themeBtnColors = {
    btnBorder: darkMode ? neonColors[0] : neonColors[2],
    icon: darkMode ? neonColors[1] : neonColors[2],
    bg: darkMode ? "#222434" : "#f3f6fa",
    shadow:
      darkMode
        ? `0 0 0 2px ${neonColors[0]}33, 0 0 8px 3px ${neonColors[0]}44`
        : `0 0 0 2px ${neonColors[2]}33, 0 0 8px 2px ${neonColors[2]}55`,
    hover: darkMode
      ? {
          border: neonColors[2],
          background: "#eee9",
          color: neonColors[2],
        }
      : {
          border: neonColors[1],
          background: "#fff8",
          color: neonColors[1],
        },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(132deg, #0A0A0A 40%, #232335 130%)"
          : "linear-gradient(122deg, #fff 0%, #d6ecfb 120%)",
        fontFamily: arcadeFont,
        color: darkMode ? "#fffbe6" : "#252525",
        transition: "background 0.4s, color 0.25s",
        padding: 0,
        width: "100vw",
        position: "relative",
      }}
    >
      {/* Heading section */}
      <header
        style={{
          width: "100vw",
          textAlign: "center",
          margin: 0,
          marginBottom: 38,
          paddingTop: 52,
          paddingBottom: 8,
          zIndex: 1,
          background: "none",
          position: "relative",
        }}
      >
        {/* Theme toggle button (absolute in header top right) */}
        <button
          className="mm-theme-toggle"
          aria-label="Toggle dark/light theme"
          onClick={toggleTheme}
          style={{
            position: "absolute",
            right: 17,
            top: 15,
            background: themeBtnColors.bg,
            border: `2px solid ${themeBtnColors.btnBorder}`,
            borderRadius: 8,
            color: themeBtnColors.icon,
            boxShadow: themeBtnColors.shadow,
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 30,
            minHeight: 30,
            fontSize: 21,
            cursor: "pointer",
            outline: "none",
            transition:
              "background 0.13s, color 0.17s, border 0.09s, box-shadow 0.13s",
          }}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          type="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleTheme();
            }
          }}
        >
          {darkMode ? (
            <MdNightlightRound
              size={20}
              style={{
                color: neonColors[1],
                filter: "drop-shadow(0 0 2.5px #00FF99)",
              }}
              aria-label="dark mode"
              title="Currently Dark Mode"
            />
          ) : (
            <MdWbSunny
              size={24}
              style={{
                color: neonColors[2],
                filter: "drop-shadow(0 0 2.5px #F72585)",
              }}
              aria-label="light mode"
              title="Currently Light Mode"
            />
          )}
        </button>
        <h1
          style={{
            fontFamily: "'Press Start 2P', 'VT323', 'Orbitron', monospace",
            fontSize: "2.2rem",
            textTransform: "uppercase",
            color: neonColors[0],
            textShadow: `${neonShadow(neonColors[0], 4)},0 0 30px #57d4ee77`,
            marginBottom: 10,
            letterSpacing: "0.04em",
          }}
        >
          🕹️ Choose a Game to Play!
        </h1>
        <div
          style={{
            margin: "12px auto 0 auto",
            maxWidth: 580,
            color: neonColors[2],
            fontFamily: "'VT323', 'Orbitron', monospace",
            fontSize: "1.12rem",
            textShadow: neonShadow(neonColors[2], 2),
            letterSpacing: "0.01em",
            animation: "fadeInDown 1.1s cubic-bezier(.43,.5,.53,1.09)",
          }}
        >
          Ready to challenge your reflexes, memory, and brain power? Pick a game below and beat your high score!
        </div>
      </header>

      {/* Main grid */}
      <main
        style={{
          maxWidth: 1230,
          margin: "0 auto",
          padding: "18px 9px 36px 9px",
        }}
      >
        <div
          className="games-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 36,
            width: "100%",
            margin: "0 auto",
            justifyItems: "center",
            alignItems: "stretch",
          }}
        >
          {games.map((game) => (
            <div
              key={game.title}
              role="button"
              tabIndex={0}
              aria-label={`Play ${game.title}`}
              className="mm-arcade-card"
              style={{
                cursor: "pointer",
                outline: "none",
                border: `2.6px solid ${game.color}`,
                borderRadius: 17,
                background: getCardBg(game.color),
                boxShadow: getCardShadow(game.color),
                minHeight: 237,
                maxWidth: 295,
                width: "99%",
                padding: "19px 13px 17px 13px",
                margin: "0 0 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition:
                  "box-shadow 0.22s, border 0.18s, transform 0.26s cubic-bezier(.77,-0.29,.98,1.49), background 0.22s, color 0.17s",
                fontFamily: arcadeFont,
                willChange: "transform",
              }}
              onClick={() => navigate(game.route)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") navigate(game.route);
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "scale(1.08) rotate(-2deg)";
                e.currentTarget.style.boxShadow = getCardShadow(game.color, 3);
                e.currentTarget.style.borderColor = neonColors[1];
                e.currentTarget.style.background = darkMode
                  ? `linear-gradient(136deg, #302455 66%, ${game.color}44 180%)`
                  : `linear-gradient(132deg, #f2fbff 68%, ${game.color}44 160%)`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "scale(1) rotate(0)";
                e.currentTarget.style.boxShadow = getCardShadow(game.color);
                e.currentTarget.style.borderColor = game.color;
                e.currentTarget.style.background = getCardBg(game.color);
              }}
              onFocus={e => {
                e.currentTarget.style.outline = `3px solid ${neonColors[2]}`;
                e.currentTarget.style.borderColor = neonColors[2];
              }}
              onBlur={e => {
                e.currentTarget.style.outline = "none";
                e.currentTarget.style.borderColor = game.color;
              }}
            >
              <div
                style={{
                  marginBottom: 10,
                  marginTop: 1,
                  textShadow: neonShadow(game.color, 2),
                }}
              >
                {game.icon}
              </div>
              <div
                style={{
                  color: game.color,
                  fontSize: "1.11rem",
                  fontFamily: "'VT323', 'Orbitron', monospace",
                  letterSpacing: "0.06em",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  fontWeight: 900,
                  textShadow: neonShadow(game.color, 2),
                }}
              >
                {game.title}
              </div>
              <div
                style={{
                  fontFamily: "'Orbitron', 'Poppins', monospace",
                  fontSize: "1.06rem",
                  color: getCardDescColor(),
                  minHeight: 47,
                  marginBottom: 19,
                  textAlign: "center",
                  textShadow: darkMode
                    ? neonShadow(neonColors[0], 1)
                    : neonShadow(game.color, 1),
                  transition: "color 0.17s, text-shadow 0.17s",
                }}
              >
                {game.description}
              </div>
              <button
                style={{
                  border: "none",
                  outline: "none",
                  fontFamily: arcadeFont,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  ...getBtnStyle(game.color),
                  letterSpacing: "0.045em",
                  borderRadius: 7,
                  padding: "8px 24px",
                  marginTop: "auto",
                  marginBottom: 0,
                  cursor: "pointer",
                  transition:
                    "background 0.18s, box-shadow 0.14s, filter 0.11s, color 0.14s",
                  filter: "saturate(1.15)",
                }}
                className="arcade-glow-btn"
                onClick={e => {
                  e.stopPropagation();
                  navigate(game.route);
                }}
                onMouseOver={e => {
                  e.target.style.background = darkMode
                    ? `linear-gradient(90deg, ${neonColors[2]} 25%, ${neonColors[0]} 75%)`
                    : `linear-gradient(90deg, ${neonColors[1]} 25%, #fff 100%)`;
                  e.target.style.boxShadow = darkMode
                    ? `0 0 24px 5px ${neonColors[2]}, 0 0 12px 2.5px ${neonColors[0]}`
                    : `0 0 19px 5px ${neonColors[1]}, 0 0 11px 2.5px #fff`;
                  e.target.style.color = darkMode ? "#fffbe6" : neonColors[2];
                }}
                onMouseOut={e => {
                  const style = getBtnStyle(game.color);
                  e.target.style.background = style.background;
                  e.target.style.boxShadow = style.boxShadow;
                  e.target.style.color = style.color;
                }}
                onFocus={e => {
                  e.target.style.outline = `2.25px solid ${neonColors[0]}`;
                }}
                onBlur={e => {
                  e.target.style.outline = "none";
                }}
              >
                Play Now
              </button>
            </div>
          ))}
        </div>
      </main>
      {/* Neon pixel font animation keyframes and responsive */}
      <style>
        {`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @media (max-width: 900px) {
          header { padding-top: 39px !important; }
          .games-grid { gap: 19px !important;}
        }
        @media (max-width: 600px) {
          header { font-size: 0.97rem !important; padding-top: 26px!important;}
          .mm-arcade-card { min-height: 196px !important; max-width: 98vw !important;}
        }
        `}
      </style>
      {/* Optional: floating theme toggle icon at footer on mobile (duplicated for convenience) */}
      <footer className="mm-footer" style={{
        marginTop: 18,
        padding: '21px 0 16px 0',
        width: '100vw',
        textAlign: 'center',
        background: darkMode ? '#16113d' : '#f3f8fc',
        borderTop: `2.5px solid ${darkMode ? neonColors[0] : neonColors[2]}`,
        boxShadow: darkMode
          ? neonShadow(neonColors[0], 1)
          : neonShadow(neonColors[2], 1),
        position: 'relative',
        zIndex: 20,
        fontFamily: arcadeFont,
        fontSize: 14,
        color: darkMode ? neonColors[1] : neonColors[2],
        transition: 'background 0.23s, color 0.16s'
      }}>
        <span style={{
          color: darkMode ? neonColors[0] : neonColors[2],
          fontWeight: 700,
          textShadow: neonShadow(darkMode ? neonColors[0] : neonColors[2], 1),
        }}>
          © MiniMayhem Arcade Hub {new Date().getFullYear()}
        </span>
        {/* footer theme toggle for mobile users */}
        <button
          className="mm-theme-toggle"
          aria-label="Toggle dark/light theme"
          onClick={toggleTheme}
          style={{
            position: "absolute",
            right: 16,
            top: 13,
            background: themeBtnColors.bg,
            border: `2px solid ${themeBtnColors.btnBorder}`,
            borderRadius: 8,
            color: themeBtnColors.icon,
            boxShadow: themeBtnColors.shadow,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 30,
            minHeight: 30,
            fontSize: 19,
            cursor: "pointer",
            outline: "none",
            transition:
              "background 0.13s, color 0.17s, border 0.09s, box-shadow 0.13s",
          }}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          type="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleTheme();
            }
          }}
        >
          {darkMode ? (
            <MdNightlightRound
              size={20}
              style={{
                color: neonColors[1],
                filter: "drop-shadow(0 0 2.5px #00FF99)",
              }}
              aria-label="dark mode"
              title="Currently Dark Mode"
            />
          ) : (
            <MdWbSunny
              size={22}
              style={{
                color: neonColors[2],
                filter: "drop-shadow(0 0 2.5px #F72585)",
              }}
              aria-label="light mode"
              title="Currently Light Mode"
            />
          )}
        </button>
      </footer>
    </div>
  );
}

export default GamesPage;
