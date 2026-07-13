import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Activity, Shield, Zap, RefreshCw, Send } from 'lucide-react';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#ef4444,#f97316,#f59e0b)';

const RISK_FACTORS = [
  { id:1, label:'Irregular Heartbeat Pattern', risk:82, source:'SmartCollar™', severity:'critical', time:'2m ago', action:'Contact vet immediately' },
  { id:2, label:'Prolonged Inactivity (6h)',   risk:65, source:'Activity Tracker', severity:'high', time:'5m ago', action:'Check if pet is responsive' },
  { id:3, label:'High Body Temperature',        risk:71, source:'SmartCollar™', severity:'high', time:'8m ago', action:'Provide cool water & shade' },
  { id:4, label:'Skipped 2 Consecutive Meals', risk:55, source:'Diet Planner', severity:'medium', time:'1h ago', action:'Monitor appetite closely' },
  { id:5, label:'Stress Behavior Detected',     risk:48, source:'AI Mood Analysis', severity:'medium', time:'2h ago', action:'Create calm environment' },
  { id:6, label:'Hydration Below 40%',          risk:60, source:'Hydration Tracker', severity:'high', time:'30m ago', action:'Increase water intake now' },
];

const SEV_CFG = {
  critical: { bg:'bg-rose-50', border:'border-rose-300', badge:'bg-rose-500 text-white', text:'text-rose-700', icon:'🚨' },
  high:     { bg:'bg-orange-50', border:'border-orange-200', badge:'bg-orange-400 text-white', text:'text-orange-700', icon:'⚠️' },
  medium:   { bg:'bg-amber-50', border:'border-amber-200', badge:'bg-amber-400 text-white', text:'text-amber-700', icon:'🔔' },
};

const OVERALL_RISK = 62;

export default function PredictiveEmergencyTab() {
  const [alerts, setAlerts] = useState(RISK_FACTORS);
  const [filter, setFilter] = useState('all');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(()=>setTick(x=>x+1), 5000);
    return ()=>clearInterval(t);
  }, []);

  const dismiss = (id) => setAlerts(a=>a.filter(x=>x.id!==id));
  const visible = filter==='all' ? alerts : alerts.filter(a=>a.severity===filter);
  const critical = alerts.filter(a=>a.severity==='critical').length;
  const high = alerts.filter(a=>a.severity==='high').length;

  const escalateToVet = () => {
    const petName = JSON.parse(localStorage.getItem('ownerPets')||'[]')[0]?.name || 'Bruno';
    const ems = JSON.parse(localStorage.getItem('platformEmergencies')) || [
      { id:'E-001', pet:'Bruno (Lab)', loc:'Sector 12, Chennai',  type:'Cardiac Arrest', severity:'critical', time:'2m ago',  status:'dispatched' },
      { id:'E-002', pet:'Luna (Persian)', loc:'Anna Nagar',      type:'Poisoning',       severity:'high',    time:'8m ago',  status:'responding' }
    ];
    const newEm = { 
      id: `E-${Date.now().toString().slice(-4)}`, 
      pet: petName, 
      loc: 'Owner Home', 
      type: 'AI Predictive: Irregular Heartbeat', 
      severity: 'critical', 
      time: 'Just now', 
      status: 'responding' 
    };
    localStorage.setItem('platformEmergencies', JSON.stringify([newEm, ...ems]));
    window.dispatchEvent(new Event('storage'));
    logGlobalActivity('System', `AI Predictive Escalate: ${petName}`, '🚨', 'emergency');
    alert('Emergency escalated to VetFirst ER.');
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">🚨</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">🚨 Live Prediction</span>
        <h2 className="text-2xl font-black mt-2">AI Predictive Emergency Engine</h2>
        <p className="text-orange-100 text-sm mt-1">Predicts emergencies before they happen using behavioral and health AI patterns.</p>
        <div className="flex gap-6 mt-4">
          {[['Overall Risk',OVERALL_RISK+'%'],['Critical',critical],['High Risk',high],['Last Update','2s ago']].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-orange-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Risk-o-meter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-extrabold text-slate-800">📊 Emergency Risk Meter</p>
          <button onClick={escalateToVet} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-rose-600 transition">
            <Send className="w-3 h-3" /> Escalate to Vet
          </button>
        </div>
        <div className="relative">
          <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
            <motion.div className="h-8 rounded-full flex items-center justify-end pr-3"
              style={{background:OVERALL_RISK>70?'linear-gradient(135deg,#ef4444,#f97316)':OVERALL_RISK>50?'linear-gradient(135deg,#f97316,#f59e0b)':'linear-gradient(135deg,#10b981,#06b6d4)'}}
              initial={{width:0}} animate={{width:`${OVERALL_RISK}%`}} transition={{duration:1.5}}>
              <span className="text-white text-xs font-extrabold">{OVERALL_RISK}% Risk</span>
            </motion.div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs font-bold">
          <span className="text-emerald-600">Safe</span>
          <span className="text-amber-600">Moderate</span>
          <span className="text-rose-600">Critical</span>
        </div>
        <p className="mt-3 text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-xl p-3">
          ⚠️ Risk level is ELEVATED. Your pet shows {critical} critical and {high} high-risk behavioral patterns. Immediate vet consultation recommended.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all','critical','high','medium'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition capitalize ${filter===f?'text-white bg-rose-500 border-rose-500':'bg-white border-slate-200 text-slate-600'}`}>
            {f==='all'?'All Alerts':f}
          </button>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        <AnimatePresence>
          {visible.map((a,i)=>{
            const cfg = SEV_CFG[a.severity];
            return (
              <motion.div key={a.id} layout initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,x:100}} transition={{delay:i*0.06}}
                className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-extrabold text-sm ${cfg.text}`}>{a.label}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${cfg.badge}`}>{a.severity}</span>
                    </div>
                    <p className="text-xs text-slate-500">Source: <strong>{a.source}</strong> · {a.time}</p>
                    <p className={`text-xs font-bold mt-1.5 ${cfg.text}`}>→ {a.action}</p>
                    <div className="mt-2 w-full bg-white/60 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{width:`${a.risk}%`,background:a.severity==='critical'?'#ef4444':a.severity==='high'?'#f97316':'#f59e0b'}}/>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{a.risk}% risk score</p>
                  </div>
                  <button onClick={()=>dismiss(a.id)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {visible.length===0 && (
          <div className="text-center py-8 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <p className="text-emerald-700 font-extrabold text-lg">✅ No active alerts!</p>
            <p className="text-emerald-600 text-sm mt-1">Your pet is safe. All risk factors are under control.</p>
          </div>
        )}
      </div>
    </div>
  );
}
