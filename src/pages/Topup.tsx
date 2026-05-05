import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CoinIcon, CrownIcon, GemIcon, BoltIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";

const WA_BASE = "https://api.whatsapp.com/send?phone=2347037166815&text=";

type Tab = "solar" | "gems" | "premium";

const gemPackages = [
  { id: "spark",   name: "Spark",   emoji: "✨", gems: 50,   naira: 150,  popular: false, desc: "Perfect for a quick gem boost to get started." },
  { id: "flare",   name: "Flare",   emoji: "💫", gems: 100,  naira: 300,  popular: false, desc: "A solid stack to unlock cosmetics and bonuses." },
  { id: "blaze",   name: "Blaze",   emoji: "🔥", gems: 250,  naira: 650,  popular: false, desc: "Great for active players grinding daily events." },
  { id: "nova",    name: "Nova",    emoji: "🌟", gems: 500,  naira: 1000, popular: true,  desc: "Best value — stock up for weeks of gameplay." },
  { id: "cosmic",  name: "Cosmic",  emoji: "🌌", gems: 1300, naira: 2500, popular: false, desc: "For serious collectors and top-tier players." },
];

const goldPackages = [
  { id: "copper",    name: "Copper",    Solars: 100000,  naira: 500,  popular: false, desc: "A light top-up to stay competitive." },
  { id: "iron",      name: "Iron",      Solars: 220000,  naira: 1000, popular: false, desc: "Solid reserve for trading and upgrades." },
  { id: "steel",     name: "Steel",     Solars: 380000,  naira: 1500, popular: false, desc: "Power your forge and market plays." },
  { id: "crown",     name: "Crown",     Solars: 600000,  naira: 2000, popular: true,  desc: "Most popular — best balance of value and volume." },
  { id: "throne",    name: "Throne",    Solars: 900000,  naira: 3000, popular: false, desc: "Dominate the in-game economy and guild wars." },
  { id: "legendary", name: "Legendary", Solars: 2000000, naira: 5000, popular: false, desc: "Maximum firepower for legendary players only." },
];

const premiumPackages = [
  { id: "weekly",   name: "Weekly Pass",  duration: "7 days",   naira: 500,  popular: false, perks: ["2× XP boost", "Exclusive title", "Daily gem bonus"] },
  { id: "monthly",  name: "Monthly Pass", duration: "30 days",  naira: 1500, popular: true,  perks: ["3× XP boost", "Premium badge", "Daily gem + solar bonus", "Early access to events"] },
  { id: "lifetime", name: "Lifetime",     duration: "Forever",  naira: 8000, popular: false, perks: ["Permanent 2× XP", "Legendary title", "VIP support", "Exclusive cosmetics"] },
];

const faq = [
  { q: "When will my Solars or Gems appear in-game?", a: "All top-ups are processed manually. After clicking Buy, message the owner on WhatsApp with proof of payment. Credits are added within minutes." },
  { q: "How do I pay?", a: "Click the Buy button on any package — it will open WhatsApp with a pre-filled message. Pay to the account shared privately, then send your proof of payment screenshot." },
  { q: "Can I use Solars across multiple platforms?", a: "Yes — your balance is tied to your Astral X Realm player account, not to a specific group or server." },
  { q: "Are gem packages one-time or recurring?", a: "All packages are one-time purchases. You receive the exact gems or Solars listed." },
  { q: "Is my payment info safe?", a: "Yes. Account details are never displayed publicly. They are shared privately through WhatsApp after you initiate a purchase." },
];

function BuyButton({ waText, label, gold }: { waText: string; label?: string; gold?: boolean }) {
  const url = WA_BASE + encodeURIComponent(waText);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        width: "100%",
        background: gold ? "linear-gradient(135deg, #d4a843 0%, #f0c96e 50%, #c8922a 100%)" : "rgba(255,255,255,0.08)",
        color: gold ? "#000" : "#fff",
        border: gold ? "none" : "0.5px solid rgba(255,255,255,0.15)",
        borderRadius: 10,
        padding: "11px 18px",
        fontSize: "0.82rem",
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "Outfit, sans-serif",
        textDecoration: "none",
        transition: "opacity 0.15s, transform 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.02)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.524 5.847L.057 23.882l6.197-1.624A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.51-5.18-1.402l-.37-.22-3.679.964.981-3.585-.241-.371A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
      {label || "Get started"}
    </a>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke="rgba(212,168,67,0.6)" strokeWidth="0.8" />
      <path d="M4 7l2 2 4-4" stroke="#d4a843" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Pricing() {
  const [tab, setTab] = useState<Tab>("solar");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { openSignup, player } = useAuth();

  const tabs: { id: Tab; label: string; Icon: typeof CoinIcon }[] = [
    { id: "solar", label: "Solar Packages", Icon: CoinIcon },
    { id: "gems", label: "Gem Packages", Icon: GemIcon },
    { id: "premium", label: "Premium Passes", Icon: CrownIcon },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <div style={{ position: "relative", zIndex: 10 }}><Nav /></div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
        <section style={{ padding: "52px 0 20px", textAlign: "center" }}>

          {/* Header */}
          <div className="animate-fade-in-up">
            <div style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.05)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "5px 18px",
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 22,
            }}>Pricing</div>

            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 16,
              maxWidth: 700,
              margin: "0 auto 16px",
            }}>
              Power Up Your Astral X Realm Experience
            </h1>
            <p style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.38)",
              maxWidth: 460,
              margin: "0 auto 40px",
              lineHeight: 1.75,
            }}>
              Choose your package and tap <strong style={{ color: "rgba(255,255,255,0.6)" }}>Get started</strong> — WhatsApp opens with your order ready. Credits added in minutes.
            </p>
          </div>

          {/* Tab selector */}
          <div className="animate-fade-in-up delay-1" style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: 4,
            gap: 2,
            marginBottom: 52,
          }}>
            {tabs.map(t => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: active ? "rgba(255,255,255,0.1)" : "transparent",
                    border: active ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid transparent",
                    borderRadius: 9,
                    padding: "8px 18px",
                    color: active ? "#fff" : "rgba(255,255,255,0.45)",
                    fontSize: "0.8rem",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    fontFamily: "Outfit, sans-serif",
                    transition: "all 0.18s",
                    whiteSpace: "nowrap",
                  }}
                >
                  <t.Icon size={13} color={active ? "#fff" : "rgba(255,255,255,0.38)"} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* ── Solar Packages ── */}
          {tab === "solar" && (
            <div className="animate-fade-in-up delay-2">
              <div className="pricing-scroll-track">
                {goldPackages.map((pkg, idx) => {
                  const centerIdx = Math.floor(goldPackages.length / 2);
                  const isPopular = pkg.popular;
                  const waText = `!topup solar ${pkg.id}`;
                  return (
                    <div
                      key={pkg.id}
                      className={`pricing-card${isPopular ? " pricing-card--featured" : ""}`}
                      style={{
                        flexShrink: 0,
                        width: 260,
                        background: isPopular ? "rgba(18,14,10,0.98)" : "rgba(12,12,12,0.9)",
                        border: isPopular ? "1px solid rgba(212,168,67,0.5)" : "0.5px solid rgba(255,255,255,0.08)",
                        borderRadius: 20,
                        padding: "28px 24px",
                        position: "relative",
                        boxShadow: isPopular ? "0 0 60px rgba(212,168,67,0.12), 0 24px 64px rgba(0,0,0,0.8)" : "0 12px 40px rgba(0,0,0,0.6)",
                        transform: isPopular ? "translateY(-16px) scale(1.04)" : "translateY(0) scale(1)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        scrollSnapAlign: "center",
                        textAlign: "left",
                      }}
                    >
                      {isPopular && (
                        <div style={{
                          position: "absolute",
                          top: -12,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "linear-gradient(135deg, #d4a843, #f0c96e)",
                          color: "#000",
                          borderRadius: 999,
                          padding: "4px 14px",
                          fontSize: "0.66rem",
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                          letterSpacing: "0.06em",
                        }}>Most Popular</div>
                      )}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: "1rem", fontWeight: 700, color: isPopular ? "rgba(212,168,67,0.9)" : "rgba(255,255,255,0.7)", marginBottom: 4 }}>{pkg.name}</div>
                        <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>
                          ₦{pkg.naira.toLocaleString()}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginTop: 8, lineHeight: 1.5 }}>{pkg.desc}</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px", marginBottom: 20 }}>
                        <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>You receive</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>☀️ {pkg.Solars.toLocaleString()} Solars</div>
                      </div>
                      <BuyButton waText={waText} gold={isPopular} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Gem Packages ── */}
          {tab === "gems" && (
            <div className="animate-fade-in-up delay-2">
              <div className="pricing-scroll-track">
                {gemPackages.map((pkg) => {
                  const isPopular = pkg.popular;
                  const waText = `!topup gems ${pkg.id}`;
                  return (
                    <div
                      key={pkg.id}
                      className={`pricing-card${isPopular ? " pricing-card--featured" : ""}`}
                      style={{
                        flexShrink: 0,
                        width: 240,
                        background: isPopular ? "rgba(18,14,10,0.98)" : "rgba(12,12,12,0.9)",
                        border: isPopular ? "1px solid rgba(212,168,67,0.5)" : "0.5px solid rgba(255,255,255,0.08)",
                        borderRadius: 20,
                        padding: "28px 22px",
                        position: "relative",
                        boxShadow: isPopular ? "0 0 60px rgba(212,168,67,0.12), 0 24px 64px rgba(0,0,0,0.8)" : "0 12px 40px rgba(0,0,0,0.6)",
                        transform: isPopular ? "translateY(-16px) scale(1.04)" : "translateY(0) scale(1)",
                        transition: "transform 0.2s",
                        scrollSnapAlign: "center",
                        textAlign: "left",
                      }}
                    >
                      {isPopular && (
                        <div style={{
                          position: "absolute",
                          top: -12,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "linear-gradient(135deg, #d4a843, #f0c96e)",
                          color: "#000",
                          borderRadius: 999,
                          padding: "4px 14px",
                          fontSize: "0.66rem",
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                          letterSpacing: "0.06em",
                        }}>Best Value</div>
                      )}
                      <div style={{ fontSize: "2.2rem", marginBottom: 14 }}>{pkg.emoji}</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: isPopular ? "rgba(212,168,67,0.9)" : "rgba(255,255,255,0.7)", marginBottom: 4 }}>{pkg.name}</div>
                      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>
                        ₦{pkg.naira.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginBottom: 20, lineHeight: 1.5 }}>{pkg.desc}</div>
                      <div style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px", marginBottom: 20 }}>
                        <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>You receive</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>💎 {pkg.gems} Gems</div>
                      </div>
                      <BuyButton waText={waText} gold={isPopular} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Premium Packages ── */}
          {tab === "premium" && (
            <div className="animate-fade-in-up delay-2">
              <div className="pricing-scroll-track">
                {premiumPackages.map((pkg) => {
                  const isPopular = pkg.popular;
                  const waText = `!premium ${pkg.id}`;
                  return (
                    <div
                      key={pkg.id}
                      className={`pricing-card${isPopular ? " pricing-card--featured" : ""}`}
                      style={{
                        flexShrink: 0,
                        width: 270,
                        background: isPopular ? "rgba(18,14,10,0.98)" : "rgba(12,12,12,0.9)",
                        border: isPopular ? "1px solid rgba(212,168,67,0.5)" : "0.5px solid rgba(255,255,255,0.08)",
                        borderRadius: 20,
                        padding: "28px 24px",
                        position: "relative",
                        boxShadow: isPopular ? "0 0 60px rgba(212,168,67,0.12), 0 24px 64px rgba(0,0,0,0.8)" : "0 12px 40px rgba(0,0,0,0.6)",
                        transform: isPopular ? "translateY(-16px) scale(1.04)" : "translateY(0) scale(1)",
                        transition: "transform 0.2s",
                        scrollSnapAlign: "center",
                        textAlign: "left",
                      }}
                    >
                      {isPopular && (
                        <div style={{
                          position: "absolute",
                          top: -12,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "linear-gradient(135deg, #d4a843, #f0c96e)",
                          color: "#000",
                          borderRadius: 999,
                          padding: "4px 14px",
                          fontSize: "0.66rem",
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                          letterSpacing: "0.06em",
                        }}>Recommended</div>
                      )}
                      <div style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{pkg.duration}</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: isPopular ? "rgba(212,168,67,0.9)" : "#fff", letterSpacing: "-0.02em" }}>{pkg.name}</div>
                      </div>
                      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: "14px 0 20px" }}>
                        ₦{pkg.naira.toLocaleString()}
                      </div>

                      <div style={{ marginBottom: 6, fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Features</div>
                      <div style={{ width: "100%", height: "0.5px", background: "rgba(255,255,255,0.07)", marginBottom: 14 }} />

                      <ul style={{ listStyle: "none", margin: "0 0 22px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {pkg.perks.map((perk, pi) => (
                          <li key={pi} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: "0.82rem", color: "rgba(255,255,255,0.65)" }}>
                            <CheckIcon />
                            {perk}
                          </li>
                        ))}
                      </ul>
                      <BuyButton waText={waText} gold={isPopular} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="animate-fade-in-up delay-3" style={{
            background: "rgba(10,10,10,0.85)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 52,
            backdropFilter: "blur(12px)",
            textAlign: "left",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <BoltIcon size={16} color="rgba(255,255,255,0.8)" />
                <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>How it works</h2>
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 420 }}>
                Click <strong style={{ color: "rgba(255,255,255,0.6)" }}>Get started</strong> on any package → WhatsApp opens with your order → Pay privately → Send proof → Credits added in minutes.
              </p>
            </div>
            {!player && (
              <button onClick={openSignup} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap" }}>
                Create Account First
              </button>
            )}
          </div>

          {/* FAQ */}
          <div className="animate-fade-in-up delay-3" style={{ marginBottom: 60, textAlign: "left" }}>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>FAQ</div>
              <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 1.7rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Common Questions</h2>
            </div>
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
        .pricing-scroll-track {
          display: flex;
          flex-direction: row;
          gap: 16px;
          padding: 24px 20px 40px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          justify-content: center;
          align-items: flex-end;
        }
        .pricing-scroll-track::-webkit-scrollbar { display: none; }
        @media (max-width: 780px) {
          .pricing-scroll-track {
            justify-content: flex-start;
            padding: 24px 16px 40px;
          }
          .pricing-card {
            width: 220px !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}
