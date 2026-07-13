import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logGlobalActivity } from '../utils/activityFeed';

// ── 1. Realtime Ecosystem Pulse Engine ────────────────────────────────────────
export function EcosystemPulsePanel() {
  const [beats, setBeats] = useState([]);
  const [tick, setTick]   = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setTick(x => x + 1);
      setBeats(b => [...b.slice(-29), { id: Date.now(), h: 20 + Math.random() * 80 }]);
    }, 600);
    return () => clearInterval(t);
  }, []);
  const emerg  = JSON.parse(localStorage.getItem('platformEmergencies') || '[]').length;
  const orders = JSON.parse(localStorage.getItem('ownerOrders') || '[]').length;
  const feed   = JSON.parse(localStorage.getItem('globalFeed') || '[]').length;
  const health = Math.max(60, 95 - emerg * 5);
  const G = 'linear-gradient(135deg,#0f172a,#1e1b4b,#6366f1)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">💓 Live Analytics</span>
        <h2 className="text-2xl font-black mt-2">Realtime Ecosystem Pulse Engine</h2>
        <p className="text-indigo-200 text-sm mt-1">Heartbeat-style live monitoring of the entire PetCare AI ecosystem.</p>
        <div className="flex gap-6 mt-4">
          {[['Ecosystem Health', health + '%'],['Emergencies', emerg],['Orders', orders],['Feed Events', feed]].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-300">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-extrabold">💓 Ecosystem Heartbeat</p>
          <motion.span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700"
            animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }}>● LIVE</motion.span>
        </div>
        <div className="flex items-end gap-1 h-24">
          {beats.map((b, i) => (
            <motion.div key={b.id} className="flex-1 rounded-t min-w-0"
              style={{ height: `${b.h}%`, background: b.h > 70 ? '#ef4444' : b.h > 40 ? '#6366f1' : '#14b8a6', opacity: 0.5 + (i / beats.length) * 0.5 }}
              initial={{ scaleY: 0, originY: 1 }} animate={{ scaleY: 1 }} transition={{ duration: 0.15 }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[['Owner Activity', '#14b8a6'],['Vet Events', '#6366f1'],['Emergency', '#ef4444']].map(([l,c]) => (
            <div key={l} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: c }} />
              <span className="text-slate-400 text-xs">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 2. AI Digital Ecosystem Galaxy ────────────────────────────────────────────
export function EcosystemGalaxyPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1000); return () => clearInterval(t); }, []);
  const users = 248 + tick % 5;
  const SYSTEMS = [
    { label:'Owner Hub',    size:50, orbit:0,   emoji:'🏠', color:'#6366f1' },
    { label:'Vet Network',  size:42, orbit:80,  emoji:'👨‍⚕️', color:'#14b8a6', angle:30 },
    { label:'Marketplace',  size:36, orbit:130, emoji:'🛒', color:'#10b981', angle:120 },
    { label:'Emergency AI', size:34, orbit:170, emoji:'🚨', color:'#ef4444', angle:210 },
    { label:'Analytics',    size:32, orbit:200, emoji:'📊', color:'#a855f7', angle:290 },
    { label:'Community',    size:28, orbit:240, emoji:'🤝', color:'#f59e0b', angle:350 },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#020617,#0f172a,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌌 Ecosystem Visualization</span>
        <h2 className="text-2xl font-black mt-2">AI Digital Ecosystem Galaxy</h2>
        <p className="text-indigo-200 text-sm mt-1">All platform systems as an interactive animated galaxy — {users} users orbiting the AI core.</p>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'radial-gradient(ellipse at center,#1e1b4b 0%,#020617 100%)', minHeight: 400 }}>
        <div className="relative flex items-center justify-center" style={{ height: 400 }}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-white"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.6 + 0.1 }} />
          ))}
          {SYSTEMS.map((s, i) => {
            const a = s.orbit === 0 ? 0 : (((s.angle || 0) + tick * (1.5 / (1 + i * 0.3))) * Math.PI) / 180;
            const cx = s.orbit === 0 ? 0 : s.orbit * Math.cos(a);
            const cy = s.orbit === 0 ? 0 : s.orbit * Math.sin(a) * 0.5;
            return (
              <div key={s.label}>
                {s.orbit > 0 && (
                  <div className="absolute rounded-full border border-white/8 pointer-events-none"
                    style={{ width: s.orbit * 2, height: s.orbit, left: `50%`, top: '50%', marginLeft: -s.orbit, marginTop: -s.orbit / 2 }} />
                )}
                <motion.div className="absolute flex flex-col items-center"
                  style={{ left: '50%', top: '50%', marginLeft: cx - s.size / 2, marginTop: cy - s.size / 2 }}
                  animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.5 }}>
                  <div className="rounded-full flex items-center justify-center shadow-lg"
                    style={{ width: s.size, height: s.size, background: s.color + '33', border: `2px solid ${s.color}88`, boxShadow: `0 0 12px ${s.color}66` }}>
                    <span style={{ fontSize: s.size * 0.42 }}>{s.emoji}</span>
                  </div>
                  <p className="text-white text-[8px] font-bold mt-0.5 whitespace-nowrap">{s.label}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 3. Immersive AI Health Glassboard ─────────────────────────────────────────
export function HealthGlassboardPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);
  const orders = JSON.parse(localStorage.getItem('ownerOrders') || '[]');
  const emerg  = JSON.parse(localStorage.getItem('platformEmergencies') || '[]');
  const appts  = JSON.parse(localStorage.getItem('ownerAppts') || '[]');
  const walks  = JSON.parse(localStorage.getItem('petWalks') || '[]');
  const CARDS = [
    { title:'Total Users',     val: 248 + tick % 4,              icon:'👥', color:'#6366f1', sub:'+12 today' },
    { title:'Active Alerts',   val: emerg.filter(e=>e.status!=='resolved').length || 2, icon:'🚨', color:'#ef4444', sub:'Realtime' },
    { title:'Revenue',         val:'₹' + (124500 + orders.reduce((s,o)=>s+o.total||0,0)).toLocaleString('en-IN'), icon:'💰', color:'#10b981', sub:'+34% MoM' },
    { title:'Pet Walks',       val: walks.length,                icon:'🚶', color:'#f59e0b', sub:'Logged today' },
    { title:'Appointments',    val: appts.length,                icon:'📅', color:'#14b8a6', sub:'All time' },
    { title:'AI Confidence',   val: (94 + tick % 4) + '%',      icon:'🧠', color:'#a855f7', sub:'Platform avg' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7,#14b8a6)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🪟 Analytics Workspace</span>
        <h2 className="text-2xl font-black mt-2">Immersive AI Health Glassboard</h2>
        <p className="text-indigo-100 text-sm mt-1">Glassmorphism floating analytics — realtime KPIs from all three dashboards.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CARDS.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: `0 12px 40px ${c.color}33` }}
            className="relative overflow-hidden rounded-2xl p-5 border backdrop-blur-xl transition-all cursor-default"
            style={{ background: `linear-gradient(135deg, ${c.color}10, ${c.color}05)`, borderColor: c.color + '30', boxShadow: `inset 0 1px 0 ${c.color}20` }}>
            <div className="absolute -right-4 -top-4 opacity-10 text-6xl">{c.icon}</div>
            <span className="text-2xl mb-2 block">{c.icon}</span>
            <motion.p key={tick} className="text-2xl font-extrabold text-slate-900">{c.val}</motion.p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{c.title}</p>
            <p className="text-[10px] mt-1 font-semibold" style={{ color: c.color }}>{c.sub}</p>
            <motion.div className="absolute bottom-0 left-0 h-0.5 rounded-full" style={{ background: c.color }}
              animate={{ width: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 4. Quantum AI PetCare Core ────────────────────────────────────────────────
export function QuantumCorePanel() {
  const [tick, setTick] = useState(0);
  const [mode, setMode]  = useState('idle');
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 800); return () => clearInterval(t); }, []);
  const SYSTEMS = [
    { label:'Automation',    active:true,  color:'#6366f1', val:() => 'Running', icon:'⚙️' },
    { label:'Predictions',   active:true,  color:'#a855f7', val:() => (94+tick%3)+'% acc', icon:'🔮' },
    { label:'Sync Engine',   active:true,  color:'#14b8a6', val:() => tick+'ms lag', icon:'🔄' },
    { label:'Analytics',     active:true,  color:'#10b981', val:() => (4820+tick*5)+' events/hr', icon:'📊' },
    { label:'Optimization',  active:mode==='active', color:'#f59e0b', val:() => mode==='active'?'Active':'Standby', icon:'⚡' },
    { label:'AI Reasoning',  active:true,  color:'#ef4444', val:() => 'GPT-level', icon:'🧠' },
  ];
  const runCore = () => {
    setMode('active');
    logGlobalActivity('Admin', 'Quantum AI PetCare Core activated', '⚛', 'ai');
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => setMode('idle'), 8000);
  };
  const G = 'linear-gradient(135deg,#020617,#1e1b4b,#7c3aed)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: G }}>
        <div className="absolute inset-0" style={{ background: 'repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(99,102,241,0.03) 1deg, transparent 2deg)' }} />
        <span className="relative bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">⚛ AI Core</span>
        <h2 className="relative text-2xl font-black mt-2">Quantum AI PetCare Core</h2>
        <p className="relative text-purple-200 text-sm mt-1">Master intelligence engine — automation, predictions, sync, analytics, and optimization in one quantum core.</p>
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-white font-extrabold">⚛ Core Systems Status</p>
          <button onClick={runCore} disabled={mode==='active'}
            className="px-5 py-2 text-white text-sm font-bold rounded-xl disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
            {mode === 'active' ? '⚛ Core Active...' : '⚛ Activate Quantum Core'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SYSTEMS.map((s, i) => (
            <motion.div key={s.label} className={`rounded-2xl p-4 border transition ${s.active ? '' : 'opacity-50'}`}
              style={{ background: s.color + '10', borderColor: s.color + '33' }}
              animate={s.active ? { boxShadow: [`0 0 0px ${s.color}00`, `0 0 12px ${s.color}44`, `0 0 0px ${s.color}00`] } : {}}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}>
              <div className="flex items-center gap-2 mb-2">
                <span>{s.icon}</span>
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }}
                  animate={s.active ? { scale: [1,1.5,1] } : {}} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
              </div>
              <p className="text-white font-extrabold text-sm">{s.label}</p>
              <motion.p key={tick} className="text-xs mt-0.5 font-bold" style={{ color: s.color }}>{s.val()}</motion.p>
            </motion.div>
          ))}
        </div>
        {mode === 'active' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 rounded-2xl border border-purple-700 bg-purple-900/30 text-center">
            <motion.p className="text-purple-300 font-bold text-sm" animate={{ opacity: [1,0.5,1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
              ⚛ Quantum Core Running — All 6 systems synchronized across ecosystem
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── 5. Digital AI Pet City ────────────────────────────────────────────────────
export function PetCityPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1200); return () => clearInterval(t); }, []);
  const users  = 248 + tick % 3;
  const vets   = 52 + tick % 2;
  const orders = JSON.parse(localStorage.getItem('ownerOrders') || '[]').length;
  const BUILDINGS = [
    { label:'Pet Owner Hub',  height:120, color:'#6366f1', users:users,  icon:'🏠', x:8  },
    { label:'Vet Network',    height:160, color:'#14b8a6', users:vets,   icon:'🏥', x:20 },
    { label:'AI Core Tower',  height:200, color:'#a855f7', users:'∞',    icon:'🗼', x:36 },
    { label:'Marketplace',    height:130, color:'#10b981', users:orders, icon:'🛒', x:52 },
    { label:'Emergency HQ',   height:150, color:'#ef4444', users:2,      icon:'🚨', x:64 },
    { label:'Analytics Hub',  height:110, color:'#f59e0b', users:12,     icon:'📊', x:78 },
    { label:'Community Park', height:80,  color:'#ec4899', users:89,     icon:'🌳', x:90 },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#020617,#0f172a,#1e1b4b)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🏙 Virtual Metaverse</span>
        <h2 className="text-2xl font-black mt-2">Digital AI Pet City</h2>
        <p className="text-slate-400 text-sm mt-1">Interactive futuristic digital city — every district represents a live ecosystem module.</p>
        <div className="flex gap-6 mt-4">
          {[['Citizens', users],['Districts', BUILDINGS.length],['Active Orders', orders || 0]].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold text-white">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden" style={{ minHeight: 300 }}>
        <div className="relative" style={{ height: 280 }}>
          <div className="absolute inset-x-0 bottom-0 h-6 bg-slate-700" />
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-px bg-white/5" style={{ left: `${i * 5}%`, top: 0, bottom: 0 }} />
          ))}
          {BUILDINGS.map((b, i) => (
            <div key={b.label} className="absolute flex flex-col items-center group" style={{ left: `${b.x}%`, bottom: 24 }}>
              <p className="text-white text-[8px] font-bold mb-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{b.users}</p>
              <motion.div className="relative rounded-t-md cursor-pointer"
                style={{ width: 28, height: b.height, background: `linear-gradient(to top,${b.color}cc,${b.color}55)`, boxShadow: `0 0 ${tick % 2 === i % 2 ? 16 : 6}px ${b.color}55` }}
                animate={{ boxShadow: [`0 0 6px ${b.color}33`, `0 0 16px ${b.color}88`, `0 0 6px ${b.color}33`] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}>
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-base">{b.icon}</span>
                {[...Array(Math.floor(b.height / 18))].map((_, wi) => (
                  <motion.div key={wi} className="absolute w-2.5 h-1.5 rounded-sm"
                    style={{ background: tick % 3 === wi % 3 ? '#fff' : b.color + '44', left: 4, top: 8 + wi * 18 }}
                    animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: wi * 0.2 + i * 0.1 }} />
                ))}
              </motion.div>
              <p className="text-[8px] text-slate-500 mt-1 whitespace-nowrap max-w-12 text-center leading-tight">{b.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
