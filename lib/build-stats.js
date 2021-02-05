import { difference } from "lodash";

const { SESSIONS, PLAYER_IDS } = require("lib/constants");

export const buildStats = (date) => {
  if (!date) return { stats: {}, players: {}, oldStats: {} };

  const currIdx = SESSIONS.indexOf(date);
  const prevIdx = currIdx + 1;

  const idovingx = require(`../stats/${SESSIONS[currIdx]}/${PLAYER_IDS.idovingx}.json`);
  const CalebCoolest = require(`../stats/${SESSIONS[currIdx]}/${PLAYER_IDS.CalebCoolest}.json`);
  const sighrobot = require(`../stats/${SESSIONS[currIdx]}/${PLAYER_IDS.sighrobot}.json`);

  const players = {
    CalebCoolest,
    idovingx,
    sighrobot,
  };

  const oldPlayers = {
    CalebCoolest: require(`../stats/${SESSIONS[prevIdx]}/${PLAYER_IDS.CalebCoolest}.json`),
    idovingx: require(`../stats/${SESSIONS[prevIdx]}/${PLAYER_IDS.idovingx}.json`),
    sighrobot: require(`../stats/${SESSIONS[prevIdx]}/${PLAYER_IDS.sighrobot}.json`),
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

  const newStatKeys = difference(Object.keys(stats), Object.keys(oldStats));

  return { stats, oldStats, players, newStatKeys };
};
