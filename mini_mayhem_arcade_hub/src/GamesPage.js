import React, { useEffect, useState } from 'react';
import './GamesPage.css';
import { FaRegKeyboard, FaBolt, FaPuzzlePiece, FaThLarge, FaFont, FaBrain } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // If not using react-router, fallback to window.location

// Neon arcade pixel/modern font: 'Press Start 2P', 'VT323', 'Orbitron', sans-serif

// PUBLIC_INTERFACE
function GamesPage() {
  // For animating subheading on mount
  const [showSubhead, setShowSubhead] = useState(false);
  // Hook for SPA navigation
  let navigate = null;
  try {
    // If user has react-router, prefer it for navigation
    navigate = useNavigate();
  } catch (e) {}

  useEffect(() => {
    // Animate subheading when mounted
    const tm = setTimeout(() => setShowSubhead(true), 200);
    return () => clearTimeout(tm);
  }, []);

  // Game cards data
  const games = [
    {
      title: 'Block Game',
      description: 'Classic falling blocks — how long can you survive?',
      icon: <FaThLarge color="#2DFF5A" size={48} />,
      route: '/block-game',
      color: '#2DFF5A',
      accent: '#2D2D72'
    },
    {
      title: 'Memory Game',
      description: 'Flip the cards. Find all matching pairs. Beat your best!',
      icon: <FaBrain color="#F7C948" size={48} />,
      route: '/memory-game',
      color: '#F7C948',
      accent: '#2D2D72'
    },
    {
      title: 'Reaction Speed Test',
      description: 'Test your reflexes with sudden neon signals!',
      icon: <FaBolt color="#339CFF" size={48} />,
      route: '/reaction-speed',
      color: '#339CFF',
      accent: '#2D2D72'
    },
    {
      title: 'Word Typing Challenge',
      description: 'Type words ASAP. Fast fingers = high scores!',
      icon: <FaRegKeyboard color="#FF3EFF" size={48} />,
      route: '/typing-challenge',
      color: '#FF3EFF',
      accent: '#2D2D72'
    },
    {
      title: 'Sudoku',
      description: 'Number logic — fill the grid, flex your brain!',
      icon: <FaPuzzlePiece color="#FFE35B" size={48} />,
      route: '/sudoku',
      color: '#FFE35B',
      accent: '#2D2D72'
    },
    {
      title: 'Sliding Tile Puzzle',
      description: 'Slide blocks into order. How many moves will it take?',
      icon: <FaFont color="#00FFCB" size={48} />,
      route: '/sliding-tile',
      color: '#00FFCB',
      accent: '#2D2D72'
    }
  ];

  // Handler for Play Now button/click
  function handlePlay(route) {
    if (navigate) navigate(route);
    else window.location.href = route;
  }

  return (
    <div className="mm-gamespage-bg">
      <div className="mm-gamespage-container">
        {/* Neon Arcade Heading */}
        <h1 className="mm-gamespage-heading" tabIndex={0}>
          <span className="mm-gamespage-emoji" role="img" aria-label="joystick">🕹️</span> Choose a Game to Play!
        </h1>
        {/* Animated Subheading */}
        <div className={`mm-gamespage-subheading${showSubhead ? ' mm-gp-subheading-animate' : ''}`}>
          Challenge yourself or friends in our mini neon arcade &mdash; click any card below and let's play!
        </div>
        {/* Responsive game grid */}
        <div className="mm-gamespage-grid" aria-label="Game Selection Grid" role="list">
          {games.map(game => (
            <div
              className="mm-gp-card"
              key={game.title}
              style={{
                borderColor: game.color,
                boxShadow: `0 0 6px 1.5px ${game.color}80, 0 0 20px 7px #252b` 
              }}
              tabIndex={0}
              role="listitem"
              aria-label={`Game: ${game.title}`}
              onClick={() => handlePlay(game.route)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') handlePlay(game.route);
              }}
            >
              <div className="mm-gp-card-icon" style={{ color: game.color }}>
                {game.icon}
              </div>
              <div className="mm-gp-card-title">{game.title}</div>
              <div className="mm-gp-card-desc">{game.description}</div>
              <button
                className="mm-gp-card-play mm-cta-btn"
                tabIndex={0}
                onClick={e => {e.stopPropagation(); handlePlay(game.route);}}
                style={{
                  background: `linear-gradient(85deg, ${game.color} 35%, ${game.accent} 90%)`
                }}
                aria-label={`Play Now: ${game.title}`}
              >
                Play Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamesPage;
