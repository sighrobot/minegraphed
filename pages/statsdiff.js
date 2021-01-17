import React from "react";
import { formatDistance } from "date-fns";

const caleb = require("../stats/2021-01-16/0fa87154-f7ad-4810-a4e3-85eda879d4ef.json");
const jesse = require("../stats/2021-01-16/1e84adf7-b91a-4000-a5dd-fd847d910265.json");
const abe = require("../stats/2021-01-16/036a0489-aad6-4c44-9a5e-31b7ba41d490.json");

const players = {
  caleb,
  jesse,
  abe,
};

const oldPlayers = {
  caleb: require("../stats/2021-01-09/0fa87154-f7ad-4810-a4e3-85eda879d4ef.json"),
  jesse: require("../stats/2021-01-09/1e84adf7-b91a-4000-a5dd-fd847d910265.json"),
  abe: require("../stats/2021-01-09/036a0489-aad6-4c44-9a5e-31b7ba41d490.json"),
};

const stats = {};
const oldStats = {};

const playerKeys = Object.keys(players);

playerKeys.forEach((player) => {
  const statTypes = players[player].stats;
  const statTypeKeys = Object.keys(statTypes);

  statTypeKeys.forEach((statTypeKey) => {
    const simpleStatTypeKey = statTypeKey.split("minecraft:")[1];

    const playerStats = statTypes[statTypeKey];
    const statKeys = Object.keys(playerStats);

    if (!stats[simpleStatTypeKey]) {
      stats[simpleStatTypeKey] = {};
    }

    statKeys.forEach((statKey) => {
      const simpleStatKey = statKey.split("minecraft:")[1];

      if (stats[simpleStatTypeKey][simpleStatKey]) {
        stats[simpleStatTypeKey][simpleStatKey][player] = playerStats[statKey];
      } else {
        stats[simpleStatTypeKey][simpleStatKey] = {
          [player]: playerStats[statKey],
        };
      }
    });
  });
});

const oldPlayerKeys = Object.keys(oldPlayers);

oldPlayerKeys.forEach((player) => {
  const statTypes = oldPlayers[player].stats;
  const statTypeKeys = Object.keys(statTypes);

  statTypeKeys.forEach((statTypeKey) => {
    const simpleStatTypeKey = statTypeKey.split("minecraft:")[1];

    const playerStats = statTypes[statTypeKey];
    const statKeys = Object.keys(playerStats);

    if (!oldStats[simpleStatTypeKey]) {
      oldStats[simpleStatTypeKey] = {};
    }

    statKeys.forEach((statKey) => {
      const simpleStatKey = statKey.split("minecraft:")[1];

      if (oldStats[simpleStatTypeKey][simpleStatKey]) {
        oldStats[simpleStatTypeKey][simpleStatKey][player] =
          playerStats[statKey];
      } else {
        oldStats[simpleStatTypeKey][simpleStatKey] = {
          [player]: playerStats[statKey],
        };
      }
    });
  });
});

const formatCm = (n) =>
  n >= 1e5
    ? `${(n / 1e5).toFixed(1)} km`
    : n >= 100
    ? `${Math.round(n / 100)} m`
    : `${n} cm`;
const formatTime = (n) => {
  return formatDistance(0, n * 60)
    .replace(/about /g, "")
    .replace("less than a minute", " 1 min")
    .replace("minute", "min")
    .replace("hour", "hr");
};

const Stats = () => {
  const [value, setValue] = React.useState("");
  const statTypes = Object.keys(stats);
  const handleChange = (e) => setValue(e.target.value);

  return (
    <div>
      <input
        value={value}
        placeholder="Search stats by name or type..."
        onChange={handleChange}
      />
      <table>
        <tbody>
          {statTypes.map((type) => {
            return (
              <>
                <style>{`
                * {
                    box-sizing: border-box;
                }

                body {
                    font-family: courier;
                    margin: 0;
                    font-size: 12px;
                    width: 100% !important;
                }

                div, #__next {
                    width: 100%;
                }

                input {
                    // display: block;
                    position: sticky;
                    top: 0;
                    width: 100%;
                    padding: 20px 10px;
                    font-family: inherit;
                    border: none;
                    outline: 0;
                    font-size: 16px;
                    border-bottom: 1px solid black;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th:first-child {
                    font-size: 10px;
                }

                th:nth-child(2) {
                    font-size: 12px;
                }

                tbody tr:not(.heading):nth-child(2n+1) {
                    background: rgba(0, 0, 0, 0.025);
                }

                th, td {
                    padding: 5px;
                }

                td {
                    text-align: right;
                }

                .heading th:nth-child(3),
                .heading th:nth-child(4),
                .heading th:nth-child(5) {
                    text-align: right;
                }

                tr:not(.heading):hover {
                    background: rgba(255, 255, 0, 0.1) !important;
                }

                th {
                    text-align: left;

                }

                td {
                    width: 1px;
                    white-space: nowrap;
                    padding: 5px 10px;
                }

                .heading {
                    background: cornflowerblue;
                    padding: 10px 5px;
                }

                .subheading {
                    background: rgba(0, 0, 0, 0.2);
                }

                .max {
                    background: rgba(0, 255, 0, 0.1);
                }

            `}</style>
                {Object.keys(stats[type])
                  .sort((a, b) => (a > b ? 1 : -1))
                  .filter((stat) => stat.indexOf(value.toLowerCase()) !== -1)
                  .length > 0 ? (
                  <tr className="heading">
                    <th>Type</th>
                    <th>Stat</th>
                    {Object.keys(players).map((p) => {
                      return <th key={p}>{p}</th>;
                    })}
                  </tr>
                ) : null}
                {Object.keys(stats[type])
                  .sort((a, b) => (a > b ? 1 : -1))
                  .filter((stat) => stat.indexOf(value.toLowerCase()) !== -1)
                  .map((stat) => {
                    const normal = Object.keys(players).map(
                      (p) =>
                        (stats[type][stat] ? stats[type][stat][p] ?? 0 : 0) -
                        (oldStats[type][stat]
                          ? oldStats[type][stat][p] ?? 0
                          : 0)
                    );
                    const max = Math.max(...normal);

                    // console.log({ normal, max: Math.max(...normal) })

                    return max !== 0 ? (
                      <tr key={stat}>
                        <th className="subheading">
                          {type.replace(/_/g, " ")}
                        </th>
                        <th>{stat.replace(/_/g, " ")}</th>
                        {Object.keys(players).map((p, idx, arr) => {
                          const diff =
                            (stats[type][stat]
                              ? stats[type][stat][p] ?? 0
                              : 0) -
                            (oldStats[type][stat]
                              ? oldStats[type][stat][p] ?? 0
                              : 0);

                          return (
                            <td className={diff === max ? "max" : ""} key={p}>
                              {diff === 0 ? "" : diff > 0 ? "+" : "-"}
                              {stat.indexOf("one_cm") !== -1
                                ? formatCm(diff)
                                : stat.indexOf("time") !== -1 ||
                                  stat.indexOf("minute") !== -1
                                ? formatTime(diff)
                                : diff
                                ? diff.toLocaleString()
                                : ""}
                            </td>
                          );
                        })}
                      </tr>
                    ) : null;
                  })}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Stats;
