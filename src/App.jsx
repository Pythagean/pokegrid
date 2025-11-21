import React, { useEffect, useState } from 'react'
import Gen1 from './pages/gen_1'
import Gen2 from './pages/gen_2'
import Gen3 from './pages/gen_3'

const normalizeRoute = (hash) => {
  const h = (hash || window.location.hash || '').replace('#', '')
  if (h === 'gen_2' || h === 'gen_3') return h
  return 'gen_1'
}

export default function App() {
  const [route, setRoute] = useState(normalizeRoute())

  useEffect(() => {
    const onHash = () => setRoute(normalizeRoute(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (to) => {
    window.location.hash = to
    setRoute(normalizeRoute(to))
  }

  return (
    <div className="app">
      <header className="topbar" role="banner">
        <nav className="gen-controls" aria-label="Generation selection">
          <button type="button" className={`gen-btn ${route === 'gen_1' ? 'active' : ''}`} onClick={() => navigate('gen_1')}>Gen 1</button>
          <button type="button" className={`gen-btn ${route === 'gen_2' ? 'active' : ''}`} onClick={() => navigate('gen_2')}>Gen 2</button>
          <button type="button" className={`gen-btn ${route === 'gen_3' ? 'active' : ''}`} onClick={() => navigate('gen_3')}>Gen 3</button>
        </nav>
      </header>

      <main>
        {route === 'gen_1' && <Gen1 />}
        {route === 'gen_2' && <Gen2 />}
        {route === 'gen_3' && <Gen3 />}
      </main>
    </div>
  )
}
