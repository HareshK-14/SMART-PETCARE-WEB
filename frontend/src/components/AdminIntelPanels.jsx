import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, ShieldCheck, Zap, Users, DollarSign } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';

// ── A) AI Global Ecosystem Simulator ──────────────────────────────────────────
export function EcosystemSimulatorPanel() {
  const [years, setYears] = useState(1);
  const project = (base, growth, y) => Math.round(base * Math.pow(1 + growth, y));
  const scenarios = [
    { label:'Users', base:2480, growth:0.35, color:'#6366f1', icon:'👥' },
    { label:'Vets',  base:52,   growth:0.28, color:'#14b8a6', icon:'👨‍⚕️' },
    { label:'Revenue (₹K)', base:1245, growth:0.42, color:'#10b981', icon:'💰' },
    { label:'AI Events/day', base:1200, growth:0.55, color:'#a855f7', icon:'⚡' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌐 Ecosystem Intelligence</span>
        <h2 className="text-2xl font-black mt-2">AI Global Ecosystem Simulator</h2>
        <p className="text-indigo-100 text-sm mt-1">Simulate future platform ecosystem growth with AI-driven projections.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-extrabold text-slate-800">📈 Growth Projection Simulator</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Simulate:</span>
            {[1,2,3,5].map(y => (
              <button key={y} onClick={() => setYears(y)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${years === y ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600'}`}
                style={years === y ? { background: GRAD } : {}}>{y}Y</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {scenarios.map((s, i) => (
            <motion.div key={s.label} layout className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
              <span className="text-2xl">{s.icon}</span>
              <motion.p key={years} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-extrabold mt-2" style={{ color: s.color }}>
                {project(s.base, s.growth, years).toLocaleString()}
              </motion.p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label} in {years}Y</p>
              <p className="text-[10px] text-emerald-600 font-bold">+{Math.round(s.growth * 100)}%/yr</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── B) AI Ecosystem Stability Index ───────────────────────────────────────────
export function EcosystemStabilityPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 3000); return () => clearInterval(t); }, []);

  const COMPONENTS = [
    { name:'API Gateway',         health:99, status:'nominal',    icon:'🔌' },
    { name:'AI Inference Engine', health:97, status:'nominal',    icon:'🧠' },
    { name:'Database Cluster',    health:95, status:'nominal',    icon:'🗄' },
    { name:'Payment Gateway',     health:100,status:'nominal',    icon:'💳' },
    { name:'Notification Service',health:88, status:'degraded',   icon:'🔔' },
    { name:'Emergency Router',    health:98, status:'nominal',    icon:'🚨' },
    { name:'Sync Engine',         health:94, status:'nominal',    icon:'🔄' },
    { name:'Media CDN',           health:82, status:'degraded',   icon:'📦' },
  ];
  const avg = Math.round(COMPONENTS.reduce((s, c) => s + c.health, 0) / COMPONENTS.length);

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#10b981,#14b8a6)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">⚡ Platform Stability</span>
        <h2 className="text-2xl font-black mt-2">AI Ecosystem Stability Index</h2>
        <p className="text-emerald-100 text-sm mt-1">Real-time operational health monitoring for all platform components.</p>
        <div className="flex gap-6 mt-4">
          {[['Overall Health', avg + '%'],['Nominal', COMPONENTS.filter(c=>c.status==='nominal').length],['Degraded', COMPONENTS.filter(c=>c.status==='degraded').length],['Uptime','99.7%']].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-emerald-200">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {COMPONENTS.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`bg-white rounded-2xl border shadow-sm p-4 ${c.status === 'degraded' ? 'border-amber-200' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{c.icon}</span>
              <p className="font-bold text-sm text-slate-800 flex-1">{c.name}</p>
              <motion.div className="w-2 h-2 rounded-full" style={{ background: c.status === 'nominal' ? '#10b981' : '#f59e0b' }}
                animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <motion.div className="h-2 rounded-full" style={{ background: c.health > 90 ? '#10b981' : '#f59e0b' }}
                animate={{ width: `${c.health + (tick % 3 - 1) * 0.3}%` }} transition={{ duration: 0.5 }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span className={c.status === 'degraded' ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>{c.status}</span>
              <span>{c.health}%</span>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── C) Smart Revenue Evolution Tracker ────────────────────────────────────────
export function RevenueEvolutionPanel() {
  const ownerOrders = JSON.parse(localStorage.getItem('ownerOrders') || '[]');
  const liveRevenue = ownerOrders.reduce((s, o) => s + (o.total || 0), 0);

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DATA = [124,186,242,318,395,467,542,601,689,752,831,948];
  const maxD = Math.max(...DATA);

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">💰 Financial Growth</span>
        <h2 className="text-2xl font-black mt-2">Smart Revenue Evolution Tracker</h2>
        <p className="text-amber-100 text-sm mt-1">Long-term revenue growth patterns with real-time marketplace synchronization.</p>
        <div className="flex gap-6 mt-4">
          {[['Annual Target','₹12.5L'],['This Month','₹9.48L'],['Live Orders','₹' + liveRevenue.toLocaleString()],['Growth','+34% YoY']].map(([l,v]) => (
            <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-amber-200">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">📊 Monthly Revenue (₹K)</p>
        <div className="flex items-end gap-2 h-36">
          {MONTHS.map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <motion.div className="w-full rounded-t-lg" style={{ background: 'linear-gradient(to top, #f59e0b, #6366f1)' }}
                initial={{ height: 0 }} animate={{ height: `${(DATA[i] / maxD) * 100}%` }} transition={{ delay: i * 0.06, duration: 0.7 }} />
              <span className="text-[9px] text-slate-400">{m}</span>
            </div>
          ))}
        </div>
        {liveRevenue > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-xs font-bold text-emerald-700">🛒 Live Marketplace Revenue: ₹{liveRevenue.toLocaleString()} <span className="text-emerald-500">• Synced from Owner Dashboard</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── D) AI Digital Command Grid ─────────────────────────────────────────────────
export function CommandGridPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);

  const STATS = [
    { label:'Active Users',      value:() => 248 + (tick % 5),      icon:'👥', color:'#6366f1' },
    { label:'AI Requests/min',   value:() => 1240 + tick * 3 % 200, icon:'⚡', color:'#a855f7' },
    { label:'Emergency Alerts',  value:() => JSON.parse(localStorage.getItem('platformEmergencies') || '[]').length, icon:'🚨', color:'#ef4444' },
    { label:'Marketplace Orders',value:() => JSON.parse(localStorage.getItem('ownerOrders') || '[]').length, icon:'🛒', color:'#10b981' },
    { label:'System Load',       value:() => (62 + tick % 15) + '%', icon:'📡', color:'#14b8a6' },
    { label:'Global Events/hr',  value:() => 4820 + tick * 11 % 500, icon:'🌐', color:'#f59e0b' },
  ];

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#6366f1)' }}>
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 30px,rgba(99,102,241,0.06) 30px,rgba(99,102,241,0.06) 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,rgba(99,102,241,0.06) 30px,rgba(99,102,241,0.06) 31px)' }} />
        <span className="relative bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌐 Global Operations</span>
        <h2 className="relative text-2xl font-black mt-2">Realtime Digital Command Grid</h2>
        <p className="relative text-indigo-200 text-sm mt-1">Centralized realtime intelligent monitoring for the entire PetCare ecosystem.</p>
        <motion.div className="relative flex items-center gap-2 mt-3" animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold text-emerald-300">LIVE — All systems operational</span>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {STATS.map((s, i) => (
          <motion.div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
            animate={{ borderColor: ['#f1f5f9', s.color + '44', '#f1f5f9'] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{s.icon}</span>
              <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
            </div>
            <motion.p key={tick} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} className="text-2xl font-extrabold text-slate-900">
              {s.value()}
            </motion.p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
