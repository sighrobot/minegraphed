import React from 'react'
import Container from 'components/container'
import NewStats from 'components/new-stats'
import { SESSIONS, PLAYER_IDS } from 'lib/constants'
import Link from 'next/link'
import Head from 'next/head'
import { PersonalStat } from '../players/[season]/[name]'
import { customStats, getMaxByType } from 'lib/build-stats'
import { useRouter } from 'next/router'

const players = Object.keys(PLAYER_IDS)

const Adventure = () => {
  const router = useRouter()
  const { season = 's1' } = router.query

  return (
    <Container season={season} isPadded={false}>
      <Head>
        <title>Adventure Log - JCA-MC</title>
      </Head>

      <h1 style={{ padding: '0 10px' }}>Adventure Log</h1>

      {SESSIONS[season]
        .slice(0, SESSIONS[season].length - 1)
        .map((date, idx) => {
          const dateString = new Date(`${date}T12:00:00-05:00`).toDateString()

          const playersCustomStats = players.map((p) => {
            return customStats(season, p, date, true)
          })

          // const maxByType = getMaxByType(players, playersCustomStats)

          return (
            <details
              open={idx === 0 ? true : undefined}
              key={date}
              className="log-entry"
            >
              <summary>
                <h3>{dateString}</h3>
                {date && <NewStats season={season} date={date} />}
              </summary>

              <section
                style={{
                  display: 'flex',
                  width: '100vw',
                  overflowX: 'auto',
                }}
              >
                {players.map((p, idx) => {
                  const { hu, gp } = playersCustomStats[idx]

                  return (
                    <article
                      key={p}
                      style={{
                        flexShrink: 0,
                        marginRight: '20px',
                        fontSize: '12px',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '14px',
                          margin: 0,
                          marginBottom: '10px',
                        }}
                      >
                        <Link href={`/players/${season}/${p}`}>
                          <a>{p}</a>
                        </Link>
                      </h4>
                      <PersonalStat title="Highest unique" data={hu} />
                      <PersonalStat title="Highest % over others" data={gp} />
                    </article>
                  )
                })}
              </section>

              <div style={{ marginTop: '30px' }}>
                <Link href={`/${season}/stats?date=${date}`}>
                  <a>See full stats for this date</a>
                </Link>
              </div>
            </details>
          )
        })}
    </Container>
  )
}

export default Adventure
