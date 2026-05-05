import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { TrophyIcon, SwordIcon, ShieldIcon, UsersIcon, CrownIcon } from "@/components/Icons";
import { getLeaderboard, getGuildRanks, type LeaderboardEntry, type GuildRank } from "@/lib/api";

// ── Imported art images for top 3 podium overlays ──
import art1 from "/leaderboard_art1.jpg"; // download.jpg   → #2 slot
import art2 from "/leaderboard_art2.jpg"; // Milim_nava_.jpg → #1 slot  
import art3 from "/leaderboard_art3.jpg"; // Zalario.jpg    → #3 slot

function cap(s?: string) {
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const MedalIcon = ({ rank }: { rank: number }) => {
  const colors: Record<number, string> = { 1: "#fff", 2: "rgba(255,255,255,0.7)", 3: "rgba(255,255,255,0.45)" };
  const color = colors[rank] ?? "rgba(255,255,255,0.22)";
  if (rank > 3)
    return (
      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", width: 22, textAlign: "center", display: "inline-block" }}>
        #{rank}
      </span>
    );
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={rank === 1 ? "rgba(255,255,255,0.12)" : "none"}
      />
    </svg>
  );
};

// ── Top 3 Podium Card ──
function PodiumCard({ p, isCenter, artSrc }: { p: LeaderboardEntry; isCenter: boolean; artSrc: string }) {
  return (
    <div
      style={{
        position: "relative",
        background: "rgba(10,10,10,0.85)",
        border: isCenter ? "0.5px solid rgba(255,255,255,0.38)" : "0.5px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: "20px 16px",
        textAlign: "center",
        marginTop: isCenter ? 0 : 14,
        backdropFilter: "blur(10px)",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = isCenter ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = isCenter ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.1)"; }}
    >
      {/* Art background overlay — visible but subtle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${artSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: isCenter ? 0.13 : 0.09,
          filter: "saturate(0.6)",
          zIndex: 0,
        }}
      />
      {/* Gradient fade on top of art */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.75) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <MedalIcon rank={p.rank} />
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            border: `0.5px solid ${isCenter ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)"}`,
            margin: "0 auto 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            fontWeight: 800,
            color: "#fff",
            boxShadow: isCenter ? "0 0 18px rgba(255,255,255,0.12)" : "none",
          }}
        >
          {cap(p.name).charAt(0)}
        </div>
        <div style={{ fontSize: isCenter ? "0.95rem" : "0.85rem", fontWeight: 800, color: "#fff", marginBottom: 3 }}>
          {cap(p.name)}
        </div>
        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginBottom: 7 }}>
          {cap(p.class) || "—"}
        </div>
        <div
          style={{
            display: "inline-block",
            background: isCenter ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
            border: `0.5px solid ${isCenter ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 999,
            padding: "3px 10px",
            fontSize: "0.74rem",
            fontWeight: 700,
            color: isCenter ? "#fff" : "rgba(255,255,255,0.65)",
          }}
        >
          Lv. {p.level}
        </div>
        {p.prestige > 0 && (
          <div style={{ marginTop: 5, fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
            ✦ Prestige {p.prestige}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [guildRanks, setGuildRanks] = useState<GuildRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [guildLoading, setGuildLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"players" | "guilds">("players");

  useEffect(() => {
    getLeaderboard().then(data => {
      setPlayers(data);
      setLoading(false);
    });
    getGuildRanks().then(data => {
      setGuildRanks(data);
      setGuildLoading(false);
    });
  }, []);

  const totalKills = players.reduce((s, p) => s + (p.kills || 0), 0);
  const topLevel   = players[0]?.level ?? 0;

  const liveStats = [
    { label: "Ranked Players", value: loading ? "..." : String(players.length), Icon: UsersIcon },
    { label: "Total Kills",    value: loading ? "..." : totalKills > 999 ? (totalKills / 1000).toFixed(1) + "k" : String(totalKills), Icon: SwordIcon },
    { label: "Guilds Active",  value: guildLoading ? "..." : String(guildRanks.length), Icon: ShieldIcon },
    { label: "Top Level",      value: loading ? "..." : String(topLevel), Icon: TrophyIcon },
  ];

  // Art images mapped to positions: [#2, #1, #3] (podium order)
  const podiumArt = [art1, art2, art3];

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Nav />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <section style={{ padding: "44px 0 32px" }}>

          {/* ── Header ── */}
          <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 5, letterSpacing: "-0.03em" }}>
              Leaderboard
            </h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
              Top players · Ranked by level &amp; prestige
            </p>
          </div>

          {/* ── Live stats strip ── */}
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

          {/* ── Top 3 Podium with art overlays ── */}
          {!loading && players.length >= 3 && (
            <>
              {/* Desktop: #2 | #1 | #3 */}
              <div className="animate-fade-in-up delay-2 podium-desktop" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {([players[1], players[0], players[2]] as LeaderboardEntry[]).map((p, idx) => (
                  <PodiumCard key={p.rank} p={p} isCenter={idx === 1} artSrc={podiumArt[idx]} />
                ))}
              </div>
              {/* Mobile: #1 on top full-width, then #2 + #3 side-by-side */}
              <div className="animate-fade-in-up delay-2 podium-mobile" style={{ marginBottom: 20 }}>
                <PodiumCard p={players[0]} isCenter={true} artSrc={podiumArt[1]} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <PodiumCard p={players[1]} isCenter={false} artSrc={podiumArt[0]} />
                  <PodiumCard p={players[2]} isCenter={false} artSrc={podiumArt[2]} />
                </div>
              </div>
            </>
          )}

          {/* ── Tab switcher: Players / Guilds ── */}
          <div className="animate-fade-in-up delay-3" style={{ display: "flex", gap: 4, marginBottom: 16, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, width: "fit-content" }}>
            {(["players", "guilds"] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  background: activeTab === t ? "#fff" : "transparent",
                  color: activeTab === t ? "#000" : "rgba(255,255,255,0.45)",
                  border: "none", borderRadius: 9, padding: "8px 18px",
                  fontSize: "0.81rem", fontWeight: 700, cursor: "pointer",
                  fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap",
                  transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
                  textTransform: "capitalize",
                }}
              >
                {t === "players" ? "Players" : "Guild Ranks"}
              </button>
            ))}
          </div>

          {/* ── Players Table ── */}
          {activeTab === "players" && (
            <div className="animate-fade-in" style={{ background: "rgba(10,10,10,0.8)", border: "0.5px solid rgba(255,255,255,0.09)", borderRadius: 16, overflow: "hidden", backdropFilter: "blur(8px)" }}>
              <div className="lb-row lb-header" style={{ padding: "12px 18px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                <span className="lb-col-rank" style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>#</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Player</span>
                <span className="lb-col-lvl" style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Lv.</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Kills</span>
                <span className="lb-col-guild" style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Guild</span>
              </div>
              {loading ? (
                <div aria-busy aria-label="Loading players">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="lb-row lb-data-row axr-shimmer"
                      style={{
                        padding: "13px 18px",
                        borderBottom: i < 7 ? "0.5px solid rgba(255,255,255,0.04)" : "none",
                        opacity: 0.95,
                      }}
                    >
                      <div style={{ width: 36, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ width: "55%", height: 12, borderRadius: 6, background: "rgba(255,255,255,0.08)", marginBottom: 8 }} />
                        <div style={{ width: "35%", height: 9, borderRadius: 5, background: "rgba(255,255,255,0.05)" }} />
                      </div>
                      <div className="lb-col-lvl" style={{ width: 48, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)", justifySelf: "end" }} />
                      <div style={{ width: 56, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)", justifySelf: "end" }} />
                      <div className="lb-col-guild" style={{ width: 72, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.05)", justifySelf: "end" }} />
                    </div>
                  ))}
                </div>
              ) : players.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No players yet.</div>
              ) : players.map((p, i) => (
                <div
                  key={p.rank}
                  className="lb-row lb-data-row"
                  style={{ padding: "13px 18px", borderBottom: i < players.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s", cursor: "default" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="lb-col-rank" style={{ display: "flex", alignItems: "center" }}>
                    <MedalIcon rank={p.rank} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {cap(p.name)}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.32)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {cap(p.class) || "—"} · {cap(p.rank) || "Peasant"}
                    </div>
                  </div>
                  <span className="lb-col-lvl" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", fontWeight: 600, textAlign: "right" }}>{p.level}</span>
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", fontWeight: 600, textAlign: "right" }}>{(p.kills || 0).toLocaleString()}</span>
                  <span className="lb-col-guild" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {/* Show guildName if available, otherwise hide raw guild_ IDs */}
                    {p.guildName || (p.guild && !p.guild.startsWith("guild_") ? cap(p.guild) : "—")}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── Guild Ranks Table ── */}
          {activeTab === "guilds" && (
            <div className="animate-fade-in" style={{ background: "rgba(10,10,10,0.8)", border: "0.5px solid rgba(255,255,255,0.09)", borderRadius: 16, overflow: "hidden", backdropFilter: "blur(8px)" }}>
              <div className="guild-row guild-header" style={{ padding: "12px 18px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>#</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Guild</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Leader</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Members</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Total Kills</span>
              </div>
              {guildLoading ? (
                <div aria-busy aria-label="Loading guilds">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="guild-row axr-shimmer"
                      style={{
                        padding: "13px 18px",
                        borderBottom: i < 5 ? "0.5px solid rgba(255,255,255,0.04)" : "none",
                      }}
                    >
                      <div style={{ width: 28, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.06)" }} />
                      <div style={{ width: "50%", height: 12, borderRadius: 6, background: "rgba(255,255,255,0.08)", minWidth: 0 }} />
                      <div style={{ width: 96, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)", justifySelf: "end" }} />
                      <div style={{ width: 52, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.05)", justifySelf: "end" }} />
                      <div style={{ width: 64, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)", justifySelf: "end" }} />
                    </div>
                  ))}
                </div>
              ) : guildRanks.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No guilds yet.</div>
              ) : guildRanks.map((g, i) => (
                <div
                  key={g.name}
                  className="guild-row"
                  style={{ padding: "13px 18px", borderBottom: i < guildRanks.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s", cursor: "default" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Rank number */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {g.rank <= 3 ? (
                      <MedalIcon rank={g.rank} />
                    ) : (
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", width: 22, textAlign: "center", display: "inline-block" }}>#{g.rank}</span>
                    )}
                  </div>
                  {/* Guild name */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                      {g.rank === 1 && <CrownIcon size={13} color="rgba(255,255,255,0.7)" />}
                      {cap(g.name)}
                    </div>
                  </div>
                  {/* Leader */}
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {cap(g.leader) || "—"}
                  </span>
                  {/* Members */}
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", fontWeight: 600, textAlign: "right" }}>
                    {g.members}
                  </span>
                  {/* Total kills */}
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", fontWeight: 600, textAlign: "right" }}>
                    {(g.kills || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

        </section>
      </div>
      <Footer />
      <style>{`
        .lb-row { display: grid; grid-template-columns: 36px 1fr 48px 72px 110px; gap: 10px; align-items: center; }
        .guild-row { display: grid; grid-template-columns: 36px 1fr 120px 72px 100px; gap: 10px; align-items: center; }
        .podium-mobile { display: none; }
        .podium-desktop { display: grid; }
        @media (max-width: 640px) {
          .podium-desktop { display: none !important; }
          .podium-mobile { display: block !important; }
          .lb-row { grid-template-columns: 32px 1fr 56px; gap: 8px; }
          .lb-col-lvl, .lb-col-guild { display: none !important; }
          .guild-row { grid-template-columns: 32px 1fr 64px; gap: 8px; }
          .guild-row span:nth-child(3), .guild-row span:nth-child(4) { display: none; }
        }
        @media (max-width: 400px) {
          .lb-row { grid-template-columns: 28px 1fr 52px; }
          .guild-row { grid-template-columns: 28px 1fr 52px; }
        }
      `}</style>
    </div>
  );
}
