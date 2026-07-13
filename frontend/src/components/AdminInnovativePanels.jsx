import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, AlertTriangle, Shield, TrendingUp, Eye, Activity,
  Users, CheckCircle, X, Zap, FileText, Brain, AlertCircle,
  BarChart3, ShieldAlert, Search, Clock
} from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';
const GRAD_RED = 'linear-gradient(135deg,#ef4444,#f97316)';

/* ── 1. National Pet Health Intelligence Map ──────────────────────────────────── */
export const NationalHealthMapPanel = () => {
  const [tab, setTab] = useState('map');
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [liveUpdates, setLiveUpdates] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setLiveUpdates(n => n + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const CITIES = [
    { name: 'Bengaluru', state: 'Karnataka', x: 140, y: 220, vacCoverage: 68, emergencies: 12, diseases: ['Parvovirus', 'Rabies'], petCount: 48200, trend: 'stable' },
    { name: 'Mumbai', state: 'Maharashtra', x: 100, y: 160, vacCoverage: 72, emergencies: 8, diseases: ['Distemper', 'Leptospirosis'], petCount: 62100, trend: 'improving' },
    { name: 'Delhi', state: 'NCT', x: 155, y: 75, vacCoverage: 81, emergencies: 5, diseases: ['Kennel Cough'], petCount: 55800, trend: 'improving' },
    { name: 'Chennai', state: 'Tamil Nadu', x: 170, y: 240, vacCoverage: 59, emergencies: 18, diseases: ['Parvovirus', 'Ehrlichiosis'], petCount: 38400, trend: 'critical' },
    { name: 'Hyderabad', state: 'Telangana', x: 155, y: 200, vacCoverage: 63, emergencies: 14, diseases: ['Distemper'], petCount: 41200, trend: 'declining' },
    { name: 'Kolkata', state: 'West Bengal', x: 220, y: 130, vacCoverage: 55, emergencies: 22, diseases: ['Rabies', 'Parvovirus', 'Mange'], petCount: 34500, trend: 'critical' },
    { name: 'Pune', state: 'Maharashtra', x: 108, y: 175, vacCoverage: 76, emergencies: 6, diseases: ['Distemper'], petCount: 29700, trend: 'stable' },
    { name: 'Ahmedabad', state: 'Gujarat', x: 90, y: 130, vacCoverage: 70, emergencies: 9, diseases: ['Parvovirus'], petCount: 31200, trend: 'improving' },
  ];

  const coverageColor = c => c >= 75 ? '#10b981' : c >= 60 ? '#f59e0b' : '#ef4444';
  const trendIcon = t => ({ improving: '📈', stable: '➡️', declining: '📉', critical: '🚨' }[t] || '➡️');
  const trendColor = t => ({ improving: '#10b981', stable: '#6366f1', declining: '#f59e0b', critical: '#ef4444' }[t]);

  const NATIONAL_STATS = [
    { label: 'Registered Pets', value: '4.2M', icon: '🐾', color: '#6366f1' },
    { label: 'Vaccination Rate', value: '67.4%', icon: '💉', color: '#10b981' },
    { label: 'Active Emergencies', value: '94', icon: '🚨', color: '#ef4444' },
    { label: 'Disease Hotspots', value: '23', icon: '🔥', color: '#f97316' },
    { label: 'Partner Clinics', value: '2,841', icon: '🏥', color: '#14b8a6' },
    { label: 'Health Records', value: '12.6M', icon: '📋', color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0c1445,#1e3a8a,#1e1b4b)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200"><path d="M40,20 L160,20 L180,80 L160,160 L40,160 L20,80 Z" fill="white" /></svg>
        </div>
        <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">🗺️ Health Analytics Center</p>
        <h2 className="text-3xl font-black mb-1">National Pet Health Intelligence Map</h2>
        <p className="text-blue-200 text-sm mb-4">Real-time disease hotspots, vaccination coverage, and emergency incidents across India</p>
        <div className="flex gap-6">
          {NATIONAL_STATS.slice(0, 4).map(s => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-blue-300">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
          LIVE · {liveUpdates} updates
        </div>
      </div>

      {/* National stats grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {NATIONAL_STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="font-black text-slate-900 text-lg">{s.value}</p>
            <p className="text-[10px] text-slate-500 font-semibold leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-2xl p-1">
        {[['map', '🗺️ Health Map'], ['diseases', '🦠 Disease Hotspots'], ['coverage', '💉 Vaccination Coverage'], ['emergencies', '🚨 Emergency Tracker']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === k ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'map' && (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Map */}
              <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-6 relative overflow-hidden">
                <p className="font-extrabold text-white mb-4">🇮🇳 India Pet Health Intelligence Map</p>
                <svg viewBox="0 0 360 320" className="w-full max-h-72">
                  <rect width="360" height="320" fill="#0f172a" rx="12" />
                  {/* Simplified India outline */}
                  <path d="M80,40 L200,30 L260,60 L270,90 L250,130 L240,190 L210,240 L190,280 L170,260 L150,290 L130,270 L110,240 L90,200 L60,160 L50,120 L60,80 Z"
                    fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  {/* Cities */}
                  {CITIES.map((c, i) => (
                    <g key={i} onClick={() => setSelected(selected?.name === c.name ? null : c)} style={{ cursor: 'pointer' }}>
                      <motion.circle cx={c.x} cy={c.y} r={Math.sqrt(c.petCount / 800) + 6}
                        fill={coverageColor(c.vacCoverage)} opacity={0.25}
                        animate={{ r: [Math.sqrt(c.petCount / 800) + 6, Math.sqrt(c.petCount / 800) + 14, Math.sqrt(c.petCount / 800) + 6] }}
                        transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }} />
                      <circle cx={c.x} cy={c.y} r="8" fill={coverageColor(c.vacCoverage)} stroke="white" strokeWidth="1.5" />
                      {c.trend === 'critical' && (
                        <motion.circle cx={c.x} cy={c.y} r="14" fill="none" stroke="#ef4444" strokeWidth="2"
                          animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                      )}
                      <text x={c.x + 12} y={c.y + 4} fill="white" fontSize="9" fontWeight="bold">{c.name}</text>
                      <text x={c.x} y={c.y + 4} textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">{c.vacCoverage}%</text>
                    </g>
                  ))}
                </svg>
                <div className="flex gap-4 mt-3 flex-wrap">
                  {[['≥75% — Good', '#10b981'], ['60-74% — Fair', '#f59e0b'], ['<60% — Critical', '#ef4444']].map(([l, c]) => (
                    <div key={l} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <div className="w-3 h-3 rounded-full" style={{ background: c }} />{l}
                    </div>
                  ))}
                </div>
              </div>
              {/* City detail */}
              <div className="space-y-3">
                {selected ? (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-extrabold text-slate-800 text-lg">{selected.name}</p>
                        <p className="text-slate-400 text-sm">{selected.state}</p>
                      </div>
                      <button onClick={() => setSelected(null)}><X className="w-4 h-4 text-slate-400" /></button>
                    </div>
                    <div className="space-y-3">
                      {[
                        ['Vaccination Coverage', `${selected.vacCoverage}%`, coverageColor(selected.vacCoverage)],
                        ['Registered Pets', selected.petCount.toLocaleString(), '#6366f1'],
                        ['Active Emergencies', selected.emergencies, '#ef4444'],
                        ['Health Trend', `${trendIcon(selected.trend)} ${selected.trend}`, trendColor(selected.trend)],
                      ].map(([l, v, c]) => (
                        <div key={l} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5">
                          <span className="text-xs font-bold text-slate-500">{l}</span>
                          <span className="font-extrabold text-sm" style={{ color: c }}>{v}</span>
                        </div>
                      ))}
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-2">Active Disease Alerts</p>
                        {selected.diseases.map(d => (
                          <span key={d} className="inline-block text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full mr-1 mb-1">{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-center text-slate-400 text-sm">
                    Click a city on the map to view detailed health intelligence
                  </div>
                )}
                <div className="space-y-2">
                  <p className="font-bold text-slate-700 text-sm">🚨 Active Hotspots</p>
                  {CITIES.filter(c => c.trend === 'critical' || c.trend === 'declining').map(c => (
                    <div key={c.name} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl cursor-pointer hover:bg-red-100 transition" onClick={() => setSelected(c)}>
                      <span className="text-red-500 text-lg">🔴</span>
                      <div>
                        <p className="font-bold text-red-800 text-xs">{c.name} — {c.trend === 'critical' ? 'CRITICAL' : 'Declining'}</p>
                        <p className="text-red-600 text-[10px]">{c.diseases.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {(tab === 'diseases' || tab === 'coverage' || tab === 'emergencies') && (
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              {tab === 'diseases' && (
                <>
                  <h3 className="font-extrabold text-slate-800 mb-5">🦠 Disease Hotspot Intelligence</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { disease: 'Canine Parvovirus', cities: ['Kolkata', 'Chennai', 'Bengaluru'], severity: 'High', cases: 234, trend: '+12%' },
                      { disease: 'Rabies', cities: ['Kolkata', 'Mumbai', 'Bengaluru'], severity: 'Critical', cases: 18, trend: '-5%' },
                      { disease: 'Distemper', cities: ['Hyderabad', 'Pune', 'Mumbai'], severity: 'Medium', cases: 156, trend: '+3%' },
                      { disease: 'Leptospirosis', cities: ['Mumbai', 'Kolkata'], severity: 'High', cases: 87, trend: '+18%' },
                    ].map((d, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-extrabold text-slate-800">{d.disease}</p>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: d.severity === 'Critical' ? '#fef2f2' : d.severity === 'High' ? '#fff7ed' : '#f0fdf4', color: d.severity === 'Critical' ? '#dc2626' : d.severity === 'High' ? '#ea580c' : '#16a34a' }}>{d.severity}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{d.cases} active cases · <span className={d.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'} >{d.trend} vs last month</span></p>
                        <div className="flex gap-1 flex-wrap">
                          {d.cities.map(c => <span key={c} className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{c}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {tab === 'coverage' && (
                <>
                  <h3 className="font-extrabold text-slate-800 mb-5">💉 Vaccination Coverage by City</h3>
                  <div className="space-y-3">
                    {[...CITIES].sort((a, b) => a.vacCoverage - b.vacCoverage).map(c => (
                      <div key={c.name} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-700 w-28 flex-shrink-0">{c.name}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-3">
                          <motion.div className="h-3 rounded-full" style={{ background: coverageColor(c.vacCoverage) }}
                            initial={{ width: 0 }} animate={{ width: `${c.vacCoverage}%` }} transition={{ duration: 0.8, delay: 0.1 }} />
                        </div>
                        <span className="font-extrabold text-sm w-12 text-right" style={{ color: coverageColor(c.vacCoverage) }}>{c.vacCoverage}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {tab === 'emergencies' && (
                <>
                  <h3 className="font-extrabold text-slate-800 mb-5">🚨 Emergency Incident Tracker</h3>
                  <div className="space-y-3">
                    {[...CITIES].sort((a, b) => b.emergencies - a.emergencies).map(c => (
                      <div key={c.name} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold flex-shrink-0" style={{ background: c.emergencies > 15 ? GRAD_RED : GRAD }}>
                          {c.emergencies}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.diseases.join(' · ')}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: trendColor(c.trend) + '22', color: trendColor(c.trend) }}>
                          {trendIcon(c.trend)} {c.trend}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── 2. AI Fraud Detection Engine ─────────────────────────────────────────────── */
export const AIFraudDetectionPanel = () => {
  const [tab, setTab] = useState('threats');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [threatFeed, setThreatFeed] = useState([]);
  const [threatCount, setThreatCount] = useState(7);

  useEffect(() => {
    setThreatFeed([
      { id: 1, type: 'Fake Vet Profile', severity: 'Critical', user: 'dr.unknown@mail.com', flag: 'No license match, profile created 2 days ago, 12 fake reviews', time: '5m ago', status: 'flagged' },
      { id: 2, type: 'Fraudulent Prescription', severity: 'High', user: 'vet_prasad_x', flag: 'Prescription for controlled substance to 8 pets in 1 hour', time: '22m ago', status: 'under review' },
      { id: 3, type: 'Suspicious Transaction', severity: 'Medium', user: 'owner_1847', flag: 'Multiple ₹4,999 payments from different cards within 10 minutes', time: '1h ago', status: 'investigating' },
      { id: 4, type: 'Fake Reviews', severity: 'Medium', user: 'Dr. Ankit K.', flag: '18 5-star reviews posted from same IP range in 24h', time: '3h ago', status: 'blocked' },
      { id: 5, type: 'Bot Account', severity: 'Low', user: 'user_auto_4421', flag: 'Automated signup pattern detected, no human interaction', time: '6h ago', status: 'suspended' },
    ]);
    const interval = setInterval(() => {
      setThreatCount(n => n + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const runScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setScanResult({
        score: 94.2, threats: 7, suspicious: 12, clean: 2841,
        breakdown: [
          { cat: 'Fake Veterinarians', count: 2, risk: 'Critical' },
          { cat: 'Fraudulent Prescriptions', count: 1, risk: 'High' },
          { cat: 'Suspicious Transactions', count: 3, risk: 'Medium' },
          { cat: 'Fake Reviews', count: 1, risk: 'Medium' },
        ]
      });
      setScanning(false);
    }, 3000);
  };

  const sevColor = { Critical: '#dc2626', High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
  const statusColor = { flagged: '#ef4444', 'under review': '#f59e0b', investigating: '#6366f1', blocked: '#dc2626', suspended: '#94a3b8' };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)' }}>
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} className="absolute text-green-400/10 text-xs font-mono"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}>
              {Math.random() > 0.5 ? '01' : '10'}
            </motion.div>
          ))}
        </div>
        <div className="relative z-10">
          <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">🛡️ Security Center</p>
          <h2 className="text-3xl font-black mb-1">AI Fraud Detection Engine</h2>
          <p className="text-indigo-200 text-sm mb-4">Real-time detection of fake vets, fraudulent prescriptions, suspicious transactions, and fake reviews</p>
          <div className="flex gap-6">
            {[['Threats Detected', threatCount, '#ef4444'], ['Platform Trust Score', '94.2%', '#10b981'], ['Accounts Monitored', '3,248', '#60a5fa'], ['Auto-Blocked Today', '3', '#f97316']].map(([l, v, c]) => (
              <div key={l}><p className="text-xl font-black" style={{ color: c }}>{v}</p><p className="text-xs text-indigo-300">{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-2xl p-1">
        {[['threats', '🚨 Live Threat Feed'], ['scan', '🔍 Run Security Scan'], ['rules', '📋 Detection Rules']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === k ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'threats' && (
          <motion.div key="threats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {threatFeed.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: sevColor[t.severity] + '44' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <AlertTriangle className="w-4 h-4" style={{ color: sevColor[t.severity] }} />
                      <p className="font-extrabold text-slate-900">{t.type}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: sevColor[t.severity] + '18', color: sevColor[t.severity] }}>{t.severity}</span>
                    </div>
                    <p className="text-sm text-slate-500">Account: <span className="font-bold text-slate-700">{t.user}</span></p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-full capitalize" style={{ background: statusColor[t.status] + '18', color: statusColor[t.status] }}>{t.status}</span>
                    <p className="text-[10px] text-slate-400 mt-1">{t.time}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-100">🤖 AI Flag: {t.flag}</p>
                <div className="flex gap-2 mt-3">
                  {['Block Account', 'Investigate', 'Dismiss'].map(a => (
                    <button key={a} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${a === 'Block Account' ? 'bg-red-50 text-red-600 hover:bg-red-100' : a === 'Investigate' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === 'scan' && (
          <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
              <AnimatePresence mode="wait">
                {!scanning && !scanResult && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Shield className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
                    <h3 className="font-extrabold text-slate-800 text-xl mb-2">Run Full Security Scan</h3>
                    <p className="text-slate-500 text-sm mb-6">AI will analyze all platform activity for fraudulent patterns, fake accounts, and suspicious behavior</p>
                    <button onClick={runScan} className="px-8 py-3 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-0.5" style={{ background: GRAD }}>
                      🔍 Start Security Scan
                    </button>
                  </motion.div>
                )}
                {scanning && (
                  <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="mx-auto w-16 h-16 mb-4">
                      <Shield className="w-16 h-16 text-indigo-500" />
                    </motion.div>
                    <p className="font-extrabold text-slate-800 mb-2">AI Scanning Platform...</p>
                    <div className="space-y-2 text-sm">
                      {['Analyzing 3,248 user accounts...', 'Cross-referencing vet licenses...', 'Scanning prescription patterns...', 'Checking review authenticity...'].map((s, i) => (
                        <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.6 }} className="text-slate-500">
                          <motion.span animate={{ opacity: [0, 1] }} transition={{ delay: i * 0.6 }}>✓ </motion.span>{s}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                )}
                {scanResult && (
                  <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: GRAD }}>
                        <span className="text-white font-black text-2xl">{scanResult.score}%</span>
                      </div>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-xl mb-1">Scan Complete — Platform Trust Score</h3>
                    <p className="text-slate-500 text-sm mb-4">Found {scanResult.threats} threats, {scanResult.suspicious} suspicious, {scanResult.clean} clean accounts</p>
                    <div className="grid grid-cols-2 gap-3 text-left">
                      {scanResult.breakdown.map((b, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <p className="font-bold text-slate-800 text-sm">{b.cat}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-2xl font-black text-slate-900">{b.count}</span>
                            <span className="text-xs font-bold" style={{ color: sevColor[b.risk] }}>{b.risk}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setScanResult(null)} className="mt-4 px-6 py-2.5 text-white font-bold rounded-xl" style={{ background: GRAD }}>
                      Scan Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {tab === 'rules' && (
          <motion.div key="rules" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '👨‍⚕️', title: 'Fake Vet Detection', rules: ['License verification against medical board DB', 'Profile creation date vs. first appointment gap', 'Review velocity analysis (>5 reviews/day = flag)', 'AI face match against uploaded credentials'], active: true },
                { icon: '💊', title: 'Prescription Fraud', rules: ['Drug-to-pet ratio anomaly detection', 'Controlled substance prescription frequency', 'Cross-vet prescription duplication check', 'Time-of-day prescription pattern analysis'], active: true },
                { icon: '💳', title: 'Transaction Fraud', rules: ['Multiple cards on single IP detection', 'Payment velocity > ₹50K/hour = flag', 'Geo-anomaly on payment origin', 'Chargeback pattern tracking'], active: true },
                { icon: '⭐', title: 'Fake Review Detection', rules: ['IP cluster analysis for review sources', 'Review text similarity scoring (NLP)', 'Account age vs. review count check', 'Sudden rating spike detection'], active: true },
              ].map((r, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{r.icon}</span>
                    <p className="font-extrabold text-slate-800">{r.title}</p>
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${r.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{r.active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="space-y-1.5">
                    {r.rules.map((rule, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
