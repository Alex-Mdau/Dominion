import { useEffect, useState } from 'react'

export default function BattleView({ battle, onResult }) {
  const [log, setLog] = useState(battle.log)
  const [defenderHp, setDefenderHp] = useState(battle.defenderHp)
  const [attackerHp, setAttackerHp] = useState(battle.attackerHp)
  const [phase, setPhase] = useState('defend')

  useEffect(() => {
    if (phase !== 'idle') return
    const id = setInterval(() => {
      setDefenderHp((p) => Math.max(0, p - 12))
      setAttackerHp((p) => Math.max(0, p - 8))
      setLog((l) => [...l, `Defender hit! Tower fires.`])
    }, 900)
    return () => clearInterval(id)
  }, [phase])

  const handleDefend = () => {
    setPhase('defend')
    setLog([...log, 'You hold the line.'])
    if (defenderHp <= 0) {
      setTimeout(() => onResult('lose'), 600)
    }
  }

  const handleCounter = () => {
    setPhase('counter')
    setLog([...log, 'Your units charge!'])
    setAttackerHp((p) => Math.max(0, p - 20))
    if (attackerHp <= 20) {
      setTimeout(() => onResult('win'), 600)
    }
  }

  if (defenderHp <= 0) return <div className="battle" style={{justifyContent:'center',alignItems:'center'}}>
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:'28px',color:'#ef4444',fontWeight:700,marginBottom:10}}>Defeat</div>
      <button className="btn" onClick={() => onResult('lose')}>Retreat</button>
    </div>
  </div>
  if (attackerHp <= 0) return <div className="battle" style={{justifyContent:'center',alignItems:'center'}}>
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:'28px',color:'#22c55e',fontWeight:700,marginBottom:10}}>Victory</div>
      <button className="btn" onClick={() => onResult('win')}>Secure Territory</button>
    </div>
  </div>

  return (
    <div className="battle">
      <div className="battle-header">
        <div><div style={{fontWeight:700,color:'#fff'}}>Tower Defense</div><div style={{fontSize:'12px',color:'#94a3b8'}}>Defend your realm</div></div>
        <button className="btn secondary small" onClick={() => onResult('retreat')}>Retreat</button>
      </div>
      <div className="battle-map">
        <div style={{width:'100%',height:'100%',background:'rgba(255,255,255,0.03)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',fontSize:'12px'}}>Battle map placeholder</div>
      </div>
      <div style={{display:'flex',gap:12,marginBottom:16}}>
        <div style={{flex:1}}>
          <div className="label-val"><span>Tower</span><span>{defenderHp} HP</span></div>
          <div className="progress-bg"><div className="progress-fill" style={{width: Math.max(0, defenderHp) + '%'}}></div></div>
        </div>
        <div style={{flex:1}}>
          <div className="label-val"><span>Invaders</span><span>{attackerHp} HP</span></div>
          <div className="progress-bg"><div className="progress-fill" style={{background:'#ef4444',width: Math.max(0, attackerHp) + '%'}}></div></div>
        </div>
      </div>
      <div className="battle-controls">
        <button className="btn" onClick={handleDefend}>Hold Line</button>
        <button className="btn danger" onClick={handleCounter}>Counter-attack</button>
      </div>
      <div style={{marginTop:12,fontSize:'12px',color:'#94a3b8',maxHeight:120,overflowY:'auto'}}>
        {log.slice(-6).map((m, i) => <div key={i}>{m}</div>)}
      </div>
    </div>
  )
}
