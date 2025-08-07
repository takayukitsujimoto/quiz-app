import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const Results = ({ user, goHome }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      const q = query(
        collection(db, "results"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(), // 安全に変換
        };
      });
      setResults(fetched);
      setLoading(false);
    };

    fetchResults();
  }, [user]);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={goHome}>← ホームに戻る</button>
      <h2>{user.email} さんの成績一覧</h2>
      {results.length === 0 ? (
        <p>まだ成績がありません。</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>日付</th>
              <th>得点</th>
              <th>正答率</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.createdAt.toLocaleString()}</td>
                <td>{r.score} / {r.total}</td>
                <td>{r.correctRate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Results;
