import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import DateFilter from './date-filter'

const Container = ({
  season,
  children,
  isPadded = true,
  useDate = false,
  hideHeader,
}) => {
  const router = useRouter()

  const [date, setDate] = React.useState(router.query.date ?? 'all')

  console.log({ date })

  React.useEffect(() => {
    setDate('all')
  }, [season])

  console.log(router)

  const handleChangeSeason = (e) =>
    router.push(router.asPath.replace(/s\d/, e.target.value))

  return (
    <main>
      {!hideHeader && (
        <header>
          {season && (
            <div className="date-filter">
              <select
                style={{ background: 'purple', color: 'white' }}
                onChange={handleChangeSeason}
                value={season}
              >
                <option value="s1">Season 1</option>
                <option value="s2">Season 2</option>
              </select>
            </div>
          )}

          <nav>
            <Link href={`/${season}`}>
              <a className={router.asPath === `/${season}` ? 'active' : ''}>
                Log
              </a>
            </Link>{' '}
            |{' '}
            <Link href={`/${season}/stats`}>
              <a
                className={router.asPath === `/${season}/stats` ? 'active' : ''}
              >
                Stats
              </a>
            </Link>{' '}
            |{' '}
            <Link href={`/${season}/advancements`}>
              <a
                className={
                  router.asPath === `/${season}/advancements` ? 'active' : ''
                }
              >
                Advancement
              </a>
            </Link>
          </nav>
          {useDate ? (
            <DateFilter season={season} date={date} onChange={setDate} />
          ) : (
            <div style={{ flexShrink: 0 }} />
          )}
        </header>
      )}

      <section style={{ padding: isPadded ? '0 10px' : '0' }}>
        {typeof children === 'function'
          ? children({ date, setDate })
          : children}
      </section>
    </main>
  )
}

export default Container
