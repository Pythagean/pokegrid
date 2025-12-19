import React, { useEffect, useState } from 'react'

export default function PokemonDetailModal({ pokemonId, pokemonData = [], onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pokemonId || pokemonData.length === 0) {
      setLoading(true)
      return
    }
    const pokemon = pokemonData.find(p => p.id === pokemonId)
    if (pokemon) {
      setData(pokemon)
      setLoading(false)
    } else {
      setData(null)
      setLoading(false)
    }
  }, [pokemonId, pokemonData])

  if (!pokemonId) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        
        {loading && <div className="modal-loading">Loading...</div>}
        {!loading && !data && <div className="modal-error">Pokemon not found</div>}
        
        {data && (
          <>
            <div className="modal-header">
              <img 
                src={`https://raw.githubusercontent.com/Pythagean/pokedle_assets/main/images/${data.id}.png`}
                alt={data.name}
                className="modal-image"
              />
              <div className="modal-title">
                <h2>{data.name}</h2>
                <div className="modal-types">
                  {data.types.map(type => (
                    <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Height:</span>
                <span className="detail-value">{data.height} m</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Weight:</span>
                <span className="detail-value">{data.weight} kg</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Generation:</span>
                <span className="detail-value">{data.generation}</span>
              </div>
              {data.habitat && (
                <div className="detail-row">
                  <span className="detail-label">Habitat:</span>
                  <span className="detail-value">{data.habitat}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
