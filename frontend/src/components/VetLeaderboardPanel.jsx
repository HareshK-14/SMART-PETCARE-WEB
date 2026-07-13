import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Star, TrendingUp, Trophy, Medal,
  Users, Calendar, ChevronUp, ChevronDown,
  Zap, Crown, Target, CheckCircle, Flame, Clock
} from 'lucide-react';
import { db, useSync } from '../utils/dataBridge';

// ── Static vet roster (extended for leaderboard) ─────────────────────────
const VET_ROSTER = [
  {
    id: 'v1',
    name: 'Dr. Priya Sharma',
    specialty: 'General Practice',
    avatar: '👩‍⚕️',
    color: '#6366f1',
    joinDate: '2024-01-10',
    thisMonth: { appointments: 42, satisfaction: 98, recoveryRate: 96 },
    lastMonth: { appointments: 38, satisfaction: 95, recoveryRate: 93 },
    badges: ['Top Rated', '100 Patients Milestone', 'Perfect Week'],
  },
  {
    id: 'v2',
    name: 'Dr. Arjun Mehta',
    specialty: 'Surgery & Orthopedics',
    avatar: '👨‍⚕️',
    color: '#14b8a6',
    joinDate: '2024-03-05',
    thisMonth: { appointments: 36, satisfaction: 94, recoveryRate: 91 },
    lastMonth: { appointments: 33, satisfaction: 91, recoveryRate: 89 },
    badges: ['Rising Star', 'Surgical Excellence'],
  },
  {
    id: 'v3',
    name: 'Dr. Kavya Nair',
    specialty: 'Dermatology',
    avatar: '👩‍⚕️',
    color: '#f59e0b',
    joinDate: '2024-02-20',
    thisMonth: { appointments: 31, satisfaction: 92, recoveryRate: 94 },
    lastMonth: { appointments: 28, satisfaction: 89, recoveryRate: 90 },
    badges: ['Specialist Award', 'Patient Favourite'],
  },
  {
    id: 'v4',
    name: 'Dr. Rahul Gupta',
    specialty: 'Cardiology',
    avatar: '👨‍⚕️',
    color: '#ec4899',
    joinDate: '2024-04-12',
    thisMonth: { appointments: 27, satisfaction: 89, recoveryRate: 88 },
    lastMonth: { appointments: 25, satisfaction: 86, recoveryRate: 85 },
    badges: ['Cardiac Specialist'],
  },
  {
    id: 'v5',
    name: 'Dr. Meena Iyer',
    specialty: 'Ophthalmology',
    avatar: '👩‍⚕️',
    color: '#8b5cf6',
    joinDate: '2024-05-01',
    thisMonth: { appointments: 23, satisfaction: 86, recoveryRate: 85 },
    lastMonth: { appointments: 20, satisfaction: 83, recoveryRate: 82 },
    badges: ['Eye Care Expert'],
  },
];

// ── Badge Definitions ─────────────────────────────────────────────────────
const BADGE_META = {
  'Top Rated':                { icon: '⭐', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  '100 Patients Milestone':   { icon: '🏆', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' },
  'Perfect Week':             { icon: '🔥', color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' },
  'Rising Star':              { icon: '🌟', color: 'text-teal-400', bg: 'bg-teal-500/15 border-teal-500/30' },
  'Surgical Excellence':      { icon: '🩺', color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/30' },
  'Specialist Award':         { icon: '🎖️', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
  'Patient Favourite':        { icon: '❤️', color: 'text-pink-400', bg: 'bg-pink-500/15 border-pink-500/30' },
  'Cardiac Specialist':       { icon: '💓', color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/30' },
  'Eye Care Expert':          { icon: '👁️', color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/30' },
};

// ── Score calculator ──────────────────────────────────────────────────────
function calcScore(vet, reviews, appts) {
  const vetReviews = reviews.filter(r => r.vet === vet.name);
  const vetAppts = appts.filter(a => a.vetId === vet.id);
  const avgRating = vetReviews.length > 0
    ? vetReviews.reduce((sum, r) => sum + r.rating, 0) / vetReviews.length
    : vet.thisMonth.satisfaction / 20;
  const totalReviews = vetReviews.length;
  const totalAppts = vetAppts.length + vet.thisMonth.appointments;
  const score = Math.round(
    avgRating * 25 +
    (vet.thisMonth.satisfaction / 100) * 35 +
    (vet.thisMonth.recoveryRate / 100) * 25 +
    Math.min(totalAppts / 50, 1) * 15
  );
  return { avgRating: avgRating.toFixed(1), totalReviews, totalAppts, score };
}

// ── Podium Component ──────────────────────────────────────────────────────
function PodiumPosition({ vet, rank, delay, stats }) {
  const configs = {
    1: { height: 'h-28', color: '#f59e0b', label: '1ST', crown: true, gradient: 'from-amber-500/30 to-yellow-500/10', border: 'border-amber-500/50', glow: 'shadow-amber-500/30' },
    2: { height: 'h-20', color: '#94a3b8', label: '2ND', crown: false, gradient: 'from-slate-400/20 to-slate-500/10', border: 'border-slate-400/40', glow: 'shadow-slate-400/20' },
    3: { height: 'h-14', color: '#cd7c2f', label: '3RD', crown: false, gradient: 'from-amber-700/20 to-amber-800/10', border: 'border-amber-700/40', glow: 'shadow-amber-700/20' },
  };
  const c = configs[rank];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center"
    >
      {/* Avatar + Info */}
      <div className="flex flex-col items-center mb-2 relative">
        {c.crown && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: delay + 0.3, type: 'spring' }}
            className="text-2xl mb-1"
          >
            👑
          </motion.div>
        )}
        <motion.div
          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl shadow-xl ${c.border}`}
          style={{ background: `radial-gradient(circle, ${c.color}22, ${c.color}08)`, boxShadow: `0 0 20px ${c.color}40` }}
          whileHover={{ scale: 1.1 }}
        >
          {vet.avatar}
        </motion.div>
        <div className="mt-1.5 text-center max-w-[90px]">
          <p className="text-xs font-bold text-white leading-tight">{vet.name.split(' ').slice(1).join(' ')}</p>
          <p className="text-[10px] text-white/40 truncate">{vet.specialty}</p>
          <div className="flex items-center justify-center gap-0.5 mt-0.5">
            <Star size={9} className="text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-amber-300 font-bold">{stats.avgRating}</span>
          </div>
        </div>
      </div>

      {/* Podium Block */}
      <motion.div
        className={`w-24 ${c.height} rounded-t-2xl border ${c.border} bg-gradient-to-b ${c.gradient} flex items-center justify-center shadow-lg ${c.glow}`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.5, ease: 'easeOut' }}
        style={{ transformOrigin: 'bottom', boxShadow: `0 -4px 20px ${c.color}30` }}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg font-black" style={{ color: c.color }}>{c.label}</span>
          <span className="text-[10px] text-white/40">{stats.score} pts</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function VetLeaderboardPanel() {
  const { data } = useSync(['vetReviews', 'ownerAppts']);
  const reviews = data.vetReviews || [];
  const appts = data.ownerAppts || [];

  const [activeTab, setActiveTab] = useState('leaderboard');
  const [selectedVet, setSelectedVet] = useState(null);

  // Compute rankings
  const rankedVets = useMemo(() => {
    return VET_ROSTER.map(vet => ({
      ...vet,
      stats: calcScore(vet, reviews, appts),
    })).sort((a, b) => b.stats.score - a.stats.score);
  }, [reviews, appts]);

  const top3 = rankedVets.slice(0, 3);
  // Reorder: 2nd, 1st, 3rd for podium display
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumRanks = [2, 1, 3];

  // Platform-wide stats
  const totalAppts = rankedVets.reduce((s, v) => s + v.stats.totalAppts, 0);
  const totalReviews = rankedVets.reduce((s, v) => s + v.stats.totalReviews, 0);
  const avgSatisfaction = Math.round(rankedVets.reduce((s, v) => s + v.thisMonth.satisfaction, 0) / rankedVets.length);

  const tabs = [
    { id: 'leaderboard', label: 'Rankings', icon: Trophy },
    { id: 'stats', label: 'Stats', icon: TrendingUp },
    { id: 'badges', label: 'Achievements', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-4 md:p-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-6 rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1205 50%, #0d1a0d 100%)' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(20,184,166,0.15))' }} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />

        <div className="relative p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(135deg, #f59e0b, #14b8a6)' }}>
              <Trophy size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">AI Vet Performance Leaderboard</h1>
              <p className="text-white/60 text-sm mt-0.5">Real-time rankings powered by patient outcomes</p>
            </div>
          </div>

          {/* Quick platform stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Appointments', value: totalAppts, icon: Calendar, color: 'text-teal-400' },
              { label: 'Reviews Collected', value: totalReviews, icon: Star, color: 'text-amber-400' },
              { label: 'Avg Satisfaction', value: `${avgSatisfaction}%`, icon: Users, color: 'text-indigo-400' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur rounded-xl p-2.5 text-center border border-white/10"
                >
                  <Icon size={14} className={`${stat.color} mx-auto mb-1`} />
                  <p className="text-base font-black text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/40">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-2 mb-6"
      >
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                active
                  ? 'border-amber-500/50 text-amber-300'
                  : 'border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
              }`}
              style={active ? { background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(20,184,166,0.15))' } : { background: 'rgba(255,255,255,0.03)' }}
            >
              <Icon size={15} />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ════════════════════════════════════════════════════════════
          TAB 1 — LEADERBOARD
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* ── Animated Podium ── */}
            <div className="rounded-2xl border border-white/10 p-6 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h2 className="text-sm font-bold text-white/60 text-center mb-6 flex items-center justify-center gap-2">
                <Crown size={16} className="text-amber-400" />
                Top Performers This Month
              </h2>
              <div className="flex items-end justify-center gap-4">
                {podiumOrder.map((vet, i) => {
                  const rank = podiumRanks[i];
                  const delay = rank === 1 ? 0.1 : rank === 2 ? 0.2 : 0.3;
                  return (
                    <PodiumPosition
                      key={vet.id}
                      vet={vet}
                      rank={rank}
                      delay={delay}
                      stats={vet.stats}
                    />
                  );
                })}
              </div>
            </div>

            {/* ── Full Rankings List ── */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1 mb-3">All Rankings</h2>
              {rankedVets.map((vet, i) => {
                const rank = i + 1;
                const isExpanded = selectedVet === vet.id;
                const trend = vet.thisMonth.appointments - vet.lastMonth.appointments;
                const trendSat = vet.thisMonth.satisfaction - vet.lastMonth.satisfaction;

                const rankStyle = {
                  1: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', rankColor: 'text-amber-400', rankBg: 'bg-amber-500/20' },
                  2: { bg: 'bg-slate-500/10', border: 'border-slate-400/30', rankColor: 'text-slate-300', rankBg: 'bg-slate-500/20' },
                  3: { bg: 'bg-amber-700/10', border: 'border-amber-700/30', rankColor: 'text-amber-600', rankBg: 'bg-amber-700/20' },
                }[rank] || { bg: 'bg-white/3', border: 'border-white/10', rankColor: 'text-white/40', rankBg: 'bg-white/5' };

                return (
                  <motion.div
                    key={vet.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-2xl border backdrop-blur-xl overflow-hidden transition-all ${rankStyle.bg} ${rankStyle.border}`}
                  >
                    <button
                      className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/3 transition-colors"
                      onClick={() => setSelectedVet(isExpanded ? null : vet.id)}
                    >
                      {/* Rank Badge */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${rankStyle.rankBg} ${rankStyle.rankColor}`}>
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                      </div>

                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl border border-white/10 shrink-0"
                        style={{ background: `${vet.color}22`, boxShadow: `0 0 12px ${vet.color}33` }}
                      >
                        {vet.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{vet.name}</span>
                          {trend > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                              <ChevronUp size={10} />+{trend}
                            </span>
                          )}
                          {trend < 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-red-400 bg-red-500/15 border border-red-500/30 px-1.5 py-0.5 rounded-full">
                              <ChevronDown size={10} />{trend}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/40">{vet.specialty}</p>
                      </div>

                      {/* Score & Rating */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-sm font-bold text-amber-300">{vet.stats.avgRating}</span>
                        </div>
                        <p className="text-xs text-white/40">{vet.stats.score} pts</p>
                      </div>

                      <div className="text-white/30 ml-1">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {/* Expanded Detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-white/5">
                            <div className="pt-3 grid grid-cols-3 gap-2 mb-3">
                              {[
                                { label: 'Appts (Month)', value: vet.thisMonth.appointments, icon: Calendar, trend: trend, color: 'teal' },
                                { label: 'Satisfaction', value: `${vet.thisMonth.satisfaction}%`, icon: Star, trend: trendSat, color: 'amber' },
                                { label: 'Recovery Rate', value: `${vet.thisMonth.recoveryRate}%`, icon: Target, trend: vet.thisMonth.recoveryRate - vet.lastMonth.recoveryRate, color: 'indigo' },
                              ].map((m, mi) => {
                                const Icon = m.icon;
                                const t = Number(m.trend);
                                return (
                                  <div key={mi} className="bg-white/5 rounded-xl p-2.5 text-center">
                                    <Icon size={13} className={`mx-auto mb-1 ${m.color === 'teal' ? 'text-teal-400' : m.color === 'amber' ? 'text-amber-400' : 'text-indigo-400'}`} />
                                    <p className="text-sm font-black text-white">{m.value}</p>
                                    <p className="text-[10px] text-white/40">{m.label}</p>
                                    {t !== 0 && (
                                      <p className={`text-[10px] font-bold mt-0.5 ${t > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {t > 0 ? `↑+${t}` : `↓${t}`} vs last mo.
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Badges */}
                            {vet.badges.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {vet.badges.map(badge => {
                                  const meta = BADGE_META[badge] || { icon: '🏅', color: 'text-white/60', bg: 'bg-white/5 border-white/10' };
                                  return (
                                    <span key={badge} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${meta.bg} ${meta.color}`}>
                                      <span>{meta.icon}</span>
                                      {badge}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 2 — STATS (This Month vs Last Month)
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/10 p-5 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h2 className="text-sm font-bold text-white/70 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-teal-400" />
                Month-over-Month Comparison
              </h2>
              <div className="space-y-4">
                {rankedVets.map((vet, i) => {
                  const apptChange = vet.thisMonth.appointments - vet.lastMonth.appointments;
                  const satChange = vet.thisMonth.satisfaction - vet.lastMonth.satisfaction;
                  const recChange = vet.thisMonth.recoveryRate - vet.lastMonth.recoveryRate;
                  const apptPct = Math.round((vet.thisMonth.appointments / Math.max(vet.lastMonth.appointments, 1)) * 100);

                  return (
                    <motion.div
                      key={vet.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-xl border border-white/10 p-4"
                      style={{ background: 'rgba(255,255,255,0.02)' }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{vet.avatar}</span>
                        <div>
                          <p className="text-sm font-bold text-white">{vet.name}</p>
                          <p className="text-xs text-white/40">{vet.specialty}</p>
                        </div>
                        <div className="ml-auto">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            apptChange >= 0
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/15 text-red-400 border border-red-500/30'
                          }`}>
                            {apptChange >= 0 ? '↑' : '↓'} {Math.abs(apptChange)} appts
                          </span>
                        </div>
                      </div>

                      {/* Metric bars */}
                      <div className="space-y-2.5">
                        {[
                          { label: 'Appointments', this: vet.thisMonth.appointments, last: vet.lastMonth.appointments, max: 50, color: '#14b8a6', unit: '' },
                          { label: 'Satisfaction', this: vet.thisMonth.satisfaction, last: vet.lastMonth.satisfaction, max: 100, color: '#f59e0b', unit: '%' },
                          { label: 'Recovery Rate', this: vet.thisMonth.recoveryRate, last: vet.lastMonth.recoveryRate, max: 100, color: '#6366f1', unit: '%' },
                        ].map(metric => (
                          <div key={metric.label}>
                            <div className="flex justify-between text-xs text-white/50 mb-1">
                              <span>{metric.label}</span>
                              <span className="font-semibold text-white/80">{metric.this}{metric.unit}</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              {/* Last month bar (muted) */}
                              <div
                                className="h-full rounded-full opacity-30 absolute"
                                style={{ width: `${(metric.last / metric.max) * 100}%`, background: metric.color }}
                              />
                              {/* This month bar */}
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(metric.this / metric.max) * 100}%` }}
                                transition={{ delay: i * 0.08 + 0.3, duration: 0.8, ease: 'easeOut' }}
                                style={{ background: `linear-gradient(90deg, ${metric.color}aa, ${metric.color})` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-white/25 mt-0.5">
                              <span>Last: {metric.last}{metric.unit}</span>
                              <span className={metric.this >= metric.last ? 'text-emerald-400/60' : 'text-red-400/60'}>
                                {metric.this >= metric.last ? '+' : ''}{metric.this - metric.last}{metric.unit}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Platform summary box */}
            <div
              className="rounded-2xl border border-teal-500/20 p-5"
              style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.06), rgba(99,102,241,0.06))' }}
            >
              <h3 className="text-sm font-bold text-teal-300 mb-3 flex items-center gap-2">
                <Zap size={14} />
                Platform Performance Snapshot
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Best Performer', value: rankedVets[0]?.name.split(' ')[1] || '—', icon: '🥇' },
                  { label: 'Most Improved', value: rankedVets.reduce((best, v) => {
                    const change = v.thisMonth.appointments - v.lastMonth.appointments;
                    return change > (best.change || 0) ? { name: v.name.split(' ')[1], change } : best;
                  }, {}).name || rankedVets[0]?.name.split(' ')[1], icon: '📈' },
                  { label: 'Highest Rated', value: `${rankedVets[0]?.stats.avgRating} ⭐`, icon: '⭐' },
                  { label: 'Active Vets', value: VET_ROSTER.length, icon: '👨‍⚕️' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3">
                    <p className="text-lg">{item.icon}</p>
                    <p className="text-sm font-black text-white mt-1">{item.value}</p>
                    <p className="text-xs text-white/40">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 3 — ACHIEVEMENT BADGES
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* My Ranking Card (current vet = Dr. Priya, rank 1) */}
            <div
              className="rounded-2xl border border-amber-500/30 p-5 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(20,184,166,0.06))' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
              <div className="relative">
                <h2 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
                  <Crown size={14} />
                  My Ranking — Dr. Priya Sharma
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">👩‍⚕️</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-black text-amber-400">#1</span>
                      <span className="text-sm text-white/60">Overall Rank</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span className="flex items-center gap-1"><Star size={10} className="text-amber-400 fill-amber-400" /> {rankedVets.find(v => v.id === 'v1')?.stats.avgRating} Rating</span>
                      <span className="flex items-center gap-1"><Trophy size={10} className="text-teal-400" /> {rankedVets.find(v => v.id === 'v1')?.stats.score} pts</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-2 py-1 rounded-full">
                      <ChevronUp size={10} />
                      LEADER
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Badges by Vet */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Achievement Gallery</h2>
              {rankedVets.map((vet, i) => (
                <motion.div
                  key={vet.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-white/10 p-4 backdrop-blur-xl"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-base border border-white/10"
                      style={{ background: `${vet.color}22` }}
                    >
                      {vet.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{vet.name}</p>
                      <p className="text-xs text-white/40">{vet.specialty} · {vet.badges.length} badges</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <Medal size={12} className="text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">#{i + 1}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {vet.badges.map((badge, bi) => {
                      const meta = BADGE_META[badge] || { icon: '🏅', color: 'text-white/60', bg: 'bg-white/5 border-white/10' };
                      return (
                        <motion.span
                          key={badge}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.08 + bi * 0.06, type: 'spring', stiffness: 300 }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.bg} ${meta.color}`}
                        >
                          <span>{meta.icon}</span>
                          {badge}
                        </motion.span>
                      );
                    })}
                    {vet.badges.length === 0 && (
                      <span className="text-xs text-white/30 italic">No badges yet</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Upcoming Milestones */}
            <div
              className="rounded-2xl border border-indigo-500/20 p-5"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(20,184,166,0.04))' }}
            >
              <h3 className="text-sm font-bold text-indigo-300 mb-3 flex items-center gap-2">
                <Target size={14} />
                Upcoming Milestones
              </h3>
              <div className="space-y-3">
                {[
                  { vet: 'Dr. Arjun Mehta', badge: '100 Patients Milestone', progress: 78, total: 100, icon: '🏆', color: '#14b8a6' },
                  { vet: 'Dr. Kavya Nair', badge: 'Top Rated', progress: 92, total: 100, icon: '⭐', color: '#f59e0b' },
                  { vet: 'Dr. Rahul Gupta', badge: 'Perfect Week', progress: 5, total: 7, icon: '🔥', color: '#6366f1' },
                ].map((ms, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{ms.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white">{ms.badge}</p>
                        <p className="text-[10px] text-white/40">{ms.vet}</p>
                      </div>
                      <span className="text-xs font-bold text-white/60">{ms.progress}/{ms.total}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(ms.progress / ms.total) * 100}%` }}
                        transition={{ delay: i * 0.1 + 0.5, duration: 0.8, ease: 'easeOut' }}
                        style={{ background: `linear-gradient(90deg, ${ms.color}88, ${ms.color})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
