"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [step, setStep] = useState("name");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState(null);

  function enter() {
    if (!name.trim()) {
      alert("اكتب اسمك أولاً");
      return;
    }

    setStep("role");
  }

  async function requestJoin(selectedRole) {
    if (loading) return;

    setLoading(true);

    try {
      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .select("id, entry_locked")
        .eq("room_code", "MARTIN001")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        alert("تعذر العثور على جلسة MARTIN.");
        setLoading(false);
        return;
      }

      if (session.entry_locked) {
        alert("الدخول مقفل حاليًا.");
        setLoading(false);
        return;
      }

      const databaseRole =
        selectedRole === "لاعب" ? "player" : "spectator";

      const { data: request, error: joinError } = await supabase
        .from("join_requests")
        .insert({
          session_id: session.id,
          name: name.trim(),
          requested_role: databaseRole,
          status: "pending",
        })
        .select("id")
        .single();

      if (joinError || !request) {
        console.error("Join request error:", joinError);
        alert("تعذر إرسال طلب الدخول. حاول مرة ثانية.");
        setLoading(false);
        return;
      }

      setRole(selectedRole);
      setRequestId(request.id);
      setStep("waiting");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("حدث خطأ أثناء إرسال الطلب.");
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!requestId || step !== "waiting") return;

    let active = true;

    async function checkStatus() {
      const { data, error } = await supabase
        .from("join_requests")
        .select("status, requested_role")
        .eq("id", requestId)
        .single();

      if (!active || error || !data) return;

      if (data.status === "approved") {
        setStep("approved");

        setTimeout(() => {
          if (data.requested_role === "player") {
            router.push(`/player?request=${requestId}`);
          } else {
            setStep("spectator");
          }
        }, 800);
      }

      if (data.status === "rejected") {
        setStep("rejected");
      }
    }

    checkStatus();

    const interval = setInterval(checkStatus, 1500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [requestId, step, router]);

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
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "58px", margin: "0 0 10px" }}>
          MARTIN
        </h1>

        {step === "name" && (
          <>
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
              onClick={enter}
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
          </>
        )}

        {step === "role" && (
          <>
            <p style={{ color: "#aaa", marginBottom: "8px" }}>
              أهلًا {name}
            </p>

            <h2 style={{ marginBottom: "30px" }}>
              كيف بتدخل الليلة؟
            </h2>

            <button
              onClick={() => requestJoin("لاعب")}
              disabled={loading}
              style={{
                width: "100%",
                padding: "18px",
                marginBottom: "12px",
                borderRadius: "12px",
                border: "none",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? "جاري إرسال الطلب..." : "🎮 لاعب"}
            </button>

            <button
              onClick={() => requestJoin("متفرج")}
              disabled={loading}
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "12px",
                border: "1px solid #444",
                background: "#111",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              👁️ متفرج
            </button>
          </>
        )}

        {step === "waiting" && (
          <>
            <div style={{ fontSize: "50px", margin: "30px 0 20px" }}>
              ⏳
            </div>

            <h2>طلبك وصل إلى MARTIN</h2>

            <p style={{ color: "#999", lineHeight: "1.8" }}>
              أهلًا {name}، طلبت الدخول كـ {role}.
              <br />
              بانتظار موافقة المضيف...
            </p>

            <div
              style={{
                marginTop: "25px",
                padding: "14px",
                border: "1px solid #222",
                background: "#0d0d0d",
                borderRadius: "12px",
                color: "#777",
              }}
            >
              لا تقفل الصفحة، MARTIN بيرجع لك هنا.
            </div>
          </>
        )}

        {step === "approved" && (
          <>
            <div style={{ fontSize: "55px", margin: "30px 0 20px" }}>
              ✅
            </div>

            <h2>تم قبولك</h2>

            <p style={{ color: "#999" }}>
              MARTIN يدخلك الآن...
            </p>
          </>
        )}

        {step === "rejected" && (
          <>
            <div style={{ fontSize: "55px", margin: "30px 0 20px" }}>
              ✕
            </div>

            <h2>لم تتم الموافقة على الدخول</h2>

            <p style={{ color: "#999" }}>
              MARTIN رفض طلب الدخول لهذه الجلسة.
            </p>

            <button
              onClick={() => {
                setStep("name");
                setRequestId(null);
                setRole("");
              }}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "16px",
                borderRadius: "12px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              رجوع
            </button>
          </>
        )}

        {step === "spectator" && (
          <>
            <div style={{ fontSize: "55px", margin: "30px 0 20px" }}>
              👁️
            </div>

            <h2>تم قبولك كمتفرج</h2>

            <p style={{ color: "#999" }}>
              أنت الآن داخل جلسة MARTIN.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
