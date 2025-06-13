import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCube, FaBrain, FaBolt, FaKeyboard, FaTable, FaThLarge } from "react-icons/fa";

// Neon arcade/pixel font settings (Pulled from App.css root)
const arcadeFont = "'Press Start 2P', 'VT323', 'Orbitron', monospace";
const neonColors = ["#4CC9F0", "#00FF99", "#F72585"];

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
function GamesPage() {
  const navigate = useNavigate();

  // Neon glowing box-shadow builder
  const neonShadow = (color, intensity = 3) =>
    Array.from({ length: intensity }).map((_, i) => `0 0 ${4 + i * 5}px ${color}`).join(",");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(132deg, #0A0A0A 40%, #232335 130%)",
        fontFamily: arcadeFont,
        color: "#fffbe6",
        padding: 0,
        width: "100vw"
      }}
    >
      {/* Heading section */}
      <header style={{
        width: "100vw",
        textAlign: "center",
        margin: 0,
        marginBottom: 38,
        paddingTop: 52,
        paddingBottom: 8,
        zIndex: 1
      }}>
        <h1 style={{
          fontFamily: "'Press Start 2P', 'VT323', 'Orbitron', monospace",
          fontSize: "2.2rem",
          textTransform: "uppercase",
          color: neonColors[0],
          textShadow: `${neonShadow(neonColors[0], 4)},0 0 30px #57d4ee77`,
          marginBottom: 10,
          letterSpacing: "0.04em"
        }}>
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
            animation: "fadeInDown 1.1s cubic-bezier(.43,.5,.53,1.09)"
          }}
        >
          Ready to challenge your reflexes, memory, and brain power? Pick a game below and beat your high score!
        </div>
      </header>

      {/* Main grid */}
      <main style={{
        maxWidth: 1230,
        margin: "0 auto",
        padding: "18px 9px 36px 9px"
      }}>
        <div
          className="games-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 36,
            width: "100%",
            margin: "0 auto",
            justifyItems: "center",
            alignItems: "stretch"
          }}
        >
          {games.map((game, idx) => (
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
                background: "#1C1C1C",
                boxShadow: `${neonShadow(game.color, 5)},0 0 18px 2px #fff2`,
                minHeight: 237,
                maxWidth: 295,
                width: "99%",
                padding: "19px 13px 17px 13px",
                margin: "0 0 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "box-shadow 0.22s, border 0.18s, transform 0.26s cubic-bezier(.77,-0.29,.98,1.49)",
                fontFamily: arcadeFont,
                willChange: "transform"
              }}
              onClick={() => navigate(game.route)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") navigate(game.route);
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "scale(1.08) rotate(-2deg)";
                e.currentTarget.style.boxShadow = `${neonShadow(game.color, 8)},0 0 26px 7px #fff4`;
                e.currentTarget.style.borderColor = neonColors[1];
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "scale(1) rotate(0)";
                e.currentTarget.style.boxShadow = `${neonShadow(game.color, 5)},0 0 18px 2px #fff2`;
                e.currentTarget.style.borderColor = game.color;
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
                  textShadow: neonShadow(game.color, 2)
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
                  textShadow: neonShadow(game.color, 2)
                }}>
                {game.title}
              </div>
              <div
                style={{
                  fontFamily: "'Orbitron', 'Poppins', monospace",
                  fontSize: "1.06rem",
                  color: "#B7F7FF",
                  minHeight: 47,
                  marginBottom: 19,
                  textAlign: "center",
                  textShadow: neonShadow(neonColors[0], 1)
                }}>
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
                  background: `linear-gradient(90deg, ${neonColors[0]} 40%, ${neonColors[1]} 80%)`,
                  color: "#051f22",
                  boxShadow: `0 0 13px 3px ${game.color}, 0 0 8px 1.5px #fff4`,
                  letterSpacing: "0.045em",
                  borderRadius: 7,
                  padding: "8px 24px",
                  marginTop: "auto",
                  marginBottom: 0,
                  cursor: "pointer",
                  transition: "background 0.18s, box-shadow 0.14s, filter 0.11s",
                  filter: "saturate(1.15)"
                }}
                className="arcade-glow-btn"
                onClick={e => {
                  e.stopPropagation();
                  navigate(game.route);
                }}
                onMouseOver={e => {
                  e.target.style.background = `linear-gradient(90deg, ${neonColors[2]} 25%, ${neonColors[0]} 75%)`;
                  e.target.style.boxShadow = `0 0 24px 5px ${neonColors[2]}, 0 0 12px 2.5px ${neonColors[0]}`;
                  e.target.style.color = "#fffbe6";
                }}
                onMouseOut={e => {
                  e.target.style.background = `linear-gradient(90deg, ${neonColors[0]} 40%, ${neonColors[1]} 80%)`;
                  e.target.style.boxShadow = `0 0 13px 3px ${game.color}, 0 0 8px 1.5px #fff4`;
                  e.target.style.color = "#051f22";
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
    </div>
  );
}
export default GamesPage;
