import { useState, useEffect, useCallback } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { TrophyIcon, SwordIcon, ShieldIcon, UsersIcon, CrownIcon } from "@/components/Icons";
import { getLeaderboard, getGuildRanks, type LeaderboardEntry, type GuildRank } from "@/lib/api";
import art1 from "/leaderboard_art1.jpg";
import art2 from "/leaderboard_art2.jpg";
import art3 from "/leaderboard_art3.jpg";

function cap(s?: string) { if (!s) return "—"; return s.charAt(0).toUpperCase() + s.slice(1); }

const RANK_COLORS = ["#fbbf24", "rgba(255,255,255,0.75)", "#fb923c"];
const RANK_LABELS = ["#1", "#2", "#3"];

/* ── Mini stat block ── */
function MiniStat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 10px" }}>
      <div style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: "0.92rem", fontWeight: 800, color: color || "#fff", fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}

/* ── Player stats modal ── */
function PlayerModal({ p, onClose }: { p: LeaderboardEntry; onClose: () => void }) {
  const kc = p.killCounts || {};
  const guildDisplay = p.guildName || (p.guild && !p.guild.startsWith("guild_") ? p.guild : null);

  const statsGrid = [
    { label: "STR", value: p.str ?? "—" },
    { label: "AGI", value: p.agi ?? "—" },
    { label: "INT", value: p.int ?? "—" },
    { label: "DEF", value: p.def ?? "—" },
    { label: "LCK", value: p.lck ?? "—" },
    { label: "HP",  value: p.maxHp ? `${p.hp}/${p.maxHp}` : (p.hp ?? "—") },
    { label: "MP",  value: p.maxMp ? `${p.mp}/${p.maxMp}` : (p.mp ?? "—") },
    { label: "Dungeon Floor", value: p.dungeonFloor ? `F${p.dungeonFloor}` : "—" },
  ];

  const combatStats = [
    { label: "Total Kills",     value: (p.kills || 0).toLocaleString(),            color: "#f87171" },
    { label: "PvP Wins",        value: (kc.pvpWins || 0).toLocaleString(),         color: "#a78bfa" },
    { label: "Dungeons Cleared",value: (kc.dungeonsCleared || 0).toLocaleString(), color: "#22d3ee" },
    { label: "Dragon Kills",    value: (kc.dragonKills || 0).toLocaleString(),     color: "#fbbf24" },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const rankColor = p.rank <= 3 ? RANK_COLORS[p.rank - 1] : "rgba(255,255,255,0.4)";

  return (
    <div className="player-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${cap(p.name)} profile`}>
      <div className="player-modal" onClick={e => e.stopPropagation()}>
        {/* Header banner */}
        <div style={{
          padding: "28px 24px 20px",
          background: "linear-gradient(160deg, rgba(10,6,22,0.95) 0%, rgba(6,14,22,0.9) 100%)",
          borderBottom: "0.5px solid rgba(255,255,255,0.08)",
          position: "relative", overflow: "hidden", borderRadius: "22px 22px 0 0",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Close btn */}
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", fontSize: "1rem", zIndex: 2, transition: "background 0.18s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >×</button>

          <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
            {/* Avatar initial */}
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: `linear-gradient(145deg, ${rankColor}30, ${rankColor}10)`,
              border: `1.5px solid ${rankColor}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.6rem", fontWeight: 900, color: "#fff", flexShrink: 0,
              boxShadow: `0 0 24px ${rankColor}20`,
            }}>
              {cap(p.name).charAt(0)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{cap(p.name)}</h2>
                <div style={{
                  background: `${rankColor}18`, border: `0.5px solid ${rankColor}44`,
                  borderRadius: 999, padding: "2px 9px", fontSize: "0.68rem", fontWeight: 700, color: rankColor,
                }}>
                  #{p.rank}
                </div>
                {p.prestige > 0 && (
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "2px 9px", fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
                    ✦ Prestige {p.prestige}
                  </div>
                )}
              </div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.42)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span>{cap(p.class) || "—"}</span>
                <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
                <span>{cap(p.race) || "—"}</span>
                {guildDisplay && (
                  <>
                    <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
                    <span style={{ color: "rgba(196,181,253,0.7)" }}>{cap(guildDisplay)}</span>
                  </>
                )}
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 999, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700, color: "#fff",
                }}>
                  Lv. {p.level}
                </div>
                {p.rank && p.rank !== "peasant" && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(139,92,246,0.1)", border: "0.5px solid rgba(139,92,246,0.24)", borderRadius: 999, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(196,181,253,0.85)" }}>
                    {cap(p.rank)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 28px" }}>
          {/* Combat stats */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Combat Record</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {combatStats.map(s => (
                <MiniStat key={s.label} label={s.label} value={s.value} color={s.color} />
              ))}
            </div>
          </div>

          {/* RPG stats */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Character Stats</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {statsGrid.map(s => (
                <MiniStat key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          </div>

          {/* Economy */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Economy</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              <MiniStat label="Solars" value={(p.Solars || 0).toLocaleString()} color="#fbbf24" />
              <MiniStat label="Gems"   value={p.gems ?? "—"} color="#c084fc" />
              <MiniStat label="Prestige" value={p.prestige > 0 ? `×${p.prestige}` : "—"} color="rgba(255,255,255,0.6)" />
            </div>
          </div>

          {/* EXP bar */}
          {p.exp != null && p.level != null && (
            <div style={{ background: "rgba(0,0,0,0.3)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Experience</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(196,181,253,0.8)" }}>{p.exp?.toLocaleString() ?? "—"} XP</span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  background: "linear-gradient(90deg, #a78bfa, #22d3ee)",
                  width: `${Math.min(100, Math.round((p.exp / Math.max(1, p.level * 200)) * 100))}%`,
                  boxShadow: "0 0 10px rgba(139,92,246,0.4)",
                  transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Podium card ── */
function PodiumCard({ p, isCenter, artSrc }: { p: LeaderboardEntry; isCenter: boolean; artSrc: string }) {
  const [open, setOpen] = useState(false);
  const rankColor = RANK_COLORS[p.rank - 1] || "rgba(255,255,255,0.3)";
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`View ${cap(p.name)} stats`}
        onKeyDown={e => e.key === "Enter" && setOpen(true)}
        style={{
          position: "relative", borderRadius: 18, overflow: "hidden",
          background: "rgba(8,8,16,0.9)",
          border: isCenter ? `1px solid ${rankColor}50` : "0.5px solid rgba(255,255,255,0.09)",
          marginTop: isCenter ? 0 : 16, cursor: "pointer",
          boxShadow: isCenter ? `0 0 40px ${rankColor}15, 0 20px 60px rgba(0,0,0,0.6)` : "0 10px 40px rgba(0,0,0,0.5)",
          transition: "transform 0.22s, box-shadow 0.22s, border-color 0.22s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = isCenter ? `0 0 60px ${rankColor}20, 0 28px 70px rgba(0,0,0,0.7)` : "0 16px 50px rgba(0,0,0,0.6)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = isCenter ? `0 0 40px ${rankColor}15, 0 20px 60px rgba(0,0,0,0.6)` : "0 10px 40px rgba(0,0,0,0.5)"; }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${artSrc})`, backgroundSize: "cover", backgroundPosition: "center top", opacity: isCenter ? 0.12 : 0.07, filter: "saturate(0.5)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,8,16,0.3) 0%, rgba(8,8,16,0.88) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: isCenter ? "22px 18px" : "18px 16px", textAlign: "center" }}>
          <div style={{ fontSize: isCenter ? "1.5rem" : "1.1rem", marginBottom: 10 }}>
            {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : "🥉"}
          </div>
          <div style={{
            width: isCenter ? 52 : 44, height: isCenter ? 52 : 44, borderRadius: 14,
            background: `linear-gradient(145deg, ${rankColor}25, ${rankColor}08)`,
            border: `0.5px solid ${rankColor}45`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isCenter ? "1.25rem" : "1.05rem", fontWeight: 900, color: "#fff",
            margin: "0 auto 10px",
            boxShadow: isCenter ? `0 0 20px ${rankColor}20` : "none",
          }}>{cap(p.name).charAt(0)}</div>
          <div style={{ fontSize: isCenter ? "0.96rem" : "0.85rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>{cap(p.name)}</div>
          <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.38)", marginBottom: 8 }}>{cap(p.class) || "—"}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700, color: isCenter ? "#fff" : "rgba(255,255,255,0.65)" }}>Lv. {p.level}</span>
            <span style={{ background: `${rankColor}14`, border: `0.5px solid ${rankColor}35`, borderRadius: 999, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700, color: rankColor }}>{(p.kills||0).toLocaleString()} kills</span>
          </div>
          {p.prestige > 0 && <div style={{ marginTop: 6, fontSize: "0.66rem", color: "rgba(255,255,255,0.32)" }}>✦ Prestige {p.prestige}</div>}
          <div style={{ marginTop: 10, fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>Tap for full stats</div>
        </div>
      </div>
      {open && <PlayerModal p={p} onClose={() => setOpen(false)} />}
    </>
  );
}

export default function Leaderboard() {
  const [players, setPlayers]       = useState<LeaderboardEntry[]>([]);
  const [guildRanks, setGuildRanks] = useState<GuildRank[]>([]);
  const [loading, setLoading]       = useState(true);
  const [guildLoading, setGuildLoading] = useState(true);
  const [tab, setTab]               = useState<"players"|"guilds">("players");
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);
  const [search, setSearch]         = useState("");

  useEffect(() => {
    getLeaderboard().then(d => { setPlayers(d); setLoading(false); });
    getGuildRanks().then(d => { setGuildRanks(d); setGuildLoading(false); });
  }, []);

  const closeModal = useCallback(() => setSelectedPlayer(null), []);

  const totalKills = players.reduce((s, p) => s + (p.kills || 0), 0);
  const topLevel   = players[0]?.level ?? 0;

  const liveStats = [
    { label: "Ranked Players", value: loading ? "…" : String(players.length), Icon: UsersIcon,  color: "#a78bfa" },
    { label: "Total Kills",    value: loading ? "…" : totalKills > 999 ? `${(totalKills/1000).toFixed(1)}k` : String(totalKills), Icon: SwordIcon, color: "#f87171" },
    { label: "Guilds Active",  value: guildLoading ? "…" : String(guildRanks.length), Icon: ShieldIcon, color: "#22d3ee" },
    { label: "Top Level",      value: loading ? "…" : String(topLevel), Icon: TrophyIcon, color: "#fbbf24" },
  ];

  const filteredPlayers = search
    ? players.filter(p => cap(p.name).toLowerCase().includes(search.toLowerCase()) || (p.guildName || "").toLowerCase().includes(search.toLowerCase()))
    : players;

  const filteredGuilds = search
    ? guildRanks.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    : guildRanks;

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Nav />
      <div className="section-wrap">
        <section style={{ padding: "44px 0 60px" }}>

          {/* Header */}
          <div className="anim-up" style={{ marginBottom: 32 }}>
            <div className="pill anim-up d1" style={{ marginBottom: 14, display: "inline-flex" }}>
              <span className="live-dot" />
              Live rankings
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif", lineHeight: 1.05, marginBottom: 6 }}>
              Leaderboard
            </h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.38)", maxWidth: 420 }}>Top players ranked by level &amp; prestige. Click any row or podium card to view full stats.</p>
          </div>

          {/* Live stats strip */}
          <div className="anim-up d1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginBottom: 32 }}>
            {liveStats.map(s => (
              <div key={s.label} style={{ background: "rgba(8,8,16,0.85)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 11, backdropFilter: "blur(12px)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.color}14`, border: `0.5px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <s.Icon size={15} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Top 3 podium */}
          {!loading && players.length >= 3 && (
            <>
              <div className="anim-up d2 podium-desktop" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                {([players[1], players[0], players[2]] as LeaderboardEntry[]).map((p, i) => (
                  <PodiumCard key={p.rank} p={p} isCenter={i === 1} artSrc={[art1, art2, art3][i]} />
                ))}
              </div>
              <div className="anim-up d2 podium-mobile" style={{ marginBottom: 20 }}>
                <PodiumCard p={players[0]} isCenter artSrc={art2} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <PodiumCard p={players[1]} isCenter={false} artSrc={art1} />
                  <PodiumCard p={players[2]} isCenter={false} artSrc={art3} />
                </div>
              </div>
            </>
          )}

          {/* Tabs + search */}
          <div className="anim-up d3" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, width: "fit-content" }}>
              {(["players", "guilds"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: tab === t ? "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(34,211,238,0.1))" : "transparent",
                  color: tab === t ? "#fff" : "rgba(255,255,255,0.42)",
                  border: tab === t ? "0.5px solid rgba(139,92,246,0.4)" : "0.5px solid transparent",
                  borderRadius: 9, padding: "7px 18px", fontSize: "0.8rem", fontWeight: tab === t ? 700 : 500,
                  cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.18s",
                }}>
                  {t === "players" ? "Players" : "Guild Ranks"}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder={tab === "players" ? "Search players…" : "Search guilds…"}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: 999, padding: "8px 18px", color: "#fff", fontSize: "0.8rem",
                fontFamily: "Outfit, sans-serif", outline: "none", minWidth: 180,
                transition: "border-color 0.18s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Players table */}
          {tab === "players" && (
            <div className="anim-in" style={{ background: "rgba(6,6,14,0.88)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 18, overflow: "hidden", backdropFilter: "blur(14px)" }}>
              {/* Header */}
              <div className="lb-table" style={{ padding: "11px 18px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.09em" }}>#</span>
                <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.09em" }}>Player</span>
                <span className="lb-col-lvl" style={{ fontSize: "0.64rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.09em", textAlign: "right" }}>Lv.</span>
                <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.09em", textAlign: "right" }}>Kills</span>
                <span className="lb-col-guild" style={{ fontSize: "0.64rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.09em", textAlign: "right" }}>Guild</span>
              </div>

              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="lb-table shimmer" style={{ padding: "13px 18px", borderBottom: i < 9 ? "0.5px solid rgba(255,255,255,0.04)" : "none", gap: 10 }}>
                    <div style={{ height: 12, width: 28, borderRadius: 6, background: "rgba(255,255,255,0.08)" }} />
                    <div style={{ height: 12, width: "55%", borderRadius: 6, background: "rgba(255,255,255,0.08)" }} />
                    <div className="lb-col-lvl" style={{ height: 12, width: 40, borderRadius: 6, background: "rgba(255,255,255,0.06)", justifySelf: "end" }} />
                    <div style={{ height: 12, width: 56, borderRadius: 6, background: "rgba(255,255,255,0.06)", justifySelf: "end" }} />
                    <div className="lb-col-guild" style={{ height: 12, width: 80, borderRadius: 6, background: "rgba(255,255,255,0.05)", justifySelf: "end" }} />
                  </div>
                ))
              ) : filteredPlayers.length === 0 ? (
                <div style={{ padding: "36px", textAlign: "center", color: "rgba(255,255,255,0.28)", fontSize: "0.85rem" }}>No results found.</div>
              ) : filteredPlayers.map((p, i) => {
                const rankColor = p.rank <= 3 ? RANK_COLORS[p.rank - 1] : undefined;
                return (
                  <div
                    key={p.rank}
                    className="lb-table"
                    onClick={() => setSelectedPlayer(p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && setSelectedPlayer(p)}
                    aria-label={`View ${cap(p.name)} full profile`}
                    style={{
                      padding: "13px 18px",
                      borderBottom: i < filteredPlayers.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none",
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(139,92,246,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Rank */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {p.rank <= 3 ? (
                        <span style={{ fontSize: "1rem" }}>{p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : "🥉"}</span>
                      ) : (
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.28)", width: 26, textAlign: "center" }}>#{p.rank}</span>
                      )}
                    </div>
                    {/* Name */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.86rem", fontWeight: 600, color: rankColor || "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 1 }}>
                        {cap(p.name)}
                      </div>
                      <div style={{ fontSize: "0.69rem", color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cap(p.class) || "—"} · {cap(p.rank) || "Peasant"}
                        {p.prestige > 0 && ` · ✦ P${p.prestige}`}
                      </div>
                    </div>
                    <span className="lb-col-lvl" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", fontWeight: 600, textAlign: "right" }}>{p.level}</span>
                    <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", fontWeight: 600, textAlign: "right" }}>{(p.kills||0).toLocaleString()}</span>
                    <span className="lb-col-guild" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.guildName || (p.guild && !p.guild.startsWith("guild_") ? cap(p.guild) : "—")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Guild ranks table */}
          {tab === "guilds" && (
            <div className="anim-in" style={{ background: "rgba(6,6,14,0.88)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 18, overflow: "hidden", backdropFilter: "blur(14px)" }}>
              <div className="lb-guild" style={{ padding: "11px 18px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.09em" }}>#</span>
                <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.09em" }}>Guild</span>
                <span className="lb-guild-leader" style={{ fontSize: "0.64rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.09em", textAlign: "right" }}>Leader</span>
                <span className="lb-guild-mem" style={{ fontSize: "0.64rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.09em", textAlign: "right" }}>Members</span>
                <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.09em", textAlign: "right" }}>Kills</span>
              </div>
              {guildLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="lb-guild shimmer" style={{ padding: "13px 18px", borderBottom: i < 5 ? "0.5px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ height: 12, width: 28, borderRadius: 6, background: "rgba(255,255,255,0.08)" }} />
                    <div style={{ height: 12, width: "50%", borderRadius: 6, background: "rgba(255,255,255,0.08)" }} />
                    <div className="lb-guild-leader" style={{ height: 12, width: 80, borderRadius: 6, background: "rgba(255,255,255,0.06)", justifySelf: "end" }} />
                    <div className="lb-guild-mem" style={{ height: 12, width: 50, borderRadius: 6, background: "rgba(255,255,255,0.05)", justifySelf: "end" }} />
                    <div style={{ height: 12, width: 60, borderRadius: 6, background: "rgba(255,255,255,0.06)", justifySelf: "end" }} />
                  </div>
                ))
              ) : filteredGuilds.length === 0 ? (
                <div style={{ padding: "36px", textAlign: "center", color: "rgba(255,255,255,0.28)", fontSize: "0.85rem" }}>No guilds found.</div>
              ) : filteredGuilds.map((g, i) => {
                const rc = g.rank <= 3 ? RANK_COLORS[g.rank - 1] : undefined;
                return (
                  <div key={g.name} className="lb-guild" style={{ padding: "13px 18px", borderBottom: i < filteredGuilds.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s", cursor: "default" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {g.rank <= 3 ? (
                        <span style={{ fontSize: "1rem" }}>{g.rank === 1 ? "🥇" : g.rank === 2 ? "🥈" : "🥉"}</span>
                      ) : (
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.28)", width: 26, textAlign: "center" }}>#{g.rank}</span>
                      )}
                    </div>
                    <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 6 }}>
                      {g.rank === 1 && <CrownIcon size={12} color="#fbbf24" />}
                      <span style={{ fontSize: "0.86rem", fontWeight: 700, color: rc || "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cap(g.name)}</span>
                    </div>
                    <span className="lb-guild-leader" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cap(g.leader) || "—"}</span>
                    <span className="lb-guild-mem" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", fontWeight: 600, textAlign: "right" }}>{g.members}</span>
                    <span style={{ fontSize: "0.82rem", color: rc || "rgba(255,255,255,0.6)", fontWeight: 700, textAlign: "right" }}>{(g.kills||0).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Helper text */}
          {!loading && tab === "players" && (
            <p style={{ marginTop: 12, textAlign: "center", fontSize: "0.72rem", color: "rgba(255,255,255,0.22)" }}>
              Click any row or podium card to view a player's full stat profile
            </p>
          )}
        </section>
      </div>
      <Footer />

      {/* Player modal */}
      {selectedPlayer && <PlayerModal p={selectedPlayer} onClose={closeModal} />}
    </div>
  );
}
