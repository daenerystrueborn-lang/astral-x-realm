import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CoinIcon, CrownIcon, CheckIcon, GemIcon, BoltIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";

const WA_BASE = "https://api.whatsapp.com/send?phone=2347037166815&text=";

const gemPackages = [
  { id: "spark",   name: "Spark",   emoji: "✨", gems: 50,   naira: 150  },
  { id: "flare",   name: "Flare",   emoji: "💫", gems: 100,  naira: 300  },
  { id: "blaze",   name: "Blaze",   emoji: "🔥", gems: 250,  naira: 650  },
  { id: "nova",    name: "Nova",    emoji: "🌟", gems: 500,  naira: 1000 },
  { id: "cosmic",  name: "Cosmic",  emoji: "🌌", gems: 1300, naira: 2500 },
];

const goldPackages = [
  { id: "copper",    name: "Copper",    Solars: 100000,  naira: 500   },
  { id: "iron",      name: "Iron",      Solars: 220000,  naira: 1000  },
  { id: "steel",     name: "Steel",     Solars: 380000,  naira: 1500  },
  { id: "crown",     name: "Crown",     Solars: 600000,  naira: 2000  },
  { id: "throne",    name: "Throne",    Solars: 900000,  naira: 3000  },
  { id: "legendary", name: "Legendary", Solars: 2000000, naira: 5000  },
];

const premiumPackages = [
  { id: "weekly",   name: "Weekly Pass",  duration: "7 days",   naira: 500,  perks: ["2× XP boost", "Exclusive title", "Daily gem bonus"] },
  { id: "monthly",  name: "Monthly Pass", duration: "30 days",  naira: 1500, perks: ["3× XP boost", "Premium badge", "Daily gem + solar bonus", "Early access to events"] },
  { id: "lifetime", name: "Lifetime",     duration: "Forever",  naira: 8000, perks: ["Permanent 2× XP", "Legendary title", "VIP support", "Exclusive cosmetics"] },
];

const faq = [
  { q: "When will my Solars or Gems appear in-game?", a: "All top-ups are processed manually. After clicking Buy, message the owner on WhatsApp with proof of payment. Credits are added within minutes." },
  { q: "How do I pay?", a: "Click the Buy button on any package — it will open WhatsApp with a pre-filled message. Pay to the account shared privately, then send your proof of payment screenshot." },
  { q: "Can I use Solars across multiple platforms?", a: "Yes — your balance is tied to your Astral X Realm player account, not to a specific group or server." },
  { q: "Are gem packages one-time or recurring?", a: "All packages are one-time purchases. You receive the exact gems or Solars listed." },
  { q: "Is my payment info safe?", a: "Yes. Account details are never displayed publicly. They are shared privately through WhatsApp after you initiate a purchase." },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{children}</div>
  );
}

function BuyButton({ label, waText, style: extraStyle }: { label?: string; waText: string; style?: React.CSSProperties }) {
  const url = WA_BASE + encodeURIComponent(waText);
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", color: "#000", border: "none", borderRadius: 999, padding: "7px 18px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", textDecoration: "none", whiteSpace: "nowrap", transition: "opacity 0.15s", ...extraStyle }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.524 5.847L.057 23.882l6.197-1.624A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.51-5.18-1.402l-.37-.22-3.679.964.981-3.585-.241-.371A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
      {label || "Buy"}
    </a>
  );
}

export default function Topup() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { openSignup, player } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      <div style={{ position: "relative", zIndex: 10 }}><Nav /></div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <section style={{ padding: "44px 0 20px" }}>

          {/* Header */}
          <div className="animate-fade-in-up" style={{ marginBottom: 44 }}>
            <SectionLabel>Top Up</SectionLabel>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", marginBottom: 10 }}>Add Solars or Gems</h1>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.38)", maxWidth: 520, lineHeight: 1.7 }}>
              Pick a package and tap <strong style={{ color: "rgba(255,255,255,0.6)" }}>Buy</strong> — you'll be taken to WhatsApp to complete your order privately.
            </p>
          </div>

          {/* ── Solar Packages ── */}
          <div className="animate-fade-in-up delay-1" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <CoinIcon size={15} color="rgba(255,255,255,0.45)" />
            <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Solar Packages</h2>
          </div>

          <div className="animate-fade-in-up delay-2" className="topup-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 52 }}>
            {goldPackages.map((pkg) => {
              const isPopular = pkg.id === "iron";
              const waText = `!topup solar ${pkg.id}`;
              return (
                <div key={pkg.id} style={{
                  background: "rgba(10,10,10,0.85)", border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 18, padding: "22px 20px", position: "relative", backdropFilter: "blur(10px)",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {isPopular && <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#000", borderRadius: 999, padding: "3px 12px", fontSize: "0.66rem", fontWeight: 700, whiteSpace: "nowrap" }}>Most Popular</span>}
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", marginBottom: 18 }}>☀️</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{pkg.name}</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>{pkg.Solars.toLocaleString()} Solars</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>₦{pkg.naira.toLocaleString()}</span>
                    <BuyButton waText={waText} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Gem Packages ── */}
          <div className="animate-fade-in-up delay-1" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <GemIcon size={15} color="rgba(255,255,255,0.45)" />
            <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Gem Packages</h2>
          </div>

          <div className="animate-fade-in-up delay-2" className="topup-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 52 }}>
            {gemPackages.map((pkg) => {
              const isPopular = pkg.id === "nova";
              const waText = `!topup gems ${pkg.id}`;
              return (
                <div key={pkg.id} style={{
                  background: "rgba(10,10,10,0.85)", border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 18, padding: "20px 18px", position: "relative", backdropFilter: "blur(10px)",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {isPopular && <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#000", borderRadius: 999, padding: "3px 12px", fontSize: "0.66rem", fontWeight: 700, whiteSpace: "nowrap" }}>Best Value</span>}
                  <div style={{ fontSize: "1.6rem", marginBottom: 14 }}>{pkg.emoji}</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{pkg.name}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: 12 }}>{pkg.gems} 💎 Gems</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: "#fff" }}>₦{pkg.naira.toLocaleString()}</span>
                    <BuyButton waText={waText} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Premium Packages ── */}
          <div className="animate-fade-in-up delay-1" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <CrownIcon size={15} color="rgba(255,255,255,0.45)" />
            <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Premium Passes</h2>
          </div>

          <div className="animate-fade-in-up delay-2" className="topup-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 52 }}>
            {premiumPackages.map((pkg) => {
              const isPopular = pkg.id === "monthly";
              const waText = `!premium ${pkg.id}`;
              return (
                <div key={pkg.id} style={{
                  background: "rgba(10,10,10,0.85)", border: `0.5px solid ${isPopular ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 18, padding: "24px 20px", position: "relative", backdropFilter: "blur(10px)",
                  transition: "border-color 0.2s, transform 0.2s",
                  boxShadow: isPopular ? "0 0 40px rgba(255,255,255,0.04)" : "none",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = isPopular ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {isPopular && <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#000", borderRadius: 999, padding: "3px 12px", fontSize: "0.66rem", fontWeight: 700, whiteSpace: "nowrap" }}>⭐ Recommended</span>}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{pkg.duration}</div>
                    <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{pkg.name}</div>
                  </div>
                  <ul style={{ listStyle: "none", margin: "0 0 18px", padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                    {pkg.perks.map((perk, pi) => (
                      <li key={pi} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", opacity: 0.6, flexShrink: 0 }} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>₦{pkg.naira.toLocaleString()}</span>
                    <BuyButton waText={waText} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── How it works ── */}
          <div className="animate-fade-in-up delay-2" style={{ background: "rgba(10,10,10,0.85)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 52, backdropFilter: "blur(12px)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <BoltIcon size={16} color="rgba(255,255,255,0.8)" />
                <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>How it works</h2>
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 420 }}>
                Click <strong style={{ color: "rgba(255,255,255,0.6)" }}>Buy</strong> on any package → WhatsApp opens with your order → Pay privately → Send proof → Credits added in minutes.
              </p>
            </div>
            {!player && (
              <button onClick={openSignup} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap" }}>
                Create Account First
              </button>
            )}
          </div>

          {/* ── FAQ ── */}
          <div className="animate-fade-in-up delay-3" style={{ marginBottom: 44 }}>
            <SectionLabel>FAQ</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 1.7rem)", fontWeight: 800, color: "#fff", marginBottom: 20, letterSpacing: "-0.03em" }}>Common Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {faq.map((f, i) => (
                <div key={i} style={{ background: "rgba(10,10,10,0.85)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden", backdropFilter: "blur(8px)", transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#fff", textAlign: "left", fontFamily: "Outfit, sans-serif" }}>{f.q}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                      <polyline points="2,4 7,9 12,4" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 22px 16px", fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>{f.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>
      <style>{`
        .topup-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 720px) {
          .topup-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 420px) {
          .topup-grid { grid-template-columns: 1fr !important; }
        }
      \`}</style>
      <Footer />
    </div>
  );
}
