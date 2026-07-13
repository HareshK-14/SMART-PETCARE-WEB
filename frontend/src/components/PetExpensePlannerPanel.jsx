import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, ShoppingCart, Stethoscope, Scissors, Pill,
  Package, AlertTriangle, TrendingUp, TrendingDown, Plus,
  Edit3, Trash2, Download, Brain, Sparkles, ChevronRight,
  PiggyBank, Target, BarChart2, Receipt, X, Check
} from 'lucide-react';
import { db, useSync } from '../utils/dataBridge';

/* ── Global styles ── */
const CSS = `
@keyframes pepp-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes pepp-pulse  { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes pepp-glow   { 0%,100%{box-shadow:0 0 20px #6366f133} 50%{box-shadow:0 0 40px #14b8a644} }
@keyframes pepp-spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes pepp-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
`;
if (typeof document !== 'undefined' && !document.getElementById('pepp-styles')) {
  const s = document.createElement('style');
  s.id = 'pepp-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ── Constants ── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const CATEGORY_CONFIG = [
  { id: 'food',      label: 'Food & Nutrition', icon: ShoppingCart, color: '#6366f1', emoji: '🍖', budget: 3500 },
  { id: 'vet',       label: 'Vet Visits',       icon: Stethoscope,  color: '#10b981', emoji: '🏥', budget: 2500 },
  { id: 'grooming',  label: 'Grooming',          icon: Scissors,     color: '#f59e0b', emoji: '✂️', budget: 1200 },
  { id: 'meds',      label: 'Medications',       icon: Pill,         color: '#ec4899', emoji: '💊', budget: 1000 },
  { id: 'accessories',label:'Accessories',       icon: Package,      color: '#8b5cf6', emoji: '🎀', budget: 800  },
  { id: 'emergency', label: 'Emergency Fund',    icon: AlertTriangle,color: '#ef4444', emoji: '🚨', budget: 5000 },
];

/* ── SVG Donut Chart ── */
function DonutChart({ categories, total, budget }) {
  const size = 200;
  const strokeWidth = 28;
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const [hovered, setHovered] = useState(null);

  let offset = 0;
  const segments = categories.map(cat => {
    const pct = total > 0 ? cat.spent / total : 0;
    const len = pct * circ;
    const seg = { ...cat, pct, len, offset };
    offset += len;
    return seg;
  });

  const usedPct = Math.min(100, Math.round((total / budget) * 100));

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={size} height={size}>
        <defs>
          {categories.map(cat => (
            <filter key={cat.id} id={`gf-${cat.id}`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
        </defs>

        {/* Background circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />

        {/* Segments */}
        {segments.map((seg, i) => (
          <motion.circle
            key={seg.id}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={hovered === seg.id ? strokeWidth + 6 : strokeWidth}
            strokeDasharray={`${seg.len} ${circ - seg.len}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${seg.len} ${circ - seg.len}` }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
            onHoverStart={() => setHovered(seg.id)}
            onHoverEnd={() => setHovered(null)}
            style={{
              cursor: 'pointer',
              filter: hovered === seg.id ? `drop-shadow(0 0 8px ${seg.color})` : 'none',
              transition: 'stroke-width 0.2s, filter 0.2s',
            }}
          />
        ))}
      </svg>

      {/* Center label */}
      <div style={{
        position: 'absolute',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        {hovered ? (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>{categories.find(c => c.id === hovered)?.emoji}</div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>
              ₹{(categories.find(c => c.id === hovered)?.spent || 0).toLocaleString()}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>
              {categories.find(c => c.id === hovered)?.label}
            </div>
          </motion.div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 1 }}>SPENT</div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 900, lineHeight: 1 }}>
              ₹{total.toLocaleString()}
            </div>
            <div style={{
              color: usedPct > 90 ? '#ef4444' : usedPct > 70 ? '#f59e0b' : '#10b981',
              fontSize: 11, fontWeight: 700, marginTop: 2,
            }}>
              {usedPct}% of budget
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Animated Progress Bar ── */
function BudgetBar({ spent, budget, color, animated = true }) {
  const pct = Math.min(100, Math.round((spent / budget) * 100));
  const overBudget = spent > budget;

  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 8, overflow: 'hidden', position: 'relative' }}>
      <motion.div
        initial={animated ? { width: 0 } : { width: `${pct}%` }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          height: '100%',
          borderRadius: 99,
          background: overBudget
            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
            : `linear-gradient(90deg, ${color}, ${color}99)`,
          boxShadow: `0 0 8px ${overBudget ? '#ef444466' : color + '66'}`,
        }}
      />
    </div>
  );
}

/* ── Monthly Trend Bar Chart ── */
function MonthlyBarChart({ data, color }) {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 90 }}>
      {data.map((d, i) => {
        const pct = d.total / max;
        return (
          <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8 }}>₹{d.total >= 1000 ? (d.total / 1000).toFixed(1) + 'k' : d.total}</div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${pct * 70}px` }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
              style={{
                width: '100%',
                borderRadius: '4px 4px 0 0',
                background: i === data.length - 1
                  ? `linear-gradient(180deg, ${color}, ${color}99)`
                  : `${color}55`,
                boxShadow: i === data.length - 1 ? `0 0 10px ${color}44` : 'none',
              }}
            />
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{d.month}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Add / Edit Expense Form ── */
function ExpenseForm({ onClose, onSave, editItem }) {
  const [form, setForm] = useState(editItem || {
    description: '', category: 'food', amount: '', date: new Date().toISOString().slice(0, 10), notes: '',
  });

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    onSave({ ...form, amount: Number(form.amount), id: form.id || Date.now().toString() });
    onClose();
  };

  const cat = CATEGORY_CONFIG.find(c => c.id === form.category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        style={{
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 24,
          padding: 28,
          width: '100%', maxWidth: 480,
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: 0 }}>
              {editItem ? '✏️ Edit Expense' : '➕ Add Expense'}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 4 }}>
              Log a new pet expense entry
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Category */}
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 1, fontWeight: 700, display: 'block', marginBottom: 8 }}>CATEGORY</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {CATEGORY_CONFIG.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleChange('category', c.id)}
                  style={{
                    border: `1px solid ${form.category === c.id ? c.color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 10, padding: '8px 6px', cursor: 'pointer',
                    background: form.category === c.id ? `${c.color}20` : 'rgba(255,255,255,0.04)',
                    color: form.category === c.id ? c.color : 'rgba(255,255,255,0.5)',
                    fontSize: 10, fontWeight: 700, textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  {c.emoji} {c.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 1, fontWeight: 700, display: 'block', marginBottom: 6 }}>DESCRIPTION</label>
            <input
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="e.g. Royal Canin Adult 10kg"
              required
              style={{
                width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Amount + Date row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 1, fontWeight: 700, display: 'block', marginBottom: 6 }}>AMOUNT (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={e => handleChange('amount', e.target.value)}
                placeholder="0"
                min="0"
                required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 1, fontWeight: 700, display: 'block', marginBottom: 6 }}>DATE</label>
              <input
                type="date"
                value={form.date}
                onChange={e => handleChange('date', e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13,
                  outline: 'none', boxSizing: 'border-box', colorScheme: 'dark',
                }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 1, fontWeight: 700, display: 'block', marginBottom: 6 }}>NOTES (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder="Add any notes..."
              rows={2}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13,
                outline: 'none', resize: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
                padding: '10px', cursor: 'pointer', background: 'transparent',
                color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 2, border: 'none', borderRadius: 12, padding: '10px',
                cursor: 'pointer',
                background: cat ? `linear-gradient(135deg, ${cat.color}, ${cat.color}99)` : 'linear-gradient(135deg, #6366f1, #14b8a6)',
                color: '#fff', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Check size={14} />
              {editItem ? 'Save Changes' : 'Add Expense'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function PetExpensePlannerPanel() {
  const { data } = useSync(['ownerOrders', 'allPrescriptions', 'ownerPets']);

  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [expenses, setExpenses] = useState(() => db.get('petExpenses') || []);

  /* ── Derive base data from localStorage seeds ── */
  const orders = data.ownerOrders || [];
  const prescriptions = data.allPrescriptions || [];
  const petName = (data.ownerPets || [])[0]?.name || 'Bruno';

  /* ── Build expense list from orders + prescriptions + custom ── */
  const allExpenses = [
    ...orders.map(o => ({
      id: 'o-' + o.id,
      description: o.item,
      category: o.item.toLowerCase().includes('bed') || o.item.toLowerCase().includes('comfort') ? 'accessories' : 'food',
      amount: o.total,
      date: o.date,
      notes: `Order for ${o.pet}`,
      source: 'order',
    })),
    ...prescriptions.map(rx => ({
      id: 'rx-' + rx.id,
      description: rx.medication,
      category: 'meds',
      amount: Math.round(rx.days * 18),
      date: rx.date,
      notes: `Prescribed by ${rx.vet}`,
      source: 'prescription',
    })),
    ...expenses.filter(e => !e.id?.startsWith('o-') && !e.id?.startsWith('rx-')),
  ];

  /* ── Category totals ── */
  const totalBudget = CATEGORY_CONFIG.reduce((sum, c) => sum + c.budget, 0);

  const categories = CATEGORY_CONFIG.map(cat => {
    const spent = allExpenses
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { ...cat, spent };
  });

  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  /* ── Monthly trend (simulated last 6 months) ── */
  const monthlyData = MONTHS.map((month, i) => ({
    month,
    total: i === 5 ? totalSpent : Math.round(totalSpent * (0.6 + i * 0.07) + Math.random() * 500),
  }));

  /* ── AI Savings Tips ── */
  const topCat = [...categories].sort((a, b) => b.spent - a.spent)[0];
  const overBudgetCats = categories.filter(c => c.spent > c.budget);

  const savingsTips = [
    {
      icon: '💰',
      color: '#10b981',
      title: `Bulk Buy ${topCat.label}`,
      desc: `${petName}'s ${topCat.label.toLowerCase()} is your biggest expense at ₹${topCat.spent.toLocaleString()}. Buying in bulk can save 15–20%.`,
      savings: Math.round(topCat.spent * 0.15),
    },
    {
      icon: '🏥',
      color: '#6366f1',
      title: 'Pet Wellness Plan',
      desc: `Preventive care packages reduce vet bills by 30%. ${petName} has ${prescriptions.length} active prescriptions — ask about bundled plans.`,
      savings: Math.round(categories.find(c => c.id === 'vet')?.spent * 0.3 || 500),
    },
    {
      icon: '📋',
      color: '#f59e0b',
      title: 'Set Up Emergency Fund',
      desc: `Only ₹${categories.find(c => c.id === 'emergency')?.spent || 0} in emergency fund. Aim for ₹5,000 to avoid unexpected financial stress.`,
      savings: 0,
      isCta: true,
    },
  ];

  /* ── Handlers ── */
  const handleSave = (item) => {
    const updated = expenses.some(e => e.id === item.id)
      ? expenses.map(e => e.id === item.id ? item : e)
      : [...expenses, item];
    setExpenses(updated);
    db.set('petExpenses', updated);
  };

  const handleDelete = (id) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    db.set('petExpenses', updated);
  };

  const handleExport = () => {
    const lines = [
      `PetCare AI — ${petName}'s Expense Summary`,
      `Generated: ${new Date().toLocaleDateString()}`,
      '─'.repeat(40),
      `Total Budget: ₹${totalBudget.toLocaleString()}`,
      `Total Spent: ₹${totalSpent.toLocaleString()}`,
      `Remaining: ₹${(totalBudget - totalSpent).toLocaleString()}`,
      '',
      'BY CATEGORY:',
      ...categories.map(c => `  ${c.emoji} ${c.label}: ₹${c.spent.toLocaleString()} / ₹${c.budget.toLocaleString()}`),
      '',
      'RECENT TRANSACTIONS:',
      ...allExpenses.slice(0, 10).map(e => `  • ${e.date} | ${e.description} | ₹${e.amount}`),
    ];
    alert(lines.join('\n'));
  };

  const remainingBudget = totalBudget - totalSpent;
  const budgetPct = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0d1b2a 100%)',
      fontFamily: "'Inter', sans-serif",
      padding: '28px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* BG blobs */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, #10b98115, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #f59e0b0d, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: 960, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #059669, #10b981, #6366f1)',
            borderRadius: 24,
            padding: '24px 28px',
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -20, right: -20, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: '35%', width: 200, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
            <div style={{ fontSize: 36, animation: 'pepp-float 3s ease-in-out infinite' }}>💰</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 99, padding: '3px 12px', fontSize: 11, color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
                  AI SMART PLANNER
                </span>
              </div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, margin: 0 }}>
                AI Pet Expense Planner
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 }}>
                Budget analytics & smart savings for {petName}
              </p>
            </div>

            {/* Header stats */}
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'Total Budget', value: `₹${(totalBudget / 1000).toFixed(0)}k`, color: '#fff' },
                { label: 'Spent', value: `₹${(totalSpent / 1000).toFixed(1)}k`, color: budgetPct > 90 ? '#fca5a5' : '#fff' },
                { label: 'Remaining', value: `₹${(remainingBudget / 1000).toFixed(1)}k`, color: '#6ee7b7' },
                { label: 'Transactions', value: allExpenses.length, color: '#fff' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ color: s.color, fontSize: 20, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall budget bar */}
          <div style={{ marginTop: 16, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Monthly Budget Usage</span>
              <span style={{ color: budgetPct > 90 ? '#fca5a5' : '#fff', fontSize: 11, fontWeight: 700 }}>{budgetPct}%</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 99, height: 10, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${budgetPct}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: 99,
                  background: budgetPct > 90
                    ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                    : 'rgba(255,255,255,0.7)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Action bar ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, flex: 1 }}>
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'categories', label: '🗂️ Categories' },
              { id: 'transactions', label: '📋 Transactions' },
              { id: 'tips', label: '🤖 AI Savings' },
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  cursor: 'pointer', borderRadius: 12,
                  padding: '9px 16px', fontSize: 12, fontWeight: 700,
                  transition: 'all 0.2s',
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, #059669, #6366f1)'
                    : 'rgba(255,255,255,0.07)',
                  color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: activeTab === tab.id ? '0 4px 18px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              style={{
                border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
                fontSize: 12, fontWeight: 700, padding: '9px 16px', borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Download size={13} /> Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditItem(null); setShowForm(true); }}
              style={{
                border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: '#fff', fontSize: 12, fontWeight: 700,
                padding: '9px 16px', borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
              }}
            >
              <Plus size={13} /> Add Expense
            </motion.button>
          </div>
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, marginBottom: 20 }}>

                {/* Donut chart panel */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
                  padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  animation: 'pepp-glow 4s ease-in-out infinite',
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, letterSpacing: 1, fontWeight: 700, marginBottom: 16 }}>
                    EXPENSE DISTRIBUTION
                  </div>
                  <DonutChart categories={categories} total={totalSpent} budget={totalBudget} />

                  {/* Legend */}
                  <div style={{ width: '100%', marginTop: 16 }}>
                    {categories.filter(c => c.spent > 0).map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, flex: 1 }}>{c.label}</span>
                        <span style={{ color: c.color, fontSize: 10, fontWeight: 700 }}>₹{c.spent.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category bars */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '24px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <BarChart2 size={16} color="#10b981" />
                      Budget vs Spent
                    </div>
                  </div>

                  {categories.map((cat, i) => {
                    const pct = Math.min(100, Math.round((cat.spent / cat.budget) * 100));
                    const over = cat.spent > cat.budget;
                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.09 }}
                        style={{ marginBottom: 18 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                          <span style={{ fontSize: 14 }}>{cat.emoji}</span>
                          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700, flex: 1 }}>{cat.label}</span>
                          <span style={{ color: over ? '#ef4444' : 'rgba(255,255,255,0.5)', fontSize: 10 }}>
                            ₹{cat.spent.toLocaleString()} / ₹{cat.budget.toLocaleString()}
                          </span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8,
                            background: over ? '#ef444420' : pct > 80 ? '#f59e0b20' : '#10b98120',
                            color: over ? '#ef4444' : pct > 80 ? '#f59e0b' : '#10b981',
                          }}>
                            {pct}%
                          </span>
                        </div>
                        <BudgetBar spent={cat.spent} budget={cat.budget} color={cat.color} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly trend */}
              <div style={{
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={16} color="#6366f1" />
                    6-Month Spending Trend
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                    Avg: ₹{Math.round(monthlyData.reduce((s, d) => s + d.total, 0) / 6).toLocaleString()}/mo
                  </div>
                </div>
                <MonthlyBarChart data={monthlyData} color="#6366f1" />
              </div>
            </motion.div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {categories.map((cat, i) => {
                  const pct = Math.min(100, Math.round((cat.spent / cat.budget) * 100));
                  const over = cat.spent > cat.budget;
                  const remaining = cat.budget - cat.spent;
                  const catTransactions = allExpenses.filter(e => e.category === cat.id);

                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: `linear-gradient(135deg, ${cat.color}12, rgba(255,255,255,0.04))`,
                        border: `1px solid ${cat.color}${over ? '66' : '30'}`,
                        borderRadius: 20,
                        padding: '20px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Over-budget badge */}
                      {over && (
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          style={{
                            position: 'absolute', top: 14, right: 14,
                            background: '#ef444425', border: '1px solid #ef444455',
                            color: '#ef4444', fontSize: 9, fontWeight: 700,
                            padding: '2px 8px', borderRadius: 99,
                          }}
                        >
                          ⚠️ OVER BUDGET
                        </motion.div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 14,
                          background: `${cat.color}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 22,
                          border: `1px solid ${cat.color}40`,
                        }}>
                          {cat.emoji}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{cat.label}</div>
                          <div style={{ color: cat.color, fontSize: 11, marginTop: 2 }}>
                            {catTransactions.length} transaction{catTransactions.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Amounts */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                        {[
                          { label: 'Spent', val: `₹${cat.spent.toLocaleString()}`, color: cat.color },
                          { label: 'Budget', val: `₹${cat.budget.toLocaleString()}`, color: 'rgba(255,255,255,0.6)' },
                          { label: remaining >= 0 ? 'Left' : 'Over', val: `₹${Math.abs(remaining).toLocaleString()}`, color: remaining >= 0 ? '#10b981' : '#ef4444' },
                        ].map(item => (
                          <div key={item.label} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '8px 4px' }}>
                            <div style={{ color: item.color, fontSize: 13, fontWeight: 800 }}>{item.val}</div>
                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, marginTop: 2 }}>{item.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: 8 }}>
                        <BudgetBar spent={cat.spent} budget={cat.budget} color={cat.color} />
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, textAlign: 'right' }}>
                        {pct}% of budget used
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 24,
                overflow: 'hidden',
              }}>
                {/* Table header */}
                <div style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 140px 110px 100px 80px',
                  gap: 12,
                }}>
                  {['Description', 'Category', 'Date', 'Amount', 'Actions'].map(h => (
                    <div key={h} style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{h}</div>
                  ))}
                </div>

                {/* Rows */}
                <div style={{ maxHeight: 480, overflowY: 'auto' }}>
                  {allExpenses.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
                      No transactions yet. Add an expense to get started.
                    </div>
                  ) : (
                    allExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map((exp, i) => {
                      const cat = CATEGORY_CONFIG.find(c => c.id === exp.category);
                      const isCustom = !exp.source;
                      return (
                        <motion.div
                          key={exp.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          style={{
                            padding: '13px 20px',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            display: 'grid',
                            gridTemplateColumns: '1fr 140px 110px 100px 80px',
                            gap: 12,
                            alignItems: 'center',
                            transition: 'background 0.2s',
                          }}
                          onHoverStart={e => e.target.style.background = 'rgba(255,255,255,0.03)'}
                          onHoverEnd={e => e.target.style.background = 'transparent'}
                        >
                          <div>
                            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600 }}>{exp.description}</div>
                            {exp.notes && <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 2 }}>{exp.notes}</div>}
                          </div>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            background: `${cat?.color || '#666'}18`,
                            padding: '3px 10px', borderRadius: 8,
                            border: `1px solid ${cat?.color || '#666'}30`,
                          }}>
                            <span style={{ fontSize: 11 }}>{cat?.emoji}</span>
                            <span style={{ color: cat?.color || '#fff', fontSize: 10, fontWeight: 700 }}>{cat?.label.split(' ')[0]}</span>
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{exp.date}</div>
                          <div style={{ color: cat?.color || '#fff', fontSize: 14, fontWeight: 800 }}>
                            ₹{exp.amount.toLocaleString()}
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {isCustom && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => { setEditItem(exp); setShowForm(true); }}
                                  style={{
                                    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                                    borderRadius: 8, width: 28, height: 28, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <Edit3 size={11} color="#6366f1" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(exp.id)}
                                  style={{
                                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                    borderRadius: 8, width: 28, height: 28, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <Trash2 size={11} color="#ef4444" />
                                </motion.button>
                              </>
                            )}
                            {!isCustom && (
                              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}>auto</span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Footer summary */}
                <div style={{
                  padding: '12px 20px',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                    {allExpenses.length} total transactions
                  </span>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: 13 }}>
                    Total: ₹{totalSpent.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Savings Tips Tab */}
          {activeTab === 'tips' && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* AI Header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(16,185,129,0.15))',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 20, padding: '20px 24px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ fontSize: 40, animation: 'pepp-float 3s ease-in-out infinite' }}>🤖</div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 17, marginBottom: 4 }}>
                    AI Savings Engine
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                    Personalized tips to save ₹{savingsTips.reduce((s, t) => s + (t.savings || 0), 0).toLocaleString()} this month
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ color: '#10b981', fontSize: 28, fontWeight: 900 }}>
                    {overBudgetCats.length}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>
                    {overBudgetCats.length === 1 ? 'category' : 'categories'} over budget
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {savingsTips.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    style={{
                      background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
                      border: `1px solid ${tip.color}30`,
                      borderLeft: `4px solid ${tip.color}`,
                      borderRadius: 16, padding: '20px',
                      display: 'flex', alignItems: 'flex-start', gap: 16,
                    }}
                  >
                    <div style={{ fontSize: 32, flexShrink: 0 }}>{tip.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: tip.color, fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
                        {tip.title}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.5 }}>
                        {tip.desc}
                      </div>
                    </div>
                    {tip.savings > 0 && (
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ color: '#10b981', fontSize: 20, fontWeight: 900 }}>
                          -₹{tip.savings.toLocaleString()}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>potential savings</div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Over-budget categories callout */}
              {overBudgetCats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: 18, padding: '18px 20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <AlertTriangle size={16} color="#ef4444" />
                    <span style={{ color: '#ef4444', fontWeight: 800, fontSize: 14 }}>Over-Budget Alert</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {overBudgetCats.map(cat => (
                      <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 16 }}>{cat.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700 }}>{cat.label}</div>
                          <BudgetBar spent={cat.spent} budget={cat.budget} color={cat.color} animated={false} />
                        </div>
                        <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          +₹{(cat.spent - cat.budget).toLocaleString()} over
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Budget summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{
                  marginTop: 20,
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
                }}
              >
                {[
                  { label: 'Total Budget', value: `₹${totalBudget.toLocaleString()}`, icon: Target, color: '#6366f1' },
                  { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: Receipt, color: budgetPct > 90 ? '#ef4444' : '#10b981' },
                  { label: 'Remaining', value: `₹${(totalBudget - totalSpent).toLocaleString()}`, icon: PiggyBank, color: '#f59e0b' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.65 + i * 0.07 }}
                    style={{
                      background: `${item.color}12`, border: `1px solid ${item.color}30`,
                      borderRadius: 16, padding: '18px',
                      textAlign: 'center',
                    }}
                  >
                    <item.icon size={22} color={item.color} style={{ marginBottom: 8 }} />
                    <div style={{ color: item.color, fontSize: 22, fontWeight: 900 }}>{item.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 4 }}>{item.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Expense Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <ExpenseForm
            onClose={() => { setShowForm(false); setEditItem(null); }}
            onSave={handleSave}
            editItem={editItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
