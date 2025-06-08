import React from "react";
import "./Board.css";

export default function TrivialPursuitBoard() {
  const board = [
    ["", "", "", "Roll Again", "", "", ""],
    ["", "red", "blue", "green", "yellow", "red", ""],
    ["", "green", "", "", "", "blue", ""],
    ["RQ", "yellow", "", "Trivial Compute", "", "green", "HQ"],
    ["", "blue", "", "", "", "yellow", ""],
    ["", "red", "green", "blue", "yellow", "red", ""],
    ["", "", "", "Roll Again", "", "", ""]
  ];

  const renderCell = (cell, rowIdx, colIdx) => {
    const baseClass = `cell ${cell.toLowerCase().replace(/ /g, "-")}`;
    return (
      <div className={baseClass} key={`${rowIdx}-${colIdx}`}>
        {cell === "" ? "" : cell === "Trivial Compute" ? <strong>{cell}</strong> : cell}
      </div>
    );
  };

  return (
    <div className="board-wrapper">
      <div className="name-bar">Enter name</div>
      <div className="board">
        {board.map((row, rowIdx) => (
          <div className="board-row" key={rowIdx}>
            {row.map((cell, colIdx) => renderCell(cell, rowIdx, colIdx))}
          </div>
        ))}
      </div>
      <div className="name-bar">Enter name</div>
    </div>
  );
}
