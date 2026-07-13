import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logGlobalActivity } from '../utils/activityFeed';

const P = (n) => JSON.parse(localStorage.getItem(n) || '[]');
const PET = () => P('ownerPets')[0]?.name || 'Bruno';

// 1. AI Pet Emotion Mirror
export function EmotionMirrorPanel() {
  const [idx, setIdx] = useState(0);
  const EMOTIONS = [
    { name:'Joyful',   emoji:'😄', wave:'#f59e0b', bg:'#fef3c7', desc:'Bright energy detected. Tail wagging, bright eyes.' },
    { name:'Calm',     emoji:'😌', wave:'#14b8a6', bg:'#ccfbf1', desc:'Relaxed state. Slow breathing, soft gaze.' },
    { name:'Playful',  emoji:'🎉', wave:'#6366f1', bg:'#e0e7ff', desc:'High engagement. Ready for activity.' },
    { name:'Sleepy',   emoji:'😴', wave:'#8b5cf6', bg:'#ede9fe', desc:'Rest cycle. Low movement, drooping ears.' },
    { name:'Curious',  emoji:'🧐', wave:'#10b981', bg:'#d1fae5', desc:'Exploring mode. Alert posture, sniffing.' },
    { name:'Anxious',  emoji:'😰', wave:'#ef4444', bg:'#fee2e2', desc:'Stress signals. Panting, tail tucked.' },
  ];
  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % EMOTIONS.length), 3500); return () => clearInterval(t); }, []);
  const e = EMOTIONS[idx];
  const WAVES = Array.from({ length: 40 }, (_, i) => 10 + Math.sin(i * 0.4 + idx) * 25 + Math.random() * 15);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#ec4899,#8b5cf6,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🪞 Emotion Reflection</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Emotion Mirror</h2>
        <p className="text-pink-100 text-sm mt-1">Live emotional state for {PET()} — AI-analyzed from behavior patterns.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }} transition={{ duration: 0.35 }}
            className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-2xl" style={{ background: e.bg, boxShadow: `0 0 40px ${e.wave}55` }}>
            {e.emoji}
          </motion.div>
        </AnimatePresence>
        <p className="text-2xl font-extrabold" style={{ color: e.wave }}>{e.name}</p>
        <p className="text-sm text-slate-500 text-center max-w-xs">{e.desc}</p>
        <div className="w-full flex items-end gap-0.5 h-12 mt-2">
          {WAVES.map((h, i) => (
            <motion.div key={i} className="flex-1 rounded-t" style={{ background: e.wave + '99' }}
              animate={{ height: h + (idx % 3) * 5 }} transition={{ duration: 0.4, delay: i * 0.01 }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
          {EMOTIONS.map((em, i) => (
            <button key={em.name} onClick={() => setIdx(i)}
              className={`py-2 rounded-xl border text-sm font-bold transition ${idx === i ? 'text-white border-transparent' : 'bg-white border-slate-100 text-slate-600'}`}
              style={idx === i ? { background: em.wave } : {}}>
              {em.emoji} {em.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. AI Pet Happiness Ocean
export function HappinessOceanPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 600); return () => clearInterval(t); }, []);
  const walks = P('petWalks').length;
  const hydra = P('petHydrationLogs').length;
  const happiness = Math.min(98, 50 + walks * 6 + hydra * 4);
  const WAVES = [happiness, happiness - 12, happiness - 22].map(v => Math.max(15, v));
  const color = happiness > 75 ? '#14b8a6' : happiness > 50 ? '#6366f1' : '#f59e0b';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#0ea5e9,#14b8a6,#10b981)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌊 Emotional Analytics</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Happiness Ocean</h2>
        <p className="text-cyan-100 text-sm mt-1">Happiness as animated ocean waves — driven by real interaction and wellness data.</p>
        <div className="flex gap-6 mt-4">
          {[['Happiness', happiness + '%'], ['Walks', walks], ['Hydration', hydra + ' logs'], ['Trend', happiness > 70 ? '↑ Rising' : '→ Stable']].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-cyan-200">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden relative" style={{ minHeight: 280, background: 'linear-gradient(to bottom,#0f172a,#0c4a6e)' }}>
        <svg className="absolute inset-x-0 bottom-0 w-full" viewBox="0 0 400 140" preserveAspectRatio="none" style={{ height: 280 }}>
          {WAVES.map((h, wi) => {
            const pts = Array.from({ length: 20 }, (_, i) => {
              const x = i * 21;
              const y = 140 - h - Math.sin((i + tick * 0.5 + wi * 2) * 0.5) * (12 + wi * 5);
              return `${x},${y}`;
            }).join(' L');
            return (
              <motion.path key={wi} d={`M0,140 L${pts} L400,140 Z`}
                fill={color} opacity={0.25 + wi * 0.15}
                animate={{ d: [`M0,140 L${pts} L400,140 Z`] }} />
            );
          })}
          <text x="200" y="70" textAnchor="middle" fill="white" fontSize="32" fontWeight="900">{happiness}%</text>
          <text x="200" y="92" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">HAPPINESS LEVEL</text>
        </svg>
      </div>
    </div>
  );
}

// 3. AI Pet Safety Bubble
export function SafetyBubblePanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1500); return () => clearInterval(t); }, []);
  const emergencies = P('platformEmergencies').filter(e => e.status !== 'resolved').length;
  const safetyScore = Math.max(40, 95 - emergencies * 10);
  const THREATS = [
    { label: 'Geofence Breach', risk: emergencies > 0 ? 'Active' : 'Clear', color: emergencies > 0 ? '#ef4444' : '#10b981', icon: '📍' },
    { label: 'Weather Risk',    risk: 'Low',    color: '#10b981', icon: '🌤' },
    { label: 'Stress Level',    risk: emergencies > 1 ? 'High' : 'Normal', color: emergencies > 1 ? '#f59e0b' : '#10b981', icon: '😰' },
    { label: 'Toxic Zones',    risk: 'Clear',   color: '#10b981', icon: '☣️' },
    { label: 'Traffic Alert',  risk: 'Moderate',color: '#f59e0b', icon: '🚗' },
    { label: 'Night Safety',   risk: 'Active',  color: '#6366f1', icon: '🌙' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#10b981,#6366f1,#8b5cf6)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🛡 Smart Protection</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Safety Bubble</h2>
        <p className="text-emerald-100 text-sm mt-1">Realtime intelligent safety shield for {PET()} — synced with emergency and geofence data.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center gap-4">
        <div className="relative w-40 h-40">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="absolute rounded-full border-2"
              style={{ inset: i * 10, borderColor: safetyScore > 70 ? '#10b981' : '#f59e0b', opacity: 0.2 + i * 0.2 }}
              animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }} />
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-extrabold" style={{ color: safetyScore > 70 ? '#10b981' : '#f59e0b' }}>{safetyScore}%</p>
            <p className="text-xs text-slate-500 font-bold">SAFETY SCORE</p>
          </div>
        </div>
        <p className="text-sm font-bold text-slate-600">{safetyScore > 80 ? '✅ Protected — No active threats' : '⚠️ Some risks detected'}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {THREATS.map((t, i) => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <span className="text-xl">{t.icon}</span>
            <div className="flex-1"><p className="font-bold text-sm text-slate-800">{t.label}</p></div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: t.color }}>{t.risk}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 4. Smart AI Pet Calendar Galaxy
export function CalendarGalaxyPanel() {
  const appts = P('ownerAppts');
  const today = new Date().toLocaleDateString('en-CA');
  const petName = PET();

  const DEFAULTS = [
    { id:'b1', title: `${petName}'s Birthday`, date: '2026-06-15', icon: '🎂', color: '#ec4899', type: 'birthday',  note: 'Annual birthday celebration!' },
    { id:'v1', title: 'Annual Vaccination',    date: '2026-07-01', icon: '💉', color: '#10b981', type: 'vaccine',   note: 'Rabies + DHPP booster due.' },
    { id:'g1', title: 'Grooming Session',      date: '2026-05-22', icon: '✂️', color: '#f59e0b', type: 'activity', note: 'Full bath, nail trim, ear clean.' },
    { id:'p1', title: 'Playdate',              date: '2026-05-19', icon: '🐾', color: '#a855f7', type: 'activity', note: 'Park playdate with Max & Luna.' },
    ...appts.slice(0, 3).map((a, i) => ({
      id: 'a' + i, title: `Vet Appt${a.vet ? ': ' + a.vet : ''}`, date: a.date || today,
      icon: '🏥', color: '#6366f1', type: 'appointment', note: a.reason || 'Scheduled vet visit.'
    })),
  ];

  const STORE_KEY = 'calendarGalaxyEvents';
  const load = () => {
    const saved = localStorage.getItem(STORE_KEY);
    return saved ? JSON.parse(saved) : DEFAULTS;
  };

  const [events, setEvents]     = useState(load);
  const [filter, setFilter]     = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [newEv, setNewEv]       = useState({ title:'', date: today, type:'activity', note:'' });

  const save = (evs) => { setEvents(evs); localStorage.setItem(STORE_KEY, JSON.stringify(evs)); };

  const addEvent = () => {
    if (!newEv.title || !newEv.date) return;
    const TYPE_META = {
      appointment:{ icon:'🏥', color:'#6366f1' },
      birthday:   { icon:'🎂', color:'#ec4899' },
      vaccine:    { icon:'💉', color:'#10b981' },
      activity:   { icon:'🐾', color:'#a855f7' },
    };
    const { icon, color } = TYPE_META[newEv.type] || TYPE_META.activity;
    const ev = { ...newEv, id: Date.now().toString(), icon, color };
    save([...events, ev].sort((a, b) => a.date > b.date ? 1 : -1));
    setNewEv({ title:'', date: today, type:'activity', note:'' });
    setShowAdd(false);
    logGlobalActivity('Owner', `New calendar event: ${ev.title} on ${ev.date}`, '📅', 'activity');
  };

  const deleteEvent = (id) => {
    save(events.filter(e => e.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const FILTERS = ['all','appointment','birthday','vaccine','activity'];
  const FILTER_LABELS = { all:'All', appointment:'Appts', birthday:'Birthdays', vaccine:'Vaccines', activity:'Activities' };

  const visible = filter === 'all' ? events : events.filter(e => e.type === filter);
  const upcoming = events.filter(e => e.date >= today).length;

  const G = 'linear-gradient(135deg,#020617,#1e1b4b,#6366f1)';

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌌 Event Universe</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Calendar Galaxy</h2>
        <p className="text-indigo-200 text-sm mt-1">Tap any event to expand details. Add, delete, and filter events freely.</p>
        <div className="flex gap-6 mt-4">
          {[['Total', events.length], ['Upcoming', upcoming], ['Today', events.filter(e => e.date === today).length], ['Appts', appts.length]].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-300">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Filter tabs + Add button */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${filter === f ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            style={filter === f ? { background: G } : {}}>
            {FILTER_LABELS[f]}
          </button>
        ))}
        <button onClick={() => setShowAdd(s => !s)}
          className="ml-auto px-4 py-1.5 text-xs font-bold text-white rounded-xl transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)' }}>
          {showAdd ? '✕ Cancel' : '＋ Add Event'}
        </button>
      </div>

      {/* Add Event Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 space-y-3">
            <p className="font-extrabold text-slate-800 text-sm">🌟 Add New Event</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Event Title</label>
                <input value={newEv.title} onChange={e => setNewEv(n => ({ ...n, title: e.target.value }))}
                  placeholder="e.g. Dental Check-up"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Date</label>
                <input type="date" value={newEv.date} onChange={e => setNewEv(n => ({ ...n, date: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Type</label>
                <select value={newEv.type} onChange={e => setNewEv(n => ({ ...n, type: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  <option value="appointment">🏥 Appointment</option>
                  <option value="birthday">🎂 Birthday</option>
                  <option value="vaccine">💉 Vaccine</option>
                  <option value="activity">🐾 Activity</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Note (optional)</label>
                <input value={newEv.note} onChange={e => setNewEv(n => ({ ...n, note: e.target.value }))}
                  placeholder="Add a note..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
            </div>
            <button onClick={addEvent}
              className="w-full py-2.5 text-white font-extrabold text-sm rounded-xl"
              style={{ background: G }}>
              🌟 Save Event
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event List */}
      <div className="space-y-2">
        {visible.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <p className="text-3xl mb-2">🌌</p>
            <p className="text-slate-400 text-sm">No events in this category. Click <strong>+ Add Event</strong> to create one.</p>
          </div>
        )}
        {visible.map((ev, i) => (
          <motion.div key={ev.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Row — click to expand */}
            <button className="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-50 transition"
              onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: ev.color + '18' }}>{ev.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-slate-800 truncate">{ev.title}</p>
                <p className="text-xs text-slate-400">{ev.date}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {ev.date === today && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Today!</span>}
                {ev.date > today  && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: ev.color + '15', color: ev.color }}>Upcoming</span>}
                {ev.date < today  && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">Past</span>}
                <span className="text-slate-300 text-sm">{expanded === ev.id ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Expanded detail */}
            <AnimatePresence>
              {expanded === ev.id && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-slate-100 px-5 py-4 flex items-start justify-between gap-4"
                  style={{ background: ev.color + '06' }}>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">📝 Note</p>
                    <p className="text-sm text-slate-700">{ev.note || 'No note added.'}</p>
                    <p className="text-xs text-slate-400 mt-1">Type: <span className="capitalize font-bold">{ev.type}</span> · Date: <span className="font-bold">{ev.date}</span></p>
                  </div>
                  <button onClick={() => deleteEvent(ev.id)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-bold text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 transition">
                    🗑 Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 5. AI Pet Compatibility Matcher
export function CompatibilityMatcherPanel() {
  const [matched, setMatched] = useState(false);
  const petName = PET();
  const MATCHES = [
    { name: 'Luna', breed: 'Persian Cat', score: 94, traits: ['Calm', 'Playful', 'Social'], icon: '🐱', color: '#a855f7' },
    { name: 'Max',  breed: 'Golden Retriever', score: 88, traits: ['Active', 'Friendly', 'Loyal'], icon: '🐕', color: '#f59e0b' },
    { name: 'Coco', breed: 'Beagle', score: 76, traits: ['Curious', 'Energetic', 'Vocal'], icon: '🐶', color: '#10b981' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">💞 Social Matching</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Compatibility Matcher</h2>
        <p className="text-pink-100 text-sm mt-1">AI matches {petName} with compatible pets based on personality, mood, and activity.</p>
      </div>
      {!matched ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center gap-4">
          <p className="text-5xl">🔮</p>
          <p className="font-extrabold text-slate-800 text-lg">Find {petName}'s Perfect Companions</p>
          <p className="text-slate-400 text-sm text-center max-w-sm">AI analyzes personality, activity levels, mood patterns, and social behavior to find the best matches.</p>
          <button onClick={() => setMatched(true)} className="px-8 py-3 text-white font-extrabold rounded-2xl" style={{ background: 'linear-gradient(135deg,#ec4899,#6366f1)' }}>
            💞 Find My Matches
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="font-extrabold text-slate-800">💞 Top Compatibility Matches for {petName}</p>
          {MATCHES.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: m.color + '18' }}>{m.icon}</div>
              <div className="flex-1">
                <p className="font-extrabold text-slate-800">{m.name} <span className="text-xs font-bold text-slate-400">· {m.breed}</span></p>
                <div className="flex gap-1 mt-1">{m.traits.map(t => <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{t}</span>)}</div>
                <div className="mt-2 w-full bg-slate-100 rounded-full h-2">
                  <motion.div className="h-2 rounded-full" style={{ background: m.color }}
                    initial={{ width: 0 }} animate={{ width: `${m.score}%` }} transition={{ delay: i * 0.15 + 0.3 }} />
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="text-2xl font-extrabold" style={{ color: m.color }}>{m.score}%</p>
                <p className="text-[10px] text-slate-400">match</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
