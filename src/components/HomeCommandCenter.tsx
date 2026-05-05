import type { Player } from "@/lib/api";
import { Link } from "wouter";
import { CoinIcon, DiceIcon, MapIcon } from "@/components/Icons";

const actions = [
  { cmd: "!daily", label: "Dailies", hint: "3 quests • streak bonuses", Icon: DiceIcon },
  { cmd: "!dungeon", label: "Dungeon", hint: "Push your floor record", Icon: MapIcon },
  { cmd: "!bal", label: "Balance", hint: "Solars & gems check", Icon: CoinIcon },
] as const;

function cap(s?: string) {
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface Props {
  player: Player;
  navigate: (path: string) => void;
}

export default function HomeCommandCenter({ player, navigate }: Props) {
  const guildRaw = player.guildName || player.guild;
  const guildShow =
    guildRaw && !guildRaw.startsWith("guild_") ? guildRaw : "No guild";

  return (
    <section
      className="animate-fade-in-up delay-1 section-card axr-accent-glow"
      style={{
        marginBottom: 28,
        padding: "20px 22px",
        border: "0.5px solid rgba(124,92,255,0.35)",
        background:
          "linear-gradient(145deg, rgba(15,15,22,0.95) 0%, rgba(8,12,22,0.92) 100%)",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ minWidth: 200 }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(165,180,252,0.75)", marginBottom: 10 }}>
            Your command center
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "linear-gradient(145deg, rgba(124,92,255,0.35), rgba(34,211,238,0.12))",
                border: "0.5px solid rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                fontWeight: 800,
              }}
            >
              {cap(player.name).charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                {cap(player.name)}{" "}
                <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>· Lv.{player.level}</span>
              </div>
              <div style={{ marginTop: 4, fontSize: "0.78rem", color: "rgba(255,255,255,0.42)", display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
                <span>{cap(player.class)}</span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
                <span>{guildShow}</span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
                <span style={{ color: "rgba(34,211,238,0.85)" }}>Floor {player.dungeonFloor}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <div style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 12px" }}>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Solars</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>{player.Solars.toLocaleString()}</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 12px" }}>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Gems</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>{player.gems}</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 12px" }}>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Kills</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>{player.kills.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 12 }}>
            Suggested commands (Discord / WhatsApp)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            {actions.map(({ cmd, label, hint, Icon }) => (
              <div
                key={cmd}
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(124,92,255,0.45)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "rgba(34,211,238,0.95)" }}>{cmd}</span>
                  <Icon size={14} color="rgba(255,255,255,0.35)" />
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.32)", marginTop: 2 }}>
                  {cmd === "!dungeon"
                    ? (player.dungeonFloor ? `You're on floor ${player.dungeonFloor}` : hint)
                    : hint}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              style={{
                background: "#fff",
                color: "#000",
                border: "none",
                borderRadius: 999,
                padding: "8px 18px",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Full portal profile
            </button>
            <Link
              href="/shop"
              style={{
                borderRadius: 999,
                padding: "8px 18px",
                fontSize: "0.78rem",
                fontWeight: 600,
                textDecoration: "none",
                color: "rgba(255,255,255,0.75)",
                border: "0.5px solid rgba(255,255,255,0.18)",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              View shop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
