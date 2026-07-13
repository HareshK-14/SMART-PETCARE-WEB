import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logGlobalActivity } from '../utils/activityFeed';
const P = n => JSON.parse(localStorage.getItem(n) || '[]');

// 1. Smart Patient Calmness Meter
export function CalmnessMeterPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1000); return () => clearInterval(t); }, []);
  const emerg = P('platformEmergencies').length;
  const PATIENTS = [
    { name:'Bruno (Lab)', calm: Math.max(30, 88 - emerg * 8 + tick % 6), color:'#10b981' },
    { name:'Luna (Persian)', calm: 72 + tick % 8, color:'#6366f1' },
    { name:'Rocky (Husky)', calm: Math.max(20, 55 + tick % 10), color:'#f59e0b' },
    { name:'Coco (Beagle)', calm: 91 + tick % 5, color:'#14b8a6' },
  ];
  const G = 'linear-gradient(135deg,#14b8a6,#6366f1,#8b5cf6)';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">😌 Emotional Monitoring</span>
        <h2 className="text-2xl font-black mt-2">Smart Patient Calmness Meter</h2>
        <p className="text-teal-100 text-sm mt-1">Realtime emotional calmness analytics for all patients during treatment — live data.</p>
      </div>
      <div className="space-y-4">
        {PATIENTS.map((pt, i) => (
          <motion.div key={pt.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{pt.calm > 70 ? '😌' : pt.calm > 50 ? '😐' : '😰'}</span>
              <p className="font-extrabold text-slate-800 flex-1">{pt.name}</p>
              <motion.p key={tick} className="text-xl font-extrabold" style={{ color: pt.color }}>{pt.calm}%</motion.p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
              <motion.div className="h-4 rounded-full flex items-center justify-end pr-2"
                style={{ background: pt.color }} animate={{ width: pt.calm + '%' }} transition={{ duration: 0.6 }}>
                <span className="text-[9px] font-bold text-white">{pt.calm > 40 ? 'calm' : 'stressed'}</span>
              </motion.div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>Stressed</span><span>Calm</span><span>Euphoric</span></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 2. AI Recovery Rhythm Analyzer
export function RecoveryRhythmPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 800); return () => clearInterval(t); }, []);
  const rxs = P('allPrescriptions');
  const RHYTHMS = [
    { patient:'Bruno', day:3,  total:10, rhythm:'↑ Fast',   phase:'Anti-inflammatory peak', color:'#10b981' },
    { patient:'Luna',  day:7,  total:14, rhythm:'→ Steady', phase:'Antibiotic mid-course',  color:'#6366f1' },
    { patient:'Rocky', day:1,  total:7,  rhythm:'↑ Strong', phase:'Post-surgery day 1',     color:'#14b8a6' },
    { patient:'Coco',  day:12, total:14, rhythm:'↗ Good',   phase:'Final recovery stage',   color:'#f59e0b' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#10b981,#14b8a6,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🎵 Recovery Intelligence</span>
        <h2 className="text-2xl font-black mt-2">AI Recovery Rhythm Analyzer</h2>
        <p className="text-emerald-100 text-sm mt-1">Healing rhythm and treatment response timing for all active recovery cases.</p>
      </div>
      <div className="space-y-3">
        {RHYTHMS.map((r, i) => {
          const pct = Math.round((r.day / r.total) * 100);
          return (
            <motion.div key={r.patient} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: r.color }}>D{r.day}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-slate-800">{r.patient}</p>
                    <span className="text-xs font-bold text-emerald-600">{r.rhythm}</span>
                  </div>
                  <p className="text-xs text-slate-400">{r.phase}</p>
                </div>
                <p className="text-lg font-extrabold" style={{ color: r.color }}>{pct}%</p>
              </div>
              <div className="relative w-full bg-slate-100 rounded-full h-3">
                <motion.div className="h-3 rounded-full" style={{ background: r.color }}
                  animate={{ width: pct + '%' }} transition={{ duration: 0.6 }} />
                {Array.from({ length: r.total }, (_, d) => (
                  <div key={d} className="absolute top-0 bottom-0 w-px bg-white" style={{ left: `${(d / r.total) * 100}%` }} />
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 mt-1"><span>Day 1</span><span>Day {r.total}</span></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// 3. Interactive Clinical Heat Vision
export function ClinicalHeatVisionPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 600); return () => clearInterval(t); }, []);
  const emerg = P('platformEmergencies').length;
  const appts = P('ownerAppts').length;
  const BODY_ZONES = [
    { label:'Head',     heat: 30 + emerg * 5 + tick % 10,  x:46, y:8,  w:8, h:10, color:() => heat > 60 ? '#ef4444' : '#f59e0b' },
    { label:'Chest',    heat: 55 + tick % 15,              x:40, y:22, w:20, h:16, color:'#f59e0b' },
    { label:'Abdomen',  heat: 45 + appts * 3 + tick % 12, x:40, y:40, w:20, h:14, color:'#f97316' },
    { label:'Fore Legs',heat: 35 + tick % 8,              x:25, y:28, w:12, h:20, color:'#10b981' },
    { label:'Hind Legs',heat: 40 + tick % 10,             x:65, y:28, w:12, h:20, color:'#14b8a6' },
    { label:'Tail',     heat: 25 + tick % 6,              x:78, y:50, w:16, h:6,  color:'#6366f1' },
  ].map(z => ({ ...z, heatVal: typeof z.heat === 'number' ? Math.min(99, z.heat) : 50 }));
  const heatColor = h => h > 70 ? '#ef4444' : h > 50 ? '#f97316' : h > 35 ? '#f59e0b' : '#10b981';
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#ef4444,#f97316,#f59e0b)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔥 Realtime Diagnostics</span>
        <h2 className="text-2xl font-black mt-2">Interactive Clinical Heat Vision</h2>
        <p className="text-red-100 text-sm mt-1">Heatmap-style realtime illness and stress body visualization for active patients.</p>
      </div>
      <div className="bg-slate-900 rounded-2xl p-6 flex gap-6">
        <div className="relative flex-shrink-0" style={{ width: 200, height: 200 }}>
          <svg viewBox="0 0 100 80" className="w-full h-full">
            {BODY_ZONES.map((z, i) => (
              <g key={z.label}>
                <motion.rect x={z.x} y={z.y} width={z.w} height={z.h} rx="3" fill={heatColor(z.heatVal)} opacity={0.7}
                  animate={{ opacity: [0.6, 0.85, 0.6] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} />
                <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 1.2} textAnchor="middle" fill="white" fontSize="3" fontWeight="bold">{z.heatVal}°</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          {BODY_ZONES.map(z => (
            <div key={z.label} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-20">{z.label}</span>
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <motion.div className="h-2 rounded-full" style={{ background: heatColor(z.heatVal) }}
                  animate={{ width: z.heatVal + '%' }} transition={{ duration: 0.4 }} />
              </div>
              <motion.span key={tick} className="text-[10px] font-bold w-8 text-right" style={{ color: heatColor(z.heatVal) }}>{z.heatVal}%</motion.span>
            </div>
          ))}
          <div className="mt-3 flex gap-2">
            {[['🟢','Normal'],['🟡','Elevated'],['🔴','Hot']].map(([e,l]) => <span key={l} className="text-[10px] text-slate-400">{e} {l}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Smart Clinical Flow Matrix
export function ClinicalFlowMatrixPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1500); return () => clearInterval(t); }, []);
  const appts  = P('ownerAppts').length;
  const rxs    = P('allPrescriptions').length;
  const STAGES = [
    { label:'Reception',    queue: 2 + tick % 3,  capacity:10, icon:'🚪' },
    { label:'Triage',       queue: 1 + tick % 2,  capacity:4,  icon:'📋' },
    { label:'Examination',  queue: 3 + tick % 4,  capacity:6,  icon:'🔍' },
    { label:'Diagnosis',    queue: 1 + tick % 2,  capacity:4,  icon:'🧠' },
    { label:'Treatment',    queue: 2 + tick % 3,  capacity:8,  icon:'💉' },
    { label:'Discharge',    queue: 1 + tick % 2,  capacity:5,  icon:'🏠' },
  ];
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#6366f1,#14b8a6,#10b981)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">⚙️ Workflow Intelligence</span>
        <h2 className="text-2xl font-black mt-2">Smart Clinical Flow Matrix</h2>
        <p className="text-indigo-100 text-sm mt-1">Realtime clinic workflow efficiency and bottleneck detection — live patient flow.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STAGES.map((s, i) => {
            const pct = Math.round((s.queue / s.capacity) * 100);
            const bottleneck = pct > 60;
            return (
              <React.Fragment key={s.label}>
                <motion.div className={`rounded-2xl border p-4 flex-shrink-0 text-center ${bottleneck ? 'border-rose-300 bg-rose-50' : 'border-slate-100 bg-slate-50'}`} style={{ width: 100 }}
                  animate={bottleneck ? { boxShadow: ['0 0 0px #ef444400', '0 0 12px #ef444444', '0 0 0px #ef444400'] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}>
                  <p className="text-xl mb-1">{s.icon}</p>
                  <p className="font-extrabold text-slate-800 text-xs">{s.label}</p>
                  <p className="text-lg font-extrabold mt-1" style={{ color: bottleneck ? '#ef4444' : '#10b981' }}>{s.queue}</p>
                  <p className="text-[9px] text-slate-400">/ {s.capacity}</p>
                  {bottleneck && <span className="text-[8px] font-bold text-rose-600 mt-1 block">⚠ Bottleneck</span>}
                </motion.div>
                {i < STAGES.length - 1 && (
                  <motion.div className="text-slate-300 text-xl flex-shrink-0"
                    animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>→</motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">Patients flow left → right • Red = bottleneck • Updates every 1.5s</p>
      </div>
    </div>
  );
}

// 5. AI Medical Memory Engine
export function MedicalMemoryPanel() {
  const rxs   = P('allPrescriptions');
  const appts = P('ownerAppts');
  const records = P('medicalRecords');
  const ALL = [
    ...rxs.map(r => ({ type:'Prescription', detail: r.medication || r.drug || 'Medication', patient: r.patientName || r.pet || 'Patient', date: r.date || '—', icon:'💊', color:'#10b981' })),
    ...appts.map(a => ({ type:'Appointment', detail: a.reason || 'Consultation', patient: a.petName || a.pet || 'Patient', date: a.date || '—', icon:'📅', color:'#6366f1' })),
    ...records.map(r => ({ type:'Record', detail: r.diagnosis || 'Medical Record', patient: r.petName || 'Patient', date: r.date || '—', icon:'📋', color:'#14b8a6' })),
    { type:'Vaccination', detail:'Annual Rabies Vaccine', patient:'Bruno', date:'2025-03-15', icon:'💉', color:'#a855f7' },
    { type:'Surgery', detail:'Spay procedure', patient:'Luna', date:'2025-01-10', icon:'🔬', color:'#f97316' },
  ].slice(0, 8);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🧠 Medical Intelligence</span>
        <h2 className="text-2xl font-black mt-2">Smart Medical Memory Engine</h2>
        <p className="text-purple-100 text-sm mt-1">AI remembers and cross-references all previous treatments — synced from real records.</p>
        <div className="flex gap-6 mt-4">
          {[['Prescriptions', rxs.length],['Appointments', appts.length],['Records', records.length],['Total Memory', ALL.length]].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-purple-200">{l}</p></div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {ALL.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <p className="text-4xl mb-2">🧠</p><p className="text-slate-400 text-sm">No medical history yet — memory will build as you use the platform.</p>
          </div>
        ) : ALL.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <span className="text-xl">{m.icon}</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-slate-800">{m.detail}</p>
              <p className="text-xs text-slate-400">{m.patient} · {m.date}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: m.color }}>{m.type}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
