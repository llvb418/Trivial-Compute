import { useState } from "react";
import { useParams } from "react-router-dom";

function GamePage() {
  const { sessionId } = useParams();
  const [gameState, setGameState] = useState(null);
  const [question, setQuestion] = useState(null);
  const [diceRoll, setDiceRoll] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);

  //get the game session id from the backend
  const fetchGameState = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/session-state/${sessionId}/`);
      const data = await res.json();
      setGameState(data);
      console.log("✅ Game state:", data);
    } catch (err) {
      console.error("❌ Failed to fetch game state:", err);
    }
  };
  //get a random question from the backend
  const fetchQuestion = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/get-question/`);
      const data = await res.json();
      setQuestion(data);
      console.log("✅ Question:", data);
    } catch (err) {
      console.error("❌ Failed to get question:", err);
    }
  };

  //get the simulated dice roll number from the backend
  const fetchDiceRoll = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/roll-dice/`);
      const data = await res.json();
      setDiceRoll(data.roll_result);
      console.log("🎲 Rolled:", data.roll_result);
    } catch (err) {
      console.error("❌ Error rolling dice:", err);
    }
  };

  //get player info for corresponding game session from backend
  const fetchPlayerInfo = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/session-state/${sessionId}/`);
      const data = await res.json();
      setPlayerInfo(data.players);
      console.log("✅ Players:", data.players);
    } catch (err) {
      console.error("❌ Error getting player info:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-4">🎯 Trivial Compute Game</h1>

      <div className="space-x-2 mb-6">
        <button onClick={fetchGameState} className="bg-blue-500 text-white px-4 py-2 rounded">
          🔄 Get Game State
        </button>
        <button onClick={fetchQuestion} className="bg-purple-500 text-white px-4 py-2 rounded">
          ❓ Get Question
        </button>
        <button onClick={fetchDiceRoll} className="bg-green-500 text-white px-4 py-2 rounded">
          🎲 Roll Dice
        </button>
        <button onClick={fetchPlayerInfo} className="bg-yellow-500 text-white px-4 py-2 rounded">
          👥 Get Player Info
        </button>
      </div>
    
      {gameState && (
        <div className="mb-4">
          <p className="text-lg">🆔 Session ID: <strong>{sessionId}</strong></p>
          {/* You can show more game state info here if needed */}
        </div>
      )}

      {diceRoll !== null && (
        <p className="text-lg">🎲 Dice Roll: <strong>{diceRoll}</strong></p>
      )}

      {question && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-semibold">📘 Question</h2>
          <p><strong>{question.question_text}</strong></p>
          {question.options && (
            <ul className="list-disc ml-6 mt-2">
              {question.options.map((opt, idx) => (
                <li key={idx}>{opt.text}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {playerInfo && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">👤 Players</h2>
          {playerInfo.map((p, idx) => (
            <div key={idx} className="border-b py-2">
              <p><strong>{p.name}</strong> — Color: {p.color}, Position: {p.position}</p>
              <p>Chips: {Object.entries(p.chips).filter(([_, val]) => val).map(([k]) => k).join(", ") || "None"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GamePage;



