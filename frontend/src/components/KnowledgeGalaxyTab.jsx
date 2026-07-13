import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Lightbulb, Star, Search, Play, RefreshCw } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)';

const CATEGORIES = ['All','Nutrition','Health','Training','Grooming','Emergency','Breed Care'];

const ARTICLES = [
  { id:1, title:'10 Signs Your Dog is Dehydrated',      cat:'Health',    icon:'💧', read:'5 min', level:'Beginner', rating:4.9, type:'article' },
  { id:2, title:'Golden Retriever Care Guide',           cat:'Breed Care', icon:'🐕', read:'8 min', level:'Beginner', rating:4.8, type:'article' },
  { id:3, title:'How to Read Pet Body Language',        cat:'Training',   icon:'🧠', read:'6 min', level:'Intermediate', rating:4.7, type:'video' },
  { id:4, title:'Raw vs Kibble: The Science',            cat:'Nutrition',  icon:'🍗', read:'10 min',level:'Intermediate', rating:4.6, type:'article' },
  { id:5, title:'First Aid for Pets at Home',            cat:'Emergency',  icon:'🚨', read:'7 min', level:'Advanced', rating:4.9, type:'video' },
  { id:6, title:'Bathing & Grooming Best Practices',    cat:'Grooming',   icon:'✂️', read:'4 min', level:'Beginner', rating:4.5, type:'article' },
  { id:7, title:'Understanding Feline Stress Signals',  cat:'Health',    icon:'😾', read:'5 min', level:'Intermediate', rating:4.7, type:'article' },
  { id:8, title:'Senior Pet Nutrition Guide',            cat:'Nutrition',  icon:'🍽️', read:'9 min', level:'Advanced', rating:4.8, type:'article' },
];

const LIVESTREAMS = [
  { title:'LIVE: Dr. Sharma — Monsoon Pet Care Q&A', time:'Starting Now', viewers:234, color:'#ef4444' },
  { title:'LIVE: Puppy Training Masterclass',         time:'In 30 min',   viewers:189, color:'#f97316' },
  { title:'LIVE: AI Vet Diagnosis Session',           time:'In 2 hours',  viewers:312, color:'#8b5cf6' },
];

export default function KnowledgeGalaxyTab() {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');

  const visible = ARTICLES.filter(a =>
    (cat==='All' || a.cat===cat) &&
    (search==='' || a.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:GRAD}}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">🌌</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌌 Knowledge Galaxy</span>
        <h2 className="text-2xl font-black mt-2">AI-Powered Knowledge Galaxy</h2>
        <p className="text-purple-100 text-sm mt-1">Tutorials, health tips, live streams, and community learning — all in one intelligent hub.</p>
        <div className="flex gap-6 mt-4">
          {[['Articles',ARTICLES.length],['Livestreams',LIVESTREAMS.length],['Categories',CATEGORIES.length-1],['Community','12.4K']].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-purple-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Live streams */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">📡 Live Now</p>
        <div className="space-y-3">
          {LIVESTREAMS.map((ls,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 transition cursor-pointer group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 animate-pulse" style={{background:ls.color}}>
                LIVE
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition truncate">{ls.title}</p>
                <p className="text-xs text-slate-400">{ls.time} · 👁 {ls.viewers} watching</p>
              </div>
              <Play className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition flex-shrink-0"/>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search articles, tutorials..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-300 outline-none"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${cat===c?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
              style={cat===c?{background:GRAD}:{}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map((a,i)=>(
          <motion.div key={a.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-indigo-200 hover:shadow-md transition cursor-pointer group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-slate-800 text-sm group-hover:text-indigo-600 transition leading-snug">{a.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{a.cat}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full">{a.level}</span>
                  <span className="text-[10px] text-slate-400">{a.read} read</span>
                  {a.type==='video' && <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-500 rounded-full">▶ Video</span>}
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400"/>
                  <span className="text-xs font-bold text-slate-600">{a.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {visible.length===0 && (
          <div className="col-span-2 text-center py-8 text-slate-400">No results found for "<strong>{search}</strong>"</div>
        )}
      </div>
    </div>
  );
}
