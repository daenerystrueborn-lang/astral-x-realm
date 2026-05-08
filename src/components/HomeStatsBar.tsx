import { UsersIcon, MapIcon, GemIcon } from "@/components/Icons";
import { useCountUp } from "@/hooks/useCountUp";

interface StatDef {
  label: string;
  Icon: (p: { size?: number; color?: string }) => React.ReactElement;
  target: number;
  format: (v: number) => string;
  accent: string;
  accentBg: string;
}

const statDefs: StatDef[] = [
  {
    label: "Active Players",
    Icon: UsersIcon,
    target: 10000,
    format: v => `${Math.max(0, Math.round(v / 1000))}k+`,
    accent: "#a78bfa",
    accentBg: "rgba(139,92,246,0.1)",
  },
  {
    label: "Dungeons Cleared",
    Icon: MapIcon,
    target: 250000,
    format: v => `${Math.max(0, Math.round(v / 1000))}k+`,
    accent: "#22d3ee",
    accentBg: "rgba(34,211,238,0.09)",
  },
  {
    label: "Unique Items",
    Icon: GemIcon,
    target: 1200,
    format: v => (v >= 1200 ? "1,200+" : `${Math.floor(v).toLocaleString()}`),
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.09)",
  },
  {
    label: "Active Guilds",
    Icon: UsersIcon,
    target: 840,
    format: v => `${Math.floor(Math.min(v, 840)).toLocaleString()}+`,
    accent: "#4ade80",
    accentBg: "rgba(74,222,128,0.09)",
  },
];

function StatCell({ label, Icon, target, format, accent, accentBg }: StatDef) {
  const { ref, value } = useCountUp(target, 1450);

  return (
    <div
      ref={ref}
      style={{
        padding: "26px 20px",
        textAlign: "center",
        background: accentBg,
        position: "relative",
        overflow: "hidden",
        transition: "background 0.25s ease",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${accent}18, transparent 70%)`,
      }} />
      <div style={{
        fontSize: "2rem",
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1.1,
        fontVariantNumeric: "tabular-nums",
        background: `linear-gradient(180deg, #fff, ${accent})`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        position: "relative",
      }}>
        {format(value)}
      </div>
      <div style={{
        fontSize: "0.73rem",
        color: "rgba(255,255,255,0.4)",
        marginTop: 7,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        position: "relative",
      }}>
        <Icon size={12} color={accent} />
        {label}
      </div>
    </div>
  );
}

export default function HomeStatsBar() {
  return (
    <>
      <div
        className="animate-fade-in-up delay-3 home-stats-grid axr-accent-glow"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 1,
          background: "rgba(255,255,255,0.055)",
          border: "0.5px solid rgba(139,92,246,0.25)",
          borderRadius: 18,
          overflow: "hidden",
          marginBottom: 60,
        }}
      >
        {statDefs.map(s => (
          <StatCell key={s.label} {...s} />
        ))}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .home-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}
