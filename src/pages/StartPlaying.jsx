import { useState, useEffect, useRef, useCallback } from 'react'
import {
  initialState,
  addNotification,
  canAfford,
  deduct,
  tickProduction,
  findTerritoryAt,
  persistence,
} from '../game/state'
import { BUILDINGS, FACTIONS } from '../game/constants'
import { supabase, PLAYER_TABLE, TERRITORY_TABLE } from '../lib/supabase'
import MapView from '../components/MapView'
import HUD from '../components/HUD'
import BuildMenu from '../components/BuildMenu'
import BattleView from '../components/BattleView'

export default function StartPlaying({ setPage }) {
  const [state, setState] = useState(() => {
    const saved = persistence.load() || initialState()
    const savedFaction = localStorage.getItem('dominion_faction')
    if (savedFaction && !saved.faction) saved.faction = savedFaction
    return saved
  })
  const [battle, setBattle] = useState(null)
  const [captureLatLng, setCaptureLatLng] = useState(null)
  const [playerId, setPlayerId] = useState(() => localStorage.getItem('dominion_player_id') || null)
  const [panel, setPanel] = useState('hud')
  const tickRef = useRef(null)
  const saveRef = useRef(null)

  useEffect(() => {
    if (!state.faction) {
      setPage('factions')
      return
    }
    saveRef.timeout = setTimeout(() => persistence.save(state), 500)
    return () => clearTimeout(saveRef.timeout)
  }, [state, setPage])

  useEffect(() => {
    if (!state.faction) return
    tickRef.current = setInterval(() => {
      setState((s) => {
        const next = { ...s }
        tickProduction(next)
        return next
      })
    }, 1000)
    return () => clearInterval(tickRef.current)
  }, [state.faction])

  const notify = useCallback((type, message) => {
    setState((s) => {
      const next = { ...s }
      addNotification(next, { type, message })
      return next
    })
  }, [])

  const chooseFaction = async (id) => {
    setState((s) => {
      const next = { ...s }
      next.faction = id
      addNotification(next, { type: 'success', message: `Sworn to the ${FACTIONS[id].name}` })
      return next
    })
    await registerPlayer(id)
  }

  const registerPlayer = async (faction) => {
    if (!supabase) return
    let id = playerId
    if (!id) {
      const { data, error } = await supabase
        .from(PLAYER_TABLE)
        .insert({ username: `Player_${Math.floor(Math.random() * 9000) + 1000}`, faction, territories_count: 0 })
        .select('id')
        .single()
      if (!error && data) {
        id = data.id
        setPlayerId(id)
        localStorage.setItem('dominion_player_id', id)
      }
    } else {
      await supabase.from(PLAYER_TABLE).update({ faction }).eq('id', id)
    }
  }

  const syncTerritoryCount = async () => {
    if (!supabase || !playerId) return
    const count = state.territories.filter((t) => t.owner === state.faction).length
    await supabase.from(PLAYER_TABLE).update({ territories_count: count }).eq('id', playerId)
  }

  const insertTerritory = async (lat, lng) => {
    if (!supabase || !playerId) return
    await supabase.from(TERRITORY_TABLE).insert({ player_id: playerId, lat, lng })
  }

  const captureTerritory = async (lat, lng) => {
    if (!state.faction) { notify('error', 'Choose a faction first.'); return }
    const existing = findTerritoryAt(state, lat, lng)
    if (existing) {
      if (existing.owner === state.faction) { notify('error', 'Already yours.'); return }
      notify('error', 'Territory is contested by an enemy.')
      return
    }
    setState((s) => {
      const next = { ...s }
      next.territories.push({ id: Date.now(), lat, lng, owner: state.faction, capturedAt: Date.now() })
      addNotification(next, { type: 'success', message: 'Territory captured!' })
      return next
    })
    setCaptureLatLng(null)
    await registerPlayer(state.faction)
    await insertTerritory(lat, lng)
    await syncTerritoryCount()
  }

  const build = (territoryId, buildingId) => {
    const def = BUILDINGS[buildingId]
    if (!def) return
    if (!canAfford(state.resources, def.cost)) { notify('error', 'Not enough resources.'); return }
    const territory = state.territories.find((t) => t.id === territoryId)
    if (!territory || territory.owner !== state.faction) { notify('error', 'No owned territory here.'); return }
    if (state.buildings.find((b) => b.territoryId === territoryId)) { notify('error', 'One building per territory.'); return }
    setState((s) => {
      const next = { ...s }
      next.resources = deduct(next.resources, def.cost)
      next.buildings.push({ id: Date.now(), territoryId, buildingId, builtAt: Date.now() })
      addNotification(next, { type: 'success', message: `${def.name} built.` })
      return next
    })
  }

  const startBattle = (lat, lng) => {
    setBattle({ lat, lng, defenderHp: 100, attackerHp: 100, log: [] })
  }

  const resolveBattle = (result) => {
    setBattle(null)
    if (result === 'win') notify('success', 'Battle won! Territory secured.')
    else notify('error', 'Battle lost. Reinforce your troops.')
  }

  return (
    <div className="page start">
      <header className="start-header">
        <button className="btn btn-ghost small" onClick={() => setPage('factions')}>← Back</button>
        <h1>Start Playing</h1>
        {!state.faction && (
          <button className="btn btn-primary" onClick={() => setPage('factions')}>Choose Faction</button>
        )}
      </header>
      {!state.faction ? (
        <div className="empty-state">
          <h2>Pick a faction to begin</h2>
          <p>Choose your allegiance, then head out to capture territory around RCMRD.</p>
          <div style={{display:'flex',gap:8,flexDirection:'column'}}>
            {Object.values(FACTIONS).map((f) => (
              <button key={f.id} className="btn btn-primary small" onClick={() => chooseFaction(f.id)}>
                {f.dot} {f.name}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary small" style={{marginTop:10}} onClick={() => setPage('factions')}>
            View Faction Details
          </button>
        </div>
      ) : (
        <>
          <div className="game-layout">
            <MapView
              position={state.position}
              territories={state.territories}
              buildings={state.buildings}
              faction={state.faction}
              onCapture={captureTerritory}
              onBattle={startBattle}
              setCaptureLatLng={setCaptureLatLng}
              captureLatLng={captureLatLng}
            />
          </div>
          <div className="bottom-panel">
            <div className="panel-tabs">
              <button className={`tab ${panel === 'hud' ? 'active' : ''}`} onClick={() => setPanel('hud')}>Realm</button>
              <button className={`tab ${panel === 'build' ? 'active' : ''}`} onClick={() => setPanel('build')}>Build</button>
              <button className={`tab ${panel === 'territories' ? 'active' : ''}`} onClick={() => setPanel('territories')}>Territories</button>
            </div>
            <div className="panel-content">
              {panel === 'hud' && <HUD state={state} setPanel={setPanel} />}
              {panel === 'build' && <BuildMenu state={state} onBuild={build} onBattle={startBattle} />}
              {panel === 'territories' && (
                <div className="section">
                  <div className="section-title">Territories</div>
                  {state.territories.length === 0 ? (
                    <p className="muted">No territories yet. Tap the map near you to claim land.</p>
                  ) : (
                    state.territories.map((t) => (
                      <div
                        key={t.id}
                        className={`territory-card ${t.owner === state.faction ? 'badge-own' : t.owner ? 'badge-enemy' : 'badge-neutral'}`}
                      >
                        <div className="territory-info">
                          <div className="name">{t.owner === state.faction ? 'Your Realm' : t.owner ? 'Enemy Territory' : 'Neutral Land'}</div>
                          <div className="dist">Captured {new Date(t.capturedAt).toLocaleTimeString()}</div>
                        </div>
                        <div className={`territory-badge ${t.owner === state.faction ? 'badge-own' : t.owner ? 'badge-enemy' : 'badge-neutral'}`}>
                          {t.owner === state.faction ? 'OWNED' : t.owner ? 'ENEMY' : 'NEUTRAL'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          {battle && <BattleView battle={battle} onResult={resolveBattle} />}
        </>
      )}
    </div>
  )
}
