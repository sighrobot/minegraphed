import React from 'react'
import SessionLink from 'components/session-link'

const { SESSIONS } = require('lib/constants')

const Sessions = ({ season }) => {
  return (
    <menu className="sessions">
      {SESSIONS[season].slice(0, SESSIONS[season].length - 1).map((d, idx) => (
        <SessionLink
          key={d}
          date={d}
          latest={idx === SESSIONS[season].length - 1}
        />
      ))}
    </menu>
  )
}

export default Sessions
