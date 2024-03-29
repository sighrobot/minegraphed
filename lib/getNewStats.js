import { difference, mapValues } from 'lodash'
const { SESSIONS, PLAYER_IDS } = require('lib/constants')

const getKeysForSession = (players) => {
  const stats = {}

  const playerKeys = Object.keys(players)

  playerKeys.forEach((player) => {
    const statTypes = players[player].stats
    const statTypeKeys = Object.keys(statTypes)

    statTypeKeys
      .sort((a, b) => (a > b ? 1 : -1))
      .forEach((statTypeKey) => {
        const simpleStatTypeKey = statTypeKey.split('minecraft:')[1]

        const playerStats = statTypes[statTypeKey]
        const statKeys = Object.keys(playerStats)

        statKeys.forEach((statKey) => {
          const simpleStatKey = statKey.split('minecraft:')[1]

          if (!stats[`${simpleStatTypeKey}.${simpleStatKey}`]) {
            stats[`${simpleStatTypeKey}.${simpleStatKey}`] = 1
          }
        })
      })
  })

  return Object.keys(stats)
}

export const getNewStats = (season, date) => {
  const currIdx = SESSIONS[season].indexOf(date)
  const prevIdx = currIdx + 1

  const curr = mapValues(PLAYER_IDS, (id) =>
    require(`../stats/${season}/${SESSIONS[season][currIdx]}/${id}.json`),
  )

  const prev = mapValues(PLAYER_IDS, (id) =>
    require(`../stats/${season}/${SESSIONS[season][prevIdx]}/${id}.json`),
  )

  return difference(getKeysForSession(curr), getKeysForSession(prev))
}
