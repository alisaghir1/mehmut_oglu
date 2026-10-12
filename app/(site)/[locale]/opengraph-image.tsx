import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Mehmet Oglu — Döner & İskender";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tr = locale === "tr";
  const [logo, playfair] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/logo-512.png")),
    readFile(join(process.cwd(), "public/fonts/PlayfairDisplay-Bold.ttf")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 72,
          background: "linear-gradient(135deg, #111 0%, #1b1b1b 60%, #222 100%)",
          color: "#f0dbbc",
          fontFamily: "Playfair",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={340} height={378} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: "#d8c1a2" }}>
            {tr ? "1928'den beri · İstanbul" : "Since 1928 · İstanbul"}
          </div>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1, color: "#f7f1e7", letterSpacing: -3 }}>Mehmet Oglu</div>
          <div style={{ fontSize: 40, color: "#f0dbbc" }}>Döner &amp; İskender</div>
          <div style={{ width: 120, height: 2, background: "#880807", marginTop: 10 }} />
          <div style={{ fontSize: 20, letterSpacing: 6, textTransform: "uppercase", color: "#8a877a" }}>
            {tr ? "Bir asırlık lezzet" : "A century of flavours"}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Playfair", data: playfair, weight: 700, style: "normal" }] },
  );
}
