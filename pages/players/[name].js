import React from 'react'
import { useRouter } from 'next/router'
import Container from 'components/container'
import Head from 'next/head'
import { customStats } from 'lib/build-stats'
import Link from 'next/link'
import { formatValue, pretty } from 'lib/format'
import { ItemIcon } from 'components/item-icon'

export const PersonalStat = ({
  subtitle,
  title,
  data: { stat, type, value },
}) => {
  const prettyStat = pretty(stat)
  const prettyType = pretty(type)
  const icon = <ItemIcon name={stat} />

  return (
    <article className="personal-stat">
      <h3>{title}</h3>
      <h4>{subtitle}</h4>
      <p>
        {prettyType} {formatValue(stat, value)} {icon}{' '}
        <Link href={`/stats?stat=${stat}`}>
          <a>{prettyStat}</a>
        </Link>
      </p>
    </article>
  )
}

const Session = () => {
  const {
    query: { name },
  } = useRouter()

  if (name) {
    const { hu, gp } = customStats(name)

    return (
      <Container>
        <Head>
          <title>{name} - JCA-MC</title>
        </Head>

        <div className="player">
          <h2>{name}</h2>

          <PersonalStat subtitle="All-time highest unique" data={hu} />

          <PersonalStat subtitle="All-time highest % over others" data={gp} />
        </div>
      </Container>
    )
  }

  return null
}

export default Session
