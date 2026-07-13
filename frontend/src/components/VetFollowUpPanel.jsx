import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Calendar, CheckCircle, Clock, Plus, RefreshCw, MessageSquare } from 'lucide-react';
import { logGlobalActivity } from '../utils/activityFeed';

const GRAD = 'linear-gradient(135deg,#14b8a6,#6366f1)';

const INIT_CAMPAIGNS = [
  { id: 1, name: 'Post-Surgery Follow-up', patient: 'Bruno (Lab)', type: 'WhatsApp', status: 'sent',      scheduledAt: 'May 14 10:00 AM', message: 'Hi! How is Bruno recovering after surgery? Any concerns?', opened: true  },
  { id: 2, name: 'Vaccination Reminder',   patient: 'Luna (Persian)', type: 'SMS',  status: 'scheduled',  scheduledAt: 'May 16 09:00 AM', message: 'Reminder: Luna\'s Rabies booster is due next week.',    opened: false },
  { id: 3, name: 'Annual Checkup Prompt',  patient: 'Rocky (Husky)', type: 'Email', status: 'draft',       scheduledAt: 'May 18 11:00 AM', message: 'Time for Rocky\'s annual wellness examination!',         opened: false },
];

const TEMPLATES = [
  { name: 'Post-Op Follow-up',     msg: 'Hi [Owner]! How is [Pet] recovering after the procedure? Please let us know if you notice any concerns. We\'re here to help 24/7.' },
  { name: 'Vaccination Due',       msg: 'Reminder: [Pet]\'s vaccination is due on [Date]. Please book your appointment at your earliest convenience.' },
  { name: 'Annual Wellness Check', msg: 'It\'s time for [Pet]\'s annual health check-up. Early detection keeps your pet healthy! Book now.' },
  { name: 'Prescription Refill',   msg: '[Pet]\'s medication is due for a refill. Contact us to arrange a repeat prescription.' },
];

const STATUS_CFG = {
  sent:      { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  scheduled: { bg: 'bg-blue-100',   text: 'text-blue-700'    },
  draft:     { bg: 'bg-slate-100',   text: 'text-slate-500'   },
  failed:    { bg: 'bg-rose-100',    text: 'text-rose-700'    },
};

export default function VetFollowUpPanel() {
  const [campaigns, setCampaigns] = useState(INIT_CAMPAIGNS);
  const [showAdd, setShowAdd]     = useState(false);
  const [newC, setNewC]           = useState({ name: '', patient: '', type: 'WhatsApp', message: '', scheduledAt: '' });
  const [filter, setFilter]       = useState('all');

  const addCampaign = () => {
    if (!newC.name.trim() || !newC.patient.trim()) return;
    const camp = { id: Date.now(), ...newC, status: 'scheduled', opened: false };
    setCampaigns(c => [camp, ...c]);
    logGlobalActivity('Vet', `Follow-up campaign "${newC.name}" scheduled`, '📬', 'vet');
    setNewC({ name: '', patient: '', type: 'WhatsApp', message: '', scheduledAt: '' });
    setShowAdd(false);
  };

  const sendNow = (id) => {
    setCampaigns(c => c.map(x => x.id === id ? { ...x, status: 'sent', opened: true } : x));
    logGlobalActivity('Vet', 'Follow-up message sent to patient', '✅', 'vet');
  };

  const visible = filter === 'all' ? campaigns : campaigns.filter(c => c.status === filter);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-6 -top-6 opacity-10 text-[140px]">📬</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">📬 Follow-up AI</span>
        <h2 className="text-2xl font-black mt-2">Smart Follow-up Campaign Manager</h2>
        <p className="text-teal-100 text-sm mt-1">Automated multi-channel patient follow-up campaigns via WhatsApp, SMS, and Email — all AI-personalized.</p>
        <div className="flex gap-6 mt-4">
          {[['Total', campaigns.length], ['Sent', campaigns.filter(c => c.status === 'sent').length], ['Scheduled', campaigns.filter(c => c.status === 'scheduled').length], ['Open Rate', campaigns.filter(c => c.opened).length + '/' + campaigns.length]].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-teal-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[['WhatsApp', campaigns.filter(c => c.type === 'WhatsApp').length, '#25d366'], ['SMS', campaigns.filter(c => c.type === 'SMS').length, '#6366f1'], ['Email', campaigns.filter(c => c.type === 'Email').length, '#ef4444']].map(([t, n, color]) => (
          <div key={t} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-xl font-extrabold" style={{ color }}>{n}</p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{t}</p>
          </div>
        ))}
      </div>

      {/* Templates */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">📄 Message Templates</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TEMPLATES.map((t, i) => (
            <button key={t.name} onClick={() => setNewC(n => ({ ...n, message: t.msg, name: t.name }))}
              className="p-3 text-left bg-indigo-50 border border-indigo-100 rounded-xl hover:border-indigo-300 transition">
              <p className="text-xs font-bold text-indigo-700">{t.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{t.msg}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Add campaign */}
      <div className="flex gap-2">
        {['all', 'sent', 'scheduled', 'draft'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border capitalize transition ${filter === f ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600'}`}
            style={filter === f ? { background: GRAD } : {}}>
            {f}
          </button>
        ))}
        <button onClick={() => setShowAdd(s => !s)} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-xl" style={{ background: GRAD }}>
          <Plus className="w-3.5 h-3.5" />New Campaign
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-teal-200 shadow-sm p-5 space-y-3">
            <p className="font-extrabold text-slate-800 mb-1">➕ New Follow-up Campaign</p>
            <div className="grid grid-cols-2 gap-3">
              <input value={newC.name} onChange={e => setNewC(n => ({ ...n, name: e.target.value }))} placeholder="Campaign name"
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300 outline-none" />
              <input value={newC.patient} onChange={e => setNewC(n => ({ ...n, patient: e.target.value }))} placeholder="Patient (e.g., Bruno - Lab)"
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select value={newC.type} onChange={e => setNewC(n => ({ ...n, type: e.target.value }))}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300 outline-none">
                {['WhatsApp', 'SMS', 'Email'].map(t => <option key={t}>{t}</option>)}
              </select>
              <input type="datetime-local" value={newC.scheduledAt} onChange={e => setNewC(n => ({ ...n, scheduledAt: e.target.value }))}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300 outline-none" />
            </div>
            <textarea value={newC.message} onChange={e => setNewC(n => ({ ...n, message: e.target.value }))} placeholder="Message content..." rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300 outline-none resize-none" />
            <div className="flex gap-2">
              <button onClick={addCampaign} className="flex-1 py-2.5 text-white font-bold text-sm rounded-xl" style={{ background: GRAD }}>Schedule Campaign</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 font-bold text-sm text-slate-600 rounded-xl border border-slate-200">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaign list */}
      <div className="space-y-3">
        {visible.map((c, i) => {
          const cfg = STATUS_CFG[c.status] || STATUS_CFG.draft;
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-extrabold text-slate-800 text-sm">{c.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${cfg.bg} ${cfg.text}`}>{c.status}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{c.type}</span>
                  </div>
                  <p className="text-xs text-slate-500">🐾 {c.patient}</p>
                  <p className="text-xs text-slate-400 mt-0.5">📅 {c.scheduledAt}</p>
                  <p className="text-xs text-slate-600 mt-1 bg-slate-50 rounded-lg p-2 italic">"{c.message.slice(0, 80)}..."</p>
                </div>
                {c.status !== 'sent' && (
                  <button onClick={() => sendNow(c.id)} className="px-3 py-1.5 text-xs font-bold text-white rounded-xl flex-shrink-0" style={{ background: GRAD }}>
                    Send Now
                  </button>
                )}
                {c.status === 'sent' && c.opened && (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 flex-shrink-0">
                    <CheckCircle className="w-3 h-3" />Opened
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
        {visible.length === 0 && (
          <p className="text-center text-slate-400 py-8">No campaigns in this category.</p>
        )}
      </div>
    </div>
  );
}
