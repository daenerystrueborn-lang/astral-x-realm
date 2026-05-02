import { useState, useRef, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import astralIcon from "/astral_icon.png";
import { useAuth } from "@/context/AuthContext"
import { uploadAvatar, uploadBanner } from "@/lib/api";
import {
  UploadIcon, WeaponIcon, ShieldIcon, HelmetIcon, BootIcon,
  RingIcon, AmuletIcon, DragonIcon, CastleIcon, StarBadgeIcon, ArenaIcon, CrownIcon, SwordIcon, CheckIcon
} from "@/components/Icons";

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

/* ── Keep season pass + achievements as static (not in API) ── */
const activity = [
  { text: "Cleared a dungeon floor", time: "recently", type: "dungeon" },
];

const achievements = [
  { name: "Dragon Slayer", desc: "Defeat 100 dragons", Icon: DragonIcon, done: false, pct: 0 },
  { name: "Card Master", desc: "Collect 200 unique cards", Icon: StarBadgeIcon, done: false, pct: 0 },
  { name: "Arena Legend", desc: "Win 500 PvP duels", Icon: ArenaIcon, done: false, pct: 0 },
  { name: "Guild Founder", desc: "Found or lead a guild", Icon: CastleIcon, done: false, pct: 0 },
  { name: "Dungeon Lord", desc: "Clear 200 dungeons", Icon: SwordIcon, done: false, pct: 0 },
  { name: "Gold Hoarder", desc: "Accumulate 100k Solars", Icon: CrownIcon, done: false, pct: 0 },
];

const seasonLevel = 1;
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
  const { player, loading, openLogin, setPlayer, refreshPlayer } = useAuth();
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const [hoverBanner, setHoverBanner] = useState(false);
  const [tab, setTab] = useState<Tab>("Overview");
  const [spWidth, setSpWidth] = useState(0);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [hoverAvatar, setHoverAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [bannerUploading, setBannerUploading] = useState(false);

  // Load avatar and banner from player data
  useEffect(() => {
    if (player?.avatarUrl) setAvatarUrl(player.avatarUrl);
    if (player?.bannerUrl) setBannerUrl(player.bannerUrl);
  }, [player?.name]);

  useEffect(() => {
    if (tab === "Season Pass") {
      const t = setTimeout(() => setSpWidth((seasonLevel / seasonMax) * 100), 200);
      return () => clearTimeout(t);
    }
  }, [tab]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarUploading(true);
    try {
      const updated = await uploadAvatar(f);
      setPlayer(updated);
      setAvatarUrl(updated.avatarUrl || URL.createObjectURL(f));
    } catch {
      // fallback: show locally even if upload fails
      setAvatarUrl(URL.createObjectURL(f));
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBannerUploading(true);
    try {
      const updated = await uploadBanner(f);
      setPlayer(updated);
      setBannerUrl(updated.bannerUrl || URL.createObjectURL(f));
    } catch {
      setBannerUrl(URL.createObjectURL(f));
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
      <div style={{ minHeight: "100vh", background: "#000" }}>
        <div style={{ position: "relative", zIndex: 10 }}><Nav /></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>Loading...</p>
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
  ];

  const quickStats = [
    { label: "Level",    value: String(player!.level) },
    { label: "Solars",   value: player!.Solars.toLocaleString() },
    { label: "Gems",     value: String(player!.gems) },
    { label: "Kills",    value: player!.kills.toLocaleString() },
    { label: "Guild",    value: guildDisplay },
    { label: "Class",    value: player!.class || "—" },
    { label: "Rank",     value: player!.rank || "Peasant" },
    { label: "Prestige", value: player!.prestige > 0 ? String(player!.prestige) : "—" },
  ];

  const eq = player!.equipped || {};
  const equipment = [
    { slot: "Weapon", name: eq.weapon || "Empty", Icon: WeaponIcon, filled: !!eq.weapon },
    { slot: "Armor",  name: eq.armor  || "Empty", Icon: ShieldIcon, filled: !!eq.armor },
    { slot: "Helmet", name: eq.helmet || "Empty", Icon: HelmetIcon, filled: !!eq.helmet },
    { slot: "Boots",  name: eq.boots  || "Empty", Icon: BootIcon,   filled: !!eq.boots },
    { slot: "Ring",   name: eq.ring   || "Empty", Icon: RingIcon,   filled: !!eq.ring },
    { slot: "Amulet", name: eq.amulet || "Empty", Icon: AmuletIcon, filled: !!eq.amulet },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      <div style={{ position: "relative", zIndex: 10 }}><Nav /></div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>

        {/* ── Banner + Avatar ── */}
        <section style={{ marginTop: 28, position: "relative" }} className="animate-fade-in">
          <div
            onClick={() => bannerRef.current?.click()}
            onMouseEnter={() => setHoverBanner(true)}
            onMouseLeave={() => setHoverBanner(false)}
            style={{ width: "100%", height: 200, borderRadius: 18, background: bannerUrl ? "transparent" : "linear-gradient(135deg, #0d0d0d 0%, #181818 50%, #0a0a0a 100%)", border: "0.5px solid rgba(255,255,255,0.1)", position: "relative", overflow: "hidden", cursor: "pointer" }}>
            {bannerUrl && <img src={bannerUrl} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            {!bannerUrl && <>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 24, left: 140, fontSize: "0.72rem", color: "rgba(255,255,255,0.12)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{player!.name} · {player!.class || "—"} · {guildDisplay}</div>
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
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{player!.name}</h1>
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
        <div style={{ paddingLeft: 26, fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", marginBottom: 28 }}>{player!.class || "—"} · {guildDisplay} · {player!.rank || "Peasant"}</div>

        {/* ── Quick stats strip ── */}
        <div className="animate-fade-in-up delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 1, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden", marginBottom: 24 }}>
          {quickStats.map((s, i) => (
            <div key={s.label} style={{ padding: "14px 16px", borderRight: i < quickStats.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none", background: "rgba(10,10,10,0.6)" }}>
              <div style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Tab Navigation ── */}
        <div className="animate-fade-in-up delay-2" style={{ display: "flex", gap: 4, marginBottom: 22, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, width: "fit-content" }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="profile-grid">
              {/* Stat bars */}
              <div className="section-card" style={{ padding: "22px 24px" }}>
                <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.09em" }}>Combat Stats</h2>
                {statBars.map(s => <StatBar key={s.label} {...s} />)}
              </div>
              {/* Activity */}
              <div className="section-card" style={{ padding: "22px 24px" }}>
                <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.09em" }}>Recent Activity</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {activity.map((a, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: i < activity.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none" }}>
                      <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.45 }}>{a.text}</span>
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.27)", whiteSpace: "nowrap", flexShrink: 0, marginTop: 2 }}>{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div className="section-card" style={{ padding: "22px 24px", marginBottom: 14 }}>
              <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.09em" }}>Equipment</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: 10 }}>
                {equipment.map(eq => (
                  <div key={eq.slot} style={{ background: eq.filled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)", border: `0.5px solid ${eq.filled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`, borderRadius: 12, padding: "14px 16px", transition: "border-color 0.2s" }}
                    onMouseEnter={e => eq.filled && ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.2)")}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = eq.filled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}>
                    <div style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>{eq.slot}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <eq.Icon size={15} color={eq.filled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)"} />
                      <span style={{ fontSize: "0.82rem", fontWeight: eq.filled ? 600 : 400, color: eq.filled ? "#fff" : "rgba(255,255,255,0.2)", fontStyle: eq.filled ? "normal" : "italic" }}>{eq.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)" }}>Season ends in 23 days · Level {seasonLevel} of {seasonMax}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{seasonLevel}</div>
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
                const unlocked = seasonLevel >= r.lv;
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
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>0 / 6</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Completed</div>
                </div>
              </div>
              <div className="section-card" style={{ padding: "14px 20px", flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>Overall Progress</div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                  <div style={{ height: "100%", width: "0%", background: "#fff", borderRadius: 999, boxShadow: "0 0 6px rgba(255,255,255,0.4)" }} />
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 32 }}>
              {achievements.map(a => (
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
