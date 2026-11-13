import { FACTIONS } from '../game/constants'

export default function Factions({ setPage }) {
  return (
    <div className="page factions">
      <div className="container">
        <h1>Choose your faction</h1>
        <p className="lead">
          Three factions, three visions of the RCMRD Institution. Each offers different
          bonuses and supports a distinct playstyle.
        </p>
        <div className="faction-grid">
          {Object.values(FACTIONS).map((f) => (
            <div key={f.id} className="faction-card" onClick={() => setPage('start')}>
              <div className="faction-dot" style={{ background: f.color }}>
                {f.dot}
              </div>
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
              <div className="faction-bonus">{f.bonus}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setPage('start')}>
          Start Playing
        </button>
      </div>
    </div>
  )
}
