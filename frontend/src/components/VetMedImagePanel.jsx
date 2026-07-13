import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Upload, AlertTriangle, CheckCircle, RefreshCw, Zap } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#6366f1,#a855f7)';

const SAMPLE_RESULTS = [
  { region: 'Left Lung', finding: 'Mild opacity — possible early pneumonia', severity: 'moderate', confidence: 87 },
  { region: 'Cardiac Silhouette', finding: 'Normal size and shape', severity: 'normal', confidence: 96 },
  { region: 'Diaphragm', finding: 'Normal position and contour', severity: 'normal', confidence: 98 },
  { region: 'Bone Density (Spine)', finding: 'Mild spondylosis at L4-L5', severity: 'low', confidence: 79 },
];

const SCAN_TYPES = ['X-Ray', 'Ultrasound', 'CT Scan', 'MRI', 'Endoscopy'];

const SEV_CFG = {
  normal:   { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
  low:      { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700' },
  moderate: { bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700',  badge: 'bg-orange-100 text-orange-700' },
  high:     { bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-700' },
};

export default function VetMedImagePanel() {
  const [scanType, setScanType] = useState('X-Ray');
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [patient, setPatient] = useState('Bruno (Lab, 4yr)');

  const analyze = () => {
    if (!uploaded) return;
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 2200);
  };

  const simulateUpload = () => {
    setUploaded(true);
    setAnalyzed(false);
  };

  const abnormal = SAMPLE_RESULTS.filter(r => r.severity !== 'normal');

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">🔬</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔬 AI Imaging</span>
        <h2 className="text-2xl font-black mt-2">AI Medical Image Analyzer</h2>
        <p className="text-purple-100 text-sm mt-1">Upload X-rays, ultrasounds, CT scans, and MRIs for instant AI-powered diagnostic analysis with confidence scoring.</p>
        <div className="flex gap-6 mt-4">
          {[['Scan Types', SCAN_TYPES.length], ['AI Accuracy', '94.2%'], ['Avg Analysis', '8 sec'], ['Findings', analyzed ? SAMPLE_RESULTS.length : '—']].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-purple-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Upload panel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">📤 Upload Medical Scan</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Patient</label>
            <input value={patient} onChange={e => setPatient(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-300 outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Scan Type</label>
            <select value={scanType} onChange={e => setScanType(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-300 outline-none">
              {SCAN_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onClick={simulateUpload}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${uploaded ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-violet-400 hover:bg-violet-50'}`}>
          {uploaded ? (
            <div>
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-emerald-700">chest_xray_bruno_may12.jpg</p>
              <p className="text-xs text-emerald-500 mt-1">Scan uploaded · Ready for AI analysis</p>
            </div>
          ) : (
            <div>
              <Upload className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-500">Click to upload {scanType}</p>
              <p className="text-xs text-slate-400 mt-1">DICOM, JPEG, PNG — up to 50MB</p>
            </div>
          )}
        </div>

        <button onClick={analyze} disabled={!uploaded || analyzing}
          className="w-full mt-4 py-3 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 transition"
          style={{ background: GRAD }}>
          {analyzing ? <><RefreshCw className="w-4 h-4 animate-spin" />AI Analyzing Scan...</> : '🔬 Run AI Diagnosis'}
        </button>
      </div>

      {/* AI results */}
      {analyzed && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-extrabold text-slate-800">🔍 AI Diagnostic Report — {patient}</p>
              <span className="text-xs font-bold px-2 py-1 bg-violet-100 text-violet-700 rounded-full">{scanType} · {new Date().toLocaleDateString()}</span>
            </div>
            {abnormal.length > 0 && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                <p className="text-xs font-bold text-orange-700">⚠️ {abnormal.length} finding{abnormal.length > 1 ? 's' : ''} require{abnormal.length === 1 ? 's' : ''} attention</p>
              </div>
            )}
            <div className="space-y-3">
              {SAMPLE_RESULTS.map((r, i) => {
                const cfg = SEV_CFG[r.severity];
                return (
                  <motion.div key={r.region} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-extrabold text-sm ${cfg.text}`}>{r.region}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${cfg.badge}`}>{r.severity}</span>
                        </div>
                        <p className={`text-xs ${cfg.text}`}>{r.finding}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`font-extrabold ${cfg.text}`}>{r.confidence}%</p>
                        <p className="text-[10px] text-slate-400">confidence</p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-white/60 rounded-full h-1.5">
                      <motion.div className="h-1.5 rounded-full" style={{ background: r.severity === 'normal' ? '#10b981' : r.severity === 'low' ? '#f59e0b' : '#ef4444' }}
                        initial={{ width: 0 }} animate={{ width: `${r.confidence}%` }} transition={{ delay: i * 0.1 + 0.3 }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-indigo-700">⚠️ AI Disclaimer: This analysis is a clinical decision support tool. Final diagnosis must be confirmed by a licensed veterinarian. Results may not replace professional clinical judgment.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
