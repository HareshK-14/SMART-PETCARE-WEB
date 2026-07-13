import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Plus, Clock, Image, Heart } from 'lucide-react';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#8b5cf6,#6366f1,#14b8a6)';

const INIT_CAPSULES = [
  { id:1, title:'First Birthday Memory', note:'You chased butterflies all morning!', unlockDate:'2027-01-15', locked:true,  emoji:'🎂', color:'#8b5cf6' },
  { id:2, title:'Puppy Day Throwback',   note:'The day we brought you home.',        unlockDate:'2025-06-01', locked:false, emoji:'🐶', color:'#10b981' },
  { id:3, title:'Summer Adventures',     note:'Beach trip memories for your 3rd bday.', unlockDate:'2026-08-20', locked:true, emoji:'🏖', color:'#f59e0b' },
];

export default function TimeCapsuleTab() {
  const [capsules, setCapsules] = useState(INIT_CAPSULES);
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState({ title:'', note:'', unlockDate:'', emoji:'💌' });

  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';
  const today = new Date().toISOString().split('T')[0];

  const addCapsule = () => {
    if (!form.title) return;
    const c = { id: Date.now(), ...form, locked: form.unlockDate > today, color: '#6366f1' };
    setCapsules(prev => [c, ...prev]);
    logGlobalActivity('Owner', `Time Capsule "${form.title}" created for ${petName}`, '💌', 'activity');
    setForm({ title:'', note:'', unlockDate:'', emoji:'💌' });
    setShowAdd(false);
  };

  const unlock = (id) => setCapsules(c => c.map(x => x.id === id ? { ...x, locked: false } : x));

  const isUnlockable = (unlockDate) => unlockDate <= today;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[130px]">💌</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">💌 Memory Timeline</span>
        <h2 className="text-2xl font-black mt-2">Interactive Pet Time Capsule</h2>
        <p className="text-purple-100 text-sm mt-1">Seal precious memories for {petName} to unlock at future milestone dates.</p>
        <div className="flex gap-6 mt-4">
          {[['Capsules', capsules.length],['Locked', capsules.filter(c=>c.locked).length],['Unlocked', capsules.filter(c=>!c.locked).length]].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-purple-200">{l}</p></div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowAdd(s => !s)} className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-bold rounded-xl" style={{ background: GRAD }}>
          <Plus className="w-4 h-4" />Create Capsule
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-purple-200 shadow-sm p-5 space-y-3">
            <p className="font-extrabold text-slate-800">✨ New Time Capsule</p>
            <div className="grid grid-cols-2 gap-3">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Capsule title..."
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-300 outline-none" />
              <input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="Emoji"
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-300 outline-none" />
            </div>
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Write a message to unlock in the future..." rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-300 outline-none resize-none" />
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Unlock Date</label>
              <input type="date" value={form.unlockDate} onChange={e => setForm(f => ({ ...f, unlockDate: e.target.value }))}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-300 outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={addCapsule} className="flex-1 py-2.5 text-white font-bold text-sm rounded-xl" style={{ background: GRAD }}>Seal Capsule 💌</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 text-slate-600 font-bold text-sm rounded-xl border border-slate-200">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {capsules.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`bg-white rounded-2xl border shadow-sm p-5 ${c.locked ? 'border-slate-200' : 'border-emerald-200'}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: c.color + '20' }}>
                {c.locked ? '🔒' : c.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-extrabold text-slate-800">{c.locked ? '🔒 Sealed Capsule' : c.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.locked ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                    {c.locked ? 'Locked' : 'Unlocked'}
                  </span>
                </div>
                {!c.locked && <p className="text-sm text-slate-500 italic">"{c.note}"</p>}
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />Unlocks: {c.unlockDate}</p>
              </div>
              {c.locked && isUnlockable(c.unlockDate) && (
                <button onClick={() => unlock(c.id)} className="px-3 py-1.5 text-xs font-bold text-white rounded-xl flex-shrink-0" style={{ background: GRAD }}>
                  Unlock ✨
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
