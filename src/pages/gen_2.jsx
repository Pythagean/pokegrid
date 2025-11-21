import React from 'react'
import { base, handleImgError } from '../imageUtils'

export default function Gen2({ greyed = new Set(), toggleGrey = () => {} }) {
  const numbers = Array.from({ length: 100 }, (_, i) => 152 + i) // 152..251
  return (
    <div className="grid">
      {numbers.map(n => {
        const isGrey = greyed.has(n)
        return (
          <div
            className={`card ${isGrey ? 'greyed' : ''}`}
            key={n}
            role="button"
            tabIndex={0}
            onClick={() => toggleGrey(n)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGrey(n) } }}
            aria-pressed={isGrey}
          >
            <img src={`${base}/${n}.png`} alt={`${n}.png`} loading="lazy" onError={handleImgError} />
          </div>
        )
      })}
    </div>
  )
}
