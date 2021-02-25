import React from 'react'
import { pretty } from 'lib/format'

const Seg = ({ type, onChange, statTypes, stats, stat, search, hideAll }) => {
  return (
    <div className="seg">
      {!hideAll && (
        <button
          name="all"
          className={type === 'all' ? 'active' : ''}
          onClick={onChange}
        >
          all
        </button>
      )}

      {statTypes
        .sort((a, b) => (a > b ? 1 : -1))
        .map((t) => {
          const num = stats
            ? Object.keys(stats[t])
                .filter((thisStat) => !stat || thisStat === stat)
                .filter(
                  (thisStat) =>
                    !search || pretty(thisStat).indexOf(search) !== -1,
                ).length
            : 1
          return (
            <button
              key={t}
              className={type === t ? 'active' : ''}
              name={t}
              disabled={num === 0}
              onClick={onChange}
            >
              {pretty(t)}
              {/* <sup>{num}</sup> */}
            </button>
          )
        })}
    </div>
  )
}

export default Seg
