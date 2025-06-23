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
      headers: {
        "Content-Type": "application/json",
      },
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
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl max-h-screen overflow-y-auto flex flex-col items-center text-center p-4">
        {/* Logo */}
        <img
          src="/Trivial_Compute.png"
          alt="Trivial Compute Logo"
          className="w-24 md:w-32 lg:w-40 h-auto mb-4 animate-bounceSlow object-contain mx-auto" />

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-4">
          🎉 Welcome to Trivial Compute 🎲
        </h1>

        <div className="bg-white border border-pink-300 text-pink-600 text-base italic px-4 py-3 rounded-xl shadow mb-4 max-w-md">
          💬 Add up to 4 players and hit <strong>Start Game</strong> when done!
        </div>


        {/* Player Inputs */}
        <div className="space-y-4 w-full max-w-md">
          {players.map((player, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Player ${index + 1} name`}
              value={player.name}
              onChange={(e) => handleChange(index, e)}
              className="w-full px-4 py-2 border border-gray-300 rounded shadow"
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


