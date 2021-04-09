import React from 'react'
import Container from 'components/container'
import Seg from 'components/seg'
import Head from 'next/head'

import Table from 'components/table'
import { buildStats, buildStatsDiff } from 'lib/build-stats'
import { pretty } from 'lib/format'
import { ItemIcon } from 'components/item-icon'
const { SESSIONS } = require('lib/constants')

const Stats = ({ date, setDate }) => {
  const [value, setValue] = React.useState('')
  const handleChange = (e) => setValue(e.target.value)
  const [type, setType] = React.useState('all')
  const handleSelectStatType = (e) => setType(e.target.name)

  const [sort, setSort] = React.useState('')
  const [sortDir, setSortDir] = React.useState('desc')
  const stat = ''

  const prettyStat = pretty(stat)

  const handleRemoveStat = () => {
    setStat('')
  }

  const handleSort = (name, dir) => {
    setSort(name)
    setSortDir(dir)
  }

  return (
    <Container isPadded={false} useDate>
      {({ date, setDate }) => {
        const stats = React.useMemo(
          () =>
            (date !== 'all' ? buildStatsDiff : buildStats)(
              date === 'all' ? SESSIONS[0] : date,
            ),
          [date],
        )
        const statTypes = React.useMemo(() => Object.keys(stats), [stats])

        return (
          <>
            <Head>
              <title>
                {stat ? `${prettyStat} - ` : ''}{' '}
                {date ? `${date === 'all' ? 'All-time' : date} - ` : ''}JCA-MC
              </title>
            </Head>
            <div className="sticky">
              <input
                className={value ? 'active' : ''}
                type="search"
                value={value}
                placeholder="Search stats"
                onChange={handleChange}
              />

              <div className="inputs">
                {stat && (
                  <button className="stat-token" onClick={handleRemoveStat}>
                    <div>
                      <ItemIcon name={stat} />
                      {prettyStat}
                    </div>
                  </button>
                )}
              </div>

              <Seg
                search={value}
                stat={stat}
                stats={stats}
                type={type}
                statTypes={statTypes}
                onChange={handleSelectStatType}
              />
            </div>

            <Table
              type={type}
              stats={stats}
              statTypes={statTypes}
              value={value}
              currStat={stat}
              isDiff={date !== 'all'}
              handleSort={handleSort}
              sort={sort}
              sortDir={sortDir}
            />
          </>
        )
      }}
    </Container>
  )
}

export default Stats
