import { UsersIcon, MapIcon, GemIcon } from "@/components/Icons";
import { useCountUp } from "@/hooks/useCountUp";

interface StatDef {
  label: string;
  Icon: (p: { size?: number; color?: string }) => React.ReactElement;
  target: number;
  format: (v: number) => string;
}

const statDefs: StatDef[] = [
  {
    label: "Active Players",
    Icon: UsersIcon,
    target: 10000,
    format: v => `${Math.max(0, Math.round(v / 1000))}k+`,
  },
  {
    label: "Dungeons Cleared",
    Icon: MapIcon,
    target: 250000,
    format: v => `${Math.max(0, Math.round(v / 1000))}k+`,
  },
  {
    label: "Unique Items",
    Icon: GemIcon,
    target: 1200,
    format: v => (v >= 1200 ? "1,200+" : `${Math.floor(v).toLocaleString()}`),
  },
  {
    label: "Active Guilds",
    Icon: UsersIcon,
    target: 840,
    format: v => `${Math.floor(Math.min(v, 840)).toLocaleString()}+`,
  },
];

function StatCell({ label, Icon, target, format }: StatDef) {
  const { ref, value } = useCountUp(target, 1450);

  return (
    <div
      ref={ref}
      style={{
        padding: "22px 20px",
        textAlign: "center",
        background: "rgba(10,10,10,0.55)",
      }}
    >
      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
          background: "linear-gradient(180deg,#fff,#c4b5fd)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {format(value)}
      </div>
      <div
        style={{
          fontSize: "0.73rem",
          color: "rgba(255,255,255,0.38)",
          marginTop: 6,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <Icon size={12} color="rgba(167,139,250,0.65)" />
        {label}
      </div>
    </div>
  );
}

export default function HomeStatsBar() {
  return (
    <>
      <div
        className="animate-fade-in-up delay-3 home-stats-grid stats-grid axr-accent-glow"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 1,
          background: "rgba(255,255,255,0.06)",
          border: "0.5px solid rgba(124,92,255,0.22)",
          borderRadius: 16,
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
