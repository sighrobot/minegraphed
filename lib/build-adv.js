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

          const rawD = playerStats.criteria[statKey] //2020-05-23 21:50:47 +0000;
          const sp = rawD.split(' ')
          const d = `${sp[0]}T${sp[1]}${sp[2]}`

          sessionMap[d.slice(0, 10)] = 1

          if (d < min) {
            min = d
          }

          if (d > max) {
            max = d
          }

          if (stats[simpleStatTypeKey].criteria[simpleStatKey]) {
            stats[simpleStatTypeKey].criteria[simpleStatKey][player] = d
          } else {
            stats[simpleStatTypeKey].criteria[simpleStatKey] = {
              [player]: d,
            }
          }
        })
      }
    })
  })

  return { stats, min, max, sessions: orderBy(Object.keys(sessionMap)) }
}
