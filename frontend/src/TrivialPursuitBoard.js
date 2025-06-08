import React, { useState } from "react";
import "./Board.css";

const pathCoordinates = [
  [6, 3], [5, 3], [4, 3], [3, 3], [2, 3], [1, 3], [0, 3],
  [0, 4], [0, 5], [0, 6],
  [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
  [6, 5], [6, 4], [6, 3],
  [6, 2], [6, 1], [6, 0],
  [5, 0], [4, 0], [3, 0], [2, 0], [1, 0], [0, 0],
  [0, 1], [0, 2], [0, 3],
];

export default function TrivialPursuitBoard() {
  const [playerPos, setPlayerPos] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
    setPlayerPos((prev) => (prev + roll) % pathCoordinates.length);
  };

  const board = [
    ["", "", "", "Roll Again", "", "", ""],
    ["", "red", "blue", "green", "yellow", "red", ""],
    ["", "green", "", "", "", "blue", ""],
    ["RQ", "yellow", "", "Trivial Compute", "", "green", "HQ"],
    ["", "blue", "", "", "", "yellow", ""],
    ["", "red", "green", "blue", "yellow", "red", ""],
    ["", "", "", "Roll Again", "", "", ""]
  ];

  const [row, col] = pathCoordinates[playerPos];

  const renderCell = (cell, rowIdx, colIdx) => {
    const baseClass = `cell ${cell.toLowerCase().replace(/ /g, "-")}`;
    const isPlayerHere = row === rowIdx && col === colIdx;

    return (
      <div className={baseClass} key={`${rowIdx}-${colIdx}`}>
        {isPlayerHere ? "🟢" : cell === "Trivial Compute" ? <strong>{cell}</strong> : cell}
      </div>
    );
  };

  return (
    <div className="board-wrapper">
      <h2>Trivial Compute</h2>
      <button onClick={rollDice}>Roll Dice</button>
      {diceRoll && <p>Rolled: {diceRoll}</p>}
      <div className="board">
        {board.map((rowArr, rowIdx) => (
          <div className="board-row" key={rowIdx}>
            {rowArr.map((cell, colIdx) => renderCell(cell, rowIdx, colIdx))}
          </div>
        ))}
      </div>
    </div>
  );
}

