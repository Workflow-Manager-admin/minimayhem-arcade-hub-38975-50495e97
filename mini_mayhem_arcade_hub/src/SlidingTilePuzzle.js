import React, { useState, useEffect, useRef } from "react";

/**
 * SlidingTilePuzzle - Arcade style 15-puzzle game
 * Arcade neon grid, shuffle, move, move count, win detection.
 * Route: /sliding-puzzle
 */

// Arcade color constants
const ARCADE_PALETTE = {
  bg: "#18102a",
  board: "#0D0D0D",
  neon: "#00FFCB",
  accent: "#F7C948",
  border: "#2D2D72",
  empty: "#1C1C1C",
  tileShadow: "#00FFCBbb",
  numText: "#fffbe6",
  win: "#2DFF5A",
  lose: "#F72585"
};

const BOARD_SIZE = 4;
const TILE_COUNT = BOARD_SIZE * BOARD_SIZE;

function generateSolvedTiles() {
  let arr = [];
  for (let i = 1; i < TILE_COUNT; ++i) arr.push(i);
  arr.push(null); // last empty
  return arr;
}

// PUBLIC_INTERFACE
function SlidingTilePuzzle() {
  // State: tiles, move count, win, timer
  const [tiles, setTiles] = useState(generateSolvedTiles());
  const [moveCount, setMoveCount] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const timerRef = useRef(null);

  // Effect: timer
  useEffect(() => {
    if (timerActive && !won) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, won]);

  // Shuffle logic (guaranteed solvable by random valid moves)
  function shuffleBoard(moves = 65) {
    setIsShuffling(true);
    let current = [...generateSolvedTiles()];
    let emptyIdx = TILE_COUNT - 1;

    for (let i = 0; i < moves; ++i) {
      const moves = getMovableNeighborIndexes(emptyIdx);
      const swapWith = moves[Math.floor(Math.random() * moves.length)];
      [current[emptyIdx], current[swapWith]] = [current[swapWith], current[emptyIdx]];
      emptyIdx = swapWith;
    }
    setTiles(current);
    setMoveCount(0);
    setWon(false);
    setTime(0);
    setTimerActive(false);
    setTimeout(() => setIsShuffling(false), 221);
  }

  // On mount: shuffle
  useEffect(() => {
    shuffleBoard();
    // eslint-disable-next-line
  }, []);

  // Movement logic
  function getMovableNeighborIndexes(idx) {
    const row = Math.floor(idx / BOARD_SIZE);
    const col = idx % BOARD_SIZE;
    let neighbors = [];
    if (row > 0) neighbors.push(idx - BOARD_SIZE);
    if (row < BOARD_SIZE - 1) neighbors.push(idx + BOARD_SIZE);
    if (col > 0) neighbors.push(idx - 1);
    if (col < BOARD_SIZE - 1) neighbors.push(idx + 1);
    return neighbors;
  }

  // Click handler
  function handleTileClick(i) {
    if (won || isShuffling) return;
    const emptyIdx = tiles.indexOf(null);
    if (getMovableNeighborIndexes(emptyIdx).includes(i)) {
      // move tile
      let nextTiles = [...tiles];
      [nextTiles[emptyIdx], nextTiles[i]] = [nextTiles[i], nextTiles[emptyIdx]];
      setTiles(nextTiles);
      setMoveCount(c => c + 1);
      if (!timerActive && moveCount === 0) setTimerActive(true);
      if (isSolved(nextTiles)) {
        setWon(true);
        setTimerActive(false);
      }
    }
  }

  // Arrow key support
  function handleKeyDown(e) {
    if (won || isShuffling) return;
    const emptyIdx = tiles.indexOf(null);
    let target = null;
    if (["ArrowUp", "w"].includes(e.key)) target = emptyIdx + BOARD_SIZE;
    else if (["ArrowDown", "s"].includes(e.key)) target = emptyIdx - BOARD_SIZE;
    else if (["ArrowLeft", "a"].includes(e.key)) target = emptyIdx + 1;
    else if (["ArrowRight", "d"].includes(e.key)) target = emptyIdx - 1;
    if (target !== null && target >= 0 && target < TILE_COUNT) {
      if (getMovableNeighborIndexes(emptyIdx).includes(target)) {
        handleTileClick(target);
      }
    }
  }

  // Check solved
  function isSolved(arr) {
    for (let i = 0; i < TILE_COUNT - 1; ++i) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[TILE_COUNT - 1] === null;
  }

  // Win sparkles (basic)
  function WinBanner() {
    return (
      <div
        style={{
          padding: "16px 23px",
          borderRadius: 15,
          marginTop: 16,
          background: `linear-gradient(90deg, #00FFCB44 60%, #2DFF5A 105%)`,
          color: ARCADE_PALETTE.win,
          fontFamily: "'Press Start 2P', VT323, monospace",
          fontWeight: 900,
          fontSize: "1.08rem",
          textShadow: `0 0 11px #2dff5ad4, 0 0 7px #F7C948`,
          boxShadow: "0 0 29px 4px #2DFF5A44",
        }}
      >
        🎉 Puzzle Solved in {moveCount} moves <br />
        <span style={{ color: ARCADE_PALETTE.accent }}>Time: {time}s</span>
        <div style={{ marginTop: 6, fontSize: 15, color: "#00FFCB" }}>Amazing work!</div>
      </div>
    );
  }

  // Return JSX
  return (
    <div
      className="arcade-puzzle-bg"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "radial-gradient(ellipse at 58% 4%, #2d2d72 0, #0d0d27 74%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 44,
        boxSizing: "border-box",
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Sliding Tile Puzzle Game"
    >
      <h1
        style={{
          fontFamily: "'Press Start 2P', VT323, monospace",
          fontSize: 34,
          color: ARCADE_PALETTE.neon,
          marginBottom: 17,
          letterSpacing: ".06em",
          textShadow: `0 0 11px ${ARCADE_PALETTE.neon}, 0 0 7px ${ARCADE_PALETTE.accent}`
        }}
      >
        <span role="img" aria-label="tiles">🔢</span> Sliding Tile Puzzle
      </h1>
      <div
        style={{
          fontFamily: "'VT323', monospace",
          color: ARCADE_PALETTE.accent,
          marginBottom: 22,
          fontSize: 20,
          textShadow: `0 0 4px ${ARCADE_PALETTE.accent}`,
        }}
      >
        Slide tiles to arrange numbers in order. Beat the puzzle!
      </div>
      <div
        style={{
          padding: 17,
          background: "linear-gradient(91deg, #18102A 90%, #0D0D0D 180%)",
          borderRadius: 18,
          boxShadow: `0 0 18px 7px ${ARCADE_PALETTE.border}44, 0 0 5px 1px #00ffcb22`,
          marginBottom: 22,
        }}
      >
        {/* PUZZLE GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 54px)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 54px)`,
            gap: 7,
            borderRadius: 15,
            border: `2.7px solid ${ARCADE_PALETTE.neon}`,
            background: ARCADE_PALETTE.bg,
            boxShadow: `0 0 13px 3px ${ARCADE_PALETTE.neon}`,
            marginBottom: 12,
          }}
        >
          {tiles.map((val, idx) => (
            <button
              key={idx}
              className="tile-btn"
              onClick={() => handleTileClick(idx)}
              disabled={val === null || won || isShuffling}
              aria-label={val ? "Tile " + val : "Empty space"}
              tabIndex={val ? 0 : -1}
              style={{
                width: 54,
                height: 54,
                borderRadius: 11,
                border: val
                  ? `3px solid ${ARCADE_PALETTE.tileShadow}`
                  : `2.5px dashed ${ARCADE_PALETTE.accent}`,
                margin: 0,
                outline: "none",
                boxShadow: val
                  ? `0 0 12px 3px ${ARCADE_PALETTE.tileShadow}`
                  : "none",
                fontSize: 22,
                background: val
                  ? `linear-gradient(133deg, #23224a 60%, #33fff822 120%)`
                  : ARCADE_PALETTE.empty,
                color: ARCADE_PALETTE.numText,
                fontFamily: "'Press Start 2P', VT323, monospace",
                fontWeight: 700,
                transition: "background 0.15s, box-shadow 0.13s, border 0.13s",
                userSelect: "none",
                cursor: val ? "pointer" : "default",
                position: "relative"
              }}
            >
              {val || ""}
            </button>
          ))}
        </div>
        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: 21,
            alignItems: "center",
            margin: "15px 0 0 0",
            flexWrap: "wrap"
          }}
        >
          <button
            onClick={() => shuffleBoard()}
            disabled={isShuffling}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              background: `linear-gradient(90deg, #00FFCB 60%, #2D2D72 120%)`,
              color: "#0D0D0D",
              border: "2.5px solid #00FFCB",
              borderRadius: 9,
              fontWeight: 900,
              fontSize: 15,
              padding: "6px 14px",
              boxShadow: `0 0 10px 2px #00FFCB99, 0 0 7px 1px #F7C94822`,
              cursor: "pointer",
              marginRight: 7,
              opacity: isShuffling ? 0.64 : 1,
              transition: "opacity 0.13s"
            }}
          >{isShuffling ? "Shuffling..." : "⟳ Shuffle"}</button>
          <span style={{
            color: ARCADE_PALETTE.neon,
            fontFamily: "'VT323', monospace",
            fontSize: 17,
            letterSpacing: ".04em",
            padding: "2px 8px",
            borderRadius: 6,
            border: `1.7px solid #00FFCB55`
          }}>
            Moves: {moveCount}
          </span>
          <span style={{
            color: ARCADE_PALETTE.accent,
            fontFamily: "'VT323', monospace",
            fontSize: 17,
            letterSpacing: ".04em"
          }}>
            Time: {time}s
          </span>
        </div>
        {won && <WinBanner />}
      </div>
      <a
        href="/#games"
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
      >
        ← Back to Arcade
      </a>
    </div>
  );
}

export default SlidingTilePuzzle;
