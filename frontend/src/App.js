import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import GamePage from "./GamePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
