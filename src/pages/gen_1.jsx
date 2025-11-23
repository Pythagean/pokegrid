import React from 'react'
import { base } from '../imageUtils'
import PokeCard from '../components/PokeCard'

export default function Gen1({ greyed = new Set(), onSelect = () => {}, lastClicked = null }) {
  const numbers = Array.from({ length: 151 }, (_, i) => i + 1)
  return (
    <div className="grid">
      {numbers.map(n => {
          return (
            <PokeCard
              key={n}
              id={n}
              src={`${base}/${n}.png`}
              isGrey={greyed.has(n)}
              isLast={lastClicked === n}
              onSelect={onSelect}
            />
          )
      })}
    </div>
  )
}
