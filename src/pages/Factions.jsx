import { FACTIONS } from '../game/constants'

export default function Factions({ setPage, onChoose }) {
  return (
    <div className="page factions">
      <div className="container">
        <h1>Choose your faction</h1>
        <p className="lead">
          Three factions, three visions of the new world. Each offers different
          bonuses and supports a distinct playstyle.
        </p>
        <div className="faction-grid">
          {Object.values(FACTIONS).map((f) => (
            <div key={f.id} className="faction-card" onClick={() => {
              if (onChoose) onChoose(f.id)
              setPage('start')
            }}>
              <div className="faction-dot" style={{ background: f.color }}>
                {f.dot}
              </div>
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
              <div className="faction-bonus">{f.bonus}</div>
            </div>
          ))}
        </div>
        <div className="section-title" style={{marginTop:20,marginBottom:8}}>Or pick directly:</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {Object.values(FACTIONS).map((f) => (
            <button key={f.id} className="btn btn-secondary small" onClick={() => {
              localStorage.setItem('dominion_faction', f.id)
              if (onChoose) onChoose(f.id)
              setPage('start')
            }}>
              {f.dot} {f.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
