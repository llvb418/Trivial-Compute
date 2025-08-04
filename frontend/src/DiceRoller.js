import { useEffect, useState } from "react";
import dice1 from './Dice_pics/one.png';
import dice2 from './Dice_pics/two.png';
import dice3 from './Dice_pics/three.png';
import dice4 from './Dice_pics/four.png';
import dice5 from './Dice_pics/five.png';
import dice6 from './Dice_pics/six.png';

const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

function DiceRoller({ sessionId, currentPlayer, onRollComplete }) {
  const [rolling, setRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState(1);

  const rollDice = async () => {
    setRolling(true);

    // Animation loop
    let count = 0;
    const interval = setInterval(() => {
      const face = Math.floor(Math.random() * 6) + 1;
      setCurrentFace(face);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        getActualRoll(); // Fetch final result from backend
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
        onRollComplete(data); // send result back to GamePage
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
        alt={`Dice ${currentFace}`}
        className={`w-20 h-20 mb-2 transition-transform duration-100 ${rolling ? "animate-spin" : ""}`}
      />
      <button
        disabled={rolling}
        onClick={rollDice}
        className={`px-4 py-2 rounded text-white ${rolling ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
      >
        {rolling ? "Rolling..." : `🎲 Roll Dice (Player ${currentPlayer})`}
      </button>
    </div>
  );
}

export default DiceRoller;
