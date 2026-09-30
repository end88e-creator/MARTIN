"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function OwnerPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    const { data, error } = await supabase
      .from("join_requests")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("MARTIN:", error);
      setLoading(false);
      return;
    }

    setPlayers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();

    const channel = supabase
      .channel("martin-join-requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "join_requests",
        },
        () => {
          loadRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function approve(id) {
    const { error } = await supabase
      .from("join_requests")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      alert("صار خطأ أثناء الموافقة");
      console.error(error);
      return;
    }

    loadRequests();
  }

  async function reject(id) {
    const { error } = await supabase
      .from("join_requests")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      alert("صار خطأ أثناء الرفض");
      console.error(error);
      return;
    }

    loadRequests();
  }

  function statusText(status) {
    if (status === "approved") return "تمت الموافقة";
    if (status === "rejected") return "مرفوض";
    return "بانتظار الموافقة";
  }

  function roleText(role) {
    if (role === "player") return "لاعب";
    if (role === "spectator") return "متفرج";
    return role;
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
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "5px",
          }}
        >
          MARTIN
        </h1>

        <p
          style={{
            color: "#888",
            marginTop: 0,
          }}
        >
          OWNER CONTROL
        </p>

        <h2 style={{ marginTop: "50px" }}>طلبات الدخول</h2>

        {loading ? (
          <p style={{ color: "#777" }}>جاري تحميل الطلبات...</p>
        ) : players.length === 0 ? (
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
                {roleText(player.requested_role)} —{" "}
                {statusText(player.status)}
              </p>

              {player.status === "pending" && (
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
