import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck, AlertTriangle, Calendar, Package, Stethoscope, ShoppingCart, Shield, Activity, Heart } from 'lucide-react';

// Map notification type → dashboard tab key
const TYPE_NAV = {
  alert:       'passport',      // Vaccination due → Health Passport
  order:       'marketplace',   // Order → Marketplace
  appt:        'cal-galaxy',    // Appointment → Calendar Galaxy
  info:        'marketplace',   // New products → Marketplace
  emergency:   'emergency',     // Emergency → Emergency SOS
  health:      'health',        // Health alert → Health Tracker
  walk:        'activity',      // Walk → Activity Tracker
  reward:      'rewards',       // Reward → Rewards
};

const TYPE_ACTION = {
  alert:       'View Health Passport',
  order:       'Go to Marketplace',
  appt:        'View Calendar',
  info:        'Browse Products',
  emergency:   'Open Emergency SOS',
  health:      'Open Health Tracker',
  walk:        'View Activity',
  reward:      'View Rewards',
};

const ICONS = {
  alert:     { icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' },
  order:     { icon: Package,       color: '#6366f1', bg: '#eef2ff' },
  appt:      { icon: Stethoscope,   color: '#14b8a6', bg: '#f0fdfa' },
  info:      { icon: Bell,          color: '#f59e0b', bg: '#fffbeb' },
  emergency: { icon: Shield,        color: '#ef4444', bg: '#fef2f2' },
  health:    { icon: Heart,         color: '#ec4899', bg: '#fdf2f8' },
  walk:      { icon: Activity,      color: '#10b981', bg: '#f0fdf4' },
  reward:    { icon: ShoppingCart,  color: '#a855f7', bg: '#faf5ff' },
};

const DEFAULT_NOTIFS = [
  { id:1, type:'alert',  title:'Vaccination Due!',           body:"Luna's Rabies vaccine is overdue. Book now.",              time:'2 hrs ago',  read:false },
  { id:2, type:'order',  title:'Order Delivered',            body:'ORD-2841 has been delivered to your address.',             time:'1 day ago',  read:false },
  { id:3, type:'appt',   title:'Appointment Confirmed',      body:"Dr. Priya confirmed Milo's appointment for Apr 20.",       time:'2 days ago', read:true  },
  { id:4, type:'info',   title:'New Products Available',     body:'Check out premium cat food now in stock!',                 time:'3 days ago', read:true  },
  { id:5, type:'health', title:'Health Score Updated',       body:"Bruno's health score improved to 92% this week.",          time:'4 days ago', read:true  },
  { id:6, type:'walk',   title:'Walk Milestone Reached!',    body:'10 walks completed this month. Keep it up!',               time:'5 days ago', read:true  },
];

const NotificationsPanel = ({ setActive }) => {
  const [notifs, setNotifs] = useState(
    () => JSON.parse(localStorage.getItem('notifications') || 'null') || DEFAULT_NOTIFS
  );

  const save    = (n) => { setNotifs(n); localStorage.setItem('notifications', JSON.stringify(n)); };
  const markAll = () => save(notifs.map(n => ({ ...n, read: true })));
  const dismiss = (id) => save(notifs.filter(n => n.id !== id));
  const unread  = notifs.filter(n => !n.read).length;

  const handleClick = (n) => {
    // Mark as read
    save(notifs.map(x => x.id === n.id ? { ...x, read: true } : x));
    // Navigate to the relevant tab
    const tab = TYPE_NAV[n.type];
    if (tab && setActive) setActive(tab);
  };

  const G = 'linear-gradient(135deg,#6366f1,#14b8a6)';

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white" style={{ background: G }}>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">🔔 Smart Alerts</span>
        <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notifications
          {unread > 0 && (
            <span className="ml-1 w-7 h-7 rounded-full bg-rose-500 text-white text-xs font-extrabold flex items-center justify-center">
              {unread}
            </span>
          )}
        </h2>
        <p className="text-indigo-100 text-sm mt-1">
          {unread > 0 ? `${unread} unread — click any notification to go to the page.` : 'All caught up! No unread notifications.'}
        </p>
        <div className="flex gap-6 mt-3">
          {[['Total', notifs.length], ['Unread', unread], ['Read', notifs.length - unread]].map(([l, v]) => (
            <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Mark all + filter row */}
      {unread > 0 && (
        <div className="flex justify-end">
          <button onClick={markAll}
            className="flex items-center gap-1.5 text-sm text-indigo-600 font-bold hover:text-indigo-800 transition px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        </div>
      )}

      {/* Notification list */}
      <div className="space-y-2">
        <AnimatePresence>
          {notifs.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-3 text-slate-200" />
              <p className="font-bold text-slate-500">All caught up!</p>
              <p className="text-sm mt-1">No notifications right now.</p>
            </motion.div>
          )}

          {notifs.map(n => {
            const cfg  = ICONS[n.type] || ICONS.info;
            const Icon = cfg.icon;
            const tab  = TYPE_NAV[n.type];
            const action = TYPE_ACTION[n.type];

            const onCardClick = () => {
              // Direct sub-section routing logic
              if (n.type === 'alert') {
                localStorage.setItem('passportActiveSection', 'vaccinations');
              } else if (n.type === 'health') {
                localStorage.setItem('passportActiveSection', 'records');
              }
              handleClick(n);
            };

            return (
              <motion.div key={n.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                onClick={onCardClick}
                className={`rounded-2xl border transition-all overflow-hidden cursor-pointer hover:shadow-md hover:border-indigo-200 ${n.read ? 'bg-white border-slate-100' : 'bg-indigo-50/50 border-indigo-100 shadow-sm'}`}>

                {/* Main row */}
                <div className="flex items-start gap-4 p-4">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm" style={{ background: cfg.bg }}>
                    <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-bold text-slate-900 text-sm ${n.read ? 'opacity-70 font-semibold' : ''}`}>{n.title}</p>
                      {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-slate-400 text-[10px] mt-1.5 font-medium">{n.time}</p>
                  </div>

                  {/* Dismiss */}
                  <button onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                    className="text-slate-300 hover:text-rose-400 transition flex-shrink-0 p-1 rounded-lg hover:bg-rose-50" title="Dismiss">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Action button row */}
                {tab && (
                  <div className="px-4 pb-3 flex items-center justify-between border-t border-slate-50 pt-2.5 bg-slate-50/30">
                    <span className="flex items-center gap-1.5 text-xs font-bold transition hover:opacity-90"
                      style={{ color: cfg.color }}>
                      {action} →
                    </span>
                    {!n.read && (
                      <button onClick={e => { e.stopPropagation(); save(notifs.map(x => x.id === n.id ? { ...x, read: true } : x)); }}
                        className="text-[10px] text-slate-400 hover:text-slate-600 font-bold transition">
                        Mark as read
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPanel;
