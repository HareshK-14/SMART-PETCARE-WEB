import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Brain, Shield, Target, Waves, Map, Radar, BarChart3, Star, AlertTriangle, Heart, TrendingUp, Microscope, Stethoscope } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   1. ClinicalEnergyDetectorPanel
───────────────────────────────────────────────────────────── */
export function ClinicalEnergyDetectorPanel() {
  const [bars, setBars] = useState(Array.from({ length: 10 }, () => Math.random()));
  const [energyScore, setEnergyScore] = useState(72);
  const [history] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      t: i,
      v: 40 + Math.round(Math.sin(i * 0.5) * 25 + Math.random() * 10),
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setBars(Array.from({ length: 10 }, () => 0.15 + Math.random() * 0.85));
      setEnergyScore(prev => {
        const delta = Math.floor((Math.random() - 0.48) * 4);
        return Math.min(100, Math.max(0, prev + delta));
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const getColor = v => {
    if (v < 0.4) return '#14b8a6';
    if (v < 0.75) return '#f59e0b';
    return '#ef4444';
  };
  const scoreColor = energyScore < 40 ? '#14b8a6' : energyScore < 75 ? '#f59e0b' : '#ef4444';
  const maxV = Math.max(...history.map(h => h.v));

  return (
    <div style={{
      background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: 20,
      padding: 24,
      fontFamily: 'sans-serif',
      color: '#e2e8f0',
      minHeight: 340,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow backdrop */}
      <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220,
        background:'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ background:'rgba(99,102,241,0.2)', borderRadius:10, padding:8 }}>
          <Zap size={18} color="#6366f1" />
        </div>
        <span style={{ fontWeight:700, fontSize:15, letterSpacing:'0.04em' }}>Clinical Energy Detector</span>
        <div style={{ marginLeft:'auto', background: `${scoreColor}22`, border:`1px solid ${scoreColor}55`,
          borderRadius:8, padding:'4px 12px', fontSize:13, fontWeight:700, color:scoreColor }}>
          {energyScore} EL
        </div>
      </div>

      {/* Equalizer bars */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:5, height:90, marginBottom:16, justifyContent:'center' }}>
        {bars.map((v, i) => (
          <motion.div
            key={i}
            animate={{ height: `${Math.round(v * 88)}px` }}
            transition={{ type:'spring', stiffness:200, damping:18 }}
            style={{
              width: 18,
              borderRadius: 4,
              background: `linear-gradient(to top, ${getColor(v)}, ${getColor(v)}88)`,
              boxShadow: `0 0 8px ${getColor(v)}88`,
              minHeight: 6,
            }}
          />
        ))}
      </div>

      <div style={{ fontSize:11, color:'#94a3b8', marginBottom:8, letterSpacing:'0.06em' }}>ENERGY TIMELINE (LAST 20 READINGS)</div>

      {/* Mini timeline chart */}
      <svg width="100%" height={52} viewBox={`0 0 ${history.length * 17} 52`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinejoin="round"
          points={history.map((h, i) => `${i * 17 + 8},${52 - (h.v / maxV) * 44}`).join(' ')}
        />
        <polygon
          fill="url(#eGrad)"
          points={[
            ...history.map((h, i) => `${i * 17 + 8},${52 - (h.v / maxV) * 44}`),
            `${(history.length - 1) * 17 + 8},52`,
            `8,52`,
          ].join(' ')}
        />
        {history.map((h, i) => (
          <circle key={i} cx={i * 17 + 8} cy={52 - (h.v / maxV) * 44} r={2} fill="#6366f1" />
        ))}
      </svg>

      <div style={{ marginTop:10, display:'flex', gap:14, fontSize:11 }}>
        {[['LOW','#14b8a6'],['MID','#f59e0b'],['HIGH','#ef4444']].map(([l, c]) => (
          <span key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:10, height:10, borderRadius:2, background:c, display:'inline-block' }}/>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. TreatmentImpactRadarPanel
───────────────────────────────────────────────────────────── */
export function TreatmentImpactRadarPanel() {
  const axes = ['Effectiveness', 'Speed', 'Tolerance', 'Recovery', 'Satisfaction', 'Side Effects'];
  const expected = [88, 72, 90, 65, 85, 78];
  const actual = [76, 84, 70, 80, 91, 60];
  const [animated, setAnimated] = useState(false);

  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);

  const cx = 130, cy = 130, r = 100;
  const angle = i => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  const point = (val, i) => {
    const scale = animated ? val / 100 : 0;
    return [cx + Math.cos(angle(i)) * r * scale, cy + Math.sin(angle(i)) * r * scale];
  };

  const polygon = (vals, color) =>
    vals.map((v, i) => point(v, i).join(',')).join(' ');

  return (
    <div style={{
      background:'linear-gradient(135deg,#0f172a 0%,#1a1035 100%)',
      border:'1px solid rgba(139,92,246,0.3)', borderRadius:20, padding:24,
      fontFamily:'sans-serif', color:'#e2e8f0', minHeight:340, position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:-80, left:-80, width:260, height:260,
        background:'radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ background:'rgba(139,92,246,0.2)', borderRadius:10, padding:8 }}>
          <Target size={18} color="#8b5cf6" />
        </div>
        <span style={{ fontWeight:700, fontSize:15 }}>Treatment Impact Radar</span>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width={260} height={260} viewBox="0 0 260 260">
          {/* Grid rings */}
          {[0.25,0.5,0.75,1].map(scale => (
            <polygon key={scale}
              points={axes.map((_, i) => [cx + Math.cos(angle(i))*r*scale, cy + Math.sin(angle(i))*r*scale].join(',')).join(' ')}
              fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth={1}
            />
          ))}
          {/* Spokes */}
          {axes.map((_, i) => (
            <line key={i} x1={cx} y1={cy}
              x2={cx + Math.cos(angle(i))*r} y2={cy + Math.sin(angle(i))*r}
              stroke="rgba(139,92,246,0.2)" strokeWidth={1}/>
          ))}
          {/* Expected polygon */}
          <motion.polygon
            points={polygon(expected)}
            fill="rgba(99,102,241,0.18)" stroke="#6366f1" strokeWidth={2}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8 }}
          />
          {/* Actual polygon */}
          <motion.polygon
            points={polygon(actual)}
            fill="rgba(20,184,166,0.18)" stroke="#14b8a6" strokeWidth={2}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1, delay:0.4 }}
          />
          {/* Axis labels */}
          {axes.map((label, i) => {
            const lx = cx + Math.cos(angle(i)) * (r + 18);
            const ly = cy + Math.sin(angle(i)) * (r + 18);
            return (
              <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fill="#94a3b8" fontFamily="sans-serif">
                {label}
              </text>
            );
          })}
          {/* Dots */}
          {actual.map((v, i) => {
            const [px, py] = point(v, i);
            return <circle key={i} cx={px} cy={py} r={4} fill="#14b8a6" stroke="#0f172a" strokeWidth={1.5}/>;
          })}
          {expected.map((v, i) => {
            const [px, py] = point(v, i);
            return <circle key={i} cx={px} cy={py} r={3} fill="#6366f1" stroke="#0f172a" strokeWidth={1.5}/>;
          })}
        </svg>
      </div>

      <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:4 }}>
        {[['Expected','#6366f1'],['Actual','#14b8a6']].map(([l,c]) => (
          <span key={l} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12 }}>
            <span style={{ width:14, height:3, background:c, borderRadius:2, display:'inline-block' }}/>
            <span style={{ color:'#94a3b8' }}>{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. RecoveryWaveSimulatorPanel
───────────────────────────────────────────────────────────── */
export function RecoveryWaveSimulatorPanel() {
  const [playing, setPlaying] = useState(false);
  const [day, setDay] = useState(0);
  const days = 14;
  const recoveryDay = 11;
  const W = 340, H = 90;

  useEffect(() => {
    if (!playing) return;
    if (day >= days) { setPlaying(false); return; }
    const id = setTimeout(() => setDay(d => d + 1), 400);
    return () => clearTimeout(id);
  }, [playing, day]);

  const amplitude = (d) => Math.max(2, 30 - d * 2);
  const buildPath = (currentDay) => {
    const pts = [];
    for (let x = 0; x <= W; x += 2) {
      const t = (x / W) * days;
      const amp = amplitude(Math.min(t, currentDay));
      const y = H / 2 + Math.sin((x / W) * Math.PI * 6) * amp;
      pts.push(`${x},${y}`);
    }
    return 'M' + pts.join('L');
  };

  return (
    <div style={{
      background:'linear-gradient(135deg,#0c1a2e 0%,#0f172a 100%)',
      border:'1px solid rgba(20,184,166,0.3)', borderRadius:20, padding:24,
      fontFamily:'sans-serif', color:'#e2e8f0', minHeight:340, position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', bottom:-80, right:-80, width:240, height:240,
        background:'radial-gradient(circle,rgba(20,184,166,0.12) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <div style={{ background:'rgba(20,184,166,0.2)', borderRadius:10, padding:8 }}>
          <Waves size={18} color="#14b8a6" />
        </div>
        <span style={{ fontWeight:700, fontSize:15 }}>Recovery Wave Simulator</span>
        <div style={{ marginLeft:'auto', background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)',
          borderRadius:8, padding:'4px 10px', fontSize:11, color:'#10b981' }}>
          Day {day} / {days}
        </div>
      </div>

      <svg width="100%" height={H + 20} viewBox={`0 0 ${W} ${H + 20}`}>
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#14b8a6"/>
            <stop offset="100%" stopColor="#6366f1"/>
          </linearGradient>
          <filter id="waveGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Day markers */}
        {Array.from({length:days+1},(_,i)=>(
          <g key={i}>
            <line x1={i*(W/days)} y1={0} x2={i*(W/days)} y2={H}
              stroke={i===recoveryDay ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.06)'}
              strokeWidth={i===recoveryDay ? 2 : 1} strokeDasharray={i===recoveryDay?'4,3':''}/>
            {i % 2 === 0 && (
              <text x={i*(W/days)} y={H+14} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="sans-serif">D{i}</text>
            )}
          </g>
        ))}
        {/* Full path (ghost) */}
        <path d={buildPath(days)} fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth={2}/>
        {/* Animated path */}
        <motion.path
          d={buildPath(day)}
          fill="none"
          stroke="url(#waveGrad)"
          strokeWidth={2.5}
          filter="url(#waveGlow)"
          initial={{ pathLength:0 }}
          animate={{ pathLength:1 }}
          key={day}
        />
        {/* Recovery marker */}
        <g transform={`translate(${recoveryDay*(W/days)},${H/2})`}>
          <circle r={7} fill="rgba(16,185,129,0.25)" stroke="#10b981" strokeWidth={1.5}/>
          <circle r={3} fill="#10b981"/>
        </g>
        <text x={recoveryDay*(W/days)+10} y={H/2-10} fontSize={8} fill="#10b981" fontFamily="sans-serif">Full Recovery</text>
      </svg>

      <div style={{ marginTop:12, display:'flex', gap:10, alignItems:'center' }}>
        <motion.button
          whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
          onClick={() => { setDay(0); setPlaying(true); }}
          style={{ background:'linear-gradient(90deg,#14b8a6,#6366f1)', border:'none', borderRadius:10,
            padding:'8px 18px', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          ▶ Simulate
        </motion.button>
        <motion.button
          whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
          onClick={() => { setPlaying(false); setDay(0); }}
          style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
            padding:'8px 14px', color:'#94a3b8', fontSize:13, cursor:'pointer' }}>
          Reset
        </motion.button>
        <div style={{ marginLeft:'auto', fontSize:11, color:'#64748b' }}>
          Pred. recovery: Day {recoveryDay}
        </div>
      </div>

      <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        {[['Amplitude','High → Low'],['Phase','Damped Sine'],['Progress',`${Math.round((day/days)*100)}%`]].map(([k,v])=>(
          <div key={k} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'8px 10px' }}>
            <div style={{ fontSize:10, color:'#64748b' }}>{k}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'#e2e8f0', marginTop:2 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. SurgicalFlowMapPanel
───────────────────────────────────────────────────────────── */
export function SurgicalFlowMapPanel() {
  const steps = ['Pre-op','Anesthesia','Incision','Procedure','Closure','Recovery','Post-op'];
  const [currentStep, setCurrentStep] = useState(2);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setCurrentStep(s => {
        if (s >= steps.length - 1) { setAuto(false); return s; }
        return s + 1;
      });
    }, 1400);
    return () => clearInterval(id);
  }, [auto]);

  const statusColor = i => {
    if (i < currentStep) return '#10b981';
    if (i === currentStep) return '#6366f1';
    return '#334155';
  };
  const statusText = i => {
    if (i < currentStep) return 'Done';
    if (i === currentStep) return 'Active';
    return 'Pending';
  };

  return (
    <div style={{
      background:'linear-gradient(135deg,#0f172a 0%,#1a1035 100%)',
      border:'1px solid rgba(99,102,241,0.3)', borderRadius:20, padding:24,
      fontFamily:'sans-serif', color:'#e2e8f0', minHeight:340, overflow:'hidden', position:'relative',
    }}>
      <div style={{ position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)', width:300, height:300,
        background:'radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <div style={{ background:'rgba(99,102,241,0.2)', borderRadius:10, padding:8 }}>
          <Map size={18} color="#6366f1" />
        </div>
        <span style={{ fontWeight:700, fontSize:15 }}>Surgical Flow Map</span>
        <div style={{ marginLeft:'auto', background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)',
          borderRadius:8, padding:'4px 10px', fontSize:11, color:'#10b981' }}>
          Step {currentStep+1}/{steps.length}
        </div>
      </div>

      {/* Vertical flow */}
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <motion.div
                animate={i === currentStep ? { boxShadow:['0 0 0px #6366f1','0 0 18px #6366f155','0 0 0px #6366f1'], scale:[1,1.08,1] } : {}}
                transition={{ repeat:Infinity, duration:1.5 }}
                style={{
                  width:32, height:32, borderRadius:'50%',
                  background: i < currentStep ? '#10b981' : i === currentStep ? '#6366f1' : '#1e293b',
                  border: `2px solid ${statusColor(i)}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, fontWeight:700, color: i <= currentStep ? '#fff' : '#475569',
                  flexShrink:0,
                }}>
                {i < currentStep ? '✓' : i + 1}
              </motion.div>
              {i < steps.length - 1 && (
                <div style={{ width:2, height:24, background: i < currentStep ? '#10b981' : 'rgba(255,255,255,0.08)', borderRadius:1 }}/>
              )}
            </div>
            <div style={{ paddingBottom: i < steps.length - 1 ? 24 : 0 }}>
              <div style={{ fontSize:13, fontWeight:i===currentStep?700:500, color: i<=currentStep?'#e2e8f0':'#475569' }}>{step}</div>
              <div style={{ fontSize:10, color:statusColor(i), marginTop:1 }}>{statusText(i)}</div>
            </div>
            {i===currentStep && (
              <motion.div
                animate={{ opacity:[0.5,1,0.5] }} transition={{ repeat:Infinity, duration:1.2 }}
                style={{ marginLeft:'auto', marginBottom:24, background:'rgba(99,102,241,0.15)',
                  border:'1px solid rgba(99,102,241,0.4)', borderRadius:6, padding:'3px 8px', fontSize:10, color:'#a5b4fc' }}>
                IN PROGRESS
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:10, marginTop:8 }}>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
          onClick={() => { setCurrentStep(0); setAuto(true); }}
          style={{ background:'linear-gradient(90deg,#6366f1,#8b5cf6)', border:'none', borderRadius:10,
            padding:'7px 16px', color:'#fff', fontWeight:700, fontSize:12, cursor:'pointer', flex:1 }}>
          ▶ Auto-Play
        </motion.button>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
          onClick={() => setCurrentStep(s => Math.min(steps.length-1, s+1))}
          style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
            padding:'7px 14px', color:'#94a3b8', fontSize:12, cursor:'pointer' }}>
          Next →
        </motion.button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. HealthAnomalyDetectorPanel
───────────────────────────────────────────────────────────── */
export function HealthAnomalyDetectorPanel() {
  const metrics = [
    { name:'Heart Rate', unit:'bpm', value:78, normal:[60,100], spark:[72,74,78,76,80,78,79] },
    { name:'Temperature', unit:'°F', value:103.4, normal:[100.5,102.5], spark:[101,101.5,102,102.8,103.1,103.4,103.2] },
    { name:'Respiration', unit:'/min', value:22, normal:[15,25], spark:[18,19,21,22,21,22,23] },
    { name:'Blood Pressure', unit:'mmHg', value:148, normal:[100,140], spark:[130,135,138,140,143,146,148] },
    { name:'SpO₂', unit:'%', value:97, normal:[95,100], spark:[97,96,97,98,97,97,97] },
    { name:'Glucose', unit:'mg/dL', value:89, normal:[70,110], spark:[85,88,90,89,87,88,89] },
    { name:'Cortisol', unit:'µg/dL', value:24, normal:[5,20], spark:[12,15,18,20,21,23,24] },
    { name:'Hydration', unit:'%', value:73, normal:[70,85], spark:[78,77,76,75,74,73,73] },
  ];
  const isAnomaly = m => m.value < m.normal[0] || m.value > m.normal[1];

  const Sparkline = ({ data, anomaly }) => {
    const mn = Math.min(...data), mx = Math.max(...data), range = mx - mn || 1;
    const pts = data.map((v, i) => `${i * 14 + 4},${26 - ((v - mn) / range) * 22}`).join(' ');
    return (
      <svg width={data.length*14+4} height={28}>
        <polyline points={pts} fill="none" stroke={anomaly?'#ef4444':'#14b8a6'} strokeWidth={1.5} strokeLinejoin="round"/>
        {data.map((v, i) => (
          <circle key={i} cx={i*14+4} cy={26-((v-mn)/range)*22} r={i===data.length-1?3:1.5}
            fill={anomaly?'#ef4444':'#14b8a6'}/>
        ))}
      </svg>
    );
  };

  return (
    <div style={{
      background:'linear-gradient(135deg,#0f172a 0%,#1a0f2e 100%)',
      border:'1px solid rgba(239,68,68,0.2)', borderRadius:20, padding:24,
      fontFamily:'sans-serif', color:'#e2e8f0', overflow:'hidden', position:'relative',
    }}>
      <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200,
        background:'radial-gradient(circle,rgba(239,68,68,0.1) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ background:'rgba(239,68,68,0.2)', borderRadius:10, padding:8 }}>
          <AlertTriangle size={18} color="#ef4444" />
        </div>
        <span style={{ fontWeight:700, fontSize:15 }}>Health Anomaly Detector</span>
        <div style={{ marginLeft:'auto', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)',
          borderRadius:8, padding:'4px 10px', fontSize:11, color:'#f87171' }}>
          {metrics.filter(isAnomaly).length} Anomalies
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {metrics.map((m, i) => {
          const anomaly = isAnomaly(m);
          return (
            <motion.div key={i}
              animate={anomaly ? { borderColor:['rgba(239,68,68,0.3)','rgba(239,68,68,0.8)','rgba(239,68,68,0.3)'] } : {}}
              transition={anomaly ? { repeat:Infinity, duration:1.5 } : {}}
              style={{
                background: anomaly ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${anomaly?'rgba(239,68,68,0.4)':'rgba(255,255,255,0.07)'}`,
                borderRadius:12, padding:'10px 12px', position:'relative', overflow:'hidden',
              }}>
              {anomaly && (
                <motion.div
                  animate={{ opacity:[0,1,0] }} transition={{ repeat:Infinity, duration:1.2 }}
                  style={{ position:'absolute', top:6, right:6, background:'#ef4444', borderRadius:4,
                    padding:'1px 5px', fontSize:8, fontWeight:700, color:'#fff', letterSpacing:'0.05em' }}>
                  ANOMALY
                </motion.div>
              )}
              <div style={{ fontSize:10, color:'#64748b', marginBottom:3 }}>{m.name}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                <span style={{ fontSize:18, fontWeight:700, color: anomaly?'#f87171':'#e2e8f0' }}>{m.value}</span>
                <span style={{ fontSize:9, color:'#64748b' }}>{m.unit}</span>
              </div>
              <Sparkline data={m.spark} anomaly={anomaly}/>
              <div style={{ fontSize:9, color:'#475569', marginTop:2 }}>
                Normal: {m.normal[0]}–{m.normal[1]} {m.unit}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. ClinicalStressShieldPanel
───────────────────────────────────────────────────────────── */
export function ClinicalStressShieldPanel() {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(42);

  const presets = [
    { name:'Nature Sounds', icon:'🌿', color:'#10b981' },
    { name:'White Noise', icon:'〰', color:'#6366f1' },
    { name:'Classical Music', icon:'🎼', color:'#8b5cf6' },
    { name:'Ocean Waves', icon:'🌊', color:'#14b8a6' },
    { name:'Forest Rain', icon:'🌧', color:'#0ea5e9' },
  ];

  const toggle = () => {
    setActive(a => {
      if (!a) setScore(s => Math.min(100, s + 22));
      else setScore(s => Math.max(0, s - 22));
      return !a;
    });
  };

  // Shield polygon points (hexagon-like shield)
  const shieldPoints = '130,20 195,60 195,140 130,180 65,140 65,60';

  return (
    <div style={{
      background:'linear-gradient(135deg,#0f172a 0%,#0c1a0f 100%)',
      border:`1px solid ${active?'rgba(16,185,129,0.4)':'rgba(99,102,241,0.25)'}`,
      borderRadius:20, padding:24, fontFamily:'sans-serif', color:'#e2e8f0',
      minHeight:340, position:'relative', overflow:'hidden',
      transition:'border-color 0.5s',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ background:`rgba(${active?'16,185,129':'99,102,241'},0.2)`, borderRadius:10, padding:8, transition:'background 0.5s' }}>
          <Shield size={18} color={active?'#10b981':'#6366f1'} />
        </div>
        <span style={{ fontWeight:700, fontSize:15 }}>Clinical Stress Shield</span>
        <motion.button
          whileHover={{ scale:1.08 }} whileTap={{ scale:0.94 }}
          onClick={toggle}
          style={{
            marginLeft:'auto', background: active ? 'linear-gradient(90deg,#10b981,#14b8a6)' : 'rgba(255,255,255,0.07)',
            border: active ? 'none' : '1px solid rgba(255,255,255,0.12)',
            borderRadius:10, padding:'6px 14px', color:'#fff', fontWeight:700, fontSize:12, cursor:'pointer',
            transition:'background 0.5s',
          }}>
          {active ? '🛡 Active' : '⭕ Inactive'}
        </motion.button>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:20 }}>
        {/* Shield SVG */}
        <svg width={130} height={200} viewBox="0 0 260 200" style={{ flexShrink:0 }}>
          <defs>
            <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={active?'rgba(16,185,129,0.4)':'rgba(99,102,241,0.2)'}/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
            <filter id="shGlow">
              <feGaussianBlur stdDeviation={active?'6':'2'} result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <ellipse cx="130" cy="100" rx="85" ry="85" fill="url(#shieldGlow)"/>
          <motion.polygon
            points={shieldPoints}
            fill={active?'rgba(16,185,129,0.1)':'rgba(99,102,241,0.08)'}
            stroke={active?'#10b981':'#6366f1'}
            strokeWidth="2.5"
            filter="url(#shGlow)"
            animate={active ? { scale:[1,1.05,1], opacity:[0.8,1,0.8] } : { scale:1, opacity:0.7 }}
            transition={{ repeat:Infinity, duration:2 }}
            style={{ transformOrigin:'130px 100px' }}
          />
          <text x="130" y="95" textAnchor="middle" fontSize="28" fontWeight="700"
            fill={active?'#10b981':'#6366f1'} fontFamily="sans-serif">{score}</text>
          <text x="130" y="115" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">STRESS REDUCTION</text>
        </svg>

        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color:'#64748b', marginBottom:8, letterSpacing:'0.06em' }}>CALMING PRESETS</div>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {presets.map((p, i) => (
              <motion.button key={i} whileHover={{ scale:1.02, x:2 }} whileTap={{ scale:0.97 }}
                onClick={() => { setSelected(i); if(!active) toggle(); }}
                style={{
                  background: selected===i ? `${p.color}22` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selected===i ? p.color+'55' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius:10, padding:'8px 12px', color:'#e2e8f0', cursor:'pointer',
                  display:'flex', alignItems:'center', gap:8, fontSize:12, textAlign:'left',
                }}>
                <span style={{ fontSize:16 }}>{p.icon}</span>
                <span>{p.name}</span>
                {selected===i && <span style={{ marginLeft:'auto', fontSize:9, color:p.color }}>● PLAYING</span>}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. VitalityEnginePanel
───────────────────────────────────────────────────────────── */
export function VitalityEnginePanel() {
  const [score, setScore] = useState(74);
  const [subs, setSubs] = useState([68, 82, 71, 77]);
  const subLabels = ['Physical', 'Mental', 'Emotional', 'Social'];
  const subColors = ['#6366f1', '#14b8a6', '#8b5cf6', '#10b981'];

  const refresh = () => {
    const newScore = Math.floor(40 + Math.random() * 55);
    setScore(newScore);
    setSubs(Array.from({length:4}, () => Math.floor(40+Math.random()*55)));
  };

  const cx = 110, cy = 110, R = 85, r = 55;
  const arc = (val, max=100, radiusOut=R, radiusIn=r, color='#6366f1', offset=0) => {
    const pct = val / max;
    const startAngle = -Math.PI / 2 + offset;
    const endAngle = startAngle + 2 * Math.PI * pct;
    const x1 = cx + radiusOut * Math.cos(startAngle);
    const y1 = cy + radiusOut * Math.sin(startAngle);
    const x2 = cx + radiusOut * Math.cos(endAngle);
    const y2 = cy + radiusOut * Math.sin(endAngle);
    const ix1 = cx + radiusIn * Math.cos(endAngle);
    const iy1 = cy + radiusIn * Math.sin(endAngle);
    const ix2 = cx + radiusIn * Math.cos(startAngle);
    const iy2 = cy + radiusIn * Math.sin(startAngle);
    const la = pct > 0.5 ? 1 : 0;
    return `M${x1},${y1} A${radiusOut},${radiusOut} 0 ${la},1 ${x2},${y2} L${ix1},${iy1} A${radiusIn},${radiusIn} 0 ${la},0 ${ix2},${iy2} Z`;
  };

  // Sub-ring segments (4 equal segments with gaps)
  const segmentArc = (val, idx, total=4) => {
    const segPct = 1/total;
    const offset = (idx * segPct + 0.02) * 2 * Math.PI - Math.PI/2;
    const end = offset + (segPct - 0.04) * 2 * Math.PI * (val/100);
    const x1 = cx + 48 * Math.cos(offset), y1 = cy + 48 * Math.sin(offset);
    const x2 = cx + 48 * Math.cos(end), y2 = cy + 48 * Math.sin(end);
    const lf = (val/100)*(segPct-0.04) > 0.5 ? 1 : 0;
    return `M${x1},${y1} A48,48 0 ${lf},1 ${x2},${y2}`;
  };

  const scoreColor = score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{
      background:'linear-gradient(135deg,#0f172a 0%,#1a0a2e 100%)',
      border:'1px solid rgba(139,92,246,0.3)', borderRadius:20, padding:24,
      fontFamily:'sans-serif', color:'#e2e8f0', minHeight:340, position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:-40, left:-40, width:280, height:280,
        background:'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ background:'rgba(139,92,246,0.2)', borderRadius:10, padding:8 }}>
          <Activity size={18} color="#8b5cf6" />
        </div>
        <span style={{ fontWeight:700, fontSize:15 }}>Vitality Engine</span>
        <motion.button whileHover={{scale:1.08}} whileTap={{scale:0.94}} onClick={refresh}
          style={{ marginLeft:'auto', background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.3)',
            borderRadius:8, padding:'5px 12px', color:'#a78bfa', fontSize:11, cursor:'pointer', fontWeight:600 }}>
          ↻ Refresh
        </motion.button>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <svg width={220} height={220} viewBox="0 0 220 220">
          <defs>
            <filter id="vglow">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={30}/>
          {/* Main arc */}
          <motion.path
            d={arc(score)}
            fill="#8b5cf6"
            filter="url(#vglow)"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8 }}
            key={score}
          />
          {/* Sub-ring tracks */}
          {[0,1,2,3].map(i=>(
            <path key={i} d={`M${cx+48*Math.cos((i*0.25+0.02)*2*Math.PI-Math.PI/2)},${cy+48*Math.sin((i*0.25+0.02)*2*Math.PI-Math.PI/2)} A48,48 0 0,1 ${cx+48*Math.cos((i*0.25+0.25-0.04)*2*Math.PI-Math.PI/2)},${cy+48*Math.sin((i*0.25+0.25-0.04)*2*Math.PI-Math.PI/2)}`}
              fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8}/>
          ))}
          {/* Sub-ring arcs */}
          {subs.map((v,i)=>(
            <motion.path key={i} d={segmentArc(v,i)}
              fill="none" stroke={subColors[i]} strokeWidth={8} strokeLinecap="round"
              filter="url(#vglow)"
              initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.9, delay:i*0.15 }}/>
          ))}
          {/* Center text */}
          <text x={cx} y={cy-8} textAnchor="middle" fontSize="32" fontWeight="800"
            fill={scoreColor} fontFamily="sans-serif">{score}</text>
          <text x={cx} y={cy+12} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="sans-serif">VITALITY</text>
          <text x={cx} y={cy+26} textAnchor="middle" fontSize="9" fill={scoreColor} fontFamily="sans-serif">
            {score>70?'EXCELLENT':score>40?'MODERATE':'LOW'}
          </text>
        </svg>

        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
          {subs.map((v, i) => (
            <div key={i}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <span style={{ fontSize:11, color:'#94a3b8' }}>{subLabels[i]}</span>
                <span style={{ fontSize:11, fontWeight:700, color:subColors[i] }}>{v}</span>
              </div>
              <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:4, height:5, overflow:'hidden' }}>
                <motion.div
                  animate={{ width:`${v}%` }} transition={{ duration:0.8, delay:i*0.1 }}
                  style={{ height:'100%', background:subColors[i], borderRadius:4,
                    boxShadow:`0 0 6px ${subColors[i]}88` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   8. MedExperienceOptimizerPanel
───────────────────────────────────────────────────────────── */
export function MedExperienceOptimizerPanel() {
  const initial = [
    { id:0, priority:'Critical', text:'Update pain management protocol for post-surgical patients', color:'#ef4444', done:false },
    { id:1, priority:'High', text:'Implement pre-visit anxiety reduction questionnaire', color:'#f59e0b', done:false },
    { id:2, priority:'High', text:'Optimize discharge instructions with visual aids', color:'#f59e0b', done:false },
    { id:3, priority:'Medium', text:'Add automated follow-up reminders at 24h post-visit', color:'#6366f1', done:false },
    { id:4, priority:'Medium', text:'Introduce breed-specific care information sheets', color:'#6366f1', done:false },
  ];
  const [items, setItems] = useState(initial);
  const [score, setScore] = useState(58);

  const complete = (id) => {
    setItems(prev => prev.map(it => it.id===id ? {...it,done:true} : it));
    setScore(s => Math.min(100, s + 8));
  };

  const doneCount = items.filter(i=>i.done).length;

  return (
    <div style={{
      background:'linear-gradient(135deg,#0f172a 0%,#0f2a1a 100%)',
      border:'1px solid rgba(16,185,129,0.3)', borderRadius:20, padding:24,
      fontFamily:'sans-serif', color:'#e2e8f0', minHeight:340, position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', bottom:-60, left:-60, width:220, height:220,
        background:'radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
        <div style={{ background:'rgba(16,185,129,0.2)', borderRadius:10, padding:8 }}>
          <Brain size={18} color="#10b981" />
        </div>
        <span style={{ fontWeight:700, fontSize:15 }}>MedExperience Optimizer</span>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:11, color:'#64748b' }}>Score</span>
          <span style={{ fontSize:18, fontWeight:800, color:'#10b981' }}>{score}</span>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:6, height:6, marginBottom:14, overflow:'hidden' }}>
        <motion.div animate={{ width:`${score}%` }} transition={{ duration:0.6 }}
          style={{ height:'100%', background:'linear-gradient(90deg,#10b981,#14b8a6)', borderRadius:6,
            boxShadow:'0 0 8px #10b98188' }}/>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {items.map(item => (
          <motion.div key={item.id}
            animate={item.done ? { opacity:0.55 } : { opacity:1 }}
            style={{
              background: item.done ? 'rgba(255,255,255,0.02)' : `${item.color}0d`,
              border:`1px solid ${item.done?'rgba(255,255,255,0.06)':item.color+'33'}`,
              borderRadius:12, padding:'10px 12px', display:'flex', alignItems:'center', gap:10,
            }}>
            {item.done && (
              <span style={{ fontSize:16, color:'#10b981', flexShrink:0 }}>✓</span>
            )}
            <div style={{ flex:1 }}>
              <span style={{ fontSize:9, fontWeight:700, color:item.color, marginRight:6,
                background:`${item.color}22`, borderRadius:4, padding:'1px 6px' }}>
                {item.priority}
              </span>
              <span style={{ fontSize:12, color: item.done?'#475569':'#e2e8f0',
                textDecoration: item.done?'line-through':'' }}>
                {item.text}
              </span>
            </div>
            {!item.done && (
              <motion.button whileHover={{scale:1.08}} whileTap={{scale:0.94}}
                onClick={() => complete(item.id)}
                style={{ background:`${item.color}22`, border:`1px solid ${item.color}44`,
                  borderRadius:8, padding:'4px 10px', color:item.color, fontSize:11, cursor:'pointer',
                  fontWeight:600, flexShrink:0 }}>
                Apply
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop:12, fontSize:11, color:'#64748b', textAlign:'center' }}>
        {doneCount} of {items.length} improvements applied
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   9. TreatmentFlowEnginePanel
───────────────────────────────────────────────────────────── */
export function TreatmentFlowEnginePanel() {
  const stages = [
    { label:'Intake', count:24, color:'#6366f1', x:40 },
    { label:'Diagnosis', count:18, color:'#8b5cf6', x:160 },
    { label:'Treatment', count:12, color:'#14b8a6', x:280 },
    { label:'Discharge', count:9, color:'#10b981', x:400 },
  ];
  const [dots, setDots] = useState(() =>
    Array.from({length:12}, (_, i) => ({
      id: i,
      stageFrom: Math.floor(Math.random() * 3),
      progress: Math.random(),
      speed: 0.004 + Math.random() * 0.006,
    }))
  );

  useEffect(() => {
    let raf;
    const animate = () => {
      setDots(prev => prev.map(d => ({
        ...d,
        progress: d.progress >= 1 ? 0 : d.progress + d.speed,
        stageFrom: d.progress >= 1 ? (d.stageFrom + 1) % 3 : d.stageFrom,
      })));
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const W = 460, H = 130;
  const nodeY = 65;
  const nodeR = 22;

  return (
    <div style={{
      background:'linear-gradient(135deg,#0f172a 0%,#0a1628 100%)',
      border:'1px solid rgba(99,102,241,0.25)', borderRadius:20, padding:24,
      fontFamily:'sans-serif', color:'#e2e8f0', overflow:'hidden', position:'relative',
    }}>
      <div style={{ position:'absolute', top:-50, left:'50%', transform:'translateX(-50%)', width:320, height:200,
        background:'radial-gradient(ellipse,rgba(99,102,241,0.08) 0%,transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ background:'rgba(99,102,241,0.2)', borderRadius:10, padding:8 }}>
          <TrendingUp size={18} color="#6366f1" />
        </div>
        <span style={{ fontWeight:700, fontSize:15 }}>Treatment Flow Engine</span>
        <div style={{ marginLeft:'auto', background:'rgba(20,184,166,0.15)', border:'1px solid rgba(20,184,166,0.3)',
          borderRadius:8, padding:'4px 10px', fontSize:11, color:'#14b8a6' }}>
          Live
          <motion.span animate={{opacity:[0,1,0]}} transition={{repeat:Infinity,duration:1}} style={{marginLeft:5}}>●</motion.span>
        </div>
      </div>

      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          {stages.slice(0,-1).map((s,i)=>(
            <linearGradient key={i} id={`fGrad${i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={stages[i].color}/>
              <stop offset="100%" stopColor={stages[i+1].color}/>
            </linearGradient>
          ))}
          <filter id="fglow">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {stages.slice(0,-1).map((s,i)=>(
          <line key={i}
            x1={stages[i].x + nodeR} y1={nodeY}
            x2={stages[i+1].x - nodeR} y2={nodeY}
            stroke={`url(#fGrad${i})`} strokeWidth={3} opacity={0.4}/>
        ))}

        {/* Animated dots */}
        {dots.map(d => {
          const from = stages[d.stageFrom], to = stages[d.stageFrom+1];
          if (!to) return null;
          const px = from.x + nodeR + (to.x - nodeR - from.x - nodeR) * d.progress;
          const color = from.color;
          return (
            <circle key={d.id} cx={px} cy={nodeY} r={5}
              fill={color} filter="url(#fglow)" opacity={0.9}/>
          );
        })}

        {/* Stage nodes */}
        {stages.map((s,i)=>(
          <g key={i}>
            <circle cx={s.x} cy={nodeY} r={nodeR+6} fill={`${s.color}18`}/>
            <circle cx={s.x} cy={nodeY} r={nodeR} fill={`${s.color}33`} stroke={s.color} strokeWidth={2}/>
            <text x={s.x} y={nodeY-4} textAnchor="middle" fontSize="13" fontWeight="700"
              fill={s.color} fontFamily="sans-serif">{s.count}</text>
            <text x={s.x} y={nodeY+10} textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="sans-serif">pts</text>
            <text x={s.x} y={nodeY+nodeR+16} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">{s.label}</text>
          </g>
        ))}
      </svg>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:12 }}>
        {stages.map((s,i)=>(
          <div key={i} style={{ background:`${s.color}10`, border:`1px solid ${s.color}33`, borderRadius:10, padding:'8px 10px', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:800, color:s.color }}>{s.count}</div>
            <div style={{ fontSize:9, color:'#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   10. InsightConstellationPanel
───────────────────────────────────────────────────────────── */
export function InsightConstellationPanel() {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  const nodes = [
    { id:0, label:'Drug\nInteraction', x:160, y:80, color:'#ef4444', r:18 },
    { id:1, label:'Allergy\nPattern', x:280, y:60, color:'#f59e0b', r:14 },
    { id:2, label:'Breed\nRisk', x:380, y:130, color:'#8b5cf6', r:16 },
    { id:3, label:'Vitals\nCorr.', x:320, y:220, color:'#14b8a6', r:12 },
    { id:4, label:'Nutrition\nGap', x:200, y:270, color:'#10b981', r:15 },
    { id:5, label:'Pain\nIndex', x:80, y:230, color:'#6366f1', r:13 },
    { id:6, label:'Recovery\nPredictor', x:50, y:140, color:'#0ea5e9', r:17 },
    { id:7, label:'Genetic\nMarker', x:230, y:160, color:'#a78bfa', r:20 },
    { id:8, label:'Immune\nResponse', x:360, y:80, color:'#fb923c', r:11 },
    { id:9, label:'Stress\nScore', x:140, y:180, color:'#f472b6', r:13 },
    { id:10, label:'Surgery\nRisk', x:310, y:150, color:'#34d399', r:15 },
    { id:11, label:'Microbiome\nState', x:100, y:90, color:'#60a5fa', r:12 },
  ];

  const edges = [
    [0,7],[0,9],[1,8],[1,7],[2,8],[2,10],[3,10],[3,7],[4,5],[4,9],[5,6],[5,9],[6,11],[6,0],[7,10],[7,9],[8,1],[10,3],[11,0],
  ];

  // Starfield canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const stars = Array.from({length:80}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      opacity: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      stars.forEach(s => {
        s.opacity = Math.abs(Math.sin(Date.now() * s.speed));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(148,163,184,${s.opacity * 0.6})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{
      background:'linear-gradient(135deg,#050b18 0%,#0f172a 100%)',
      border:'1px solid rgba(99,102,241,0.2)', borderRadius:20, padding:24,
      fontFamily:'sans-serif', color:'#e2e8f0', position:'relative', overflow:'hidden', minHeight:380,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <div style={{ background:'rgba(99,102,241,0.2)', borderRadius:10, padding:8 }}>
          <Star size={18} color="#6366f1" />
        </div>
        <span style={{ fontWeight:700, fontSize:15 }}>Insight Constellation</span>
        <div style={{ marginLeft:'auto', fontSize:11, color:'#475569' }}>{nodes.length} clinical nodes</div>
      </div>

      <div style={{ position:'relative' }}>
        {/* Starfield */}
        <canvas ref={canvasRef} width={460} height={310}
          style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', borderRadius:14, pointerEvents:'none' }}/>

        {/* Constellation SVG */}
        <svg width="100%" height={310} viewBox="0 0 460 310" style={{ position:'relative', zIndex:1 }}>
          <defs>
            <filter id="cglow">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Edges */}
          {edges.map(([a,b],i)=>{
            const na = nodes[a], nb = nodes[b];
            const active = hovered===a || hovered===b;
            return (
              <motion.line key={i}
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={active?na.color:'rgba(148,163,184,0.15)'}
                strokeWidth={active?1.5:0.8}
                animate={{ opacity: active?[0.6,1,0.6]:[0.3] }}
                transition={active?{repeat:Infinity,duration:1.5}:{}}
              />
            );
          })}
          {/* Nodes */}
          {nodes.map(n=>(
            <g key={n.id} style={{cursor:'pointer'}}
              onMouseEnter={()=>setHovered(n.id)} onMouseLeave={()=>setHovered(null)}>
              {/* Pulse ring */}
              <motion.circle cx={n.x} cy={n.y} r={n.r+10}
                fill="transparent" stroke={n.color}
                strokeWidth={1}
                animate={{ r:[n.r+6, n.r+16, n.r+6], opacity:[0.5,0,0.5] }}
                transition={{ repeat:Infinity, duration:2.5, delay:n.id*0.18 }}/>
              {/* Glow */}
              <circle cx={n.x} cy={n.y} r={n.r+4} fill={`${n.color}22`}/>
              {/* Node */}
              <motion.circle cx={n.x} cy={n.y} r={n.r}
                fill={hovered===n.id?n.color:`${n.color}44`}
                stroke={n.color} strokeWidth={1.5}
                filter="url(#cglow)"
                animate={hovered===n.id?{scale:1.15}:{scale:1}}
                style={{transformOrigin:`${n.x}px ${n.y}px`}}
              />
              {/* Label on hover */}
              <AnimatePresence>
                {hovered===n.id && (
                  <motion.g initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                    <rect x={n.x-36} y={n.y+n.r+4} width={72} height={28} rx={5}
                      fill="#0f172a" stroke={`${n.color}66`} strokeWidth={1}/>
                    {n.label.split('\n').map((line,li)=>(
                      <text key={li} x={n.x} y={n.y+n.r+14+li*10}
                        textAnchor="middle" fontSize={8} fill={n.color} fontFamily="sans-serif">
                        {line}
                      </text>
                    ))}
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:10 }}>
        {nodes.map(n=>(
          <span key={n.id}
            onMouseEnter={()=>setHovered(n.id)} onMouseLeave={()=>setHovered(null)}
            style={{
              background:`${n.color}18`, border:`1px solid ${n.color}44`,
              borderRadius:6, padding:'3px 8px', fontSize:9, color:n.color, cursor:'pointer',
              transition:'all 0.2s',
              ...(hovered===n.id?{background:`${n.color}33`, border:`1px solid ${n.color}`}:{}),
            }}>
            {n.label.replace('\n',' ')}
          </span>
        ))}
      </div>
    </div>
  );
}
