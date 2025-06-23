import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import GamePage from "./GamePage";

function App() {
  return <WelcomePage />;
}

export default App;

/*
return this to connect multiple pages
(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="*" element={<div>404 — Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
*/