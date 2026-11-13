export default function Nav({ page, setPage, navOpen, setNavOpen }) {
  const links = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'instructions', label: 'Instructions', icon: '📘' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
    { id: 'factions', label: 'Factions', icon: '🛡️' },
    { id: 'start', label: 'Start Playing', icon: '▶️' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  ]
  return (
    <nav className={`nav ${navOpen ? 'open' : ''}`}>
      <div className="nav-header">
        <div className="nav-brand">Dominion</div>
        <button className="nav-close" onClick={() => setNavOpen(false)}>✕</button>
      </div>
      <div className="nav-links">
        {links.map((l) => (
          <button
            key={l.id}
            className={`nav-link ${page === l.id ? 'active' : ''}`}
            onClick={() => { setPage(l.id); setNavOpen(false); }}
          >
            <span className="nav-icon">{l.icon}</span>
            <span className="nav-label">{l.label}</span>
          </button>
        ))}
      </div>
      <div className="nav-spacer" />
    </nav>
  )
}
