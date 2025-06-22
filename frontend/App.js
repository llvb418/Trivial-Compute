import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import QuizPage from "./QuizPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  );
}

export default App;
