import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#10b981,#14b8a6,#6366f1)';

// ── A) AI Clinic Performance Grid ─────────────────────────────────────────────
export function ClinicPerformancePanel() {
  const METRICS = [
    { label:'Avg Consultation Time', value:'18 min', trend:'-2 min', color:'#10b981', icon:'⏱' },
    { label:'Patient Throughput',    value:'34/day', trend:'+6',     color:'#6366f1', icon:'👥' },
    { label:'Diagnosis Accuracy',    value:'96.2%',  trend:'+1.4%',  color:'#14b8a6', icon:'🎯' },
    { label:'Treatment Success',     value:'91.8%',  trend:'+0.8%',  color:'#a855f7', icon:'✅' },
    { label:'Revenue Per Hour',      value:'₹3,840', trend:'+₹320',  color:'#f59e0b', icon:'💰' },
    { label:'Client Satisfaction',   value:'4.8★',   trend:'+0.2',   color:'#ef4444', icon:'⭐' },
  ];
  const WEEK = [
    { day:'Mon', patients:28, revenue:42000 },{ day:'Tue', patients:34, revenue:51000 },
    { day:'Wed', patients:31, revenue:46500 },{ day:'Thu', patients:38, revenue:57000 },
    { day:'Fri', patients:35, revenue:52500 },{ day:'Sat', patients:22, revenue:33000 },
    { day:'Sun', patients:12, revenue:18000 },
  ];
  const maxP = Math.max(...WEEK.map(d => d.patients));
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">📊 Clinic Insights</span>
        <h2 className="text-2xl font-black mt-2">Smart Clinic Performance Grid</h2>
        <p className="text-emerald-100 text-sm mt-1">Realtime clinic efficiency analytics — throughput, revenue, satisfaction, and diagnostic accuracy.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {METRICS.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{m.icon}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: m.color }}>
                {m.trend.startsWith('+') ? '↑' : '↓'} {m.trend}
              </span>
            </div>
            <p className="text-xl font-extrabold text-slate-900">{m.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{m.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">📅 Weekly Patient Volume</p>
        <div className="flex items-end gap-3 h-28">
          {WEEK.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <motion.div className="w-full rounded-t-xl" style={{ background: GRAD }}
                initial={{ height: 0 }} animate={{ height: `${(d.patients / maxP) * 100}%` }} transition={{ delay: i * 0.08 }} />
              <span className="text-[10px] text-slate-400">{d.day}</span>
              <span className="text-[10px] font-bold text-slate-600">{d.patients}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── B) Treatment Success Index ─────────────────────────────────────────────────
export function TreatmentSuccessPanel() {
  const TREATMENTS = [
    { name:'Post-Surgical Recovery', success:94, cases:28, trend:'↑', color:'#10b981' },
    { name:'Skin Allergy Protocol', success:87, cases:45, trend:'↑', color:'#6366f1' },
    { name:'Orthopedic Therapy',    success:79, cases:19, trend:'↓', color:'#f59e0b' },
    { name:'Dental Procedures',     success:98, cases:62, trend:'↑', color:'#14b8a6' },
    { name:'Emergency Triage',      success:91, cases:13, trend:'↑', color:'#a855f7' },
    { name:'Vaccination Programs',  success:99, cases:112, trend:'↑', color:'#ef4444' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">📈 Treatment Analytics</span>
        <h2 className="text-2xl font-black mt-2">Smart Treatment Success Index</h2>
        <p className="text-emerald-100 text-sm mt-1">AI-generated success probability scores across all treatment categories.</p>
        <div className="flex gap-6 mt-4">
          {[['Avg Success', '91.3%'],['Total Cases', TREATMENTS.reduce((s,t)=>s+t.cases,0)],['Top Protocol','Vaccination'],['AI Confidence','97%']].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-emerald-200">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {TREATMENTS.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-extrabold text-slate-800 text-sm">{t.name}</p>
                <span className={`text-xs font-bold ${t.trend === '↑' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.trend}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{t.cases} cases analyzed</p>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <motion.div className="h-2.5 rounded-full" style={{ background: t.color }}
                  initial={{ width: 0 }} animate={{ width: `${t.success}%` }} transition={{ delay: i * 0.08 + 0.3 }} />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <p className="text-2xl font-extrabold" style={{ color: t.color }}>{t.success}%</p>
              <p className="text-[10px] text-slate-400">success</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── C) Vet Workload Balancer ───────────────────────────────────────────────────
export function WorkloadBalancerPanel() {
  const [vets, setVets] = useState([
    { name:'Dr. Raj Kumar',    load:88, patients:12, spec:'General Practice', status:'overloaded', color:'#ef4444' },
    { name:'Dr. Priya Shah',   load:45, patients:6,  spec:'Dermatology',      status:'available',  color:'#10b981' },
    { name:'Dr. Arjun Mehta', load:70, patients:9,  spec:'Surgery',          status:'moderate',   color:'#f59e0b' },
    { name:'Dr. Meena Iyer',  load:55, patients:7,  spec:'Cardiology',       status:'available',  color:'#10b981' },
  ]);
  const [balanced, setBalanced] = useState(false);

  const balance = () => {
    const avg = Math.round(vets.reduce((s, v) => s + v.load, 0) / vets.length);
    setVets(vets.map(v => ({ ...v, load: avg + Math.floor(Math.random() * 10 - 5), status: avg > 70 ? 'moderate' : 'available' })));
    setBalanced(true);
    logGlobalActivity('Vet', 'AI Workload Balancer rebalanced vet schedules', '⚖️', 'vet');
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">⚖️ Productivity Manager</span>
        <h2 className="text-2xl font-black mt-2">AI Vet Workload Balancer</h2>
        <p className="text-purple-100 text-sm mt-1">Automatically balance patient distribution across veterinary staff for optimal efficiency.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-extrabold text-slate-800">👥 Vet Load Distribution</p>
          <button onClick={balance} className="px-4 py-2 text-white text-sm font-bold rounded-xl" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>
            ⚖️ Auto Balance
          </button>
        </div>
        <div className="space-y-4">
          {vets.map((v, i) => (
            <motion.div key={v.name} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="flex justify-between mb-1">
                <div>
                  <span className="text-sm font-bold text-slate-800">{v.name}</span>
                  <span className="ml-2 text-xs text-slate-400">{v.spec} · {v.patients} pts</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.status === 'overloaded' ? 'bg-rose-100 text-rose-700' : v.status === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {v.status}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <motion.div className="h-3 rounded-full transition-all duration-700" style={{ width: `${v.load}%`, background: v.color }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 text-right">{v.load}% load</p>
            </motion.div>
          ))}
        </div>
      </div>
      {balanced && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
          <p className="font-extrabold text-emerald-700">✅ Workloads Balanced Successfully</p>
          <p className="text-xs text-emerald-500 mt-1">AI redistributed 3 appointments · Efficiency improved by 24%</p>
        </motion.div>
      )}
    </div>
  );
}
