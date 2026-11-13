import { useState, useEffect } from 'react'
import { supabase, PLAYER_TABLE } from '../lib/supabase'
import { FACTIONS } from '../game/constants'

export default function Home({ setPage }) {
  const [username, setUsername] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)
  const [playerId, setPlayerId] = useState(() => localStorage.getItem('dominion_player_id') || null)
  const [savedFaction, setSavedFaction] = useState(() => localStorage.getItem('dominion_faction') || null)
  const [returningPlayer, setReturningPlayer] = useState(null)

  useEffect(() => {
    const storedId = localStorage.getItem('dominion_player_id')
    if (storedId && supabase) {
      restorePlayer(storedId)
    }
  }, [])

  const normalizeUsername = (u) => u.trim().replace(/_+$/, '') + '_'

  const restorePlayer = async (id) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from(PLAYER_TABLE)
        .select('username, faction')
        .eq('id', id)
        .single()
      if (!error && data) {
        setPlayerId(id)
        setReturningPlayer(data)
        localStorage.setItem('dominion_player_id', id)
        if (data.faction) {
          localStorage.setItem('dominion_faction', data.faction)
          setSavedFaction(data.faction)
        }
      }
    } catch (e) {
      console.warn('restore failed', e)
    }
  }

  const createAccount = async () => {
    if (!username.trim()) {
      setError('Please enter a username.')
      return
    }
    const finalUsername = normalizeUsername(username)
    if (!supabase) {
      const id = 'local_' + Date.now()
      setPlayerId(id)
      localStorage.setItem('dominion_player_id', id)
      setError(null)
      return
    }
    setCreating(true)
    setError(null)
    try {
      const { data: existing } = await supabase
        .from(PLAYER_TABLE)
        .select('id')
        .eq('username', finalUsername)
        .maybeSingle()
      if (existing) {
        setError('That username is already taken. Please choose another.')
        setCreating(false)
        return
      }
      const { data, error: insertError } = await supabase
        .from(PLAYER_TABLE)
        .insert({ username: finalUsername, faction: null, territories_count: 0 })
        .select('id')
        .single()
      if (insertError) {
        if (insertError.code === '23505') {
          setError('That username is already taken. Please choose another.')
        } else {
          setError(insertError.message || 'Failed to create account.')
        }
        setCreating(false)
        return
      }
      if (data) {
        setPlayerId(data.id)
        localStorage.setItem('dominion_player_id', data.id)
        setError(null)
      }
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const loginAsReturning = () => {
    if (returningPlayer?.faction) {
      setSavedFaction(returningPlayer.faction)
      setPage('start')
    } else {
      setPage('factions')
    }
  }

  const chooseFaction = (id) => {
    localStorage.setItem('dominion_faction', id)
    setSavedFaction(id)
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
              {error && <div style={{color:'#f87171',fontSize:13,marginBottom:10}}>{error}</div>}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{width:'100%',padding:'10px',borderRadius:8,border:'none',marginBottom:10,fontSize:14,background:'rgba(255,255,255,0.06)',color:'#fff'}}
                maxLength={20}
              />
              <button className="btn btn-primary" onClick={createAccount} disabled={creating || !username.trim()}>
                {creating ? 'Creating…' : 'Create Account'}
              </button>
              <p className="muted small" style={{marginTop:8}}>Usernames are unique and end with "_". Progress saved to your account.</p>
            </div>
          ) : (
            <div className="account-card">
              <h2 style={{marginBottom:10,fontSize:18,color:'#fff'}}>Welcome back, {returningPlayer?.username || username || 'Player'}</h2>
              {savedFaction ? (
                <p className="muted small">Faction: {savedFaction}. Ready to play.</p>
              ) : (
                <p className="muted small">Pick a faction to start playing.</p>
              )}
              {!savedFaction && (
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
                  {Object.values(FACTIONS).map((f) => (
                    <button key={f.id} className="btn btn-secondary small" onClick={() => chooseFaction(f.id)}>
                      {f.dot} {f.name}
                    </button>
                  ))}
                </div>
              )}
              {!savedFaction && (
                <button className="btn btn-primary" onClick={() => setPage('factions')}>
                  View Faction Details
                </button>
              )}
              {savedFaction && (
                <button className="btn btn-primary" onClick={loginAsReturning}>
                  Start Playing
                </button>
              )}
            </div>
          )}

          <div className="hero-actions" style={{marginTop:hasAccount ? 0 : 20}}>
            {hasAccount && savedFaction && (
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
