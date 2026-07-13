import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, QrCode, Heart, MapPin, Droplets, AlertTriangle, CheckCircle,
  Clock, Users, Star, Zap, Shield, Navigation, Phone, Share2,
  BookOpen, Award, Camera, Activity, Brain, Calendar, FileText, X
} from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';

/* ── 1. Digital Pet Passport for Global Travel ─────────────────────────────────── */
export const DigitalPetPassportPanel = () => {
  const [tab, setTab] = useState('passport');
  const [petData] = useState(() => {
    const pets = JSON.parse(localStorage.getItem('ownerPets') || '[]');
    return pets[0] || { name: 'Bruno', breed: 'Labrador', age: 3, dob: '2022-03-10', microchip: 'MC-001-BRUNO' };
  });
  const [rxData] = useState(() => JSON.parse(localStorage.getItem('allPrescriptions') || '[]'));
  const [qrAnim, setQrAnim] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setQrAnim(a => (a + 1) % 4), 800);
    return () => clearInterval(t);
  }, []);

  const VACCINATIONS = [
    { name: 'Rabies', date: '2025-04-10', expires: '2026-04-10', status: 'Valid', code: 'RA-2025' },
    { name: 'DHPP', date: '2025-03-15', expires: '2026-03-15', status: 'Valid', code: 'DH-2025' },
    { name: 'Bordetella', date: '2025-01-08', expires: '2025-07-08', status: 'Expired', code: 'BO-2025' },
    { name: 'Leptospirosis', date: '2025-04-10', expires: '2026-04-10', status: 'Valid', code: 'LP-2025' },
  ];

  const TRAVEL_COUNTRIES = [
    { name: 'UAE', flag: '🇦🇪', status: 'Eligible', reqs: 'Rabies + Microchip required' },
    { name: 'UK', flag: '🇬🇧', status: 'Eligible', reqs: 'Tapeworm treatment + ISO microchip' },
    { name: 'USA', flag: '🇺🇸', status: 'Eligible', reqs: 'Rabies vaccine < 1 year' },
    { name: 'Singapore', flag: '🇸🇬', status: 'Review', reqs: 'Quarantine 30 days required' },
    { name: 'Australia', flag: '🇦🇺', status: 'Not Eligible', reqs: 'Missing Heartworm + quarantine mandatory' },
  ];

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Hero */}
      <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0c1445,#1a237e,#0d47a1)' }}>
        <div className="absolute top-0 right-0 opacity-10 w-40 h-40">
          <Globe className="w-full h-full" />
        </div>
        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">🌐 Cross-Dashboard Feature</p>
        <h2 className="text-3xl font-black mb-1">Digital Pet Passport</h2>
        <p className="text-blue-200 text-sm">Universal QR-based travel passport with vaccinations, medical history, and ownership verification</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-2xl p-1">
        {[['passport', '🛂 My Passport'], ['vaccinations', '💉 Vaccinations'], ['travel', '✈️ Travel Eligibility']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === k ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'passport' && (
          <motion.div key="passport" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Passport Card */}
              <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1a237e,#283593,#1565c0)' }}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">REPUBLIC OF PETCARE AI</p>
                    <p className="text-xs text-blue-200 mt-0.5">DIGITAL PET PASSPORT</p>
                  </div>
                  <Globe className="w-10 h-10 text-blue-300/40" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl">🐕</div>
                  <div>
                    <p className="text-2xl font-black">{petData.name}</p>
                    <p className="text-blue-200 text-sm">{petData.breed}</p>
                    <p className="text-blue-300 text-xs mt-0.5">DOB: {petData.dob || '2022-03-10'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[['Microchip', petData.microchip || 'MC-001-XXXX'], ['Age', `${petData.age || 3} years`], ['Passport No.', `PP-${Date.now().toString().slice(-6)}`], ['Issued', '2025-01-01']].map(([l, v]) => (
                    <div key={l} className="bg-white/10 rounded-xl p-2.5">
                      <p className="text-[10px] text-blue-300 uppercase">{l}</p>
                      <p className="font-bold text-xs">{v}</p>
                    </div>
                  ))}
                </div>
                {/* QR Code */}
                <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <svg viewBox="0 0 80 80" className="w-full h-full p-2">
                      {[...Array(6)].map((_, r) => (
                        [...Array(6)].map((_, c) => (
                          <rect key={`${r}-${c}`} x={c * 12 + 4} y={r * 12 + 4} width={8} height={8}
                            fill={Math.random() > 0.5 ? '#1a237e' : 'transparent'} />
                        ))
                      ))}
                      <rect x="4" y="4" width="20" height="20" fill="none" stroke="#1a237e" strokeWidth="3" />
                      <rect x="56" y="4" width="20" height="20" fill="none" stroke="#1a237e" strokeWidth="3" />
                      <rect x="4" y="56" width="20" height="20" fill="none" stroke="#1a237e" strokeWidth="3" />
                    </svg>
                    <motion.div className="absolute inset-0 bg-blue-400/20 rounded-xl"
                      animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm">Scan to Verify</p>
                    <p className="text-xs text-slate-500 mt-0.5">All vaccinations & identity verified by PetCare AI</p>
                    <div className="flex items-center gap-1 mt-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <p className="text-xs font-bold text-green-600">Digitally Certified</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Details */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-extrabold text-slate-800 mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-green-500" /> Verification Status</h3>
                  {[
                    ['Microchip Verified', true], ['Ownership Verified', true], ['Vaccination Valid', true],
                    ['Vet Certified', true], ['Government Registered', false],
                  ].map(([l, v]) => (
                    <div key={l} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <p className="text-sm text-slate-600">{l}</p>
                      {v ? <CheckCircle className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-slate-300" />}
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-teal-50 rounded-2xl border border-indigo-100 p-5">
                  <h3 className="font-extrabold text-slate-800 mb-3 flex items-center gap-2"><Share2 className="w-4 h-4 text-indigo-500" /> Share Passport</h3>
                  <div className="flex gap-2">
                    {['Share QR', 'Download PDF', 'Email to Vet'].map(a => (
                      <button key={a} className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition hover:-translate-y-0.5" style={{ background: GRAD }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'vaccinations' && (
          <motion.div key="vac" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-3">
              {VACCINATIONS.map((v, i) => (
                <div key={i} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 ${v.status === 'Expired' ? 'border-red-200' : 'border-slate-100'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${v.status === 'Valid' ? 'bg-green-50' : 'bg-red-50'}`}>💉</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-slate-800">{v.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.status === 'Valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{v.status}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">Cert: {v.code}</p>
                    <p className="text-xs text-slate-400">Administered: {v.date} · Expires: {v.expires}</p>
                  </div>
                  {v.status === 'Expired' && (
                    <button className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200 hover:bg-red-100 transition">Book Now</button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'travel' && (
          <motion.div key="travel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-3">
              {TRAVEL_COUNTRIES.map((c, i) => (
                <div key={i} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 ${c.status === 'Not Eligible' ? 'border-red-100' : c.status === 'Review' ? 'border-amber-100' : 'border-slate-100'}`}>
                  <span className="text-4xl">{c.flag}</span>
                  <div className="flex-1">
                    <p className="font-extrabold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.reqs}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${c.status === 'Eligible' ? 'bg-green-100 text-green-700' : c.status === 'Review' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {c.status === 'Eligible' ? '✓ ' : c.status === 'Review' ? '⚠️ ' : '✗ '}{c.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── 2. AI Disaster Rescue Management ────────────────────────────────────────── */
export const DisasterRescuePanel = () => {
  const [mode, setMode] = useState('monitor');
  const [activeAlert, setActiveAlert] = useState(null);

  const DISASTERS = [
    { id: 1, type: 'Flooding', region: 'North Bengaluru', severity: 'High', petsAffected: 420, shelters: 3, rescued: 187, missing: 233, status: 'active' },
    { id: 2, type: 'Cyclone Warning', region: 'Coastal Chennai', severity: 'Critical', petsAffected: 1200, shelters: 7, rescued: 543, missing: 657, status: 'active' },
  ];

  const SHELTERS = [
    { name: 'City Animal Shelter', capacity: 200, current: 143, lat: '12.9716', lon: '77.5946', open: true },
    { name: 'PetCare Emergency Hub', capacity: 80, current: 72, lat: '12.9352', lon: '77.6245', open: true },
    { name: 'Greenfield Pet Center', capacity: 120, current: 38, lat: '13.0358', lon: '77.5971', open: true },
  ];

  const sevColor = { High: '#f59e0b', Critical: '#ef4444', Medium: '#6366f1' };

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#7f1d1d,#991b1b,#dc2626)' }}>
        <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-1">🌪️ Cross-Dashboard Emergency System</p>
        <h2 className="text-3xl font-black mb-1">AI Disaster Rescue Management</h2>
        <p className="text-red-100 text-sm">Coordinate pet rescue during disasters — locate pets, track shelters, alert owners and vets</p>
        <div className="flex gap-6 mt-4">
          {[['Active Disasters', DISASTERS.length, '#fca5a5'], ['Pets Rescued', '730', '#86efac'], ['Open Shelters', SHELTERS.filter(s => s.open).length, '#7dd3fc'], ['Vets On Call', '18', '#c4b5fd']].map(([l, v, c]) => (
            <div key={l}><p className="text-xl font-black" style={{ color: c }}>{v}</p><p className="text-xs text-red-200">{l}</p></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active Disasters */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-800 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" /> Active Disasters</h3>
          {DISASTERS.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border shadow-sm p-5 cursor-pointer hover:border-red-200 transition" style={{ borderColor: sevColor[d.severity] + '44' }}
              onClick={() => setActiveAlert(activeAlert?.id === d.id ? null : d)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-extrabold text-slate-900">{d.type} — {d.region}</p>
                  <p className="text-sm text-slate-500">{d.petsAffected.toLocaleString()} pets affected</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: sevColor[d.severity] + '22', color: sevColor[d.severity] }}>{d.severity}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[['Rescued', d.rescued, '#10b981'], ['Missing', d.missing, '#ef4444'], ['Shelters', d.shelters, '#6366f1']].map(([l, v, c]) => (
                  <div key={l} className="text-center bg-slate-50 rounded-xl py-2">
                    <p className="text-lg font-black" style={{ color: c }}>{v}</p>
                    <p className="text-[10px] text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: `${Math.round(d.rescued / d.petsAffected * 100)}%` }} />
                </div>
                <span className="text-xs font-bold text-green-600">{Math.round(d.rescued / d.petsAffected * 100)}% rescued</span>
              </div>
            </div>
          ))}
          <button className="w-full py-3 rounded-2xl text-white font-extrabold flex items-center justify-center gap-2 transition hover:-translate-y-0.5" style={{ background: GRAD }}>
            <AlertTriangle className="w-4 h-4" /> Report New Emergency
          </button>
        </div>

        {/* Shelters */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-800 flex items-center gap-2"><Shield className="w-5 h-5 text-green-500" /> Emergency Shelters</h3>
          {SHELTERS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-extrabold text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Lat: {s.lat}, Lon: {s.lon}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.open ? 'Open' : 'Full'}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-slate-100 rounded-full h-3">
                  <div className="h-3 rounded-full" style={{ width: `${s.current / s.capacity * 100}%`, background: s.current / s.capacity > 0.8 ? '#ef4444' : '#10b981' }} />
                </div>
                <span className="text-xs font-bold text-slate-700">{s.current}/{s.capacity}</span>
              </div>
              <p className="text-xs text-slate-500">{s.capacity - s.current} spots available</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── 3. Pet Blood Donor Network ───────────────────────────────────────────────── */
export const PetBloodDonorNetworkPanel = () => {
  const [tab, setTab] = useState('search');
  const [bloodType, setBloodType] = useState('');
  const [species, setSpecies] = useState('dog');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [registered, setRegistered] = useState(false);

  const DONORS = {
    dog: {
      'DEA 1.1+': [{ name: 'Max', owner: 'Ravi K.', area: 'Koramangala', dist: '1.2 km', available: true, lastDonated: '60 days ago', color: '#ef4444' }],
      'DEA 1.1-': [{ name: 'Rocky', owner: 'Sita R.', area: 'HSR Layout', dist: '2.1 km', available: true, lastDonated: '30 days ago', color: '#6366f1' },
                   { name: 'Bruno', owner: 'Harish K.', area: 'JP Nagar', dist: '3.5 km', available: false, lastDonated: '15 days ago', color: '#94a3b8' }],
    },
    cat: {
      'Type A': [{ name: 'Whiskers', owner: 'Priya M.', area: 'Indiranagar', dist: '0.8 km', available: true, lastDonated: '45 days ago', color: '#10b981' }],
      'Type B': [],
      'Type AB': [{ name: 'Luna', owner: 'Kavya R.', area: 'Whitefield', dist: '4.2 km', available: true, lastDonated: '90 days ago', color: '#f59e0b' }],
    },
  };

  const handleSearch = () => {
    if (!bloodType) return;
    setSearching(true);
    setTimeout(() => {
      const matches = DONORS[species]?.[bloodType] || [];
      setResults(matches);
      setSearching(false);
    }, 1500);
  };

  const DOG_TYPES = ['DEA 1.1+', 'DEA 1.1-', 'DEA 3', 'DEA 4', 'DEA 7'];
  const CAT_TYPES = ['Type A', 'Type B', 'Type AB'];

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#7f1d1d,#be123c,#e11d48)' }}>
        <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-1">🩸 Cross-Dashboard Network</p>
        <h2 className="text-3xl font-black mb-1">Pet Blood Donor Network</h2>
        <p className="text-red-100 text-sm">Connect donor pets with emergency cases — life-saving blood matching in real-time</p>
        <div className="flex gap-6 mt-4">
          {[['Registered Donors', '847', '#fca5a5'], ['Lives Saved', '312', '#86efac'], ['Partner Clinics', '94', '#7dd3fc'], ['Avg Match Time', '12 min', '#c4b5fd']].map(([l, v, c]) => (
            <div key={l}><p className="text-xl font-black" style={{ color: c }}>{v}</p><p className="text-xs text-red-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-2xl p-1">
        {[['search', '🔍 Find Donor'], ['register', '❤️ Register as Donor'], ['emergency', '🚨 Emergency Request']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === k ? 'bg-white shadow-sm text-red-700' : 'text-slate-500'}`}>
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'search' && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Droplets className="w-5 h-5 text-red-500" /> Search Donors</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Species</label>
                    <div className="flex gap-2 mt-1">
                      {['dog', 'cat'].map(s => (
                        <button key={s} onClick={() => { setSpecies(s); setBloodType(''); setResults(null); }}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition ${species === s ? 'text-white' : 'bg-slate-100 text-slate-600'}`}
                          style={species === s ? { background: 'linear-gradient(135deg,#be123c,#e11d48)' } : {}}>
                          {s === 'dog' ? '🐕 Dog' : '🐈 Cat'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Blood Type Needed</label>
                    <select value={bloodType} onChange={e => setBloodType(e.target.value)}
                      className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-200">
                      <option value="">Select blood type...</option>
                      {(species === 'dog' ? DOG_TYPES : CAT_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <button onClick={handleSearch} disabled={!bloodType || searching}
                    className="w-full py-3 text-white font-extrabold rounded-2xl transition hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg,#be123c,#e11d48)' }}>
                    {searching ? 'Searching nearby...' : '🔍 Find Nearby Donors'}
                  </button>
                </div>
              </div>
              <div>
                {results && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <p className="font-extrabold text-slate-800 mb-2">{results.length} donor(s) found for <span className="text-red-600">{bloodType}</span></p>
                    {results.length === 0 && (
                      <div className="bg-red-50 rounded-2xl border border-red-100 p-6 text-center">
                        <p className="font-bold text-red-600 mb-2">No available donors in your area</p>
                        <p className="text-sm text-red-400">Try expanding to partner clinics or contact emergency services</p>
                      </div>
                    )}
                    {results.map((d, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold flex-shrink-0 text-lg" style={{ background: d.color }}>🐾</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-extrabold text-slate-800">{d.name}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{d.available ? 'Available' : 'Resting'}</span>
                            </div>
                            <p className="text-xs text-slate-500">Owner: {d.owner} · {d.area}</p>
                          </div>
                          <p className="text-sm font-bold text-indigo-600">{d.dist}</p>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">Last donated: {d.lastDonated}</p>
                        {d.available && (
                          <div className="flex gap-2">
                            <button className="flex-1 py-2 rounded-xl text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#be123c,#e11d48)' }}>Contact Owner</button>
                            <button className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600">Get Directions</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
                {!results && !searching && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center h-full flex items-center justify-center">
                    <div>
                      <Droplets className="w-12 h-12 text-red-200 mx-auto mb-3" />
                      <p className="text-slate-400 font-semibold">Select blood type to find nearby donors</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'register' && (
          <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {registered ? (
              <div className="bg-green-50 border border-green-200 rounded-3xl p-12 text-center">
                <div className="text-5xl mb-4">❤️</div>
                <h3 className="text-2xl font-black text-green-700 mb-2">Registered as Donor!</h3>
                <p className="text-green-600">Your pet is now part of the blood donor network. You may be contacted during emergencies.</p>
                <button onClick={() => setRegistered(false)} className="mt-4 px-6 py-2.5 rounded-2xl text-white font-bold" style={{ background: GRAD }}>Done</button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 max-w-lg mx-auto">
                <h3 className="font-extrabold text-slate-800 text-lg mb-1">❤️ Register as Blood Donor</h3>
                <p className="text-slate-500 text-sm mb-5">Help save lives by registering your healthy pet as a blood donor</p>
                <div className="space-y-4">
                  {['Pet Name', 'Blood Type', 'Weight (kg)', 'Last Vet Checkup', 'Owner Contact'].map(f => (
                    <div key={f}>
                      <label className="text-xs font-bold text-slate-500 uppercase">{f}</label>
                      <input placeholder={`Enter ${f.toLowerCase()}...`} className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-200" />
                    </div>
                  ))}
                  <div className="bg-red-50 rounded-xl p-3 text-xs text-red-600 font-semibold">
                    Eligibility: Pet must be 1–8 years, healthy, vaccinated, ≥25kg (dogs) / ≥4.5kg (cats), never donated in last 28 days.
                  </div>
                  <button onClick={() => setRegistered(true)} className="w-full py-3 text-white font-extrabold rounded-2xl hover:-translate-y-0.5 transition" style={{ background: 'linear-gradient(135deg,#be123c,#e11d48)' }}>
                    ❤️ Register as Donor
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {tab === 'emergency' && (
          <motion.div key="emergency" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 max-w-lg mx-auto text-center">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-5xl mb-4">🚨</motion.div>
              <h3 className="text-2xl font-black text-red-700 mb-2">Emergency Blood Request</h3>
              <p className="text-red-600 mb-6 text-sm">For critical emergencies only — this will instantly alert all nearby donors and partner clinics</p>
              <div className="space-y-3 text-left">
                {['Pet Species & Blood Type', 'Clinic / Location', 'Emergency Contact', 'Vet Name'].map(f => (
                  <div key={f}>
                    <label className="text-xs font-bold text-red-600 uppercase">{f}</label>
                    <input placeholder={`${f}...`} className="w-full mt-1 border border-red-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 bg-white" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-5 py-4 text-white font-extrabold rounded-2xl text-lg shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg,#dc2626,#ef4444)' }}>
                🚨 SEND EMERGENCY ALERT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── 4. AI Lifelong Pet Companion ─────────────────────────────────────────────── */
export const AILifelongCompanionPanel = () => {
  const [tab, setTab] = useState('timeline');
  const [pet] = useState(() => {
    const pets = JSON.parse(localStorage.getItem('ownerPets') || '[]');
    return pets[0] || { name: 'Bruno', breed: 'Labrador', age: 3 };
  });

  const TIMELINE = [
    { year: '2022', events: [{ date: 'Mar 10', type: 'Birth', icon: '🎂', desc: 'Bruno born — 800g healthy pup', color: '#10b981' }, { date: 'Apr 05', type: 'First Vaccine', icon: '💉', desc: 'DHPP first dose administered', color: '#6366f1' }] },
    { year: '2023', events: [{ date: 'Jan 15', type: 'Milestone', icon: '🏆', desc: 'Completed puppy training class', color: '#f59e0b' }, { date: 'Jun 20', type: 'Health Event', icon: '🏥', desc: 'Minor ear infection — treated with Otomax', color: '#ef4444' }, { date: 'Dec 25', type: 'Memory', icon: '📸', desc: 'First Christmas photo with family', color: '#ec4899' }] },
    { year: '2024', events: [{ date: 'Mar 10', type: 'Birthday', icon: '🎂', desc: 'Turned 2! — Weight 26.5kg', color: '#10b981' }, { date: 'Aug 01', type: 'Achievement', icon: '🌟', desc: '500 walks milestone reached!', color: '#f59e0b' }] },
    { year: '2025', events: [{ date: 'Jan 08', type: 'Vaccination', icon: '💉', desc: 'Annual booster — all vaccines updated', color: '#6366f1' }, { date: 'May 10', type: 'Checkup', icon: '🩺', desc: 'Annual health checkup — excellent health', color: '#14b8a6' }] },
  ];

  const ACHIEVEMENTS = [
    { icon: '🏅', title: '1000 Walks Champion', desc: 'Walked over 1,000km lifetime', earned: true },
    { icon: '💪', title: 'Health Warrior', desc: 'Zero major illnesses for 2 years', earned: true },
    { icon: '❤️', title: 'Social Butterfly', desc: '50+ playdates completed', earned: false },
    { icon: '🌟', title: 'Vaccination Star', desc: 'Never missed a vaccine schedule', earned: true },
    { icon: '🍗', title: 'Diet Disciplined', desc: '90 days on a structured diet plan', earned: false },
    { icon: '🎓', title: 'Training Graduate', desc: 'Completed advanced obedience training', earned: true },
  ];

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#312e81,#4c1d95,#6d28d9)' }}>
        <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-1">🤖 AI Lifelong Memory</p>
        <h2 className="text-3xl font-black mb-1">AI Lifelong Pet Companion</h2>
        <p className="text-purple-200 text-sm">Complete lifetime health records, milestones, memories, and medical history — all in one intelligent timeline</p>
        <div className="flex gap-6 mt-4">
          {[['Life Events', TIMELINE.reduce((s, y) => s + y.events.length, 0), '#c4b5fd'], ['Achievements', ACHIEVEMENTS.filter(a => a.earned).length, '#86efac'], ['Memories', '47', '#fca5a5'], ['Health Records', '12', '#7dd3fc']].map(([l, v, c]) => (
            <div key={l}><p className="text-xl font-black" style={{ color: c }}>{v}</p><p className="text-xs text-purple-300">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-2xl p-1">
        {[['timeline', '📅 Life Timeline'], ['achievements', '🏆 Achievements'], ['memories', '📸 Memory Vault']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === k ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}`}>
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'timeline' && (
          <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-6">
              {TIMELINE.map((y, yi) => (
                <div key={yi}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-8 rounded-full flex items-center justify-center font-extrabold text-sm text-white" style={{ background: GRAD }}>{y.year}</div>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="ml-4 space-y-3">
                    {y.events.map((e, ei) => (
                      <motion.div key={ei} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ei * 0.1 }}
                        className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: e.color + '22' }}>
                          <span>{e.icon}</span>
                        </div>
                        <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold" style={{ color: e.color }}>{e.type}</span>
                            <span className="text-[10px] text-slate-400">{e.date}</span>
                          </div>
                          <p className="text-sm text-slate-700 mt-0.5">{e.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'achievements' && (
          <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 ${!a.earned ? 'opacity-50 grayscale' : ''}`}
                  style={{ borderColor: a.earned ? '#a78bfa44' : '#e2e8f0' }}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${a.earned ? 'bg-purple-50' : 'bg-slate-50'}`}>{a.icon}</div>
                  <div>
                    <p className="font-extrabold text-slate-800">{a.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{a.desc}</p>
                    <p className="text-xs mt-1 font-bold" style={{ color: a.earned ? '#7c3aed' : '#94a3b8' }}>{a.earned ? '✓ Earned' : '🔒 Locked'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'memories' && (
          <motion.div key="memories" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['First day home 🏠', 'First bath 🛁', 'First vet visit 🏥', 'Birthday party 🎂', 'Park adventure 🌳', 'Christmas 2023 🎄', 'Training graduation 🎓', 'Beach day 🏖️', 'Snowfall fun ❄️'].map((m, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03 }}
                  className="aspect-square rounded-2xl flex items-end p-3 cursor-pointer relative overflow-hidden"
                  style={{ background: `hsl(${i * 40}, 65%, 85%)` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <p className="relative z-10 text-white font-bold text-xs text-center w-full">{m}</p>
                </motion.div>
              ))}
              <motion.div whileHover={{ scale: 1.03 }}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-purple-300 transition">
                <div className="text-center">
                  <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-bold">Add Memory</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── 5. Smart Pet City Ecosystem ──────────────────────────────────────────────── */
export const SmartPetCityPanel = () => {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const CATEGORIES = [
    { key: 'all', label: 'All', icon: '🌆' },
    { key: 'clinic', label: 'Clinics', icon: '🏥' },
    { key: 'store', label: 'Pet Stores', icon: '🛒' },
    { key: 'adoption', label: 'Adoption', icon: '🐾' },
    { key: 'park', label: 'Parks', icon: '🌳' },
    { key: 'emergency', label: 'Emergency', icon: '🚨' },
  ];

  const PLACES = [
    { id: 1, name: 'PetCare Veterinary', type: 'clinic', x: 120, y: 80, rating: 4.8, open: true, dist: '0.3 km', desc: '24/7 Emergency + General Care', color: '#6366f1' },
    { id: 2, name: 'City Pet Store', type: 'store', x: 200, y: 120, rating: 4.5, open: true, dist: '0.7 km', desc: 'Food, toys, grooming supplies', color: '#14b8a6' },
    { id: 3, name: 'Adoption Center', type: 'adoption', x: 280, y: 90, rating: 4.9, open: true, dist: '1.1 km', desc: '120+ pets waiting for homes', color: '#f59e0b' },
    { id: 4, name: 'Cubbon Park', type: 'park', x: 160, y: 200, rating: 4.7, open: true, dist: '1.4 km', desc: 'Pet-friendly zone, leash required', color: '#10b981' },
    { id: 5, name: 'Emergency Animal Hospital', type: 'emergency', x: 80, y: 160, rating: 4.6, open: true, dist: '0.9 km', desc: '24/7 Critical care & ICU', color: '#ef4444' },
    { id: 6, name: 'Pets & More Boutique', type: 'store', x: 300, y: 170, rating: 4.3, open: false, dist: '2.0 km', desc: 'Premium accessories & treats', color: '#8b5cf6' },
    { id: 7, name: 'Indiranagar Dog Park', type: 'park', x: 240, y: 210, rating: 4.8, open: true, dist: '2.3 km', desc: 'Off-leash area, water stations', color: '#10b981' },
    { id: 8, name: 'Dr. Priya Animal Clinic', type: 'clinic', x: 340, y: 140, rating: 4.9, open: true, dist: '2.8 km', desc: 'Specialist dermatology & surgery', color: '#6366f1' },
  ];

  const filtered = filter === 'all' ? PLACES : PLACES.filter(p => p.type === filter);

  const CITY_STATS = [
    { label: 'Pet-Friendly Places', value: '284', icon: '📍', color: '#6366f1' },
    { label: 'Open Right Now', value: '187', icon: '✅', color: '#10b981' },
    { label: 'Active Events', value: '12', icon: '🎉', color: '#f59e0b' },
    { label: 'Emergency Services', value: '24/7', icon: '🚨', color: '#ef4444' },
  ];

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b,#334155)' }}>
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute bg-white rounded-sm" style={{ width: 2, height: Math.random() * 30 + 10, left: `${i * 5}%`, bottom: 0, opacity: Math.random() * 0.5 + 0.3 }} />
          ))}
        </div>
        <div className="relative z-10">
          <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-1">🌆 Cross-Dashboard Smart City</p>
          <h2 className="text-3xl font-black mb-1">Smart Pet City Ecosystem</h2>
          <p className="text-slate-400 text-sm mb-4">City-wide interactive network of pet services — clinics, stores, parks, adoption centers, and emergency services</p>
          <div className="flex gap-6">
            {CITY_STATS.map(s => (
              <div key={s.label}><p className="text-xl font-black" style={{ color: s.color }}>{s.icon} {s.value}</p><p className="text-xs text-slate-400">{s.label}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === c.key ? 'text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            style={filter === c.key ? { background: GRAD } : {}}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* City Map */}
        <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-6 relative overflow-hidden">
          <p className="font-extrabold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-400" /> Interactive City Map
            <span className="ml-auto text-xs text-green-400 font-bold animate-pulse">● Live</span>
          </p>
          <svg viewBox="0 0 400 300" className="w-full max-h-64">
            <rect width="400" height="300" fill="#0f172a" rx="12" />
            {/* Streets */}
            <line x1="0" y1="140" x2="400" y2="140" stroke="#1e293b" strokeWidth="2" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="#1e293b" strokeWidth="2" />
            <line x1="0" y1="70" x2="400" y2="70" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,8" />
            <line x1="0" y1="210" x2="400" y2="210" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,8" />
            <line x1="100" y1="0" x2="100" y2="300" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,8" />
            <line x1="300" y1="0" x2="300" y2="300" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,8" />
            {/* User location */}
            <motion.circle cx="200" cy="140" r="8" fill="#6366f1"
              animate={{ r: [8, 14, 8] }} transition={{ duration: 2, repeat: Infinity }} />
            <circle cx="200" cy="140" r="4" fill="white" />
            <text x="210" y="132" fill="#94a3b8" fontSize="9">You</text>
            {/* Places */}
            {filtered.map(p => (
              <g key={p.id} onClick={() => setSelected(selected?.id === p.id ? null : p)} style={{ cursor: 'pointer' }}>
                <motion.circle cx={p.x} cy={p.y} r="14" fill={p.color} opacity={0.15}
                  animate={{ r: [14, 20, 14] }} transition={{ duration: 2, delay: p.id * 0.3, repeat: Infinity }} />
                <circle cx={p.x} cy={p.y} r="9" fill={p.open ? p.color : '#6b7280'} stroke="white" strokeWidth="1.5" />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fill="white" fontSize="8">
                  {p.type === 'clinic' ? '🏥' : p.type === 'store' ? '🛒' : p.type === 'adoption' ? '🐾' : p.type === 'park' ? '🌳' : '🚨'}
                </text>
                <text x={p.x} y={p.y + 22} textAnchor="middle" fill={p.color} fontSize="8" fontWeight="bold">{p.name.split(' ')[0]}</text>
              </g>
            ))}
          </svg>
          <p className="text-xs text-slate-400 mt-3 text-center">Click pins to view details • Showing {filtered.length} places</p>
        </div>

        {/* Place List / Detail */}
        <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
          {selected ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: selected.color + '44' }}>
              <button onClick={() => setSelected(null)} className="text-xs text-slate-400 mb-3 hover:text-slate-600">← Back</button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: selected.color + '22' }}>
                  {selected.type === 'clinic' ? '🏥' : selected.type === 'store' ? '🛒' : selected.type === 'adoption' ? '🐾' : selected.type === 'park' ? '🌳' : '🚨'}
                </div>
                <div>
                  <p className="font-extrabold text-slate-800">{selected.name}</p>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-600">{selected.rating}</span>
                    <span className="text-xs text-slate-400">· {selected.dist}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">{selected.desc}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selected.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selected.open ? '● Open Now' : '● Closed'}</span>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded-xl text-xs font-bold text-white" style={{ background: GRAD }}>Get Directions</button>
                <button className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600">Call</button>
              </div>
            </motion.div>
          ) : (
            filtered.map(p => (
              <div key={p.id} onClick={() => setSelected(p)}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3 cursor-pointer hover:border-indigo-200 transition">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: p.color + '22' }}>
                  {p.type === 'clinic' ? '🏥' : p.type === 'store' ? '🛒' : p.type === 'adoption' ? '🐾' : p.type === 'park' ? '🌳' : '🚨'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-xs truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.dist} · ⭐ {p.rating}</p>
                </div>
                <span className={`text-[10px] font-bold ${p.open ? 'text-green-600' : 'text-slate-400'}`}>{p.open ? '●' : '○'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
