import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function GamePage() {
  const location = useLocation();
  const session_id = location.state?.session_id;

  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session_id) {
      setError("No session ID provided.");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/get-session-state/${session_id}/`)
      .then((res) => res.json())
      .then((data) => {
        setGameState(data);
        console.log("Game state loaded:", data);
      })
      .catch((err) => {
        console.error("Failed to fetch game state:", err);
        setError("Failed to load game state.");
      });
  }, [session_id]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!gameState) return <div className="p-6">Loading game...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">🎮 Trivial Compute</h1>
      <h2 className="text-xl mb-2">Session ID: {gameState.session_id}</h2>
      <h3 className="text-lg mb-4">Current Turn: Player #{gameState.current_turn}</h3>

      <div className="w-full max-w-xl bg-white shadow rounded p-4">
        <h4 className="text-md font-semibold mb-2">Players:</h4>
        {gameState.players.map((player, idx) => (
          <div key={idx} className="mb-2 p-2 border-b">
            <strong>{player.name}</strong> — 🎨 Color: {player.color} — 📍 Position: {player.position}
            <br />
            🧩 Chips:{" "}
            {Object.entries(player.chips).map(([color, hasChip]) => (
              <span key={color} className="mr-2">
                {hasChip ? `✅ ${color}` : `❌ ${color}`}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Example: Roll Dice */}
      <button
        className="mt-6 bg-purple-600 text-white px-4 py-2 rounded"
        onClick={() => {
          fetch("http://127.0.0.1:8000/api/roll-dice/", {
            method: "POST",
          })
            .then((res) => res.json())
            .then((data) => alert(`You rolled a ${data.roll_result}`))
            .catch((err) => alert("Dice roll failed"));
        }}
      >
        🎲 Roll Dice
      </button>
    </div>
  );
}

export default GamePage;
