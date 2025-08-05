import { useState } from "react";

const diceImages = [
  "/Dice_pics/one.png",
  "/Dice_pics/two.png",
  "/Dice_pics/three.png",
  "/Dice_pics/four.png",
  "/Dice_pics/five.png",
  "/Dice_pics/six.png",
];

function DiceRoller({ sessionId, currentPlayer, onRollComplete }) {
  const [rolling, setRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState(1);

  const rollDice = async () => {
    setRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      const face = Math.floor(Math.random() * 6) + 1;
      setCurrentFace(face);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        getActualRoll();
      }
    }, 100);
  };

  const getActualRoll = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/roll-dice/${sessionId}/${currentPlayer}/`, {
        method: "POST"
      });
      const data = await res.json();
      setCurrentFace(data.roll);
      setRolling(false);
      if (onRollComplete) {
        onRollComplete(data);
      }
    } catch (err) {
      console.error("❌ Dice roll failed:", err);
      setRolling(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={diceImages[currentFace - 1]}
        alt={`Dice face ${currentFace}`}
        className={`w-24 h-24 mb-3 transition-transform duration-200 ease-in-out ${
          rolling ? "animate-roll-dice" : ""
        }`}
      />
      <button
        onClick={rollDice}
        disabled={rolling}
        className={`px-4 py-2 rounded text-white text-sm ${
          rolling ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {rolling ? "Rolling..." : `🎲 Roll Dice (Player ${currentPlayer})`}
      </button>
    </div>
  );
}

export default DiceRoller;

