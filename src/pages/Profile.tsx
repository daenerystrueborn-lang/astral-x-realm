import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import astralIcon from "/astral_icon.png";
import { useAuth } from "@/context/AuthContext"
import { getPlayerActivity, type ActivityEntry, type Player } from "@/lib/api";
import {
  UploadIcon, WeaponIcon, ShieldIcon, HelmetIcon, BootIcon,
  RingIcon, AmuletIcon, DragonIcon, CastleIcon, StarBadgeIcon, ArenaIcon, CrownIcon, SwordIcon, CheckIcon,
  MapIcon, ShopIcon, LeaderboardIcon, CardsIcon, TopupIcon,
} from "@/components/Icons";

function cap(s?: string) { if (!s) return "—"; return s.charAt(0).toUpperCase() + s.slice(1); }

/** Mirrors bot `calcKLD` (`plugins/rpg-profile.js`) — log-scaled 0–10 display */
function combatKD(p: Player) {
  const kc = p.killCounts || {};
  const k = (p.kills || 0) + (kc.dungeonKills || 0) + (kc.pvpWins || 0);
  const d = (kc.deaths || 0) + (kc.dungeonDeaths || 0) + (kc.pvpLosses || 0);
  if (k === 0 && d === 0) return null;
  const rawRatio = d === 0 ? k : k / d;
  const scaled = Math.min(10, (Math.log(rawRatio + 1) / Math.log(1001)) * 10);
  return { k, d, display: scaled.toFixed(2), rawLabel: d === 0 ? `${k} / 0` : `${k} / ${d}` };
}

function dragonKillsTotal(kc: Record<string, number>) {
  let sum = 0;
  for (const [key, val] of Object.entries(kc)) {
    if (!Number.isFinite(val)) continue;
    if (key === "dragonEggHatched") continue;
    if (/dragon/i.test(key)) sum += val;
  }
  return sum;
}

const achievementsTemplate = [
  { name: "Dragon Slayer", desc: "Defeat 100 dragons & dragon-type bosses", Icon: DragonIcon, goal: 100, kind: "dragon" as const },
  { name: "Card Master", desc: "Collect 200 unique cards", Icon: StarBadgeIcon, goal: 200, kind: "cards" as const },
  { name: "Arena Legend", desc: "Win 500 PvP duels", Icon: ArenaIcon, goal: 500, kind: "pvp" as const },
  { name: "Guild Founder", desc: "Found or lead a guild", Icon: CastleIcon, goal: 1, kind: "guild" as const },
  { name: "Dungeon Lord", desc: "Clear 200 dungeons", Icon: SwordIcon, goal: 200, kind: "dungeon" as const },
  { name: "Gold Hoarder", desc: "Accumulate 100k Solars", Icon: CrownIcon, goal: 100_000, kind: "solars" as const },
];

type AchRow = (typeof achievementsTemplate)[number] & { done: boolean; pct: number };

function deriveAchievements(player: Player): AchRow[] {
  const kc = player.killCounts || {};
  const dg = dragonKillsTotal(kc);
  const pvpW = kc.pvpWins || 0;
  const dungeons = kc.dungeonsCleared || 0;
  const hasGuild = !!(player.guildName || (player.guild && !player.guild.startsWith("guild_")));
  return achievementsTemplate.map(t => {
    let cur = 0;
    if (t.kind === "dragon") cur = dg;
    else if (t.kind === "cards") cur = 0;
    else if (t.kind === "pvp") cur = pvpW;
    else if (t.kind === "guild") cur = hasGuild ? 1 : 0;
    else if (t.kind === "dungeon") cur = dungeons;
    else if (t.kind === "solars") cur = player.Solars || 0;
    const pct = Math.min(100, Math.round((cur / t.goal) * 100));
    const done = cur >= t.goal && t.goal > 0;
    return { ...t, done, pct: t.kind === "cards" ? 0 : pct };
  });
}

const BOT_QUICK_HELP: { cmd: string; hint: string }[] = [
  { cmd: "!daily", hint: "Dailies" },
  { cmd: "!dungeon", hint: "Dungeon" },
  { cmd: "!forge", hint: "Forge" },
  { cmd: "!shop", hint: "Shop" },
  { cmd: "!cards", hint: "Cards" },
  { cmd: "!pvp", hint: "PvP" },
  { cmd: "!help combat", hint: "Help · combat" },
  { cmd: "!me", hint: "Profile card" },
];

/* ── Animated stat bar ── */
function StatBar({ label, value, max, pct }: { label: string; value: string; max: string; pct: number }) {
  const safePct = Math.min(100, Math.max(0, pct));
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(safePct), 100); return () => clearTimeout(t); }, [safePct]);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.42)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>{value}<span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}> / {max}</span></span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", borderRadius: 999, background: "#fff",
          width: `${width}%`, transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)",
          position: "relative", boxShadow: "0 0 6px rgba(255,255,255,0.4)",
          maxWidth: "100%",
        }} />
      </div>
    </div>
  );
}

const seasonMax = 100;

const seasonRewards = [
  { lv: 1,   free: "100 Solars",     premium: "Eclipse Profile Frame" },
  { lv: 5,   free: "250 Solars",     premium: "1× Exclusive Card" },
  { lv: 10,  free: "500 Solars",     premium: "Void Armor Skin" },
  { lv: 20,  free: "1,000 Solars",   premium: "Eclipse Title + Border" },
  { lv: 30,  free: "1,500 Solars",   premium: "Shadow Weapon Skin" },
  { lv: 50,  free: "3,000 Solars",   premium: "Celestial Mount Skin" },
  { lv: 75,  free: "5,000 Solars",   premium: "5× Exclusive Cards" },
  { lv: 100, free: "10,000 Solars",  premium: "Astral Champion Frame + Title" },
];

function AchievBar({ pct, done }: { pct: number; done: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 150); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${w}%`, background: done ? "#fff" : "rgba(255,255,255,0.55)", borderRadius: 999, transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)", boxShadow: done ? "0 0 5px rgba(255,255,255,0.5)" : "none" }} />
    </div>
  );
}

const tabs = ["Overview", "Season Pass", "Achievements"] as const;
type Tab = typeof tabs[number];

export default function Profile() {
  const { player, loading, openLogin } = useAuth();

  const seasonProgLevel = useMemo(() => {
    if (!player) return 1;
    return Math.min(seasonMax, Math.max(1, player.level));
  }, [player]);

  const achievementsData = useMemo(() => {
    if (!player) return null;
    return deriveAchievements(player);
  }, [player]);

  const expPctTarget = useMemo(() => {
    if (!player) return 0;
    const expNeed = Math.max(1, player.level * 200);
    return Math.min(100, Math.round((player.exp / expNeed) * 100));
  }, [player]);

  const [expFillPct, setExpFillPct] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setExpFillPct(expPctTarget));
    return () => cancelAnimationFrame(id);
  }, [expPctTarget]);

  const bannerRef = useRef<HTMLInputElement>(null);
  const [hoverBanner, setHoverBanner] = useState(false);
  const [tab, setTab] = useState<Tab>("Overview");
  const [spWidth, setSpWidth] = useState(0);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [hoverAvatar, setHoverAvatar] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const avatarKey = player ? `axr_avatar_${player.name}` : null;
  const bannerKey = player ? `axr_banner_${player.name}` : null;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(() =>
    avatarKey ? localStorage.getItem(avatarKey) : null
  );
  const [bannerUrl, setBannerUrl] = useState<string | null>(() =>
    bannerKey ? localStorage.getItem(bannerKey) : null
  );

  useEffect(() => {
    if (avatarKey) setAvatarUrl(localStorage.getItem(avatarKey));
    if (bannerKey) setBannerUrl(localStorage.getItem(bannerKey));
  }, [avatarKey, bannerKey]);

  // Fetch real activity from API, fall back to player.activityLog, then nothing
  useEffect(() => {
    if (!player) return;
    setActivityLoading(true);
    getPlayerActivity()
      .then(data => {
        if (data && data.length > 0) {
          setActivityLog(data);
        } else if (player.activityLog && player.activityLog.length > 0) {
          setActivityLog(player.activityLog);
        } else {
          setActivityLog([]);
        }
      })
      .catch(() => {
        if (player.activityLog && player.activityLog.length > 0) {
          setActivityLog(player.activityLog);
        }
      })
      .finally(() => setActivityLoading(false));
  }, [player]);

  useEffect(() => {
    if (tab === "Season Pass") {
      const t = setTimeout(() => setSpWidth((seasonProgLevel / seasonMax) * 100), 200);
      return () => clearTimeout(t);
    }
  }, [tab, seasonProgLevel]);

  function toBase64(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !avatarKey) return;
    setAvatarUploading(true);
    try {
      const b64 = await toBase64(f);
      localStorage.setItem(avatarKey, b64);
      setAvatarUrl(b64);
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !bannerKey) return;
    setBannerUploading(true);
    try {
      const b64 = await toBase64(f);
      localStorage.setItem(bannerKey, b64);
      setBannerUrl(b64);
    } finally {
      setBannerUploading(false);
    }
  }

  if (!loading && !player) {
    return (
      <div style={{ minHeight: "100vh", background: "#000" }}>
        <div style={{ position: "relative", zIndex: 10 }}><Nav /></div>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔐</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>Login Required</h2>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
            You need to log in to view your profile.
          </p>
          <button onClick={openLogin} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 12, padding: "11px 28px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
            Log in
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", position: "relative" }}>
        <div style={{ position: "relative", zIndex: 10 }}><Nav /></div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div className="axr-shimmer" style={{ marginTop: 28, height: 200, borderRadius: 18, border: "0.5px solid rgba(255,255,255,0.06)" }} />
          <div style={{ display: "flex", gap: 20, alignItems: "flex-end", marginTop: -40, paddingLeft: 12, marginBottom: 28 }}>
            <div className="axr-shimmer" style={{ width: 92, height: 92, borderRadius: "50%", border: "4px solid #000", boxSizing: "border-box" }} />
            <div style={{ flex: 1, paddingBottom: 8 }}>
              <div className="axr-shimmer" style={{ width: "40%", maxWidth: 220, height: 18, borderRadius: 8, marginBottom: 10 }} />
              <div className="axr-shimmer" style={{ width: "55%", maxWidth: 320, height: 12, borderRadius: 6 }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="axr-shimmer section-card" style={{ height: 72, borderRadius: 14 }} />
            ))}
          </div>
          <div className="axr-shimmer section-card" style={{ height: 180, marginBottom: 24, borderRadius: 14 }} />
          <div className="axr-shimmer section-card" style={{ height: 120, marginBottom: 48, borderRadius: 14 }} />
        </div>
      </div>
    );
  }

  // Resolve guild display name — guildName is injected by API, fall back to showing "—" for raw IDs
  const guildDisplay = player!.guildName || (
    player!.guild
      ? (player!.guild.startsWith('guild_') ? '—' : player!.guild)
      : 'None'
  );

  // Build real data from player — clamp pct at 100 for all stat bars
  const statBars = [
    { label: "HP",  value: String(player!.hp),  max: String(player!.maxHp), pct: player!.maxHp > 0 ? Math.min(100, Math.round((player!.hp  / player!.maxHp) * 100)) : 0 },
    { label: "MP",  value: String(player!.mp),  max: String(player!.maxMp), pct: player!.maxMp > 0 ? Math.min(100, Math.round((player!.mp  / player!.maxMp) * 100)) : 0 },
    { label: "STR", value: String(player!.str), max: "999",                 pct: Math.min(100, Math.round((player!.str / 999) * 100)) },
    { label: "DEF", value: String(player!.def), max: "999",                 pct: Math.min(100, Math.round((player!.def / 999) * 100)) },
    { label: "AGI", value: String(player!.agi), max: "999",                 pct: Math.min(100, Math.round((player!.agi / 999) * 100)) },
    { label: "INT", value: String(player!.int), max: "999",                 pct: Math.min(100, Math.round((player!.int / 999) * 100)) },
    { label: "LCK", value: String(player!.lck), max: "999",                 pct: Math.min(100, Math.round((player!.lck / 999) * 100)) },
  ];

  const quickStats = [
    { label: "Level",    value: String(player!.level) },
    { label: "Solars",   value: player!.Solars.toLocaleString() },
    { label: "Gems",     value: String(player!.gems) },
    { label: "Kills",    value: player!.kills.toLocaleString() },
    { label: "Dungeon",  value: `F${player!.dungeonFloor}` },
    { label: "Guild",    value: cap(guildDisplay) },
    { label: "Class",    value: cap(player!.class) },
    { label: "Rank",     value: cap(player!.rank) || "Peasant" },
    { label: "Prestige", value: player!.prestige > 0 ? String(player!.prestige) : "—" },
  ];

  const eq = player!.equipped || {};
  const capEq = (s?: string) => s ? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Empty";
  const equipment = [
    { slot: "Weapon", name: capEq(eq.weapon), Icon: WeaponIcon, filled: !!eq.weapon },
    { slot: "Armor",  name: capEq(eq.armor),  Icon: ShieldIcon, filled: !!eq.armor },
    { slot: "Helmet", name: capEq(eq.helmet), Icon: HelmetIcon, filled: !!eq.helmet },
    { slot: "Boots",  name: capEq(eq.boots),  Icon: BootIcon,   filled: !!eq.boots },
    { slot: "Ring",   name: capEq(eq.ring),   Icon: RingIcon,   filled: !!eq.ring },
    { slot: "Amulet", name: capEq(eq.amulet), Icon: AmuletIcon, filled: !!eq.amulet },
  ];

  const kd = combatKD(player!);
  const kc = player!.killCounts || {};
  const expNeed = Math.max(1, player!.level * 200);
  const achDone = achievementsData?.filter(a => a.done).length ?? 0;
  const achPct = achievementsData?.length ? Math.round((achDone / achievementsData.length) * 100) : 0;
  const pvpWins = kc.pvpWins || 0;
  const pvpLoss = kc.pvpLosses || 0;

  return (
    <div style={{ minHeight: "100vh", background: "transparent", position: "relative" }}>
      <div style={{ position: "relative", zIndex: 10 }}><Nav /></div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>

        {/* ── Banner + Avatar ── */}
        <section style={{ marginTop: 28, position: "relative" }} className="animate-fade-in">
          <div
            onClick={() => bannerRef.current?.click()}
            onMouseEnter={() => setHoverBanner(true)}
            onMouseLeave={() => setHoverBanner(false)}
            style={{ width: "100%", height: 220, borderRadius: 18, background: bannerUrl ? "transparent" : "linear-gradient(135deg, #12101c 0%, #0f1526 42%, #0a0e18 100%)", border: "0.5px solid rgba(124,92,255,0.22)", position: "relative", overflow: "hidden", cursor: "pointer",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}>
            {bannerUrl && <img src={bannerUrl} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            {!bannerUrl && <>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 85% 60% at 20% -10%, rgba(139,92,246,0.35), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(34,211,238,0.12), transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: 26, left: 132, fontSize: "0.74rem", color: "rgba(255,255,255,0.28)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", maxWidth: "75%" }}>
                Floor {player!.dungeonFloor} · {cap(player!.race)}{player!.evolved ? ` · ${cap(player!.evolved)}` : ""} · {cap(guildDisplay)}
              </div>
            </>}
            <div style={{ position: "absolute", inset: 0, background: (hoverBanner || bannerUploading) ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {bannerUploading
                ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /><span style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", fontFamily: "Outfit, sans-serif" }}>Uploading...</span></>
                : hoverBanner && <><UploadIcon size={16} color="rgba(255,255,255,0.9)" /><span style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", fontFamily: "Outfit, sans-serif" }}>{bannerUrl ? "Change Banner" : "Upload Banner"}</span></>
              }
            </div>
          </div>
          <input ref={bannerRef} type="file" accept="image/*" onChange={handleBannerChange} style={{ display: "none" }} />

          {/* Avatar */}
          <div style={{ position: "absolute", bottom: -44, left: 22 }}>
            <div
              onClick={() => avatarRef.current?.click()}
              onMouseEnter={() => setHoverAvatar(true)}
              onMouseLeave={() => setHoverAvatar(false)}
              className="pulse-glow-strong"
              style={{ width: 92, height: 92, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 3px #000, 0 0 0 5px rgba(255,255,255,0.28), 0 0 26px rgba(255,255,255,0.1)", cursor: "pointer", position: "relative" }}>
              <img
                src={avatarUrl || astralIcon}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Hover overlay */}
              <div style={{ position: "absolute", inset: 0, background: (hoverAvatar || avatarUploading) ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                {avatarUploading
                  ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  : hoverAvatar && <UploadIcon size={16} color="#fff" />
                }
              </div>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />

          </div>
        </section>

        {/* ── Name row ── */}
        <div className="animate-fade-in-up" style={{ paddingLeft: 26, marginTop: 54, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{cap(player!.name)}</h1>
          <span style={{ background: "rgba(255,255,255,0.09)", border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "3px 11px", fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>Lv. {player!.level}</span>
          {player!.isKami && (
            <span style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "3px 11px", fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: 5 }}>
              <CrownIcon size={11} color="rgba(255,255,255,0.8)" /> Kami
            </span>
          )}
          {player!.prestige > 0 && (
            <span style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "3px 11px", fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Prestige {player!.prestige}</span>
          )}
        </div>
        <div style={{ paddingLeft: 26, fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", marginBottom: 6 }}>{cap(player!.class)} · {cap(player!.race)} · {cap(player!.rank) || "Peasant"}</div>
        <div style={{ paddingLeft: 26, fontSize: "0.76rem", color: "rgba(196,181,253,0.55)", marginBottom: 22 }}>{player!.exp.toLocaleString()} / {expNeed.toLocaleString()} XP to next level · same rule as bot (!profile)</div>

        {/* ── Quick stats strip ── */}
        <div className="animate-fade-in-up delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(118px, 1fr))", gap: 1, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(124,92,255,0.22)", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          {quickStats.map((s, i) => (
            <div key={s.label} style={{ padding: "14px 16px", borderRight: i < quickStats.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none", background: "rgba(10,10,10,0.72)" }}>
              <div style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff", background: "linear-gradient(180deg,#fff,#c4b5fd)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Experience + portal shortcuts (mirrors bot progression feel) */}
        <div className="animate-fade-in-up delay-2 section-card axr-accent-glow" style={{ padding: "18px 20px", marginBottom: 20, border: "0.5px solid rgba(124,92,255,0.28)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)" }}>Level progress</span>
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>{expFillPct}% of Lv.{player!.level} bar · need {Math.max(0, expNeed - player!.exp).toLocaleString()} XP</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 18 }}>
            <div style={{ height: "100%", width: `${expFillPct}%`, borderRadius: 999, transition: "width 1s cubic-bezier(0.22,1,0.36,1)", background: "linear-gradient(90deg, rgba(167,139,250,0.95), rgba(34,211,238,0.85))", boxShadow: "0 0 16px rgba(124,92,255,0.35)" }} />
          </div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Portal</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { to: "/cards", Icon: CardsIcon, label: "Cards" },
              { to: "/leaderboard", Icon: LeaderboardIcon, label: "Leaderboard" },
              { to: "/shop", Icon: ShopIcon, label: "Shop" },
              { to: "/topup", Icon: TopupIcon, label: "Top up" },
            ].map(({ to, Icon: Ic, label }) => (
              <Link key={to} href={to} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 999, textDecoration: "none", border: "0.5px solid rgba(255,255,255,0.12)", fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.88)", background: "rgba(0,0,0,0.35)", fontFamily: "Outfit, sans-serif" }}>
                <Ic size={13} color="rgba(167,139,250,0.9)" />{label}
              </Link>
            ))}
          </div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "18px 0 10px" }}>Bot commands · tap to copy</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {BOT_QUICK_HELP.map(row => (
              <button key={row.cmd} type="button" onClick={() => { void navigator.clipboard?.writeText(row.cmd); }} style={{ cursor: "pointer", borderRadius: 999, padding: "6px 11px", fontSize: "0.72rem", fontWeight: 600, border: "0.5px solid rgba(34,211,238,0.35)", background: "rgba(8,22,26,0.8)", color: "rgba(125,237,246,0.95)", fontFamily: "ui-monospace, monospace" }} title={`Copy ${row.cmd}`}>
                {row.hint}<span style={{ opacity: 0.45, marginLeft: 5 }}>{row.cmd}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="animate-fade-in-up delay-3" style={{ display: "flex", gap: 4, marginBottom: 22, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#000" : "rgba(255,255,255,0.45)",
              border: "none", borderRadius: 9, padding: "8px 18px",
              fontSize: "0.81rem", fontWeight: 700, cursor: "pointer",
              fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap",
              transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
            }}>{t}</button>
          ))}
        </div>

        {/* ── Tab: Overview ── */}
        {tab === "Overview" && (
          <div className="animate-fade-in">
            <div className="profile-overview-stack" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 14, marginBottom: 14 }}>
              <div className="section-card" style={{ padding: "22px 24px" }}>
                <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.09em" }}>Combat Stats</h2>
                {statBars.map(s => <StatBar key={s.label} {...s} />)}
              </div>
              <div className="section-card" style={{ padding: "22px 24px" }}>
                <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.09em" }}>Combat Record</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <div style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>K index</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: 4 }}>{kd ? kd.display : "—"}</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.32)", marginTop: 4 }}>{kd ? kd.rawLabel : "Fight to build ratio"} · bot formula</div>
                  </div>
                  <div style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>PvP duel</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: 4 }}>{pvpWins}W — {pvpLoss}L</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.32)", marginTop: 4 }}>From killCounts</div>
                  </div>
                  <div style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6 }}><MapIcon size={11} color="rgba(255,255,255,0.35)" />Dungeons cleared</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: 4 }}>{(kc.dungeonsCleared || 0).toLocaleString()}</div>
                  </div>
                  <div style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Boss kills</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: 4 }}>{(kc.boss_kills || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card" style={{ padding: "22px 24px", marginBottom: 14 }}>
              <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.09em" }}>Recent Activity</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {activityLoading ? (
                  <div aria-busy>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="axr-shimmer" style={{ padding: "12px 0", borderBottom: i < 4 ? "0.5px solid rgba(255,255,255,0.05)" : "none" }}>
                        <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)", width: `${68 + i * 5}%` }} />
                      </div>
                    ))}
                  </div>
                ) : activityLog.length === 0 ? (
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.22)", fontStyle: "italic" }}>No recent activity sync yet — grind in Discord / WhatsApp to populate <code style={{ opacity: 0.5 }}>!profile</code>.</span>
                ) : activityLog.map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: i < activityLog.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none" }}>
                    <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.45 }}>{a.text}</span>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.27)", whiteSpace: "nowrap", flexShrink: 0, marginTop: 2 }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {(((player!.skills?.length ?? 0) > 0) || ((player!.titles?.length ?? 0) > 0) || !!player!.equippedTitle) && (
              <>
                {(player!.skills?.length ?? 0) > 0 && (
                  <div className="section-card" style={{ padding: "22px 24px", marginBottom: 14 }}>
                    <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.09em" }}>Skills</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {player!.skills!.slice(0, 48).map(sk => (
                        <span key={sk} style={{ fontSize: "0.72rem", padding: "5px 10px", borderRadius: 999, border: "0.5px solid rgba(34,211,238,0.25)", background: "rgba(8,20,26,0.65)", fontWeight: 600, color: "rgba(200,246,252,0.92)" }}>
                          {sk.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(!!player!.equippedTitle || (player!.titles?.length ?? 0) > 0) && (
                  <div className="section-card" style={{ padding: "22px 24px", marginBottom: 14 }}>
                    <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.09em" }}>Titles</h2>
                    {player!.equippedTitle && (
                      <div style={{ marginBottom: 12, fontSize: "0.84rem", fontWeight: 700, color: "#fff" }}>
                        Equipped: <span style={{ color: "rgba(196,181,253,0.95)" }}>{cap(player!.equippedTitle.replace(/_/g, " "))}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {(player!.titles || []).slice(0, 32).map(t => (
                        <span key={t} style={{ fontSize: "0.71rem", padding: "5px 11px", borderRadius: 10, border: "0.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.72)" }}>
                          {t.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="section-card" style={{ padding: "22px 24px", marginBottom: 14 }}>
              <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.09em" }}>Equipment</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: 10 }}>
                {equipment.map(slotRow => (
                  <div key={slotRow.slot} style={{ background: slotRow.filled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)", border: `0.5px solid ${slotRow.filled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`, borderRadius: 12, padding: "14px 16px", transition: "border-color 0.2s" }}
                    onMouseEnter={e => slotRow.filled && ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.2)")}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = slotRow.filled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}>
                    <div style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>{slotRow.slot}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <slotRow.Icon size={15} color={slotRow.filled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)"} />
                      <span style={{ fontSize: "0.82rem", fontWeight: slotRow.filled ? 600 : 400, color: slotRow.filled ? "#fff" : "rgba(255,255,255,0.2)", fontStyle: slotRow.filled ? "normal" : "italic" }}>{slotRow.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <style>{`
              @media (max-width: 900px) {
                .profile-overview-stack { grid-template-columns: 1fr !important; }
              }
            `}</style>
          </div>
        )}

        {/* ── Tab: Season Pass ── */}
        {tab === "Season Pass" && (
          <div className="animate-fade-in">
            <div className="section-card" style={{ padding: "28px 28px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <CrownIcon size={16} color="rgba(255,255,255,0.8)" />
                    <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#fff" }}>Season 12 Pass</h2>
                    <span style={{ background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "2px 10px", fontSize: "0.68rem", fontWeight: 700, color: "#fff" }}>ELITE</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)" }}>Preview track synced to your portal level · pass level {seasonProgLevel} / {seasonMax}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{seasonProgLevel}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>/ {seasonMax} levels</div>
                </div>
              </div>
              <div style={{ height: 10, background: "rgba(255,255,255,0.07)", borderRadius: 999, marginTop: 18, overflow: "hidden", position: "relative" }}>
                <div style={{ height: "100%", width: `${spWidth}%`, background: "#fff", borderRadius: 999, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 0 10px rgba(255,255,255,0.5)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)" }}>Lv. 1</span>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)" }}>Lv. {seasonMax}</span>
              </div>
            </div>

            <div className="section-card" style={{ overflow: "hidden", marginBottom: 28 }}>
              <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: 16, padding: "12px 24px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <span style={{ fontSize: "0.67rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Level</span>
                <span style={{ fontSize: "0.67rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Free</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CrownIcon size={11} color="rgba(255,255,255,0.5)" />
                  <span style={{ fontSize: "0.67rem", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Premium</span>
                </div>
              </div>
              {seasonRewards.map((r, i) => {
                const unlocked = seasonProgLevel >= r.lv;
                return (
                  <div key={r.lv} style={{
                    display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: 16,
                    padding: "14px 24px",
                    borderBottom: i < seasonRewards.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none",
                    background: unlocked ? "rgba(255,255,255,0.015)" : "transparent",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {unlocked && <CheckIcon size={11} color="rgba(255,255,255,0.7)" />}
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: unlocked ? "#fff" : "rgba(255,255,255,0.3)" }}>{r.lv}</span>
                    </div>
                    <span style={{ fontSize: "0.82rem", color: unlocked ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.28)" }}>{r.free}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <CrownIcon size={11} color={unlocked ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)"} />
                      <span style={{ fontSize: "0.82rem", color: unlocked ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.28)" }}>{r.premium}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab: Achievements ── */}
        {tab === "Achievements" && (
          <div className="animate-fade-in">
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <div className="section-card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <CheckIcon size={16} color="rgba(255,255,255,0.7)" />
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{achDone} / {achievementsData?.length ?? 6}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Completed</div>
                </div>
              </div>
              <div className="section-card" style={{ padding: "14px 20px", flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>Overall Progress</div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                  <div style={{ height: "100%", width: `${achPct}%`, background: "#fff", borderRadius: 999, boxShadow: "0 0 6px rgba(255,255,255,0.4)", transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }} />
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 32 }}>
              {(achievementsData ?? achievementsTemplate.map(t => ({ ...t, done: false, pct: 0 }))).map(a => (
                <div key={a.name} className="section-card" style={{ padding: "18px 20px", transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: a.done ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)", border: `0.5px solid ${a.done ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <a.Icon size={18} color={a.done ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.28)"} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.87rem", fontWeight: 700, color: a.done ? "#fff" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 7 }}>
                        {a.name}
                        {a.done && <CheckIcon size={12} color="rgba(255,255,255,0.7)" />}
                      </div>
                      <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{a.desc}</div>
                    </div>
                  </div>
                  <AchievBar pct={a.pct} done={a.done} />
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
