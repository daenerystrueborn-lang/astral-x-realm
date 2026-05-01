import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useState } from "react";

/* ── Weapon SVG icons ── */
const c = "rgba(255,255,255,0.88)";
const cd = "rgba(255,255,255,0.45)";

function SvgGreatsword() {
  return <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <line x1="36" y1="6" x2="36" y2="54" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M32 10 L36 6 L40 10 L36 50 Z" fill={c} opacity="0.85"/>
    <rect x="20" y="46" width="32" height="5" rx="2.5" fill={c}/>
    <rect x="34" y="51" width="4" height="13" rx="2" fill={cd}/>
    <circle cx="36" cy="66" r="4" fill={c}/>
    <line x1="24" y1="22" x2="28" y2="22" stroke={cd} strokeWidth="1" strokeLinecap="round"/>
    <line x1="44" y1="22" x2="48" y2="22" stroke={cd} strokeWidth="1" strokeLinecap="round"/>
  </svg>;
}
function SvgBattleAxe() {
  return <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <line x1="24" y1="60" x2="50" y2="18" stroke={cd} strokeWidth="3" strokeLinecap="round"/>
    <path d="M44 22 C48 12 58 8 60 14 C62 20 56 26 50 24 Z" fill={c}/>
    <path d="M44 22 C40 30 38 36 42 42 C46 38 50 30 50 24 Z" fill={c} opacity="0.6"/>
    <circle cx="26" cy="57" r="4" fill={c}/>
    <path d="M56 10 L58 6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>;
}
function SvgLongbow() {
  return <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <path d="M24 8 C18 24 18 48 24 64" stroke={c} strokeWidth="3" strokeLinecap="round" fill="none"/>
    <line x1="24" y1="8" x2="24" y2="64" stroke={cd} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 4"/>
    <line x1="36" y1="36" x2="50" y2="36" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    <polygon points="50,33 58,36 50,39" fill={c}/>
    <line x1="24" y1="8" x2="37" y2="36" stroke={c} strokeWidth="1.2"/>
    <line x1="37" y1="36" x2="24" y2="64" stroke={c} strokeWidth="1.2"/>
  </svg>;
}
function SvgShield() {
  return <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <path d="M36 6 L58 14 V36 C58 50 46 62 36 66 C26 62 14 50 14 36 V14 Z" stroke={c} strokeWidth="2" fill="rgba(255,255,255,0.06)"/>
    <line x1="36" y1="18" x2="36" y2="54" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="22" y1="36" x2="50" y2="36" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <circle cx="36" cy="36" r="6" stroke={c} strokeWidth="1.5" fill="none" opacity="0.7"/>
  </svg>;
}
function SvgDagger() {
  return <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <path d="M33 10 L36 6 L39 10 L37.5 46 L34.5 46 Z" fill={c}/>
    <rect x="26" y="44" width="20" height="4" rx="2" fill={c}/>
    <rect x="34" y="48" width="4" height="14" rx="2" fill={cd}/>
    <circle cx="36" cy="64" r="3" fill={c}/>
    <line x1="32" y1="20" x2="30" y2="20" stroke={cd} strokeWidth="1" strokeLinecap="round"/>
    <line x1="40" y1="20" x2="42" y2="20" stroke={cd} strokeWidth="1" strokeLinecap="round"/>
  </svg>;
}
function SvgWarhammer() {
  return <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <line x1="36" y1="30" x2="36" y2="68" stroke={cd} strokeWidth="3.5" strokeLinecap="round"/>
    <rect x="20" y="12" width="32" height="20" rx="4" fill={c}/>
    <rect x="32" y="8" width="8" height="6" rx="2" fill={c} opacity="0.7"/>
    <line x1="24" y1="22" x2="28" y2="22" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="44" y1="22" x2="48" y2="22" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>;
}
function SvgRapier() {
  return <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <line x1="36" y1="5" x2="36" y2="58" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M34 5 L36 2 L38 5 Z" fill={c}/>
    <ellipse cx="36" cy="50" rx="14" ry="5" stroke={c} strokeWidth="1.5" fill="none"/>
    <path d="M22 50 C20 55 22 60 28 58" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M50 50 C52 55 50 60 44 58" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="34.5" y="55" width="3" height="13" rx="1.5" fill={cd}/>
    <circle cx="36" cy="70" r="3" fill={c}/>
  </svg>;
}
function SvgMace() {
  return <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <line x1="36" y1="32" x2="36" y2="68" stroke={cd} strokeWidth="3.5" strokeLinecap="round"/>
    <circle cx="36" cy="22" r="12" fill="rgba(255,255,255,0.08)" stroke={c} strokeWidth="1.5"/>
    {[0,60,120,180,240,300].map(a=><line key={a} x1={36+14*Math.cos(a*Math.PI/180)} y1={22+14*Math.sin(a*Math.PI/180)} x2={36+20*Math.cos(a*Math.PI/180)} y2={22+20*Math.sin(a*Math.PI/180)} stroke={c} strokeWidth="3.5" strokeLinecap="round"/>)}
  </svg>;
}

const items = [
  { Svg: SvgGreatsword, name: "Voidblade",      type: "Legendary Sword",  desc: "Forged in the void. +180 ATK, ignores 25% DEF.",         price: 4800, rarity: "Legendary" as const },
  { Svg: SvgBattleAxe,  name: "Inferno Axe",    type: "Rare Axe",         desc: "+130 ATK. 20% chance to burn on hit.",                   price: 2200, rarity: "Rare" as const },
  { Svg: SvgLongbow,    name: "Eclipse Bow",    type: "Rare Bow",         desc: "+100 ATK. +15% crit rate in darkness.",                  price: 1900, rarity: "Rare" as const },
  { Svg: SvgShield,     name: "Aegis Core",     type: "Legendary Shield", desc: "Absorbs up to 800 damage. Regenerates 50 HP/turn.",      price: 3600, rarity: "Legendary" as const },
  { Svg: SvgDagger,     name: "Shadow Fang",    type: "Common Dagger",    desc: "+60 ATK. Deals bonus damage from behind.",               price: 120,  rarity: "Common" as const },
  { Svg: SvgWarhammer,  name: "Titan Hammer",   type: "Rare Warhammer",   desc: "+150 ATK. 10% chance to stun for 1 turn.",               price: 2600, rarity: "Rare" as const },
  { Svg: SvgRapier,     name: "Phantom Rapier", type: "Rare Sword",       desc: "+90 ATK. +20% dodge on counterattack.",                  price: 1700, rarity: "Rare" as const },
  { Svg: SvgMace,       name: "Soul Mace",      type: "Legendary Mace",   desc: "Drains 60 HP per hit. Ignores undead immunity.",         price: 3200, rarity: "Legendary" as const },
];

const rarityBorder: Record<string, string> = {
  Common:    "rgba(255,255,255,0.08)",
  Rare:      "rgba(255,255,255,0.22)",
  Legendary: "rgba(255,255,255,0.45)",
};
const rarityGlow: Record<string, string> = {
  Common:    "none",
  Rare:      "0 0 28px rgba(255,255,255,0.03)",
  Legendary: "0 0 40px rgba(255,255,255,0.06)",
};

function ItemCard({ item }: { item: typeof items[0] }) {
  const [active, setActive] = useState(false);
  const [hov, setHov] = useState(false);

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
        <div style={{ position: "absolute", inset: 0, opacity: active ? 0.45 : 0, transition: "opacity 0.35s ease", perspective: 400 }}>
          <div style={{ width: "68%", height: "7rem", background: "linear-gradient(#fff0, #fffa)", position: "absolute", left: "16%", bottom: "5rem", transform: "rotateX(-42deg)", filter: "blur(0.8rem)", opacity: 0.7, borderRadius: "100% 100% 0 0" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: active ? 0.75 : 0.15, transition: "opacity 0.35s ease" }}>
          <div style={{ width: "60%", height: "5rem", background: "linear-gradient(#000a, #0000)", position: "absolute", left: "20%", top: "48%", filter: "blur(0.6rem)", borderRadius: "0 0 100% 100%", opacity: active ? 0.8 : 0.1, transition: "opacity 0.35s ease" }} />
        </div>
      </div>

      {/* Rarity badge */}
      {item.rarity !== "Common" && (
        <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "3px 10px", fontSize: "0.64rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>
          {item.rarity.toUpperCase()}
        </div>
      )}

      {/* Item icon */}
      <div style={{
        position: "absolute", top: "1.4rem", left: 0, right: 0, display: "flex", justifyContent: "center",
        filter: active ? "drop-shadow(0 -8px 12px rgba(255,255,255,0.35)) brightness(1.5)" : "none",
        transition: "filter 0.35s ease",
      }}>
        <item.Svg />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#fff", marginBottom: 3 }}>{item.name}</div>
        <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.38)", marginBottom: 6, fontWeight: 500 }}>{item.type}</div>
        <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5, marginBottom: "0.75rem", borderBottom: "0.5px solid rgba(255,255,255,0.07)", paddingBottom: "0.6rem" }}>{item.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>{item.price.toLocaleString()} Gold</span>
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
            <button style={{ background: "#fff", color: "#000", border: "none", borderRadius: 999, padding: "5px 14px", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Nav />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <section style={{ padding: "44px 0 48px" }}>
          <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Astral Shop</div>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.04em" }}>Weapons & Items</h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Gear up for battle. Toggle the glow switch on each card to preview its power.</p>
          </div>

          <div className="animate-fade-in-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
            {items.map(item => <ItemCard key={item.name} item={item} />)}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
