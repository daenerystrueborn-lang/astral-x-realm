import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RealmFeed from "@/components/RealmFeed";
import HomeCommandCenter from "@/components/HomeCommandCenter";
import SeasonPatchStrip from "@/components/SeasonPatchStrip";
import HomeStatsBar from "@/components/HomeStatsBar";
import BotFleetCard from "@/components/BotFleetCard";
import { SwordIcon, ShieldIcon, DiceIcon, ChestIcon, MapIcon, GemIcon, CrownIcon, TrophyIcon, BoltIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import astralIcon from "/astral_icon.png";
import { Link, useLocation } from "wouter";
import { getLeaderboard, getBotStats, type LeaderboardEntry, type BotStat } from "@/lib/api";

/* ── Snow/Stars Canvas (home-only) ── */
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const count = Math.floor(window.innerWidth / 7);
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vy: 0.18 + Math.random() * 0.35, vx: (Math.random() - 0.5) * 0.12,
      size: 0.5 + Math.random() * 1.2, opacity: 0.03 + Math.random() * 0.07,
      angle: Math.random() * Math.PI * 2, as: (Math.random() - 0.5) * 0.012,
      twinkleSpeed: 0.008 + Math.random() * 0.015, twinklePhase: Math.random() * Math.PI * 2,
    }));
    let frame: number;
    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const f of stars) {
        const twinkle = f.opacity * (0.5 + 0.5 * Math.sin(t / f.twinkleSpeed + f.twinklePhase));
        ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${twinkle})`; ctx.fill();
        f.y += f.vy; f.x += f.vx + Math.sin(f.angle) * 0.12; f.angle += f.as;
        if (f.y > canvas.height + 4) { f.y = -4; f.x = Math.random() * canvas.width; }
        if (f.x < -4) f.x = canvas.width + 4;
        if (f.x > canvas.width + 4) f.x = -4;
      }
      frame = requestAnimationFrame(draw);
    };
    draw(); window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

/* Feature definitions with per-icon accent colors */
const features = [
  { Icon: SwordIcon,   iconClass: "icon-wrap-violet",  iconColor: "#a78bfa", title: "Dungeon Raids",  desc: "Explore multi-floor dungeons with your party. Unlock elite loot and boss drops." },
  { Icon: ShieldIcon,  iconClass: "icon-wrap-cyan",    iconColor: "#22d3ee", title: "Guild Wars",     desc: "Form guilds of up to 50 players. Fight for territory control and guild rankings." },
  { Icon: ChestIcon,   iconClass: "icon-wrap-gold",    iconColor: "#fbbf24", title: "Loot System",   desc: "Over 1,200 unique items. Rare drops, forge upgrades, and seasonal chests." },
  { Icon: DiceIcon,    iconClass: "icon-wrap-pink",    iconColor: "#f472b6", title: "Casino & Events", desc: "Spin the wheel, play blackjack, earn bonus gold from limited-time events." },
  { Icon: TrophyIcon,  iconClass: "icon-wrap-gold",    iconColor: "#fbbf24", title: "Ranked Season", desc: "Compete in seasonal PvP ladders. Earn exclusive rewards and prestige titles." },
  { Icon: BoltIcon,    iconClass: "icon-wrap-green",   iconColor: "#4ade80", title: "Daily Quests",  desc: "3 fresh quests every day. Chain streaks for bonus XP and rare item rewards." },
  { Icon: GemIcon,     iconClass: "icon-wrap-cyan",    iconColor: "#22d3ee", title: "Player Market", desc: "List items for sale, browse stalls, and trade directly with other players for profit." },
  { Icon: MapIcon,     iconClass: "icon-wrap-orange",  iconColor: "#fb923c", title: "Forge & Craft", desc: "Smelt materials, craft powerful gear, and upgrade your weapons at the forge." },
];

const steps = [
  { num: "01", title: "Add the Bot",       accent: "#a78bfa", desc: "Invite Astral X Realm to your Discord server or WhatsApp group in one click." },
  { num: "02", title: "Create Your Hero",  accent: "#22d3ee", desc: "Choose your class, name your character, and set up your profile." },
  { num: "03", title: "Battle & Collect",  accent: "#4ade80", desc: "Fight monsters, collect loot, and rise through the ranks." },
];

const cubes = [
  {
    id: "token_box_mid",
    name: "Mid Token Box",
    emoji: "📦",
    tier: "Mid",
    rarity: "Common",
    rarityColor: "rgba(255,255,255,0.5)",
    desc: "A dusty crate from deep in the dungeon. Contains 1–15 Spin Tokens.",
    drops: ["Spin Tokens (1–15)", "Random Common Items"],
    howToGet: "Dungeon floors, daily quests",
    borderColor: "rgba(255,255,255,0.09)",
    accentGlow: "none",
  },
  {
    id: "token_box_medium",
    name: "Medium Token Box",
    emoji: "🎁",
    tier: "Medium",
    rarity: "Rare",
    rarityColor: "#60a5fa",
    desc: "A reinforced chest packed with a decent haul of Spin Tokens.",
    drops: ["Spin Tokens (16–40)", "Random Uncommon Items"],
    howToGet: "Boss drops, exploration rewards",
    borderColor: "rgba(96,165,250,0.3)",
    accentGlow: "0 0 32px rgba(96,165,250,0.08)",
  },
  {
    id: "token_box_peak",
    name: "Peak Token Box",
    emoji: "💠",
    tier: "Peak",
    rarity: "Epic",
    rarityColor: "#c084fc",
    desc: "A crystalline vault. Only the best adventurers crack one open.",
    drops: ["Spin Tokens (41–100)", "Rare gear or summon fragments"],
    howToGet: "World boss kills, ranked dungeon rewards",
    borderColor: "rgba(192,132,252,0.38)",
    accentGlow: "0 0 40px rgba(192,132,252,0.1)",
  },
];

interface GuildRow {
  name: string; rank: number; members: number; kills: number;
}

function deriveTopGuilds(players: LeaderboardEntry[]): GuildRow[] {
  const map = new Map<string, { kills: number; members: number; name: string }>();
  for (const p of players) {
    const gName = p.guildName || p.guild;
    if (!gName || gName.startsWith('guild_')) continue;
    const entry = map.get(gName) || { kills: 0, members: 0, name: gName };
    entry.kills += p.kills || 0;
    entry.members += 1;
    map.set(gName, entry);
  }
  return Array.from(map.values())
    .sort((a, b) => b.kills - a.kills)
    .slice(0, 4)
    .map((g, i) => ({ name: g.name, rank: i + 1, members: g.members, kills: g.kills }));
}

const fallbackGuilds: GuildRow[] = [
  { name: "Eclipse Order",  rank: 1, members: 48, kills: 2841 },
  { name: "Solar Vanguard", rank: 2, members: 45, kills: 2480 },
  { name: "Crimson Dawn",   rank: 3, members: 50, kills: 2210 },
  { name: "Void Pact",      rank: 4, members: 39, kills: 1990 },
];

const rankColors = ["#fbbf24", "rgba(255,255,255,0.7)", "#fb923c"];

function pickBotStat(stats: BotStat[], fragment: string) {
  const f = fragment.toLowerCase();
  return stats.find(b => b.name.toLowerCase().includes(f));
}

function capHero(s?: string) {
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function Home() {
  const { openSignup, player } = useAuth();
  const [, navigate] = useLocation();
  const [guilds, setGuilds] = useState<GuildRow[]>(fallbackGuilds);
  const [featured, setFeatured] = useState<LeaderboardEntry | null>(null);
  const [botStats, setBotStats] = useState<BotStat[]>([]);

  useEffect(() => {
    getLeaderboard()
      .then(players => {
        const derived = deriveTopGuilds(players);
        if (derived.length > 0) setGuilds(derived);
        const top = players[0];
        if (top) setFeatured(top);
      })
      .catch(() => {});
    getBotStats().then(setBotStats).catch(() => setBotStats([]));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "transparent", position: "relative" }}>
      <StarCanvas />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <RealmFeed />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

          {player && (
            <div style={{ paddingTop: 20 }}>
              <HomeCommandCenter player={player} navigate={navigate} />
            </div>
          )}

          {/* ── Hero ── */}
          <section style={{ textAlign: "center", padding: "88px 0 68px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0, position: "relative" }}>
            {/* Background orbs */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse at center, rgba(139,92,246,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "absolute", top: "30%", left: "15%", width: 250, height: 250, background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, filter: "blur(20px)" }} />
            <div style={{ position: "absolute", top: "20%", right: "12%", width: 200, height: 200, background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, filter: "blur(16px)" }} />

            {/* Logo */}
            <div className="animate-fade-in-up pulse-glow-violet" style={{ position: "relative", display: "inline-block", marginBottom: 32, borderRadius: "50%", zIndex: 1 }}>
              <div style={{ position: "absolute", inset: -14, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)", filter: "blur(8px)" }} />
              <div style={{ position: "absolute", inset: -2, borderRadius: "50%", border: "1px solid rgba(139,92,246,0.35)", animation: "borderPulse 4s ease-in-out infinite" }} />
              <img src={astralIcon} alt="logo" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.22)", display: "block", position: "relative", zIndex: 1 }} />
            </div>

            {/* Season badge */}
            <div className="animate-fade-in-up delay-1" style={{ zIndex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(34,211,238,0.08))",
                border: "0.5px solid rgba(139,92,246,0.38)",
                borderRadius: 999, padding: "5px 14px 5px 10px",
                fontSize: "0.72rem", fontWeight: 600, color: "rgba(196,181,253,0.95)",
                letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", flexShrink: 0, animation: "liveBlip 1.6s ease-in-out infinite" }} />
                Season 1 · Now Live
              </div>
            </div>

            <h1 className="animate-fade-in-up delay-2 axr-gradient-text" style={{
              fontSize: "clamp(3.2rem, 9vw, 6rem)", fontWeight: 900, lineHeight: 1.0,
              marginBottom: 22, letterSpacing: "-0.045em",
              fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
              zIndex: 1, position: "relative",
            }}>
              Astral X Realm
            </h1>
            <p className="animate-fade-in-up delay-3" style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.42)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.78, fontWeight: 400, zIndex: 1 }}>
              The ultimate Discord &amp; WhatsApp RPG. Battle dungeons, collect legendary cards, build your guild, and climb the global leaderboard.
            </p>

            {/* Primary CTAs */}
            <div className="animate-fade-in-up delay-4" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 14, width: "100%", zIndex: 1 }}>
              <button
                onClick={() => player ? navigate('/profile') : openSignup()}
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #22d3ee 100%)",
                  color: "#fff", border: "none", borderRadius: 999,
                  padding: "14px 32px", fontSize: "0.92rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "Outfit, sans-serif",
                  boxShadow: "0 0 40px rgba(139,92,246,0.35), 0 4px 20px rgba(0,0,0,0.4)",
                  transition: "transform 0.22s, box-shadow 0.22s", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(139,92,246,0.5), 0 6px 28px rgba(0,0,0,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(139,92,246,0.35), 0 4px 20px rgba(0,0,0,0.4)"; }}>
                {player ? "Go to Profile" : "Get Started Free"}
              </button>
              <Link href="/leaderboard" style={{
                background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.82)",
                border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 999,
                padding: "14px 30px", fontSize: "0.92rem", fontWeight: 500,
                cursor: "pointer", fontFamily: "Outfit, sans-serif", textDecoration: "none",
                display: "inline-block", transition: "border-color 0.2s, background 0.2s", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}>
                View Leaderboard
              </Link>
            </div>

            {/* Discord + WhatsApp */}
            <div className="animate-fade-in-up delay-4" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", width: "100%", zIndex: 1 }}>
              <a href="https://discord.gg/s9fNUgHVT" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(88,101,242,0.18)", color: "#818cf8",
                border: "0.5px solid rgba(88,101,242,0.38)",
                borderRadius: 999, padding: "10px 22px", fontSize: "0.83rem", fontWeight: 700,
                textDecoration: "none", fontFamily: "Outfit, sans-serif",
                transition: "background 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(88,101,242,0.28)"; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(88,101,242,0.18)"; e.currentTarget.style.transform = "scale(1)"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                Join Discord
              </a>
              <a href="https://chat.whatsapp.com/HngJ76A2bzkCfK3rV74Ebk" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(37,211,102,0.12)", color: "#4ade80",
                border: "0.5px solid rgba(37,211,102,0.3)",
                borderRadius: 999, padding: "10px 22px", fontSize: "0.83rem", fontWeight: 700,
                textDecoration: "none", fontFamily: "Outfit, sans-serif",
                transition: "background 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,211,102,0.2)"; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(37,211,102,0.12)"; e.currentTarget.style.transform = "scale(1)"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                Join WhatsApp
              </a>
            </div>
          </section>

          <HomeStatsBar />

          {/* ── Featured champion ── */}
          {featured && (
            <section className="animate-fade-in-up delay-2 section-card axr-accent-glow-cyan" style={{
              marginBottom: 48, padding: "22px 24px",
              display: "flex", flexWrap: "wrap", alignItems: "center",
              justifyContent: "space-between", gap: 16,
              border: "0.5px solid rgba(34,211,238,0.22)",
              background: "linear-gradient(135deg, rgba(8,8,16,0.95), rgba(8,16,24,0.9))",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "linear-gradient(145deg, rgba(139,92,246,0.45), rgba(34,211,238,0.2))",
                  border: "0.5px solid rgba(34,211,238,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem", fontWeight: 900, color: "#fff",
                  boxShadow: "0 0 24px rgba(34,211,238,0.12)",
                }}>
                  {capHero(featured.name).charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(34,211,238,0.8)", textTransform: "uppercase", marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22d3ee", display: "inline-block", animation: "liveBlip 1.6s ease-in-out infinite" }} />
                    Featured champion · live ladder
                  </div>
                  <div style={{ fontSize: "1.08rem", fontWeight: 800 }}>{capHero(featured.name)}</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                    Rank #{featured.rank} · Lv.{featured.level}
                    {(() => {
                      const g = featured.guildName || (featured.guild && !featured.guild.startsWith("guild_") ? featured.guild : "");
                      return g ? ` · ${g}` : "";
                    })()}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", minWidth: 120 }}>
                <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)", marginBottom: 4 }}>Eliminations logged</div>
                <div className="axr-gradient-text-cyan" style={{ fontSize: "1.5rem", fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
                  {(featured.kills || 0).toLocaleString()}
                </div>
              </div>
              <Link href="/leaderboard" style={{
                alignSelf: "center", borderRadius: 999, padding: "8px 20px",
                fontWeight: 700, fontSize: "0.78rem", textDecoration: "none",
                background: "rgba(34,211,238,0.1)", border: "0.5px solid rgba(34,211,238,0.3)",
                color: "#67e8f9", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap",
                transition: "background 0.18s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(34,211,238,0.18)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(34,211,238,0.1)")}>
                See standings
              </Link>
            </section>
          )}

          {/* ── Bot Fleet ── */}
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(196,181,253,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>Fleet status · merges with /api/bots when online</div>
              <div className="bot-cards-scroll" style={{ display: "flex", gap: 20, justifyContent: "center", overflowX: "auto", paddingBottom: 12, WebkitOverflowScrolling: "touch" as never, scrollSnapType: "x mandatory", paddingTop: 4 }}>
                {([
                  { name: "Gon",      match: "gon",      img: "/bot_gon.jpg",      desc: "Quests, raids, guild management, and progression hooks.", accentA: "#66bb66", accentB: "#33aa33", accentC: "#aaee44" },
                  { name: "Zesnitsu", match: "zes",      img: "/bot_zesnitsu.jpg", desc: "Combat rewards, support flows, economy touchpoints.",     accentA: "#ffe566", accentB: "#ffaa22", accentC: "#ff6633" },
                  { name: "Giyu",     match: "giyu",     img: "/bot_giyu.jpg",     desc: "Events, duels, leaderboard sync with the portal API.",   accentA: "#44aacc", accentB: "#cc3344", accentC: "#226688" },
                  { name: "Rimiru",   match: "rimiru",   img: "/bot_rimiru.jpg",   desc: "Reserved for rotations, banners, and future live ops.",  accentA: "#8899ff", accentB: "#5566cc", accentC: "#334499" },
                ] as const).map(cfg => {
                  const api = pickBotStat(botStats, cfg.match);
                  const online = cfg.name === "Rimiru" ? false : (api?.online ?? true);
                  const status = online ? "Online" : "Offline";
                  const uptime = cfg.name === "Rimiru" ? "—" : (api?.uptime ?? (online ? "99.9%" : "—"));
                  const ping = api?.ping != null ? `${api.ping}ms` : "—";
                  const servers = api?.servers != null ? String(api.servers) : "—";
                  const commands = api?.commands != null ? String(api.commands) : "449";
                  return (
                    <BotFleetCard
                      key={cfg.name}
                      name={cfg.name}
                      img={cfg.img}
                      desc={cfg.desc}
                      accentA={cfg.accentA}
                      accentB={cfg.accentB}
                      accentC={cfg.accentC}
                      online={online}
                      status={status}
                      uptime={uptime}
                      ping={ping}
                      servers={servers}
                      commands={commands}
                    />
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Premium Banner ── */}
          <div className="animate-fade-in-up delay-2" style={{
            background: "linear-gradient(135deg, rgba(10,6,22,0.95), rgba(6,14,22,0.92))",
            border: "0.5px solid rgba(139,92,246,0.3)",
            borderRadius: 18, padding: "22px 28px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 14, marginBottom: 60,
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 60px rgba(139,92,246,0.08), 0 8px 40px rgba(0,0,0,0.5)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="pulse-glow-violet" style={{
                width: 46, height: 46, borderRadius: 13,
                background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.15))",
                border: "0.5px solid rgba(139,92,246,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <CrownIcon size={20} color="#a78bfa" />
              </div>
              <div>
                <div style={{ fontSize: "0.96rem", fontWeight: 700, color: "#fff" }}>Astral Premium — Season 12</div>
                <div style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.42)", marginTop: 3 }}>1,500 Gold/day · 5 exclusive cards/mo · Elite PvP bracket · from ₦1,000/mo</div>
              </div>
            </div>
            <Link href="/shop" style={{
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              color: "#fff", borderRadius: 999, padding: "10px 26px",
              fontSize: "0.82rem", fontWeight: 700, textDecoration: "none",
              display: "inline-block", whiteSpace: "nowrap",
              boxShadow: "0 0 24px rgba(139,92,246,0.3)",
              transition: "opacity 0.18s, transform 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}>
              View Plans
            </Link>
          </div>

          <SeasonPatchStrip />

          {/* ── How to Play ── */}
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ marginBottom: 36, textAlign: "center" }}>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>How It Works</div>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.035em", fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif" }}>Get Playing in Minutes</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
              {steps.map((s, i) => (
                <div key={s.num} className={`animate-fade-in-up delay-${i + 2} section-card`}
                  style={{ padding: "30px 26px", position: "relative", overflow: "hidden", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLDivElement).style.borderColor = s.accent + "44"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${s.accent}22`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                  <div style={{ position: "absolute", top: 20, right: 22, fontSize: "4rem", fontWeight: 900, color: "rgba(255,255,255,0.03)", lineHeight: 1, userSelect: "none" }}>{s.num}</div>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.accent}00, ${s.accent}66, ${s.accent}00)`, borderRadius: "18px 18px 0 0" }} />
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${s.accent}18`, border: `0.5px solid ${s.accent}44`,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
                  }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: s.accent }}>{s.num}</span>
                  </div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.68 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Astral Cubes ── */}
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ marginBottom: 28, textAlign: "center" }}>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Loot System</div>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.035em", fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif" }}>Astral Cubes</h2>
              <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.36)", marginTop: 8, maxWidth: 480, margin: "8px auto 0" }}>Crack open token boxes earned through battle. Collect Spin Tokens and trade them for gems, rare loot, or legendary seasonal weapons.</p>
            </div>
            <div className="animate-fade-in-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              {cubes.map(cube => (
                <div key={cube.id} style={{
                  background: "rgba(8,8,14,0.9)", border: `0.5px solid ${cube.borderColor}`,
                  borderRadius: 18, padding: "26px 22px",
                  transition: "transform 0.22s, box-shadow 0.22s",
                  backdropFilter: "blur(14px)",
                  boxShadow: cube.accentGlow,
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = cube.accentGlow === "none" ? "0 12px 40px rgba(0,0,0,0.5)" : cube.accentGlow; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = cube.accentGlow; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: "2.4rem", lineHeight: 1 }}>{cube.emoji}</div>
                    <div>
                      <div style={{ fontSize: "0.97rem", fontWeight: 700, color: "#fff" }}>{cube.name}</div>
                      <div style={{ fontSize: "0.68rem", color: cube.rarityColor, marginTop: 3, fontWeight: 600 }}>{cube.rarity} · Tier {cube.tier}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.62, marginBottom: 14 }}>{cube.desc}</p>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: "0.64rem", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Possible Drops</div>
                    {cube.drops.map(d => (
                      <div key={d} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: cube.rarityColor, flexShrink: 0, display: "inline-block" }} />
                        {d}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: 10, marginTop: 8 }}>
                    <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 4 }}>How to get:</span>{cube.howToGet}
                  </div>
                </div>
              ))}
            </div>
            <div className="animate-fade-in-up delay-3" style={{ marginTop: 16, textAlign: "center", fontSize: "0.78rem", color: "rgba(255,255,255,0.28)" }}>
              Collect 1,000 Spin Tokens → convert to 50 Gems · use <code style={{ background: "rgba(255,255,255,0.06)", borderRadius: 5, padding: "1px 6px" }}>!unbox</code> in-game to open
            </div>
          </section>

          {/* ── Features Grid ── */}
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Features</div>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.035em", fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif" }}>Everything in One Bot</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {features.map((f, i) => (
                <div key={f.title} className={`animate-fade-in-up delay-${i + 2} section-card`}
                  style={{ padding: "24px 22px", transition: "border-color 0.22s, transform 0.22s, box-shadow 0.22s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.16)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                  <div className={f.iconClass} style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, transition: "transform 0.22s" }}>
                    <f.Icon size={20} color={f.iconColor} />
                  </div>
                  <h3 style={{ fontSize: "0.97rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.68 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Guild Spotlight ── */}
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "inline-block", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Top Guilds</div>
                <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.035em", fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif" }}>Guild Spotlight</h2>
              </div>
              <Link href="/leaderboard" style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textDecoration: "none", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "7px 18px", display: "inline-block", transition: "border-color 0.18s, color 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}>
                Full Leaderboard
              </Link>
            </div>
            <div className="animate-fade-in-up delay-2 section-card" style={{ overflow: "hidden" }}>
              {guilds.map((g, i) => (
                <div key={g.name} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: 12, padding: "18px 24px",
                  borderBottom: i < guilds.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9,
                      background: i < 3 ? `${rankColors[i]}18` : "rgba(255,255,255,0.04)",
                      border: `0.5px solid ${i < 3 ? rankColors[i] + "44" : "rgba(255,255,255,0.08)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: i < 3 ? rankColors[i] : "rgba(255,255,255,0.3)" }}>#{g.rank}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#fff" }}>{g.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{g.members} members</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.87rem", fontWeight: 600, color: i < 3 ? rankColors[i] : "rgba(255,255,255,0.55)" }}>{g.kills.toLocaleString()} kills</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="animate-fade-in-up delay-2" style={{
            textAlign: "center", padding: "68px 32px", marginBottom: 40,
            background: "linear-gradient(135deg, rgba(8,4,20,0.95), rgba(4,10,24,0.92))",
            border: "0.5px solid rgba(139,92,246,0.22)",
            borderRadius: 24, backdropFilter: "blur(16px)",
            position: "relative", overflow: "hidden",
            boxShadow: "0 0 80px rgba(139,92,246,0.08), 0 16px 60px rgba(0,0,0,0.6)",
          }}>
            <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 500, height: 400, background: "radial-gradient(ellipse at center, rgba(139,92,246,0.1) 0%, transparent 68%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(34,211,238,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
            <h2 style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.8rem)", fontWeight: 900, color: "#fff", marginBottom: 14, letterSpacing: "-0.045em", position: "relative", fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif" }}>
              Ready to Enter<br />
              <span className="axr-gradient-text">the Realm?</span>
            </h2>
            <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.4)", marginBottom: 36, maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.72, position: "relative" }}>Join 10,000+ players already battling across Discord and WhatsApp. Free to start — always.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <button
                onClick={() => player ? navigate('/profile') : openSignup()}
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #22d3ee 100%)",
                  color: "#fff", border: "none", borderRadius: 999,
                  padding: "15px 44px", fontSize: "0.95rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "Outfit, sans-serif",
                  boxShadow: "0 0 44px rgba(139,92,246,0.38)",
                  transition: "transform 0.22s, box-shadow 0.22s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 64px rgba(139,92,246,0.52)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 44px rgba(139,92,246,0.38)"; }}>
                {player ? "Go to Profile" : "Create Account — Free"}
              </button>
            </div>
          </section>

        </div>
        <Footer />
      </div>
    </div>
  );
}
