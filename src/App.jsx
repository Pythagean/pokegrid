import React, { useEffect, useState, useRef } from 'react'
import Gen1 from './pages/gen_1'
import Gen2 from './pages/gen_2'
import Gen3 from './pages/gen_3'
import { spritesBase, handleImgError } from './imageUtils'

const normalizeRoute = (hash) => {
  const h = (hash || window.location.hash || '').replace('#', '')
  if (h === 'gen_2' || h === 'gen_3') return h
  return 'gen_1'
}

export default function App() {
  const [route, setRoute] = useState(normalizeRoute())
  const [greyed, setGreyed] = useState(new Set())
  const [lastClicked, setLastClicked] = useState(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwipingVisual, setIsSwipingVisual] = useState(false)
  const [rangeMode, setRangeMode] = useState(false)

  // load saved greyed ids from localStorage
  // No longer loading from localStorage, session-only greyed state

  const toggleGrey = (id, shift = false) => {
    setGreyed(prev => {
      const next = new Set(prev)
      if (shift && lastClicked != null && lastClicked !== id) {
        const a = Math.min(lastClicked, id)
        const b = Math.max(lastClicked, id)
        const shouldGrey = !prev.has(id)
        for (let i = a; i <= b; i++) {
          if (shouldGrey) next.add(i)
          else next.delete(i)
        }
      } else {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      }
      // No persistence: do NOT write to localStorage (session-only)
      return next
    })
  }

  useEffect(() => {
    const onHash = () => setRoute(normalizeRoute(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (to) => {
    window.location.hash = to
    setRoute(normalizeRoute(to))
  }

  const getGenRange = (r) => {
    if (r === 'gen_2') return [152, 251]
    if (r === 'gen_3') return [252, 386]
    return [1, 151]
  }

  const selectAllCurrentGen = () => {
    const [start, end] = getGenRange(route)
    setGreyed(prev => {
      const next = new Set(prev)
      for (let i = start; i <= end; i++) next.add(i)
      return next
    })
    setLastClicked(null)
  }

  const deselectAllCurrentGen = () => {
    const [start, end] = getGenRange(route)
    setGreyed(prev => {
      const next = new Set(prev)
      for (let i = start; i <= end; i++) next.delete(i)
      return next
    })
    setLastClicked(null)
  }

  // handle select events coming from cards (encapsulates range-mode behavior)
  const onSelect = (id, shiftKey = false) => {
    if (rangeMode) {
      // If no anchor, set anchor (do not toggle)
      if (lastClicked == null) {
        setLastClicked(id)
        return
      }
      // If tapping the same anchor, clear it
      if (lastClicked === id) {
        setLastClicked(null)
        return
      }
      // anchor exists and different id -> perform range toggle using toggleGrey with shift
      toggleGrey(id, true)
      // clear anchor after range operation
      setLastClicked(null)
      return
    }

    // normal behavior (desktop shift supported)
    toggleGrey(id, shiftKey)
    // set lastClicked for single selection flows
    setLastClicked(id)
  }

  // Mobile swipe handling: left/right swipe navigates between gens
  const touchRef = useRef({ startX: 0, startY: 0, deltaX: 0, deltaY: 0 })
  const SWIPE_THRESHOLD = 50 // px

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return
    // only enable on narrow screens
    if (window.innerWidth > 767) return
    const t = e.touches[0]
    touchRef.current.startX = t.clientX
    touchRef.current.startY = t.clientY
    touchRef.current.deltaX = 0
    touchRef.current.deltaY = 0
    setIsSwipingVisual(true)
  }

  const handleTouchMove = (e) => {
    if (!e.touches || e.touches.length === 0) return
    if (window.innerWidth > 767) return
    const t = e.touches[0]
    touchRef.current.deltaX = t.clientX - touchRef.current.startX
    touchRef.current.deltaY = t.clientY - touchRef.current.startY
    // update visual offset (dampen a bit for nicer feel)
    const damp = Math.max(-window.innerWidth, Math.min(window.innerWidth, touchRef.current.deltaX * 0.7))
    setSwipeOffset(damp)
  }

  const handleTouchEnd = () => {
    if (window.innerWidth > 767) return
    const { deltaX, deltaY } = touchRef.current
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      // left swipe (negative) -> next gen; right swipe -> prev gen
      if (deltaX < 0) {
        if (route === 'gen_1') navigate('gen_2')
        else if (route === 'gen_2') navigate('gen_3')
      } else {
        if (route === 'gen_3') navigate('gen_2')
        else if (route === 'gen_2') navigate('gen_1')
      }
    }
    touchRef.current.deltaX = 0
    touchRef.current.deltaY = 0
    // animate snap-back
    setSwipeOffset(0)
    // hide visual after a short delay to allow transition
    setTimeout(() => setIsSwipingVisual(false), 220)
  }

  return (
    <div className="app" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <header className="topbar" role="banner">
        <div className="bulk-controls">
          <button type="button" className="bulk-btn" onClick={deselectAllCurrentGen}>Select All</button>
          <button type="button" className="bulk-btn" onClick={selectAllCurrentGen}>Deselect All</button>
          <button type="button" className={`bulk-btn range-toggle ${rangeMode ? 'active' : ''}`} onClick={() => { setLastClicked(null); setRangeMode(v => !v) }} aria-pressed={rangeMode} title="Range select">Range Mode</button>
        </div>
        <nav className="gen-controls" aria-label="Generation selection">
          <button type="button" className={`gen-btn ${route === 'gen_1' ? 'active' : ''}`} onClick={() => navigate('gen_1')} aria-pressed={route === 'gen_1'}>
            <img className="btn-sprite" src={`${spritesBase}/1-front.png`} alt="" onError={handleImgError} />
            <img className="btn-sprite" src={`${spritesBase}/4-front.png`} alt="" onError={handleImgError} />
            <img className="btn-sprite" src={`${spritesBase}/7-front.png`} alt="" onError={handleImgError} />
          </button>

          <button type="button" className={`gen-btn ${route === 'gen_2' ? 'active' : ''}`} onClick={() => navigate('gen_2')} aria-pressed={route === 'gen_2'}>
            <img className="btn-sprite" src={`${spritesBase}/152-front.png`} alt="" onError={handleImgError} />
            <img className="btn-sprite" src={`${spritesBase}/155-front.png`} alt="" onError={handleImgError} />
            <img className="btn-sprite" src={`${spritesBase}/158-front.png`} alt="" onError={handleImgError} />
          </button>

          <button type="button" className={`gen-btn ${route === 'gen_3' ? 'active' : ''}`} onClick={() => navigate('gen_3')} aria-pressed={route === 'gen_3'}>
            <img className="btn-sprite" src={`${spritesBase}/252-front.png`} alt="" onError={handleImgError} />
            <img className="btn-sprite" src={`${spritesBase}/255-front.png`} alt="" onError={handleImgError} />
            <img className="btn-sprite" src={`${spritesBase}/258-front.png`} alt="" onError={handleImgError} />
          </button>
        </nav>
        
      </header>
      <div className="swipe-viewport" style={{ transform: `translateX(${swipeOffset}px)`, transition: isSwipingVisual ? 'none' : 'transform .18s ease' }}>
        <div className="swipe-chev left" style={{ opacity: isSwipingVisual ? Math.min(1, Math.abs(swipeOffset) / 120) : 0 }}>‹</div>
        <div className="swipe-chev right" style={{ opacity: isSwipingVisual ? Math.min(1, Math.abs(swipeOffset) / 120) : 0 }}>›</div>
        <main>
        {route === 'gen_1' && <Gen1 greyed={greyed} onSelect={onSelect} lastClicked={lastClicked} />}
        {route === 'gen_2' && <Gen2 greyed={greyed} onSelect={onSelect} lastClicked={lastClicked} />}
        {route === 'gen_3' && <Gen3 greyed={greyed} onSelect={onSelect} lastClicked={lastClicked} />}
        </main>
      </div>
    </div>
  )
}
