import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getShopItems, buyItem, type ShopItem } from "@/lib/api";

const rarityBorder: Record<string, string> = {
  common:    "rgba(255,255,255,0.07)",
  uncommon:  "rgba(255,255,255,0.14)",
  rare:      "rgba(255,255,255,0.28)",
  epic:      "rgba(255,255,255,0.42)",
  legendary: "rgba(255,255,255,0.6)",
};
const rarityGlow: Record<string, string> = {
  common:    "none",
  uncommon:  "none",
  rare:      "0 0 28px rgba(255,255,255,0.03)",
  epic:      "0 0 36px rgba(255,255,255,0.05)",
  legendary: "0 0 50px rgba(255,255,255,0.07)",
};
const rarityEmoji: Record<string, string> = {
  common: "⬜", uncommon: "🟩", rare: "🟦", epic: "🟪", legendary: "🟧",
};

const FILTERS = ["All", "Common", "Uncommon", "Rare", "Epic", "Legendary"] as const;

function ItemCard({ item, onBuy }: { item: ShopItem; onBuy: (item: ShopItem) => void }) {
  const [active, setActive] = useState(false);
  const [hov, setHov] = useState(false);
  const [buying, setBuying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const statLine = [
    item.str ? `⚔️ +${item.str} STR` : null,
    item.agi ? `💨 +${item.agi} AGI` : null,
    item.int ? `🔮 +${item.int} INT` : null,
    item.def ? `🛡️ +${item.def} DEF` : null,
  ].filter(Boolean).join("  ");

  async function handleBuy() {
    setBuying(true);
    try {
      await onBuy(item);
      setToast("Purchased!");
    } catch (err: unknown) {
      setToast(err instanceof Error ? err.message : "Purchase failed.");
    } finally {
      setBuying(false);
      setTimeout(() => setToast(null), 2800);
    }
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        background: "radial-gradient(circle at 50% 0%, #1e1e1e 0%, #0d0d0d 70%)",
        border: `0.5px solid ${rarityBorder[item.rarity]}`,
        borderRadius: "1.4rem",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        minHeight: 280,
        padding: "1.1rem",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        boxShadow: active
          ? `inset 0 1rem 0.15rem -1rem #fffa, ${rarityGlow[item.rarity]}, 0 0 0 0.5px rgba(255,255,255,0.08)`
          : `${rarityGlow[item.rarity]}, 0 0 0 0.5px rgba(0,0,0,0)`,
        cursor: "default",
      }}
    >
      {/* Light layer */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", left: "18%", right: "18%", top: "46%", bottom: 0, margin: "auto",
          height: "0.9rem", transform: "rotateX(-76deg)",
          background: active ? "#fff" : "#0c0c0c",
          boxShadow: active ? "0 0 5px 1px #fff8" : "none",
          transition: "all 0.35s ease",
        }} />
        <div style={{ position: "absolute", inset: 0, opacity: active ? 0.45 : 0, transition: "opacity 0.35s ease" }}>
          <div style={{ width: "68%", height: "7rem", background: "linear-gradient(#fff0, #fffa)", position: "absolute", left: "16%", bottom: "5rem", transform: "rotateX(-42deg)", filter: "blur(0.8rem)", opacity: 0.7, borderRadius: "100% 100% 0 0" }} />
        </div>
      </div>

      {/* Rarity badge */}
      <div style={{ position: "absolute", top: 14, left: 14, fontSize: "1.4rem" }}>{item.emoji}</div>
      {item.rarity !== "common" && (
        <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "3px 10px", fontSize: "0.64rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>
          {rarityEmoji[item.rarity]} {item.rarity.toUpperCase()}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", background: toast === "Purchased!" ? "rgba(255,255,255,0.12)" : "rgba(255,80,80,0.18)", border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "5px 14px", fontSize: "0.72rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", zIndex: 10 }}>
          {toast}
        </div>
      )}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, marginTop: "auto" }}>
        <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#fff", marginBottom: 3 }}>{item.name}</div>
        <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.38)", marginBottom: 4, fontWeight: 500 }}>{item.type} · {item.slot}</div>
        {statLine && <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", marginBottom: 6, fontWeight: 600 }}>{statLine}</div>}
        <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5, marginBottom: "0.75rem", borderBottom: "0.5px solid rgba(255,255,255,0.07)", paddingBottom: "0.6rem" }}>{item.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>{item.price.toLocaleString()} ☀️</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div onClick={() => setActive(a => !a)} title={active ? "Deactivate" : "Activate"} style={{
              width: "3rem", height: "1.4rem", borderRadius: "0.4rem", background: "#000",
              boxShadow: active
                ? "inset 0 -5px 5px 0.2rem #0004, inset 0 0 1px 0.2rem #ddd, inset 0 0 0.8rem #aaa"
                : "inset 0 -5px 5px 0.2rem #0004, inset 0 0 1px 0.15rem #444",
              cursor: "pointer", position: "relative", transition: "all 0.35s ease", flexShrink: 0,
            }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, margin: "auto", width: "2.2rem", height: "0.4rem", borderRadius: "0.15rem", background: active ? "rgba(255,255,255,0.85)" : "#000", boxShadow: active ? "0 0 0.25rem 0.1rem rgba(255,255,255,0.4)" : "none", transition: "all 0.35s ease" }} />
              <div style={{ position: "absolute", top: 0, bottom: "0.03rem", margin: "auto", left: active ? "calc(55% - 0.2rem)" : "0.35rem", width: "32%", height: "28%", background: active ? "#fff" : "#777", borderRadius: "0.15rem", transition: "all 0.35s ease" }} />
            </div>
            <button
              onClick={handleBuy}
              disabled={buying}
              style={{ background: "#fff", color: "#000", border: "none", borderRadius: 999, padding: "5px 14px", fontSize: "0.74rem", fontWeight: 700, cursor: buying ? "not-allowed" : "pointer", fontFamily: "Outfit, sans-serif", opacity: buying ? 0.6 : 1 }}>
              {buying ? "..." : "Buy"}
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
    getShopItems().then(data => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <section style={{ padding: "44px 0 48px" }}>
          <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Astral Shop</div>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.04em" }}>Weapons &amp; Items</h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Gear up for battle. Real items from the game — purchase with your Solars.</p>
            {player && (
              <div style={{ marginTop: 10, fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>
                Your balance: <span style={{ color: "#fff", fontWeight: 700 }}>{player.Solars.toLocaleString()} ☀️</span>
              </div>
            )}
          </div>

          {/* Filter tabs */}
          <div className="animate-fade-in-up delay-1" style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? "#fff" : "rgba(255,255,255,0.04)",
                color: filter === f ? "#000" : "rgba(255,255,255,0.45)",
                border: `0.5px solid ${filter === f ? "#fff" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 999, padding: "6px 16px", fontSize: "0.78rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.18s",
              }}>{f}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>Loading items...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No items found.</div>
          ) : (
            <div className="animate-fade-in-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {filtered.map(item => <ItemCard key={item.id} item={item} onBuy={handleBuy} />)}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
