import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#6366f1,#a855f7)';

const CASES = [
  { id:1, patient:'Bruno (Lab, 4y)', symptom:'Lethargy + vomiting for 2 days', urgency:'high' },
  { id:2, patient:'Luna (Persian, 2y)', symptom:'Skin rash and excessive scratching', urgency:'medium' },
  { id:3, patient:'Rocky (Husky, 6y)', symptom:'Limping on right hind leg', urgency:'high' },
];

const generatePathway = (symptom) => [
  { step:1, action:'Physical examination & vitals', done:false, time:'5 min' },
  { step:2, action:`AI symptom analysis: "${symptom.slice(0,30)}..."`, done:false, time:'2 min' },
  { step:3, action:'Differential diagnosis generation', done:false, time:'3 min' },
  { step:4, action:'Lab tests recommended', done:false, time:'15 min' },
  { step:5, action:'Treatment pathway finalized', done:false, time:'5 min' },
];

export default function VetDecisionEnginePanel() {
  const [selected, setSelected]   = useState(null);
  const [pathway, setPathway]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [step, setStep]           = useState(0);

  const generate = (c) => {
    setSelected(c); setLoading(true); setStep(0);
    const p = generatePathway(c.symptom);
    setPathway(p.map(x => ({ ...x, done: false })));
    let i = 0;
    const t = setInterval(() => {
      setPathway(prev => prev.map((s, idx) => idx === i ? { ...s, done: true } : s));
      setStep(i + 1);
      i++;
      if (i >= p.length) { clearInterval(t); setLoading(false); logGlobalActivity('Vet', `AI Decision Engine: treatment pathway for ${c.patient}`, '🧠', 'vet'); }
    }, 800);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[130px]">🧠</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🧠 AI Diagnostics</span>
        <h2 className="text-2xl font-black mt-2">Smart Vet Decision Engine</h2>
        <p className="text-indigo-100 text-sm mt-1">AI-generated optimized treatment pathways for complex veterinary cases.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CASES.map((c, i) => (
          <motion.button key={c.id} onClick={() => generate(c)} whileHover={{ scale: 1.02 }}
            className={`text-left p-4 rounded-2xl border transition ${selected?.id === c.id ? 'border-indigo-400 bg-indigo-50' : 'bg-white border-slate-100 shadow-sm'}`}>
            <p className="font-extrabold text-slate-800 text-sm">{c.patient}</p>
            <p className="text-xs text-slate-500 mt-1">{c.symptom}</p>
            <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${c.urgency === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
              {c.urgency} urgency
            </span>
          </motion.button>
        ))}
      </div>

      {selected && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-extrabold text-slate-800">🧠 AI Treatment Pathway — {selected.patient}</p>
            {loading && <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />}
          </div>
          <div className="space-y-3">
            {pathway.map((p, i) => (
              <motion.div key={p.step} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${p.done ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold ${p.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {p.done ? <CheckCircle className="w-4 h-4" /> : p.step}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${p.done ? 'text-emerald-700' : 'text-slate-600'}`}>{p.action}</p>
                </div>
                <span className="text-xs text-slate-400">{p.time}</span>
              </motion.div>
            ))}
          </div>
          {!loading && step >= pathway.length && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center">
              <p className="font-extrabold text-indigo-700">✅ Treatment Pathway Complete</p>
              <p className="text-xs text-indigo-500 mt-1">AI confidence: 94% · Estimated recovery: 7-10 days</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
