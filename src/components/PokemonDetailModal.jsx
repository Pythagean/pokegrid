import React, { useEffect, useState } from 'react'
import { getPokemonImageUrl } from '../imageUtils'

export default function PokemonDetailModal({ pokemonId, pokemonData = [], spriteMode = false, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [localSpriteMode, setLocalSpriteMode] = useState(spriteMode)

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

  useEffect(() => {
    setLocalSpriteMode(spriteMode)
  }, [spriteMode])

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
                src={getPokemonImageUrl(data.id, localSpriteMode)}
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
                <button
                  type="button"
                  className={`sprite-toggle ${localSpriteMode ? 'active' : ''}`}
                  onClick={() => setLocalSpriteMode(s => !s)}
                  aria-pressed={localSpriteMode}
                >
                  Sprite
                </button>
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
                <span className="detail-label">Evolution Stage:</span>
                <span className="detail-value">{data.evolution_stage}</span>
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
