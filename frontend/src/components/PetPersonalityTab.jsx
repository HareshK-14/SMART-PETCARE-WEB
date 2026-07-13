import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#8b5cf6,#6366f1,#14b8a6)';

const PERSONALITY_TRAITS = {
  Calm:       { icon:'😌', color:'#14b8a6', desc:'Your pet prefers quiet environments and gentle play.' },
  Energetic:  { icon:'⚡', color:'#f59e0b', desc:'High-energy pet — needs 60+ min of exercise daily.' },
  Social:     { icon:'🤝', color:'#6366f1', desc:'Loves interaction. Great for multi-pet households.' },
  Protective: { icon:'🛡️', color:'#10b981', desc:'Strong guardian instinct. Bonds deeply with family.' },
  Curious:    { icon:'🔍', color:'#8b5cf6', desc:'Highly inquisitive. Enrichment toys are essential.' },
  Affectionate:{ icon:'💞', color:'#ec4899', desc:'Loves cuddles and physical closeness with owners.' },
};

const BREED_PERSONALITY = {
  'Labrador Retriever': { Energetic:88, Social:95, Affectionate:90, Calm:45, Protective:55, Curious:75 },
  'Golden Retriever':   { Energetic:75, Social:92, Affectionate:95, Calm:60, Protective:50, Curious:70 },
  'German Shepherd':    { Energetic:85, Social:65, Affectionate:75, Calm:55, Protective:98, Curious:80 },
  'Persian Cat':        { Energetic:30, Social:50, Affectionate:78, Calm:95, Protective:25, Curious:60 },
  'Beagle':             { Energetic:80, Social:85, Affectionate:80, Calm:40, Protective:50, Curious:92 },
  'Poodle':             { Energetic:78, Social:88, Affectionate:85, Calm:65, Protective:55, Curious:88 },
};

const RECOMMENDATIONS = {
  Energetic:   ['Daily 60-min walks or runs', 'Agility or fetch training', 'Puzzle feeders & enrichment toys'],
  Social:      ['Regular playdates with other pets', 'Dog park visits 3x/week', 'Socialization classes'],
  Calm:        ['Gentle indoor play sessions', 'Massage & relaxation routines', 'Quiet rest zones at home'],
  Protective:  ['Positive reinforcement training', 'Early socialization programs', 'Structured boundary training'],
  Curious:     ['Scent trails & nose work games', 'Exploration walks in new areas', 'Rotating toy collection'],
  Affectionate:['Daily cuddle time', 'Gentle grooming sessions', 'Lap time & physical bonding activities'],
};

export default function PetPersonalityTab() {
  const [breed, setBreed] = useState('Labrador Retriever');
  const [loading, setLoading] = useState(false);
  const scores = BREED_PERSONALITY[breed] || BREED_PERSONALITY['Labrador Retriever'];
  const dominant = Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
  const trait = PERSONALITY_TRAITS[dominant];

  const analyze = () => { setLoading(true); setTimeout(()=>setLoading(false), 1500); };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">🧠</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🧠 AI Personality</span>
        <h2 className="text-2xl font-black mt-2">AI Personality Analyzer</h2>
        <p className="text-indigo-100 text-sm mt-1">Deep behavioral profiling and personalized care recommendations powered by AI.</p>
        <div className="flex gap-6 mt-4">
          {[['Dominant Trait',dominant],['Personality Score',scores[dominant]+'%'],['Profile Type','Breed-Based'],['Traits Analyzed','6']].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-violet-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Breed selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <label className="text-xs font-bold text-slate-500 mb-2 block">Breed</label>
        <select value={breed} onChange={e=>setBreed(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-300 outline-none">
          {Object.keys(BREED_PERSONALITY).map(b=><option key={b}>{b}</option>)}
        </select>
      </div>

      {/* Dominant personality card */}
      <div className="rounded-2xl p-5 border-2" style={{background:trait.color+'10', borderColor:trait.color+'40'}}>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{trait.icon}</span>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dominant Personality</p>
            <p className="text-2xl font-black mt-0.5" style={{color:trait.color}}>{dominant}</p>
            <p className="text-sm text-slate-600 mt-1">{trait.desc}</p>
          </div>
        </div>
      </div>

      {/* Trait radar / bars */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🎭 Full Personality Profile</p>
        <div className="space-y-3">
          {Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([trait,score],i)=>{
            const t = PERSONALITY_TRAITS[trait];
            return (
              <div key={trait} className="flex items-center gap-3">
                <span className="text-lg w-7">{t.icon}</span>
                <span className="text-xs font-bold text-slate-700 w-24 flex-shrink-0">{trait}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <motion.div className="h-4 rounded-full flex items-center justify-end pr-2"
                    style={{background:t.color}} initial={{width:0}} animate={{width:`${score}%`}}
                    transition={{delay:i*0.08,duration:0.8}}>
                    {score>20 && <span className="text-white text-[10px] font-bold">{score}%</span>}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized recommendations */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">💡 Personalized Care Recommendations</p>
        <div className="space-y-2">
          {(RECOMMENDATIONS[dominant]||[]).map((r,i)=>(
            <motion.div key={r} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
              className="flex items-center gap-3 p-3 bg-violet-50 border border-violet-100 rounded-xl">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:trait.color}}/>
              <span className="text-sm font-bold text-slate-700">{r}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <button onClick={analyze} disabled={loading}
        className="w-full py-3 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
        style={{background:GRAD}}>
        {loading ? <><RefreshCw className="w-4 h-4 animate-spin"/>Analyzing...</> : '🧠 Re-Analyze Personality'}
      </button>
    </div>
  );
}
