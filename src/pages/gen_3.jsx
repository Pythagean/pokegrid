import React from 'react'
import { base, handleImgError } from '../imageUtils'

export default function Gen3({ greyed = new Set(), toggleGrey = () => {}, lastClicked = null, setAnchor = () => {} }) {
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
            onTouchStart={(e) => {
              const el = e.currentTarget
              el._touchMoved = false
              el._touchFired = false
              el._touchHandled = false
              el._touchTimer = setTimeout(() => {
                el._touchFired = true
                el._touchHandled = true
                setAnchor(n)
              }, 450)
            }}
            onTouchMove={(e) => {
              const el = e.currentTarget
              el._touchMoved = true
              if (el._touchTimer) { clearTimeout(el._touchTimer); el._touchTimer = null }
            }}
            onTouchEnd={(e) => {
              const el = e.currentTarget
              if (el._touchTimer) { clearTimeout(el._touchTimer); el._touchTimer = null }
              if (!el._touchFired) {
                // short tap -> perform normal toggle
                toggleGrey(n, false)
              } else {
                // long press handled by setAnchor above
              }
            }}
            onClick={(e) => {
              const el = e.currentTarget
              if (el._touchHandled) { el._touchHandled = false; return }
              toggleGrey(n, e.shiftKey)
            }}
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
