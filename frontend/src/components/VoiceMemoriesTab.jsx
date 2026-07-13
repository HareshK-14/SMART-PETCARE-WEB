import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Pause, Trash2, Clock, Heart } from 'lucide-react';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#6366f1,#a855f7)';

const DEMO_MEMORIES = [
  { id: 1, title: 'Morning greeting', emotion: '😊 Happy', duration: '0:12', date: 'May 15', waveform: [30,60,45,80,55,70,40,90,60,50,75,35,65,80,45], color: '#6366f1' },
  { id: 2, title: 'Playtime excitement', emotion: '🎉 Excited', duration: '0:08', date: 'May 14', waveform: [80,55,90,40,75,60,85,50,95,65,70,45,80,60,55], color: '#a855f7' },
  { id: 3, title: 'Bedtime cuddle', emotion: '😴 Calm', duration: '0:15', date: 'May 13', waveform: [20,35,25,40,30,45,20,35,28,40,25,38,22,35,30], color: '#14b8a6' },
];

export default function VoiceMemoriesTab() {
  const [recording, setRecording]   = useState(false);
  const [memories, setMemories]     = useState(DEMO_MEMORIES);
  const [playing, setPlaying]       = useState(null);
  const [title, setTitle]           = useState('');
  const [recTime, setRecTime]       = useState(0);
  const [timerRef, setTimerRef]     = useState(null);

  const petName = JSON.parse(localStorage.getItem('ownerPets') || '[]')[0]?.name || 'Bruno';

  const startRecording = () => {
    setRecording(true); setRecTime(0);
    const t = setInterval(() => setRecTime(s => s + 1), 1000);
    setTimerRef(t);
  };

  const stopRecording = () => {
    clearInterval(timerRef); setRecording(false);
    if (recTime < 2) return;
    const mem = {
      id: Date.now(), title: title || `Voice Memory ${memories.length + 1}`,
      emotion: '🎵 Recorded', duration: `0:${String(recTime).padStart(2, '0')}`, date: 'Today',
      waveform: Array.from({ length: 15 }, () => Math.floor(Math.random() * 70 + 20)), color: '#6366f1'
    };
    const next = [mem, ...memories];
    setMemories(next);
    setTitle('');
    logGlobalActivity('Owner', `Voice memory saved: "${mem.title}"`, '🎙', 'activity');
  };

  const deleteMemory = id => setMemories(m => m.filter(x => x.id !== id));

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[130px]">🎙</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🎙 Memory Capsule</span>
        <h2 className="text-2xl font-black mt-2">Smart Pet Voice Memories</h2>
        <p className="text-indigo-100 text-sm mt-1">Capture {petName}'s voice moments, emotional audio interactions, and preserve precious soundscapes forever.</p>
        <div className="flex gap-6 mt-4">
          {[['Memories', memories.length], ['Total Time', memories.reduce((s, m) => s + parseInt(m.duration.split(':')[1]), 0) + 's'], ['Emotions', new Set(memories.map(m => m.emotion)).size]].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Recorder */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="font-extrabold text-slate-800 mb-4">🎙 Record New Memory</p>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Memory title (optional)..."
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none mb-4" />

        <div className="flex flex-col items-center gap-4">
          {/* Animated mic */}
          <motion.div className="relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: recording ? 'linear-gradient(135deg,#ef4444,#f97316)' : GRAD }}
            animate={recording ? { scale: [1, 1.08, 1] } : {}} transition={{ repeat: Infinity, duration: 0.6 }}
            onClick={recording ? stopRecording : startRecording}>
            {recording && (
              <motion.div className="absolute inset-0 rounded-full border-4 border-red-400"
                animate={{ scale: [1, 1.3], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 1 }} />
            )}
            <Mic className="w-10 h-10 text-white" />
          </motion.div>

          {recording ? (
            <div className="text-center">
              <p className="font-extrabold text-red-500 animate-pulse">🔴 Recording... {recTime}s</p>
              <div className="flex items-end gap-1 justify-center mt-2 h-10">
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.div key={i} className="w-1.5 bg-red-400 rounded-full"
                    animate={{ height: [4, Math.random() * 30 + 8, 4] }}
                    transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.04 }} />
                ))}
              </div>
              <button onClick={stopRecording} className="mt-3 px-6 py-2 bg-red-500 text-white font-bold text-sm rounded-xl">Stop & Save</button>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Tap mic to start recording</p>
          )}
        </div>
      </div>

      {/* Memory list */}
      <div className="space-y-3">
        <p className="font-extrabold text-slate-800">🎵 Saved Voice Memories</p>
        {memories.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setPlaying(playing === m.id ? null : m.id)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{ background: m.color }}>
                {playing === m.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm">{m.title}</p>
                <p className="text-xs text-slate-400">{m.emotion} · {m.duration} · {m.date}</p>
                {/* Waveform */}
                <div className="flex items-end gap-0.5 mt-2 h-8">
                  {m.waveform.map((h, j) => (
                    <motion.div key={j} className="w-1.5 rounded-full flex-shrink-0"
                      style={{ height: h * 0.32, background: playing === m.id ? m.color : '#e2e8f0' }}
                      animate={playing === m.id ? { height: [h * 0.32, h * 0.5, h * 0.32] } : {}}
                      transition={{ repeat: Infinity, duration: 0.5, delay: j * 0.03 }} />
                  ))}
                </div>
              </div>
              <button onClick={() => deleteMemory(m.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-400 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
