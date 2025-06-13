import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";

/*
BlockGame (Block Fit Puzzle) - Neon Arcade Edition
- 10x10 grid, snap-to-cell drag/drop blocks (L, T, square, line, etc.)
- 3 random block pieces at a time (must use all before 3 new)
- Neon fonts/colors, dark neon arcade design matching /theme
- Gray/low opacity for blocks that are unusable, clear hover cues
- Clear row or column: animated pop/burst and scoring (+bonus)
- LocalStorage high score: "block-game-highscore"
- Neon Arcade Buttons: Restart, Back
- Game-over modal: final score, high score, actions
*/

/** --- BLOCK SHAPES --- **/
const SHAPES = [
  // Each: { name, layout (array of arrays), color }
  { name: "Dot", layout: [[1]], color: "#F72585" },
  { name: "2-H", layout: [[1,1]], color: "#4CC9F0" },
  { name: "2-V", layout: [[1],[1]], color: "#3A0CA3" },
  { name: "3-H", layout: [[1,1,1]], color: "#FFB703" },
  { name: "3-V", layout: [[1],[1],[1]], color: "#43E660" },
  { name: "2x2", layout: [[1,1],[1,1]], color: "#B5179E" },
  { name: "L", layout: [[1,0],[1,0],[1,1]], color: "#7209B7" },
  { name: "L-Flip", layout: [[0,1],[0,1],[1,1]], color: "#560BAD" },
  { name: "T", layout: [[1,1,1],[0,1,0]], color: "#4361EE" },
  { name: "S", layout: [[0,1,1],[1,1,0]], color: "#FBA504" },
  { name: "Z", layout: [[1,1,0],[0,1,1]], color: "#FA2E4E" },
  { name: "4-V", layout: [[1],[1],[1],[1]], color: "#80FF45" },
  { name: "4-H", layout: [[1,1,1,1]], color: "#08D9D6" },
  { name: "5-H", layout: [[1,1,1,1,1]], color: "#C81912" },
  { name: "5-V", layout: [[1],[1],[1],[1],[1]], color: "#FFFF00" },
];

/** Neon shadow generator (arcade effect) */
function neonShadow(color, layers=2) {
  return Array.from({ length: layers }).map((_,i) => `0 0 ${4+i*4}px ${color}`).join(",");
}

/** --- UTILS --- **/

function getRandomShape() {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

function canPlaceBlock(board, shape, row, col) {
  for (let r=0; r<shape.length; r++)
    for (let c=0; c<shape[0].length; c++)
      if (shape[r][c])
        if (row+r>=10 || col+c>=10 || board[row+r][col+c] !== null)
          return false;
  return true;
}

function placeBlock(board, shape, row, col, color) {
  const newBoard = board.map(r => r.slice());
  for (let r=0; r<shape.length; r++)
    for (let c=0; c<shape[0].length; c++)
      if (shape[r][c]) newBoard[row+r][col+c] = color;
  return newBoard;
}

function canAnyBlockBePlaced(board, blocks) {
  for (const shapeObj of blocks)
    if(shapeObj)
      for (let r=0; r<=10-shapeObj.layout.length; r++)
        for (let c=0; c<=10-shapeObj.layout[0].length; c++)
          if (canPlaceBlock(board, shapeObj.layout, r, c))
            return true;
  return false;
}

function getClearedLines(board) {
  let rows=[], cols=[];
  for (let r=0; r<10; r++) if (board[r].every(cell=>cell)) rows.push(r);
  for (let c=0; c<10; c++) if ([...Array(10)].every((_,r)=>board[r][c])) cols.push(c);
  return { rows, cols };
}

/** --- MAIN COMPONENT --- **/
// PUBLIC_INTERFACE
function BlockGame() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // --- STATE ---
  const [board, setBoard] = useState(() => Array.from({length:10},() => Array(10).fill(null)));
  const [activeBlocks, setActiveBlocks] = useState(() => Array.from({length:3},getRandomShape));
  const [dragIdx, setDragIdx] = useState(null);
  const [dragPos, setDragPos] = useState(null);
  const [dragBlockOrigin, setDragBlockOrigin] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("block-game-highscore")||"0",10));
  const [showGameOver, setShowGameOver] = useState(false);

  // Row/col clearing animation
  const [clearRows, setClearRows] = useState([]), [clearCols, setClearCols] = useState([]), [clearing,setClearing]=useState(false);

  // Responsiveness
  const boardRef = useRef();
  const [cellSize, setCellSize] = useState(38);

  // Touch/mobile tap
  const [selecting, setSelecting] = useState(null);

  // --- EFFECTS ---
  useEffect(() => {
    function handleResize() {
      if (!boardRef.current) return;
      const candidate = Math.min(
        boardRef.current.parentElement.offsetWidth * 0.97,
        window.innerWidth-32, 440
      );
      setCellSize(Math.max(21, Math.floor(candidate/10)));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  },[]);
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("block-game-highscore",score);
    }
  },[score,highScore]);

  // Check game over
  useEffect(() => {
    if (!showGameOver && !canAnyBlockBePlaced(board, activeBlocks.filter(Boolean)))
      setTimeout(() => setShowGameOver(true), clearing ? 900 : 250);
  },[board,activeBlocks,clearing,showGameOver]);

  // --- GAME ACTIONS ---

  function handleCellDrop(row, col) {
    if (dragIdx == null) return;
    const block = activeBlocks[dragIdx];
    if (!block) return;
    if (canPlaceBlock(board, block.layout, row, col)) {
      const newBoard = placeBlock(board, block.layout, row, col, block.color);
      // Clear lines if needed
      const { rows, cols } = getClearedLines(newBoard);
      if (rows.length||cols.length) {
        setClearing(true); setClearRows(rows); setClearCols(cols);
        setTimeout(() => {
          let cleared = newBoard.map(r => r.slice());
          for(let r of rows) cleared[r] = Array(10).fill(null);
          for(let c of cols)for(let r=0;r<10;r++)cleared[r][c]=null;
          setBoard(cleared);
          setClearing(false); setClearRows([]); setClearCols([]);
        },560);
      } else setBoard(newBoard);

      let newBlocks = [...activeBlocks]; newBlocks[dragIdx]=null;
      if (newBlocks.every(b=>b==null)) newBlocks=Array.from({length:3},getRandomShape);
      setActiveBlocks(newBlocks);
      setDragIdx(null); setDragPos(null); setDragBlockOrigin(null);

      let linesCleared = rows.length+cols.length;
      setScore(s=>s + block.layout.flat().filter(Boolean).length + linesCleared*10);
    }
  }

  // Drag-and-drop logic
  function handleDragStart(idx, e) {
    e.preventDefault();
    setDragIdx(idx);
    setDragBlockOrigin({x:e.clientX, y:e.clientY});
    setDragPos({x:e.clientX, y:e.clientY});
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.body.style.userSelect = "none";
  }
  function handleDragMove(e) { setDragPos({x:e.clientX, y:e.clientY}); }
  function handleDragEnd(e) {
    if (dragIdx==null) return;
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    let row = Math.floor((e.clientY - rect.top) / cellSize);
    let col = Math.floor((e.clientX - rect.left) / cellSize);
    const block = activeBlocks[dragIdx];
    if (block&&row>=0&&col>=0 &&row+block.layout.length<=10&&col+block.layout[0].length<=10)
      if (canPlaceBlock(board,block.layout,row,col)) handleCellDrop(row,col);
    setDragIdx(null); setDragPos(null); setDragBlockOrigin(null);
    document.removeEventListener("mousemove",handleDragMove);
    document.removeEventListener("mouseup",handleDragEnd);
    document.body.style.userSelect = "";
  }

  // Tap UI for mobile
  function handleBlockTap(idx) {
    if (dragIdx!=null) return;
    setSelecting(idx);
  }
  function handleCellTap(row,col) {
    if (selecting==null) return;
    const block = activeBlocks[selecting];
    if (block && canPlaceBlock(board, block.layout, row, col)) handleCellDrop(row,col);
    setSelecting(null);
  }

  function handleRestart() {
    setBoard(Array.from({length:10},()=>Array(10).fill(null)));
    setScore(0);
    setActiveBlocks(Array.from({length:3},getRandomShape));
    setShowGameOver(false);
    setSelecting(null);
  }
  function handleBack() {
    navigate("/games");
  }

  // --- COMPONENTS ---
  function BoardGrid() {
    return (
      <div
        className="blockgame-board"
        ref={boardRef}
        tabIndex={0}
        aria-label="Block puzzle board"
        style={{
          position: "relative",
          margin: "0 auto",
          width: cellSize*10,
          height: cellSize*10,
          background: darkMode
            ? "repeating-linear-gradient(135deg, #16041E 99%, #2c146a 110%)"
            : "repeating-linear-gradient(135deg, #fff 80%, #AAC8FF 102%)",
          borderRadius: 16,
          border: `3.3px solid ${darkMode ? "#F72585":"#3A0CA3"}`,
          boxShadow: [
            neonShadow(darkMode ? "#4CC9F0" : "#F72585",4),
            "0 0 29px 7px #fff3"
          ].join(","),
          overflow:"hidden",
          outline: "none",
        }}>
        {board.map((rowArr, r) =>
          rowArr.map((cell, c) => {
            let isClearing = clearing && (clearRows.includes(r)||clearCols.includes(c));
            // Hover highlight if valid cell
            let cellHoverStyle = {};
            if (dragIdx != null && !cell && activeBlocks[dragIdx]) {
              // On drag: Snap-to-cell highlight for valid target
              if (canPlaceBlock(board, activeBlocks[dragIdx].layout, r, c))
                cellHoverStyle = { outline: `3px solid ${activeBlocks[dragIdx].color}88`, boxShadow: neonShadow(activeBlocks[dragIdx].color,2)};
            } else if (selecting != null && !cell && activeBlocks[selecting]) {
              // Tap: highlight legal drop cells
              if (canPlaceBlock(board, activeBlocks[selecting].layout, r, c))
                cellHoverStyle = { outline: `3px solid ${activeBlocks[selecting].color}55`, boxShadow: neonShadow(activeBlocks[selecting].color,2) };
            }
            return (
              <div
                key={`${r}-${c}`}
                className={`block-cell${cell?" filled":""}${isClearing?" clearing":""}`}
                style={{
                  position:"absolute",
                  left: c*cellSize, top: r*cellSize,
                  width: cellSize-2.5, height: cellSize-2.5,
                  background: cell?cell:(darkMode?"#18102A":"#fffbe9"),
                  border: `1.2px solid ${
                    cell ? "#232335":
                    darkMode?"#312040":"#ABCAFD"
                  }`,
                  borderRadius: 6,
                  boxShadow: cell?neonShadow(cell,2):undefined,
                  transition:
                    isClearing&&cell
                      ? "background 0.5s, box-shadow 0.29s, opacity 0.41s"
                      : "background 0.17s, box-shadow 0.15s",
                  opacity: (isClearing&&cell)?0.65:1,
                  animation:
                    isClearing&&cell
                      ? "blockgame-pop-clear 0.56s cubic-bezier(.82,-0.14,1,1.06)"
                      : undefined,
                  zIndex: isClearing?4:1,
                  cursor: (selecting!=null&&canPlaceBlock(
                      board,
                      activeBlocks[selecting]?.layout,
                      r,c
                    ))?"pointer":(dragIdx!=null?"default":"auto"),
                  ...cellHoverStyle
                }}
                onClick={() => handleCellTap(r,c)}
                tabIndex={-1}
              />
            );
          })
        )}
        {/* Drag preview */}
        {dragIdx!=null && dragPos && (
          <BlockPreviewDrag
            shape={activeBlocks[dragIdx]}
            mouseX={dragPos.x}
            mouseY={dragPos.y}
            cellSize={cellSize}
            origin={dragBlockOrigin}
            offsetRect={boardRef.current?.getBoundingClientRect()}
          />
        )}
      </div>
    );
  }

  function BlockPreviewDrag({ shape, mouseX, mouseY, cellSize, origin, offsetRect }) {
    if (!offsetRect) return null;
    let shapeW = shape.layout[0].length * cellSize,
        shapeH = shape.layout.length * cellSize;
    let x = mouseX - (origin?.x??mouseX) + window.scrollX;
    let y = mouseY - (origin?.y??mouseY) + window.scrollY;
    x += (cellSize*shape.layout[0].length)/2-cellSize/2;
    y += (cellSize*shape.layout.length)/2-cellSize/2;
    return (
      <div style={{
        pointerEvents:"none",position:"fixed",
        left:x-shapeW/2,top:y-shapeH/2,
        zIndex:1000, opacity:0.82,
        filter:"blur(0.2px) brightness(1.08) drop-shadow(0 2px 14px #fff7)",
      }}>
        <BlockShape shape={shape.layout} color={shape.color} cellSize={cellSize} neon blur />
      </div>
    );
  }

  function BlockShape({ shape, color, cellSize, neon, blur }) {
    return (<div style={{display:"inline-block",position:"relative"}}>
      {shape.map((row,r)=>
        row.map((v,c)=>
          v&&(<div
            key={r+"-"+c}
            style={{
              position:"absolute",
              left:c*(cellSize??25),top:r*(cellSize??25),
              width:(cellSize??25)-2,height:(cellSize??25)-2,
              background: color,
              boxShadow: neon ? neonShadow(color,3) : "none",
              filter: blur ? "blur(0.5px)" : "none",
              border:"2.4px solid #28282862",
              borderRadius:6,
              zIndex:3,
            }}
          />)
        )
      )}
    </div>);
  }

  function ActiveBlocks() {
    return (
      <div className="blockgame-hand"
        style={{
          display:"flex",gap:cellSize>26?36:19,margin:"0 auto",
          justifyContent:"center",alignItems:"flex-end",marginTop:23,flexWrap:"wrap"
        }}>
        {activeBlocks.map((block, idx) => {
          if (!block)
            return <div key={idx}
              style={{
                width:(cellSize+2)*3,height:(cellSize+2)*3,
                borderRadius:10,background:"none"}} />;
          const canPlay = canAnyBlockBePlaced(board,[block]);
          return (
            <div
              className="blockgame-block"
              key={idx}
              tabIndex={0}
              aria-label={`Drag to place block ${idx+1}`}
              role="button"
              style={{
                outline: canPlay
                  ? (selecting === idx ? `3.7px solid ${block.color}` : "none")
                  : "2.5px dashed #A9A9A9",
                background: selecting === idx
                  ? "#fff8"
                  : canPlay
                    ? `linear-gradient(134deg, #18102A 70%, ${block.color}33 120%)`
                    : "#f6f7fa33",
                boxShadow:
                  canPlay && selecting === idx
                    ? neonShadow(block.color,6)
                    : canPlay
                    ? neonShadow(block.color,2)
                    : "none",
                opacity: canPlay ? 1:0.44,
                cursor: canPlay ? "grab":"not-allowed",
                marginBottom:0,
                minWidth:cellSize*block.layout[0].length+2,
                minHeight:cellSize*block.layout.length+2,
                padding: cellSize<30?"3px":"10px",
                display:"inline-flex",flexDirection:"column",
                alignItems:"center",justifyContent:"center",
                borderRadius:13,
                transition:"box-shadow 0.18s, background 0.26s, outline 0.18s",
              }}
              onMouseDown={ canPlay ? (e)=>handleDragStart(idx,e):undefined }
              onClick={ canPlay ? ()=>handleBlockTap(idx):undefined }
              onKeyDown={e => {
                if ((e.key==="Enter"||e.key===" ")&&canPlay) handleBlockTap(idx);
              }}
            >
              <BlockShape
                shape={block.layout} color={block.color}
                cellSize={cellSize} neon />
            </div>
          );
        })}
      </div>
    );
  }

  function ScoreBar() {
    return (
      <div
        className="blockgame-scorebar"
        style={{
          width:"100%",maxWidth:boardRef.current?.offsetWidth??410,margin:"0 auto 7px auto",
          display:"flex",justifyContent:"space-between",alignItems:"center",
          fontFamily: "'VT323', 'Orbitron', monospace",
          fontSize: cellSize<34?17:23, letterSpacing:".07em",
          color: darkMode?"#F72585":"#3A0CA3",
          textShadow: neonShadow(darkMode?"#FFB703":"#4CC9F0",2),
          padding: "7px 6px 1.5px 7px", borderRadius:7
        }}
      >
        <span>
          Score: <span style={{
            color: darkMode?"#4CC9F0":"#F72585",
            textShadow: neonShadow(darkMode?"#4CC9F0":"#F72585"),
            fontWeight: "bolder",
          }}>{score}</span>
        </span>
        <span>
          High: <span style={{
            color: darkMode?"#FFB703":"#3A0CA3",
            fontWeight:900,
            textShadow: neonShadow(darkMode?"#FFB703":"#3A0CA3"),
          }}>{highScore}</span>
        </span>
      </div>
    );
  }

  function GameOverModal() {
    return (
      <div
        className="blockgame-modal-backdrop"
        style={{
          position: "fixed",inset:0,
          background:"radial-gradient(ellipse at 70% 44%, #2F063A 30%, #000E3D 130%)",
          backgroundBlendMode:"luminosity",zIndex:3265,display:"flex",alignItems:"center",justifyContent:"center"
        }}
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="blockgame-modal"
          style={{
            background:darkMode?"linear-gradient(130deg, #110D21 75%, #340435 170%)"
              :"linear-gradient(125deg, #fff 60%, #F7258522 120%)",
            border: `4px solid ${darkMode?"#F72585":"#3A0CA3"}`,
            borderRadius: 17, boxShadow: neonShadow(darkMode?"#FFB703":"#4CC9F0",5),
            padding:"37px 0 31px 0", color: "#fff",
            fontFamily:"'Press Start 2P', 'VT323', monospace",
            minWidth:320, maxWidth:"93vw", textAlign:"center", position:"relative", zIndex:3270,
          }}
        >
          <div style={{
            fontSize:45, color:"#F72585",textShadow:neonShadow("#F72585",6),
            marginBottom:7,lineHeight:"1.1"
          }}>
            GAME<br/>OVER
          </div>
          <div style={{
            fontFamily:"'VT323', 'Orbitron', monospace",
            fontSize:22, color:"#FFB703",textShadow:neonShadow("#FFB703",2),
            marginBottom:15,lineHeight:1.3,
          }}>
            Score: <span style={{
              color:"#4CC9F0",fontWeight:700,textShadow:neonShadow("#4CC9F0"),
            }}>{score}</span>
          </div>
          <div style={{
            fontFamily:"'Orbitron', 'VT323', monospace",color: "#FFB703",
            fontSize: 17.5, marginBottom:27, letterSpacing:".03em"
          }}>
            High Score: <span style={{
              color: score >= highScore ? "#08F735" : "#4CC9F0",
              textShadow: neonShadow(score>=highScore?"#69FF8D":"#4CC9F0",2),
              fontWeight:800
            }}>
              {Math.max(highScore,score)}
            </span>
          </div>
          <button className="blockgame-btn"
            style={{
              fontFamily:"'Press Start 2P', 'VT323', monospace",
              fontSize:18, color:"#4CC9F0",background:darkMode?"#0c0533":"#ebeaff",
              border:"2.7px solid #F72585",boxShadow:neonShadow("#F72585",2),
              borderRadius:9,padding:"11px 32px",margin:"0 17px 0 0",letterSpacing:"0.06em",
              textShadow:neonShadow("#4CC9F0",2),outline:"none",cursor:"pointer",
              textTransform:"uppercase",marginBottom:11,marginTop:7,transition:"background 0.14s, box-shadow 0.19s",
            }}
            onClick={handleRestart}
            autoFocus
          >
            Restart
          </button>
          <button className="blockgame-btn"
            style={{
              fontFamily:"'Press Start 2P', 'VT323', monospace",
              fontSize:18, color:"#FFB703",background:darkMode?"#18102A":"#fffbe4",
              border:"2.7px solid #3A0CA3",boxShadow:neonShadow("#3A0CA3",2),
              borderRadius:9,padding:"11px 32px",margin:0,letterSpacing:"0.06em",
              textShadow:neonShadow("#FFB703",2),outline:"none",cursor:"pointer",
              textTransform:"uppercase",marginBottom:11,marginTop:7,transition:"background 0.14s, box-shadow 0.19s",
            }}
            onClick={handleBack}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // --- FINAL RENDER ---
  return (
    <div
      className="blockgame-root"
      style={{
        minHeight:"100vh",width:"100vw",
        background:darkMode
          ? "radial-gradient(ellipse at 52% 8%, #57199d 0%, #0d0d22 80%)"
          : "linear-gradient(135deg, #fff 0%, #c7e0fa 120%)",
        paddingTop:93, paddingBottom:40,
        transition:"background 0.44s",
        fontFamily:"'Press Start 2P', 'VT323', 'Orbitron', monospace",
        color:darkMode?"#fffbe6":"#252525",
        boxSizing:"border-box",textAlign:"center"
      }}
    >
      <div className="blockgame-title"
        style={{
          fontSize:"2.1rem",
          background:"linear-gradient(89deg, #F72585, #3A0CA3, #4CC9F0)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          fontFamily:"'Press Start 2P', 'Orbitron', VT323, monospace",
          letterSpacing:".18em",textTransform:"uppercase",
          textShadow:neonShadow(darkMode?"#FFB703":"#4CC9F0",6),
          marginBottom:9,marginTop:0,
        }}
      >🧩 Block Builder</div>
      <div className="blockgame-instructions"
        style={{
          maxWidth:550, margin:"0 auto 24px auto",
          fontFamily:"'VT323', 'Orbitron', monospace",
          color: darkMode?"#4CC9F0":"#F72585",
          background: darkMode?"#1d1a2d77":"#f1f7ffc8",
          border: `2px solid ${darkMode?"#3A0CA3":"#4CC9F0"}`,
          boxShadow: neonShadow(darkMode?"#4CC9F0":"#F72585"),
          borderRadius:8,fontSize:16.5,padding:"13px 12px 10px 12px",
          lineHeight:1.6, letterSpacing:".02em"
        }}>
        Drag and drop a block from below onto the grid.
        <br/>
        <span style={{color:darkMode?"#F72585":"#3A0CA3"}}>Fill any row or column to clear it and score bonus points!</span>
        <br/>
        Can't fit any block? Game over.<br/>
        <span style={{fontFamily:"'Orbitron', monospace",color:"#FFB703"}}>How high can you score?</span>
      </div>
      <ScoreBar/>
      <div className="blockgame-main"
        style={{maxWidth:cellSize*10+14,margin:"0 auto"}}
      >
        <BoardGrid/>
        <ActiveBlocks/>
      </div>
      {showGameOver && <GameOverModal />}
      <style>{`
        .block-cell { transition: background 0.12s, box-shadow 0.09s; }
        .block-cell.filled { animation: cell-in 0.19s cubic-bezier(.7,0,1,1);}
        @keyframes cell-in { 0%{transform:scale(0.6);} 100%{transform:scale(1);} }
        @keyframes blockgame-pop-clear {
          0%{ opacity:1; transform:scale(1);}
          90%{ opacity:0.55; transform:scale(1.18);}
          100%{ opacity:0.15; transform:scale(1);}
        }
        @media (max-width:580px) {
          .blockgame-root { padding-top:56px !important;}
          .blockgame-main { max-width:98vw;}
        }
        @media (max-width:430px) {
          .blockgame-instructions { font-size:14.5px!important;}
        }
      `}</style>
    </div>
  );
}

export default BlockGame;
