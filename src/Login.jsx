// src/Login.jsx
import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const Login = ({ onUserChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // ユーザー状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      onUserChange(currentUser); // App.jsx に通知
    });
    return () => unsubscribe();
  }, []);

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", marginBottom: "1rem" }}>
      {user ? (
        <div>
          <p>✅ ログイン中: {user.email}</p>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      ) : (
        <div>
          <h3>ログイン / 新規登録</h3>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <button onClick={handleLogin}>ログイン</button>
          <button onClick={handleSignup}>新規登録</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;
