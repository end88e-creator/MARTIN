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

  async function loadSession() {
    setLoading(true);

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("room_code", "MARTIN001")
      .eq("status", "lobby")
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

  async function approve(id) {
    if (!session) return;

    const { error } = await supabase
      .from("join_requests")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error("MARTIN APPROVE:", error);
      alert("صار خطأ أثناء الموافقة.");
      return;
    }

    await loadRequests(session.id);
  }

  async function reject(id) {
    if (!session) return;

    const { error } = await supabase
      .from("join_requests")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      console.error("MARTIN REJECT:", error);
      alert("صار خطأ أثناء الرفض.");
      return;
    }

    await loadRequests(session.id);
  }

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`martin-owner-${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "join_requests",
          filter: `session_id=eq.${session.id}`,
        },
        () => {
          loadRequests(session.id);
        }
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

  function statusText(status) {
    if (status === "approved") return "✓ تمت الموافقة";
    if (status === "rejected") return "✕ تم الرفض";
    return "⏳ بانتظار القرار";
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
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "44px",
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

        {loading ? (
          <p
            style={{
              color: "#777",
              marginTop: "50px",
            }}
          >
            جاري الاتصال بجلسة MARTIN...
          </p>
        ) : !session ? (
          <div
            style={{
              marginTop: "60px",
              padding: "22px",
              border: "1px solid #333",
              borderRadius: "16px",
              background: "#101010",
            }}
          >
            <h2>تعذر العثور على MARTIN001</h2>

            <p
              style={{
                color: "#888",
                lineHeight: 1.8,
              }}
            >
              لا توجد حالياً جلسة MARTIN001 بحالة lobby.
            </p>

            <button
              onClick={loadSession}
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "15px",
                border: 0,
                borderRadius: "12px",
                background: "white",
                color: "black",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              إعادة المحاولة
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
              <div
                style={{
                  color: "#888",
                  fontSize: "14px",
                }}
              >
                الجلسة الحالية
              </div>

              <div
                style={{
                  marginTop: "7px",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                🟢 MARTIN001
              </div>

              <div
                style={{
                  color: "#777",
                  marginTop: "7px",
                }}
              >
                الحالة: lobby
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "15px",
                marginTop: "40px",
              }}
            >
              <h2 style={{ margin: 0 }}>
                طلبات الدخول
              </h2>

              <button
                onClick={() => loadRequests(session.id)}
                style={{
                  padding: "9px 13px",
                  borderRadius: "10px",
                  border: "1px solid #333",
                  background: "#111",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                تحديث
              </button>
            </div>

            {requests.length === 0 ? (
              <div
                style={{
                  marginTop: "20px",
                  padding: "25px",
                  textAlign: "center",
                  border: "1px solid #222",
                  borderRadius: "16px",
                  color: "#777",
                  background: "#0d0d0d",
                }}
              >
                لا توجد طلبات دخول حالياً.
              </div>
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
                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: "8px",
                      fontSize: "22px",
                    }}
                  >
                    {request.name}
                  </h3>

                  <p
                    style={{
                      color: "#aaa",
                      margin: "5px 0",
                    }}
                  >
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
                          background: "white",
                          color: "black",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        ✓ موافقة
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
                        ✕ رفض
                      </button>
                    </div>
                  ) : (
                    <p
                      style={{
                        color:
                          request.status === "approved"
                            ? "#aaa"
                            : "#777",
                        marginTop: "18px",
                      }}
                    >
                      {statusText(request.status)}
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
