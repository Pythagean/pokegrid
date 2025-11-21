import React from 'react'
import { base, handleImgError } from '../imageUtils'

export default function Gen3({ greyed = new Set(), toggleGrey = () => {}, lastClicked = null }) {
  const numbers = Array.from({ length: 135 }, (_, i) => 252 + i) // 252..386
  return (
    <div className="grid">
      {numbers.map(n => {
        const isGrey = greyed.has(n)
        return (
          <div
            className={`card ${isGrey ? 'greyed' : ''} ${lastClicked === n ? 'last-clicked' : ''}`}
            key={n}
            role="button"
            tabIndex={0}
            onClick={(e) => toggleGrey(n, e.shiftKey)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGrey(n, false) } }}
            aria-pressed={isGrey}
          >
            <img src={`${base}/${n}.png`} alt={`${n}.png`} loading="lazy" onError={handleImgError} />
          </div>
        )
      })}
    </div>
  )
}
