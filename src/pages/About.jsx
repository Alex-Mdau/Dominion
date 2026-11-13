export default function About({ setPage }) {
  return (
    <div className="page about">
      <div className="container">
        <h1>About Dominion</h1>
        <p className="lead">
          A location-based strategy game played on a real-world map.
          The Buildings, Fields, Gardens and areas around you become regions that
          you can capture, develop and defend.
        </p>
        <div className="about-grid">
          <div className="about-card">
            <h3>Free to play</h3>
            <p>Create an account with your email and play without ads or in-game purchases.</p>
          </div>
          <div className="about-card">
            <h3>Mobile first</h3>
            <p>Designed for phones. GPS is always required to capture territory.</p>
          </div>
          <div className="about-card">
            <h3>Live leaderboard</h3>
            <p>Compete with up to 300 players in real time across RCMRD.</p>
          </div>
        </div>
        <div className="faq">
          <h3>Frequently asked questions</h3>
          <div className="faq-item">
            <strong>Do I have to go outside?</strong>
            <p>Yes. You can only capture new territory and build within range of your real location.</p>
          </div>
          <div className="faq-item">
            <strong>Does the game need my location?</strong>
            <p>Yes. Location is part of the gameplay — it determines where you are and what is within reach.</p>
          </div>
          <div className="faq-item">
            <strong>How many players can join?</strong>
            <p>The leaderboard supports up to 300 concurrent players with real-time updates.</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setPage('start')}>Start Playing</button>
      </div>
    </div>
  )
}
