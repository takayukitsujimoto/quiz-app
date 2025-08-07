import React, { useState } from "react";
import allQuestions from "./questions.json";
import Login from "./Login";

// カテゴリ一覧を取得（例: 呼吸器, 循環器...）
const getCategories = (questions) => {
  const set = new Set(questions.map((q) => q.category));
  return [...set];
};

function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function App() {
  const [user, setUser] = useState(null); // 🔑 ログイン状態管理
  const [view, setView] = useState("home"); // home or quiz
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const startQuiz = (category) => {
    const filtered = category === "all"
      ? allQuestions
      : allQuestions.filter((q) => q.category === category);
    const shuffled = shuffleArray(filtered).slice(0, 10);
    setCurrentQuestions(shuffled);
    setCurrentIndex(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setView("quiz");
  };

  const handleAnswer = () => {
    if (selected === null) return;

    if (currentQuestions[currentIndex].choices[selected].isCorrect) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelected(null);
    setShowExplanation(false);
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const goHome = () => {
    setView("home");
  };

  if (view === "quiz") {
    const q = currentQuestions[currentIndex];
    return (
      <div style={{ padding: "2rem" }}>
        <button onClick={goHome}>ホームに戻る</button>
        <h2>問題 {currentIndex + 1}</h2>
        <p>{q.text}</p>
        {q.image && <img src={q.image} alt="問題画像" width="300" />}
        <div>
          {q.choices.map((choice, idx) => (
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
              {q.choices[selected].isCorrect ? "✅ 正解！" : "❌ 不正解"}
            </p>
            <p>
              <strong>解説:</strong><br />
              {q.explanation.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </p>
            <button onClick={handleNext}>次の問題へ</button>
          </div>
        )}
        {finished && (
          <div>
            <h2>演習終了！</h2>
            <p>正解数: {score} / {currentQuestions.length}</p>
            <p>正答率: {(score / currentQuestions.length * 100).toFixed(1)}%</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      {/* 🔐 ログインUI */}
      <Login onUserChange={setUser} />
      
      <h1>臓器別クイズアプリ</h1>
      <p>出題カテゴリを選んでください。</p>

      <button onClick={() => startQuiz("all")}>全カテゴリから10問出題</button>
      
      {getCategories(allQuestions).map((category) => (
        <div key={category} style={{ marginTop: "1rem" }}>
          <button onClick={() => startQuiz(category)}>{category}の問題を解く</button>
        </div>
      ))}
    </div>
  );
}

export default App;
