import Link from 'next/link'
import { useRouter } from 'next/router'
import DateFilter from './date-filter'

const Container = ({ children, isPadded = true, useDate = false }) => {
  const router = useRouter()
  const [date, setDate] = React.useState(router.query.date ?? 'all')

  return (
    <main>
      <header>
        <nav>
          <Link href="/">
            <a className={router.pathname === '/' ? 'active' : ''}>
              Adventure Log
            </a>
          </Link>{' '}
          |{' '}
          <Link href="/stats">
            <a className={router.pathname === '/stats' ? 'active' : ''}>
              Game Stats
            </a>
          </Link>
        </nav>

        {useDate && <DateFilter date={date} onChange={setDate} />}
      </header>

      <section style={{ padding: isPadded ? '0 10px' : '0' }}>
        {typeof children === 'function'
          ? children({ date, setDate })
          : children}
      </section>
    </main>
  )
}

export default Container
