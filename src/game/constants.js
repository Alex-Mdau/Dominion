export const GAME_NAME = 'Dominion'

export const FACTIONS = {
  gis: {
    id: 'gis',
    name: 'GIS Specialists',
    color: '#3b82f6',
    dot: '🗺️',
    desc: 'Spatial data experts, precise boundaries, structured analysis.',
    bonus: 'Defensive towers deal +25% damage.',
  },
  surveyor: {
    id: 'surveyor',
    name: 'Land Surveyor',
    color: '#10b981',
    dot: '📏',
    desc: 'Measure and divide the land, economy founded on accuracy.',
    bonus: 'Resource production +20%.',
  },
  cartographer: {
    id: 'cartographer',
    name: 'Cartographer',
    color: '#ef4444',
    dot: '🧭',
    desc: 'Mapmakers, ruthless and efficient, redraw the world.',
    bonus: 'Units train 25% faster.',
  },
}

export const BUILDINGS = {
  farm: {
    id: 'farm', name: 'Farm', icon: '🌾', color: '#10b981',
    cost: { food: 50, wood: 30 },
    produces: { food: 2 },
    desc: 'Grows food to feed your population.',
  },
  barracks: {
    id: 'barracks', name: 'Barracks', icon: '⚔️', color: '#ef4444',
    cost: { wood: 80, stone: 40 },
    produces: { units: 1 },
    desc: 'Recruits military units.',
  },
  tower: {
    id: 'tower', name: 'Defense Tower', icon: '🏰', color: '#3b82f6',
    cost: { stone: 100, wood: 50 },
    produces: { defense: 1 },
    desc: 'Defends territory from attacks.',
  },
  warehouse: {
    id: 'warehouse', name: 'Warehouse', icon: '📦', color: '#f59e0b',
    cost: { wood: 60, stone: 30 },
    produces: { storage: 200 },
    desc: 'Increases resource storage capacity.',
  },
  market: {
    id: 'market', name: 'Market', icon: '💰', color: '#fbbf24',
    cost: { gold: 100, wood: 40 },
    produces: { gold: 2 },
    desc: 'Generates gold through trade.',
  },
}

export const RESOURCES = {
  food: { id: 'food', name: 'Food', icon: '🍞', color: '#10b981' },
  wood: { id: 'wood', name: 'Wood', icon: '🪵', color: '#65a30d' },
  stone: { id: 'stone', name: 'Stone', icon: '🪨', color: '#9ca3af' },
  gold: { id: 'gold', name: 'Gold', icon: '💰', color: '#fbbf24' },
}

export const CAPTURE_RADIUS_M = 400
export const TICK_INTERVAL_MS = 5000
export const DEFAULT_CENTER = [-1.2921, 36.8219]
export const DEFAULT_ZOOM = 15
