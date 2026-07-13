import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plane, Hotel, Search, CheckCircle, AlertTriangle } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#14b8a6,#06b6d4,#3b82f6)';

const DESTINATIONS = [
  { city: 'Goa',       country: 'India',    petScore: 92, climate: 'Tropical', vets: 8,  parks: 12, hotels: 34, flag: '🏖️' },
  { city: 'Ooty',      country: 'India',    petScore: 88, climate: 'Cool',     vets: 4,  parks: 7,  hotels: 18, flag: '🏔️' },
  { city: 'Coorg',     country: 'India',    petScore: 85, climate: 'Misty',    vets: 3,  parks: 9,  hotels: 22, flag: '🌿' },
  { city: 'Manali',    country: 'India',    petScore: 78, climate: 'Cold',     vets: 2,  parks: 5,  hotels: 15, flag: '❄️' },
  { city: 'Bangkok',   country: 'Thailand', petScore: 70, climate: 'Humid',    vets: 15, parks: 6,  hotels: 88, flag: '🌆' },
  { city: 'Singapore', country: 'SG',       petScore: 95, climate: 'Tropical', vets: 22, parks: 18, hotels: 120,flag: '✈️' },
];

const CHECKLIST = [
  { item: 'Valid Pet Health Passport',      done: true  },
  { item: 'Up-to-date Vaccinations',        done: true  },
  { item: 'Vet Health Certificate',         done: false },
  { item: 'Pet Travel Insurance',           done: true  },
  { item: 'Microchip Registration',         done: true  },
  { item: 'Airline Pet-Friendly Booking',   done: false },
  { item: 'Pet-Friendly Hotel Confirmed',   done: false },
  { item: 'Emergency Vet Contact at Dest.', done: false },
];

const TIPS = [
  { tip: 'Book pet-friendly airline cabins 8 weeks in advance', icon: '✈️' },
  { tip: 'Keep 7-day food supply in carry-on for emergencies',  icon: '🍗' },
  { tip: 'Familiar toy/blanket reduces travel anxiety',          icon: '🧸' },
  { tip: 'Visit vet 1 week before for anti-anxiety meds',       icon: '💊' },
  { tip: 'Carry water & bowl for every 2 hours of travel',      icon: '💧' },
];

export default function PetTravelTab() {
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null);
  const [checklist, setChecklist] = useState(CHECKLIST);

  const toggle = (i) => setChecklist(c => c.map((x, idx) => idx === i ? { ...x, done: !x.done } : x));
  const done = checklist.filter(x => x.done).length;
  const visible = DESTINATIONS.filter(d =>
    search === '' || d.city.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">✈️</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">✈️ Smart Travel</span>
        <h2 className="text-2xl font-black mt-2">Smart Pet Travel Ecosystem</h2>
        <p className="text-blue-100 text-sm mt-1">AI-powered travel planning with pet-friendly destination scoring, checklists, and safety guides.</p>
        <div className="flex gap-6 mt-4">
          {[['Destinations', DESTINATIONS.length], ['Travel Readiness', done + '/' + checklist.length], ['Pet Score Avg', Math.round(DESTINATIONS.reduce((s, d) => s + d.petScore, 0) / DESTINATIONS.length) + '%'], ['Tips', TIPS.length]].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-blue-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Travel readiness */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="font-extrabold text-slate-800">📋 Travel Readiness Checklist</p>
          <span className="text-sm font-bold text-teal-600">{done}/{checklist.length} Complete</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
          <motion.div className="h-2 rounded-full" style={{ background: GRAD }}
            initial={{ width: 0 }} animate={{ width: `${(done / checklist.length) * 100}%` }} transition={{ duration: 1 }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {checklist.map((c, i) => (
            <motion.div key={c.item} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              onClick={() => toggle(i)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${c.done ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-teal-300'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${c.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                {c.done && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
              <span className={`text-sm font-bold ${c.done ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>{c.item}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Destination search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">🗺️ Pet-Friendly Destinations</p>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-300 outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visible.map((d, i) => (
            <motion.div key={d.city} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(selected?.city === d.city ? null : d)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${selected?.city === d.city ? 'border-teal-400 bg-teal-50' : 'border-slate-100 bg-white hover:border-teal-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{d.flag}</span>
                <div>
                  <p className="font-extrabold text-slate-800">{d.city}</p>
                  <p className="text-xs text-slate-400">{d.country} · {d.climate}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xl font-extrabold" style={{ color: d.petScore >= 90 ? '#10b981' : d.petScore >= 80 ? '#6366f1' : '#f59e0b' }}>{d.petScore}%</p>
                  <p className="text-[10px] text-slate-400">Pet Score</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-500"><span>🏥</span>{d.vets} vets</span>
                <span className="flex items-center gap-1 text-slate-500"><span>🌳</span>{d.parks} parks</span>
                <span className="flex items-center gap-1 text-slate-500"><span>🏨</span>{d.hotels} hotels</span>
              </div>
              {selected?.city === d.city && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-teal-200">
                  <p className="text-xs font-bold text-teal-700">✅ Great choice! Bruno's health profile matches this destination's climate conditions.</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Travel tips */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">💡 AI Travel Safety Tips</p>
        <div className="space-y-2">
          {TIPS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <span className="text-xl">{t.icon}</span>
              <span className="text-sm font-bold text-blue-800">{t.tip}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
