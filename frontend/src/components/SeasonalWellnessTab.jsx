import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudRain, Cloud, Wind, Thermometer, RefreshCw, AlertTriangle } from 'lucide-react';

const GRAD = 'linear-gradient(135deg,#14b8a6,#6366f1,#f59e0b)';

const SEASONS = {
  Summer: {
    icon:'☀️', color:'#f59e0b', bg:'from-amber-400 to-orange-500',
    alerts:['Heat stroke risk is HIGH — never leave pets in cars','Keep fresh cool water available at all times','Avoid walks between 11am–4pm','Watch for excessive panting or drooling'],
    care:['Apply pet-safe sunscreen to exposed skin','Cooling mat or ice wrap for short-nosed breeds','Frozen treats to keep hydrated','Check paw pads on hot pavement'],
    risk:'Heat Stroke',
  },
  Monsoon: {
    icon:'🌧️', color:'#6366f1', bg:'from-blue-400 to-indigo-600',
    alerts:['Leptospirosis risk from contaminated water puddles','Ear infections spike — dry ears after exposure','Watch for skin fungal infections in humid weather','Keep indoor spaces dry and well-ventilated'],
    care:['Towel dry after every walk','Paw cleaning wipes after outdoor exposure','Avoid stagnant water and puddles','Anti-tick and flea treatment is essential'],
    risk:'Leptospirosis',
  },
  Winter: {
    icon:'❄️', color:'#3b82f6', bg:'from-blue-300 to-cyan-500',
    alerts:['Hypothermia risk for short-haired breeds','Antifreeze is toxic — keep out of reach','Cracked paw pads from cold pavement','Arthritis flare-ups in senior pets'],
    care:['Warm pet sweater for outdoor walks','Paw balm to prevent cracking','Heated sleeping area or warm blanket','Shorter but more frequent exercise sessions'],
    risk:'Hypothermia',
  },
  Spring: {
    icon:'🌸', color:'#10b981', bg:'from-emerald-400 to-teal-500',
    alerts:['Allergy season — watch for itching, watery eyes','Ticks and fleas become active — preventive treatment needed','Toxic spring plants (tulips, daffodils) are dangerous','Heartworm prevention crucial as mosquitoes appear'],
    care:['Annual allergy check with vet','Flea & tick prevention medication','Yard check for toxic plants before outdoor play','Spring vaccination and health check-up'],
    risk:'Seasonal Allergies',
  },
};

const WEATHER_TIPS = {
  Sunny:  { icon:'☀️', tips:['Extra hydration', 'Shade access', 'Shorter walks'] },
  Rainy:  { icon:'🌧️', tips:['Dry ears after walk', 'Avoid puddles', 'Indoor play'] },
  Cloudy: { icon:'☁️', tips:['Great for long walks', 'Normal activity ok', 'Monitor mood'] },
  Windy:  { icon:'💨', tips:['Secure outdoor items', 'Anxiety may increase', 'Check for eye irritation'] },
};

export default function SeasonalWellnessTab() {
  const [season, setSeason] = useState('Summer');
  const [weather, setWeather] = useState('Sunny');
  const s = SEASONS[season];
  const w = WEATHER_TIPS[weather];

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Hero */}
      <div className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-r ${s.bg}`}>
        <div className="absolute -right-6 -top-6 opacity-15 text-[140px]">{s.icon}</div>
        <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{s.icon} Seasonal Wellness</span>
        <h2 className="text-2xl font-black mt-2">AI Seasonal Wellness Engine</h2>
        <p className="text-white/80 text-sm mt-1">Weather-aware pet care recommendations and seasonal health alerts powered by AI.</p>
        <div className="flex gap-6 mt-4">
          {[['Season',season],['Weather',weather],['Primary Risk',s.risk],['Alerts',s.alerts.length]].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-white/70">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Season + weather selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="font-extrabold text-slate-800 mb-3">🗓️ Current Season</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(SEASONS).map(s=>(
              <button key={s} onClick={()=>setSeason(s)}
                className={`py-2.5 rounded-xl font-bold text-sm border-2 transition ${season===s?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                style={season===s?{background:SEASONS[s].color}:{}}>
                {SEASONS[s].icon} {s}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="font-extrabold text-slate-800 mb-3">🌤️ Today's Weather</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(WEATHER_TIPS).map(w=>(
              <button key={w} onClick={()=>setWeather(w)}
                className={`py-2.5 rounded-xl font-bold text-sm border-2 transition ${weather===w?'text-white bg-indigo-500 border-indigo-500':'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                {WEATHER_TIPS[w].icon} {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weather quick tips */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="font-extrabold text-slate-800 mb-3">{w.icon} Today's Quick Tips ({weather} Day)</p>
        <div className="flex gap-3 flex-wrap">
          {w.tips.map((t,i)=>(
            <span key={i} className="px-3 py-1.5 text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl">{t}</span>
          ))}
        </div>
      </div>

      {/* Seasonal health alerts */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">⚠️ {season} Health Alerts</p>
        <div className="space-y-2">
          {s.alerts.map((a,i)=>(
            <motion.div key={a} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
              className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
              <span className="text-sm text-amber-800 font-medium">{a}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Seasonal care recommendations */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">💚 {season} Care Recommendations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {s.care.map((c,i)=>(
            <motion.div key={c} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              className="flex items-center gap-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"/>
              <span className="text-sm font-bold text-emerald-800">{c}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
