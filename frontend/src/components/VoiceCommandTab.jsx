import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Zap, CheckCircle, Clock } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)';

const COMMANDS = [
  { phrase: 'book appointment', action: 'Opening appointment scheduler...', icon: '📅', tab: 'appointments' },
  { phrase: 'emergency SOS',    action: 'Activating Emergency SOS protocol!', icon: '🚨', tab: 'emergency' },
  { phrase: 'check Bruno health', action: 'Loading health analytics for Bruno...', icon: '❤️', tab: 'health' },
  { phrase: 'open diet planner', action: 'Launching AI Diet Planner...', icon: '🍗', tab: 'dietplanner' },
  { phrase: 'show rewards',      action: 'Opening Paw Points & Rewards...', icon: '🏆', tab: 'rewards' },
  { phrase: 'find nearby vet',   action: 'Searching nearby vets & clinics...', icon: '🏥', tab: 'services' },
  { phrase: 'track location',    action: 'Loading SmartCollar GPS tracker...', icon: '📍', tab: 'smartcollar' },
  { phrase: 'show memories',     action: 'Opening Memory Lane gallery...', icon: '📸', tab: 'memories' },
];

const SUGGESTIONS = [
  '"Hey PetCare, book appointment"',
  '"Hey PetCare, emergency SOS"',
  '"Hey PetCare, check Bruno health"',
  '"Hey PetCare, find nearby vet"',
  '"Hey PetCare, open diet planner"',
  '"Hey PetCare, show rewards"',
];

const HISTORY = [
  { time: '09:15 AM', phrase: 'book appointment', result: 'Appointment booked for Bruno — May 14', status: 'success' },
  { time: '08:42 AM', phrase: 'check Bruno health', result: 'Health score: 87/100 — Excellent', status: 'success' },
  { time: 'Yesterday', phrase: 'emergency SOS', result: 'Test alert dispatched to Dr. Sharma', status: 'warning' },
];

export default function VoiceCommandTab() {
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult]         = useState(null);
  const [pulseSize, setPulseSize]   = useState(1);
  const [waveActive, setWaveActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (listening) {
      setWaveActive(true);
      intervalRef.current = setInterval(() => {
        setPulseSize(p => p === 1 ? 1.15 : 1);
      }, 600);
      // Simulate voice recognition after 2.5s
      const timer = setTimeout(() => {
        const demo = COMMANDS[Math.floor(Math.random() * COMMANDS.length)];
        setTranscript(demo.phrase);
        setListening(false);
        setWaveActive(false);
        clearInterval(intervalRef.current);
        setTimeout(() => {
          setResult(demo);
        }, 800);
      }, 2500);
      return () => { clearTimeout(timer); clearInterval(intervalRef.current); };
    } else {
      setWaveActive(false);
      clearInterval(intervalRef.current);
    }
  }, [listening]);

  const startListening = () => {
    setTranscript('');
    setResult(null);
    setListening(true);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">🎙️</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🎙️ Voice AI</span>
        <h2 className="text-2xl font-black mt-2">Voice-Activated Command Center</h2>
        <p className="text-purple-100 text-sm mt-1">Control your entire PetCare dashboard hands-free with natural language voice commands.</p>
        <div className="flex gap-6 mt-4">
          {[['Commands', COMMANDS.length], ['Last Used', '08:42 AM'], ['Accuracy', '97%'], ['Language', 'English']].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-purple-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Main mic UI */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center">
        <p className="font-extrabold text-slate-800 mb-2 text-center">
          {listening ? '🎙️ Listening...' : result ? '✅ Command Executed' : '🎙️ Tap to Speak'}
        </p>
        <p className="text-xs text-slate-400 mb-8 text-center">
          {listening ? 'Say your command now...' : 'Say "Hey PetCare" followed by a command'}
        </p>

        {/* Animated mic button */}
        <div className="relative mb-8">
          {listening && (
            <>
              {[1, 2, 3].map(i => (
                <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-purple-400/30"
                  animate={{ scale: [1, 1.5 + i * 0.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
              ))}
            </>
          )}
          <motion.button
            animate={{ scale: pulseSize }}
            transition={{ duration: 0.3 }}
            onClick={listening ? () => setListening(false) : startListening}
            className="relative w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl"
            style={{ background: listening ? 'linear-gradient(135deg,#ef4444,#f97316)' : GRAD }}>
            {listening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </motion.button>
        </div>

        {/* Wave visualization */}
        {waveActive && (
          <div className="flex items-end gap-1 h-10 mb-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div key={i} className="w-1.5 rounded-full"
                style={{ background: GRAD }}
                animate={{ height: [4, Math.random() * 36 + 4, 4] }}
                transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.05 }} />
            ))}
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-center mb-4">
            <p className="text-xs text-slate-400 mb-1">Heard:</p>
            <p className="font-extrabold text-slate-800 text-lg">"{transcript}"</p>
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full rounded-2xl p-4 text-center border"
              style={{ background: '#10b98115', borderColor: '#10b98133' }}>
              <span className="text-3xl">{result.icon}</span>
              <p className="font-extrabold text-emerald-700 mt-2">{result.action}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Command list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">⚡ Available Voice Commands</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {COMMANDS.map((c, i) => (
            <motion.div key={c.phrase} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-100 rounded-xl hover:border-purple-300 transition cursor-pointer"
              onClick={() => { setTranscript(c.phrase); setResult(c); }}>
              <span className="text-xl">{c.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-purple-800">"{c.phrase}"</p>
                <p className="text-xs text-slate-400 truncate">{c.action}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">💡 Try Saying...</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <span key={i} className="px-3 py-1.5 text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl">{s}</span>
          ))}
        </div>
      </div>

      {/* Command history */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🕐 Command History</p>
        <div className="space-y-3">
          {HISTORY.map((h, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">"{h.phrase}"</p>
                <p className="text-xs text-slate-500">{h.result}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] text-slate-400">{h.time}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${h.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{h.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
