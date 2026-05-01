import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { TrophyIcon, SwordIcon, ShieldIcon, UsersIcon } from "@/components/Icons";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/api";

const MedalIcon = ({ rank }: { rank: number }) => {
  const colors: Record<number, string> = { 1: "#fff", 2: "rgba(255,255,255,0.7)", 3: "rgba(255,255,255,0.45)" };
  const color = colors[rank] ?? "rgba(255,255,255,0.22)";
  if (rank > 3) return <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", width: 22, textAlign: "center", display: "inline-block" }}>#{rank}</span>;
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={rank === 1 ? "rgba(255,255,255,0.12)" : "none"} />
    </svg>
  );
};

export default function Leaderboard() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(data => { setPlayers(data); setLoading(false); });
  }, []);

  const totalKills = players.reduce((s, p) => s + (p.kills || 0), 0);
  const guilds     = new Set(players.map(p => p.guild).filter(Boolean)).size;
  const topLevel   = players[0]?.level ?? 0;

  const liveStats = [
    { label: "Ranked Players", value: loading ? "..." : String(players.length), Icon: UsersIcon },
    { label: "Total Kills",    value: loading ? "..." : totalKills > 999 ? (totalKills / 1000).toFixed(1) + "k" : String(totalKills), Icon: SwordIcon },
    { label: "Guilds Active",  value: loading ? "..." : String(guilds),   Icon: ShieldIcon },
    { label: "Top Level",      value: loading ? "..." : String(topLevel), Icon: TrophyIcon },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Nav />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <section style={{ padding: "44px 0 32px" }}>
          <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 5, letterSpacing: "-0.03em" }}>Leaderboard</h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>Top players · Ranked by level &amp; prestige</p>
          </div>

          <div className="animate-fade-in-up delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 28 }}>
            {liveStats.map(s => (
              <div key={s.label} style={{ background: "rgba(10,10,10,0.8)", border: "0.5px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, backdropFilter: "blur(8px)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <s.Icon size={16} color="rgba(255,255,255,0.65)" />
                </div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.38)", marginTop: 1 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {!loading && players.length >= 3 && (
            <div className="animate-fade-in-up delay-2 podium-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[players[1], players[0], players[2]].map((p, idx) => {
                const isCenter = idx === 1;
                return (
                  <div key={p.rank} style={{ background: "rgba(10,10,10,0.8)", border: isCenter ? "0.5px solid rgba(255,255,255,0.38)" : "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 16px", textAlign: "center", marginTop: isCenter ? 0 : 14, backdropFilter: "blur(8px)" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><MedalIcon rank={p.rank} /></div>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.15)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                      {p.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.38)", marginBottom: 7 }}>{p.class || "—"}</div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: isCenter ? "#fff" : "rgba(255,255,255,0.6)" }}>Lv. {p.level}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="animate-fade-in-up delay-3" style={{ background: "rgba(10,10,10,0.8)", border: "0.5px solid rgba(255,255,255,0.09)", borderRadius: 16, overflow: "hidden", backdropFilter: "blur(8px)" }}>
            <div className="lb-row lb-header" style={{ padding: "12px 18px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              <span className="lb-col-rank" style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>#</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Player</span>
              <span className="lb-col-lvl" style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Lv.</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Kills</span>
              <span className="lb-col-kills" style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Guild</span>
            </div>
            {loading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>Loading players...</div>
            ) : players.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No players yet.</div>
            ) : players.map((p, i) => (
              <div key={p.rank} className="lb-row lb-data-row"
                style={{ padding: "13px 18px", borderBottom: i < players.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s", cursor: "default" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div className="lb-col-rank" style={{ display: "flex", alignItems: "center" }}><MedalIcon rank={p.rank} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.32)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.class || "—"} · {p.rank || "Peasant"}</div>
                </div>
                <span className="lb-col-lvl" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", fontWeight: 600, textAlign: "right" }}>{p.level}</span>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", fontWeight: 600, textAlign: "right" }}>{(p.kills || 0).toLocaleString()}</span>
                <span className="lb-col-kills" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.guild || "—"}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
      <style>{`
        .lb-row { display: grid; grid-template-columns: 36px 1fr 48px 64px 100px; gap: 10px; align-items: center; }
        @media (max-width: 640px) {
          .podium-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
          .podium-grid > div { margin-top: 0 !important; }
          .lb-row { grid-template-columns: 32px 1fr 56px; gap: 8px; }
          .lb-col-lvl, .lb-col-kills { display: none !important; }
        }
        @media (max-width: 400px) { .lb-row { grid-template-columns: 28px 1fr 52px; } }
      `}</style>
    </div>
  );
}
