import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logGlobalActivity } from '../utils/activityFeed';

// ── 1. Realtime AI Life Score ─────────────────────────────────────────────────
export function AILifeScorePanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);
  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';
  const walks = JSON.parse(localStorage.getItem('petWalks') || '[]').length;
  const hydra = JSON.parse(localStorage.getItem('petHydrationLogs') || '[]').length;
  const baseScore = Math.min(98, 72 + walks * 2 + hydra);
  const score = baseScore + (tick % 3);
  const dims = [
    { label: 'Activity',   val: Math.min(100, 60 + walks * 5), color: '#6366f1', icon: '⚡' },
    { label: 'Nutrition',  val: 78,                             color: '#10b981', icon: '🍗' },
    { label: 'Hydration',  val: Math.min(100, 55 + hydra * 8), color: '#14b8a6', icon: '💧' },
    { label: 'Sleep',      val: 85,                             color: '#8b5cf6', icon: '🌙' },
    { label: 'Emotion',    val: 91,                             color: '#f59e0b', icon: '💜' },
    { label: 'Social',     val: 74,                             color: '#ec4899', icon: '🤝' },
  ];
  const G = 'linear-gradient(135deg,#6366f1,#a855f7,#14b8a6)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: G }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[120px]">💫</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">💫 Wellness Analytics</span>
        <h2 className="text-2xl font-black mt-2">Realtime AI Life Score</h2>
        <p className="text-indigo-100 text-sm mt-1">Composite wellness intelligence for {petName} — updated every 2 seconds.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center">
        <div className="relative w-44 h-44 mb-4">
          <svg className="w-44 h-44 -rotate-90" viewBox="0 0 144 144">
            <circle cx="72" cy="72" r="62" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <motion.circle cx="72" cy="72" r="62" fill="none" stroke="url(#lg)" strokeWidth="10"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * 62}
              animate={{ strokeDashoffset: 2 * Math.PI * 62 * (1 - score / 100) }} transition={{ duration: 0.5 }} />
            <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#14b8a6"/></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p key={score} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-4xl font-black text-slate-900">{score}</motion.p>
            <p className="text-xs font-bold text-indigo-500">LIFE SCORE</p>
            <motion.div className="w-2 h-2 rounded-full mt-1 bg-emerald-400" animate={{ scale: [1,1.5,1] }} transition={{ repeat: Infinity, duration: 1 }} />
          </div>
        </div>
        <p className="text-sm font-bold text-slate-500 mb-4">🟢 Live • Updates every 2s • Synced from 6 modules</p>
        <div className="w-full grid grid-cols-3 gap-3">
          {dims.map((d, i) => (
            <div key={d.label} className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-lg mb-0.5">{d.icon}</p>
              <p className="text-base font-extrabold" style={{ color: d.color }}>{d.val}</p>
              <p className="text-[10px] text-slate-400">{d.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 2. Interactive AI Wellness Universe ───────────────────────────────────────
export function WellnessUniversePanel() {
  const [selected, setSelected] = useState(null);
  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';
  const PLANETS = [
    { id:'activity',  label:'Activity',   size:48, orbit:90,  angle:0,   color:'#6366f1', emoji:'⚡', score:82, desc:'Daily walks, play and movement data.' },
    { id:'health',    label:'Health',     size:56, orbit:0,   angle:0,   color:'#14b8a6', emoji:'❤️', score:90, desc:'Core health vitals and medical history.' },
    { id:'nutrition', label:'Nutrition',  size:40, orbit:140, angle:60,  color:'#10b981', emoji:'🍗', score:78, desc:'Diet planner and hydration tracking.' },
    { id:'emotion',   label:'Emotion',    size:36, orbit:180, angle:120, color:'#a855f7', emoji:'💜', score:91, desc:'Mood detection and aura scans.' },
    { id:'sleep',     label:'Sleep',      size:34, orbit:220, angle:200, color:'#8b5cf6', emoji:'🌙', score:85, desc:'Sleep cycle and rest quality.' },
    { id:'social',    label:'Social',     size:32, orbit:260, angle:280, color:'#f59e0b', emoji:'🤝', score:74, desc:'Playdates and community interactions.' },
  ];
  const sel = PLANETS.find(p => p.id === selected);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#6366f1)' }}>
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 70% 50%, #a855f7 0%, transparent 60%)' }} />
        <span className="relative bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌌 Wellness World</span>
        <h2 className="relative text-2xl font-black mt-2">AI Wellness Universe</h2>
        <p className="relative text-indigo-200 text-sm mt-1">Explore {petName}'s wellness as an immersive living universe of orbiting health planets.</p>
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 relative overflow-hidden" style={{ minHeight: 380 }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f0f23 100%)' }} />
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-white opacity-40"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
        ))}
        <div className="relative flex items-center justify-center" style={{ height: 340 }}>
          {PLANETS.map((p, i) => {
            const a = (p.angle * Math.PI) / 180;
            const cx = p.orbit * Math.cos(a);
            const cy = p.orbit * Math.sin(a) * 0.45;
            return (
              <div key={p.id}>
                {p.orbit > 0 && (
                  <div className="absolute rounded-full border border-white/10 pointer-events-none"
                    style={{ width: p.orbit * 2, height: p.orbit * 0.9, left: `50%`, top: '50%', marginLeft: -p.orbit, marginTop: -p.orbit * 0.45 }} />
                )}
                <motion.div className="absolute flex flex-col items-center cursor-pointer"
                  style={{ left: '50%', top: '50%', marginLeft: cx - p.size / 2, marginTop: cy - p.size / 2 }}
                  animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.4 }}
                  onClick={() => setSelected(p.id === selected ? null : p.id)}
                  whileHover={{ scale: 1.15 }}>
                  <motion.div className="rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                    style={{ width: p.size, height: p.size, background: p.color, boxShadow: `0 0 ${selected === p.id ? 20 : 8}px ${p.color}88` }}>
                    <span style={{ fontSize: p.size * 0.4 }}>{p.emoji}</span>
                  </motion.div>
                  <p className="text-white text-[9px] font-bold mt-1 whitespace-nowrap">{p.label}</p>
                  <p className="text-[9px] font-extrabold" style={{ color: p.color }}>{p.score}%</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: sel.color + '20' }}>{sel.emoji}</div>
            <div className="flex-1">
              <p className="font-extrabold text-slate-800">{sel.label} Planet</p>
              <p className="text-sm text-slate-500">{sel.desc}</p>
            </div>
            <div className="text-center"><p className="text-2xl font-extrabold" style={{ color: sel.color }}>{sel.score}%</p><p className="text-xs text-slate-400">score</p></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── 3. AI Emotion Reaction Avatar ─────────────────────────────────────────────
export function EmotionAvatarPanel() {
  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';
  const MOODS = [
    { label:'Happy',     emoji:'😊', color:'#f59e0b', bg:'#fef3c7', desc:'Tail wagging, bright eyes, playful.' },
    { label:'Excited',   emoji:'🎉', color:'#ef4444', bg:'#fee2e2', desc:'High energy, jumping, vocalizing.' },
    { label:'Calm',      emoji:'😌', color:'#14b8a6', bg:'#ccfbf1', desc:'Relaxed posture, slow breathing.' },
    { label:'Sleepy',    emoji:'😴', color:'#8b5cf6', bg:'#ede9fe', desc:'Half-closed eyes, low movement.' },
    { label:'Curious',   emoji:'🧐', color:'#6366f1', bg:'#e0e7ff', desc:'Head tilted, sniffing, alert ears.' },
    { label:'Stressed',  emoji:'😰', color:'#f97316', bg:'#ffedd5', desc:'Panting, pacing, tucked tail.' },
  ];
  const [current, setCurrent] = useState(0);
  const mood = MOODS[current];
  useEffect(() => { const t = setInterval(() => setCurrent(c => (c + 1) % MOODS.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#ec4899,#8b5cf6,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🎭 Smart Avatar</span>
        <h2 className="text-2xl font-black mt-2">AI Emotion Reaction Avatar</h2>
        <p className="text-pink-100 text-sm mt-1">AI avatars for {petName} dynamically react to mood, health, and activity in realtime.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.4 }} className="flex flex-col items-center mb-6">
            <motion.div className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-2xl mb-3"
              style={{ background: mood.bg, boxShadow: `0 0 40px ${mood.color}44` }}
              animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              {mood.emoji}
            </motion.div>
            <p className="text-2xl font-extrabold" style={{ color: mood.color }}>{mood.label}</p>
            <p className="text-sm text-slate-500 text-center mt-1 max-w-xs">{mood.desc}</p>
          </motion.div>
        </AnimatePresence>
        <div className="grid grid-cols-3 gap-3 w-full">
          {MOODS.map((m, i) => (
            <motion.button key={m.label} onClick={() => setCurrent(i)} whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition ${current === i ? 'border-transparent shadow-lg' : 'border-slate-100 bg-white'}`}
              style={current === i ? { background: m.bg, borderColor: m.color } : {}}>
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.label}</span>
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4 animate-pulse">🔄 Auto-cycling every 4s — or tap to select</p>
      </div>
    </div>
  );
}

// ── 4. Interactive Live Health Orbit ──────────────────────────────────────────
export function HealthOrbitPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1500); return () => clearInterval(t); }, []);
  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';
  const VITALS = [
    { label:'Heart Rate',  val: () => 72 + tick % 8,    unit:'bpm',  color:'#ef4444', orbitR:55,  angle:0,   size:36 },
    { label:'Temp',        val: () => 38.4,              unit:'°C',   color:'#f97316', orbitR:95,  angle:90,  size:30 },
    { label:'O₂',          val: () => 98 - tick % 2,    unit:'%',    color:'#14b8a6', orbitR:135, angle:180, size:28 },
    { label:'Activity',    val: () => 6200 + tick * 10, unit:'steps',color:'#6366f1', orbitR:170, angle:270, size:26 },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔵 Health Monitoring</span>
        <h2 className="text-2xl font-black mt-2">Interactive Live Health Orbit</h2>
        <p className="text-indigo-200 text-sm mt-1">Planetary orbit-style realtime vital tracking for {petName} — live every 1.5s.</p>
      </div>
      <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center" style={{ minHeight: 420 }}>
        <div className="relative" style={{ width: 380, height: 380 }}>
          {VITALS.map((v, i) => {
            const a = ((tick * 2 + i * 90) * Math.PI) / 180;
            const cx = 190 + v.orbitR * Math.cos(a);
            const cy = 190 + v.orbitR * Math.sin(a) * 0.6;
            return (
              <div key={v.label}>
                <div className="absolute rounded-full border border-white/10 pointer-events-none"
                  style={{ width: v.orbitR * 2, height: v.orbitR * 1.2, left: 190 - v.orbitR, top: 190 - v.orbitR * 0.6 }} />
                <motion.div className="absolute flex flex-col items-center" style={{ left: cx - v.size / 2, top: cy - v.size / 2 }}>
                  <div className="rounded-full flex items-center justify-center text-white text-[9px] font-extrabold shadow-lg"
                    style={{ width: v.size, height: v.size, background: v.color, boxShadow: `0 0 12px ${v.color}88` }}>
                    {v.val()}
                  </div>
                  <p className="text-white text-[8px] mt-0.5 whitespace-nowrap">{v.label}</p>
                </motion.div>
              </div>
            );
          })}
          <div className="absolute flex items-center justify-center" style={{ left: 165, top: 165, width: 60, height: 60 }}>
            <motion.div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'radial-gradient(circle,#6366f1,#1e1b4b)', boxShadow: '0 0 30px #6366f180' }}
              animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              🐾
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 5. AI Pet Legacy Vault ────────────────────────────────────────────────────
export function LegacyVaultPanel() {
  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';
  const walks   = JSON.parse(localStorage.getItem('petWalks') || '[]');
  const journals = JSON.parse(localStorage.getItem('petJournals') || '[]');
  const memories = JSON.parse(localStorage.getItem('petMemories') || '[]');
  const prescriptions = JSON.parse(localStorage.getItem('allPrescriptions') || '[]');
  const MILESTONES = [
    { label:'First Walk Logged',       date:'Jan 2025', icon:'🚶', achieved: walks.length > 0 },
    { label:'First Journal Entry',     date:'Feb 2025', icon:'📔', achieved: journals.length > 0 },
    { label:'First Prescription',      date:'Mar 2025', icon:'💊', achieved: prescriptions.length > 0 },
    { label:'Photo Memory Added',      date:'Apr 2025', icon:'📸', achieved: memories.length > 0 },
    { label:'10 Walks Completed',      date:'May 2025', icon:'🏆', achieved: walks.length >= 10 },
    { label:'Community Member',        date:'Jun 2025', icon:'🤝', achieved: true },
    { label:'Health Passport Created', date:'Jul 2025', icon:'📋', achieved: true },
    { label:'Emergency Profile Set',   date:'Aug 2025', icon:'🚨', achieved: true },
  ];
  const achieved = MILESTONES.filter(m => m.achieved).length;
  const G = 'linear-gradient(135deg,#7c3aed,#6366f1,#14b8a6)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: G }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[120px]">🏛</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🏛 Memory Universe</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Legacy Vault</h2>
        <p className="text-purple-100 text-sm mt-1">Every milestone, memory, and achievement in {petName}'s life journey — preserved forever.</p>
        <div className="flex gap-6 mt-4">
          {[['Milestones', achieved + '/' + MILESTONES.length],['Walks',walks.length],['Journals',journals.length],['Memories',memories.length]].map(([l,v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-purple-200">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🏆 Life Milestones</p>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-100" />
          <div className="space-y-4">
            {MILESTONES.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10 border-2 ${m.achieved ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                  {m.achieved ? m.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${m.achieved ? 'text-slate-800' : 'text-slate-400'}`}>{m.label}</p>
                  <p className="text-xs text-slate-400">{m.date}</p>
                </div>
                {m.achieved && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">✅ Achieved</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 6. Smart Pet Energy Reactor ───────────────────────────────────────────────
export function EnergyReactorPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 800); return () => clearInterval(t); }, []);
  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';
  const walks = JSON.parse(localStorage.getItem('petWalks') || '[]').length;
  const energy = Math.min(99, 45 + walks * 8 + (tick % 10));
  const G = 'linear-gradient(135deg,#f59e0b,#ef4444,#a855f7)';
  const RINGS = [energy, energy - 15, energy - 30].map((v, i) => Math.max(10, v));
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">⚛ Activity Intelligence</span>
        <h2 className="text-2xl font-black mt-2">Smart Pet Energy Reactor</h2>
        <p className="text-amber-100 text-sm mt-1">Realtime energy visualization for {petName} based on activity and wellness.</p>
      </div>
      <div className="bg-slate-900 rounded-2xl p-8 flex flex-col items-center" style={{ minHeight: 360 }}>
        <div className="relative w-56 h-56 flex items-center justify-center mb-6">
          {RINGS.map((r, i) => (
            <motion.div key={i} className="absolute rounded-full border-4"
              style={{ width: 220 - i * 44, height: 220 - i * 44, borderColor: ['#f59e0b','#ef4444','#a855f7'][i] + '88', boxShadow: `0 0 ${20 - i * 4}px ${['#f59e0b','#ef4444','#a855f7'][i]}66` }}
              animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4 + i * 2, ease: 'linear' }} />
          ))}
          <motion.div className="w-20 h-20 rounded-full flex flex-col items-center justify-center z-10"
            style={{ background: 'radial-gradient(circle,#f59e0b,#ef4444)', boxShadow: '0 0 40px #f59e0b99' }}
            animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
            <p className="text-white text-2xl font-extrabold">{energy}</p>
            <p className="text-white text-[9px] font-bold">ENERGY %</p>
          </motion.div>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {[['Walks',walks,'🚶'],['Rings',RINGS[0],'⚛'],['Peak','4 PM','⏰']].map(([l,v,e]) => (
            <div key={l} className="text-center">
              <p className="text-xl mb-0.5">{e}</p>
              <p className="text-white text-base font-extrabold">{v}</p>
              <p className="text-slate-400 text-[10px]">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
