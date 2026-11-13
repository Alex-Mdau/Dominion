export default function Instructions() {
  return (
    <div className="page instructions">
      <div className="container">
        <h1>How it works</h1>
        <p className="lead">
          Dominion turns the real-world map into a strategy game. Capture streets,
          parks and squares, construct buildings, recruit units and defend your
          territory in tower defense battles. All you need is a phone and a
          reason to head outside.
        </p>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Conquer your surroundings</h3>
            <p>Head outside and capture territory within your reach. The game world follows you through cities, villages and everywhere in between.</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>Build and rule</h3>
            <p>Build farms, barracks and defensive towers on captured territory. Gather resources, recruit units and prepare to defend your land.</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Take on bosses together</h3>
            <p>Raid bosses regularly appear in the wild. Join forces with other players and earn rewards based on your contribution to the victory.</p>
          </div>
        </div>
        <div className="callout">
          <strong>Note:</strong> This is a web preview of the game. For full
          GPS territory capture, play on a phone with location enabled.
        </div>
      </div>
    </div>
  )
}
