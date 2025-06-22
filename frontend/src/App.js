import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import GamePage from "./GamePage"; // this will be your quiz component later

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}

export default App;
