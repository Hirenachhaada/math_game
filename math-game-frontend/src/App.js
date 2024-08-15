import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [userId, setUserId] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    if (timeLeft > 0 && isGameStarted) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isGameStarted) {
      setIsGameEnded(true);
      submitScore();
    }
  }, [timeLeft, isGameStarted]);

  const generateQuestion = () => {
    const operations = ["+", "-", "*", "/"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let a, b;

    if (operation === "+") {
      a = Math.floor(Math.random() * 90) + 10;
      b = Math.floor(Math.random() * 90) + 10;
    } else if (operation === "-") {
      a = Math.floor(Math.random() * 90) + 10;
      b = Math.floor(Math.random() * a);
    } else if (operation === "*") {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
    } else if (operation === "/") {
      b = Math.floor(Math.random() * 9) + 1;
      a = b * (Math.floor(Math.random() * 10) + 1);
    }

    setCurrentQuestion({ a, b, operation });
  };

  useEffect(() => {
    if (isGameStarted) {
      generateQuestion();
    }
  }, [isGameStarted]);

  const handleAnswer = (e) => {
    const answer = e.target.value;
    setUserAnswer(answer);

    let correctAnswer;
    switch (currentQuestion.operation) {
      case "+":
        correctAnswer = currentQuestion.a + currentQuestion.b;
        break;
      case "-":
        correctAnswer = currentQuestion.a - currentQuestion.b;
        break;
      case "*":
        correctAnswer = currentQuestion.a * currentQuestion.b;
        break;
      case "/":
        correctAnswer = currentQuestion.a / currentQuestion.b;
        break;
      default:
        break;
    }

    if (parseFloat(answer) === correctAnswer) {
      setScore(score + 1);
      setUserAnswer("");
      generateQuestion();
    }
  };

  const submitScore = async () => {
    try {
      await axios.post("https://math-game-backend.onrender.com/submit", { userId, score });
      alert("Score submitted successfully.");
    } catch (error) {
      alert("Error submitting score.");
    }
  };

  const startGame = () => {
    if (userId.trim()) {
      setIsGameStarted(true);
      setIsGameEnded(false);
      setTimeLeft(60);
      setScore(0);
      generateQuestion();
    } else {
      alert("Please enter a valid user ID");
    }
  };

  const skipQuestion = () => {
    generateQuestion();
    setUserAnswer("");
  };

  return (
    <div className="container">
      <h1>Math Game</h1>
      {!isGameStarted && !isGameEnded ? (
        <div className="start-screen">
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={startGame}>Start</button>
        </div>
      ) : isGameEnded ? (
        <div className="end-screen">
          <h2>Game Over</h2>
          <p>Your score: {score}</p>
          <button onClick={() => window.location.reload()}>Restart</button>
        </div>
      ) : (
        <div className="game-screen">
          <p>Time left: {timeLeft} seconds</p>
          <p>
            {currentQuestion.a} {currentQuestion.operation} {currentQuestion.b}
          </p>
          <input
            type="text"
            value={userAnswer}
            onChange={handleAnswer}
            disabled={timeLeft === 0}
          />
          <div className="button-container">
            <button onClick={skipQuestion}>Skip Question</button>
          </div>
          <p>Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default App;
