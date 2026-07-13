import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, MapPin, Heart, Users, Radio, Shield,
  CheckCircle, Clock, Navigation, Zap, Eye, Phone, Share2, X
} from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#ef4444,#f97316)';
const GRAD2 = 'linear-gradient(135deg,#6366f1,#14b8a6)';

/* ── Smart Lost Pet Rescue Network ───────────────────────────────────────────── */
export const SmartLostPetRescuePanel = () => {
  const [step, setStep] = useState('home'); // home | report | active | found
  const [pets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ownerPets') || '[]'); } catch { return []; }
  });
  const [form, setForm] = useState({ petId: '', lastSeen: '', description: '', contact: '' });
  const [activeMission, setActiveMission] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [pulse, setPulse] = useState(0);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [missionLog, setMissionLog] = useState([]);

  // Pulse animation for radar
  useEffect(() => {
    const t = setInterval(() => setPulse(p => (p + 1) % 100), 50);
    return () => clearInterval(t);
  }, []);

  // Check for existing rescue missions
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem('activePetRescue') || 'null');
    if (existing) {
      setActiveMission(existing);
      setStep('active');
      simulateNetwork(existing);
    }
  }, []);

  const simulateNetwork = (mission) => {
    const nearbyVols = [
      { id: 1, name: 'Ravi Kumar', dist: '0.3 km', status: 'Searching', avatar: 'R', color: '#10b981' },
      { id: 2, name: 'Priya S.', dist: '0.7 km', status: 'En route', avatar: 'P', color: '#6366f1' },
      { id: 3, name: 'Dr. Arjun', dist: '1.1 km', status: 'On standby', avatar: 'A', color: '#f59e0b' },
      { id: 4, name: 'Sita R.', dist: '1.4 km', status: 'Alerted', avatar: 'S', color: '#14b8a6' },
    ];
    setVolunteers(nearbyVols);
    const ai = {
      zones: [
        { label: 'High probability', desc: 'Near last GPS ping — Park area', pct: 78, color: '#ef4444' },
        { label: 'Medium probability', desc: '2 blocks east — Market street', pct: 54, color: '#f59e0b' },
        { label: 'Low probability', desc: 'Shelter zone — 1.2 km away', pct: 23, color: '#10b981' },
      ],
      tip: `Based on ${mission?.petName || 'pet'}'s movement history, AI predicts 78% chance within 500m of last location. Check shaded areas, narrow alleys and parks first.`
    };
    setAiPrediction(ai);
    setMissionLog([
      { time: '09:02', msg: '🚨 Rescue mission activated', color: '#ef4444' },
      { time: '09:03', msg: '📡 Alert sent to 24 nearby users', color: '#6366f1' },
      { time: '09:04', msg: '🏥 3 nearby vets notified', color: '#14b8a6' },
      { time: '09:05', msg: '🤖 AI location prediction ready', color: '#f59e0b' },
      { time: '09:07', msg: '👥 4 volunteers accepted rescue', color: '#10b981' },
    ]);
    setAlerts([
      { id: 1, type: 'sighting', msg: 'Possible sighting reported 3 min ago near Park Gate', time: '3m' },
      { id: 2, type: 'vet', msg: 'Dr. Priya clinic placed on standby', time: '5m' },
    ]);
  };

  const handleReport = () => {
    if (!form.lastSeen) return;
    const pet = pets.find(p => p.id === form.petId) || { name: 'My Pet', breed: 'Unknown' };
    const mission = {
      id: Date.now(),
      petName: pet.name,
      breed: pet.breed,
      lastSeen: form.lastSeen,
      description: form.description,
      contact: form.contact,
      startedAt: new Date().toISOString(),
      status: 'active',
    };
    localStorage.setItem('activePetRescue', JSON.stringify(mission));
    window.dispatchEvent(new Event('storage'));
    setActiveMission(mission);
    setStep('active');
    simulateNetwork(mission);
  };

  const handleResolved = (found) => {
    localStorage.removeItem('activePetRescue');
    window.dispatchEvent(new Event('storage'));
    setStep(found ? 'found' : 'home');
    setActiveMission(null);
  };

  const ZONE_COLORS = ['rgba(239,68,68,0.25)', 'rgba(245,158,11,0.18)', 'rgba(20,184,166,0.13)'];

  if (step === 'found') return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-emerald-200 p-12 text-center max-w-lg mx-auto">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-3xl font-black text-emerald-700 mb-2">Pet Found Safe!</h2>
      <p className="text-emerald-600 mb-6">Thank you to all volunteers and vets who helped in the rescue mission.</p>
      <button onClick={() => setStep('home')} className="px-6 py-3 rounded-2xl text-white font-bold" style={{ background: GRAD2 }}>
        Back to Dashboard
      </button>
    </motion.div>
  );

  if (step === 'active' && activeMission) return (
    <div className="space-y-5 max-w-5xl">
      {/* Mission Header */}
      <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: GRAD }}>
        <div className="absolute inset-0 opacity-20">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="absolute rounded-full border-2 border-white"
              style={{ width: 200 + i * 100, height: 200 + i * 100, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }} />
          ))}
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-widest opacity-80">LIVE RESCUE MISSION</span>
            </div>
            <h2 className="text-3xl font-black mb-1">🚨 {activeMission.petName} — Missing</h2>
            <p className="text-white/80">Last seen: {activeMission.lastSeen} · Mission ID: #{activeMission.id.toString().slice(-5)}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleResolved(true)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Found Safe!
            </button>
            <button onClick={() => handleResolved(false)} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* AI Radar Map */}
        <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-6 relative overflow-hidden">
          <p className="font-extrabold text-white mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-red-400" />
            AI Rescue Radar
            <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
          </p>
          {/* Radar visualization */}
          <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
            <svg viewBox="0 0 280 280" className="w-full h-full">
              {/* Grid rings */}
              {[40, 80, 120].map((r, i) => (
                <circle key={i} cx="140" cy="140" r={r} fill={ZONE_COLORS[i]} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              ))}
              {/* Cross hairs */}
              <line x1="140" y1="20" x2="140" y2="260" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="20" y1="140" x2="260" y2="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              {/* Spinning sweep */}
              <motion.line x1="140" y1="140" x2="140" y2="20" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"
                animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '140px 140px' }} />
              {/* Pet position */}
              <motion.circle cx="140" cy="140" r="8" fill="#ef4444"
                animate={{ r: [8, 14, 8], opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
              {/* Volunteer dots */}
              {[{ cx: 105, cy: 95 }, { cx: 175, cy: 110 }, { cx: 90, cy: 170 }, { cx: 190, cy: 180 }].map((pos, i) => (
                <g key={i}>
                  <circle cx={pos.cx} cy={pos.cy} r="6" fill={volunteers[i]?.color || '#6366f1'} />
                  <text x={pos.cx + 9} y={pos.cy + 4} fill="white" fontSize="8" fontWeight="bold">{volunteers[i]?.avatar || 'V'}</text>
                </g>
              ))}
              {/* Labels */}
              <text x="145" y="136" fill="#ef4444" fontSize="10" fontWeight="bold">YOU</text>
              <text x="100" y="70" fill="#94a3b8" fontSize="8">High Zone</text>
              <text x="55" y="130" fill="#94a3b8" fontSize="8">Medium</text>
            </svg>
          </div>
          {/* Zone legend */}
          {aiPrediction?.zones.map((z, i) => (
            <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl p-2.5 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: z.color }} />
                <div>
                  <p className="text-white text-xs font-bold">{z.label}</p>
                  <p className="text-slate-400 text-[10px]">{z.desc}</p>
                </div>
              </div>
              <span className="font-extrabold text-sm" style={{ color: z.color }}>{z.pct}%</span>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Volunteers */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="font-extrabold text-slate-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Active Volunteers
              <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{volunteers.length}</span>
            </p>
            <div className="space-y-2">
              {volunteers.map(v => (
                <div key={v.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0" style={{ background: v.color }}>{v.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-xs">{v.name}</p>
                    <p className="text-slate-400 text-[10px]">{v.dist} away</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: v.color + '22', color: v.color }}>{v.status}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Mission Log */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="font-extrabold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-500" /> Mission Log
            </p>
            <div className="space-y-2">
              {missionLog.map((l, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[10px] text-slate-400 font-bold mt-0.5 flex-shrink-0">{l.time}</span>
                  <p className="text-xs text-slate-700">{l.msg}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <p className="font-extrabold text-orange-700 mb-2 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" /> Sighting Alerts
              </p>
              {alerts.map(a => (
                <div key={a.id} className="text-xs text-orange-800 bg-white rounded-xl p-2.5 mb-2 border border-orange-100">
                  <p className="font-bold">{a.msg}</p>
                  <p className="text-orange-500 mt-0.5">{a.time} ago</p>
                </div>
              ))}
            </div>
          )}
          {/* AI Tip */}
          {aiPrediction && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-indigo-800 flex items-center gap-1 mb-1"><Zap className="w-3 h-3" /> AI Prediction</p>
              <p className="text-xs text-indigo-700">{aiPrediction.tip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (step === 'report') return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8">
        <button onClick={() => setStep('home')} className="flex items-center gap-2 text-slate-500 text-sm mb-6 hover:text-slate-700">
          ← Back
        </button>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-1">🚨 Report Missing Pet</h2>
        <p className="text-slate-500 text-sm mb-6">This will instantly alert nearby users and veterinarians in your area.</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Select Pet</label>
            <select value={form.petId} onChange={e => setForm(f => ({ ...f, petId: e.target.value }))}
              className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300">
              <option value="">Choose your pet...</option>
              {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>)}
              <option value="other">Other / Not Listed</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Last Seen Location</label>
            <input value={form.lastSeen} onChange={e => setForm(f => ({ ...f, lastSeen: e.target.value }))}
              placeholder="e.g., Near City Park, MG Road..."
              className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Color, collar, distinctive features..."
              className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Contact Number</label>
            <input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
              placeholder="+91 98765 43210"
              className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300" />
          </div>
          <button onClick={handleReport} disabled={!form.lastSeen}
            className="w-full py-3 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: GRAD }}>
            🚨 Activate Rescue Mission
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Home screen
  const stats = [
    { icon: '🐾', label: 'Pets Rescued', value: '2,481', color: '#10b981' },
    { icon: '👥', label: 'Active Rescuers', value: '312', color: '#6366f1' },
    { icon: '⚡', label: 'Avg Response', value: '8 min', color: '#f59e0b' },
    { icon: '🏥', label: 'Partner Vets', value: '94', color: '#14b8a6' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero */}
      <div className="rounded-3xl p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)' }}>
        <div className="absolute inset-0 opacity-10">
          {[0, 1, 2, 3].map(i => (
            <motion.div key={i} className="absolute rounded-full border border-white"
              style={{ width: 150 + i * 80, height: 150 + i * 80, top: '50%', right: '-5%', transform: 'translateY(-50%)' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, delay: i * 0.7, repeat: Infinity }} />
          ))}
        </div>
        <div className="relative z-10">
          <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-2">🛡️ Emergency & Rescue Center</p>
          <h2 className="text-4xl font-black mb-2">Smart Lost Pet<br />Rescue Network</h2>
          <p className="text-indigo-200 text-sm mb-6 max-w-md">Community-powered rescue system with AI location prediction, real-time volunteer coordination, and instant vet alerts.</p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setStep('report')}
              className="px-6 py-3 rounded-2xl font-extrabold text-white shadow-lg hover:shadow-xl transition hover:-translate-y-0.5 flex items-center gap-2"
              style={{ background: GRAD }}>
              <AlertTriangle className="w-5 h-5" /> Report Missing Pet
            </button>
            <button className="px-6 py-3 rounded-2xl font-bold bg-white/10 hover:bg-white/20 transition flex items-center gap-2">
              <Heart className="w-5 h-5" /> Become a Rescuer
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <motion.div key={s.label} whileHover={{ y: -3 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 text-lg mb-5">🤖 How AI Rescue Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '01', icon: '📍', title: 'Report Missing', desc: 'Mark pet as missing with last known location and description' },
            { step: '02', icon: '📡', title: 'Network Alerts', desc: 'Instant alerts to 50+ nearby community members and vets' },
            { step: '03', icon: '🤖', title: 'AI Prediction', desc: 'AI analyzes movement history to predict probable locations' },
            { step: '04', icon: '🎉', title: 'Safe Return', desc: 'Volunteer network coordinates real-time to bring pet home' },
          ].map(s => (
            <div key={s.step} className="text-center p-4 bg-slate-50 rounded-2xl">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-xs font-black text-indigo-400 mb-1">STEP {s.step}</p>
              <p className="font-extrabold text-slate-800 text-sm mb-1">{s.title}</p>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Rescues */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 mb-4">🐾 Recent Successful Rescues</h3>
        <div className="space-y-3">
          {[
            { name: 'Rocky', breed: 'Labrador', time: '2h ago', helpers: 5, status: 'Safe' },
            { name: 'Mimi', breed: 'Siamese Cat', time: '5h ago', helpers: 3, status: 'Safe' },
            { name: 'Bruno', breed: 'German Shepherd', time: '1d ago', helpers: 8, status: 'Safe' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">🐾</div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{r.name} <span className="text-slate-400 font-normal">· {r.breed}</span></p>
                <p className="text-xs text-slate-400">{r.helpers} volunteers helped · {r.time}</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
