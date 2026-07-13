import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, Activity, Shield, CheckCircle } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#14b8a6,#6366f1)';

const PATIENTS = [
  { name:'Bruno', species:'Dog', breed:'Lab', age:4, condition:'Post-Surgery Recovery', stage:3, stages:5, recovery:72, meds:['Apoquel 16mg','Probiotic Capsule'], notes:'Day 3 post-op. Wound healing well. Reduce activity.' },
  { name:'Luna',  species:'Cat', breed:'Persian', age:7, condition:'Kidney Disease Stage 2', stage:2, stages:4, recovery:55, meds:['Benazepril 2.5mg','Renal Diet'], notes:'Creatinine improving. Continue low-phosphorus diet.' },
  { name:'Rocky', species:'Dog', breed:'Husky', age:3, condition:'Hip Dysplasia', stage:1, stages:3, recovery:88, meds:['Meloxicam 1mg','Joint Supplement'], notes:'Mobility improving. Physical therapy every 2 days.' },
];

const STAGE_LABELS = {
  'Post-Surgery Recovery':   ['Pre-Op','Surgery','ICU Recovery','Ward Monitoring','Discharge'],
  'Kidney Disease Stage 2':  ['Diagnosis','Initial Treatment','Stabilization','Long-term Management'],
  'Hip Dysplasia':           ['Diagnosis','Treatment Begin','Full Recovery'],
};

export default function RecoveryPredictionPanel() {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const p = PATIENTS[selected];
  const stages = STAGE_LABELS[p.condition] || [];

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">🔮</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔮 AI Recovery Engine</span>
        <h2 className="text-2xl font-black mt-2">Recovery Prediction Engine</h2>
        <p className="text-teal-100 text-sm mt-1">AI-powered recovery timelines, treatment effectiveness predictions, and improvement probabilities.</p>
        <div className="flex gap-6 mt-4">
          {[['Patients',PATIENTS.length],['Avg Recovery',Math.round(PATIENTS.reduce((s,p)=>s+p.recovery,0)/PATIENTS.length)+'%'],['Active Conditions','3'],['Success Rate','94%']].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-teal-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Patient selector */}
      <div className="flex gap-3">
        {PATIENTS.map((pt,i)=>(
          <button key={pt.name} onClick={()=>setSelected(i)}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition ${selected===i?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-teal-300'}`}
            style={selected===i?{background:GRAD}:{}}>
            🐾 {pt.name}<br/><span className="text-xs font-normal opacity-70">{pt.breed}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recovery ring */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
          <p className="font-extrabold text-slate-800 mb-4 self-start">📊 Recovery Progress</p>
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12"/>
              <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#recGrad)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*50}`}
                initial={{strokeDashoffset:2*Math.PI*50}}
                animate={{strokeDashoffset:2*Math.PI*50*(1-p.recovery/100)}}
                transition={{duration:1.5}}>
              </motion.circle>
              <defs><linearGradient id="recGrad" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#14b8a6"/><stop offset="100%" stopColor="#6366f1"/></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-teal-600">{p.recovery}%</span>
              <span className="text-xs text-slate-400">Recovery</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-extrabold text-slate-800">{p.name}</p>
            <p className="text-xs text-slate-500">{p.condition}</p>
            <p className="text-xs text-slate-400 mt-1">Age {p.age} · {p.breed} {p.species}</p>
          </div>
          <div className="mt-4 w-full bg-teal-50 border border-teal-200 rounded-xl p-3">
            <p className="text-xs font-bold text-teal-700">📋 Vet Notes</p>
            <p className="text-xs text-slate-600 mt-1">{p.notes}</p>
          </div>
        </div>

        {/* Stage tracker */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">🗺️ Treatment Stage Timeline</p>
          <div className="relative">
            {stages.map((stage,i)=>(
              <div key={stage} className="flex items-start gap-3 mb-4 last:mb-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i<=p.stage?'text-white':'bg-slate-100 text-slate-400'}`}
                    style={i<=p.stage?{background:GRAD}:{}}>
                    {i<p.stage?'✓':i===p.stage?'►':i+1}
                  </div>
                  {i<stages.length-1 && <div className={`w-0.5 h-6 mt-1 ${i<p.stage?'bg-teal-400':'bg-slate-200'}`}/>}
                </div>
                <div className="flex-1 pb-1">
                  <p className={`font-bold text-sm ${i===p.stage?'text-teal-600':i<p.stage?'text-slate-500 line-through':'text-slate-400'}`}>{stage}</p>
                  {i===p.stage && <p className="text-xs text-teal-500 font-bold mt-0.5">← Current Stage</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="font-extrabold text-slate-700 mb-2 text-sm">💊 Current Medications</p>
            <div className="space-y-1.5">
              {p.meds.map(m=>(
                <div key={m} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                  <CheckCircle className="w-4 h-4 text-indigo-500"/>
                  <span className="text-xs font-bold text-indigo-700">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={()=>{setLoading(true);setTimeout(()=>setLoading(false),1600);}} disabled={loading}
        className="w-full py-3 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
        style={{background:GRAD}}>
        {loading?<><RefreshCw className="w-4 h-4 animate-spin"/>Predicting Recovery...</>:'🔮 Run AI Recovery Prediction'}
      </button>
    </div>
  );
}
