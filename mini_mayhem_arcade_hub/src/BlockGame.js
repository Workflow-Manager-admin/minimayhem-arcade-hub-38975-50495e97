import React, { useEffect, useRef, useState } from 'react';

/**
 * BlockGame - Tetris-like falling blocks arcade game for MiniMayhem.
 * Features: falling tetrominoes, rotation, movement, line clear, loss, scoring, neon pixel art UI.
 * Route: /block-game
 */

// PUBLIC_INTERFACE
function BlockGame() {
  // Arcade palette
  const COLORS = [
    '#00FFCB', // I - cyan
    '#2DFF5A', // J - green
    '#F72585', // L - pink
    '#3A0CA3', // O - purple
    '#FFE35B', // S - yellow
    '#4CC9F0', // T - blue
    '#F7C948', // Z - gold
  ];
  const PALETTE_BG = "#18102A";
  const GRID_BG = "#0D0D0D";
  const GRID_BORDER = "#3A0CA3";
  const SHADOW = (col) => `0 0 8px 2px ${col}98, 0 0 5px #0009`;

  // Grid constants
  const ROWS = 20;
  const COLS = 10;
  const BLOCK = 26; // px per grid cell

  // Piece definitions (shape as 4x4 array, colorIndex)
  const TETROMINOES = [
    // I
    { shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], colorIdx: 0 },
    // J
    { shape: [[1,0,0],[1,1,1],[0,0,0]], colorIdx: 1 },
    // L
    { shape: [[0,0,1],[1,1,1],[0,0,0]], colorIdx: 2 },
    // O
    { shape: [[1,1],[1,1]], colorIdx: 3 },
    // S
    { shape: [[0,1,1],[1,1,0],[0,0,0]], colorIdx: 4 },
    // T
    { shape: [[0,1,0],[1,1,1],[0,0,0]], colorIdx: 5 },
    // Z
    { shape: [[1,1,0],[0,1,1],[0,0,0]], colorIdx: 6 }
  ];

  // Helper: deep clone 2D array
  const clone = (m) => m.map(row => row.slice());

  // State
  const [board, setBoard] = useState(createEmptyBoard());
  const [active, setActive] = useState(null);     // { shape, x, y, colorIdx }
  const [next, setNext] = useState(randomPiece());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [intervalMs, setIntervalMs] = useState(450);

  const requestRef = useRef();
  const lastTick = useRef(Date.now());

  // Create empty board for Tetris
  function createEmptyBoard() {
    return Array.from({length: ROWS}, () => Array(COLS).fill(null));
  }

  // Get random TETROMINO with position and colorIndex
  function randomPiece() {
    const i = Math.floor(Math.random() * TETROMINOES.length);
    return {
      shape: clone(TETROMINOES[i].shape),
      x: Math.floor((COLS - TETROMINOES[i].shape[0].length) / 2),
      y: 0,
      colorIdx: TETROMINOES[i].colorIdx
    };
  }

  // Merge piece into board (does NOT mutate)
  function merge(board, piece) {
    const out = clone(board);
    piece.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const px = piece.x + dx;
          const py = piece.y + dy;
          if (py >= 0 && py < ROWS && px >= 0 && px < COLS) {
            out[py][px] = piece.colorIdx;
          }
        }
      });
    });
    return out;
  }

  // Check if piece collides at offset (dx, dy)
  function collides(board, piece, dx=0, dy=0, rotatedShape=null) {
    const shape = rotatedShape || piece.shape;
    for (let y=0; y<shape.length; ++y) {
      for (let x=0; x<shape[y].length; ++x) {
        if (!shape[y][x]) continue;
        let cx = piece.x + dx + x;
        let cy = piece.y + dy + y;
        if (cx < 0 || cx >= COLS || cy >= ROWS) return true; // wall/floor
        if (cy >= 0 && board[cy][cx] !== null) return true; // something there
      }
    }
    return false;
  }

  // Rotate shape (clockwise)
  function rotate(shape) {
    const N = shape.length;
    let out = Array.from({length: N}, () => Array(N).fill(0));
    for (let y = 0; y < N; ++y)
      for (let x = 0; x < N; ++x)
        out[x][N-1-y] = shape[y][x];
    return out;
  }

  // Drop piece by +1, or stick and summon next
  function tick() {
    if (!active || gameOver || paused) return;
    if (!collides(board, active, 0, 1)) {
      setActive(a => ({ ...a, y: a.y+1 }));
    } else {
      // "Stick" piece to board, lock and check gameover
      const merged = merge(board, active);
      // Line clear
      let cleared = 0;
      let newBoard = merged.filter(row => {
        if (row.every(cell => cell !== null)) {
          cleared++;
          return false;
        }
        return true;
      });
      for (let i = newBoard.length; i < ROWS; ++i)
        newBoard.unshift(Array(COLS).fill(null));
      setBoard(newBoard);

      // Scoring: 100 pts per line (basic)
      if (cleared > 0) {
        setScore(s => s + [0, 100, 300, 500, 800][cleared]);
        setLines(l => l + cleared);
        // Increase speed every 8 lines
        if ((lines + cleared) % 8 === 0 && intervalMs > 120)
          setIntervalMs(ms => Math.max(ms - 40, 80));
      }

      // New piece or game over
      const spawn = { ...next, y: 0, x: Math.floor((COLS - next.shape[0].length) / 2) };
      if (collides(newBoard, spawn, 0, 0)) {
        setGameOver(true);
      } else {
        setActive(spawn);
        setNext(randomPiece());
      }
    }
  }

  // Per-frame requestAnimationFrame main loop
  useEffect(() => {
    if (!active || gameOver || paused) return;
    function animate() {
      const now = Date.now();
      if (now - lastTick.current > intervalMs) {
        tick();
        lastTick.current = now;
      }
      requestRef.current = requestAnimationFrame(animate);
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line
  }, [active, gameOver, paused, intervalMs]);

  // Start game or new game
  function startGame() {
    setBoard(createEmptyBoard());
    setActive(randomPiece());
    setNext(randomPiece());
    setScore(0);
    setLines(0);
    setGameOver(false);
    setPaused(false);
    setIntervalMs(450);
    lastTick.current = Date.now();
  }

  // On mount: start game
  useEffect(() => {
    startGame();
    // eslint-disable-next-line
  }, []);

  // Keyboard controls
  function handleKey(e) {
    if (gameOver) return;
    if (["Escape"].includes(e.key)) {
      setPaused(p => !p);
      return;
    }
    if (paused) return;
    if (!active) return;
    // Clone active for mutation
    let nextActive = { ...active };

    if (["ArrowDown", "s", "S"].includes(e.key)) {
      // Soft drop
      if (!collides(board, active, 0, 1)) setActive(a => ({ ...a, y: a.y + 1 }));
      else tick();
    } else if (["ArrowLeft", "a", "A"].includes(e.key)) {
      if (!collides(board, active, -1, 0)) setActive(a => ({ ...a, x: a.x - 1 }));
    } else if (["ArrowRight", "d", "D"].includes(e.key)) {
      if (!collides(board, active, 1, 0)) setActive(a => ({ ...a, x: a.x + 1 }));
    } else if (["ArrowUp", "w", "W", " "].includes(e.key)) {
      // Rotate (space, up, w)
      const rotated = rotate(active.shape);
      if (!collides(board, active, 0, 0, rotated))
        setActive(a => ({ ...a, shape: rotated }));
    } else if (e.key === "Shift") {
      // Hard drop: fast fall to bottom
      let y = active.y;
      while (!collides(board, { ...active, y: y + 1 })) y++;
      setActive(a => ({ ...a, y }));
      setTimeout(() => tick(), 20); // stick next frame
    }
  }

  // Keyboard event binding
  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line
  }, [active, gameOver, paused, board]); 

  // Render the main board, piece
  function renderBoard() {
    // Copy of board
    let grid = clone(board);
    // Show active
    if (active && !gameOver) {
      active.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell) {
            const px = active.x + dx;
            const py = active.y + dy;
            if (py >= 0 && py < ROWS && px >= 0 && px < COLS)
              grid[py][px] = active.colorIdx;
          }
        });
      });
    }

    return (
      <div
        className="arcade-tetris-grid"
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${ROWS}, ${BLOCK}px)`,
          gridTemplateColumns: `repeat(${COLS}, ${BLOCK}px)`,
          background: GRID_BG,
          border: `2.9px solid ${GRID_BORDER}`,
          boxShadow: SHADOW("#00FFCB"),
          borderRadius: 14,
          margin: "10px auto",
        }}>
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}|${x}`}
              aria-label={cell !== null ? "Block" : "Empty"}
              style={{
                width: BLOCK - 3,
                height: BLOCK - 3,
                margin: 1.5,
                background: cell !== null ? `linear-gradient(90deg, ${COLORS[cell]}, #fff0 99%)` : "#151526",
                border: cell !== null ? `2.4px solid ${COLORS[cell]}` : "2.2px solid #23224A",
                borderRadius: 6,
                boxShadow: cell !== null ? SHADOW(COLORS[cell]) : "none",
                opacity: cell !== null ? 0.94 : 1,
                transition: "background 0.10s, border 0.13s, box-shadow 0.09s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 17,
              }}
            >
              {/* cell !== null ? "█" : "" */}
            </div>
          ))
        )}
      </div>
    );
  }

  // Render next piece preview
  function renderNext() {
    if (!next) return null;
    return (
      <div
        style={{
          display: "inline-block",
          background: "#19103d77",
          padding: "14px 12px",
          borderRadius: 9,
          marginBottom: 12,
          boxShadow: `0 0 13px 3px #2DFF5A66`,
        }}>
        <div
          style={{
            fontFamily: "'Press Start 2P', VT323, monospace",
            fontWeight: 900,
            fontSize: 15,
            color: "#00FFCB",
            textShadow: `0 0 8px #2DFF5A`,
            marginBottom: 6,
            textAlign: "center"
          }}>
          Next Block
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${next.shape.length}, 22px)`,
            gridTemplateColumns: `repeat(${next.shape[0].length}, 22px)`,
            gap: 1
          }}>
          {next.shape.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}|${x}`}
                style={{
                  width: 21,
                  height: 21,
                  background: cell
                    ? `linear-gradient(133deg, ${COLORS[next.colorIdx]}, #fff2 120%)`
                    : "#23213f",
                  border: cell
                    ? `2px solid ${COLORS[next.colorIdx]}`
                    : "2px solid #18102a",
                  borderRadius: 4,
                  boxShadow: cell ? SHADOW(COLORS[next.colorIdx]) : "none",
                }}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  // Arcade win/lose overlay
  function EndOverlay() {
    return (
      <div
        style={{
          position: "absolute",
          top: 55,
          left: 0,
          width: "100%",
          height: `calc(${ROWS * BLOCK}px + 10px)`,
          background: "#0D0D0Dcc",
          zIndex: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          boxShadow: `0 0 44px 7px #F72585aa, 0 0 18px 3px #00FFCBcc`,
          fontFamily: "'Press Start 2P', VT323, monospace",
        }}>
        <div
          style={{
            fontSize: 32,
            color: "#F72585",
            textShadow: `0 0 18px #F72585, 0 0 7px #FFE35Bbb`,
            letterSpacing: ".09em",
            marginBottom: 14,
            fontWeight: 900,
          }}>
          GAME OVER
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#00FFCB",
            fontWeight: 800,
            textShadow: "0 0 8px #00FFCB99",
            marginBottom: 8
          }}>
          Score: <span style={{ color: "#FFF", textShadow: "0 0 5px #F7C948" }}>{score}</span>
        </div>
        <div style={{
          color: "#F7C948",
          fontSize: 17,
          marginBottom: 18
        }}>
          Lines: {lines}
        </div>
        <button
          className="mm-cta-btn"
          style={{
            background: "linear-gradient(97deg, #2DFF5A 7%, #00FFCB 90%)",
            color: "#0D0D0D",
            fontWeight: 900,
            fontSize: 16,
            borderRadius: 7,
            border: "2.5px solid #2DFF5A",
            padding: "7px 25px",
            cursor: "pointer",
            outline: "none"
          }}
          onClick={startGame}
        >
          Play Again
        </button>
      </div>
    );
  }

  // Responsive font/board
  const width = COLS * BLOCK + 20;
  const height = ROWS * BLOCK + 20;

  return (
    <div
      className="arcade-tetris-bg"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: `radial-gradient(ellipse at 58% 4%, #2d2d72 0, #19103d 82%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 54,
        fontFamily: "'Press Start 2P', VT323, monospace"
      }}
      tabIndex={0}
      aria-label="Block Game (Tetris)"
    >
      <h1
        style={{
          fontFamily: "'Press Start 2P', VT323, monospace",
          fontSize: 35,
          color: "#00FFCB",
          letterSpacing: "0.07em",
          textShadow: "0 0 14px #00FFCB, 0 0 11px #2DFF5A",
          marginBottom: 13
        }}
      >
        <span role="img" aria-label="blocks">🟦</span> Block Game
      </h1>
      <div
        style={{
          fontFamily: "'VT323', monospace",
          color: "#F7C948",
          marginBottom: 20,
          fontSize: 21,
          textShadow: "0 0 6px #F7C948",
        }}>
        Use ← ↓ → arrows (A/S/D), ↑/W/Space to rotate, Shift to hard drop. ESC to pause.
      </div>
      {/* Score/next panel */}
      <div style={{
        display: "flex",
        gap: 28,
        alignItems: "flex-start",
        marginBottom: 11,
        flexWrap: "wrap"
      }}>
        {/* Score */}
        <div style={{
          background: "#19103d77",
          padding: "14px 16px",
          borderRadius: 9,
          minWidth: 86,
          fontSize: 16,
          color: "#F72585",
          fontWeight: 900,
          textShadow: "0 0 8px #F72585",
          boxShadow: "0 0 10px 2px #F7C94855",
          textAlign: "center"
        }}>
          Score<br /><span style={{ color: "#fffbe6", fontSize: 23 }}>{score}</span>
        </div>
        {/* Next piece preview */}
        {renderNext()}
        {/* Lines */}
        <div style={{
          background: "#19103d77",
          padding: "14px 16px",
          borderRadius: 9,
          minWidth: 86,
          fontSize: 16,
          color: "#2DFF5A",
          fontWeight: 900,
          textShadow: "0 0 8px #2DFF5A",
          boxShadow: "0 0 10px 2px #00FFCB99",
          textAlign: "center"
        }}>
          Lines<br /><span style={{ color: "#fffbe6", fontSize: 23 }}>{lines}</span>
        </div>
      </div>
      {/* Main game area */}
      <div
        style={{
          position: "relative",
          width,
          height,
          minWidth: width, minHeight: height,
          marginBottom: 20
        }}>
        {renderBoard()}
        {gameOver && <EndOverlay />}
        {paused && !gameOver &&
          <div style={{
            position: "absolute", top: 55, left: 0, width: "100%",
            height: `calc(${ROWS * BLOCK}px + 10px)`,
            background: "#27154dcc", zIndex: 12,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            borderRadius: 14,
            boxShadow: `0 0 24px 5px #F7C948aa, 0 0 8px 2px #00FFCB99`,
            fontFamily: "'Press Start 2P', VT323, monospace",
          }}>
            <div style={{
              fontSize: 27, color: "#F7C948",
              textShadow: "0 0 14px #F7C948bb, 0 0 11px #00FFCBbb",
              marginBottom: 12, fontWeight: 900
            }}>Paused</div>
            <button
              className="mm-cta-btn"
              style={{
                background: "linear-gradient(97deg, #FFE35B 7%, #00FFCB 90%)",
                color: "#0D0D0D", fontWeight: 900,
                fontSize: 16, borderRadius: 7,
                border: "2.5px solid #FFE35B", padding: "7px 25px",
                cursor: "pointer", outline: "none"
              }}
              onClick={() => setPaused(false)}>
              Resume
            </button>
          </div>
        }
      </div>
      <button
        className="mm-cta-btn"
        style={{
          fontSize: 14,
          background: "linear-gradient(90deg, #F7C948, #00FFCB)",
          color: "#0A0A0A",
          padding: "8px 21px",
          borderRadius: 7,
          border: "2.2px solid #00FFCB",
          textDecoration: "none",
          marginTop: 14,
          fontFamily: "'Press Start 2P', VT323, monospace",
          fontWeight: 900
        }}
        onClick={() => window.location.href = "/#games"}>
        ← Back to Arcade
      </button>
      {/* Arcade-style custom styles for neons */}
      <style>{`
        .arcade-tetris-bg, .arcade-tetris-grid button, .mm-cta-btn {
          font-family: 'Press Start 2P', 'VT323', 'Orbitron', monospace !important;
          font-weight: 900;
        }
        .arcade-tetris-grid {
          user-select: none;
        }
        @media (max-width: 600px) {
          .arcade-tetris-grid {
            margin: 0 auto !important;
            zoom: 0.84;
          }
        }
      `}</style>
    </div>
  );
}

export default BlockGame;
