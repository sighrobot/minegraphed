import React from "react";

const itemsByName = require("../lib/itemsByName.json");
const { formatCm, formatTime } = require("../lib/format");

const Style = () => {
  return (
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
                width: 100%;
            }

            table {
              font-size: 14px;
                width: 100%;
                border-collapse: collapse;
            }

            th:first-child {
                font-size: 10px;
            }

            th:nth-child(2) {
                font-size: 14px;
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
  );
};

export const Table = ({ players, stats, statTypes, oldStats, value }) => {
  if (oldStats) {
    return (
      <>
        <Style />

        <table className="table">
          <tbody>
            {statTypes.map((type) => {
              return (
                <>
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

                      const prettyName = stat.replace(/_/g, " ");
                      const imgSrc = itemsByName[prettyName]?.icon;
                      const icon = imgSrc && (
                        <img src={`data:image/png;base64,${imgSrc}`} />
                      );

                      return max !== 0 ? (
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
      </>
    );
  }

  return (
    <>
      <Style />

      <table className="table">
        <tbody>
          {statTypes.map((type) => {
            return (
              <>
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
    </>
  );
};

export default Table;
