import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logGlobalActivity } from '../utils/activityFeed';
const P = n => JSON.parse(localStorage.getItem(n) || '[]');
const PET = () => P('ownerPets')[0]?.name || 'Bruno';

// 1. AI Pet Sixth Sense Engine
export function SixthSensePanel() {
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState(null);
  const emerg = P('platformEmergencies').length;
  const walks = P('petWalks').length;
  const run = () => {
    setScan(true); setResult(null);
    setTimeout(() => {
      const signals = [
        { signal:'Restlessness Pattern', risk: emerg > 0 ? 72 : 22, color:'#ef4444' },
        { signal:'Appetite Deviation',   risk: 18, color:'#f59e0b' },
        { signal:'Social Withdrawal',    risk: walks < 2 ? 55 : 12, color:'#8b5cf6' },
        { signal:'Vocalization Change',  risk: 30, color:'#14b8a6' },
        { signal:'Posture Anomaly',      risk: 15, color:'#6366f1' },
      ];
      setResult(signals);
      setScan(false);
      logGlobalActivity('Owner', `6th Sense Scan: ${signals[0].risk}% risk for ${PET()}`, '🔮', 'activity');
    }, 2200);
  };
  const G = 'linear-gradient(135deg,#8b5cf6,#6366f1,#14b8a6)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔮 Instinct Intelligence</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Sixth Sense Engine</h2>
        <p className="text-purple-100 text-sm mt-1">Predict unusual behavior before symptoms appear using AI instinct analysis for {PET()}.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center gap-4">
        {!result && !scan && (
          <>
            <motion.div className="text-7xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>🔮</motion.div>
            <p className="font-extrabold text-slate-800 text-lg">Run Sixth Sense Scan</p>
            <p className="text-sm text-slate-400 text-center max-w-sm">AI analyses behaviour, movement, and bio-signal deviations to predict issues before symptoms appear.</p>
            <button onClick={run} className="px-8 py-3 text-white font-extrabold rounded-2xl" style={{ background: G }}>⚡ Activate Sixth Sense</button>
          </>
        )}
        {scan && (
          <div className="flex flex-col items-center gap-3">
            <motion.div className="text-6xl" animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 1.5 }}>🔮</motion.div>
            <p className="font-bold text-slate-600 animate-pulse">Scanning instinct signals...</p>
          </div>
        )}
        {result && (
          <div className="w-full space-y-3">
            {result.map((r, i) => (
              <motion.div key={r.signal} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: r.color + '0d', borderColor: r.color + '33' }}>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-800">{r.signal}</p>
                  <div className="mt-1 bg-slate-100 rounded-full h-2">
                    <motion.div className="h-2 rounded-full" style={{ background: r.color }} initial={{ width: 0 }} animate={{ width: r.risk + '%' }} transition={{ delay: i * 0.1 + 0.2 }} />
                  </div>
                </div>
                <span className="text-sm font-extrabold flex-shrink-0" style={{ color: r.color }}>{r.risk}%</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.risk > 50 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{r.risk > 50 ? 'Watch' : 'Clear'}</span>
              </motion.div>
            ))}
            <button onClick={() => setResult(null)} className="text-xs text-slate-400 underline mx-auto block">Reset</button>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. AI Pet Energy Forest
export function EnergyForestPanel() {
  const [tick, setTick]         = useState(0);
  const [selected, setSelected] = useState(null);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1200); return () => clearInterval(t); }, []);

  const walks    = P('petWalks');
  const journals = P('petJournals');
  const walkCount = walks.length;
  const journalCount = journals.length;
  const treeCount = Math.min(20, 4 + walkCount * 2 + journalCount);

  const TREE_NAMES = ['Wellness Oak','Vitality Pine','Joy Spruce','Energy Birch','Calm Willow','Health Cedar','Spirit Maple','Harmony Elm','Balance Fir','Strength Ash'];
  const INSIGHTS   = [
    'Grew from consistent daily walks — reflects strong physical activity.',
    'Rooted in journal entries — emotional growth captured in writing.',
    'Thrives when activity and rest are balanced.',
    'Represents hydration consistency and healthy habits.',
    'Grew after a stress-free period — calm energy channelled into growth.',
    'Reflects positive bonding time between pet and owner.',
    'Milestone tree — marks a health improvement event.',
    'Community energy — grew after a successful playdate.',
    'Seasonal growth — thrives in cooler, active months.',
    'Champion tree — represents top wellness performance this month.',
  ];

  const TREES = Array.from({ length: treeCount }, (_, i) => ({
    x: 5 + (i % 10) * 10,
    y: 40 + Math.sin(i * 0.8) * 15,
    h: 25 + Math.sin(i * 0.5) * 15 + (walkCount > i ? 8 : 0),
    color: ['#10b981','#059669','#34d399','#6ee7b7','#14b8a6'][i % 5],
    sway: (i % 2 === 0 ? 1 : -1) * 3,
    name: TREE_NAMES[i % TREE_NAMES.length],
    source: i % 3 === 0 ? 'Journal Entry' : 'Walk Activity',
    insight: INSIGHTS[i % INSIGHTS.length],
    age: Math.max(1, walkCount - i + journalCount),
  }));

  const G        = 'linear-gradient(135deg,#10b981,#059669,#14b8a6)';
  const sel      = selected !== null ? TREES[selected] : null;
  const forestHP = Math.min(99, 40 + treeCount * 3);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌳 Wellness Visualization</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Energy Forest</h2>
        <p className="text-emerald-100 text-sm mt-1">Click any tree row below to see its wellness story for {PET()}.</p>
        <div className="flex gap-6 mt-4">
          {[['Trees',treeCount],['Walks',walkCount],['Journals',journalCount],['Forest HP',forestHP+'%']].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-emerald-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Animated forest SVG */}
      <div className="rounded-2xl overflow-hidden" style={{background:'linear-gradient(to bottom,#0f2d1a,#1a4d2e)',minHeight:240}}>
        <svg className="w-full" viewBox="0 0 100 80" style={{height:240}}>
          <defs><radialGradient id="sun2" cx="85%" cy="15%"><stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3"/><stop offset="100%" stopColor="transparent"/></radialGradient></defs>
          <rect x="0" y="0" width="100" height="80" fill="url(#sun2)"/>
          {[...Array(20)].map((_,i)=><circle key={i} cx={Math.random()*100} cy={Math.random()*35} r="0.25" fill="white" opacity={Math.random()*0.4}/>)}
          <rect x="0" y="65" width="100" height="15" fill="#1a3a12"/>
          {TREES.map((t,i)=>(
            <g key={i} style={{cursor:'pointer'}} onClick={()=>setSelected(selected===i?null:i)}>
              <motion.g animate={{rotate:[0,t.sway,0]}} transition={{repeat:Infinity,duration:2+i*0.3,ease:'easeInOut'}} style={{originX:t.x+'%',originY:t.y+'%'}}>
                <rect x={t.x-0.8} y={t.y} width="1.6" height={t.h*0.4} fill="#5c3a1e" rx="0.5"/>
                <polygon points={`${t.x},${t.y-t.h} ${t.x-t.h*0.4},${t.y+2} ${t.x+t.h*0.4},${t.y+2}`} fill={t.color} opacity={selected===i?1:0.85}/>
                <polygon points={`${t.x},${t.y-t.h*0.75} ${t.x-t.h*0.5},${t.y+5} ${t.x+t.h*0.5},${t.y+5}`} fill={t.color} opacity={selected===i?0.9:0.65}/>
                {selected===i && <circle cx={t.x} cy={t.y-t.h-2} r="1.5" fill="white" opacity="0.9"/>}
              </motion.g>
            </g>
          ))}
        </svg>
      </div>

      {/* Selected tree detail card */}
      <AnimatePresence>
        {sel && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.2}}
            className="bg-white rounded-2xl border-2 shadow-lg p-5" style={{borderColor:sel.color+'55'}}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{background:sel.color+'18'}}>🌳</div>
                <div>
                  <h3 className="font-extrabold text-slate-900">{sel.name}</h3>
                  <p className="text-xs text-slate-400">Tree #{selected+1} · Source: {sel.source}</p>
                </div>
              </div>
              <button onClick={()=>setSelected(null)} className="text-slate-400 hover:text-slate-700 font-bold text-lg transition">✕</button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[['🌱 Age',sel.age+' days'],['📏 Height',Math.round(sel.h)+'u'],['💚 Vitality',Math.min(99,50+sel.h)+'%']].map(([l,v])=>(
                <div key={l} className="p-3 rounded-xl text-center" style={{background:sel.color+'10'}}>
                  <p className="text-base font-extrabold text-slate-800">{v}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{l}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl" style={{background:sel.color+'0d'}}>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">🌿 Wellness Story</p>
              <p className="text-sm text-slate-700">{sel.insight}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clickable tree list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <p className="text-sm font-extrabold text-slate-700">🌳 All Trees ({treeCount}) <span className="text-slate-400 font-normal text-xs">— click any tree to view story</span></p>
        </div>
        {TREES.map((t,i)=>(
          <button key={i} onClick={()=>setSelected(selected===i?null:i)}
            className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-slate-50 transition border-b border-slate-50 last:border-0 ${selected===i?'bg-slate-50':''}`}>
            <div className="w-6 h-6 rounded-lg flex-shrink-0" style={{background:t.color}}/>
            <p className="text-sm font-bold text-slate-700 flex-1">{t.name}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t.source}</span>
            <span className="text-slate-300 text-xs">{selected===i?'▲':'▼'}</span>
          </button>
        ))}
      </div>

      {walkCount === 0 && <p className="text-center text-sm text-slate-400">🌱 Log walks and journal entries to grow your forest!</p>}
    </div>
  );
}

// 3. AI Pet Comfort Index
export function ComfortIndexPanel() {
  const [tick, setTick]         = useState(0);
  const [selected, setSelected] = useState(null);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);
  const walks = P('petWalks').length;
  const emerg = P('platformEmergencies').length;

  const DIMS = [
    { label:'Sleep Quality',    val: 82 + tick % 6,                 color:'#8b5cf6', icon:'🌙',
      desc:'Tracks rest cycle duration and quality based on inactivity periods and breathing patterns.',
      status: 'Good sleep detected — 7.2 hrs average.',
      causes:['Regular sleep schedule','Low night-time noise','Comfortable bedding'],
      tips:['Maintain consistent sleep time','Reduce screen light near sleeping area','Add a cozy blanket'] },
    { label:'Environment',      val: 78 + tick % 8,                 color:'#14b8a6', icon:'🏡',
      desc:'Measures how safe, familiar, and comfortable the surrounding space is for the pet.',
      status: 'Environment is stable and familiar.',
      causes:['Stable home routine','No recent moves','Familiar scents'],
      tips:['Avoid rearranging furniture often','Keep feeding spots consistent','Add pet-safe indoor plants'] },
    { label:'Temperature',      val: 88,                            color:'#f59e0b', icon:'🌡',
      desc:'Ambient temperature comfort score — ideal range is 18–24°C for most breeds.',
      status: 'Optimal temperature range detected.',
      causes:['Indoor climate control','Season','Coat type'],
      tips:['Ensure water is always cool','Avoid direct sunlight in hot hours','Monitor in peak summer'] },
    { label:'Noise Level',      val: 72 + tick % 10,                color:'#6366f1', icon:'🔇',
      desc:'Detects ambient noise stress. High noise causes anxiety and sleep disruption.',
      status: 'Moderate noise — some disturbance detected.',
      causes:['Traffic sounds','TV / music volume','Nearby construction'],
      tips:['Use white noise machine at night','Create a quiet retreat corner','Avoid loud music near pet'] },
    { label:'Activity Ease',    val: Math.min(98, 50 + walks * 10), color:'#10b981', icon:'🏃',
      desc:'How comfortably the pet moves and exercises based on logged walk data.',
      status: walks > 3 ? 'Active & comfortable movement.' : 'Low activity — needs more walks.',
      causes:['Daily walk count','Joint health','Weight'],
      tips:['Target 2–3 walks per day','Try new routes for enrichment','Consult vet if limping noticed'] },
    { label:'Emotional Safety',  val: Math.max(40, 90 - emerg * 15), color:'#ec4899', icon:'💜',
      desc:'Emotional wellbeing score — impacted by emergencies, stress events, and owner interaction.',
      status: emerg > 0 ? '⚠️ Active stress event detected.' : '✅ Emotionally stable.',
      causes:['Emergency events','Separation anxiety','Positive owner bonding'],
      tips:['Spend quality time daily','Avoid punishment-based training','Regular affection and praise'] },
  ];
  const overall = Math.round(DIMS.reduce((s, d) => s + d.val, 0) / DIMS.length);
  const sel = selected !== null ? DIMS[selected] : null;
  const G = 'linear-gradient(135deg,#8b5cf6,#6366f1,#14b8a6)';

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">😌 Comfort Analytics</span>
        <h2 className="text-2xl font-black mt-2">Smart Pet Comfort Index</h2>
        <p className="text-purple-100 text-sm mt-1">Click any dimension row to see full details, causes & AI tips for {PET()}.</p>
        <div className="flex gap-6 mt-4">
          {[['Overall', overall+'%'],['Dimensions',DIMS.length],['Status', overall>75?'😊 Cozy':'😐 Moderate']].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-purple-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Dimension rows */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {DIMS.map((d, i) => (
          <div key={d.label}>
            <button onClick={() => setSelected(selected === i ? null : i)}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50 ${selected===i?'bg-slate-50':''} ${i<DIMS.length-1?'border-b border-slate-100':''}`}>
              <span className="text-xl w-8 flex-shrink-0">{d.icon}</span>
              <span className="text-sm font-bold text-slate-700 w-32 flex-shrink-0">{d.label}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                <motion.div className="h-2.5 rounded-full" style={{background:d.color}}
                  animate={{width:d.val+'%'}} transition={{duration:0.5}}/>
              </div>
              <motion.span key={tick} className="text-sm font-extrabold w-10 text-right flex-shrink-0" style={{color:d.color}}>{d.val}%</motion.span>
              <span className="text-slate-300 text-xs flex-shrink-0 ml-1">{selected===i?'▲':'▼'}</span>
            </button>

            <AnimatePresence>
              {selected === i && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.2}}
                  className="border-t border-slate-100 px-5 py-4 space-y-3" style={{background:d.color+'07'}}>
                  {/* Status */}
                  <p className="text-sm font-bold" style={{color:d.color}}>{d.status}</p>
                  <p className="text-sm text-slate-600">{d.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl border border-slate-100 p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">⚡ Key Causes</p>
                      {d.causes.map(c=><p key={c} className="text-xs text-slate-700 flex gap-1.5 mb-1"><span style={{color:d.color}}>•</span>{c}</p>)}
                    </div>
                    <div className="bg-white rounded-xl border border-slate-100 p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">🤖 AI Tips</p>
                      {d.tips.map(t=><p key={t} className="text-xs text-slate-700 flex gap-1.5 mb-1"><span className="text-emerald-500">✓</span>{t}</p>)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. AI Pet Micro-Emotion Tracker
export function MicroEmotionPanel() {
  const [tick, setTick]       = useState(0);
  const [selected, setSelected] = useState(null);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 900); return () => clearInterval(t); }, []);

  const COLORS  = { joy:'#f59e0b', calm:'#14b8a6', excited:'#ef4444', neutral:'#94a3b8', anxious:'#f97316', playful:'#6366f1', sleepy:'#8b5cf6' };
  const EMOJIS  = { joy:'😄', calm:'😌', excited:'🎉', neutral:'😐', anxious:'😰', playful:'🎭', sleepy:'😴' };

  const DETAILS = {
    joy:     { label:'Joyful',    desc:'Bright, high-energy emotional state. Tail wagging, bright eyes, eager posture.', triggers:['Morning walk','Favourite food','Owner interaction'], tips:['Reward with play session','Capture the moment','Continue positive routine'] },
    calm:    { label:'Calm',      desc:'Relaxed and content state. Slow breathing, soft gaze, resting comfortably.', triggers:['Post-meal rest','Quiet environment','Gentle petting'], tips:['Ideal for training','Maintain quiet surroundings','Great bonding time'] },
    excited: { label:'Excited',   desc:'High stimulation detected. Jumping, panting, wide eyes, rapid movement.', triggers:['Outdoor sounds','New visitor','Pre-walk anticipation'], tips:['Channel into play','Avoid overstimulation','Structured activity helps'] },
    neutral: { label:'Neutral',   desc:'Balanced, undisturbed baseline. Normal vitals, relaxed muscles.', triggers:['Routine daily schedule','No environmental change'], tips:['Good time for grooming','Check health metrics','Introduce enrichment'] },
    anxious: { label:'Anxious',   desc:'Stress signals detected. Panting, tail tucked, avoidance behaviour.', triggers:['Loud noise','Separation','Unfamiliar environment'], tips:['Use calming music','Provide safe space','Consider vet consultation'] },
    playful: { label:'Playful',   desc:'High engagement, seeking interaction. Alert posture, toy-seeking behaviour.', triggers:['Rest after nap','Social interaction','Favourite toy present'], tips:['Interactive play recommended','Good time for training tricks','Socialization opportunity'] },
    sleepy:  { label:'Sleepy',    desc:'Rest cycle active. Low movement, drooping ears, eyes partially closed.', triggers:['Post-activity wind-down','Natural sleep schedule','Warm environment'], tips:['Do not disturb','Ensure comfortable sleep spot','Track sleep duration'] },
  };

  const TIMELINE = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    emotion: ['joy','calm','excited','neutral','anxious','playful','sleepy'][Math.floor(Math.sin(h * 0.6) * 3 + 3)],
    intensity: Math.round(30 + Math.sin(h * 0.5 + tick * 0.05) * 40 + 30),
  }));

  const currentHour = new Date().getHours();
  const current     = TIMELINE[currentHour];
  const sel         = selected !== null ? TIMELINE[selected] : null;
  const G           = 'linear-gradient(135deg,#ec4899,#a855f7,#6366f1)';

  const fmtHour = h => {
    if (h === 0)  return '12 AM';
    if (h < 12)   return h + ' AM';
    if (h === 12) return '12 PM';
    return (h - 12) + ' PM';
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔬 Emotional Intelligence</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Micro-Emotion Tracker</h2>
        <p className="text-pink-100 text-sm mt-1">24-hour micro-emotional timeline for {PET()} — click any bar to see full emotion details.</p>
      </div>

      {/* Current emotion summary */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-5">
          <motion.span className="text-4xl" animate={{ scale:[1,1.1,1] }} transition={{ repeat:Infinity, duration:2 }}>
            {EMOJIS[current.emotion]}
          </motion.span>
          <div className="flex-1">
            <p className="font-extrabold text-slate-800 text-lg capitalize">{current.emotion}</p>
            <p className="text-xs text-slate-400">Right now · {fmtHour(currentHour)} · Intensity: {current.intensity}%</p>
            <div className="mt-1.5 bg-slate-100 rounded-full h-1.5">
              <motion.div className="h-1.5 rounded-full" style={{ background: COLORS[current.emotion] }}
                animate={{ width: current.intensity + '%' }} transition={{ duration:0.6 }} />
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full text-white flex-shrink-0" style={{ background: COLORS[current.emotion] }}>
            LIVE
          </span>
        </div>

        {/* Timeline bars */}
        <p className="font-extrabold text-slate-800 mb-1 text-sm">24-Hour Emotion Timeline <span className="text-slate-400 font-normal text-xs">— tap a bar to expand</span></p>
        <div className="flex items-end gap-0.5 h-24 pt-6 relative">
          {TIMELINE.map((t, i) => (
            <button key={t.hour}
              onClick={() => setSelected(selected === i ? null : i)}
              className="flex-1 relative group focus:outline-none"
              style={{ height: '100%', display:'flex', alignItems:'flex-end' }}>
              {/* Tooltip */}
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
                {fmtHour(t.hour)} {EMOJIS[t.emotion]}
              </span>
              <motion.div
                className="w-full rounded-t transition-all"
                style={{
                  background: COLORS[t.emotion] || '#6366f1',
                  opacity: selected === i ? 1 : i === currentHour ? 1 : 0.5,
                  outline: selected === i ? `2px solid ${COLORS[t.emotion]}` : i === currentHour ? `2px solid ${COLORS[t.emotion]}88` : 'none',
                  outlineOffset: 1,
                }}
                animate={{ height: t.intensity + '%' }}
                transition={{ duration: 0.4, delay: i * 0.015 }}
              />
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-slate-400 mt-1">
          <span>12AM</span><span>6AM</span><span>12PM</span><span>6PM</span><span>11PM</span>
        </div>
      </div>

      {/* Clicked detail card */}
      <AnimatePresence>
        {sel && (
          <motion.div key={selected} initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.2 }}
            className="bg-white rounded-2xl border-2 shadow-lg overflow-hidden"
            style={{ borderColor: COLORS[sel.emotion] + '55' }}>

            {/* Card header */}
            <div className="px-5 py-4 flex items-center gap-4" style={{ background: COLORS[sel.emotion] + '12' }}>
              <span className="text-4xl">{EMOJIS[sel.emotion]}</span>
              <div className="flex-1">
                <h3 className="text-xl font-extrabold text-slate-900 capitalize">{DETAILS[sel.emotion]?.label || sel.emotion}</h3>
                <p className="text-sm text-slate-500">{fmtHour(sel.hour)} · Intensity {sel.intensity}%</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Previous / Next */}
                <button onClick={() => setSelected(Math.max(0, selected - 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center" title="Previous hour">‹</button>
                <button onClick={() => setSelected(Math.min(23, selected + 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center" title="Next hour">›</button>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center">✕</button>
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Intensity bar */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Emotion Intensity</span><span style={{ color: COLORS[sel.emotion] }}>{sel.intensity}%</span>
                </div>
                <div className="bg-slate-100 rounded-full h-3">
                  <motion.div className="h-3 rounded-full" style={{ background: COLORS[sel.emotion] }}
                    initial={{ width:0 }} animate={{ width: sel.intensity + '%' }} transition={{ duration:0.5 }} />
                </div>
              </div>

              {/* Description */}
              <div className="p-3 rounded-xl" style={{ background: COLORS[sel.emotion] + '0d' }}>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">📝 Behaviour Description</p>
                <p className="text-sm text-slate-700">{DETAILS[sel.emotion]?.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Triggers */}
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">⚡ Common Triggers</p>
                  <ul className="space-y-1">
                    {DETAILS[sel.emotion]?.triggers.map(t => (
                      <li key={t} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span style={{ color: COLORS[sel.emotion] }} className="mt-0.5 flex-shrink-0">•</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* AI Tips */}
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">🤖 AI Recommendations</p>
                  <ul className="space-y-1">
                    {DETAILS[sel.emotion]?.tips.map(t => (
                      <li key={t} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emotion legend */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-400 uppercase mb-3">Emotion Legend</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(EMOJIS).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl text-white"
              style={{ background: COLORS[k] }}>
              {v} <span className="capitalize">{k}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5. AI Pet Family Tree
export function FamilyTreePanel() {
  const petName = PET();
  const myPet   = P('ownerPets')[0] || {};
  const breed   = myPet.breed || 'Labrador';

  const [selected, setSelected] = useState(null);

  const TREE = {
    name: petName, breed, gen: 0, gender:'Male', age: myPet.age || 3,
    health: 94, temp:'Playful & Loyal', traits:['Active','Friendly','Smart'],
    note: 'Your current pet. Health records fully synced.',
    parents: [
      {
        name:'Rex', breed, gen:1, gender:'Male', age:7,
        health:88, temp:'Calm & Protective', traits:['Strong','Calm','Alert'],
        note:'Father. Excellent lineage. No hereditary conditions detected.',
        parents:[
          { name:'King', breed, gen:2, gender:'Male', age:12, health:80, temp:'Bold & Energetic', traits:['Bold','Loyal','Fast'], note:'Paternal grandfather. Champion bloodline.', parents:[] },
          { name:'Bella', breed, gen:2, gender:'Female', age:10, health:85, temp:'Gentle & Nurturing', traits:['Gentle','Calm','Caring'], note:'Paternal grandmother. Known for good health.', parents:[] },
        ]
      },
      {
        name:'Daisy', breed, gen:1, gender:'Female', age:6,
        health:91, temp:'Gentle & Affectionate', traits:['Warm','Playful','Smart'],
        note:'Mother. Very healthy. Passed on strong immunity genes.',
        parents:[
          { name:'Duke', breed, gen:2, gender:'Male', age:11, health:78, temp:'Brave & Strong', traits:['Brave','Loyal','Tough'], note:'Maternal grandfather. Strong build.', parents:[] },
          { name:'Rose', breed, gen:2, gender:'Female', age:9, health:90, temp:'Loving & Social', traits:['Social','Loving','Cheerful'], note:'Maternal grandmother. Excellent temperament.', parents:[] },
        ]
      },
    ],
  };

  const G  = 'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)';
  const GEN_COLORS = ['#6366f1','#10b981','#f59e0b'];
  const GEN_LABELS = ['Your Pet','Parent','Grandparent'];

  const renderNode = (node, depth = 0) => (
    <div key={node.name + depth} className="flex flex-col items-center">
      <motion.button
        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: depth * 0.12 }}
        onClick={() => setSelected(node)}
        className="group relative flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl text-white text-center text-xs font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all"
        style={{ background: GEN_COLORS[depth] || '#94a3b8', minWidth: 72 }}>
        <span className="text-lg">{node.gender === 'Female' ? '🐩' : '🐕'}</span>
        <span className="font-extrabold">{node.name}</span>
        <span className="opacity-70 font-normal text-[9px]">{node.breed}</span>
        <span className="text-[8px] opacity-60">{GEN_LABELS[depth]}</span>
        {/* Tooltip hint */}
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          Click to view details
        </span>
      </motion.button>

      {node.parents.length > 0 && (
        <>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex gap-8 relative">
            {/* Horizontal connector */}
            {node.parents.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-slate-200"
                style={{ width: 'calc(100% - 40px)' }} />
            )}
            {node.parents.map((p, pi) => (
              <div key={p.name} className="flex flex-col items-center">
                <div className="w-px h-5 bg-slate-200" />
                {renderNode(p, depth + 1)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌳 Heritage Analytics</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Family Tree System</h2>
        <p className="text-amber-100 text-sm mt-1">Click any pet node to view full lineage details, health score, and temperament.</p>
        <div className="flex gap-6 mt-4">
          {[['Generations', 3],['Total Members', 7],['Breed', breed],['Health', myPet.age ? 'Excellent' : 'Good']].map(([l, v]) => (
            <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-amber-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Detail card — shown when a node is selected */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.2 }}
            className="bg-white rounded-2xl border-2 shadow-lg p-5 relative"
            style={{ borderColor: GEN_COLORS[selected.gen] + '55' }}>
            <button onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold transition">✕</button>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: GEN_COLORS[selected.gen] + '15' }}>
                {selected.gender === 'Female' ? '🐩' : '🐕'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-extrabold text-slate-900">{selected.name}</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: GEN_COLORS[selected.gen] || '#94a3b8' }}>
                    {GEN_LABELS[selected.gen]}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {selected.gender}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-0.5">{selected.breed} · {selected.age} years old</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Health score */}
              <div className="p-3 rounded-xl" style={{ background: GEN_COLORS[selected.gen] + '0d' }}>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">❤️ Health Score</p>
                <p className="text-2xl font-extrabold" style={{ color: GEN_COLORS[selected.gen] }}>{selected.health}%</p>
                <div className="mt-1 bg-slate-100 rounded-full h-1.5">
                  <motion.div className="h-1.5 rounded-full" style={{ background: GEN_COLORS[selected.gen] }}
                    initial={{ width:0 }} animate={{ width: selected.health + '%' }} transition={{ duration: 0.5 }} />
                </div>
              </div>
              {/* Temperament */}
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">🧬 Temperament</p>
                <p className="text-sm font-bold text-slate-800">{selected.temp}</p>
              </div>
            </div>

            {/* Traits */}
            <div className="mt-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">⭐ Key Traits</p>
              <div className="flex gap-2 flex-wrap">
                {selected.traits.map(t => (
                  <span key={t} className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ background: GEN_COLORS[selected.gen] || '#94a3b8' }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-[10px] font-bold text-amber-600 uppercase mb-0.5">📝 Heritage Note</p>
              <p className="text-sm text-slate-700">{selected.note}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap">
        {GEN_LABELS.map((l, i) => (
          <div key={l} className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <div className="w-3 h-3 rounded-full" style={{ background: GEN_COLORS[i] }} />{l}
          </div>
        ))}
        <p className="text-xs text-slate-400 ml-2">↑ Click any node to see full details</p>
      </div>

      {/* Tree */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-x-auto">
        <p className="font-extrabold text-slate-800 mb-6 text-sm">🌳 Ancestry Tree — 3 Generations</p>
        <div className="flex justify-center min-w-max pb-2">{renderNode(TREE)}</div>
      </div>
    </div>
  );
}

