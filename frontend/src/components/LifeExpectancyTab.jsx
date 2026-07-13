import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, AlertTriangle, Shield, Activity } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#6366f1,#a855f7,#14b8a6)';

const BREED_DATA = {
  'Labrador Retriever': { avgLife: 12.5, risks: ['Hip Dysplasia','Obesity','Ear Infections'], wellness: 88 },
  'Golden Retriever':   { avgLife: 11.5, risks: ['Cancer','Hip Dysplasia','Heart Disease'],    wellness: 82 },
  'Persian Cat':        { avgLife: 15.0, risks: ['Kidney Disease','Respiratory Issues','PKD'], wellness: 79 },
  'Poodle':             { avgLife: 14.5, risks: ['Epilepsy','Addisons Disease','Bloat'],        wellness: 91 },
  'Beagle':             { avgLife: 13.5, risks: ['Obesity','Epilepsy','Cherry Eye'],            wellness: 85 },
  'Siberian Husky':     { avgLife: 13.0, risks: ['Hip Dysplasia','Eye Conditions','Hypothyroidism'], wellness: 87 },
};

const WELLNESS_FACTORS = [
  { label:'Nutrition Quality',  val:85, icon:'🍗' },
  { label:'Exercise Frequency', val:72, icon:'🏃' },
  { label:'Vet Visit Regularity',val:90, icon:'🏥' },
  { label:'Sleep Quality',      val:78, icon:'😴' },
  { label:'Stress Level',       val:65, icon:'😌' },
  { label:'Hydration',          val:80, icon:'💧' },
];

export default function LifeExpectancyTab() {
  const [breed, setBreed] = useState('Labrador Retriever');
  const [age, setAge] = useState(4);
  const [loading, setLoading] = useState(false);
  const [predicted, setPredicted] = useState(true);

  const data = BREED_DATA[breed];
  const remaining = Math.max(data.avgLife - age, 0.5);
  const pct = Math.round((age / data.avgLife) * 100);
  const wellnessMultiplier = data.wellness / 100;
  const predictedExtra = (remaining * wellnessMultiplier).toFixed(1);
  const overallPrediction = (age + parseFloat(predictedExtra)).toFixed(1);

  const predict = () => { setLoading(true); setTimeout(() => { setLoading(false); setPredicted(true); }, 1800); };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-8 -top-8 opacity-10 text-[140px]">⏳</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">⏳ Life Prediction</span>
        <h2 className="text-2xl font-black mt-2">Smart Life Expectancy Engine</h2>
        <p className="text-indigo-100 text-sm mt-1">AI-powered lifespan prediction, disease risk analysis, and wellness optimization roadmap.</p>
        <div className="flex gap-6 mt-4">
          {[['Avg Breed Lifespan',data.avgLife+'yr'],['Predicted Lifespan',overallPrediction+'yr'],['Wellness Score',data.wellness+'%'],['Disease Risks',data.risks.length]].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">⚙️ Pet Configuration</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Breed</label>
            <select value={breed} onChange={e=>setBreed(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 outline-none">
              {Object.keys(BREED_DATA).map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Current Age: <strong>{age} years</strong></label>
            <input type="range" min={0.5} max={20} step={0.5} value={age} onChange={e=>setAge(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Life timeline bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">📊 Life Stage Timeline</p>
          <div className="relative mb-3">
            <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden">
              <motion.div className="h-6 rounded-full flex items-center justify-end pr-2" style={{background:GRAD}}
                initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1}}>
                {pct>15 && <span className="text-white text-xs font-bold">{age}yr</span>}
              </motion.div>
            </div>
            <div className="absolute right-0 top-0 h-6 w-px bg-slate-300"/>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-4">
            <span>Birth</span><span>Avg Death ({data.avgLife}yr)</span>
          </div>
          <div className="space-y-2">
            {[['Puppy / Kitten','0–2yr','#10b981'],['Adult','2–8yr','#6366f1'],['Senior','8–12yr','#f59e0b'],['Geriatric','12yr+','#ef4444']].map(([stage,range,color])=>(
              <div key={stage} className="flex items-center gap-3 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:color}}/>
                <span className="font-bold text-slate-700">{stage}</span>
                <span className="text-slate-400">{range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disease risks */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">⚠️ Breed-Specific Disease Risks</p>
          <div className="space-y-2 mb-4">
            {data.risks.map((r,i)=>(
              <div key={r} className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0"/>
                <span className="text-sm font-bold text-rose-700">{r}</span>
                <span className="ml-auto text-[10px] font-bold text-rose-400">{['High','Medium','Low'][i%3]} Risk</span>
              </div>
            ))}
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <p className="text-xs font-bold text-emerald-700">💡 Regular vet check-ups reduce breed-specific disease risk by up to 40%</p>
          </div>
        </div>
      </div>

      {/* Wellness factors */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🌿 Wellness Factors Affecting Lifespan</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {WELLNESS_FACTORS.map((f,i)=>(
            <div key={f.label} className="flex items-center gap-3">
              <span className="text-xl w-8">{f.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">{f.label}</span>
                  <span className="text-xs font-extrabold" style={{color:f.val>=80?'#10b981':f.val>=65?'#f59e0b':'#ef4444'}}>{f.val}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <motion.div className="h-2 rounded-full" style={{background:GRAD}}
                    initial={{width:0}} animate={{width:`${f.val}%`}} transition={{delay:i*0.08,duration:0.7}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={predict} disabled={loading}
        className="w-full py-3 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
        style={{background:GRAD}}>
        {loading ? <><RefreshCw className="w-4 h-4 animate-spin"/>Predicting Lifespan...</> : '🔮 Run AI Life Expectancy Prediction'}
      </button>
    </div>
  );
}
