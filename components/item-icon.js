import React from 'react'
import { keyBy } from 'lodash'

const entities = require('../lib/entities.json')

const entitiesByName = keyBy(entities, (e) =>
  e.name.toLowerCase().replace(/ /g, '_'),
)

export const ItemIcon = ({ name }) => {
  const e = entitiesByName[name]
  if (e) {
    return (
      <img
        style={{
          width: '15px',
          height: '15px',
          transform: 'translateY(3px)',
          marginRight: '1px',
        }}
        src={`/entities/${e.type}.png`}
      />
    )
  }

  const slug = name.replace('_one_cm', '').replace(/_/g, '-')
  return <span className={`icon-minecraft-sm icon-minecraft-${slug}`} />
}
