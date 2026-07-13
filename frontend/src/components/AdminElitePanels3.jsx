import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Globe, Star, Activity, Shield, Waves, Compass, Sparkles, Network, Cpu, Radio } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   1. EcosystemAuraPanel
   Animated concentric glowing rings representing ecosystem health
───────────────────────────────────────────────────────────────*/
export const EcosystemAuraPanel = () => {
  const domains = [
    { name: 'Users', color: '#6366f1', score: 94 },
    { name: 'Revenue', color: '#10b981', score: 87 },
    { name: 'Safety', color: '#14b8a6', score: 98 },
    { name: 'Engagement', color: '#8b5cf6', score: 82 },
    { name: 'Growth', color: '#f59e0b', score: 76 },
    { name: 'Trust', color: '#ef4444', score: 91 },
  ];
  const overallScore = Math.round(domains.reduce((a, d) => a + d.score, 0) / domains.length);
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

  const ringStyle = (domain, idx) => {
    const base = 60 + idx * 36;
    const pulse = Math.sin(tick * 0.06 + idx * 1.1) * 8;
    return {
      position: 'absolute',
      width: base * 2 + pulse,
      height: base * 2 + pulse,
      borderRadius: '50%',
      border: `2px solid ${domain.color}`,
      boxShadow: `0 0 ${16 + pulse}px ${domain.color}88, inset 0 0 ${8 + pulse}px ${domain.color}22`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.55 + Math.sin(tick * 0.05 + idx) * 0.15,
      transition: 'width 0.08s ease, height 0.08s ease',
    };
  };

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', borderRadius: 20, padding: 24, minHeight: 380, position: 'relative', overflow: 'hidden', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Globe size={22} color="#6366f1" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Ecosystem Aura</span>
        <span style={{ marginLeft: 'auto', background: '#6366f122', border: '1px solid #6366f144', borderRadius: 8, padding: '2px 10px', color: '#818cf8', fontSize: 13 }}>Live</span>
      </div>
      <div style={{ position: 'relative', height: 300 }}>
        {domains.map((d, i) => (
          <div key={d.name} style={ringStyle(d, i)} />
        ))}
        {/* Centre orb */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 96, height: 96, borderRadius: '50%', background: 'radial-gradient(circle, #6366f1cc 0%, #302b6388 60%, transparent 100%)', boxShadow: '0 0 40px #6366f1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <span style={{ color: '#fff', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{overallScore}</span>
          <span style={{ color: '#a5b4fc', fontSize: 10, fontWeight: 600 }}>HEALTH</span>
        </div>
        {/* Domain labels */}
        {domains.map((d, i) => {
          const angle = (i / domains.length) * Math.PI * 2 - Math.PI / 2;
          const r = 210 / 2 + 20;
          const x = 50 + Math.cos(angle) * 44;
          const y = 50 + Math.sin(angle) * 44;
          return (
            <div key={d.name + 'label'} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', textAlign: 'center', zIndex: 20 }}>
              <div style={{ color: d.color, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', textShadow: `0 0 8px ${d.color}` }}>{d.name}</div>
              <div style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>{d.score}%</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        {domains.map(d => (
          <div key={d.name + 'chip'} style={{ background: `${d.color}22`, border: `1px solid ${d.color}44`, borderRadius: 8, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
            <span style={{ color: d.color, fontSize: 11, fontWeight: 600 }}>{d.name} {d.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   2. UserExperienceDNAPanel
   Double helix DNA visualization with UX metrics
───────────────────────────────────────────────────────────────*/
export const UserExperienceDNAPanel = () => {
  const metrics = [
    { name: 'Engagement', value: 88, color: '#6366f1' },
    { name: 'Retention', value: 76, color: '#14b8a6' },
    { name: 'Satisfaction', value: 92, color: '#10b981' },
    { name: 'Speed', value: 95, color: '#f59e0b' },
    { name: 'Trust', value: 84, color: '#8b5cf6' },
    { name: 'Delight', value: 79, color: '#ef4444' },
  ];
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRotation(r => (r + 0.5) % 360), 30);
    return () => clearInterval(id);
  }, []);

  const dnaHeight = 280;
  const pairs = 12;
  const pairSpacing = dnaHeight / pairs;

  const strand1Points = Array.from({ length: pairs }, (_, i) => {
    const y = i * pairSpacing;
    const phase = (i / pairs) * Math.PI * 2 + (rotation * Math.PI) / 180;
    const x = Math.sin(phase) * 40 + 90;
    return { x, y };
  });
  const strand2Points = Array.from({ length: pairs }, (_, i) => {
    const y = i * pairSpacing;
    const phase = (i / pairs) * Math.PI * 2 + (rotation * Math.PI) / 180 + Math.PI;
    const x = Math.sin(phase) * 40 + 90;
    return { x, y };
  });

  return (
    <div style={{ background: 'linear-gradient(135deg,#0d1117,#161b29,#0d1117)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Brain size={22} color="#8b5cf6" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>UX Experience DNA</span>
        <span style={{ marginLeft: 'auto', color: '#8b5cf6', fontSize: 12, background: '#8b5cf611', border: '1px solid #8b5cf633', borderRadius: 8, padding: '2px 10px' }}>Helical Analysis</span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <svg width={180} height={dnaHeight} style={{ flexShrink: 0 }}>
          <defs>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Strand 1 path */}
          <path
            d={strand1Points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
            fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round"
            filter="url(#glow2)" opacity={0.9}
          />
          {/* Strand 2 path */}
          <path
            d={strand2Points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
            fill="none" stroke="#14b8a6" strokeWidth={2.5} strokeLinecap="round"
            filter="url(#glow2)" opacity={0.9}
          />
          {/* Base pairs (rungs) */}
          {strand1Points.map((p1, i) => {
            const p2 = strand2Points[i];
            const metric = metrics[i % metrics.length];
            return (
              <g key={i}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={metric.color} strokeWidth={2} opacity={0.7} />
                <circle cx={p1.x} cy={p1.y} r={4} fill={metric.color} filter="url(#glow2)" />
                <circle cx={p2.x} cy={p2.y} r={4} fill={metric.color} filter="url(#glow2)" />
              </g>
            );
          })}
        </svg>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
          {metrics.map((m, i) => (
            <div key={m.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>{m.name}</span>
                <span style={{ color: m.color, fontSize: 13, fontWeight: 800 }}>{m.value}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 4, background: '#1e293b', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 1.2, delay: i * 0.1 }}
                  style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${m.color}88, ${m.color})`, boxShadow: `0 0 8px ${m.color}` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16, padding: '10px 14px', background: '#1e293b88', borderRadius: 12, border: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#94a3b8', fontSize: 12 }}>Overall UX DNA Score</span>
        <span style={{ color: '#8b5cf6', fontWeight: 800, fontSize: 15 }}>
          {Math.round(metrics.reduce((a, m) => a + m.value, 0) / metrics.length)}%
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   3. PlatformEmotionGridPanel
   10×10 emotional heatmap grid
───────────────────────────────────────────────────────────────*/
export const PlatformEmotionGridPanel = () => {
  const GRID = 10;
  const emotionLabels = ['Rage', 'Anger', 'Concern', 'Neutral', 'Calm', 'Content', 'Happy', 'Excited', 'Elated', 'Euphoric'];
  const emotionColors = ['#ef4444','#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#10b981','#14b8a6','#6366f1','#8b5cf6'];

  const [grid, setGrid] = useState(() =>
    Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => Math.random()))
  );
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setGrid(prev => prev.map(row => row.map(v => {
        const delta = (Math.random() - 0.5) * 0.12;
        return Math.max(0, Math.min(1, v + delta));
      })));
    }, 600);
    return () => clearInterval(id);
  }, []);

  const getColor = (v) => {
    const idx = Math.min(9, Math.floor(v * 10));
    const col = emotionColors[idx];
    return col;
  };

  const avgEmotion = grid.flat().reduce((a, b) => a + b, 0) / (GRID * GRID);
  const emotionIdx = Math.min(9, Math.floor(avgEmotion * 10));

  return (
    <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Sparkles size={22} color="#f59e0b" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Platform Emotion Grid</span>
        <span style={{ marginLeft: 'auto', color: emotionColors[emotionIdx], fontSize: 12, fontWeight: 700 }}>{emotionLabels[emotionIdx]}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID}, 1fr)`, gap: 3, marginBottom: 12 }}>
        {grid.map((row, ri) => row.map((v, ci) => (
          <motion.div
            key={`${ri}-${ci}`}
            animate={{ backgroundColor: getColor(v), scale: hoveredCell === `${ri}-${ci}` ? 1.4 : 1 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setHoveredCell(`${ri}-${ci}`)}
            onMouseLeave={() => setHoveredCell(null)}
            style={{ height: 22, borderRadius: 4, cursor: 'pointer', boxShadow: hoveredCell === `${ri}-${ci}` ? `0 0 12px ${getColor(v)}` : 'none', position: 'relative', zIndex: hoveredCell === `${ri}-${ci}` ? 10 : 1 }}
            title={`${emotionLabels[Math.min(9, Math.floor(v * 10))]} (${Math.round(v * 100)}%)`}
          />
        )))}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 10, borderRadius: 8, overflow: 'hidden' }}>
        {emotionColors.map((c, i) => (
          <div key={i} style={{ flex: 1, height: 10, background: c }} title={emotionLabels[i]} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', marginBottom: 12 }}>
        <span>Rage</span><span>Neutral</span><span>Euphoric</span>
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
        <div style={{ flex: 1, background: '#1e293b', borderRadius: 10, padding: '8px 12px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8' }}>Avg Emotion</div>
          <div style={{ color: emotionColors[emotionIdx], fontWeight: 800, fontSize: 15 }}>{emotionLabels[emotionIdx]}</div>
        </div>
        <div style={{ flex: 1, background: '#1e293b', borderRadius: 10, padding: '8px 12px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8' }}>Intensity</div>
          <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: 15 }}>{Math.round(avgEmotion * 100)}%</div>
        </div>
        <div style={{ flex: 1, background: '#1e293b', borderRadius: 10, padding: '8px 12px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8' }}>Grid Cells</div>
          <div style={{ color: '#10b981', fontWeight: 800, fontSize: 15 }}>100</div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   4. EngagementVolcanoPanel
   SVG volcano with animated lava/eruption effects
───────────────────────────────────────────────────────────────*/
export const EngagementVolcanoPanel = () => {
  const [eruption, setEruption] = useState(72);
  const [particles, setParticles] = useState([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setEruption(e => Math.max(30, Math.min(100, e + (Math.random() - 0.45) * 4)));
      setParticles(prev => {
        const alive = prev.filter(p => p.life > 0).map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy - 0.3,
          life: p.life - 1,
          opacity: p.life / 30,
        }));
        if (Math.random() < 0.7) {
          alive.push({ x: 160 + (Math.random() - 0.5) * 20, y: 100, vx: (Math.random() - 0.5) * 4, vy: -(2 + Math.random() * 4), life: 30, opacity: 1, size: 3 + Math.random() * 5, color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444' });
        }
        return alive.slice(-60);
      });
    }, 50);
    return () => clearInterval(id);
  }, []);

  const smokeY = 100 - eruption * 0.5;
  const lavaH = eruption * 0.6;

  return (
    <div style={{ background: 'linear-gradient(180deg,#0f0c1e 0%, #1a0a0a 100%)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <Zap size={22} color="#f59e0b" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Engagement Volcano</span>
        <span style={{ marginLeft: 'auto', color: eruption > 80 ? '#ef4444' : eruption > 60 ? '#f59e0b' : '#10b981', fontWeight: 800, fontSize: 14 }}>
          {eruption > 80 ? '🌋 Erupting' : eruption > 60 ? '🔥 Active' : '🌱 Dormant'}
        </span>
      </div>
      <svg width="100%" height={240} viewBox="0 0 320 240">
        <defs>
          <radialGradient id="lavaGrad" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
          <filter id="lavaGlow">
            <feGaussianBlur stdDeviation="3" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="smokeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Sky gradient */}
        <rect width="320" height="240" fill="url(#skyGrad2)" />
        {/* Mountain body */}
        <polygon points="160,80 60,220 260,220" fill="#374151" />
        <polygon points="160,90 80,220 240,220" fill="#1f2937" />
        {/* Lava flow */}
        <polygon
          points={`160,${100 - lavaH * 0.3} ${140 + lavaH * 0.1},220 ${180 - lavaH * 0.1},220`}
          fill="url(#lavaGrad)" filter="url(#lavaGlow)" opacity={0.85}
        />
        {/* Crater */}
        <ellipse cx="160" cy="100" rx="28" ry="14" fill="#7f1d1d" />
        <ellipse cx="160" cy="100" rx="18" ry="9" fill="#ef4444" filter="url(#lavaGlow)" />
        {/* Smoke puffs */}
        {[0, 1, 2].map(i => (
          <ellipse
            key={i}
            cx={160 + Math.sin(tick * 0.05 + i * 2) * 15}
            cy={smokeY - i * 22}
            rx={18 + i * 8 + Math.sin(tick * 0.04 + i) * 4}
            ry={10 + i * 4}
            fill="url(#smokeGrad)"
            opacity={0.35 - i * 0.08}
          />
        ))}
        {/* Lava particles */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={p.color} opacity={p.opacity} filter="url(#lavaGlow)" />
        ))}
        {/* Activity spikes */}
        {[0, 1, 2].map(i => (
          <line key={i}
            x1={160} y1={100}
            x2={160 + Math.cos((i / 3) * Math.PI * 2 + tick * 0.03) * 40}
            y2={100 + Math.sin((i / 3) * Math.PI * 2 + tick * 0.03) * 20}
            stroke="#f59e0b" strokeWidth={2} opacity={0.5} filter="url(#lavaGlow)"
          />
        ))}
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>Eruption Level</div>
          <div style={{ height: 8, borderRadius: 8, background: '#1e293b', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${eruption}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', borderRadius: 8, background: `linear-gradient(90deg,#f59e0b,#ef4444)`, boxShadow: '0 0 12px #ef4444' }} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: 28, lineHeight: 1 }}>{Math.round(eruption)}%</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>intensity</div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   5. RevenueEnergyMatrixPanel
   6×5 revenue stream matrix with glowing cells
───────────────────────────────────────────────────────────────*/
export const RevenueEnergyMatrixPanel = () => {
  const streams = ['Premium', 'Ads', 'Vet Fees', 'Products', 'Partners', 'Data'];
  const periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const [matrix, setMatrix] = useState(() =>
    streams.map(() => periods.map(() => 0.3 + Math.random() * 0.7))
  );
  const [selected, setSelected] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setMatrix(prev => prev.map(row => row.map(v => Math.max(0.1, Math.min(1, v + (Math.random() - 0.5) * 0.05)))));
    }, 800);
    return () => clearInterval(id);
  }, []);

  const total = matrix.flat().reduce((a, b) => a + b, 0);
  const getRevColor = (v) => {
    const r = Math.round(16 + v * 239);
    const g = Math.round(185 * v);
    const b = Math.round(10 + v * 100);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div style={{ background: 'linear-gradient(135deg,#051937,#0a2744,#051937)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Zap size={22} color="#10b981" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Revenue Energy Matrix</span>
        <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 13, fontWeight: 700 }}>
          ${(total * 12.4).toFixed(1)}K
        </span>
      </div>
      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', gap: 4, marginBottom: 4 }}>
        <div />
        {periods.map(p => <div key={p} style={{ color: '#64748b', fontSize: 11, textAlign: 'center', fontWeight: 600 }}>{p}</div>)}
      </div>
      {/* Matrix */}
      {matrix.map((row, ri) => (
        <div key={streams[ri]} style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', gap: 4, marginBottom: 4 }}>
          <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center' }}>{streams[ri]}</div>
          {row.map((v, ci) => {
            const isSelected = selected?.r === ri && selected?.c === ci;
            const col = getRevColor(v);
            return (
              <motion.div
                key={ci}
                onClick={() => setSelected(isSelected ? null : { r: ri, c: ci, value: v, stream: streams[ri], period: periods[ci] })}
                animate={{ opacity: 0.6 + v * 0.4 }}
                whileHover={{ scale: 1.08, opacity: 1 }}
                style={{
                  height: 34,
                  borderRadius: 6,
                  background: `${col}`,
                  boxShadow: isSelected ? `0 0 20px ${col}` : `0 0 ${v * 12}px ${col}66`,
                  cursor: 'pointer',
                  border: isSelected ? `2px solid #fff` : '1px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title={`${streams[ri]} / ${periods[ci]}: ${Math.round(v * 100)}%`}
              >
                <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, textShadow: '0 1px 3px #000' }}>{Math.round(v * 100)}%</span>
              </motion.div>
            );
          })}
        </div>
      ))}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ marginTop: 12, padding: '10px 14px', background: '#1e293b', borderRadius: 12, border: '1px solid #10b98144', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <div style={{ color: '#94a3b8', fontSize: 11 }}>{selected.stream} · {selected.period}</div>
              <div style={{ color: '#10b981', fontWeight: 800, fontSize: 16 }}>${(selected.value * 24.8).toFixed(1)}K revenue</div>
            </div>
            <div style={{ color: '#64748b', cursor: 'pointer', fontSize: 18 }} onClick={() => setSelected(null)}>×</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   6. TrustPulseEnginePanel
   ECG-style heartbeat with trust factors
───────────────────────────────────────────────────────────────*/
export const TrustPulseEnginePanel = () => {
  const factors = [
    { name: 'Security', color: '#10b981', score: 97 },
    { name: 'Transparency', color: '#6366f1', score: 84 },
    { name: 'Reliability', color: '#14b8a6', score: 91 },
    { name: 'Support', color: '#f59e0b', score: 88 },
    { name: 'Community', color: '#8b5cf6', score: 79 },
  ];
  const [phase, setPhase] = useState(0);
  const trustScore = Math.round(factors.reduce((a, f) => a + f.score, 0) / factors.length);

  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 2) % 360), 30);
    return () => clearInterval(id);
  }, []);

  const ecgPoints = (w, amp, phaseOffset = 0) => {
    const pts = [];
    for (let i = 0; i <= w; i += 2) {
      const t = (i / w) * 4 * Math.PI + (phase + phaseOffset) * 0.05;
      let y = 0;
      const cycle = t % (Math.PI * 2);
      if (cycle < 0.4) y = 0;
      else if (cycle < 0.55) y = -amp * (cycle - 0.4) / 0.15;
      else if (cycle < 0.7) y = amp * (cycle - 0.55) / 0.15;
      else if (cycle < 0.85) y = -amp * 2 * (cycle - 0.7) / 0.15;
      else if (cycle < 1.1) y = amp * 0.6 * (cycle - 0.85) / 0.25;
      else if (cycle < 1.4) y = -amp * 0.3 * (cycle - 1.1) / 0.3;
      else y = 0;
      pts.push({ x: i, y });
    }
    return pts;
  };

  const buildPath = (pts, baseY) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${baseY + p.y}`).join(' ');

  return (
    <div style={{ background: 'linear-gradient(135deg,#042f2e,#0a1628,#042f2e)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Activity size={22} color="#10b981" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Trust Pulse Engine</span>
        <span style={{ marginLeft: 'auto', color: '#10b981', fontWeight: 900, fontSize: 22 }}>{trustScore}<span style={{ fontSize: 12, fontWeight: 400, color: '#6b7280' }}>/100</span></span>
      </div>
      {/* Main ECG */}
      <svg width="100%" height={80} viewBox="0 0 320 80" preserveAspectRatio="none">
        <defs>
          <filter id="ecgGlow">
            <feGaussianBlur stdDeviation="2" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="320" height="80" fill="#0a1628" rx="8" />
        {/* Grid lines */}
        {[20, 40, 60].map(y => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#1e293b" strokeWidth="1" />)}
        {[0, 80, 160, 240, 320].map(x => <line key={x} x1={x} y1="0" x2={x} y2="80" stroke="#1e293b" strokeWidth="1" />)}
        <path d={buildPath(ecgPoints(320, 28), 40)} fill="none" stroke="#10b981" strokeWidth={2.5} filter="url(#ecgGlow)" />
        <path d={buildPath(ecgPoints(320, 28), 40)} fill="none" stroke="#34d399" strokeWidth={1} opacity={0.4} />
      </svg>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {factors.map((f, i) => {
          const miniPts = ecgPoints(180, 10, i * 72);
          return (
            <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, width: 90 }}>{f.name}</span>
              <svg width={130} height={28} viewBox="0 0 130 28">
                <path d={buildPath(miniPts, 14)} fill="none" stroke={f.color} strokeWidth={1.8} />
              </svg>
              <span style={{ color: f.color, fontWeight: 800, fontSize: 13, marginLeft: 'auto' }}>{f.score}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   7. EcosystemBalanceOrbitPanel
   Solar system orbital diagram
───────────────────────────────────────────────────────────────*/
export const EcosystemBalanceOrbitPanel = () => {
  const pillars = [
    { name: 'Users', color: '#6366f1', size: 22, orbitR: 65, speed: 0.008, importance: 95 },
    { name: 'Revenue', color: '#10b981', size: 16, orbitR: 95, speed: 0.005, importance: 82 },
    { name: 'Safety', color: '#14b8a6', size: 20, orbitR: 125, speed: 0.007, importance: 90 },
    { name: 'Growth', color: '#f59e0b', size: 14, orbitR: 152, speed: 0.004, importance: 74 },
    { name: 'Trust', color: '#8b5cf6', size: 18, orbitR: 178, speed: 0.006, importance: 87 },
  ];

  const [angles, setAngles] = useState(() => pillars.map((_, i) => (i / pillars.length) * Math.PI * 2));

  useEffect(() => {
    const id = setInterval(() => {
      setAngles(prev => prev.map((a, i) => a + pillars[i].speed));
    }, 30);
    return () => clearInterval(id);
  }, []);

  const cx = 155, cy = 150;

  return (
    <div style={{ background: 'linear-gradient(135deg,#020617,#0d1b2a,#020617)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <Compass size={22} color="#14b8a6" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Ecosystem Balance Orbit</span>
      </div>
      <svg width="100%" height={300} viewBox="0 0 310 300">
        <defs>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="60%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </radialGradient>
          <filter id="orbitGlow">
            <feGaussianBlur stdDeviation="3" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Stars */}
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={Math.random() * 310} cy={Math.random() * 300} r={Math.random() * 1.5} fill="#fff" opacity={Math.random() * 0.7 + 0.1} />
        ))}
        {/* Orbital paths */}
        {pillars.map((p, i) => (
          <circle key={'orbit' + i} cx={cx} cy={cy} r={p.orbitR} fill="none" stroke={p.color} strokeWidth={0.5} opacity={0.2} strokeDasharray="4 6" />
        ))}
        {/* Core planet */}
        <circle cx={cx} cy={cy} r={28} fill="url(#coreGrad)" filter="url(#orbitGlow)" />
        <circle cx={cx} cy={cy} r={28} fill="none" stroke="#6366f1" strokeWidth={2} opacity={0.5} />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="bold">CORE</text>
        {/* Pillars */}
        {pillars.map((p, i) => {
          const px = cx + Math.cos(angles[i]) * p.orbitR;
          const py = cy + Math.sin(angles[i]) * p.orbitR;
          return (
            <g key={p.name}>
              <circle cx={px} cy={py} r={p.size} fill={p.color} filter="url(#orbitGlow)" opacity={0.85} />
              <circle cx={px} cy={py} r={p.size} fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.3} />
              <text x={px} y={py + 4} textAnchor="middle" fill="#fff" fontSize={7} fontWeight="bold">{p.name[0]}</text>
              {/* Label */}
              <text x={px + p.size + 3} y={py + 3} fill={p.color} fontSize={8} fontWeight="600" opacity={0.9}>{p.name}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {pillars.map(p => (
          <div key={p.name} style={{ background: `${p.color}18`, border: `1px solid ${p.color}33`, borderRadius: 8, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: p.size * 0.4 + 4, height: p.size * 0.4 + 4, borderRadius: '50%', background: p.color }} />
            <span style={{ color: p.color, fontSize: 11, fontWeight: 700 }}>{p.name} {p.importance}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   8. ActivitySkylinePanel
   SVG city skyline with activity metrics
───────────────────────────────────────────────────────────────*/
export const ActivitySkylinePanel = () => {
  const buildings = [
    { name: 'Users', height: 120, width: 32, x: 10, windows: 12, color: '#6366f1', activity: 87 },
    { name: 'Revenue', height: 90, width: 28, x: 50, windows: 9, color: '#10b981', activity: 73 },
    { name: 'Vets', height: 160, width: 36, x: 86, windows: 16, color: '#14b8a6', activity: 94 },
    { name: 'Safety', height: 75, width: 26, x: 130, windows: 7, color: '#f59e0b', activity: 62 },
    { name: 'AI', height: 200, width: 40, x: 162, windows: 20, color: '#8b5cf6', activity: 98 },
    { name: 'Events', height: 100, width: 30, x: 210, windows: 10, color: '#ef4444', activity: 81 },
    { name: 'Support', height: 140, width: 34, x: 248, windows: 14, color: '#f59e0b', activity: 77 },
  ];

  const [litWindows, setLitWindows] = useState(() =>
    buildings.map(b => Array.from({ length: b.windows }, () => Math.random() > 0.3))
  );
  const [skyPhase, setSkyPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSkyPhase(p => (p + 0.3) % 360);
      setLitWindows(prev => prev.map((bw, bi) =>
        bw.map(w => Math.random() < 0.08 ? !w : w)
      ));
    }, 400);
    return () => clearInterval(id);
  }, []);

  const skyR = Math.round(10 + Math.abs(Math.sin(skyPhase * Math.PI / 180)) * 30);
  const skyG = Math.round(10 + Math.abs(Math.sin(skyPhase * Math.PI / 180)) * 20);
  const skyBright = Math.abs(Math.sin(skyPhase * Math.PI / 180));

  return (
    <div style={{ background: `linear-gradient(180deg,rgb(${skyR},${skyG},${60 + Math.round(skyBright * 100)}) 0%,#0f172a 100%)`, borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden', transition: 'background 1s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Star size={22} color="#f59e0b" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Activity Skyline</span>
        <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 12 }}>
          {skyPhase < 60 ? '🌅 Dawn' : skyPhase < 180 ? '🌇 Dusk' : '🌃 Night'}
        </span>
      </div>
      <svg width="100%" height={230} viewBox="0 0 310 230">
        {/* Moon/sun */}
        <circle cx={280} cy={30} r={18}
          fill={skyPhase < 60 ? '#f59e0b' : '#e2e8f0'}
          opacity={0.8}
          filter="url(#orbitGlow)" />
        {/* Ground */}
        <rect x={0} y={220} width={310} height={10} fill="#1e293b" />
        {/* Buildings */}
        {buildings.map((b, bi) => {
          const by = 220 - b.height;
          const rows = Math.ceil(b.windows / 3);
          return (
            <g key={b.name}>
              <rect x={b.x} y={by} width={b.width} height={b.height} fill="#1e293b" rx={2} />
              <rect x={b.x} y={by} width={b.width} height={4} fill={b.color} opacity={0.7} />
              {/* Windows */}
              {litWindows[bi]?.map((lit, wi) => {
                const col = wi % 3;
                const row = Math.floor(wi / 3);
                return (
                  <rect key={wi}
                    x={b.x + 4 + col * 8}
                    y={by + 8 + row * 10}
                    width={5} height={6}
                    fill={lit ? b.color : '#374151'}
                    opacity={lit ? 0.9 : 0.3}
                    rx={1}
                  />
                );
              })}
              {/* Building glow */}
              <rect x={b.x} y={by} width={b.width} height={b.height} fill={b.color} opacity={0.04} rx={2} />
              <text x={b.x + b.width / 2} y={225} textAnchor="middle" fill={b.color} fontSize={7} fontWeight="600">{b.name}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
        {buildings.map(b => (
          <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${b.color}14`, borderRadius: 6, padding: '3px 8px', border: `1px solid ${b.color}30` }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: b.color, boxShadow: `0 0 6px ${b.color}` }} />
            <span style={{ color: b.color, fontSize: 10, fontWeight: 700 }}>{b.activity}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   9. IntelStreamNetworkPanel
   Animated network graph with data particles
───────────────────────────────────────────────────────────────*/
export const IntelStreamNetworkPanel = () => {
  const nodes = [
    { id: 0, x: 155, y: 130, label: 'Core AI', color: '#6366f1', size: 20 },
    { id: 1, x: 60, y: 60, label: 'Behavior', color: '#14b8a6', size: 14 },
    { id: 2, x: 250, y: 60, label: 'Health', color: '#10b981', size: 14 },
    { id: 3, x: 40, y: 180, label: 'Revenue', color: '#f59e0b', size: 12 },
    { id: 4, x: 270, y: 180, label: 'Safety', color: '#8b5cf6', size: 12 },
    { id: 5, x: 100, y: 240, label: 'Social', color: '#ef4444', size: 11 },
    { id: 6, x: 210, y: 240, label: 'UX', color: '#14b8a6', size: 11 },
  ];
  const edges = [
    { from: 0, to: 1, weight: 0.9 }, { from: 0, to: 2, weight: 0.8 },
    { from: 0, to: 3, weight: 0.7 }, { from: 0, to: 4, weight: 0.85 },
    { from: 0, to: 5, weight: 0.6 }, { from: 0, to: 6, weight: 0.75 },
    { from: 1, to: 5, weight: 0.5 }, { from: 2, to: 6, weight: 0.55 },
    { from: 3, to: 5, weight: 0.4 }, { from: 4, to: 6, weight: 0.45 },
  ];

  const [particles, setParticles] = useState([]);
  const [insightCount, setInsightCount] = useState(2847);

  useEffect(() => {
    const id = setInterval(() => {
      setInsightCount(c => c + Math.floor(Math.random() * 3));
      setParticles(prev => {
        const alive = prev
          .filter(p => p.t < 1)
          .map(p => ({ ...p, t: p.t + 0.025 }));
        if (Math.random() < 0.6) {
          const edge = edges[Math.floor(Math.random() * edges.length)];
          alive.push({ edge, t: 0, id: Math.random() });
        }
        return alive.slice(-40);
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: 'linear-gradient(135deg,#0a0a1a,#0d1b30,#0a0a1a)', borderRadius: 20, padding: 24, minHeight: 380, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Network size={22} color="#6366f1" />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Intel Stream Network</span>
        <span style={{ marginLeft: 'auto', color: '#6366f1', fontWeight: 800, fontSize: 14 }}>
          {insightCount.toLocaleString()} <span style={{ color: '#64748b', fontWeight: 400, fontSize: 11 }}>insights</span>
        </span>
      </div>
      <svg width="100%" height={270} viewBox="0 0 310 270">
        <defs>
          <filter id="netGlow">
            <feGaussianBlur stdDeviation="3" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Edges */}
        {edges.map((e, i) => {
          const n1 = nodes[e.from], n2 = nodes[e.to];
          return (
            <line key={i} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
              stroke="#334155" strokeWidth={e.weight * 2.5} opacity={0.4} />
          );
        })}
        {/* Particles */}
        {particles.map(p => {
          const n1 = nodes[p.edge.from], n2 = nodes[p.edge.to];
          const px = n1.x + (n2.x - n1.x) * p.t;
          const py = n1.y + (n2.y - n1.y) * p.t;
          const col = nodes[p.edge.from].color;
          return (
            <circle key={p.id} cx={px} cy={py} r={3} fill={col} filter="url(#netGlow)" opacity={1 - p.t * 0.3} />
          );
        })}
        {/* Nodes */}
        {nodes.map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.size + 6} fill={n.color} opacity={0.12} />
            <circle cx={n.x} cy={n.y} r={n.size} fill={n.color} filter="url(#netGlow)" opacity={0.85} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#fff" fontSize={7} fontWeight="700">{n.label.substring(0, 4)}</text>
            <text x={n.x} y={n.y + n.size + 10} textAnchor="middle" fill={n.color} fontSize={8}>{n.label}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
        {nodes.slice(1).map(n => (
          <div key={n.label} style={{ background: `${n.color}16`, border: `1px solid ${n.color}33`, borderRadius: 8, padding: '3px 9px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.color }} />
            <span style={{ color: n.color, fontSize: 10, fontWeight: 600 }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   10. QuantumEvolutionCorePanel
   Central orb with particle explosion, hexagonal grid, evolution stages
───────────────────────────────────────────────────────────────*/
export const QuantumEvolutionCorePanel = () => {
  const [stage, setStage] = useState(4);
  const [burst, setBurst] = useState([]);
  const [orbPulse, setOrbPulse] = useState(0);
  const [tick, setTick] = useState(0);

  const stageLabels = ['Embryonic', 'Nascent', 'Emerging', 'Expanding', 'Flourishing', 'Transcendent', 'Omniscient'];
  const stageColors = ['#94a3b8', '#14b8a6', '#10b981', '#6366f1', '#8b5cf6', '#ef4444', '#f59e0b'];
  const metrics = [
    { name: 'Neural Depth', value: 92 },
    { name: 'Self-Improve', value: 78 },
    { name: 'Prediction', value: 95 },
    { name: 'Adaptation', value: 86 },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setOrbPulse(p => (p + 2) % 360);
      setBurst(prev => {
        const alive = prev.filter(p => p.life > 0).map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1,
          opacity: (p.life / 40),
          size: p.size * 0.97,
        }));
        if (Math.random() < 0.5) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 3;
          alive.push({
            x: 0, y: 0, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            life: 40, size: 2 + Math.random() * 4, opacity: 1,
            color: stageColors[stage],
          });
        }
        return alive.slice(-80);
      });
    }, 40);
    return () => clearInterval(id);
  }, [stage]);

  const hexPoints = (cx, cy, r) => {
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i * 60 - 30) * Math.PI / 180;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
  };

  const hexGrid = [];
  const hexR = 20;
  for (let row = -3; row <= 3; row++) {
    for (let col = -4; col <= 4; col++) {
      const hx = col * hexR * 1.73 + (row % 2) * hexR * 0.87 + 155;
      const hy = row * hexR * 1.5 + 135;
      const dist = Math.sqrt((hx - 155) ** 2 + (hy - 135) ** 2);
      if (dist > 40 && dist < 200) hexGrid.push({ hx, hy, dist });
    }
  }

  const orbSize = 50 + Math.sin(orbPulse * Math.PI / 180) * 6;
  const color = stageColors[stage];

  return (
    <div style={{ background: 'linear-gradient(135deg,#020010,#0d0020,#020010)', borderRadius: 20, padding: 24, minHeight: 420, fontFamily: 'system-ui', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Cpu size={22} color={color} />
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Quantum Evolution Core</span>
        <motion.span
          animate={{ color: color, textShadow: `0 0 12px ${color}` }}
          transition={{ duration: 0.5 }}
          style={{ marginLeft: 'auto', fontWeight: 900, fontSize: 14 }}
        >
          Stage {stage + 1}: {stageLabels[stage]}
        </motion.span>
      </div>
      <div style={{ position: 'relative', height: 270 }}>
        <svg width="100%" height={270} viewBox="0 0 310 270" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="30%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
            <filter id="qGlow">
              <feGaussianBlur stdDeviation="4" result="cb" />
              <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="qGlowHex">
              <feGaussianBlur stdDeviation="1.5" result="cb" />
              <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Hex grid */}
          {hexGrid.map((h, i) => {
            const opacity = 0.08 + (Math.sin(tick * 0.04 + i * 0.3) + 1) * 0.08;
            const dist = h.dist;
            return (
              <polygon key={i} points={hexPoints(h.hx, h.hy, hexR - 2)} fill="none"
                stroke={color} strokeWidth={0.7} opacity={opacity} />
            );
          })}
          {/* Burst particles */}
          {burst.map((p, i) => (
            <circle key={i} cx={155 + p.x} cy={135 + p.y} r={p.size} fill={p.color} opacity={p.opacity} filter="url(#qGlow)" />
          ))}
          {/* Orb rings */}
          {[80, 100, 120].map((r, i) => (
            <circle key={r} cx={155} cy={135} r={r + Math.sin(tick * 0.04 + i) * 5} fill="none"
              stroke={color} strokeWidth={0.8} opacity={0.12 + i * 0.05} strokeDasharray="6 8" />
          ))}
          {/* Main orb */}
          <circle cx={155} cy={135} r={orbSize + 18} fill={color} opacity={0.12} filter="url(#qGlow)" />
          <circle cx={155} cy={135} r={orbSize}
            fill={`radial-gradient(circle at 40% 35%, #fff, ${color})`}
            style={{ fill: `url(#orbGrad)` }}
            filter="url(#qGlow)" />
          {/* Stage number */}
          <text x={155} y={130} textAnchor="middle" fill="#fff" fontSize={22} fontWeight="900" filter="url(#qGlow)">{stage + 1}</text>
          <text x={155} y={148} textAnchor="middle" fill="#fff" fontSize={8} opacity={0.8}>STAGE</text>
        </svg>
      </div>
      {/* Stage selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {stageLabels.map((s, i) => (
          <motion.button key={i} onClick={() => setStage(i)}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            style={{
              flex: 1, height: 28, borderRadius: 6, border: `1px solid ${stageColors[i]}44`,
              background: stage === i ? stageColors[i] : `${stageColors[i]}16`,
              color: stage === i ? '#fff' : stageColors[i],
              fontSize: 9, fontWeight: 700, cursor: 'pointer', padding: 0,
              boxShadow: stage === i ? `0 0 12px ${stageColors[i]}` : 'none',
            }}
          >{i + 1}</motion.button>
        ))}
      </div>
      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {metrics.map(m => (
          <div key={m.name} style={{ background: '#0d0020', borderRadius: 10, padding: '8px 12px', border: `1px solid ${color}22` }}>
            <div style={{ color: '#94a3b8', fontSize: 10, marginBottom: 4 }}>{m.name}</div>
            <div style={{ height: 4, borderRadius: 4, background: '#1e293b' }}>
              <motion.div animate={{ width: `${m.value}%`, boxShadow: `0 0 8px ${color}` }} transition={{ duration: 0.8 }}
                style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg,${color}88,${color})` }} />
            </div>
            <div style={{ color, fontSize: 11, fontWeight: 800, marginTop: 3 }}>{m.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};
