import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Activity, Zap, Star, TrendingUp, Shield, RefreshCw } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#ec4899,#f97316,#6366f1)';
const BOND_DATA = [
  { label:'Feeding Consistency',  score:92, icon:'🍗', tip:'Meals on time 6/7 days this week — excellent!' },
  { label:'Playtime Quality',     score:78, icon:'🎾', tip:'Try 5 more minutes of active play daily.' },
  { label:'Interaction Frequency',score:85, icon:'🤗', tip:'Great bonding! You spent 2.3h together today.' },
  { label:'Emotional Attention',  score:70, icon:'💬', tip:'Consider more verbal interaction & eye contact.' },
  { label:'Health Check-ins',     score:95, icon:'🏥', tip:'Outstanding! Vaccinations and vet visits are on track.' },
  { label:'Grooming Care',        score:65, icon:'✂️',  tip:"Schedule grooming — it's been 18 days." },
];

const HISTORY = [
  { month:'Jan', score:62 }, { month:'Feb', score:68 }, { month:'Mar', score:71 },
  { month:'Apr', score:75 }, { month:'May', score:82 }, { month:'Jun', score:87 },
];

const BOND_LEVELS = [
  { min:90, label:'🌟 Soulmates',       color:'#10b981', desc:'Exceptional human-pet bond — a true partnership.' },
  { min:75, label:'💚 Deeply Bonded',   color:'#6366f1', desc:'Strong emotional connection. Keep nurturing it.' },
  { min:60, label:'💛 Growing Bond',    color:'#f59e0b', desc:'Good foundation. Consistency will strengthen it.' },
  { min:0,  label:'🔴 Needs Attention', color:'#ef4444', desc:'More daily interaction and care routines needed.' },
];

export default function AIBondAnalyzerTab() {
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);
  const overall = Math.round(BOND_DATA.reduce((s,b)=>s+b.score,0)/BOND_DATA.length);
  const level = BOND_LEVELS.find(l => overall >= l.min);
  const petName = JSON.parse(localStorage.getItem('ownerPets')||'[]')[0]?.name || 'Bruno';

  const reanalyze = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setAnalyzed(true); }, 1800);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-8 -top-8 opacity-10 text-[140px]">💞</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">💞 AI Bond Analyzer</span>
        <h2 className="text-2xl font-black mt-2">Emotional Bond Analyzer</h2>
        <p className="text-pink-100 text-sm mt-1">AI-powered analysis of your emotional connection with {petName}.</p>
        <div className="flex gap-6 mt-4">
          {[['Bond Score',overall+'%'], ['Level',level.label.split(' ')[0]+level.label.split(' ')[1]], ['Trend','↑ +8 pts'], ['Days Together','487']].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-pink-200">{l}</p></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Big ring */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
          <p className="font-extrabold text-slate-800 mb-4">💞 Overall Bond Score</p>
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12"/>
              <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#bondGrad)" strokeWidth="12"
                strokeLinecap="round" strokeDasharray={`${2*Math.PI*50}`}
                initial={{strokeDashoffset: 2*Math.PI*50}}
                animate={{strokeDashoffset: 2*Math.PI*50*(1-overall/100)}}
                transition={{duration:1.5}}>
              </motion.circle>
              <defs><linearGradient id="bondGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899"/><stop offset="100%" stopColor="#6366f1"/>
              </linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black" style={{color:level.color}}>{overall}%</span>
              <span className="text-xs font-bold text-slate-500">Bond</span>
            </div>
          </div>
          <div className="text-center px-4 py-3 rounded-2xl border" style={{background:level.color+'12', borderColor:level.color+'33'}}>
            <p className="font-extrabold text-lg" style={{color:level.color}}>{level.label}</p>
            <p className="text-xs text-slate-600 mt-1">{level.desc}</p>
          </div>
        </div>

        {/* History sparkline */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="font-extrabold text-slate-800 mb-4">📈 Bond Growth Timeline</p>
          <div className="flex items-end gap-2 h-32">
            {HISTORY.map((h,i)=>(
              <div key={h.month} className="flex-1 flex flex-col items-center gap-1">
                <motion.div className="w-full rounded-t-lg" style={{background:GRAD,opacity:0.7+i*0.05}}
                  initial={{height:0}} animate={{height:`${h.score}%`}} transition={{delay:i*0.1,duration:0.6}}/>
                <span className="text-[10px] text-slate-400">{h.month}</span>
                <span className="text-[10px] font-bold text-indigo-600">{h.score}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">Bond strength has grown <span className="font-bold text-emerald-600">+25 pts</span> over 6 months</p>
        </div>
      </div>

      {/* Dimension cards */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🔬 Bond Dimension Analysis</p>
        <div className="space-y-3">
          {BOND_DATA.map((b,i)=>(
            <motion.div key={b.label} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
              className="flex items-center gap-3">
              <span className="text-xl w-7 flex-shrink-0">{b.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">{b.label}</span>
                  <span className="text-xs font-extrabold" style={{color:b.score>=80?'#10b981':b.score>=60?'#f59e0b':'#ef4444'}}>{b.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <motion.div className="h-2.5 rounded-full" style={{background:GRAD}}
                    initial={{width:0}} animate={{width:`${b.score}%`}} transition={{delay:i*0.07+0.3,duration:0.8}}/>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{b.tip}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Re-analyze */}
      <button onClick={reanalyze} disabled={loading}
        className="w-full py-3 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
        style={{background:GRAD}}>
        {loading ? <><RefreshCw className="w-4 h-4 animate-spin"/>AI Analyzing Bond...</> : '💞 Re-Analyze Bond'}
      </button>
    </div>
  );
}
