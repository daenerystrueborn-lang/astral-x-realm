import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CoinIcon, CrownIcon, CheckIcon, GemIcon, BoltIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";

const goldPackages = [
  { amount: "1,000", bonus: null, price: "$0.99", Icon: CoinIcon, popular: false, tag: null },
  { amount: "5,000", bonus: "+500 Bonus Gold", price: "$3.99", Icon: CoinIcon, popular: false, tag: "10% Bonus" },
  { amount: "15,000", bonus: "+2,000 Bonus Gold", price: "$9.99", Icon: GemIcon, popular: true, tag: "Best Value" },
  { amount: "50,000", bonus: "+10,000 Bonus Gold", price: "$24.99", Icon: GemIcon, popular: false, tag: "20% Bonus" },
];

const premiumTiers = [
  { name: "Basic", price: "$2.99", period: "/mo", highlight: false, color: "rgba(255,255,255,0.7)", perks: ["200 Gold/day", "Custom profile badge", "2× XP on weekends", "Access to Basic quests"] },
  { name: "Pro",   price: "$6.99", period: "/mo", highlight: true, color: "#fff", perks: ["Everything in Basic", "600 Gold/day", "3 exclusive cards/mo", "Pro PvP bracket access", "Daily dungeon raid ticket"] },
  { name: "Elite", price: "$12.99", period: "/mo", highlight: false, color: "rgba(255,255,255,0.7)", perks: ["Everything in Pro", "1,500 Gold/day", "5 exclusive cards/mo", "Priority support", "Exclusive cosmetic frames", "Early feature access"] },
];

const faq = [
  { q: "When will Gold appear in my account?", a: "Gold is credited instantly after successful payment confirmation via your Discord tag." },
  { q: "Can I use Gold across multiple servers?", a: "Yes — your Gold balance is linked to your Astral X Realm account, not to a specific server." },
  { q: "Is Premium a subscription?", a: "Yes, Premium renews monthly. You can cancel anytime with no extra fees." },
  { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards, PayPal, and Discord Nitro gift cards." },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{children}</div>
  );
}

export default function Topup() {
  const [selected, setSelected] = useState<number | null>(2);
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
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", marginBottom: 10 }}>Add Gold or Premium</h1>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.38)", maxWidth: 480, lineHeight: 1.7 }}>Fuel your adventure. All purchases are linked to your Discord account and credited instantly.</p>
          </div>

          {/* ── Gold Packages ── */}
          <div className="animate-fade-in-up delay-1" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <CoinIcon size={15} color="rgba(255,255,255,0.45)" />
            <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Gold Packages</h2>
          </div>

          <div className="animate-fade-in-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 56 }}>
            {goldPackages.map((pkg, i) => (
              <div key={i} onClick={() => setSelected(i)} style={{
                background: selected === i ? "rgba(255,255,255,0.05)" : "rgba(10,10,10,0.85)",
                border: selected === i ? "0.5px solid rgba(255,255,255,0.5)" : "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 18, padding: "22px 20px", cursor: "pointer",
                transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                boxShadow: selected === i ? "0 0 40px rgba(255,255,255,0.05)" : "none",
                transform: selected === i ? "translateY(-3px)" : "translateY(0)",
                position: "relative", backdropFilter: "blur(10px)",
              }}>
                {pkg.popular && <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#000", borderRadius: 999, padding: "3px 12px", fontSize: "0.66rem", fontWeight: 700, whiteSpace: "nowrap" }}>Most Popular</span>}
                {pkg.tag && !pkg.popular && <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "2px 9px", fontSize: "0.64rem", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{pkg.tag}</span>}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <pkg.Icon size={19} color="rgba(255,255,255,0.75)" />
                  </div>
                  {selected === i && (
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(255,255,255,0.4)" }}>
                      <CheckIcon size={11} color="#000" />
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{pkg.amount} Gold</div>
                  {pkg.bonus && <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.42)", marginTop: 3 }}>{pkg.bonus}</div>}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff" }}>{pkg.price}</span>
                  <button onClick={e => { e.stopPropagation(); setSelected(i); }} style={{
                    background: selected === i ? "#fff" : "transparent",
                    color: selected === i ? "#000" : "rgba(255,255,255,0.55)",
                    border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 999,
                    padding: "6px 18px", fontSize: "0.78rem", fontWeight: 700,
                    cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.2s",
                  }}>{selected === i ? "Selected" : "Select"}</button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Premium Plans ── */}
          <div className="animate-fade-in-up delay-1" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <CrownIcon size={15} color="rgba(255,255,255,0.45)" />
            <h2 style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Premium Plans</h2>
          </div>

          <div className="animate-fade-in-up delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, marginBottom: 56 }}>
            {premiumTiers.map(tier => (
              <div key={tier.name} style={{
                background: "rgba(10,10,10,0.85)", border: tier.highlight ? "0.5px solid rgba(255,255,255,0.45)" : "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 20, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 18,
                position: "relative", backdropFilter: "blur(10px)",
                boxShadow: tier.highlight ? "0 0 50px rgba(255,255,255,0.04)" : "none",
                transition: "border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                {tier.highlight && <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#000", borderRadius: 999, padding: "3px 14px", fontSize: "0.67rem", fontWeight: 700, whiteSpace: "nowrap" }}>Most Popular</span>}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <CrownIcon size={14} color={tier.color} />
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: tier.color }}>{tier.name}</span>
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {tier.price}<span style={{ fontSize: "0.78rem", fontWeight: 400, color: "rgba(255,255,255,0.35)" }}>{tier.period}</span>
                  </div>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                  {tier.perks.map(p => (
                    <li key={p} style={{ fontSize: "0.81rem", color: "rgba(255,255,255,0.5)", display: "flex", gap: 8, alignItems: "flex-start", lineHeight: 1.45 }}>
                      <span style={{ flexShrink: 0, marginTop: 2 }}><CheckIcon size={11} color="rgba(255,255,255,0.7)" /></span>{p}
                    </li>
                  ))}
                </ul>
                <button style={{ background: tier.highlight ? "#fff" : "transparent", color: tier.highlight ? "#000" : "#fff", border: "0.5px solid rgba(255,255,255,0.22)", borderRadius: 12, padding: "11px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
                  Get {tier.name}
                </button>
              </div>
            ))}
          </div>

          {/* ── Checkout CTA ── */}
          <div className="animate-fade-in-up delay-2" style={{ background: "rgba(10,10,10,0.85)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "32px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 56, backdropFilter: "blur(12px)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <BoltIcon size={16} color="rgba(255,255,255,0.8)" />
                <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>Ready to Proceed?</h2>
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.6, maxWidth: 380 }}>
                {selected !== null ? `You selected ${goldPackages[selected].amount} Gold for ${goldPackages[selected].price}. Sign in or create an account to complete your purchase.` : "Select a Gold package above, then sign in to complete your purchase."}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={openSignup} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
                Sign in to Purchase
              </button>
            </div>
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
