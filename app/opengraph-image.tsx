import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Foliofast — The portfolio that gets you hired";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #07070f 0%, #1a0a2e 50%, #07070f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, color: "#ffffff", marginBottom: 16 }}>
          Foliofast
        </div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 700 }}>
          The portfolio that gets you hired.
        </div>
        <div
          style={{
            marginTop: 40,
            background: "linear-gradient(90deg, #7c3aed, #4f46e5)",
            borderRadius: 100,
            padding: "12px 32px",
            color: "#ffffff",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          Build yours free →
        </div>
      </div>
    ),
    size
  );
}
