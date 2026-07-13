import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#a855f7,#ec4899,#f97316)';

const AURA_LEVELS = [
  { label:'Radiant', min:85, color:'#a855f7', emoji:'✨', desc:'Your pet radiates exceptional wellness and emotional harmony.' },
  { label:'Vibrant',  min:70, color:'#6366f1', emoji:'💜', desc:'Strong positive energy. Pet is happy and well-balanced.' },
  { label:'Balanced', min:55, color:'#14b8a6', emoji:'🌿', desc:'Stable aura. Pet is comfortable and content.' },
  { label:'Dim',      min:40, color:'#f59e0b', emoji:'🌤', desc:'Some stress or fatigue detected. Extra care recommended.' },
  { label:'Disrupted',min:0,  color:'#ef4444', emoji:'🌪', desc:'Significant emotional disruption. Veterinary check advised.' },
];

const DIMENSIONS = [
  { label:'Emotional Harmony',  score:88, icon:'💜', color:'#a855f7' },
  { label:'Physical Vitality',  score:74, icon:'⚡', color:'#6366f1' },
  { label:'Mental Clarity',     score:91, icon:'🧠', color:'#14b8a6' },
  { label:'Social Energy',      score:65, icon:'🤝', color:'#10b981' },
  { label:'Rest Quality',       score:79, icon:'🌙', color:'#8b5cf6' },
  { label:'Nutritional Balance',score:83, icon:'🍗', color:'#f59e0b' },
];

export default function AuraScannerTab() {
  const [scanning, setScanning]   = useState(false);
  const [scanned, setScanned]     = useState(false);
  const [progress, setProgress]   = useState(0);
  const [auraScore, setAuraScore] = useState(0);

  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';
  const overall = Math.round(DIMENSIONS.reduce((s, d) => s + d.score, 0) / DIMENSIONS.length);
  const level   = AURA_LEVELS.find(l => overall >= l.min);

  const startScan = () => {
    setScanning(true); setProgress(0); setAuraScore(0);
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(t);
          setScanning(false);
          setScanned(true);
          setAuraScore(overall);
          logGlobalActivity('Owner', `Aura scan completed for ${petName}: ${overall}%`, '✨', 'ai');
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[130px]">✨</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">✨ Aura Intelligence</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Aura Scanner</h2>
        <p className="text-purple-100 text-sm mt-1">Analyze {petName}'s emotional energy, wellness aura, and holistic life force using advanced AI pattern recognition.</p>
        <div className="flex gap-6 mt-4">
          {[['Aura Level', level?.label || '—'], ['Score', scanned ? overall + '%' : '—'], ['Dimensions', DIMENSIONS.length], ['Last Scan', scanned ? 'Just now' : 'Never']].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-purple-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Scan portal */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          {/* Outer rings */}
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: level?.color || '#a855f7', opacity: 0.2 + i * 0.15, margin: i * 16 }}
              animate={scanning ? { scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] } : {}}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }} />
          ))}
          {/* Core */}
          <motion.div className="absolute inset-8 rounded-full flex flex-col items-center justify-center"
            style={{ background: `radial-gradient(circle, ${level?.color || '#a855f7'}33, transparent)`, border: `3px solid ${level?.color || '#a855f7'}` }}
            animate={scanning ? { scale: [1, 1.05, 1] } : {}} transition={{ repeat: Infinity, duration: 0.8 }}>
            <span className="text-4xl">{level?.emoji || '✨'}</span>
            {scanned && <p className="text-lg font-black mt-1" style={{ color: level?.color }}>{auraScore}%</p>}
          </motion.div>

          {/* Scan progress arc */}
          {scanning && (
            <svg className="absolute inset-0 w-48 h-48 -rotate-90">
              <circle cx="96" cy="96" r="88" fill="none" stroke="#f1f5f9" strokeWidth="4" />
              <motion.circle cx="96" cy="96" r="88" fill="none" stroke={level?.color || '#a855f7'} strokeWidth="4"
                strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 88}`}
                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) }}
                transition={{ duration: 0.1 }} />
            </svg>
          )}
        </div>

        {scanned && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 px-6 py-3 rounded-2xl border" style={{ background: level?.color + '12', borderColor: level?.color + '33' }}>
            <p className="text-xl font-extrabold" style={{ color: level?.color }}>{level?.emoji} {level?.label} Aura</p>
            <p className="text-sm text-slate-500 mt-1">{level?.desc}</p>
          </motion.div>
        )}

        {scanning && <p className="text-sm font-bold text-slate-500 mb-3 animate-pulse">🔬 Scanning {petName}'s aura... {progress}%</p>}

        <button onClick={startScan} disabled={scanning}
          className="px-8 py-3 text-white font-extrabold rounded-2xl shadow-lg disabled:opacity-60 transition hover:-translate-y-0.5"
          style={{ background: GRAD }}>
          {scanning ? '🔬 Scanning...' : scanned ? '🔄 Re-Scan Aura' : '✨ Start Aura Scan'}
        </button>
      </div>

      {/* Dimensions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🌈 Aura Dimension Analysis</p>
        <div className="space-y-3">
          {DIMENSIONS.map((d, i) => (
            <motion.div key={d.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3">
              <span className="text-xl w-7 flex-shrink-0">{d.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-slate-700">{d.label}</span>
                  <span className="text-sm font-extrabold" style={{ color: d.color }}>{d.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <motion.div className="h-2 rounded-full" style={{ background: d.color }}
                    initial={{ width: 0 }} animate={{ width: `${d.score}%` }} transition={{ delay: i * 0.07 + 0.3, duration: 0.8 }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
