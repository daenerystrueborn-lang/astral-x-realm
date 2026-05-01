import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GlowCard from "@/components/GlowCard";

type Rarity = "Common" | "Rare" | "Legendary";

function SwordSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><line x1="8" y1="40" x2="34" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"/><polygon points="34,14 42,10 38,18" stroke={color} strokeWidth="1.5" fill="none"/><line x1="6" y1="42" x2="12" y2="36" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/></svg>;
}
function ShieldSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 6 L40 12 L40 24 C40 34 24 42 24 42 C24 42 8 34 8 24 L8 12 Z" stroke={color} strokeWidth="1.5" fill="none"/><path d="M18 24 L22 28 L30 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/></svg>;
}
function OrbSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1.5"/><ellipse cx="24" cy="24" rx="7" ry="14" stroke={color} strokeWidth="1" opacity="0.6"/><line x1="10" y1="24" x2="38" y2="24" stroke={color} strokeWidth="1" opacity="0.5"/></svg>;
}
function FlamesSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 42 C16 36 10 28 14 20 C16 28 20 30 20 30 C18 24 22 14 24 8 C26 14 28 20 32 22 C28 22 30 30 30 30 C34 28 38 36 24 42Z" stroke={color} strokeWidth="1.5" fill="none"/></svg>;
}
function IceSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><line x1="24" y1="8" x2="24" y2="40" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="24" x2="40" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="13" y1="13" x2="35" y2="35" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/><line x1="35" y1="13" x2="13" y2="35" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/><circle cx="24" cy="24" r="3" stroke={color} strokeWidth="1.2" fill="none"/></svg>;
}
function LightSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="8" stroke={color} strokeWidth="1.5"/>{[0,45,90,135,180,225,270,315].map((a,i)=><line key={i} x1={24+11*Math.cos(a*Math.PI/180)} y1={24+11*Math.sin(a*Math.PI/180)} x2={24+15*Math.cos(a*Math.PI/180)} y2={24+15*Math.sin(a*Math.PI/180)} stroke={color} strokeWidth="1.5" strokeLinecap="round"/>)}</svg>;
}
function VoidSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="12" stroke={color} strokeWidth="1.5"/><circle cx="24" cy="24" r="5" stroke={color} strokeWidth="1" opacity="0.7"/><path d="M24 12 C28 16 36 18 36 24 C36 30 28 32 24 36 C20 32 12 30 12 24 C12 18 20 16 24 12Z" stroke={color} strokeWidth="1" opacity="0.4" fill="none"/></svg>;
}
function DragonSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 8 C18 12 12 18 12 26 C12 34 18 40 24 44 C30 40 36 34 36 26 C36 18 30 12 24 8Z" stroke={color} strokeWidth="1.5" fill="none"/><path d="M24 8 L18 4 M24 8 L30 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/><circle cx="20" cy="20" r="1.5" fill={color} opacity="0.8"/><circle cx="28" cy="20" r="1.5" fill={color} opacity="0.8"/><path d="M20 26 Q24 30 28 26" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none"/></svg>;
}
function ThunderSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><polyline points="28,8 18,26 24,26 20,40 34,22 26,22 28,8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>;
}
function WaterSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 8 C24 8 10 22 10 30 C10 37.7 16.3 44 24 44 C31.7 44 38 37.7 38 30 C38 22 24 8 24 8Z" stroke={color} strokeWidth="1.5" fill="none"/><path d="M18 32 C18 36 21 38 24 38" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/></svg>;
}
function EarthSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><polygon points="24,10 38,20 38,32 24,42 10,32 10,20" stroke={color} strokeWidth="1.5" fill="none"/><line x1="10" y1="20" x2="38" y2="20" stroke={color} strokeWidth="1" opacity="0.4"/><line x1="10" y1="32" x2="38" y2="32" stroke={color} strokeWidth="1" opacity="0.4"/><line x1="24" y1="10" x2="24" y2="42" stroke={color} strokeWidth="1" opacity="0.4"/></svg>;
}
function WindSVG({ color = "rgba(255,255,255,0.7)" }) {
  return <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M10 20 Q24 16 30 20 Q36 24 34 28 Q32 32 28 30" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M10 28 Q22 24 26 28 Q30 32 28 36 Q26 38 22 36" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>;
}

const iconMap: Record<string, React.ReactNode> = {
  Fire: <FlamesSVG />, Water: <WaterSVG />, Earth: <EarthSVG />, Wind: <WindSVG />,
  Lightning: <ThunderSVG />, Ice: <IceSVG />, Dark: <VoidSVG />, Light: <LightSVG />,
  Void: <OrbSVG />, Dragon: <DragonSVG />, Sword: <SwordSVG />, Shield: <ShieldSVG />,
};

const allCards: { name: string; rarity: Rarity; power: number; element: string; subtitle: string }[] = [
  { name: "Iron Golem", rarity: "Common", power: 120, element: "Earth", subtitle: "Earth Guardian" },
  { name: "Wind Sprite", rarity: "Common", power: 95, element: "Wind", subtitle: "Air Dancer" },
  { name: "Stone Drake", rarity: "Common", power: 140, element: "Earth", subtitle: "Rocky Beast" },
  { name: "Frost Imp", rarity: "Common", power: 88, element: "Ice", subtitle: "Ice Trickster" },
  { name: "Shadow Wolf", rarity: "Rare", power: 280, element: "Dark", subtitle: "Void Hunter" },
  { name: "Thunder Hawk", rarity: "Rare", power: 310, element: "Lightning", subtitle: "Storm Rider" },
  { name: "Ember Fox", rarity: "Rare", power: 265, element: "Fire", subtitle: "Flame Runner" },
  { name: "Tidal Serpent", rarity: "Rare", power: 295, element: "Water", subtitle: "Sea Beast" },
  { name: "Phantom Wyrm", rarity: "Legendary", power: 580, element: "Void", subtitle: "Void · Legendary" },
  { name: "Celestial Lion", rarity: "Legendary", power: 620, element: "Light", subtitle: "Light · Legendary" },
  { name: "Abyssal Kraken", rarity: "Legendary", power: 610, element: "Dark", subtitle: "Dark · Legendary" },
  { name: "Solar Phoenix", rarity: "Legendary", power: 650, element: "Fire", subtitle: "Fire · Legendary" },
];

const filters = ["All", "Common", "Rare", "Legendary"] as const;

export default function Cards() {
  const [filter, setFilter] = useState<typeof filters[number]>("All");
  const [search, setSearch] = useState("");

  const filtered = allCards.filter(c => {
    const matchRarity = filter === "All" || c.rarity === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.element.toLowerCase().includes(search.toLowerCase());
    return matchRarity && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Nav />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <section style={{ padding: "48px 0 32px" }}>
          <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.03em" }}>Card Collection</h1>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.4)" }}>Discover powerful cards from across the realm. Toggle the switch to activate each card's glow.</p>
          </div>

          <div className="animate-fade-in-up delay-1" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                placeholder="Search cards..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(10,10,10,0.7)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  borderRadius: 999,
                  padding: "10px 18px 10px 40px",
                  color: "#fff",
                  fontSize: "0.84rem",
                  outline: "none",
                  fontFamily: "Outfit, sans-serif",
                  backdropFilter: "blur(8px)",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? "#fff" : "rgba(10,10,10,0.7)",
                  color: filter === f ? "#000" : "rgba(255,255,255,0.55)",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                  borderRadius: 999,
                  padding: "8px 16px",
                  fontSize: "0.79rem",
                  fontWeight: filter === f ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                  transition: "all 0.2s",
                  backdropFilter: "blur(8px)",
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {filtered.map(card => (
              <GlowCard
                key={card.name}
                name={card.name}
                subtitle={card.subtitle}
                power={card.power}
                rarity={card.rarity}
                element={card.element}
                icon={iconMap[card.element] || <OrbSVG />}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              No cards found matching your search.
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 40 }}>
            {["←", "1", "2", "3", "→"].map((p, i) => (
              <button key={i} style={{
                background: p === "1" ? "#fff" : "rgba(10,10,10,0.7)",
                color: p === "1" ? "#000" : "rgba(255,255,255,0.55)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: 8, width: 36, height: 36,
                fontSize: "0.85rem", cursor: "pointer",
                fontFamily: "Outfit, sans-serif",
                backdropFilter: "blur(8px)",
              }}>{p}</button>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
