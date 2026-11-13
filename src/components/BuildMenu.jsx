import { useState, useEffect } from 'react'
import { BUILDINGS, RESOURCES } from '../game/constants'
import { canAfford } from '../game/state'

export default function BuildMenu({ state, onBuild }) {
  const [selectedTerritory, setSelectedTerritory] = useState(null)

  useEffect(() => {
    const handler = (e) => setSelectedTerritory(e.detail)
    window.addEventListener('quickbuild', handler)
    return () => window.removeEventListener('quickbuild', handler)
  }, [])

  const territory = selectedTerritory ? state.territories.find((t) => t.id === selectedTerritory) : null
  const hasBuilding = state.buildings.find((b) => b.territoryId === selectedTerritory)

  return (
    <div className="build-wrap" style={{display: selectedTerritory ? 'flex' : 'none', flexDirection:'column'}}>
      <div className="section" style={{flex:1, overflowY:'auto'}}>
        <div className="section-title">Build on Territory</div>
        {!territory ? (
          <p style={{fontSize:'12px',color:'#94a3b8'}}>Select a territory on the map.</p>
        ) : (
          <>
            <p style={{fontSize:'12px',color:'#94a3b8',marginBottom:10}}>Owned territory. Construct a building.</p>
            {hasBuilding ? (
              <p style={{fontSize:'12px',color:'#94a3b8',marginBottom:10}}>A building already stands here.</p>
            ) : (
              Object.values(BUILDINGS).map((b) => {
                const affordable = canAfford(state.resources, b.cost)
                const costStr = Object.entries(b.cost).map(([k, v]) => `${RESOURCES[k].icon} ${v}`).join('  ')
                return (
                  <div key={b.id} className={`building-card ${affordable ? '' : 'disabled'}`} onClick={() => {
                    if (!affordable) return
                    onBuild(selectedTerritory, b.id)
                    setSelectedTerritory(null)
                  }}>
                    <div className="building-icon">{b.icon}</div>
                    <div className="building-info">
                      <div className="building-title">{b.name}</div>
                      <div className="building-sub">{b.desc}</div>
                      <div className="cost-row {affordable ? '' : 'missing'}">{costStr}</div>
                    </div>
                  </div>
                )
              })
            )}
            <button className="btn ghost small" onClick={() => setSelectedTerritory(null)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  )
}
