const { SESSIONS, PLAYER_IDS } = require('lib/constants')

export const buildSeriesForPlayer = (p) => {
  const totals = {}
  const diffs = {}

  const sessions = SESSIONS.slice().reverse()

  sessions
    .map((date) => require(`../stats/${date}/${PLAYER_IDS[p]}.json`))
    .forEach(({ stats: byType }, si) => {
      const types = Object.keys(byType)

      types.forEach((type) => {
        const simpleType = type.split('minecraft:')[1]

        const stats = Object.keys(byType[type])

        stats.forEach((stat) => {
          const value = byType[type][stat]
          const simpleStat = stat.split('minecraft:')[1]

          const simpleKey = `${simpleType}:${simpleStat}`
          const date = sessions[si]

          if (totals[simpleKey]) {
            totals[simpleKey].push([date, value])

            if (totals[simpleKey][totals[simpleKey].length - 2] !== undefined) {
              const diff =
                value - totals[simpleKey][totals[simpleKey].length - 2][1]

              diffs[simpleKey].push([date, diff])
            }
          } else {
            const arr = []

            for (let i = 0; i < si; i++) {
              arr.push([sessions[i], 0])
            }

            totals[simpleKey] = [...arr, [date, value]]

            diffs[simpleKey] = [...arr.slice(1)]

            if (totals[simpleKey][totals[simpleKey].length - 2] !== undefined) {
              const diff =
                value - totals[simpleKey][totals[simpleKey].length - 2][1]

              diffs[simpleKey].push([date, diff])
            }
          }
        })
      })
    })

  return { totals, diffs }
}

export const buildSeriesForPlayers = () => {
  const ids = Object.keys(PLAYER_IDS)
  const data = {}

  ids.forEach((p) => {
    data[p] = buildSeriesForPlayer(p)
  })

  return data
}
