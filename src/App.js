import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const ROWS = 20;
const COLS = 10;
const EMPTY_CELL = 0;
const COLORS = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"];

const TETROMINOS = [
  [
    [1, 1, 1, 1], // I
  ],
  [
    [1, 1, 1], // T
    [0, 1, 0],
  ],
  [
    [1, 1, 1], // L
    [1, 0, 0],
  ],
  [
    [1, 1, 1], // J
    [0, 0, 1],
  ],
  [
    [1, 1], // O
    [1, 1],
  ],
  [
    [1, 1], // S
    [0, 1],
    [0, 1],
  ],
  [
    [1, 1], // Z
    [1, 0],
    [1, 0],
  ],
];

const randomTetromino = () =>
  TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];

const createGrid = () => Array.from(Array(ROWS), () => new Array(COLS).fill(0));

const App = () => {
  const [grid, setGrid] = useState(createGrid());
  const [currentTetromino, setCurrentTetromino] = useState(randomTetromino());
  const [currentPosition, setCurrentPosition] = useState({ x: 4, y: 0 });

  const moveDownRef = useRef();

  const drawTetromino = (grid, tetromino, position) => {
    const newGrid = grid.map((row) => row.slice());
    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        if (tetromino[y][x]) {
          newGrid[position.y + y][position.x + x] = tetromino[y][x];
        }
      }
    }
    return newGrid;
  };

  const removeFullRows = (grid) => {
    const newGrid = grid.filter((row) => !row.every((cell) => cell !== 0));
    const emptyRows = Array.from(Array(ROWS - newGrid.length), () =>
      new Array(COLS).fill(0)
    );
    return emptyRows.concat(newGrid);
  };

  const moveDown = () => {
    const newPosition = { ...currentPosition, y: currentPosition.y + 1 };
    if (isValidMove(currentTetromino, newPosition)) {
      setCurrentPosition(newPosition);
    } else {
      setGrid((prevGrid) =>
        drawTetromino(prevGrid, currentTetromino, currentPosition)
      );
      setCurrentTetromino(randomTetromino());
      setCurrentPosition({ x: 4, y: 0 });
    }
  };

  const isValidMove = (tetromino, position) => {
    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        if (
          tetromino[y][x] &&
          (grid[position.y + y] && grid[position.y + y][position.x + x]) !==
            EMPTY_CELL
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleKeyDown = (event) => {
    switch (event.keyCode) {
      case 37: // Left arrow
        move(-1);
        break;
      case 39: // Right arrow
        move(1);
        break;
      case 40: // Down arrow
        moveDown();
        break;
      case 32: // Spacebar
        rotate();
        break;
      default:
        break;
    }
  };

  const move = (dx) => {
    const newPosition = { ...currentPosition, x: currentPosition.x + dx };
    if (isValidMove(currentTetromino, newPosition)) {
      setCurrentPosition(newPosition);
    }
  };

  const rotate = () => {
    const rotatedTetromino = currentTetromino[0].map((_, index) =>
      currentTetromino.map((row) => row[index]).reverse()
    );
    if (isValidMove(rotatedTetromino, currentPosition)) {
      setCurrentTetromino(rotatedTetromino);
    }
  };

  useEffect(() => {
    moveDownRef.current = moveDown;
  });

  useEffect(() => {
    const handleInterval = () => {
      moveDownRef.current();
    };
    const interval = setInterval(handleInterval, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setGrid((prevGrid) =>
      drawTetromino(prevGrid, currentTetromino, currentPosition)
    );
  }, [currentTetromino, currentPosition]);

  useEffect(() => {
    setGrid((prevGrid) => removeFullRows(prevGrid));
  }, [grid]);

  return (
    <div className="App" onKeyDown={handleKeyDown} tabIndex="0">
      <h1>Tetris</h1>
      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell !== EMPTY_CELL ? "filled" : ""}`}
              style={{ backgroundColor: COLORS[cell] }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
