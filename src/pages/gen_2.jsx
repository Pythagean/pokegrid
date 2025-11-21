import React from 'react'
import { base, handleImgError } from '../imageUtils'

export default function Gen2() {
  const numbers = Array.from({ length: 100 }, (_, i) => 152 + i) // 152..251
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
