"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>
        <h1 style={{ fontSize: "58px", margin: "0 0 10px" }}>MARTIN</h1>

        <p style={{ color: "#999", marginBottom: "40px" }}>
          مارتن ينتظرك...
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اكتب اسمك"
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #333",
            background: "#111",
            color: "white",
            textAlign: "center",
            outline: "none",
            marginBottom: "14px",
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border: "none",
            background: "white",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          دخول
        </button>
      </div>
    </main>
  );
}
