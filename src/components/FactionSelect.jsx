import { FACTIONS } from '../game/constants'

export default function FactionSelect({ onChoose }) {
  return (
    <div className="modal">
      <div className="modal-card">
        <h2>Choose Your Faction</h2>
        <p>Your allegiance shapes your realm and bonuses.</p>
        {Object.values(FACTIONS).map((f) => (
          <div key={f.id} className="faction-chip" onClick={() => onChoose(f.id)}>
            <div className="faction-dot" style={{background: f.color}}>{f.dot}</div>
            <div>
              <div className="faction-name">{f.name}</div>
              <div className="faction-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
