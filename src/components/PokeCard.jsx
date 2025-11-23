import React, { useState } from 'react'
import { handleImgError, loadingIcon } from '../imageUtils'

export default function PokeCard({ id, src, alt, isGrey, isLast, toggleGrey, setAnchor }) {
  const [loading, setLoading] = useState(true)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [triedAlt, setTriedAlt] = useState(false)

  return (
    <div
      className={`card ${isGrey ? 'greyed' : ''} ${isLast ? 'last-clicked' : ''}`}
      role="button"
      tabIndex={0}
      onTouchStart={(e) => {
        const el = e.currentTarget
        el._touchMoved = false
        el._touchHandled = false
      }}
      onTouchMove={(e) => {
        const el = e.currentTarget
        el._touchMoved = true
      }}
      onTouchEnd={(e) => {
        const el = e.currentTarget
        // treat a short tap (no move) as a toggle; mark handled to avoid duplicate click
        if (!el._touchMoved) {
          el._touchHandled = true
          toggleGrey(id, false)
        }
      }}
      onClick={(e) => {
        const el = e.currentTarget
        if (el._touchHandled) { el._touchHandled = false; return }
        toggleGrey(id, e.shiftKey)
      }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGrey(id, false) } }}
      aria-pressed={isGrey}
    >
      <div className={`img-wrap ${loading ? 'loading' : 'loaded'}`}>
        <img className="loading-icon" src={loadingIcon} alt="" />

        <img
          src={currentSrc}
          alt={alt}
          onLoad={() => {
            console.debug('[PokeCard] loaded', id, currentSrc)
            setLoading(false)
          }}
          onError={(e) => {
            console.warn('[PokeCard] image error', id, currentSrc)
            // Try a CDN fallback (jsDelivr) once, then fall back to placeholder
            if (!triedAlt && typeof currentSrc === 'string' && currentSrc.includes('raw.githubusercontent.com')) {
              const altSrc = currentSrc.replace('https://raw.githubusercontent.com/Pythagean/pokedle_assets/main/', 'https://cdn.jsdelivr.net/gh/Pythagean/pokedle_assets@main/')
              setTriedAlt(true)
              setLoading(true)
              setCurrentSrc(altSrc)
              return
            }
            // if retrying didn't help, set placeholder
            handleImgError(e)
            setLoading(false)
          }}
          className="main-img"
        />
      </div>
    </div>
  )
}
