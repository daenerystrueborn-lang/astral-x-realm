import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import astralIcon from "/astral_icon.png";
import { useAuth } from "@/context/AuthContext";
import { getPlayerActivity, type ActivityEntry, type Player } from "@/lib/api";
import {
  UploadIcon, WeaponIcon, ShieldIcon, HelmetIcon, BootIcon,
  RingIcon, AmuletIcon, DragonIcon, CastleIcon, StarBadgeIcon, ArenaIcon, CrownIcon, SwordIcon,
  MapIcon, ShopIcon, LeaderboardIcon, CardsIcon, TopupIcon,
} from "@/components/Icons";

function cap(s?: string) { if (!s) return "—"; return s.charAt(0).toUpperCase() + s.slice(1); }
function capEq(s?: string) { return s ? s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Empty"; }

function combatKD(p: Player) {
  const kc = p.killCounts || {};
  const k = (p.kills || 0) + (kc.dungeonKills || 0) + (kc.pvpWins || 0);
  const d = (kc.deaths || 0) + (kc.dungeonDeaths || 0) + (kc.pvpLosses || 0);
  if (k === 0 && d === 0) return null;
  const rawRatio = d === 0 ? k : k / d;
  const scaled = Math.min(10, (Math.log(rawRatio + 1) / Math.log(1001)) * 10);
  return { k, d, display: scaled.toFixed(2), rawLabel: d === 0 ? `${k}/0` : `${k}/${d}` };
}

function dragonKillsTotal(kc: Record<string, number>) {
  let sum = 0;
  for (const [key, val] of Object.entries(kc)) {
    if (!Number.isFinite(val) || key === "dragonEggHatched") continue;
    if (/dragon/i.test(key)) sum += val;
  }
  return sum;
}

const ACH_DEFS = [
  { name: "Dragon Slayer",  desc: "Defeat 100 dragons",          Icon: DragonIcon,    goal: 100,     kind: "dragon"   as const },
  { name: "Card Master",    desc: "Collect 200 unique cards",     Icon: StarBadgeIcon, goal: 200,     kind: "cards"    as const },
  { name: "Arena Legend",   desc: "Win 500 PvP duels",            Icon: ArenaIcon,     goal: 500,     kind: "pvp"      as const },
  { name: "Guild Founder",  desc: "Found or lead a guild",        Icon: CastleIcon,    goal: 1,       kind: "guild"    as const },
  { name: "Dungeon Lord",   desc: "Clear 200 dungeons",           Icon: SwordIcon,     goal: 200,     kind: "dungeon"  as const },
  { name: "Gold Hoarder",   desc: "Accumulate 100k Solars",       Icon: CrownIcon,     goal: 100_000, kind: "solars"   as const },
];

function deriveAch(player: Player) {
  const kc = player.killCounts || {};
  return ACH_DEFS.map(t => {
    let cur = 0;
    if (t.kind === "dragon")  cur = dragonKillsTotal(kc);
    else if (t.kind === "pvp")    cur = kc.pvpWins || 0;
    else if (t.kind === "guild")  cur = !!(player.guildName || (player.guild && !player.guild.startsWith("guild_"))) ? 1 : 0;
    else if (t.kind === "dungeon") cur = kc.dungeonsCleared || 0;
    else if (t.kind === "solars") cur = player.Solars || 0;
    const pct = Math.min(100, Math.round((cur / t.goal) * 100));
    return { ...t, done: cur >= t.goal && t.goal > 0, pct: t.kind === "cards" ? 0 : pct };
  });
}

const SEASON_REWARDS = [
  { lv: 1,   free: "100 Solars",    premium: "Eclipse Frame" },
  { lv: 5,   free: "250 Solars",    premium: "1× Exclusive Card" },
  { lv: 10,  free: "500 Solars",    premium: "Void Armor Skin" },
  { lv: 20,  free: "1,000 Solars",  premium: "Eclipse Title + Border" },
  { lv: 30,  free: "1,500 Solars",  premium: "Shadow Weapon Skin" },
  { lv: 50,  free: "3,000 Solars",  premium: "Celestial Mount Skin" },
  { lv: 75,  free: "5,000 Solars",  premium: "5× Exclusive Cards" },
  { lv: 100, free: "10,000 Solars", premium: "Astral Champion Frame" },
];

const SEASON_MAX = 100;

/* ── Animated fill bar ── */
function FillBar({ pct, gradient, height = 5 }: { pct: number; gradient: string; height?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 120); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${w}%`, background: gradient, borderRadius: 999, transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }} />
    </div>
  );
}

/* ── Stat bar row ── */
function StatRow({ label, value, max, pct, accent = "#a78bfa" }: { label: string; value: string; max: string; pct: number; accent?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "0.77rem", fontWeight: 700, color: "#fff" }}>
          {value}<span style={{ color: "rgba(255,255,255,0.28)", fontWeight: 400 }}> / {max}</span>
        </span>
      </div>
      <FillBar pct={pct} gradient={`linear-gradient(90deg, ${accent}cc, ${accent})`} />
    </div>
  );
}

/* ── Quick stat cell ── */
function QStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)" }}>
      <div style={{ fontSize: "0.64rem", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <div style={{
        fontSize: "0.9rem", fontWeight: 700,
        background: accent ? `linear-gradient(180deg, #fff, ${accent})` : "linear-gradient(180deg, #fff, #c4b5fd)",
        WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{value}</div>
    </div>
  );
}

const TABS = ["Overview", "Season Pass", "Achievements"] as const;
type Tab = typeof TABS[number];

export default function Profile() {
  const { player, loading, openLogin } = useAuth();
  const [tab, setTab] = useState<Tab>("Overview");
  const [spWidth, setSpWidth] = useState(0);
  const [expFillPct, setExpFillPct] = useState(0);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [actLoading, setActLoading] = useState(false);
  const [hoverBanner, setHoverBanner] = useState(false);
  const [hoverAvatar, setHoverAvatar] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const bannerRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const avatarKey = player ? `axr_avatar_${player.name}` : null;
  const bannerKey = player ? `axr_banner_${player.name}` : null;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => avatarKey ? localStorage.getItem(avatarKey) : null);
  const [bannerUrl, setBannerUrl]   = useState<string | null>(() => bannerKey  ? localStorage.getItem(bannerKey)  : null);

  useEffect(() => {
    if (avatarKey) setAvatarUrl(localStorage.getItem(avatarKey));
    if (bannerKey)  setBannerUrl(localStorage.getItem(bannerKey));
  }, [avatarKey, bannerKey]);

  const seasonLv = useMemo(() => player ? Math.min(SEASON_MAX, Math.max(1, player.level)) : 1, [player]);
  const achData   = useMemo(() => player ? deriveAch(player) : null, [player]);
  const expPct    = useMemo(() => {
    if (!player) return 0;
    return Math.min(100, Math.round((player.exp / Math.max(1, player.level * 200)) * 100));
  }, [player]);

  useEffect(() => { const id = requestAnimationFrame(() => setExpFillPct(expPct)); return () => cancelAnimationFrame(id); }, [expPct]);

  useEffect(() => {
    if (tab === "Season Pass") { const t = setTimeout(() => setSpWidth((seasonLv / SEASON_MAX) * 100), 200); return () => clearTimeout(t); }
  }, [tab, seasonLv]);

  useEffect(() => {
    if (!player) return;
    setActLoading(true);
    getPlayerActivity()
      .then(d => setActivityLog(d?.length ? d : (player.activityLog || [])))
      .catch(() => setActivityLog(player.activityLog || []))
      .finally(() => setActLoading(false));
  }, [player]);

  function toBase64(file: File): Promise<string> {
    return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(file); });
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f || !avatarKey) return;
    setAvatarUploading(true);
    try { const b64 = await toBase64(f); localStorage.setItem(avatarKey, b64); setAvatarUrl(b64); }
    finally { setAvatarUploading(false); }
  }

  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f || !bannerKey) return;
    setBannerUploading(true);
    try { const b64 = await toBase64(f); localStorage.setItem(bannerKey, b64); setBannerUrl(b64); }
    finally { setBannerUploading(false); }
  }

  /* ── Not logged in ── */
  if (!loading && !player) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Nav />
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(139,92,246,0.1)", border: "0.5px solid rgba(139,92,246,0.28)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "2rem" }}>🔐</div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: "-0.02em" }}>Login Required</h2>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.38)", marginBottom: 28, lineHeight: 1.7 }}>Log in to view your character profile, stats, and achievements.</p>
          <button onClick={openLogin} style={{ background: "linear-gradient(135deg, #7c3aed, #22d3ee)", color: "#fff", border: "none", borderRadius: 999, padding: "12px 32px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: "0 0 28px rgba(124,58,237,0.35)" }}>Log in</button>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Nav />
        <div className="section-wrap" style={{ padding: "0 20px" }}>
          <div className="shimmer" style={{ marginTop: 28, height: 200, borderRadius: 18 }} />
          <div style={{ display: "flex", gap: 20, alignItems: "flex-end", marginTop: -40, paddingLeft: 16, marginBottom: 32 }}>
            <div className="shimmer" style={{ width: 90, height: 90, borderRadius: "50%", flexShrink: 0 }} />
            <div style={{ flex: 1, paddingBottom: 8 }}>
              <div className="shimmer" style={{ width: "40%", maxWidth: 220, height: 18, borderRadius: 8, marginBottom: 10 }} />
              <div className="shimmer" style={{ width: "55%", maxWidth: 300, height: 12, borderRadius: 6 }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1, marginBottom: 20 }}>
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="shimmer" style={{ height: 68 }} />)}
          </div>
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="shimmer" style={{ height: 100, borderRadius: 14, marginBottom: 12 }} />)}
        </div>
      </div>
    );
  }

  const guildDisplay = player!.guildName || (player!.guild ? (player!.guild.startsWith("guild_") ? "—" : player!.guild) : "None");
  const expNeed = Math.max(1, player!.level * 200);
  const kc = player!.killCounts || {};
  const kd = combatKD(player!);
  const achDone = achData?.filter(a => a.done).length ?? 0;
  const eq = player!.equipped || {};
  const pvpWins = kc.pvpWins || 0;
  const pvpLoss = kc.pvpLosses || 0;

  const quickStats = [
    { label: "Level",    value: String(player!.level),            accent: "#a78bfa" },
    { label: "Solars",   value: player!.Solars.toLocaleString(),  accent: "#fbbf24" },
    { label: "Gems",     value: String(player!.gems),             accent: "#c084fc" },
    { label: "Kills",    value: player!.kills.toLocaleString(),   accent: "#f87171" },
    { label: "Dungeon",  value: `F${player!.dungeonFloor}`,       accent: "#22d3ee" },
    { label: "Guild",    value: cap(guildDisplay),                accent: "#a78bfa" },
    { label: "Class",    value: cap(player!.class),               accent: "#4ade80" },
    { label: "Rank",     value: cap(player!.rank) || "Peasant",   accent: "#fb923c" },
    { label: "Prestige", value: player!.prestige > 0 ? String(player!.prestige) : "—", accent: "rgba(255,255,255,0.5)" },
  ];

  const statBars = [
    { label: "HP",  value: String(player!.hp),  max: String(player!.maxHp), pct: player!.maxHp > 0 ? Math.min(100, Math.round((player!.hp / player!.maxHp) * 100)) : 0, accent: "#f87171" },
    { label: "MP",  value: String(player!.mp),  max: String(player!.maxMp), pct: player!.maxMp > 0 ? Math.min(100, Math.round((player!.mp / player!.maxMp) * 100)) : 0, accent: "#60a5fa" },
    { label: "STR", value: String(player!.str), max: "999",                 pct: Math.min(100, Math.round((player!.str / 999) * 100)), accent: "#fb923c" },
    { label: "DEF", value: String(player!.def), max: "999",                 pct: Math.min(100, Math.round((player!.def / 999) * 100)), accent: "#22d3ee" },
    { label: "AGI", value: String(player!.agi), max: "999",                 pct: Math.min(100, Math.round((player!.agi / 999) * 100)), accent: "#4ade80" },
    { label: "INT", value: String(player!.int), max: "999",                 pct: Math.min(100, Math.round((player!.int / 999) * 100)), accent: "#c084fc" },
    { label: "LCK", value: String(player!.lck), max: "999",                 pct: Math.min(100, Math.round((player!.lck / 999) * 100)), accent: "#fbbf24" },
  ];

  const equipment = [
    { slot: "Weapon", name: capEq(eq.weapon), Icon: WeaponIcon, filled: !!eq.weapon, accent: "#f87171" },
    { slot: "Armor",  name: capEq(eq.armor),  Icon: ShieldIcon, filled: !!eq.armor,  accent: "#22d3ee" },
    { slot: "Helmet", name: capEq(eq.helmet), Icon: HelmetIcon, filled: !!eq.helmet, accent: "#a78bfa" },
    { slot: "Boots",  name: capEq(eq.boots),  Icon: BootIcon,   filled: !!eq.boots,  accent: "#4ade80" },
    { slot: "Ring",   name: capEq(eq.ring),   Icon: RingIcon,   filled: !!eq.ring,   accent: "#fbbf24" },
    { slot: "Amulet", name: capEq(eq.amulet), Icon: AmuletIcon, filled: !!eq.amulet, accent: "#c084fc" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <Nav />
      <div className="section-wrap" style={{ padding: "0 20px" }}>

        {/* ── Banner ── */}
        <section style={{ marginTop: 28, position: "relative" }} className="anim-in">
          <div
            onClick={() => bannerRef.current?.click()}
            onMouseEnter={() => setHoverBanner(true)}
            onMouseLeave={() => setHoverBanner(false)}
            style={{
              width: "100%", height: 220, borderRadius: 20, cursor: "pointer",
              background: bannerUrl ? "transparent" : "linear-gradient(145deg, #0d0a1e 0%, #0a1020 50%, #08100c 100%)",
              border: "0.5px solid rgba(139,92,246,0.2)", overflow: "hidden", position: "relative",
              boxShadow: "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {bannerUrl && <img src={bannerUrl} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            {!bannerUrl && (
              <>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 65% at 20% -5%, rgba(139,92,246,0.32), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 105%, rgba(34,211,238,0.1), transparent 55%)" }} />
                <div style={{ position: "absolute", inset: 0, background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <div style={{ position: "absolute", bottom: 22, left: 130, fontSize: "0.72rem", color: "rgba(255,255,255,0.22)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Floor {player!.dungeonFloor} · {cap(player!.race)}{player!.evolved ? ` · ${cap(player!.evolved)}` : ""} · {cap(guildDisplay)}
                </div>
              </>
            )}
            <div style={{ position: "absolute", inset: 0, background: (hoverBanner || bannerUploading) ? "rgba(0,0,0,0.5)" : "transparent", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {bannerUploading
                ? <><div className="anim-spin" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} /><span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff" }}>Uploading…</span></>
                : hoverBanner && <><UploadIcon size={16} color="#fff" /><span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff" }}>{bannerUrl ? "Change Banner" : "Upload Banner"}</span></>
              }
            </div>
          </div>
          <input ref={bannerRef} type="file" accept="image/*" onChange={handleBannerChange} style={{ display: "none" }} />

          {/* Avatar */}
          <div style={{ position: "absolute", bottom: -46, left: 22, zIndex: 2 }}>
            <div
              onClick={() => avatarRef.current?.click()}
              onMouseEnter={() => setHoverAvatar(true)}
              onMouseLeave={() => setHoverAvatar(false)}
              style={{
                width: 92, height: 92, borderRadius: "50%", overflow: "hidden", cursor: "pointer", position: "relative",
                boxShadow: "0 0 0 3px #050507, 0 0 0 5px rgba(139,92,246,0.4), 0 0 30px rgba(139,92,246,0.2)",
              }}
            >
              <img src={avatarUrl || astralIcon} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: (hoverAvatar || avatarUploading) ? "rgba(0,0,0,0.55)" : "transparent", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                {avatarUploading
                  ? <div className="anim-spin" style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} />
                  : hoverAvatar && <UploadIcon size={16} color="#fff" />
                }
              </div>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
          </div>
        </section>

        {/* ── Name / title row ── */}
        <div className="anim-up" style={{ paddingLeft: 24, marginTop: 58, marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 5 }}>
            <h1 style={{ fontSize: "1.45rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif" }}>{cap(player!.name)}</h1>
            <span style={{ background: "rgba(139,92,246,0.14)", border: "0.5px solid rgba(139,92,246,0.3)", borderRadius: 999, padding: "3px 11px", fontSize: "0.7rem", fontWeight: 700, color: "#c4b5fd" }}>Lv. {player!.level}</span>
            {player!.isKami && (
              <span style={{ background: "rgba(251,191,36,0.12)", border: "0.5px solid rgba(251,191,36,0.28)", borderRadius: 999, padding: "3px 11px", fontSize: "0.7rem", fontWeight: 700, color: "#fbbf24", display: "flex", alignItems: "center", gap: 5 }}>
                <CrownIcon size={11} color="#fbbf24" /> Kami
              </span>
            )}
            {player!.prestige > 0 && (
              <span style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "3px 11px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>✦ Prestige {player!.prestige}</span>
            )}
          </div>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.36)", marginBottom: 4 }}>{cap(player!.class)} · {cap(player!.race)} · {cap(player!.rank) || "Peasant"}</div>
          <div style={{ fontSize: "0.72rem", color: "rgba(196,181,253,0.45)" }}>{player!.exp.toLocaleString()} / {expNeed.toLocaleString()} XP</div>
        </div>

        {/* ── Quick stats grid ── */}
        <div className="anim-up d1" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
          gap: 1, background: "rgba(255,255,255,0.05)",
          border: "0.5px solid rgba(139,92,246,0.18)", borderRadius: 16,
          overflow: "hidden", marginBottom: 16,
        }}>
          {quickStats.map((s, i) => (
            <QStat key={s.label} {...s} />
          ))}
        </div>

        {/* ── XP bar + portal shortcuts ── */}
        <div className="anim-up d2" style={{ background: "rgba(6,6,14,0.9)", border: "0.5px solid rgba(139,92,246,0.22)", borderRadius: 16, padding: "18px 20px", marginBottom: 18, backdropFilter: "blur(14px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>Level progress</span>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.38)" }}>{expFillPct}% · {Math.max(0, expNeed - player!.exp).toLocaleString()} XP to go</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 16 }}>
            <div style={{ height: "100%", width: `${expFillPct}%`, borderRadius: 999, background: "linear-gradient(90deg, #a78bfa, #22d3ee)", boxShadow: "0 0 18px rgba(139,92,246,0.4)", transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }} />
          </div>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Quick portal</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { to: "/leaderboard", Icon: LeaderboardIcon, label: "Leaderboard", color: "#a78bfa" },
              { to: "/shop", Icon: ShopIcon, label: "Shop", color: "#fbbf24" },
              { to: "/topup", Icon: TopupIcon, label: "Top up", color: "#4ade80" },
            ].map(l => (
              <Link key={l.to} href={l.to} style={{
                display: "flex", alignItems: "center", gap: 6, borderRadius: 999,
                background: `${l.color}12`, border: `0.5px solid ${l.color}30`,
                padding: "6px 14px", fontSize: "0.77rem", fontWeight: 600, color: l.color,
                textDecoration: "none", transition: "background 0.18s, transform 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${l.color}1e`; e.currentTarget.style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${l.color}12`; e.currentTarget.style.transform = "scale(1)"; }}>
                <l.Icon size={12} color={l.color} />{l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="anim-up d3" style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 4, width: "fit-content", marginBottom: 20 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(34,211,238,0.1))" : "transparent",
              color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
              border: tab === t ? "0.5px solid rgba(139,92,246,0.4)" : "0.5px solid transparent",
              borderRadius: 10, padding: "7px 18px", fontSize: "0.8rem", fontWeight: tab === t ? 700 : 500,
              cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.18s", whiteSpace: "nowrap",
            }}>{t}</button>
          ))}
        </div>

        {/* ── OVERVIEW tab ── */}
        {tab === "Overview" && (
          <div className="anim-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 14 }}>
              {/* Stats panel */}
              <div style={{ background: "rgba(6,6,14,0.9)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "22px 22px 18px", backdropFilter: "blur(14px)" }}>
                <div style={{ fontSize: "0.64rem", fontWeight: 700, color: "rgba(255,255,255,0.26)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>Character Stats</div>
                {statBars.map(s => <StatRow key={s.label} {...s} />)}
              </div>

              {/* Combat + Equipment */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Combat */}
                <div style={{ background: "rgba(6,6,14,0.9)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "22px 22px 18px", backdropFilter: "blur(14px)" }}>
                  <div style={{ fontSize: "0.64rem", fontWeight: 700, color: "rgba(255,255,255,0.26)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Combat Record</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Total Kills",   value: player!.kills.toLocaleString(),        color: "#f87171" },
                      { label: "Dungeon Clears",value: (kc.dungeonsCleared||0).toLocaleString(), color: "#22d3ee" },
                      { label: "PvP W/L",       value: `${pvpWins} / ${pvpLoss}`,             color: "#a78bfa" },
                      { label: "KD Score",      value: kd ? kd.display : "—",                 color: "#4ade80" },
                    ].map(s => (
                      <div key={s.label} style={{ background: "rgba(0,0,0,0.3)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: "1.05rem", fontWeight: 800, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div style={{ background: "rgba(6,6,14,0.9)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "22px 22px 18px", backdropFilter: "blur(14px)" }}>
                  <div style={{ fontSize: "0.64rem", fontWeight: 700, color: "rgba(255,255,255,0.26)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Equipment</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {equipment.map(e => (
                      <div key={e.slot} style={{ display: "flex", alignItems: "center", gap: 9, background: e.filled ? `${e.accent}0a` : "rgba(0,0,0,0.2)", border: `0.5px solid ${e.filled ? e.accent + "30" : "rgba(255,255,255,0.05)"}`, borderRadius: 11, padding: "9px 12px" }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: e.filled ? `${e.accent}18` : "rgba(255,255,255,0.04)", border: `0.5px solid ${e.filled ? e.accent + "35" : "rgba(255,255,255,0.06)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <e.Icon size={14} color={e.filled ? e.accent : "rgba(255,255,255,0.2)"} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{e.slot}</div>
                          <div style={{ fontSize: "0.77rem", fontWeight: 600, color: e.filled ? "#fff" : "rgba(255,255,255,0.22)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity log */}
            {(activityLog.length > 0 || actLoading) && (
              <div style={{ background: "rgba(6,6,14,0.9)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "22px 22px 18px", backdropFilter: "blur(14px)", marginBottom: 14 }}>
                <div style={{ fontSize: "0.64rem", fontWeight: 700, color: "rgba(255,255,255,0.26)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Recent Activity</div>
                {actLoading ? (
                  <div style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.8rem" }}>Loading…</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {activityLog.slice(0, 8).map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 14px", background: "rgba(0,0,0,0.25)", border: "0.5px solid rgba(255,255,255,0.05)", borderRadius: 11 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.type === "kill" ? "#f87171" : a.type === "loot" ? "#fbbf24" : "#a78bfa", marginTop: 5, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{a.text}</div>
                          <div style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bot quick help */}
            <div style={{ background: "rgba(6,6,14,0.9)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "22px 22px 18px", backdropFilter: "blur(14px)", marginBottom: 48 }}>
              <div style={{ fontSize: "0.64rem", fontWeight: 700, color: "rgba(255,255,255,0.26)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Bot Commands</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { cmd: "!daily",       hint: "Dailies" },
                  { cmd: "!dungeon",     hint: "Dungeon" },
                  { cmd: "!forge",       hint: "Forge" },
                  { cmd: "!shop",        hint: "Shop" },
                  { cmd: "!cards",       hint: "Cards" },
                  { cmd: "!pvp",         hint: "PvP" },
                  { cmd: "!help combat", hint: "Combat help" },
                  { cmd: "!me",          hint: "Profile card" },
                ].map(b => (
                  <div key={b.cmd} title={b.hint} style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.09)", borderRadius: 8, padding: "7px 12px", cursor: "default" }}>
                    <code style={{ fontSize: "0.73rem", color: "rgba(196,181,253,0.8)", fontFamily: "monospace" }}>{b.cmd}</code>
                    <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.26)", marginTop: 3 }}>{b.hint}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SEASON PASS tab ── */}
        {tab === "Season Pass" && (
          <div className="anim-in" style={{ marginBottom: 48 }}>
            <div style={{ background: "rgba(6,6,14,0.9)", border: "0.5px solid rgba(139,92,246,0.22)", borderRadius: 18, padding: "24px 22px", backdropFilter: "blur(14px)", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: "0.64rem", fontWeight: 700, color: "rgba(255,255,255,0.26)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Season 1 Pass</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(139,92,246,0.1)", border: "0.5px solid rgba(139,92,246,0.28)", borderRadius: 999, padding: "2px 10px", fontSize: "0.6rem", fontWeight: 700, color: "rgba(196,181,253,0.75)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Ended</div>
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Level {seasonLv} <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>/ {SEASON_MAX}</span></div>
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)" }}>{spWidth.toFixed(0)}% — Season Closed</div>
              </div>
              <div style={{ height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${spWidth}%`, background: "linear-gradient(90deg, #7c3aed, #a78bfa 55%, #22d3ee)", borderRadius: 999, boxShadow: "0 0 20px rgba(139,92,246,0.4)", transition: "width 1.1s cubic-bezier(0.22,1,0.36,1)" }} />
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)" }}>Season 1 has ended — rewards finalized. Season 2 coming soon.</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SEASON_REWARDS.map(r => {
                const unlocked = seasonLv >= r.lv;
                return (
                  <div key={r.lv} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                    background: unlocked ? "rgba(139,92,246,0.07)" : "rgba(6,6,14,0.85)",
                    border: `0.5px solid ${unlocked ? "rgba(139,92,246,0.28)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: 14, transition: "border-color 0.2s", backdropFilter: "blur(12px)",
                  }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: unlocked ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)", border: `0.5px solid ${unlocked ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.8rem", fontWeight: 800, color: unlocked ? "#c4b5fd" : "rgba(255,255,255,0.28)" }}>
                      {r.lv}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Free: {r.free}</span>
                        <span style={{ fontSize: "0.7rem", color: "#fbbf24", background: "rgba(251,191,36,0.1)", border: "0.5px solid rgba(251,191,36,0.25)", borderRadius: 999, padding: "2px 9px", fontWeight: 600 }}>★ {r.premium}</span>
                      </div>
                      {!unlocked && <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.22)" }}>Reach Lv.{r.lv} to unlock</div>}
                    </div>
                    {unlocked && (
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(74,222,128,0.15)", border: "0.5px solid rgba(74,222,128,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 5.5 4.5 8 9 3"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ACHIEVEMENTS tab ── */}
        {tab === "Achievements" && achData && (
          <div className="anim-in" style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{achDone} / {achData.length} completed</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                  {Math.round((achDone / achData.length) * 100)}% total completion
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {achData.map(a => (
                <div key={a.name} style={{
                  background: a.done ? "rgba(74,222,128,0.07)" : "rgba(6,6,14,0.9)",
                  border: `0.5px solid ${a.done ? "rgba(74,222,128,0.28)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 16, padding: "18px 18px", backdropFilter: "blur(12px)",
                  transition: "border-color 0.2s",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: a.done ? "rgba(74,222,128,0.14)" : "rgba(255,255,255,0.04)", border: `0.5px solid ${a.done ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <a.Icon size={18} color={a.done ? "#4ade80" : "rgba(255,255,255,0.25)"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: a.done ? "#fff" : "rgba(255,255,255,0.6)", marginBottom: 3 }}>{a.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.32)", lineHeight: 1.5 }}>{a.desc}</div>
                    </div>
                    {a.done && (
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(74,222,128,0.15)", border: "0.5px solid rgba(74,222,128,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5 5 3.5 7.5 8.5 2.5"/></svg>
                      </div>
                    )}
                  </div>
                  {!a.done && a.pct > 0 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>Progress</span>
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.45)" }}>{a.pct}%</span>
                      </div>
                      <FillBar pct={a.pct} gradient="linear-gradient(90deg, #a78bfa, #22d3ee)" height={4} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
