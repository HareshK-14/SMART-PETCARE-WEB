import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Heart, AlertTriangle, CheckCircle, Activity,
  Clock, MapPin, Syringe, Thermometer, ChevronRight, X, Plus
} from 'lucide-react';
import { db, useSync } from '../utils/dataBridge';

/* ── Utility helpers ──────────────────────────────────────────── */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp  = (a, b, t) => a + (b - a) * t;

/* ── Static simulation data ───────────────────────────────────── */
const WELFARE_ALERTS = [
  { id:'wa1', severity:'critical', title:'Missed Vaccination – 3 Pets',     desc:'3 pets in North Zone overdue for rabies booster (>14 days)',  time:'2m ago',  region:'North' },
  { id:'wa2', severity:'high',     title:'Emergency Case Active',             desc:'Luna (Persian Cat) – not eating for 48h, vet notified',       time:'18m ago', region:'South' },
  { id:'wa3', severity:'medium',   title:'Low Health Score Alert',            desc:'2 pets scored below 60 on AI health assessment this week',    time:'1h ago',  region:'East'  },
  { id:'wa4', severity:'medium',   title:'Prescription Expiry Warning',       desc:'Prednisolone course ending in 2 days, no refill scheduled',   time:'3h ago',  region:'West'  },
  { id:'wa5', severity:'low',      title:'Hydration Goal Missed – 2 Days',    desc:'Bruno missed hydration targets on 2 consecutive days',        time:'6h ago',  region:'Central'},
];

const INTERVENTIONS = [
  { id:'iv1', action:'Emergency vet dispatch',       pet:'Luna',  status:'completed', date:'2026-05-19', impact:'+12 pts' },
  { id:'iv2', action:'Vaccination reminder sent',    pet:'Bruno', status:'in_progress',date:'2026-05-20', impact:'+8 pts' },
  { id:'iv3', action:'Diet plan updated by AI',      pet:'Bruno', status:'completed', date:'2026-05-18', impact:'+5 pts' },
  { id:'iv4', action:'Hydration alert triggered',    pet:'Luna',  status:'pending',   date:'2026-05-21', impact:'+4 pts' },
];

const REGIONS = [
  { name:'North',   score:88, color:'#10b981', pets:142, risk:3 },
  { name:'South',   score:72, color:'#f59e0b', pets:218, risk:7 },
  { name:'East',    score:65, color:'#ef4444', pets:176, risk:12 },
  { name:'West',    score:91, color:'#10b981', pets:134, risk:2 },
  { name:'Central', score:79, color:'#14b8a6', pets:201, risk:5 },
];

/* ── Animated Gauge ───────────────────────────────────────────── */
function WelfareGauge({ score }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let raf, start, prev = 0;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / 1800, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = Math.round(lerp(0, score, ease));
      if (val !== prev) { setDisplayed(val); prev = val; }
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const R = 80, cx = 110, cy = 110;
  const startAngle = -210, endAngle = 30;
  const totalDeg = endAngle - startAngle;
  const filled = (displayed / 100) * totalDeg;
  const toRad = d => (d * Math.PI) / 180;
  const arc = (r, startDeg, sweepDeg) => {
    const s = toRad(startDeg), e = toRad(startDeg + sweepDeg);
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const lg = Math.abs(sweepDeg) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2}`;
  };
  const scoreColor = displayed >= 80 ? '#10b981' : displayed >= 60 ? '#f59e0b' : '#ef4444';
  const scoreLabel = displayed >= 80 ? 'Excellent' : displayed >= 60 ? 'Fair' : 'Critical';

  return (
    <svg viewBox="0 0 220 180" width="220" height="180">
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444"/>
          <stop offset="50%" stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#10b981"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Track */}
      <path d={arc(R, startAngle, totalDeg)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round"/>
      {/* Filled arc */}
      {displayed > 0 && (
        <motion.path
          d={arc(R, startAngle, filled)}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        />
      )}
      {/* Tick marks */}
      {[0, 25, 50, 75, 100].map((v, i) => {
        const a = toRad(startAngle + (v / 100) * totalDeg);
        const ix = cx + (R - 18) * Math.cos(a), iy = cy + (R - 18) * Math.sin(a);
        const ox = cx + (R + 8) * Math.cos(a), oy = cy + (R + 8) * Math.sin(a);
        return <line key={i} x1={ix} y1={iy} x2={ox} y2={oy} stroke="rgba(255,255,255,0.25)" strokeWidth="2"/>;
      })}
      {/* Needle */}
      {(() => {
        const a = toRad(startAngle + (displayed / 100) * totalDeg);
        const nx = cx + (R - 10) * Math.cos(a), ny = cy + (R - 10) * Math.sin(a);
        return (
          <motion.line
            x1={cx} y1={cy} x2={nx} y2={ny}
            stroke={scoreColor} strokeWidth="3" strokeLinecap="round"
            filter="url(#glow)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          />
        );
      })()}
      <circle cx={cx} cy={cy} r="6" fill={scoreColor} filter="url(#glow)"/>
      {/* Center text */}
      <text x={cx} y={cy + 28} textAnchor="middle" fill="white" fontSize="32" fontWeight="900">{displayed}</text>
      <text x={cx} y={cy + 44} textAnchor="middle" fill={scoreColor} fontSize="11" fontWeight="700">{scoreLabel}</text>
      <text x={cx} y={cy + 58} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Platform Welfare Score</text>
    </svg>
  );
}

/* ── At-Risk Pet Card ─────────────────────────────────────────── */
function AtRiskCard({ pet, healthScore, issue, idx }) {
  const color = healthScore < 50 ? '#ef4444' : '#f59e0b';
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${color}33` }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
           style={{ background: `${color}22` }}>🐾</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm">{pet}</p>
        <p className="text-xs text-white/50 truncate">{issue}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-extrabold text-sm" style={{ color }}>{healthScore}</p>
        <p className="text-[10px] text-white/40">Health</p>
      </div>
    </motion.div>
  );
}

/* ── Main Component ───────────────────────────────────────────── */
export default function WelfareMonitoringPanel() {
  const { data } = useSync(['ownerPets', 'medicalRecords', 'platformEmergencies', 'allPrescriptions']);
  const [activeAlert, setActiveAlert]       = useState(null);
  const [interventions, setInterventions]   = useState(INTERVENTIONS);
  const [showAddAction, setShowAddAction]   = useState(false);
  const [newAction, setNewAction]           = useState('');
  const [pulseScore, setPulseScore]         = useState(83);
  const [tick, setTick]                     = useState(0);

  // Gently drift the welfare score
  useEffect(() => {
    const t = setInterval(() => {
      setTick(x => x + 1);
      setPulseScore(s => clamp(s + (Math.random() - 0.49) * 0.8, 70, 96));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const pets         = data.ownerPets        || [];
  const records      = data.medicalRecords   || [];
  const emergencies  = data.platformEmergencies || [];
  const prescriptions= data.allPrescriptions || [];

  /* Derived metrics */
  const avgHealthScore  = pets.length ? Math.round(75 + pets.length * 2.3) : 77;
  const vaccCoverage    = Math.round(68 + (records.length * 5));
  const emergencyResTime= emergencies.length ? '8.4 min' : '12 min';
  const activeCases     = emergencies.filter(e => e.status === 'active').length + 1;

  /* Simulated at-risk pets */
  const atRiskPets = [
    { pet: 'Luna (Persian Cat)',  healthScore: 48, issue: 'Not eating — 48h, active emergency' },
    { pet: 'Max (Beagle)',        healthScore: 52, issue: 'Missed rabies booster – 14 days overdue' },
    { pet: 'Cleo (Siamese)',      healthScore: 61, issue: 'Weight loss trend detected by AI' },
    { pet: 'Buddy (Poodle)',      healthScore: 63, issue: 'Hydration below 60% goal for 3 days' },
  ];

  /* Intervention actions */
  const addIntervention = () => {
    if (!newAction.trim()) return;
    const entry = {
      id: `iv${Date.now()}`,
      action: newAction,
      pet: pets[0]?.name || 'Unknown',
      status: 'pending',
      date: new Date().toISOString().slice(0, 10),
      impact: '+? pts',
    };
    setInterventions(p => [entry, ...p]);
    setNewAction('');
    setShowAddAction(false);
  };

  const toggleStatus = (id) => {
    setInterventions(prev => prev.map(iv =>
      iv.id === id
        ? { ...iv, status: iv.status === 'pending' ? 'in_progress' : iv.status === 'in_progress' ? 'completed' : 'pending' }
        : iv
    ));
  };

  const severityConfig = {
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'CRITICAL' },
    high:     { color: '#f97316', bg: 'rgba(249,115,22,0.15)', label: 'HIGH' },
    medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'MEDIUM' },
    low:      { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'LOW' },
  };

  const statusConfig = {
    completed:   { color: '#10b981', label: 'Done' },
    in_progress: { color: '#6366f1', label: 'Active' },
    pending:     { color: '#f59e0b', label: 'Pending' },
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6"
         style={{ background: 'radial-gradient(ellipse at 20% 20%, #052e16 0%, #0a0a0f 50%, #0f0a1a 100%)' }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg,#10b981,#14b8a6)' }}>
            <Shield size={24} className="text-white"/>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">AI Animal Welfare Monitoring</h1>
            <p className="text-sm text-emerald-400/70">Real-time platform-wide welfare intelligence</p>
          </div>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-emerald-400"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"/>
          LIVE MONITORING
        </motion.div>
      </motion.div>

      {/* ── Row 1: Gauge + Metrics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Gauge card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl p-6 flex flex-col items-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16,185,129,0.2)',
            boxShadow: '0 0 40px rgba(16,185,129,0.08)',
          }}
        >
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Welfare Score</p>
          <WelfareGauge score={Math.round(pulseScore)} />
          <div className="mt-3 grid grid-cols-3 gap-2 w-full">
            {[['Excellent', '≥80', '#10b981'], ['Fair', '60-79', '#f59e0b'], ['Critical', '<60', '#ef4444']].map(([l, r, c]) => (
              <div key={l} className="text-center p-2 rounded-xl" style={{ background: `${c}11`, border: `1px solid ${c}22` }}>
                <p className="text-[10px] font-bold" style={{ color: c }}>{l}</p>
                <p className="text-[10px] text-white/40">{r}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Metric cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[
            { icon: Heart,        label: 'Avg Health Score',     value: avgHealthScore,  unit: '/100',  color: '#10b981', trend: '+2.3' },
            { icon: Syringe,      label: 'Vaccination Coverage',  value: `${clamp(vaccCoverage,0,99)}`, unit: '%', color: '#14b8a6', trend: '+1.1' },
            { icon: Clock,        label: 'Emergency Response',    value: emergencyResTime,unit: '',     color: '#f59e0b', trend: '-1.2m' },
            { icon: AlertTriangle,label: 'Active Cases',          value: activeCases,    unit: '',      color: '#ef4444', trend: '+1' },
          ].map(({ icon: Icon, label, value, unit, color, trend }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${color}25`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ background: `${color}20` }}>
                  <Icon size={18} style={{ color }}/>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${color}18`, color }}>
                  {trend}
                </span>
              </div>
              <p className="text-3xl font-black text-white">{value}<span className="text-base font-semibold text-white/40">{unit}</span></p>
              <p className="text-xs text-white/50 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Row 2: Regional Map ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-3xl p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={18} className="text-emerald-400"/>
          <h2 className="font-bold text-white">Regional Welfare Map</h2>
        </div>

        {/* CSS map simulation */}
        <div className="relative h-48 rounded-2xl overflow-hidden mb-5"
             style={{ background: 'rgba(0,0,0,0.3)' }}>
          {/* Grid background */}
          <div className="absolute inset-0"
               style={{
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
                 backgroundSize: '40px 40px',
               }}/>
          {/* Region blobs */}
          {[
            { name:'North',   top:'8%',  left:'38%', color:'#10b981', score:88 },
            { name:'South',   top:'65%', left:'38%', color:'#f59e0b', score:72 },
            { name:'East',    top:'38%', left:'65%', color:'#ef4444', score:65 },
            { name:'West',    top:'38%', left:'8%',  color:'#10b981', score:91 },
            { name:'Central', top:'38%', left:'38%', color:'#14b8a6', score:79 },
          ].map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
              className="absolute flex flex-col items-center cursor-pointer group"
              style={{ top: r.top, left: r.left, transform: 'translate(-50%,-50%)' }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5 }}
                className="absolute w-16 h-16 rounded-full"
                style={{ background: r.color, filter: 'blur(12px)' }}
              />
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-sm"
                   style={{ background: r.color, boxShadow: `0 0 20px ${r.color}66` }}>
                {r.score}
              </div>
              <span className="text-[10px] font-bold mt-1" style={{ color: r.color }}>{r.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Region bars */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {REGIONS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              className="p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${r.color}30` }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-white/70">{r.name}</span>
                <span className="text-xs font-black" style={{ color: r.color }}>{r.score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <motion.div className="h-1.5 rounded-full" style={{ background: r.color }}
                  initial={{ width: 0 }} animate={{ width: `${r.score}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}/>
              </div>
              <p className="text-[10px] text-white/40 mt-1">{r.pets} pets · {r.risk} at-risk</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Row 3: At-Risk Pets + Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* At-Risk Pets */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart size={18} className="text-red-400"/>
            <h2 className="font-bold text-white">At-Risk Pets</h2>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold text-red-400"
                  style={{ background: 'rgba(239,68,68,0.15)' }}>
              {atRiskPets.length} flagged
            </span>
          </div>
          <div className="space-y-2">
            {atRiskPets.map((p, i) => (
              <AtRiskCard key={p.pet} {...p} idx={i}/>
            ))}
          </div>
        </motion.div>

        {/* Welfare Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-400"/>
            <h2 className="font-bold text-white">Welfare Alerts</h2>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold text-amber-400"
                  style={{ background: 'rgba(245,158,11,0.15)' }}>
              {WELFARE_ALERTS.length} active
            </span>
          </div>
          <div className="space-y-2">
            {WELFARE_ALERTS.map((alert, i) => {
              const cfg = severityConfig[alert.severity];
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-xl cursor-pointer group"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}
                  onClick={() => setActiveAlert(activeAlert?.id === alert.id ? null : alert)}
                >
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: cfg.color }}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-white">{alert.title}</p>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded"
                            style={{ background: `${cfg.color}30`, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                    <AnimatePresence>
                      {activeAlert?.id === alert.id && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-xs text-white/60 mt-1 overflow-hidden"
                        >
                          {alert.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <p className="text-[10px] text-white/30 mt-1">{alert.region} · {alert.time}</p>
                  </div>
                  <ChevronRight size={14} className="text-white/30 flex-shrink-0 group-hover:text-white/60 transition-colors mt-0.5"/>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Row 4: Intervention Tracker ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Activity size={18} className="text-indigo-400"/>
          <h2 className="font-bold text-white">Intervention Tracker</h2>
          <button
            onClick={() => setShowAddAction(v => !v)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#6366f1,#14b8a6)' }}
          >
            <Plus size={12}/> Add Action
          </button>
        </div>

        <AnimatePresence>
          {showAddAction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="flex gap-2 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
                <input
                  value={newAction}
                  onChange={e => setNewAction(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addIntervention()}
                  placeholder="Describe intervention action…"
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
                />
                <button onClick={addIntervention}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#14b8a6)' }}>
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 pr-4">Action</th>
                <th className="pb-3 pr-4">Pet</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Impact</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {interventions.map((iv, i) => {
                const sc = statusConfig[iv.status];
                return (
                  <motion.tr
                    key={iv.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleStatus(iv.id)}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} style={{ color: sc.color }}/>
                        <span className="text-white/80 font-medium">{iv.action}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-white/60">{iv.pet}</td>
                    <td className="py-3 pr-4">
                      <span className="text-[11px] font-bold px-2 py-1 rounded-full"
                            style={{ background: `${sc.color}20`, color: sc.color }}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-white/40 text-xs">{iv.date}</td>
                    <td className="py-3 font-bold text-emerald-400 text-xs">{iv.impact}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
