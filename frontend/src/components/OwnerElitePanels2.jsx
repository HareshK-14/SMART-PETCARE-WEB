import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Cloud, Zap, Droplets, Wind, Star, Map, Activity,
  TrendingUp, Heart, Shield, Brain, Clock, ChevronRight, Play,
  Pause, Mountain, TreePine, Waves, Sparkles, Gem, Target } from 'lucide-react';

/* ─── 1. PetEmotionWeatherPanel ─────────────────────────────────────────────── */
export const PetEmotionWeatherPanel = () => {
  const WEATHERS = [
    { key:'sunny',   label:'Happy',    emoji:'☀️',  desc:'Joyful & energetic',       bg:'linear-gradient(135deg,#fbbf24,#f59e0b,#fcd34d)', color:'#92400e' },
    { key:'cloudy',  label:'Calm',     emoji:'⛅',  desc:'Peaceful & relaxed',        bg:'linear-gradient(135deg,#94a3b8,#64748b,#cbd5e1)', color:'#1e293b' },
    { key:'stormy',  label:'Anxious',  emoji:'⛈️',  desc:'Stressed & restless',       bg:'linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)', color:'#ede9fe' },
    { key:'rainy',   label:'Sad',      emoji:'🌧️',  desc:'Low energy & withdrawn',    bg:'linear-gradient(135deg,#3b82f6,#2563eb,#60a5fa)', color:'#dbeafe' },
    { key:'electric',label:'Excited',  emoji:'⚡',  desc:'Hyperactive & playful',     bg:'linear-gradient(135deg,#10b981,#059669,#34d399)', color:'#d1fae5' },
  ];
  const FORECAST = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>({
    day:d, weather: WEATHERS[Math.floor(Math.random()*WEATHERS.length)],
  }));
  const [current, setCurrent] = useState(WEATHERS[0]);
  const [tick, setTick] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setTick(x=>x+1),50); return()=>clearInterval(t); },[]);

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl" style={{background:current.bg,minHeight:240}}>
        <div className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <motion.div animate={{y:[0,-12,0],rotate:[0,5,-5,0]}} transition={{repeat:Infinity,duration:3}}
            className="text-8xl mb-4 select-none">{current.emoji}</motion.div>
          <h2 className="text-3xl font-black mb-1" style={{color:current.color}}>{current.label}</h2>
          <p className="text-sm font-semibold opacity-80" style={{color:current.color}}>{current.desc}</p>
          <div className="absolute top-4 right-4 opacity-20 text-9xl">{current.emoji}</div>
          {/* Animated particles */}
          {[...Array(8)].map((_,i)=>(
            <motion.div key={i} className="absolute w-2 h-2 rounded-full opacity-40"
              style={{background:current.color, left:`${10+i*12}%`, top:`${20+Math.sin(i)*30}%`}}
              animate={{y:[0,-20,0],opacity:[0.4,0.8,0.4]}}
              transition={{repeat:Infinity,duration:2+i*0.3,delay:i*0.2}} />
          ))}
        </div>
      </div>
      {/* Emotion selector */}
      <div className="flex gap-3 flex-wrap">
        {WEATHERS.map(w=>(
          <motion.button key={w.key} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
            onClick={()=>setCurrent(w)}
            className={`flex-1 min-w-[90px] p-3 rounded-2xl text-center font-bold text-sm border-2 transition-all ${current.key===w.key?'border-indigo-400 shadow-lg':'border-slate-100'}`}
            style={current.key===w.key?{background:w.bg,color:w.color}:{background:'white',color:'#475569'}}>
            <div className="text-2xl mb-1">{w.emoji}</div>{w.label}
          </motion.button>
        ))}
      </div>
      {/* 7-day forecast */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">📅 7-Day Emotional Forecast</p>
        <div className="grid grid-cols-7 gap-2">
          {FORECAST.map((f,i)=>(
            <div key={i} className="text-center p-2 rounded-xl bg-slate-50">
              <p className="text-xs text-slate-400 font-bold mb-1">{f.day}</p>
              <div className="text-xl">{f.weather.emoji}</div>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold">{f.weather.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 2. SmartPresenceSensorPanel ───────────────────────────────────────────── */
export const SmartPresenceSensorPanel = () => {
  const [score, setScore] = useState(72);
  const [lastSeen, setLastSeen] = useState('14 min ago');
  const TIPS = ['Play fetch for 10 minutes','Give a belly rub session','Schedule a playdate','Try puzzle feeding','Go for a short walk'];
  const [tipIdx, setTipIdx] = useState(0);
  useEffect(()=>{const t=setInterval(()=>setTipIdx(i=>(i+1)%TIPS.length),3000);return()=>clearInterval(t);},[]);
  const TIMELINE=[{t:'9:00 AM',a:'Morning walk',icon:'🐾'},{t:'11:30 AM',a:'Play session',icon:'🎾'},{t:'2:00 PM',a:'Nap time',icon:'💤'},{t:'4:15 PM',a:'Meal time',icon:'🍗'},{t:'6:00 PM',a:'Alone now',icon:'🔵'}];
  const color = score>70?'#10b981':score>40?'#f59e0b':'#ef4444';
  const r=80, cx=100, cy=100, circ=2*Math.PI*r, filled=circ*(score/100);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
          <p className="font-extrabold text-slate-800 mb-4">🐾 Presence Score</p>
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r={r} fill="none" stroke="#f1f5f9" strokeWidth="16"/>
              <motion.circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="16"
                strokeLinecap="round" strokeDasharray={`${filled} ${circ}`}
                transform="rotate(-90 100 100)"
                initial={{strokeDasharray:`0 ${circ}`}}
                animate={{strokeDasharray:`${filled} ${circ}`}} transition={{duration:1.5,ease:'easeOut'}}/>
              <text x="100" y="95" textAnchor="middle" className="font-black" fontSize="32" fill={color} fontWeight="900">{score}</text>
              <text x="100" y="118" textAnchor="middle" fontSize="11" fill="#94a3b8">Interaction Score</text>
            </svg>
            {[...Array(4)].map((_,i)=>(
              <motion.div key={i} className="absolute inset-0 rounded-full border-2 opacity-20"
                style={{borderColor:color}}
                animate={{scale:[1,1.2+i*0.15],opacity:[0.3,0]}}
                transition={{repeat:Infinity,duration:2,delay:i*0.5}}/>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-2">Last seen: <strong className="text-slate-700">{lastSeen}</strong></p>
        </div>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
            <p className="font-extrabold text-indigo-800 mb-2">🧠 AI Recommendation</p>
            <AnimatePresence mode="wait">
              <motion.p key={tipIdx} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                className="text-indigo-700 font-semibold text-sm">💡 {TIPS[tipIdx]}</motion.p>
            </AnimatePresence>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="font-extrabold text-slate-800 mb-3 text-sm">📋 Today's Activity</p>
            <div className="space-y-2">
              {TIMELINE.map((t,i)=>(
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 w-16 font-mono flex-shrink-0">{t.t}</span>
                  <span>{t.icon}</span>
                  <span className={`font-semibold ${i===4?'text-blue-500':'text-slate-600'}`}>{t.a}</span>
                  {i===4&&<span className="ml-auto text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── 3. HealingFrequencyEnginePanel ────────────────────────────────────────── */
export const HealingFrequencyEnginePanel = () => {
  const FREQS=[
    {hz:396,name:'Liberation',color:'#ef4444',effect:'Releases fear & guilt, promotes safety'},
    {hz:432,name:'Harmony',color:'#f59e0b',effect:'Natural tuning, reduces anxiety & stress'},
    {hz:528,name:'Miracle',color:'#10b981',effect:'DNA repair, love & transformation'},
    {hz:639,name:'Connection',color:'#3b82f6',effect:'Enhances communication & relationships'},
    {hz:741,name:'Awakening',color:'#8b5cf6',effect:'Mental clarity & problem solving'},
    {hz:852,name:'Intuition',color:'#ec4899',effect:'Spiritual awareness & inner strength'},
  ];
  const [selected,setSelected]=useState(FREQS[2]);
  const [playing,setPlaying]=useState(false);
  const [tick,setTick]=useState(0);
  useEffect(()=>{let t;if(playing)t=setInterval(()=>setTick(x=>x+1),50);return()=>clearInterval(t);},[playing]);
  const pts=Array.from({length:60},(_,i)=>{
    const x=i*(600/60);
    const y=90+Math.sin((i+tick)*0.4)*( playing?55:20);
    return`${x},${y}`;
  }).join(' ');
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{background:`linear-gradient(135deg,${selected.color}22,${selected.color}44)`,border:`2px solid ${selected.color}44`}}>
        <div className="text-center mb-4">
          <motion.p key={selected.hz} initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}}
            className="text-7xl font-black" style={{color:selected.color}}>{selected.hz}<span className="text-3xl font-bold"> Hz</span></motion.p>
          <p className="text-xl font-extrabold text-slate-700 mt-1">{selected.name} Frequency</p>
          <p className="text-sm text-slate-500 mt-1">{selected.effect}</p>
        </div>
        <svg viewBox="0 0 600 180" className="w-full rounded-2xl overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
          <polyline points={pts} fill="none" stroke={selected.color} strokeWidth="3" strokeLinecap="round"/>
          <polyline points={pts} fill={`${selected.color}22`} stroke="none"/>
        </svg>
        <div className="flex justify-center mt-4">
          <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.95}}
            onClick={()=>setPlaying(p=>!p)}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-extrabold text-white shadow-xl"
            style={{background:selected.color}}>
            {playing?<Pause className="w-5 h-5"/>:<Play className="w-5 h-5"/>}
            {playing?'Pause Healing':'Play Frequency'}
          </motion.button>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {FREQS.map(f=>(
          <motion.button key={f.hz} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
            onClick={()=>setSelected(f)}
            className={`p-3 rounded-2xl text-center border-2 transition-all ${selected.hz===f.hz?'shadow-lg':'border-slate-100 bg-white'}`}
            style={selected.hz===f.hz?{background:`${f.color}18`,borderColor:f.color}:{}}>
            <p className="font-extrabold text-sm" style={{color:f.color}}>{f.hz}Hz</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">{f.name}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

/* ─── 4. PetStarMapPanel ────────────────────────────────────────────────────── */
export const PetStarMapPanel = () => {
  const STARS=[
    {id:1,x:120,y:80,label:'First Day Home',date:'Mar 2022',size:12,color:'#fbbf24'},
    {id:2,x:220,y:140,label:'First Walk',date:'Apr 2022',size:10,color:'#34d399'},
    {id:3,x:180,y:220,label:'First Vaccination',date:'May 2022',size:9,color:'#60a5fa'},
    {id:4,x:320,y:100,label:'1st Birthday',date:'Mar 2023',size:14,color:'#f472b6'},
    {id:5,x:400,y:180,label:'Best Friend Found',date:'Jun 2023',size:11,color:'#a78bfa'},
    {id:6,x:480,y:80,label:'Park Champion',date:'Aug 2023',size:10,color:'#fb923c'},
    {id:7,x:350,y:260,label:'Healthiest Year',date:'Dec 2023',size:13,color:'#2dd4bf'},
    {id:8,x:520,y:200,label:'2nd Birthday',date:'Mar 2024',size:14,color:'#fbbf24'},
    {id:9,x:150,y:310,label:'Swim Master',date:'Jul 2024',size:9,color:'#60a5fa'},
    {id:10,x:460,y:320,label:'3rd Birthday',date:'Mar 2025',size:16,color:'#f472b6'},
  ];
  const [hovered,setHovered]=useState(null);
  const LINES=[[0,1],[1,2],[2,4],[3,4],[4,5],[5,7],[6,7],[7,9]];
  const bg=[...Array(60)].map((_,i)=>({x:Math.random()*600,y:Math.random()*380,r:Math.random()*1.5+0.5}));
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-indigo-900/50" style={{background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'}}>
        <div className="p-5">
          <p className="font-extrabold text-white mb-1 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400"/>Pet Constellation Map</p>
          <p className="text-indigo-300 text-xs">Every milestone is a star in {JSON.parse(localStorage.getItem('ownerPets')||'[]')[0]?.name||'your pet'}'s universe</p>
        </div>
        <svg viewBox="0 0 640 380" className="w-full">
          {bg.map((s,i)=>(
            <motion.circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.4"
              animate={{opacity:[0.2,0.8,0.2]}} transition={{repeat:Infinity,duration:2+Math.random()*3,delay:Math.random()*2}}/>
          ))}
          {LINES.map(([a,b],i)=>(
            <motion.line key={i} x1={STARS[a].x} y1={STARS[a].y} x2={STARS[b].x} y2={STARS[b].y}
              stroke="#6366f1" strokeWidth="1" opacity="0.4"
              initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.5,delay:i*0.2}}/>
          ))}
          {STARS.map((s,i)=>(
            <g key={s.id} onMouseEnter={()=>setHovered(s)} onMouseLeave={()=>setHovered(null)}>
              <motion.circle cx={s.x} cy={s.y} r={s.size+8} fill={s.color} opacity="0.15"
                animate={{r:[s.size+6,s.size+14,s.size+6]}} transition={{repeat:Infinity,duration:2,delay:i*0.3}}/>
              <motion.circle cx={s.x} cy={s.y} r={s.size} fill={s.color}
                animate={{opacity:[0.8,1,0.8],scale:[1,1.1,1]}} transition={{repeat:Infinity,duration:2,delay:i*0.3}}
                style={{transformOrigin:`${s.x}px ${s.y}px`}}/>
              {hovered?.id===s.id&&(
                <g>
                  <rect x={s.x-50} y={s.y-45} width="100" height="36" rx="8" fill="#1e1b4b" opacity="0.95"/>
                  <text x={s.x} y={s.y-28} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{s.label}</text>
                  <text x={s.x} y={s.y-16} textAnchor="middle" fill="#a5b4fc" fontSize="8">{s.date}</text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {STARS.slice(0,5).map(s=>(
          <div key={s.id} className="bg-white rounded-xl border border-slate-100 p-3 text-center shadow-sm">
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{background:s.color}}/>
            <p className="text-xs font-bold text-slate-700">{s.label}</p>
            <p className="text-[10px] text-slate-400">{s.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── 5. MicroHabitAnalyzerPanel ────────────────────────────────────────────── */
export const MicroHabitAnalyzerPanel = () => {
  const HABITS=[
    {name:'Morning stretch before eating',score:87,trend:'↑',impact:'High',tip:'Keep feeding at 7AM consistently'},
    {name:'Circles before lying down',score:94,trend:'→',impact:'Normal',tip:'Natural denning behavior — healthy!'},
    {name:'Window watching at 3PM',score:76,trend:'↑',impact:'Medium',tip:'Add a window perch for enrichment'},
    {name:'Paw licking after walks',score:62,trend:'↓',impact:'Watch',tip:'Check for allergens on route'},
    {name:'Pre-meal excitement spin',score:91,trend:'→',impact:'High',tip:'Use as mealtime signal — great routine!'},
  ];
  const GRID=[...Array(84)].map((_,i)=>({val:Math.floor(Math.random()*4)}));
  const COLORS=['#f1f5f9','#a7f3d0','#34d399','#059669'];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="grid grid-cols-3 gap-4">
        {[['Consistency Score','94%','#10b981'],['Pattern Strength','87/100','#6366f1'],['Improvement Rate','+12%','#f59e0b']].map(([l,v,c])=>(
          <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
            <p className="text-3xl font-black mb-1" style={{color:c}}>{v}</p>
            <p className="text-xs text-slate-500 font-semibold">{l}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">📅 Habit Heatmap (12 Weeks)</p>
        <div className="grid gap-1" style={{gridTemplateColumns:'repeat(12,1fr)'}}>
          {GRID.map((g,i)=>(
            <motion.div key={i} className="aspect-square rounded-sm"
              style={{background:COLORS[g.val]}}
              initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}}
              transition={{delay:i*0.005}}/>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <span>Less</span>{COLORS.map((c,i)=><div key={i} className="w-3 h-3 rounded-sm" style={{background:c}}/>)}<span>More</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">🧠 Detected Micro-Habits</p>
        <div className="space-y-3">
          {HABITS.map((h,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
              className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-slate-800 text-sm">{h.name}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.impact==='High'?'bg-green-100 text-green-700':h.impact==='Watch'?'bg-amber-100 text-amber-700':'bg-blue-100 text-blue-700'}`}>{h.impact}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                  <motion.div className="h-1.5 rounded-full" style={{background:'#10b981',width:`${h.score}%`}}
                    initial={{width:0}} animate={{width:`${h.score}%`}} transition={{delay:i*0.1+0.3}}/>
                </div>
                <span className="text-xs font-bold text-slate-500">{h.score}%</span>
              </div>
              <p className="text-xs text-indigo-600">💡 {h.tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 6. SafeEnergyZonesPanel ───────────────────────────────────────────────── */
export const SafeEnergyZonesPanel = () => {
  const ZONES=[
    {id:1,name:'Living Room',safety:'safe',score:95,reason:'Low noise, good temp, frequent interaction'},
    {id:2,name:'Kitchen',safety:'amber',score:68,reason:'Hot surfaces, sharp items, medium risk'},
    {id:3,name:'Bedroom',safety:'safe',score:88,reason:'Comfortable temp, safe for resting'},
    {id:4,name:'Balcony',safety:'red',score:35,reason:'Height risk, direct sun, limited supervision'},
    {id:5,name:'Bathroom',safety:'amber',score:55,reason:'Wet surfaces, chemical storage risk'},
    {id:6,name:'Study',safety:'safe',score:82,reason:'Quiet, stable temperature, supervised'},
    {id:7,name:'Garden',safety:'safe',score:78,reason:'Fresh air, exercise space, plant check needed'},
    {id:8,name:'Garage',safety:'red',score:22,reason:'Chemicals, machinery, extreme temp'},
  ];
  const [selected,setSelected]=useState(null);
  const safetyColor={safe:'#10b981',amber:'#f59e0b',red:'#ef4444'};
  const safetyBg={safe:'#d1fae5',amber:'#fef3c7',red:'#fee2e2'};
  const overallScore=Math.round(ZONES.reduce((a,z)=>a+z.score,0)/ZONES.length);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10"/>
            <motion.circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="10"
              strokeDasharray={`${2*Math.PI*40*(overallScore/100)} ${2*Math.PI*40}`}
              transform="rotate(-90 50 50)" initial={{strokeDasharray:`0 ${2*Math.PI*40}`}}
              animate={{strokeDasharray:`${2*Math.PI*40*(overallScore/100)} ${2*Math.PI*40}`}} transition={{duration:1.5}}/>
            <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="900" fill="#10b981">{overallScore}</text>
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Environment Safety Score</h2>
          <p className="text-slate-500 text-sm mt-0.5">AI-analyzed across {ZONES.length} zones in your home</p>
          <div className="flex gap-3 mt-2">
            {[['safe','Safe',ZONES.filter(z=>z.safety==='safe').length],['amber','Neutral',ZONES.filter(z=>z.safety==='amber').length],['red','Unsafe',ZONES.filter(z=>z.safety==='red').length]].map(([k,l,n])=>(
              <div key={k} className="flex items-center gap-1.5 text-xs font-bold"><div className="w-3 h-3 rounded-full" style={{background:safetyColor[k]}}/>{l}: {n}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ZONES.map(z=>(
          <motion.button key={z.id} whileHover={{scale:1.03}} whileTap={{scale:0.98}}
            onClick={()=>setSelected(selected?.id===z.id?null:z)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${selected?.id===z.id?'border-indigo-400 shadow-lg':''}`}
            style={{background:safetyBg[z.safety],borderColor:selected?.id===z.id?'#6366f1':safetyColor[z.safety]+'44'}}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-slate-800 text-sm">{z.name}</p>
              {z.safety==='red'&&<motion.div className="w-2 h-2 rounded-full bg-red-500" animate={{opacity:[1,0,1]}} transition={{repeat:Infinity,duration:1}}/>}
            </div>
            <p className="text-xl font-extrabold" style={{color:safetyColor[z.safety]}}>{z.score}%</p>
            <div className="mt-1 h-1 bg-white/50 rounded-full"><div className="h-1 rounded-full transition-all" style={{width:`${z.score}%`,background:safetyColor[z.safety]}}/></div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {selected&&(
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
            className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-1">🏠 {selected.name} — AI Analysis</p>
            <p className="text-sm text-slate-600">{selected.reason}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── 7. FutureMemoryGeneratorPanel ─────────────────────────────────────────── */
export const FutureMemoryGeneratorPanel = () => {
  const pets=JSON.parse(localStorage.getItem('ownerPets')||'[]');
  const petName=pets[0]?.name||'Bruno';
  const FUTURE=[
    {date:'Jul 2026',event:`${petName}'s Beach Adventure`,prob:87,icon:'🏖️',color:'#3b82f6'},
    {date:'Sep 2026',event:`${petName} wins Agility Trial`,prob:72,icon:'🏆',color:'#f59e0b'},
    {date:'Mar 2027',event:`${petName}'s 5th Birthday Gala`,prob:99,icon:'🎂',color:'#ec4899'},
    {date:'Jun 2027',event:`${petName} meets a new puppy friend`,prob:65,icon:'🐶',color:'#10b981'},
    {date:'Dec 2027',event:`${petName}'s First Snow Day`,prob:58,icon:'❄️',color:'#6366f1'},
  ];
  const PAST=[
    {date:'Mar 2022',event:'First day home',icon:'🏠'},
    {date:'Jun 2022',event:'First swim',icon:'🏊'},
    {date:'Mar 2023',event:'2nd Birthday',icon:'🎂'},
    {date:'Aug 2023',event:'Won fetch contest',icon:'🎾'},
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl p-6 text-white" style={{background:'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)'}}>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-300"/>
          <div><h2 className="font-extrabold text-lg">AI Future Memory Generator</h2><p className="text-purple-300 text-xs">Powered by behavioral pattern analysis</p></div>
        </div>
        <div className="space-y-3">
          {FUTURE.map((f,i)=>(
            <motion.div key={i} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:i*0.15}}
              className="flex items-center gap-4 p-4 rounded-2xl" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)'}}>
              <span className="text-3xl">{f.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-white text-sm">{f.event}</p>
                <p className="text-xs text-purple-300 mt-0.5">{f.date}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-extrabold text-lg" style={{color:f.color}}>{f.prob}%</p>
                <p className="text-[10px] text-purple-300">probability</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">📸 Memory Timeline</p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...PAST,...FUTURE.slice(0,3).map(f=>({...f,future:true}))].map((m,i)=>(
            <div key={i} className={`flex-shrink-0 text-center p-3 rounded-xl border ${m.future?'border-purple-200 bg-purple-50':'border-slate-100 bg-slate-50'}`} style={{minWidth:90}}>
              <div className="text-2xl mb-1">{m.icon}</div>
              <p className="text-[10px] font-bold text-slate-700">{m.event}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{m.date}</p>
              {m.future&&<span className="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-bold">AI Predicted</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 8. ComfortWavesPanel ───────────────────────────────────────────────────── */
export const ComfortWavesPanel = () => {
  const [comfort,setComfort]=useState(74);
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>{setTick(x=>x+1);setComfort(c=>Math.max(40,Math.min(95,c+(Math.random()-0.48)*2)));},100);return()=>clearInterval(t);},[]);
  const HOURLY=[65,70,68,72,75,74,80,82,79,76,74,73];
  const wavePts=(amp,phase,speed)=>Array.from({length:41},(_,i)=>{
    const x=i*(600/40);
    const y=100+Math.sin((i*0.5+tick*speed+phase))*amp;
    return`${x},${y}`;
  }).join(' ');
  const comfortColor=comfort>70?'#14b8a6':comfort>50?'#f59e0b':'#ef4444';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between">
          <div><p className="font-extrabold text-slate-800">🌊 Realtime Comfort Waves</p><p className="text-xs text-slate-400">Live biometric-based comfort monitoring</p></div>
          <div className="text-right">
            <motion.p key={Math.round(comfort)} className="text-4xl font-black" style={{color:comfortColor}}
              animate={{scale:[1,1.05,1]}} transition={{duration:0.3}}>{Math.round(comfort)}</motion.p>
            <p className="text-xs text-slate-400">Comfort Score</p>
          </div>
        </div>
        <div className="relative" style={{height:200,overflow:'hidden',background:'linear-gradient(180deg,#f0fdf4,#fff)'}}>
          <svg viewBox="0 0 600 200" className="w-full h-full" preserveAspectRatio="none">
            <polyline points={wavePts(40,0,0.03)} fill="rgba(20,184,166,0.15)" stroke="#14b8a6" strokeWidth="2.5"/>
            <polyline points={wavePts(25,Math.PI,0.05)} fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth="1.5" opacity="0.6"/>
            <polyline points={wavePts(15,Math.PI/2,0.07)} fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5"/>
          </svg>
          <motion.div className="absolute" style={{left:'50%',top:`${100-comfort}px`}}
            animate={{scale:[1,1.3,1],opacity:[1,0.7,1]}} transition={{repeat:Infinity,duration:1.5}}>
            <div className="w-4 h-4 rounded-full shadow-lg" style={{background:comfortColor,transform:'translate(-50%,-50%)'}}/>
          </motion.div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3 text-sm">📊 Hourly Comfort Trend</p>
        <div className="flex items-end gap-1 h-20">
          {HOURLY.map((v,i)=>(
            <motion.div key={i} className="flex-1 rounded-t-sm"
              style={{background:`linear-gradient(180deg,${v>70?'#14b8a6':v>50?'#f59e0b':'#ef4444'},transparent)`,height:`${v}%`}}
              initial={{height:0}} animate={{height:`${v}%`}} transition={{delay:i*0.05}}/>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>6AM</span><span>12PM</span><span>6PM</span>
        </div>
      </div>
    </div>
  );
};

/* ─── 9. AdventureEnginePanel ────────────────────────────────────────────────── */
export const AdventureEnginePanel = () => {
  const ADVENTURES=[
    {name:'Park Expedition',emoji:'🌳',diff:'Easy',energy:180,duration:'45 min',color:'#10b981',desc:'Explore the local park with enrichment stops and social encounters'},
    {name:'Beach Day',emoji:'🏖️',diff:'Moderate',energy:320,duration:'3 hrs',color:'#3b82f6',desc:'Beach running, water play, and sandcastle digging!'},
    {name:'Forest Trail',emoji:'🌲',diff:'Challenging',energy:480,duration:'2 hrs',color:'#059669',desc:'Off-leash forest exploration with natural stimulation'},
    {name:'Social Playdate',emoji:'🐕',diff:'Easy',energy:220,duration:'1 hr',color:'#8b5cf6',desc:'Structured socializing with trusted dog friends'},
    {name:'Indoor Enrichment',emoji:'🧩',diff:'Easy',energy:80,duration:'30 min',color:'#f59e0b',desc:'Puzzle games, scent work, and brain training activities'},
  ];
  const [started,setStarted]=useState(null);
  const PAST=[{name:'Park Expedition',date:'May 19',emoji:'🌳'},{name:'Beach Day',date:'May 17',emoji:'🏖️'},{name:'Forest Trail',date:'May 14',emoji:'🌲'}];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl p-5 text-white" style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)'}}>
        <div className="flex items-center gap-3 mb-4"><Mountain className="w-6 h-6 text-teal-400"/><div><h2 className="font-extrabold">AI Adventure Engine</h2><p className="text-slate-400 text-xs">Personalized experiences for your pet</p></div></div>
        <div className="space-y-3">
          {ADVENTURES.map((a,i)=>(
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer group transition-all hover:scale-[1.01]"
              style={{background:`${a.color}18`,border:`1px solid ${a.color}33`}}>
              <span className="text-3xl">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-white">{a.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                <div className="flex gap-3 mt-1.5 text-xs">
                  <span style={{color:a.color}} className="font-bold">{a.diff}</span>
                  <span className="text-slate-400">{a.duration}</span>
                  <span className="text-slate-400">🔥 {a.energy} cal</span>
                </div>
              </div>
              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                onClick={()=>setStarted(a.name)}
                className="px-4 py-2 rounded-xl text-white text-xs font-extrabold flex-shrink-0 transition"
                style={{background:started===a.name?'#10b981':a.color}}>
                {started===a.name?'✓ Started':'Start'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">🗓️ Past Adventures</p>
        <div className="flex gap-3">
          {PAST.map((p,i)=>(
            <div key={i} className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-2xl mb-1">{p.emoji}</div>
              <p className="text-xs font-bold text-slate-700">{p.name}</p>
              <p className="text-[10px] text-slate-400">{p.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 10. EmotionCrystalPanel ────────────────────────────────────────────────── */
export const EmotionCrystalPanel = () => {
  const EMOTIONS=[
    {label:'Joy',value:82,color:'#fbbf24'},
    {label:'Calm',value:70,color:'#14b8a6'},
    {label:'Energy',value:88,color:'#10b981'},
    {label:'Stress',value:28,color:'#ef4444'},
    {label:'Love',value:95,color:'#ec4899'},
    {label:'Curiosity',value:76,color:'#8b5cf6'},
  ];
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+0.5),50);return()=>clearInterval(t);},[]);
  const dominant=EMOTIONS.reduce((a,b)=>b.value>a.value?b:a);
  const cx=200,cy=180,r=90;
  const hexPoints=(cx,cy,r)=>Array.from({length:6},(_,i)=>{const a=Math.PI/3*i-Math.PI/6;return`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(' ');
  const arcPath=(cx,cy,r,start,end)=>{
    const s=start*2*Math.PI-Math.PI/2,e=end*2*Math.PI-Math.PI/2;
    const x1=cx+r*Math.cos(s),y1=cy+r*Math.sin(s),x2=cx+r*Math.cos(e),y2=cy+r*Math.sin(e);
    return`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${end-start>0.5?1:0} 1 ${x2} ${y2} Z`;
  };
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
          <p className="font-extrabold text-slate-800 mb-2">💎 Emotion Crystal</p>
          <svg width="400" height="360" viewBox="0 0 400 360">
            <defs>
              {EMOTIONS.map((e,i)=>(
                <linearGradient key={i} id={`grad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={e.color} stopOpacity="0.9"/>
                  <stop offset="100%" stopColor={e.color} stopOpacity="0.4"/>
                </linearGradient>
              ))}
            </defs>
            {/* Crystal glow */}
            <motion.polygon points={hexPoints(cx,cy,r+20)} fill={dominant.color} opacity="0.1"
              animate={{opacity:[0.08,0.18,0.08]}} transition={{repeat:Infinity,duration:2}}/>
            {/* Crystal facets */}
            {EMOTIONS.map((e,i)=>{
              const start=i/6,end=(i+1)/6;
              const innerR=r*(e.value/100);
              return(
                <motion.path key={i} d={arcPath(cx,cy,r,start,end)}
                  fill={`url(#grad${i})`} opacity="0.85"
                  animate={{opacity:[0.7,1,0.7]}} transition={{repeat:Infinity,duration:2,delay:i*0.3}}/>
              );
            })}
            <polygon points={hexPoints(cx,cy,r)} fill="none" stroke="white" strokeWidth="2" opacity="0.5"/>
            <text x={cx} y={cy-8} textAnchor="middle" fill={dominant.color} fontSize="22" fontWeight="900">{dominant.label}</text>
            <text x={cx} y={cy+12} textAnchor="middle" fill="#64748b" fontSize="12">Dominant</text>
            {EMOTIONS.map((e,i)=>{
              const a=Math.PI/3*i-Math.PI/6;
              return(
                <g key={i} transform={`translate(${cx+(r+35)*Math.cos(a)},${cy+(r+35)*Math.sin(a)})`}>
                  <text textAnchor="middle" fill={e.color} fontSize="10" fontWeight="bold" y="4">{e.label}</text>
                  <text textAnchor="middle" fill="#94a3b8" fontSize="9" y="16">{e.value}%</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="space-y-3">
          {EMOTIONS.map((e,i)=>(
            <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-slate-800 text-sm">{e.label}</p>
                <p className="font-extrabold text-sm" style={{color:e.color}}>{e.value}%</p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div className="h-2 rounded-full" style={{background:e.color}}
                  initial={{width:0}} animate={{width:`${e.value}%`}} transition={{delay:i*0.1+0.5,duration:0.8}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
