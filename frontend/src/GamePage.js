import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

function GamePage() {
  const { sessionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [diceRoll, setDiceRoll] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [categories, setCategories] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionData, setQuestionData] = useState(null); // { question: '', answer: '' }

  const categoryColors = {
    C1: "#f87171",   // red
    C2: "#34d399",   // green
    C3: "#60a5fa",   // blue
    C4: "#fbbf24"    // yellow
  };

    useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/session-state/${sessionId}/`)  // <- your actual endpoint
      .then((response) => {
        setCurrentPlayer(response.data.current_turn);
        setPlayerInfo(response.data.players)
      })
      .catch((error) => {
        console.error("Error fetching session info:", error);
      });
      axios.get(`http://127.0.0.1:8000/api/session-categories/${sessionId}/`)  // <- your actual endpoint
      .then((response) => {
        setCategories(response.data)
      })
      .catch((error) => {
        console.error("Error fetching session info:", error);
      });
  }, [sessionId]);

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
      setQuestionData(data); // assume { question: '', answer: '' }
      setShowQuestion(true);
      setShowAnswer(false);
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

  const fetchBoard = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/get-board/${sessionId}/`);
      const data = await res.json();
      // setCategories(data);
      console.log("Catagories:", data);
    } catch (err) {
      console.error("❌ Error getting category info:", err);
    }
  };

  // NEW: handle next player rotation
  const nextPlayer = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/new-turn/${sessionId}/`);
      const data = await res.json();
      setCurrentPlayer(data.current_turn);
      console.log("current player:", data);
    } catch (err) {
      console.error("❌ Error getting current player info:", err);
    }
  };


  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-4">🎯 Trivial Compute Game</h1>

      {categories && (
      <div className="flex justify-center gap-4 mb-6">
        {Object.entries(categories).map(([key, label]) => (
          <div
            key={key}
            className="px-4 py-2 rounded font-semibold shadow"
            style={{
              backgroundColor: categoryColors[key],
              color: "#000", // optionally use contrast logic here
            }}
          >
            {label}
          </div>
        ))}
      </div>
    )}

      <div className="space-x-2 mb-6">
        <button onClick={fetchQuestion} className="bg-purple-500 text-white px-4 py-2 rounded">
          ❓ Get Question
        </button>
        <button onClick={fetchDiceRoll} className="bg-green-500 text-white px-4 py-2 rounded">
          🎲 Roll Dice (Player {currentPlayer})
        </button>
        <button onClick={fetchBoard} className="bg-orange-500 text-white px-4 py-2 rounded">
          Board
        </button>
      </div>

      {/* NEW: Display Current Player */}
      <p className="text-lg mb-4">🎮 Current Player: <strong>{currentPlayer}</strong></p>

      {categories !== null && (
        <p className="text-lg"> Categories: <strong>{JSON.stringify(categories)}</strong></p>
      )}

      {sessionId && (
        <div className="mb-4">
          <p className="text-lg">🆔 Session ID: <strong>{sessionId}</strong></p>
          {/* You can show more game state info here if needed */}
        </div>
      )}

      {diceRoll !== null && (
        <p className="text-lg">🎲 Dice Roll: <strong>{diceRoll.roll}</strong></p>
      )}

      {showQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Question</h2>
            <p className="text-lg mb-4">{questionData?.question_text}</p>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Show Answer
              </button>
            ) : (
              <>
                <p className="text-green-700 font-bold mb-4">{questionData?.answer}</p>
                {/* Add something for player to roll again */}
                <button
                  onClick={() => setShowQuestion(false)}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Correct
                </button>
                {/* If incorrect, go to the next player */}
                <button
                  onClick={() => {
                    setShowQuestion(false);
                    nextPlayer(); // your existing function
                  }}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Incorrect
                </button>
              </>
            )}
          </div>
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
