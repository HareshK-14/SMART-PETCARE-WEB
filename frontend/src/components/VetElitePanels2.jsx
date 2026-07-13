import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, TrendingUp, Shield, Heart, Brain,
  CheckCircle, AlertTriangle, Clock, ChevronRight, Star,
  Play, Pause, Users, FileText, ArrowUp, ArrowDown } from 'lucide-react';

/* ─── 1. ClinicalEnergyDetectorPanel ────────────────────────────────────────── */
export const ClinicalEnergyDetectorPanel = () => {
  const SYSTEMS=[
    {name:'Nervous',key:'n',base:75},
    {name:'Cardiac',key:'c',base:88},
    {name:'Respiratory',key:'r',base:70},
    {name:'Digestive',key:'d',base:82},
    {name:'Immune',key:'i',base:65},
  ];
  const [vals,setVals]=useState(SYSTEMS.map(s=>s.base));
  const [tick,setTick]=useState(0);
  useEffect(()=>{
    const t=setInterval(()=>{
      setVals(v=>v.map((x,i)=>Math.max(40,Math.min(98,x+(Math.random()-0.5)*6))));
      setTick(x=>x+1);
    },400);
    return()=>clearInterval(t);
  },[]);
  const stability=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
  const getColor=v=>v>=75?'#10b981':v>=55?'#f59e0b':'#ef4444';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div><p className="font-extrabold text-slate-800 text-lg">⚡ Clinical Energy Detector</p><p className="text-xs text-slate-400">Real-time body system energy analysis</p></div>
          <div className="text-right"><p className="text-3xl font-black text-teal-600">{stability}</p><p className="text-xs text-slate-400">Stability Score</p></div>
        </div>
        <div className="flex items-end gap-4 h-48 bg-slate-950 rounded-2xl p-4">
          {SYSTEMS.map((s,i)=>(
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div className="w-full rounded-t-lg transition-all"
                style={{height:`${vals[i]}%`,background:`linear-gradient(180deg,${getColor(vals[i])},${getColor(vals[i])}44)`,boxShadow:`0 0 12px ${getColor(vals[i])}66`}}
                animate={{height:`${vals[i]}%`}} transition={{duration:0.3}}/>
              <p className="text-[10px] text-slate-400 font-bold text-center">{s.name}</p>
              <p className="text-xs font-extrabold" style={{color:getColor(vals[i])}}>{Math.round(vals[i])}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-teal-50 rounded-xl border border-teal-100">
          <p className="text-xs font-bold text-teal-700">🤖 AI Insight: {stability>75?'All systems operating within healthy parameters. No interventions needed.':stability>55?'Minor fluctuations detected. Monitor Nervous and Immune systems closely.':'Energy instability detected. Recommend immediate clinical assessment.'}</p>
        </div>
      </div>
    </div>
  );
};

/* ─── 2. TreatmentImpactRadarPanel ──────────────────────────────────────────── */
export const TreatmentImpactRadarPanel = () => {
  const AXES=['Pain Relief','Inflammation','Mobility','Appetite','Energy','Mood'];
  const BEFORE=[40,35,45,50,38,42];
  const AFTER=[82,75,78,88,80,85];
  const [show,setShow]=useState('after');
  const cx=180,cy=180,r=130;
  const pts=(vals)=>AXES.map((_,i)=>{
    const a=Math.PI*2*i/AXES.length-Math.PI/2;
    const v=vals[i]/100;
    return`${cx+r*v*Math.cos(a)},${cy+r*v*Math.sin(a)}`;
  }).join(' ');
  const axisEnd=(i)=>{const a=Math.PI*2*i/AXES.length-Math.PI/2;return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};};
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div><p className="font-extrabold text-slate-800">🎯 Treatment Impact Radar</p><p className="text-xs text-slate-400">6-axis treatment effectiveness visualization</p></div>
          <div className="flex bg-slate-100 rounded-xl p-1">
            {['before','after'].map(v=><button key={v} onClick={()=>setShow(v)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${show===v?'bg-white shadow-sm text-teal-700':'text-slate-500'}`}>{v==='before'?'Before':'After'}</button>)}
          </div>
        </div>
        <svg viewBox="0 0 360 360" className="w-full max-w-sm mx-auto">
          {[0.25,0.5,0.75,1].map(s=><polygon key={s} points={AXES.map((_,i)=>{const a=Math.PI*2*i/6-Math.PI/2;return`${cx+r*s*Math.cos(a)},${cy+r*s*Math.sin(a)}`;}).join(' ')} fill="none" stroke="#e2e8f0" strokeWidth="1"/>)}
          {AXES.map((_,i)=>{const e=axisEnd(i);return<line key={i} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke="#e2e8f0" strokeWidth="1"/>;})}
          <motion.polygon points={pts(show==='after'?AFTER:BEFORE)} fill="rgba(20,184,166,0.25)" stroke="#14b8a6" strokeWidth="2.5"
            initial={{opacity:0}} animate={{opacity:1}} key={show} transition={{duration:0.5}}/>
          {AXES.map((a,i)=>{const e=axisEnd(i);const off=i<3?12:-12;return(<text key={i} x={e.x+(e.x>cx?10:-10)} y={e.y+(e.y>cy?12:-8)} textAnchor={e.x>cx?'start':'end'} fill="#64748b" fontSize="10" fontWeight="bold">{a}</text>);})}
        </svg>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {AXES.map((a,i)=>(
            <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 font-semibold mb-1">{a}</p>
              <p className="text-lg font-extrabold text-teal-600">{show==='after'?AFTER[i]:BEFORE[i]}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 3. RecoveryWaveSimulatorPanel ─────────────────────────────────────────── */
export const RecoveryWaveSimulatorPanel = () => {
  const DAYS=Array.from({length:30},(_,i)=>i+1);
  const ACTUAL=[20,28,35,40,38,45,52,58,60,65,62,70,72,75,78,80,77,82,85,84,88,90,89,92,93,91,94,95,96,97].map((v,i)=>i<18?v:null);
  const PREDICTED=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,82,85,84,88,90,89,92,93,91,94,95,96,97];
  const MILESTONES=[{day:7,label:'Walking',color:'#10b981'},{day:14,label:'Playing',color:'#3b82f6'},{day:21,label:'Off meds',color:'#8b5cf6'},{day:28,label:'Full recovery',color:'#f59e0b'}];
  const W=580,H=180,pad=30;
  const xOf=d=>(d-1)/(29)*(W-pad*2)+pad;
  const yOf=v=>H-pad-(v/100)*(H-pad*2);
  const actualPts=ACTUAL.filter(v=>v!==null).map((v,i)=>`${xOf(i+1)},${yOf(v)}`).join(' ');
  const predPts=PREDICTED.filter((_,i)=>PREDICTED[i]!==null).map((v,i)=>`${xOf(i)},${yOf(v)}`).join(' ');
  const currentDay=18,currentVal=82;
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div><p className="font-extrabold text-slate-800">🌊 Recovery Wave Simulator</p><p className="text-xs text-slate-400">Day 18 of 30 · On track for full recovery</p></div>
          <div className="text-right"><p className="text-3xl font-black text-teal-600">{currentVal}%</p><p className="text-xs text-slate-400">Current Recovery</p></div>
        </div>
        <svg viewBox={`0 0 ${W} ${H+20}`} className="w-full">
          <polyline points={actualPts} fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          {predPts&&<polyline points={predPts} fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6,4" strokeLinecap="round"/>}
          {MILESTONES.map(m=>(
            <g key={m.day}>
              <line x1={xOf(m.day)} y1={pad} x2={xOf(m.day)} y2={H-pad} stroke={m.color} strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/>
              <circle cx={xOf(m.day)} cy={yOf(ACTUAL[m.day-1]||PREDICTED[m.day-1]||50)} r="5" fill={m.color}/>
              <text x={xOf(m.day)} y={pad-5} textAnchor="middle" fill={m.color} fontSize="9" fontWeight="bold">{m.label}</text>
            </g>
          ))}
          <motion.circle cx={xOf(currentDay)} cy={yOf(currentVal)} r="7" fill="#14b8a6"
            animate={{r:[7,10,7],opacity:[1,0.6,1]}} transition={{repeat:Infinity,duration:1.5}}/>
          <text x={pad} y={H+15} fill="#94a3b8" fontSize="9">Day 1</text>
          <text x={W-pad} y={H+15} textAnchor="end" fill="#94a3b8" fontSize="9">Day 30</text>
        </svg>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-2 text-xs text-slate-600"><div className="w-8 h-0.5 bg-teal-500 rounded"/><span>Actual progress</span></div>
          <div className="flex items-center gap-2 text-xs text-slate-600"><div className="w-8 border-t-2 border-dashed border-indigo-500"/><span>AI prediction</span></div>
        </div>
      </div>
    </div>
  );
};

/* ─── 4. SurgicalFlowMapPanel ───────────────────────────────────────────────── */
export const SurgicalFlowMapPanel = () => {
  const STEPS=[
    {id:1,name:'Pre-op Assessment',icon:'📋',status:'done',duration:'15 min'},
    {id:2,name:'Anesthesia',icon:'💉',status:'done',duration:'10 min'},
    {id:3,name:'Incision',icon:'🔪',status:'active',duration:'5 min'},
    {id:4,name:'Core Procedure',icon:'⚕️',status:'pending',duration:'45 min'},
    {id:5,name:'Closure',icon:'🩹',status:'pending',duration:'20 min'},
    {id:6,name:'Recovery',icon:'❤️',status:'pending',duration:'2 hrs'},
  ];
  const [active,setActive]=useState(3);
  const statusColor={done:'#10b981',active:'#6366f1',pending:'#cbd5e1'};
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <p className="font-extrabold text-slate-800 mb-5">🔬 Surgical Flow Map</p>
        <div className="flex flex-col gap-3">
          {STEPS.map((s,i)=>(
            <motion.div key={s.id} className="flex items-center gap-4 cursor-pointer" onClick={()=>setActive(s.id)}
              whileHover={{x:4}}>
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm"
                  style={{background:s.status==='done'?'#d1fae5':s.status==='active'?'#ede9fe':'#f8fafc',border:`2px solid ${statusColor[s.status]}`}}
                  animate={s.status==='active'?{boxShadow:['0 0 0 0 #6366f133','0 0 0 12px #6366f100']}:{}}
                  transition={{repeat:Infinity,duration:1.5}}>
                  {s.status==='done'?'✓':s.icon}
                </motion.div>
                {i<STEPS.length-1&&<div className="w-0.5 h-5 mt-1" style={{background:i<active-1?'#10b981':'#e2e8f0'}}/>}
              </div>
              <div className={`flex-1 p-3 rounded-xl border transition-all ${s.status==='active'?'bg-indigo-50 border-indigo-200':s.status==='done'?'bg-green-50 border-green-100':'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <p className={`font-bold text-sm ${s.status==='active'?'text-indigo-800':s.status==='done'?'text-slate-600':'text-slate-400'}`}>{s.name}</p>
                  <span className="text-xs text-slate-400">{s.duration}</span>
                </div>
                {s.status==='active'&&<p className="text-xs text-indigo-600 mt-0.5 font-semibold animate-pulse">● In Progress</p>}
                {s.status==='done'&&<p className="text-xs text-green-600 mt-0.5 font-semibold">✓ Completed</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 5. HealthAnomalyDetectorPanel ─────────────────────────────────────────── */
export const HealthAnomalyDetectorPanel = () => {
  const [angle,setAngle]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setAngle(a=>(a+3)%360),30);return()=>clearInterval(t);},[]);
  const ANOMALIES=[
    {id:1,name:'Subtle limping pattern',severity:'warning',conf:78,time:'2 min ago',sys:'Musculoskeletal'},
    {id:2,name:'Elevated respiration rate',severity:'critical',conf:91,time:'8 min ago',sys:'Respiratory'},
    {id:3,name:'Appetite reduction >15%',severity:'warning',conf:65,time:'1 hr ago',sys:'Digestive'},
    {id:4,name:'Normal energy patterns',severity:'normal',conf:99,time:'Now',sys:'Overall'},
  ];
  const sevColor={critical:'#ef4444',warning:'#f59e0b',normal:'#10b981'};
  const cx=90,cy=90,r=70;
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-950 rounded-3xl p-6 flex flex-col items-center">
          <p className="font-extrabold text-white mb-4 text-sm">🔍 AI Anomaly Scanner</p>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="2"/>
            {[0.33,0.66,1].map((s,i)=><circle key={i} cx={cx} cy={cy} r={r*s} fill="none" stroke="#334155" strokeWidth="1"/>)}
            <motion.arc/>
            <motion.path d={`M ${cx} ${cy-r} A ${r} ${r} 0 0 1 ${cx+r*Math.sin(Math.PI*angle/180)} ${cy-r*Math.cos(Math.PI*angle/180)}`}
              fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
            <circle cx={cx+r*Math.sin(Math.PI*angle/180)} cy={cy-r*Math.cos(Math.PI*angle/180)} r="5" fill="#14b8a6">
              <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
            </circle>
            <text x={cx} y={cy+4} textAnchor="middle" fill="#14b8a6" fontSize="16" fontWeight="900">SCAN</text>
          </svg>
          <p className="text-teal-400 text-xs font-bold mt-2 animate-pulse">● Live Monitoring Active</p>
        </div>
        <div className="space-y-3">
          {ANOMALIES.map((a,i)=>(
            <motion.div key={i} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
              className="bg-white rounded-2xl border shadow-sm p-4" style={{borderColor:sevColor[a.severity]+'44'}}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:sevColor[a.severity]}}/>
                    <p className="font-bold text-slate-800 text-sm">{a.name}</p>
                  </div>
                  <p className="text-xs text-slate-400">{a.sys} · {a.time}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="font-extrabold text-sm" style={{color:sevColor[a.severity]}}>{a.conf}%</p>
                  <p className="text-[10px] text-slate-400">confidence</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 6. ClinicalStressShieldPanel ──────────────────────────────────────────── */
export const ClinicalStressShieldPanel = () => {
  const [stress,setStress]=useState(65);
  const INTERVENTIONS=[
    {name:'Calming Music',icon:'🎵',reduction:15,active:true},
    {name:'Dim Lighting',icon:'💡',reduction:10,active:true},
    {name:'Gentle Touch',icon:'🤚',reduction:20,active:false},
    {name:'Aromatherapy',icon:'🌸',reduction:12,active:false},
  ];
  const [active,setActive]=useState([0,1]);
  const shieldFill=100-stress;
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
          <p className="font-extrabold text-slate-800 mb-4">🛡️ Stress Shield</p>
          <div className="relative" style={{width:180,height:200}}>
            <svg viewBox="0 0 180 200" width="180" height="200">
              <defs>
                <clipPath id="shieldClip">
                  <path d="M90 10 L170 45 L170 110 Q170 170 90 195 Q10 170 10 110 L10 45 Z"/>
                </clipPath>
              </defs>
              {/* Shield background */}
              <path d="M90 10 L170 45 L170 110 Q170 170 90 195 Q10 170 10 110 L10 45 Z" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="3"/>
              {/* Shield fill */}
              <motion.rect x="10" y={`${10+185*(stress/100)}`} width="160" height={`${185*(shieldFill/100)}`}
                fill="url(#shieldGrad)" clipPath="url(#shieldClip)"
                animate={{y:`${10+185*(stress/100)}`,height:`${185*(shieldFill/100)}`}} transition={{duration:0.5}}/>
              <defs>
                <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.7"/>
                </linearGradient>
              </defs>
              <path d="M90 10 L170 45 L170 110 Q170 170 90 195 Q10 170 10 110 L10 45 Z" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.5"/>
              <text x="90" y="100" textAnchor="middle" fill="#1e293b" fontSize="22" fontWeight="900">{shieldFill}%</text>
              <text x="90" y="118" textAnchor="middle" fill="#64748b" fontSize="11">Protected</text>
              {/* Glow */}
              <motion.path d="M90 10 L170 45 L170 110 Q170 170 90 195 Q10 170 10 110 L10 45 Z" fill="none" stroke="#10b981" strokeWidth="6" opacity="0.2"
                animate={{opacity:[0.1,0.3,0.1]}} transition={{repeat:Infinity,duration:2}}/>
            </svg>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-bold text-slate-600">Stress Level: <span className={`${stress>70?'text-red-500':stress>40?'text-amber-500':'text-green-500'}`}>{stress}%</span></p>
          </div>
          <input type="range" min="10" max="95" value={stress} onChange={e=>setStress(+e.target.value)} className="w-full mt-3 accent-teal-500"/>
        </div>
        <div className="space-y-3">
          <p className="font-extrabold text-slate-800">💊 Active Interventions</p>
          {INTERVENTIONS.map((iv,i)=>(
            <motion.button key={i} whileTap={{scale:0.97}}
              onClick={()=>setActive(a=>a.includes(i)?a.filter(x=>x!==i):[...a,i])}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${active.includes(i)?'bg-green-50 border-green-300 shadow-sm':'bg-white border-slate-100'}`}>
              <span className="text-2xl">{iv.icon}</span>
              <div className="flex-1">
                <p className={`font-bold text-sm ${active.includes(i)?'text-green-800':'text-slate-600'}`}>{iv.name}</p>
                <p className="text-xs text-slate-400">Reduces stress by ~{iv.reduction}%</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active.includes(i)?'bg-green-500 border-green-500':'border-slate-300'}`}>
                {active.includes(i)&&<CheckCircle className="w-3 h-3 text-white"/>}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 7. VitalityAnalyticsEnginePanel ───────────────────────────────────────── */
export const VitalityAnalyticsEnginePanel = () => {
  const VITALS=[
    {name:'Heart Rate',val:78,unit:'bpm',normal:[60,100],color:'#ef4444'},
    {name:'Temperature',val:38.5,unit:'°C',normal:[37.5,39.2],color:'#f59e0b'},
    {name:'Oxygen Sat',val:97,unit:'%',normal:[95,100],color:'#3b82f6'},
    {name:'Respiratory',val:22,unit:'br/min',normal:[15,30],color:'#8b5cf6'},
    {name:'Blood Pressure',val:125,unit:'mmHg',normal:[100,140],color:'#ec4899'},
    {name:'Energy Level',val:82,unit:'%',normal:[50,100],color:'#10b981'},
  ];
  const [tick,setTick]=useState(0);
  const [vals,setVals]=useState(VITALS.map(v=>v.val));
  useEffect(()=>{const t=setInterval(()=>{setVals(v=>v.map((x,i)=>+(x+(Math.random()-0.5)*0.8).toFixed(1)));setTick(x=>x+1);},[800]);return()=>clearInterval(t);},[]);
  const inRange=(v,vt)=>v>=vt.normal[0]&&v<=vt.normal[1];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <p className="font-extrabold text-slate-800 mb-5">💓 Vitality Analytics Engine</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {VITALS.map((v,i)=>(
            <motion.div key={i} className="p-4 rounded-2xl border-2 flex flex-col items-center"
              style={{borderColor:v.color+'33',background:v.color+'08'}}>
              <div className="relative mb-2">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke={v.color+'22'} strokeWidth="8"/>
                  <motion.circle cx="40" cy="40" r="32" fill="none" stroke={v.color} strokeWidth="8"
                    strokeDasharray={`${2*Math.PI*32*(inRange(vals[i],v)?0.8:0.4)} ${2*Math.PI*32}`}
                    transform="rotate(-90 40 40)" strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.p className="text-base font-extrabold" style={{color:v.color}}
                    animate={{scale:tick%2===i%2?[1,1.08,1]:1}} transition={{duration:0.4}}>
                    {vals[i]}
                  </motion.p>
                </div>
              </div>
              <p className="text-xs font-extrabold text-slate-700 text-center">{v.name}</p>
              <p className="text-[10px] text-slate-400">{v.unit}</p>
              <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${inRange(vals[i],v)?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>
                {inRange(vals[i],v)?'Normal':'Watch'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 8. MedicalExperienceOptimizerPanel ────────────────────────────────────── */
export const MedicalExperienceOptimizerPanel = () => {
  const OPTS=[
    {title:'Pre-consultation intake forms',impact:'High',saving:'12 min/appt',progress:85,color:'#10b981'},
    {title:'Smart appointment reminders',impact:'High',saving:'8 min/appt',progress:92,color:'#3b82f6'},
    {title:'Digital prescription delivery',impact:'Medium',saving:'5 min/appt',progress:67,color:'#8b5cf6'},
    {title:'AI triage pre-screening',impact:'High',saving:'18 min/appt',progress:45,color:'#f59e0b'},
    {title:'Post-visit care plan automation',impact:'Medium',saving:'10 min/appt',progress:58,color:'#ec4899'},
  ];
  const score=Math.round(OPTS.reduce((a,o)=>a+o.progress,0)/OPTS.length);
  const r=60,circ=2*Math.PI*r;
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-6 mb-5">
          <div className="relative flex-shrink-0">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12"/>
              <motion.circle cx="70" cy="70" r={r} fill="none" stroke="#6366f1" strokeWidth="12"
                strokeDasharray={`${circ*(score/100)} ${circ}`} transform="rotate(-90 70 70)"
                strokeLinecap="round" initial={{strokeDasharray:`0 ${circ}`}}
                animate={{strokeDasharray:`${circ*(score/100)} ${circ}`}} transition={{duration:1.5}}/>
              <text x="70" y="66" textAnchor="middle" fill="#4f46e5" fontSize="26" fontWeight="900">{score}</text>
              <text x="70" y="84" textAnchor="middle" fill="#94a3b8" fontSize="10">Quality Score</text>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Experience Optimizer</h2>
            <p className="text-slate-400 text-sm mt-0.5">AI-driven consultation workflow improvements</p>
            <div className="flex gap-3 mt-3">
              {[['High Impact','#10b981',OPTS.filter(o=>o.impact==='High').length],['Medium','#f59e0b',OPTS.filter(o=>o.impact==='Medium').length]].map(([l,c,n])=>(
                <div key={l} className="text-center p-2 rounded-xl" style={{background:c+'18'}}>
                  <p className="text-lg font-extrabold" style={{color:c}}>{n}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {OPTS.map((o,i)=>(
            <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-slate-800 text-sm">{o.title}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:o.color+'18',color:o.color}}>{o.impact}</span>
                  <span className="text-xs text-slate-400 font-semibold">💾 {o.saving}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                  <motion.div className="h-1.5 rounded-full" style={{background:o.color}}
                    initial={{width:0}} animate={{width:`${o.progress}%`}} transition={{delay:i*0.1+0.3,duration:0.8}}/>
                </div>
                <span className="text-xs font-bold text-slate-500 w-8 text-right">{o.progress}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 9. TreatmentFlowEnginePanel ───────────────────────────────────────────── */
export const TreatmentFlowEnginePanel = () => {
  const INIT={
    queued:[{id:1,pet:'Rocky',cond:'Fracture',sev:'critical',time:'0m'},{id:2,pet:'Mia',cond:'Allergy',sev:'mild',time:'5m'}],
    inprogress:[{id:3,pet:'Bruno',cond:'Surgery',sev:'critical',time:'42m'},{id:4,pet:'Luna',cond:'Vaccination',sev:'mild',time:'12m'}],
    monitoring:[{id:5,pet:'Max',cond:'Post-op',sev:'moderate',time:'2h'}],
    completed:[{id:6,pet:'Bella',cond:'Checkup',sev:'mild',time:'done'},{id:7,pet:'Charlie',cond:'Dental',sev:'mild',time:'done'}],
  };
  const [cols,setCols]=useState(INIT);
  const COLS=[['queued','📋 Queued','#f59e0b'],['inprogress','⚡ In Progress','#6366f1'],['monitoring','👁️ Monitoring','#3b82f6'],['completed','✅ Completed','#10b981']];
  const sevColor={critical:'#ef4444',moderate:'#f59e0b',mild:'#10b981'};
  return (
    <div className="space-y-5 max-w-5xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <p className="font-extrabold text-slate-800 mb-4">🔄 Realtime Treatment Flow Engine</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COLS.map(([key,label,color])=>(
            <div key={key}>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-extrabold" style={{color}}>{label}</p>
                <span className="w-5 h-5 rounded-full text-white text-[10px] font-extrabold flex items-center justify-center" style={{background:color}}>{cols[key].length}</span>
              </div>
              <div className="space-y-2 min-h-[120px] p-2 rounded-2xl bg-slate-50 border border-slate-100">
                <AnimatePresence>
                  {cols[key].map(p=>(
                    <motion.div key={p.id} layout initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}}
                      className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-slate-800 text-xs">{p.pet}</p>
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:sevColor[p.sev]}}/>
                      </div>
                      <p className="text-[10px] text-slate-500">{p.cond}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">⏱ {p.time}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 10. ClinicalInsightConstellationPanel ─────────────────────────────────── */
export const ClinicalInsightConstellationPanel = () => {
  const INSIGHTS=[
    {id:1,x:120,y:80,cat:'Diagnostics',insight:'Early parvovirus detection via appetite pattern',color:'#ef4444',size:8},
    {id:2,x:200,y:140,cat:'Treatment',insight:'Amoxicillin 87% effective for this breed',color:'#3b82f6',size:10},
    {id:3,x:300,y:100,cat:'Prevention',insight:'Quarterly heartworm prevention reduces risk 94%',color:'#10b981',size:9},
    {id:4,x:380,y:180,cat:'Recovery',insight:'Post-surgery walks improve recovery by 40%',color:'#f59e0b',size:8},
    {id:5,x:160,y:230,cat:'Diagnostics',insight:'Blood panel anomaly correlates with dietary deficiency',color:'#ef4444',size:7},
    {id:6,x:460,y:120,cat:'Treatment',insight:'Steroid dosage optimization for feline asthma',color:'#3b82f6',size:9},
    {id:7,x:340,y:270,cat:'Prevention',insight:'Annual dental cleaning reduces systemic disease by 60%',color:'#10b981',size:11},
    {id:8,x:500,y:230,cat:'Recovery',insight:'Pain score monitoring accelerates discharge decisions',color:'#f59e0b',size:8},
  ];
  const [hovered,setHovered]=useState(null);
  const bg=[...Array(80)].map((_,i)=>({x:Math.random()*580,y:Math.random()*320,r:Math.random()*1.2+0.3}));
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl" style={{background:'linear-gradient(135deg,#0f0c29,#1a1060,#0d0d1a)'}}>
        <div className="p-5 border-b border-white/10">
          <p className="font-extrabold text-white">✨ Clinical Insight Constellation</p>
          <p className="text-indigo-300 text-xs mt-0.5">Medical knowledge mapped as stars — hover to explore</p>
        </div>
        <svg viewBox="0 0 580 320" className="w-full">
          {bg.map((s,i)=>(
            <motion.circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.3"
              animate={{opacity:[0.2,0.6,0.2]}} transition={{repeat:Infinity,duration:2+Math.random()*3,delay:Math.random()*2}}/>
          ))}
          {[[0,1],[1,4],[2,3],[3,7],[5,6],[6,7]].map(([a,b],i)=>(
            <line key={i} x1={INSIGHTS[a].x} y1={INSIGHTS[a].y} x2={INSIGHTS[b].x} y2={INSIGHTS[b].y}
              stroke="rgba(165,180,252,0.3)" strokeWidth="1"/>
          ))}
          {INSIGHTS.map((s,i)=>(
            <g key={s.id} onMouseEnter={()=>setHovered(s)} onMouseLeave={()=>setHovered(null)} style={{cursor:'pointer'}}>
              <motion.circle cx={s.x} cy={s.y} r={s.size+10} fill={s.color} opacity="0.12"
                animate={{r:[s.size+8,s.size+16,s.size+8]}} transition={{repeat:Infinity,duration:2.5,delay:i*0.4}}/>
              <motion.circle cx={s.x} cy={s.y} r={s.size} fill={s.color}
                animate={{opacity:[0.7,1,0.7]}} transition={{repeat:Infinity,duration:2,delay:i*0.3}}/>
              {hovered?.id===s.id&&(
                <g>
                  <rect x={s.x-80} y={s.y-60} width="160" height="48" rx="8" fill="#1e1b4b" opacity="0.95"/>
                  <text x={s.x} y={s.y-44} textAnchor="middle" fill={s.color} fontSize="8" fontWeight="bold">[{s.cat}]</text>
                  <foreignObject x={s.x-75} y={s.y-38} width="150" height="30">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{color:'white',fontSize:8,lineHeight:'1.3',fontFamily:'sans-serif'}}>{s.insight}</div>
                  </foreignObject>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="flex gap-3 flex-wrap">
        {[['Diagnostics','#ef4444'],['Treatment','#3b82f6'],['Prevention','#10b981'],['Recovery','#f59e0b']].map(([cat,color])=>(
          <div key={cat} className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full" style={{background:color+'18',color}}>
            <div className="w-2 h-2 rounded-full" style={{background:color}}/>{cat}
          </div>
        ))}
      </div>
    </div>
  );
};
