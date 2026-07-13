import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, PawPrint } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#10b981,#06b6d4,#6366f1)';

const NODES = [
  { id:'pet',   label:'Bruno', type:'pet',       x:50, y:50, emoji:'🐕', color:'#6366f1', size:56 },
  { id:'owner', label:'You',   type:'owner',     x:25, y:25, emoji:'👤', color:'#10b981', size:44 },
  { id:'vet',   label:'Dr. Raj', type:'vet',     x:75, y:25, emoji:'👨‍⚕️', color:'#14b8a6', size:40 },
  { id:'luna',  label:'Luna',  type:'pet',       x:80, y:65, emoji:'🐱', color:'#a855f7', size:36 },
  { id:'friend',label:'Priya', type:'owner',     x:15, y:65, emoji:'👤', color:'#f59e0b', size:36 },
  { id:'clinic',label:'Clinic',type:'location',  x:50, y:80, emoji:'🏥', color:'#ef4444', size:36 },
  { id:'park',  label:'Park',  type:'location',  x:25, y:80, emoji:'🌳', color:'#10b981', size:32 },
];
const EDGES = [
  { from:'pet',from_x:50,from_y:50, to_x:25, to_y:25, label:'Owner Bond', color:'#10b981', strength:95 },
  { from:'pet',from_x:50,from_y:50, to_x:75, to_y:25, label:'Vet Trust',   color:'#14b8a6', strength:82 },
  { from:'pet',from_x:50,from_y:50, to_x:80, to_y:65, label:'Pet Friend',  color:'#a855f7', strength:70 },
  { from:'pet',from_x:50,from_y:50, to_x:50, to_y:80, label:'Clinic',      color:'#ef4444', strength:78 },
  { from:'pet',from_x:50,from_y:50, to_x:25, to_y:80, label:'Park',        color:'#10b981', strength:90 },
  { from:'owner',from_x:25,from_y:25,to_x:15, to_y:65, label:'Friend', color:'#f59e0b', strength:65 },
];

const TYPE_COLORS = { pet:'bg-indigo-100 text-indigo-700', owner:'bg-emerald-100 text-emerald-700', vet:'bg-teal-100 text-teal-700', location:'bg-slate-100 text-slate-600' };

export default function RelationshipMapTab() {
  const [selected, setSelected] = useState(null);
  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';
  const sel = NODES.find(n => n.id === selected);

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[130px]">🌐</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌐 Social Analytics</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Relationship Map</h2>
        <p className="text-emerald-100 text-sm mt-1">Visualize {petName}'s relationships with owners, vets, pet friends, and community members.</p>
        <div className="flex gap-6 mt-4">
          {[['Connections', EDGES.length],['Avg Bond', '80%'],['Strongest', 'You 95%'],['Pet Friends', '1']].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-emerald-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* SVG map */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="font-extrabold text-slate-800 mb-3">🗺 Relationship Network</p>
        <div className="relative w-full" style={{ paddingTop: '65%' }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {EDGES.map((e, i) => (
              <g key={i}>
                <motion.line x1={e.from_x} y1={e.from_y} x2={e.to_x} y2={e.to_y}
                  stroke={e.color} strokeWidth="0.8" strokeOpacity={0.4} strokeDasharray="2,1"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.1, duration: 0.8 }} />
                <text x={(e.from_x + e.to_x) / 2} y={(e.from_y + e.to_y) / 2 - 0.5}
                  fontSize="2.2" fill={e.color} textAnchor="middle" fontWeight="bold">{e.strength}%</text>
              </g>
            ))}
            {/* Nodes */}
            {NODES.map((n, i) => (
              <g key={n.id} onClick={() => setSelected(n.id === selected ? null : n.id)} style={{ cursor: 'pointer' }}>
                <motion.circle cx={n.x} cy={n.y} r={n.size / 14}
                  fill={n.color + '22'} stroke={selected === n.id ? n.color : n.color + '55'} strokeWidth={selected === n.id ? 1.2 : 0.6}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.2 }} />
                <text x={n.x} y={n.y + 0.6} fontSize="5" textAnchor="middle">{n.emoji}</text>
                <text x={n.x} y={n.y + n.size / 14 + 3} fontSize="2.2" fill="#64748b" textAnchor="middle" fontWeight="600">{n.label}</text>
              </g>
            ))}
          </svg>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">Tap any node to see connection details</p>
      </div>

      {/* Selected node detail */}
      {sel && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{sel.emoji}</span>
            <div>
              <p className="font-extrabold text-slate-800">{sel.label}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[sel.type]}`}>{sel.type}</span>
            </div>
          </div>
          <div className="space-y-2">
            {EDGES.filter(e => e.from === sel.id || e.from === 'pet').map((e, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 w-24 flex-shrink-0">{e.label}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${e.strength}%`, background: e.color }} />
                </div>
                <span className="text-xs font-extrabold text-slate-700">{e.strength}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="font-extrabold text-slate-800 mb-2 text-sm">Legend</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_COLORS).map(([k, cl]) => (
            <span key={k} className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${cl}`}>{k}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
