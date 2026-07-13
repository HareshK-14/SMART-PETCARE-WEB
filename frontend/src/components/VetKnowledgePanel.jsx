import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Search, Star, Play, Users, Microscope, RefreshCw } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#14b8a6,#6366f1,#8b5cf6)';

const RESOURCES = [
  { id:1, title:'Advanced Feline Nephrology — Case Studies 2025', cat:'Nephrology', icon:'🧪', read:'12 min', level:'Advanced', rating:4.9, type:'article', author:'Dr. Patel' },
  { id:2, title:'AI-Assisted Diagnosis in Canine Oncology',       cat:'Oncology',   icon:'🔬', read:'15 min', level:'Expert',   rating:4.8, type:'research', author:'Dr. Chen' },
  { id:3, title:'Orthopedic Surgery: Hip Replacement Techniques', cat:'Surgery',    icon:'🦴', read:'20 min', level:'Expert',   rating:4.7, type:'video', author:'Dr. Singh' },
  { id:4, title:'Behavioral Medicine: Anxiety Disorders in Dogs', cat:'Behavior',   icon:'🧠', read:'10 min', level:'Advanced', rating:4.8, type:'article', author:'Dr. Mehta' },
  { id:5, title:'Emergency Toxicology — Common Pet Poisons',      cat:'Emergency',  icon:'🚨', read:'8 min',  level:'Advanced', rating:4.9, type:'article', author:'Dr. Kumar' },
  { id:6, title:'Telemedicine Best Practices for Veterinarians',  cat:'Telehealth', icon:'📱', read:'6 min',  level:'Beginner', rating:4.6, type:'article', author:'Dr. Verma' },
];

const LIVESTREAMS = [
  { title:'LIVE CME: Canine Cardiology Advances 2025',     time:'Now',       attendees:89,  color:'#ef4444' },
  { title:'LIVE: Complex Ortho Surgery — Watch & Learn',   time:'In 45 min', attendees:134, color:'#6366f1' },
  { title:'LIVE: Veterinary AI Tools Workshop',            time:'Tomorrow',  attendees:256, color:'#14b8a6' },
];

const CASES = [
  { id:'CASE-01', pet:'Bruno', breed:'Lab', issue:'Recurring Pancreatitis', status:'open', responses:3, urgency:'high' },
  { id:'CASE-02', pet:'Luna',  breed:'Persian', issue:'Unexplained weight loss', status:'open', responses:1, urgency:'medium' },
  { id:'CASE-03', pet:'Max',   breed:'GSD', issue:'Post-op wound infection', status:'resolved', responses:5, urgency:'low' },
];

const CATS = ['All','Surgery','Nephrology','Oncology','Behavior','Emergency','Telehealth'];

export default function VetKnowledgePanel() {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const visible = RESOURCES.filter(r=>(cat==='All'||r.cat===cat)&&(search===''||r.title.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">🌌</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌌 Vet Knowledge Galaxy</span>
        <h2 className="text-2xl font-black mt-2">Veterinary Knowledge Galaxy</h2>
        <p className="text-teal-100 text-sm mt-1">AI-curated research hub — clinical articles, CME live streams, treatment guides, and peer case discussions.</p>
        <div className="flex gap-6 mt-4">
          {[['Articles',RESOURCES.length],['Live CME',LIVESTREAMS.length],['Open Cases',CASES.filter(c=>c.status==='open').length],['Specialists','38']].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-teal-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Live CME */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">📡 Live CME Sessions</p>
        <div className="space-y-3">
          {LIVESTREAMS.map((ls,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-teal-200 transition cursor-pointer group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{background:ls.color}}>
                {ls.time==='Now'?<span className="animate-pulse">LIVE</span>:'CME'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm group-hover:text-teal-600 transition truncate">{ls.title}</p>
                <p className="text-xs text-slate-400">{ls.time} · 👨‍⚕️ {ls.attendees} vets attending</p>
              </div>
              <Play className="w-5 h-5 text-slate-300 group-hover:text-teal-500 flex-shrink-0"/>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Peer case discussions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">💬 Peer Case Discussions</p>
        <div className="space-y-3">
          {CASES.map((c,i)=>(
            <motion.div key={c.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition cursor-pointer">
              <Microscope className="w-5 h-5 text-indigo-500 flex-shrink-0"/>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm">{c.pet} ({c.breed}) — {c.issue}</p>
                <p className="text-xs text-slate-400">{c.id} · {c.responses} responses</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${c.urgency==='high'?'bg-rose-100 text-rose-700':c.urgency==='medium'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{c.urgency}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${c.status==='open'?'bg-indigo-100 text-indigo-700':'bg-slate-100 text-slate-500'}`}>{c.status}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clinical articles, research..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-300 outline-none"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${cat===c?'text-white border-transparent':'bg-white border-slate-200 text-slate-600'}`}
              style={cat===c?{background:GRAD}:{}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map((a,i)=>(
          <motion.div key={a.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-teal-200 transition cursor-pointer group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{a.icon}</span>
              <div className="flex-1">
                <p className="font-extrabold text-slate-800 text-sm group-hover:text-teal-600 transition leading-snug">{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">By {a.author}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full">{a.cat}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full">{a.level}</span>
                  <span className="text-[10px] text-slate-400">{a.read} read</span>
                  {a.type==='video'&&<span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-500 rounded-full">▶ Video</span>}
                  {a.type==='research'&&<span className="text-[10px] font-bold px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full">📄 Research</span>}
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400"/>
                  <span className="text-xs font-bold text-slate-600">{a.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
