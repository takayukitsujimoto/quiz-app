import React, { useState } from "react";
import allQuestions from "./questions.json";

// ランダムに配列をシャッフルする関数
function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function App() {
  // 初回読み込み時に10問をランダムに選択
  const shuffledQuestions = shuffleArray(allQuestions).slice(0, 10);
  const [questions] = useState(shuffledQuestions);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = () => {
    if (selected === null) return;

    if (currentQuestion.choices[selected].isCorrect) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelected(null);
    setShowExplanation(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>演習終了！</h1>
        <p>正解数: {score} / {questions.length}</p>
        <p>正答率: {(score / questions.length * 100).toFixed(1)}%</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>問題 {currentIndex + 1}</h2>
      <p>{currentQuestion.text}</p>
      {currentQuestion.image && <img src={currentQuestion.image} alt="問題画像" width="300" />}
      <div>
        {currentQuestion.choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            style={{
              background: selected === idx ? "#add8e6" : "#eee",
              margin: "0.5rem",
              padding: "0.5rem 1rem"
            }}
          >
            {choice.text}
          </button>
        ))}
      </div>
      {!showExplanation ? (
        <button onClick={handleAnswer} disabled={selected === null}>
          回答する
        </button>
      ) : (
        <div>
          <p>
            {currentQuestion.choices[selected].isCorrect ? "✅ 正解！" : "❌ 不正解"}
          </p>
          <div>
            <strong>解説:</strong>
            {currentQuestion.explanation.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
          <button onClick={handleNext}>次の問題へ</button>
        </div>
      )}
    </div>
  );
}

export default App;
