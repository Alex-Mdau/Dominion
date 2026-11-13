import { useEffect, useState } from 'react'
import { supabase, PLAYER_TABLE } from '../lib/supabase'

export default function Leaderboard() {
  const [players, setPlayers] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from(PLAYER_TABLE)
        .select('*')
        .order('territories_count', { ascending: false })
        .limit(300)
      if (!error && data) {
        setPlayers(data)
      }
    }

    fetchPlayers()

    const channel = supabase
      .channel('leaderboard-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: PLAYER_TABLE,
        },
        (/* payload */) => {
          setConnected(true)
          fetchPlayers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (!supabase) {
    return (
      <div className="page leaderboard">
        <div className="container">
          <h1>Dominion Leaderboard</h1>
          <p className="muted">Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page leaderboard">
      <div className="container">
        <h1>Dominion Leaderboard</h1>
        <p className="lead">Top realms by territory captured around RCMRD. Updates live as players capture land.</p>
        <div className="leaderboard-sync">
          <span className={`sync-dot ${connected ? 'live' : ''}`}></span>
          <span>{connected ? 'Connected — live updates (300 players)' : 'Connecting…'}</span>
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>Realm</th><th>Faction</th><th>Territories</th></tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr><td colSpan="4" className="muted">No players yet. Be the first to capture territory.</td></tr>
            ) : (
              players.map((p, i) => (
                <tr key={p.id} className={i < 3 ? 'top' : ''}>
                  <td>{i + 1}</td>
                  <td>{p.username || 'Anonymous'}</td>
                  <td>{p.faction || '—'}</td>
                  <td>{p.territories_count ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
