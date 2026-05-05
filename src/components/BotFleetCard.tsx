import { useCallback, useState, type CSSProperties } from "react";

export interface BotFleetCardProps {
  name: string;
  img: string;
  desc: string;
  accentA: string;
  accentB: string;
  accentC: string;
  online: boolean;
  status: string;
  uptime: string;
  ping: string;
  servers: string;
  commands: string;
}

export default function BotFleetCard({
  name,
  img,
  desc,
  accentA,
  accentB,
  accentC,
  online,
  status,
  uptime,
  ping,
  servers,
  commands,
}: BotFleetCardProps) {
  const [flip, setFlip] = useState(false);
  const toggle = useCallback(() => setFlip(v => !v), []);

  const innerStyle = { "--axr-bot-accent": accentA } as CSSProperties;

  return (
    <button
      type="button"
      className={`axr-bot-card${flip ? " axr-bot-card--flip" : ""}`}
      onClick={toggle}
      aria-pressed={flip}
      aria-label={`${name} — ${flip ? "show portrait" : "show stats"} side`}
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        padding: 0,
        margin: 0,
        border: "none",
        font: "inherit",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <div className="axr-bot-card__inner" style={innerStyle}>
        {/* Portrait side (visible at rotateY 0) */}
        <div className="axr-bot-card__face axr-bot-card__photo">
          <div
            className="axr-bot-card__rim"
            style={{ "--axr-b": accentB, "--axr-c": accentC } as CSSProperties}
          />
          <div className="axr-bot-card__photo-frame">
            <img src={img} alt={`${name} bot`} loading="lazy" decoding="async" />
          </div>
          <div className="axr-bot-card__photo-shade" />
          <div className="axr-bot-card__photo-foot">
            <span className="axr-bot-card__title">{name}</span>
            <span className={online ? "axr-bot-card__pill axr-bot-card__pill--on" : "axr-bot-card__pill"}>{online ? `● ${status}` : `○ ${status}`}</span>
          </div>
          <span className="axr-bot-card__hint">Flip for stats · click</span>
        </div>

        {/* Stats side (visible at rotateY 180deg) */}
        <div className="axr-bot-card__face axr-bot-card__stats">
          <div className="axr-bot-card__stats-orbits" aria-hidden>
            <span className="axr-bot-card__blob" style={{ background: accentA }} />
            <span className="axr-bot-card__blob axr-bot-card__blob--b" style={{ background: accentC }} />
            <span className="axr-bot-card__blob axr-bot-card__blob--c" style={{ background: accentB }} />
          </div>
          <div className="axr-bot-card__stats-body">
            <div className="axr-bot-card__stats-top">
              <span className={online ? "axr-bot-card__pill axr-bot-card__pill--on" : "axr-bot-card__pill"}>{online ? `● ${status}` : `○ ${status}`}</span>
              <span className="axr-bot-card__title axr-bot-card__title--sm">{name}</span>
            </div>
            <p className="axr-bot-card__desc">{desc}</p>
            <div className="axr-bot-card__metrics">
              {[
                { label: "Uptime", val: uptime },
                { label: "Ping", val: ping },
                { label: "Servers", val: servers },
                { label: "Cmds", val: commands },
              ].map(({ label, val }) => (
                <div key={label} className="axr-bot-card__metric">
                  <span className="axr-bot-card__ml">{label}</span>
                  <span className="axr-bot-card__mv">{val}</span>
                </div>
              ))}
            </div>
            <span className="axr-bot-card__hint axr-bot-card__hint--back">Flip back</span>
          </div>
        </div>
      </div>
    </button>
  );
}
