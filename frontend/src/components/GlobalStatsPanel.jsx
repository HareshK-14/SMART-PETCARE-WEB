import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Activity, Users, TrendingUp, Map,
  Cpu, Wifi, Zap, ChevronRight, BarChart2, Heart, Clock
} from 'lucide-react';
import { db, useSync, logActivity } from '../utils/dataBridge';

/* ── Static simulation data ───────────────────────────────────── */
const WORLD_REGIONS = [
  { id:'IN', name:'India',          pets:1842, vets:142, dau:2400, color:'#6366f1', x:65, y:45, active:true  },
  { id:'US', name:'United States',  pets:3210, vets:280, dau:5100, color:'#14b8a6', x:20, y:30, active:true  },
  { id:'GB', name:'United Kingdom', pets: 921, vets: 74, dau:1200, color:'#8b5cf6', x:45, y:22, active:true  },
  { id:'AU', name:'Australia',      pets: 640, vets: 48, dau: 890, color:'#10b981', x:80, y:68, active:true  },
  { id:'CA', name:'Canada',         pets: 780, vets: 62, dau:1050, color:'#f59e0b', x:18, y:22, active:true  },
  { id:'DE', name:'Germany',        pets: 540, vets: 44, dau: 720, color:'#ec4899', x:50, y:24, active:false },
  { id:'BR', name:'Brazil',         pets: 430, vets: 36, dau: 580, color:'#3b82f6', x:30, y:60, active:false },
  { id:'SG', name:'Singapore',      pets: 310, vets: 28, dau: 420, color:'#14b8a6', x:75, y:52, active:false },
];

const DISEASE_HEATMAP = [
  { disease:'Parvo Virus',      severity:'high',    regions:['India','Brazil'],        cases:42,  trend:'+8' },
  { disease:'Canine Flu',       severity:'medium',  regions:['United States','Canada'], cases:128, trend:'-12'},
  { disease:'Feline Herpes',    severity:'medium',  regions:['United Kingdom','Germany'],cases:67, trend:'+3' },
  { disease:'Tick Fever',       severity:'high',    regions:['India','Australia'],     cases:89,  trend:'+15'},
  { disease:'Kennel Cough',     severity:'low',     regions:['Global'],                cases:234, trend:'-5' },
  { disease:'Ringworm (Fungal)',severity:'low',     regions:['Singapore','Australia'], cases:34,  trend:'0'  },
];

const HEALTH_METRICS = [
  { label:'API Uptime',      value:99.97, unit:'%',  color:'#10b981', sparkData:[99.8,99.9,99.97,99.95,99.98,99.97,99.97] },
  { label:'Avg Latency',     value:42,    unit:'ms', color:'#6366f1', sparkData:[55,50,48,46,44,43,42] },
  { label:'Error Rate',      value:0.03,  unit:'%',  color:'#f59e0b', sparkData:[0.12,0.09,0.07,0.06,0.05,0.04,0.03] },
  { label:'Throughput',      value:12800, unit:'/s', color:'#14b8a6', sparkData:[9000,10200,10800,11400,12000,12400,12800] },
];

const SIMULATED_FEED_ITEMS = [
  { id:'sf1', user:'Dr. Priya',  action:'Completed emergency consultation for Bruno',    icon:'🩺', type:'vet',   time:'just now'  },
  { id:'sf2', user:'Harish K.',  action:'Placed premium pet food order — ₹2,400',        icon:'🛒', type:'order', time:'1m ago'    },
  { id:'sf3', user:'System AI',  action:'Detected anomaly in Luna\'s hydration pattern', icon:'🤖', type:'alert', time:'3m ago'    },
  { id:'sf4', user:'Admin',      action: "Approved Dr. Kavya Sharma's vet profile",       icon:'✅', type:'admin', time:'7m ago'    },
  { id:'sf5', user:'Priya M.',   action:'Submitted welfare report for Luna (Persian)',    icon:'📋', type:'report',time:'12m ago'   },
  { id:'sf6', user:'System',     action:'Vaccine reminder dispatched to 18 pet owners',  icon:'💉', type:'system',time:'18m ago'   },
  { id:'sf7', user:'Renu M.',    action:'Joined platform via referral code PET2026',     icon:'👤', type:'user',  time:'22m ago'   },
  { id:'sf8', user:'Dr. Arjun',  action:'Updated prescription for Luna — Prednisolone',  icon:'💊', type:'vet',   time:'31m ago'   },
];

const lerp = (a, b, t) => a + (b - a) * t;

/* ── Animated ring counter ────────────────────────────────────── */
function RingCounter({ value, max, color, label, size = 100 }) {
  const [displayed, setDisplayed] = useState(0);
  const [ringPct, setRingPct]     = useState(0);

  useEffect(() => {
    let raf, start;
    const target = value / max;
    const run = ts => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / 2000, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(lerp(0, value, ease)));
      setRingPct(lerp(0, target, ease));
      if (t < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [value, max]);

  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const filled = ringPct * circ;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${filled} ${circ}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
          filter={`url(#glow-${label})`}
          style={{ transition: 'stroke-dasharray 0.03s' }}
        />
        <text x={size/2} y={size/2 + 4} textAnchor="middle" fill="white" fontSize={size * 0.18} fontWeight="900">
          {displayed >= 1000 ? `${(displayed/1000).toFixed(1)}K` : displayed}
        </text>
      </svg>
      <p className="text-xs text-white/50 mt-1 font-semibold text-center">{label}</p>
    </div>
  );
}

/* ── Stat counter ─────────────────────────────────────────────── */
function StatCount({ target, prefix = '', suffix = '', duration = 2000 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, start;
    const run = ts => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setV(Math.round(lerp(0, target, ease)));
      if (t < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return <>{prefix}{v.toLocaleString('en-IN')}{suffix}</>;
}

/* ── Sparkline mini ───────────────────────────────────────────── */
function MiniSpark({ data, color }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * 80},${28 - ((v - min) / (max - min || 1)) * 24}`
  ).join(' ');
  return (
    <svg viewBox="0 0 80 28" className="w-16 h-6">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  );
}

/* ── Platform health ring ─────────────────────────────────────── */
function PlatformHealthRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let raf, start;
    const run = ts => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / 2200, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(lerp(0, score, ease)));
      if (t < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const rings = [
    { r: 70, color: '#6366f1', strokeW: 10, pct: score / 100 },
    { r: 54, color: '#14b8a6', strokeW: 8,  pct: 0.97 },
    { r: 40, color: '#10b981', strokeW: 6,  pct: 0.99 },
  ];
  const cx = 90, cy = 90;

  return (
    <svg viewBox="0 0 180 180" width="180" height="180">
      <defs>
        <filter id="bigGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Background halos */}
      {rings.map((ring, i) => (
        <circle key={i} cx={cx} cy={cy} r={ring.r} fill="none"
                stroke="rgba(255,255,255,0.04)" strokeWidth={ring.strokeW}/>
      ))}
      {rings.map((ring, i) => {
        const circ = 2 * Math.PI * ring.r;
        const filled = ring.pct * circ;
        return (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r={ring.r}
            fill="none" stroke={ring.color} strokeWidth={ring.strokeW}
            strokeDasharray={`${filled} ${circ}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            filter="url(#bigGlow)"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${filled} ${circ}` }}
            transition={{ duration: 1.8 + i * 0.3, ease: 'easeOut', delay: i * 0.2 }}
          />
        );
      })}
      {/* Pulse circle */}
      <motion.circle cx={cx} cy={cy} r="28" fill="#6366f1" opacity="0.15"
        animate={{ r: [24, 32, 24] }} transition={{ repeat: Infinity, duration: 2 }}/>
      <circle cx={cx} cy={cy} r="24" fill="rgba(99,102,241,0.2)"/>
      <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="22" fontWeight="900">{displayed}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#a5b4fc" fontSize="9">Health %</text>
    </svg>
  );
}

/* ── Main Component ───────────────────────────────────────────── */
export default function GlobalStatsPanel() {
  const { data } = useSync(['ownerPets', 'ownerAppts', 'globalFeed', 'pendingVets']);

  const [liveScore, setLiveScore]       = useState(94);
  const [activeRegion, setActiveRegion] = useState(null);
  const [feedItems, setFeedItems]       = useState(SIMULATED_FEED_ITEMS);
  const [dau, setDau]                   = useState(2847);
  const [mau, setMau]                   = useState(18400);
  const feedRef                         = useRef(null);

  /* Gently drift metrics */
  useEffect(() => {
    const t = setInterval(() => {
      setLiveScore(s => Math.max(88, Math.min(99, s + (Math.random() - 0.48) * 0.4)));
      setDau(d       => Math.max(2500, Math.min(3200, d + Math.round((Math.random() - 0.48) * 30))));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  /* Inject feed items from globalFeed key */
  useEffect(() => {
    const gf = data.globalFeed || [];
    if (gf.length > 0) {
      setFeedItems(prev => [
        ...gf.slice(0, 5).map(f => ({
          id: `gf-${f.id}`, user: f.user, action: f.action,
          icon: f.icon || '📌', type: f.type || 'info', time: f.time,
        })),
        ...prev,
      ].slice(0, 20));
    }
  }, [data.globalFeed]);

  const pets  = data.ownerPets     || [];
  const appts = data.ownerAppts    || [];
  const pvets = data.pendingVets   || [];

  /* Derived platform-wide stats */
  const totalPets    = WORLD_REGIONS.reduce((a, r) => a + r.pets, 0);
  const totalVets    = WORLD_REGIONS.reduce((a, r) => a + r.vets, 0);
  const totalOwners  = Math.round(totalPets * 0.82);
  const totalAppts   = appts.length + 3840;
  const retention    = 78.4;
  const avgSession   = '8m 42s';

  const typeColors = {
    vet:    '#14b8a6',
    order:  '#f59e0b',
    alert:  '#ef4444',
    admin:  '#6366f1',
    report: '#8b5cf6',
    system: '#3b82f6',
    user:   '#10b981',
    info:   '#94a3b8',
  };

  const severityColors = {
    high:   '#ef4444',
    medium: '#f59e0b',
    low:    '#10b981',
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6"
         style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a1628 0%, #060811 60%, #080a1a 100%)' }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg,#6366f1,#14b8a6)' }}>
            <Globe size={24} className="text-white"/>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Global Platform Intelligence & Health Map</h1>
            <p className="text-sm text-indigo-400/70">Live intelligence across all regions and user segments</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-300"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}
          >
            <Wifi size={12}/> LIVE
          </motion.div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-300"
               style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <Cpu size={12}/> Systems Nominal
          </div>
        </div>
      </motion.div>

      {/* ── Platform Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Heart,  label: 'Total Pets',         value: totalPets,   color: '#6366f1' },
          { icon: Users,  label: 'Registered Vets',    value: totalVets,   color: '#14b8a6' },
          { icon: Users,  label: 'Pet Owners',         value: totalOwners, color: '#8b5cf6' },
          { icon: Clock,  label: 'Total Appointments', value: totalAppts,  color: '#f59e0b' },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${color}25`,
            }}
          >
            {/* Glow */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10"
                 style={{ background: color, filter: 'blur(20px)' }}/>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                 style={{ background: `${color}20` }}>
              <Icon size={18} style={{ color }}/>
            </div>
            <p className="text-3xl font-black text-white">
              <StatCount target={value} duration={1800 + i * 200}/>
            </p>
            <p className="text-xs text-white/50 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── World Map + Platform Health + DAU/MAU ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* World Map Simulation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-3xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Map size={18} className="text-indigo-400"/>
            <h2 className="font-bold text-white">Global Coverage Map</h2>
            <span className="ml-auto text-xs text-white/30">{WORLD_REGIONS.filter(r=>r.active).length} active regions</span>
          </div>

          {/* CSS Map */}
          <div className="relative rounded-2xl overflow-hidden" style={{ height: 200, background: '#060c1a' }}>
            {/* Grid lines */}
            <div className="absolute inset-0"
                 style={{
                   backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.05) 1px,transparent 1px)',
                   backgroundSize: '40px 40px',
                 }}/>
            {/* Curved continent hints */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <ellipse cx="160" cy="100" rx="100" ry="70" fill="rgba(99,102,241,0.04)" stroke="rgba(99,102,241,0.08)" strokeWidth="1"/>
              <ellipse cx="330" cy="80"  rx="80"  ry="55" fill="rgba(99,102,241,0.04)" stroke="rgba(99,102,241,0.08)" strokeWidth="1"/>
              <ellipse cx="520" cy="90"  rx="110" ry="65" fill="rgba(99,102,241,0.04)" stroke="rgba(99,102,241,0.08)" strokeWidth="1"/>
              <ellipse cx="640" cy="136" rx="70"  ry="40" fill="rgba(99,102,241,0.04)" stroke="rgba(99,102,241,0.08)" strokeWidth="1"/>
              <ellipse cx="240" cy="120" rx="40"  ry="30" fill="rgba(99,102,241,0.04)" stroke="rgba(99,102,241,0.08)" strokeWidth="1"/>
            </svg>
            {/* Region nodes */}
            {WORLD_REGIONS.map((region, i) => (
              <motion.div
                key={region.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, type: 'spring' }}
                className="absolute cursor-pointer"
                style={{ left: `${region.x}%`, top: `${region.y}%`, transform: 'translate(-50%,-50%)' }}
                onClick={() => setActiveRegion(activeRegion?.id === region.id ? null : region)}
              >
                {/* Pulse ring */}
                {region.active && (
                  <motion.div
                    animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: region.color, width: 12, height: 12, top: -1, left: -1 }}
                  />
                )}
                <div
                  className="relative w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    background: region.color,
                    boxShadow: region.active ? `0 0 12px ${region.color}` : 'none',
                    opacity: region.active ? 1 : 0.4,
                  }}
                />
                <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[8px] font-bold whitespace-nowrap"
                      style={{ color: region.color }}>{region.id}</span>
              </motion.div>
            ))}
          </div>

          {/* Region detail tooltip */}
          <AnimatePresence>
            {activeRegion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="p-4 rounded-2xl" style={{ background: `${activeRegion.color}14`, border: `1px solid ${activeRegion.color}30` }}>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{activeRegion.name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${activeRegion.color}25`, color: activeRegion.color }}>
                      {activeRegion.active ? 'Active' : 'Passive'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {[['Pets', activeRegion.pets], ['Vets', activeRegion.vets], ['DAU', activeRegion.dau]].map(([l, v]) => (
                      <div key={l} className="text-center">
                        <p className="font-black text-white">{v.toLocaleString()}</p>
                        <p className="text-[10px] text-white/40">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Region mini bars */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {WORLD_REGIONS.slice(0, 4).map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="p-2 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${r.color}20` }}
              >
                <p className="text-sm font-black" style={{ color: r.color }}>{r.dau.toLocaleString()}</p>
                <p className="text-[9px] text-white/40 mt-0.5">{r.id} DAU</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Health Ring + Key Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-3xl p-6 flex flex-col items-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Platform Health</p>
          <PlatformHealthRing score={Math.round(liveScore)} />

          <div className="w-full mt-4 space-y-2">
            {[
              { label: 'DAU',          value: dau.toLocaleString(), sub: '+4.1% WoW', color: '#6366f1' },
              { label: 'MAU',          value: mau.toLocaleString(), sub: '+8.2% MoM', color: '#14b8a6' },
              { label: 'Retention',    value: `${retention}%`,      sub: '+1.3% QoQ', color: '#10b981' },
              { label: 'Avg Session',  value: avgSession,            sub: 'vs 7m 20s', color: '#f59e0b' },
            ].map(({ label, value, sub, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}20` }}
              >
                <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: color }}/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/40">{label}</p>
                  <p className="font-black text-white text-sm">{value}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">{sub}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Live Activity Feed + Disease Heatmap ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(20,184,166,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-teal-400"/>
            <h2 className="font-bold text-white">Live Activity Feed</h2>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="ml-auto w-2 h-2 rounded-full bg-teal-400"
            />
          </div>
          <div ref={feedRef} className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
            <AnimatePresence initial={false}>
              {feedItems.map((item, i) => {
                const color = typeColors[item.type] || '#94a3b8';
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -15, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: `${color}10`, border: `1px solid ${color}20` }}
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 leading-snug">{item.action}</p>
                      <p className="text-[10px] text-white/30 mt-0.5 font-semibold">{item.user} · {item.time}</p>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }}/>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Disease Outbreak Heatmap */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={18} className="text-red-400"/>
            <h2 className="font-bold text-white">Disease Outbreak Heatmap</h2>
            <span className="ml-auto text-xs text-white/30">Last 30 days</span>
          </div>
          <div className="space-y-2">
            {DISEASE_HEATMAP.map((d, i) => {
              const color = severityColors[d.severity];
              const trendUp = d.trend.startsWith('+');
              const trendFlat = d.trend === '0';
              return (
                <motion.div
                  key={d.disease}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                  className="p-3 rounded-xl"
                  style={{ background: `${color}10`, border: `1px solid ${color}25` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{d.disease}</span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase"
                              style={{ background: `${color}25`, color }}>
                          {d.severity}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/40 mt-0.5">{d.regions.join(' · ')}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-white">{d.cases}</p>
                      <p className="text-[10px] font-bold"
                         style={{ color: trendUp ? '#ef4444' : trendFlat ? '#94a3b8' : '#10b981' }}>
                        {d.trend} cases
                      </p>
                    </div>
                  </div>
                  {/* Cases bar */}
                  <div className="h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
                    <motion.div
                      className="h-1.5 rounded-full"
                      style={{ background: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(d.cases / 250) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.09, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── System Health Metrics Row ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(16,185,129,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Zap size={18} className="text-emerald-400"/>
          <h2 className="font-bold text-white">Infrastructure Health</h2>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-emerald-400 font-bold"
                style={{ background: 'rgba(16,185,129,0.15)' }}>All Systems Operational</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {HEALTH_METRICS.map(({ label, value, unit, color, sparkData }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.08 }}
              className="p-4 rounded-2xl"
              style={{ background: `${color}10`, border: `1px solid ${color}25` }}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-white/50 font-semibold">{label}</p>
                <MiniSpark data={sparkData} color={color}/>
              </div>
              <p className="text-2xl font-black" style={{ color }}>
                {value}{unit}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <div className="flex-1 h-1 rounded-full bg-white/10">
                  <motion.div
                    className="h-1 rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: label === 'Error Rate' ? `${value * 100}%` : `${Math.min((value / (unit === 'ms' ? 200 : unit === '/s' ? 20000 : 100)) * 100, 100)}%` }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Regional Ring stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-purple-400"/>
          <h2 className="font-bold text-white">Regional Pet Distribution</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {WORLD_REGIONS.slice(0, 5).map((region, i) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + i * 0.1, type: 'spring' }}
            >
              <RingCounter
                value={region.pets}
                max={3500}
                color={region.color}
                label={region.name}
                size={90}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
