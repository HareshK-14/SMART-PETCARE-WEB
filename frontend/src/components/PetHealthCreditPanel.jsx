import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Brain, Heart, Activity, Shield, Droplets, Moon, Pill,
  TrendingUp, TrendingDown, Minus, Sparkles, ChevronRight,
  Syringe, Stethoscope, Dumbbell, Apple, Star, Zap
} from 'lucide-react';
import { db, useSync } from '../utils/dataBridge';

/* ── Inject global styles ── */
const CSS = `
@keyframes phcp-spin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes phcp-pulse  { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
@keyframes phcp-glow   { 0%,100% { box-shadow:0 0 18px #6366f188; } 50% { box-shadow:0 0 38px #14b8a6aa; } }
@keyframes phcp-float  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
@keyframes phcp-shimmer{ 0%{background-position:-400px 0} 100%{background-position:400px 0} }
`;
if (typeof document !== 'undefined' && !document.getElementById('phcp-styles')) {
  const s = document.createElement('style');
  s.id = 'phcp-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ── Constants ── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

function getScoreColor(score) {
  if (score <= 400) return { primary: '#ef4444', secondary: '#dc2626', glow: '#ef444466', label: 'Poor', emoji: '🔴' };
  if (score <= 700) return { primary: '#f59e0b', secondary: '#d97706', glow: '#f59e0b66', label: 'Fair', emoji: '🟡' };
  if (score <= 850) return { primary: '#10b981', secondary: '#059669', glow: '#10b98166', label: 'Good', emoji: '🟢' };
  return { primary: '#14b8a6', secondary: '#6366f1', glow: '#14b8a666', label: 'Excellent', emoji: '💎' };
}

/* ── Animated Counter ── */
function AnimatedNumber({ target, duration = 2000 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = null;
    const from = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * ease));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{display}</>;
}

/* ── Circular Score Gauge ── */
function ScoreGauge({ score, color }) {
  const size = 220;
  const strokeW = 14;
  const r = (size - strokeW * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const totalArc = 280; // degrees
  const startAngle = -230;
  const circ = 2 * Math.PI * r;
  const arcLen = (totalArc / 360) * circ;
  const filled = (score / 1000) * arcLen;

  const describeArc = (pct) => {
    const angle = startAngle + (pct / 1000) * totalArc;
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const makeArc = (from, to) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endAngle = startAngle + (to / 1000) * totalArc;
    const endRad = (endAngle * Math.PI) / 180;
    const sx = cx + r * Math.cos(startRad);
    const sy = cy + r * Math.sin(startRad);
    const ex = cx + r * Math.cos(endRad);
    const ey = cy + r * Math.sin(endRad);
    const sweep = (to / 1000) * totalArc > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${sweep} 1 ${ex} ${ey}`;
  };

  const totalPath = makeArc(0, 1000);
  const filledPath = makeArc(0, score);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Background glow rings */}
      {[1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: i * 10,
            borderRadius: '50%',
            border: `1px solid ${color.primary}${Math.round(22 / i).toString(16).padStart(2, '0')}`,
            animation: `phcp-pulse ${1.5 + i * 0.4}s ease-in-out infinite`,
          }}
        />
      ))}

      <svg width={size} height={size} style={{ transform: 'rotate(0deg)' }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color.primary} />
            <stop offset="100%" stopColor={color.secondary} />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path d={totalPath} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeW} strokeLinecap="round" />

        {/* Tick marks */}
        {[0, 200, 400, 600, 800, 1000].map(val => {
          const angle = startAngle + (val / 1000) * totalArc;
          const rad = (angle * Math.PI) / 180;
          const ir = r - strokeW / 2 - 2;
          const or = r + strokeW / 2 + 2;
          return (
            <line
              key={val}
              x1={cx + ir * Math.cos(rad)} y1={cy + ir * Math.sin(rad)}
              x2={cx + or * Math.cos(rad)} y2={cy + or * Math.sin(rad)}
              stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}
            />
          );
        })}

        {/* Filled arc */}
        <motion.path
          d={filledPath}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${filled} ${circ - filled}` }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />

        {/* Needle dot */}
        {score > 0 && (() => {
          const p = describeArc(score);
          return (
            <motion.circle
              cx={p.x} cy={p.y} r={8}
              fill={color.primary}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8, type: 'spring' }}
              style={{ filter: `drop-shadow(0 0 6px ${color.primary})` }}
            />
          );
        })()}
      </svg>

      {/* Center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        paddingTop: 20,
      }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>
          CREDIT SCORE
        </div>
        <div style={{
          fontSize: 52, fontWeight: 900,
          background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1,
        }}>
          <AnimatedNumber target={score} />
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>out of 1000</div>
        <div style={{
          marginTop: 8, fontSize: 12, fontWeight: 800,
          color: color.primary, letterSpacing: 1,
          padding: '2px 12px', borderRadius: 99,
          background: `${color.primary}22`,
          border: `1px solid ${color.primary}44`,
        }}>
          {color.emoji} {color.label}
        </div>
      </div>
    </div>
  );
}

/* ── Factor Card ── */
function FactorCard({ factor, index }) {
  const [hovered, setHovered] = useState(false);
  const pct = factor.value;
  const circ = 2 * Math.PI * 20;
  const dash = (pct / 100) * circ;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, type: 'spring', stiffness: 200 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.04, y: -2 }}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${factor.color}22, rgba(255,255,255,0.08))`
          : 'rgba(255,255,255,0.06)',
        border: `1px solid ${hovered ? factor.color + '55' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 16,
        padding: '14px 12px',
        cursor: 'default',
        transition: 'all 0.3s',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Mini radial */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <svg width={48} height={48}>
          <circle cx={24} cy={24} r={20} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
          <motion.circle
            cx={24} cy={24} r={20}
            fill="none"
            stroke={factor.color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.4, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
            transform="rotate(-90 24 24)"
            style={{ filter: `drop-shadow(0 0 4px ${factor.color})` }}
          />
          <text x={24} y={28} textAnchor="middle" fill={factor.color} fontSize={10} fontWeight="bold">
            {pct}%
          </text>
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>
            {factor.label}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2 }}>
            Weight: {factor.weight}%
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: `${factor.color}15`, borderRadius: 8,
        padding: '4px 8px',
      }}>
        <factor.icon size={10} color={factor.color} />
        <span style={{ color: factor.color, fontSize: 9, fontWeight: 700 }}>{factor.status}</span>
      </div>
    </motion.div>
  );
}

/* ── Trend Sparkline ── */
function TrendChart({ data, color }) {
  const W = 320, H = 80;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (W - 40) + 20,
    y: H - 20 - ((v - min) / range) * (H - 40),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H - 10} L ${points[0].x} ${H - 10} Z`;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((v, i) => (
        <line
          key={i}
          x1={20} y1={H - 10 - v * (H - 30)}
          x2={W - 20} y2={H - 10 - v * (H - 30)}
          stroke="rgba(255,255,255,0.06)" strokeWidth={1}
        />
      ))}

      {/* Area fill */}
      <path d={areaD} fill="url(#trendGrad)" />

      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
          <text x={p.x} y={H - 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={8}>
            {MONTHS[i]}
          </text>
          <text x={p.x} y={p.y - 8} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={9} fontWeight="bold">
            {data[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function PetHealthCreditPanel() {
  const { data } = useSync(['allPrescriptions', 'medicalRecords', 'ownerAppts', 'petWalks', 'petHydrationLogs', 'ownerPets']);

  const [activeTab, setActiveTab] = useState('overview');
  const [showPlan, setShowPlan] = useState(false);

  /* ── Derive data ── */
  const pets = data.ownerPets || [];
  const petName = pets[0]?.name || 'Bruno';

  const prescriptions = data.allPrescriptions || [];
  const medRecords = data.medicalRecords || [];
  const appts = data.ownerAppts || [];
  const walks = data.petWalks || [];
  const hydration = data.petHydrationLogs || [];

  /* ── Score calculation ── */
  const vaccinationScore = (() => {
    const vacc = medRecords.filter(r => r.type === 'Vaccination').length;
    return Math.min(100, vacc * 50 + 20);
  })();

  const vetVisitScore = (() => {
    const confirmed = appts.filter(a => a.status === 'confirmed').length;
    const total = appts.length;
    const ratio = total > 0 ? confirmed / total : 0.5;
    return Math.min(100, Math.round(ratio * 100) + medRecords.length * 15);
  })();

  const nutritionScore = (() => {
    const hydRatio = hydration.reduce((acc, h) => acc + (h.amount / h.goal), 0) / Math.max(1, hydration.length);
    return Math.min(100, Math.round(hydRatio * 80 + 20));
  })();

  const exerciseScore = (() => {
    const avgDuration = walks.reduce((acc, w) => acc + w.duration, 0) / Math.max(1, walks.length);
    return Math.min(100, Math.round((avgDuration / 45) * 80 + 10));
  })();

  const sleepScore = Math.min(100, 70 + walks.length * 5);

  const medScore = (() => {
    const active = prescriptions.filter(p => p.status === 'active').length;
    const total = prescriptions.length;
    return total > 0 ? Math.min(100, Math.round((active / total) * 60 + 40)) : 75;
  })();

  // Weighted sum → scale to 1000
  const rawScore =
    vaccinationScore * 0.20 +
    vetVisitScore    * 0.20 +
    nutritionScore   * 0.20 +
    exerciseScore    * 0.20 +
    sleepScore       * 0.10 +
    medScore         * 0.10;

  const creditScore = Math.round(rawScore * 10); // 0–1000
  const color = getScoreColor(creditScore);

  /* ── Score history (last 6 months simulated) ── */
  const scoreHistory = [
    Math.max(300, creditScore - 180),
    Math.max(320, creditScore - 130),
    Math.max(350, creditScore - 80),
    Math.max(380, creditScore - 50),
    Math.max(400, creditScore - 20),
    creditScore,
  ];

  const trendDiff = scoreHistory[5] - scoreHistory[4];
  const TrendIcon = trendDiff > 0 ? TrendingUp : trendDiff < 0 ? TrendingDown : Minus;
  const trendColor = trendDiff > 0 ? '#10b981' : trendDiff < 0 ? '#ef4444' : '#94a3b8';

  /* ── Factor cards ── */
  const factors = [
    {
      label: 'Vaccinations',
      icon: Syringe,
      value: vaccinationScore,
      weight: 20,
      color: '#6366f1',
      status: vaccinationScore >= 80 ? 'Up to date' : 'Needs attention',
    },
    {
      label: 'Vet Visits',
      icon: Stethoscope,
      value: vetVisitScore,
      weight: 20,
      color: '#14b8a6',
      status: vetVisitScore >= 70 ? 'Regular checkups' : 'Schedule visit',
    },
    {
      label: 'Nutrition',
      icon: Apple,
      value: nutritionScore,
      weight: 20,
      color: '#f59e0b',
      status: nutritionScore >= 75 ? 'Well hydrated' : 'Improve diet',
    },
    {
      label: 'Exercise',
      icon: Dumbbell,
      value: exerciseScore,
      weight: 20,
      color: '#10b981',
      status: exerciseScore >= 70 ? 'Active lifestyle' : 'More walks needed',
    },
    {
      label: 'Sleep',
      icon: Moon,
      value: sleepScore,
      weight: 10,
      color: '#8b5cf6',
      status: sleepScore >= 75 ? 'Resting well' : 'Monitor sleep',
    },
    {
      label: 'Medication',
      icon: Pill,
      value: medScore,
      weight: 10,
      color: '#ec4899',
      status: medScore >= 70 ? 'Adherent' : 'Check schedule',
    },
  ];

  /* ── AI Tips ── */
  const tips = [
    {
      icon: '💉',
      color: '#6366f1',
      title: 'Schedule Overdue Vaccination',
      desc: `${petName} is due for a Bordetella booster. Booking now can add up to +85 points to the credit score.`,
      action: 'Book Now',
    },
    {
      icon: '🏃',
      color: '#10b981',
      title: 'Increase Daily Exercise',
      desc: `Adding 15 min to ${petName}'s daily walk routine could boost the Exercise score by 12 points.`,
      action: 'Set Goal',
    },
    {
      icon: '💧',
      color: '#14b8a6',
      title: 'Improve Hydration Tracking',
      desc: `${petName}'s hydration logs show gaps. Consistent logging improves Nutrition score by +20 points.`,
      action: 'Log Now',
    },
  ];

  /* ── Stat cards ── */
  const stats = [
    { label: 'Records', value: medRecords.length, icon: Activity, color: '#6366f1' },
    { label: 'Walks', value: walks.length, icon: Dumbbell, color: '#10b981' },
    { label: 'Appts', value: appts.length, icon: Stethoscope, color: '#14b8a6' },
    { label: 'Rx Active', value: prescriptions.filter(p => p.status === 'active').length, icon: Pill, color: '#ec4899' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0d1b2a 100%)',
      fontFamily: "'Inter', sans-serif",
      padding: '28px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #6366f122, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -150, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #14b8a611, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #8b5cf611, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6)',
            borderRadius: 24,
            padding: '24px 28px',
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: '40%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
            <div style={{ animation: 'phcp-float 3s ease-in-out infinite', fontSize: 36 }}>💳</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 99, padding: '3px 12px', fontSize: 11, color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
                  AI POWERED
                </span>
                <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '3px 10px', fontSize: 10, color: '#e0e7ff', fontWeight: 600 }}>
                  🔴 LIVE
                </span>
              </div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
                AI Pet Health Credit Score
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 }}>
                Comprehensive wellness rating for {petName} — updated in real-time
              </p>
            </div>

            {/* Mini stats */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ color: '#fff', fontSize: 20, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'factors', label: '⚡ Factors' },
            { id: 'history', label: '📈 History' },
            { id: 'plan', label: '🤖 AI Plan' },
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                cursor: 'pointer',
                borderRadius: 12,
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 700,
                transition: 'all 0.2s',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #6366f1, #14b8a6)'
                  : 'rgba(255,255,255,0.07)',
                color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: activeTab === tab.id ? '0 4px 18px rgba(99,102,241,0.4)' : 'none',
              }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* ── Tab: Overview ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* Left: Gauge */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 24,
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  animation: 'phcp-glow 4s ease-in-out infinite',
                }}>
                  <ScoreGauge score={creditScore} color={color} />

                  {/* Trend indicator */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, marginTop: 16,
                      background: `${trendColor}15`, borderRadius: 12,
                      padding: '8px 16px', border: `1px solid ${trendColor}33`,
                    }}
                  >
                    <TrendIcon size={14} color={trendColor} />
                    <span style={{ color: trendColor, fontSize: 13, fontWeight: 700 }}>
                      {trendDiff > 0 ? '+' : ''}{trendDiff} pts this month
                    </span>
                  </motion.div>

                  {/* Score brackets */}
                  <div style={{ marginTop: 20, width: '100%' }}>
                    {[
                      { range: '0–400', label: 'Poor', color: '#ef4444' },
                      { range: '401–700', label: 'Fair', color: '#f59e0b' },
                      { range: '701–850', label: 'Good', color: '#10b981' },
                      { range: '851–1000', label: 'Excellent', color: '#14b8a6' },
                    ].map(b => (
                      <div key={b.range} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '5px 0',
                        opacity: color.label === b.label ? 1 : 0.45,
                        transition: 'opacity 0.3s',
                      }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: b.color, flexShrink: 0 }} />
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, flex: 1 }}>{b.range}</span>
                        <span style={{ color: b.color, fontSize: 11, fontWeight: 700 }}>{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Factor summary bars */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 24,
                  padding: '24px',
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: 15, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Activity size={16} color="#14b8a6" />
                    Score Breakdown
                  </div>

                  {factors.map((f, i) => (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.09 }}
                      style={{ marginBottom: 18 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <f.icon size={13} color={f.color} />
                          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600 }}>{f.label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>×{f.weight}%</span>
                          <span style={{ color: f.color, fontSize: 13, fontWeight: 800 }}>{f.value}%</span>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 7, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${f.value}%` }}
                          transition={{ duration: 1.2, delay: 0.15 + i * 0.09, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            borderRadius: 99,
                            background: `linear-gradient(90deg, ${f.color}, ${f.color}99)`,
                            boxShadow: `0 0 8px ${f.color}66`,
                          }}
                        />
                      </div>

                      {/* Contribution text */}
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginTop: 3 }}>
                        Contributes {Math.round((f.value * f.weight) / 100)} pts to total
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick AI tip strip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  marginTop: 20,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(20,184,166,0.15))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 18,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Sparkles size={18} color="#6366f1" />
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#6366f1', fontWeight: 700, fontSize: 12 }}>AI INSIGHT: </span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                    {petName}'s score is {trendDiff >= 0 ? 'improving' : 'declining'}. Focus on{' '}
                    {factors.sort((a, b) => a.value - b.value)[0].label.toLowerCase()} to see the biggest jump.
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('plan')}
                  style={{
                    border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                    padding: '6px 14px', borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  View Plan <ChevronRight size={12} />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ── Tab: Factors ── */}
          {activeTab === 'factors' && (
            <motion.div
              key="factors"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                {factors.map((f, i) => <FactorCard key={f.label} factor={f} index={i} />)}
              </div>

              {/* Detailed breakdown table */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Shield size={15} color="#14b8a6" />
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 13 }}>Detailed Factor Analysis</span>
                </div>
                {factors.map((f, i) => {
                  const contribution = Math.round((f.value * f.weight) / 100);
                  return (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '14px 20px',
                        borderBottom: i < factors.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <f.icon size={16} color={f.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 700 }}>{f.label}</div>
                        <div style={{ color: f.color, fontSize: 11, marginTop: 1 }}>{f.status}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Weight</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700 }}>{f.weight}%</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Score</div>
                        <div style={{ color: f.color, fontSize: 14, fontWeight: 800 }}>{f.value}%</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Points</div>
                        <div style={{
                          color: '#fff', fontSize: 13, fontWeight: 800,
                          background: `${f.color}22`, borderRadius: 8, padding: '2px 10px',
                        }}>+{contribution}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Tab: History ── */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 24,
                padding: '28px',
                marginBottom: 20,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
                      📈 6-Month Score Trend
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                      Health credit score progression for {petName}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: `${trendColor}15`, borderRadius: 10,
                    padding: '6px 14px', border: `1px solid ${trendColor}30`,
                  }}>
                    <TrendIcon size={14} color={trendColor} />
                    <span style={{ color: trendColor, fontSize: 12, fontWeight: 700 }}>
                      {trendDiff > 0 ? '+' : ''}{trendDiff} this month
                    </span>
                  </div>
                </div>

                <TrendChart data={scoreHistory} color={color.primary} />
              </div>

              {/* Monthly breakdown cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {MONTHS.map((month, i) => {
                  const s = scoreHistory[i];
                  const c = getScoreColor(s);
                  const isLatest = i === MONTHS.length - 1;
                  return (
                    <motion.div
                      key={month}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07 }}
                      style={{
                        background: isLatest ? `linear-gradient(135deg, ${c.primary}22, rgba(255,255,255,0.05))` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isLatest ? c.primary + '44' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 16,
                        padding: '16px',
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      {isLatest && (
                        <div style={{
                          position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                          background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                          color: '#fff', fontSize: 9, fontWeight: 700,
                          padding: '2px 10px', borderRadius: 99,
                        }}>
                          CURRENT
                        </div>
                      )}
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 6 }}>{month} 2026</div>
                      <div style={{ color: c.primary, fontSize: 28, fontWeight: 900 }}>{s}</div>
                      <div style={{ color: c.primary, fontSize: 10, fontWeight: 700, marginTop: 4 }}>{c.label}</div>
                      {i > 0 && (
                        <div style={{
                          color: scoreHistory[i] >= scoreHistory[i - 1] ? '#10b981' : '#ef4444',
                          fontSize: 10, marginTop: 4, fontWeight: 600,
                        }}>
                          {scoreHistory[i] >= scoreHistory[i - 1] ? '▲' : '▼'} {Math.abs(scoreHistory[i] - scoreHistory[i - 1])} pts
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Tab: AI Plan ── */}
          {activeTab === 'plan' && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Plan header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(20,184,166,0.2))',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 20,
                padding: '20px 24px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}>
                <div style={{ fontSize: 40, animation: 'phcp-float 3s ease-in-out infinite' }}>🤖</div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 17, marginBottom: 4 }}>
                    AI Improvement Plan for {petName}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                    Personalized recommendations to reach {Math.min(1000, creditScore + 100)}+ score in 30 days
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ color: '#14b8a6', fontSize: 28, fontWeight: 900 }}>+{Math.min(100, 1000 - creditScore)}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>potential points</div>
                </div>
              </div>

              {/* Tips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {tips.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${tip.color}33`,
                      borderLeft: `3px solid ${tip.color}`,
                      borderRadius: 16,
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                    }}
                  >
                    <div style={{ fontSize: 32 }}>{tip.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: tip.color, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                        {tip.title}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.5 }}>
                        {tip.desc}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        border: `1px solid ${tip.color}`,
                        cursor: 'pointer',
                        background: `${tip.color}15`,
                        color: tip.color,
                        fontSize: 11, fontWeight: 700,
                        padding: '7px 14px', borderRadius: 8,
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tip.action}
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Projected Score */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  marginTop: 20,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 18,
                  padding: '20px 24px',
                }}
              >
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 1, fontWeight: 700, marginBottom: 12 }}>
                  PROJECTED IMPROVEMENT IN 30 DAYS
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: color.primary, fontSize: 32, fontWeight: 900 }}>{creditScore}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Current</div>
                  </div>
                  <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${(creditScore / Math.min(1000, creditScore + 100)) * 100}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${color.primary}, #14b8a6)`,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#14b8a6', fontSize: 32, fontWeight: 900 }}>
                      {Math.min(1000, creditScore + 100)}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Target</div>
                  </div>
                </div>

                <div style={{
                  marginTop: 14, display: 'flex', gap: 12,
                  flexWrap: 'wrap',
                }}>
                  {[
                    { label: 'Complete missed vaccinations', pts: '+40' },
                    { label: 'Daily 30-min walks for 2 weeks', pts: '+25' },
                    { label: 'Consistent hydration logging', pts: '+20' },
                    { label: 'Medication on schedule', pts: '+15' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,0.05)', borderRadius: 10,
                        padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <Zap size={11} color="#f59e0b" />
                      <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>{item.label}</span>
                      <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700 }}>{item.pts}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
