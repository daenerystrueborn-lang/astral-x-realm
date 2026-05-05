import { useEffect, useState } from "react";
import { getLeaderboard, getRealmFeed, type LeaderboardEntry } from "@/lib/api";

function cap(s?: string) {
  if (!s) return "Warrior";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function guildLabel(p: LeaderboardEntry): string {
  const g = p.guildName || p.guild;
  if (!g || g.startsWith("guild_")) return "";
  return g;
}

function linesFromLeaderboard(players: LeaderboardEntry[]): string[] {
  if (players.length === 0) {
    return [
      "Link your portal account • climb ranks on the live leaderboard",
      "Daily quests & dungeons refresh — play on Discord or WhatsApp",
      "Season 1 is live • exclusive rewards for ranked PvP and guild wars",
    ];
  }

  const top = players.slice(0, 15);
  const out: string[] = [];

  for (let i = 0; i < top.length; i++) {
    const p = top[i];
    const g = guildLabel(p);
    const tpl = [
      `${p.name} holds #${p.rank} with ${(p.kills || 0).toLocaleString()} kills`,
      `${p.name} reached Lv.${p.level}${p.prestige ? ` · Prestige ${p.prestige}` : ""}`,
      g ? `${p.name} is repping guild ${g} in the standings` : `${p.name} is carving a solo path · Lv.${p.level}`,
      `${cap(p.class)} on deck — ${p.name} is pushing ranks`,
    ];
    out.push(tpl[i % tpl.length]);
  }

  const g1 = top[0] ? guildLabel(top[0]) : "";
  if (g1 && top.length >= 4) out.push(`${g1} is stacking bodies on the leaderboard this week`);

  const dup = [...new Set(out)];
  return dup.length >= 4 ? dup : [...dup, ...linesFromLeaderboard([])];
}

export default function RealmFeed() {
  const [lines, setLines] = useState<string[]>(() => linesFromLeaderboard([]));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [feed, players] = await Promise.all([
        getRealmFeed(),
        getLeaderboard(),
      ]);
      if (cancelled) return;
      if (feed && feed.length > 0) setLines(feed);
      else setLines(linesFromLeaderboard(players));
    }

    load();
    const id = window.setInterval(load, 45000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const duplicated = [...lines, ...lines];

  return (
    <div
      className="realm-feed-outer"
      style={{
        position: "relative",
        zIndex: 5,
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(90deg, rgba(124,92,255,0.06) 0%, rgba(34,211,238,0.04) 50%, rgba(124,92,255,0.06) 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 24px",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            flexShrink: 0,
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(165,180,252,0.95)",
          }}
        >
          Live realm
        </span>
        <div style={{ overflow: "hidden", flex: 1, maskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)" }}>
          <div className="realm-feed-track">
            {duplicated.map((text, i) => (
              <span key={`${i}-${text.slice(0, 24)}`} style={{ flexShrink: 0, paddingRight: 36, fontSize: "0.76rem", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
                <span style={{ color: "rgba(34,211,238,0.75)", marginRight: 6 }}>◇</span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .realm-feed-track {
          display: flex;
          width: max-content;
          animation: realmMarquee 80s linear infinite;
        }
        @keyframes realmMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .realm-feed-track { animation: none; flex-wrap: wrap; width: auto; gap: 8px 24px; }
        }
      `}</style>
    </div>
  );
}
