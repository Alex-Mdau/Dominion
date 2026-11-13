export default function Home({ setPage }) {
  return (
    <div className="page home">
      <div className="hero">
        <div className="hero-content">
          <div className="badge">Do you have what it takes to do what  has to be done
          </div>
          <h1>Dominion</h1>
          <p>
            Your surroundings. Your realm. Step outside, claim RCMRD.
          its Buildings, Fields, Gardens and build an empire on them.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setPage('start')}>Start Playing</button>
            <button className="btn btn-ghost" onClick={() => setPage('factions')}>Choose Faction</button>
          </div>
        </div>
        <div className="hero-features">
          <div className="feature">
            <div className="feature-icon">🗺️</div>
            <div className="feature-title">Capture</div>
            <div className="feature-desc">Claim the places you walk past</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🏗️</div>
            <div className="feature-title">Build</div>
            <div className="feature-desc">Farms, barracks, defensive towers</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🛡️</div>
            <div className="feature-title">Defend</div>
            <div className="feature-desc">Tower defense battles for your land</div>
          </div>
        </div>
      </div>
    </div>
  )
}
