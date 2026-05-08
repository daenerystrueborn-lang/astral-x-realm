import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import astralIcon from "/astral_icon.png";
import { HomeIcon, UserIcon, ShopIcon, TopupIcon, LeaderboardIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";

const links = [
  { label: "Home", to: "/", Icon: HomeIcon },
  { label: "Profile", to: "/profile", Icon: UserIcon },
  { label: "Leaderboard", to: "/leaderboard", Icon: LeaderboardIcon },
  { label: "Shop", to: "/shop", Icon: ShopIcon },
  { label: "Pricing", to: "/topup", Icon: TopupIcon },
];

export default function Nav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { openSignup, openLogin, player, logout } = useAuth();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
  }, [open]);

  return (
    <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "20px 20px 0", position: "relative", zIndex: 200 }} className="animate-fade-in">
      <nav style={{
        background: scrolled ? "rgba(2,2,6,0.95)" : "rgba(4,4,10,0.82)",
        border: "0.5px solid rgba(255,255,255,0.12)",
        borderRadius: 999,
        padding: "0 8px 0 12px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        overflow: "visible",
        position: "relative",
        zIndex: 200,
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        boxShadow: scrolled
          ? "0 0 0 0.5px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.07), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 0 0 0.5px rgba(255,255,255,0.09), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>
        {/* Left: logo + links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
          <div style={{ position: "relative", flexShrink: 0, marginRight: 10 }}>
            <div style={{
              position: "absolute", inset: -3, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 75%)",
              filter: "blur(4px)",
            }} />
            <img src={astralIcon} alt="logo" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", flexShrink: 0, position: "relative", zIndex: 1, border: "1px solid rgba(255,255,255,0.18)" }} />
          </div>
          <ul style={{ display: "flex", alignItems: "center", gap: 1, listStyle: "none", margin: 0 }} className="nav-links-desktop">
            {links.map(l => {
              const active = location === l.to;
              return (
                <li key={l.to}>
                  <Link href={l.to} style={{
                    color: active ? "#fff" : "rgba(255,255,255,0.45)",
                    textDecoration: "none",
                    fontSize: "0.77rem",
                    fontWeight: active ? 600 : 500,
                    padding: "5px 11px",
                    borderRadius: 999,
                    background: active
                      ? "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(34,211,238,0.1))"
                      : "transparent",
                    border: active ? "0.5px solid rgba(139,92,246,0.3)" : "0.5px solid transparent",
                    transition: "color 0.18s, background 0.18s, border-color 0.18s",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: "Outfit, sans-serif",
                  }}>
                    <l.Icon size={12} color={active ? "#a78bfa" : "rgba(255,255,255,0.38)"} />
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: auth + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {player ? (
            <>
              <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(139,92,246,0.1)", border: "0.5px solid rgba(139,92,246,0.25)", borderRadius: 999, padding: "5px 13px 5px 8px", textDecoration: "none", cursor: "pointer", transition: "background 0.18s, border-color 0.18s" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(34,211,238,0.4))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#fff" }}>
                  {player.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "#fff", fontFamily: "Outfit, sans-serif", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</span>
              </Link>
              <button onClick={logout} style={{ background: "transparent", color: "rgba(255,255,255,0.38)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 12px", fontSize: "0.72rem", fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap", transition: "color 0.18s, border-color 0.18s" }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button onClick={openLogin} style={{ background: "transparent", color: "rgba(255,255,255,0.55)", border: "none", borderRadius: 999, padding: "7px 14px", fontSize: "0.76rem", fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap", transition: "color 0.18s" }}>
                Log in
              </button>
              <button onClick={openSignup} style={{
                background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
                color: "#fff", border: "none", borderRadius: 999,
                padding: "7px 18px", fontSize: "0.76rem", fontWeight: 700,
                cursor: "pointer", whiteSpace: "nowrap", fontFamily: "Outfit, sans-serif",
                boxShadow: "0 0 20px rgba(139,92,246,0.3)",
                transition: "opacity 0.18s, transform 0.18s, box-shadow 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.boxShadow = "0 0 32px rgba(139,92,246,0.45)"; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.3)"; e.currentTarget.style.transform = "scale(1)"; }}>
                Sign up
              </button>
            </>
          )}

          {/* Hamburger (mobile only) */}
          <div style={{ position: "relative" }} className="hamburger-wrap">
            <button ref={btnRef} onClick={e => { e.stopPropagation(); setOpen(o => !o); }} style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.16)", borderRadius: 999, width: 36, height: 36, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3.5, cursor: "pointer", flexShrink: 0, transition: "background 0.18s" }}>
              <svg width="15" height="10" viewBox="0 0 15 10" fill="none">
                <line x1="0" y1="1" x2="15" y2="1" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="2" y1="5" x2="13" y2="5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="4" y1="9" x2="11" y2="9" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            {open && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 9998 }} onClick={() => setOpen(false)} />
                <ul style={{
                  position: "fixed", top: dropPos.top, right: dropPos.right,
                  background: "rgba(6,6,12,0.98)", backdropFilter: "blur(24px)",
                  border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 18,
                  width: 200, padding: 6, zIndex: 9999, listStyle: "none",
                  animation: "slideDown 0.22s ease both",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(139,92,246,0.1)",
                }}>
                  {links.map(l => (
                    <li key={l.to}>
                      <Link href={l.to} onClick={() => setOpen(false)} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 12px", borderRadius: 10,
                        color: location === l.to ? "#fff" : "rgba(255,255,255,0.55)",
                        textDecoration: "none", fontSize: "0.82rem", fontWeight: 500,
                        fontFamily: "Outfit, sans-serif",
                        background: location === l.to ? "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(34,211,238,0.07))" : "transparent",
                        border: location === l.to ? "0.5px solid rgba(139,92,246,0.22)" : "0.5px solid transparent",
                      }}>
                        <l.Icon size={13} color={location === l.to ? "#a78bfa" : "rgba(255,255,255,0.38)"} />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  <li style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)", marginTop: 4, paddingTop: 4 }}>
                    {player ? (
                      <button onClick={() => { logout(); setOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 10, color: "rgba(255,255,255,0.55)", background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", fontFamily: "Outfit, sans-serif" }}>Log out</button>
                    ) : (
                      <>
                        <button onClick={() => { openLogin(); setOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 10, color: "rgba(255,255,255,0.55)", background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", fontFamily: "Outfit, sans-serif" }}>Log in</button>
                        <button onClick={() => { openSignup(); setOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 10, color: "#fff", background: "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(34,211,238,0.09))", border: "0.5px solid rgba(139,92,246,0.25)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "Outfit, sans-serif", fontWeight: 600 }}>Sign up</button>
                      </>
                    )}
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        @media (min-width: 769px) { .hamburger-wrap { display: none !important; } }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .hamburger-wrap { display: block !important; }
        }
      `}</style>
    </div>
  );
}
