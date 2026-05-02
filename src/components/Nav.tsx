import { useState } from "react";
import { Link, useLocation } from "wouter";
import astralIcon from "/astral_icon.png";
import { HomeIcon, UserIcon, ShopIcon, TopupIcon, LeaderboardIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";

function CardsIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="14" height="16" rx="2" />
      <path d="M6 2h12a2 2 0 0 1 2 2v14" />
    </svg>
  );
}

const links = [
  { label: "Home", to: "/", Icon: HomeIcon },
  { label: "Profile", to: "/profile", Icon: UserIcon },
  { label: "Cards", to: "/cards", Icon: CardsIcon },
  { label: "Leaderboard", to: "/leaderboard", Icon: LeaderboardIcon },
  { label: "Shop", to: "/shop", Icon: ShopIcon },
  { label: "Topup", to: "/topup", Icon: TopupIcon },
];

export default function Nav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { openSignup, openLogin, player, logout } = useAuth();

  return (
    <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "20px 20px 0" }} className="animate-fade-in">
      <nav style={{
        background: "rgba(0,0,0,0.88)",
        border: "0.5px solid rgba(255,255,255,0.11)",
        borderRadius: 999,
        padding: "0 8px 0 12px",
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}>
        {/* Left: logo + links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
          <img src={astralIcon} alt="logo" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginRight: 4 }} />
          <ul style={{ display: "flex", alignItems: "center", gap: 1, listStyle: "none", margin: 0 }} className="nav-links-desktop">
            {links.map(l => {
              const active = location === l.to;
              return (
                <li key={l.to}>
                  <Link href={l.to} style={{
                    color: active ? "#fff" : "rgba(255,255,255,0.42)",
                    textDecoration: "none",
                    fontSize: "0.77rem",
                    fontWeight: 500,
                    padding: "5px 10px",
                    borderRadius: 999,
                    background: active ? "rgba(255,255,255,0.1)" : "transparent",
                    transition: "color 0.18s, background 0.18s",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: "Outfit, sans-serif",
                  }}>
                    <l.Icon size={12} color={active ? "#fff" : "rgba(255,255,255,0.38)"} />
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: auth area + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          {player ? (
            <>
              <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.13)", borderRadius: 999, padding: "5px 13px 5px 8px", textDecoration: "none", cursor: "pointer" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#fff" }}>
                  {player.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "#fff", fontFamily: "Outfit, sans-serif", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</span>
              </Link>
              <button onClick={logout} style={{ background: "transparent", color: "rgba(255,255,255,0.38)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 12px", fontSize: "0.72rem", fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap" }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button onClick={openLogin} style={{ background: "transparent", color: "rgba(255,255,255,0.55)", border: "none", borderRadius: 999, padding: "7px 14px", fontSize: "0.76rem", fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap" }}>
                Log in
              </button>
              <button onClick={openSignup} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 999, padding: "7px 16px", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "Outfit, sans-serif" }}>
                Sign up
              </button>
            </>
          )}

          {/* Hamburger (mobile only) */}
          <div style={{ position: "relative" }} className="hamburger-wrap">
            <button onClick={e => { e.stopPropagation(); setOpen(o => !o); }} style={{ background: "transparent", border: "0.5px solid rgba(255,255,255,0.16)", borderRadius: 999, width: 34, height: 34, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3.5, cursor: "pointer", flexShrink: 0 }}>
              <svg width="15" height="10" viewBox="0 0 15 10" fill="none">
                <line x1="0" y1="1" x2="15" y2="1" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="2" y1="5" x2="13" y2="5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="4" y1="9" x2="11" y2="9" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            {open && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
                <ul style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "rgba(8,8,8,0.97)", backdropFilter: "blur(20px)",
                  border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 16,
                  width: 190, padding: 6, zIndex: 100, listStyle: "none",
                  animation: "slideDown 0.2s ease both",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                }}>
                  {links.map(l => (
                    <li key={l.to}>
                      <Link href={l.to} onClick={() => setOpen(false)} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 12px", borderRadius: 9,
                        color: location === l.to ? "#fff" : "rgba(255,255,255,0.55)",
                        textDecoration: "none", fontSize: "0.82rem", fontWeight: 500,
                        fontFamily: "Outfit, sans-serif",
                        background: location === l.to ? "rgba(255,255,255,0.05)" : "transparent",
                      }}>
                        <l.Icon size={13} color={location === l.to ? "#fff" : "rgba(255,255,255,0.38)"} />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  <li style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)", marginTop: 4, paddingTop: 4 }}>
                    {player ? (
                      <button onClick={() => { logout(); setOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 9, color: "rgba(255,255,255,0.55)", background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", fontFamily: "Outfit, sans-serif" }}>Log out</button>
                    ) : (
                      <>
                        <button onClick={() => { openLogin(); setOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 9, color: "rgba(255,255,255,0.55)", background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", fontFamily: "Outfit, sans-serif" }}>Log in</button>
                        <button onClick={() => { openSignup(); setOpen(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 9, color: "#fff", background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", fontFamily: "Outfit, sans-serif", fontWeight: 600 }}>Sign up</button>
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
