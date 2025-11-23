import React, { useState } from 'react'
import { handleImgError, loadingIcon } from '../imageUtils'

export default function PokeCard({ id, src, alt, isGrey, isLast, toggleGrey, setAnchor }) {
  const [loading, setLoading] = useState(true)

  return (
    <div
      className={`card ${isGrey ? 'greyed' : ''} ${isLast ? 'last-clicked' : ''}`}
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
          setAnchor(id)
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
      {loading && (
        <img className="loading-icon" src={loadingIcon} alt="loading" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={(e) => { handleImgError(e); setLoading(false) }}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  )
}
