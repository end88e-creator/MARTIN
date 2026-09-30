"use client";

import { useState } from "react";

export default function OwnerPage() {
  const [players, setPlayers] = useState([
    { id: 1, name: "محمد", role: "لاعب", status: "بانتظار الموافقة" },
  ]);

  function approve(id) {
    setPlayers((current) =>
      current.map((player) =>
        player.id === id
          ? { ...player, status: "تمت الموافقة" }
          : player
      )
    );
  }

  function reject(id) {
    setPlayers((current) =>
      current.filter((player) => player.id !== id)
    );
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: "32px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "5px" }}>
          MARTIN
        </h1>

        <p style={{ color: "#888", marginTop: 0 }}>
          OWNER CONTROL
        </p>

        <h2 style={{ marginTop: "50px" }}>
          طلبات الدخول
        </h2>

        {players.length === 0 ? (
          <p style={{ color: "#777" }}>لا توجد طلبات حالياً.</p>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              style={{
                border: "1px solid #333",
                borderRadius: "18px",
                padding: "20px",
                marginTop: "15px",
                background: "#101010",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{player.name}</h3>

              <p style={{ color: "#aaa" }}>
                {player.role} — {player.status}
              </p>

              {player.status === "بانتظار الموافقة" && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "18px",
                  }}
                >
                  <button
                    onClick={() => approve(player.id)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      border: 0,
                      borderRadius: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    موافقة
                  </button>

                  <button
                    onClick={() => reject(player.id)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      border: "1px solid #444",
                      borderRadius: "12px",
                      background: "#151515",
                      color: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    رفض
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
