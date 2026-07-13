import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, TrendingUp, BarChart2, AlertTriangle,
  DollarSign, Star, Package, ChevronUp, ChevronDown,
  Search, Shield, Zap, Award
} from 'lucide-react';
import { db, useSync } from '../utils/dataBridge';

/* ── Static simulation data ───────────────────────────────────── */
const PRODUCT_TABLE = [
  { id:'pr1', name:'Royal Canin Adult 10kg',  category:'Food',         sales:342, rating:4.8, revenue:825600, growth: 12.4, stock:89 },
  { id:'pr2', name:'Pet Comfort Bed L',        category:'Accessories',  sales:189, rating:4.6, revenue:340200, growth:  8.1, stock:34 },
  { id:'pr3', name:'Whiskas Tuna 12-Pack',     category:'Food',         sales:512, rating:4.5, revenue:491520, growth: 21.3, stock:156},
  { id:'pr4', name:'ProSense Flea Collar',     category:'Healthcare',   sales:276, rating:4.3, revenue:138000, growth:  5.7, stock:67 },
  { id:'pr5', name:'Drools Puppy Starter',     category:'Food',         sales:198, rating:4.7, revenue:297000, growth: 18.9, stock:45 },
  { id:'pr6', name:'Auto-Fill Water Fountain', category:'Accessories',  sales:134, rating:4.9, revenue:200920, growth: 31.0, stock:28 },
  { id:'pr7', name:'VetriScience Omega-3',     category:'Supplements',  sales:223, rating:4.4, revenue:178400, growth:  9.2, stock:99 },
];

const CATEGORIES = [
  { name:'Food',        revenue:1614120, pct:52, color:'#8b5cf6' },
  { name:'Accessories', revenue: 541120, pct:18, color:'#14b8a6' },
  { name:'Healthcare',  revenue: 456000, pct:15, color:'#6366f1' },
  { name:'Supplements', revenue: 310640, pct:10, color:'#f59e0b' },
  { name:'Toys',        revenue: 154200, pct: 5, color:'#ec4899' },
];

const TOP_SELLERS = [
  { name:'Priya S.',  product:'Royal Canin Bundle',    amount:128400, avatar:'PS', color:'#8b5cf6' },
  { name:'Harish K.', product:'Pet Wellness Pack',     amount: 94300, avatar:'HK', color:'#14b8a6' },
  { name:'Renu M.',   product:'Flea Control Bundle',   amount: 78200, avatar:'RM', color:'#6366f1' },
  { name:'Ajay V.',   product:'Puppy Starter Kit',     amount: 67100, avatar:'AV', color:'#f59e0b' },
  { name:'Sneha P.',  product:'Hydration Smart Pack',  amount: 55900, avatar:'SP', color:'#ec4899' },
];

const TRENDING_SEARCHES = [
  { term:'royal canin',      weight:5 }, { term:'flea collar',    weight:4 },
  { term:'puppy food',       weight:4 }, { term:'cat litter',     weight:3 },
  { term:'dog bed',          weight:3 }, { term:'omega 3',        weight:2 },
  { term:'water fountain',   weight:4 }, { term:'tick removal',   weight:2 },
  { term:'pet carrier',      weight:3 }, { term:'dental chews',   weight:2 },
  { term:'vet consultation', weight:1 }, { term:'microchip tag',  weight:2 },
];

const FRAUD_ALERTS = [
  { id:'fa1', txId:'TXN-8821', amount:14400, risk:87, flag:'Unusual velocity — 12 orders/hr', user:'uid_4421', time:'14m ago', status:'review' },
  { id:'fa2', txId:'TXN-7755', amount:6800,  risk:62, flag:'New account high-value order',    user:'uid_9934', time:'2h ago',  status:'review' },
  { id:'fa3', txId:'TXN-6609', amount:3200,  risk:44, flag:'Mismatched billing/shipping ZIP', user:'uid_2217', time:'5h ago',  status:'cleared'},
];

const FORECAST = [
  { month:'Jul 2026', low:2800000, mid:3100000, high:3500000, color:'#8b5cf6' },
  { month:'Aug 2026', low:2950000, mid:3350000, high:3800000, color:'#6366f1' },
  { month:'Sep 2026', low:3200000, mid:3700000, high:4200000, color:'#14b8a6' },
];

/* ── Utility ──────────────────────────────────────────────────── */
const fmt = (n) => n >= 1_000_000 ? `₹${(n/1_000_000).toFixed(2)}M` : n >= 1_000 ? `₹${(n/1000).toFixed(1)}K` : `₹${n}`;
const lerp = (a, b, t) => a + (b - a) * t;

/* ── Counter animation ────────────────────────────────────────── */
function AnimCounter({ target, prefix = '', suffix = '', duration = 1600 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start;
    const run = ts => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(lerp(0, target, ease)));
      if (t < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return <span>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>;
}

/* ── Mini sparkline ───────────────────────────────────────────── */
function Sparkline({ data, color }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * 100},${40 - ((v - min) / (max - min || 1)) * 36}`
  ).join(' ');
  return (
    <svg viewBox="0 0 100 40" className="w-20 h-8">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts.split(' ').at(-1)?.split(',')[0]} cy={pts.split(' ').at(-1)?.split(',')[1]} r="2.5" fill={color}/>
    </svg>
  );
}

/* ── Main Component ───────────────────────────────────────────── */
export default function InnovationMarketplacePanel() {
  const { data }         = useSync(['ownerOrders']);
  const [sortCol, setSortCol]     = useState('revenue');
  const [sortDir, setSortDir]     = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [revealAlert, setRevealAlert] = useState(null);
  const [fraudActions, setFraudActions] = useState({});

  const orders = data.ownerOrders || [];

  /* Derived totals */
  const totalRevenue = PRODUCT_TABLE.reduce((a, p) => a + p.revenue, 0);
  const momGrowth    = 14.7;
  const totalOrders  = PRODUCT_TABLE.reduce((a, p) => a + p.sales, 0);
  const avgOrderVal  = Math.round(totalRevenue / totalOrders);

  /* Sort & filter table */
  const tableData = useMemo(() => {
    let rows = PRODUCT_TABLE.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    rows.sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [sortCol, sortDir, searchTerm]);

  const handleSort = col => {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const handleFraud = (id, action) => {
    setFraudActions(p => ({ ...p, [id]: action }));
  };

  /* Sparkline data per product (simulated weekly) */
  const sparklines = {
    'pr1': [31, 38, 42, 35, 44, 40, 48],
    'pr2': [18, 21, 19, 24, 22, 25, 27],
    'pr3': [40, 52, 48, 55, 60, 58, 68],
    'pr4': [22, 24, 20, 28, 25, 30, 29],
    'pr5': [15, 18, 22, 20, 25, 24, 28],
    'pr6': [8,  10, 12, 15, 14, 18, 22],
    'pr7': [19, 21, 20, 24, 23, 26, 28],
  };

  const colHeaders = [
    { key:'name',     label:'Product'   },
    { key:'category', label:'Category'  },
    { key:'sales',    label:'Sales'     },
    { key:'rating',   label:'Rating'    },
    { key:'revenue',  label:'Revenue'   },
    { key:'growth',   label:'Growth'    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6"
         style={{ background: 'radial-gradient(ellipse at 80% 10%, #1e1040 0%, #0a0a14 50%, #071220 100%)' }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg,#8b5cf6,#14b8a6)' }}>
            <ShoppingCart size={24} className="text-white"/>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Innovation Hub & Marketplace Analytics</h1>
            <p className="text-sm text-purple-400/70">Revenue intelligence · Product performance · Fraud detection</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-purple-300"
             style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
          <Zap size={14}/> ANALYTICS LIVE
        </div>
      </motion.div>

      {/* ── Revenue KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Total Revenue',   value: totalRevenue,  display: fmt(totalRevenue), trend: '+14.7%',  color: '#8b5cf6', up: true  },
          { icon: TrendingUp, label: 'MoM Growth',      value: momGrowth,     display: `${momGrowth}%`,   trend: '+2.1pp',  color: '#14b8a6', up: true  },
          { icon: ShoppingCart,label:'Total Orders',    value: totalOrders,   display: totalOrders.toLocaleString(), trend: '+22%', color:'#6366f1', up:true },
          { icon: Award,      label: 'Avg Order Value', value: avgOrderVal,   display: fmt(avgOrderVal),  trend: '-3.2%',   color: '#f59e0b', up: false },
        ].map(({ icon: Icon, label, value, display, trend, color, up }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${color}25`,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={18} style={{ color }}/>
              </div>
              <span className={`text-[11px] font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${up ? 'text-emerald-400' : 'text-red-400'}`}
                    style={{ background: up ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
                {up ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}{trend}
              </span>
            </div>
            <p className="text-2xl font-black text-white">{display}</p>
            <p className="text-xs text-white/50 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Category Breakdown + Top Sellers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Category animated bars */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 rounded-3xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={18} className="text-purple-400"/>
            <h2 className="font-bold text-white">Category Breakdown</h2>
          </div>
          <div className="space-y-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }}/>
                    <span className="text-sm font-semibold text-white/80">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">{fmt(cat.revenue)}</span>
                    <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.pct}%</span>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-3 rounded-full relative overflow-hidden"
                    style={{ background: `linear-gradient(90deg, ${cat.color}aa, ${cat.color})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: 'easeOut' }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.3, ease: 'linear' }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Donut summary */}
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-white">{fmt(CATEGORIES.reduce((a,c)=>a+c.revenue,0))}</p>
              <p className="text-xs text-white/40 mt-0.5">Total Marketplace Revenue</p>
            </div>
            <svg viewBox="0 0 80 80" width="80" height="80">
              {(() => {
                let cumulative = 0;
                return CATEGORIES.map((cat, i) => {
                  const pct = cat.pct / 100;
                  const start = cumulative * Math.PI * 2 - Math.PI / 2;
                  cumulative += pct;
                  const end = cumulative * Math.PI * 2 - Math.PI / 2;
                  const r = 34, cx = 40, cy = 40;
                  const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
                  const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
                  const lg = pct > 0.5 ? 1 : 0;
                  return (
                    <motion.path
                      key={cat.name}
                      d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2} Z`}
                      fill={cat.color}
                      opacity={0.85}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                      style={{ transformOrigin: '40px 40px' }}
                    />
                  );
                });
              })()}
              <circle cx="40" cy="40" r="18" fill="#0a0a14"/>
              <text x="40" y="44" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">100%</text>
            </svg>
          </div>
        </motion.div>

        {/* Top Sellers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 rounded-3xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(20,184,166,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Star size={18} className="text-teal-400"/>
            <h2 className="font-bold text-white">Top Sellers</h2>
          </div>
          <div className="space-y-3">
            {TOP_SELLERS.map((seller, i) => (
              <motion.div
                key={seller.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${seller.color}20` }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                     style={{ background: `linear-gradient(135deg,${seller.color},${seller.color}99)` }}>
                  {seller.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{seller.name}</p>
                  <p className="text-xs text-white/40 truncate">{seller.product}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black" style={{ color: seller.color }}>{fmt(seller.amount)}</p>
                  <p className="text-[10px] text-white/30">This month</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Product Performance Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-3xl p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <Package size={18} className="text-indigo-400"/>
          <h2 className="font-bold text-white">Product Performance</h2>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-xl"
               style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={14} className="text-white/40"/>
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products…"
              className="bg-transparent text-white/80 text-sm outline-none placeholder-white/30 w-40"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {colHeaders.map(h => (
                  <th key={h.key}
                      onClick={() => handleSort(h.key)}
                      className="text-left pb-3 pr-4 text-white/40 text-xs uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors select-none">
                    <span className="flex items-center gap-1">
                      {h.label}
                      {sortCol === h.key && (sortDir === 'asc' ? <ChevronUp size={10}/> : <ChevronDown size={10}/>)}
                    </span>
                  </th>
                ))}
                <th className="pb-3 text-left text-white/40 text-xs uppercase tracking-wider">7-day</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => {
                const catColor = CATEGORIES.find(c => c.name === row.category)?.color || '#8b5cf6';
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-white">{row.name}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{row.stock} in stock</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${catColor}20`, color: catColor }}>
                        {row.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-white/80 font-semibold">{row.sales.toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-amber-400 fill-amber-400"/>
                        <span className="text-white/80 font-semibold">{row.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-bold text-white">{fmt(row.revenue)}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-bold flex items-center gap-0.5 ${row.growth > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {row.growth > 0 ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
                        {row.growth}%
                      </span>
                    </td>
                    <td className="py-3">
                      <Sparkline data={sparklines[row.id] || [1,2,3,4,5,6,7]} color={catColor}/>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Trending Searches + Revenue Forecast ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Trending Searches Word Cloud */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Search size={18} className="text-purple-400"/>
            <h2 className="font-bold text-white">Trending Searches</h2>
            <span className="ml-auto text-xs text-white/40">Last 24h</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-center min-h-32">
            {TRENDING_SEARCHES.map((t, i) => {
              const colors = ['#8b5cf6','#14b8a6','#6366f1','#f59e0b','#ec4899','#10b981'];
              const color = colors[i % colors.length];
              const sizes = ['text-xs','text-sm','text-base','text-lg','text-xl'];
              const size  = sizes[Math.min(t.weight - 1, sizes.length - 1)];
              return (
                <motion.span
                  key={t.term}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06, type: 'spring' }}
                  whileHover={{ scale: 1.15 }}
                  className={`${size} font-bold px-3 py-1.5 rounded-full cursor-pointer`}
                  style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
                >
                  {t.term}
                </motion.span>
              );
            })}
          </div>
        </motion.div>

        {/* Revenue Forecast */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(20,184,166,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-teal-400"/>
            <h2 className="font-bold text-white">Revenue Forecast</h2>
            <span className="ml-auto text-xs text-white/40">AI-powered · Next 3 months</span>
          </div>
          <div className="space-y-4">
            {FORECAST.map((f, i) => (
              <motion.div
                key={f.month}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.1 }}
                className="p-4 rounded-2xl"
                style={{ background: `${f.color}10`, border: `1px solid ${f.color}25` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="font-bold text-white">{f.month}</p>
                  <div className="text-right">
                    <p className="font-black text-lg" style={{ color: f.color }}>{fmt(f.mid)}</p>
                    <p className="text-[10px] text-white/40">Mid estimate</p>
                  </div>
                </div>
                {/* Range bar */}
                <div className="relative h-2 rounded-full bg-white/10">
                  {/* Range band */}
                  <motion.div
                    className="absolute h-2 rounded-full"
                    style={{
                      left: `${((f.low - 2500000) / 2000000) * 100}%`,
                      width: `${((f.high - f.low) / 2000000) * 100}%`,
                      background: `${f.color}40`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  />
                  {/* Mid marker */}
                  <motion.div
                    className="absolute w-3 h-3 rounded-full -top-0.5"
                    style={{
                      left: `${((f.mid - 2500000) / 2000000) * 100}%`,
                      background: f.color,
                      boxShadow: `0 0 8px ${f.color}`,
                      transform: 'translateX(-50%)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-white/30">Low: {fmt(f.low)}</span>
                  <span className="text-[10px] text-white/30">High: {fmt(f.high)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Fraud Detection Alerts ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239,68,68,0.2)',
          boxShadow: '0 0 30px rgba(239,68,68,0.05)',
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-red-400"/>
          <h2 className="font-bold text-white">Fraud Detection</h2>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="ml-2 text-xs font-bold text-red-400 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"/>
            AI Monitoring Active
          </motion.span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FRAUD_ALERTS.map((alert, i) => {
            const action = fraudActions[alert.id];
            const riskColor = alert.risk >= 80 ? '#ef4444' : alert.risk >= 50 ? '#f97316' : '#f59e0b';
            const cleared = action === 'cleared' || alert.status === 'cleared';
            const blocked = action === 'blocked';
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.1 }}
                className="p-4 rounded-2xl relative overflow-hidden"
                style={{
                  background: cleared ? 'rgba(16,185,129,0.08)' : blocked ? 'rgba(99,102,241,0.08)' : `rgba(239,68,68,0.06)`,
                  border: cleared ? '1px solid rgba(16,185,129,0.3)' : blocked ? '1px solid rgba(99,102,241,0.3)' : `1px solid ${riskColor}30`,
                }}
              >
                {/* Risk score ring */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold text-white/50">{alert.txId}</p>
                    <p className="font-black text-white text-lg mt-0.5">₹{alert.amount.toLocaleString()}</p>
                  </div>
                  <div className="relative w-12 h-12">
                    <svg viewBox="0 0 48 48" width="48" height="48">
                      <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
                      <motion.circle
                        cx="24" cy="24" r="19"
                        fill="none" stroke={riskColor} strokeWidth="3"
                        strokeDasharray={`${alert.risk * 1.194} 119.4`}
                        strokeDashoffset="29.85"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: '0 119.4' }}
                        animate={{ strokeDasharray: `${alert.risk * 1.194} 119.4` }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                      />
                      <text x="24" y="28" textAnchor="middle" fill={riskColor} fontSize="10" fontWeight="900">{alert.risk}</text>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-white/60 mb-3">{alert.flag}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] text-white/30">User: {alert.user}</span>
                  <span className="text-[10px] text-white/30">{alert.time}</span>
                </div>
                {cleared ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <Shield size={12}/> Cleared as safe
                  </div>
                ) : blocked ? (
                  <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold">
                    <Shield size={12}/> Transaction blocked
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFraud(alert.id, 'cleared')}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold text-emerald-400 transition-all hover:opacity-80"
                      style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => handleFraud(alert.id, 'blocked')}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold text-red-400 transition-all hover:opacity-80"
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
                    >
                      Block
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
