import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Shield, Plus, AlertTriangle, CheckCircle, Navigation, Trash2 } from 'lucide-react';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';

const INIT_ZONES = [
  { id: 1, name: 'Home',        radius: 200,  shape: 'circle', active: true,  alerts: 2,  lat: 13.0827, lng: 80.2707, color: '#10b981' },
  { id: 2, name: 'Dog Park',    radius: 500,  shape: 'circle', active: true,  alerts: 0,  lat: 13.0850, lng: 80.2740, color: '#6366f1' },
  { id: 3, name: 'Vet Clinic',  radius: 100,  shape: 'circle', active: false, alerts: 1,  lat: 13.0800, lng: 80.2680, color: '#f59e0b' },
];

const ALERTS = [
  { id: 1, zone: 'Home',     type: 'exit',    time: '09:15 AM', pet: 'Bruno',   action: 'Alert sent' },
  { id: 2, zone: 'Vet Clinic',type: 'enter',  time: 'Yesterday',pet: 'Bruno',   action: 'Logged' },
  { id: 3, zone: 'Home',     type: 'exit',    time: 'May 10',   pet: 'Bruno',   action: 'Alert sent' },
];

const LIVE_PET = { name: 'Bruno', status: 'inside', zone: 'Home', lat: 13.0830, lng: 80.2710, speed: '0 km/h', battery: 87 };

export default function GeoFenceTab() {
  const [zones, setZones]     = useState(INIT_ZONES);
  const [showAdd, setShowAdd] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', radius: 200 });
  const [alerts, setAlerts]   = useState(ALERTS);
  const [petStatus, setPetStatus] = useState(LIVE_PET.status);

  const simulateEscape = () => {
    setPetStatus('escaped');
    const newAlert = { id: Date.now(), zone: zones[0]?.name || 'Home', type: 'exit', time: 'Just now', pet: LIVE_PET.name, action: 'Alert sent' };
    setAlerts([newAlert, ...alerts]);
    
    // Cross-dashboard sync
    const ems = JSON.parse(localStorage.getItem('platformEmergencies')) || [
      { id:'E-001', pet:'Bruno (Lab)', loc:'Sector 12, Chennai',  type:'Cardiac Arrest', severity:'critical', time:'2m ago',  status:'dispatched' },
      { id:'E-002', pet:'Luna (Persian)', loc:'Anna Nagar',      type:'Poisoning',       severity:'high',    time:'8m ago',  status:'responding' }
    ];
    const newEm = { 
      id: `E-${Date.now().toString().slice(-4)}`, 
      pet: LIVE_PET.name, 
      loc: 'Outside ' + (zones[0]?.name || 'Home'), 
      type: 'Geofence Breach', 
      severity: 'high', 
      time: 'Just now', 
      status: 'responding' 
    };
    localStorage.setItem('platformEmergencies', JSON.stringify([newEm, ...ems]));
    window.dispatchEvent(new Event('storage'));
    logGlobalActivity('System', `Geofence breach detected for ${LIVE_PET.name}`, '📍', 'emergency');
  };

  const toggleZone = (id) => setZones(z => z.map(x => x.id === id ? { ...x, active: !x.active } : x));
  const removeZone = (id) => setZones(z => z.filter(x => x.id !== id));
  const addZone = () => {
    if (!newZone.name.trim()) return;
    setZones(z => [...z, { id: Date.now(), name: newZone.name, radius: newZone.radius, shape: 'circle', active: true, alerts: 0, color: '#8b5cf6' }]);
    setNewZone({ name: '', radius: 200 });
    setShowAdd(false);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">📍</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">📍 Geofence AI</span>
        <h2 className="text-2xl font-black mt-2">Smart AI Geofencing System</h2>
        <p className="text-indigo-100 text-sm mt-1">Set intelligent safe zones, get instant escape alerts, and track your pet's location boundaries in real time.</p>
        <div className="flex gap-6 mt-4">
          {[['Active Zones', zones.filter(z => z.active).length], ['Total Alerts', ALERTS.length], ['Pet Status', LIVE_PET.status], ['Battery', LIVE_PET.battery + '%']].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Live pet status */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-extrabold text-slate-800">📡 Live Pet Tracking — {LIVE_PET.name}</p>
          <button onClick={simulateEscape} className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 transition">
            Simulate Escape
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[['Status', petStatus === 'inside' ? '✅ Inside Zone' : '⚠️ Outside Zone'], ['Current Zone', LIVE_PET.zone], ['Speed', LIVE_PET.speed], ['Collar Battery', LIVE_PET.battery + '%']].map(([l, v]) => (
            <div key={l} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <p className="text-xs font-bold text-slate-400">{l}</p>
              <p className="font-extrabold text-slate-800 mt-1 text-sm">{v}</p>
            </div>
          ))}
        </div>
        {/* Map placeholder */}
        <div className="relative w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 40% 50%, rgba(99,102,241,0.15) 0%, transparent 60%)', backgroundSize: '100% 100%' }} />
          {/* Zones */}
          {zones.filter(z => z.active).map((zone, i) => (
            <motion.div key={zone.id}
              animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
              className="absolute rounded-full border-2"
              style={{ width: zone.radius / 2, height: zone.radius / 2, borderColor: zone.color, background: zone.color + '15', left: `${25 + i * 20}%`, top: `${20 + i * 10}%`, transform: 'translate(-50%,-50%)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{zone.name}</span>
              </div>
            </motion.div>
          ))}
          {/* Pet dot */}
          <motion.div className="absolute w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-lg z-10"
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ left: '42%', top: '48%' }} />
          <p className="text-slate-500 text-xs z-10 mt-24">🗺️ Chennai · Real-time map</p>
        </div>
      </div>

      {/* Zone management */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-extrabold text-slate-800">🛡️ Geofence Zones</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-xl" style={{ background: GRAD }}>
            <Plus className="w-3.5 h-3.5" />Add Zone
          </button>
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
              <input value={newZone.name} onChange={e => setNewZone(n => ({ ...n, name: e.target.value }))}
                placeholder="Zone name (e.g., Grandma's House)"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Radius: <strong>{newZone.radius}m</strong></label>
                <input type="range" min={50} max={1000} step={50} value={newZone.radius} onChange={e => setNewZone(n => ({ ...n, radius: +e.target.value }))} className="w-full accent-indigo-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={addZone} className="flex-1 py-2 text-white font-bold text-sm rounded-xl" style={{ background: GRAD }}>Save Zone</button>
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 font-bold text-sm text-slate-600 rounded-xl border border-slate-200">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {zones.map((z, i) => (
            <motion.div key={z.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: z.color }} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm">{z.name}</p>
                <p className="text-xs text-slate-400">{z.radius}m radius · {z.alerts} alert{z.alerts !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => toggleZone(z.id)}
                className={`px-3 py-1 text-[11px] font-bold rounded-full border ${z.active ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                {z.active ? 'Active' : 'Inactive'}
              </button>
              <button onClick={() => removeZone(z.id)} className="text-rose-400 hover:text-rose-600 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alert history */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🔔 Geofence Alert History</p>
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border ${a.type === 'exit' ? 'bg-rose-50 border-rose-200' : 'bg-blue-50 border-blue-200'}`}>
              <span className={`text-lg ${a.type === 'exit' ? '🚨' : '✅'}`}>{a.type === 'exit' ? '🚨' : '✅'}</span>
              <div className="flex-1">
                <p className={`text-sm font-bold ${a.type === 'exit' ? 'text-rose-700' : 'text-blue-700'}`}>
                  {a.pet} {a.type === 'exit' ? 'exited' : 'entered'} {a.zone}
                </p>
                <p className="text-xs text-slate-400">{a.time} · {a.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
