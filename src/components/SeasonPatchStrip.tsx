import { useEffect, useState } from "react";

const PATCH_NOTES = [
  "Season 1 final standings are now locked and rewards have been distributed.",
  "PvP ladder placements for Season 1 are permanently recorded on the leaderboard.",
  "Season 2 is in development — new maps, classes, and guild mechanics incoming.",
];

export default function SeasonPatchStrip() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <section style={{ marginBottom: 52 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 14,
          alignItems: "stretch",
        }}
      >
        {/* Season ended card */}
        <div
          style={{
            padding: "22px 22px",
            border: "0.5px solid rgba(139,92,246,0.3)",
            background: "linear-gradient(155deg, rgba(6,4,16,0.95) 0%, rgba(4,4,12,0.98) 100%)",
            borderRadius: 18,
            backdropFilter: "blur(14px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 55% at 20% 0%, rgba(139,92,246,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(139,92,246,0.12)", border: "0.5px solid rgba(139,92,246,0.3)",
              borderRadius: 999, padding: "3px 12px", fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(196,181,253,0.9)",
              marginBottom: 14,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(196,181,253,0.5)" }} />
              Season 1 — Ended
            </div>
            <div style={{ fontSize: "clamp(1.6rem, 4vw, 2.1rem)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 8, color: "#fff", fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif" }}>
              Closed
            </div>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
              Season 1 has concluded. All ranked titles, rewards, and placements are finalized. Stay tuned for Season 2.
            </p>
          </div>
        </div>

        {/* Patch notes card */}
        <div
          style={{
            padding: "22px 22px",
            background: "rgba(4,4,10,0.96)",
            border: "0.5px solid rgba(255,255,255,0.07)",
            borderRadius: 18,
            backdropFilter: "blur(14px)",
          }}
        >
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 14 }}>
            Season 1 recap · patch notes
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {PATCH_NOTES.map(line => (
              <li key={line} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.52)", lineHeight: 1.55, paddingLeft: 14, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, top: "0.45em", width: 5, height: 5, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #22d3ee)", opacity: 0.9 }} />
                {line}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(34,211,238,0.07)", border: "0.5px solid rgba(34,211,238,0.2)", borderRadius: 999, padding: "5px 14px" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22d3ee", opacity: 0.8 }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(103,232,249,0.75)" }}>Season 2 coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
