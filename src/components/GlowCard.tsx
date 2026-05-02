import { useState } from "react";

interface GlowCardProps {
  name: string;
  subtitle: string;
  power: number;
  rarity: "Common" | "Rare" | "Legendary";
  icon: React.ReactNode;
  element: string;
  imageUrl?: string;
}

const rarityGlow: Record<string, string> = {
  Common: "rgba(255,255,255,0.15)",
  Rare: "rgba(255,255,255,0.35)",
  Legendary: "rgba(255,255,255,0.6)",
};

export default function GlowCard({ name, subtitle, power, rarity, icon, element, imageUrl }: GlowCardProps) {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: `radial-gradient(circle at 50% 0%, #2a2a2a 0%, #111 64%)`,
        boxShadow: active
          ? `inset 0 1rem 0.2rem -1rem #fffa, inset 0 -4rem 3rem -3rem #000a,
             0 -1rem 0.2rem -1rem #fffa, 0 1rem 0.2rem -1rem #000,
             0 0 0 1px ${rarityGlow[rarity]}, 0 4px 4px 0 #0004`
          : `inset 0 1rem 0.2rem -1rem #fff0, 0 0 0 1px ${rarityGlow[rarity]}, 0 4px 4px 0 #0004`,
        width: "100%",
        borderRadius: "1.6rem",
        color: "#fff",
        padding: "1.2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        transition: "all 0.4s ease-in-out, transform 0.3s ease-out",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        overflow: "hidden",
        cursor: "pointer",
        minHeight: 280,
        aspectRatio: "3/4",
      }}
    >
      {/* Light layer */}
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "100%", pointerEvents: "none" }}>
        {/* Slit */}
        <div style={{
          position: "absolute",
          left: 0, right: 0, top: 0, bottom: 0, margin: "auto",
          width: "64%",
          height: "1.2rem",
          transform: "rotateX(-76deg)",
          background: active ? "#fff" : "#0f0f0f",
          boxShadow: active ? "0 0 6px 0 #fff" : "none",
          transition: "all 0.4s ease-in-out",
        }} />

        {/* Lumen */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0, bottom: 0, margin: "auto",
          width: "100%", height: "100%",
          pointerEvents: "none",
          perspective: 400,
          opacity: active ? 0.5 : 0,
          transition: "opacity 0.4s ease-in-out",
        }}>
          <div style={{ width: "70%", height: "3rem", background: "linear-gradient(#fff0, #fffa)", position: "absolute", left: 0, right: 0, top: 0, bottom: "2.5rem", margin: "auto", transform: "rotateX(-42deg)", opacity: 0.4 }} />
          <div style={{ width: "74%", height: "8rem", background: "linear-gradient(#fff0, #fffa)", position: "absolute", left: 0, right: 0, top: 0, bottom: "6rem", margin: "auto", transform: "rotateX(-42deg)", filter: "blur(1rem)", opacity: 0.8, borderRadius: "100% 100% 0 0" }} />
          <div style={{ width: "50%", height: "8rem", background: "linear-gradient(#fff0, #fffa)", position: "absolute", left: 0, right: 0, top: 0, bottom: "8rem", margin: "auto", transform: "rotateX(22deg)", filter: "blur(1rem)", opacity: 0.6, borderRadius: "100% 100% 0 0" }} />
        </div>

        {/* Darken */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0, bottom: 0, margin: "auto",
          width: "100%", height: "100%",
          pointerEvents: "none",
          opacity: active ? 0.8 : 0.2,
          transition: "opacity 0.4s ease-in-out",
        }}>
          <div style={{ width: "64%", height: "6rem", background: "linear-gradient(#000, #0000)", position: "absolute", left: 0, right: 0, top: "6rem", filter: "blur(0.2rem)", opacity: active ? 0.2 : 0.05, borderRadius: "0 0 100% 100%", transform: "rotateX(-22deg)", margin: "auto" }} />
          <div style={{ width: "62%", height: "6rem", background: "linear-gradient(#000a, #0000)", position: "absolute", left: 0, right: 0, top: "8rem", filter: "blur(0.8rem)", opacity: active ? 1 : 0.2, borderRadius: "0 0 100% 100%", transform: "rotateX(22deg)", margin: "auto" }} />
        </div>
      </div>

      {/* Icon / Image */}
      <div style={{
        position: "absolute",
        top: "0.8rem",
        left: 0, right: 0,
        margin: "auto",
        width: "fit-content",
        filter: active ? `drop-shadow(0 -1.2rem 2px rgba(0,0,0,0.3)) brightness(1.6)` : `drop-shadow(0 -1.2rem 1px transparent)`,
        transition: "filter 0.4s ease-in-out",
      }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: 110,
              height: 110,
              objectFit: "cover",
              borderRadius: 14,
              opacity: 0.92,
              filter: "contrast(1.1) saturate(0.75)",
              display: "block",
            }}
          />
        ) : icon}
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h4 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "1rem", color: "#ccc", fontFamily: "Outfit, sans-serif", fontWeight: 600 }}>{name}</h4>
        <p style={{ margin: 0, paddingBottom: "0.5rem", color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontWeight: 300, borderBottom: "0.5px solid rgba(255,255,255,0.08)", fontFamily: "Outfit, sans-serif", maxWidth: "80%" }}>
          {element} · PWR {power}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.6rem" }}>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontFamily: "Outfit, sans-serif" }}>{subtitle}</span>
          <div
            onClick={() => setActive(a => !a)}
            style={{
              height: "1.6rem",
              width: "3.8rem",
              borderRadius: "0.5rem",
              background: "#000",
              boxShadow: active
                ? "inset 0 -6px 6px 0.2rem #0004, inset 0 0 1px 0.3rem #ddd, inset 0 -1px 1px 0.3rem #fff, inset 0 0 1px 0.6rem #aaa"
                : "inset 0 -6px 6px 0.2rem #0004, inset 0 0 1px 0.2rem #555",
              cursor: "pointer",
              transition: "all 0.4s ease-in-out",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div style={{
              position: "absolute",
              left: 0, right: 0, top: 0, bottom: 0, margin: "auto",
              width: "2.6rem", height: "0.5rem", borderRadius: "0.2rem",
              background: active ? "rgba(255,255,255,0.9)" : "#000",
              boxShadow: active ? "0 0 0.3rem 0.15rem rgba(255,255,255,0.5)" : "none",
              transition: "all 0.4s ease-in-out",
            }} />
            <div style={{
              position: "absolute",
              top: 0, bottom: "0.04rem", margin: "auto",
              left: active ? "calc(60% - 0.3rem)" : "0.5rem",
              width: "35%", height: "30%",
              background: active ? "#fff" : "#888",
              borderRadius: "0.2rem",
              boxShadow: active ? "inset 0 1px 10px 0 #fff, 0 0 2px 1px rgba(255,255,255,0.2)" : "inset 0 1px 4px 0 #fff, 0 0 1px 1px #0003",
              transition: "all 0.4s ease-in-out",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
