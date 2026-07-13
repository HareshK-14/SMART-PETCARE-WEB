import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Globe, Star, Activity, Shield, Waves, Compass, Sparkles, Network, Cpu, Radio } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   1. UniversalExperienceDNAPanel
   Triple-strand DNA for Owner, Vet, Admin cross-role experiences
───────────────────────────────────────────────────────────────*/
export const UniversalExperienceDNAPanel = () => {
  const roles = [
    { name: 'Owner', color: '#6366f1', metrics: [88, 76, 92, 85, 79] },
    { name: 'Vet', color: '#10b981', metrics: [82, 91, 87, 94, 73] },
    { name: 'Admin', color: '#f59e0b', metrics: [95, 84, 78, 90, 88] },
  ];
  const metricNames = ['Satisfaction', 'Efficiency', 'Trust', 'Speed', 'Delight'];
  const [rotation, setRotation] = useState(0);
  const [syncMeter, setSyncMeter] = useState(83);

  useEffect(() => {
    const id = setInterval(() => {
      setRotation(r => (r + 0.4) % 360);
      setSyncMeter(s => Math.max(70, Math.min(100, s + (Math.random() - 0.5) * 2)));
    }, 40);
    return () => clearInterval(id);
  }, []);

  const dnaH = 220, pairs = 10;
  const getStrandX = (idx, i, phase) => {
    const baseAngle = (i / pairs) * Math.PI * 2 + (rotation * Math.PI / 180) + (idx * Math.PI * 2 / 3);
    return Math.sin(baseAngle) * 35 + 50 + idx * 2;
  };

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f0c29,#1e1040,#0f0c29)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Brain size={22} color="#6366f1" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Universal Experience DNA</span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <svg width={160} height={dnaH} style={{ flexShrink: 0 }}>
          <defs>
            <filter id="dnaGlow3">
              <feGaussianBlur stdDeviation="2" result="cb" />
              <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {roles.map((role, ri) => {
            const pts = Array.from({ length: pairs }, (_, i) => ({
              x: getStrandX(ri, i, rotation),
              y: (i / (pairs - 1)) * dnaH,
            }));
            return (
              <g key={role.name}>
                <path d={pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                  fill="none" stroke={role.color} strokeWidth={2} filter="url(#dnaGlow3)" opacity={0.9} />
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={role.color} filter="url(#dnaGlow3)" opacity={0.8} />
                ))}
              </g>
            );
          })}
          {/* Cross-strands */}
          {Array.from({ length: pairs }, (_, i) => {
            const y = (i / (pairs - 1)) * dnaH;
            const x1 = getStrandX(0, i, rotation);
            const x2 = getStrandX(1, i, rotation);
            const col = roles[i % 3].color;
            return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke={col} strokeWidth={1.2} opacity={0.4} />;
          })}
        </svg>
        <div style={{ flex: 1 }}>
          {metricNames.map((mn, mi) => (
            <div key={mn} style={{ marginBottom: 10 }}>
              <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{mn}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {roles.map((r, ri) => (
                  <div key={r.name} style={{ flex: 1 }}>
                    <div style={{ height: 4, borderRadius: 4, background: '#1e293b', overflow: 'hidden' }}>
                      <motion.div animate={{ width: `${r.metrics[mi]}%` }} transition={{ duration: 1 + ri * 0.2 }}
                        style={{ height: '100%', borderRadius: 4, background: r.color, boxShadow: `0 0 6px ${r.color}` }} />
                    </div>
                    <div style={{ color: r.color, fontSize: 9, fontWeight: 700, marginTop: 2 }}>{r.metrics[mi]}%</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Sync meter */}
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#1e293b88', borderRadius: 10, border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ color: '#94a3b8', fontSize: 11 }}>Evolution Sync</span>
              <span style={{ color: '#6366f1', fontWeight: 800, fontSize: 13 }}>{Math.round(syncMeter)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: '#334155' }}>
              <motion.div animate={{ width: `${syncMeter}%` }} transition={{ duration: 0.4 }}
                style={{ height: '100%', borderRadius: 6, background: 'linear-gradient(90deg,#6366f1,#10b981,#f59e0b)', boxShadow: '0 0 10px #6366f1' }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {roles.map(r => (
          <div key={r.name} style={{ flex: 1, background: `${r.color}16`, border: `1px solid ${r.color}33`, borderRadius: 8, padding: '6px 10px', textAlign: 'center' }}>
            <div style={{ color: r.color, fontWeight: 800, fontSize: 13 }}>{r.name}</div>
            <div style={{ color: '#94a3b8', fontSize: 10 }}>{Math.round(r.metrics.reduce((a, b) => a + b) / r.metrics.length)}% avg</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   2. EmotionStreamPanel
   Real-time scrolling emotion feed
───────────────────────────────────────────────────────────────*/
export const EmotionStreamPanel = () => {
  const emotionPool = [
    { emoji: '😊', label: 'Satisfied', color: '#10b981', role: 'Owner' },
    { emoji: '🐾', label: 'Engaged', color: '#6366f1', role: 'Vet' },
    { emoji: '⚡', label: 'Energized', color: '#f59e0b', role: 'Admin' },
    { emoji: '❤️', label: 'Loved', color: '#ef4444', role: 'Owner' },
    { emoji: '🌟', label: 'Delighted', color: '#8b5cf6', role: 'Owner' },
    { emoji: '🧬', label: 'Analytical', color: '#14b8a6', role: 'Vet' },
    { emoji: '🛡️', label: 'Secure', color: '#10b981', role: 'Admin' },
    { emoji: '🔮', label: 'Curious', color: '#8b5cf6', role: 'Vet' },
    { emoji: '🚀', label: 'Excited', color: '#f59e0b', role: 'Admin' },
    { emoji: '🌈', label: 'Hopeful', color: '#6366f1', role: 'Owner' },
  ];
  const users = ['Luna_Owner', 'MaxVet_Dr', 'AdminPro', 'PuppyMom', 'CatDad22', 'VetExpert', 'SysAdmin'];
  const [stream, setStream] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      emotion: emotionPool[i % emotionPool.length],
      user: users[i % users.length],
      time: `${Math.floor(Math.random() * 59)}s ago`,
      intensity: Math.round(70 + Math.random() * 30),
    }))
  );
  const [idCounter, setIdCounter] = useState(100);

  useEffect(() => {
    const id = setInterval(() => {
      const newItem = {
        id: idCounter + Math.random(),
        emotion: emotionPool[Math.floor(Math.random() * emotionPool.length)],
        user: users[Math.floor(Math.random() * users.length)],
        time: 'just now',
        intensity: Math.round(70 + Math.random() * 30),
      };
      setStream(prev => [newItem, ...prev.slice(0, 8)]);
      setIdCounter(c => c + 1);
    }, 1800);
    return () => clearInterval(id);
  }, [idCounter]);

  return (
    <div style={{ background: 'linear-gradient(135deg,#0d1117,#1a1030,#0d1117)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Waves size={22} color="#8b5cf6" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Emotion Stream</span>
        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700 }}>LIVE</span>
        </motion.div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflow: 'hidden' }}>
        <AnimatePresence initial={false}>
          {stream.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 30, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{ background: `${item.emotion.color}14`, border: `1px solid ${item.emotion.color}33`, borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span style={{ fontSize: 22 }}>{item.emotion.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>{item.user}</span>
                  <span style={{ background: `${item.emotion.color}22`, color: item.emotion.color, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: '1px 6px' }}>{item.emotion.role}</span>
                </div>
                <div style={{ color: item.emotion.color, fontSize: 11, fontWeight: 600 }}>{item.emotion.label}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: item.emotion.color, fontWeight: 800, fontSize: 14 }}>{item.intensity}%</div>
                <div style={{ color: '#64748b', fontSize: 10 }}>{item.time}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   3. BehaviorWavesPanel
   Three overlapping waveforms for Owner/Vet/Admin
───────────────────────────────────────────────────────────────*/
export const BehaviorWavesPanel = () => {
  const waves = [
    { name: 'Owner Behavior', color: '#6366f1', amp: 28, freq: 1.2, phase: 0 },
    { name: 'Vet Activity', color: '#10b981', amp: 22, freq: 0.9, phase: 1.5 },
    { name: 'Admin Oversight', color: '#f59e0b', amp: 18, freq: 1.6, phase: 0.8 },
  ];
  const [tick, setTick] = useState(0);
  const [liveValues, setLiveValues] = useState([78, 85, 92]);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setLiveValues(prev => prev.map(v => Math.max(50, Math.min(100, v + (Math.random() - 0.5) * 4))));
    }, 60);
    return () => clearInterval(id);
  }, []);

  const buildWavePath = (w, baseY, amp, freq, phaseOffset) => {
    const pts = [];
    for (let x = 0; x <= w; x += 2) {
      const t = (x / w) * Math.PI * 2 * freq * 3 + tick * 0.05 + phaseOffset;
      const y = baseY + Math.sin(t) * amp + Math.sin(t * 2.3) * (amp * 0.3);
      pts.push(`${x},${y}`);
    }
    return `M ${pts.join(' L ')}`;
  };

  return (
    <div style={{ background: 'linear-gradient(135deg,#0b1120,#1a1040,#0b1120)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Waves size={22} color="#6366f1" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Behavior Waves</span>
        <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 11 }}>Wave Interference Analysis</span>
      </div>
      <svg width="100%" height={200} viewBox="0 0 320 200" preserveAspectRatio="none">
        <defs>
          <filter id="waveGlow">
            <feGaussianBlur stdDeviation="2.5" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="320" height="200" fill="#080c18" rx="8" />
        {[50, 100, 150].map(y => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#1e293b" strokeWidth="1" />)}
        {/* Interference zone */}
        <rect x={0} y={60} width={320} height={80} fill="#6366f1" opacity={0.03} />
        {waves.map((w, i) => (
          <g key={w.name}>
            <path d={buildWavePath(320, 100, w.amp, w.freq, w.phase)}
              fill="none" stroke={w.color} strokeWidth={2.5} filter="url(#waveGlow)" opacity={0.85} />
            {/* Shadow */}
            <path d={buildWavePath(320, 100, w.amp, w.freq, w.phase)}
              fill="none" stroke={w.color} strokeWidth={1} opacity={0.2} />
          </g>
        ))}
        {/* Interference peaks */}
        {Array.from({ length: 5 }, (_, i) => {
          const x = 20 + i * 56;
          const y = 100 + Math.sin(tick * 0.05 + i) * 25;
          return <circle key={i} cx={x} cy={y} r={3} fill="#fff" opacity={0.25} filter="url(#waveGlow)" />;
        })}
      </svg>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {waves.map((w, i) => (
          <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 4, borderRadius: 2, background: w.color, boxShadow: `0 0 8px ${w.color}` }} />
            <span style={{ color: '#94a3b8', fontSize: 12, flex: 1 }}>{w.name}</span>
            <div style={{ width: 100, height: 6, borderRadius: 6, background: '#1e293b', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${liveValues[i]}%` }} transition={{ duration: 0.4 }}
                style={{ height: '100%', borderRadius: 6, background: w.color, boxShadow: `0 0 8px ${w.color}` }} />
            </div>
            <span style={{ color: w.color, fontWeight: 800, fontSize: 14, width: 40, textAlign: 'right' }}>{Math.round(liveValues[i])}%</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', background: '#1e293b88', borderRadius: 10, border: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#94a3b8', fontSize: 11 }}>Interference Score</span>
        <span style={{ color: '#8b5cf6', fontWeight: 800, fontSize: 13 }}>
          {Math.round((liveValues[0] + liveValues[1] + liveValues[2]) / 3)}% coherent
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   4. GlobalWellnessNetworkPanel
   World map SVG with animated pulse dots
───────────────────────────────────────────────────────────────*/
export const GlobalWellnessNetworkPanel = () => {
  const dots = [
    { x: 80, y: 80, label: 'N.America', score: 92 },
    { x: 160, y: 70, label: 'Europe', score: 88 },
    { x: 220, y: 90, label: 'Asia', score: 94 },
    { x: 130, y: 130, label: 'Africa', score: 76 },
    { x: 100, y: 150, label: 'S.America', score: 82 },
    { x: 255, y: 155, label: 'Oceania', score: 79 },
  ];
  const [pulsePhase, setPulsePhase] = useState(0);
  const [globalScore, setGlobalScore] = useState(87);
  const [selectedDot, setSelectedDot] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setPulsePhase(p => (p + 3) % 360);
      setGlobalScore(s => Math.max(80, Math.min(100, s + (Math.random() - 0.5) * 1.5)));
    }, 60);
    return () => clearInterval(id);
  }, []);

  const pulseR = (baseR, phase, offset) => baseR + Math.abs(Math.sin((phase + offset) * Math.PI / 180)) * 8;

  return (
    <div style={{ background: 'linear-gradient(135deg,#020c1b,#0a1929,#020c1b)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Globe size={22} color="#14b8a6" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Global Wellness Network</span>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ color: '#14b8a6', fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{Math.round(globalScore)}</div>
          <div style={{ color: '#64748b', fontSize: 10 }}>GLOBAL SCORE</div>
        </div>
      </div>
      <svg width="100%" height={220} viewBox="0 0 310 200">
        <defs>
          <filter id="globeGlow">
            <feGaussianBlur stdDeviation="2.5" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Simple world map outline */}
        <rect width="310" height="200" fill="#0a1929" rx="8" />
        {/* Grid lines (lat/lon) */}
        {[40, 80, 120, 160].map(y => <line key={y} x1="0" y1={y} x2="310" y2={y} stroke="#1e293b" strokeWidth="0.5" />)}
        {[62, 124, 186, 248].map(x => <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="#1e293b" strokeWidth="0.5" />)}
        {/* Continents (simplified blobs) */}
        <ellipse cx={80} cy={90} rx={48} ry={55} fill="#1e3a5f" opacity={0.6} />
        <ellipse cx={155} cy={80} rx={55} ry={50} fill="#1e3a5f" opacity={0.6} />
        <ellipse cx={228} cy={95} rx={60} ry={55} fill="#1e3a5f" opacity={0.6} />
        <ellipse cx={130} cy={145} rx={30} ry={30} fill="#1e3a5f" opacity={0.5} />
        <ellipse cx={258} cy={155} rx={25} ry={18} fill="#1e3a5f" opacity={0.5} />
        {/* Network lines between dots */}
        {dots.map((d1, i) => dots.slice(i + 1).map((d2, j) => (
          <line key={`${i}-${j}`} x1={d1.x} y1={d1.y} x2={d2.x} y2={d2.y}
            stroke="#14b8a6" strokeWidth={0.6} opacity={0.18} />
        )))}
        {/* Animated connection flow */}
        {dots.slice(1).map((d, i) => {
          const t = ((pulsePhase + i * 60) % 360) / 360;
          const px = dots[0].x + (d.x - dots[0].x) * t;
          const py = dots[0].y + (d.y - dots[0].y) * t;
          return <circle key={i} cx={px} cy={py} r={2.5} fill="#14b8a6" opacity={0.8} filter="url(#globeGlow)" />;
        })}
        {/* Pulse dots */}
        {dots.map((d, i) => {
          const col = d.score > 90 ? '#10b981' : d.score > 80 ? '#14b8a6' : '#f59e0b';
          return (
            <g key={d.label} onClick={() => setSelectedDot(d)} style={{ cursor: 'pointer' }}>
              <circle cx={d.x} cy={d.y} r={pulseR(10, pulsePhase, i * 60)} fill={col} opacity={0.12} />
              <circle cx={d.x} cy={d.y} r={7} fill={col} filter="url(#globeGlow)" opacity={0.9} />
              <text x={d.x} y={d.y - 12} textAnchor="middle" fill={col} fontSize={8} fontWeight="700">{d.label}</text>
            </g>
          );
        })}
      </svg>
      <AnimatePresence>
        {selectedDot && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            style={{ margin: '8px 0', padding: '10px 14px', background: '#0a1929', borderRadius: 12, border: '1px solid #14b8a644', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#e2e8f0', fontWeight: 700 }}>{selectedDot.label}</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>Regional wellness</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#14b8a6', fontWeight: 900, fontSize: 20 }}>{selectedDot.score}</span>
              <div onClick={() => setSelectedDot(null)} style={{ color: '#475569', cursor: 'pointer', fontSize: 18 }}>×</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {dots.map(d => {
          const col = d.score > 90 ? '#10b981' : d.score > 80 ? '#14b8a6' : '#f59e0b';
          return (
            <div key={d.label} style={{ background: `${col}14`, borderRadius: 6, padding: '3px 8px', border: `1px solid ${col}30` }}>
              <span style={{ color: col, fontSize: 10, fontWeight: 700 }}>{d.label} {d.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   5. InsightNebulaPanel
   Dark space with nebula effects and floating insight cards
───────────────────────────────────────────────────────────────*/
export const InsightNebulaPanel = () => {
  const insights = [
    { text: 'Pet engagement up 23% this week', color: '#6366f1' },
    { text: 'Vet response time improved by 40%', color: '#10b981' },
    { text: 'Trust scores at all-time high', color: '#8b5cf6' },
    { text: 'New AI model deployed successfully', color: '#14b8a6' },
    { text: 'Community growth +18% monthly', color: '#f59e0b' },
    { text: 'Safety alerts reduced by 65%', color: '#ef4444' },
  ];
  const [floatPositions, setFloatPositions] = useState(() =>
    insights.map((_, i) => ({ x: 10 + (i % 3) * 33, y: 10 + Math.floor(i / 3) * 45, dy: (Math.random() - 0.5) * 0.3 }))
  );
  const [tick, setTick] = useState(0);
  const [stars] = useState(() => Array.from({ length: 60 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100, r: Math.random() * 1.5 + 0.3, delay: Math.random() * 3
  })));

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setFloatPositions(prev => prev.map(p => ({
        ...p,
        y: p.y + p.dy,
        dy: p.y > 85 ? -Math.abs(p.dy) : p.y < 5 ? Math.abs(p.dy) : p.dy,
      })));
    }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: '#020008', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden', position: 'relative' }}>
      {/* Nebula layers */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'radial-gradient(ellipse at 30% 40%, #6366f122 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, #8b5cf622 0%, transparent 55%), radial-gradient(ellipse at 50% 20%, #14b8a611 0%, transparent 50%)' }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'radial-gradient(ellipse at 80% 30%, #10b98111 0%, transparent 40%), radial-gradient(ellipse at 20% 70%, #ef444411 0%, transparent 40%)' }} />
      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20 }}>
        {stars.map((s, i) => (
          <motion.div key={i}
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{ repeat: Infinity, duration: 2 + s.delay, delay: s.delay }}
            style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, borderRadius: '50%', background: '#fff' }}
          />
        ))}
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Sparkles size={22} color="#8b5cf6" />
          <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Insight Nebula</span>
          <span style={{ marginLeft: 'auto', color: '#8b5cf6', fontSize: 11, fontWeight: 600 }}>∞ Deep Space Analysis</span>
        </div>
        {/* Floating insight cards */}
        <div style={{ position: 'relative', height: 270 }}>
          {insights.map((ins, i) => {
            const pos = floatPositions[i];
            return (
              <motion.div key={i}
                style={{
                  position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`,
                  width: '30%', background: `${ins.color}18`,
                  border: `1px solid ${ins.color}44`, borderRadius: 10, padding: '8px 10px',
                  backdropFilter: 'blur(8px)',
                }}
                whileHover={{ scale: 1.06, zIndex: 10 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: ins.color, boxShadow: `0 0 8px ${ins.color}`, marginTop: 4, flexShrink: 0 }} />
                  <span style={{ color: '#e2e8f0', fontSize: 10, lineHeight: 1.4, fontWeight: 500 }}>{ins.text}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', background: '#0d0020aa', borderRadius: 10, border: '1px solid #33415588' }}>
          <span style={{ color: '#94a3b8', fontSize: 11 }}>Active Insights</span>
          <span style={{ color: '#8b5cf6', fontWeight: 800 }}>{insights.length} nebular streams</span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   6. ResonanceEnginePanel
   Resonance/tuning fork with dashboard sync score
───────────────────────────────────────────────────────────────*/
export const ResonanceEnginePanel = () => {
  const dashboards = [
    { name: 'Owner', color: '#6366f1', sync: 94 },
    { name: 'Vet', color: '#10b981', sync: 87 },
    { name: 'Admin', color: '#f59e0b', sync: 91 },
  ];
  const [tick, setTick] = useState(0);
  const [resonanceRings, setResonanceRings] = useState([]);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setResonanceRings(prev => {
        const alive = prev.filter(r => r.r < 130).map(r => ({ ...r, r: r.r + 1.5, opacity: r.opacity * 0.985 }));
        if (tick % 45 === 0) alive.push({ r: 10, opacity: 0.7, color: dashboards[tick % 3].color });
        return alive;
      });
    }, 30);
    return () => clearInterval(id);
  }, [tick]);

  const overallSync = Math.round(dashboards.reduce((a, d) => a + d.sync, 0) / 3);

  const buildForkPath = (cx, baseY, amp, phase) => {
    const pts = [];
    for (let x = 0; x <= 80; x += 2) {
      const t = (x / 80) * Math.PI * 4 + phase + tick * 0.06;
      const decay = Math.exp(-x / 60);
      const y = baseY + Math.sin(t) * amp * decay;
      pts.push(`${cx + x},${y}`);
    }
    return `M ${pts.join(' L ')}`;
  };

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f1729,#1a0f2e,#0f1729)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Radio size={22} color="#14b8a6" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Resonance Engine</span>
        <span style={{ marginLeft: 'auto', color: '#14b8a6', fontWeight: 900, fontSize: 20 }}>{overallSync}%</span>
      </div>
      <svg width="100%" height={200} viewBox="0 0 310 200">
        <defs>
          <filter id="resonGlow">
            <feGaussianBlur stdDeviation="3" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="310" height="200" fill="#080c18" rx="8" />
        {/* Resonance rings from center */}
        {resonanceRings.map((ring, i) => (
          <circle key={i} cx={155} cy={100} r={ring.r} fill="none" stroke={ring.color}
            strokeWidth={1.5} opacity={ring.opacity} filter="url(#resonGlow)" />
        ))}
        {/* Center point */}
        <circle cx={155} cy={100} r={10} fill="#14b8a6" filter="url(#resonGlow)" opacity={0.9} />
        <circle cx={155} cy={100} r={6} fill="#fff" opacity={0.8} />
        {/* Fork waveforms for each dashboard */}
        {dashboards.map((d, i) => (
          <g key={d.name}>
            <path d={buildForkPath(30, 50 + i * 50, 18 * (d.sync / 100), i * 2.1)}
              fill="none" stroke={d.color} strokeWidth={2} filter="url(#resonGlow)" opacity={0.85} />
            {/* Mirror fork (left side) */}
            <path
              d={Array.from({ length: 41 }, (_, j) => {
                const x = j * 2;
                const t = (x / 80) * Math.PI * 4 + i * 2.1 + tick * 0.06;
                const decay = Math.exp(-x / 60);
                const y = 50 + i * 50 + Math.sin(t) * 18 * (d.sync / 100) * decay;
                return `${30 - x},${y}`;
              }).join(j => j === 0 ? 'M' : ' L')}
              fill="none" stroke={d.color} strokeWidth={1.2} opacity={0.4} />
            <text x={28} y={50 + i * 50 - 5} textAnchor="end" fill={d.color} fontSize={9} fontWeight="700">{d.name}</text>
            <text x={28} y={50 + i * 50 + 10} textAnchor="end" fill={d.color} fontSize={8} opacity={0.7}>{d.sync}%</text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        {dashboards.map(d => (
          <div key={d.name} style={{ flex: 1, background: `${d.color}14`, border: `1px solid ${d.color}33`, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ color: d.color, fontWeight: 900, fontSize: 18 }}>{d.sync}%</div>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>{d.name} Sync</div>
            <div style={{ height: 3, borderRadius: 3, background: '#1e293b', marginTop: 6, overflow: 'hidden' }}>
              <div style={{ width: `${d.sync}%`, height: '100%', background: d.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   7. ActivityCosmosPanel
   3D-feeling space scene with CSS perspective
───────────────────────────────────────────────────────────────*/
export const ActivityCosmosPanel = () => {
  const planets = [
    { name: 'Login', color: '#6366f1', size: 16, orbitX: 80, orbitY: 30, speed: 0.012, count: 1247 },
    { name: 'Bookings', color: '#10b981', size: 20, orbitX: 110, orbitY: 45, speed: 0.008, count: 342 },
    { name: 'Wellness', color: '#14b8a6', size: 14, orbitX: 140, orbitY: 55, speed: 0.010, count: 876 },
    { name: 'Reviews', color: '#f59e0b', size: 12, orbitX: 60, orbitY: 22, speed: 0.015, count: 521 },
    { name: 'Payments', color: '#8b5cf6', size: 18, orbitX: 170, orbitY: 65, speed: 0.006, count: 189 },
  ];
  const [angles, setAngles] = useState(() => planets.map((_, i) => (i / planets.length) * Math.PI * 2));
  const [shootStars, setShootStars] = useState([]);
  const [activityCount, setActivityCount] = useState(3182);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setAngles(prev => prev.map((a, i) => a + planets[i].speed));
      setActivityCount(c => c + Math.floor(Math.random() * 5));
      setShootStars(prev => {
        const alive = prev.filter(s => s.progress < 1).map(s => ({ ...s, progress: s.progress + 0.04 }));
        if (Math.random() < 0.08) {
          alive.push({ x: Math.random() * 280 + 15, y: Math.random() * 60, angle: 30 + Math.random() * 30, progress: 0, id: Math.random() });
        }
        return alive.slice(-6);
      });
    }, 40);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: 'radial-gradient(ellipse at 50% 50%, #0a0520 0%, #020008 100%)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Star size={22} color="#f59e0b" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Activity Cosmos</span>
        <span style={{ marginLeft: 'auto', color: '#f59e0b', fontWeight: 800, fontSize: 14 }}>{activityCount.toLocaleString()} actions</span>
      </div>
      <svg width="100%" height={230} viewBox="0 0 310 230">
        <defs>
          <radialGradient id="galaxyGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="40%" stopColor="#8b5cf6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="cosmosGlow">
            <feGaussianBlur stdDeviation="3" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Galaxy spiral */}
        <ellipse cx={155} cy={115} rx={140} ry={70} fill="url(#galaxyGrad)" />
        {/* Stars */}
        {Array.from({ length: 50 }, (_, i) => (
          <circle key={i} cx={10 + (i * 6) % 290} cy={5 + (i * 4.3) % 220} r={Math.random() * 1.2 + 0.3} fill="#fff" opacity={0.3 + Math.random() * 0.5} />
        ))}
        {/* Shooting stars */}
        {shootStars.map(s => (
          <line key={s.id}
            x1={s.x} y1={s.y}
            x2={s.x + Math.cos(s.angle * Math.PI / 180) * 40 * s.progress}
            y2={s.y + Math.sin(s.angle * Math.PI / 180) * 40 * s.progress}
            stroke="#fff" strokeWidth={1.5} opacity={1 - s.progress} />
        ))}
        {/* Orbital rings (perspective ellipses) */}
        {planets.map((p, i) => (
          <ellipse key={'orb' + i} cx={155} cy={115} rx={p.orbitX} ry={p.orbitY}
            fill="none" stroke={p.color} strokeWidth={0.5} opacity={0.15} />
        ))}
        {/* Planets */}
        {planets.map((p, i) => {
          const px = 155 + Math.cos(angles[i]) * p.orbitX;
          const py = 115 + Math.sin(angles[i]) * p.orbitY;
          return (
            <g key={p.name}>
              <circle cx={px} cy={py} r={p.size + 4} fill={p.color} opacity={0.15} />
              <circle cx={px} cy={py} r={p.size} fill={p.color} filter="url(#cosmosGlow)" opacity={0.9} />
              <text x={px} y={py + 4} textAnchor="middle" fill="#fff" fontSize={7} fontWeight="700">{p.name[0]}</text>
            </g>
          );
        })}
        {/* Center sun */}
        <circle cx={155} cy={115} r={22} fill="radial-gradient(circle,#f59e0b,#ef4444)" style={{ fill: '#f59e0b' }} filter="url(#cosmosGlow)" opacity={0.9} />
        <circle cx={155} cy={115} r={22} fill="none" stroke="#fbbf24" strokeWidth={2} opacity={0.5} />
        <text x={155} y={112} textAnchor="middle" fill="#fff" fontSize={7} fontWeight="800">CORE</text>
        <text x={155} y={122} textAnchor="middle" fill="#fff" fontSize={6} opacity={0.8}>PLATFORM</text>
      </svg>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
        {planets.map(p => (
          <div key={p.name} style={{ background: `${p.color}14`, borderRadius: 6, padding: '3px 8px', border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }} />
            <span style={{ color: p.color, fontSize: 10, fontWeight: 700 }}>{p.name}: {p.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   8. SyncFieldPanel
   Connection nodes with pulsing sync waves
───────────────────────────────────────────────────────────────*/
export const SyncFieldPanel = () => {
  const dataKeys = [
    { key: 'User Profiles', synced: true, color: '#10b981' },
    { key: 'Appointments', synced: true, color: '#6366f1' },
    { key: 'Health Records', synced: false, color: '#ef4444' },
    { key: 'Payments', synced: true, color: '#14b8a6' },
    { key: 'Notifications', synced: true, color: '#f59e0b' },
    { key: 'AI Models', synced: false, color: '#8b5cf6' },
  ];
  const dashboards = ['Owner', 'Vet', 'Admin'];
  const [waves, setWaves] = useState([]);
  const [tick, setTick] = useState(0);
  const [syncStatus, setSyncStatus] = useState(() =>
    dashboards.map(d => ({ name: d, status: 'synced', lag: Math.round(Math.random() * 120) }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setWaves(prev => {
        const alive = prev.filter(w => w.r < 80).map(w => ({ ...w, r: w.r + 1.5, opacity: w.opacity * 0.97 }));
        if (tick % 30 === 0) {
          alive.push({ r: 5, opacity: 0.8, x: 50 + Math.random() * 210, y: 30 + Math.random() * 120, color: dataKeys[Math.floor(Math.random() * dataKeys.length)].color });
        }
        return alive;
      });
      setSyncStatus(prev => prev.map(s => ({
        ...s,
        lag: Math.max(10, Math.min(200, s.lag + (Math.random() - 0.5) * 20)),
      })));
    }, 40);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div style={{ background: 'linear-gradient(135deg,#0b1220,#121830,#0b1220)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Network size={22} color="#14b8a6" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Sync Field</span>
        <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 12, fontWeight: 700 }}>
          {dataKeys.filter(d => d.synced).length}/{dataKeys.length} keys synced
        </span>
      </div>
      <svg width="100%" height={180} viewBox="0 0 310 180">
        <defs>
          <filter id="syncGlow">
            <feGaussianBlur stdDeviation="2" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="310" height="180" fill="#080c18" rx="8" />
        {/* Grid */}
        {[45, 90, 135].map(y => <line key={y} x1="0" y1={y} x2="310" y2={y} stroke="#1e293b" strokeWidth="0.5" />)}
        {[62, 124, 186, 248].map(x => <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="#1e293b" strokeWidth="0.5" />)}
        {/* Sync waves */}
        {waves.map((w, i) => (
          <circle key={i} cx={w.x} cy={w.y} r={w.r} fill="none" stroke={w.color} strokeWidth={1.2} opacity={w.opacity} filter="url(#syncGlow)" />
        ))}
        {/* Nodes - 3 dashboards at top */}
        {dashboards.map((d, i) => {
          const x = 60 + i * 100;
          return (
            <g key={d}>
              <circle cx={x} cy={35} r={18} fill={['#6366f1', '#10b981', '#f59e0b'][i]} filter="url(#syncGlow)" opacity={0.85} />
              <text x={x} y={39} textAnchor="middle" fill="#fff" fontSize={8} fontWeight="700">{d}</text>
              {/* Connection lines to data keys */}
              {dataKeys.map((dk, dki) => {
                const dx = 30 + dki * 46;
                const dy = 145;
                return (
                  <line key={dki} x1={x} y1={52} x2={dx} y2={dy}
                    stroke={dk.synced ? dk.color : '#475569'} strokeWidth={0.6} opacity={dk.synced ? 0.35 : 0.12}
                    strokeDasharray={dk.synced ? '0' : '3 4'} />
                );
              })}
            </g>
          );
        })}
        {/* Data key nodes at bottom */}
        {dataKeys.map((dk, i) => {
          const x = 30 + i * 46;
          return (
            <g key={dk.key}>
              <circle cx={x} cy={145} r={12} fill={dk.synced ? dk.color : '#374151'} filter="url(#syncGlow)" opacity={dk.synced ? 0.85 : 0.5} />
              {dk.synced && <circle cx={x} cy={145} r={12 + Math.sin(tick * 0.07) * 3} fill="none" stroke={dk.color} strokeWidth={0.8} opacity={0.3} />}
              <text x={x} y={165} textAnchor="middle" fill={dk.color} fontSize={7} fontWeight="600">{dk.key.split(' ')[0]}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        {syncStatus.map(s => (
          <div key={s.name} style={{ flex: 1, background: '#1e293b', borderRadius: 10, padding: '8px 10px', border: `1px solid #33415566` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.lag < 100 ? '#10b981' : '#f59e0b' }} />
              <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>{s.name}</span>
            </div>
            <div style={{ color: s.lag < 100 ? '#10b981' : '#f59e0b', fontWeight: 800, fontSize: 13 }}>{Math.round(s.lag)}ms</div>
            <div style={{ color: '#64748b', fontSize: 9 }}>latency</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   9. WellnessOraclePanel
   Mystical oracle with crystal ball animation and predictions
───────────────────────────────────────────────────────────────*/
export const WellnessOraclePanel = () => {
  const predictions = [
    { text: 'Platform wellness will peak in 14 days', prob: 87, icon: '🔮' },
    { text: 'Vet appointment surge expected next week', prob: 73, icon: '📈' },
    { text: 'New behavioral trend emerging in cats', prob: 65, icon: '🐱' },
    { text: 'Revenue breakthrough within 30 days', prob: 81, icon: '💰' },
    { text: 'Community milestone: 10K pets milestone', prob: 92, icon: '🌟' },
  ];
  const [tick, setTick] = useState(0);
  const [orbPhase, setOrbPhase] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setOrbPhase(p => (p + 1.5) % 360);
    }, 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveIdx(i => (i + 1) % predictions.length), 3000);
    return () => clearInterval(id);
  }, []);

  const cr = Math.round(80 + Math.sin(orbPhase * Math.PI / 180) * 30);
  const cg = Math.round(40 + Math.sin((orbPhase + 60) * Math.PI / 180) * 40);
  const cb = Math.round(150 + Math.sin((orbPhase + 120) * Math.PI / 180) * 80);

  return (
    <div style={{ background: `linear-gradient(135deg,#0a0518,#120a28,#0a0518)`, borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden', position: 'relative' }}>
      {/* Mystical gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: `radial-gradient(ellipse at 50% 30%, rgb(${cr},${cg},${cb})18 0%, transparent 60%)`, transition: 'background 0.5s' }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Sparkles size={22} color="#8b5cf6" />
          <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Wellness Oracle</span>
          <span style={{ marginLeft: 'auto', color: '#8b5cf6', fontSize: 11, fontStyle: 'italic' }}>∞ Divination Engine</span>
        </div>
        {/* Crystal ball */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ position: 'relative', width: 100, height: 100 }}>
            {/* Glow rings */}
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute', inset: -i * 10, borderRadius: '50%',
                border: `1px solid rgb(${cr},${cg},${cb})`,
                opacity: 0.1 + i * 0.05,
                animation: `pulse ${2 + i}s infinite`,
              }} />
            ))}
            {/* Ball */}
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6) 0%, rgb(${cr},${cg},${cb}) 25%, #1a0a3a 70%, #0a0518 100%)`,
              boxShadow: `0 0 40px rgb(${cr},${cg},${cb})66, inset 0 0 30px rgba(255,255,255,0.1)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 30, filter: 'drop-shadow(0 0 10px #fff)' }}>🔮</span>
            </div>
            {/* Reflection */}
            <div style={{ position: 'absolute', top: 18, left: 22, width: 20, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', transform: 'rotate(-30deg)' }} />
          </div>
        </div>
        {/* Predictions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {predictions.map((p, i) => (
            <motion.div key={i}
              animate={{ background: activeIdx === i ? `rgba(${cr},${cg},${cb},0.2)` : '#1e293b88', borderColor: activeIdx === i ? `rgb(${cr},${cg},${cb})` : '#33415566' }}
              transition={{ duration: 0.5 }}
              style={{ borderRadius: 10, padding: '8px 12px', border: '1px solid', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span style={{ fontSize: 16 }}>{p.icon}</span>
              <span style={{ flex: 1, color: activeIdx === i ? '#e2e8f0' : '#94a3b8', fontSize: 11, fontWeight: activeIdx === i ? 600 : 400 }}>{p.text}</span>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: `rgb(${cr},${cg},${cb})`, fontWeight: 800, fontSize: 13 }}>{p.prob}%</div>
                <div style={{ color: '#64748b', fontSize: 9 }}>prob</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   10. QuantumIntelSpherePanel
   Ultimate 3D sphere with orbiting data rings and toggles
───────────────────────────────────────────────────────────────*/
export const QuantumIntelSpherePanel = () => {
  const capabilities = [
    { name: 'Prediction Engine', color: '#6366f1', key: 'pred' },
    { name: 'Health Analysis', color: '#10b981', key: 'health' },
    { name: 'Behavior AI', color: '#14b8a6', key: 'behavior' },
    { name: 'Revenue Intel', color: '#f59e0b', key: 'revenue' },
    { name: 'Safety Guard', color: '#ef4444', key: 'safety' },
  ];
  const [enabled, setEnabled] = useState(() => Object.fromEntries(capabilities.map(c => [c.key, true])));
  const [tick, setTick] = useState(0);
  const [ringAngles, setRingAngles] = useState([0, 60, 120, 200, 280]);
  const [particles, setParticles] = useState([]);
  const metrics = [
    { name: 'Intelligence', value: 97 },
    { name: 'Accuracy', value: 94 },
    { name: 'Speed', value: 99 },
  ];

  const enabledCount = Object.values(enabled).filter(Boolean).length;
  const sphereColor = enabledCount === 5 ? '#8b5cf6' : enabledCount >= 3 ? '#6366f1' : '#14b8a6';

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setRingAngles(prev => prev.map((a, i) => (a + [0.6, 0.4, 0.8, 0.5, 0.7][i]) % 360));
      setParticles(prev => {
        const alive = prev.filter(p => p.life > 0).map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy - 0.15,
          life: p.life - 1,
          opacity: p.life / 50,
        }));
        if (Math.random() < 0.4 * enabledCount / 5) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 2.5;
          const cap = capabilities[Math.floor(Math.random() * capabilities.length)];
          if (enabled[cap.key]) {
            alive.push({
              x: 0, y: 0, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
              life: 50, opacity: 1, size: 2 + Math.random() * 3, color: cap.color,
            });
          }
        }
        return alive.slice(-100);
      });
    }, 40);
    return () => clearInterval(id);
  }, [enabled, enabledCount]);

  const buildRing = (cx, cy, rx, ry, angle, color, opacity) => {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * Math.PI * 2;
      const tilt = angle * Math.PI / 180;
      const x = cx + Math.cos(t) * rx;
      const y = cy + Math.sin(t) * ry * Math.cos(tilt);
      pts.push(`${x},${y}`);
    }
    return pts;
  };

  return (
    <div style={{ background: 'linear-gradient(135deg,#010006,#060020,#010006)', borderRadius: 20, padding: 24, minHeight: 460, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Cpu size={22} color={sphereColor} />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Quantum Intel Sphere</span>
        <motion.span animate={{ color: sphereColor }} style={{ marginLeft: 'auto', fontWeight: 900, fontSize: 14 }}>
          {enabledCount}/5 ACTIVE
        </motion.span>
      </div>
      {/* Main sphere visualization */}
      <div style={{ position: 'relative', height: 260 }}>
        <svg width="100%" height={260} viewBox="0 0 310 260" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <radialGradient id="qSphereGrad" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="20%" stopColor={sphereColor} stopOpacity="0.9" />
              <stop offset="60%" stopColor={sphereColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor="#010006" stopOpacity="0.8" />
            </radialGradient>
            <filter id="qSphereGlow">
              <feGaussianBlur stdDeviation="6" result="cb" />
              <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="qRingGlow">
              <feGaussianBlur stdDeviation="2" result="cb" />
              <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Background stars */}
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i} cx={(i * 17 + 5) % 310} cy={(i * 13 + 7) % 260} r={Math.random() * 1.2} fill="#fff" opacity={0.2 + Math.random() * 0.4} />
          ))}
          {/* Outer glow halo */}
          <circle cx={155} cy={130} r={80} fill={sphereColor} opacity={0.07} filter="url(#qSphereGlow)" />
          <circle cx={155} cy={130} r={65} fill={sphereColor} opacity={0.1} />
          {/* Orbiting rings for each enabled capability */}
          {capabilities.map((cap, i) => {
            if (!enabled[cap.key]) return null;
            const angle = ringAngles[i];
            const rx = 90 + i * 5;
            const ry = 22 + i * 4;
            const pts = buildRing(155, 130, rx, ry, angle, cap.color, 0.7);
            return (
              <g key={cap.key}>
                <polyline points={pts.join(' ')} fill="none" stroke={cap.color} strokeWidth={1.5}
                  opacity={0.6} filter="url(#qRingGlow)" />
                {/* Ring dot */}
                {(() => {
                  const dotT = (tick * [0.6, 0.4, 0.8, 0.5, 0.7][i] * Math.PI / 180) % (Math.PI * 2);
                  const tilt = angle * Math.PI / 180;
                  const dx = 155 + Math.cos(dotT) * rx;
                  const dy = 130 + Math.sin(dotT) * ry * Math.cos(tilt);
                  return <circle cx={dx} cy={dy} r={5} fill={cap.color} filter="url(#qSphereGlow)" opacity={0.95} />;
                })()}
              </g>
            );
          })}
          {/* Particles */}
          {particles.map((p, i) => (
            <circle key={i} cx={155 + p.x} cy={130 + p.y} r={p.size} fill={p.color} opacity={p.opacity} filter="url(#qRingGlow)" />
          ))}
          {/* Main sphere */}
          <circle cx={155} cy={130} r={52} fill="url(#qSphereGrad)" filter="url(#qSphereGlow)" />
          {/* Sphere surface detail */}
          <ellipse cx={145} cy={112} rx={18} ry={10} fill="#fff" opacity={0.12} transform="rotate(-30,145,112)" />
          {/* Center text */}
          <text x={155} y={124} textAnchor="middle" fill="#fff" fontSize={11} fontWeight="900" filter="url(#qSphereGlow)">QUANTUM</text>
          <text x={155} y={138} textAnchor="middle" fill="#fff" fontSize={9} opacity={0.85}>INTELLIGENCE</text>
          <text x={155} y={152} textAnchor="middle" fill={sphereColor} fontSize={18} fontWeight="900" filter="url(#qSphereGlow)">{enabledCount * 20}%</text>
        </svg>
      </div>
      {/* Capability toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {capabilities.map(cap => (
          <div key={cap.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 10, background: enabled[cap.key] ? `${cap.color}18` : '#1e293b44', border: `1px solid ${enabled[cap.key] ? cap.color + '44' : '#33415533'}`, transition: 'all 0.3s' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: enabled[cap.key] ? cap.color : '#374151', boxShadow: enabled[cap.key] ? `0 0 10px ${cap.color}` : 'none', transition: 'all 0.3s' }} />
            <span style={{ flex: 1, color: enabled[cap.key] ? '#e2e8f0' : '#64748b', fontSize: 12, fontWeight: 600 }}>{cap.name}</span>
            <motion.button
              onClick={() => setEnabled(prev => ({ ...prev, [cap.key]: !prev[cap.key] }))}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{
                width: 44, height: 22, borderRadius: 11,
                background: enabled[cap.key] ? cap.color : '#374151',
                border: 'none', cursor: 'pointer', position: 'relative',
                boxShadow: enabled[cap.key] ? `0 0 10px ${cap.color}` : 'none',
                transition: 'all 0.3s',
              }}
            >
              <motion.div
                animate={{ x: enabled[cap.key] ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{ position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
              />
            </motion.button>
          </div>
        ))}
      </div>
      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {metrics.map(m => (
          <div key={m.name} style={{ background: `${sphereColor}14`, border: `1px solid ${sphereColor}22`, borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ color: sphereColor, fontWeight: 900, fontSize: 18 }}>{m.value}%</div>
            <div style={{ color: '#94a3b8', fontSize: 10 }}>{m.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
