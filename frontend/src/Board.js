import React, { useEffect, useState } from 'react';
import axios from 'axios';

const boardLayout = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [9, null, null, null, 10, null, null, null, 11],
  [12, null, null, null, 13, null, null, null, 14],
  [15, null, null, null, 16, null, null, null, 17],
  [18, 19, 20, 21, 22, 23, 24, 25, 26],
  [27, null, null, null, 28, null, null, null, 29],
  [30, null, null, null, 31, null, null, null, 32],
  [33, null, null, null, 34, null, null, null, 35],
  [36, 37, 38, 39, 40, 41, 42, 43, 44],
];

const tileColors = {
  C1: 'bg-red-300',
  C2: 'bg-yellow-300',
  C3: 'bg-green-300',
  C4: 'bg-blue-300',
  START: 'bg-purple-400',
  ROLL_AGAIN: 'bg-pink-400',
  HQ1: 'bg-gray-400',
  HQ2: 'bg-gray-400',
  HQ3: 'bg-gray-400',
  HQ4: 'bg-gray-400',
};

function Board({ sessionId, playerInfo }) {
  const [tiles, setTiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoard() {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/get-board/${sessionId}/`);
        const tileMap = {};
        for (let tile of res.data.tiles) {
          tileMap[tile.index] = tile.tile_type;
        }
        setTiles(tileMap);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch board:", err);
      }
    }

    fetchBoard();
  }, [sessionId]);

  if (loading) return <div>Loading board...</div>;

  return (
    <div className="grid grid-cols-9 gap-1 p-4 w-fit mx-auto">
      {boardLayout.flat().map((tileId, idx) => {
        if (tileId === null) {
          return <div key={idx} className="w-16 h-16 bg-transparent" />;
        }

        const tileType = tiles[tileId];
        const colorClass = tileColors[tileType] || 'bg-white';

        return (
          <div
            key={tileId}
            className={`relative w-16 h-16 border rounded-md flex items-center justify-center text-[10px] font-semibold ${colorClass}`}
          >
            <span className="z-0">{tileType}</span>

            {/* Player Tokens */}
            {playerInfo?.map((player, index) => {
              if (player.position === tileId) {
                return (
                  <div
                    key={player.name}
                    className="absolute rounded-full border border-black"
                    style={{
                      backgroundColor: player.color,
                      width: "16px",
                      height: "16px",
                      top: `${4 + index * 16}px`,
                      left: `${4 + (index % 2) * 16}px`,
                      zIndex: 10 + index,
                    }}
                    title={player.name}
                  />
                );
              }
              return null;
            })}
          </div>
        );
      })}
    </div>
  );
}


export default Board;
