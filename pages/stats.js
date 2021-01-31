import React from "react";
import Container from "../components/container";
import Seg from "../components/seg";
import DateFilter from "../components/date-filter";

import Table from "../components/table";
import StatsDiff from "../components/statsdiff";
const { SESSIONS, PLAYER_IDS } = require("../lib/constants");

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

const Stats = () => {
  const [value, setValue] = React.useState("");
  const statTypes = Object.keys(stats);
  const handleChange = (e) => setValue(e.target.value);
  const [type, setType] = React.useState("all");
  const handleSelectStatType = (e) => setType(e.target.name);
  const [date, setDate] = React.useState("all");

  return (
    <Container isPadded={false}>
      <div className="sticky">
        <div className="inputs">
          <DateFilter date={date} onChange={setDate} />

          <input
            type="search"
            value={value}
            placeholder="Search stats"
            onChange={handleChange}
          />
        </div>
        <Seg
          stats={stats}
          type={type}
          statTypes={statTypes}
          onChange={handleSelectStatType}
        />
      </div>

      {date === "all" ? (
        <Table
          type={type}
          players={players}
          statTypes={statTypes}
          stats={stats}
          value={value}
        />
      ) : (
        <StatsDiff value={value} date={date} type={type} />
      )}
    </Container>
  );
};

export default Stats;
