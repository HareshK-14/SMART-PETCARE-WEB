import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#f97316,#ef4444,#a855f7)';

const STRESS_SIGNALS = [
  { label:'Pacing frequency',       score:72, source:'Motion Sensor',    severity:'high',   icon:'🚶', weight: 25 },
  { label:'Vocalization changes',   score:45, source:'Audio Analysis',   severity:'medium', icon:'🔊', weight: 20 },
  { label:'Appetite deviation',     score:30, source:'Diet Tracker',     severity:'low',    icon:'🍗', weight: 15 },
  { label:'Sleep disruption',       score:60, source:'SmartCollar™',     severity:'medium', icon:'🌙', weight: 20 },
  { label:'Heart rate variability', score:55, source:'Bio Sensor',       severity:'medium', icon:'❤️', weight: 20 },
];

const SEV = { high:'border-rose-300 bg-rose-50 text-rose-700', medium:'border-amber-200 bg-amber-50 text-amber-700', low:'border-emerald-200 bg-emerald-50 text-emerald-700' };
const SEV_BADGE = { high:'bg-rose-500 text-white', medium:'bg-amber-400 text-white', low:'bg-emerald-500 text-white' };

export default function StressDetectorTab() {
  const [analyzed, setAnalyzed]   = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';

  const overallStress = Math.round(
    STRESS_SIGNALS.reduce((s, sig) => s + sig.score * (sig.weight / 100), 0)
  );
  const stressLevel = overallStress > 65 ? 'High' : overallStress > 40 ? 'Moderate' : 'Low';
  const stressColor = overallStress > 65 ? '#ef4444' : overallStress > 40 ? '#f59e0b' : '#10b981';

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false); setAnalyzed(true);
      logGlobalActivity('Owner', `Stress analysis: ${petName} — ${stressLevel} stress (${overallStress}%)`, '😰', 'ai');
      if (overallStress > 65) {
        const ems = JSON.parse(localStorage.getItem('platformEmergencies') || '[]');
        localStorage.setItem('platformEmergencies', JSON.stringify([
          { id: `STR-${Date.now()}`, pet: petName, loc: 'Home', type: 'High Stress Detected', severity: 'medium', time: 'Just now', status: 'monitoring' },
          ...ems
        ]));
        window.dispatchEvent(new Event('storage'));
      }
    }, 2000);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[130px]">😰</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">😰 Emotional Care</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Stress Detector</h2>
        <p className="text-orange-100 text-sm mt-1">Detects {petName}'s stress levels using movement patterns, biometrics, and behavioral AI signals.</p>
      </div>

      {/* Stress meter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-extrabold text-slate-800">📊 Stress Level Meter</p>
          <button onClick={analyze} disabled={analyzing}
            className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-bold rounded-xl disabled:opacity-60"
            style={{ background: GRAD }}>
            {analyzing ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Analyzing...</> : '🔍 Analyze Now'}
          </button>
        </div>

        <div className="relative mb-2">
          <div className="w-full h-10 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 rounded-full overflow-hidden opacity-20 absolute inset-0" />
          <div className="w-full h-10 bg-slate-100 rounded-full overflow-hidden">
            <motion.div className="h-10 rounded-full flex items-center justify-end pr-4"
              style={{ background: stressColor }}
              initial={{ width: 0 }} animate={{ width: analyzed ? `${overallStress}%` : '0%' }} transition={{ duration: 1.2 }}>
              {analyzed && <span className="text-white text-sm font-extrabold">{overallStress}%</span>}
            </motion.div>
          </div>
        </div>
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-4">
          <span className="text-emerald-600">Relaxed</span><span className="text-amber-600">Moderate</span><span className="text-rose-600">High Stress</span>
        </div>

        {analyzed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl border text-center" style={{ background: stressColor + '12', borderColor: stressColor + '33' }}>
            <p className="text-xl font-extrabold" style={{ color: stressColor }}>
              {stressLevel === 'High' ? '🚨' : stressLevel === 'Moderate' ? '⚠️' : '✅'} {stressLevel} Stress
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {stressLevel === 'High' ? 'Immediate comfort and veterinary check recommended.' : stressLevel === 'Moderate' ? 'Monitor closely. Try calming routines.' : 'Pet is calm and comfortable!'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Signals */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🔬 Stress Signal Analysis</p>
        <div className="space-y-3">
          {STRESS_SIGNALS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className={`rounded-xl border p-3 ${SEV[s.severity]}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm">{s.label}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SEV_BADGE[s.severity]}`}>{s.severity}</span>
                  </div>
                  <p className="text-xs opacity-70">Source: {s.source}</p>
                  <div className="mt-1.5 w-full bg-white/60 rounded-full h-1.5">
                    <motion.div className="h-1.5 rounded-full" style={{ background: s.severity === 'high' ? '#ef4444' : s.severity === 'medium' ? '#f59e0b' : '#10b981' }}
                      initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ delay: i * 0.07 + 0.3 }} />
                  </div>
                </div>
                <span className="text-sm font-extrabold">{s.score}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
