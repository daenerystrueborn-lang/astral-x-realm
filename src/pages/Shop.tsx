import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getShopItems, buyItem, type ShopItem } from "@/lib/api";

const CARD_BG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wCEAAQGBgkHCQkJCQkLCQoJCwsLCwsLCw0KDAsMCg0NDQ0ODg0NDQ0MEA8QDA0OEBAQEA4PEhISDxIRERIUEhQSEg4BBAUFCAYIBwgIBwkHCAcJCAgHBwgICgcIBwgHCgoJCAkJCAkKCQkJBwkJCQoKCwsKCgoICQgKCgoKCg8QDw8Pfv/CABEIBFAC4AMBIgACEQEDEQH/xADlAAACAgMBAQEAAAAAAAAAAAAEBQMGAQIHAAgJAQACAwEBAQAAAAAAAAAAAAADBAECBQAGBxAAAgMAAgMBAQEBAQEAAAAAAgMBBAUABhESExQQFQcgFhEAAgMAAgMBAQEBAAAAAAAAAgMAAQQREgUQExQgFQYSAAIBAgQEAwUHAgYBBAIDAAABEQIhEBIxQQMgUWEicYETMDKRoUBCUrHB0fBi4QQjUHKS8TMUgqKyY8JDYIMTAAEDAgQEBQMEAgMAAAAAABEAARAgITAxQEECElFhUHGBkaEi4fCxwdHxMmJCYHD/2gAIAQEAAAAA+GjNfZztFFJk7TA2xQxevsD2pKynUuiLR2RNzfzIoOyI5EpsqkwLWUoLLOrqybfoqsqcdO6tmXQSu1I0cHT3lA7yiL5SWJQxmt/rbrpa+iV75ozLnMu8ARw7qNZMSUCctlEbZNlHjdG23qds+fLASMER3BrwbcOxOzeVL1kFyzJVHMCq03KrLKi0fsQzOp0yhz2J9U7H1wjnfO1jC23Xi64K+3JFT+n/AAeeV7E2VphYeDdBXOwgsmwrkK1Vd3Dbdm11p8b+DSJ39Fh8nsfVee0LtJ3zzQl1jy2Hu1Gb9RqytjSy2cPOC7/zqrNOldc5ntcKt0/NTRX0/nHObi08Y0tP5vmnRwmyaSjSTYLjMEwLPkOyiMklgjtzP2tkp7JywRMutXXnK7t1V5T0OKnUCu25Srt17o+9xrtg6Ek35wJhH6sisLi5QTWWxadG5hS7dT2fuxEcRYdA3/OqWQmPXDPbaUGbUkuVYMYSP50GLJ0Nvfq1fyabZm88qbot64Fd76u4RXzK3PXyExDjpUoynpLMqSiUgayMlBVGkGCKa2Wcbp+vKaxG/msdnnFDZ/nlnYuLWSbV4OubAz7EoZzWYoFkWnj9PNddCs99qKTqGuxkLIIrTaPnlG5qgaH6HM7ALuvs8JF6Ucxit1ZRtOn1OlWPFn2PEuRNdrVcr7++vrPU1nQvypli2yZoRCbHMyRysV0h2/gJm85m3TTLPyw7st45B2Bm9IlkImj19pWuDQdFrJNYjadm4xE8FvzDYVE/5mmt2l5qz1Q3sfM3N0IqfLkpt46uQTvqZ+RmdS8bRmRxtt49ThQmDL21dtPrLPBdgzkj3qZ1bCsvYDNva+kIlC4rGD0IV2IubTc41JJtzDfOI61V3kh1hzrLNFuTtyql3qS83Dc9htn8Z5I2Wox2w0zCEmIgpGe4RuK5dN7qsFksST16to509ytdnlzDHr7ePgo9KuvrEF0Jv4GXmVysO/ts49tytraWU5e2/s4h5zNbRrQXKWZJt+M5I7TSAnxE+NmOkcq+effAjm+B6FWkyceygMzrTcLPNtjaTPtqnz7oPObnQ5OsRMtMaV5kb7TM2ZNwKJ0MiSeXfabG0McFapnTiiPa7/kMcHOVIA68OwGcjDuEczZc03c2qoM3VsHIMsCDLa4XOyE5ztvtneLffTaplWjO3o9NMRaQ643k3103ztttttvvLiHnfP2b82+7a5/JfaMrUj25C42SYgF4jcm1u2mLbyFgt8fmwWxMWytt9VHG6YzjG2c5ztnM222+c648Jvvpj3tNcZ9pvt7OdhqStgrNlf24zG35Gen222IDcLiSdZfMEFgbVayt9LtVCmxzVrcb5VKZ68Pq50Ozzw41129nOPZ22332znOfBFZ97XX2M65229tj2A+agVBT";

const RARITY_STYLE: Record<string, { border: string; glow: string; dot: string; gradient: string }> = {
  common:    { border: "rgba(255,255,255,0.07)", glow: "none",                         dot: "#6b7280", gradient: "rgba(255,255,255,0.03)" },
  uncommon:  { border: "rgba(74,222,128,0.22)",  glow: "0 0 28px rgba(74,222,128,0.05)",  dot: "#4ade80", gradient: "rgba(74,222,128,0.04)" },
  rare:      { border: "rgba(96,165,250,0.3)",   glow: "0 0 36px rgba(96,165,250,0.06)",  dot: "#60a5fa", gradient: "rgba(96,165,250,0.06)" },
  epic:      { border: "rgba(192,132,252,0.38)", glow: "0 0 44px rgba(192,132,252,0.08)", dot: "#c084fc", gradient: "rgba(192,132,252,0.07)" },
  legendary: { border: "rgba(251,146,60,0.5)",   glow: "0 0 60px rgba(251,146,60,0.1)",   dot: "#fb923c", gradient: "rgba(251,146,60,0.09)" },
};

function ItemIcon({ slot, type, size = 46 }: { slot: string; type: string; size?: number }) {
  const k = ((slot || "") + (type || "")).toLowerCase();
  const c = "rgba(255,255,255,0.7)";
  const d = size;
  if (k.includes("sword") || k.includes("blade") || k.includes("saber")) return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><line x1="27" y1="6" x2="27" y2="40" stroke={c} strokeWidth="2.2" strokeLinecap="round"/><polygon points="27,4 23,16 31,16" fill={c} opacity="0.9"/><line x1="18" y1="34" x2="36" y2="34" stroke={c} strokeWidth="2" strokeLinecap="round"/><rect x="24.5" y="38" width="5" height="9" rx="2" fill={c} opacity="0.6"/></svg>;
  if (k.includes("bow") || k.includes("arrow")) return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><path d="M14 8 Q8 27 14 46" stroke={c} strokeWidth="2.2" fill="none" strokeLinecap="round"/><line x1="14" y1="27" x2="44" y2="27" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><polygon points="44,27 38,24 38,30" fill={c}/></svg>;
  if (k.includes("staff") || k.includes("wand") || k.includes("orb") || k.includes("magic")) return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><line x1="27" y1="44" x2="27" y2="18" stroke={c} strokeWidth="2.2" strokeLinecap="round"/><circle cx="27" cy="13" r="7" stroke={c} strokeWidth="1.8" fill="none"/><circle cx="27" cy="13" r="3" fill={c} opacity="0.7"/></svg>;
  if (k.includes("helm") || k.includes("hat") || k.includes("head") || k.includes("hood")) return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><path d="M12 36 Q12 16 27 12 Q42 16 42 36 Z" stroke={c} strokeWidth="2" fill="none"/><line x1="10" y1="36" x2="44" y2="36" stroke={c} strokeWidth="2.2" strokeLinecap="round"/></svg>;
  if (k.includes("chest") || k.includes("armor") || k.includes("robe") || k.includes("vest")) return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><path d="M16 10 L10 22 L10 42 L44 42 L44 22 L38 10 Z" stroke={c} strokeWidth="2" fill="none"/><path d="M16 10 Q27 16 38 10" stroke={c} strokeWidth="1.6" fill="none"/></svg>;
  if (k.includes("boot") || k.includes("shoe") || k.includes("greave")) return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><rect x="18" y="8" width="8" height="28" rx="4" stroke={c} strokeWidth="2" fill="none"/><rect x="28" y="8" width="8" height="28" rx="4" stroke={c} strokeWidth="2" fill="none"/></svg>;
  if (k.includes("ring")) return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><circle cx="27" cy="30" r="14" stroke={c} strokeWidth="2.2" fill="none"/><polygon points="27,11 24,17 30,17" fill={c} opacity="0.9"/></svg>;
  if (k.includes("amulet") || k.includes("necklace")) return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><path d="M20 10 Q27 8 34 10 Q36 18 27 22 Q18 18 20 10 Z" stroke={c} strokeWidth="1.8" fill="none"/><circle cx="27" cy="22" r="3.5" fill={c} opacity="0.75"/><path d="M27 22 L27 38" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if (k.includes("potion") || k.includes("flask") || k.includes("elixir")) return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><rect x="22" y="6" width="10" height="7" rx="2" stroke={c} strokeWidth="1.8" fill="none"/><path d="M20 13 L14 28 L14 40 Q14 46 20 46 L34 46 Q40 46 40 40 L40 28 L34 13 Z" stroke={c} strokeWidth="2" fill="none"/></svg>;
  if (k.includes("shield")) return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><path d="M27 6 L42 12 L42 30 Q42 42 27 48 Q12 42 12 30 L12 12 Z" stroke={c} strokeWidth="2" fill="none"/></svg>;
  return <svg width={d} height={d} viewBox="0 0 54 54" fill="none"><polygon points="27,6 46,27 27,48 8,27" stroke={c} strokeWidth="2" fill="none"/></svg>;
}

const FILTERS = ["All", "Common", "Uncommon", "Rare", "Epic", "Legendary"] as const;

function ItemCard({ item, onBuy }: { item: ShopItem; onBuy: (item: ShopItem) => void }) {
  const [hov, setHov] = useState(false);
  const [lit, setLit] = useState(false);
  const [buying, setBuying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const rs = RARITY_STYLE[item.rarity] || RARITY_STYLE.common;

  const statLine = [
    item.str ? `+${item.str} STR` : null,
    item.agi ? `+${item.agi} AGI` : null,
    item.int ? `+${item.int} INT` : null,
    item.def ? `+${item.def} DEF` : null,
  ].filter(Boolean).join(" · ");

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
        background: `radial-gradient(circle at 50% 0%, ${rs.gradient} 0%, rgba(8,8,16,0.95) 70%)`,
        border: `0.5px solid ${rs.border}`,
        display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 280,
        padding: "1.1rem",
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        boxShadow: `${rs.glow}, ${hov ? "0 20px 60px rgba(0,0,0,0.7)" : "0 8px 30px rgba(0,0,0,0.5)"}`,
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
        cursor: "default",
      }}
    >
      {/* Art BG */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${CARD_BG})`, backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.1, borderRadius: "inherit", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.92) 100%)`, borderRadius: "inherit", pointerEvents: "none" }} />

      {/* Light sweep on hover */}
      {hov && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 50%)", pointerEvents: "none", borderRadius: "inherit" }} />}

      {/* Icon */}
      <div style={{ position: "absolute", top: 14, left: 14, zIndex: 1 }}><ItemIcon slot={item.slot} type={item.type} size={46} /></div>

      {/* Rarity badge */}
      {item.rarity !== "common" && (
        <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.5)", border: `0.5px solid ${rs.dot}44`, borderRadius: 999, padding: "3px 9px", fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 5, zIndex: 1 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: rs.dot, display: "inline-block", boxShadow: `0 0 5px ${rs.dot}` }} />
          {item.rarity.toUpperCase()}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", background: toast === "Purchased!" ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.15)", border: `0.5px solid ${toast === "Purchased!" ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: 999, padding: "5px 14px", fontSize: "0.72rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", zIndex: 10 }}>
          {toast}
        </div>
      )}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, marginTop: "auto" }}>
        <div style={{ fontSize: "0.93rem", fontWeight: 700, color: "#fff", marginBottom: 3 }}>{item.name}</div>
        <div style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.38)", marginBottom: 3, fontWeight: 500 }}>{item.type} · {item.slot}</div>
        {statLine && <div style={{ fontSize: "0.69rem", color: "rgba(255,255,255,0.5)", marginBottom: 6, fontWeight: 600 }}>{statLine}</div>}
        <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.33)", lineHeight: 1.5, marginBottom: "0.7rem", borderBottom: "0.5px solid rgba(255,255,255,0.07)", paddingBottom: "0.6rem" }}>{item.desc}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fbbf24", display: "inline-block", boxShadow: "0 0 6px #fbbf24aa" }} />
            {item.price.toLocaleString()}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* LED toggle preview */}
            <div
              onClick={() => setLit(a => !a)}
              title={lit ? "Deactivate" : "Activate"}
              style={{ width: "3rem", height: "1.4rem", borderRadius: "0.4rem", background: "#000", boxShadow: lit ? "inset 0 -5px 5px 0.2rem #0004, inset 0 0 1px 0.2rem #ddd, inset 0 0 0.8rem #aaa" : "inset 0 -5px 5px 0.2rem #0004, inset 0 0 1px 0.15rem #444", cursor: "pointer", position: "relative", transition: "all 0.35s ease", flexShrink: 0 }}
            >
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, margin: "auto", width: "2.2rem", height: "0.4rem", borderRadius: "0.15rem", background: lit ? "rgba(255,255,255,0.85)" : "#000", boxShadow: lit ? "0 0 0.25rem 0.1rem rgba(255,255,255,0.4)" : "none", transition: "all 0.35s ease" }} />
              <div style={{ position: "absolute", top: 0, bottom: "0.03rem", margin: "auto", left: lit ? "calc(55% - 0.2rem)" : "0.35rem", width: "32%", height: "28%", background: lit ? "#fff" : "#777", borderRadius: "0.15rem", transition: "all 0.35s ease" }} />
            </div>
            <button
              onClick={handleBuy}
              disabled={buying}
              style={{
                background: "linear-gradient(135deg, #7c3aed, #22d3ee)",
                color: "#fff", border: "none", borderRadius: 999,
                padding: "5px 16px", fontSize: "0.74rem", fontWeight: 700,
                cursor: buying ? "not-allowed" : "pointer", fontFamily: "Outfit, sans-serif",
                opacity: buying ? 0.6 : 1, transition: "opacity 0.18s, transform 0.18s",
                boxShadow: "0 0 14px rgba(124,58,237,0.3)",
              }}
              onMouseEnter={e => { if (!buying) { e.currentTarget.style.transform = "scale(1.05)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {buying ? "…" : "Buy"}
            </button>
          </div>
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
              const rs = RARITY_STYLE[f.toLowerCase()] || { dot: "rgba(255,255,255,0.6)", border: "rgba(255,255,255,0.1)" };
              const active = filter === f;
              return (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                  color: active ? "#fff" : "rgba(255,255,255,0.45)",
                  border: `0.5px solid ${active ? rs.border : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 999, padding: "7px 16px", fontSize: "0.78rem", fontWeight: active ? 700 : 500,
                  cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.18s",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {f !== "All" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: rs.dot, display: "inline-block" }} />}
                  {f}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="shimmer" style={{ height: 280, borderRadius: 22 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "rgba(255,255,255,0.28)", fontSize: "0.85rem" }}>No items found for this filter.</div>
          ) : (
            <div className="anim-up d2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {filtered.map(item => <ItemCard key={item.id} item={item} onBuy={handleBuy} />)}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
