import { useEffect, useState } from "react";

const SEASON_END = new Date(Date.UTC(2026, 7, 1, 23, 59, 59));

const PATCH_NOTES = [
  "PvP ladders now refresh weekly standings on the leaderboard.",
  "Guild spotlight pulls live kill aggregates from ranked players.",
  "Portal profiles sync Solars, gems, and dungeon floor from the bot API.",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function SeasonPatchStrip() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick(x => x + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const now = new Date();
  const ms = Math.max(0, SEASON_END.getTime() - now.getTime());
  const d = Math.floor(ms / (24 * 3600 * 1000));
  const h = Math.floor((ms % (24 * 3600 * 1000)) / (3600 * 1000));
  const m = Math.floor((ms % (3600 * 1000)) / (60 * 1000));

  return (
    <section style={{ marginBottom: 52 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
          alignItems: "stretch",
        }}
      >
        <div
          className="section-card axr-accent-glow animate-fade-in-up delay-1"
          style={{
            padding: "22px 22px",
            border: "0.5px solid rgba(34,211,238,0.22)",
            background: "linear-gradient(155deg, rgba(10,22,28,0.92) 0%, rgba(8,10,18,0.95) 100%)",
          }}
        >
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(34,211,238,0.75)", marginBottom: 12 }}>
            Season countdown
          </div>
          <div style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 8 }}>
            {d}d {pad(h)}h {pad(m)}m
          </div>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.55 }}>
            Season 1 payouts and titles lock when this timer hits zero. Ranked duelists and guilds finalize placement.
          </p>
        </div>

        <div className="section-card animate-fade-in-up delay-2" style={{ padding: "22px 22px" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 12 }}>
            Realm patch notes · preview
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {PATCH_NOTES.map(line => (
              <li key={line} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.52)", lineHeight: 1.55, paddingLeft: 14, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, top: "0.45em", width: 5, height: 5, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #22d3ee)", opacity: 0.9 }} />
                {line}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 14, fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>
            Tune this copy when you ship bot updates — it’s frontend-only today.
          </div>
        </div>
      </div>
    </section>
  );
}
