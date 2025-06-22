import React, { useEffect, useState } from "react";

function GamePage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/random-question/")
      .then((res) => res.json())
      .then((data) => setQuestions([data]))
      .catch((err) => console.error("Failed to fetch questions:", err));
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = questions[currentIndex].correctAnswer;
    if (selectedAnswer === correct) {
      setFeedback("✅ Correct!");
      setScore(score + 1);
    } else {
      setFeedback(`❌ Incorrect. The correct answer is ${correct}.`);
    }
  };

  const handleNext = () => {
    setSelectedAnswer("");
    setSubmitted(false);
    setFeedback("");
    setCurrentIndex(currentIndex + 1);
  };

  if (questions.length === 0) return <div className="p-4">Loading questions...</div>;

  if (currentIndex >= questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Quiz Completed!</h1>
          <p className="text-lg">You scored {score} out of {questions.length}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <h1 className="text-2xl font-bold mb-4">{currentQuestion.question}</h1>
        <div className="space-y-2">
          {currentQuestion.choices.map((choice, index) => (
            <label key={index} className="block">
              <input
                type="radio"
                name="answer"
                value={choice}
                checked={selectedAnswer === choice}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="mr-2"
              />
              {choice}
            </label>
          ))}
        </div>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Submit
          </button>
        ) : (
          <>
            <p className="mt-4 text-lg">{feedback}</p>
            <button
              onClick={handleNext}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default GamePage;