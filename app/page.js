export default function Home() {
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
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "60px", marginBottom: "10px" }}>
          MARTIN
        </h1>

        <p style={{ fontSize: "20px", opacity: 0.7 }}>
          مارتن ينتظرك...
        </p>
      </div>
    </main>
  );
}
