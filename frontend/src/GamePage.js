import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import DiceRoller from "./DiceRoller";
import Board from "./Board";

function GamePage() {
  const { sessionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [diceRoll, setDiceRoll] = useState(null);
  const [moves, setMoves] = useState([]);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [categories, setCategories] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [AnswerCorrect, setAnswerCorrect] = useState(false);
  const [questionData, setQuestionData] = useState(null); // { question: '', answer: '' }
  const [board, setBoardInfo] = useState(null);
  const [tile, setTile] = useState(null);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [winner, setWinner] = useState(null);



  const categoryColors = {
    C1: "#f87171",   // red
    C2: "#fbbf24",    // yellow
    C3: "#34d399",   // green
    C4: "#60a5fa",   // blue
  };

  const categoryColorNames = {
    C1: "red",   // red
    C2: "yellow",    // yellow
    C3: "green",   // green
    C4: "blue",   // blue
  }

  // fetch player session state and categories
useEffect(() => {
  fetchSessionState();
  fetchSessionCategories();
  fetchBoard();
}, [sessionId]);

  const fetchSessionState = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/session-state/${sessionId}/`);
      setCurrentPlayer(response.data.current_turn);
      setPlayerInfo(response.data.players);
    } catch (error) {
      console.error("Error fetching session info:", error);
    }
  };

  const fetchSessionCategories = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/session-categories/${sessionId}/`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching category info:", error);
    }
  };

  const awardToken = async () => {

    await axios.post(`http://127.0.0.1:8000/api/award-chip/${sessionId}/${currentPlayer}/`, {
        color: categoryColorNames['C' + tile?.tile_type[tile?.tile_type.length - 1]],
      });
      fetchSessionState();
  }

  function hasAllChips() {
    const player = playerInfo.find(p => p["session player id"] === currentPlayer);
    console.log("tile:", player);
    if (!player) return false; // player not found
    return Object.values(player.chips).every(val => val === true);

  }


  async function handleTileClick(tileId, tileType) {
    fetchBoard()
    console.log("✅ board:", board);
    const tile = board.tiles[tileId];
    setTile(tile);
    console.log("tile:", tile);
    const categoryName = tile?.name;
    if (tile?.tile_type.includes('C')) {
      fetchQuestion(categoryName)
    }
    if (tile?.tile_type.includes('HQ')) {
      fetchQuestion(categories['C' + tile?.tile_type[tile?.tile_type.length - 1]])
    }
    if (tile?.tile_type === 'START'){
      setShowCategoryPopup(true);
    }
    try {
      await axios.post(`http://127.0.0.1:8000/api/update-position/${sessionId}/${currentPlayer}/`, {
        position: tileId,
      });
      setMoves([]); // Clear highlights after move
      fetchSessionState();
    } catch (error) {
      console.error("Failed to update position:", error);
    }
    if (tile?.tile_type === "ROLL_AGAIN") {
      fetchDiceRoll()
    }
  }

  // get a random question from the backend
  const fetchQuestion = async (category) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get-question/', {
        params: { category: category },
      });

      if (response.data.error) {
        console.error("No questions are available");
        setQuestion({ error: response.data.error });
        return;
      }

      setQuestion(response.data.question_text);
      console.log("real Question:", question);
      setQuestionData(response.data); // assume { question: '', answer: '' }
      setShowQuestion(true);
      setShowAnswer(false);
      console.log("✅ Question:", response.data);
    } catch (err) {
      console.error("❌ Failed to get question:", err);
    }
  };

  // get the simulated dice roll number from the backend
  const fetchDiceRoll = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/roll-dice/${sessionId}/${currentPlayer}/`, { method: "POST" });
      const data = await res.json();
      setDiceRoll(data);
      setMoves(data.possible_tiles)
      console.log(`🎲 Player ${currentPlayer} rolled:`, data.possible_tiles);
    } catch (err) {
      console.error("❌ Error rolling dice:", err);
    }
  };

  // for testing board loading
  const fetchBoard = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/get-board/${sessionId}/`);
      const data = await res.json();
      setBoardInfo(data)
      console.log("Board Data:", data);
    } catch (err) {
      console.error("❌ Error getting board info:", err);
    }
  };

  // handle next player rotation
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
      {sessionId && (<h1 className="text-3xl font-bold mb-4">🎯 Trivial Compute Game #{sessionId}</h1>)}

      {/* Category Labels */}
      {categories && (
        <div className="flex justify-center gap-4 mb-6">
          {Object.entries(categories).map(([key, label]) => (
            <div
              key={key}
              className="px-4 py-2 rounded font-semibold shadow"
              style={{
                backgroundColor: categoryColors[key],
                color: "#000",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      )}

      {/* Game Buttons */}
      {/* Dice Roller Component */}
            <div className="mb-6">
            <DiceRoller
                 sessionId={sessionId}
                currentPlayer={currentPlayer}
                onRollComplete={(data) => {
                setDiceRoll(data);
                setMoves(data.possible_tiles);
        }}
              />
            </div>


      {/* Current Player */}
      <p className="text-lg mb-4">🎮 Current Player: <strong>{currentPlayer}</strong></p>

      {/* Dice Roll Result */}
      {diceRoll !== null && (
        <p className="text-lg">🎲 Dice Roll: <strong>{diceRoll.roll}</strong></p>
      )}

      {/* Question Modal */}
      {showQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Question</h2>
            <p className="text-lg mb-4">{question}</p>

            {questionData?.image_url && (
              <img src={questionData.image_url} alt="Question visual" className="mb-4 max-w-full mx-auto" />
            )}

            {questionData?.video_url && (
              <video controls className="mb-4 max-w-full mx-auto">
                <source src={questionData.video_url} type="video/mp4" />
              </video>
            )}

            {questionData?.audio_url && (
              <audio controls className="mb-4 w-full">
                <source src={questionData.audio_url} type="audio/mpeg" />
              </audio>
            )}

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
                <button
                  onClick={() => {
                    setShowQuestion(false);
                    setAnswerCorrect(true);
                    if (tile?.tile_type.includes('HQ')) {
                      awardToken();
                      fetchSessionState();
                    }
                    if (tile?.tile_type === 'START' && hasAllChips()) {
                      console.log("player wins");
                      setWinner(playerInfo.find(p => p["session player id"] === currentPlayer));
                      setShowWinPopup(true);
                    }
                    else {
                       console.log("does not have all tokens");
                    }
                  }}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Correct
                </button>
                <button
                  onClick={() => {
                    setShowQuestion(false);
                    setAnswerCorrect(false);
                    nextPlayer();
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
      {showCategoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Choose a Category</h2>
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedCategory(label);
                  setShowCategoryPopup(false);
                  // You can trigger fetching a question or something here
                  fetchQuestion(label);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showWinPopup && winner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
               {winner.name} wins the game! 
            </h2>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => window.location.href = '/'} // or navigate('/home')
            >
              Exit Game
            </button>
          </div>
        </div>
      )}


      {/* Game Board */}
      <div className="my-8">
        <Board sessionId={sessionId} playerInfo={playerInfo} moves={moves} currentPlayer={currentPlayer} 
        handleTileClick={handleTileClick}/>
      </div>

      {/* Player Info */}
      {playerInfo && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2"> Players</h2>
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
