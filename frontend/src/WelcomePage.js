import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const [players, setPlayers] = useState([{ name: "" }]);
  const navigate = useNavigate();

  const handleChange = (index, event) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].name = event.target.value;
    setPlayers(updatedPlayers);
  };

  const handleAddPlayer = () => {
    if (players.length >= 4) return;
    setPlayers([...players, { name: "" }]);
  };

  const handleSubmit = () => {
    const validPlayers = players.filter((p) => p.name.trim() !== "");
    if (validPlayers.length === 0) {
      alert("Please enter at least one player name.");
      return;
    }

    fetch("http://localhost:8000/api/players/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players: validPlayers }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Players saved:", data);
        navigate("/game");
      })
      .catch((err) => console.error("Error saving players:", err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center overflow-auto max-h-[90vh]">

        {/* Logo */}
        <img
  src="/Trivial_Compute.png"
  alt="Trivial Compute Logo"
  className="mx-auto mb-4"
  style={{ width: "1235px", height: "auto", maxWidth: "100%" }}
/>



        {/* Title */}
        <h1 className="text-2xl font-bold text-pink-600 mb-2">
          🎉 Welcome to Trivial Compute 🎲
        </h1>

        {/* Instructions */}
        <p className="text-sm text-gray-600 italic mb-4">
          💬 Add up to 4 players and hit <strong>Start Game</strong>!
        </p>

        {/* Inputs */}
        <div className="space-y-3">
          {players.map((player, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Player ${index + 1} name`}
              value={player.name}
              onChange={(e) => handleChange(index, e)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          ))}

          <button
            onClick={handleAddPlayer}
            disabled={players.length >= 4}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            ➕ Add New Player
          </button>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            ✅ Start Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
