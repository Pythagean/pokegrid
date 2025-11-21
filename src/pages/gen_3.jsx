import React from 'react'
import { base, handleImgError } from '../imageUtils'

export default function Gen3() {
  const numbers = Array.from({ length: 135 }, (_, i) => 252 + i) // 252..386
  return (
    <div className="grid">
      {numbers.map(n => (
        <div className="card" key={n}>
          <img src={`${base}/${n}.png`} alt={`${n}.png`} loading="lazy" onError={handleImgError} />
        </div>
      ))}
    </div>
  )
}
