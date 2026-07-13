import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, TrendingDown, Recycle, Zap, ShoppingBag, RefreshCw } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#10b981,#06b6d4,#3b82f6)';

const MONTHLY_DATA = [
  { month: 'Jan', carbon: 18.2, eco: 42 },
  { month: 'Feb', carbon: 16.5, eco: 51 },
  { month: 'Mar', carbon: 15.1, eco: 58 },
  { month: 'Apr', carbon: 13.8, eco: 65 },
  { month: 'May', carbon: 11.2, eco: 74 },
];

const ECO_ACTIONS = [
  { action: 'Switched to eco-friendly food brand',    co2Saved: 4.2, points: 120, date: 'May 10', icon: '🌱' },
  { action: 'Used biodegradable poop bags',           co2Saved: 0.8, points: 40,  date: 'May 8',  icon: '♻️' },
  { action: 'Bought secondhand pet carrier',           co2Saved: 2.1, points: 80,  date: 'May 5',  icon: '🛍️' },
  { action: 'Vet visit by bike (no car)',              co2Saved: 1.4, points: 60,  date: 'May 2',  icon: '🚲' },
  { action: 'Used natural grooming products',         co2Saved: 0.6, points: 30,  date: 'Apr 28', icon: '🌿' },
];

const TIPS = [
  { tip: 'Switch to plant-based pet treats',        impact: 'Saves 3.2kg CO₂/month', icon: '🌱' },
  { tip: 'Buy food in bulk to reduce packaging',    impact: 'Reduces plastic by 60%', icon: '📦' },
  { tip: 'Choose local brands to cut transport CO₂',impact: 'Saves 1.8kg CO₂/month', icon: '🏪' },
  { tip: 'Compost your pet\'s organic waste',       impact: 'Reduces landfill waste',  icon: '♻️' },
];

const BADGES = [
  { name: 'Eco Starter',    earned: true,  icon: '🌱', desc: 'Made your first eco-swap' },
  { name: 'Green Guardian', earned: true,  icon: '🛡️', desc: 'Saved 10kg CO₂ total'   },
  { name: 'Carbon Hero',    earned: false, icon: '🦸', desc: 'Save 25kg CO₂ to unlock' },
  { name: 'Planet Paw',     earned: false, icon: '🌍', desc: 'Reach Eco Score 90+ to unlock' },
];

const CURRENT_CO2   = 11.2;
const TARGET_CO2    = 8.0;
const TOTAL_SAVED   = 9.1;
const ECO_SCORE     = 74;

export default function SustainabilityTab() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">🌍</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🌍 Eco Tracker</span>
        <h2 className="text-2xl font-black mt-2">Sustainability & Carbon Tracker</h2>
        <p className="text-emerald-100 text-sm mt-1">Track your pet care's environmental impact and earn eco rewards for sustainable choices.</p>
        <div className="flex gap-6 mt-4">
          {[['This Month', CURRENT_CO2 + 'kg CO₂'], ['Total Saved', TOTAL_SAVED + 'kg'], ['Eco Score', ECO_SCORE + '%'], ['Eco Badges', BADGES.filter(b => b.earned).length]].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-emerald-200">{l}</p></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Eco Score ring */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
          <p className="font-extrabold text-slate-800 mb-4 self-start">🌿 Eco Score</p>
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
              <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#ecoGrad)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - ECO_SCORE / 100) }}
                transition={{ duration: 1.5 }}>
              </motion.circle>
              <defs><linearGradient id="ecoGrad" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-emerald-600">{ECO_SCORE}%</span>
              <span className="text-xs text-slate-400">Eco</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-extrabold text-emerald-700">🌿 Green Paw Status</p>
            <p className="text-xs text-slate-500 mt-1">Target: reduce to {TARGET_CO2}kg CO₂/month</p>
          </div>
        </div>

        {/* Carbon trend chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">📉 Carbon Footprint Trend</p>
          <div className="flex items-end gap-2 h-28">
            {MONTHLY_DATA.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-emerald-600">{d.carbon}kg</span>
                <motion.div className="w-full rounded-t-lg"
                  style={{ background: GRAD, opacity: 0.6 + i * 0.08 }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.carbon / 20) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.7 }} />
                <span className="text-[10px] text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-emerald-600 font-bold mt-3 text-center">
            ↓ Carbon reduced by <strong>38%</strong> over 5 months 🎉
          </p>
        </div>
      </div>

      {/* Eco actions log */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">♻️ Eco Actions Log</p>
        <div className="space-y-3">
          {ECO_ACTIONS.map((a, i) => (
            <motion.div key={a.action} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <span className="text-xl">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-800">{a.action}</p>
                <p className="text-xs text-slate-400">{a.date}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-extrabold text-emerald-600">-{a.co2Saved}kg CO₂</p>
                <p className="text-[10px] text-emerald-500">+{a.points} pts</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Eco tips */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">💡 AI Eco Recommendations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TIPS.map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-700">{t.tip}</p>
                <p className="text-xs text-emerald-600 font-bold mt-0.5">{t.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eco badges */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🏅 Eco Badges</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BADGES.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border p-4 text-center ${b.earned ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
              <span className="text-3xl">{b.icon}</span>
              <p className="font-extrabold text-sm mt-1 text-slate-800">{b.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{b.desc}</p>
              {b.earned && <span className="text-[10px] font-bold text-emerald-600 mt-1 block">✅ Earned</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
