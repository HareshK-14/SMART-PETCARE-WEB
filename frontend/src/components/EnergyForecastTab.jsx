import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, RefreshCw } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#f59e0b,#f97316,#ef4444)';

const HOURLY = [
  { hour:'6am',energy:35,label:'Morning wake'},{hour:'8am',energy:72,label:'Walk time'},{hour:'10am',energy:55,label:'Playtime'},
  {hour:'12pm',energy:40,label:'Rest after meal'},{hour:'2pm',energy:60,label:'Afternoon active'},{hour:'4pm',energy:78,label:'Peak energy'},
  {hour:'6pm',energy:65,label:'Evening walk'},{hour:'8pm',energy:45,label:'Wind down'},{hour:'10pm',energy:20,label:'Sleep prep'},
];

const TOMORROW = [
  { activity:'Morning Walk', optimal:'7:00 AM', energy: 75, tip:'High energy window — extend walk by 10 min.' },
  { activity:'Play Session', optimal:'4:30 PM', energy: 88, tip:'Peak activity time. Use interactive toys.' },
  { activity:'Training',     optimal:'6:00 PM', energy: 70, tip:'Good focus window. Short 10-min sessions.' },
  { activity:'Rest',         optimal:'9:00 PM', energy: 15, tip:'Natural rest window. Ensure cozy bedding.' },
];

export default function EnergyForecastTab() {
  const [view, setView] = useState('today');
  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';
  const maxH = Math.max(...HOURLY.map(h => h.energy));

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[130px]">⚡</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">⚡ Energy Intelligence</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Energy Forecast</h2>
        <p className="text-amber-100 text-sm mt-1">Predict {petName}'s daily activity windows, energy peaks, and optimal exercise scheduling.</p>
        <div className="flex gap-6 mt-4">
          {[['Today\'s Peak','4:00 PM'],['Max Energy','78%'],['Rest Periods','3'],['Optimal Walk','7 AM & 6 PM']].map(([l, v]) => (
            <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-amber-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        {['today','tomorrow'].map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold border capitalize transition ${view === v ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600'}`}
            style={view === v ? { background: GRAD } : {}}>
            {v === 'today' ? "Today's Energy" : "Tomorrow's Forecast"}
          </button>
        ))}
      </div>

      {view === 'today' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">📊 Hourly Energy Levels</p>
          <div className="flex items-end gap-2 h-36">
            {HOURLY.map((h, i) => (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                <motion.div className="w-full rounded-t-lg cursor-pointer"
                  style={{ background: h.energy > 60 ? GRAD : h.energy > 40 ? 'linear-gradient(135deg,#14b8a6,#6366f1)' : '#e2e8f0' }}
                  initial={{ height: 0 }} animate={{ height: `${(h.energy / maxH) * 100}%` }} transition={{ delay: i * 0.06, duration: 0.7 }} />
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {h.energy}% — {h.label}
                </div>
                <span className="text-[9px] text-slate-400 font-bold">{h.hour}</span>
                <span className="text-[9px] font-extrabold text-slate-600">{h.energy}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'tomorrow' && (
        <div className="space-y-3">
          {TOMORROW.map((t, i) => (
            <motion.div key={t.activity} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold flex-shrink-0" style={{ background: GRAD }}>
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-extrabold text-slate-800">{t.activity}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{t.optimal}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{t.tip}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <motion.div className="h-2 rounded-full" style={{ background: GRAD }}
                        initial={{ width: 0 }} animate={{ width: `${t.energy}%` }} transition={{ delay: i * 0.08 + 0.3 }} />
                    </div>
                    <span className="text-xs font-extrabold text-amber-600">{t.energy}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
