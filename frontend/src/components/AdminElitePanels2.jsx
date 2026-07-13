import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Shield, Zap, Activity, Brain,
  Globe, Star, BarChart2, Circle, Layers, ChevronRight } from 'lucide-react';

/* ─── 1. GlobalEcosystemAuraPanel ───────────────────────────────────────────── */
export const GlobalEcosystemAuraPanel = () => {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),60);return()=>clearInterval(t);},[]);
  const RINGS=[
    {label:'Users',value:96,color:'#6366f1',r:40},
    {label:'Vets',value:88,color:'#14b8a6',r:65},
    {label:'Appointments',value:92,color:'#10b981',r:90},
    {label:'Revenue',value:78,color:'#f59e0b',r:115},
    {label:'Satisfaction',value:94,color:'#ec4899',r:140},
  ];
  const healthScore=Math.round(RINGS.reduce((a,r)=>a+r.value,0)/RINGS.length);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl" style={{background:'radial-gradient(ellipse at center,#1e1b4b 0%,#0f0c29 60%,#000 100%)'}}>
        <div className="p-6 flex flex-col items-center relative overflow-hidden" style={{minHeight:360}}>
          <p className="font-extrabold text-white mb-2 text-lg z-10 relative">🌐 Global Ecosystem Aura</p>
          <p className="text-indigo-300 text-xs mb-6 z-10 relative">Platform health visualized as living energy rings</p>
          <div className="relative z-10" style={{width:320,height:320}}>
            <svg viewBox="0 0 320 320" width="320" height="320">
              {RINGS.map((ring,i)=>{
                const circ=2*Math.PI*ring.r;
                const filled=circ*(ring.value/100);
                const phase=tick*0.02*(i%2===0?1:-1);
                return(
                  <g key={i}>
                    <circle cx="160" cy="160" r={ring.r} fill="none" stroke={ring.color} strokeWidth="1" opacity="0.1"/>
                    <motion.circle cx="160" cy="160" r={ring.r} fill="none" stroke={ring.color} strokeWidth="3"
                      strokeDasharray={`${filled*0.4} ${circ*0.6}`}
                      strokeDashoffset={-phase*ring.r}
                      opacity="0.8" strokeLinecap="round"
                      animate={{strokeDashoffset:[-phase*ring.r,-(phase+Math.PI*2)*ring.r]}}
                      transition={{duration:8-i,repeat:Infinity,ease:'linear'}}/>
                    <motion.circle cx="160" cy="160" r={ring.r} fill="none" stroke={ring.color} strokeWidth="1"
                      opacity="0.3" strokeDasharray={`${filled*0.2} ${circ*0.8}`}
                      animate={{rotate:[0,360]}} transition={{duration:6+i*2,repeat:Infinity,ease:'linear'}}
                      style={{transformOrigin:'160px 160px'}}/>
                  </g>
                );
              })}
              <circle cx="160" cy="160" r="35" fill="radial-gradient(circle,#6366f133,transparent)" opacity="0.5"/>
              <motion.circle cx="160" cy="160" r="30" fill="#6366f1" opacity="0.15"
                animate={{r:[28,36,28]}} transition={{repeat:Infinity,duration:2}}/>
              <text x="160" y="156" textAnchor="middle" fill="white" fontSize="28" fontWeight="900">{healthScore}</text>
              <text x="160" y="174" textAnchor="middle" fill="#a5b4fc" fontSize="11">Health Score</text>
            </svg>
          </div>
          <div className="flex gap-4 flex-wrap justify-center mt-4 z-10 relative">
            {RINGS.map((r,i)=>(
              <div key={i} className="flex items-center gap-1.5 text-xs font-bold text-white">
                <div className="w-2.5 h-2.5 rounded-full" style={{background:r.color}}/>{r.label}: {r.value}%
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── 2. UserExperienceDNAPanel ─────────────────────────────────────────────── */
export const UserExperienceDNAPanel = () => {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),60);return()=>clearInterval(t);},[]);
  const PAIRS=['Discover','Engage','Transact','Return','Advocate','Refer','Retain','Grow','Evolve','Elevate'];
  const METRICS=[['UX Quality Score','94%','#6366f1'],['Emotional Engagement','87%','#ec4899'],['Session Depth','8.4 pages','#14b8a6'],['Return Rate','78%','#10b981']];
  const sinWave=(x,amp,freq,phase)=>amp*Math.sin(freq*x+phase);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-lg border border-indigo-200" style={{background:'linear-gradient(135deg,#ede9fe,#dbeafe)'}}>
        <div className="p-6">
          <p className="font-extrabold text-indigo-900 mb-1">🧬 User Experience DNA</p>
          <p className="text-indigo-500 text-xs mb-5">How users emotionally interact with the ecosystem</p>
          <svg viewBox="0 0 580 200" className="w-full" style={{overflow:'visible'}}>
            {PAIRS.map((_,i)=>{
              const x=i*(580/9);
              const y1=100+sinWave(i,60,0.7,tick*0.05);
              const y2=100-sinWave(i,60,0.7,tick*0.05);
              return(
                <g key={i}>
                  <line x1={x} y1={y1} x2={x} y2={y2} stroke="#c4b5fd" strokeWidth="2" opacity="0.6"/>
                  <motion.circle cx={x} cy={y1} r="6" fill="#6366f1" animate={{cy:y1}} transition={{duration:0.1}}/>
                  <motion.circle cx={x} cy={y2} r="6" fill="#ec4899" animate={{cy:y2}} transition={{duration:0.1}}/>
                </g>
              );
            })}
            <motion.path
              d={`M ${PAIRS.map((_,i)=>`${i*(580/9)},${100+sinWave(i,60,0.7,tick*0.05)}`).join(' L ')}`}
              fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <motion.path
              d={`M ${PAIRS.map((_,i)=>`${i*(580/9)},${100-sinWave(i,60,0.7,tick*0.05)}`).join(' L ')}`}
              fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {METRICS.map(([l,v,c])=>(
          <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-extrabold" style={{color:c}}>{v}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── 3. PlatformEmotionGridPanel ───────────────────────────────────────────── */
export const PlatformEmotionGridPanel = () => {
  const [grid,setGrid]=useState(()=>[...Array(100)].map(()=>Math.random()));
  const [selected,setSelected]=useState(null);
  const SEGMENTS=['Pet Owners','Veterinarians','Marketplace','Support','Bookings','Analytics','Billing','Community','Health','Admin'];
  useEffect(()=>{
    const t=setInterval(()=>setGrid(g=>g.map(v=>Math.max(0,Math.min(1,v+(Math.random()-0.5)*0.15)))),800);
    return()=>clearInterval(t);
  },[]);
  const getColor=v=>v>0.7?`rgba(20,184,166,${0.4+v*0.5})`:v>0.4?`rgba(245,158,11,${0.3+v*0.5})`:`rgba(239,68,68,${0.3+(1-v)*0.5})`;
  const sentiment=Math.round(grid.filter(v=>v>0.6).length);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div><p className="font-extrabold text-slate-800">🌡️ Platform Emotion Grid</p><p className="text-xs text-slate-400">Real-time emotional heatmap across 100 platform segments</p></div>
          <div className="text-right"><p className="text-2xl font-extrabold text-teal-600">{sentiment}%</p><p className="text-xs text-slate-400">Positive sentiment</p></div>
        </div>
        <div className="grid gap-1 mb-3" style={{gridTemplateColumns:'repeat(10,1fr)'}}>
          {grid.map((v,i)=>(
            <motion.div key={i} className="aspect-square rounded-sm cursor-pointer"
              style={{background:getColor(v)}}
              animate={{opacity:[0.8,1,0.8]}} transition={{repeat:Infinity,duration:1.5+Math.random(),delay:Math.random()}}
              onClick={()=>setSelected({idx:i,val:v,seg:SEGMENTS[i%10]})}/>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm" style={{background:'rgba(20,184,166,0.8)'}}/><span className="text-slate-500">Positive</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm" style={{background:'rgba(245,158,11,0.8)'}}/><span className="text-slate-500">Neutral</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm" style={{background:'rgba(239,68,68,0.8)'}}/><span className="text-slate-500">Negative</span></div>
        </div>
        <AnimatePresence>
          {selected&&(
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
              className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-800 text-sm">Segment: {selected.seg}</p>
              <p className="text-xs text-slate-500 mt-0.5">Sentiment score: {(selected.val*100).toFixed(1)}% — {selected.val>0.6?'Positive':selected.val>0.4?'Neutral':'Needs attention'}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─── 4. EngagementVolcanoPanel ─────────────────────────────────────────────── */
export const EngagementVolcanoPanel = () => {
  const [eruption,setEruption]=useState(75);
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>{setTick(x=>x+1);setEruption(e=>Math.max(30,Math.min(100,e+(Math.random()-0.45)*3)));},[500]);return()=>clearInterval(t);},[]);
  const TRENDING=[{name:'AI Diagnostics Feature',heat:94},{name:'Pet Health Passport',heat:87},{name:'Emergency SOS',heat:79},{name:'Wellness Tracker',heat:68}];
  const lavaH=200*(eruption/100);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div><p className="font-extrabold text-slate-800">🌋 Digital Engagement Volcano</p><p className="text-xs text-slate-400">Platform viral activity & engagement spikes</p></div>
          <div className="text-right"><motion.p className="text-3xl font-extrabold text-orange-600" animate={{scale:[1,1.05,1]}} transition={{repeat:Infinity,duration:1}}>{Math.round(eruption)}%</motion.p><p className="text-xs text-slate-400">Eruption Level</p></div>
        </div>
        <div className="flex justify-center mb-4">
          <svg viewBox="0 0 300 280" width="300" height="280">
            <defs>
              <linearGradient id="lavaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24"/>
                <stop offset="50%" stopColor="#f97316"/>
                <stop offset="100%" stopColor="#ef4444"/>
              </linearGradient>
            </defs>
            {/* Volcano body */}
            <polygon points="150,40 240,240 60,240" fill="#64748b"/>
            <polygon points="150,40 220,240 80,240" fill="#475569"/>
            {/* Crater */}
            <ellipse cx="150" cy="60" rx="40" ry="12" fill="#334155"/>
            {/* Lava pool */}
            <motion.ellipse cx="150" cy="60" rx="35" ry="10" fill="url(#lavaGrad)" opacity="0.9"
              animate={{ry:[8,13,8]}} transition={{repeat:Infinity,duration:1.5}}/>
            {/* Eruption */}
            {eruption>60&&[...Array(5)].map((_,i)=>(
              <motion.ellipse key={i} cx={150+(i-2)*15} cy={60} rx="6" ry="6" fill="#fbbf24" opacity="0.9"
                animate={{cy:[60,60-lavaH+i*20,60],opacity:[1,0.8,0],scaleX:[1,0.6,0.3]}}
                transition={{repeat:Infinity,duration:1.2,delay:i*0.2,ease:'easeOut'}}/>
            ))}
            {/* Ground lava streams */}
            <motion.path d="M80,240 Q30,230 10,250" stroke="url(#lavaGrad)" strokeWidth={4+eruption*0.04} fill="none" opacity="0.7"
              animate={{strokeWidth:[3,6,3]}} transition={{repeat:Infinity,duration:1}}/>
            <motion.path d="M220,240 Q270,230 290,255" stroke="url(#lavaGrad)" strokeWidth={3+eruption*0.03} fill="none" opacity="0.7"
              animate={{strokeWidth:[2,5,2]}} transition={{repeat:Infinity,duration:1.3}}/>
            {/* Smoke */}
            {[...Array(4)].map((_,i)=>(
              <motion.circle key={i} cx={140+(i*7)} cy="40" r={8+i*4} fill="#94a3b8" opacity="0.2"
                animate={{cy:[40,40-50-i*20],opacity:[0.3,0],r:[8+i*4,20+i*8]}}
                transition={{repeat:Infinity,duration:2,delay:i*0.4}}/>
            ))}
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">🔥 Trending Lava Streams</p>
          {TRENDING.map((t,i)=>(
            <div key={i} className="flex items-center gap-3">
              <p className="text-xs font-semibold text-slate-700 flex-1">{t.name}</p>
              <div className="w-24 h-2 bg-slate-100 rounded-full"><motion.div className="h-2 rounded-full" style={{background:'linear-gradient(90deg,#f97316,#fbbf24)',width:`${t.heat}%`}} initial={{width:0}} animate={{width:`${t.heat}%`}} transition={{delay:i*0.1}}/></div>
              <span className="text-xs font-bold text-orange-600 w-8 text-right">{t.heat}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 5. RevenueEnergyMatrixPanel ───────────────────────────────────────────── */
export const RevenueEnergyMatrixPanel = () => {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),80);return()=>clearInterval(t);},[]);
  const STREAMS=[
    {name:'Subscriptions',rev:45000,color:'#6366f1',icon:'💎'},
    {name:'Marketplace',rev:38000,color:'#14b8a6',icon:'🛒'},
    {name:'Consultations',rev:29000,color:'#10b981',icon:'🩺'},
    {name:'Premium AI',rev:18000,color:'#f59e0b',icon:'🧠'},
  ];
  const total=STREAMS.reduce((a,s)=>a+s.rev,0);
  const [count,setCount]=useState(0);
  useEffect(()=>{let c=0;const t=setInterval(()=>{c+=Math.ceil(total/80);setCount(Math.min(c,total));if(c>=total)clearInterval(t);},[30]);return()=>clearInterval(t);},[]);
  const GRID=[...Array(25)].map((_,i)=>({x:i%5,y:Math.floor(i/5),v:Math.random()}));
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl p-6 text-white" style={{background:'linear-gradient(135deg,#0f172a,#1e1b4b)'}}>
        <div className="flex items-center justify-between mb-5">
          <div><p className="font-extrabold text-lg">⚡ Revenue Energy Matrix</p><p className="text-slate-400 text-xs">Live financial analytics visualization</p></div>
          <div className="text-right">
            <motion.p className="text-3xl font-black text-yellow-400">₹{count.toLocaleString('en-IN')}</motion.p>
            <p className="text-xs text-slate-400">Total Revenue</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1 mb-5">
          {GRID.map((g,i)=>(
            <motion.div key={i} className="aspect-square rounded-lg flex items-center justify-center"
              style={{background:`${STREAMS[Math.floor(g.v*4)].color}${Math.round(0.2+g.v*0.6*255).toString(16).padStart(2,'0')}`}}
              animate={{opacity:[0.6,1,0.6],scale:[1,1.05,1]}}
              transition={{repeat:Infinity,duration:1.5+Math.random(),delay:Math.random()*1.5}}>
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60"/>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STREAMS.map(s=>(
            <div key={s.name} className="p-3 rounded-xl" style={{background:`${s.color}22`,border:`1px solid ${s.color}44`}}>
              <p className="text-lg">{s.icon}</p>
              <p className="font-extrabold mt-1" style={{color:s.color}}>₹{s.rev.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.name}</p>
              <div className="h-1 rounded-full mt-1" style={{background:s.color+'44'}}>
                <motion.div className="h-1 rounded-full" style={{background:s.color,width:`${(s.rev/total*100).toFixed(0)}%`}} initial={{width:0}} animate={{width:`${(s.rev/total*100).toFixed(0)}%`}} transition={{duration:1}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 6. TrustPulseEnginePanel ──────────────────────────────────────────────── */
export const TrustPulseEnginePanel = () => {
  const [trust,setTrust]=useState(91);
  useEffect(()=>{const t=setInterval(()=>setTrust(v=>Math.max(75,Math.min(99,v+(Math.random()-0.48)*1))),[1500]);return()=>clearInterval(t);},[]);
  const FACTORS=[
    {name:'Response Time',score:88,color:'#6366f1'},
    {name:'Review Quality',score:94,color:'#14b8a6'},
    {name:'Vet Accuracy',score:92,color:'#10b981'},
    {name:'Safety Record',score:97,color:'#f59e0b'},
  ];
  const SPARKLINE=[85,87,90,88,91,89,92,91,93,91,92,Math.round(trust)];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <p className="font-extrabold text-slate-800 mb-5">💫 Realtime Trust Pulse Engine</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {[...Array(5)].map((_,i)=>(
                  <motion.circle key={i} cx="100" cy="100" r={40+i*15} fill="none" stroke="#6366f1" strokeWidth="1"
                    opacity="0.15" animate={{r:[40+i*15,40+i*15+8,40+i*15],opacity:[0.15,0.05,0.15]}}
                    transition={{repeat:Infinity,duration:2.5,delay:i*0.4}}/>
                ))}
                <motion.circle cx="100" cy="100" r="40" fill="#6366f1" opacity="0.1"
                  animate={{r:[38,44,38]}} transition={{repeat:Infinity,duration:1.5}}/>
                <circle cx="100" cy="100" r="40" fill="none" stroke="#6366f1" strokeWidth="3"/>
                <motion.text x="100" y="96" textAnchor="middle" fill="#4f46e5" fontSize="30" fontWeight="900"
                  animate={{fontSize:['28','32','28']}} transition={{repeat:Infinity,duration:1.5}}>{Math.round(trust)}</motion.text>
                <text x="100" y="114" textAnchor="middle" fill="#94a3b8" fontSize="11">Trust Score</text>
              </svg>
            </div>
            {/* Sparkline */}
            <div className="w-full mt-3 bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-bold text-slate-500 mb-2">30-day trend</p>
              <svg viewBox="0 0 200 40" className="w-full">
                <polyline points={SPARKLINE.map((v,i)=>`${i*(200/11)},${40-v*0.4}`).join(' ')} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
                <circle cx={200} cy={40-Math.round(trust)*0.4} r="3" fill="#6366f1"/>
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            {FACTORS.map((f,i)=>(
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between mb-1.5"><p className="font-bold text-slate-700 text-sm">{f.name}</p><span className="font-extrabold text-sm" style={{color:f.color}}>{f.score}%</span></div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div className="h-2 rounded-full" style={{background:f.color}} initial={{width:0}} animate={{width:`${f.score}%`}} transition={{delay:i*0.1+0.3}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── 7. EcosystemBalanceOrbitPanel ─────────────────────────────────────────── */
export const EcosystemBalanceOrbitPanel = () => {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),30);return()=>clearInterval(t);},[]);
  const PLANETS=[
    {label:'Users',size:18,orbit:90,speed:0.008,color:'#6366f1',val:'2.4K'},
    {label:'Vets',size:14,orbit:130,speed:0.006,color:'#14b8a6',val:'142'},
    {label:'Revenue',size:16,orbit:170,speed:0.004,color:'#f59e0b',val:'₹1.3L'},
    {label:'Satisfaction',size:12,orbit:210,speed:0.003,color:'#10b981',val:'94%'},
    {label:'Security',size:10,orbit:250,speed:0.002,color:'#ec4899',val:'99.9%'},
  ];
  const cx=300,cy=300;
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl" style={{background:'radial-gradient(ellipse at center,#1e1b4b 0%,#0a0a1a 100%)'}}>
        <div className="p-5 border-b border-white/10">
          <p className="font-extrabold text-white">🪐 Ecosystem Balance Orbit</p>
          <p className="text-indigo-300 text-xs mt-0.5">Platform metrics in orbital equilibrium</p>
        </div>
        <div className="flex justify-center" style={{overflowX:'auto'}}>
          <svg viewBox="0 0 600 600" width="600" height="340" style={{maxWidth:'100%'}}>
            {PLANETS.map((p,i)=>(
              <ellipse key={i} cx={cx} cy={cy} rx={p.orbit} ry={p.orbit*0.35} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            ))}
            {/* Sun */}
            <motion.circle cx={cx} cy={cy} r="30" fill="#fbbf24" opacity="0.9"
              animate={{r:[28,33,28]}} transition={{repeat:Infinity,duration:2}}/>
            <circle cx={cx} cy={cy} r="45" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3"/>
            <text x={cx} y={cy+5} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">CORE</text>
            {PLANETS.map((p,i)=>{
              const angle=tick*p.speed+i*(Math.PI*2/PLANETS.length);
              const px=cx+p.orbit*Math.cos(angle);
              const py=cy+p.orbit*0.35*Math.sin(angle);
              return(
                <g key={i}>
                  <motion.circle cx={px} cy={py} r={p.size} fill={p.color}
                    animate={{cx:px,cy:py}} transition={{duration:0.03}}>
                    <animateMotion dur={`${Math.PI*2/p.speed/30}s`} repeatCount="indefinite"
                      path={`M ${p.orbit} 0 A ${p.orbit} ${p.orbit*0.35} 0 1 1 ${p.orbit-0.01} 0`}/>
                  </motion.circle>
                  <circle cx={px} cy={py} r={p.size+6} fill={p.color} opacity="0.15"/>
                  <text x={px} y={py+p.size+14} textAnchor="middle" fill={p.color} fontSize="8" fontWeight="bold">{p.label}</text>
                  <text x={px} y={py+p.size+24} textAnchor="middle" fill="white" fontSize="9" fontWeight="900">{p.val}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ─── 8. GlobalActivitySkylinePanel ─────────────────────────────────────────── */
export const GlobalActivitySkylinePanel = () => {
  const [tick,setTick]=useState(0);
  const [activeUsers,setActiveUsers]=useState(1247);
  useEffect(()=>{
    const t=setInterval(()=>{setTick(x=>x+1);setActiveUsers(v=>Math.max(900,Math.min(2000,v+Math.round((Math.random()-0.48)*20))));},[600]);
    return()=>clearInterval(t);
  },[]);
  const BUILDINGS=[
    {cat:'Owners',base:180,color:'#6366f1',windows:20},
    {cat:'Vets',base:140,color:'#14b8a6',windows:12},
    {cat:'Appointments',base:200,color:'#10b981',windows:25},
    {cat:'Marketplace',base:160,color:'#f59e0b',windows:18},
    {cat:'Health AI',base:220,color:'#ec4899',windows:30},
    {cat:'Support',base:120,color:'#3b82f6',windows:10},
    {cat:'Admin',base:170,color:'#8b5cf6',windows:22},
  ];
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl" style={{background:'linear-gradient(180deg,#0f172a 0%,#1e293b 60%,#0f172a 100%)'}}>
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div><p className="font-extrabold text-white">🌆 Global Activity Skyline</p><p className="text-slate-400 text-xs mt-0.5">Building height = activity intensity</p></div>
          <motion.div className="text-right" animate={{opacity:[1,0.7,1]}} transition={{repeat:Infinity,duration:2}}>
            <p className="text-2xl font-extrabold text-teal-400">{activeUsers.toLocaleString()}</p>
            <p className="text-xs text-slate-400">● Active Users Now</p>
          </motion.div>
        </div>
        <svg viewBox="0 0 580 260" className="w-full">
          {/* Stars */}
          {[...Array(40)].map((_,i)=>(
            <motion.circle key={i} cx={Math.random()*580} cy={Math.random()*80} r="1" fill="white" opacity="0.5"
              animate={{opacity:[0.3,0.8,0.3]}} transition={{repeat:Infinity,duration:1+Math.random()*2,delay:Math.random()*2}}/>
          ))}
          {BUILDINGS.map((b,i)=>{
            const bw=60,bx=30+i*75,by=260-b.base,bh=b.base;
            const wrows=Math.floor(bh/18),wcols=3;
            return(
              <g key={i}>
                <rect x={bx} y={by} width={bw} height={bh} fill={b.color+'33'} rx="3"/>
                <rect x={bx} y={by} width={bw} height="4" fill={b.color} rx="3" opacity="0.8"/>
                {/* Neon outline */}
                <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke={b.color} strokeWidth="1" rx="3" opacity="0.5"/>
                {/* Windows */}
                {[...Array(Math.min(wrows*wcols,18))].map((_,wi)=>{
                  const wx=bx+6+(wi%wcols)*19;
                  const wy=by+8+Math.floor(wi/wcols)*18;
                  const on=Math.random()>0.3;
                  return(
                    <motion.rect key={wi} x={wx} y={wy} width="12" height="10" rx="1" fill={on?b.color:'transparent'}
                      opacity={on?0.8:0.1}
                      animate={{opacity:on?[0.5,1,0.5]:[0.1,0.15,0.1]}}
                      transition={{repeat:Infinity,duration:1+Math.random()*2,delay:Math.random()*2}}/>
                  );
                })}
                <text x={bx+bw/2} y="255" textAnchor="middle" fill={b.color} fontSize="8" fontWeight="bold">{b.cat}</text>
              </g>
            );
          })}
          {/* Ground glow */}
          <rect x="0" y="248" width="580" height="12" fill="url(#groundGrad)" rx="0" opacity="0.6"/>
          <defs><linearGradient id="groundGrad" x1="0" y1="0" x2="1" y2="0">{BUILDINGS.map((b,i)=><stop key={i} offset={`${(i/7)*100}%`} stopColor={b.color} stopOpacity="0.4"/>)}</linearGradient></defs>
        </svg>
      </div>
    </div>
  );
};

/* ─── 9. IntelligenceStreamNetworkPanel ─────────────────────────────────────── */
export const IntelligenceStreamNetworkPanel = () => {
  const [insights,setInsights]=useState(0);
  const [particles,setParticles]=useState([]);
  useEffect(()=>{
    setInsights(Math.floor(Math.random()*50)+80);
    setParticles([...Array(8)].map((_,i)=>({id:i,pos:0,speed:0.005+Math.random()*0.015,fromIdx:i%5,toIdx:(i+2)%5})));
    const t=setInterval(()=>{setParticles(p=>p.map(pt=>({...pt,pos:(pt.pos+pt.speed)%1})));setInsights(v=>v+Math.round(Math.random()*2));},[50]);
    return()=>clearInterval(t);
  },[]);
  const NODES=[
    {x:290,y:140,label:'Core AI',color:'#6366f1',size:20},
    {x:150,y:80,label:'Health',color:'#10b981',size:14},
    {x:430,y:80,label:'Revenue',color:'#f59e0b',size:12},
    {x:150,y:200,label:'Users',color:'#14b8a6',size:13},
    {x:430,y:200,label:'Vets',color:'#ec4899',size:11},
  ];
  const EDGES=[[0,1],[0,2],[0,3],[0,4],[1,3],[2,4]];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl" style={{background:'#0f172a'}}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div><p className="font-extrabold text-white">🧠 AI Intelligence Stream Network</p><p className="text-slate-400 text-xs mt-0.5">Real-time insight propagation across the platform</p></div>
          <div className="text-right"><motion.p className="text-xl font-extrabold text-indigo-400" animate={{scale:[1,1.05,1]}} transition={{repeat:Infinity,duration:1}}>{insights.toLocaleString()}</motion.p><p className="text-xs text-slate-400">Insights/hr</p></div>
        </div>
        <svg viewBox="0 0 580 280" className="w-full">
          {EDGES.map(([a,b],i)=>{
            const from=NODES[a],to=NODES[b];
            return(
              <g key={i}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(99,102,241,0.2)" strokeWidth="1.5"/>
                {particles.filter(p=>p.fromIdx===a&&p.toIdx===b).map(p=>{
                  const px=from.x+(to.x-from.x)*p.pos;
                  const py=from.y+(to.y-from.y)*p.pos;
                  return<circle key={p.id} cx={px} cy={py} r="3" fill={NODES[a].color} opacity="0.9"/>;
                })}
              </g>
            );
          })}
          {NODES.map((n,i)=>(
            <g key={i}>
              <motion.circle cx={n.x} cy={n.y} r={n.size+8} fill={n.color} opacity="0.1"
                animate={{r:[n.size+6,n.size+14,n.size+6]}} transition={{repeat:Infinity,duration:2,delay:i*0.4}}/>
              <circle cx={n.x} cy={n.y} r={n.size} fill={n.color} opacity="0.9"/>
              <text x={n.x} y={n.y+n.size+14} textAnchor="middle" fill={n.color} fontSize="9" fontWeight="bold">{n.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

/* ─── 10. QuantumEvolutionCorePanel ─────────────────────────────────────────── */
export const QuantumEvolutionCorePanel = () => {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),40);return()=>clearInterval(t);},[]);
  const SUBSYSTEMS=[
    {name:'Automation',icon:'⚙️',val:94,color:'#6366f1'},
    {name:'Predictions',icon:'🔮',val:87,color:'#8b5cf6'},
    {name:'Analytics',icon:'📊',val:91,color:'#14b8a6'},
    {name:'Emotional AI',icon:'💗',val:83,color:'#ec4899'},
    {name:'Sync',icon:'🔄',val:98,color:'#10b981'},
    {name:'Personalization',icon:'✨',val:79,color:'#f59e0b'},
    {name:'Evolution',icon:'🧬',val:72,color:'#3b82f6'},
  ];
  const cx=220,cy=200,orbitR=130;
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl" style={{background:'radial-gradient(ellipse at 40% 50%,#1e1b4b 0%,#0f0c29 50%,#000 100%)'}}>
        <div className="p-5 border-b border-white/10">
          <p className="font-extrabold text-white text-lg">⚛️ Quantum Evolution Core</p>
          <p className="text-purple-300 text-xs mt-0.5">Master AI engine continuously evolving the ecosystem</p>
        </div>
        <div className="flex gap-0 overflow-hidden">
          <svg viewBox="0 0 440 400" width="440" style={{maxWidth:'60%',flexShrink:0}}>
            {/* Outer rings */}
            {[70,100,130].map((r,i)=>(
              <motion.circle key={i} cx={cx} cy={cy} r={r+orbitR*0.08} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="1"
                animate={{rotate:[0,360]}} transition={{repeat:Infinity,duration:15+i*5,ease:'linear'}}
                style={{transformOrigin:`${cx}px ${cy}px`}}/>
            ))}
            {/* Orbiting subsystem dots */}
            {SUBSYSTEMS.map((s,i)=>{
              const angle=tick*0.015+i*(Math.PI*2/SUBSYSTEMS.length);
              const px=cx+orbitR*Math.cos(angle);
              const py=cy+orbitR*Math.sin(angle);
              return(
                <g key={i}>
                  <circle cx={px} cy={py} r="14" fill={s.color} opacity="0.9"/>
                  <circle cx={px} cy={py} r="20" fill={s.color} opacity="0.15"/>
                  <text x={px} y={py+4} textAnchor="middle" fontSize="10">{s.icon}</text>
                </g>
              );
            })}
            {/* Core hexagon */}
            <motion.polygon
              points={Array.from({length:6},(_,i)=>{const a=Math.PI/3*i+tick*0.01;return`${cx+50*Math.cos(a)},${cy+50*Math.sin(a)}`;}).join(' ')}
              fill="rgba(139,92,246,0.3)" stroke="#8b5cf6" strokeWidth="2"/>
            <motion.circle cx={cx} cy={cy} r="35" fill="rgba(99,102,241,0.4)"
              animate={{r:[32,40,32]}} transition={{repeat:Infinity,duration:2}}/>
            <text x={cx} y={cy-5} textAnchor="middle" fill="white" fontSize="11" fontWeight="900">QUANTUM</text>
            <text x={cx} y={cy+10} textAnchor="middle" fill="#a5b4fc" fontSize="9">CORE</text>
          </svg>
          <div className="flex-1 p-5 space-y-2 overflow-auto">
            {SUBSYSTEMS.map((s,i)=>(
              <div key={i} className="p-3 rounded-xl" style={{background:`${s.color}18`,border:`1px solid ${s.color}33`}}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-white">{s.icon} {s.name}</p>
                  <p className="font-extrabold text-xs" style={{color:s.color}}>{s.val}%</p>
                </div>
                <div className="h-1 rounded-full bg-white/10">
                  <motion.div className="h-1 rounded-full" style={{background:s.color,width:`${s.val}%`}} initial={{width:0}} animate={{width:`${s.val}%`}} transition={{delay:i*0.1}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
