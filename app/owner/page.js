"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function OwnerPage() {
  const [session, setSession] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function loadSession() {
    setLoading(true);

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("room_code", "MARTIN001")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("MARTIN SESSION:", error);
      setLoading(false);
      return;
    }

    setSession(data || null);

    if (data) {
      await loadRequests(data.id);
    } else {
      setRequests([]);
    }

    setLoading(false);
  }

  async function loadRequests(sessionId) {
    const { data, error } = await supabase
      .from("join_requests")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("MARTIN REQUESTS:", error);
      return;
    }

    setRequests(data || []);
  }

  async function openSession() {
    setCreating(true);

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        room_code: "MARTIN001",
        status: "open",
      })
      .select()
      .single();

    setCreating(false);

    if (error) {
      console.error("MARTIN OPEN SESSION:", error);
      alert("تعذر فتح جلسة MARTIN.");
      return;
    }

    setSession(data);
    setRequests([]);
  }

  async function closeSession() {
    if (!session) return;

    const { error } = await supabase
      .from("sessions")
      .update({ status: "closed" })
      .eq("id", session.id);

    if (error) {
      console.error(error);
      alert("تعذر إغلاق الجلسة.");
      return;
    }

    setSession(null);
    setRequests([]);
  }

  async function approve(id) {
    const { error } = await supabase
      .from("join_requests")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      alert("صار خطأ أثناء الموافقة.");
      return;
    }

    await loadRequests(session.id);
  }

  async function reject(id) {
    const { error } = await supabase
      .from("join_requests")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      alert("صار خطأ أثناء الرفض.");
      return;
    }

    await loadRequests(session.id);
  }

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel(`martin-${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "join_requests",
          filter: `session_id=eq.${session.id}`,
        },
        () => loadRequests(session.id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  function roleText(role) {
    if (role === "player") return "🎮 لاعب";
    if (role === "spectator") return "👁️ متفرج";
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
        <h1 style={{ fontSize: "44px", marginBottom: "5px" }}>
          MARTIN
        </h1>

        <p style={{ color: "#888", marginTop: 0 }}>
          OWNER CONTROL
        </p>

        {loading ? (
          <p style={{ color: "#777", marginTop: "50px" }}>
            جاري تحميل MARTIN...
          </p>
        ) : !session ? (
          <div style={{ marginTop: "60px" }}>
            <h2>لا توجد جلسة مفتوحة</h2>

            <p style={{ color: "#888", lineHeight: 1.8 }}>
              افتح الجلسة أولاً، وبعدها يقدر اللاعبون والمتفرجون يرسلون طلبات الدخول.
            </p>

            <button
              onClick={openSession}
              disabled={creating}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "18px",
                border: 0,
                borderRadius: "14px",
                background: "white",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {creating ? "جاري فتح الجلسة..." : "فتح جلسة MARTIN"}
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                marginTop: "35px",
                padding: "18px",
                border: "1px solid #333",
                borderRadius: "16px",
                background: "#101010",
              }}
            >
              <div style={{ color: "#888", fontSize: "14px" }}>
                حالة الجلسة
              </div>

              <div
                style={{
                  marginTop: "7px",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                🟢 MARTIN مفتوح
              </div>

              <button
                onClick={closeSession}
                style={{
                  marginTop: "16px",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "1px solid #444",
                  background: "#151515",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                إغلاق الجلسة
              </button>
            </div>

            <h2 style={{ marginTop: "45px" }}>
              طلبات الدخول
            </h2>

            {requests.length === 0 ? (
              <p style={{ color: "#777" }}>
                بانتظار طلبات اللاعبين...
              </p>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  style={{
                    border: "1px solid #333",
                    borderRadius: "16px",
                    padding: "20px",
                    marginTop: "14px",
                    background: "#101010",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    {request.name}
                  </h3>

                  <p style={{ color: "#aaa" }}>
                    {roleText(request.requested_role)}
                  </p>

                  {request.status === "pending" ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "18px",
                      }}
                    >
                      <button
                        onClick={() => approve(request.id)}
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
                        onClick={() => reject(request.id)}
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
                  ) : (
                    <p style={{ color: "#777" }}>
                      {request.status === "approved"
                        ? "✓ تمت الموافقة"
                        : "✕ تم الرفض"}
                    </p>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </main>
  );
}
