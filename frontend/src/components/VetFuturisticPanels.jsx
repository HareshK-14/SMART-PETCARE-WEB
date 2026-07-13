import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logGlobalActivity } from '../utils/activityFeed';

// ── 1. Holographic Health Alert System (Vet) ──────────────────────────────────
export function HoloHealthAlertPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2500); return () => clearInterval(t); }, []);
  const emergencies = JSON.parse(localStorage.getItem('platformEmergencies') || '[]');
  const ALERTS = [
    ...emergencies.slice(0, 3).map(e => ({ id: e.id, patient: e.pet, type: e.type, severity: e.severity || 'high', time: e.time, vital: '—' })),
    { id: 'A001', patient: 'Rocky (Husky)', type: 'Critical Hypoxia', severity: 'critical', time: '2m ago', vital: 'O₂: 88%' },
    { id: 'A002', patient: 'Luna (Persian)', type: 'Fever Spike', severity: 'high', time: '8m ago', vital: 'Temp: 40.1°C' },
  ].slice(0, 5);
  const SEV = { critical: '#7c3aed', high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
  const G = 'linear-gradient(135deg,#1e1b4b,#312e81,#ef4444)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: G }}>
        <div className="absolute inset-0 opacity-10" style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(239,68,68,0.3) 20px,rgba(239,68,68,0.3) 21px)' }} />
        <span className="relative bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🚨 Emergency Intelligence</span>
        <h2 className="relative text-2xl font-black mt-2">Holographic Health Alert System</h2>
        <p className="relative text-red-200 text-sm mt-1">Animated holographic emergency alerts and critical patient warnings — live from ecosystem.</p>
        <div className="relative flex gap-6 mt-4">
          {[['Active Alerts', ALERTS.length],['Critical', ALERTS.filter(a=>a.severity==='critical').length],['Platform Wide', emergencies.length]].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-red-300">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
        {ALERTS.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="relative rounded-2xl border p-4 overflow-hidden"
            style={{ borderColor: SEV[a.severity] + '44', background: SEV[a.severity] + '11' }}>
            <motion.div className="absolute inset-0 opacity-10 rounded-2xl"
              animate={{ opacity: [0.1, 0.2, 0.1] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              style={{ background: `radial-gradient(circle at ${tick % 2 ? '30%' : '70%'} 50%, ${SEV[a.severity]}, transparent)` }} />
            <div className="relative flex items-center gap-3">
              <motion.div className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: SEV[a.severity], boxShadow: `0 0 8px ${SEV[a.severity]}` }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
              <div className="flex-1">
                <p className="font-extrabold text-white text-sm">{a.patient}</p>
                <p className="text-xs text-slate-400">{a.type} · {a.vital}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize text-white" style={{ background: SEV[a.severity] }}>{a.severity}</span>
                <p className="text-xs text-slate-500 mt-0.5">{a.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
        {ALERTS.length === 0 && <p className="text-slate-500 text-sm text-center py-8">✅ No active alerts — all systems nominal</p>}
      </div>
    </div>
  );
}

// ── 2. Futuristic AI Command Hub (Vet) ────────────────────────────────────────
export function VetCommandHubPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1500); return () => clearInterval(t); }, []);
  const appts    = JSON.parse(localStorage.getItem('ownerAppts') || '[]');
  const emergencies = JSON.parse(localStorage.getItem('platformEmergencies') || '[]');
  const reviews  = JSON.parse(localStorage.getItem('vetReviews') || '[]');
  const rxs      = JSON.parse(localStorage.getItem('allPrescriptions') || '[]');
  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayAppts = appts.filter(a => a.date === todayStr).length;
  const STATS = [
    { label: "Today's Patients", value: todayAppts || 12, icon: '👥', color: '#6366f1' },
    { label: 'Active Emergencies', value: emergencies.filter(e => e.status !== 'resolved').length || 2, icon: '🚨', color: '#ef4444' },
    { label: 'Prescriptions Issued', value: rxs.length || 34, icon: '💊', color: '#10b981' },
    { label: 'Patient Reviews', value: reviews.length || 18, icon: '⭐', color: '#f59e0b' },
    { label: 'AI Diagnoses Run', value: 7 + tick % 3, icon: '🧠', color: '#a855f7' },
    { label: 'Consultations Today', value: 5 + tick % 2, icon: '💻', color: '#14b8a6' },
  ];
  const G = 'linear-gradient(135deg,#0f172a,#1e1b4b,#14b8a6)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: G }}>
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(99,102,241,0.05) 40px,rgba(99,102,241,0.05) 41px)' }} />
        <span className="relative bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🎛 Master Dashboard</span>
        <h2 className="relative text-2xl font-black mt-2">Futuristic AI Command Hub</h2>
        <p className="relative text-teal-200 text-sm mt-1">Centralized AI-powered control for diagnostics, workflows, and live analytics.</p>
        <motion.div className="relative flex items-center gap-2 mt-3" animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-xs font-bold text-emerald-300">LIVE — All Systems Active</span>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            style={{ boxShadow: `0 0 0 1px ${s.color}22` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.icon}</span>
              <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }}
                animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} />
            </div>
            <motion.p key={tick} className="text-2xl font-extrabold text-slate-900">{s.value}</motion.p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 3. AI Wellness Forecast Weather (Vet) ─────────────────────────────────────
export function WellnessForecastPanel() {
  const FORECAST = [
    { day:'Today',    icon:'☀️', condition:'Excellent',    temp:'91%', risk:'Low',    color:'#10b981', patients:8 },
    { day:'Tomorrow', icon:'⛅', condition:'Moderate',     temp:'74%', risk:'Medium', color:'#f59e0b', patients:14 },
    { day:'Wed',      icon:'🌧', condition:'Watch',        temp:'61%', risk:'High',   color:'#ef4444', patients:22 },
    { day:'Thu',      icon:'⛈', condition:'Critical',     temp:'45%', risk:'Severe', color:'#7c3aed', patients:31 },
    { day:'Fri',      icon:'🌤', condition:'Recovering',   temp:'78%', risk:'Low',    color:'#14b8a6', patients:11 },
    { day:'Sat',      icon:'☀️', condition:'Excellent',    temp:'94%', risk:'None',   color:'#10b981', patients:6 },
    { day:'Sun',      icon:'🌟', condition:'Outstanding',  temp:'98%', risk:'None',   color:'#6366f1', patients:4 },
  ];
  const G = 'linear-gradient(135deg,#0ea5e9,#6366f1,#a855f7)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌤 Predictive Care</span>
        <h2 className="text-2xl font-black mt-2">AI Wellness Forecast</h2>
        <p className="text-sky-100 text-sm mt-1">7-day medical risk and wellness condition forecast for your clinic — like a weather system for pet health.</p>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {FORECAST.map((f, i) => (
          <motion.div key={f.day} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex flex-col items-center gap-1.5">
            <p className="text-[10px] font-bold text-slate-500">{f.day}</p>
            <span className="text-2xl">{f.icon}</span>
            <p className="text-sm font-extrabold" style={{ color: f.color }}>{f.temp}</p>
            <p className="text-[9px] text-slate-400 text-center leading-tight">{f.condition}</p>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${f.risk === 'None' || f.risk === 'Low' ? 'bg-emerald-100 text-emerald-700' : f.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{f.risk}</span>
            <p className="text-[9px] text-slate-400">{f.patients} pts</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 4. AI Live Engagement Radar (Vet + Admin) ─────────────────────────────────
export function LiveEngagementRadarPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1200); return () => clearInterval(t); }, []);
  const appts    = JSON.parse(localStorage.getItem('ownerAppts') || '[]').length;
  const emergencies = JSON.parse(localStorage.getItem('platformEmergencies') || '[]').length;
  const orders   = JSON.parse(localStorage.getItem('ownerOrders') || '[]').length;
  const feed     = JSON.parse(localStorage.getItem('globalFeed') || '[]').length;
  const POINTS = [
    { label:'Appointments', val: appts || 12,        angle:0,   r:80, color:'#6366f1' },
    { label:'Emergencies',  val: emergencies || 3,   angle:72,  r:65, color:'#ef4444' },
    { label:'Orders',       val: orders || 8,         angle:144, r:90, color:'#10b981' },
    { label:'AI Events',    val: feed + 42,           angle:216, r:70, color:'#a855f7' },
    { label:'Consults',     val: 5 + tick % 3,        angle:288, r:75, color:'#f59e0b' },
  ];
  const center = 120;
  const pts = POINTS.map(p => {
    const a = ((p.angle + tick * 1.5) * Math.PI) / 180;
    return { ...p, x: center + p.r * Math.cos(a), y: center + p.r * Math.sin(a) * 0.7 };
  });
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#a855f7)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">📡 Community Radar</span>
        <h2 className="text-2xl font-black mt-2">AI Live Engagement Radar</h2>
        <p className="text-purple-200 text-sm mt-1">Realtime visualization of consultations, emergencies, and ecosystem activity — live from all dashboards.</p>
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex items-center justify-center" style={{ minHeight: 300 }}>
        <div className="relative" style={{ width: 240, height: 240 }}>
          {[80, 60, 40].map(r => (
            <div key={r} className="absolute rounded-full border border-white/10"
              style={{ width: r * 2.5, height: r * 1.75, left: center - r * 1.25, top: center - r * 0.875 }} />
          ))}
          <motion.div className="absolute border border-purple-500/30 rounded-full"
            style={{ width: 240, height: 168, left: 0, top: 36 }}
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
            <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-purple-400" style={{ boxShadow: '0 0 8px #a855f7' }} />
          </motion.div>
          {pts.map((p, i) => (
            <motion.div key={p.label} className="absolute flex flex-col items-center"
              style={{ left: p.x - 18, top: p.y - 18 }} animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold"
                style={{ background: p.color, boxShadow: `0 0 10px ${p.color}99` }}>{p.val}</div>
              <p className="text-[8px] text-white/70 mt-0.5 whitespace-nowrap">{p.label}</p>
            </motion.div>
          ))}
          <div className="absolute flex items-center justify-center" style={{ left: center - 16, top: center - 16, width: 32, height: 32 }}>
            <motion.div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white font-bold"
              animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>AI</motion.div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {POINTS.map(p => (
          <div key={p.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center">
            <p className="text-lg font-extrabold" style={{ color: p.color }}>{p.val}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">{p.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 5. AI Universal Care Orchestrator (Vet + Admin) ───────────────────────────
export function CareOrchestratorPanel() {
  const [running, setRunning] = useState(false);
  const [done, setDone]       = useState([]);
  const WORKFLOWS = [
    { id:1, name:'Triage incoming emergencies',         target:'Emergency Queue',   status:'pending', color:'#ef4444', icon:'🚨' },
    { id:2, name:'Auto-assign patients to available vets', target:'Workload Balancer', status:'pending', color:'#6366f1', icon:'⚖️' },
    { id:3, name:'Generate AI diagnostic pathways',    target:'Decision Engine',   status:'pending', color:'#a855f7', icon:'🧠' },
    { id:4, name:'Send follow-up notifications',        target:'Owner Dashboard',   status:'pending', color:'#10b981', icon:'📲' },
    { id:5, name:'Update global activity feed',         target:'Admin Dashboard',   status:'pending', color:'#14b8a6', icon:'📡' },
    { id:6, name:'Sync prescription records',           target:'All Dashboards',    status:'pending', color:'#f59e0b', icon:'💊' },
  ];
  const [wf, setWf] = useState(WORKFLOWS);
  const run = () => {
    setRunning(true); setDone([]);
    setWf(WORKFLOWS.map(w => ({ ...w, status: 'pending' })));
    WORKFLOWS.forEach((w, i) => {
      setTimeout(() => {
        setWf(prev => prev.map(x => x.id === w.id ? { ...x, status: 'done' } : x));
        setDone(d => [...d, w.id]);
        if (i === WORKFLOWS.length - 1) {
          setRunning(false);
          logGlobalActivity('System', 'AI Care Orchestrator completed full automation cycle', '🤖', 'ai');
          window.dispatchEvent(new Event('storage'));
        }
      }, i * 900);
    });
  };
  const G = 'linear-gradient(135deg,#10b981,#14b8a6,#6366f1)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🤖 Automation Engine</span>
        <h2 className="text-2xl font-black mt-2">AI Universal Care Orchestrator</h2>
        <p className="text-emerald-100 text-sm mt-1">Intelligently coordinates treatment workflows, alerts, and monitoring across all dashboards in one click.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-extrabold text-slate-800">⚙️ Orchestration Workflows</p>
          <button onClick={run} disabled={running}
            className="px-5 py-2 text-white text-sm font-extrabold rounded-xl disabled:opacity-60 transition hover:-translate-y-0.5"
            style={{ background: G }}>
            {running ? '⚙️ Orchestrating...' : '🚀 Run Full Automation'}
          </button>
        </div>
        <div className="space-y-3">
          {wf.map((w, i) => (
            <motion.div key={w.id} layout className={`flex items-center gap-3 p-3 rounded-xl border transition ${w.status === 'done' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
              <span className="text-lg">{w.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-slate-800">{w.name}</p>
                <p className="text-xs text-slate-400">Target: {w.target}</p>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${w.status === 'done' ? 'bg-emerald-500 text-white' : running && done.length === i ? 'bg-amber-400 text-white animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
                {w.status === 'done' ? '✓' : i + 1}
              </div>
            </motion.div>
          ))}
        </div>
        {!running && done.length === WORKFLOWS.length && done.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <p className="font-extrabold text-emerald-700">🎉 Orchestration Complete — All dashboards synced!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
