import React from "react";
import Seg from "./seg";
import Table from "./table";
const { formatCm, formatTime } = require("../lib/format");
const { SESSIONS, PLAYER_IDS } = require("../lib/constants");
const itemsByName = require("../lib/itemsByName.json");

const buildStats = (date) => {
  if (!date) return { stats: {}, players: {}, oldStats: {} };

  const currIdx = SESSIONS.indexOf(date);
  const prevIdx = currIdx + 1;

  const jesse = require(`../stats/${SESSIONS[currIdx]}/${PLAYER_IDS.jesse}.json`);
  const caleb = require(`../stats/${SESSIONS[currIdx]}/${PLAYER_IDS.caleb}.json`);
  const abe = require(`../stats/${SESSIONS[currIdx]}/${PLAYER_IDS.abe}.json`);

  const players = {
    caleb,
    jesse,
    abe,
  };

  const oldPlayers = {
    caleb: require(`../stats/${SESSIONS[prevIdx]}/${PLAYER_IDS.caleb}.json`),
    jesse: require(`../stats/${SESSIONS[prevIdx]}/${PLAYER_IDS.jesse}.json`),
    abe: require(`../stats/${SESSIONS[prevIdx]}/${PLAYER_IDS.abe}.json`),
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
  return { stats, oldStats, players };
};

const Stats = ({ date }) => {
  const [value, setValue] = React.useState("");
  const { stats, oldStats, players } = buildStats(date);
  const statTypes = Object.keys(stats);
  const handleChange = (e) => setValue(e.target.value);
  const [type, setType] = React.useState("all");
  const handleSelectStatType = (e) => setType(e.target.name);

  return (
    <div>
      <div className="sticky">
        <input
          type="search"
          value={value}
          placeholder="Search stats"
          onChange={handleChange}
        />

        <Seg
          stats={stats}
          type={type}
          statTypes={statTypes}
          onChange={handleSelectStatType}
        />
      </div>

      <Table
        type={type}
        stats={stats}
        statTypes={statTypes}
        oldStats={oldStats}
        players={players}
        value={value}
      />
    </div>
  );
};

export default Stats;
