import { useState, useEffect } from 'react'
import { GAME_NAME } from './game/constants'
import Home from './pages/Home'
import Instructions from './pages/Instructions'
import About from './pages/About'
import Factions from './pages/Factions'
import StartPlaying from './pages/StartPlaying'
import Leaderboard from './pages/Leaderboard'
import Nav from './components/Nav'

export default function App() {
  const [page, setPage] = useState('home')
  const [phoneOnly, setPhoneOnly] = useState(true)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const check = () => setPhoneOnly(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!phoneOnly) {
    return (
      <div className="app desktop-notice">
        <div className="desktop-card">
          <div style={{fontSize:40,marginBottom:12}}>📱</div>
          <h1>{GAME_NAME}</h1>
          <p>Dominion is mobile-only for now.</p>
          <p>Please open this page on a phone to play.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>☰</button>
      <Nav page={page} setPage={setPage} navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className={`page-wrap ${navOpen ? 'nav-open' : ''}`}>
        {page === 'home' && <Home />}
        {page === 'instructions' && <Instructions />}
        {page === 'about' && <About setPage={setPage} />}
        {page === 'factions' && <Factions setPage={setPage} />}
        {page === 'start' && <StartPlaying setPage={setPage} />}
        {page === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  )
}
