import { TICK_STATS } from 'lib/constants'

export const formatCm = (n) =>
  n >= 1e5
    ? `${Math.round(parseFloat((n / 1e5).toFixed(1)))} km`
    : n >= 100
    ? `${Math.round(n / 100)} m`
    : `${n} cm`

export const ticksToMs = (n) => (n / 20) * 1000

export const formatTime = (ms) => {
  let h, m, s, mss, d
  d = Math.floor(ms / 1000 / 60 / 60 / 24)
  h = Math.floor((ms / 1000 / 60 / 60 / 24 - d) * 24)
  m = Math.floor(((ms / 1000 / 60 / 60 / 24 - d) * 24 - h) * 60)
  s = Math.floor((((ms / 1000 / 60 / 60 / 24 - d) * 24 - h) * 60 - m) * 60)
  mss = Math.floor(
    ((((ms / 1000 / 60 / 60 / 24 - d) * 24 - h) * 60 - m) * 60 - s) * 1000,
  )
  s += Math.round(mss / 1000)

  let units = []

  if (d) {
    units.push(`${d}d`)
  }

  if (d || h) {
    units.push(`${h}h`)
  }

  if (!d && (h || m)) {
    units.push(`${m}m`)
  }

  if (!d && !h && (m || s)) {
    units.push(`${s}s`)
  }

  return units.join(' ')
}

export const formatValue = (stat, n) => {
  if (!n) return ''

  if (TICK_STATS.includes(stat)) {
    return formatTime(Math.abs(ticksToMs(n)))
  }

  if (stat.includes('one_cm')) {
    return formatCm(n)
  }

  return n.toLocaleString()
}

export const formatValueDiff = (stat, n) => {
  const op = !n ? '' : n > 0 ? '+' : '-'

  return `${op}${formatValue(stat, n)}`
}

export const pretty = (s) =>
  s
    ? s.replace(/[._]/g, ' ').replace(' one cm', '').replace(' one minute', '')
    : ''
