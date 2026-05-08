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

/* ── Snow Canvas (home-only, z-index 0, pointer-events none) ── */
function SnowCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const count = Math.min(100, Math.floor(window.innerWidth / 10));
    const flakes = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vy: 0.3 + Math.random() * 0.5, vx: (Math.random() - 0.5) * 0.2,
      size: 0.6 + Math.random() * 1.2, opacity: 0.025 + Math.random() * 0.065,
      angle: Math.random() * Math.PI * 2, as: (Math.random() - 0.5) * 0.015,
    }));
    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const f of flakes) {
        ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.opacity})`; ctx.fill();
        f.y += f.vy; f.x += f.vx + Math.sin(f.angle) * 0.15; f.angle += f.as;
        if (f.y > canvas.height + 4) { f.y = -4; f.x = Math.random() * canvas.width; }
        if (f.x < -4) f.x = canvas.width + 4;
        if (f.x > canvas.width + 4) f.x = -4;
      }
      frame = requestAnimationFrame(draw);
    };
    draw(); window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  /* z-index: 0 keeps snow BELOW page-root content (z-index: 1) */
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

const features = [
  { Icon: SwordIcon,  title: "Dungeon Raids",  desc: "Explore multi-floor dungeons with your party. Unlock elite loot and boss drops.",          accent: "#f87171" },
  { Icon: ShieldIcon, title: "Guild Wars",      desc: "Form guilds of up to 50 players. Fight for territory control and guild rankings.",         accent: "#22d3ee" },
  { Icon: ChestIcon,  title: "Loot System",     desc: "Over 1,200 unique items. Rare drops, forge upgrades, and seasonal chests.",               accent: "#fbbf24" },
  { Icon: DiceIcon,   title: "Casino & Events", desc: "Spin the wheel, play blackjack, earn bonus gold from limited-time events.",               accent: "#c084fc" },
  { Icon: TrophyIcon, title: "Ranked Season",   desc: "Compete in seasonal PvP ladders. Earn exclusive rewards and prestige titles.",            accent: "#a78bfa" },
  { Icon: BoltIcon,   title: "Daily Quests",    desc: "3 fresh quests every day. Chain streaks for bonus XP and rare item rewards.",             accent: "#4ade80" },
  { Icon: GemIcon,    title: "Player Market",   desc: "List items for sale, browse stalls, and trade directly with other players for profit.",   accent: "#fb923c" },
  { Icon: MapIcon,    title: "Forge & Craft",   desc: "Smelt materials, craft powerful gear, and upgrade your weapons at the forge.",            accent: "#60a5fa" },
];

const steps = [
  { num: "01", title: "Add the Bot",         desc: "Invite Astral X Realm to your Discord server or WhatsApp group in one click.",   accent: "#a78bfa" },
  { num: "02", title: "Create Your Hero",    desc: "Choose your class, name your character, and set up your profile.",                accent: "#22d3ee" },
  { num: "03", title: "Battle & Collect",    desc: "Fight monsters, collect loot, and rise through the ranks.",                       accent: "#fbbf24" },
];

const cubes = [
  { id: "token_box_mid",    name: "Mid Token Box",    emoji: "📦", tier: "Mid",    rarity: "Common",   desc: "A dusty crate from deep in the dungeon. Contains 1–15 Spin Tokens.", drops: ["Spin Tokens (1–15)", "Random Common Items"],              howToGet: "Dungeon floors, daily quests",           accent: "rgba(255,255,255,0.15)", glow: "none" },
  { id: "token_box_medium", name: "Medium Token Box", emoji: "🎁", tier: "Medium", rarity: "Rare",     desc: "A reinforced chest packed with a decent haul of Spin Tokens.",        drops: ["Spin Tokens (16–40)", "Random Uncommon Items"],           howToGet: "Boss drops, exploration rewards",        accent: "rgba(96,165,250,0.35)",  glow: "0 0 30px rgba(96,165,250,0.06)" },
  { id: "token_box_peak",   name: "Peak Token Box",   emoji: "💠", tier: "Peak",   rarity: "Epic",     desc: "A crystalline vault. Only the best adventurers crack one open.",       drops: ["Spin Tokens (41–100)", "Rare gear or summon fragments"],  howToGet: "World boss kills, ranked dungeon rewards", accent: "rgba(192,132,252,0.45)", glow: "0 0 40px rgba(192,132,252,0.08)" },
];

interface GuildRow { name: string; rank: number; members: number; kills: number; }
function deriveTopGuilds(players: LeaderboardEntry[]): GuildRow[] {
  const map = new Map<string, { kills: number; members: number; name: string }>();
  for (const p of players) {
    const gName = p.guildName || p.guild;
    if (!gName || gName.startsWith("guild_")) continue;
    const entry = map.get(gName) || { kills: 0, members: 0, name: gName };
    entry.kills += p.kills || 0; entry.members += 1;
    map.set(gName, entry);
  }
  return Array.from(map.values()).sort((a, b) => b.kills - a.kills).slice(0, 4).map((g, i) => ({ ...g, rank: i + 1 }));
}
const fallbackGuilds: GuildRow[] = [
  { name: "Eclipse Order",  rank: 1, members: 48, kills: 2841 },
  { name: "Solar Vanguard", rank: 2, members: 45, kills: 2480 },
  { name: "Crimson Dawn",   rank: 3, members: 50, kills: 2210 },
  { name: "Void Pact",      rank: 4, members: 39, kills: 1990 },
];

function cap(s?: string) { if (!s) return "—"; return s.charAt(0).toUpperCase() + s.slice(1); }
function pickBotStat(stats: BotStat[], fragment: string) { return stats.find(b => b.name.toLowerCase().includes(fragment.toLowerCase())); }

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.42)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
      {text}
    </div>
  );
}

export default function Home() {
  const { openSignup, player } = useAuth();
  const [, navigate] = useLocation();
  const [guilds, setGuilds]       = useState<GuildRow[]>(fallbackGuilds);
  const [featured, setFeatured]   = useState<LeaderboardEntry | null>(null);
  const [botStats, setBotStats]   = useState<BotStat[]>([]);

  useEffect(() => {
    getLeaderboard()
      .then(players => {
        const derived = deriveTopGuilds(players);
        if (derived.length > 0) setGuilds(derived);
        if (players[0]) setFeatured(players[0]);
      })
      .catch(() => {});
    getBotStats().then(setBotStats).catch(() => setBotStats([]));
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <SnowCanvas />

      <Nav />
      <RealmFeed />
      <div className="section-wrap" style={{ padding: "0 20px" }}>

        {/* Player command center (logged in only) */}
        {player && (
          <div style={{ paddingTop: 20 }}>
            <HomeCommandCenter player={player} navigate={navigate} />
          </div>
        )}

        {/* ── Hero ── */}
        <section style={{ textAlign: "center", padding: "80px 0 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Logo */}
          <div className="anim-float" style={{ position: "relative", display: "inline-block", marginBottom: 28, borderRadius: "50%" }}>
            <div style={{ position: "absolute", inset: -14, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)", filter: "blur(8px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: -5, borderRadius: "50%", background: "conic-gradient(from 0deg, rgba(139,92,246,0.5), rgba(34,211,238,0.4), rgba(139,92,246,0.5))", filter: "blur(2px)", opacity: 0.6 }} />
            <img src={astralIcon} alt="Astral X Realm" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.25)", display: "block", position: "relative", zIndex: 1 }} />
          </div>

          <div className="pill-v anim-up d1" style={{ marginBottom: 22 }}>
            <span className="live-dot" />
            Season 1 · Now Live
          </div>

          <h1 className="anim-up d2" style={{
            fontSize: "clamp(3rem, 9vw, 5.8rem)", fontWeight: 900, lineHeight: 1.0,
            marginBottom: 20, letterSpacing: "-0.055em",
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            background: "linear-gradient(140deg, #ffffff 0%, #e0d7ff 35%, #a5f3fc 65%, #c4b5fd 90%)",
            WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Astral X Realm
          </h1>

          <p className="anim-up d3" style={{ fontSize: "clamp(0.9rem, 2.2vw, 1.08rem)", color: "rgba(255,255,255,0.42)", maxWidth: 520, margin: "0 auto 38px", lineHeight: 1.8, fontWeight: 400 }}>
            The ultimate Discord &amp; WhatsApp RPG. Battle dungeons, collect legendary cards, build your guild, and climb the global leaderboard.
          </p>

          {/* Primary CTAs */}
          <div className="anim-up d4" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 16, width: "100%", maxWidth: "100vw" }}>
            <button
              onClick={() => player ? navigate("/profile") : openSignup()}
              style={{
                background: "#fff", color: "#000", border: "none", borderRadius: 999,
                padding: "13px 30px", fontSize: "0.9rem", fontWeight: 800,
                cursor: "pointer", fontFamily: "Outfit, sans-serif",
                boxShadow: "0 0 40px rgba(255,255,255,0.12)",
                transition: "transform 0.2s, box-shadow 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(255,255,255,0.22)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(255,255,255,0.12)"; }}
            >
              {player ? "Go to Profile" : "Get Started Free"}
            </button>
            <Link href="/leaderboard" style={{
              background: "transparent", color: "rgba(255,255,255,0.75)",
              border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 999,
              padding: "13px 28px", fontSize: "0.9rem", fontWeight: 600,
              textDecoration: "none", display: "inline-block",
              transition: "border-color 0.2s, color 0.2s", whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
            >View Leaderboard</Link>
          </div>

          {/* Social CTAs */}
          <div className="anim-up d5" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", width: "100%", maxWidth: "100vw" }}>
            {[
              { href: "https://discord.gg/s9fNUgHVT", color: "#5865F2", label: "Join Discord", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg> },
              { href: "https://chat.whatsapp.com/HngJ76A2bzkCfK3rV74Ebk", color: "#25D366", label: "Join WhatsApp", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: s.color, color: "#fff", borderRadius: 999, padding: "11px 26px", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", fontFamily: "Outfit, sans-serif", transition: "opacity 0.2s, transform 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}>
                {s.icon}{s.label}
              </a>
            ))}
          </div>
        </section>

        {/* Stats bar */}
        <HomeStatsBar />

        {/* Featured champion */}
        {featured && (
          <section className="anim-up d2" style={{ marginBottom: 48 }}>
            <div style={{
              padding: "22px 24px", display: "flex", flexWrap: "wrap", alignItems: "center",
              justifyContent: "space-between", gap: 16,
              background: "rgba(6,18,24,0.9)", border: "0.5px solid rgba(34,211,238,0.22)",
              borderRadius: 18, backdropFilter: "blur(14px)",
              boxShadow: "0 0 40px rgba(34,211,238,0.04), 0 10px 40px rgba(0,0,0,0.5)",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,211,238,0.05) 0%, transparent 70%)", borderRadius: 18, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: "linear-gradient(145deg, rgba(124,92,255,0.5), rgba(34,211,238,0.15))", border: "0.5px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.15rem", fontWeight: 800, color: "#fff" }}>
                  {cap(featured.name).charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(34,211,238,0.7)", textTransform: "uppercase", marginBottom: 4 }}>Featured Champion · Live Ladder</div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>{cap(featured.name)}</div>
                  <div style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
                    Rank #{featured.rank} · Lv.{featured.level}{(() => { const g = featured.guildName || (featured.guild && !featured.guild.startsWith("guild_") ? featured.guild : ""); return g ? ` · ${g}` : ""; })()}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", minWidth: 120, position: "relative" }}>
                <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)", marginBottom: 4 }}>Eliminations logged</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, fontVariantNumeric: "tabular-nums", background: "linear-gradient(90deg,#fff,#a5f3fc)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{(featured.kills || 0).toLocaleString()}</div>
              </div>
              <Link href="/leaderboard" style={{ alignSelf: "center", borderRadius: 999, padding: "8px 18px", fontWeight: 700, fontSize: "0.78rem", textDecoration: "none", border: "0.5px solid rgba(255,255,255,0.2)", color: "#fff", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}>
                See standings
              </Link>
            </div>
          </section>
        )}

        {/* Bot Fleet */}
        <section style={{ marginBottom: 60 }}>
          <div className="anim-up d1" style={{ marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: "0.66rem", fontWeight: 600, color: "rgba(196,181,253,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Fleet status · live</div>
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", overflowX: "auto", paddingBottom: 12, WebkitOverflowScrolling: "touch" as never, scrollSnapType: "x mandatory", paddingTop: 4, scrollbarWidth: "none" }} className="bot-fleet-scroll">
            {([
              { name: "Gon",      match: "gon",    img: "/bot_gon.jpg",      desc: "Quests, raids, guild management, and progression hooks.",    accentA: "#66bb66", accentB: "#33aa33", accentC: "#aaee44" },
              { name: "Zesnitsu", match: "zes",    img: "/bot_zesnitsu.jpg", desc: "Combat rewards, support flows, economy touchpoints.",        accentA: "#ffe566", accentB: "#ffaa22", accentC: "#ff6633" },
              { name: "Giyu",     match: "giyu",   img: "/bot_giyu.jpg",     desc: "Events, duels, leaderboard sync with the portal API.",       accentA: "#44aacc", accentB: "#cc3344", accentC: "#226688" },
              { name: "Rimiru",   match: "rimiru", img: "/bot_rimiru.jpg",   desc: "Reserved for rotations, banners, and future live ops.",      accentA: "#8899ff", accentB: "#5566cc", accentC: "#334499" },
            ] as const).map(cfg => {
              const api = pickBotStat(botStats, cfg.match);
              const online = cfg.name === "Rimiru" ? false : (api?.online ?? true);
              return (
                <BotFleetCard
                  key={cfg.name}
                  name={cfg.name} img={cfg.img} desc={cfg.desc}
                  accentA={cfg.accentA} accentB={cfg.accentB} accentC={cfg.accentC}
                  online={online} status={online ? "Online" : "Offline"}
                  uptime={cfg.name === "Rimiru" ? "—" : (api?.uptime ?? (online ? "99.9%" : "—"))}
                  ping={api?.ping != null ? `${api.ping}ms` : "—"}
                  servers={api?.servers != null ? String(api.servers) : "—"}
                  commands={api?.commands != null ? String(api.commands) : "449"}
                />
              );
            })}
          </div>
        </section>

        {/* Premium banner */}
        <div className="anim-up d2" style={{ background: "rgba(8,6,22,0.88)", border: "0.5px solid rgba(139,92,246,0.3)", borderRadius: 18, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 60, backdropFilter: "blur(14px)", boxShadow: "0 0 40px rgba(139,92,246,0.05), 0 10px 40px rgba(0,0,0,0.4)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 0% 50%, rgba(139,92,246,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,0.12)", border: "0.5px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CrownIcon size={20} color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize: "0.94rem", fontWeight: 800, color: "#fff", marginBottom: 3 }}>Astral Premium — Season 1</div>
              <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>1,500 Gold/day · 5 exclusive cards/mo · Elite PvP bracket · from ₦1,000/mo</div>
            </div>
          </div>
          <Link href="/topup" style={{ background: "linear-gradient(135deg, #7c3aed, #22d3ee)", color: "#fff", borderRadius: 999, padding: "10px 24px", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", display: "inline-block", whiteSpace: "nowrap", boxShadow: "0 0 20px rgba(124,58,237,0.3)", position: "relative" }}>
            View Plans
          </Link>
        </div>

        <SeasonPatchStrip />

        {/* How to Play */}
        <section style={{ marginBottom: 60 }}>
          <div className="anim-up d1" style={{ marginBottom: 36, textAlign: "center" }}>
            <SectionLabel text="How It Works" />
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Get Playing in Minutes</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {steps.map((s, i) => (
              <div key={s.num} className={`anim-up d${i + 2}`} style={{
                padding: "28px 26px", position: "relative", overflow: "hidden",
                background: "rgba(6,6,14,0.88)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 18,
                backdropFilter: "blur(14px)", transition: "border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = `${s.accent}44`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                <div style={{ position: "absolute", top: 16, right: 18, fontSize: "3.8rem", fontWeight: 900, color: "rgba(255,255,255,0.035)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{s.num}</div>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.accent}14`, border: `0.5px solid ${s.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: s.accent }}>{s.num}</span>
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: "0.81rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Astral Cubes */}
        <section style={{ marginBottom: 60 }}>
          <div className="anim-up d1" style={{ marginBottom: 28, textAlign: "center" }}>
            <SectionLabel text="Loot System" />
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Astral Cubes</h2>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", marginTop: 8, maxWidth: 480, margin: "8px auto 0", lineHeight: 1.7 }}>Crack open token boxes earned through battle. Collect Spin Tokens and trade them for gems, rare loot, or legendary seasonal weapons.</p>
          </div>
          <div className="anim-up d2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {cubes.map(cube => (
              <div key={cube.id} style={{
                background: "rgba(6,6,14,0.9)", border: `0.5px solid ${cube.accent}`, borderRadius: 18,
                padding: "24px 22px", transition: "transform 0.22s, box-shadow 0.22s", backdropFilter: "blur(12px)",
                boxShadow: cube.glow,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: "2.2rem", lineHeight: 1 }}>{cube.emoji}</div>
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>{cube.name}</div>
                    <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{cube.rarity} · Tier {cube.tier}</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.65, marginBottom: 14 }}>{cube.desc}</p>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: "0.64rem", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Possible Drops</div>
                  {cube.drops.map(d => (
                    <div key={d} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.28)", flexShrink: 0 }} />{d}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: "0.71rem", color: "rgba(255,255,255,0.3)", borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: 10, marginTop: 8 }}>
                  <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 4 }}>How to get:</span>{cube.howToGet}
                </div>
              </div>
            ))}
          </div>
          <div className="anim-up d3" style={{ marginTop: 16, textAlign: "center", fontSize: "0.77rem", color: "rgba(255,255,255,0.3)" }}>
            Collect 1,000 Spin Tokens → convert to 50 Gems · use <code style={{ background: "rgba(255,255,255,0.06)", borderRadius: 5, padding: "1px 6px", color: "rgba(196,181,253,0.7)" }}>!unbox</code> in-game to open
          </div>
        </section>

        {/* Features Grid */}
        <section style={{ marginBottom: 60 }}>
          <div className="anim-up d1" style={{ textAlign: "center", marginBottom: 36 }}>
            <SectionLabel text="Features" />
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Everything in One Bot</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {features.map((f, i) => (
              <div key={f.title} className={`anim-up d${(i % 4) + 2}`} style={{
                padding: "22px 20px", background: "rgba(6,6,14,0.88)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 18,
                backdropFilter: "blur(12px)", transition: "border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.borderColor = `${f.accent}35`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 11, background: `${f.accent}10`, border: `0.5px solid ${f.accent}28`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <f.Icon size={19} color={f.accent} />
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Guild Spotlight */}
        <section style={{ marginBottom: 60 }}>
          <div className="anim-up d1" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <div>
              <SectionLabel text="Top Guilds" />
              <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Guild Spotlight</h2>
            </div>
            <Link href="/leaderboard" style={{ fontSize: "0.77rem", fontWeight: 600, color: "rgba(255,255,255,0.42)", textDecoration: "none", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "7px 16px", transition: "border-color 0.18s, color 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.42)"; }}>
              Full Leaderboard
            </Link>
          </div>
          <div className="anim-up d2" style={{ background: "rgba(6,6,14,0.9)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden", backdropFilter: "blur(14px)" }}>
            {guilds.map((g, i) => (
              <div key={g.name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                padding: "16px 24px", borderBottom: i < guilds.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: i === 0 ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.04)", border: `0.5px solid ${i === 0 ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.09)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: i === 0 ? "#fbbf24" : "rgba(255,255,255,0.35)" }}>{i === 0 ? "🥇" : `#${g.rank}`}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: i === 0 ? "#fff" : "rgba(255,255,255,0.82)" }}>{g.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.32)", marginTop: 2 }}>{g.members} members</div>
                  </div>
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: i === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)" }}>{g.kills.toLocaleString()} kills</div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="anim-up d2" style={{ textAlign: "center", padding: "64px 32px", marginBottom: 40, background: "rgba(8,6,22,0.92)", border: "0.5px solid rgba(139,92,246,0.2)", borderRadius: 22, backdropFilter: "blur(16px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 900, letterSpacing: "-0.045em", position: "relative", marginBottom: 14, fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif" }}>
            <span className="grad-white">Ready to Enter the Realm?</span>
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", marginBottom: 32, maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.75, position: "relative" }}>
            Join 10,000+ players already battling across Discord and WhatsApp. Free to start — always.
          </p>
          <button
            onClick={() => player ? navigate("/profile") : openSignup()}
            style={{ background: "#fff", color: "#000", border: "none", borderRadius: 999, padding: "14px 44px", fontSize: "0.92rem", fontWeight: 800, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: "0 0 40px rgba(255,255,255,0.1)", transition: "transform 0.2s, box-shadow 0.2s", position: "relative" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(255,255,255,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(255,255,255,0.1)"; }}
          >
            {player ? "Go to Profile" : "Create Account"}
          </button>
        </section>

      </div>
      <Footer />
    </div>
  );
}
