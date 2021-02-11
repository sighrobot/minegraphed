import React from 'react'

export const ItemIcon = ({ name }) => {
  const slug = name.replace('_one_cm', '').replace(/_/g, '-')
  return <span className={`icon-minecraft-sm icon-minecraft-${slug}`} />
}
