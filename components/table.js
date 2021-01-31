import React from "react";

const itemsByName = require("../lib/itemsByName.json");
const { formatCm, formatTime } = require("../lib/format");

const Style = () => {
  return (
    <style>{`
            table {
              font-size: 14px;
                width: 100%;
                border-collapse: collapse;
            }

            tbody tr:not(.heading):nth-child(2n+1) {
                background: rgba(0, 0, 0, 0.025);
            }

            th, td {
                padding: 10px;
            }

            td:first-child {
              padding: 0;
              padding-left: 5px;
            }

            td + th {
              padding-left: 5px;
            }

            td:first-child img {
              height: 20px;
              width: 20px;
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
  );
};

export const Table = ({
  type: typeFilter,
  players,
  stats,
  statTypes,
  oldStats,
  value,
}) => {
  const table = oldStats ? (
    <table className="table">
      <tbody>
        {statTypes
          .filter((t) => typeFilter === t || typeFilter === "all")
          .map((type) => {
            return (
              <>
                {Object.keys(stats[type])
                  .sort((a, b) => (a > b ? 1 : -1))
                  .filter((stat) => stat.indexOf(value.toLowerCase()) !== -1)
                  .length > 0 ? (
                  <tr className="heading">
                    <th colSpan={2}>
                      {typeFilter === "all" ? type.replace("_", " ") : ""}
                    </th>
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

                    const prettyName = stat.replace(/_/g, " ");
                    const imgSrc = itemsByName[prettyName]?.icon;
                    const icon = imgSrc && (
                      <img src={`data:image/png;base64,${imgSrc}`} />
                    );

                    return max !== 0 ? (
                      <tr key={stat}>
                        <td>{icon}</td>

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
                                ? diff
                                  ? formatCm(diff)
                                  : "-"
                                : stat.indexOf("time") !== -1 ||
                                  stat.indexOf("minute") !== -1
                                ? formatTime(diff)
                                : diff
                                ? diff.toLocaleString()
                                : "-"}
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
  ) : (
    <table className="table">
      <tbody>
        {statTypes
          .filter((t) => typeFilter === t || typeFilter === "all")
          .map((type) => {
            return (
              <>
                {Object.keys(stats[type])
                  .sort((a, b) => (a > b ? 1 : -1))
                  .filter((stat) => stat.indexOf(value.toLowerCase()) !== -1)
                  .length > 0 ? (
                  <tr className="heading">
                    <th colSpan={2}>
                      {typeFilter === "all" ? type.replace("_", " ") : ""}
                    </th>
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
                        <td>{icon}</td>
                        <th>{stat.replace(/_/g, " ")}</th>

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
  );

  return (
    <>
      <Style />

      {table}
    </>
  );
};

export default Table;
