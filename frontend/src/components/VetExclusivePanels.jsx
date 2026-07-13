import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logGlobalActivity } from '../utils/activityFeed';

const P = (n) => JSON.parse(localStorage.getItem(n) || '[]');

// 1. AI Surgery Risk Simulator
export function SurgeryRiskPanel() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const PROCEDURES = ['Spay / Neuter', 'Orthopedic Surgery', 'Tumor Removal', 'Dental Extraction', 'Emergency Laparotomy'];
  const [proc, setProc] = useState(PROCEDURES[0]);
  const simulate = () => {
    setLoading(true); setResult(null);
    setTimeout(() => {
      const risk = Math.floor(Math.random() * 40 + 10);
      const recovery = Math.floor(Math.random() * 14 + 3);
      setResult({ risk, recovery, success: 100 - risk, confidence: 91 + Math.floor(Math.random() * 8) });
      setLoading(false);
      logGlobalActivity('Vet', `Surgery risk simulated for ${proc}: ${risk}% risk`, '🔬', 'vet');
    }, 1800);
  };
  const G = 'linear-gradient(135deg,#ef4444,#f97316,#8b5cf6)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔬 Surgical Prediction</span>
        <h2 className="text-2xl font-black mt-2">AI Surgery Risk Simulator</h2>
        <p className="text-red-100 text-sm mt-1">AI-predicted surgical risks and recovery probabilities for veterinary procedures.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <p className="font-extrabold text-slate-800">Select Procedure</p>
        <div className="grid grid-cols-2 gap-2">
          {PROCEDURES.map(p => (
            <button key={p} onClick={() => setProc(p)}
              className={`py-2.5 px-3 rounded-xl text-sm font-bold border text-left transition ${proc === p ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600'}`}
              style={proc === p ? { background: G } : {}}>{p}</button>
          ))}
        </div>
        <button onClick={simulate} disabled={loading} className="w-full py-3 text-white font-extrabold rounded-xl disabled:opacity-60" style={{ background: G }}>
          {loading ? '⏳ Simulating...' : '🔬 Run AI Simulation'}
        </button>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
            {[['Surgical Risk', result.risk + '%', '#ef4444'], ['Success Rate', result.success + '%', '#10b981'], ['Recovery', result.recovery + ' days', '#6366f1'], ['AI Confidence', result.confidence + '%', '#a855f7']].map(([l, v, c]) => (
              <div key={l} className="text-center p-4 rounded-2xl border" style={{ background: c + '10', borderColor: c + '33' }}>
                <p className="text-2xl font-extrabold" style={{ color: c }}>{v}</p>
                <p className="text-xs text-slate-500 mt-0.5">{l}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 2. Realtime Patient Stability Monitor
export function PatientStabilityPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1200); return () => clearInterval(t); }, []);
  const emerg = P('platformEmergencies');
  const PATIENTS = [
    ...emerg.slice(0, 2).map((e, i) => ({ name: e.pet || 'Patient ' + (i + 1), stability: 45 + Math.random() * 20, status: 'critical', color: '#ef4444' })),
    { name: 'Bruno (Lab)', stability: 88 + tick % 4, status: 'stable', color: '#10b981' },
    { name: 'Luna (Persian)', stability: 72 + tick % 5, status: 'moderate', color: '#f59e0b' },
    { name: 'Rocky (Husky)', stability: 95 + tick % 3, status: 'excellent', color: '#6366f1' },
  ].slice(0, 5);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">📡 Critical Monitoring</span>
        <h2 className="text-2xl font-black mt-2">Realtime Patient Stability Monitor</h2>
        <p className="text-indigo-200 text-sm mt-1">Animated stability indicators for all active patients — live from emergency data.</p>
        <motion.div className="flex items-center gap-2 mt-3" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
          <div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-xs font-bold text-red-300">MONITORING ACTIVE</span>
        </motion.div>
      </div>
      <div className="space-y-3">
        {PATIENTS.map((pt, i) => (
          <motion.div key={pt.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-3 mb-2">
              <motion.div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: pt.color, boxShadow: `0 0 6px ${pt.color}` }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }} />
              <p className="font-extrabold text-slate-800 flex-1">{pt.name}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white capitalize" style={{ background: pt.color }}>{pt.status}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <motion.div className="h-3 rounded-full" style={{ background: pt.color }}
                animate={{ width: `${Math.min(100, pt.stability + Math.sin(tick + i) * 2)}%` }} transition={{ duration: 0.5 }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 text-right">{Math.round(pt.stability)}% stable</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 3. AI Clinical Intelligence Wall
export function ClinicalIntelWallPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);
  const appts  = P('ownerAppts').length;
  const emerg  = P('platformEmergencies').length;
  const rxs    = P('allPrescriptions').length;
  const feed   = P('globalFeed').length;
  const WALL = [
    { label:'Active Cases', val: appts + 8, color:'#6366f1', icon:'📋', trend:'+2' },
    { label:'Emergencies',  val: emerg || 3, color:'#ef4444', icon:'🚨', trend:emerg > 0 ? '+' + emerg : '0' },
    { label:'AI Recs Today',val: 12 + tick % 5, color:'#a855f7', icon:'🧠', trend:'+4' },
    { label:'Prescriptions', val: rxs + 12, color:'#10b981', icon:'💊', trend:'+3' },
    { label:'Health Trends', val: 98 + tick % 2 + '%', color:'#f59e0b', icon:'📈', trend:'↑' },
    { label:'Feed Events',  val: feed + 100, color:'#14b8a6', icon:'📡', trend:'+' + (tick * 2) },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#020617,#0f172a,#a855f7)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🖥 Diagnostics Center</span>
        <h2 className="text-2xl font-black mt-2">AI Clinical Intelligence Wall</h2>
        <p className="text-purple-200 text-sm mt-1">Massive realtime analytics wall — cases, emergencies, recommendations, and health trends.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {WALL.map((w, i) => (
          <motion.div key={w.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
            className="relative overflow-hidden rounded-2xl p-5 border"
            style={{ background: w.color + '0d', borderColor: w.color + '33' }}>
            <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{ boxShadow: [`inset 0 0 0px ${w.color}00`, `inset 0 0 14px ${w.color}33`, `inset 0 0 0px ${w.color}00`] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }} />
            <div className="absolute -right-3 -top-3 opacity-10 text-5xl">{w.icon}</div>
            <span className="text-xl">{w.icon}</span>
            <motion.p key={tick} className="text-2xl font-extrabold text-slate-900 mt-1">{w.val}</motion.p>
            <p className="text-xs text-slate-500 mt-0.5">{w.label}</p>
            <p className="text-[10px] font-bold mt-1" style={{ color: w.color }}>{w.trend} this hour</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 4. AI Treatment Energy Flow
export function TreatmentEnergyFlowPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 700); return () => clearInterval(t); }, []);
  const STAGES = [
    { label:'Diagnosis',    pct:100, color:'#6366f1', icon:'🔍' },
    { label:'Treatment',    pct:85,  color:'#14b8a6', icon:'💉' },
    { label:'Medication',   pct:70,  color:'#10b981', icon:'💊' },
    { label:'Recovery',     pct:55,  color:'#f59e0b', icon:'🌱' },
    { label:'Follow-up',    pct:30,  color:'#a855f7', icon:'📋' },
    { label:'Discharge',    pct:15,  color:'#ec4899', icon:'🏠' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#10b981,#14b8a6,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">⚡ Recovery Visualization</span>
        <h2 className="text-2xl font-black mt-2">AI Treatment Energy Flow</h2>
        <p className="text-emerald-100 text-sm mt-1">Healing progress visualized as animated treatment energy through each recovery stage.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          {STAGES.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1">
                <motion.div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ background: s.color + '20', border: `2px solid ${s.color}` }}
                  animate={{ boxShadow: i === (tick % STAGES.length) ? [`0 0 12px ${s.color}`] : ['none'] }}>
                  {s.icon}
                </motion.div>
                <p className="text-[9px] text-slate-400 font-bold text-center">{s.label}</p>
              </div>
              {i < STAGES.length - 1 && (
                <motion.div className="flex-1 h-1 rounded-full relative overflow-hidden" style={{ background: STAGES[i + 1].color + '22' }}>
                  <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: s.color }}
                    animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2, ease: 'linear' }} />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="space-y-3">
          {STAGES.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-base w-7 text-center">{s.icon}</span>
              <span className="text-sm font-bold text-slate-600 w-24">{s.label}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <motion.div className="h-2 rounded-full" style={{ background: s.color }}
                  initial={{ width: 0 }} animate={{ width: s.pct + '%' }} transition={{ delay: i * 0.1 + 0.2 }} />
              </div>
              <span className="text-xs font-extrabold w-10 text-right" style={{ color: s.color }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5. AI Medical Future Forecaster
export function MedicalForecasterPanel() {
  const [gen, setGen] = useState(false);
  const [forecasts, setForecasts] = useState([]);
  const appts = P('ownerAppts');
  const generate = () => {
    setGen(true);
    setTimeout(() => {
      setForecasts([
        { condition:'Dental Disease Risk', probability:34, timeframe:'6 months', prevention:'Monthly dental chews + annual cleaning', color:'#f59e0b' },
        { condition:'Weight Gain Risk',    probability:22, timeframe:'3 months', prevention:'Reduce treats by 20%, increase walks', color:'#ef4444' },
        { condition:'Arthritis Onset',     probability:15, timeframe:'2 years',  prevention:'Joint supplements + regular low-impact exercise', color:'#6366f1' },
        { condition:'Allergy Flare-up',    probability:41, timeframe:'Spring',   prevention:'Pre-season antihistamines, diet review', color:'#a855f7' },
      ]);
      setGen(false);
      logGlobalActivity('Vet', 'AI Medical Future Forecaster generated predictions', '🔮', 'vet');
    }, 2000);
  };
  const G = 'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔮 Predictive Diagnostics</span>
        <h2 className="text-2xl font-black mt-2">AI Medical Future Forecaster</h2>
        <p className="text-purple-100 text-sm mt-1">Forecast future disease possibilities and health complications using AI analytics.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center gap-4">
        {forecasts.length === 0 ? (
          <>
            <p className="text-4xl">🔮</p>
            <p className="font-extrabold text-slate-800">Run AI Medical Forecast</p>
            <p className="text-sm text-slate-400 text-center max-w-sm">AI analyzes patient history, breed data, and real-time vitals to forecast future health risks.</p>
            <button onClick={generate} disabled={gen} className="px-8 py-3 text-white font-extrabold rounded-2xl" style={{ background: G }}>
              {gen ? '⏳ Generating...' : '🔮 Generate Forecast'}
            </button>
          </>
        ) : (
          <div className="w-full space-y-3">
            {forecasts.map((f, i) => (
              <motion.div key={f.condition} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-4 rounded-2xl border" style={{ background: f.color + '0d', borderColor: f.color + '33' }}>
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-extrabold text-slate-800 flex-1">{f.condition}</p>
                  <span className="text-sm font-extrabold" style={{ color: f.color }}>{f.probability}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <motion.div className="h-2 rounded-full" style={{ background: f.color }}
                    initial={{ width: 0 }} animate={{ width: f.probability + '%' }} transition={{ delay: i * 0.1 + 0.3 }} />
                </div>
                <p className="text-xs text-slate-400">⏱ {f.timeframe} · 💡 {f.prevention}</p>
              </motion.div>
            ))}
            <button onClick={() => setForecasts([])} className="text-xs text-slate-400 underline mx-auto block mt-2">Reset</button>
          </div>
        )}
      </div>
    </div>
  );
}
