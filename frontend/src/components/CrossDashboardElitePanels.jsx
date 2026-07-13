import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Activity, Brain, Zap, Star, Clock, Shield,
  RefreshCw, TrendingUp, Heart, Layers, Sparkles } from 'lucide-react';

/* ─── Shared DB read helper ─────────────────────────────────────────────────── */
const lsGet = (key, fallback=[]) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
};

/* ─── 1. UniversalExperienceDNAPanel ────────────────────────────────────────── */
export const UniversalExperienceDNAPanel = () => {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),60);return()=>clearInterval(t);},[]);
  const appts=lsGet('ownerAppts');
  const rxs=lsGet('allPrescriptions');
  const records=lsGet('medicalRecords');
  const total=appts.length+rxs.length+records.length;
  const level=Math.min(10,Math.floor(total/3)+1);
  const TYPES=['Appointment','Prescription','Medical Record','Walk','Review','Order'];
  const PAIRS=Math.min(total+6,18);
  const sinWave=(x,a,f,p)=>a*Math.sin(f*x+p);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-xl border border-indigo-200" style={{background:'linear-gradient(135deg,#ede9fe,#dbeafe,#ede9fe)'}}>
        <div className="p-6">
          <p className="font-extrabold text-indigo-900 text-lg mb-0.5">🧬 Universal Experience DNA</p>
          <p className="text-indigo-500 text-xs mb-5">Your pet journey evolves with every interaction — live data from {total} events</p>
          <svg viewBox="0 0 580 180" className="w-full" style={{overflow:'visible'}}>
            {Array.from({length:PAIRS},(_,i)=>{
              const x=i*(580/(PAIRS-1));
              const y1=90+sinWave(i,65,0.55,tick*0.04);
              const y2=90-sinWave(i,65,0.55,tick*0.04);
              const color=['#6366f1','#14b8a6','#10b981','#f59e0b','#ec4899','#3b82f6'][i%6];
              return(
                <g key={i}>
                  <line x1={x} y1={y1} x2={x} y2={y2} stroke={`${color}66`} strokeWidth="2"/>
                  <circle cx={x} cy={y1} r="5" fill={color} opacity="0.9"/>
                  <circle cx={x} cy={y2} r="5" fill={color} opacity="0.9"/>
                </g>
              );
            })}
            {[true,false].map((upper,si)=>(
              <polyline key={si}
                points={Array.from({length:PAIRS},(_,i)=>{
                  const x=i*(580/(PAIRS-1));
                  const y=90+(upper?1:-1)*sinWave(i,65,0.55,tick*0.04);
                  return`${x},${y}`;
                }).join(' ')}
                fill="none" stroke={upper?'#6366f1':'#ec4899'} strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            ))}
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[['Evolution Level',`Lv.${level}`,'#6366f1'],['Interactions Logged',total,'#14b8a6'],['Experience Score',`${Math.min(99,total*4+50)}%`,'#10b981']].map(([l,v,c])=>(
          <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
            <p className="text-3xl font-extrabold" style={{color:c}}>{v}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── 2. DigitalEmotionStreamPanel ──────────────────────────────────────────── */
export const DigitalEmotionStreamPanel = () => {
  const reviews=lsGet('vetReviews');
  const journals=lsGet('petJournals');
  const [stream,setStream]=useState([]);
  useEffect(()=>{
    const items=[
      ...reviews.map(r=>({id:`r${r.id}`,type:'Review',text:r.comment||'Great experience!',emotion:r.rating>=4?'😊':'😐',color:'#10b981',user:r.owner||'Owner',time:r.date||'Today'})),
      ...journals.map(j=>({id:`j${j.id}`,type:'Journal',text:j.entry||'Active day!',emotion:j.mood==='Happy'?'😊':j.mood==='Calm'?'😌':'😢',color:'#6366f1',user:j.pet||'Pet',time:j.date||'Today'})),
      {id:'live1',type:'Mood Check',text:'Bruno completed AI mood assessment — result: Happy',emotion:'🐾',color:'#f59e0b',user:'Bruno',time:'Just now'},
      {id:'live2',type:'Appointment',text:'Vaccination completed successfully for Luna',emotion:'💉',color:'#14b8a6',user:'Luna',time:'2 min ago'},
      {id:'live3',type:'Walk',text:'30-minute park walk completed. Energy high!',emotion:'🚶',color:'#ec4899',user:'Bruno',time:'5 min ago'},
    ];
    setStream(items.slice(0,10));
    const t=setInterval(()=>setStream(s=>{
      const newItem={id:`live${Date.now()}`,type:['Review','Walk','Mood','Appointment'][Math.floor(Math.random()*4)],
        text:['Feeling great today!','Excellent visit','Happy paws!','Energy boost logged','Recovery on track'][Math.floor(Math.random()*5)],
        emotion:['😊','🐾','💊','🎾','❤️'][Math.floor(Math.random()*5)],
        color:['#10b981','#6366f1','#f59e0b','#14b8a6','#ec4899'][Math.floor(Math.random()*5)],
        user:['Bruno','Luna','Max','Bella'][Math.floor(Math.random()*4)],
        time:'Just now'};
      return[newItem,...s.slice(0,9)];
    }),3000);
    return()=>clearInterval(t);
  },[]);
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6" style={{maxHeight:500,overflowY:'auto'}}>
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-3 border-b border-slate-100">
          <div><p className="font-extrabold text-slate-800">💬 Realtime Digital Emotion Stream</p><p className="text-xs text-slate-400">Live emotional analytics from all dashboards</p></div>
          <motion.span className="w-2 h-2 rounded-full bg-green-500" animate={{opacity:[1,0,1]}} transition={{repeat:Infinity,duration:1}}/>
        </div>
        <AnimatePresence>
          {stream.map((item,i)=>(
            <motion.div key={item.id} layout initial={{opacity:0,y:-20,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,scale:0.9}}
              className="flex items-start gap-3 p-3 mb-2 rounded-xl border border-slate-50 bg-slate-50">
              <span className="text-2xl flex-shrink-0">{item.emotion}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full" style={{background:`${item.color}18`,color:item.color}}>{item.type}</span>
                  <span className="text-xs text-slate-400">{item.user} · {item.time}</span>
                </div>
                <p className="text-sm text-slate-700 font-semibold truncate">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─── 3. AIBehaviorWavesPanel ───────────────────────────────────────────────── */
export const AIBehaviorWavesPanel = () => {
  const walks=lsGet('petWalks');
  const appts=lsGet('ownerAppts');
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),50);return()=>clearInterval(t);},[]);
  const WAVES=[
    {label:'Activity',amp:45,freq:0.5,phase:0,color:'#10b981',data:walks.length},
    {label:'Feeding',amp:35,freq:0.7,phase:1,color:'#f59e0b',data:8},
    {label:'Sleep',amp:55,freq:0.3,phase:2,color:'#6366f1',data:7},
    {label:'Social',amp:30,freq:0.9,phase:0.5,color:'#ec4899',data:appts.length},
    {label:'Health',amp:40,freq:0.4,phase:1.5,color:'#14b8a6',data:lsGet('medicalRecords').length},
  ];
  const W=580,pts=(amp,freq,phase)=>Array.from({length:61},(_,i)=>{const x=i*(W/60);const y=110+Math.sin(i*freq*0.18+tick*0.04+phase)*amp;return`${x},${y}`;}).join(' ');
  const syncScore=Math.round((walks.length+appts.length+lsGet('medicalRecords').length)/3*15+60);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div><p className="font-extrabold text-slate-800">〜 AI Behavior Waves</p><p className="text-xs text-slate-400">Multi-layer behavioral synchronization</p></div>
          <div className="text-right"><p className="text-2xl font-extrabold text-teal-600">{Math.min(syncScore,98)}%</p><p className="text-xs text-slate-400">Sync Score</p></div>
        </div>
        <svg viewBox={`0 0 ${W} 220`} className="w-full rounded-xl overflow-hidden" style={{background:'linear-gradient(180deg,#f8fafc,#ffffff)'}}>
          {WAVES.map((w,i)=>(
            <polyline key={i} points={pts(w.amp,w.freq,w.phase)}
              fill="none" stroke={w.color} strokeWidth="2" opacity={0.5+i*0.1} strokeLinecap="round"/>
          ))}
          {/* Combined */}
          <polyline points={Array.from({length:61},(_,i)=>{
            const x=i*(W/60);
            const y=110+WAVES.reduce((a,w)=>a+Math.sin(i*w.freq*0.18+tick*0.04+w.phase)*w.amp/5,0);
            return`${x},${y}`;
          }).join(' ')} fill="none" stroke="#1e293b" strokeWidth="3" opacity="0.8" strokeLinecap="round"/>
        </svg>
        <div className="flex gap-3 flex-wrap mt-3">
          {WAVES.map((w,i)=>(
            <div key={i} className="flex items-center gap-2 text-xs font-bold">
              <div className="w-6 h-1.5 rounded-full" style={{background:w.color}}/>
              <span className="text-slate-600">{w.label}</span>
              <span className="font-extrabold" style={{color:w.color}}>{w.data}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 4. GlobalWellnessNetworkPanel ─────────────────────────────────────────── */
export const GlobalWellnessNetworkPanel = () => {
  const records=lsGet('medicalRecords');
  const rxs=lsGet('allPrescriptions');
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),800);return()=>clearInterval(t);},[]);
  const REGIONS=[
    {name:'North India',x:200,y:60,score:88,active:12},
    {name:'South India',x:200,y:160,score:92,active:18},
    {name:'West India',x:100,y:110,score:79,active:9},
    {name:'East India',x:300,y:110,score:85,active:14},
    {name:'Central',x:200,y:110,score:91,active:22},
  ];
  const wellnessIdx=Math.round(REGIONS.reduce((a,r)=>a+r.score,0)/REGIONS.length);
  const getColor=s=>s>=90?'#10b981':s>=80?'#14b8a6':s>=70?'#f59e0b':'#ef4444';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div><p className="font-extrabold text-slate-800">🌏 Global Wellness Network</p><p className="text-xs text-slate-400">Worldwide intelligent wellness synchronization · {records.length+rxs.length} records indexed</p></div>
          <div className="text-right"><p className="text-2xl font-extrabold text-teal-600">{wellnessIdx}</p><p className="text-xs text-slate-400">Wellness Index</p></div>
        </div>
        <div className="flex justify-center">
          <svg viewBox="0 0 400 240" className="w-full max-w-md">
            {/* Propagation rings */}
            {REGIONS.map((r,i)=>(
              <motion.circle key={i} cx={r.x} cy={r.y} r="10" fill={getColor(r.score)} opacity="0.15"
                animate={{r:[12,30,12],opacity:[0.2,0,0.2]}}
                transition={{repeat:Infinity,duration:2.5,delay:i*0.5}}/>
            ))}
            {/* Connection lines */}
            {REGIONS.slice(0,4).map((r,i)=>(
              <line key={i} x1={r.x} y1={r.y} x2={REGIONS[4].x} y2={REGIONS[4].y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3"/>
            ))}
            {/* Region nodes */}
            {REGIONS.map((r,i)=>(
              <g key={i}>
                <motion.circle cx={r.x} cy={r.y} r="18" fill={getColor(r.score)} opacity="0.2"
                  animate={{r:[16,22,16]}} transition={{repeat:Infinity,duration:2,delay:i*0.3}}/>
                <circle cx={r.x} cy={r.y} r="18" fill={getColor(r.score)} opacity="0.8"/>
                <text x={r.x} y={r.y+4} textAnchor="middle" fill="white" fontSize="10" fontWeight="900">{r.score}</text>
                <text x={r.x} y={r.y+30} textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">{r.name}</text>
                <text x={r.x} y={r.y+40} textAnchor="middle" fill="#94a3b8" fontSize="7">●{r.active} active</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ─── 5. AIInsightNebulaPanel ───────────────────────────────────────────────── */
export const AIInsightNebulaPanel = () => {
  const canvasRef=useRef(null);
  const [selected,setSelected]=useState(null);
  const CLUSTERS=[
    {x:200,y:150,r:70,color:'#6366f1',label:'Health AI',insights:['Vaccination patterns predict immunity gaps','Sleep quality inversely correlates with stress','Breed-specific diet improves energy by 23%']},
    {x:380,y:100,r:55,color:'#14b8a6',label:'Revenue',insights:['Subscription bundles convert 3x better','Premium users have 40% lower churn','Seasonal demand peaks in winter']},
    {x:100,y:260,r:60,color:'#ec4899',label:'Emotions',insights:['Play time correlates with happiness score','Owner presence reduces anxiety by 67%','Routine consistency boosts mood stability']},
    {x:420,y:250,r:50,color:'#f59e0b',label:'Wellness',insights:['Hydration tracking improves outcomes by 18%','Exercise streak length predicts health score','Weight monitoring catches illness early']},
  ];
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext('2d');
    let frame=0;
    const PARTICLES=CLUSTERS.flatMap(cl=>Array.from({length:80},()=>({
      x:cl.x+(Math.random()-0.5)*cl.r*2,y:cl.y+(Math.random()-0.5)*cl.r*2,
      vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,
      r:Math.random()*2+0.5,color:cl.color,cluster:cl,
    })));
    let animId;
    const draw=()=>{
      ctx.clearRect(0,0,580,320);
      ctx.fillStyle='#0f0c29';ctx.fillRect(0,0,580,320);
      CLUSTERS.forEach(cl=>{
        const grd=ctx.createRadialGradient(cl.x,cl.y,0,cl.x,cl.y,cl.r);
        grd.addColorStop(0,`${cl.color}33`);grd.addColorStop(1,'transparent');
        ctx.fillStyle=grd;ctx.beginPath();ctx.arc(cl.x,cl.y,cl.r,0,Math.PI*2);ctx.fill();
      });
      PARTICLES.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;
        const cl=p.cluster;
        if(Math.abs(p.x-cl.x)>cl.r){p.vx*=-1;}
        if(Math.abs(p.y-cl.y)>cl.r){p.vy*=-1;}
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.color+'cc';ctx.fill();
      });
      CLUSTERS.forEach(cl=>{
        ctx.font='bold 11px sans-serif';ctx.fillStyle='white';ctx.textAlign='center';
        ctx.fillText(cl.label,cl.x,cl.y+cl.r+16);
      });
      frame++;
      animId=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(animId);
  },[]);
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/10" style={{background:'#0f0c29'}}>
          <p className="font-extrabold text-white">🌌 AI Insight Nebula</p>
          <p className="text-purple-300 text-xs mt-0.5">Click a nebula cluster to explore insights</p>
        </div>
        <div className="relative">
          <canvas ref={canvasRef} width="580" height="320" className="w-full" onClick={e=>{
            const rect=e.currentTarget.getBoundingClientRect();
            const sx=580/rect.width,sy=320/rect.height;
            const mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
            const hit=CLUSTERS.find(cl=>Math.sqrt((mx-cl.x)**2+(my-cl.y)**2)<cl.r);
            setSelected(hit||null);
          }}/>
        </div>
      </div>
      <AnimatePresence>
        {selected&&(
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="font-extrabold text-slate-800 mb-2">✨ {selected.label} Insights</p>
            {selected.insights.map((ins,i)=>(
              <div key={i} className="flex items-start gap-2 mb-1.5">
                <span className="text-indigo-500 font-bold text-sm mt-0.5">→</span>
                <p className="text-sm text-slate-600">{ins}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── 6. ExperienceResonanceEnginePanel ─────────────────────────────────────── */
export const ExperienceResonanceEnginePanel = () => {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),40);return()=>clearInterval(t);},[]);
  const DASHBOARDS=[{label:'Owner',color:'#6366f1',r:40},{label:'Vet',color:'#14b8a6',r:75},{label:'Admin',color:'#f59e0b',r:110}];
  const harmonyScore=92;
  const lastSync=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div><p className="font-extrabold text-slate-800">🔊 Experience Resonance Engine</p><p className="text-xs text-slate-400">Cross-dashboard synchronization harmony · Last sync: {lastSync}</p></div>
          <div className="text-right"><p className="text-2xl font-extrabold text-teal-600">{harmonyScore}%</p><p className="text-xs text-slate-400">Harmony Score</p></div>
        </div>
        <div className="flex justify-center">
          <svg viewBox="0 0 300 300" width="300" height="300">
            {DASHBOARDS.map((d,i)=>(
              <g key={i}>
                {[1,1.4,1.8].map((scale,si)=>(
                  <motion.circle key={si} cx="150" cy="150" r={d.r*scale} fill="none" stroke={d.color} strokeWidth="1.5" opacity="0.3"
                    animate={{r:[d.r*scale,d.r*scale+10,d.r*scale],opacity:[0.2,0.05,0.2]}}
                    transition={{repeat:Infinity,duration:2.5,delay:si*0.5+i*0.3}}/>
                ))}
                <motion.circle cx="150" cy="150" r={d.r} fill="none" stroke={d.color} strokeWidth="2.5"
                  animate={{strokeDasharray:[`${2*Math.PI*d.r*0.6} ${2*Math.PI*d.r*0.4}`,`${2*Math.PI*d.r} 0`],strokeDashoffset:[0,-2*Math.PI*d.r]}}
                  transition={{repeat:Infinity,duration:3+i,ease:'linear'}}/>
                <text x={150+d.r+10} y="152" fill={d.color} fontSize="10" fontWeight="bold">{d.label}</text>
              </g>
            ))}
            <motion.circle cx="150" cy="150" r="22" fill="#6366f1" opacity="0.2"
              animate={{r:[20,26,20]}} transition={{repeat:Infinity,duration:1.5}}/>
            <circle cx="150" cy="150" r="22" fill="white" stroke="#6366f1" strokeWidth="2"/>
            <text x="150" y="146" textAnchor="middle" fill="#4f46e5" fontSize="10" fontWeight="900">{harmonyScore}</text>
            <text x="150" y="160" textAnchor="middle" fill="#94a3b8" fontSize="7">SYNC</text>
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[['Sync Freq','12/min'],['Data Points','1.4K'],['Latency','< 50ms']].map(([l,v])=>(
            <div key={l} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <p className="font-extrabold text-slate-800 text-lg">{v}</p>
              <p className="text-xs text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 7. RealtimeActivityCosmosPanel ────────────────────────────────────────── */
export const RealtimeActivityCosmosPanel = () => {
  const canvasRef=useRef(null);
  const feed=lsGet('globalFeed');
  const [eventCount,setEventCount]=useState(feed.length+24);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext('2d');
    const W=580,H=300;
    const STARS=[...Array(120)].map(()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5,alpha:Math.random()}));
    const METEORS=[];let frame=0,animId;
    const draw=()=>{
      ctx.fillStyle='#050510';ctx.fillRect(0,0,W,H);
      // Stars
      STARS.forEach(s=>{s.alpha=0.3+Math.sin(frame*0.02+s.x)*0.4;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${s.alpha})`;ctx.fill();});
      // Nebulas
      [['#6366f133',180,120,80],['#14b8a633',400,180,60],['#ec489933',100,230,50]].forEach(([c,x,y,r])=>{
        const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'transparent');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      });
      // Meteors
      if(frame%40===0){METEORS.push({x:Math.random()*W,y:0,vx:(Math.random()-0.5)*3,vy:2+Math.random()*4,life:60,color:['#6366f1','#14b8a6','#f59e0b'][Math.floor(Math.random()*3)]});}
      METEORS.forEach((m,i)=>{m.x+=m.vx;m.y+=m.vy;m.life--;ctx.beginPath();ctx.strokeStyle=`${m.color}${Math.round(m.life/60*255).toString(16).padStart(2,'0')}`;ctx.lineWidth=2;ctx.moveTo(m.x,m.y);ctx.lineTo(m.x-m.vx*8,m.y-m.vy*8);ctx.stroke();});
      METEORS.splice(0,METEORS.filter(m=>m.life<=0).length);
      frame++;animId=requestAnimationFrame(draw);
    };
    draw();
    const tick=setInterval(()=>setEventCount(v=>v+Math.round(Math.random()*3)+1),3000);
    return()=>{cancelAnimationFrame(animId);clearInterval(tick);};
  },[]);
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10" style={{background:'#050510'}}>
          <div><p className="font-extrabold text-white">🌌 Realtime Activity Cosmos</p><p className="text-indigo-300 text-xs mt-0.5">Every interaction is a shooting star in the PetCare universe</p></div>
          <motion.div className="text-right" animate={{opacity:[1,0.7,1]}} transition={{repeat:Infinity,duration:2}}>
            <p className="text-xl font-extrabold text-teal-400">{eventCount}</p>
            <p className="text-xs text-slate-400">● Live Events</p>
          </motion.div>
        </div>
        <canvas ref={canvasRef} width="580" height="300" className="w-full"/>
      </div>
    </div>
  );
};

/* ─── 8. PetcareSyncFieldPanel ──────────────────────────────────────────────── */
export const PetcareSyncFieldPanel = () => {
  const KEYS=['ownerAppts','allPrescriptions','medicalRecords','ownerPets','petWalks','ownerOrders','vetReviews','globalFeed','notifications','supportTickets','auditLogs','platformEmergencies','pendingVets'];
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),500);return()=>clearInterval(t);},[]);
  const getSize=key=>{try{const v=localStorage.getItem(key)||'[]';return`${(v.length/1024).toFixed(1)}KB`;}catch{return'0B';}};
  const getCount=key=>{try{return JSON.parse(localStorage.getItem(key)||'[]').length;}catch{return 0;}};
  const [flows,setFlows]=useState([]);
  useEffect(()=>{
    setFlows([...Array(5)].map(()=>({from:Math.floor(Math.random()*KEYS.length),to:Math.floor(Math.random()*KEYS.length),pos:Math.random(),speed:0.01+Math.random()*0.02})));
    const t=setInterval(()=>setFlows(f=>f.map(fl=>({...fl,pos:(fl.pos+fl.speed)%1}))),50);
    return()=>clearInterval(t);
  },[]);
  const COLS=['#6366f1','#14b8a6','#10b981','#f59e0b','#ec4899','#3b82f6','#8b5cf6','#ef4444','#06b6d4','#84cc16','#f97316','#a855f7','#14b8a6'];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <p className="font-extrabold text-slate-800 mb-4">🔗 PetCare Sync Field</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {KEYS.map((key,i)=>{
            const count=getCount(key);
            const size=getSize(key);
            const color=COLS[i];
            return(
              <motion.div key={key} className="flex items-center gap-3 p-3 rounded-xl border" style={{borderColor:`${color}33`,background:`${color}08`}}
                animate={tick%KEYS.length===i?{scale:[1,1.02,1],boxShadow:[`0 0 0 0 ${color}33`,`0 0 8px 2px ${color}44`,`0 0 0 0 ${color}33`]}:{}}
                transition={{duration:0.4}}>
                <motion.div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:color}}
                  animate={tick%KEYS.length===i?{scale:[1,1.5,1]}:{}} transition={{duration:0.4}}/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-slate-700 truncate">{key}</p>
                  <p className="text-[10px] text-slate-400">{count} records · {size}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{background:color}}>{count>0?'✓ Live':'Empty'}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── 9. FutureWellnessOraclePanel ──────────────────────────────────────────── */
export const FutureWellnessOraclePanel = () => {
  const [revealed,setRevealed]=useState([]);
  const PREDICTIONS=[
    {horizon:'6 months',prediction:'Platform wellness index will reach 96% with current trajectory',confidence:87,impact:'High',icon:'🌟'},
    {horizon:'1 year',prediction:'Predictive diagnostics will prevent 34% of emergency cases',confidence:72,impact:'Very High',icon:'🔮'},
    {horizon:'2 years',prediction:'AI personalization will reduce vet visit frequency by 18%',confidence:65,impact:'High',icon:'🧬'},
    {horizon:'3 years',prediction:'Cross-species health data network will cover 50+ breeds',confidence:58,impact:'Transformative',icon:'🌏'},
    {horizon:'5 years',prediction:'Quantum AI will predict illness 90 days before symptoms appear',confidence:41,impact:'Revolutionary',icon:'⚛️'},
  ];
  const [oracleGlow,setOracleGlow]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setOracleGlow(x=>x+1),60);return()=>clearInterval(t);},[]);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-3xl overflow-hidden shadow-xl" style={{background:'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)'}}>
        <div className="p-6 flex flex-col items-center text-center">
          <p className="font-extrabold text-white text-lg mb-1">🔮 AI Future Wellness Oracle</p>
          <p className="text-purple-300 text-xs mb-5">Long-term ecosystem predictions powered by behavioral AI</p>
          {/* Crystal ball */}
          <div className="relative mb-6">
            <svg viewBox="0 0 180 180" width="180" height="180">
              <defs>
                <radialGradient id="crystalGrad" cx="40%" cy="35%">
                  <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.9"/>
                  <stop offset="40%" stopColor="#7c3aed" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#3730a3" stopOpacity="0.9"/>
                </radialGradient>
              </defs>
              <motion.circle cx="90" cy="90" r="70" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.3"
                animate={{r:[70,80,70],opacity:[0.2,0.05,0.2]}} transition={{repeat:Infinity,duration:3}}/>
              <circle cx="90" cy="90" r="65" fill="url(#crystalGrad)"/>
              <motion.circle cx="90" cy="90" r="60" fill="none" stroke="#c4b5fd" strokeWidth="2"
                animate={{rotate:[0,360]}} transition={{repeat:Infinity,duration:8,ease:'linear'}}
                style={{transformOrigin:'90px 90px',strokeDasharray:'15 10'}}/>
              <motion.circle cx="65" cy="65" r="18" fill="white" opacity="0.12"
                animate={{cx:[60,70,60],cy:[60,70,60]}} transition={{repeat:Infinity,duration:4}}/>
              <text x="90" y="86" textAnchor="middle" fill="white" fontSize="20">🔮</text>
              <text x="90" y="108" textAnchor="middle" fill="#ddd6fe" fontSize="9" fontWeight="bold">ORACLE</text>
              {/* Glow */}
              <motion.circle cx="90" cy="90" r="65" fill="none" stroke="#a78bfa" strokeWidth="4" opacity="0.1"
                animate={{opacity:[0.05,0.2,0.05]}} transition={{repeat:Infinity,duration:2}}/>
            </svg>
          </div>
        </div>
        <div className="px-6 pb-6 space-y-3">
          {PREDICTIONS.map((p,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.15}}
              className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer"
              style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)'}}
              onClick={()=>setRevealed(r=>r.includes(i)?r.filter(x=>x!==i):[...r,i])}>
              <span className="text-3xl flex-shrink-0">{p.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-purple-300">{p.horizon}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-200">{p.impact}</span>
                </div>
                <AnimatePresence>
                  {revealed.includes(i)?(
                    <motion.p key="full" initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-white font-semibold">{p.prediction}</motion.p>
                  ):(
                    <motion.p key="hint" className="text-sm text-purple-300 font-semibold">Tap to reveal oracle prediction...</motion.p>
                  )}
                </AnimatePresence>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1 rounded-full bg-purple-900/50">
                    <motion.div className="h-1 rounded-full bg-purple-400" style={{width:`${p.confidence}%`}} initial={{width:0}} animate={{width:`${p.confidence}%`}} transition={{delay:i*0.15+0.3}}/>
                  </div>
                  <span className="text-[10px] text-purple-300 font-bold w-10 text-right">{p.confidence}% conf</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── 10. QuantumIntelligenceSpherePanel ────────────────────────────────────── */
export const QuantumIntelligenceSpherePanel = () => {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),40);return()=>clearInterval(t);},[]);
  const MODULES=[
    {name:'Automation',icon:'⚙️',stat:`${lsGet('ownerAppts').length} auto-scheduled`,color:'#6366f1'},
    {name:'Predictions',icon:'🔮',stat:'94% accuracy',color:'#8b5cf6'},
    {name:'Analytics',icon:'📊',stat:`${lsGet('medicalRecords').length+lsGet('ownerAppts').length} data pts`,color:'#14b8a6'},
    {name:'Emotional AI',icon:'💗',stat:'87% empathy score',color:'#ec4899'},
    {name:'Sync',icon:'🔄',stat:'13 keys synced',color:'#10b981'},
    {name:'Personalization',icon:'✨',stat:'>40 features active',color:'#f59e0b'},
    {name:'Evolution',icon:'🧬',stat:'v4.0 intelligence',color:'#3b82f6'},
  ];
  const cx=240,cy=200,orbitR=140;
  return (
    <div className="space-y-5 max-w-5xl">
      <div className="rounded-3xl overflow-hidden shadow-2xl" style={{background:'radial-gradient(ellipse at 40% 50%,#1e1b4b 0%,#050510 80%)'}}>
        <div className="p-5 border-b border-white/10">
          <p className="font-extrabold text-white text-xl">⚛️ Quantum Ecosystem Intelligence Sphere</p>
          <p className="text-purple-300 text-xs mt-0.5">The apex AI engine — governing all platform intelligence simultaneously</p>
        </div>
        <div className="flex flex-col md:flex-row">
          <svg viewBox="0 0 480 400" style={{minWidth:240,maxWidth:'55%',flex:'0 0 auto'}}>
            {/* Sphere rings (3D illusion via ellipses) */}
            {[{rx:70,ry:15,rot:0},{rx:70,ry:35,rot:30},{rx:70,ry:50,rot:60},{rx:50,ry:70,rot:90}].map((r,i)=>(
              <motion.ellipse key={i} cx={cx} cy={cy} rx={r.rx} ry={r.ry} fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.25"
                animate={{rotate:[r.rot,r.rot+360]}} transition={{repeat:Infinity,duration:8+i*2,ease:'linear'}}
                style={{transformOrigin:`${cx}px ${cy}px`}}/>
            ))}
            {/* Orbiting modules */}
            {MODULES.map((m,i)=>{
              const angle=tick*0.012+i*(Math.PI*2/MODULES.length);
              const px=cx+orbitR*Math.cos(angle);
              const py=cy+orbitR*0.45*Math.sin(angle);
              return(
                <g key={i}>
                  <line x1={cx} y1={cy} x2={px} y2={py} stroke={m.color} strokeWidth="1" opacity="0.2"/>
                  <circle cx={px} cy={py} r="22" fill={m.color} opacity="0.85"/>
                  <circle cx={px} cy={py} r="28" fill={m.color} opacity="0.1"/>
                  <text x={px} y={py+5} textAnchor="middle" fontSize="12">{m.icon}</text>
                </g>
              );
            })}
            {/* Core sphere */}
            <defs>
              <radialGradient id="sphereGrad" cx="35%" cy="35%">
                <stop offset="0%" stopColor="#c4b5fd"/>
                <stop offset="50%" stopColor="#7c3aed"/>
                <stop offset="100%" stopColor="#3730a3"/>
              </radialGradient>
            </defs>
            <motion.circle cx={cx} cy={cy} r="52" fill="url(#sphereGrad)"
              animate={{r:[50,56,50]}} transition={{repeat:Infinity,duration:2}}/>
            <motion.circle cx={cx} cy={cy} r="58" fill="none" stroke="#a78bfa" strokeWidth="2"
              animate={{rotate:[0,360]}} transition={{repeat:Infinity,duration:4,ease:'linear'}}
              style={{transformOrigin:`${cx}px ${cy}px`,strokeDasharray:'8 6'}}/>
            <circle cx={cx-12} cy={cy-12} r="14" fill="white" opacity="0.1"/>
            <text x={cx} y={cy-6} textAnchor="middle" fill="white" fontSize="12" fontWeight="900">QUANTUM</text>
            <text x={cx} y={cy+10} textAnchor="middle" fill="#ddd6fe" fontSize="10">SPHERE</text>
          </svg>
          <div className="flex-1 p-5 space-y-2 overflow-auto">
            <p className="text-xs font-extrabold text-purple-300 uppercase tracking-wider mb-3">Active Subsystems</p>
            {MODULES.map((m,i)=>(
              <motion.div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                style={{background:`${m.color}18`,border:`1px solid ${m.color}33`}}
                initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}>
                <span className="text-xl flex-shrink-0">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-white">{m.name}</p>
                  <p className="text-[10px] truncate" style={{color:m.color}}>{m.stat}</p>
                </div>
                <motion.div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:m.color}}
                  animate={{opacity:[1,0.3,1]}} transition={{repeat:Infinity,duration:1.5,delay:i*0.2}}/>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
