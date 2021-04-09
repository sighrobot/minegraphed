import Container from 'components/container'
import { buildAdv } from 'lib/build-adv'
import { PLAYER_IDS, PLAYER_COLORS } from 'lib/constants'
import { pretty } from 'lib/format'
import { orderBy, startCase } from 'lodash'
import React from 'react'

const adv = buildAdv()

const { min, max } = adv

const players = Object.keys(PLAYER_IDS)

const startDate = new Date(min)
const start = startDate.getTime()
const endDate = new Date(max)
const end = endDate.getTime()
const span = end - start

export default () => {
  const [width, setWidth] = React.useState(0)
  React.useEffect(() => {
    setWidth(Math.min(window.innerWidth, 800))
  }, [])
  const getPos = (t) => {
    const time = new Date(t).getTime()

    return ((time - start) / span) * (width - 12)
  }

  return (
    <Container isPadded={false} useDate>
      <div className="legend">
        {players.map((p) => (
          <div key={p}>
            <mark
              style={{
                display: 'block',
                background: PLAYER_COLORS[players.indexOf(p)],
                height: '12px',
                width: '12px',
              }}
            />
            {p}
          </div>
        ))}
      </div>

      <div className="timeline">
        <div>{startDate.toDateString()}</div>
        <div>{endDate.toDateString()}</div>
      </div>

      <div className="advancements">
        {orderBy(
          Object.keys(adv.stats).filter((a) => !a.startsWith('recipes/')),
          (k) => {
            const firstKey = Object.keys(adv.stats[k].criteria)[0]
            const firstPlayer = Object.keys(adv.stats[k].criteria[firstKey])[0]
            return adv.stats[k].criteria[firstKey][firstPlayer]
          },
          'desc',
        ).map((k) => {
          const { criteria } = adv.stats[k]
          const cKeys = Object.keys(criteria)
          const niceK = k.split('/')[1]

          return (
            <div className="advancement" key={k}>
              <div className="advancement-name">
                {niceK !== 'root'
                  ? startCase(pretty(niceK))
                  : startCase(pretty(cKeys[0]))}
                {niceK !== 'root' &&
                  cKeys.length === 1 &&
                  !niceK.includes(cKeys[0]) &&
                  !cKeys[0].includes(niceK) &&
                  ` (${pretty(cKeys[0])})`}
              </div>

              {orderBy(
                Object.keys(criteria),
                (c) => criteria[c][Object.keys(criteria[c])[0]],
                'desc',
              ).map((c, _, arr) => {
                return (
                  <div key={c} className="criterion">
                    {arr.length > 1 && (
                      <div className="criterion-name">
                        {startCase(pretty(c))}
                      </div>
                    )}
                    <div className="criterion-collection">
                      {Object.keys(criteria[c]).map((p, idx) => {
                        return (
                          <mark
                            key={p}
                            style={{
                              left: `${getPos(criteria[c][p])}px`,
                              top: `${8 + idx * 3}px`,
                              background: PLAYER_COLORS[players.indexOf(p)],
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </Container>
  )
}
