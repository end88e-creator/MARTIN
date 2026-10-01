"use client";

import { useState } from "react";

export default function PlayerPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  function sendMessage() {
    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    const newMessage = {
      id: Date.now(),
      sender: "player",
      text: cleanMessage,
    };

    setMessages((current) => [...current, newMessage]);
    setMessage("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

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
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "4px",
          }}
        >
          MARTIN
        </h1>

        <p
          style={{
            color: "#888",
            marginTop: "0",
          }}
        >
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
          <p
            style={{
              color: "#888",
              marginTop: "0",
            }}
          >
            رسالة من MARTIN
          </p>

          <h2>جاهز؟ اللعبة بدأت.</h2>

          <p
            style={{
              color: "#bbb",
              marginBottom: "0",
            }}
          >
            تعليماتك ومهماتك السرية راح تظهر هنا.
          </p>
        </div>

        {messages.length > 0 && (
          <div
            style={{
              marginTop: "28px",
            }}
          >
            {messages.map((item) => (
              <div
                key={item.id}
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "14px 17px",
                    borderRadius: "16px",
                    background: "#fff",
                    color: "#000",
                    lineHeight: "1.6",
                    wordBreak: "break-word",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "5px",
                    }}
                  >
                    أنت
                  </div>

                  {item.text}
                </div>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
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
            resize: "vertical",
            outline: "none",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!message.trim()}
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
            cursor: message.trim() ? "pointer" : "default",
            opacity: message.trim() ? 1 : 0.5,
          }}
        >
          إرسال إلى MARTIN
        </button>
      </div>
    </main>
  );
}
