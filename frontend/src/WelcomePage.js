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
    if (players.length >= 4) return; // ✅ Prevent more than 4 players
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
        navigate("/GamePage"); // ✅ Make sure this route exists in App.js
      })
      .catch((err) => console.error("Error saving players:", err));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6">
      <h1 className="text-4xl font-bold text-pink-600 mb-6">
        🎉 Welcome to Trivial Pursuit 🎲
      </h1>
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
  );
}

export default WelcomePage;

