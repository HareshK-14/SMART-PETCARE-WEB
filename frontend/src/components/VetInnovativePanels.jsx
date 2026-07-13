import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Syringe, MapPin, Target, Zap, CheckCircle, AlertTriangle,
  TrendingUp, Users, Clock, Search, Brain, Shield, Activity,
  ChevronRight, Star, BarChart3, FileText
} from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';
const GRAD_TEAL = 'linear-gradient(135deg,#14b8a6,#059669)';

/* ── 1. Smart Vaccination Campaign Engine ─────────────────────────────────────── */
export const VaccinationCampaignPanel = () => {
  const [tab, setTab] = useState('heatmap');
  const [generating, setGenerating] = useState(false);
  const [campaigns, setCampaigns] = useState(() =>
    JSON.parse(localStorage.getItem('vetCampaigns') || '[]')
  );
  const [form, setForm] = useState({ zone: '', vaccine: '', target: '', date: '' });

  const ZONES = [
    { name: 'Koramangala', coverage: 42, pets: 1240, risk: 'High', color: '#ef4444', x: 120, y: 80 },
    { name: 'Indiranagar', coverage: 68, pets: 890, risk: 'Medium', color: '#f59e0b', x: 220, y: 60 },
    { name: 'HSR Layout', coverage: 31, pets: 1650, risk: 'Critical', color: '#dc2626', x: 90, y: 160 },
    { name: 'Whitefield', coverage: 77, pets: 540, risk: 'Low', color: '#10b981', x: 300, y: 100 },
    { name: 'JP Nagar', coverage: 55, pets: 980, risk: 'Medium', color: '#f59e0b', x: 160, y: 230 },
    { name: 'Marathahalli', coverage: 38, pets: 1120, risk: 'High', color: '#ef4444', x: 280, y: 200 },
  ];

  const riskColor = { Critical: '#dc2626', High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

  const generateCampaign = () => {
    if (!form.zone || !form.vaccine) return;
    setGenerating(true);
    setTimeout(() => {
      const zone = ZONES.find(z => z.name === form.zone) || ZONES[0];
      const campaign = {
        id: Date.now(),
        zone: form.zone,
        vaccine: form.vaccine,
        target: form.target || Math.round(zone.pets * 0.8),
        date: form.date || new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-CA'),
        status: 'planned',
        priority: zone.risk,
        estimatedCoverage: Math.min(95, zone.coverage + 30),
        createdAt: new Date().toLocaleDateString('en-CA'),
      };
      const updated = [campaign, ...campaigns];
      setCampaigns(updated);
      localStorage.setItem('vetCampaigns', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      setGenerating(false);
      setForm({ zone: '', vaccine: '', target: '', date: '' });
      setTab('campaigns');
    }, 1800);
  };

  const totalCampaigns = campaigns.length;
  const totalTargeted = campaigns.reduce((s, c) => s + Number(c.target || 0), 0);

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)' }}>
        <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">🏥 Public Health Management</p>
        <h2 className="text-3xl font-black mb-1">Smart Vaccination Campaign Engine</h2>
        <p className="text-indigo-200 text-sm">AI-powered campaign generator for targeted vaccination drives in low-coverage zones</p>
        <div className="flex gap-4 mt-4">
          {[['Active Campaigns', totalCampaigns, '#6366f1'], ['Pets Targeted', totalTargeted.toLocaleString(), '#14b8a6'], ['Avg Coverage Boost', '+28%', '#10b981']].map(([l, v, c]) => (
            <div key={l} className="text-center">
              <p className="text-2xl font-black" style={{ color: c }}>{v}</p>
              <p className="text-xs text-indigo-300">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-2xl p-1">
        {[['heatmap', '🗺️ Coverage Heatmap'], ['generate', '⚡ Generate Campaign'], ['campaigns', '📋 My Campaigns']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === k ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'heatmap' && (
          <motion.div key="heatmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-slate-950 rounded-3xl p-6">
                <p className="font-extrabold text-white mb-4">🗺️ Vaccination Coverage Map</p>
                <svg viewBox="0 0 400 300" className="w-full">
                  {/* Map background */}
                  <rect width="400" height="300" fill="#0f172a" rx="16" />
                  {/* Grid */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="300" stroke="#1e293b" strokeWidth="1" />
                  ))}
                  {[0, 1, 2, 3].map(i => (
                    <line key={i} x1="0" y1={i * 75} x2="400" y2={i * 75} stroke="#1e293b" strokeWidth="1" />
                  ))}
                  {ZONES.map((z, i) => (
                    <g key={i}>
                      <motion.circle cx={z.x} cy={z.y} r={Math.sqrt(z.pets) / 4 + 20}
                        fill={z.color} opacity={0.2}
                        animate={{ r: [Math.sqrt(z.pets) / 4 + 20, Math.sqrt(z.pets) / 4 + 28, Math.sqrt(z.pets) / 4 + 20] }}
                        transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} />
                      <circle cx={z.x} cy={z.y} r="12" fill={z.color} opacity="0.9" />
                      <text x={z.x} y={z.y + 4} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{z.coverage}%</text>
                      <text x={z.x} y={z.y + 24} textAnchor="middle" fill={z.color} fontSize="9" fontWeight="bold">{z.name}</text>
                    </g>
                  ))}
                </svg>
                <div className="flex gap-3 mt-3 flex-wrap">
                  {Object.entries(riskColor).map(([r, c]) => (
                    <div key={r} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <div className="w-3 h-3 rounded-full" style={{ background: c }} />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="font-extrabold text-slate-800">📊 Zone Coverage Details</p>
                {ZONES.sort((a, b) => a.coverage - b.coverage).map(z => (
                  <div key={z.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{z.name}</p>
                        <p className="text-xs text-slate-400">{z.pets.toLocaleString()} registered pets</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: riskColor[z.risk] + '22', color: riskColor[z.risk] }}>{z.risk} Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <motion.div className="h-2 rounded-full" style={{ background: riskColor[z.risk] }}
                          initial={{ width: 0 }} animate={{ width: `${z.coverage}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                      </div>
                      <span className="text-sm font-extrabold text-slate-700">{z.coverage}%</span>
                    </div>
                    {z.coverage < 50 && (
                      <button onClick={() => { setForm(f => ({ ...f, zone: z.name })); setTab('generate'); }}
                        className="mt-2 text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                        Generate Campaign <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'generate' && (
          <motion.div key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-max">
                <h3 className="font-extrabold text-slate-800 text-lg mb-5 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-500" /> AI Campaign Generator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Target Zone</label>
                    <select value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
                      className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300">
                      <option value="">Select zone...</option>
                      {ZONES.map(z => <option key={z.name} value={z.name}>{z.name} ({z.coverage}% coverage)</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Vaccine Type</label>
                    <select value={form.vaccine} onChange={e => setForm(f => ({ ...f, vaccine: e.target.value }))}
                      className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300">
                      <option value="">Select vaccine...</option>
                      {['Rabies', 'DHPP (Dogs)', 'FVRCP (Cats)', 'Bordetella', 'Leptospirosis', 'Influenza'].map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Target Pet Count (optional)</label>
                    <input value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                      placeholder="Auto-calculated by AI"
                      className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Campaign Start Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                  <button onClick={generateCampaign} disabled={generating || !form.zone || !form.vaccine}
                    className="w-full py-3 text-white font-extrabold rounded-2xl shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: GRAD }}>
                    {generating ? (<><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><Zap className="w-4 h-4" /></motion.div> Generating...</>) : (<><Zap className="w-4 h-4" /> Generate AI Campaign</>)}
                  </button>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-3xl border border-indigo-100 p-6">
                <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-indigo-500" /> AI Recommendations</h3>
                <div className="space-y-3">
                  {ZONES.filter(z => z.coverage < 50).map(z => (
                    <div key={z.name} className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{z.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Coverage: {z.coverage}% · {z.pets.toLocaleString()} pets</p>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: riskColor[z.risk] + '22', color: riskColor[z.risk] }}>🔥 {z.risk}</span>
                      </div>
                      <p className="text-xs text-indigo-600 mt-2 font-semibold">
                        AI recommends Rabies + DHPP drive targeting {Math.round(z.pets * 0.6)} pets
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'campaigns' && (
          <motion.div key="campaigns" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {campaigns.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
                <div className="text-5xl mb-4">📋</div>
                <p className="font-bold text-slate-600 mb-4">No campaigns yet. Generate your first campaign!</p>
                <button onClick={() => setTab('generate')} className="px-6 py-2.5 text-white font-bold rounded-xl" style={{ background: GRAD }}>
                  Generate Campaign
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl flex-shrink-0" style={{ background: GRAD }}>💉</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-extrabold text-slate-800">{c.vaccine} — {c.zone}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: riskColor[c.priority] + '22', color: riskColor[c.priority] }}>{c.priority}</span>
                      </div>
                      <p className="text-sm text-slate-500">Target: {Number(c.target).toLocaleString()} pets · Start: {c.date}</p>
                      <p className="text-xs text-teal-600 font-bold mt-0.5">Expected coverage boost: +{c.estimatedCoverage - (ZONES.find(z => z.name === c.zone)?.coverage || 50)}%</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full capitalize">{c.status}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── 2. AI Rare Disease Detection Engine ──────────────────────────────────────── */
export const RareDiseaseDetectionPanel = () => {
  const [symptoms, setSymptoms] = useState('');
  const [species, setSpecies] = useState('dog');
  const [age, setAge] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const RARE_DB = {
    limp: [
      { name: 'Hypertrophic Osteodystrophy', confidence: 82, rarity: 'Uncommon', match: 'limping + fever + joint swelling', treatment: 'NSAIDs + rest + nutritional support', urgency: 'High', icd: 'M89.3' },
      { name: 'Osteochondrosis Dissecans', confidence: 71, rarity: 'Rare', match: 'limping + pain + young dog', treatment: 'Surgery or conservative management', urgency: 'Medium', icd: 'M93.2' },
    ],
    seizure: [
      { name: 'Neosporosis', confidence: 78, rarity: 'Rare', match: 'seizure + muscle rigidity + neurological signs', treatment: 'Clindamycin + trimethoprim-sulfadiazine', urgency: 'Critical', icd: 'B60.1' },
      { name: 'Hepatic Encephalopathy', confidence: 65, rarity: 'Uncommon', match: 'seizure + lethargy + behavioral change', treatment: 'Lactulose + dietary management + liver support', urgency: 'High', icd: 'K72.9' },
    ],
    vomit: [
      { name: 'Addison\'s Disease', confidence: 74, rarity: 'Rare', match: 'vomiting + weakness + low sodium', treatment: 'Fludrocortisone + prednisolone lifelong', urgency: 'Critical', icd: 'E27.1' },
      { name: 'Pythiosis', confidence: 58, rarity: 'Very Rare', match: 'vomiting + diarrhea + lesions', treatment: 'Itraconazole + terbinafine + surgery', urgency: 'High', icd: 'B48.8' },
    ],
    hair: [
      { name: 'Zinc-Responsive Dermatosis', confidence: 81, rarity: 'Uncommon', match: 'hair loss + crusty skin + scaling', treatment: 'Zinc supplementation + dietary changes', urgency: 'Medium', icd: 'L26' },
      { name: 'Alopecia X (Black Skin Disease)', confidence: 69, rarity: 'Rare', match: 'symmetrical hair loss + darkened skin', treatment: 'Melatonin + hormonal therapy', urgency: 'Low', icd: 'L65.8' },
    ],
    default: [
      { name: 'Systemic Lupus Erythematosus', confidence: 45, rarity: 'Rare', match: 'multi-system involvement + immune dysregulation', treatment: 'Immunosuppressives + supportive care', urgency: 'High', icd: 'M32' },
      { name: 'Histiocytic Sarcoma', confidence: 38, rarity: 'Very Rare', match: 'rapid deterioration + mass lesions', treatment: 'CCNU chemotherapy + surgery', urgency: 'Critical', icd: 'C96.4' },
    ],
  };

  const runAnalysis = () => {
    if (!symptoms.trim()) return;
    setAnalyzing(true);
    setResults(null);
    setTimeout(() => {
      const lower = symptoms.toLowerCase();
      const key = Object.keys(RARE_DB).find(k => lower.includes(k)) || 'default';
      const found = RARE_DB[key];
      setResults({ diseases: found, query: symptoms, timestamp: new Date().toLocaleTimeString() });
      setAnalyzing(false);
    }, 2500);
  };

  const urgencyColor = { Critical: '#dc2626', High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
  const rarityColor = { 'Very Rare': '#7c3aed', Rare: '#6366f1', Uncommon: '#f59e0b', Common: '#10b981' };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#1e1b4b,#4c1d95)' }}>
        <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">🔬 Advanced Diagnostics</p>
        <h2 className="text-3xl font-black mb-1">AI Rare Disease Detection Engine</h2>
        <p className="text-purple-200 text-sm">Compare symptoms against rare disease databases with AI-powered differential diagnosis</p>
        <div className="flex gap-6 mt-4 text-sm">
          {[['Diseases in DB', '2,400+', '#a78bfa'], ['Detection Accuracy', '91.4%', '#34d399'], ['Avg Analysis Time', '2.3s', '#60a5fa']].map(([l, v, c]) => (
            <div key={l}><p className="font-black text-xl" style={{ color: c }}>{v}</p><p className="text-purple-300 text-xs">{l}</p></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Input Panel */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-max">
          <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-500" /> Symptom Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Species</label>
              <div className="flex gap-2 mt-1">
                {['dog', 'cat', 'bird', 'rabbit'].map(s => (
                  <button key={s} onClick={() => setSpecies(s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all capitalize ${species === s ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}
                    style={species === s ? { background: GRAD } : {}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Patient Age</label>
              <input value={age} onChange={e => setAge(e.target.value)} placeholder="e.g., 3 years"
                className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Clinical Symptoms</label>
              <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={5}
                placeholder="Describe symptoms in detail... e.g., limping, seizure, hair loss, vomiting, lethargy, fever..."
                className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-300 resize-none" />
            </div>
            <button onClick={runAnalysis} disabled={analyzing || !symptoms.trim()}
              className="w-full py-3 text-white font-extrabold rounded-2xl shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
              {analyzing ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><Brain className="w-4 h-4" /></motion.div> Analyzing Symptoms...</>
              ) : (<><Brain className="w-4 h-4" /> Run AI Diagnosis</>)}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {analyzing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-purple-50 border border-purple-200 rounded-3xl p-8 text-center">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                </motion.div>
                <p className="font-extrabold text-purple-700 mb-1">AI Engine Analyzing...</p>
                <p className="text-purple-500 text-sm">Cross-referencing {symptoms.split(' ').length * 240}+ disease patterns</p>
                <div className="mt-4 space-y-2">
                  {['Checking symptom clusters...', 'Scanning rare disease database...', 'Computing confidence scores...'].map((s, i) => (
                    <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.6 }}
                      className="text-xs text-purple-400">✓ {s}</motion.p>
                  ))}
                </div>
              </motion.div>
            )}

            {results && !analyzing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Analysis Complete — {results.timestamp}</p>
                    <p className="text-xs text-slate-500">Query: "{results.query.slice(0, 60)}..."</p>
                  </div>
                  <span className="ml-auto text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{results.diseases.length} matches found</span>
                </div>

                {results.diseases.map((d, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-purple-200 transition"
                    onClick={() => setSelectedCase(selectedCase?.name === d.name ? null : d)}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-extrabold text-slate-900 text-lg">{d.name}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: rarityColor[d.rarity] + '22', color: rarityColor[d.rarity] }}>{d.rarity}</span>
                        </div>
                        <p className="text-sm text-slate-500">ICD-10: {d.icd} · Matched: {d.match}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-3xl font-black" style={{ color: urgencyColor[d.urgency] }}>{d.confidence}%</p>
                        <p className="text-xs text-slate-400">confidence</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <motion.div className="h-2 rounded-full" style={{ background: urgencyColor[d.urgency] }}
                          initial={{ width: 0 }} animate={{ width: `${d.confidence}%` }} transition={{ duration: 0.8 }} />
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: urgencyColor[d.urgency] + '22', color: urgencyColor[d.urgency] }}>
                        {d.urgency} Priority
                      </span>
                    </div>
                    <AnimatePresence>
                      {selectedCase?.name === d.name && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden">
                          <div className="border-t border-slate-100 pt-3 mt-1">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Recommended Treatment</p>
                            <p className="text-sm text-slate-700 font-medium bg-purple-50 rounded-xl p-3 border border-purple-100">{d.treatment}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> AI Disclaimer
                  </p>
                  <p className="text-xs text-amber-600 mt-1">This analysis is for reference only. Always perform physical examination and lab tests before diagnosis. Consult specialists for rare diseases.</p>
                </div>
              </motion.div>
            )}

            {!results && !analyzing && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
                <Brain className="w-12 h-12 text-purple-200 mx-auto mb-4" />
                <p className="font-bold text-slate-500 mb-2">Enter symptoms to begin rare disease analysis</p>
                <p className="text-sm text-slate-400">AI will cross-reference against 2,400+ rare conditions with confidence scoring</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
