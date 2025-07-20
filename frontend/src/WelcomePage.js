import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const [players, setPlayers] = useState([{ name: "" }]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  // Fetch categories from backend on page load
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/categories/");
      const data = await res.json();
      console.log("Fetched categories:", data);  // ← Add this line
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  fetchCategories();
}, []);

  // Handle player name input
  const handlePlayerChange = (index, event) => {
    const newPlayers = [...players];
    newPlayers[index].name = event.target.value;
    setPlayers(newPlayers);
  };

  // Handle category dropdown selection
  const handleCategoryChange = (index, event) => {
    const updated = [...selectedCategories];
    updated[index] = event.target.value;
    setSelectedCategories(updated);
  };

  // Add another player input (up to 4)
  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { name: "" }]);
    }
  };

  // Submit form: start session and add players
  const handleSubmit = async () => {
    // if (players.length < 1 || selectedCategories.includes("")) {
    //   alert("Please enter at least one player and choose 4 categories.");
    //   return;
    // }
 try {
    console.log("Submitting to backend", selectedCategories);

    const response = await fetch('http://localhost:8000/api/start-session/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categories: {
          C1: selectedCategories[0],
          C2: selectedCategories[1],
          C3: selectedCategories[2],
          C4: selectedCategories[3],
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const sessionData = await response.json();
    const sessionId = sessionData.session_id;

    // Add each player
    for (const player of players) {
      await fetch(`http://127.0.0.1:8000/api/join-session/${sessionId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: player.name }),
      });
    }

    // Redirect to game board
    navigate(`/game/${sessionId}`);

    } catch (error) {
      console.error("Error starting session:", error);
      alert(error);
    }
  };

  return (
    <>
      {/* Teacher Admin button positioned out of the way */}
      <div className="flex justify-end max-w-xl mx-auto mt-4">
        <a
          href="http://localhost:8000/admin/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900 text-sm"
        >
          🔑 Teachers/Administrators
        </a>
      </div>

      <div className="relative max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">🎲 Welcome to Trivial Compute!</h1>
        <img
          src="/Trivial_Compute.png"
          alt="Trivial Compute Logo"
          className="mx-auto mb-4"
          style={{ width: "1200px", height: "auto", maxWidth: "100%" }}
        />
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">👤 Enter Player Names:</h2>
          {players.map((player, index) => (
            <input
              key={index}
              type="text"
              value={player.name}
              onChange={(e) => handlePlayerChange(index, e)}
              placeholder={`Player ${index + 1}`}
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1 mb-2"
            />
          ))}
          {players.length < 4 && (
            <button
              onClick={addPlayer}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              ➕ Add Player
            </button>
          )}
        </div>

        <div className="text-left mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">📚 Choose 4 Categories:</h2>
          {selectedCategories.map((selected, index) => {
            // Get the categories selected in other dropdowns
            const otherSelected = selectedCategories.filter((_, i) => i !== index);

            // Build the list of available categories
            const availableOptions = categories.filter(
              (cat) => !otherSelected.includes(cat) || cat === selected
            );

            return (
              <select
                key={index}
                value={selected}
                onChange={(e) => handleCategoryChange(index, e)}
              >
                <option value="">-- Select a Category --</option>
                {availableOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
        >
          🚀 Start Game
        </button>
      </div>
    </>
  );
};

export default WelcomePage;

