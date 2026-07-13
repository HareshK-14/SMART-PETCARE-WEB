import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Stethoscope, Users, ShieldCheck, LogOut,
  CheckCircle, XCircle, Clock, Edit3, Save, X, Eye, ChevronRight,
  Activity, TrendingUp, Bell, Search, AlertTriangle, HeartPulse, FileText,
  MessageSquareWarning, DollarSign, Trash2, MessagesSquare, User,
  ShieldAlert, BellRing, BarChart3, CreditCard, Download, Send,
  Zap, Ban, Flag, CircleX, CheckCircle2, Filter, Plus, MessageSquare, RefreshCw,
  Brain, Sparkles, Star, Building2, Globe, MapPin
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { logGlobalActivity } from '../utils/activityFeed';
import { db } from '../utils/dataBridge';
import { EcosystemSimulatorPanel, EcosystemStabilityPanel, RevenueEvolutionPanel, CommandGridPanel } from '../components/AdminIntelPanels';
import { EcosystemPulsePanel, EcosystemGalaxyPanel, HealthGlassboardPanel, QuantumCorePanel, PetCityPanel } from '../components/AdminFuturisticPanels';
import { LiveEngagementRadarPanel, CareOrchestratorPanel } from '../components/VetFuturisticPanels';
import { EcosystemBrainPanel, EcosystemPowerGridPanel, RevenueConstellationPanel, PlatformMoodPanel, IntelObservatoryPanel } from '../components/AdminExclusivePanels';
import { EcosystemHarmonyPanel, UserBehaviorConstellationPanel, EcosystemWeatherPanel, RevenueOceanPanel, QuantumIntelGridPanel } from '../components/AdminAdvancedPanels';
import { GlobalEcosystemAuraPanel, UserExperienceDNAPanel, PlatformEmotionGridPanel, EngagementVolcanoPanel, RevenueEnergyMatrixPanel, TrustPulseEnginePanel, EcosystemBalanceOrbitPanel, GlobalActivitySkylinePanel, IntelligenceStreamNetworkPanel, QuantumEvolutionCorePanel } from '../components/AdminElitePanels2';
import { UniversalExperienceDNAPanel, DigitalEmotionStreamPanel, AIBehaviorWavesPanel, GlobalWellnessNetworkPanel, AIInsightNebulaPanel, ExperienceResonanceEnginePanel, RealtimeActivityCosmosPanel, PetcareSyncFieldPanel, FutureWellnessOraclePanel, QuantumIntelligenceSpherePanel } from '../components/CrossDashboardElitePanels';
import WelfareMonitoringPanel from '../components/WelfareMonitoringPanel';
import InnovationMarketplacePanel from '../components/InnovationMarketplacePanel';
import GlobalStatsPanel from '../components/GlobalStatsPanel';
import { NationalHealthMapPanel, AIFraudDetectionPanel } from '../components/AdminInnovativePanels';
import {
  DigitalPetPassportPanel,
  DisasterRescuePanel,
  PetBloodDonorNetworkPanel,
  AILifelongCompanionPanel,
  SmartPetCityPanel
} from '../components/CrossInnovativePanels';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const API = 'http://localhost:8081/api';

// ── Gradient helpers ──────────────────────────────────────────────────────────
const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';
const GRADRED = 'linear-gradient(135deg,#ef4444,#f97316)';
const GRADGREEN = 'linear-gradient(135deg,#10b981,#059669)';

// ── Status badge ──────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    pending:      'bg-yellow-100 text-yellow-700 border-yellow-200',
    approved:     'bg-green-100 text-green-700 border-green-200',
    rejected:     'bg-rose-100 text-rose-700 border-rose-200',
    'no-profile': 'bg-slate-100 text-slate-500 border-slate-200',
    OWNER:  'bg-indigo-100 text-indigo-700 border-indigo-200',
    VET:    'bg-teal-100 text-teal-700 border-teal-200',
    ADMIN:  'bg-purple-100 text-purple-700 border-purple-200',
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${map[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {status === 'no-profile' ? 'Profile Incomplete' : status}
    </span>
  );
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
const MENU = [
  { key: 'analytics',     label: 'Analytics',          icon: LayoutDashboard },
  { key: 'vets',          label: 'Vet Approvals',       icon: Stethoscope },
  { key: 'users',         label: 'User Management',     icon: Users },
  { key: 'health',        label: 'Health Insights',     icon: HeartPulse },
  { key: 'security',      label: 'Fraud & Security',    icon: ShieldAlert },
  { key: 'notifications', label: 'Notifications',       icon: BellRing },
  { key: 'payments',      label: 'Payment Monitoring',  icon: CreditCard },
  { key: 'reports',       label: 'Report Generation',   icon: BarChart3 },
  { key: 'moderation',    label: 'Content Moderation',       icon: MessageSquareWarning },
  { key: 'financials',    label: 'Platform Financials',       icon: DollarSign },
  { key: 'emergency-monitor',   label: 'Emergency Monitor',   icon: ShieldAlert },
  { key: 'marketplace-analytics', label: 'Marketplace Analytics', icon: BarChart3 },
  { key: 'system-monitor',  label: 'System Monitor',      icon: Activity },
  { key: 'subscriptions',   label: 'Subscription Mgmt',   icon: CreditCard },
  { key: 'ai-activity',     label: 'AI Activity Monitor',  icon: Zap },
  { key: 'support',         label: 'Support Center',       icon: MessageSquare },
  { key: 'audit-logs',      label: 'Audit Logs',           icon: FileText },
  { key: 'global-feed',     label: 'Global Activity Feed', icon: Activity },
  { key: 'revenue-forecast', label: 'Revenue Forecast',    icon: TrendingUp },
  { key: 'heatmap',          label: 'Usage Heatmap',       icon: BarChart3 },
  { key: 'trust-engine',     label: 'Trust & Reputation',  icon: ShieldCheck },
  { key: 'emergency-map',    label: 'Emergency Intel Map', icon: AlertTriangle },
  { key: 'crisis-predict',   label: 'AI Crisis Predict',   icon: Zap },
  { key: 'eco-evolution',    label: 'Ecosystem Evolution', icon: Activity },
  { key: 'cybersecurity',    label: 'Cybersecurity',       icon: ShieldCheck },
  { key: 'financial-intel',  label: 'Financial Intelligence',icon: TrendingUp },
  { key: 'innovation-lab',   label: 'Innovation Lab',       icon: Zap },
  { key: 'eco-simulator',    label: 'Ecosystem Simulator',  icon: TrendingUp },
  { key: 'stability',        label: 'Stability Index',       icon: ShieldCheck },
  { key: 'rev-evolution',    label: 'Revenue Evolution',     icon: DollarSign },
  { key: 'command-grid',     label: 'Command Grid',          icon: Zap },
  // ── Futuristic ──
  { key: 'eco-pulse',        label: 'Ecosystem Pulse',       icon: Activity },
  { key: 'eco-galaxy',       label: 'Ecosystem Galaxy',      icon: Star },
  { key: 'glassboard',       label: 'Health Glassboard',     icon: Sparkles },
  { key: 'quantum-core',     label: 'Quantum AI Core',       icon: Zap },
  { key: 'pet-city',         label: 'Digital Pet City',      icon: Building2 },
  { key: 'adm-radar',        label: 'Engagement Radar',      icon: TrendingUp },
  { key: 'adm-orchestrator', label: 'Care Orchestrator',     icon: Brain },
  // ── Exclusive ──
  { key: 'eco-brain',      label: 'Ecosystem Brain',       icon: Brain },
  { key: 'power-grid',     label: 'Power Grid',            icon: Zap },
  { key: 'rev-const',      label: 'Revenue Constellation', icon: Star },
  { key: 'mood-analyzer',  label: 'Mood Analyzer',         icon: Activity },
  { key: 'observatory',    label: 'Intelligence Obs.',     icon: Sparkles },
  // ── Advanced ──
  { key: 'harmony',        label: 'Harmony Engine',        icon: Activity },
  { key: 'user-const',     label: 'User Constellation',    icon: Star },
  { key: 'eco-weather',    label: 'Ecosystem Weather',     icon: TrendingUp },
  { key: 'rev-ocean',      label: 'Revenue Ocean',         icon: DollarSign },
  { key: 'quantum-grid',   label: 'Quantum Intel Grid',    icon: Zap },
  // ── Elite 2.0 Admin Features ──
  { key: 'eco-aura',        label: 'Ecosystem Aura',          icon: Sparkles },
  { key: 'ux-dna',          label: 'User Experience DNA',     icon: Brain },
  { key: 'emotion-grid',    label: 'Platform Emotion Grid',   icon: Activity },
  { key: 'eng-volcano',     label: 'Engagement Volcano',      icon: Zap },
  { key: 'rev-matrix',      label: 'Revenue Energy Matrix',   icon: Star },
  { key: 'trust-pulse',     label: 'Trust Pulse Engine',      icon: ShieldCheck },
  { key: 'eco-orbit',       label: 'Ecosystem Orbit',         icon: TrendingUp },
  { key: 'activity-skyline',label: 'Activity Skyline',        icon: Building2 },
  { key: 'intel-stream',    label: 'Intelligence Stream',     icon: Brain },
  { key: 'quantum-core-evo',label: 'Quantum Evolution Core',  icon: Zap },
  // ── Cross-Dashboard ──
  { key: 'universal-dna',   label: 'Universal Experience DNA',icon: Brain },
  { key: 'emotion-stream',  label: 'Digital Emotion Stream',  icon: MessageSquare },
  { key: 'behavior-waves',  label: 'AI Behavior Waves',       icon: Activity },
  { key: 'wellness-network',label: 'Global Wellness Network', icon: TrendingUp },
  { key: 'insight-nebula',  label: 'AI Insight Nebula',       icon: Sparkles },
  { key: 'resonance',       label: 'Resonance Engine',        icon: Zap },
  { key: 'activity-cosmos', label: 'Activity Cosmos',         icon: Star },
  { key: 'sync-field',      label: 'Sync Field',              icon: ShieldCheck },
  { key: 'wellness-oracle', label: 'Wellness Oracle',         icon: Brain },
  { key: 'quantum-sphere',  label: 'Quantum AI Sphere',       icon: Zap },
  // ── Innovative Features ──
  { key: 'welfare-monitor', label: 'Welfare Monitoring',      icon: HeartPulse },
  { key: 'innovation-marketplace', label: 'Innovation Hub',   icon: Zap },
  { key: 'global-stats',    label: 'Global Analytics',        icon: BarChart3 },
  { key: 'national-health-map', label: 'National Health Map', icon: MapPin },
  { key: 'ai-fraud-detect', label: 'AI Fraud Detection',      icon: ShieldAlert },
  { key: 'digital-passport', label: 'Digital Pet Passport',   icon: Globe },
  { key: 'disaster-rescue', label: 'Disaster Rescue System', icon: AlertTriangle },
  { key: 'blood-donor',     label: 'Blood Donor Network',     icon: HeartPulse },
  { key: 'lifelong-companion', label: 'Lifelong Companion',   icon: Brain },
  { key: 'smart-city',      label: 'Smart Pet City',          icon: Building2 },
  { key: 'profile',        label: 'My Profile',            icon: User },
];

const Sidebar = ({ active, setActive, onLogout }) => (
  <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col shadow-xl flex-shrink-0">
    <div className="px-5 py-5 border-b border-slate-100">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: GRAD }}>
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-extrabold text-base leading-none text-transparent bg-clip-text"
            style={{ backgroundImage: GRAD }}>Admin Portal</p>
          <p className="text-[10px] text-slate-400 mt-0.5">SmartPetCare Platform</p>
        </div>
      </div>
    </div>

    <nav className="flex-1 px-3 py-4 space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">Menu</p>
      {MENU.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button key={key} onClick={() => setActive(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
            style={isActive ? { background: GRAD, boxShadow: '0 4px 14px rgba(99,102,241,0.35)' } : {}}>
            <Icon className="flex-shrink-0" style={{ width: 18, height: 18, color: isActive ? '#fff' : undefined }} />
            <span className="flex-1 text-left">{label}</span>
            {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
          </button>
        );
      })}
    </nav>

    <div className="px-3 pb-5 border-t border-slate-100 pt-3">
      <button onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all">
        <LogOut style={{ width: 18, height: 18 }} />
        <span>Logout</span>
      </button>
    </div>
  </aside>
);

// ── Analytics Panel ───────────────────────────────────────────────────────────
const AnalyticsPanel = ({ users, vets, setActive }) => {
  const pending  = vets.filter(v => v.status === 'pending').length;
  const approved = vets.filter(v => v.status === 'approved').length;
  const owners   = users.filter(u => u.role === 'OWNER').length;

  const readLiveData = () => {
    const ownerAppts  = JSON.parse(localStorage.getItem('ownerAppts')  || '[]');
    const ownerOrders = JSON.parse(localStorage.getItem('ownerOrders') || '[]');
    const vetReviews  = JSON.parse(localStorage.getItem('vetReviews')  || '[]');
    const petWalks    = JSON.parse(localStorage.getItem('petWalks')    || '[]');
    const medRecords  = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    const todayStr    = new Date().toLocaleDateString('en-CA');
    return {
      revenue: ownerOrders.reduce((s, o) => s + (o.total || 0), 124500),
      todayAppts: ownerAppts.filter(a => a.date === todayStr).length || 8,
      monthlyOrders: ownerOrders.length || 312,
      satisfaction: vetReviews.length
        ? Math.round(vetReviews.filter(r => r.rating >= 4).length / vetReviews.length * 100) + '%'
        : '94%',
      totalWalks: petWalks.length,
      totalRecords: medRecords.length,
    };
  };

  const [live, setLive] = useState(readLiveData);

  useEffect(() => {
    const refresh = () => setLive(readLiveData());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  const lineData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun'],
    datasets: [
      { label: 'New Users', data: [12,19,30,50,80,120], borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.1)', tension:0.4, fill:true },
      { label: 'Appointments', data: [8,14,22,38,55,90], borderColor:'#14b8a6', backgroundColor:'rgba(20,184,166,0.1)', tension:0.4, fill:true },
    ]
  };
  const barData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun'],
    datasets: [{ label: 'Vet Approvals', data:[2,3,5,8,6,9], backgroundColor:'rgba(99,102,241,0.7)', borderRadius:6 }]
  };
  const opts = { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} };
  const apptData = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [{ label: 'Appointments', data:[14,22,18,30,26,12,8], backgroundColor:'rgba(20,184,166,0.75)', borderRadius:8 }]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Total Users',    value: users.length || 248,                    color:'#6366f1', icon:Users,       target:'users',      hint:'→ User Management' },
          { label:'Pet Owners',     value: owners || 196,                          color:'#14b8a6', icon:Users,       target:'users',      hint:'→ User Management' },
          { label:'Approved Vets',  value: approved || 18,                         color:'#10b981', icon:CheckCircle, target:'vets',       hint:'→ Vet Approvals' },
          { label:'Pending Vets',   value: pending || 4,                           color:'#f59e0b', icon:Clock,       target:'vets',       hint:'→ Vet Approvals' },
          { label:'Total Revenue',  value: '₹' + live.revenue.toLocaleString('en-IN'), color:'#8b5cf6', icon:TrendingUp, target:'payments', hint:'→ Payment Monitoring' },
          { label:'Today Appts',    value: live.todayAppts,                        color:'#ef4444', icon:Activity,    target:'health',     hint:'→ Health Insights' },
          { label:'Monthly Orders', value: live.monthlyOrders,                     color:'#f59e0b', icon:FileText,    target:'financials', hint:'→ Platform Financials' },
          { label:'Satisfaction',   value: live.satisfaction,                      color:'#10b981', icon:ShieldCheck, target:'moderation', hint:'→ Content Moderation' },
        ].map(({ label, value, color, icon: Icon, target, hint }) => (
          <motion.div key={label} whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(99,102,241,0.12)' }}
            onClick={() => setActive(target)} title={hint}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-indigo-200 transition-all group relative">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
              <Icon style={{ width: 20, height: 20, color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
            <span className="absolute bottom-2 right-3 text-[9px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">{hint}</span>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {[['Pet Walks Logged',live.totalWalks,'🚶','#10b981'],['Health Records',live.totalRecords,'📋','#6366f1']].map(([l,v,icon,color])=>(
          <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div><p className="text-xl font-extrabold text-slate-900">{v}</p><p className="text-xs text-slate-400">{l} <span className="text-emerald-500 font-bold">• Live</span></p></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-extrabold text-slate-800 mb-4">Platform Growth</h3>
          <div className="h-56"><Line data={lineData} options={opts} /></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-extrabold text-slate-800 mb-4">Vet Approvals / Month</h3>
          <div className="h-56"><Bar data={barData} options={opts} /></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 mb-4">📅 Appointment Trends (This Week)</h3>
        <div className="h-44"><Bar data={apptData} options={opts} /></div>
      </div>
    </div>
  );
};

// ── Vet Approvals Panel ───────────────────────────────────────────────────────
const VetApprovalsPanel = ({ vets, onApprove, onReject }) => {
  const [selected, setSelected] = useState(null);
  const pendingCount = vets.filter(v => v.status === 'pending').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-extrabold text-slate-900">Vet Registration Requests</h2>
        <Badge status={`${pendingCount} pending`} />
      </div>

      {vets.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
          No vet registrations yet.
        </div>
      )}

      <div className="space-y-4">
        {vets.map(vet => (
          <motion.div key={vet.id} layout
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl flex-shrink-0"
                style={{ background: GRAD }}>
                {vet.name?.[0] || 'V'}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="font-extrabold text-slate-900">{vet.name}</p>
                  <Badge status={vet.status} />
                </div>
                <p className="text-sm text-slate-500">
                  {vet.specialization ? `${vet.specialization} · ${vet.clinic}` : 'Profile not yet submitted'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {vet.email}{vet.license ? ` · License: ${vet.license}` : ''}{vet.experience ? ` · ${vet.experience} yrs exp` : ''}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setSelected(selected?.id === vet.id ? null : vet)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition">
                  <Eye className="w-4 h-4" />
                </button>
                {vet.status === 'pending' && vet.vetProfileId && (
                  <>
                    <button onClick={() => onApprove(vet.vetProfileId)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow transition"
                      style={{ background: GRADGREEN }}>
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => onReject(vet.vetProfileId)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow transition"
                      style={{ background: GRADRED }}>
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                {vet.status === 'approved' && vet.vetProfileId && (
                  <button onClick={() => onReject(vet.vetProfileId)}
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition">
                    Revoke
                  </button>
                )}
                {vet.status === 'rejected' && vet.vetProfileId && (
                  <button onClick={() => onApprove(vet.vetProfileId)}
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-green-50 text-green-600 hover:bg-green-100 transition">
                    Re-approve
                  </button>
                )}
                {vet.status === 'no-profile' && (
                  <span className="text-xs text-slate-400 italic">Awaiting profile submission</span>
                )}
              </div>
            </div>

            {/* Expandable detail */}
            <AnimatePresence>
              {selected?.id === vet.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="overflow-hidden border-t border-slate-100">
                  <div className="p-5 bg-slate-50 space-y-4">
                    {/* Info grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[['Name', vet.name], ['Email', vet.email], ['Phone', vet.phone || '-'], ['City', vet.city || '-'],
                        ['Specialization', vet.specialization || '-'], ['Clinic', vet.clinic || '-'],
                        ['Clinic Address', vet.clinicAddress || '-'], ['Consultation Fee', vet.fee ? `₹${vet.fee}` : '-'],
                        ['License No.', vet.license || '-'], ['Experience', vet.experience ? `${vet.experience} yrs` : '-'],
                        ['Submitted', vet.submittedAt ? new Date(vet.submittedAt).toLocaleDateString() : '-'],
                        ['Status', vet.status]].map(([l, v]) => (
                        <div key={l} className="bg-white p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">{l}</p>
                          <p className="font-bold text-slate-800 text-sm break-all">{v}</p>
                        </div>
                      ))}
                    </div>

                    {/* Certificate / Document */}
                    <div className="bg-white rounded-xl border border-slate-100 p-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">📄 Verification Document</p>
                      {vet.documentProofUrl ? (
                        <a
                          href={vet.documentProofUrl.startsWith('http') ? vet.documentProofUrl : `http://${window.location.hostname}:8081${vet.documentProofUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm rounded-xl border border-indigo-200 transition"
                        >
                          <FileText className="w-4 h-4" /> View / Download Certificate
                        </a>
                      ) : (
                        <p className="text-sm text-slate-400 italic">No document uploaded yet.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ── User Management Panel ─────────────────────────────────────────────────────
const UsersPanel = ({ users, onSave, onToggleBlock }) => {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (u) => { setEditing(u.id); setForm({ name: u.name || '', email: u.email, role: u.role, phone: u.phone || '', city: u.city || '' }); };
  const cancelEdit = () => { setEditing(null); setForm({}); };
  const save = (id) => { onSave(id, form); cancelEdit(); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-2">
        <h2 className="text-xl font-extrabold text-slate-900 flex-1">User Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56" />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">
          No users found.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(u => (
          <div key={u.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {editing === u.id ? (
              /* Edit form */
              <div className="p-5">
                <h4 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-500" /> Editing: {u.email}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[['Full Name','name','text'], ['Email','email','email'], ['Phone','phone','tel'], ['City','city','text']].map(([l,k,t])=>(
                    <div key={k}>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{l}</label>
                      <input type={t} value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })}
                        className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Role</label>
                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                      className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                      <option value="OWNER">OWNER</option>
                      <option value="VET">VET</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => save(u.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-white font-bold rounded-xl text-sm"
                    style={{ background: GRAD }}>
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                  <button onClick={cancelEdit}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Row view */
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ background: GRAD }}>
                  {(u.name || u.email)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{u.name || '—'}</p>
                  <p className="text-sm text-slate-500 truncate">{u.email}</p>
                  {u.phone && <p className="text-xs text-slate-400">{u.phone} · {u.city}</p>}
                </div>
                <Badge status={u.role} />
                <button onClick={() => startEdit(u)}
                  className="ml-2 p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition flex-shrink-0">
                  <Edit3 className="w-4 h-4" />
                </button>
                {u.role !== 'ADMIN' && (
                  <button onClick={() => onToggleBlock(u.id)}
                    className={`ml-2 px-3 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                      u.isBlocked 
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                    }`}>
                    {u.isBlocked ? 'Activate' : 'Block'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Health Insights Panel ────────────────────────────────────────────────────
const HealthInsightsPanel = () => {
  const rx = JSON.parse(localStorage.getItem('allPrescriptions') || '[]');
  const records = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
  
  const allEvents = [
    ...rx.map(item => ({ ...item, type: 'PRESCRIPTION', color: '#9333ea', icon: FileText })),
    ...records.map(item => ({ ...item, type: 'MEDICAL_NOTE', color: '#14b8a6', icon: Stethoscope }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900">Platform Clinical Activity</h2>
        <div className="flex gap-2">
          <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">{rx.length} Prescriptions</span>
          <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">{records.length} Medical Notes</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-6 py-4">Event Type</th>
              <th className="px-6 py-4">Pet / Patient</th>
              <th className="px-6 py-4">Vet / Provider</th>
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allEvents.map((ev, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: ev.color + '15' }}>
                      <ev.icon style={{ width: 14, height: 14, color: ev.color }} />
                    </div>
                    <span className="font-bold text-[10px] tracking-wide" style={{ color: ev.color }}>{ev.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-extrabold text-slate-800">{ev.patient || ev.pet || ev.appt?.petName}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{ev.vet}</td>
                <td className="px-6 py-4">
                  <p className="text-xs text-slate-500 max-w-xs truncate">{ev.medication || ev.note}</p>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400 font-bold">{ev.date}</td>
              </tr>
            ))}
            {allEvents.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">No clinical activity recorded on the platform yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Content Moderation Panel ──────────────────────────────────────────────────
const ModerationPanel = () => {
  const [reviews, setReviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vetReviews')) || []; }
    catch { return []; }
  });

  const deleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this review for violating community guidelines?")) {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated);
      localStorage.setItem('vetReviews', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><MessageSquareWarning className="w-6 h-6"/></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Content Moderation</h2>
          <p className="text-sm text-slate-500">Oversee global platform interactions and reviews.</p>
        </div>
      </div>
      
      {reviews.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
          No reviews available to moderate.
        </div>
      )}

      <div className="grid gap-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => deleteReview(r.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white p-2 rounded-lg transition" title="Delete Review">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold flex-shrink-0 text-sm"
                style={{ background: GRAD }}>
                {r.owner?.[0] || 'U'}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{r.owner}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-amber-500 font-bold">{r.rating} ★</span>
                  <span className="text-xs text-slate-400">· {r.date}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-700 italic">"{r.comment}"</p>
            {r.reply && (
              <div className="mt-3 p-3 bg-slate-50 border-l-4 border-indigo-400 rounded-r-xl">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Vet Reply</p>
                <p className="text-sm text-slate-600">{r.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Financials Panel ──────────────────────────────────────────────────────────
const FinancialsPanel = () => {
  const appts = JSON.parse(localStorage.getItem('ownerAppts') || '[]');
  const completedAppts = appts.filter(a => a.status === 'COMPLETED').length;
  
  const totalConsultRevenue = completedAppts * 50;
  const platformCut = totalConsultRevenue * 0.10;

  const marketplaceSales = 12500;
  const marketplaceCut = marketplaceSales * 0.15;

  const totalRevenue = platformCut + marketplaceCut;

  const [payouts, setPayouts] = useState([
    { id: 1, recipient: 'Dr. Sarah Jenkins', type: 'Consultations', amount: '$450.00', status: 'approved' },
    { id: 2, recipient: 'Paws & Claws Clinic', type: 'Consultations', amount: '$1,200.00', status: 'pending' },
    { id: 3, recipient: 'HealthyPet Foods', type: 'Marketplace Sales', amount: '$890.00', status: 'approved' },
  ]);

  const toggleStatus = (id) => {
    setPayouts(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === 'pending' ? 'approved' : 'pending' } : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><DollarSign className="w-6 h-6"/></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Platform Financials</h2>
          <p className="text-sm text-slate-500">Track aggregated revenue across vet clinics and marketplace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-bold mb-1">Total Platform Revenue</p>
          <p className="text-4xl font-black text-emerald-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-bold mb-1">Vet Consults (10% Cut)</p>
          <p className="text-2xl font-extrabold text-slate-800">${platformCut.toFixed(2)}</p>
          <p className="text-xs text-slate-400 mt-1">From {completedAppts} completed appts</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-bold mb-1">Marketplace (15% Cut)</p>
          <p className="text-2xl font-extrabold text-slate-800">${marketplaceCut.toFixed(2)}</p>
          <p className="text-xs text-slate-400 mt-1">On ${marketplaceSales} total GMV</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-800">Recent Payouts</h3>
          <span className="text-xs text-slate-400 italic">Click status to toggle</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
              <th className="pb-3">Recipient</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {payouts.map(p => (
              <tr key={p.id}>
                <td className="py-3 font-bold text-slate-800">{p.recipient}</td>
                <td className="py-3 text-slate-500">{p.type}</td>
                <td className="py-3 font-bold">{p.amount}</td>
                <td className="py-3 cursor-pointer hover:opacity-75 transition-opacity" onClick={() => toggleStatus(p.id)} title="Click to change status">
                  <Badge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Fraud & Security Panel ────────────────────────────────────────────────────
const FraudSecurityPanel = () => {
  const [alerts, setAlerts] = useState([
    { id:1, type:'Fake Vet',      user:'dr.fake@spam.com',   reason:'License not verifiable. Clinic address invalid.',  risk:'high',   status:'flagged',  time:'2026-05-07 14:22' },
    { id:2, type:'Spam Account',  user:'spammer123@mail.com', reason:'Sent 47 identical messages in 10 minutes.',       risk:'high',   status:'flagged',  time:'2026-05-07 13:05' },
    { id:3, type:'Suspicious IP', user:'user_44@petcare.app', reason:'Login attempts from 3 different countries in 1hr.',risk:'medium', status:'watching', time:'2026-05-07 11:48' },
    { id:4, type:'Bot Activity',  user:'testuser99@abc.com',  reason:'Profile created & deleted 3 times in 24 hours.',  risk:'medium', status:'watching', time:'2026-05-06 22:11' },
  ]);
  const [filter, setFilter] = useState('all');

  const ban = (id) => setAlerts(a => a.map(x => x.id===id ? {...x, status:'banned'} : x));
  const dismiss = (id) => setAlerts(a => a.filter(x => x.id!==id));

  const visible = filter==='all' ? alerts : alerts.filter(a => a.risk===filter || a.status===filter);

  const riskColor = { high:'#ef4444', medium:'#f59e0b', low:'#10b981' };
  const statusBg  = { flagged:'bg-rose-100 text-rose-700', watching:'bg-amber-100 text-amber-700', banned:'bg-slate-200 text-slate-500' };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-rose-100 rounded-xl"><ShieldAlert className="w-6 h-6 text-rose-600"/></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Fraud & Security</h2>
          <p className="text-sm text-slate-500">AI-assisted detection of fake vets, spam users & suspicious activity.</p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Total Flagged', value: alerts.length, color:'#ef4444', icon: Flag },
          { label:'High Risk', value: alerts.filter(a=>a.risk==='high').length, color:'#ef4444', icon: Zap },
          { label:'Watching', value: alerts.filter(a=>a.status==='watching').length, color:'#f59e0b', icon: Eye },
          { label:'Banned', value: alerts.filter(a=>a.status==='banned').length, color:'#6366f1', icon: Ban },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: s.color+'18'}}>
              <s.icon style={{width:18,height:18,color:s.color}}/>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all','high','medium','flagged','watching','banned'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition ${filter===f ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            style={filter===f ? {background: GRAD} : {}}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {visible.map(a => (
          <motion.div key={a.id} layout className={`bg-white rounded-2xl border shadow-sm p-5 flex items-start gap-4 ${a.status==='banned' ? 'opacity-50' : ''}`}
            style={{borderColor: riskColor[a.risk]+'40'}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
              style={{background: riskColor[a.risk]+'18'}}>
              {a.type==='Fake Vet' ? '🩺' : a.type==='Spam Account' ? '📧' : a.type==='Suspicious IP' ? '🌐' : '🤖'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="font-extrabold text-slate-900 text-sm">{a.type}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBg[a.status]}`}>{a.status}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{color: riskColor[a.risk], background: riskColor[a.risk]+'15', borderColor: riskColor[a.risk]+'40'}}>
                  {a.risk.toUpperCase()} RISK
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 mb-1">{a.user}</p>
              <p className="text-xs text-slate-500">{a.reason}</p>
              <p className="text-[10px] text-slate-400 mt-1">Detected: {a.time}</p>
            </div>
            {a.status !== 'banned' && (
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => ban(a.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 font-bold rounded-xl text-xs hover:bg-rose-100 transition">
                  <Ban className="w-3 h-3"/> Ban
                </button>
                <button onClick={() => dismiss(a.id)} className="px-3 py-1.5 bg-slate-100 text-slate-500 font-bold rounded-xl text-xs hover:bg-slate-200 transition">
                  Dismiss
                </button>
              </div>
            )}
          </motion.div>
        ))}
        {visible.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">No alerts matching this filter.</div>}
      </div>
    </div>
  );
};

// ── Global Notifications Panel ────────────────────────────────────────────────
const NotificationsPanel = () => {
  const TEMPLATES = [
    { label:'Vaccination Alert', icon:'💉', msg:'Reminder: Your pet\'s annual vaccination is due next week. Book now!' },
    { label:'Special Offer',     icon:'🎁', msg:'Get 20% off your next vet consultation this weekend only!' },
    { label:'Emergency Notice',  icon:'🚨', msg:'URGENT: Rabies outbreak detected in your area. Please vaccinate immediately.' },
    { label:'Platform Update',   icon:'📢', msg:'SmartPetCare v2.0 is live! Check out the new AI Health Scan feature.' },
  ];
  const [target, setTarget]   = useState('all');
  const [template, setTemplate] = useState('');
  const [custom, setCustom]   = useState('');
  const [sent, setSent]       = useState([]);
  const [sending, setSending] = useState(false);

  const sendNotif = () => {
    const msg = custom.trim() || template;
    if (!msg) return;
    setSending(true);
    setTimeout(() => {
      setSent(s => [{ id: Date.now(), msg, target, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), date: new Date().toLocaleDateString() }, ...s]);
      setCustom(''); setTemplate(''); setSending(false);
    }, 1200);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-indigo-100 rounded-xl"><BellRing className="w-6 h-6 text-indigo-600"/></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Global Notification System</h2>
          <p className="text-sm text-slate-500">Send platform-wide alerts, offers, and emergency notices.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <p className="font-extrabold text-slate-800">Compose Notification</p>
        {/* Target */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Send To</label>
          <div className="flex gap-2 mt-1 flex-wrap">
            {['all','owners','vets'].map(t => (
              <button key={t} onClick={() => setTarget(t)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition ${target===t ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600'}`}
                style={target===t ? {background: GRAD} : {}}>
                {t==='all' ? '🌍 All Users' : t==='owners' ? '🐾 Pet Owners' : '🩺 Vets Only'}
              </button>
            ))}
          </div>
        </div>
        {/* Quick templates */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Quick Templates</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {TEMPLATES.map(t => (
              <button key={t.label} onClick={() => { setTemplate(t.msg); setCustom(''); }}
                className={`text-left p-3 rounded-xl border text-sm transition ${template===t.msg ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'}`}>
                <span className="text-base mr-2">{t.icon}</span>
                <span className="font-bold text-slate-800">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Custom */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Custom Message</label>
          <textarea value={custom} onChange={e => { setCustom(e.target.value); setTemplate(''); }}
            rows={3} placeholder="Or type a custom notification message..."
            className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 outline-none resize-none"/>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-sm text-slate-600 min-h-[40px] italic">
          {custom || template || <span className="text-slate-400">Preview will appear here...</span>}
        </div>
        <button onClick={sendNotif} disabled={sending || (!custom.trim() && !template)}
          className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition hover:-translate-y-0.5"
          style={{background: GRAD}}>
          <Send className="w-4 h-4"/> {sending ? 'Sending...' : 'Send Notification'}
        </button>
      </div>

      {/* Sent log */}
      {sent.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-3">Recently Sent</p>
          <div className="space-y-2">
            {sent.map(s => (
              <div key={s.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0"/>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{s.msg}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">To: {s.target} users • {s.date} {s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Payment Monitoring Panel ──────────────────────────────────────────────────
const PaymentMonitoringPanel = () => {
  const TX = [
    { id:'TXN-0081', user:'Priya S.',   type:'Consultation', amount:500,  status:'success', date:'2026-05-07', method:'UPI' },
    { id:'TXN-0080', user:'Rajan A.',   type:'Marketplace',  amount:1870, status:'success', date:'2026-05-07', method:'Card' },
    { id:'TXN-0079', user:'Emily R.',   type:'Consultation', amount:500,  status:'failed',  date:'2026-05-06', method:'UPI' },
    { id:'TXN-0078', user:'Karthik M.', type:'Subscription', amount:299,  status:'success', date:'2026-05-06', method:'NetBanking' },
    { id:'TXN-0077', user:'Meena R.',   type:'Consultation', amount:500,  status:'pending', date:'2026-05-05', method:'Card' },
    { id:'TXN-0076', user:'Arjun T.',   type:'Marketplace',  amount:540,  status:'failed',  date:'2026-05-05', method:'UPI' },
  ];
  const [filter, setFilter] = useState('all');
  const visible = filter==='all' ? TX : TX.filter(t => t.status===filter);

  const total   = TX.filter(t=>t.status==='success').reduce((s,t)=>s+t.amount,0);
  const failed  = TX.filter(t=>t.status==='failed').length;
  const pending = TX.filter(t=>t.status==='pending').length;

  const stBg = { success:'bg-emerald-100 text-emerald-700', failed:'bg-rose-100 text-rose-700', pending:'bg-amber-100 text-amber-700' };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-emerald-100 rounded-xl"><CreditCard className="w-6 h-6 text-emerald-600"/></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Payment Monitoring</h2>
          <p className="text-sm text-slate-500">Track all transactions, revenue, and failed payments.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Total Revenue', value:`₹${total.toLocaleString()}`, color:'#10b981', icon: DollarSign },
          { label:'Total Transactions', value: TX.length, color:'#6366f1', icon: CreditCard },
          { label:'Failed Payments', value: failed, color:'#ef4444', icon: CircleX },
          { label:'Pending', value: pending, color:'#f59e0b', icon: Clock },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:s.color+'18'}}>
              <s.icon style={{width:18,height:18,color:s.color}}/>
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all','success','failed','pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition ${filter===f ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            style={filter===f ? {background: GRAD} : {}}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50 text-xs text-slate-400 uppercase tracking-widest">
            <th className="px-5 py-3 text-left font-bold">Txn ID</th>
            <th className="px-5 py-3 text-left font-bold">User</th>
            <th className="px-5 py-3 text-left font-bold">Type</th>
            <th className="px-5 py-3 text-left font-bold">Method</th>
            <th className="px-5 py-3 text-right font-bold">Amount</th>
            <th className="px-5 py-3 text-center font-bold">Status</th>
            <th className="px-5 py-3 text-left font-bold">Date</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-50">
            {visible.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/60 transition">
                <td className="px-5 py-3 font-mono text-xs text-indigo-600 font-bold">{t.id}</td>
                <td className="px-5 py-3 font-bold text-slate-800">{t.user}</td>
                <td className="px-5 py-3 text-slate-500">{t.type}</td>
                <td className="px-5 py-3 text-slate-500">{t.method}</td>
                <td className="px-5 py-3 text-right font-extrabold text-slate-900">₹{t.amount}</td>
                <td className="px-5 py-3 text-center"><span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${stBg[t.status]}`}>{t.status}</span></td>
                <td className="px-5 py-3 text-xs text-slate-400">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Report Generation Panel ───────────────────────────────────────────────────
const ReportGenerationPanel = ({ users, vets }) => {
  const [generating, setGenerating] = useState(null);
  const [generated, setGenerated]   = useState([]);

  const REPORTS = [
    { id:'user-analytics',  label:'User Analytics Report',  desc:'Total users, roles, registration trends',  icon:'👥', color:'#6366f1' },
    { id:'revenue-report',  label:'Revenue Report',         desc:'Platform revenue, payouts, GMV breakdown',  icon:'💰', color:'#10b981' },
    { id:'vet-performance', label:'Vet Performance Report', desc:'Approved vets, ratings, appointment counts',icon:'🩺', color:'#14b8a6' },
    { id:'health-insights', label:'Health Insights Report', desc:'Common diseases, vaccination trends',       icon:'🏥', color:'#f59e0b' },
    { id:'security-audit',  label:'Security Audit Report',  desc:'Flagged accounts, ban history, login logs', icon:'🔒', color:'#ef4444' },
  ];

  const generate = (report) => {
    setGenerating(report.id);
    setTimeout(() => {
      setGenerating(null);
      setGenerated(g => [{ ...report, date: new Date().toLocaleString(), size: `${(Math.random()*900+100).toFixed(0)} KB` }, ...g]);
    }, 1800);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-purple-100 rounded-xl"><BarChart3 className="w-6 h-6 text-purple-600"/></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Report Generation</h2>
          <p className="text-sm text-slate-500">Export PDF reports for user analytics, revenue, and platform insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map(r => (
          <motion.div key={r.id} whileHover={{y:-3}}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{background: r.color+'18'}}>{r.icon}</div>
              <div>
                <p className="font-extrabold text-slate-800 text-sm">{r.label}</p>
                <p className="text-xs text-slate-400">{r.desc}</p>
              </div>
            </div>
            <button onClick={() => generate(r)} disabled={generating===r.id}
              className="flex items-center justify-center gap-2 py-2 text-white font-bold rounded-xl text-sm disabled:opacity-60 transition hover:opacity-90"
              style={{background: generating===r.id ? '#94a3b8' : GRAD}}>
              <Download className="w-4 h-4"/>
              {generating===r.id ? 'Generating PDF...' : 'Export PDF'}
            </button>
          </motion.div>
        ))}
      </div>

      {generated.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-3">Generated Reports</p>
          <div className="space-y-2">
            {generated.map((g,i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{background: g.color+'18'}}>{g.icon}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{g.label}</p>
                  <p className="text-[10px] text-slate-400">{g.date} • PDF • {g.size}</p>
                </div>
                <button onClick={() => alert(`Downloading ${g.label}.pdf`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition">
                  <Download className="w-3 h-3"/> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Admin Profile Panel ───────────────────────────────────────────────────────
const AdminProfilePanel = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return {
        name: storedUser.name || 'System Administrator',
        email: storedUser.email || 'admin@smartpetcare.com',
        role: storedUser.role || 'ADMIN',
        phone: storedUser.phone || '+1 (555) 000-0000',
        location: storedUser.location || 'Global Headquarters'
      };
    } catch {
      return { name: 'Admin', email: '', role: 'ADMIN', phone: '', location: '' };
    }
  });
  
  const [form, setForm] = useState(profile);
  const [toastMsg, setToastMsg] = useState('');

  const handleSave = () => {
    setProfile(form);
    
    // Update the global localstorage currentUser if possible
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const updatedUser = { ...storedUser, ...form };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }

    setEditing(false);
    setToastMsg('Profile updated successfully!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <User className="w-7 h-7 text-indigo-500" /> Admin Profile
          </h2>
          <p className="text-sm text-slate-500">Manage your administrative credentials and details.</p>
        </div>
        {!editing && (
          <button onClick={() => { setForm(profile); setEditing(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5" style={{ background: GRAD }}>
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl border border-emerald-200 text-sm font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> {toastMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 w-full" style={{ background: 'linear-gradient(90deg, #6366f1, #14b8a6, #f59e0b)' }}></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl flex-shrink-0">
              <div className="w-full h-full rounded-xl flex items-center justify-center text-white font-extrabold text-4xl uppercase" style={{ background: GRAD }}>
                {profile.name[0] || 'A'}
              </div>
            </div>
            
            {!editing && (
              <div className="mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-slate-900">{profile.name}</h3>
                  <Badge status={profile.role} />
                </div>
                <p className="text-slate-500 font-medium">{profile.email}</p>
              </div>
            )}
          </div>
          
          <div>
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                    <input value={form.email} disabled className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2 text-sm text-slate-500 outline-none cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Location</label>
                    <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5" style={{ background: GRADGREEN }}>
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="font-bold text-slate-800">{profile.phone || '-'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                  <p className="font-bold text-slate-800">{profile.location || '-'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── System Monitor Panel ──────────────────────────────────────────────────────
const SystemMonitorPanel = () => {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const uptime = '14d 6h 23m';
  const SERVICES = [
    { name:'API Server',        status:'online',  ping:'12ms',  cpu:'28%',  ram:'44%'  },
    { name:'Database (MySQL)',  status:'online',  ping:'3ms',   cpu:'15%',  ram:'62%'  },
    { name:'Auth Service',     status:'online',  ping:'8ms',   cpu:'9%',   ram:'31%'  },
    { name:'File Storage',     status:'online',  ping:'22ms',  cpu:'5%',   ram:'18%'  },
    { name:'Email Service',    status:'warning', ping:'145ms', cpu:'3%',   ram:'12%'  },
    { name:'WebSocket Server', status:'online',  ping:'18ms',  cpu:'21%',  ram:'38%'  },
  ];
  const METRICS = [
    { label:'Active Sessions', value:'1,247', color:'#6366f1', icon:'👥' },
    { label:'Req / min',       value:'3,842', color:'#14b8a6', icon:'⚡' },
    { label:'Error Rate',      value:'0.12%', color:'#10b981', icon:'✅' },
    { label:'Avg Latency',     value:'24ms',  color:'#f59e0b', icon:'🕒' },
  ];
  const statusStyle = { online:'bg-emerald-100 text-emerald-700', warning:'bg-amber-100 text-amber-700', offline:'bg-rose-100 text-rose-700' };
  const statusDot   = { online:'bg-emerald-500', warning:'bg-amber-400 animate-pulse', offline:'bg-rose-500 animate-pulse' };
  return (
    <div className="space-y-5 max-w-5xl">
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#0f172a,#1e293b)'}}>
        <div className="absolute -right-8 -top-8 opacity-5"><Activity className="w-48 h-48"/></div>
        <div className="relative">
          <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-0.5 rounded-full">🟢 All Systems Operational</span>
          <h2 className="text-2xl font-black mt-2">Realtime System Monitor</h2>
          <p className="text-slate-400 text-sm mt-1">Live server health, active sessions, and infrastructure status.</p>
          <div className="flex gap-6 mt-4">
            {[['Uptime', uptime],['Time', time.toLocaleTimeString()],['Region','ap-south-1']].map(([l,v]) => (
              <div key={l}><p className="text-lg font-extrabold text-white">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {METRICS.map(m => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
            <div className="text-3xl mb-1">{m.icon}</div>
            <p className="text-2xl font-extrabold" style={{color:m.color}}>{m.value}</p>
            <p className="text-xs text-slate-500">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">🖥️ Service Status</p>
        <div className="space-y-3">
          {SERVICES.map(s => (
            <div key={s.name} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot[s.status]}`}/>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                <p className="text-xs text-slate-400">Ping: {s.ping}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <span>CPU {s.cpu}</span>
                <span>RAM {s.ram}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${statusStyle[s.status]}`}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Subscription Mgmt Panel ───────────────────────────────────────────────────
const SubscriptionMgmtPanel = () => {
  const PLANS = [
    { name:'Basic Care',   price:'₹499/mo',  users:187, revenue:'₹93,313',  color:'#6366f1', pct:48 },
    { name:'Pro Health',   price:'₹999/mo',  users:142, revenue:'₹1,41,858', color:'#14b8a6', pct:37 },
    { name:'Elite VetCare',price:'₹1,999/mo',users:58,  revenue:'₹1,15,942', color:'#f59e0b', pct:15 },
  ];
  const SUBS = [
    { user:'Priya Sharma',  plan:'Pro Health',    status:'Active',   renewal:'Jun 5',  amount:'₹999'  },
    { user:'Rajan Anand',   plan:'Basic Care',    status:'Active',   renewal:'Jun 12', amount:'₹499'  },
    { user:'Emily Roberts', plan:'Elite VetCare', status:'Active',   renewal:'Jun 18', amount:'₹1,999'},
    { user:'Meena Kumar',   plan:'Pro Health',    status:'Expiring', renewal:'May 12', amount:'₹999'  },
    { user:'Arjun Patel',   plan:'Basic Care',    status:'Cancelled',renewal:'-',      amount:'₹499'  },
  ];
  const statusStyle = { Active:'bg-emerald-100 text-emerald-700', Expiring:'bg-amber-100 text-amber-700', Cancelled:'bg-rose-100 text-rose-700' };
  const total = PLANS.reduce((a,p) => a + p.users, 0);
  const mrr   = '₹3,51,113';
  return (
    <div className="space-y-5 max-w-5xl">
      <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
        <h2 className="text-2xl font-black">💳 Subscription Management</h2>
        <p className="text-indigo-200 text-sm mt-1">Track plans, renewals, revenue, and subscriber analytics.</p>
        <div className="flex gap-6 mt-4">
          {[['Total Subscribers',total],['MRR',mrr],['Churn Rate','3.2%'],['Avg LTV','₹8,400']].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map(p => (
          <div key={p.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-extrabold text-slate-800">{p.name}</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:p.color+'18',color:p.color}}>{p.price}</span>
            </div>
            <p className="text-3xl font-extrabold" style={{color:p.color}}>{p.users}</p>
            <p className="text-xs text-slate-400 mb-3">subscribers · {p.revenue} revenue</p>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="h-2 rounded-full" style={{width:`${p.pct}%`,background:p.color}}/>
            </div>
            <p className="text-xs text-slate-400 mt-1">{p.pct}% of total</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-4">📋 Recent Subscriptions</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="pb-3 text-left pr-4">User</th>
              <th className="pb-3 text-left pr-4">Plan</th>
              <th className="pb-3 text-left pr-4">Status</th>
              <th className="pb-3 text-right pr-4">Renewal</th>
              <th className="pb-3 text-right">Amount</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {SUBS.map((s,i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-3 pr-4 font-bold text-slate-800">{s.user}</td>
                  <td className="py-3 pr-4 text-slate-600">{s.plan}</td>
                  <td className="py-3 pr-4"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle[s.status]}`}>{s.status}</span></td>
                  <td className="py-3 pr-4 text-right text-slate-500">{s.renewal}</td>
                  <td className="py-3 text-right font-extrabold text-slate-900">{s.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── AI Activity Monitor Panel ──────────────────────────────────────────────────
const AIActivityPanel = () => {
  const [filter, setFilter] = React.useState('all');
  const EVENTS = [
    { user:'Priya Sharma',  action:'Booked appointment',  section:'Appointments', time:'2 min ago', risk:'low',  emoji:'📅' },
    { user:'Rajan Anand',   action:'Uploaded AI scan',    section:'Health Scan',  time:'5 min ago', risk:'low',  emoji:'🔬' },
    { user:'Unknown IP',    action:'Failed login ×5',     section:'Auth',         time:'8 min ago', risk:'high', emoji:'🚨' },
    { user:'Emily Roberts', action:'Purchased Pro Plan',  section:'Marketplace',  time:'12 min ago',risk:'low',  emoji:'💳' },
    { user:'Bot-Agent',     action:'Spam form submit ×20',section:'Community',    time:'15 min ago',risk:'high', emoji:'🤖' },
    { user:'Meena Kumar',   action:'Password reset',      section:'Auth',         time:'22 min ago',risk:'medium',emoji:'🔑' },
    { user:'Arjun Patel',   action:'Viewed vet profile',  section:'Find Vets',    time:'30 min ago',risk:'low',  emoji:'🩺' },
    { user:'New User',      action:'Account created',     section:'Registration', time:'45 min ago',risk:'low',  emoji:'👤' },
  ];
  const RISK_STYLE = { low:'bg-emerald-100 text-emerald-700', medium:'bg-amber-100 text-amber-700', high:'bg-rose-100 text-rose-700 font-extrabold' };
  const visible = filter === 'all' ? EVENTS : EVENTS.filter(e => e.risk === filter);
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#1e293b,#0f172a)'}}>
        <h2 className="text-2xl font-black">⚡ AI Activity Monitor</h2>
        <p className="text-slate-400 text-sm mt-1">Real-time user activity feed with AI-powered anomaly and risk detection.</p>
        <div className="flex gap-6 mt-4">
          {[['Total Events',EVENTS.length],['High Risk',EVENTS.filter(e=>e.risk==='high').length],['Flagged',EVENTS.filter(e=>e.risk!=='low').length]].map(([l,v])=>(
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {[{k:'all',label:'All Events'},{k:'high',label:'🚨 High Risk'},{k:'medium',label:'⚠️ Medium'},{k:'low',label:'✅ Safe'}].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${filter===f.k?'text-white border-transparent':'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            style={filter===f.k?{background: f.k==='high'?GRADRED:f.k==='medium'?'linear-gradient(135deg,#f59e0b,#ef4444)':f.k==='low'?GRADGREEN:GRAD}:{}}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {visible.map((e,i) => (
            <motion.div key={i} layout initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0}} transition={{delay:i*0.04}}
              className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
              <div className="text-xl w-8 flex-shrink-0">{e.emoji}</div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{e.user} <span className="font-normal text-slate-500">— {e.action}</span></p>
                <p className="text-xs text-slate-400">{e.section} · {e.time}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${RISK_STYLE[e.risk]}`}>{e.risk} risk</span>
              {e.risk === 'high' && (
                <button className="flex-shrink-0 px-3 py-1.5 text-xs font-bold text-white rounded-lg" style={{background:GRADRED}}>Block</button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400">
            <div className="text-3xl mb-2">✅</div>
            <p className="font-bold">No events match this filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Emergency Monitor Panel ───────────────────────────────────────────────────
const EmergencyMonitorPanel = () => {
  const [cases, setCases] = useState([
    { id:'EM-001', pet:'Bruno',   owner:'Priya S.',   triage:'Critical', symptom:'Seizure / Collapse',     time:'10:02 AM', vet:'Dr. Sharma', status:'active' },
    { id:'EM-002', pet:'Rocky',   owner:'Rajan A.',   triage:'Urgent',   symptom:'Difficulty Breathing',   time:'10:18 AM', vet:'Dr. Patel',  status:'active' },
    { id:'EM-003', pet:'Charlie', owner:'Emily R.',   triage:'Urgent',   symptom:'Vomiting / Not eating',  time:'11:04 AM', vet:'Dr. Meena',  status:'resolved' },
    { id:'EM-004', pet:'Luna',    owner:'Meena K.',   triage:'Critical', symptom:'Pale gums / Cold limbs', time:'11:30 AM', vet:'Unassigned', status:'active' },
  ]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [toast, setToast]               = useState('');

  const triageColor = {
    Critical: 'bg-rose-100 text-rose-700',
    Urgent:   'bg-amber-100 text-amber-700',
    Normal:   'bg-emerald-100 text-emerald-700',
  };

  const STATS = [
    { label:'Total Alerts',   filter:'all',                color:'#ef4444' },
    { label:'Critical Cases', filter:'critical',           color:'#ef4444' },
    { label:'Urgent Cases',   filter:'urgent',             color:'#f59e0b' },
    { label:'Resolved',       filter:'resolved',           color:'#10b981' },
  ];

  const counts = {
    all:      cases.length,
    critical: cases.filter(c => c.triage === 'Critical').length,
    urgent:   cases.filter(c => c.triage === 'Urgent').length,
    resolved: cases.filter(c => c.status === 'resolved').length,
  };

  const visible = cases.filter(c => {
    if (activeFilter === 'all')      return true;
    if (activeFilter === 'critical') return c.triage === 'Critical';
    if (activeFilter === 'urgent')   return c.triage === 'Urgent';
    if (activeFilter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const handleRespond = (id) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'responding' } : c));
    setTimeout(() => {
      setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
      setToast('✅ Case marked as resolved and vet notified!');
      setTimeout(() => setToast(''), 3000);
    }, 1500);
  };

  const statusBadge = {
    active:     'bg-rose-100 text-rose-700',
    responding: 'bg-amber-100 text-amber-700',
    resolved:   'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-bold shadow-2xl text-sm"
            style={{background: GRADGREEN}}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-rose-100 rounded-xl"><ShieldAlert className="w-6 h-6 text-rose-600"/></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Emergency Monitor</h2>
          <p className="text-sm text-slate-500">Click a stat card to filter cases. Press Respond to handle active emergencies.</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"/> {cases.filter(c=>c.status==='active').length} Active
        </span>
      </div>

      {/* Clickable stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => {
          const isActive = activeFilter === s.filter;
          return (
            <motion.div key={s.label} whileHover={{y:-3}} onClick={() => setActiveFilter(isActive ? 'all' : s.filter)}
              className={`rounded-2xl p-5 border-2 shadow-sm text-center cursor-pointer transition-all ${
                isActive ? 'border-opacity-100 shadow-lg' : 'bg-white border-slate-100 hover:border-indigo-200'
              }`}
              style={isActive ? {background: s.color+'12', borderColor: s.color} : {}}>
              <p className="text-3xl font-extrabold" style={{color: s.color}}>{counts[s.filter]}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              {isActive && <p className="text-[10px] font-bold mt-1" style={{color: s.color}}>● Filtering</p>}
            </motion.div>
          );
        })}
      </div>

      {/* Filter badge */}
      {activeFilter !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Showing:</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">{activeFilter}</span>
          <button onClick={() => setActiveFilter('all')} className="text-xs font-bold text-slate-400 hover:text-slate-700 ml-1">✕ Clear filter</button>
        </div>
      )}

      {/* Case cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {visible.map(c => (
            <motion.div key={c.id} layout
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.97}}
              className={`bg-white rounded-2xl border-2 shadow-sm p-5 flex items-start gap-4 transition-opacity ${c.status==='resolved' ? 'opacity-60' : ''}`}
              style={{borderColor: c.triage==='Critical' ? '#fecaca' : '#fde68a'}}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.triage==='Critical' ? 'bg-rose-100' : 'bg-amber-100'}`}>
                <span className="text-xl">{c.triage==='Critical' ? '🚨' : '⚠️'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-extrabold text-slate-900">{c.pet}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${triageColor[c.triage]}`}>{c.triage}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[c.status] || ''}`}>
                    {c.status === 'responding' ? '⏳ Responding...' : c.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Owner: {c.owner} · {c.symptom}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Case {c.id} · {c.time} · Vet: {c.vet}</p>
              </div>
              {c.status === 'active' && (
                <button onClick={() => handleRespond(c.id)}
                  className="px-4 py-2 text-xs font-extrabold text-white rounded-xl flex-shrink-0 hover:opacity-90 transition active:scale-95"
                  style={{background: GRADRED}}>
                  🚑 Respond
                </button>
              )}
              {c.status === 'responding' && (
                <span className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-100 rounded-xl flex-shrink-0">⏳ On the way</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">
            <div className="text-3xl mb-2">✅</div>
            <p className="font-bold">No cases match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Marketplace Analytics Panel ───────────────────────────────────────────────
const MarketplaceAnalyticsPanel = () => {
  const TOP_PRODUCTS = [
    { name:'Premium Dog Food 3kg',   sold: 142, revenue: '₹28,400', category:'Food',     trend:'+12%' },
    { name:'Joint Care Supplement',  sold: 98,  revenue: '₹19,600', category:'Health',   trend:'+8%' },
    { name:'Flea & Tick Shampoo',    sold: 76,  revenue: '₹11,400', category:'Grooming', trend:'+5%' },
    { name:'SmartCollar Pro',        sold: 34,  revenue: '₹33,660', category:'Tech',     trend:'+22%' },
    { name:'Cat Dental Treats',      sold: 67,  revenue: '₹8,040',  category:'Food',     trend:'-2%' },
  ];
  const catColor = { Food:'#10b981', Health:'#6366f1', Grooming:'#f59e0b', Tech:'#14b8a6' };

  const STATS = [
    { key:'orders',      label:'Total Orders',       value:'1,243', color:'#6366f1', change:'+18%',
      detail:'This month 1,243 orders placed. Peak day: Saturday (312 orders). 68% repeat customers.',
      catFilter: null },
    { key:'gmv',         label:'GMV This Month',     value:'₹1.2L', color:'#10b981', change:'+23%',
      detail:'GMV ₹1,20,450 collected. Food 56%, Health 22%, Grooming 14%, Tech 8%. Revenue up 23%.',
      catFilter: null },
    { key:'subscribers', label:'Active Subscribers', value:'387',   color:'#14b8a6', change:'+41%',
      detail:'387 plan subscribers — Basic Care 187 · Pro Health 142 · Elite VetCare 58. MRR: ₹2,34,000.',
      catFilter: null },
    { key:'aov',         label:'Avg Order Value',    value:'₹965',  color:'#f59e0b', change:'+6%',
      detail:'AOV ₹965 (+6% vs last month). Subscription buyers spend 3.4× more than one-time buyers.',
      catFilter: null },
  ];

  const [activeStat,  setActiveStat]  = useState(null);
  const [catFilter,   setCatFilter]   = useState('All');

  const activeStatObj = STATS.find(s => s.key === activeStat);
  const visibleProducts = catFilter === 'All'
    ? TOP_PRODUCTS
    : TOP_PRODUCTS.filter(p => p.category === catFilter);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-teal-100 rounded-xl"><BarChart3 className="w-6 h-6 text-teal-600"/></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Marketplace Analytics</h2>
          <p className="text-sm text-slate-500">Click any stat card for breakdown details. Filter products by category.</p>
        </div>
      </div>

      {/* Clickable KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => {
          const isActive = activeStat === s.key;
          return (
            <motion.div key={s.key} whileHover={{y:-3}}
              onClick={() => setActiveStat(isActive ? null : s.key)}
              className={`rounded-2xl p-5 border-2 shadow-sm cursor-pointer transition-all select-none ${
                isActive ? 'shadow-lg' : 'bg-white border-slate-100 hover:border-indigo-200'
              }`}
              style={isActive ? {background: s.color+'10', borderColor: s.color} : {}}>
              <p className="text-2xl font-extrabold" style={{color: s.color}}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] font-bold text-emerald-600">{s.change}</span>
                {isActive && <span className="text-[10px] font-bold" style={{color: s.color}}>▼ Details</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {activeStatObj && (
          <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}}
            className="overflow-hidden rounded-2xl border-2 p-4 flex items-start gap-3"
            style={{borderColor: activeStatObj.color+'40', background: activeStatObj.color+'08'}}>
            <div className="w-2 h-full rounded-full flex-shrink-0 self-stretch" style={{background: activeStatObj.color}}/>
            <div>
              <p className="font-extrabold text-slate-800 text-sm">{activeStatObj.label} — Breakdown</p>
              <p className="text-sm text-slate-600 mt-0.5">{activeStatObj.detail}</p>
            </div>
            <button onClick={() => setActiveStat(null)} className="ml-auto text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs font-bold text-slate-400">Filter by:</span>
        {['All','Food','Health','Grooming','Tech'].map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${catFilter===cat ? 'text-white border-transparent' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            style={catFilter===cat ? {background: cat==='All' ? GRAD : (catColor[cat]||GRAD)} : {}}>
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-extrabold text-slate-800 mb-4">🏆 Top Selling Products {catFilter !== 'All' && <span className="text-sm font-bold text-indigo-600 ml-1">({catFilter})</span>}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="pb-3 text-left pr-4">Product</th>
              <th className="pb-3 text-left pr-4">Category</th>
              <th className="pb-3 text-right pr-4">Units Sold</th>
              <th className="pb-3 text-right pr-4">Revenue</th>
              <th className="pb-3 text-right">Trend</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {visibleProducts.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-3 pr-4 font-bold text-slate-800">{p.name}</td>
                  <td className="py-3 pr-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background: catColor[p.category]+'18', color: catColor[p.category]}}>{p.category}</span>
                  </td>
                  <td className="py-3 pr-4 text-right font-bold text-slate-700">{p.sold}</td>
                  <td className="py-3 pr-4 text-right font-extrabold text-slate-900">{p.revenue}</td>
                  <td className={`py-3 text-right font-bold ${p.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>{p.trend}</td>
                </tr>
              ))}
              {visibleProducts.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400 text-sm">No products in this category.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-3">📦 Orders by Category</p>
          <div className="space-y-3">
            {[{cat:'Food',pct:68},{cat:'Health',pct:22},{cat:'Grooming',pct:14},{cat:'Tech',pct:8},{cat:'Other',pct:4}].map(c => (
              <div key={c.cat} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 w-16">{c.cat}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full" style={{width:`${c.pct}%`, background:'linear-gradient(90deg,#6366f1,#14b8a6)'}}/>
                </div>
                <span className="text-xs font-bold text-slate-500 w-8">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-3">🔄 Subscription Stats</p>
          {[
            { label:'Basic Care',    count:187, color:'#6366f1' },
            { label:'Pro Health',    count:142, color:'#14b8a6' },
            { label:'Elite VetCare', count:58,  color:'#f59e0b' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background: s.color}}/>
              <span className="text-sm text-slate-600 flex-1">{s.label}</span>
              <span className="font-extrabold text-slate-900">{s.count}</span>
              <span className="text-xs text-slate-400">subscribers</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [vets, setVets] = useState([]);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const authCfg = { headers: { Authorization: `Bearer ${token}` } };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setFetchError(false);
    try {
      const [usersRes, vetsRes] = await Promise.all([
        axios.get(`${API}/admin/users`, authCfg),
        axios.get(`${API}/admin/vets`,  authCfg),
      ]);
      setUsers(usersRes.data);
      setVets(vetsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
      setFetchError(true);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!token || role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    db.seed(); // Ensure all shared keys are initialized
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [token, navigate]);


  const handleApprove = async (id) => {
    try {
      await axios.post(`${API}/admin/vets/${id}/approve`, {}, authCfg);
      fetchData();
      // Sync status to localStorage so Vet Dashboard reflects approval immediately
      const pending = JSON.parse(localStorage.getItem('pendingVets') || '[]');
      const updated = pending.map(v => v.id === id || v.vetProfileId === id ? { ...v, status: 'approved' } : v);
      localStorage.setItem('pendingVets', JSON.stringify(updated));
      // Notify the vet via notifications key
      const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifs.unshift({
        id: Date.now(), type: 'alert',
        title: 'Profile Approved! 🎉',
        body: 'Your veterinarian profile has been approved by the admin. You are now fully active on PetCare AI.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false,
      });
      localStorage.setItem('notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('storage'));
      showToast('✅ Vet approved successfully!');
      logGlobalActivity('Admin', 'Approved vet application', '🩺', 'vet');
    } catch (err) {
      showToast('❌ Failed to approve vet', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`${API}/admin/vets/${id}/reject`, {}, authCfg);
      fetchData();
      // Sync rejection back to localStorage
      const pending = JSON.parse(localStorage.getItem('pendingVets') || '[]');
      const updated = pending.map(v => v.id === id || v.vetProfileId === id ? { ...v, status: 'rejected' } : v);
      localStorage.setItem('pendingVets', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      showToast('❌ Vet application rejected.', 'error');
      logGlobalActivity('Admin', 'Rejected vet application', '❌', 'vet');
    } catch (err) {
      showToast('❌ Failed to reject vet', 'error');
    }
  };

  const handleSaveUser = async (id, form) => {
    try {
      await axios.put(`${API}/admin/users/${id}`, form, authCfg);
      fetchData();
      showToast('✅ User details updated successfully!');
    } catch (err) {
      showToast('❌ Failed to update user', 'error');
    }
  };

  const handleToggleBlockUser = async (id) => {
    try {
      const res = await axios.post(`${API}/admin/users/${id}/toggle-block`, {}, authCfg);
      fetchData();
      showToast(res.data?.message || '✅ User block status updated successfully!');
    } catch (err) {
      showToast('❌ Failed to update block status', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const SupportCenterPanel = () => {
    const [tickets, setTickets] = useState(() => JSON.parse(localStorage.getItem('supportTickets')) || [
      { id:'TKT-001', user:'Priya Sharma',  issue:'Cannot book appointment',       priority:'High',   status:'open',       type:'Technical', time:'08:12 AM' },
      { id:'TKT-002', user:'Rajan Anand',   issue:'Payment failed twice',          priority:'High',   status:'open',       type:'Payment',   time:'08:45 AM' },
      { id:'TKT-003', user:'Emily Roberts', issue:'AI scan not loading',           priority:'Medium', status:'in-progress', type:'AI Feature', time:'09:10 AM' },
      { id:'TKT-004', user:'Meena Kumar',   issue:'Vet not responding to messages',priority:'Low',   status:'resolved',   type:'Service',   time:'09:30 AM' },
      { id:'TKT-005', user:'Arjun Verma',   issue:'Profile picture not updating',  priority:'Low',   status:'open',       type:'Account',   time:'10:00 AM' },
    ]);
    const [filter, setFilter] = useState('All');
    const priorityCfg  = { High:'bg-rose-100 text-rose-700', Medium:'bg-amber-100 text-amber-700', Low:'bg-slate-100 text-slate-500' };
    const statusCfg    = { open:'bg-indigo-100 text-indigo-700', 'in-progress':'bg-amber-100 text-amber-700 animate-pulse', resolved:'bg-emerald-100 text-emerald-700' };
    const resolve      = (id) => {
      const next = tickets.map(t => t.id===id ? {...t, status:'resolved'} : t);
      setTickets(next);
      localStorage.setItem('supportTickets', JSON.stringify(next));
    };
    const vis          = tickets.filter(t => filter==='All' || t.status===filter);
    return (
      <div className="space-y-5 max-w-5xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#6366f1,#a855f7)'}}>
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🎧 Support</span>
          <h2 className="text-2xl font-black mt-2">Support Center</h2>
          <p className="text-violet-200 text-sm mt-1">AI-categorized support tickets with priority triage and resolution tracking.</p>
          <div className="flex gap-6 mt-4">
            {[['Open',tickets.filter(t=>t.status==='open').length],['In Progress',tickets.filter(t=>t.status==='in-progress').length],['Resolved',tickets.filter(t=>t.status==='resolved').length]].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-violet-200">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {['All','open','in-progress','resolved'].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${filter===f?'text-white bg-indigo-600 border-indigo-600':'bg-white border-slate-200 text-slate-600'}`}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {vis.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-extrabold text-indigo-600 flex-shrink-0 text-xs">{t.id}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="font-extrabold text-slate-900 text-sm">{t.issue}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityCfg[t.priority]}`}>{t.priority}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg[t.status]}`}>{t.status}</span>
                </div>
                <p className="text-xs text-slate-500">👤 {t.user} · 🏷️ {t.type} · 🕐 {t.time}</p>
              </div>
              {t.status !== 'resolved' && (
                <button onClick={()=>resolve(t.id)} className="px-3 py-1.5 text-xs font-bold text-white rounded-xl flex-shrink-0" style={{background:'linear-gradient(135deg,#10b981,#14b8a6)'}}>Resolve</button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AuditLogsPanel = () => {
    const [filter, setFilter] = useState('All');
    const LOGS = JSON.parse(localStorage.getItem('auditLogs')) || [
      { id:'LOG-001', time:'2026-05-08 08:12', actor:'Admin',         action:'Approved vet Dr. Sharma',         severity:'info'    },
      { id:'LOG-002', time:'2026-05-08 08:35', actor:'System',        action:'Auto-flagged suspicious login',    severity:'warning' },
      { id:'LOG-003', time:'2026-05-08 09:00', actor:'Admin',         action:'Rejected fraudulent vet account',  severity:'critical'},
      { id:'LOG-004', time:'2026-05-08 09:15', actor:'User: Priya',   action:'Profile updated',                 severity:'info'    },
      { id:'LOG-005', time:'2026-05-08 09:42', actor:'System',        action:'Backup completed successfully',    severity:'success' },
      { id:'LOG-006', time:'2026-05-08 10:05', actor:'Admin',         action:'Subscription plan pricing updated',severity:'warning' },
      { id:'LOG-007', time:'2026-05-08 10:30', actor:'System',        action:'AI model retrained with new data', severity:'info'    },
      { id:'LOG-008', time:'2026-05-08 10:58', actor:'User: Rajan',   action:'Payment dispute submitted',       severity:'critical'},
    ];
    const sevCfg = { info:'bg-indigo-50 border-indigo-200 text-indigo-700', warning:'bg-amber-50 border-amber-200 text-amber-700', critical:'bg-rose-50 border-rose-200 text-rose-700', success:'bg-emerald-50 border-emerald-200 text-emerald-700' };
    const vis = LOGS.filter(l => filter==='All' || l.severity===filter);
    return (
      <div className="space-y-5 max-w-5xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#0f172a,#1e293b)'}}>
          <span className="bg-white/10 text-slate-300 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">📋 Audit</span>
          <h2 className="text-2xl font-black mt-2 text-white">Smart Audit Logs</h2>
          <p className="text-slate-400 text-sm mt-1">Complete chronological record of all platform activities and system events.</p>
          <div className="flex gap-6 mt-4">
            {[['Total Logs',LOGS.length],['Critical',LOGS.filter(l=>l.severity==='critical').length],['Warnings',LOGS.filter(l=>l.severity==='warning').length]].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All','info','warning','critical','success'].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition capitalize ${filter===f?'text-white bg-slate-800 border-slate-800':'bg-white border-slate-200 text-slate-600'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {vis.map(l => (
            <div key={l.id} className={`flex items-start gap-3 p-3 rounded-xl border ${sevCfg[l.severity]}`}>
              <span className="text-[10px] font-bold w-14 flex-shrink-0 text-slate-400 pt-0.5">{l.time.split(' ')[1]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{l.action}</p>
                <p className="text-[10px] mt-0.5 opacity-70">{l.actor} · {l.time.split(' ')[0]} · {l.id}</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest flex-shrink-0">{l.severity}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const GlobalActivityFeedPanel = () => {
    const [feed, setFeed] = useState(() => JSON.parse(localStorage.getItem('globalFeed')) || [
      { time:'Now',    user:'Priya S.',   action:'Booked appointment',        icon:'📅', type:'booking'  },
      { time:'1m ago', user:'Rajan A.',   action:'Purchased premium plan',    icon:'💎', type:'payment'  },
      { time:'2m ago', user:'Emily R.',   action:'Uploaded pet health scan',  icon:'🔬', type:'ai'       },
      { time:'3m ago', user:'Meena K.',   action:'Emergency SOS activated',   icon:'🚨', type:'emergency'},
      { time:'4m ago', user:'Arjun V.',   action:'Posted in community forum', icon:'💬', type:'social'   },
      { time:'5m ago', user:'System',     action:'Backup completed',          icon:'✅', type:'system'   },
      { time:'7m ago', user:'New User',   action:'Registered on platform',    icon:'👤', type:'user'     },
      { time:'9m ago', user:'Dr. Sharma', action:'Approved 3 consultations',  icon:'🩺', type:'vet'      },
    ]);
    const typeCfg = { booking:'bg-indigo-100 text-indigo-700', payment:'bg-emerald-100 text-emerald-700', ai:'bg-violet-100 text-violet-700', emergency:'bg-rose-100 text-rose-700', social:'bg-teal-100 text-teal-700', system:'bg-slate-100 text-slate-600', user:'bg-amber-100 text-amber-700', vet:'bg-cyan-100 text-cyan-700' };
    const refresh = () => {
      const next = [{ time:'Just now', user:'Live User', action:'Real-time activity captured', icon:'⚡', type:'system' }, ...feed.slice(0,19)];
      setFeed(next);
      localStorage.setItem('globalFeed', JSON.stringify(next));
    };
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">📡 Live Feed</span>
          <h2 className="text-2xl font-black mt-2">Global Activity Feed</h2>
          <p className="text-teal-100 text-sm mt-1">Real-time stream of all platform-wide events and user activities.</p>
          <div className="flex gap-6 mt-4">
            {[['Active Users','1,247'],['Events Today','8,432'],['Alerts','3']].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-teal-200">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-extrabold text-slate-800">📡 Live Event Stream</p>
          <button onClick={refresh} className="px-4 py-2 text-xs font-bold text-white rounded-xl flex items-center gap-2" style={{background:'linear-gradient(135deg,#14b8a6,#6366f1)'}}>⚡ Simulate Event</button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-2">
          <AnimatePresence>
            {feed.map((f, i) => (
              <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 transition">
                <span className="text-xl">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate"><span className="text-teal-600">{f.user}</span> {f.action}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${typeCfg[f.type]}`}>{f.type}</span>
                <span className="text-[10px] text-slate-400 flex-shrink-0 w-14 text-right">{f.time}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const RevenueForecastPanel = () => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const actual  = [68000,72000,75000,69000,82000,null,null,null,null,null,null,null];
    const projected = [null,null,null,null,82000,91000,98000,105000,112000,118000,125000,134000];
    const INSIGHT = [
      'Platform revenue is on a strong upward trajectory. AI predicts 63% growth by year-end.',
      'Subscription upgrades contribute most to projected growth — focus on Pro Health plan upsell.',
      'Vet consultations show peak revenue in Q4 — prepare marketing campaigns for October.',
    ];
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(false);
    const gen = () => { setLoading(true); setTimeout(()=>{setInsight(INSIGHT[Math.floor(Math.random()*INSIGHT.length)]);setLoading(false);},1400); };

    const chartData = {
      labels: months,
      datasets: [
        { label:'Actual Revenue', data:actual, borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.15)', fill:true, tension:0.4, pointRadius:4 },
        { label:'AI Forecast',    data:projected, borderColor:'#10b981', borderDash:[6,3], backgroundColor:'rgba(16,185,129,0.05)', fill:true, tension:0.4, pointRadius:4, pointStyle:'star' },
      ],
    };
    const chartOpts = {
      responsive:true, plugins:{ legend:{position:'bottom'} },
      scales:{ y:{ticks:{callback:v=>'₹'+(v/1000)+'k'},grid:{color:'#f1f5f9'}}, x:{grid:{display:false}} },
    };
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#6366f1,#10b981)'}}>
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">📈 AI Forecast</span>
          <h2 className="text-2xl font-black mt-2">Revenue Forecasting Engine</h2>
          <p className="text-indigo-100 text-sm mt-1">AI-predicted revenue streams, growth opportunities, and financial trends for 2026.</p>
          <div className="flex gap-6 mt-4">
            {[['YTD Revenue','₹3.66L'],['Q4 Forecast','₹4.87L'],['YoY Growth','+63%'],['Confidence','91%']].map(([l,v]) => (
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">📊 Actual vs AI Forecast (2026)</p>
          <Line data={chartData} options={chartOpts} height={100}/>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[['Subscriptions','₹1.24L','+41%','#6366f1'],['Vet Consults','₹0.98L','+28%','#10b981'],['Marketplace','₹0.76L','+55%','#f59e0b']].map(([l,v,g,c]) => (
            <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs font-bold text-slate-400">{l}</p>
              <p className="text-2xl font-extrabold mt-1" style={{color:c}}>{v}</p>
              <p className="text-xs font-bold mt-1" style={{color:'#10b981'}}>{g} YoY</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-2">🤖 AI Growth Insight</p>
          {insight && <p className="text-sm text-slate-600 bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-3">{insight}</p>}
          <button onClick={gen} disabled={loading} className="w-full py-2.5 text-white font-bold rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2" style={{background:'linear-gradient(135deg,#6366f1,#10b981)'}}>
            {loading?<><RefreshCw className="w-4 h-4 animate-spin"/>Analysing...</>:'✨ Generate AI Insight'}
          </button>
        </div>
      </div>
    );
  };

  const PlatformHeatmapPanel = () => {
    const SECTIONS = [
      { name:'Pet Owner Dashboard', uses:9820, pct:95, color:'#10b981' },
      { name:'Vet Marketplace',     uses:7340, pct:82, color:'#6366f1' },
      { name:'Appointments',        uses:6900, pct:78, color:'#f59e0b' },
      { name:'Health Records',      uses:5600, pct:65, color:'#14b8a6' },
      { name:'Community Feed',      uses:5200, pct:60, color:'#ec4899' },
      { name:'AI Health Scan',      uses:4800, pct:55, color:'#8b5cf6' },
      { name:'Smart Tracking',      uses:4100, pct:48, color:'#ef4444' },
      { name:'Vet Dashboard',       uses:3800, pct:44, color:'#3b82f6' },
      { name:'Emergency SOS',       uses:1200, pct:18, color:'#f97316' },
      { name:'Admin Panel',         uses:800,  pct:10, color:'#64748b' },
    ];
    const PEAK_HOURS = [0,0,0,0,1,3,8,9,7,6,5,6,7,8,7,8,9,10,9,8,6,4,2,1];
    const maxPeak = Math.max(...PEAK_HOURS);
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#0f172a,#1e293b)'}}>
          <span className="bg-white/10 text-slate-300 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🗺️ Analytics</span>
          <h2 className="text-2xl font-black mt-2 text-white">Platform Usage Heatmap</h2>
          <p className="text-slate-400 text-sm mt-1">Visualise which sections users engage with most and identify usage patterns.</p>
          <div className="flex gap-6 mt-4">
            {[['Total Sessions','42.8K'],['Peak Hour','5 PM–7 PM'],['Most Used','Pet Owner Dashboard'],['Avg Session','8.4 min']].map(([l,v]) => (
              <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">🔥 Section Popularity Heatmap</p>
          <div className="space-y-3">
            {SECTIONS.map((s,i) => (
              <motion.div key={s.name} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 w-44 flex-shrink-0 truncate">{s.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                  <motion.div className="h-5 rounded-full flex items-center px-2" style={{background:s.color+'cc'}}
                    initial={{width:0}} animate={{width:`${s.pct}%`}} transition={{delay:i*0.06+0.2,duration:0.7}}>
                    {s.pct>20 && <span className="text-white text-[10px] font-extrabold">{s.pct}%</span>}
                  </motion.div>
                </div>
                <span className="text-xs font-bold text-slate-500 w-14 text-right">{(s.uses/1000).toFixed(1)}K</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">⏰ Hourly Activity Heatmap (Today)</p>
          <div className="flex gap-1 items-end">
            {PEAK_HOURS.map((v,i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-sm transition-all"
                  style={{height:`${Math.max((v/maxPeak)*60,2)}px`,background:v>7?'#ef4444':v>4?'#f59e0b':v>1?'#6366f1':'#e2e8f0'}}/>
                <span className="text-[8px] text-slate-400">{i}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 justify-center">
            {[['#ef4444','Peak (7–10)'],['#f59e0b','High (4–7)'],['#6366f1','Normal (1–4)'],['#e2e8f0','Low (0–1)']].map(([c,l]) => (
              <span key={l} className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                <span className="w-3 h-3 rounded-sm inline-block" style={{background:c}}/>{l}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TrustEnginePanel = () => {
    const USERS = [
      { name:'Priya Sharma',  trustScore:96, badges:['Verified','Top Reviewer'],           risk:'Safe',     transactions:48 },
      { name:'Rajan Anand',   trustScore:62, badges:['New User'],                           risk:'Moderate', transactions:5  },
      { name:'Emily Roberts', trustScore:88, badges:['Verified','Active Member'],           risk:'Safe',     transactions:27 },
      { name:'Meena Kumar',   trustScore:41, badges:['Disputed'],                           risk:'High',     transactions:3  },
      { name:'Arjun Verma',   trustScore:74, badges:['Verified'],                           risk:'Safe',     transactions:15 },
    ];
    const FRAUD_SIGNALS = [
      { signal:'Multiple failed payments',    count:3, severity:'high' },
      { signal:'Unusual login locations',      count:7, severity:'critical' },
      { signal:'Bot-like review patterns',     count:2, severity:'medium' },
    ];
    const riskCfg = { Safe:'bg-emerald-50 text-emerald-700 border-emerald-200', Moderate:'bg-amber-50 text-amber-700 border-amber-200', High:'bg-rose-50 text-rose-700 border-rose-200' };
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#10b981,#6366f1)'}}>
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🛡️ Trust Engine</span>
          <h2 className="text-2xl font-black mt-2">Trust & Reputation Engine</h2>
          <p className="text-emerald-100 text-sm mt-1">AI-powered user trust scoring, fraud detection, and reputation analytics across the platform.</p>
          <div className="flex gap-6 mt-4">
            {[['Total Users',USERS.length],['Safe Users',USERS.filter(u=>u.risk==='Safe').length],['High Risk',USERS.filter(u=>u.risk==='High').length],['Fraud Signals',FRAUD_SIGNALS.length]].map(([l,v])=>(
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-emerald-200">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">🚨 Active Fraud Signals</p>
          <div className="space-y-2">
            {FRAUD_SIGNALS.map(f=>(
              <div key={f.signal} className={`flex items-center gap-3 p-3 rounded-xl border ${f.severity==='critical'?'bg-rose-50 border-rose-200 text-rose-700':f.severity==='high'?'bg-orange-50 border-orange-200 text-orange-700':'bg-amber-50 border-amber-200 text-amber-700'}`}>
                <span className="text-sm font-bold flex-1">{f.signal}</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/70">{f.count} occurrences</span>
                <span className="text-xs font-bold capitalize">{f.severity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">👥 User Trust Scores</p>
          <div className="space-y-3">
            {USERS.map((u,i)=>(
              <motion.div key={u.name} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{background:'linear-gradient(135deg,#10b981,#6366f1)'}}>{u.name[0]}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-slate-800">{u.name}</span>
                    <span className="text-sm font-extrabold" style={{color:u.trustScore>80?'#10b981':u.trustScore>60?'#f59e0b':'#ef4444'}}>{u.trustScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{width:`${u.trustScore}%`,background:u.trustScore>80?'#10b981':u.trustScore>60?'#f59e0b':'#ef4444'}}/>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskCfg[u.risk]}`}>{u.risk}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const EmergencyIntelMapPanel = () => {
    const defaultEmergencies = [
      { id:'E-001', pet:'Bruno (Lab)', loc:'Sector 12, Chennai',  type:'Cardiac Arrest', severity:'critical', time:'2m ago',  status:'dispatched' },
      { id:'E-002', pet:'Luna (Persian)', loc:'Anna Nagar',      type:'Poisoning',       severity:'high',    time:'8m ago',  status:'responding' },
      { id:'E-003', pet:'Rocky (Husky)', loc:'OMR, Chennai',     type:'Seizure',         severity:'critical', time:'12m ago', status:'resolved'  },
      { id:'E-004', pet:'Milo (Beagle)', loc:'Velachery',        type:'Fracture',        severity:'medium',  time:'25m ago', status:'en-route'  },
    ];
    const [emergencies, setEmergencies] = useState(() => JSON.parse(localStorage.getItem('platformEmergencies')) || defaultEmergencies);

    useEffect(() => {
      const handleStorage = () => setEmergencies(JSON.parse(localStorage.getItem('platformEmergencies')) || defaultEmergencies);
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }, []);
    const STATS = [['Total Active',2],['Dispatched',1],['Resolved Today',5],['Response Avg','8 min']];
    const sevCfg = { critical:'bg-rose-50 border-rose-300 text-rose-700', high:'bg-orange-50 border-orange-200 text-orange-700', medium:'bg-amber-50 border-amber-200 text-amber-700' };
    const stCfg  = { dispatched:'bg-blue-100 text-blue-700', responding:'bg-amber-100 text-amber-700 animate-pulse', resolved:'bg-emerald-100 text-emerald-700', 'en-route':'bg-violet-100 text-violet-700 animate-pulse' };
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#ef4444,#f97316)'}}>
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest animate-pulse">🗺️ Emergency Intel</span>
          <h2 className="text-2xl font-black mt-2">Emergency Intelligence Map</h2>
          <p className="text-orange-100 text-sm mt-1">Live emergency monitoring, SOS tracking, and crisis response analytics across the platform.</p>
          <div className="flex gap-6 mt-4">
            {STATS.map(([l,v])=>(
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-orange-200">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden" style={{minHeight:200}}>
          <p className="font-extrabold text-white mb-3">📍 Live Emergency Map View</p>
          <div className="relative w-full h-36 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 30% 40%, #ef4444 2px, transparent 2px), radial-gradient(circle at 60% 60%, #f97316 2px, transparent 2px), radial-gradient(circle at 80% 30%, #ef4444 2px, transparent 2px)',backgroundSize:'40px 40px'}}></div>
            {emergencies.filter(e=>e.status!=='resolved').map((e,i)=>(
              <motion.div key={e.id} animate={{scale:[1,1.3,1]}} transition={{repeat:Infinity,duration:1.5,delay:i*0.4}}
                className="absolute w-4 h-4 rounded-full border-2 border-red-400 bg-red-500/40"
                style={{left:`${20+i*20}%`,top:`${30+i*10}%`}}/>
            ))}
            <p className="text-slate-400 text-xs z-10">🗺️ Chennai Metropolitan Area — Live Emergency Tracking</p>
          </div>
        </div>
        <div className="space-y-3">
          {emergencies.map((e,i)=>(
            <motion.div key={e.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              className={`rounded-2xl border p-4 ${sevCfg[e.severity]}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">{e.severity==='critical'?'🚨':'⚠️'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-extrabold text-sm">{e.pet}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stCfg[e.status]}`}>{e.status}</span>
                  </div>
                  <p className="text-xs font-bold">{e.type}</p>
                  <p className="text-xs opacity-70 mt-0.5">📍 {e.loc} · {e.time}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50">{e.severity}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const CrisisPredictPanel = () => {
    const PREDICTIONS = [
      { label:'Traffic Spike (3PM–5PM)',     probability:82, type:'traffic',   impact:'High server load expected — auto-scaling advised', timeframe:'Today' },
      { label:'Vet Approval Surge',          probability:68, type:'ops',       impact:'12+ vet applications predicted this week', timeframe:'This week' },
      { label:'Emergency SOS Spike',         probability:74, type:'emergency', impact:'Monsoon season — 35% more SOS calls expected', timeframe:'This month' },
      { label:'Subscription Revenue Drop',   probability:55, type:'revenue',   impact:'Churn spike predicted — run retention campaign now', timeframe:'Next month' },
    ];
    const typeCfg = { traffic:'#6366f1', ops:'#10b981', emergency:'#ef4444', revenue:'#f59e0b' };
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#0f172a,#6366f1)'}}>
          <span className="bg-white/10 text-slate-300 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">⚡ AI Crisis Prediction</span>
          <h2 className="text-2xl font-black mt-2 text-white">AI Crisis Prediction Engine</h2>
          <p className="text-slate-400 text-sm mt-1">Predicts ecosystem-level emergencies, traffic spikes, and critical incidents before they occur.</p>
          <div className="flex gap-6 mt-4">
            {[['Predictions',PREDICTIONS.length],['High Risk',PREDICTIONS.filter(p=>p.probability>70).length],['Avg Confidence',Math.round(PREDICTIONS.reduce((s,p)=>s+p.probability,0)/PREDICTIONS.length)+'%'],['Models Active','7']].map(([l,v])=>(
              <div key={l}><p className="text-lg font-extrabold">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {PREDICTIONS.map((p,i)=>(
            <motion.div key={p.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-extrabold text-slate-800">{p.label}</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{p.timeframe}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
                <motion.div className="h-3 rounded-full" style={{background:typeCfg[p.type]}}
                  initial={{width:0}} animate={{width:`${p.probability}%`}} transition={{delay:i*0.1+0.3}}/>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-slate-500">💡 {p.impact}</p>
                <span className="text-sm font-extrabold" style={{color:typeCfg[p.type]}}>{p.probability}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const EcoEvolutionPanel = () => {
    const MILESTONES = [
      { date:'Jan 2025', event:'Platform Launch',             metric:'1,000 users',    icon:'🚀', color:'#6366f1' },
      { date:'Feb 2025', event:'Vet Onboarding Wave',         metric:'50 vets joined', icon:'👨‍⚕️', color:'#14b8a6' },
      { date:'Mar 2025', event:'AI Scan Feature Released',    metric:'800 scans/day',  icon:'🔬', color:'#10b981' },
      { date:'Apr 2025', event:'Marketplace Launch',          metric:'₹2.4L revenue',  icon:'🛒', color:'#f59e0b' },
      { date:'May 2025', event:'Emergency SOS System Live',   metric:'12 SOS resolved',icon:'🚨', color:'#ef4444' },
      { date:'Jun 2025', event:'10,000 Users Milestone',      metric:'10K+ active',    icon:'🎉', color:'#8b5cf6' },
    ];
    const METRICS = [['Users',10240,8200,'+25%'],['Vets',148,112,'+32%'],['Appointments',3840,2900,'+32%'],['Revenue','₹8.2L','₹5.1L','+61%']];
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#6366f1,#14b8a6,#10b981)'}}>
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🌱 Ecosystem Evolution</span>
          <h2 className="text-2xl font-black mt-2">Ecosystem Evolution Tracker</h2>
          <p className="text-indigo-100 text-sm mt-1">Platform growth timeline, user retention analytics, and feature engagement milestones.</p>
          <div className="flex gap-6 mt-4">
            {[['Launch Date','Jan 2025'],['Total Growth','+61%'],['Milestones',MILESTONES.length],['Platform Age','5 months']].map(([l,v])=>(
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {METRICS.map(([l,now,prev,growth])=>(
            <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-xs font-bold text-slate-400">{l}</p>
              <p className="text-xl font-extrabold text-slate-800 mt-1">{now}</p>
              <p className="text-xs font-bold text-emerald-600 mt-0.5">{growth} growth</p>
              <p className="text-[10px] text-slate-400">vs {prev} last quarter</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-5">📅 Platform Milestone Timeline</p>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"/>
            {MILESTONES.map((m,i)=>(
              <motion.div key={m.date} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
                className="flex items-start gap-4 mb-5 last:mb-0">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 z-10" style={{background:m.color+'18', border:`2px solid ${m.color}33`}}>
                  {m.icon}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{m.date}</p>
                  <p className="font-extrabold text-slate-800">{m.event}</p>
                  <p className="text-xs font-bold mt-0.5" style={{color:m.color}}>{m.metric}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const CyberSecurityPanel = () => {
    const THREATS = [
      { id:'THR-001', type:'Brute Force Login',        ip:'103.45.67.89',  severity:'critical', time:'09:15 AM', status:'blocked',   target:'Admin Portal'  },
      { id:'THR-002', type:'Suspicious API Activity',  ip:'45.132.22.110', severity:'high',    time:'08:42 AM', status:'monitoring', target:'Payment API'   },
      { id:'THR-003', type:'SQL Injection Attempt',    ip:'91.108.56.222', severity:'high',    time:'08:05 AM', status:'blocked',    target:'User Database' },
      { id:'THR-004', type:'Unusual Data Export',      ip:'Internal User', severity:'medium',  time:'Yesterday',status:'reviewing',  target:'Reports Module'},
    ];
    const METRICS = [['Threats Blocked','347','✅'],['Active Monitors','12','📡'],['Uptime','99.97%','📡'],['Last Scan','2m ago','🔍']];
    const sevCfg = { critical:'bg-rose-50 border-rose-300 text-rose-700', high:'bg-orange-50 border-orange-200 text-orange-700', medium:'bg-amber-50 border-amber-200 text-amber-700' };
    const stCfg  = { blocked:'bg-emerald-100 text-emerald-700', monitoring:'bg-blue-100 text-blue-700 animate-pulse', reviewing:'bg-amber-100 text-amber-700' };
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#0f172a,#1e293b,#374151)'}}>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🛡️ Cybersecurity AI</span>
          <h2 className="text-2xl font-black mt-2 text-white">Cybersecurity Monitor</h2>
          <p className="text-slate-400 text-sm mt-1">AI-powered platform security monitoring, threat detection, and real-time incident response dashboard.</p>
          <div className="flex gap-6 mt-4">
            {METRICS.map(([l,v,icon])=>(
              <div key={l}><p className="text-lg font-extrabold text-white">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[['Safe','bg-emerald-50 text-emerald-700','347'],['Threats','bg-rose-50 text-rose-700',THREATS.length],['Blocked','bg-blue-50 text-blue-700',THREATS.filter(t=>t.status==='blocked').length],['Uptime','bg-violet-50 text-violet-700','99.97%']].map(([l,cl,v])=>(
            <div key={l} className={`rounded-2xl border p-4 text-center ${cl.split(' ')[0]} border-slate-100`}><p className={`text-xl font-extrabold ${cl.split(' ')[1]}`}>{v}</p><p className="text-xs font-bold text-slate-400 mt-0.5">{l}</p></div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">🚨 Active Threat Log</p>
          <div className="space-y-3">
            {THREATS.map((t,i)=>(
              <motion.div key={t.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                className={`rounded-xl border p-4 ${sevCfg[t.severity]}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-extrabold text-sm">{t.type}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stCfg[t.status]}`}>{t.status}</span>
                    </div>
                    <p className="text-xs font-bold">IP: {t.ip} · Target: {t.target}</p>
                    <p className="text-xs opacity-70 mt-0.5">{t.id} · {t.time}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50`}>{t.severity}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-5">
          <p className="font-extrabold text-white mb-3">🖥️ Security Overview</p>
          <div className="grid grid-cols-3 gap-3">
            {[['Firewall','Active','🟢'],['DDoS Shield','Active','🟢'],['SSL','Valid · 365d','🟢'],['Backup','Last 2h','🔵'],['2FA Enforced','Admin Only','🟡'],['Last Audit','May 10','🟢']].map(([l,v,dot])=>(
              <div key={l} className="bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-slate-400">{l}</p>
                <p className="font-bold text-white text-sm mt-0.5">{dot} {v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const FinancialIntelPanel = () => {
    const STREAMS = [
      { name:'Subscription Revenue', monthly:182400, growth:'+18%', color:'#6366f1' },
      { name:'Marketplace Commission', monthly:74800, growth:'+32%', color:'#10b981' },
      { name:'Vet Consultation Fees',  monthly:58200, growth:'+12%', color:'#f59e0b' },
      { name:'Insurance Premium Cuts', monthly:24600, growth:'+8%',  color:'#ec4899' },
      { name:'Premium Plan Revenue',   monthly:41000, growth:'+22%', color:'#14b8a6' },
    ];
    const TOTAL = STREAMS.reduce((s,r)=>s+r.monthly,0);
    const EXPENSES = [
      { name:'Cloud Infrastructure', amount:32000, pct:18 },
      { name:'AI/ML Services',       amount:18400, pct:10 },
      { name:'Support Staff',        amount:44000, pct:25 },
      { name:'Marketing',            amount:22000, pct:12 },
      { name:'Operations',           amount:28000, pct:15 },
    ];
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#10b981,#6366f1)'}}>
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">💰 Financial Intel</span>
          <h2 className="text-2xl font-black mt-2">Financial Intelligence Engine</h2>
          <p className="text-emerald-100 text-sm mt-1">Real-time revenue streams, expense analytics, margin tracking, and AI-powered financial forecasting.</p>
          <div className="flex gap-6 mt-4">
            {[['Total Monthly','₹'+TOTAL.toLocaleString('en-IN')],['Revenue Streams',STREAMS.length],['Net Margin','42%'],['Forecast','+24% QoQ']].map(([l,v])=>(
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-emerald-200">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">📊 Revenue Streams Breakdown</p>
          <div className="space-y-4">
            {STREAMS.map((s,i)=>(
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:s.color}}/>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-slate-700">{s.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-800">₹{s.monthly.toLocaleString('en-IN')}</span>
                      <span className="ml-2 text-xs font-bold text-emerald-600">{s.growth}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <motion.div className="h-2.5 rounded-full" style={{background:s.color}}
                      initial={{width:0}} animate={{width:`${(s.monthly/TOTAL)*100}%`}} transition={{delay:i*0.1}}/>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{Math.round((s.monthly/TOTAL)*100)}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-4">📉 Expense Analysis</p>
          <div className="space-y-3">
            {EXPENSES.map((e,i)=>(
              <div key={e.name} className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-600 w-36 flex-shrink-0">{e.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <motion.div className="h-2 rounded-full bg-rose-400" style={{width:`${e.pct}%`}} initial={{width:0}} animate={{width:`${e.pct}%`}} transition={{delay:i*0.08}}/>
                </div>
                <span className="text-xs font-extrabold text-slate-700 w-20 text-right">₹{e.amount.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-400 w-8">{e.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const InnovationLabPanel = () => {
    const EXPERIMENTS = [
      { id:'EXP-01', name:'AR Telemedicine Overlay',         status:'testing',  progress:65, tech:'WebXR + WebRTC',   team:3, launched:false },
      { id:'EXP-02', name:'Voice AI Command Engine v2',      status:'building', progress:40, tech:'Whisper + React',  team:2, launched:false },
      { id:'EXP-03', name:'Blockchain Pet Passport',         status:'testing',  progress:80, tech:'Polygon + IPFS',   team:4, launched:false },
      { id:'EXP-04', name:'AI Emotional Bond Scoring v2',    status:'live',     progress:100,tech:'TensorFlow.js',    team:2, launched:true  },
      { id:'EXP-05', name:'Genomic AI Breed Risk Predictor', status:'planning', progress:15, tech:'Bio-Python + GPT', team:5, launched:false },
    ];
    const stCfg = { live:'bg-emerald-100 text-emerald-700', testing:'bg-blue-100 text-blue-700', building:'bg-amber-100 text-amber-700', planning:'bg-slate-100 text-slate-500' };
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#8b5cf6,#6366f1,#14b8a6)'}}>
          <span className="bg-white/20 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">🧪 Innovation Lab</span>
          <h2 className="text-2xl font-black mt-2">Innovation Testing Laboratory</h2>
          <p className="text-purple-100 text-sm mt-1">Experimental features, beta experiments, and next-gen PetCare AI technologies in active development.</p>
          <div className="flex gap-6 mt-4">
            {[['Experiments',EXPERIMENTS.length],['Live',EXPERIMENTS.filter(e=>e.status==='live').length],['In Progress',EXPERIMENTS.filter(e=>e.status!=='live'&&e.status!=='planning').length],['Team Size',EXPERIMENTS.reduce((s,e)=>s+e.team,0)+' devs']].map(([l,v])=>(
              <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-purple-200">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {EXPERIMENTS.map((exp,i)=>(
            <motion.div key={exp.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{background:'linear-gradient(135deg,#8b5cf6,#6366f1)'}}>
                  {exp.id}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-extrabold text-slate-800">{exp.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${stCfg[exp.status]}`}>{exp.status}</span>
                    {exp.launched && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">✅ Live</span>}
                  </div>
                  <p className="text-xs text-slate-400 mb-2">Tech: {exp.tech} · Team: {exp.team} engineers</p>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <motion.div className="h-2.5 rounded-full" style={{background:'linear-gradient(135deg,#8b5cf6,#6366f1)'}}
                      initial={{width:0}} animate={{width:`${exp.progress}%`}} transition={{delay:i*0.1+0.3}}/>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{exp.progress}% complete</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-violet-700">💡 Submit a feature idea or vote on upcoming experiments via the PetCare Innovation Portal. Community-driven features are prioritized for next sprint planning.</p>
        </div>
      </div>
    );
  };

  const pendingCount = vets.filter(v => v.status === 'pending').length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active={activeTab} setActive={setActiveTab} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">🛡️ Admin Control Panel</p>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text" style={{ backgroundImage: GRAD }}>
              {{
                analytics: 'Platform Analytics', vets: 'Vet Approvals', users: 'User Management',
                health: 'Health Insights', moderation: 'Content Moderation', financials: 'Platform Financials',
                profile: 'My Profile', security: 'Fraud & Security', notifications: 'Notifications',
                payments: 'Payment Monitoring', reports: 'Report Generation',
                'emergency-monitor': 'Emergency Monitor', 'marketplace-analytics': 'Marketplace Analytics',
                'system-monitor': 'System Monitor', subscriptions: 'Subscription Management',
                'ai-activity': 'AI Activity Monitor',
                'support': 'Support Center', 'audit-logs': 'Audit Logs', 'global-feed': 'Global Activity Feed',
                'revenue-forecast': 'Revenue Forecasting', 'heatmap': 'Platform Usage Heatmap',
                'trust-engine': 'Trust & Reputation Engine', 'emergency-map': 'Emergency Intelligence Map',
                'crisis-predict': 'AI Crisis Prediction Engine', 'eco-evolution': 'Ecosystem Evolution Tracker',
                'cybersecurity': 'Cybersecurity Monitor', 'financial-intel': 'Financial Intelligence Engine',
                'innovation-lab': 'Innovation Testing Laboratory',
                'eco-simulator':  'Ecosystem Simulator',
                'stability':      'Ecosystem Stability Index',
                'rev-evolution':  'Revenue Evolution Tracker',
                'command-grid':   'Digital Command Grid',
                'eco-pulse':      'Ecosystem Pulse Engine',
                'eco-galaxy':     'AI Ecosystem Galaxy',
                'glassboard':     'Health Glassboard',
                'quantum-core':   'Quantum AI PetCare Core',
                'pet-city':       'Digital Pet City',
                'adm-radar':      'Live Engagement Radar',
                'adm-orchestrator': 'Care Orchestrator',
                'eco-brain':     'AI Global Ecosystem Brain',
                'power-grid':    'Ecosystem Power Grid',
                'rev-const':     'Revenue Constellation',
                'mood-analyzer': 'Platform Mood Analyzer',
                'observatory':   'Super Intelligence Observatory',
                'harmony':       'Ecosystem Harmony Engine',
                'user-const':    'User Behavior Constellation',
                'eco-weather':   'Ecosystem Weather System',
                'rev-ocean':     'Smart Revenue Ocean',
                'quantum-grid':  'Quantum Platform Intelligence Grid',
              }[activeTab]}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('vets')} className="relative p-2 rounded-xl hover:bg-slate-100 transition">
              <Bell className="w-5 h-5 text-slate-500" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
            <div onClick={() => setActiveTab('profile')} className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-lg transition hover:opacity-90 uppercase"
              style={{ background: GRAD }}>
              {localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).name?.[0] : 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {fetchError && (
            <div className="mb-4 flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm font-semibold">
              ⚠️ Failed to load data — make sure the backend is running and you are logged in as Admin.
              <button onClick={fetchData} className="ml-auto px-3 py-1 bg-rose-100 hover:bg-rose-200 rounded-lg text-xs font-bold transition">Retry</button>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}>
              {activeTab === 'analytics'            && <AnalyticsPanel users={users} vets={vets} setActive={setActiveTab} />}
              {activeTab === 'vets'                  && <VetApprovalsPanel vets={vets} onApprove={handleApprove} onReject={handleReject} />}
              {activeTab === 'users'                 && <UsersPanel users={users} onSave={handleSaveUser} onToggleBlock={handleToggleBlockUser} />}
              {activeTab === 'health'                && <HealthInsightsPanel />}
              {activeTab === 'security'              && <FraudSecurityPanel />}
              {activeTab === 'notifications'         && <NotificationsPanel />}
              {activeTab === 'payments'              && <PaymentMonitoringPanel />}
              {activeTab === 'reports'               && <ReportGenerationPanel users={users} vets={vets} />}
              {activeTab === 'moderation'            && <ModerationPanel />}
              {activeTab === 'financials'            && <FinancialsPanel />}
              {activeTab === 'emergency-monitor'     && <EmergencyMonitorPanel />}
              {activeTab === 'marketplace-analytics' && <MarketplaceAnalyticsPanel />}
              {activeTab === 'system-monitor'        && <SystemMonitorPanel />}
              {activeTab === 'subscriptions'         && <SubscriptionMgmtPanel />}
              {activeTab === 'ai-activity'           && <AIActivityPanel />}
              {activeTab === 'support'               && <SupportCenterPanel />}
              {activeTab === 'audit-logs'            && <AuditLogsPanel />}
              {activeTab === 'global-feed'           && <GlobalActivityFeedPanel />}
              {activeTab === 'revenue-forecast'      && <RevenueForecastPanel />}
              {activeTab === 'heatmap'               && <PlatformHeatmapPanel />}
              {activeTab === 'trust-engine'          && <TrustEnginePanel />}
              {activeTab === 'emergency-map'         && <EmergencyIntelMapPanel />}
              {activeTab === 'crisis-predict'        && <CrisisPredictPanel />}
              {activeTab === 'eco-evolution'         && <EcoEvolutionPanel />}
              {activeTab === 'cybersecurity'         && <CyberSecurityPanel />}
              {activeTab === 'financial-intel'       && <FinancialIntelPanel />}
              {activeTab === 'innovation-lab'        && <InnovationLabPanel />}
              {activeTab === 'eco-simulator'          && <EcosystemSimulatorPanel />}
              {activeTab === 'stability'              && <EcosystemStabilityPanel />}
              {activeTab === 'rev-evolution'          && <RevenueEvolutionPanel />}
              {activeTab === 'command-grid'           && <CommandGridPanel />}
              {activeTab === 'eco-pulse'              && <EcosystemPulsePanel />}
              {activeTab === 'eco-galaxy'             && <EcosystemGalaxyPanel />}
              {activeTab === 'glassboard'             && <HealthGlassboardPanel />}
              {activeTab === 'quantum-core'           && <QuantumCorePanel />}
              {activeTab === 'pet-city'               && <PetCityPanel />}
              {activeTab === 'adm-radar'              && <LiveEngagementRadarPanel />}
              {activeTab === 'adm-orchestrator'       && <CareOrchestratorPanel />}
              {activeTab === 'eco-brain'              && <EcosystemBrainPanel />}
              {activeTab === 'power-grid'             && <EcosystemPowerGridPanel />}
              {activeTab === 'rev-const'              && <RevenueConstellationPanel />}
              {activeTab === 'mood-analyzer'          && <PlatformMoodPanel />}
              {activeTab === 'observatory'            && <IntelObservatoryPanel />}
              {activeTab === 'harmony'                && <EcosystemHarmonyPanel />}
              {activeTab === 'user-const'             && <UserBehaviorConstellationPanel />}
              {activeTab === 'eco-weather'            && <EcosystemWeatherPanel />}
              {activeTab === 'rev-ocean'              && <RevenueOceanPanel />}
              {activeTab === 'quantum-grid'           && <QuantumIntelGridPanel />}
              {activeTab === 'eco-aura'               && <GlobalEcosystemAuraPanel />}
              {activeTab === 'ux-dna'                 && <UserExperienceDNAPanel />}
              {activeTab === 'emotion-grid'           && <PlatformEmotionGridPanel />}
              {activeTab === 'eng-volcano'            && <EngagementVolcanoPanel />}
              {activeTab === 'rev-matrix'             && <RevenueEnergyMatrixPanel />}
              {activeTab === 'trust-pulse'            && <TrustPulseEnginePanel />}
              {activeTab === 'eco-orbit'              && <EcosystemBalanceOrbitPanel />}
              {activeTab === 'activity-skyline'       && <GlobalActivitySkylinePanel />}
              {activeTab === 'intel-stream'           && <IntelligenceStreamNetworkPanel />}
              {activeTab === 'quantum-core-evo'       && <QuantumEvolutionCorePanel />}
              {activeTab === 'universal-dna'          && <UniversalExperienceDNAPanel />}
              {activeTab === 'emotion-stream'         && <DigitalEmotionStreamPanel />}
              {activeTab === 'behavior-waves'         && <AIBehaviorWavesPanel />}
              {activeTab === 'wellness-network'       && <GlobalWellnessNetworkPanel />}
              {activeTab === 'insight-nebula'         && <AIInsightNebulaPanel />}
              {activeTab === 'resonance'              && <ExperienceResonanceEnginePanel />}
              {activeTab === 'activity-cosmos'        && <RealtimeActivityCosmosPanel />}
              {activeTab === 'sync-field'             && <PetcareSyncFieldPanel />}
              {activeTab === 'wellness-oracle'        && <FutureWellnessOraclePanel />}
              {activeTab === 'quantum-sphere'         && <QuantumIntelligenceSpherePanel />}
              {activeTab === 'welfare-monitor'        && <WelfareMonitoringPanel />}
              {activeTab === 'innovation-marketplace' && <InnovationMarketplacePanel />}
              {activeTab === 'global-stats'           && <GlobalStatsPanel />}
              {activeTab === 'national-health-map'    && <NationalHealthMapPanel />}
              {activeTab === 'ai-fraud-detect'        && <AIFraudDetectionPanel />}
              {activeTab === 'digital-passport'       && <DigitalPetPassportPanel />}
              {activeTab === 'disaster-rescue'        && <DisasterRescuePanel />}
              {activeTab === 'blood-donor'            && <PetBloodDonorNetworkPanel />}
              {activeTab === 'lifelong-companion'     && <AILifelongCompanionPanel />}
              {activeTab === 'smart-city'             && <SmartPetCityPanel />}
              {activeTab === 'profile'               && <AdminProfilePanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-semibold text-sm shadow-2xl"
            style={{ background: toast.type === 'error' ? GRADRED : GRADGREEN }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
