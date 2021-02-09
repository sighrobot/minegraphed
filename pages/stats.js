import React from 'react'
import Container from 'components/container'
import Seg from 'components/seg'
import DateFilter from 'components/date-filter'
import { useRouter } from 'next/router'
import Head from 'next/head'

import Table from 'components/table'
import { buildStats, buildStatsDiff } from 'lib/build-stats'
import { getImgSrc } from 'lib/items'
import { pretty } from 'lib/format'
const { SESSIONS } = require('lib/constants')

const Stats = () => {
  const router = useRouter()
  const [value, setValue] = React.useState('')
  const handleChange = (e) => setValue(e.target.value)
  const [type, setType] = React.useState('all')
  const handleSelectStatType = (e) => setType(e.target.name)
  const [date, setDate] = React.useState(router.query.date ?? 'all')
  const [stat, setStat] = React.useState(router.query.stat ?? '')
  const [sort, setSort] = React.useState('')
  const [sortDir, setSortDir] = React.useState('desc')

  const stats = React.useMemo(
    () =>
      (date !== 'all' ? buildStatsDiff : buildStats)(
        date === 'all' ? SESSIONS[0] : date,
      ),
    [date],
  )
  const statTypes = React.useMemo(() => Object.keys(stats), [stats])

  const statKeys = React.useMemo(() => {
    const keys = {}

    statTypes.forEach((statTypeKey) => {
      Object.keys(stats[statTypeKey]).forEach((s) => {
        keys[pretty(s)] = 1
      })
    })

    return Object.keys(keys).sort((a, b) => (a > b ? 1 : -1))
  }, [statTypes])

  React.useEffect(() => {
    let path = '/stats?'

    if (date !== 'all') {
      path += `&date=${date}`
    }

    if (stat) {
      path += `&stat=${stat}`
    }

    router.replace(path)
  }, [date, stat])

  React.useEffect(() => {
    if (router.query.date) {
      setDate(router.query.date)
    }

    if (router.query.stat) {
      setStat(router.query.stat)
    }
  }, [router.query.date, router.query.stat])

  const prettyStat = pretty(stat)

  const handleRemoveStat = () => {
    setStat('')
  }

  const handleSort = (name, dir) => {
    setSort(name)
    setSortDir(dir)
  }

  const imgSrc = getImgSrc(prettyStat)

  return (
    <Container isPadded={false}>
      <Head>
        <title>
          {stat ? `${prettyStat} - ` : ''}{' '}
          {date ? `${date === 'all' ? 'All-time' : date} - ` : ''}JCA-MC
        </title>
      </Head>
      <div className="sticky">
        <input
          list={value.length > 2 ? 'options' : undefined}
          className={value ? 'active' : ''}
          type="search"
          value={value}
          placeholder="Search stats"
          onChange={handleChange}
        />

        <datalist id="options">
          {statKeys.map((sk) => (
            <option key={sk} value={sk} />
          ))}
        </datalist>

        <div className="inputs">
          <DateFilter date={date} onChange={setDate} />

          {stat && (
            <button className="stat-token" onClick={handleRemoveStat}>
              <div>
                {imgSrc && <img src={imgSrc} />}
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
    </Container>
  )
}

export default Stats
