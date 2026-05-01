import { useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GlowCard from "@/components/GlowCard";
import { SwordIcon, ShieldIcon, DiceIcon, ChestIcon, UsersIcon, MapIcon, GemIcon, CrownIcon, TrophyIcon, BoltIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import astralIcon from "/astral_icon.png";
import { Link } from "wouter";

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

/* ── Monster SVG icons for GlowCards ── */
const mc = "rgba(255,255,255,0.8)";
const md = "rgba(255,255,255,0.4)";

function SvgWyvern() {
  return <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
    <path d="M50 30 C42 34 36 42 36 52 C36 62 42 70 50 74 C58 70 64 62 64 52 C64 42 58 34 50 30Z" stroke={mc} strokeWidth="1.5" fill="rgba(255,255,255,0.04)"/>
    <path d="M50 30 C44 22 30 18 22 26 C28 28 36 32 36 52" stroke={mc} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M50 30 C56 22 70 18 78 26 C72 28 64 32 64 52" stroke={mc} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M22 26 L16 20 M22 26 L18 32" stroke={mc} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M78 26 L84 20 M78 26 L82 32" stroke={mc} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M50 74 L46 82 L50 86 L54 82 Z" fill={mc} opacity="0.7"/>
    <circle cx="44" cy="46" r="2" fill={mc}/>
    <circle cx="56" cy="46" r="2" fill={mc}/>
    <path d="M44 56 Q50 60 56 56" stroke={mc} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <path d="M36 52 L26 58 M36 52 L24 48" stroke={md} strokeWidth="1" strokeLinecap="round"/>
    <path d="M64 52 L74 58 M64 52 L76 48" stroke={md} strokeWidth="1" strokeLinecap="round"/>
  </svg>;
}
function SvgPhoenix() {
  return <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
    <path d="M50 58 C46 52 44 44 46 36 C48 28 52 24 50 18 C56 24 58 34 54 44 C60 38 66 28 62 18 C72 26 72 40 64 50 C68 44 74 42 80 46 C76 52 68 54 62 52 C64 58 62 66 58 70 L50 78 L42 70 C38 66 36 58 38 52 C32 54 24 52 20 46 C26 42 32 44 36 50 C28 40 28 26 38 18 C34 28 40 38 46 44 C42 34 44 24 50 18 C48 24 52 28 54 36 C56 44 54 52 50 58Z" stroke={mc} strokeWidth="1.3" fill="rgba(255,255,255,0.04)"/>
    <path d="M44 72 L50 78 L56 72" stroke={mc} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <circle cx="50" cy="30" r="3" fill={mc} opacity="0.8"/>
  </svg>;
}
function SvgKraken() {
  return <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
    <ellipse cx="50" cy="38" rx="16" ry="14" stroke={mc} strokeWidth="1.5" fill="rgba(255,255,255,0.04)"/>
    <circle cx="44" cy="34" r="2.5" fill={mc}/>
    <circle cx="56" cy="34" r="2.5" fill={mc}/>
    <path d="M38 46 C34 56 32 66 30 78" stroke={mc} strokeWidth="2" strokeLinecap="round"/>
    <path d="M62 46 C66 56 68 66 70 78" stroke={mc} strokeWidth="2" strokeLinecap="round"/>
    <path d="M44 50 C42 60 42 70 40 80" stroke={mc} strokeWidth="2" strokeLinecap="round"/>
    <path d="M56 50 C58 60 58 70 60 80" stroke={mc} strokeWidth="2" strokeLinecap="round"/>
    <path d="M50 52 L50 82" stroke={mc} strokeWidth="2" strokeLinecap="round"/>
    <path d="M46 52 C44 58 46 62 44 68" stroke={md} strokeWidth="1" strokeLinecap="round"/>
    <path d="M54 52 C56 58 54 62 56 68" stroke={md} strokeWidth="1" strokeLinecap="round"/>
    <path d="M34 36 C28 34 24 30 22 24" stroke={md} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M66 36 C72 34 76 30 78 24" stroke={md} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>;
}
function SvgDragon() {
  return <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
    <path d="M20 60 C24 52 32 46 42 44 C52 42 62 44 70 50 C78 56 82 64 80 72 C78 80 70 84 60 82 C50 80 40 74 34 66 Z" stroke={mc} strokeWidth="1.5" fill="rgba(255,255,255,0.04)"/>
    <path d="M20 60 C16 54 16 44 22 38 C26 34 32 32 38 34 L42 44" stroke={mc} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M22 38 L18 28 L26 32" stroke={mc} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 30 L26 20 L34 26" stroke={mc} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="30" cy="48" r="3" fill={mc}/>
    <path d="M34 54 Q38 58 44 56" stroke={mc} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    <path d="M80 72 C84 68 88 62 84 56 C82 52 78 50 74 52" stroke={md} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <path d="M60 82 C60 88 56 92 52 90 C48 88 50 84 54 84" stroke={md} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <path d="M42 44 C44 38 48 34 54 34 C60 34 64 38 66 44" stroke={md} strokeWidth="1" strokeLinecap="round" fill="none"/>
  </svg>;
}

const featuredCards = [
  { name: "Phantom Wyrm",   subtitle: "Void · Legendary",   power: 580, rarity: "Legendary" as const, element: "Void",   icon: <SvgWyvern /> },
  { name: "Solar Phoenix",  subtitle: "Fire · Legendary",   power: 650, rarity: "Legendary" as const, element: "Fire",   icon: <SvgPhoenix /> },
  { name: "Abyssal Kraken", subtitle: "Dark · Legendary",   power: 610, rarity: "Legendary" as const, element: "Dark",   icon: <SvgKraken /> },
  { name: "Ancient Dragon", subtitle: "Dragon · Legendary", power: 695, rarity: "Legendary" as const, element: "Dragon", icon: <SvgDragon /> },
];

const features = [
  { Icon: SwordIcon, title: "Dungeon Raids", desc: "Explore multi-floor dungeons with your party. Unlock elite loot and boss drops." },
  { Icon: ShieldIcon, title: "Guild Wars", desc: "Form guilds of up to 50 players. Fight for territory control and guild rankings." },
  { Icon: ChestIcon, title: "Loot System", desc: "Over 1,200 unique items. Rare drops, forge upgrades, and seasonal chests." },
  { Icon: DiceIcon, title: "Casino & Events", desc: "Spin the wheel, play blackjack, earn bonus gold from limited-time events." },
  { Icon: TrophyIcon, title: "Ranked Season", desc: "Compete in seasonal PvP ladders. Earn exclusive rewards and prestige titles." },
  { Icon: BoltIcon, title: "Daily Quests", desc: "3 fresh quests every day. Chain streaks for bonus XP and rare item rewards." },
];

const steps = [
  { num: "01", title: "Add the Bot", desc: "Invite Astral X Realm to your Discord server in one click." },
  { num: "02", title: "Create Your Hero", desc: "Choose your class, name your character, and set up your profile." },
  { num: "03", title: "Battle & Collect", desc: "Fight monsters, collect loot, and rise through the ranks." },
];

const stats = [
  { value: "10K+", label: "Active Players", Icon: UsersIcon },
  { value: "250K+", label: "Dungeons Cleared", Icon: MapIcon },
  { value: "1,200+", label: "Unique Items", Icon: GemIcon },
  { value: "840+", label: "Active Guilds", Icon: UsersIcon },
];

const guilds = [
  { name: "Eclipse Order", rank: 1, members: 48, wins: 2841, tag: "Void Lancers" },
  { name: "Solar Vanguard", rank: 2, members: 45, wins: 2480, tag: "Fire Mages" },
  { name: "Crimson Dawn", rank: 3, members: 50, wins: 2210, tag: "Berserkers" },
  { name: "Void Pact", rank: 4, members: 39, wins: 1990, tag: "Shadow Rogues" },
];

export default function Home() {
  const { openSignup } = useAuth();
  return (
    <div style={{ minHeight: "100vh", background: "#000", position: "relative" }}>
      <SnowCanvas />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

          {/* ── Hero ── */}
          <section style={{ textAlign: "center", padding: "80px 0 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {/* Glow orbs */}
            <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            <div className="animate-fade-in-up pulse-glow" style={{ position: "relative", display: "inline-block", marginBottom: 28, borderRadius: "50%" }}>
              <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" }} />
              <img src={astralIcon} alt="logo" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.25)", display: "block", position: "relative", zIndex: 1 }} />
            </div>

            <div className="animate-fade-in-up delay-1">
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "4px 14px", fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
                Season 12 · Now Live
              </div>
            </div>

            <h1 className="animate-fade-in-up delay-2" style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.02, marginBottom: 20, letterSpacing: "-0.04em" }}>
              Astral X Realm
            </h1>
            <p className="animate-fade-in-up delay-3" style={{ fontSize: "clamp(0.95rem, 2vw, 1.12rem)", color: "rgba(255,255,255,0.42)", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.75, fontWeight: 400 }}>
              The ultimate Discord RPG. Battle dungeons, collect legendary cards, build your guild, and climb the global leaderboard — all inside Discord.
            </p>

            <div className="animate-fade-in-up delay-4" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={openSignup} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 999, padding: "14px 38px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: "0 0 40px rgba(255,255,255,0.12)", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(255,255,255,0.12)"; }}>
                Get Started Free
              </button>
              <Link href="/leaderboard" style={{ background: "transparent", color: "rgba(255,255,255,0.8)", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "14px 38px", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif", textDecoration: "none", display: "inline-block", transition: "border-color 0.2s" }}>
                View Leaderboard
              </Link>
            </div>
          </section>

          {/* ── Stats bar ── */}
          <div className="animate-fade-in-up delay-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", marginBottom: 60 }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ padding: "22px 20px", textAlign: "center", borderRight: i < stats.length - 1 ? "0.5px solid rgba(255,255,255,0.06)" : "none", background: "rgba(10,10,10,0.5)" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.38)", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Premium Banner ── */}
          <div className="animate-fade-in-up delay-2" style={{ background: "rgba(10,10,10,0.85)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 18, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 60, backdropFilter: "blur(12px)", boxShadow: "0 0 40px rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="pulse-glow" style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CrownIcon size={19} color="rgba(255,255,255,0.9)" />
              </div>
              <div>
                <div style={{ fontSize: "0.94rem", fontWeight: 700, color: "#fff" }}>Astral Premium — Season 12</div>
                <div style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>1,500 Gold/day · 5 exclusive cards/mo · Elite PvP bracket · from $2.99/mo</div>
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

          {/* ── Featured Legendary Cards ── */}
          <section style={{ marginBottom: 60 }}>
            <div className="animate-fade-in-up delay-1" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Legendary Drops</div>
                <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Featured Cards</h2>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", marginTop: 5 }}>Toggle the switch on each card to activate its glow</p>
              </div>
            </div>
            <div className="animate-fade-in-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 }}>
              {featuredCards.map(c => <GlowCard key={c.name} {...c} />)}
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
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{g.tag} · {g.members} members</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{g.wins.toLocaleString()} wins</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="animate-fade-in-up delay-2" style={{ textAlign: "center", padding: "60px 32px", marginBottom: 40, background: "rgba(10,10,10,0.85)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 22, backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 400, height: 300, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 800, color: "#fff", marginBottom: 14, letterSpacing: "-0.04em", position: "relative" }}>Ready to Enter the Realm?</h2>
            <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.4)", marginBottom: 32, maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.7 }}>Join 10,000+ players already battling across Discord. Free to start — always.</p>
            <button onClick={openSignup} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 999, padding: "14px 44px", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: "0 0 40px rgba(255,255,255,0.1)", transition: "transform 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
              Create Account
            </button>
          </section>

        </div>
        <Footer />
      </div>
    </div>
  );
}
