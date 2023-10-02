import React from 'react'
import { SESSIONS } from 'lib/constants'

const DateFilter = ({ season, date, onChange }) => {
  const handleChange = (e) => onChange(e.target.value)

  return (
    <div className="date-filter">
      <select
        className={date !== 'all' ? 'active' : ''}
        onChange={handleChange}
        value={date}
      >
        <option name={'all'} value={'all'}>
          All-time
        </option>
        {SESSIONS[season].slice(0, SESSIONS[season].length - 1).map((d) => (
          <option key={d} name={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DateFilter
