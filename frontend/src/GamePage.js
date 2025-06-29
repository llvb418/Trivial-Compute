import React, { useEffect, useState } from "react";

const GamePage = ({ sessionId }) => {
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);

  // Fetch the session state from the backend
  const fetchGameState = async () => {
    try {
      console.log("Fetching session state for session:", sessionId);
      const response = await fetch(`http://127.0.0.1:8000/api/session-state/${sessionId}/`);
      if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
      const data = await response.json();

      setPlayers(data.players);
      setCurrentTurn(data.current_turn);
    } catch (error) {
      console.error("Failed to fetch game state:", error);
    }
  };

  // Run once on load
  useEffect(() => {
    fetchGameState();
  }, []);

  // Button actions
  const handleRollDice = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/roll-dice/");
      const data = await res.json();
      alert(`🎲 You rolled a ${data.roll_result}`);
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  };

  const handleGetQuestion = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/get-question/");
      const data = await res.json();
      alert(`📚 Category: ${data.category}\n${data.question_text}`);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleGetPlayerInfo = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/session-state/${sessionId}/`);
      const data = await res.json();
      const info = data.players
        .map(p =>
          `${p.name} — ${p.color}\n🧩 Chips: ${JSON.stringify(p.chips)}\n📍 Position: ${p.position ?? "N/A"}`
        )
        .join("\n\n");
      alert(info);
    } catch (error) {
      console.error("Error getting player info:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">🎮 Game Session #{sessionId}</h1>

      <h2 className="text-lg font-semibold">Players:</h2>
      <ul className="mb-4">
        {players.map((player, index) => (
          <li key={index}>
            {player.name} — {player.color}
          </li>
        ))}
      </ul>

      <p className="text-red-600 mb-6">🎯 It's player #{currentTurn}'s turn!</p>

      <div className="p-4 bg-white shadow rounded w-fit space-y-3">
        <button
          onClick={handleRollDice}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🎲 Roll Dice
        </button>
        <button
          onClick={handleGetQuestion}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ❓ Get Question
        </button>
        <button
          onClick={handleGetPlayerInfo}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          👥 Player Info
        </button>
        <button
          onClick={fetchGameState}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          🤔 Get Positions
        </button>
      </div>
    </div>
  );
};

export default GamePage;

