import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getShopItems, buyItem, type ShopItem } from "@/lib/api";

/* ── Rarity config ───────────────────────────────────────────────── */
const RARITY: Record<string, {
  border: string; dot: string;
  artTop: string; artGlow: string;
  iconTint: string; shadow: string;
  badgeBg: string; badgeColor: string;
}> = {
  common: {
    border:      "rgba(148,163,184,0.18)",
    dot:         "#94a3b8",
    artTop:      "linear-gradient(160deg, #0f1520 0%, #0a0d14 60%, #080b11 100%)",
    artGlow:     "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(148,163,184,0.12) 0%, transparent 70%)",
    iconTint:    "rgba(148,163,184,0.55)",
    shadow:      "0 6px 22px rgba(0,0,0,0.5)",
    badgeBg:     "rgba(148,163,184,0.1)",
    badgeColor:  "#94a3b8",
  },
  uncommon: {
    border:      "rgba(74,222,128,0.32)",
    dot:         "#4ade80",
    artTop:      "linear-gradient(160deg, #061410 0%, #050f0a 60%, #030a06 100%)",
    artGlow:     "radial-gradient(ellipse 85% 65% at 50% 0%, rgba(74,222,128,0.22) 0%, rgba(22,101,52,0.1) 50%, transparent 75%)",
    iconTint:    "rgba(74,222,128,0.8)",
    shadow:      "0 0 28px rgba(74,222,128,0.08), 0 8px 28px rgba(0,0,0,0.55)",
    badgeBg:     "rgba(74,222,128,0.12)",
    badgeColor:  "#4ade80",
  },
  rare: {
    border:      "rgba(96,165,250,0.38)",
    dot:         "#60a5fa",
    artTop:      "linear-gradient(160deg, #061225 0%, #050d1e 60%, #030a17 100%)",
    artGlow:     "radial-gradient(ellipse 85% 65% at 50% 0%, rgba(96,165,250,0.26) 0%, rgba(30,64,175,0.14) 50%, transparent 75%)",
    iconTint:    "rgba(96,165,250,0.85)",
    shadow:      "0 0 36px rgba(96,165,250,0.1), 0 10px 34px rgba(0,0,0,0.6)",
    badgeBg:     "rgba(96,165,250,0.13)",
    badgeColor:  "#60a5fa",
  },
  epic: {
    border:      "rgba(192,132,252,0.42)",
    dot:         "#c084fc",
    artTop:      "linear-gradient(160deg, #110920 0%, #0d0618 60%, #080410 100%)",
    artGlow:     "radial-gradient(ellipse 85% 65% at 50% 0%, rgba(192,132,252,0.3) 0%, rgba(88,28,135,0.18) 50%, transparent 75%)",
    iconTint:    "rgba(216,180,254,0.9)",
    shadow:      "0 0 44px rgba(192,132,252,0.12), 0 10px 36px rgba(0,0,0,0.65)",
    badgeBg:     "rgba(192,132,252,0.14)",
    badgeColor:  "#c084fc",
  },
  legendary: {
    border:      "rgba(251,146,60,0.52)",
    dot:         "#fb923c",
    artTop:      "linear-gradient(160deg, #1c0c03 0%, #160900 60%, #0f0600 100%)",
    artGlow:     "radial-gradient(ellipse 85% 65% at 50% 0%, rgba(251,146,60,0.35) 0%, rgba(154,52,18,0.2) 50%, transparent 75%)",
    iconTint:    "rgba(253,186,116,0.95)",
    shadow:      "0 0 60px rgba(251,146,60,0.14), 0 12px 40px rgba(0,0,0,0.7)",
    badgeBg:     "rgba(251,146,60,0.14)",
    badgeColor:  "#fb923c",
  },
};

/* ── SVG item icons (slot + type aware) ─────────────────────────── */
function ItemIcon({ slot, type, size = 56, color = "currentColor" }: { slot: string; type: string; size?: number; color?: string }) {
  const k = ((slot || "") + (type || "")).toLowerCase();
  const sw = "2"; const slc = "round"; const ljn = "round";
  if (k.includes("sword") || k.includes("blade") || k.includes("saber"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><line x1="28" y1="6" x2="28" y2="42" stroke={color} strokeWidth={sw} strokeLinecap={slc}/><polygon points="28,4 24,16 32,16" fill={color} opacity="0.9"/><line x1="19" y1="36" x2="37" y2="36" stroke={color} strokeWidth={sw} strokeLinecap={slc}/><rect x="25.5" y="40" width="5" height="10" rx="2.5" fill={color} opacity="0.55"/></svg>;
  if (k.includes("bow") || k.includes("arrow"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><path d="M14 8 Q7 28 14 48" stroke={color} strokeWidth={sw} fill="none" strokeLinecap={slc}/><line x1="14" y1="28" x2="46" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap={slc}/><polygon points="46,28 40,25 40,31" fill={color}/></svg>;
  if (k.includes("staff") || k.includes("wand") || k.includes("orb") || k.includes("magic") || k.includes("tome"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><line x1="28" y1="46" x2="28" y2="20" stroke={color} strokeWidth={sw} strokeLinecap={slc}/><circle cx="28" cy="14" r="8" stroke={color} strokeWidth="1.8" fill="none"/><circle cx="28" cy="14" r="3.5" fill={color} opacity="0.72"/></svg>;
  if (k.includes("helm") || k.includes("hat") || k.includes("head") || k.includes("hood"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><path d="M12 37 Q12 15 28 11 Q44 15 44 37 Z" stroke={color} strokeWidth={sw} fill="none" strokeLinejoin={ljn}/><line x1="10" y1="37" x2="46" y2="37" stroke={color} strokeWidth={sw} strokeLinecap={slc}/></svg>;
  if (k.includes("chest") || k.includes("armor") || k.includes("robe") || k.includes("vest") || k.includes("plate"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><path d="M17 10 L10 22 L10 44 L46 44 L46 22 L39 10 Z" stroke={color} strokeWidth={sw} fill="none" strokeLinejoin={ljn}/><path d="M17 10 Q28 17 39 10" stroke={color} strokeWidth="1.7" fill="none" strokeLinecap={slc}/></svg>;
  if (k.includes("boot") || k.includes("shoe") || k.includes("greave"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><rect x="18" y="8" width="9" height="28" rx="4.5" stroke={color} strokeWidth={sw} fill="none"/><rect x="29" y="8" width="9" height="28" rx="4.5" stroke={color} strokeWidth={sw} fill="none"/></svg>;
  if (k.includes("ring"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><circle cx="28" cy="32" r="15" stroke={color} strokeWidth={sw} fill="none"/><polygon points="28,11 25,18 31,18" fill={color} opacity="0.9"/></svg>;
  if (k.includes("amulet") || k.includes("necklace"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><path d="M20 10 Q28 7 36 10 Q38 19 28 24 Q18 19 20 10 Z" stroke={color} strokeWidth="1.9" fill="none"/><circle cx="28" cy="24" r="3.5" fill={color} opacity="0.75"/><path d="M28 24 L28 42" stroke={color} strokeWidth="1.9" strokeLinecap={slc}/></svg>;
  if (k.includes("potion") || k.includes("flask") || k.includes("elixir"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><rect x="22" y="6" width="12" height="8" rx="3" stroke={color} strokeWidth="1.9" fill="none"/><path d="M20 14 L13 30 L13 42 Q13 48 20 48 L36 48 Q43 48 43 42 L43 30 L36 14 Z" stroke={color} strokeWidth={sw} fill="none" strokeLinejoin={ljn}/></svg>;
  if (k.includes("shield"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><path d="M28 6 L44 13 L44 31 Q44 44 28 50 Q12 44 12 31 L12 13 Z" stroke={color} strokeWidth={sw} fill="none" strokeLinejoin={ljn}/></svg>;
  if (k.includes("axe") || k.includes("hammer") || k.includes("mace"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><line x1="28" y1="46" x2="28" y2="18" stroke={color} strokeWidth={sw} strokeLinecap={slc}/><path d="M28 18 Q18 10 16 20 Q14 28 28 28" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin={ljn}/></svg>;
  if (k.includes("dagger") || k.includes("knife") || k.includes("shuriken"))
    return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><line x1="28" y1="8" x2="28" y2="36" stroke={color} strokeWidth={sw} strokeLinecap={slc}/><polygon points="28,6 25,18 31,18" fill={color}/><line x1="21" y1="30" x2="35" y2="30" stroke={color} strokeWidth="1.6" strokeLinecap={slc}/><rect x="25.5" y="35" width="5" height="12" rx="2.5" fill={color} opacity="0.5"/></svg>;
  return <svg width={size} height={size} viewBox="0 0 56 56" fill="none"><polygon points="28,6 48,28 28,50 8,28" stroke={color} strokeWidth={sw} fill="none" strokeLinejoin={ljn}/><circle cx="28" cy="28" r="5" fill={color} opacity="0.6"/></svg>;
}

const FILTERS = ["All", "Common", "Uncommon", "Rare", "Epic", "Legendary"] as const;

function ItemCard({ item, onBuy }: { item: ShopItem; onBuy: (item: ShopItem) => void }) {
  const [hov, setHov] = useState(false);
  const [buying, setBuying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const r = RARITY[item.rarity] || RARITY.common;

  const statLine = [
    item.str ? `+${item.str} STR` : null,
    item.agi ? `+${item.agi} AGI` : null,
    item.int ? `+${item.int} INT` : null,
    item.def ? `+${item.def} DEF` : null,
  ].filter(Boolean).join("  ·  ");

  async function handleBuy() {
    setBuying(true);
    try { await onBuy(item); setToast("Purchased!"); }
    catch (err: unknown) { setToast(err instanceof Error ? err.message : "Purchase failed."); }
    finally { setBuying(false); setTimeout(() => setToast(null), 2800); }
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", borderRadius: 22, overflow: "hidden",
        background: "#08080f",
        border: `1px solid ${r.border}`,
        display: "flex", flexDirection: "column",
        transform: hov ? "translateY(-6px) scale(1.012)" : "translateY(0) scale(1)",
        boxShadow: hov ? r.shadow.replace("0 6px", "0 20px").replace("0 8px", "0 24px") : r.shadow,
        transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease",
      }}
    >
      {/* ── Art showcase area ── */}
      <div style={{ position: "relative", height: 148, flexShrink: 0, overflow: "hidden" }}>
        {/* Rarity-tinted gradient sky */}
        <div style={{ position: "absolute", inset: 0, background: r.artTop }} />
        {/* Rarity colour glow */}
        <div style={{ position: "absolute", inset: 0, background: r.artGlow }} />
        {/* Grid dot pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }} />
        {/* Horizon line glow */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 0%, ${r.dot}55 50%, transparent 100%)` }} />
        {/* Bottom fade to card body */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 56, background: "linear-gradient(to bottom, transparent, #08080f)" }} />

        {/* Hover shimmer */}
        {hov && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 55%)", pointerEvents: "none" }} />
        )}

        {/* Icon centred with glow ring */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 8 }}>
          <div style={{ position: "relative" }}>
            {/* Ambient glow behind icon */}
            <div style={{
              position: "absolute", inset: -20, borderRadius: "50%",
              background: `radial-gradient(circle, ${r.dot}30 0%, transparent 70%)`,
              filter: "blur(10px)",
            }} />
            <div style={{
              width: 68, height: 68, borderRadius: 20,
              background: `${r.dot}14`,
              border: `1px solid ${r.dot}35`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 1,
              boxShadow: `0 0 22px ${r.dot}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
            }}>
              <ItemIcon slot={item.slot} type={item.type} size={34} color={r.iconTint} />
            </div>
          </div>
        </div>

        {/* Rarity badge */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: r.badgeBg, border: `0.5px solid ${r.dot}44`,
          borderRadius: 999, padding: "3px 10px",
          fontSize: "0.6rem", fontWeight: 800, color: r.badgeColor,
          letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 4, zIndex: 2,
        }}>
          <span style={{ width: 4.5, height: 4.5, borderRadius: "50%", background: r.dot, display: "inline-block", boxShadow: `0 0 5px ${r.dot}` }} />
          {item.rarity === "common" ? "COMMON" : item.rarity.toUpperCase()}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            background: toast === "Purchased!" ? "rgba(74,222,128,0.18)" : "rgba(239,68,68,0.18)",
            border: `0.5px solid ${toast === "Purchased!" ? "rgba(74,222,128,0.4)" : "rgba(239,68,68,0.4)"}`,
            borderRadius: 999, padding: "5px 14px", fontSize: "0.72rem", fontWeight: 700, color: "#fff",
            whiteSpace: "nowrap", zIndex: 10,
          }}>{toast}</div>
        )}
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontSize: "0.91rem", fontWeight: 800, color: "#fff", marginBottom: 2, letterSpacing: "-0.01em" }}>{item.name}</div>
        <div style={{ fontSize: "0.64rem", color: "rgba(255,255,255,0.3)", marginBottom: statLine ? 4 : 0, fontWeight: 500, textTransform: "capitalize" }}>{item.type} · {item.slot}</div>

        {statLine && (
          <div style={{ fontSize: "0.67rem", color: r.iconTint, marginBottom: 6, fontWeight: 700, letterSpacing: "0.02em" }}>{statLine}</div>
        )}

        <p style={{ fontSize: "0.71rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.55, flex: 1, marginBottom: 12 }}>{item.desc}</p>

        {/* Price + buy row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `0.5px solid rgba(255,255,255,0.06)` }}>
          <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#fbbf24", display: "flex", alignItems: "center", gap: 5, fontVariantNumeric: "tabular-nums" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", display: "inline-block", boxShadow: "0 0 6px #fbbf24" }} />
            {item.price.toLocaleString()}
          </span>
          <button
            onClick={handleBuy}
            disabled={buying}
            style={{
              background: `linear-gradient(135deg, ${r.dot}cc, ${r.dot})`,
              color: "#fff", border: "none", borderRadius: 999,
              padding: "6px 18px", fontSize: "0.75rem", fontWeight: 700,
              cursor: buying ? "not-allowed" : "pointer", fontFamily: "Outfit, sans-serif",
              opacity: buying ? 0.5 : 1,
              boxShadow: `0 0 16px ${r.dot}33`,
              transition: "opacity 0.18s, transform 0.18s",
            }}
            onMouseEnter={e => { if (!buying) e.currentTarget.style.transform = "scale(1.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {buying ? "…" : "Buy"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const { player, openLogin, setPlayer } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    getShopItems().then(d => { setItems(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? items : items.filter(i => i.rarity === filter.toLowerCase());

  async function handleBuy(item: ShopItem) {
    if (!player) { openLogin(); throw new Error("Login required."); }
    const updated = await buyItem(item.id);
    setPlayer(updated);
  }

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Nav />
      <div className="section-wrap">
        <section style={{ padding: "44px 0 60px" }}>
          {/* Header */}
          <div className="anim-up" style={{ marginBottom: 28 }}>
            <div className="pill" style={{ marginBottom: 14, display: "inline-flex" }}>Astral Shop</div>
            <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.045em", fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif", marginBottom: 8 }}>
              Weapons &amp; Items
            </h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.65, maxWidth: 440 }}>
              Real gear from the game. Purchase with your in-game Solars.
            </p>
            {player && (
              <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(251,191,36,0.1)", border: "0.5px solid rgba(251,191,36,0.25)", borderRadius: 999, padding: "6px 16px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 6px #fbbf24" }} />
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Balance:</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fbbf24" }}>{player.Solars.toLocaleString()} Solars</span>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="anim-up d1" style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
            {FILTERS.map(f => {
              const r = RARITY[f.toLowerCase()] || { dot: "rgba(255,255,255,0.6)", border: "rgba(255,255,255,0.1)" };
              const active = filter === f;
              return (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: active ? `${(r as { dot: string }).dot}18` : "rgba(255,255,255,0.04)",
                  color: active ? "#fff" : "rgba(255,255,255,0.45)",
                  border: `0.5px solid ${active ? (r as { border: string; dot: string }).border || (r as { dot: string }).dot + "44" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 999, padding: "7px 16px", fontSize: "0.78rem", fontWeight: active ? 700 : 500,
                  cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.18s",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {f !== "All" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: (r as { dot: string }).dot, display: "inline-block" }} />}
                  {f}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="shimmer" style={{ height: 300, borderRadius: 22 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "rgba(255,255,255,0.28)", fontSize: "0.85rem" }}>No items found for this filter.</div>
          ) : (
            <div className="anim-up d2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {filtered.map(item => <ItemCard key={item.id} item={item} onBuy={handleBuy} />)}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
