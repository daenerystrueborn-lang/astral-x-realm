import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import astralIcon from "/astral_icon.png";
import { HomeIcon, UserIcon, ShopIcon, TopupIcon, LeaderboardIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home",        to: "/",            Icon: HomeIcon },
  { label: "Profile",     to: "/profile",     Icon: UserIcon },
  { label: "Leaderboard", to: "/leaderboard", Icon: LeaderboardIcon },
  { label: "Shop",        to: "/shop",        Icon: ShopIcon },
  { label: "Pricing",     to: "/topup",       Icon: TopupIcon },
];

export default function Nav() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSignup, openLogin, player, logout } = useAuth();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [dropY, setDropY] = useState(0);
  const [dropR, setDropR] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropY(r.bottom + 8);
      setDropR(window.innerWidth - r.right);
    }
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "20px 20px 0", position: "relative", zIndex: 200 }}>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 54, padding: "0 10px 0 14px", borderRadius: 999,
        background: scrolled ? "rgba(3,3,9,0.96)" : "rgba(5,5,12,0.78)",
        border: "0.5px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
        transition: "background 0.3s, box-shadow 0.3s",
        boxShadow: scrolled
          ? "0 0 0 0.5px rgba(255,255,255,0.09), 0 10px 40px rgba(0,0,0,0.65), 0 0 40px rgba(139,92,246,0.05), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 0 0 0.5px rgba(255,255,255,0.07), 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        overflow: "visible", position: "relative", zIndex: 200,
      }}>
        {/* Left: logo + desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
          {/* Logo */}
          <div style={{ position: "relative", marginRight: 12, flexShrink: 0 }}>
            <div style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
              filter: "blur(5px)",
            }} />
            <img
              src={astralIcon} alt="AXR"
              style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", position: "relative", border: "1px solid rgba(255,255,255,0.16)" }}
            />
          </div>

          {/* Desktop nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }} className="desktop-only" aria-label="Main navigation">
            {NAV_LINKS.map(l => {
              const active = location === l.to;
              return (
                <Link key={l.to} href={l.to} className={`nav-link${active ? " active" : ""}`}>
                  <l.Icon size={12} color={active ? "#a78bfa" : "rgba(255,255,255,0.35)"} />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: auth buttons + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {player ? (
            <>
              <Link
                href="/profile"
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "rgba(139,92,246,0.1)", border: "0.5px solid rgba(139,92,246,0.24)",
                  borderRadius: 999, padding: "5px 14px 5px 8px", textDecoration: "none",
                  transition: "background 0.18s",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(139,92,246,0.7), rgba(34,211,238,0.5))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>
                  {player.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "0.77rem", fontWeight: 600, color: "#fff", maxWidth: 88, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {player.name}
                </span>
              </Link>
              <button
                onClick={logout}
                style={{ background: "transparent", color: "rgba(255,255,255,0.35)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 14px", fontSize: "0.73rem", fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap", transition: "color 0.18s, border-color 0.18s" }}
                className="desktop-only"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLogin}
                style={{ background: "transparent", color: "rgba(255,255,255,0.5)", border: "none", padding: "7px 14px", fontSize: "0.77rem", fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap", transition: "color 0.18s", borderRadius: 999 }}
                className="desktop-only"
              >
                Log in
              </button>
              <button
                onClick={openSignup}
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #6366f1 55%, #22d3ee)",
                  color: "#fff", border: "none", borderRadius: 999,
                  padding: "7px 20px", fontSize: "0.77rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap",
                  boxShadow: "0 0 22px rgba(124,58,237,0.35)",
                  transition: "opacity 0.18s, transform 0.18s, box-shadow 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 36px rgba(124,58,237,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 22px rgba(124,58,237,0.35)"; }}
              >
                Sign up
              </button>
            </>
          )}

          {/* Hamburger */}
          <div style={{ position: "relative", zIndex: 300 }} className="mobile-only">
            <button
              ref={btnRef}
              onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
              aria-label="Toggle menu"
              style={{
                width: 36, height: 36, borderRadius: 999,
                background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.15)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3.5,
                cursor: "pointer", flexShrink: 0, transition: "background 0.18s",
              }}
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <line x1="0" y1="1" x2="14" y2="1" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="2" y1="5" x2="12" y2="5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="4" y1="9" x2="10" y2="9" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>

            {menuOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 9997 }} onClick={() => setMenuOpen(false)} />
                <ul style={{
                  position: "fixed", top: dropY, right: dropR,
                  background: "rgba(5,5,14,0.98)", backdropFilter: "blur(28px)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 18, width: 210, padding: 6, zIndex: 9998, listStyle: "none",
                  animation: "slideDown 0.2s ease both",
                  boxShadow: "0 20px 64px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(139,92,246,0.08)",
                }}>
                  {NAV_LINKS.map(l => {
                    const active = location === l.to;
                    return (
                      <li key={l.to}>
                        <Link
                          href={l.to}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "9px 13px", borderRadius: 11,
                            color: active ? "#fff" : "rgba(255,255,255,0.52)",
                            textDecoration: "none", fontSize: "0.83rem", fontWeight: active ? 600 : 500,
                            background: active ? "linear-gradient(135deg, rgba(139,92,246,0.14), rgba(34,211,238,0.07))" : "transparent",
                            border: active ? "0.5px solid rgba(139,92,246,0.22)" : "0.5px solid transparent",
                          }}
                        >
                          <l.Icon size={13} color={active ? "#a78bfa" : "rgba(255,255,255,0.35)"} />
                          {l.label}
                        </Link>
                      </li>
                    );
                  })}
                  <li style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)", marginTop: 4, paddingTop: 4 }}>
                    {player ? (
                      <button onClick={() => { logout(); setMenuOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 13px", borderRadius: 11, color: "rgba(255,255,255,0.52)", background: "none", border: "none", cursor: "pointer", fontSize: "0.83rem", fontFamily: "Outfit, sans-serif" }}>Log out</button>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <button onClick={() => { openLogin(); setMenuOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 13px", borderRadius: 11, color: "rgba(255,255,255,0.52)", background: "none", border: "none", cursor: "pointer", fontSize: "0.83rem", fontFamily: "Outfit, sans-serif" }}>Log in</button>
                        <button onClick={() => { openSignup(); setMenuOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 13px", borderRadius: 11, color: "#fff", background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(34,211,238,0.1))", border: "0.5px solid rgba(124,58,237,0.28)", cursor: "pointer", fontSize: "0.83rem", fontFamily: "Outfit, sans-serif", fontWeight: 600 }}>Sign up</button>
                      </div>
                    )}
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
