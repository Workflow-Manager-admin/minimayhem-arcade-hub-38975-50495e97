import React, { useEffect, useState } from 'react';
import './GamesPage.css';
import { FaRegKeyboard, FaBolt, FaPuzzlePiece, FaBrain } from 'react-icons/fa';

/*
  PUBLIC_INTERFACE
  GamesPage - MiniMayhem Arcade Hub
  The central games hub. Displays arcade cards/tiles for Typing Challenge, Reaction Speed, Sudoku, and Memory Match.
  Each card includes a vibrant icon, title, description, and 'Play' button (currently placeholder). Fully responsive, accessible, and arcade-styled.
*/
function GamesPage() {
  // Animate subheading on mount
  const [showSubhead, setShowSubhead] = useState(false);

  useEffect(() => {
    // Animate subheading fade-in
    const tm = setTimeout(() => setShowSubhead(true), 180);
    return () => clearTimeout(tm);
  }, []);

  // Project palette and colors
  const themeColors = {
    primary: '#2D2D72',
    secondary: '#F7C948',
    accent: '#9c9c9c',
    btn1: '#2DFF5A',
    btn2: '#339CFF',
    cardBg: '#1C1C1C',
    cardBorder: '#2D2D72',
    text: '#fffbe6',
    iconPink: '#F72585',
    iconPurple: '#3A0CA3',
    iconBlue: '#4CC9F0',
    iconYellow: '#FFB703',
  };

  // Four required mini-games, properly ordered
  const games = [
    {
      key: 'typing-challenge',
      title: 'Typing Challenge',
      description: 'Test your typing speed and accuracy in a fast-paced word game!',
      icon: <FaRegKeyboard color={themeColors.iconBlue} size={48} />,
      border: themeColors.btn2,
      accent: themeColors.primary,
    },
    {
      key: 'reaction-speed',
      title: 'Reaction Speed',
      description: 'How quick are you? Hit the button as fast as you can!',
      icon: <FaBolt color={themeColors.iconPink} size={48} />,
      border: themeColors.iconPink,
      accent: themeColors.primary,
    },
    {
      key: 'sudoku',
      title: 'Sudoku',
      description: 'Solve classic Sudoku puzzles for a brainy break.',
      icon: <FaPuzzlePiece color={themeColors.iconYellow} size={48} />,
      border: themeColors.iconYellow,
      accent: themeColors.primary,
    },
    {
      key: 'memory-match',
      title: 'Memory Match',
      description: 'Challenge your memory and match up all the pairs.',
      icon: <FaBrain color={themeColors.btn1} size={48} />,
      border: themeColors.btn1,
      accent: themeColors.primary,
    }
  ];

  // Handler: Play button/click (currently navigates to placeholder, or could fire a callback)
  function handlePlay(gameKey) {
    // Placeholder for actual navigation or routing logic.
    window.alert(`Let's play "${games.find(g=>g.key===gameKey)?.title || 'this game'}"! (Link coming soon)`);
  }

  return (
    <div className="mm-gamespage-bg">
      <div className="mm-gamespage-container">
        {/* Neon Arcade Heading */}
        <h1 className="mm-gamespage-heading" tabIndex={0}>
          <span className="mm-gamespage-emoji" role="img" aria-label="arcade">🕹️</span>
          Arcade Games
        </h1>
        {/* Animated Subheading */}
        <div className={`mm-gamespage-subheading${showSubhead ? ' mm-gp-subheading-animate' : ''}`}>
          Enter the arcade! Choose a neon mini-game below. All games work on desktop and mobile. 
          <br />Can you set a new high score?
        </div>
        {/* Arcade Card Grid */}
        <div className="mm-gamespage-grid" aria-label="Arcade Game Grid" role="list">
          {games.map(game => (
            <div
              className="mm-gp-card"
              key={game.key}
              style={{
                borderColor: game.border,
                boxShadow: `0 0 6px 1.5px ${game.border}90, 0 0 20px 7px #252b`,
                userSelect: 'none'
              }}
              tabIndex={0}
              role="listitem"
              aria-label={`Game: ${game.title}`}
              onClick={() => handlePlay(game.key)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') handlePlay(game.key);
              }}
            >
              <div className="mm-gp-card-icon" style={{ color: game.border }}>
                {game.icon}
              </div>
              <div className="mm-gp-card-title">
                {game.title}
              </div>
              <div className="mm-gp-card-desc">
                {game.description}
              </div>
              <button
                className="mm-gp-card-play mm-cta-btn"
                tabIndex={0}
                onClick={e => { e.stopPropagation(); handlePlay(game.key); }}
                style={{
                  background: `linear-gradient(86deg, ${themeColors.secondary} 15%, ${game.border} 90%)`,
                }}
                aria-label={`Play ${game.title}`}
              >
                Play
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamesPage;
