import React from "react";
import { useRouter } from "next/router";
import Container from "../../components/container";
import { SESSIONS } from "../../lib/constants";
import { buildStats } from "../../lib/build-stats";
import Link from "next/link";
import { getImgSrc } from "../../lib/items";

const PersonalStat = ({ subtitle, title, statKey = "", value }) => {
  const split = statKey.split(".");
  const type = split[0];
  const stat = split[1];
  const prettyStat = stat.replace(/_/g, " ");
  const prettyType = type.replace(/_/g, " ");
  const imgSrc = getImgSrc(prettyStat);
  const icon = imgSrc ? <img src={imgSrc} /> : null;

  return (
    <article className="personal-stat">
      <h3>{title}</h3>
      <h4>{subtitle}</h4>
      <p>
        {prettyType} {value} {icon}{" "}
        <Link href={`/stats?stat=${stat}`}>
          <a>{prettyStat}</a>
        </Link>
      </p>
    </article>
  );
};

const Session = () => {
  const {
    query: { name },
  } = useRouter();

  if (name) {
    const { stats, oldStats, players } = buildStats(SESSIONS[0]);

    const only = {};
    const all = {};

    const statKeys = Object.keys(stats);

    statKeys.forEach((statKey) => {
      const byType = stats[statKey];
      const typeKeys = Object.keys(byType);

      typeKeys.forEach((typeKey) => {
        const stat = byType[typeKey];
        if (Object.keys(stat).length === 1 && stat[name]) {
          only[`${statKey}.${typeKey}`] = stat;
        }

        all[`${statKey}.${typeKey}`] = stat;
      });
    });

    let topPct = { stat: "" };
    let top = { stat: "" };

    Object.keys(only).forEach((o) => {
      if (!top.top || top.top[name] < only[o][name]) {
        top.top = only[o];
        top.stat = o;
      }
    });

    Object.keys(all).forEach((a) => {
      const ps = Object.keys(all[a]).filter((n) => n !== name);
      const myValue = all[a][name] ?? 0;

      let playerMax = 0;

      if (Object.keys(players).every((p) => all[a][p])) {
        ps.forEach((p) => {
          playerMax = Math.max(all[a][p], playerMax);
        });

        const pct = (myValue / playerMax) * 100;

        if (playerMax !== 0 && (!topPct.top || topPct.top.pct < pct)) {
          topPct.top = { ...all[a], pct };
          topPct.stat = a;
        }
      }
    });

    return (
      <Container>
        <div className="player">
          <h2>{name}</h2>

          <PersonalStat
            subtitle="Highest unique stat"
            title="Like no one else"
            statKey={top.stat}
            value={top.top[name]}
          ></PersonalStat>

          <PersonalStat
            subtitle="Ubiquitous stat with greatest % difference from other players"
            title="Above and beyond"
            statKey={topPct.stat}
            value={topPct.top[name]}
          ></PersonalStat>
        </div>
      </Container>
    );
  }

  return null;
};

export default Session;
