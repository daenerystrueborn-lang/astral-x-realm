import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CoinIcon, CrownIcon, GemIcon, BoltIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";

interface Plan {
  id: string;
  label: string;
  solars: number;
  gems: number;
  bonusSolars: number;
  bonusGems: number;
  priceUSD: number;
  popular?: boolean;
  legend?: boolean;
}

const PLANS: Plan[] = [
  { id: "starter",  label: "Starter",   solars: 500,    gems: 5,   bonusSolars: 0,    bonusGems: 0,  priceUSD: 0.99  },
  { id: "warrior",  label: "Warrior",   solars: 1500,   gems: 15,  bonusSolars: 200,  bonusGems: 2,  priceUSD: 2.99  },
  { id: "champion", label: "Champion",  solars: 4000,   gems: 40,  bonusSolars: 800,  bonusGems: 5,  priceUSD: 6.99,  popular: true },
  { id: "elite",    label: "Elite",     solars: 9000,   gems: 90,  bonusSolars: 2000, bonusGems: 12, priceUSD: 14.99 },
  { id: "legend",   label: "Legend",    solars: 22000,  gems: 220, bonusSolars: 6000, bonusGems: 30, priceUSD: 34.99, legend: true },
  { id: "god",      label: "Godlike",   solars: 55000,  gems: 550, bonusSolars: 18000, bonusGems: 80, priceUSD: 84.99 },
];

/* Row 1: Warrior | Legend (gold centre) | Elite
   Row 2: Starter  | Champion            | Godlike */
const PLANS_ROW1: Plan[] = [
  PLANS.find(p => p.id === "warrior")!,
  PLANS.find(p => p.id === "legend")!,
  PLANS.find(p => p.id === "elite")!,
];
const PLANS_ROW2: Plan[] = [
  PLANS.find(p => p.id === "starter")!,
  PLANS.find(p => p.id === "champion")!,
  PLANS.find(p => p.id === "god")!,
];

const perks = [
  { Icon: CoinIcon,  color: "#fbbf24", heading: "Solars",        body: "Primary in-game currency. Buy gear, potions, and upgrades from the shop." },
  { Icon: GemIcon,   color: "#c084fc", heading: "Gems",          body: "Premium crystal. Unlock exclusive items, fast-track progression, and guild boosts." },
  { Icon: BoltIcon,  color: "#22d3ee", heading: "Instant Credit",body: "Funds appear on your account the moment your payment clears." },
  { Icon: CrownIcon, color: "#fbbf24", heading: "Season Bonus",  body: "Every package grants bonus Season Pass XP to unlock exclusive seasonal rewards." },
];

const FAQ = [
  { q: "How do I receive my Solars?",          a: "After payment confirmation, Solars are credited automatically to the account matching your registered username." },
  { q: "Which payment methods are accepted?",  a: "Credit/debit cards, PayPal, and regional gateways are supported via our secure payment partner." },
  { q: "Are purchases refundable?",             a: "Purchases are non-refundable once consumed. Contact support within 24 hours for technical issues." },
  { q: "Can I buy for another player?",         a: "Yes — select 'Gift to another player' at checkout and enter their in-game username." },
  { q: "What are the Gems used for?",           a: "Gems unlock exclusive cosmetics, rare cards, and premium stat boosts not available for Solars." },
];

function PlanCard({ plan }: { plan: Plan }) {
  const [hov, setHov] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { player, openLogin } = useAuth();
  const totalSolars = plan.solars + plan.bonusSolars;
  const totalGems   = plan.gems  + plan.bonusGems;
  const accent = plan.legend ? "#fbbf24" : plan.popular ? "#a78bfa" : "rgba(255,255,255,0.2)";

  function handleBuy() {
    if (!player) { openLogin(); return; }
    setConfirmOpen(true);
  }

  return (
    <>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
          background: plan.legend
            ? "radial-gradient(circle at 50% 0%, rgba(251,191,36,0.1) 0%, rgba(8,8,16,0.96) 60%)"
            : plan.popular
              ? "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.1) 0%, rgba(8,8,16,0.96) 60%)"
              : "rgba(8,8,16,0.9)",
          border: `0.5px solid ${plan.legend ? "rgba(251,191,36,0.4)" : plan.popular ? "rgba(139,92,246,0.38)" : "rgba(255,255,255,0.09)"}`,
          padding: "24px 22px 22px",
          transform: hov ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hov
            ? plan.legend ? "0 0 60px rgba(251,191,36,0.1), 0 24px 64px rgba(0,0,0,0.7)" : plan.popular ? "0 0 40px rgba(139,92,246,0.12), 0 24px 64px rgba(0,0,0,0.7)" : "0 20px 60px rgba(0,0,0,0.6)"
            : plan.legend ? "0 0 28px rgba(251,191,36,0.06), 0 10px 36px rgba(0,0,0,0.55)" : plan.popular ? "0 0 16px rgba(139,92,246,0.07), 0 10px 36px rgba(0,0,0,0.55)" : "0 6px 24px rgba(0,0,0,0.5)",
          transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
          display: "flex", flexDirection: "column",
          backdropFilter: "blur(14px)",
        }}
      >
        {/* Badge */}
        {(plan.popular || plan.legend) && (
          <div style={{
            position: "absolute", top: 0, right: 20,
            background: plan.legend ? "linear-gradient(135deg, #fbbf24, #f97316)" : "linear-gradient(135deg, #7c3aed, #6366f1)",
            color: "#fff", borderRadius: "0 0 10px 10px", padding: "4px 12px",
            fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
            boxShadow: plan.legend ? "0 2px 12px rgba(251,191,36,0.35)" : "0 2px 12px rgba(124,58,237,0.35)",
          }}>
            {plan.legend ? "★ Best Value" : "Most Popular"}
          </div>
        )}

        {/* Plan label */}
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{plan.label}</div>

        {/* Price */}
        <div style={{ fontSize: "2.1rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
          ${plan.priceUSD.toFixed(2)}
          <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.32)", marginLeft: 4 }}>USD</span>
        </div>

        {/* Currency breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, margin: "16px 0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(251,191,36,0.12)", border: "0.5px solid rgba(251,191,36,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CoinIcon size={12} color="#fbbf24" />
              </div>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Solars</span>
            </div>
            <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fbbf24", fontVariantNumeric: "tabular-nums" }}>
              {totalSolars.toLocaleString()}
              {plan.bonusSolars > 0 && <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(251,191,36,0.55)", marginLeft: 4 }}>+{plan.bonusSolars.toLocaleString()}</span>}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(192,132,252,0.1)", border: "0.5px solid rgba(192,132,252,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GemIcon size={12} color="#c084fc" />
              </div>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Gems</span>
            </div>
            <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#c084fc", fontVariantNumeric: "tabular-nums" }}>
              {totalGems}
              {plan.bonusGems > 0 && <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(192,132,252,0.55)", marginLeft: 4 }}>+{plan.bonusGems}</span>}
            </span>
          </div>
        </div>

        {/* Value bar */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (plan.priceUSD / 84.99) * 100)}%`, background: plan.legend ? "linear-gradient(90deg, #fbbf24, #f97316)" : plan.popular ? "linear-gradient(90deg, #a78bfa, #22d3ee)" : "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.5))", borderRadius: 999 }} />
          </div>
          {(plan.bonusSolars > 0 || plan.bonusGems > 0) && (
            <div style={{ marginTop: 7, fontSize: "0.67rem", color: accent, fontWeight: 600 }}>
              {plan.bonusSolars > 0 ? `+${plan.bonusSolars.toLocaleString()} bonus Solars` : ""}
              {plan.bonusSolars > 0 && plan.bonusGems > 0 ? " · " : ""}
              {plan.bonusGems > 0 ? `+${plan.bonusGems} bonus Gems` : ""}
            </div>
          )}
        </div>

        <button
          onClick={handleBuy}
          style={{
            width: "100%", padding: "11px 0", borderRadius: 999, fontFamily: "Outfit, sans-serif",
            fontSize: "0.87rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
            background: plan.legend
              ? "linear-gradient(135deg, #d97706, #fbbf24)"
              : plan.popular
                ? "linear-gradient(135deg, #7c3aed, #22d3ee)"
                : "rgba(255,255,255,0.08)",
            color: "#fff",
            border: plan.legend ? "none" : plan.popular ? "none" : "0.5px solid rgba(255,255,255,0.14)",
            boxShadow: plan.legend ? "0 0 24px rgba(251,191,36,0.25)" : plan.popular ? "0 0 22px rgba(124,58,237,0.3)" : "none",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          Get {plan.label}
        </button>
      </div>

      {/* Confirm modal */}
      {confirmOpen && (
        <div className="player-modal-backdrop" onClick={() => setConfirmOpen(false)}>
          <div className="player-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380, padding: "30px 28px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>Confirm Purchase</h3>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 20 }}>
              You're purchasing the <strong style={{ color: "#fff" }}>{plan.label}</strong> package for <strong style={{ color: "#fff" }}>${plan.priceUSD.toFixed(2)} USD</strong>. You'll receive <strong style={{ color: "#fbbf24" }}>{totalSolars.toLocaleString()} Solars</strong> and <strong style={{ color: "#c084fc" }}>{totalGems} Gems</strong>.
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>
              This is a demo — no real payment will be processed. For real purchases, link a valid payment method in settings.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmOpen(false)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "11px 0", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontSize: "0.82rem" }}>Cancel</button>
              <button onClick={() => setConfirmOpen(false)} style={{ flex: 1, background: plan.legend ? "linear-gradient(135deg, #d97706, #fbbf24)" : "linear-gradient(135deg, #7c3aed, #22d3ee)", color: "#fff", border: "none", borderRadius: 999, padding: "11px 0", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontSize: "0.82rem", fontWeight: 700 }}>Proceed</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Topup() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { player } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Nav />
      <div className="section-wrap">
        <section style={{ padding: "44px 0 60px" }}>

          {/* Header */}
          <div className="anim-up" style={{ marginBottom: 40, textAlign: "center" }}>
            <div className="pill anim-up d1" style={{ display: "inline-flex", marginBottom: 16 }}>
              <CrownIcon size={11} color="#fbbf24" /> Astral Premium
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1.05, fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif", marginBottom: 10 }}>
              <span className="grad-white">Power up your</span>
              <br />
              <span className="grad-gold">Astral journey</span>
            </h1>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
              Get Solars &amp; Gems to unlock the best gear, speed up progression, and dominate the leaderboards.
            </p>
            {player && (
              <div style={{ marginTop: 16, display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ background: "rgba(251,191,36,0.1)", border: "0.5px solid rgba(251,191,36,0.28)", borderRadius: 999, padding: "7px 18px", fontSize: "0.8rem", fontWeight: 700, color: "#fbbf24", display: "flex", alignItems: "center", gap: 7 }}>
                  <CoinIcon size={13} color="#fbbf24" /> {player.Solars.toLocaleString()} Solars
                </div>
                <div style={{ background: "rgba(192,132,252,0.1)", border: "0.5px solid rgba(192,132,252,0.25)", borderRadius: 999, padding: "7px 18px", fontSize: "0.8rem", fontWeight: 700, color: "#c084fc", display: "flex", alignItems: "center", gap: 7 }}>
                  <GemIcon size={13} color="#c084fc" /> {player.gems} Gems
                </div>
              </div>
            )}
          </div>

          {/* Plans grid — 3 per row, Legend (gold) centre of row 1 */}
          <div className="anim-up d1" style={{ marginBottom: 56 }}>
            {/* Row 1: Warrior | Legend (gold, centre) | Elite */}
            <div className="plans-grid-3" style={{ marginBottom: 14 }}>
              {PLANS_ROW1.map(p => <PlanCard key={p.id} plan={p} />)}
            </div>
            {/* Row 2: Starter | Champion | Godlike */}
            <div className="plans-grid-3">
              {PLANS_ROW2.map(p => <PlanCard key={p.id} plan={p} />)}
            </div>
          </div>

          {/* Perks */}
          <div className="anim-up d2" style={{ marginBottom: 56 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 6 }}>Why top up?</h2>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.32)", lineHeight: 1.65 }}>Every purchase gives you an edge in Astral X Realm.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {perks.map(p => (
                <div key={p.heading} style={{ background: "rgba(8,8,16,0.88)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 18px", display: "flex", gap: 14, alignItems: "flex-start", backdropFilter: "blur(12px)" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: `${p.color}12`, border: `0.5px solid ${p.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <p.Icon size={16} color={p.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>{p.heading}</div>
                    <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>{p.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="anim-up d3">
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", marginBottom: 18 }}>Frequently asked</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FAQ.map((item, i) => (
                <div
                  key={i}
                  style={{ background: "rgba(8,8,16,0.88)", border: `0.5px solid ${openFaq === i ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s", backdropFilter: "blur(12px)" }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", textAlign: "left", padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: openFaq === i ? "#fff" : "rgba(255,255,255,0.72)" }}>{item.q}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.22s", flexShrink: 0 }}>
                      <path d="M2 4L6 8L10 4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 18px 16px", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: 14, animation: "fadeIn 0.2s ease" }}>
                      {item.a}
                    </div>
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
