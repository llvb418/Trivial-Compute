import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import GamePage from "./GamePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/game/:sessionId" element={<GamePage />} />
        <Route path="*" element={<div>404 — Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/*
return <WelcomePage />;
*/