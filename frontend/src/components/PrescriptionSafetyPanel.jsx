import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill, AlertTriangle, Shield, CheckCircle, Search,
  ChevronDown, ChevronUp, Zap, Activity, FlaskConical,
  Calculator, BookOpen, X, Info, Clock, RefreshCw
} from 'lucide-react';
import { db, useSync } from '../utils/dataBridge';

// ── Drug Interaction Database (simulated AI knowledge) ─────────────────────
const INTERACTION_DB = {
  'amoxicillin+prednisolone': { level: 'CAUTION', message: 'NSAIDs/Corticosteroids may reduce antibiotic efficacy. Monitor closely.', color: 'yellow' },
  'prednisolone+amoxicillin': { level: 'CAUTION', message: 'NSAIDs/Corticosteroids may reduce antibiotic efficacy. Monitor closely.', color: 'yellow' },
  'amoxicillin+metronidazole': { level: 'SAFE', message: 'Common combination. Synergistic effect for broad-spectrum coverage.', color: 'green' },
  'metronidazole+amoxicillin': { level: 'SAFE', message: 'Common combination. Synergistic effect for broad-spectrum coverage.', color: 'green' },
  'prednisolone+furosemide': { level: 'CAUTION', message: 'May cause electrolyte imbalance. Monitor potassium levels.', color: 'yellow' },
  'furosemide+prednisolone': { level: 'CAUTION', message: 'May cause electrolyte imbalance. Monitor potassium levels.', color: 'yellow' },
  'meloxicam+aspirin': { level: 'INTERACTION DETECTED', message: '⚠️ NSAID combination — high risk of GI bleeding and ulceration. Avoid.', color: 'red' },
  'aspirin+meloxicam': { level: 'INTERACTION DETECTED', message: '⚠️ NSAID combination — high risk of GI bleeding and ulceration. Avoid.', color: 'red' },
  'tramadol+amitriptyline': { level: 'INTERACTION DETECTED', message: '⚠️ Risk of serotonin syndrome. Potentially life-threatening. Do not combine.', color: 'red' },
  'amitriptyline+tramadol': { level: 'INTERACTION DETECTED', message: '⚠️ Risk of serotonin syndrome. Potentially life-threatening. Do not combine.', color: 'red' },
  'enalapril+spironolactone': { level: 'CAUTION', message: 'Hyperkalemia risk. Electrolyte monitoring required weekly.', color: 'yellow' },
  'spironolactone+enalapril': { level: 'CAUTION', message: 'Hyperkalemia risk. Electrolyte monitoring required weekly.', color: 'yellow' },
  'phenobarbital+chloramphenicol': { level: 'INTERACTION DETECTED', message: '⚠️ Chloramphenicol inhibits phenobarbital metabolism. Toxicity risk.', color: 'red' },
};

// ── Pet Drug Database ─────────────────────────────────────────────────────
const DRUG_DATABASE = [
  { name: 'Amoxicillin', class: 'Antibiotic', species: ['Dog', 'Cat'], doseRange: '10–20 mg/kg', frequency: 'q8–12h', maxDays: 14, notes: 'Broad-spectrum. Avoid in penicillin-allergic pets.', caution: false },
  { name: 'Prednisolone', class: 'Corticosteroid', species: ['Dog', 'Cat'], doseRange: '0.5–2 mg/kg', frequency: 'q24h', maxDays: 30, notes: 'Taper dose gradually. Monitor for polyuria/polydipsia.', caution: true },
  { name: 'Metronidazole', class: 'Antibiotic/Antiprotozoal', species: ['Dog', 'Cat'], doseRange: '15–25 mg/kg', frequency: 'q12h', maxDays: 10, notes: 'Effective against anaerobes and Giardia.', caution: false },
  { name: 'Meloxicam', class: 'NSAID', species: ['Dog'], doseRange: '0.1 mg/kg', frequency: 'q24h', maxDays: 14, notes: 'Do NOT use in cats without specialist guidance. GI protection recommended.', caution: true },
  { name: 'Tramadol', class: 'Opioid Analgesic', species: ['Dog', 'Cat'], doseRange: '2–5 mg/kg', frequency: 'q8–12h', maxDays: 7, notes: 'Controlled substance. Monitor for sedation and constipation.', caution: true },
  { name: 'Enalapril', class: 'ACE Inhibitor', species: ['Dog', 'Cat'], doseRange: '0.25–0.5 mg/kg', frequency: 'q12–24h', maxDays: 90, notes: 'Monitor renal function and potassium levels.', caution: true },
  { name: 'Furosemide', class: 'Loop Diuretic', species: ['Dog', 'Cat'], doseRange: '1–4 mg/kg', frequency: 'q8–12h', maxDays: 60, notes: 'Monitor electrolytes. Adequate hydration required.', caution: true },
  { name: 'Phenobarbital', class: 'Anticonvulsant', species: ['Dog', 'Cat'], doseRange: '2.5–5 mg/kg', frequency: 'q12h', maxDays: 365, notes: 'Lifelong therapy often required. Monthly LFT monitoring.', caution: true },
];

// ── Safety badge logic for prescriptions ─────────────────────────────────
function getPrescriptionSafety(rx) {
  const med = rx.medication.toLowerCase();
  if (med.includes('prednisolone') || med.includes('meloxicam') || med.includes('tramadol') || med.includes('phenobarbital')) {
    return { level: 'CAUTION', color: 'yellow', icon: 'caution' };
  }
  if (med.includes('amoxicillin') || med.includes('flea') || med.includes('metronidazole')) {
    return { level: 'SAFE', color: 'green', icon: 'safe' };
  }
  return { level: 'SAFE', color: 'green', icon: 'safe' };
}

// ── Dosage Calculator ─────────────────────────────────────────────────────
function calculateDose(weight, drug) {
  if (!weight || !drug) return null;
  const w = parseFloat(weight);
  if (isNaN(w) || w <= 0) return null;
  const ranges = {
    'Amoxicillin': { low: 10, high: 20, unit: 'mg' },
    'Prednisolone': { low: 0.5, high: 2, unit: 'mg' },
    'Metronidazole': { low: 15, high: 25, unit: 'mg' },
    'Meloxicam': { low: 0.1, high: 0.1, unit: 'mg' },
    'Tramadol': { low: 2, high: 5, unit: 'mg' },
    'Enalapril': { low: 0.25, high: 0.5, unit: 'mg' },
    'Furosemide': { low: 1, high: 4, unit: 'mg' },
    'Phenobarbital': { low: 2.5, high: 5, unit: 'mg' },
  };
  const r = ranges[drug];
  if (!r) return null;
  return { low: (r.low * w).toFixed(2), high: (r.high * w).toFixed(2), unit: r.unit, weight: w };
}

// ── Badge Components ──────────────────────────────────────────────────────
function SafetyBadge({ level, color }) {
  const configs = {
    green: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' },
    yellow: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-amber-500/30' },
    red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-red-500/30' },
  };
  const c = configs[color] || configs.green;
  const Icon = level === 'SAFE' ? CheckCircle : level === 'CAUTION' ? AlertTriangle : Zap;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border shadow-lg ${c.bg} ${c.border} ${c.text} ${c.glow}`}>
      <Icon size={10} />
      {level}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function PrescriptionSafetyPanel() {
  const { data } = useSync(['allPrescriptions']);
  const prescriptions = data.allPrescriptions || [];

  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [interactionResult, setInteractionResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [searchDrug, setSearchDrug] = useState('');
  const [expandedDrug, setExpandedDrug] = useState(null);
  const [calcWeight, setCalcWeight] = useState('');
  const [calcDrug, setCalcDrug] = useState('');
  const [calcResult, setCalcResult] = useState(null);
  const [activeTab, setActiveTab] = useState('checker');

  // Drug Interaction Check
  const handleInteractionCheck = async () => {
    if (!drug1.trim() || !drug2.trim()) return;
    setIsChecking(true);
    setInteractionResult(null);
    await new Promise(r => setTimeout(r, 1200));
    const key = `${drug1.toLowerCase().trim()}+${drug2.toLowerCase().trim()}`;
    const result = INTERACTION_DB[key] || {
      level: 'SAFE',
      message: `No known interactions found between ${drug1} and ${drug2}. Always verify with clinical references.`,
      color: 'green',
    };
    setInteractionResult(result);
    setIsChecking(false);
  };

  // Filtered drug database
  const filteredDrugs = useMemo(() =>
    DRUG_DATABASE.filter(d =>
      d.name.toLowerCase().includes(searchDrug.toLowerCase()) ||
      d.class.toLowerCase().includes(searchDrug.toLowerCase())
    ), [searchDrug]);

  // Flagged prescriptions
  const flaggedPrescriptions = prescriptions.filter(rx => {
    const s = getPrescriptionSafety(rx);
    return s.level !== 'SAFE';
  });

  // Dosage calculation
  const handleCalcDose = () => {
    const result = calculateDose(calcWeight, calcDrug);
    setCalcResult(result);
  };

  const tabs = [
    { id: 'checker', label: 'Interaction Checker', icon: FlaskConical },
    { id: 'prescriptions', label: 'Active Rx', icon: Pill },
    { id: 'database', label: 'Drug Database', icon: BookOpen },
    { id: 'calculator', label: 'Dose Calc', icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-4 md:p-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-6 rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0505 0%, #0d0d2b 50%, #051a1a 100%)' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(20,184,166,0.15))' }} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #ef4444, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
        <div className="relative p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(135deg, #ef4444, #14b8a6)' }}>
            <Shield size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">AI Prescription Safety Checker</h1>
            <p className="text-white/60 text-sm mt-0.5">Real-time drug interaction analysis & dosage verification</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/70">AI Engine Active</span>
          </div>
        </div>
      </motion.div>

      {/* ── Safety Alert Banner ── */}
      <AnimatePresence>
        {flaggedPrescriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.95 }}
            className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-center gap-3"
          >
            <AlertTriangle className="text-amber-400 shrink-0" size={18} />
            <p className="text-amber-200 text-sm">
              <span className="font-bold">{flaggedPrescriptions.length} prescription(s)</span> require attention — caution flags detected.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tab Navigation ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-6 overflow-x-auto pb-1"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                active
                  ? 'border-teal-500/50 text-teal-300'
                  : 'border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
              }`}
              style={active ? { background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(20,184,166,0.15))' } : { background: 'rgba(255,255,255,0.03)' }}
            >
              <Icon size={15} />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          TAB 1 — INTERACTION CHECKER
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {activeTab === 'checker' && (
          <motion.div
            key="checker"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Input Card */}
            <div className="rounded-2xl border border-white/10 p-5 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h2 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <FlaskConical size={18} className="text-teal-400" />
                Drug Interaction Check
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {[
                  { value: drug1, setter: setDrug1, placeholder: 'Drug 1 (e.g. Amoxicillin)', label: 'First Medication' },
                  { value: drug2, setter: setDrug2, placeholder: 'Drug 2 (e.g. Prednisolone)', label: 'Second Medication' },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-xs text-white/50 mb-1 block">{field.label}</label>
                    <input
                      type="text"
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50 transition-colors"
                      onKeyDown={e => e.key === 'Enter' && handleInteractionCheck()}
                    />
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInteractionCheck}
                disabled={isChecking || !drug1.trim() || !drug2.trim()}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ background: isChecking ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #ef4444, #14b8a6)' }}
              >
                {isChecking ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Check Interaction
                  </>
                )}
              </motion.button>
            </div>

            {/* Result Card */}
            <AnimatePresence>
              {interactionResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`rounded-2xl border p-5 backdrop-blur-xl ${
                    interactionResult.color === 'green'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : interactionResult.color === 'yellow'
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : 'border-red-500/30 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      interactionResult.color === 'green' ? 'bg-emerald-500/20' :
                      interactionResult.color === 'yellow' ? 'bg-amber-500/20' : 'bg-red-500/20'
                    }`}>
                      {interactionResult.color === 'green'
                        ? <CheckCircle className="text-emerald-400" size={20} />
                        : interactionResult.color === 'yellow'
                        ? <AlertTriangle className="text-amber-400" size={20} />
                        : <Zap className="text-red-400" size={20} />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-black tracking-widest ${
                          interactionResult.color === 'green' ? 'text-emerald-400' :
                          interactionResult.color === 'yellow' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {interactionResult.level}
                        </span>
                        <span className="text-white/30 text-xs">•</span>
                        <span className="text-white/40 text-xs">{drug1} + {drug2}</span>
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        interactionResult.color === 'green' ? 'text-emerald-200/80' :
                        interactionResult.color === 'yellow' ? 'text-amber-200/80' : 'text-red-200/80'
                      }`}>
                        {interactionResult.message}
                      </p>
                    </div>
                    <button onClick={() => setInteractionResult(null)} className="text-white/30 hover:text-white/60 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick interaction reference */}
            <div className="rounded-2xl border border-white/10 p-5 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h3 className="text-sm font-bold text-white/70 mb-3 flex items-center gap-2">
                <Info size={14} className="text-teal-400" />
                Common Interaction Examples
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { a: 'Meloxicam', b: 'Aspirin', level: 'INTERACTION DETECTED', color: 'red' },
                  { a: 'Tramadol', b: 'Amitriptyline', level: 'INTERACTION DETECTED', color: 'red' },
                  { a: 'Prednisolone', b: 'Furosemide', level: 'CAUTION', color: 'yellow' },
                  { a: 'Amoxicillin', b: 'Metronidazole', level: 'SAFE', color: 'green' },
                ].map((ex, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setDrug1(ex.a); setDrug2(ex.b); }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 transition-all text-left"
                  >
                    <span className="text-xs text-white/60">{ex.a} + {ex.b}</span>
                    <SafetyBadge level={ex.level} color={ex.color} />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 2 — ACTIVE PRESCRIPTIONS
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'prescriptions' && (
          <motion.div
            key="prescriptions"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {prescriptions.length === 0 && (
              <div className="text-center py-12 text-white/30">
                <Pill size={40} className="mx-auto mb-3 opacity-30" />
                <p>No prescriptions found</p>
              </div>
            )}
            {prescriptions.map((rx, i) => {
              const safety = getPrescriptionSafety(rx);
              return (
                <motion.div
                  key={rx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-white/10 p-4 backdrop-blur-xl hover:border-white/20 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      safety.color === 'green' ? 'bg-emerald-500/15' : 'bg-amber-500/15'
                    }`}>
                      <Pill size={18} className={safety.color === 'green' ? 'text-emerald-400' : 'text-amber-400'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-bold text-white">{rx.medication}</span>
                        <SafetyBadge level={safety.level} color={safety.color} />
                        {rx.status === 'active' && (
                          <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">Active</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/50 flex-wrap">
                        <span>🐾 {rx.pet}</span>
                        <span>👨‍⚕️ {rx.vet}</span>
                        <span><Clock size={10} className="inline mr-1" />{rx.date}</span>
                        <span>🔄 {rx.refills} refill(s)</span>
                      </div>
                      <p className="text-xs text-white/40 mt-1">{rx.dose} · {rx.days} days</p>
                    </div>
                  </div>
                  {safety.level === 'CAUTION' && (
                    <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center gap-2">
                      <AlertTriangle size={12} className="text-amber-400 shrink-0" />
                      <p className="text-xs text-amber-300/80">This medication class requires enhanced monitoring. Review clinical parameters regularly.</p>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Safety Alerts Summary */}
            {flaggedPrescriptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-red-500/20 p-4"
                style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.05), rgba(20,184,166,0.05))' }}
              >
                <h3 className="text-sm font-bold text-red-300 mb-3 flex items-center gap-2">
                  <Shield size={14} />
                  Safety Alert Summary
                </h3>
                <div className="space-y-2">
                  {flaggedPrescriptions.map(rx => (
                    <div key={rx.id} className="flex items-center gap-2 text-xs text-white/60">
                      <AlertTriangle size={12} className="text-amber-400" />
                      <span className="text-white/80 font-medium">{rx.pet}</span>
                      <span>—</span>
                      <span>{rx.medication}</span>
                      <SafetyBadge level={getPrescriptionSafety(rx).level} color={getPrescriptionSafety(rx).color} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 3 — DRUG DATABASE
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'database' && (
          <motion.div
            key="database"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={searchDrug}
                onChange={e => setSearchDrug(e.target.value)}
                placeholder="Search medications..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50"
              />
            </div>

            {/* Drug Cards */}
            <div className="space-y-2">
              {filteredDrugs.map((drug, i) => (
                <motion.div
                  key={drug.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <button
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/3 transition-colors"
                    onClick={() => setExpandedDrug(expandedDrug === drug.name ? null : drug.name)}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${drug.caution ? 'bg-amber-500/15' : 'bg-teal-500/15'}`}>
                      <Pill size={16} className={drug.caution ? 'text-amber-400' : 'text-teal-400'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{drug.name}</span>
                        {drug.caution && <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">⚠ Caution</span>}
                      </div>
                      <p className="text-xs text-white/40">{drug.class} · {drug.species.join(', ')}</p>
                    </div>
                    <div className="text-white/30">
                      {expandedDrug === drug.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedDrug === drug.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-white/5">
                          <div className="pt-3 grid grid-cols-2 gap-2 mb-3">
                            {[
                              { label: 'Dose Range', value: drug.doseRange },
                              { label: 'Frequency', value: drug.frequency },
                              { label: 'Max Duration', value: `${drug.maxDays} days` },
                              { label: 'Species', value: drug.species.join(', ') },
                            ].map(item => (
                              <div key={item.label} className="bg-white/5 rounded-lg p-2">
                                <p className="text-xs text-white/40">{item.label}</p>
                                <p className="text-xs font-semibold text-white/80 mt-0.5">{item.value}</p>
                              </div>
                            ))}
                          </div>
                          <div className={`flex items-start gap-2 p-2.5 rounded-lg ${drug.caution ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-teal-500/10 border border-teal-500/20'}`}>
                            <Info size={12} className={drug.caution ? 'text-amber-400 mt-0.5 shrink-0' : 'text-teal-400 mt-0.5 shrink-0'} />
                            <p className="text-xs text-white/60">{drug.notes}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 4 — DOSAGE CALCULATOR
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'calculator' && (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/10 p-5 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h2 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <Calculator size={18} className="text-teal-400" />
                Weight-Based Dosage Calculator
              </h2>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Pet Weight (kg)</label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={e => setCalcWeight(e.target.value)}
                    placeholder="e.g. 28"
                    min="0.1"
                    max="150"
                    step="0.1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Select Drug</label>
                  <select
                    value={calcDrug}
                    onChange={e => setCalcDrug(e.target.value)}
                    className="w-full bg-[#12122a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-colors"
                  >
                    <option value="">Choose a medication...</option>
                    {DRUG_DATABASE.map(d => (
                      <option key={d.name} value={d.name}>{d.name} ({d.class})</option>
                    ))}
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCalcDose}
                disabled={!calcWeight || !calcDrug}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ background: 'linear-gradient(135deg, #6366f1, #14b8a6)' }}
              >
                <Calculator size={16} />
                Calculate Dose
              </motion.button>
            </div>

            {/* Result */}
            <AnimatePresence>
              {calcResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-teal-500/30 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(20,184,166,0.08))' }}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity size={16} className="text-teal-400" />
                      <h3 className="text-sm font-bold text-white">Recommended Dose</h3>
                      <span className="ml-auto text-xs text-white/40">{calcWeight} kg · {calcDrug}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <p className="text-xs text-white/40 mb-1">Minimum Dose</p>
                        <p className="text-2xl font-black text-teal-300">{calcResult.low}</p>
                        <p className="text-xs text-white/40">{calcResult.unit}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <p className="text-xs text-white/40 mb-1">Maximum Dose</p>
                        <p className="text-2xl font-black text-indigo-300">{calcResult.high}</p>
                        <p className="text-xs text-white/40">{calcResult.unit}</p>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-xs text-white/50 flex items-start gap-2">
                      <Info size={12} className="text-white/40 mt-0.5 shrink-0" />
                      <span>These are AI-estimated ranges based on standard dosing guidelines. Always verify with clinical references and adjust for patient-specific factors (organ function, concurrent medications).</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Drugs in DB', value: DRUG_DATABASE.length, icon: Pill, color: 'teal' },
                { label: 'Active Rx', value: prescriptions.filter(r => r.status === 'active').length, icon: Activity, color: 'indigo' },
                { label: 'Alerts', value: flaggedPrescriptions.length, icon: AlertTriangle, color: 'amber' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-white/10 p-3 text-center backdrop-blur-xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <Icon size={18} className={`mx-auto mb-1 ${
                      stat.color === 'teal' ? 'text-teal-400' :
                      stat.color === 'indigo' ? 'text-indigo-400' : 'text-amber-400'
                    }`} />
                    <p className="text-xl font-black text-white">{stat.value}</p>
                    <p className="text-xs text-white/40">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
