import React from 'react'
import { getPokemonImageUrl } from '../imageUtils'
import PokeCard from '../components/PokeCard'

export default function Gen2({ greyed = new Set(), onSelect = () => {}, lastClicked = null, spriteMode = false }) {
  const numbers = Array.from({ length: 100 }, (_, i) => 152 + i) // 152..251
  return (
    <div className="grid">
      {numbers.map(n => (
        <PokeCard
          key={n}
          id={n}
          src={getPokemonImageUrl(n, spriteMode)}
          isGrey={greyed.has(n)}
          isLast={lastClicked === n}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
