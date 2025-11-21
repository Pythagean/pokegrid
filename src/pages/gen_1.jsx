import React from 'react'
import { base, handleImgError } from '../imageUtils'

export default function Gen1() {
  const numbers = Array.from({ length: 151 }, (_, i) => i + 1)
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
