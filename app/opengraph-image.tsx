import { ImageResponse } from "next/og";

export const alt = "Richard Foto storytelling photography Budapest";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111111",
          color: "#f7f2ea",
          padding: 72,
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "rgba(247,242,234,0.66)",
          }}
        >
          Budapest storytelling photography
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 104, lineHeight: 0.94 }}>Richard Foto</div>
          <div
            style={{
              maxWidth: 760,
              fontSize: 34,
              lineHeight: 1.25,
              color: "rgba(247,242,234,0.76)",
            }}
          >
            Timeless moments, honest stories.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
