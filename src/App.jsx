import React, { useState, useEffect } from "react";
import allQuestions from "./questions.json";

function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

const categories = ["呼吸器", "循環器", "消化器"];

function App() {
  const [view, setView] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [records, setRecords] = useState([]);

  const currentQuestion = questions[currentIndex];

  // 初回ロード時に localStorage から成績を読み込む
  useEffect(() => {
    const saved = localStorage.getItem("quizRecords");
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  const saveRecord = (category, score, total) => {
    const newRecord = {
      date: new Date().toLocaleString(),
      category: category || "全カテゴリ",
      score,
      total
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem("quizRecords", JSON.stringify(updated));
  };

  const startQuiz = (category) => {
    const filtered = category
      ? allQuestions.filter(q => q.category === category)
      : allQuestions;
    const shuffled = shuffleArray(filtered).slice(0, 10);
    setSelectedCategory(category);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setShowExplanation(false);
    setView("quiz");
  };

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
      // 成績保存
      saveRecord(selectedCategory, score + (currentQuestion.choices[selected].isCorrect ? 1 : 0), questions.length);
      setView("result");
    }
  };

  const goHome = () => {
    setView("home");
    setSelectedCategory(null);
  };

  if (view === "home") {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>臓器別クイズアプリ</h1>
        <p>出題カテゴリを選んでください：</p>
        <button
          onClick={() => startQuiz(null)}
          style={{
            margin: "0.5rem",
            padding: "1rem",
            fontSize: "1rem",
            backgroundColor: "#f0c040"
          }}
        >
          🔀 全カテゴリからランダム出題
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => startQuiz(cat)}
            style={{
              margin: "0.5rem",
              padding: "1rem",
              fontSize: "1rem"
            }}
          >
            {cat}
          </button>
        ))}

        <h2 style={{ marginTop: "2rem" }}>📊 過去の成績</h2>
        {records.length === 0 ? (
          <p>まだ成績はありません</p>
        ) : (
          <ul>
            {records.map((rec, idx) => (
              <li key={idx}>
                [{rec.date}] {rec.category} - {rec.score}/{rec.total} ({(rec.score / rec.total * 100).toFixed(1)}%)
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (view === "result") {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>{selectedCategory || "全カテゴリ"}クイズ 終了！</h1>
        <p>正解数: {score} / {questions.length}</p>
        <p>正答率: {(score / questions.length * 100).toFixed(1)}%</p>
        <button onClick={goHome}>ホームにもどる</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{selectedCategory || "全カテゴリ"}：問題 {currentIndex + 1}</h2>
      <p>{currentQuestion.text}</p>
      {currentQuestion.image && (
        <img src={currentQuestion.image} alt="問題画像" width="300" />
      )}
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
            {currentQuestion.explanation.split("\n").map((line, idx) => (
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
