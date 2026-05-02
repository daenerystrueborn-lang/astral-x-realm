import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GlowCard from "@/components/GlowCard";

type Rarity = "Common" | "Rare" | "Legendary";

// Build a Pollinations AI image URL for a card/monster
function cardImageUrl(name: string, element: string, rarity: Rarity): string {
  const rarityTag =
    rarity === "Legendary" ? "legendary, glowing, epic" :
    rarity === "Rare" ? "rare, powerful, detailed" : "fantasy creature";
  const prompt = `${name}, ${element} element dark fantasy monster card art, ${rarityTag}, dramatic lighting, digital painting, no text, no watermark, black background`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=300&height=300&nologo=true&model=flux&seed=${hashStr(name)}`;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 9999;
}

interface CardDef {
  name: string;
  rarity: Rarity;
  power: number;
  element: string;
  subtitle: string;
}

const allCards: CardDef[] = [
  // Common
  { name: "Iron Golem",       rarity: "Common",    power: 120, element: "Earth",     subtitle: "Earth Guardian" },
  { name: "Wind Sprite",      rarity: "Common",    power: 95,  element: "Wind",      subtitle: "Air Dancer" },
  { name: "Stone Drake",      rarity: "Common",    power: 140, element: "Earth",     subtitle: "Rocky Beast" },
  { name: "Frost Imp",        rarity: "Common",    power: 88,  element: "Ice",       subtitle: "Ice Trickster" },
  { name: "Goblin Shaman",    rarity: "Common",    power: 105, element: "Dark",      subtitle: "Cursed Caster" },
  { name: "Flame Imp",        rarity: "Common",    power: 98,  element: "Fire",      subtitle: "Fire Starter" },
  { name: "Moss Troll",       rarity: "Common",    power: 155, element: "Earth",     subtitle: "Forest Brute" },
  { name: "Skeleton Warrior", rarity: "Common",    power: 110, element: "Dark",      subtitle: "Undead Soldier" },
  // Rare
  { name: "Shadow Wolf",      rarity: "Rare",      power: 280, element: "Dark",      subtitle: "Void Hunter" },
  { name: "Thunder Hawk",     rarity: "Rare",      power: 310, element: "Lightning", subtitle: "Storm Rider" },
  { name: "Ember Fox",        rarity: "Rare",      power: 265, element: "Fire",      subtitle: "Flame Runner" },
  { name: "Tidal Serpent",    rarity: "Rare",      power: 295, element: "Water",     subtitle: "Sea Beast" },
  { name: "Chain Devil",      rarity: "Rare",      power: 320, element: "Dark",      subtitle: "Bound Tormentor" },
  { name: "Hellhound Alpha",  rarity: "Rare",      power: 305, element: "Fire",      subtitle: "Pack Leader" },
  { name: "Dire Wolf",        rarity: "Rare",      power: 275, element: "Wind",      subtitle: "Feral Hunter" },
  { name: "Lava Elemental",   rarity: "Rare",      power: 330, element: "Fire",      subtitle: "Molten Core" },
  // Legendary
  { name: "Phantom Wyrm",     rarity: "Legendary", power: 580, element: "Void",      subtitle: "Void · Legendary" },
  { name: "Solar Phoenix",    rarity: "Legendary", power: 650, element: "Fire",      subtitle: "Fire · Legendary" },
  { name: "Abyssal Kraken",   rarity: "Legendary", power: 610, element: "Water",     subtitle: "Dark · Legendary" },
  { name: "Ancient Dragon",   rarity: "Legendary", power: 695, element: "Dragon",    subtitle: "Dragon · Legendary" },
  { name: "Void Titan",       rarity: "Legendary", power: 720, element: "Void",      subtitle: "Abyss · Legendary" },
  { name: "Storm Colossus",   rarity: "Legendary", power: 660, element: "Lightning", subtitle: "Thunder · Legendary" },
];

const filters = ["All", "Common", "Rare", "Legendary"] as const;

export default function Cards() {
  const [filter, setFilter] = useState<typeof filters[number]>("All");
  const [search, setSearch] = useState("");

  const filtered = allCards.filter(c => {
    const matchRarity = filter === "All" || c.rarity === filter;
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.element.toLowerCase().includes(search.toLowerCase());
    return matchRarity && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Nav />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <section style={{ padding: "48px 0 32px" }}>
          <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Bestiary</div>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.03em" }}>Card Collection</h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
              Discover powerful cards from across the realm. Toggle the switch to activate each card's glow.
            </p>
          </div>

          <div className="animate-fade-in-up delay-1" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                placeholder="Search cards or element..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", background: "rgba(10,10,10,0.7)",
                  border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 999,
                  padding: "10px 18px 10px 40px", color: "#fff",
                  fontSize: "0.84rem", outline: "none",
                  fontFamily: "Outfit, sans-serif", backdropFilter: "blur(8px)",
                  boxSizing: "border-box",
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
                  borderRadius: 999, padding: "8px 16px",
                  fontSize: "0.79rem", fontWeight: filter === f ? 700 : 500,
                  cursor: "pointer", fontFamily: "Outfit, sans-serif",
                  transition: "all 0.2s", backdropFilter: "blur(8px)",
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
                icon={<span style={{ fontSize: 48 }}>✨</span>}
                imageUrl={cardImageUrl(card.name, card.element, card.rarity)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              No cards found matching your search.
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
