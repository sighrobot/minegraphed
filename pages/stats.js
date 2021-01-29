import React from "react";
import { formatDistance } from "date-fns";
import Container from "../components/container";
const { SESSIONS, PLAYER_IDS } = require("../lib/constants");
const itemsByName = require("../lib/itemsByName.json");

const jesse = require(`../stats/${SESSIONS[0]}/${PLAYER_IDS.jesse}.json`);
const caleb = require(`../stats/${SESSIONS[0]}/${PLAYER_IDS.caleb}.json`);
const abe = require(`../stats/${SESSIONS[0]}/${PLAYER_IDS.abe}.json`);

const players = {
  caleb,
  jesse,
  abe,
};

const stats = {};

const playerKeys = Object.keys(players);

playerKeys.forEach((player) => {
  const statTypes = players[player].stats;
  const statTypeKeys = Object.keys(statTypes);

  statTypeKeys
    .sort((a, b) => (a > b ? 1 : -1))
    .forEach((statTypeKey) => {
      const simpleStatTypeKey = statTypeKey.split("minecraft:")[1];

      const playerStats = statTypes[statTypeKey];
      const statKeys = Object.keys(playerStats);

      if (!stats[simpleStatTypeKey]) {
        stats[simpleStatTypeKey] = {};
      }

      statKeys.forEach((statKey) => {
        const simpleStatKey = statKey.split("minecraft:")[1];

        if (stats[simpleStatTypeKey][simpleStatKey]) {
          stats[simpleStatTypeKey][simpleStatKey][player] =
            playerStats[statKey];
        } else {
          stats[simpleStatTypeKey][simpleStatKey] = {
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
  return formatDistance(0, n * 60).replace(/about /g, "");
};

const Stats = () => {
  const [value, setValue] = React.useState("");
  const statTypes = Object.keys(stats);
  const handleChange = (e) => setValue(e.target.value);

  return (
    <Container>
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
                input {
                  margin-top: 30px;
                    position: sticky;
                    top: 0;
                    width: 100%;
                    padding: 20px 10px;
                    font-family: inherit;
                    border: none;
                    outline: 0;
                    font-size: 16px;
                    border: 1px solid black;
                }

                table {
                  font-size: 12px;
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
                      (p) => stats[type][stat][p] ?? 0
                    );
                    const max = Math.max(...normal);

                    const prettyName = stat.replace(/_/g, " ");
                    const imgSrc = itemsByName[prettyName]?.icon;
                    const icon = imgSrc && (
                      <img src={`data:image/png;base64,${imgSrc}`} />
                    );

                    return (
                      <tr key={stat}>
                        <th className="subheading">
                          {type.replace(/_/g, " ")}
                        </th>
                        <th>
                          <div className="stats-item">
                            {icon}
                            {stat.replace(/_/g, " ")}
                          </div>
                        </th>
                        {Object.keys(players).map((p, idx, arr) => {
                          return (
                            <td
                              className={
                                stats[type][stat][p] === max ? "max" : ""
                              }
                              key={p}
                            >
                              {stat.indexOf("one_cm") !== -1
                                ? formatCm(stats[type][stat][p])
                                : stat.indexOf("time") !== -1 ||
                                  stat.indexOf("minute") !== -1
                                ? formatTime(stats[type][stat][p])
                                : stats[type][stat][p]
                                ? stats[type][stat][p].toLocaleString()
                                : "-"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
};

export default Stats;
