import { FACTIONS, BUILDINGS, DEFAULT_CENTER, CAPTURE_RADIUS_M } from './constants'

const STORAGE_KEY = 'realm_game_v1'

export const initialState = () => ({
  version: 1,
  faction: null,
  createdAt: Date.now(),
  resources: {
    food: 100,
    wood: 100,
    stone: 50,
    gold: 0,
  },
  storage: { food: 500, wood: 500, stone: 500, gold: 500 },
  position: { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1], accuracy: 0, updatedAt: 0 },
  territories: [],
  buildings: [],
  units: [],
  lastTick: Date.now(),
  notifications: [],
})

export function clone(state) {
  return JSON.parse(JSON.stringify(state))
}

export function addNotification(state, { type, message }) {
  const notif = { id: Date.now() + Math.random(), type, message, t: Date.now() }
  state.notifications.push(notif)
  if (state.notifications.length > 8) state.notifications.shift()
  return notif
}

export function canAfford(resources, cost) {
  for (const [k, v] of Object.entries(cost)) {
    if ((resources[k] || 0) < v) return false
  }
  return true
}

export function deduct(resources, cost) {
  const next = { ...resources }
  for (const [k, v] of Object.entries(cost)) {
    next[k] = (next[k] || 0) - v
  }
  return next
}

export function addResources(state, delta) {
  const next = { ...state.resources }
  for (const [k, v] of Object.entries(delta)) {
    next[k] = Math.min((next[k] || 0) + v, state.storage[k] || 0)
  }
  state.resources = next
}

export function storageFor(state) {
  const base = { food: 500, wood: 500, stone: 500, gold: 500 }
  let bonus = 0
  state.buildings.forEach((b) => {
    if (b.id === 'warehouse') bonus += 200
  })
  return { food: base.food + bonus, wood: base.wood + bonus, stone: base.stone + bonus, gold: base.gold + bonus }
}

export function tickProduction(state) {
  const now = Date.now()
  const elapsed = now - state.lastTick
  if (elapsed < 1000) return
  const ticks = Math.floor(elapsed / 1000)
  state.lastTick = now - (elapsed % 1000)

  let rates = { food: 0, wood: 0, stone: 0, gold: 0 }
  let unitRate = 0
  state.buildings.forEach((b) => {
    const def = BUILDINGS[b.id]
    if (!def) return
    if (def.produces.food) rates.food += def.produces.food
    if (def.produces.gold) rates.gold += def.produces.gold
    if (def.produces.units) unitRate += def.produces.units
  })

  const faction = FACTIONS[state.faction]
  if (faction && state.faction === 'surveyor') {
    rates.food = Math.round(rates.food * 1.2)
    rates.gold = Math.round(rates.gold * 1.2)
  }

  for (const [k, v] of Object.entries(rates)) {
    if (v > 0) {
      state.resources[k] = Math.min((state.resources[k] || 0) + v * ticks, state.storage[k] || 0)
    }
  }

  if (unitRate > 0) {
    const newUnits = Math.floor(unitRate * ticks)
    for (let i = 0; i < newUnits; i++) {
      state.units.push({ id: Date.now() + i, hp: 100, atk: 10, home: null })
    }
  }
}

export function distanceM(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function findTerritoryAt(state, lat, lng) {
  return state.territories.find(
    (t) => distanceM(t.lat, t.lng, lat, lng) <= CAPTURE_RADIUS_M
  )
}

export function territoryOwner(state, lat, lng) {
  const t = findTerritoryAt(state, lat, lng)
  return t ? t.owner : null
}

export const persistence = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch (e) {
      return null
    }
  },
  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('failed to save game', e)
    }
  },
}

export default initialState
