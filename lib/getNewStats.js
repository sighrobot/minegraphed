import { difference } from "lodash";
const { SESSIONS, PLAYER_IDS } = require("./constants");

const getKeysForSession = (players) => {
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

        statKeys.forEach((statKey) => {
          const simpleStatKey = statKey.split("minecraft:")[1];

          if (!stats[`${simpleStatTypeKey}.${simpleStatKey}`]) {
            stats[`${simpleStatTypeKey}.${simpleStatKey}`] = 1;
          }
        });
      });
  });

  return Object.keys(stats);
};

export const getNewStats = (date) => {
  const currIdx = SESSIONS.indexOf(date);
  const prevIdx = currIdx + 1;

  const curr = {
    idovingx: require(`../stats/${SESSIONS[currIdx]}/${PLAYER_IDS.idovingx}.json`),
    CalebCoolest: require(`../stats/${SESSIONS[currIdx]}/${PLAYER_IDS.CalebCoolest}.json`),
    sighrobot: require(`../stats/${SESSIONS[currIdx]}/${PLAYER_IDS.sighrobot}.json`),
  };

  const prev = {
    idovingx: require(`../stats/${SESSIONS[prevIdx]}/${PLAYER_IDS.idovingx}.json`),
    CalebCoolest: require(`../stats/${SESSIONS[prevIdx]}/${PLAYER_IDS.CalebCoolest}.json`),
    sighrobot: require(`../stats/${SESSIONS[prevIdx]}/${PLAYER_IDS.sighrobot}.json`),
  };

  return difference(getKeysForSession(curr), getKeysForSession(prev));
};
