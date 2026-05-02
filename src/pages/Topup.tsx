import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CoinIcon, CrownIcon, CheckIcon, GemIcon, BoltIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";

// ── Real packages from bot config (config.js → topup section) ──
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

// Account details from bot config
const ACCOUNT = {
  name:   "Flora",
  number: "5197434428",
  bank:   "Moniepoint",
};

const faq = [
  { q: "When will my Solars or Gems appear in-game?", a: "All top-ups are processed manually. After payment, send proof to the owner on WhatsApp. Credits are added within minutes." },
  { q: "Which account do I pay to?", a: `Pay to ${ACCOUNT.name} · ${ACCOUNT.bank} · ${ACCOUNT.number}. Send proof of payment to receive your credits.` },
  { q: "Can I use Solars across multiple platforms?", a: "Yes — your balance is tied to your Astral X Realm player account, not to a specific group or server." },
  { q: "Are gem packages one-time or recurring?", a: "All packages are one-time purchases. You receive the exact gems or Solars listed." },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{children}</div>
  );
}

export default function Topup() {
  const [selectedGold, setSelectedGold] = useState<number | null>(1);
  const [selectedGem, setSelectedGem] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { openSignup } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      <Nav />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <section style={{ padding: "44px 0 20px" }}>

          {/* Header */}
          <div className="animate-fade-in-up" style={{ marginBottom: 44 }}>
            <SectionLabel>Top Up</SectionLabel>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", marginBottom: 10 }}>Add Solars or Gems</h1>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.38)", maxWidth: 520, lineHeight: 1.7 }}>
              Fuel your adventure. Pay to <strong style={{ color: "rgba(255,255,255,0.65)" }}>{ACCOUNT.name}</strong> · {ACCOUNT.bank} · <strong style={{ color: "rgba(255,255,255,0.65)" }}>{ACCOUNT.number}</strong>, then send proof to receive your credits.
            </p>
          </div>

          {/* ── Solar Packages ── */}
          <div className="animate-fade-in-up delay-1" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <CoinIcon size={15} color="rgba(255,255,255,0.45)" />
            <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Solar Packages</h2>
          </div>

          <div className="animate-fade-in-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 52 }}>
            {goldPackages.map((pkg, i) => {
              const isSel = selectedGold === i;
              const isPopular = pkg.id === "iron";
              return (
                <div key={pkg.id} onClick={() => setSelectedGold(i)} style={{
                  background: isSel ? "rgba(255,255,255,0.05)" : "rgba(10,10,10,0.85)",
                  border: isSel ? "0.5px solid rgba(255,255,255,0.5)" : "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 18, padding: "22px 20px", cursor: "pointer",
                  transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                  boxShadow: isSel ? "0 0 40px rgba(255,255,255,0.05)" : "none",
                  transform: isSel ? "translateY(-3px)" : "translateY(0)",
                  position: "relative", backdropFilter: "blur(10px)",
                }}>
                  {isPopular && <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#000", borderRadius: 999, padding: "3px 12px", fontSize: "0.66rem", fontWeight: 700, whiteSpace: "nowrap" }}>Most Popular</span>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>☀️</div>
                    {isSel && (
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckIcon size={11} color="#000" />
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{pkg.name}</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{pkg.Solars.toLocaleString()} ☀️</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>₦{pkg.naira.toLocaleString()}</span>
                    <button onClick={e => { e.stopPropagation(); setSelectedGold(i); }} style={{
                      background: isSel ? "#fff" : "transparent",
                      color: isSel ? "#000" : "rgba(255,255,255,0.55)",
                      border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 999,
                      padding: "6px 16px", fontSize: "0.76rem", fontWeight: 700,
                      cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.2s",
                    }}>{isSel ? "Selected" : "Select"}</button>
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

          <div className="animate-fade-in-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 12, marginBottom: 52 }}>
            {gemPackages.map((pkg, i) => {
              const isSel = selectedGem === i;
              const isPopular = pkg.id === "nova";
              return (
                <div key={pkg.id} onClick={() => setSelectedGem(i)} style={{
                  background: isSel ? "rgba(255,255,255,0.05)" : "rgba(10,10,10,0.85)",
                  border: isSel ? "0.5px solid rgba(255,255,255,0.5)" : "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 18, padding: "20px 18px", cursor: "pointer",
                  transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                  boxShadow: isSel ? "0 0 40px rgba(255,255,255,0.05)" : "none",
                  transform: isSel ? "translateY(-3px)" : "translateY(0)",
                  position: "relative", backdropFilter: "blur(10px)",
                }}>
                  {isPopular && <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#000", borderRadius: 999, padding: "3px 12px", fontSize: "0.66rem", fontWeight: 700, whiteSpace: "nowrap" }}>Best Value</span>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontSize: "1.6rem" }}>{pkg.emoji}</div>
                    {isSel && (
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckIcon size={10} color="#000" />
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{pkg.name}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{pkg.gems} 💎 Gems</div>
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: "#fff" }}>₦{pkg.naira.toLocaleString()}</span>
                    <button onClick={e => { e.stopPropagation(); setSelectedGem(i); }} style={{
                      background: isSel ? "#fff" : "transparent",
                      color: isSel ? "#000" : "rgba(255,255,255,0.55)",
                      border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 999,
                      padding: "5px 14px", fontSize: "0.74rem", fontWeight: 700,
                      cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.2s",
                    }}>{isSel ? "✓" : "Select"}</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Checkout CTA ── */}
          <div className="animate-fade-in-up delay-2" style={{ background: "rgba(10,10,10,0.85)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 52, backdropFilter: "blur(12px)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <BoltIcon size={16} color="rgba(255,255,255,0.8)" />
                <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>How to Top Up</h2>
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 420 }}>
                {selectedGold !== null
                  ? `Selected: ${goldPackages[selectedGold].Solars.toLocaleString()} Solars for ₦${goldPackages[selectedGold].naira.toLocaleString()}.`
                  : selectedGem !== null
                    ? `Selected: ${gemPackages[selectedGem].gems} Gems for ₦${gemPackages[selectedGem].naira.toLocaleString()}.`
                    : "Pick a package above, then pay to the account below and send proof."
                }
                {" "}Pay to <strong style={{ color: "rgba(255,255,255,0.65)" }}>{ACCOUNT.name} · {ACCOUNT.bank} · {ACCOUNT.number}</strong>. Credits are added after proof is confirmed.
              </p>
            </div>
            <button onClick={openSignup} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap" }}>
              Create Account First
            </button>
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
      <Footer />
    </div>
  );
}
