import { Link } from "wouter";

const cols: Record<string, { label: string; to: string }[]> = {
  Game: [
    { label: "Home",        to: "/" },
    { label: "Leaderboard", to: "/leaderboard" },
    { label: "Shop",        to: "/shop" },
    { label: "Pricing",     to: "/topup" },
  ],
  Account: [
    { label: "Profile", to: "/profile" },
  ],
};

const socials = [
  {
    label: "Discord",
    href: "https://discord.gg/s9fNUgHVT",
    color: "#5865F2",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/HngJ76A2bzkCfK3rV74Ebk",
    color: "#25D366",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{
      marginTop: 72,
      borderTop: "0.5px solid rgba(255,255,255,0.06)",
      background: "rgba(3,3,9,0.75)",
      backdropFilter: "blur(20px)",
    }}>
      <div className="section-wrap" style={{ padding: "52px 20px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 48, marginBottom: 44, flexWrap: "wrap" }}>
          {/* Brand */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(34,211,238,0.4))",
                border: "1px solid rgba(255,255,255,0.14)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.88rem", fontWeight: 800, color: "#fff", flexShrink: 0,
              }}>A</div>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#fff", letterSpacing: "-0.02em" }}>Astral X Realm</span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.72, maxWidth: 250, marginBottom: 18 }}>
              The ultimate Discord &amp; WhatsApp RPG. Battle, collect, and conquer.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map(s => (
                <a
                  key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.45)", transition: "background 0.18s, color 0.18s, transform 0.18s, border-color 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = s.color + "20"; e.currentTarget.style.borderColor = s.color + "50"; e.currentTarget.style.color = s.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(cols).map(([group, links]) => (
            <div key={group}>
              <div style={{ fontSize: "0.66rem", fontWeight: 700, color: "rgba(255,255,255,0.26)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>{group}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                {links.map(l => (
                  <li key={l.label}>
                    <Link href={l.to} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.44)", transition: "color 0.18s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.44)")}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ height: "0.5px", background: "rgba(255,255,255,0.05)", marginBottom: 22 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.22)" }}>© 2025 Astral X Realm. All rights reserved.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="live-dot" />
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>Season 1 · Live</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </footer>
  );
}
