import React from 'react'
import * as echarts from 'echarts'
import { useRouter } from 'next/router'
import Container from 'components/container'
import Head from 'next/head'
import { buildSeriesForPlayer, buildSeriesForPlayers } from 'lib/build-series'
import Link from 'next/link'
import { formatValue, pretty } from 'lib/format'
import { ItemIcon } from 'components/item-icon'
import Seg from 'components/seg'
const { SESSIONS } = require('lib/constants')

const { totals: series, diffs } = buildSeriesForPlayer('sighrobot')
const bsfp = buildSeriesForPlayers()

let myChart

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

const Stat = () => {
  const {
    query: { stat },
  } = useRouter()

  const types = React.useMemo(() => {
    const dict = {}

    Object.keys(bsfp).forEach((p) => {
      Object.keys(bsfp[p].totals).forEach((t) => {
        if (t.endsWith(`:${stat}`)) {
          dict[t.split(':')[0]] = 1
        }
      })
    })

    return Object.keys(dict)
  }, [stat])

  const [type, setType] = React.useState(types[0])

  const dataset = React.useMemo(() => {
    const dimensions = ['date']
    let source

    Object.keys(bsfp).map((p) => {
      dimensions.push(p)
      const ps = bsfp[p].diffs[`${type}:${stat}`] ?? []

      if (source) {
        ps.forEach((pps, i) => {
          if (source[i]) {
            source[i].push(pps[1])
          } else {
            source[i] = [...pps]
          }
        })

        if (ps.length === 0) {
          source.forEach((s) => {
            s.push(0)
          })
        }
      } else {
        source = [...ps]

        if (ps.length === 0) {
          source = [...SESSIONS]
            .reverse()
            .slice()
            .map((d) => [d, 0])
          // this has to be one less item when 'diffs' is used
          // but now it seems to work regardless?
        }
      }
    })

    return { source, dimensions }
  }, [stat, type])

  const handleChange = (e) => setType(e.target.name)

  React.useEffect(() => {
    if (!type) {
      setType(types[0])
    }

    myChart = myChart || echarts.init(document.getElementById('viz'))

    myChart.setOption({
      textStyle: { fontFamily: 'minecraft', fontSize: '10px' },
      xAxis: {
        type: 'time',
        axisLine: { show: false },
        axisLabel: {
          fontSize: '10px',
        },
      },

      dataset,

      yAxis: {
        minInterval: 1,
        splitNumber: 2,
        lineStyle: null,
        splitLine: { show: false },
        axisLabel: { fontSize: '10px' },
      },

      legend: { bottom: '20px' },

      series: dataset.dimensions.slice(1).map((d, di) => {
        return {
          name: d,
          type: 'line',
          symbol: 'none',
          encode: {
            x: dataset.dimensions[0],
            y: dataset.dimensions[di + 1],
          },
        }
      }),
    })
  }, [stat, type, types])

  const prettyStat = pretty(stat)

  return (
    <Container>
      <Head>
        <title>{prettyStat} - JCA-MC</title>
      </Head>

      <div className="stat">
        <h2>{prettyStat}</h2>

        <Seg type={type} onChange={handleChange} statTypes={types} hideAll />

        <div id="viz" />
      </div>
    </Container>
  )
}

export default Stat
