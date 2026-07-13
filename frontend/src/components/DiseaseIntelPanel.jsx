import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Shield, RefreshCw, Zap } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#ef4444,#8b5cf6,#6366f1)';

const BREEDS_RISK = [
  { breed:'Labrador Retriever', risk:'Hip Dysplasia', prob:72, age:'5-8yr', action:'Annual hip X-ray screening, weight management' },
  { breed:'Golden Retriever',   risk:'Cancer (Lymphoma)', prob:65, age:'6-10yr', action:'Bi-annual blood panel, mass monitoring' },
  { breed:'Persian Cat',        risk:'Polycystic Kidney Disease', prob:58, age:'4-7yr', action:'Annual ultrasound, renal function test' },
  { breed:'Poodle',             risk:'Addisons Disease', prob:45, age:'3-6yr', action:'Electrolyte monitoring, ACTH stimulation test' },
  { breed:'German Shepherd',    risk:'Degenerative Myelopathy', prob:68, age:'7-14yr', action:'Neurological exam, genetic testing' },
  { breed:'Dachshund',          risk:'IVDD (Disc Disease)', prob:80, age:'3-7yr', action:'Spinal X-ray, weight control, ramp use' },
];

const DISEASE_CATEGORIES = [
  { name:'Genetic Disorders', count:12, icon:'🧬', color:'#8b5cf6' },
  { name:'Breed-Specific Risks', count:8,  icon:'🐕', color:'#6366f1' },
  { name:'Age-Related Conditions', count:15, icon:'⏳', color:'#f59e0b' },
  { name:'Environmental Risks', count:6,  icon:'🌿', color:'#10b981' },
];

export default function DiseaseIntelPanel() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [breedFilter, setBreedFilter] = useState('All');
  const breeds = ['All', ...BREEDS_RISK.map(b=>b.breed)];
  const visible = breedFilter==='All' ? BREEDS_RISK : BREEDS_RISK.filter(b=>b.breed===breedFilter);

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">🧬</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🧬 Disease Intelligence</span>
        <h2 className="text-2xl font-black mt-2">Predictive Disease Intelligence</h2>
        <p className="text-purple-100 text-sm mt-1">AI-powered disease prediction engine with breed-specific risk analysis and early intervention protocols.</p>
        <div className="flex gap-6 mt-4">
          {[['Breeds Analyzed',BREEDS_RISK.length],['Disease Models','41'],['Avg Risk Score','65%'],['Prevention Rate','78%']].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-purple-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DISEASE_CATEGORIES.map((c,i)=>(
          <motion.div key={c.name} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <span className="text-2xl">{c.icon}</span>
            <p className="text-xl font-extrabold mt-1" style={{color:c.color}}>{c.count}</p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{c.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="font-extrabold text-slate-700 mb-3 text-sm">Filter by Breed</p>
        <div className="flex gap-2 flex-wrap">
          {breeds.map(b=>(
            <button key={b} onClick={()=>setBreedFilter(b)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${breedFilter===b?'text-white border-transparent':'bg-white border-slate-200 text-slate-600'}`}
              style={breedFilter===b?{background:GRAD}:{}}>
              {b==='All'?'All Breeds':b}
            </button>
          ))}
        </div>
      </div>

      {/* Risk table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <p className="font-extrabold text-slate-800">⚠️ Breed Disease Risk Matrix</p>
        </div>
        <div className="divide-y divide-slate-50">
          {visible.map((b,i)=>(
            <motion.div key={b.breed} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.06}}
              className={`p-4 cursor-pointer hover:bg-slate-50 transition ${selected===i?'bg-purple-50':''}`}
              onClick={()=>setSelected(selected===i?null:i)}>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-extrabold text-slate-800 text-sm">{b.breed}</p>
                  <p className="text-xs text-rose-600 font-bold">⚠️ {b.risk}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Typical onset: {b.age}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold" style={{color:b.prob>65?'#ef4444':b.prob>45?'#f59e0b':'#10b981'}}>{b.prob}%</p>
                  <p className="text-[10px] text-slate-400">Risk Score</p>
                </div>
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-2">
                <motion.div className="h-2 rounded-full" style={{background:b.prob>65?'#ef4444':b.prob>45?'#f59e0b':'#10b981'}}
                  initial={{width:0}} animate={{width:`${b.prob}%`}} transition={{delay:i*0.06+0.3}}/>
              </div>
              {selected===i && (
                <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
                  className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <p className="text-xs font-bold text-indigo-700">🩺 Recommended Intervention:</p>
                  <p className="text-xs text-indigo-600 mt-1">{b.action}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <button onClick={()=>{setLoading(true);setTimeout(()=>setLoading(false),1600);}} disabled={loading}
        className="w-full py-3 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
        style={{background:GRAD}}>
        {loading?<><RefreshCw className="w-4 h-4 animate-spin"/>Running Disease Models...</>:'🧬 Run Predictive Disease Analysis'}
      </button>
    </div>
  );
}
