import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, RefreshCw, Zap } from 'lucide-react';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#06b6d4,#6366f1,#a855f7)';

const INSIGHTS = [
  { year: 2025, title: 'Peak Vitality Phase', desc: 'Bruno enters his prime wellness window. Expect high energy, strong immunity, and deep emotional bonding.', score: 92, icon: '⚡', color: '#6366f1' },
  { year: 2026, title: 'Social Flourishing', desc: 'Increased interest in play and social interaction. Great time to introduce new environments and pet friends.', score: 87, icon: '🤝', color: '#10b981' },
  { year: 2027, title: 'Wisdom & Calm', desc: 'Transitioning to a more serene temperament. Mindful diet and joint care will be key for longevity.', score: 79, icon: '🌿', color: '#14b8a6' },
  { year: 2028, title: 'Senior Wellness Prep', desc: 'Begin proactive senior care protocols. AI monitoring will detect early signs of age-related changes.', score: 71, icon: '🏥', color: '#f59e0b' },
];

const LIFE_MILESTONES = [
  { label: 'Best Health Year', value: '2025', icon: '🌟' },
  { label: 'Predicted Lifespan', value: '14.2 yrs', icon: '⏰' },
  { label: 'Wellness Peak', value: 'Age 4', icon: '📈' },
  { label: 'Joy Index', value: '94%', icon: '😊' },
];

export default function DestinyInsightsTab() {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading]     = useState(false);
  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';

  const generate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); logGlobalActivity('Owner', `AI Destiny Insights generated for ${petName}`, '🔮', 'ai'); }, 2200);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[130px]">🔮</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔮 Future Wellness</span>
        <h2 className="text-2xl font-black mt-2">AI Pet Destiny Insights</h2>
        <p className="text-cyan-100 text-sm mt-1">AI-generated futuristic wellness predictions and life journey milestones for {petName}.</p>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {LIFE_MILESTONES.map(m => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-2xl mb-1">{m.icon}</p>
            <p className="text-lg font-extrabold text-slate-900">{m.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Generate button */}
      {!generated && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center gap-4">
          <p className="text-5xl">🔮</p>
          <p className="font-extrabold text-slate-800 text-lg text-center">Generate {petName}'s Wellness Destiny</p>
          <p className="text-slate-400 text-sm text-center max-w-sm">Our AI analyzes behavioral patterns, health data, breed genetics, and lifestyle to generate a multi-year wellness forecast.</p>
          <button onClick={generate} disabled={loading}
            className="flex items-center gap-2 px-8 py-3 text-white font-extrabold rounded-2xl shadow-lg disabled:opacity-60"
            style={{ background: GRAD }}>
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : '🔮 Generate Destiny Insights'}
          </button>
        </div>
      )}

      {/* Insights timeline */}
      {generated && (
        <div className="space-y-4">
          <p className="font-extrabold text-slate-800">📅 {petName}'s Future Wellness Journey</p>
          {INSIGHTS.map((ins, i) => (
            <motion.div key={ins.year} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4">
              <div className="w-16 flex-shrink-0 flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: ins.color + '18' }}>{ins.icon}</div>
                <p className="text-xs font-extrabold text-slate-500">{ins.year}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-extrabold text-slate-800">{ins.title}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: ins.color }}>AI {ins.score}%</span>
                </div>
                <p className="text-sm text-slate-500">{ins.desc}</p>
                <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                  <motion.div className="h-1.5 rounded-full" style={{ background: ins.color }}
                    initial={{ width: 0 }} animate={{ width: `${ins.score}%` }} transition={{ delay: i * 0.12 + 0.4 }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
