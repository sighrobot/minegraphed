import React from 'react'
import Container from 'components/container'
import NewStats from 'components/new-stats'
import { SESSIONS, PLAYER_IDS } from 'lib/constants'
import Link from 'next/link'
import { PersonalStat } from './players/[name]'
import { customStats } from 'lib/build-stats'

const players = Object.keys(PLAYER_IDS)

const Adventure = () => {
  return (
    <Container isPadded={false}>
      <h1 style={{ padding: '0 10px' }}>Adventure Log</h1>

      {SESSIONS.slice(0, SESSIONS.length - 1).map((date) => {
        const dateString = new Date(`${date}T12:00:00-05:00`).toDateString()

        return (
          <article key={date} className="log-entry">
            <h3>{dateString}</h3>

            <Link href={`/stats?date=${date}`}>
              <a>Stats for this date</a>
            </Link>

            {date && <NewStats date={date} />}

            <section
              style={{ display: 'flex', width: '100vw', overflowX: 'auto' }}
            >
              {players.map((p) => {
                const { hu, gp } = customStats(p, date, true)

                return (
                  <article
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
                      <Link href={`/players/${p}`}>
                        <a>{p}</a>
                      </Link>
                    </h4>
                    <PersonalStat title="Highest unique" data={hu} />
                    <PersonalStat title="Highest % over others" data={gp} />
                  </article>
                )
              })}
            </section>
          </article>
        )
      })}
    </Container>
  )
}

export default Adventure
