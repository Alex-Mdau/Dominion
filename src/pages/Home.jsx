import { useState } from 'react'
import { supabase, PLAYER_TABLE } from '../lib/supabase'
import { FACTIONS } from '../game/constants'

export default function Home({ setPage }) {
  const [username, setUsername] = useState('')
  const [creating, setCreating] = useState(false)
  const [playerId, setPlayerId] = useState(() => localStorage.getItem('dominion_player_id') || null)

  const createAccount = async () => {
    if (!username.trim()) return
    if (!supabase) {
      // Fallback: create a local player id
      const id = 'local_' + Date.now()
      setPlayerId(id)
      localStorage.setItem('dominion_player_id', id)
      return
    }
    setCreating(true)
    try {
      const { data, error } = await supabase
        .from(PLAYER_TABLE)
        .insert({ username: username.trim(), faction: null, territories_count: 0 })
        .select('id')
        .single()
      if (!error && data) {
        setPlayerId(data.id)
        localStorage.setItem('dominion_player_id', data.id)
      } else {
        console.error(error)
      }
    } finally {
      setCreating(false)
    }
  }

  const chooseFaction = (id) => {
    localStorage.setItem('dominion_faction', id)
    setPage('factions')
  }

  const hasAccount = !!playerId

  return (
    <div className="page home">
      <div className="hero">
        <div className="hero-content">
          <div className="badge">Do you have what it takes to do what has to be done</div>
          <h1>Dominion</h1>
          <p>
            Your surroundings. Your realm. Step outside, claim RCMRD.
            its Buildings, Fields, Gardens and build an empire on them.
          </p>

          {!hasAccount ? (
            <div className="account-card">
              <h2 style={{marginBottom:10,fontSize:18,color:'#fff'}}>Create Your Account</h2>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{width:'100%',padding:'10px',borderRadius:8,border:'none',marginBottom:10,fontSize:14,background:'rgba(255,255,255,0.06)',color:'#fff'}}
                maxLength={24}
              />
              <button className="btn btn-primary" onClick={createAccount} disabled={creating || !username.trim()}>
                {creating ? 'Creating…' : 'Create Account'}
              </button>
              <p className="muted small" style={{marginTop:8}}>Your progress and territories are saved to your account.</p>
            </div>
          ) : (
            <div className="account-card">
              <h2 style={{marginBottom:10,fontSize:18,color:'#fff'}}>Welcome back, {username}</h2>
              <p className="muted small">Account ready. Pick a faction to start playing.</p>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
                {Object.values(FACTIONS).map((f) => (
                  <button key={f.id} className="btn btn-secondary small" onClick={() => chooseFaction(f.id)}>
                    {f.dot} {f.name}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => setPage('factions')}>
                View Faction Details
              </button>
            </div>
          )}

          <div className="hero-actions" style={{marginTop:hasAccount ? 0 : 20}}>
            {hasAccount && (
              <>
                <button className="btn btn-primary" onClick={() => setPage('start')}>Start Playing</button>
                <button className="btn btn-ghost" onClick={() => setPage('factions')}>Choose Faction</button>
              </>
            )}
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
