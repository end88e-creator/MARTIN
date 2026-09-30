"use client";

import { useState } from "react";

export default function PlayerPage() {
  const [message, setMessage] = useState("");

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding: "24px",
        fontFamily: "Arial",
      }}
    >
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "4px" }}>MARTIN</h1>

        <p style={{ color: "#888", marginTop: "0" }}>
          غرفتك الخاصة
        </p>

        <div
          style={{
            marginTop: "40px",
            padding: "22px",
            border: "1px solid #333",
            borderRadius: "18px",
            background: "#111",
          }}
        >
          <p style={{ color: "#888", marginTop: "0" }}>رسالة من MARTIN</p>

          <h2>جاهز؟ اللعبة بدأت.</h2>

          <p style={{ color: "#bbb" }}>
            تعليماتك ومهماتك السرية راح تظهر هنا.
          </p>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك إلى MARTIN..."
          style={{
            width: "100%",
            marginTop: "24px",
            minHeight: "100px",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
          }}
        />

        <button
          onClick={() => setMessage("")}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "17px",
            border: "0",
            borderRadius: "16px",
            background: "#fff",
            color: "#000",
            fontWeight: "bold",
            fontSize: "17px",
          }}
        >
          إرسال إلى MARTIN
        </button>
      </div>
    </main>
  );
}
