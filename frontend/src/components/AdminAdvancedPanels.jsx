import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logGlobalActivity } from '../utils/activityFeed';
const P = n => JSON.parse(localStorage.getItem(n) || '[]');

// 1. AI Ecosystem Harmony Engine
export function EcosystemHarmonyPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1500); return () => clearInterval(t); }, []);
  const emerg  = P('platformEmergencies').filter(e => e.status !== 'resolved').length;
  const orders = P('ownerOrders').length;
  const feed   = P('globalFeed').length;
  const appts  = P('ownerAppts').length;
  const DIMS = [
    { label:'Healthcare Balance', val: Math.max(40, 90 - emerg * 10), color:'#10b981', icon:'❤️' },
    { label:'Engagement',         val: Math.min(99, 50 + feed * 2 + tick % 8), color:'#6366f1', icon:'⚡' },
    { label:'Commerce Flow',      val: Math.min(99, 40 + orders * 8), color:'#f59e0b', icon:'🛒' },
    { label:'Appointment Sync',   val: Math.min(99, 45 + appts * 6), color:'#14b8a6', icon:'📅' },
    { label:'Safety Score',       val: Math.max(50, 95 - emerg * 8), color:'#a855f7', icon:'🛡' },
    { label:'AI Harmony',         val: 88 + tick % 8,                color:'#ec4899', icon:'🧠' },
  ];
  const overall = Math.round(DIMS.reduce((s, d) => s + d.val, 0) / DIMS.length);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#10b981,#6366f1,#a855f7)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">☯ Ecosystem Balance</span>
        <h2 className="text-2xl font-black mt-2">AI Ecosystem Harmony Engine</h2>
        <p className="text-emerald-100 text-sm mt-1">Live balance between engagement, healthcare, commerce, and platform activity — synced in realtime.</p>
        <div className="flex gap-6 mt-4">
          {[['Overall Harmony', overall + '%'],['Dimensions', DIMS.length],['Status', overall > 75 ? '✅ Balanced' : '⚠️ Needs Attention']].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-emerald-200">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="grid grid-cols-2 gap-4">
          {DIMS.map((d, i) => (
            <motion.div key={d.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-3 rounded-xl border" style={{ background: d.color + '0d', borderColor: d.color + '33' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span>{d.icon}</span><p className="text-xs font-bold text-slate-700">{d.label}</p>
                <motion.p key={tick} className="ml-auto text-sm font-extrabold" style={{ color: d.color }}>{d.val}%</motion.p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <motion.div className="h-2 rounded-full" style={{ background: d.color }} animate={{ width: d.val + '%' }} transition={{ duration: 0.5 }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. AI User Behavior Constellation
export function UserBehaviorConstellationPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1200); return () => clearInterval(t); }, []);
  const orders = P('ownerOrders').length;
  const feed   = P('globalFeed').length;
  const STARS = [
    { label:'Marketplace',x:65,y:30,size:14,color:'#10b981',users:orders||8 },
    { label:'Health',     x:30,y:25,size:12,color:'#ef4444',users:24 },
    { label:'Community',  x:75,y:65,size:10,color:'#f59e0b',users:feed||62 },
    { label:'Vet Visits', x:25,y:65,size:11,color:'#6366f1',users:17 },
    { label:'AI Tools',   x:50,y:50,size:16,color:'#a855f7',users:89+tick%5 },
    { label:'Emergency',  x:50,y:80,size:8, color:'#ec4899',users:4 },
    { label:'Journal',    x:80,y:45,size:8, color:'#14b8a6',users:31 },
    { label:'Rewards',    x:20,y:45,size:9, color:'#f97316',users:55 },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#020617,#1e1b4b,#a855f7)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">✨ Engagement Intelligence</span>
        <h2 className="text-2xl font-black mt-2">AI User Behavior Constellation</h2>
        <p className="text-purple-200 text-sm mt-1">User engagement visualized as interactive constellations — live activity data mapped to stars.</p>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'radial-gradient(ellipse at center,#1e1b4b 0%,#020617 100%)', minHeight: 320 }}>
        <svg className="w-full" viewBox="0 0 100 100" style={{ height: 320 }}>
          {[...Array(40)].map((_, i) => <circle key={i} cx={Math.random()*100} cy={Math.random()*100} r="0.2" fill="white" opacity={Math.random()*0.5+0.1} />)}
          {STARS.map((s, i) => STARS.slice(i+1,i+3).map((s2,j) => (
            <motion.line key={j} x1={s.x} y1={s.y} x2={s2.x} y2={s2.y} stroke={s.color} strokeOpacity={0.2} strokeWidth="0.3"
              animate={{ strokeOpacity:[0.1,0.3,0.1] }} transition={{ repeat:Infinity, duration:3, delay:i*0.4 }} />
          )))}
          {STARS.map((s, i) => (
            <g key={s.label}>
              <motion.circle cx={s.x} cy={s.y} r={s.size/7} fill={s.color} fillOpacity={0.2} stroke={s.color} strokeWidth={0.6}
                animate={{ r:[s.size/7,s.size/6,s.size/7], opacity:[0.8,1,0.8] }} transition={{ repeat:Infinity, duration:2.5, delay:i*0.3 }} />
              <text x={s.x} y={s.y+1} textAnchor="middle" fill="white" fontSize="3.5" fontWeight="bold">{s.users}</text>
              <text x={s.x} y={s.size/7+s.y+3} textAnchor="middle" fill={s.color} fontSize="2.5">{s.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// 3. Digital Ecosystem Weather System
export function EcosystemWeatherPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);
  const emerg  = P('platformEmergencies').length;
  const orders = P('ownerOrders').length;
  const feed   = P('globalFeed').length;
  const FORECAST = [
    { label:'User Engagement',  icon: feed > 20 ? '⛈' : feed > 10 ? '⛅' : '☀️', cond: feed > 20 ? 'Storm Activity' : 'Partly Active', temp: Math.min(99,50+feed), color:'#6366f1' },
    { label:'Platform Health',  icon: emerg > 3 ? '🌧' : emerg > 0 ? '⛅' : '☀️', cond: emerg > 0 ? 'Alert Showers' : 'Clear & Stable',    temp: Math.max(40,90-emerg*8), color:'#10b981' },
    { label:'Commerce Climate', icon: orders > 5 ? '☀️' : '⛅',                   cond: orders > 5 ? 'Revenue Sunny' : 'Growing Clouds',  temp: Math.min(99,40+orders*6), color:'#f59e0b' },
    { label:'AI Atmosphere',    icon:'🌟',                                         cond:'AI Clear Skies',                                   temp: 92+tick%6, color:'#a855f7' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1,#a855f7)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌤 Platform Forecasting</span>
        <h2 className="text-2xl font-black mt-2">Digital Ecosystem Weather System</h2>
        <p className="text-sky-100 text-sm mt-1">Ecosystem activity represented as animated weather — live data drives each forecast.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {FORECAST.map((f, i) => (
          <motion.div key={f.label} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <motion.span className="text-4xl" animate={{ y:[0,-4,0] }} transition={{ repeat:Infinity, duration:2, delay:i*0.3 }}>{f.icon}</motion.span>
            <div className="flex-1">
              <p className="font-extrabold text-slate-800 text-sm">{f.label}</p>
              <p className="text-xs text-slate-400">{f.cond}</p>
              <div className="mt-1.5 bg-slate-100 rounded-full h-2">
                <motion.div className="h-2 rounded-full" style={{ background:f.color }}
                  animate={{ width:f.temp+'%' }} transition={{ duration:0.6 }} />
              </div>
            </div>
            <motion.p key={tick} className="text-xl font-extrabold flex-shrink-0" style={{ color:f.color }}>{f.temp}%</motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 4. Smart Revenue Ocean
export function RevenueOceanPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 500); return () => clearInterval(t); }, []);
  const orders = P('ownerOrders');
  const liveRev = orders.reduce((s, o) => s + (o.total || 0), 0);
  const baseRev = 380000;
  const total = baseRev + liveRev;
  const STREAMS = [
    { label:'Subscriptions', val:182400, color:'#6366f1' },
    { label:'Marketplace',   val:74800+liveRev, color:'#10b981' },
    { label:'Consultations', val:58200, color:'#14b8a6' },
    { label:'Premium Plans', val:41000, color:'#f59e0b' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background:'linear-gradient(135deg,#0ea5e9,#14b8a6,#10b981)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌊 Financial Intelligence</span>
        <h2 className="text-2xl font-black mt-2">Smart Revenue Ocean</h2>
        <p className="text-cyan-100 text-sm mt-1">Financial growth visualized as animated ocean waves — live marketplace revenue synced.</p>
        <div className="flex gap-6 mt-4">
          {[['Total Revenue','₹'+total.toLocaleString('en-IN')],['Live Orders',orders.length],['Live Rev','₹'+liveRev.toLocaleString()]].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-cyan-200">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background:'linear-gradient(to bottom,#0f2744,#0c4a6e)', minHeight:240 }}>
        <svg className="w-full" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ height:240 }}>
          {STREAMS.map((s, wi) => {
            const h = Math.round((s.val / total) * 80);
            const pts = Array.from({length:20},(_,i)=>{
              const x = i*21;
              const y = 120 - h - Math.sin((i+tick*0.4+wi*3)*0.6)*(8+wi*3);
              return `${x},${y}`;
            }).join(' L');
            return (
              <motion.path key={s.label} d={`M0,120 L${pts} L400,120 Z`} fill={s.color} opacity={0.2+wi*0.12} />
            );
          })}
          <text x="200" y="55" textAnchor="middle" fill="white" fontSize="20" fontWeight="900">₹{Math.round(total/1000)}K</text>
          <text x="200" y="72" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">TOTAL REVENUE</text>
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {STREAMS.map((s,i) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:s.color }} />
            <div className="flex-1"><p className="text-xs font-bold text-slate-700">{s.label}</p></div>
            <p className="text-sm font-extrabold" style={{ color:s.color }}>₹{Math.round(s.val/1000)}K</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Quantum Platform Intelligence Grid
export function QuantumIntelGridPanel() {
  const [tick, setTick] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 700); return () => clearInterval(t); }, []);
  const feed   = P('globalFeed').length;
  const emerg  = P('platformEmergencies').length;
  const orders = P('ownerOrders').length;
  const walks  = P('petWalks').length;
  const GRID = [
    { label:'Predictions', val:() => (94+tick%5)+'%', color:'#a855f7', icon:'🔮' },
    { label:'Sync Events', val:() => feed+tick*3,      color:'#6366f1', icon:'🔄' },
    { label:'Automation',  val:() => 'Active',         color:'#10b981', icon:'⚙️' },
    { label:'Analytics',   val:() => (4800+tick*4)+'/hr',color:'#14b8a6',icon:'📊' },
    { label:'Safety',      val:() => Math.max(60,95-emerg*5)+'%',color:'#ef4444',icon:'🛡' },
    { label:'Personalize', val:() => (orders+walks)+' ctx',color:'#f59e0b',icon:'🎯' },
    { label:'Notifications',val:() => tick%2===0?'Sending':'Ready',color:'#ec4899',icon:'🔔' },
    { label:'AI Cognition',val:() => 'Level '+Math.min(9,3+Math.floor(tick/10)),color:'#8b5cf6',icon:'🧠' },
    { label:'Quantum Load',val:() => (62+tick%15)+'%',color:'#0ea5e9',icon:'⚡' },
  ];
  const activate = () => {
    setActive(true);
    logGlobalActivity('Admin', 'Quantum Intelligence Grid fully activated', '⚛', 'ai');
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => setActive(false), 6000);
  };
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background:'linear-gradient(135deg,#020617,#0f172a,#7c3aed)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">⚛ AI Supercore</span>
        <h2 className="text-2xl font-black mt-2">Quantum Platform Intelligence Grid</h2>
        <p className="text-purple-200 text-sm mt-1">Futuristic realtime AI intelligence infrastructure — all 9 subsystems in one quantum grid.</p>
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-extrabold">⚛ Active Grid Subsystems</p>
          <button onClick={activate} disabled={active} className="px-4 py-1.5 text-white text-xs font-bold rounded-xl disabled:opacity-60" style={{ background:'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
            {active ? '⚛ Grid Hot...' : '⚛ Max Power'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {GRID.map((g, i) => (
            <motion.div key={g.label} className="rounded-xl p-3 border"
              style={{ background:g.color+'10', borderColor:g.color+'33' }}
              animate={{ boxShadow:active?[`0 0 0px ${g.color}00`,`0 0 16px ${g.color}55`,`0 0 0px ${g.color}00`]:[] }}
              transition={{ repeat:Infinity, duration:1.5, delay:i*0.15 }}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{g.icon}</span>
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background:g.color }}
                  animate={{ scale:[1,1.5,1] }} transition={{ repeat:Infinity, duration:1.2, delay:i*0.1 }} />
              </div>
              <motion.p key={tick} className="text-sm font-extrabold text-white">{g.val()}</motion.p>
              <p className="text-[9px] mt-0.5 font-bold" style={{ color:g.color }}>{g.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
