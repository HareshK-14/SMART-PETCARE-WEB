import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cloud, Sun, Zap, Wind, Star, Globe, Brain, Heart, Activity, Shield, Map, Waves, Compass, Music, Camera, Rocket, Leaf } from 'lucide-react';

/* ─────────────── SHARED KEYFRAMES ─────────────── */
const globalStyles = `
@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse-ring { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.18); opacity: 0.15; } }
@keyframes twinkle { 0%,100% { opacity: 1; filter: drop-shadow(0 0 4px #fff); } 50% { opacity: 0.3; filter: drop-shadow(0 0 1px #fff); } }
@keyframes shooting { 0% { transform: translateX(0) translateY(0) rotate(-35deg); opacity: 1; } 100% { transform: translateX(220px) translateY(80px) rotate(-35deg); opacity: 0; } }
@keyframes rain-fall { 0% { transform: translateY(-10px); opacity: 0; } 80% { opacity: 1; } 100% { transform: translateY(120px); opacity: 0; } }
@keyframes sun-ray { 0%,100% { transform: scaleY(1); opacity: 0.8; } 50% { transform: scaleY(1.6); opacity: 0.4; } }
@keyframes float-up { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes waveform { 0%,100% { height: 8px; } 50% { height: 28px; } }
@keyframes crystal-glow { 0%,100% { filter: drop-shadow(0 0 12px var(--c-glow,#8b5cf6)); } 50% { filter: drop-shadow(0 0 30px var(--c-glow,#8b5cf6)); } }
@keyframes sparkle-fly { 0% { transform: translate(0,0) scale(1); opacity: 1; } 100% { transform: translate(var(--tx,20px),var(--ty,-30px)) scale(0); opacity: 0; } }
@keyframes electric-arc { 0%,100% { opacity: 1; stroke-dashoffset: 0; } 50% { opacity: 0.3; stroke-dashoffset: 20; } }
@keyframes loneliness-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.5);} 50%{box-shadow:0 0 0 14px rgba(239,68,68,0);} }
@keyframes bar-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
`;
if (typeof document !== 'undefined' && !document.getElementById('oef-styles')) {
  const s = document.createElement('style'); s.id = 'oef-styles'; s.textContent = globalStyles; document.head.appendChild(s);
}

/* ══════════════════════════════════════════════════════════
   1. EmotionWeatherPanel
══════════════════════════════════════════════════════════ */
const WEATHERS = [
  { id: 'sunny',    label: 'Sunny / Happy',   emoji: '☀️',  intensity: 92, gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24,#fde68a)', textColor: '#78350f', icon: Sun,   desc: 'Your pet is radiantly joyful!' },
  { id: 'stormy',   label: 'Stormy / Anxious', emoji: '⛈️',  intensity: 61, gradient: 'linear-gradient(135deg,#374151,#6b7280,#1f2937)', textColor: '#f9fafb', icon: Cloud, desc: 'Elevated stress detected.' },
  { id: 'rainy',    label: 'Rainy / Sad',      emoji: '🌧️',  intensity: 34, gradient: 'linear-gradient(135deg,#1e40af,#3b82f6,#93c5fd)', textColor: '#dbeafe', icon: Cloud, desc: 'Pet seems low in spirit.' },
  { id: 'breezy',   label: 'Breezy / Calm',    emoji: '🍃',  intensity: 78, gradient: 'linear-gradient(135deg,#059669,#10b981,#6ee7b7)', textColor: '#ecfdf5', icon: Wind,  desc: 'Peaceful and content.' },
  { id: 'electric', label: 'Electric / Excited',emoji: '⚡',  intensity: 88, gradient: 'linear-gradient(135deg,#7c3aed,#8b5cf6,#c4b5fd)', textColor: '#faf5ff', icon: Zap,   desc: 'Bursting with energy!' },
];

export function EmotionWeatherPanel() {
  const [active, setActive] = useState(0);
  const w = WEATHERS[active];

  return (
    <div style={{ background: '#0f172a', borderRadius: 20, padding: 24, border: '1px solid #1e293b', fontFamily: 'sans-serif', minHeight: 340 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Sun size={18} color="#f59e0b" />
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>EMOTION WEATHER</span>
        <span style={{ marginLeft: 'auto', background: '#1e293b', borderRadius: 99, padding: '2px 10px', fontSize: 11, color: '#94a3b8' }}>LIVE</span>
      </div>

      {/* Weather card */}
      <motion.div key={w.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        style={{ background: w.gradient, borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
        {/* Sun rays */}
        {w.id === 'sunny' && [0,40,80,120,160,200,240,280,320].map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: 28, top: 28, width: 3, height: 22, background: '#fbbf24', borderRadius: 2, transformOrigin: '50% 150%', transform: `rotate(${r}deg)`, animation: `sun-ray ${1 + i * 0.1}s ease-in-out infinite` }} />
        ))}
        {/* Rain drops */}
        {(w.id === 'rainy' || w.id === 'stormy') && [10,30,55,75,95,115].map((x, i) => (
          <div key={i} style={{ position: 'absolute', top: 0, left: `${x}%`, width: 2, height: 14, background: 'rgba(255,255,255,0.5)', borderRadius: 1, animation: `rain-fall ${0.8 + i * 0.15}s linear ${i * 0.12}s infinite` }} />
        ))}
        {/* Floating emoji */}
        <div style={{ fontSize: 52, animation: 'float-up 3s ease-in-out infinite', display: 'inline-block' }}>{w.emoji}</div>
        <div style={{ color: w.textColor, fontWeight: 800, fontSize: 22, marginTop: 6 }}>{w.label}</div>
        <div style={{ color: w.textColor, opacity: 0.8, fontSize: 13, marginTop: 4 }}>{w.desc}</div>
        {/* Intensity bar */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: w.textColor, fontSize: 11, marginBottom: 4 }}><span>Emotional Intensity</span><span>{w.intensity}°</span></div>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 99, height: 8 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${w.intensity}%` }} transition={{ duration: 0.8 }}
              style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.7)' }} />
          </div>
        </div>
      </motion.div>

      {/* Selector pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {WEATHERS.map((ww, i) => (
          <motion.button key={ww.id} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => setActive(i)}
            style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '5px 13px', fontSize: 12, fontWeight: 600,
              background: active === i ? '#6366f1' : '#1e293b', color: active === i ? '#fff' : '#94a3b8', transition: 'all 0.2s' }}>
            {ww.emoji} {ww.id}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   2. PresenceSensorPanel
══════════════════════════════════════════════════════════ */
const HEAT_LABELS = ['12a','6a','12p','6p'];
const DAYS_ABBR = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
function genHeatmap() { return DAYS_ABBR.map(() => HEAT_LABELS.map(() => Math.random())); }

export function PresenceSensorPanel() {
  const [heatmap] = useState(genHeatmap);
  const loneliness = 74;
  const isAlert = loneliness > 70;

  return (
    <div style={{ background: '#0f172a', borderRadius: 20, padding: 24, border: '1px solid #1e293b', fontFamily: 'sans-serif', minHeight: 340 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Activity size={18} color="#14b8a6" />
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>PRESENCE INTELLIGENCE</span>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center' }}>
        {/* Radar */}
        <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
          {[1,2,3].map(r => (
            <div key={r} style={{ position: 'absolute', inset: `${r * 10}px`, borderRadius: '50%', border: `1.5px solid rgba(20,184,166,${0.5 / r})`,
              animation: `pulse-ring ${1.2 * r}s ease-out infinite` }} />
          ))}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#14b8a6', boxShadow: '0 0 12px #14b8a6' }} />
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%',
            background: 'conic-gradient(rgba(20,184,166,0.15) 0deg, transparent 90deg)', animation: 'spin-slow 3s linear infinite' }} />
        </div>
        {/* Stats */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>LAST SEEN</div>
          <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16 }}>4 min ago</div>
          <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 8 }}>LONELINESS SCORE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <motion.div style={{ fontSize: 22, fontWeight: 900, color: isAlert ? '#ef4444' : '#10b981',
              animation: isAlert ? 'loneliness-pulse 1.5s infinite' : 'none', borderRadius: 8, padding: '2px 6px' }}>
              {loneliness}
            </motion.div>
            <span style={{ fontSize: 11, color: '#64748b' }}>/100</span>
            {isAlert && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
              style={{ background: '#ef444422', color: '#ef4444', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>⚠ Alert</motion.span>}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>INTERACTION GAP HEATMAP</div>
      <div style={{ display: 'flex', gap: 3 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 16 }}>
          {DAYS_ABBR.map(d => <div key={d} style={{ fontSize: 9, color: '#475569', height: 14, lineHeight: '14px' }}>{d}</div>)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
            {HEAT_LABELS.map(l => <div key={l} style={{ flex: 1, fontSize: 9, color: '#475569', textAlign: 'center' }}>{l}</div>)}
          </div>
          {heatmap.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
              {row.map((v, ci) => {
                const col = v > 0.7 ? '#14b8a6' : v > 0.4 ? '#0d9488' : v > 0.2 ? '#134e4a' : '#0f2827';
                return <div key={ci} style={{ flex: 1, height: 14, borderRadius: 3, background: col, opacity: 0.7 + v * 0.3 }} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   3. HealingFrequencyPanel
══════════════════════════════════════════════════════════ */
const FREQS = [
  { hz: 432, label: 'Calm',      color: '#6366f1' },
  { hz: 528, label: 'Love',      color: '#ec4899' },
  { hz: 639, label: 'Harmony',   color: '#14b8a6' },
  { hz: 741, label: 'Clarity',   color: '#f59e0b' },
  { hz: 852, label: 'Intuition', color: '#8b5cf6' },
  { hz: 963, label: 'Unity',     color: '#10b981' },
];

export function HealingFrequencyPanel() {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const f = FREQS[selected];

  return (
    <div style={{ background: '#0f172a', borderRadius: 20, padding: 24, border: '1px solid #1e293b', fontFamily: 'sans-serif', minHeight: 340 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Music size={18} color="#8b5cf6" />
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>HEALING FREQUENCIES</span>
      </div>

      {/* Visualizer */}
      <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[1,2,3,4,5].map(r => (
          <div key={r} style={{ position: 'absolute', width: r * 28, height: r * 28, borderRadius: '50%',
            border: `${3 - r * 0.4}px solid ${f.color}`, opacity: playing ? 0.8 - r * 0.12 : 0.2,
            animation: playing ? `pulse-ring ${0.8 + r * 0.3}s ease-out infinite` : 'none',
            boxShadow: playing ? `0 0 ${r * 6}px ${f.color}44` : 'none', transition: 'all 0.4s' }} />
        ))}
        <motion.div animate={playing ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ width: 48, height: 48, borderRadius: '50%', background: `radial-gradient(circle, ${f.color}, #0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${f.color}66` }}>
          <span style={{ fontSize: 20 }}>🎵</span>
        </motion.div>
      </div>

      {/* Freq display */}
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: f.color, textShadow: `0 0 20px ${f.color}88` }}>{f.hz}<span style={{ fontSize: 14 }}>Hz</span></div>
        <div style={{ color: '#94a3b8', fontSize: 13 }}>{f.label} Frequency</div>
        {/* Waveform bars */}
        {playing && (
          <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 10, height: 32, alignItems: 'flex-end' }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ width: 4, borderRadius: 2, background: f.color, animation: `waveform ${0.4 + Math.random() * 0.4}s ease-in-out ${i * 0.04}s infinite`, minHeight: 4 }} />
            ))}
          </div>
        )}
      </div>

      {/* Play button */}
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} onClick={() => setPlaying(p => !p)}
          style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '8px 28px', fontWeight: 700, fontSize: 14,
            background: playing ? '#ef4444' : f.color, color: '#fff', boxShadow: `0 0 18px ${f.color}66` }}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </motion.button>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
        {FREQS.map((ff, i) => (
          <motion.button key={ff.hz} whileHover={{ scale: 1.1 }} onClick={() => setSelected(i)}
            style={{ border: `1.5px solid ${selected === i ? ff.color : '#1e293b'}`, cursor: 'pointer', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600,
              background: selected === i ? ff.color + '22' : 'transparent', color: selected === i ? ff.color : '#64748b', transition: 'all 0.2s' }}>
            {ff.hz}Hz
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   4. StarMapPanel
══════════════════════════════════════════════════════════ */
const MILESTONES = [
  { id: 1, label: 'First Walk',     x: 60,  y: 55,  unlocked: true,  date: 'Jan 2023' },
  { id: 2, label: 'First Vet Visit',x: 140, y: 80,  unlocked: true,  date: 'Feb 2023' },
  { id: 3, label: 'First Birthday', x: 220, y: 45,  unlocked: true,  date: 'Mar 2023' },
  { id: 4, label: 'Best Friend',    x: 180, y: 130, unlocked: true,  date: 'May 2023' },
  { id: 5, label: 'Park Explorer',  x: 100, y: 140, unlocked: true,  date: 'Jul 2023' },
  { id: 6, label: 'Trick Master',   x: 280, y: 100, unlocked: false, date: 'Soon...' },
  { id: 7, label: 'Beach Paw',      x: 250, y: 155, unlocked: false, date: 'Soon...' },
];
const LINES = [[0,1],[1,2],[2,3],[3,4],[0,4],[2,5],[5,6]];

export function StarMapPanel() {
  const [hovered, setHovered] = useState(null);
  const [shoot, setShoot] = useState(false);
  useEffect(() => { const t = setInterval(() => setShoot(s => !s), 4000); return () => clearInterval(t); }, []);

  return (
    <div style={{ background: 'linear-gradient(160deg,#020617,#0f172a,#1e1b4b)', borderRadius: 20, padding: 24, border: '1px solid #1e293b', fontFamily: 'sans-serif', minHeight: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Star size={18} color="#f59e0b" />
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>PET ACHIEVEMENT CONSTELLATION</span>
      </div>
      <div style={{ position: 'relative', width: '100%', height: 210, overflow: 'hidden' }}>
        {/* Background stars */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, borderRadius: '50%', background: '#fff',
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animation: `twinkle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite` }} />
        ))}
        {/* Shooting star */}
        {shoot && (
          <div style={{ position: 'absolute', top: 20, left: 10, width: 80, height: 2, background: 'linear-gradient(90deg,transparent,#fff)', borderRadius: 1,
            animation: 'shooting 1.2s ease-out forwards' }} />
        )}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 340 210">
          {LINES.map(([a, b], i) => {
            const A = MILESTONES[a]; const B = MILESTONES[b];
            return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(99,102,241,0.3)" strokeWidth={1} strokeDasharray="4 3" />;
          })}
          {MILESTONES.map((m, i) => (
            <g key={m.id} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
              {hovered === i && <circle cx={m.x} cy={m.y} r={14} fill="rgba(99,102,241,0.15)" />}
              <circle cx={m.x} cy={m.y} r={m.unlocked ? 7 : 4} fill={m.unlocked ? '#f59e0b' : '#334155'}
                style={{ filter: m.unlocked ? 'drop-shadow(0 0 6px #f59e0b)' : 'none', animation: m.unlocked ? `twinkle ${2 + i * 0.3}s ease-in-out infinite` : 'none' }} />
              {m.unlocked && <circle cx={m.x} cy={m.y} r={3} fill="#fff" />}
              {hovered === i && (
                <>
                  <rect x={m.x - 50} y={m.y - 38} width={100} height={30} rx={6} fill="rgba(15,23,42,0.95)" stroke="#6366f1" strokeWidth={1} />
                  <text x={m.x} y={m.y - 26} textAnchor="middle" fill="#f1f5f9" fontSize={9} fontWeight="bold">{m.label}</text>
                  <text x={m.x} y={m.y - 15} textAnchor="middle" fill="#94a3b8" fontSize={8}>{m.date}</text>
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: '#64748b' }}>
        <span>⭐ {MILESTONES.filter(m => m.unlocked).length} Unlocked</span>
        <span>🔒 {MILESTONES.filter(m => !m.unlocked).length} Pending</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   5. MicroHabitPanel
══════════════════════════════════════════════════════════ */
const HABITS = [
  { label: 'Eating Speed',       val: 72, color: '#6366f1', spark: [40,55,70,65,72,80,72] },
  { label: 'Sleep Quality',      val: 88, color: '#14b8a6', spark: [60,70,85,80,88,90,88] },
  { label: 'Tail Wag Freq',      val: 91, color: '#f59e0b', spark: [70,80,90,88,91,93,91] },
  { label: 'Hydration',          val: 63, color: '#3b82f6', spark: [50,55,63,60,63,68,63] },
  { label: 'Play Engagement',    val: 84, color: '#8b5cf6', spark: [65,72,84,80,84,87,84] },
  { label: 'Social Curiosity',   val: 77, color: '#ec4899', spark: [55,66,77,74,77,82,77] },
  { label: 'Grooming Tolerance', val: 55, color: '#10b981', spark: [30,40,55,50,55,58,55] },
  { label: 'Anxiety Resistance', val: 68, color: '#ef4444', spark: [45,52,68,62,68,72,68] },
];
const AI_TIPS = [
  { tip: 'Introduce puzzle feeders to slow eating speed by 30%.', icon: Brain },
  { tip: 'A 10-min evening walk boosts sleep quality significantly.', icon: Leaf },
  { tip: 'Increase outdoor socialization to reduce anxiety resistance drops.', icon: Globe },
];

function RadialBar({ val, color, size = 48 }) {
  const r = size / 2 - 5; const circ = 2 * Math.PI * r;
  const dash = (val / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={5} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${circ}`} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut' }} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      <text x={size/2} y={size/2+4} textAnchor="middle" fill="#f1f5f9" fontSize={10} fontWeight="bold">{val}</text>
    </svg>
  );
}

export function MicroHabitPanel() {
  return (
    <div style={{ background: '#0f172a', borderRadius: 20, padding: 24, border: '1px solid #1e293b', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Brain size={18} color="#8b5cf6" />
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>MICRO-HABIT INTELLIGENCE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 18 }}>
        {HABITS.map(h => (
          <div key={h.label} style={{ background: '#0f2027', borderRadius: 12, padding: '10px 6px', textAlign: 'center', border: '1px solid #1e293b' }}>
            <RadialBar val={h.val} color={h.color} size={52} />
            <div style={{ color: '#94a3b8', fontSize: 9, marginTop: 4, lineHeight: 1.3 }}>{h.label}</div>
            {/* Sparkline */}
            <div style={{ display: 'flex', gap: 1, justifyContent: 'center', marginTop: 5, alignItems: 'flex-end', height: 14 }}>
              {h.spark.map((v, i) => (
                <div key={i} style={{ width: 3, borderRadius: 1, background: h.color, opacity: 0.6 + (i / h.spark.length) * 0.4, height: `${(v / 100) * 14}px` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* AI Tips */}
      <div style={{ color: '#64748b', fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>AI SUGGESTIONS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {AI_TIPS.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.15 }}
              style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#1e293b', borderRadius: 10, padding: '8px 12px', border: '1px solid #334155' }}>
              <Icon size={14} color="#8b5cf6" />
              <span style={{ color: '#cbd5e1', fontSize: 12 }}>{t.tip}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   6. SafeZonesPanel
══════════════════════════════════════════════════════════ */
const ZONES = [
  { label: 'Home',    icon: '🏠', score: 98, status: 'safe',    rec: 'All sensors nominal. Excellent environment.' },
  { label: 'Garden',  icon: '🌿', score: 85, status: 'safe',    rec: 'Minor pollen levels elevated today.' },
  { label: 'Street',  icon: '🏙️', score: 42, status: 'caution', rec: 'High traffic noise. Leash recommended.' },
  { label: 'Park',    icon: '🌳', score: 78, status: 'safe',    rec: 'Other dogs present. Monitor interactions.' },
  { label: 'Car',     icon: '🚗', score: 31, status: 'unsafe',  rec: 'Heat risk. Never leave pet unattended.' },
  { label: 'Vet',     icon: '🏥', score: 65, status: 'caution', rec: 'Stress indicators likely. Prepare calming.' },
];
const STATUS_COLOR = { safe: '#10b981', caution: '#f59e0b', unsafe: '#ef4444' };

const HEX_CLIP = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)';

export function SafeZonesPanel() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ background: '#0f172a', borderRadius: 20, padding: 24, border: '1px solid #1e293b', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Shield size={18} color="#10b981" />
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>SAFE ZONES AI</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 16 }}>
        {ZONES.map((z, i) => {
          const c = STATUS_COLOR[z.status];
          return (
            <motion.div key={z.label} whileHover={{ scale: 1.06 }} onClick={() => setSelected(i === selected ? null : i)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 70, height: 78, clipPath: HEX_CLIP, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                background: selected === i ? `${c}33` : '#1e293b', border: 'none', position: 'relative',
                boxShadow: selected === i ? `0 0 18px ${c}66` : 'none', transition: 'all 0.3s' }}>
                {/* Shield pulse */}
                <div style={{ position: 'absolute', inset: 0, clipPath: HEX_CLIP, background: `${c}22`,
                  animation: z.status === 'unsafe' ? 'loneliness-pulse 1.5s infinite' : 'none' }} />
                <span style={{ fontSize: 22 }}>{z.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: c }}>{z.score}</span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 11, textAlign: 'center' }}>{z.label}</div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.div key={selected} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ background: '#1e293b', borderRadius: 12, padding: '12px 16px', border: `1px solid ${STATUS_COLOR[ZONES[selected].status]}44` }}>
            <div style={{ color: STATUS_COLOR[ZONES[selected].status], fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
              🤖 AI: {ZONES[selected].label}
            </div>
            <div style={{ color: '#cbd5e1', fontSize: 12 }}>{ZONES[selected].rec}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   7. FutureMemoryPanel
══════════════════════════════════════════════════════════ */
const MEMORY_POOL = [
  { title: "Bruno's 5th Birthday Party",       date: 'June 2027', prob: 94, grad: 'linear-gradient(135deg,#7c3aed,#4f46e5)', emoji: '🎂' },
  { title: 'First Snow Adventure',             date: 'Dec 2026',  prob: 81, grad: 'linear-gradient(135deg,#0284c7,#38bdf8)', emoji: '❄️' },
  { title: 'Beach Sunrise Walk',               date: 'Aug 2026',  prob: 88, grad: 'linear-gradient(135deg,#d97706,#fbbf24)', emoji: '🌅' },
  { title: 'Park Playdate with Max',           date: 'Sep 2026',  prob: 76, grad: 'linear-gradient(135deg,#059669,#34d399)', emoji: '🐾' },
  { title: 'Bruno wins Best Trick Contest',    date: 'Nov 2026',  prob: 62, grad: 'linear-gradient(135deg,#db2777,#f472b6)', emoji: '🏆' },
];
const EXTRA_MEMORIES = [
  { title: 'Mountain Hike Discovery',          date: 'Mar 2027',  prob: 71, grad: 'linear-gradient(135deg,#0f766e,#2dd4bf)', emoji: '⛰️' },
  { title: "Cuddle Movie Night",               date: 'Oct 2026',  prob: 95, grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)', emoji: '🎬' },
];

export function FutureMemoryPanel() {
  const [memories, setMemories] = useState(MEMORY_POOL);
  const [sparkles, setSparkles] = useState([]);

  const generate = () => {
    const next = [...memories.slice(1), EXTRA_MEMORIES[Math.floor(Math.random() * EXTRA_MEMORIES.length)]];
    setMemories(next);
    setSparkles(Array.from({ length: 8 }).map((_, i) => ({ id: Date.now() + i, tx: (Math.random() - 0.5) * 80, ty: -(20 + Math.random() * 40) })));
    setTimeout(() => setSparkles([]), 900);
  };

  return (
    <div style={{ background: '#0f172a', borderRadius: 20, padding: 24, border: '1px solid #1e293b', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Sparkles size={18} color="#f59e0b" />
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>FUTURE MEMORY ENGINE</span>
        <span style={{ marginLeft: 'auto', background: '#1e293b', borderRadius: 99, padding: '2px 10px', fontSize: 11, color: '#8b5cf6' }}>AI</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <AnimatePresence>
          {memories.map((m, i) => (
            <motion.div key={m.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.06 }}
              style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', padding: '12px 14px', background: m.grad, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{m.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{m.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{m.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{m.prob}%</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9 }}>probability</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Generate button + sparkles */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        {sparkles.map(s => (
          <div key={s.id} style={{ position: 'absolute', left: '50%', top: 0, fontSize: 14,
            animation: 'sparkle-fly 0.8s ease-out forwards', '--tx': `${s.tx}px`, '--ty': `${s.ty}px` }}>✨</div>
        ))}
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={generate}
          style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '10px 28px', fontWeight: 700, fontSize: 14,
            background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff', boxShadow: '0 0 20px #6366f155' }}>
          ✨ Generate New Memory
        </motion.button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   8. ComfortWavesPanel
══════════════════════════════════════════════════════════ */
export function ComfortWavesPanel() {
  const canvasRef = useRef(null);
  const [comfort, setComfort] = useState(72);
  const [history] = useState(() => Array.from({ length: 24 }, () => Math.floor(40 + Math.random() * 55)));
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);
      timeRef.current += 0.04;
      const t = timeRef.current;
      // Comfort wave (teal)
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        const y = H / 2 + Math.sin((x / W) * Math.PI * 4 + t) * 22 + Math.sin((x / W) * Math.PI * 2 + t * 0.7) * 10;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#14b8a6'; ctx.lineWidth = 3; ctx.shadowColor = '#14b8a6'; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0;
      // Stress wave (rose)
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        const y = H / 2 + Math.sin((x / W) * Math.PI * 6 - t * 1.3) * 14 + Math.cos((x / W) * Math.PI * 3 - t * 0.9) * 8;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setComfort(c => Math.max(20, Math.min(99, c + Math.floor((Math.random() - 0.45) * 8)))), 2000);
    return () => clearInterval(t);
  }, []);

  const comfortColor = comfort > 70 ? '#10b981' : comfort > 45 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ background: '#0f172a', borderRadius: 20, padding: 24, border: '1px solid #1e293b', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Waves size={18} color="#14b8a6" />
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>COMFORT WAVES</span>
        <motion.div key={comfort} initial={{ scale: 1.4 }} animate={{ scale: 1 }} style={{ marginLeft: 'auto', fontSize: 26, fontWeight: 900, color: comfortColor, textShadow: `0 0 16px ${comfortColor}` }}>{comfort}</motion.div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 6 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#14b8a6' }}><span style={{ width: 20, height: 3, background: '#14b8a6', borderRadius: 1, display: 'inline-block' }} />Comfort</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#ef4444' }}><span style={{ width: 20, height: 3, background: '#ef4444', borderRadius: 1, display: 'inline-block' }} />Stress</span>
      </div>
      <canvas ref={canvasRef} width={320} height={90} style={{ width: '100%', height: 90, borderRadius: 10, background: '#020617', display: 'block' }} />
      {/* 24h bar chart */}
      <div style={{ color: '#64748b', fontSize: 10, letterSpacing: 1, marginTop: 12, marginBottom: 6 }}>24-HOUR COMFORT HISTORY</div>
      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 40 }}>
        {history.map((v, i) => {
          const c = v > 70 ? '#10b981' : v > 45 ? '#f59e0b' : '#ef4444';
          return (
            <div key={i} style={{ flex: 1, height: `${(v / 100) * 40}px`, background: c, borderRadius: '2px 2px 0 0', opacity: 0.7 + (i / 24) * 0.3,
              animation: `bar-grow 0.6s ease-out ${i * 0.02}s both`, transformOrigin: 'bottom' }} />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 9, marginTop: 2 }}>
        <span>12h ago</span><span>Now</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   9. AdventureEnginePanel
══════════════════════════════════════════════════════════ */
const ADVENTURES = [
  { title: 'Forest Exploration', icon: '🌲', grad: 'linear-gradient(135deg,#065f46,#10b981)', diff: 'Medium', dist: '3.2km', xp: 450 },
  { title: 'Beach Day',          icon: '🏖️', grad: 'linear-gradient(135deg,#0369a1,#38bdf8)', diff: 'Easy',   dist: '1.8km', xp: 280 },
  { title: 'Mountain Trail',     icon: '⛰️', grad: 'linear-gradient(135deg,#1e3a5f,#6366f1)', diff: 'Hard',   dist: '6.1km', xp: 820 },
  { title: 'Urban Discovery',    icon: '🏙️', grad: 'linear-gradient(135deg,#1f2937,#6b7280)', diff: 'Easy',   dist: '2.4km', xp: 310 },
  { title: 'Backyard Quest',     icon: '🌻', grad: 'linear-gradient(135deg,#713f12,#d97706)', diff: 'Easy',   dist: '0.5km', xp: 120 },
  { title: 'Rainy Indoor Day',   icon: '🎮', grad: 'linear-gradient(135deg,#4c1d95,#7c3aed)', diff: 'Easy',   dist: '0km',   xp: 90  },
];
const DIFF_COLOR = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

export function AdventureEnginePanel() {
  const [active, setActive] = useState(null);

  return (
    <div style={{ background: '#0f172a', borderRadius: 20, padding: 24, border: '1px solid #1e293b', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Rocket size={18} color="#f59e0b" />
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>ADVENTURE ENGINE</span>
        {active !== null && (
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            style={{ marginLeft: 'auto', background: '#10b98122', color: '#10b981', borderRadius: 99, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>
            🟢 Active: {ADVENTURES[active].title}
          </motion.span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        {ADVENTURES.map((a, i) => (
          <motion.div key={a.title} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
            style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', border: active === i ? '2px solid #10b981' : '2px solid transparent',
              boxShadow: active === i ? '0 0 18px #10b98144' : 'none', transition: 'box-shadow 0.3s' }}>
            <div style={{ background: a.grad, padding: '14px 14px 10px' }}>
              <div style={{ fontSize: 28 }}>{a.icon}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{a.title}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: DIFF_COLOR[a.diff], background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: '1px 6px' }}>{a.diff}</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10 }}>📍 {a.dist}</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10 }}>⚡ {a.xp}XP</span>
              </div>
            </div>
            <div style={{ background: '#0f172a', padding: '8px 14px' }}>
              <motion.button whileHover={{ background: '#10b981' }} onClick={() => setActive(active === i ? null : i)}
                style={{ width: '100%', border: 'none', cursor: 'pointer', borderRadius: 8, padding: '6px', fontSize: 11, fontWeight: 700,
                  background: active === i ? '#ef4444' : '#1e293b', color: '#fff', transition: 'background 0.2s' }}>
                {active === i ? '⏹ End Adventure' : '▶ Start Adventure'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   10. EmotionCrystalPanel
══════════════════════════════════════════════════════════ */
const EMOTIONS = [
  { label: 'Joy',     color: '#f59e0b', glow: '#fbbf24', energy: 95, emoji: '😄' },
  { label: 'Calm',    color: '#14b8a6', glow: '#2dd4bf', energy: 72, emoji: '😌' },
  { label: 'Love',    color: '#ec4899', glow: '#f472b6', energy: 88, emoji: '🥰' },
  { label: 'Sad',     color: '#3b82f6', glow: '#60a5fa', energy: 32, emoji: '😢' },
  { label: 'Excited', color: '#8b5cf6', glow: '#a78bfa', energy: 91, emoji: '🤩' },
  { label: 'Anxious', color: '#ef4444', glow: '#f87171', energy: 55, emoji: '😰' },
];

export function EmotionCrystalPanel() {
  const [emotion, setEmotion] = useState(0);
  const e = EMOTIONS[emotion];

  // Crystal SVG polygon
  const crystalPoints = '80,8 148,40 148,100 80,132 12,100 12,40';
  const facets = [
    { points: '80,8 148,40 80,70',  opacity: 0.9 },
    { points: '80,8 12,40 80,70',   opacity: 0.6 },
    { points: '80,70 148,40 148,100', opacity: 0.75 },
    { points: '80,70 12,40 12,100', opacity: 0.45 },
    { points: '80,70 148,100 80,132', opacity: 0.85 },
    { points: '80,70 12,100 80,132', opacity: 0.55 },
  ];

  return (
    <div style={{ background: '#0f172a', borderRadius: 20, padding: 24, border: '1px solid #1e293b', fontFamily: 'sans-serif', minHeight: 340 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Star size={18} color={e.color} />
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>EMOTION CRYSTAL</span>
        <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: 20 }}>{e.emoji}</span>
      </div>

      {/* Crystal SVG */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <motion.svg key={emotion} width={160} height={140} viewBox="0 0 160 140"
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
          style={{ animation: 'crystal-glow 2.5s ease-in-out infinite', '--c-glow': e.glow }}>
          <defs>
            <filter id="cf-blur"><feGaussianBlur stdDeviation="3" /></filter>
            <radialGradient id="cg" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={e.glow} stopOpacity="0.8" />
              <stop offset="100%" stopColor={e.color} stopOpacity="0.3" />
            </radialGradient>
          </defs>
          {/* Glow base */}
          <polygon points={crystalPoints} fill={e.color} opacity={0.15} filter="url(#cf-blur)" transform="scale(1.08) translate(-6,-6)" />
          {/* Facets */}
          {facets.map((f, i) => (
            <motion.polygon key={i} points={f.points} fill={e.color} opacity={f.opacity * 0.7}
              animate={{ opacity: [f.opacity * 0.7, f.opacity, f.opacity * 0.7] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }} />
          ))}
          {/* Outline */}
          <polygon points={crystalPoints} fill="none" stroke={e.glow} strokeWidth={2} />
          {/* Center shine */}
          <ellipse cx={80} cy={65} rx={16} ry={22} fill="url(#cg)" opacity={0.6} />
          <ellipse cx={72} cy={52} rx={5} ry={8} fill="#fff" opacity={0.25} transform="rotate(-20 72 52)" />
        </motion.svg>
      </div>

      {/* Emotion label */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <motion.div key={e.label} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{ fontSize: 22, fontWeight: 900, color: e.color, textShadow: `0 0 18px ${e.glow}` }}>{e.label}</motion.div>
      </div>

      {/* Energy bars */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 5 }}>
          <span>Emotional Energy</span><span style={{ color: e.color, fontWeight: 700 }}>{e.energy}%</span>
        </div>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 28 }}>
          {Array.from({ length: 20 }).map((_, i) => {
            const filled = i < Math.round(e.energy / 5);
            return (
              <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.03, duration: 0.4 }}
                style={{ flex: 1, borderRadius: 2, background: filled ? e.color : '#1e293b', height: `${50 + (i % 3) * 20}%`,
                  boxShadow: filled ? `0 0 4px ${e.color}88` : 'none', transformOrigin: 'bottom', transition: 'background 0.4s' }} />
            );
          })}
        </div>
      </div>

      {/* Emotion buttons */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        {EMOTIONS.map((em, i) => (
          <motion.button key={em.label} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} onClick={() => setEmotion(i)}
            style={{ border: `2px solid ${emotion === i ? em.color : 'transparent'}`, cursor: 'pointer', borderRadius: 10, padding: '6px 10px', fontSize: 13,
              background: emotion === i ? `${em.color}22` : '#1e293b', boxShadow: emotion === i ? `0 0 10px ${em.color}44` : 'none', transition: 'all 0.2s' }}>
            {em.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
