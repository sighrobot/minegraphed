import { mapValues, orderBy } from 'lodash'
const { PLAYER_IDS } = require('lib/constants')

export const buildAdv = () => {
  const players = mapValues(PLAYER_IDS, (id) =>
    require(`../advancements/${id}.json`),
  )

  const stats = {}

  const playerKeys = Object.keys(players)

  let min = new Date().toISOString()
  let max = '1899-01-01'
  const sessionMap = {}

  playerKeys.forEach((player) => {
    const statTypes = players[player]
    const statTypeKeys = Object.keys(statTypes)

    statTypeKeys.forEach((statTypeKey) => {
      const simpleStatTypeKey = statTypeKey.replace(/minecraft:/g, '')

      if (simpleStatTypeKey !== 'DataVersion') {
        const playerStats = statTypes[statTypeKey]
        const statKeys = Object.keys(playerStats.criteria || {})

        if (!stats[simpleStatTypeKey]) {
          stats[simpleStatTypeKey] = { criteria: {} }
        }

        if (stats[simpleStatTypeKey].done) {
          stats[simpleStatTypeKey].done[player] = playerStats.done
        } else {
          stats[simpleStatTypeKey].done = { [player]: playerStats.done }
        }

        statKeys.forEach((statKey) => {
          const simpleStatKey = statKey.replace(/minecraft:/g, '')

          sessionMap[playerStats.criteria[statKey].slice(0, 10)] = 1

          if (playerStats.criteria[statKey] < min) {
            min = playerStats.criteria[statKey]
          }

          if (playerStats.criteria[statKey] > max) {
            max = playerStats.criteria[statKey]
          }

          if (stats[simpleStatTypeKey].criteria[simpleStatKey]) {
            stats[simpleStatTypeKey].criteria[simpleStatKey][player] =
              playerStats.criteria[statKey]
          } else {
            stats[simpleStatTypeKey].criteria[simpleStatKey] = {
              [player]: playerStats.criteria[statKey],
            }
          }
        })
      }
    })
  })

  return { stats, min, max, sessions: orderBy(Object.keys(sessionMap)) }
}
