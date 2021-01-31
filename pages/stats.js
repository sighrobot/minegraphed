import React from "react";
const { formatCm, formatTime } = require("../lib/format");
import Container from "../components/container";
import Seg from "../components/seg";
import Table from "../components/table";
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

const Stats = () => {
  const [value, setValue] = React.useState("");
  const statTypes = Object.keys(stats);
  const handleChange = (e) => setValue(e.target.value);
  const [type, setType] = React.useState("all");
  const handleSelectStatType = (e) => setType(e.target.name);

  return (
    <Container isPadded={false}>
      <div style={{ padding: "0 20px" }}>
        <h2>All-time</h2>
      </div>

      <div className="sticky">
        <input
          type="search"
          value={value}
          placeholder="Search stats by name or type..."
          onChange={handleChange}
        />

        <Seg
          type={type}
          statTypes={statTypes}
          onChange={handleSelectStatType}
        />
      </div>

      <Table
        type={type}
        players={players}
        statTypes={statTypes}
        stats={stats}
        value={value}
      />
    </Container>
  );
};

export default Stats;
