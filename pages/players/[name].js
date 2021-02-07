import React from 'react'
import { useRouter } from 'next/router'
import Container from 'components/container'
import { PLAYER_IDS, SESSIONS } from 'lib/constants'
import { customStats } from 'lib/build-stats'
import Link from 'next/link'
import { getImgSrc } from 'lib/items'
import { formatValue, pretty } from 'lib/format'

export const PersonalStat = ({
  subtitle,
  title,
  data: { stat, type, value },
}) => {
  const prettyStat = pretty(stat)
  const prettyType = pretty(type)
  const imgSrc = getImgSrc(prettyStat)
  const icon = imgSrc ? <img src={imgSrc} /> : null

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