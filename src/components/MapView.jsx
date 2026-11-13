import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { CAPTURE_RADIUS_M } from '../game/constants'

export default function MapView({ position, territories, buildings, faction, onCapture, onBattle, setCaptureLatLng }) {
  const [map, setMap] = useState(null)
  const [viewSet, setViewSet] = useState(false)
  const [pendingCapture, setPendingCapture] = useState(null)

  useEffect(() => {
    if (position && map && !viewSet) {
      map.setView([position.lat, position.lng], 15)
      setViewSet(true)
    }
  }, [position, map, viewSet])

  const handleMapClick = useCallback((e) => {
    if (!faction) return
    const { lat, lng } = e.latlng
    setPendingCapture({ lat, lng })
    setCaptureLatLng({ lat, lng })
  }, [faction, setCaptureLatLng])

  const confirmCapture = useCallback(() => {
    if (!pendingCapture) return
    onCapture(pendingCapture.lat, pendingCapture.lng)
    setPendingCapture(null)
    setCaptureLatLng(null)
  }, [onCapture, pendingCapture, setCaptureLatLng])

  const cancelCapture = useCallback(() => {
    setPendingCapture(null)
    setCaptureLatLng(null)
  }, [setCaptureLatLng])

  const buildingByTerritory = {}
  buildings.forEach((b) => { buildingByTerritory[b.territoryId] = b })

  return (
    <div className="map-wrap" style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[position?.lat ?? -1.2921, position?.lng ?? 36.8219]}
        zoom={15}
        whenCreated={setMap}
        onClick={handleMapClick}
        scrollWheelZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {position && (
          <Circle
            center={[position.lat, position.lng]}
            radius={CAPTURE_RADIUS_M}
            color="#22c55e"
            fillColor="#22c55e"
            fillOpacity={0.08}
            weight={1}
          />
        )}
        {pendingCapture && (
          <Circle
            center={[pendingCapture.lat, pendingCapture.lng]}
            radius={12}
            color="#60a5fa"
            fillColor="#60a5fa"
            fillOpacity={0.9}
            weight={2}
          />
        )}
        {territories.map((t) => {
          const b = buildingByTerritory[t.id]
          const color = t.owner === faction ? '#22c55e' : t.owner ? '#ef4444' : '#94a3b8'
          return (
            <Circle
              key={t.id}
              center={[t.lat, t.lng]}
              radius={CAPTURE_RADIUS_M}
              color={color}
              fillColor={color}
              fillOpacity={t.owner === faction ? 0.12 : 0.06}
              weight={2}
              eventHandlers={{
                click: (ev) => { ev.originalEvent.stopPropagation(); onBattle(t.lat, t.lng); },
              }}
            >
              <Popup>
                <div style={{ minWidth: '170px', fontSize: '13px', padding: '6px 8px' }}>
                  <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                    {t.owner === faction ? 'Your Realm' : t.owner ? 'Enemy Territory' : 'Neutral Land'}
                  </div>
                  {b ? (
                    <>
                      <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: 2 }}>{b.name}</div>
                      <button
                        onClick={(ev) => { ev.stopPropagation(); window.dispatchEvent(new CustomEvent('quickbuild', { detail: t.id })) }}
                        style={{ background: '#1d4ed8', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '12px', width: '100%', marginTop: 6 }}
                      >
                        Manage Building
                      </button>
                    </>
                  ) : (
                    <>
                      {t.owner === faction ? (
                        <button
                          onClick={(ev) => { ev.stopPropagation(); onBattle(t.lat, t.lng); }}
                          style={{ background: '#1d4ed8', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '12px', width: '100%', marginTop: 6 }}
                        >
                          Defend Territory
                        </button>
                      ) : (
                        <button
                          onClick={(ev) => { ev.stopPropagation(); onCapture(t.lat, t.lng); }}
                          style={{ background: '#1d4ed8', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '12px', width: '100%', marginTop: 6 }}
                        >
                          Claim Territory
                        </button>
                      )}
                    </>
                  )}
                </div>
              </Popup>
            </Circle>
          )
        })}
      </MapContainer>
      <div className="gps-hint">
        <div className={`gps-dot ${position ? 'on' : 'off'}`}></div>
        <span>{position ? 'GPS active' : 'GPS unavailable'}</span>
      </div>
      {pendingCapture && (
        <div className="capture-confirm">
          <p style={{margin:0,marginBottom:8}}>Capture territory here?</p>
          <div className="capture-actions">
            <button className="btn btn-primary small" onClick={confirmCapture}>Capture</button>
            <button className="btn btn-ghost small" onClick={cancelCapture}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
