import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users, AlertTriangle, RefreshCw } from 'lucide-react';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#14b8a6,#6366f1)';

const HOURLY_PREDICTION = [
  {hour:'8 AM',patients:4,severity:'low',  emergencies:0},{hour:'9 AM',patients:8,severity:'medium',emergencies:1},
  {hour:'10 AM',patients:12,severity:'high',emergencies:2},{hour:'11 AM',patients:10,severity:'high',emergencies:1},
  {hour:'12 PM',patients:6,severity:'low', emergencies:0},{hour:'1 PM',patients:5,severity:'low',  emergencies:0},
  {hour:'2 PM',patients:9,severity:'medium',emergencies:1},{hour:'3 PM',patients:14,severity:'critical',emergencies:3},
  {hour:'4 PM',patients:11,severity:'high',emergencies:2},{hour:'5 PM',patients:7,severity:'medium',emergencies:1},
  {hour:'6 PM',patients:4,severity:'low', emergencies:0},
];
const SEV_COLOR = {low:'#10b981',medium:'#f59e0b',high:'#ef4444',critical:'#7c3aed'};
const SEV_BG    = {low:'bg-emerald-100 text-emerald-700',medium:'bg-amber-100 text-amber-700',high:'bg-rose-100 text-rose-700',critical:'bg-purple-100 text-purple-700'};

export default function CrowdPredictorPanel() {
  const [refreshed, setRefreshed] = useState(false);

  // Real data from Owner appointments
  const ownerAppts   = JSON.parse(localStorage.getItem('ownerAppts')  || '[]');
  const todayStr     = new Date().toLocaleDateString('en-CA');
  const todayAppts   = ownerAppts.filter(a => a.date === todayStr);
  const realTotal    = todayAppts.length;
  const realEmerg    = JSON.parse(localStorage.getItem('platformEmergencies') || '[]').length;
  const vetReviews   = JSON.parse(localStorage.getItem('vetReviews')   || '[]');

  // Merge real appointments into hourly buckets
  const merged = HOURLY_PREDICTION.map(h => {
    const hourAppts = todayAppts.filter(a => a.time && a.time.startsWith(h.hour.split(' ')[0]));
    const extra = hourAppts.length;
    return { ...h, patients: h.patients + extra };
  });

  const maxP = Math.max(...merged.map(h => h.patients));
  const busiest = merged.reduce((a, b) => a.patients > b.patients ? a : b);
  const totalEmergencies = merged.reduce((s, h) => s + h.emergencies, 0);
  const criticalWindows  = merged.filter(h => h.severity === 'critical').length;

  const handleRefresh = () => {
    setRefreshed(true);
    logGlobalActivity('Vet', `Crowd predictor refreshed — ${realTotal} real appointments today`, '📊', 'vet');
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[130px]">📊</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">📊 Operations Forecast</span>
        <h2 className="text-2xl font-black mt-2">AI Clinic Crowd Predictor</h2>
        <p className="text-teal-100 text-sm mt-1">AI-predicted patient volumes, emergency spikes, and clinic rush hours for today.</p>
        <div className="flex gap-6 mt-4">
          {[['Peak Hour', busiest.hour],['Peak Load', busiest.patients + ' pts'],['Critical Windows', HOURLY_PREDICTION.filter(h=>h.severity==='critical').length],['Total Emergencies', HOURLY_PREDICTION.reduce((s,h)=>s+h.emergencies,0)]].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-teal-200">{l}</p></div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-extrabold text-slate-800">📈 Hourly Patient Volume Forecast</p>
          <button onClick={() => setRefreshed(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 rounded-xl border border-teal-200 hover:bg-teal-100 transition">
            <RefreshCw className="w-3.5 h-3.5" />Refresh AI
          </button>
        </div>
        <div className="flex items-end gap-2 h-36">
          {HOURLY_PREDICTION.map((h, i) => (
            <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
              {h.emergencies > 0 && (
                <span className="text-[9px] font-bold text-rose-500">🚨{h.emergencies}</span>
              )}
              <motion.div className="w-full rounded-t-lg cursor-pointer"
                style={{ background: SEV_COLOR[h.severity] }}
                initial={{ height: 0 }} animate={{ height: `${(h.patients / maxP) * 100}%` }} transition={{ delay: i * 0.06, duration: 0.7 }}>
              </motion.div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {h.patients} pts · {h.severity}
              </div>
              <span className="text-[9px] text-slate-400">{h.hour}</span>
              <span className="text-[9px] font-bold text-slate-600">{h.patients}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {HOURLY_PREDICTION.filter(h => h.severity === 'critical' || h.severity === 'high').map((h, i) => (
          <motion.div key={h.hour} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <p className="font-extrabold text-sm text-slate-800">{h.hour}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${SEV_BG[h.severity]}`}>{h.severity}</span>
            </div>
            <p className="text-xs text-slate-500">Expected {h.patients} patients · {h.emergencies} emergencies</p>
            <p className="text-xs font-bold text-teal-600 mt-1">→ Prep extra staff for this window</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
