import { UsersIcon, MapIcon, GemIcon } from "@/components/Icons";
import { useCountUp } from "@/hooks/useCountUp";

interface StatDef {
  label: string;
  Icon: (p: { size?: number; color?: string }) => React.ReactElement;
  target: number;
  format: (v: number) => string;
  accent: string;
  bg: string;
}

const STATS: StatDef[] = [
  { label: "Active Players",   Icon: UsersIcon, target: 10000,  format: v => `${Math.max(0, Math.round(v/1000))}k+`,    accent: "#a78bfa", bg: "rgba(139,92,246,0.09)" },
  { label: "Dungeons Cleared", Icon: MapIcon,   target: 250000, format: v => `${Math.max(0, Math.round(v/1000))}k+`,    accent: "#22d3ee", bg: "rgba(34,211,238,0.07)" },
  { label: "Unique Items",     Icon: GemIcon,   target: 1200,   format: v => v >= 1200 ? "1,200+" : Math.floor(v).toLocaleString(), accent: "#fbbf24", bg: "rgba(251,191,36,0.07)" },
  { label: "Active Guilds",    Icon: UsersIcon, target: 840,    format: v => `${Math.floor(Math.min(v, 840)).toLocaleString()}+`, accent: "#4ade80", bg: "rgba(74,222,128,0.07)" },
];

function Stat({ label, Icon, target, format, accent, bg }: StatDef) {
  const { ref, value } = useCountUp(target, 1400);
  return (
    <div ref={ref} style={{ padding: "24px 18px", textAlign: "center", background: bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${accent}16, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{
        fontSize: "2rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em",
        fontVariantNumeric: "tabular-nums", position: "relative",
        background: `linear-gradient(180deg, #fff 0%, ${accent} 120%)`,
        WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{format(value)}</div>
      <div style={{ fontSize: "0.71rem", color: "rgba(255,255,255,0.38)", marginTop: 8, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, position: "relative" }}>
        <Icon size={11} color={accent} />{label}
      </div>
    </div>
  );
}

export default function HomeStatsBar() {
  return (
    <div
      className="anim-up d3"
      style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: 1, background: "rgba(255,255,255,0.055)",
        border: "0.5px solid rgba(139,92,246,0.22)", borderRadius: 18, overflow: "hidden",
        marginBottom: 56,
        boxShadow: "0 0 0 1px rgba(139,92,246,0.08), 0 8px 40px rgba(0,0,0,0.4)",
      }}
    >
      {STATS.map(s => <Stat key={s.label} {...s} />)}
      <style>{`@media(max-width:560px){.home-stats-grid{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </div>
  );
}
