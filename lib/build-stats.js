import { mapValues } from 'lodash'
const { SESSIONS, PLAYER_IDS } = require('lib/constants')

export const buildStats = (date) => {
  if (!date) return {}

  const currIdx = SESSIONS.indexOf(date)

  const players = mapValues(PLAYER_IDS, (id) =>
    require(`../stats/${SESSIONS[currIdx]}/${id}.json`),
  )

  const stats = {}

  const playerKeys = Object.keys(players)

  playerKeys.forEach((player) => {
    const statTypes = players[player].stats
    const statTypeKeys = Object.keys(statTypes)

    statTypeKeys.forEach((statTypeKey) => {
      const simpleStatTypeKey = statTypeKey.split('minecraft:')[1]

      const playerStats = statTypes[statTypeKey]
      const statKeys = Object.keys(playerStats)

      if (!stats[simpleStatTypeKey]) {
        stats[simpleStatTypeKey] = {}
      }

      statKeys.forEach((statKey) => {
        const simpleStatKey = statKey.split('minecraft:')[1]

        if (stats[simpleStatTypeKey][simpleStatKey]) {
          stats[simpleStatTypeKey][simpleStatKey][player] = playerStats[statKey]
        } else {
          stats[simpleStatTypeKey][simpleStatKey] = {
            [player]: playerStats[statKey],
          }
        }
      })
    })
  })

  return stats
}

export const buildStatsDiff = (toDate, fromDate) => {
  if (!toDate) return {}

  const currIdx = SESSIONS.indexOf(toDate)
  const prevIdx = fromDate ? SESSIONS.indexOf(fromDate) : currIdx + 1

  const players = mapValues(PLAYER_IDS, (id) =>
    require(`../stats/${SESSIONS[currIdx]}/${id}.json`),
  )

  const oldPlayers = mapValues(PLAYER_IDS, (id) =>
    require(`../stats/${SESSIONS[prevIdx]}/${id}.json`),
  )

  const stats = {}
  const oldStats = {}

  const playerKeys = Object.keys(players)

  playerKeys.forEach((player) => {
    const statTypes = players[player].stats
    const statTypeKeys = Object.keys(statTypes)

    statTypeKeys.forEach((statTypeKey) => {
      const simpleStatTypeKey = statTypeKey.split('minecraft:')[1]

      const playerStats = statTypes[statTypeKey]
      const statKeys = Object.keys(playerStats)

      if (!stats[simpleStatTypeKey]) {
        stats[simpleStatTypeKey] = {}
      }

      statKeys.forEach((statKey) => {
        const simpleStatKey = statKey.split('minecraft:')[1]

        if (stats[simpleStatTypeKey][simpleStatKey]) {
          stats[simpleStatTypeKey][simpleStatKey][player] = playerStats[statKey]
        } else {
          stats[simpleStatTypeKey][simpleStatKey] = {
            [player]: playerStats[statKey],
          }
        }
      })
    })
  })

  const oldPlayerKeys = Object.keys(oldPlayers)

  oldPlayerKeys.forEach((player) => {
    const statTypes = oldPlayers[player].stats
    const statTypeKeys = Object.keys(statTypes)

    statTypeKeys.forEach((statTypeKey) => {
      const simpleStatTypeKey = statTypeKey.split('minecraft:')[1]

      const playerStats = statTypes[statTypeKey]
      const statKeys = Object.keys(playerStats)

      if (!oldStats[simpleStatTypeKey]) {
        oldStats[simpleStatTypeKey] = {}
      }

      statKeys.forEach((statKey) => {
        const simpleStatKey = statKey.split('minecraft:')[1]

        if (oldStats[simpleStatTypeKey][simpleStatKey]) {
          oldStats[simpleStatTypeKey][simpleStatKey][player] =
            playerStats[statKey]
        } else {
          oldStats[simpleStatTypeKey][simpleStatKey] = {
            [player]: playerStats[statKey],
          }
        }
      })
    })
  })

  Object.keys(stats).forEach((statType) => {
    Object.keys(stats[statType]).forEach((stat) => {
      Object.keys(stats[statType][stat]).forEach((p) => {
        const diff =
          (stats[statType][stat][p] ?? 0) -
          (oldStats[statType] && oldStats[statType][stat]
            ? oldStats[statType][stat][p] ?? 0
            : 0)

        if (diff === 0) {
          delete stats[statType][stat][p]
        } else {
          stats[statType][stat][p] = diff
        }
      })

      if (Object.keys(stats[statType][stat]).length === 0) {
        delete stats[statType][stat]
      }
    })
  })

  return stats
}

export const customStats = (name, date = SESSIONS[0], isDiff = false) => {
  const stats = (isDiff ? buildStatsDiff : buildStats)(date)

  const only = {}
  const all = {}

  const statKeys = Object.keys(stats)

  const countsByType = {}

  statKeys.forEach((statKey) => {
    const byType = stats[statKey]
    const typeKeys = Object.keys(byType)

    let count = 0

    typeKeys.forEach((typeKey) => {
      const stat = byType[typeKey]
      if (Object.keys(stat).length === 1 && stat[name]) {
        only[`${statKey}.${typeKey}`] = stat
      }

      if (stat[name] !== undefined) {
        count++
      }

      all[`${statKey}.${typeKey}`] = stat
    })

    countsByType[statKey] = count
  })

  const hu = { stat: '' }

  Object.keys(only).forEach((o) => {
    if (!hu.value || hu.value < only[o][name]) {
      hu.value = only[o][name]
      hu.stat = o
    }
  })

  let gp = { stat: '' }

  Object.keys(all).forEach((a) => {
    if (a.includes('crouch') || a.includes('sneak')) return

    const ps = Object.keys(all[a]).filter((n) => n !== name)
    const myValue = all[a][name] ?? 0

    let playerMax = 0

    if (Object.keys(PLAYER_IDS).every((p) => all[a][p])) {
      ps.forEach((p) => {
        playerMax = Math.max(all[a][p], playerMax)
      })

      const pct = (myValue / playerMax) * 100

      if (playerMax !== 0 && (!gp.value || gp.pct < pct)) {
        gp.value = all[a][name]
        gp.pct = pct
        gp.stat = a
      }
    }
  })

  const [huType, huStat] = hu.stat.split('.')
  const [gpType, gpStat] = gp.stat.split('.')

  return {
    hu: { type: huType, stat: huStat, value: hu.value },
    gp: { stat: gpStat, type: gpType, value: gp.value },
    countsByType,
  }
}

export const getMaxByType = (players, customStats) => {
  const maxByType = {}

  customStats.forEach((c, ci) => {
    Object.keys(c.countsByType).forEach((t) => {
      if (maxByType[t]) {
        if (maxByType[t].value < c.countsByType[t]) {
          maxByType[t] = { value: c.countsByType[t], p: players[ci] }
        }
      } else {
        maxByType[t] = { value: c.countsByType[t], p: players[ci] }
      }
    })
  })

  return maxByType
}
