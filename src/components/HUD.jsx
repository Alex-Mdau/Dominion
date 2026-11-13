import { RESOURCES, FACTIONS } from '../game/constants'

export default function HUD({ state }) {
  const faction = state.faction ? FACTIONS[state.faction] : null
  const rows = Object.values(RESOURCES).map((r) => {
    const val = state.resources[r.id] ?? 0
    const cap = state.storage[r.id] ?? 0
    return (
      <div key={r.id} className="resource-row">
        <div className="resource-icon">{r.icon}</div>
        <div className="resource-name">{r.name}</div>
        <div className="resource-val">{Math.floor(val)} / {cap}</div>
      </div>
    )
  })
  return (
    <div className="hud-wrap">
      <div className="section">
        <div className="section-title" style={{justifyContent:'space-between'}}>
          <span>Realm</span>
          <span style={{fontSize:'11px',color:'#94a3b8'}}>{faction ? faction.name : '—'}</span>
        </div>
        {faction && (
          <p style={{fontSize:'12px',color:'#64748b',marginBottom:10}}>{faction.desc}</p>
        )}
        {rows}
      </div>
      <div className="section">
        <div className="section-title">Quick Build</div>
        <p style={{fontSize:'12px',color:'#94a3b8',marginBottom:10}}>Tap a territory on the map, then build.</p>
        <button className="btn secondary small" style={{marginBottom:0}}>Open Build Menu</button>
      </div>
    </div>
  )
}