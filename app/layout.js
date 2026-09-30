export const metadata = {
  title: "MARTIN",
  description: "MARTIN — اللعبة تبدأ هنا",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#050505",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
