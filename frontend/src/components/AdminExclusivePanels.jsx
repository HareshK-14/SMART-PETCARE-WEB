import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logGlobalActivity } from '../utils/activityFeed';

const P = (n) => JSON.parse(localStorage.getItem(n) || '[]');

// 1. AI Global Ecosystem Brain
export function EcosystemBrainPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1000); return () => clearInterval(t); }, []);
  const feed   = P('globalFeed').length;
  const emerg  = P('platformEmergencies').length;
  const orders = P('ownerOrders').length;
  const appts  = P('ownerAppts').length;
  const THOUGHTS = [
    `Processing ${feed + tick} global events...`,
    `${emerg} emergency protocols active`,
    `Revenue sync: ${orders} orders tracked`,
    `Scheduling intelligence: ${appts} appointments`,
    `AI confidence: ${93 + tick % 5}%`,
    'Optimizing cross-dashboard sync...',
  ];
  const NODES = [
    { label:'Owner AI',    x:50,  y:20, color:'#6366f1', size:44 },
    { label:'Vet AI',      x:80,  y:55, color:'#14b8a6', size:38 },
    { label:'Admin AI',    x:20,  y:55, color:'#a855f7', size:38 },
    { label:'Emergency',   x:50,  y:80, color:'#ef4444', size:32 },
    { label:'Marketplace', x:80,  y:20, color:'#10b981', size:28 },
    { label:'Community',   x:20,  y:20, color:'#f59e0b', size:28 },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#020617,#0f172a,#a855f7)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🧠 Ecosystem Intelligence</span>
        <h2 className="text-2xl font-black mt-2">AI Global Ecosystem Brain</h2>
        <p className="text-purple-200 text-sm mt-1">Central AI analyzing all realtime ecosystem activity — synced with live data from all dashboards.</p>
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6" style={{ minHeight: 340 }}>
        <div className="relative" style={{ height: 280 }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {NODES.slice(1).map((n, i) => (
              <motion.line key={i} x1="50" y1="50" x2={n.x} y2={n.y}
                stroke={n.color} strokeOpacity={0.3} strokeWidth="0.5" strokeDasharray="2,1"
                animate={{ strokeOpacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }} />
            ))}
            {NODES.map((n, i) => (
              <g key={n.label}>
                <motion.circle cx={n.x} cy={n.y} r={n.size / 14} fill={n.color} fillOpacity={0.15}
                  stroke={n.color} strokeWidth="0.5"
                  animate={{ r: [n.size / 14, n.size / 12, n.size / 14] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }} />
                <text x={n.x} y={n.y + 0.6} textAnchor="middle" fill="white" fontSize="4.5" fontWeight="bold">
                  {n.label.split(' ')[0]}
                </text>
              </g>
            ))}
            <motion.circle cx="50" cy="50" r="6" fill="url(#brain)" stroke="#a855f7" strokeWidth="1"
              animate={{ r: [6, 7, 6] }} transition={{ repeat: Infinity, duration: 1 }}>
              <defs><radialGradient id="brain"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#6366f1"/></radialGradient></defs>
            </motion.circle>
            <text x="50" y="51" textAnchor="middle" fill="white" fontSize="3.5" fontWeight="900">🧠</text>
          </svg>
        </div>
        <div className="mt-2 bg-slate-800 rounded-xl p-3">
          <motion.p key={tick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-purple-300 font-mono">
            ▶ {THOUGHTS[tick % THOUGHTS.length]}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

// 2. Realtime Ecosystem Power Grid
export function EcosystemPowerGridPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 800); return () => clearInterval(t); }, []);
  const MODULES = [
    { name:'Owner Dashboard',  load:() => 62 + tick % 18, color:'#6366f1' },
    { name:'Vet Dashboard',    load:() => 44 + tick % 22, color:'#14b8a6' },
    { name:'Admin Dashboard',  load:() => 55 + tick % 15, color:'#a855f7' },
    { name:'AI Engine',        load:() => 78 + tick % 12, color:'#ef4444' },
    { name:'Marketplace',      load:() => 38 + tick % 20, color:'#10b981' },
    { name:'Notification Svc', load:() => 25 + tick % 14, color:'#f59e0b' },
    { name:'Data Sync',        load:() => 65 + tick % 10, color:'#ec4899' },
    { name:'Media CDN',        load:() => 42 + tick % 16, color:'#0ea5e9' },
  ];
  const total = MODULES.reduce((s, m) => s + m.load(), 0);
  const avg = Math.round(total / MODULES.length);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#020617,#0f172a,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">⚡ Infrastructure Intelligence</span>
        <h2 className="text-2xl font-black mt-2">Realtime Ecosystem Power Grid</h2>
        <p className="text-indigo-200 text-sm mt-1">Live power flow and operational load across all platform modules — updates every 800ms.</p>
        <div className="flex gap-6 mt-4">
          {[['Avg Load', avg + '%'], ['Peak Module', 'AI Engine'], ['Grid Status', 'Nominal'], ['Uptime', '99.97%']].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-300">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-end gap-3 h-32 mb-4">
          {MODULES.map((m, i) => (
            <div key={m.name} className="flex-1 flex flex-col items-center gap-1 group relative">
              <motion.div className="w-full rounded-t-lg" style={{ background: m.color }}
                animate={{ height: `${m.load()}%` }} transition={{ duration: 0.4 }} />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 z-10">
                {m.name}: {m.load()}%
              </div>
              <span className="text-[8px] text-slate-400 text-center leading-tight">{m.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {MODULES.map((m, i) => (
            <div key={m.name} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 w-36 flex-shrink-0">{m.name}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <motion.div className="h-2 rounded-full" style={{ background: m.color }}
                  animate={{ width: `${m.load()}%` }} transition={{ duration: 0.5 }} />
              </div>
              <motion.span key={tick} className="text-xs font-extrabold w-10 text-right" style={{ color: m.color }}>{m.load()}%</motion.span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Smart Revenue Constellation
export function RevenueConstellationPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1200); return () => clearInterval(t); }, []);
  const orders = P('ownerOrders');
  const liveRev = orders.reduce((s, o) => s + (o.total || 0), 0);
  const STREAMS = [
    { name:'Subscriptions', val:182400, color:'#6366f1', x:35, y:30, size:50 },
    { name:'Marketplace',   val:74800 + liveRev, color:'#10b981', x:70, y:40, size:42 },
    { name:'Consultations', val:58200, color:'#14b8a6', x:20, y:65, size:38 },
    { name:'Insurance',     val:24600, color:'#ec4899', x:60, y:72, size:30 },
    { name:'Premium Plans', val:41000, color:'#f59e0b', x:80, y:22, size:28 },
  ];
  const total = STREAMS.reduce((s, r) => s + r.val, 0);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#020617,#1e1b4b,#f59e0b)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">✨ Financial Universe</span>
        <h2 className="text-2xl font-black mt-2">Smart Revenue Constellation</h2>
        <p className="text-amber-200 text-sm mt-1">Revenue streams visualized as animated galaxy constellations — live marketplace data synced.</p>
        <div className="flex gap-6 mt-4">
          {[['Total Revenue', '₹' + total.toLocaleString('en-IN')], ['Live Orders', orders.length], ['Live Revenue', '₹' + liveRev.toLocaleString()]].map(([l, v]) => (
            <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-amber-300">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'radial-gradient(ellipse at center,#1e1b4b 0%,#020617 100%)', minHeight: 300 }}>
        <svg className="w-full" viewBox="0 0 100 100" style={{ height: 300 }}>
          {[...Array(40)].map((_, i) => (
            <circle key={i} cx={Math.random() * 100} cy={Math.random() * 100} r="0.3" fill="white" opacity={Math.random() * 0.6 + 0.1} />
          ))}
          {STREAMS.map((s, i) => STREAMS.slice(i + 1).map((s2, j) => (
            <motion.line key={j} x1={s.x} y1={s.y} x2={s2.x} y2={s2.y}
              stroke={s.color} strokeOpacity={0.2} strokeWidth="0.3"
              animate={{ strokeOpacity: [0.1, 0.4, 0.1] }} transition={{ repeat: Infinity, duration: 3, delay: (i + j) * 0.5 }} />
          )))}
          {STREAMS.map((s, i) => (
            <g key={s.name}>
              <motion.circle cx={s.x} cy={s.y} r={s.size / 14}
                fill={s.color} fillOpacity={0.2} stroke={s.color} strokeWidth="0.6"
                animate={{ r: [s.size / 14, s.size / 12, s.size / 14], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }} />
              <text x={s.x} y={s.y + 1} textAnchor="middle" fill="white" fontSize="4.5" fontWeight="bold">
                ₹{Math.round(s.val / 1000)}K
              </text>
              <text x={s.x} y={s.size / 14 + s.y + 3} textAnchor="middle" fill={s.color} fontSize="3">{s.name}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// 4. AI Platform Mood Analyzer
export function PlatformMoodPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2500); return () => clearInterval(t); }, []);
  const feed   = P('globalFeed');
  const reviews = P('vetReviews');
  const SEGMENTS = [
    { label:'Owners',  score:88 + tick % 5, emoji:'😊', color:'#6366f1' },
    { label:'Vets',    score:82 + tick % 4, emoji:'😌', color:'#14b8a6' },
    { label:'Admins',  score:91,            emoji:'😄', color:'#10b981' },
    { label:'Reviews', score:reviews.length > 0 ? Math.min(98, 75 + reviews.length * 2) : 79, emoji:'⭐', color:'#f59e0b' },
  ];
  const avg = Math.round(SEGMENTS.reduce((s, seg) => s + seg.score, 0) / SEGMENTS.length);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#ec4899,#8b5cf6,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">😊 User Sentiment</span>
        <h2 className="text-2xl font-black mt-2">AI Platform Mood Analyzer</h2>
        <p className="text-pink-100 text-sm mt-1">Overall platform emotional engagement and satisfaction — aggregated from reviews, activity, and interactions.</p>
        <div className="flex gap-6 mt-4">
          {[['Platform Mood', avg + '%'], ['Feed Events', feed.length], ['Reviews', reviews.length], ['Sentiment', avg > 80 ? '😄 Positive' : '😐 Neutral']].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-pink-200">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SEGMENTS.map((seg, i) => (
          <motion.div key={seg.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: seg.color + '15' }}>{seg.emoji}</div>
            <div className="flex-1">
              <p className="font-extrabold text-slate-800">{seg.label}</p>
              <div className="mt-1 bg-slate-100 rounded-full h-2">
                <motion.div className="h-2 rounded-full" style={{ background: seg.color }}
                  animate={{ width: `${seg.score}%` }} transition={{ duration: 0.5 }} />
              </div>
            </div>
            <motion.p key={tick} className="text-2xl font-extrabold flex-shrink-0" style={{ color: seg.color }}>{seg.score}%</motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 5. AI Super Intelligence Observatory
export function IntelObservatoryPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1000); return () => clearInterval(t); }, []);
  const feed   = P('globalFeed').length;
  const emerg  = P('platformEmergencies').length;
  const orders = P('ownerOrders').length;
  const walks  = P('petWalks').length;
  const SIGNALS = [
    { label:'AI Events', val:() => feed + tick * 2,       color:'#a855f7' },
    { label:'Ecosystem Load', val:() => 62 + tick % 15 + '%', color:'#6366f1' },
    { label:'Safety Index', val:() => Math.max(60, 95 - emerg * 5) + '%', color:'#10b981' },
    { label:'Revenue Pulse', val:() => orders * 299 + 124500, color:'#f59e0b' },
    { label:'Activity Score', val:() => Math.min(99, 50 + walks * 5), color:'#14b8a6' },
    { label:'AI Confidence', val:() => 94 + tick % 5 + '%', color:'#ec4899' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#020617,#0f172a,#7c3aed)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔭 Master Intelligence</span>
        <h2 className="text-2xl font-black mt-2">AI Super Intelligence Observatory</h2>
        <p className="text-purple-200 text-sm mt-1">Futuristic observatory-style control center — all ecosystem signals, predictions, and analytics in one view.</p>
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-extrabold">🔭 Live Signal Observatory</p>
          <motion.span className="text-[10px] font-bold px-3 py-1 rounded-full bg-purple-900 text-purple-300 border border-purple-700"
            animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>● SCANNING</motion.span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SIGNALS.map((s, i) => (
            <motion.div key={s.label} className="rounded-2xl p-4 border"
              style={{ background: s.color + '10', borderColor: s.color + '33' }}
              animate={{ boxShadow: [`0 0 0px ${s.color}00`, `0 0 16px ${s.color}44`, `0 0 0px ${s.color}00`] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.35 }}>
              <motion.div className="w-1.5 h-1.5 rounded-full mb-2" style={{ background: s.color }}
                animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }} />
              <motion.p key={tick} className="text-xl font-extrabold text-white">{s.val()}</motion.p>
              <p className="text-xs mt-0.5 font-bold" style={{ color: s.color }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 bg-slate-800 rounded-xl p-3">
          <div className="flex items-end gap-0.5 h-8">
            {Array.from({ length: 40 }, (_, i) => (
              <motion.div key={i} className="flex-1 rounded-t" style={{ background: '#7c3aed', opacity: 0.4 + (i / 40) * 0.6 }}
                animate={{ height: `${20 + Math.sin(i * 0.4 + tick * 0.8) * 40 + 40}%` }} transition={{ duration: 0.4 }} />
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 text-center">Realtime ecosystem signal waveform</p>
        </div>
      </div>
    </div>
  );
}
