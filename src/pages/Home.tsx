import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SwordIcon, ShieldIcon, DiceIcon, ChestIcon, UsersIcon, MapIcon, GemIcon, CrownIcon, TrophyIcon, BoltIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import astralIcon from "/astral_icon.png";
import { Link, useLocation } from "wouter";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/api";

/* ── Snow Canvas (home-only) ── */
function SnowCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const count = Math.floor(window.innerWidth / 9);
    const flakes = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vy: 0.35 + Math.random() * 0.65, vx: (Math.random() - 0.5) * 0.25,
      size: 0.8 + Math.random() * 1.4, opacity: 0.04 + Math.random() * 0.09,
      angle: Math.random() * Math.PI * 2, as: (Math.random() - 0.5) * 0.018,
    }));
    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const f of flakes) {
        ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.opacity})`; ctx.fill();
        f.y += f.vy; f.x += f.vx + Math.sin(f.angle) * 0.2; f.angle += f.as;
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


const features = [
  { Icon: SwordIcon, title: "Dungeon Raids", desc: "Explore multi-floor dungeons with your party. Unlock elite loot and boss drops." },
  { Icon: ShieldIcon, title: "Guild Wars", desc: "Form guilds of up to 50 players. Fight for territory control and guild rankings." },
  { Icon: ChestIcon, title: "Loot System", desc: "Over 1,200 unique items. Rare drops, forge upgrades, and seasonal chests." },
  { Icon: DiceIcon, title: "Casino & Events", desc: "Spin the wheel, play blackjack, earn bonus gold from limited-time events." },
  { Icon: TrophyIcon, title: "Ranked Season", desc: "Compete in seasonal PvP ladders. Earn exclusive rewards and prestige titles." },
  { Icon: BoltIcon, title: "Daily Quests", desc: "3 fresh quests every day. Chain streaks for bonus XP and rare item rewards." },
  { Icon: GemIcon, title: "Player Market", desc: "List items for sale, browse stalls, and trade directly with other players for profit." },
  { Icon: MapIcon, title: "Forge & Craft", desc: "Smelt materials, craft powerful gear, and upgrade your weapons at the forge." },
];

const steps = [
  { num: "01", title: "Add the Bot", desc: "Invite Astral X Realm to your Discord server or WhatsApp group in one click." },
  { num: "02", title: "Create Your Hero", desc: "Choose your class, name your character, and set up your profile." },
  { num: "03", title: "Battle & Collect", desc: "Fight monsters, collect loot, and rise through the ranks." },
];

const stats = [
  { value: "10K+", label: "Active Players", Icon: UsersIcon },
  { value: "250K+", label: "Dungeons Cleared", Icon: MapIcon },
  { value: "1,200+", label: "Unique Items", Icon: GemIcon },
  { value: "840+", label: "Active Guilds", Icon: UsersIcon },
];

/* ── Astral Cubes / Spin System ── */
const cubes = [
  {
    id: "token_box_mid",
    name: "Mid Token Box",
    emoji: "📦",
    tier: "Mid",
    rarity: "Common",
    desc: "A dusty crate from deep in the dungeon. Contains 1–15 Spin Tokens.",
    drops: ["Spin Tokens (1–15)", "Random Common Items"],
    howToGet: "Dungeon floors, daily quests",
    borderColor: "rgba(255,255,255,0.08)",
  },
  {
    id: "token_box_medium",
    name: "Medium Token Box",
    emoji: "🎁",
    tier: "Medium",
    rarity: "Rare",
    desc: "A reinforced chest packed with a decent haul of Spin Tokens.",
    drops: ["Spin Tokens (16–40)", "Random Uncommon Items"],
    howToGet: "Boss drops, exploration rewards",
    borderColor: "rgba(255,255,255,0.22)",
  },
  {
    id: "token_box_peak",
    name: "Peak Token Box",
    emoji: "💠",
    tier: "Peak",
    rarity: "Epic",
    desc: "A crystalline vault. Only the best adventurers crack one open.",
    drops: ["Spin Tokens (41–100)", "Rare gear or summon fragments"],
    howToGet: "World boss kills, ranked dungeon rewards",
    borderColor: "rgba(255,255,255,0.4)",
  },
];

/* ── Guild Spotlight — live from leaderboard ── */
interface GuildRow {
  name: string;
  rank: number;
  members: number;
  kills: number;
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

export default function Home() {
  const { openSignup, player } = useAuth();
  const [, navigate] = useLocation();
  const [guilds, setGuilds] = useState<GuildRow[]>(fallbackGuilds);

  useEffect(() => {
    getLeaderboard().then(players => {
      const derived = deriveTopGuilds(players);
      if (derived.length > 0) setGuilds(derived);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#000", position: "relative" }}>
      <SnowCanvas />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

          {/* ── Hero ── */}
          <section style={{ textAlign: "center", padding: "80px 0 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            <div className="animate-fade-in-up pulse-glow" style={{ position: "relative", display: "inline-block", marginBottom: 28, borderRadius: "50%" }}>
              <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" }} />
              <img src={astralIcon} alt="logo" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.25)", display: "block", position: "relative", zIndex: 1 }} />
            </div>

            <div className="animate-fade-in-up delay-1">
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "4px 14px", fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
                Season 1 · Now Live
              </div>
            </div>

            <h1 className="animate-fade-in-up delay-2" style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.02, marginBottom: 20, letterSpacing: "-0.04em" }}>
              Astral X Realm
            </h1>
            <p className="animate-fade-in-up delay-3" style={{ fontSize: "clamp(0.95rem, 2vw, 1.12rem)", color: "rgba(255,255,255,0.42)", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.75, fontWeight: 400 }}>
              The ultimate Discord &amp; WhatsApp RPG. Battle dungeons, collect legendary cards, build your guild, and climb the global leaderboard.
            </p>

            <div className="animate-fade-in-up delay-4" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 20, width: "100%" }}>
              <button onClick={() => player ? navigate('/profile') : openSignup()} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 999, padding: "13px 28px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: "0 0 40px rgba(255,255,255,0.12)", transition: "transform 0.2s, box-shadow 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(255,255,255,0.12)"; }}>
                {player ? "Go to Profile" : "Get Started Free"}
              </button>
              <Link href="/leaderboard" style={{ background: "transparent", color: "rgba(255,255,255,0.8)", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "13px 28px", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif", textDecoration: "none", display: "inline-block", transition: "border-color 0.2s", whiteSpace: "nowrap" }}>
                View Leaderboard
              </Link>
            </div>

            {/* ── Discord + WhatsApp buttons ── */}
            <div className="animate-fade-in-up delay-4" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", width: "100%" }}>
              <a
                href="https://discord.gg/s9fNUgHVT"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#5865F2", color: "#fff", borderRadius: 999,
                  padding: "11px 26px", fontSize: "0.85rem", fontWeight: 700,
                  textDecoration: "none", fontFamily: "Outfit, sans-serif",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Join Discord
              </a>
              <a
                href="https://chat.whatsapp.com/HngJ76A2bzkCfK3rV74Ebk"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#25D366", color: "#fff", borderRadius: 999,
                  padding: "11px 26px", fontSize: "0.85rem", fontWeight: 700,
                  textDecoration: "none", fontFamily: "Outfit, sans-serif",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Join WhatsApp
              </a>
            </div>
          </section>

          {/* ── Stats bar ── */}
          <div className="animate-fade-in-up delay-3" className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", marginBottom: 60 }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ padding: "22px 20px", textAlign: "center", borderRight: i < stats.length - 1 ? "0.5px solid rgba(255,255,255,0.06)" : "none", background: "rgba(10,10,10,0.5)" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.38)", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Our Active Bots ── */}
          <style>{`
            .bot-card { overflow: visible; width: 190px; height: 254px; cursor: pointer; }
            .bot-card-inner {
              width: 100%; height: 100%;
              transform-style: preserve-3d;
              transition: transform 600ms cubic-bezier(0.4,0.2,0.2,1);
              box-shadow: 0px 0px 10px 1px #000000ee;
              border-radius: 5px;
            }
            .bot-card:hover .bot-card-inner { transform: rotateY(180deg); }
            .bot-face {
              background-color: #151515;
              position: absolute; width: 100%; height: 100%;
              backface-visibility: hidden; -webkit-backface-visibility: hidden;
              border-radius: 5px; overflow: hidden;
            }
            .bot-back {
              display: flex; justify-content: center; align-items: center;
            }
            .bot-back::before {
              position: absolute; content: ' '; display: block;
              width: 160px; height: 160%;
              background: linear-gradient(90deg, transparent, var(--bot-accent, #ff9966), var(--bot-accent, #ff9966), var(--bot-accent, #ff9966), transparent);
              animation: bot_spin 5000ms infinite linear;
            }
            .bot-back-inner {
              position: absolute; width: 99%; height: 99%;
              background-color: #151515; border-radius: 5px;
              overflow: hidden;
            }
            .bot-back-inner img {
              width: 100%; height: 100%; object-fit: cover; object-position: top center;
              opacity: 0.92;
            }
            .bot-front { transform: rotateY(180deg); color: white; }
            .bot-front-content {
              position: absolute; width: 100%; height: 100%; padding: 10px;
              display: flex; flex-direction: column; justify-content: space-between;
            }
            .bot-badge {
              background-color: #00000055; padding: 2px 10px; border-radius: 10px;
              backdrop-filter: blur(2px); width: fit-content; font-size: 10px;
            }
            .bot-desc-box {
              box-shadow: 0px 0px 10px 5px #00000088;
              width: 100%; padding: 10px;
              background-color: #00000099; backdrop-filter: blur(5px);
              border-radius: 5px;
            }
            .bot-circles { position: absolute; width: 100%; height: 100%; }
            .bot-circle {
              width: 90px; height: 90px; border-radius: 50%;
              background-color: #ffbb66; position: absolute;
              filter: blur(15px); animation: bot_float 2600ms infinite linear;
            }
            .bot-circle.r { background-color: #ff2233; left: 160px; top: -80px; width: 30px; height: 30px; animation-delay: -1800ms; }
            .bot-circle.b { background-color: #ff8866; left: 50px; top: 0px; width: 150px; height: 150px; animation-delay: -800ms; }
            @keyframes bot_float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(10px); } }
            @keyframes bot_spin { from { transform: rotateZ(0deg); } to { transform: rotateZ(360deg); } }
          `}</style>
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>OUR ACTIVE BOTS</div>
              <div className="bot-cards-scroll" style={{ display: "flex", gap: 20, justifyContent: "center", overflowX: "auto", paddingBottom: 8, WebkitOverflowScrolling: "touch" as any, scrollSnapType: "x mandatory" }}>
                {([
                  { name: "Gon",      img: "/bot_gon.jpg",      desc: "Active bot for quests, raids, and guild commands.",      accentA: "#66bb66", accentB: "#33aa33", accentC: "#aaee44" },
                  { name: "Zesnitsu", img: "/bot_zesnitsu.jpg", desc: "Handles battles, rewards, and player support.",          accentA: "#ffe566", accentB: "#ffaa22", accentC: "#ff6633" },
                  { name: "Giyu",     img: "/bot_giyu.jpg",     desc: "Manages events, duels, and leaderboard tracking.",       accentA: "#44aacc", accentB: "#cc3344", accentC: "#226688" },
                  { name: "Rimiru",   img: "/bot_rimiru.jpg",   desc: "Maintenance bot for future events and updates.",         accentA: "#8899ff", accentB: "#5566cc", accentC: "#334499" },
                ] as const).map(cfg => {
                  const online   = cfg.name !== "Rimiru";
                  const status   = online ? "Online" : "Offline";
                  const uptime   = online ? `${(97 + Math.floor(Math.random() * 29) / 10).toFixed(1)}%` : "—";
                  const ping     = online ? `${30 + Math.floor(Math.random() * 30)}ms` : "—";
                  const servers  = online ? "1" : "—";
                  const commands = "449";
                  return (
                  <div key={cfg.name} className="bot-card" style={{ flexShrink: 0, scrollSnapAlign: "start" }}>
                    <div className="bot-card-inner" style={{ "--bot-accent": cfg.accentA } as React.CSSProperties}>
                      {/* BACK — full bot image */}
                      <div className="bot-face bot-back">
                        <div className="bot-back-inner">
                          <img src={cfg.img} alt={cfg.name} />
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px", background: "linear-gradient(transparent, #000000cc)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{cfg.name}</span>
                            <span style={{ fontSize: 9, fontWeight: 600, color: online ? "#4ade80" : "#888", background: "rgba(0,0,0,0.5)", padding: "2px 7px", borderRadius: 99 }}>● {status}</span>
                          </div>
                        </div>
                      </div>
                      {/* FRONT — details */}
                      <div className="bot-face bot-front">
                        <div className="bot-circles">
                          <div className="bot-circle" style={{ backgroundColor: cfg.accentA }} />
                          <div className="bot-circle r" style={{ backgroundColor: cfg.accentC }} />
                          <div className="bot-circle b" style={{ backgroundColor: cfg.accentB }} />
                        </div>
                        <div className="bot-front-content">
                          <span className="bot-badge" style={{ color: online ? "#4ade80" : "#aaa" }}>● {status}</span>
                          <div className="bot-desc-box">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{cfg.name}</span>
                            </div>
                            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", margin: "0 0 8px", lineHeight: 1.5 }}>{cfg.desc}</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px" }}>
                              {[
                                { label: "Uptime",   val: uptime },
                                { label: "Ping",     val: ping },
                                { label: "Servers",  val: servers },
                                { label: "Commands", val: commands },
                              ].map(s => (
                                <div key={s.label}>
                                  <div style={{ fontSize: 7, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{s.val}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Premium Banner ── */}
          <div className="animate-fade-in-up delay-2" style={{ background: "rgba(10,10,10,0.85)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 18, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 60, backdropFilter: "blur(12px)", boxShadow: "0 0 40px rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="pulse-glow" style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CrownIcon size={19} color="rgba(255,255,255,0.9)" />
              </div>
              <div>
                <div style={{ fontSize: "0.94rem", fontWeight: 700, color: "#fff" }}>Astral Premium — Season 12</div>
                <div style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>1,500 Gold/day · 5 exclusive cards/mo · Elite PvP bracket · from ₦1,000/mo</div>
              </div>
            </div>
            <Link href="/shop" style={{ background: "#fff", color: "#000", borderRadius: 999, padding: "10px 24px", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", display: "inline-block", whiteSpace: "nowrap" }}>
              View Plans
            </Link>
          </div>

          {/* ── How to Play ── */}
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ marginBottom: 36, textAlign: "center" }}>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>How It Works</div>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Get Playing in Minutes</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
              {steps.map((s, i) => (
                <div key={s.num} className={`animate-fade-in-up delay-${i + 2} section-card`} style={{ padding: "28px 26px", position: "relative", overflow: "hidden", transition: "border-color 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.09)"; }}>
                  <div style={{ position: "absolute", top: 18, right: 20, fontSize: "3.5rem", fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 1, userSelect: "none" }}>{s.num}</div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>{s.num}</span>
                  </div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>


          {/* ── Astral Cubes ── */}
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ marginBottom: 28, textAlign: "center" }}>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Loot System</div>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Astral Cubes</h2>
              <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.38)", marginTop: 8, maxWidth: 480, margin: "8px auto 0" }}>Crack open token boxes earned through battle. Collect Spin Tokens and trade them for gems, rare loot, or legendary seasonal weapons.</p>
            </div>
            <div className="animate-fade-in-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              {cubes.map(cube => (
                <div key={cube.id} style={{ background: "rgba(10,10,10,0.85)", border: `0.5px solid ${cube.borderColor}`, borderRadius: 18, padding: "24px 22px", transition: "transform 0.2s, border-color 0.2s", backdropFilter: "blur(8px)" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: "2.2rem", lineHeight: 1 }}>{cube.emoji}</div>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>{cube.name}</div>
                      <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.38)", marginTop: 2, fontWeight: 500 }}>{cube.rarity} · Tier {cube.tier}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.6, marginBottom: 14 }}>{cube.desc}</p>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Possible Drops</div>
                    {cube.drops.map(d => (
                      <div key={d} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.3)", flexShrink: 0, display: "inline-block" }} />
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
            <div className="animate-fade-in-up delay-3" style={{ marginTop: 16, textAlign: "center", fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>
              Collect 1,000 Spin Tokens → convert to 50 Gems · use <code style={{ background: "rgba(255,255,255,0.06)", borderRadius: 5, padding: "1px 6px" }}>!unbox</code> in-game to open
            </div>
          </section>

          {/* ── Features Grid ── */}
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Features</div>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Everything in One Bot</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {features.map((f, i) => (
                <div key={f.title} className={`animate-fade-in-up delay-${i + 2} section-card`} style={{ padding: "22px 20px", transition: "border-color 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.09)"; }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <f.Icon size={19} color="rgba(255,255,255,0.6)" />
                  </div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Guild Spotlight ── */}
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Top Guilds</div>
                <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Guild Spotlight</h2>
              </div>
              <Link href="/leaderboard" style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textDecoration: "none", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "7px 16px", display: "inline-block" }}>
                Full Leaderboard
              </Link>
            </div>
            <div className="animate-fade-in-up delay-2 section-card" style={{ overflow: "hidden" }}>
              {guilds.map((g, i) => (
                <div key={g.name} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                  padding: "16px 24px", borderBottom: i < guilds.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: i === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: i === 0 ? "#fff" : "rgba(255,255,255,0.35)" }}>#{g.rank}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{g.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{g.members} members</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{g.kills.toLocaleString()} kills</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="animate-fade-in-up delay-2" style={{ textAlign: "center", padding: "60px 32px", marginBottom: 40, background: "rgba(10,10,10,0.85)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 22, backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 400, height: 300, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 800, color: "#fff", marginBottom: 14, letterSpacing: "-0.04em", position: "relative" }}>Ready to Enter the Realm?</h2>
            <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.4)", marginBottom: 32, maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.7 }}>Join 10,000+ players already battling across Discord and WhatsApp. Free to start — always.</p>
            <button onClick={() => player ? navigate('/profile') : openSignup()} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 999, padding: "14px 44px", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: "0 0 40px rgba(255,255,255,0.1)", transition: "transform 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
              {player ? "Go to Profile" : "Create Account"}
            </button>
          </section>

        </div>
        <Footer />
      </div>
      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid > div { border-right: none !important; border-bottom: 0.5px solid rgba(255,255,255,0.06); }
        }
      `}</style>
    </div>
  );
}
