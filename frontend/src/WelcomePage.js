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

  const handleSubmit = async () => {
    const validPlayers = players.filter((p) => p.name.trim() !== "");
    if (validPlayers.length === 0) {
      alert("Please enter at least one player name.");
      return;
    }

    try {
      // Step 1: Start session
      const sessionRes = await fetch("http://127.0.0.1:8000/api/start-session/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!sessionRes.ok) {
        const errorText = await sessionRes.text();
        throw new Error(`Start session failed: ${errorText}`);
      }

      const sessionData = await sessionRes.json();
      const session_id = sessionData.session_id;
      console.log("✅ Session started:", session_id);

      // Step 2: Join session for each player
      const playerResponses = await Promise.all(
        validPlayers.map(async (player) => {
          const res = await fetch(`http://127.0.0.1:8000/api/join-session/${session_id}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: player.name }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to add ${player.name}: ${errorText}`);
          }

          return res.json();
        })
      );

      console.log("✅ All players joined:", playerResponses);

      // Step 3: Navigate to game
      navigate("/game/${sessionId}");

    } catch (error) {
      console.error("❌ Full error:", error);
      alert(`There was an issue saving the player names: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center overflow-auto max-h-[90vh]">
        <img
          src="/Trivial_Compute.png"
          alt="Trivial Compute Logo"
          className="mx-auto mb-4"
          style={{ width: "1200px", height: "auto", maxWidth: "100%" }}
        />

        <h1 className="text-2xl font-bold text-pink-600 mb-2">
          🎉 Welcome to Trivial Compute 🎲
        </h1>

        <p className="text-sm text-gray-600 italic mb-4">
          💬 Add up to 4 players and hit <strong>Start Game</strong>!
        </p>

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

