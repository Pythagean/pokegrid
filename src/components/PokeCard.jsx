import React, { useState, useRef, useEffect } from 'react'
import { handleImgError, loadingIcon } from '../imageUtils'

export default function PokeCard({ id, src, alt, isGrey, isLast, onSelect }) {
  const [loading, setLoading] = useState(true)
  const [currentSrc, setCurrentSrc] = useState(null) // set when card is visible
  const [triedAlt, setTriedAlt] = useState(false)
  const wrapRef = useRef(null)
  const imgRef = useRef(null)
  const touchRef = useRef({ moved: false, handled: false })

  useEffect(() => {
    // If IntersectionObserver is available, defer setting the src until in view
    if (!wrapRef.current) return
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            setCurrentSrc(src)
            obs.disconnect()
          }
        })
      }, { rootMargin: '200px 0px' })
      obs.observe(wrapRef.current)
      return () => obs.disconnect()
    }
    // fallback: set immediately
    setCurrentSrc(src)
  }, [src])

  const handleClick = () => {
    onSelect(id, false)
  }

  return (
    <div
      ref={wrapRef}
      className={`card ${isGrey ? 'greyed' : ''} ${isLast ? 'last-clicked' : ''}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id, false) } }}
      aria-pressed={isGrey}
    >
      <div ref={imgRef} className={`img-wrap ${loading ? 'loading' : 'loaded'}`}>
        <img className="loading-icon" src={loadingIcon} alt="" />

        <img
          src={currentSrc || ''}
          alt={alt}
          onLoad={() => {
            console.debug('[PokeCard] loaded', id, currentSrc)
            setLoading(false)
          }}
          onError={(e) => {
            const failedSrc = e?.target?.src || currentSrc
            console.warn('[PokeCard] image error', id, failedSrc)
            // Try a CDN fallback (jsDelivr) once, then fall back to placeholder
            if (!triedAlt && typeof failedSrc === 'string' && failedSrc.includes('raw.githubusercontent.com')) {
              const altSrc = failedSrc.replace('https://raw.githubusercontent.com/Pythagean/pokedle_assets/main/', 'https://cdn.jsdelivr.net/gh/Pythagean/pokedle_assets@main/')
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
