import { useState } from "react";
import { useParams } from "react-router-dom";

function GamePage() {
  const { sessionId } = useParams();
  const [gameState, setGameState] = useState(null);
  const [question, setQuestion] = useState(null);
  const [diceRoll, setDiceRoll] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [categories, setCategories] = useState(null);

  // NEW: track current player
  const [currentPlayer, setCurrentPlayer] = useState(1);

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

      // check if questions are empty
      if (data.error) {
        console.error("No questions are available")
        setQuestion({ error: data.error })
        return
      }
      setQuestion(data);
      console.log("✅ Question:", data);
    } catch (err) {
      console.error("❌ Failed to get question:", err);
    }
  };

  //get the simulated dice roll number from the backend (now uses currentPlayer)
  const fetchDiceRoll = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/roll-dice/${sessionId}/${currentPlayer}/`, { method: "POST" });
      const data = await res.json();
      setDiceRoll(data);
      console.log(`🎲 Player ${currentPlayer} rolled:`, data.roll_result);
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

  const fetchCategoryInfo = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/session-categories/${sessionId}/`);
      const data = await res.json();
      setCategories(data);
      console.log("Catagories:", data);
    } catch (err) {
      console.error("❌ Error getting category info:", err);
    }
  };

  const fetchBoard = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/get-board/${sessionId}/`);
      const data = await res.json();
      setCategories(data);
      console.log("Catagories:", data);
    } catch (err) {
      console.error("❌ Error getting category info:", err);
    }
  };

  // NEW: handle next player rotation
  const nextPlayer = () => {
    if (!playerInfo || playerInfo.length === 0) {
      alert("Load player info first!");
      return;
    }
    setCurrentPlayer((prev) => {
      const next = prev + 1;
      return next > playerInfo.length ? 1 : next;
    });
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
          🎲 Roll Dice (Player {currentPlayer})
        </button>
        <button onClick={fetchPlayerInfo} className="bg-yellow-500 text-white px-4 py-2 rounded">
          👥 Get Player Info
        </button>
        <button onClick={fetchCategoryInfo} className="bg-red-500 text-white px-4 py-2 rounded">
          Categories
        </button>
        <button onClick={fetchBoard} className="bg-orange-500 text-white px-4 py-2 rounded">
          Board
        </button>
        {/* NEW: Next Player button */}
        <button onClick={nextPlayer} className="bg-pink-500 text-white px-4 py-2 rounded">
          👉 Next Player
        </button>
      </div>

      {/* NEW: Display Current Player */}
      <p className="text-lg mb-4">🎮 Current Player: <strong>{currentPlayer}</strong></p>

      {categories !== null && (
        <p className="text-lg"> Categories: <strong>{JSON.stringify(categories)}</strong></p>
      )}

      {gameState && (
        <div className="mb-4">
          <p className="text-lg">🆔 Session ID: <strong>{sessionId}</strong></p>
          {/* You can show more game state info here if needed */}
        </div>
      )}

      {diceRoll !== null && (
        <p className="text-lg">🎲 Dice Roll: <strong>{diceRoll.roll}</strong></p>
      )}

      {question && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-semibold">📘 Question</h2>
          {question.error ? (
            <p className="text-red-500">There are no questions.</p>
          ) : (
            <>
              <p><strong>{question.question_text}</strong></p>
              {question.options && (
                <ul className="list-disc ml-6 mt-2">
                  {question.options.map((opt, idx) => (
                    <li key={idx}>{opt.text}</li>
                  ))}
                </ul>
              )}
            </>
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
