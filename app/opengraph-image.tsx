import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// the picture shown when a link to the site is shared
export const alt = "ochar, homemade all-natural soap";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fondamento = await readFile(
    join(process.cwd(), "assets/fondamento-regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 15%, #9a4652 0%, #7a2834 60%)",
          fontFamily: "Fondamento",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: 14,
            background: "#fbf8f2",
            transform: "rotate(-1.5deg)",
            boxShadow: "0 30px 60px -20px rgba(43, 31, 27, 0.55)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "46px 110px 40px",
              border: "2px solid rgba(122, 40, 52, 0.45)",
              color: "#7a2834",
            }}
          >
            <div style={{ fontSize: 112, lineHeight: 1 }}>ochar</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 18,
                gap: 12,
              }}
            >
              <div style={{ width: 70, height: 1.5, background: "#d08b4f" }} />
              <div
                style={{
                  width: 11,
                  height: 11,
                  background: "#d08b4f",
                  transform: "rotate(45deg)",
                }}
              />
              <div style={{ width: 70, height: 1.5, background: "#d08b4f" }} />
            </div>
            <div style={{ marginTop: 22, fontSize: 44, color: "#2b1f1b" }}>
              Homemade, all-natural soap
            </div>
            <div style={{ marginTop: 12, fontSize: 28, color: "#6f5d53" }}>
              From the Tonoyans to you
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fondamento", data: fondamento, style: "normal", weight: 400 }],
    },
  );
}
