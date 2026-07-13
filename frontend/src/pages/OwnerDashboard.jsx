import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import {
  LayoutDashboard, Heart, Calendar, FileText, ShoppingCart,
  Bell, LogOut, PawPrint, Activity, MapPin, Mic, Navigation,
  Brain, Sparkles, AlertCircle, TrendingUp, Camera, Droplets,
  User, ChevronRight, Shield, Star, Zap, Home, MessageSquare, X,
  Leaf, Users, Globe
} from 'lucide-react';
import Marketplace from './Marketplace';
import { useTheme } from '../context/ThemeContext';
import { logGlobalActivity } from '../utils/activityFeed';
import { db } from '../utils/dataBridge';
import AIBondAnalyzerTab from '../components/AIBondAnalyzerTab';
import LifeExpectancyTab from '../components/LifeExpectancyTab';
import PetPersonalityTab from '../components/PetPersonalityTab';
import PredictiveEmergencyTab from '../components/PredictiveEmergencyTab';
import KnowledgeGalaxyTab from '../components/KnowledgeGalaxyTab';
import SeasonalWellnessTab from '../components/SeasonalWellnessTab';
import VoiceCommandTab from '../components/VoiceCommandTab';
import PetTravelTab from '../components/PetTravelTab';
import SustainabilityTab from '../components/SustainabilityTab';
import GeoFenceTab from '../components/GeoFenceTab';
import ActivityTrackerTab from '../components/ActivityTrackerTab';
import AIMoodDetectionTab from '../components/AIMoodDetectionTab';
import AIGroomingTab from '../components/AIGroomingTab';
import AITranslatorTab from '../components/AITranslatorTab';
import CommunityFeedTab from '../components/CommunityFeedTab';
import DigitalTwinTab from '../components/DigitalTwinTab';
import DNATab from '../components/DNATab';
import EmergencySOSTab from '../components/EmergencySOSTab';
import HealthTrackerTab from '../components/HealthTrackerTab';
import InsuranceTab from '../components/InsuranceTab';
import LostPetAlertTab from '../components/LostPetAlertTab';
import MemoriesTab from '../components/MemoriesTab';
import NearbyServicesTab from '../components/NearbyServicesTab';
import NotificationsPanel from '../components/NotificationsPanel';
import PetChallengesTab from '../components/PetChallengesTab';
import PetDietPlannerTab from '../components/PetDietPlannerTab';
import PetHealthPassportTab from '../components/PetHealthPassportTab';
import PetHoroscopeTab from '../components/PetHoroscopeTab';
import PetJournalTab from '../components/PetJournalTab';
import PetLocationDiscoveryTab from '../components/PetLocationDiscoveryTab';
import PetMemoryGalleryTab from '../components/PetMemoryGalleryTab';
import PlaydatesTab from '../components/PlaydatesTab';
import RewardsTab from '../components/RewardsTab';
import SmartCollarTab from '../components/SmartCollarTab';
import SmartHydrationTab from '../components/SmartHydrationTab';
import SmartWeightTab from '../components/SmartWeightTab';
import SubscriptionTab from '../components/SubscriptionTab';
import VirtualPetCompanionTab from '../components/VirtualPetCompanionTab';
import WellnessCoachTab from '../components/WellnessCoachTab';
import WishlistTab from '../components/WishlistTab';
import DashboardAIChat from '../components/DashboardAIChat';
import AuraScannerTab from '../components/AuraScannerTab';
import VoiceMemoriesTab from '../components/VoiceMemoriesTab';
import DestinyInsightsTab from '../components/DestinyInsightsTab';
import StressDetectorTab from '../components/StressDetectorTab';
import EnergyForecastTab from '../components/EnergyForecastTab';
import TimeCapsuleTab from '../components/TimeCapsuleTab';
import RelationshipMapTab from '../components/RelationshipMapTab';
import { AILifeScorePanel, WellnessUniversePanel, EmotionAvatarPanel, HealthOrbitPanel, LegacyVaultPanel, EnergyReactorPanel } from '../components/OwnerFuturisticPanels';
import { EmotionMirrorPanel, HappinessOceanPanel, SafetyBubblePanel, CalendarGalaxyPanel, CompatibilityMatcherPanel } from '../components/OwnerExclusivePanels';
import { SixthSensePanel, EnergyForestPanel, ComfortIndexPanel, MicroEmotionPanel, FamilyTreePanel } from '../components/OwnerAdvancedPanels';
import { PetEmotionWeatherPanel, SmartPresenceSensorPanel, HealingFrequencyEnginePanel, PetStarMapPanel, MicroHabitAnalyzerPanel, SafeEnergyZonesPanel, FutureMemoryGeneratorPanel, ComfortWavesPanel, AdventureEnginePanel, EmotionCrystalPanel } from '../components/OwnerElitePanels2';
import { UniversalExperienceDNAPanel, DigitalEmotionStreamPanel, AIBehaviorWavesPanel, GlobalWellnessNetworkPanel, AIInsightNebulaPanel, ExperienceResonanceEnginePanel, RealtimeActivityCosmosPanel, PetcareSyncFieldPanel, FutureWellnessOraclePanel, QuantumIntelligenceSpherePanel } from '../components/CrossDashboardElitePanels';
import PetHealthCreditPanel from '../components/PetHealthCreditPanel';
import PetExpensePlannerPanel from '../components/PetExpensePlannerPanel';
import { SmartLostPetRescuePanel } from '../components/OwnerInnovativePanels';
import {
  DigitalPetPassportPanel,
  DisasterRescuePanel,
  PetBloodDonorNetworkPanel,
  AILifelongCompanionPanel,
  SmartPetCityPanel
} from '../components/CrossInnovativePanels';


const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';

const MAIN_MENU = [
  { key: 'home',       label: 'Home',              icon: LayoutDashboard },
  { key: 'activity',   label: 'Activity Tracker',  icon: Activity },
  { key: 'mood',       label: 'AI Mood Detection', icon: Brain },
  { key: 'health',     label: 'Health Tracker',    icon: Heart },
  { key: 'diet',       label: 'Diet Planner',      icon: Sparkles },
  { key: 'weight',     label: 'Weight Tracker',    icon: TrendingUp },
  { key: 'hydration',  label: 'Hydration Tracker', icon: Droplets },
  { key: 'passport',   label: 'Health Passport',   icon: FileText },
  { key: 'emergency',  label: 'Emergency SOS',     icon: AlertCircle },
  { key: 'collar',     label: 'Smart Collar',      icon: Shield },
  { key: 'geofence',   label: 'Geofence Zones',    icon: MapPin },
  { key: 'location',   label: 'Pet Locations',     icon: Navigation },
  { key: 'lost',       label: 'Lost Pet Alert',    icon: AlertCircle },
  { key: 'services',   label: 'Nearby Services',   icon: MapPin },
  { key: 'grooming',   label: 'AI Grooming',       icon: Star },
  { key: 'translate',  label: 'AI Translator',     icon: MessageSquare },
  { key: 'companion',  label: 'Virtual Companion', icon: PawPrint },
  { key: 'twin',       label: 'Digital Twin',      icon: Zap },
  { key: 'dna',        label: 'DNA & Genomics',    icon: Brain },
  { key: 'insurance',  label: 'Insurance',         icon: Shield },
  { key: 'marketplace',label: 'Marketplace',       icon: ShoppingCart },
  { key: 'wishlist',   label: 'Wishlist',          icon: Heart },
  { key: 'rewards',    label: 'Paw Points',        icon: Star },
  { key: 'challenges', label: 'Pet Challenges',    icon: Zap },
  { key: 'community',  label: 'Community',         icon: MessageSquare },
  { key: 'playdates',  label: 'Playdates',         icon: PawPrint },
  { key: 'horoscope',  label: 'Pet Horoscope',     icon: Sparkles },
  { key: 'journal',    label: 'Pet Journal',       icon: FileText },
  { key: 'memories',   label: 'Memories',          icon: Camera },
  { key: 'gallery',    label: 'Memory Gallery',    icon: Camera },
  { key: 'wellness',   label: 'Wellness Coach',    icon: Heart },
  { key: 'bond',       label: 'Bond Analyzer',     icon: Heart },
  { key: 'lifespan',   label: 'Life Expectancy',   icon: TrendingUp },
  { key: 'personality',label: 'Personality AI',    icon: Brain },
  { key: 'pred-sos',   label: 'Predictive Emergency', icon: AlertCircle },
  { key: 'knowledge',  label: 'Knowledge Galaxy',  icon: Sparkles },
  { key: 'seasonal',   label: 'Seasonal Wellness', icon: Activity },
  { key: 'voice',      label: 'Voice Commands',    icon: Mic },
  { key: 'travel',     label: 'Pet Travel Planner',icon: Navigation },
  { key: 'eco',        label: 'Sustainability',    icon: Sparkles },
  { key: 'subscription',label: 'Subscription',    icon: Star },
  { key: 'notifications',label: 'Notifications',  icon: Bell },
  // ── New AI features ──
  { key: 'aura',         label: 'Aura Scanner',      icon: Sparkles },
  { key: 'voice-mem',    label: 'Voice Memories',    icon: Mic },
  { key: 'destiny',      label: 'Destiny Insights',  icon: TrendingUp },
  { key: 'stress',       label: 'Stress Detector',   icon: AlertCircle },
  { key: 'energy',       label: 'Energy Forecast',   icon: Zap },
  { key: 'capsule',      label: 'Time Capsule',       icon: Camera },
  { key: 'relmap',       label: 'Relationship Map',   icon: MessageSquare },
  // ── Futuristic AI ──
  { key: 'lifescore',    label: 'AI Life Score',       icon: Sparkles },
  { key: 'universe',     label: 'Wellness Universe',   icon: Star },
  { key: 'avatar',       label: 'Emotion Avatar',      icon: Brain },
  { key: 'orbit',        label: 'Health Orbit',        icon: Activity },
  { key: 'legacy',       label: 'Legacy Vault',        icon: Camera },
  { key: 'reactor',      label: 'Energy Reactor',      icon: Zap },
  // ── Exclusive ──
  { key: 'emotion-mirror', label: 'Emotion Mirror',     icon: Sparkles },
  { key: 'happiness',    label: 'Happiness Ocean',      icon: Activity },
  { key: 'safety',       label: 'Safety Bubble',        icon: AlertCircle },
  { key: 'cal-galaxy',   label: 'Calendar Galaxy',      icon: Star },
  { key: 'pet-match',    label: 'Compatibility Match',  icon: Heart },
  // ── Advanced ──
  { key: 'sixth-sense',  label: 'Sixth Sense Engine',   icon: Sparkles },
  { key: 'forest',       label: 'Energy Forest',        icon: Leaf },
  { key: 'comfort',      label: 'Comfort Index',        icon: Star },
  { key: 'micro-emo',    label: 'Micro-Emotions',       icon: Activity },
  { key: 'family-tree',  label: 'Family Tree',          icon: Users },
  // ── Elite 2.0 Owner Features ──
  { key: 'emotion-weather', label: 'Emotion Weather',      icon: Sparkles },
  { key: 'presence-sensor',label: 'Presence Sensor',       icon: Activity },
  { key: 'healing-freq',    label: 'Healing Frequency',    icon: Zap },
  { key: 'star-map',        label: 'Pet Star Map',          icon: Star },
  { key: 'micro-habit',     label: 'Micro-Habit Analyzer', icon: Brain },
  { key: 'safe-zones',      label: 'Safe Energy Zones',    icon: Shield },
  { key: 'future-memory',   label: 'Future Memory AI',     icon: Camera },
  { key: 'comfort-waves',   label: 'Comfort Waves',        icon: Heart },
  { key: 'adventure',       label: 'Adventure Engine',     icon: Navigation },
  { key: 'emotion-crystal', label: 'Emotion Crystal',      icon: Sparkles },
  // ── Cross-Dashboard ──
  { key: 'universal-dna',   label: 'Universal Experience DNA',  icon: Brain },
  { key: 'emotion-stream',  label: 'Digital Emotion Stream',    icon: MessageSquare },
  { key: 'behavior-waves',  label: 'AI Behavior Waves',         icon: Activity },
  { key: 'wellness-network',label: 'Global Wellness Network',   icon: Globe },
  { key: 'insight-nebula',  label: 'AI Insight Nebula',         icon: Sparkles },
  { key: 'resonance',       label: 'Resonance Engine',          icon: Zap },
  { key: 'activity-cosmos', label: 'Activity Cosmos',           icon: Star },
  { key: 'sync-field',      label: 'Sync Field',                icon: Shield },
  { key: 'wellness-oracle', label: 'Wellness Oracle',           icon: TrendingUp },
  { key: 'quantum-sphere',  label: 'Quantum AI Sphere',         icon: Brain },
  // ── Innovative Features ──
  { key: 'pet-health-credit', label: 'Pet Health Credit',       icon: Shield },
  { key: 'lost-pet-rescue', label: 'Lost Pet Rescue Network',   icon: AlertCircle },
  { key: 'expense-planner', label: 'Pet Expense Planner',       icon: TrendingUp },
  { key: 'digital-passport', label: 'Digital Pet Passport',     icon: Globe },
  { key: 'disaster-rescue', label: 'Disaster Rescue System',   icon: AlertCircle },
  { key: 'blood-donor',     label: 'Blood Donor Network',       icon: Heart },
  { key: 'lifelong-companion', label: 'Lifelong Companion',     icon: Brain },
  { key: 'smart-city',      label: 'Smart Pet City',            icon: MapPin },
];

const ACCOUNT_MENU = [
  { key: 'profile',    label: 'My Profile',        icon: User },
];

// ── Sidebar ────────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, onLogout, petName }) => {
  const allItems = [...MAIN_MENU, ...ACCOUNT_MENU];
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col shadow-xl flex-shrink-0">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GRAD }}>
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-base leading-none text-transparent bg-clip-text" style={{ backgroundImage: GRAD }}>PetCare AI</p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">{petName || 'Pet Owner'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">My Dashboard</p>
        {allItems.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button key={key} onClick={() => setActive(key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isActive ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
              style={isActive ? { background: GRAD, boxShadow: '0 4px 14px rgba(99,102,241,0.3)' } : {}}>
              <Icon className="flex-shrink-0" style={{ width: 16, height: 16, color: isActive ? '#fff' : undefined }} />
              <span className="flex-1 text-left text-xs">{label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5 border-t border-slate-100 pt-3">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all">
          <LogOut style={{ width: 18, height: 18 }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

// ── Home Panel ─────────────────────────────────────────────────────────────────
const HomePanel = ({ petName, ownerName, setActive }) => {
  const read = () => ({
    walks:   JSON.parse(localStorage.getItem('petWalks')         || '[]'),
    appts:   JSON.parse(localStorage.getItem('ownerAppts')       || '[]'),
    rxs:     JSON.parse(localStorage.getItem('allPrescriptions') || '[]'),
    records: JSON.parse(localStorage.getItem('medicalRecords')   || '[]'),
  });

  const [liveData, setLiveData] = useState(read);
  useEffect(() => {
    const handler = () => setLiveData(read());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const { walks, appts, rxs, records } = liveData;
  const today = new Date().toLocaleDateString('en-CA');
  const todayAppts = appts.filter(a => a.date === today);

  const QUICK = [
    { label: 'Emergency SOS', icon: '🚨', key: 'emergency', color: '#ef4444' },
    { label: 'Book Appointment', icon: '📅', key: 'services', color: '#6366f1' },
    { label: 'AI Mood Check', icon: '🧠', key: 'mood', color: '#8b5cf6' },
    { label: 'Health Tracker', icon: '❤️', key: 'health', color: '#10b981' },
    { label: 'Diet Planner', icon: '🍗', key: 'diet', color: '#f59e0b' },
    { label: 'Marketplace', icon: '🛒', key: 'marketplace', color: '#14b8a6' },
  ];

  const handleRxClick = () => {
    localStorage.setItem('passportActiveSection', 'prescriptions');
    setActive('passport');
  };

  const handleRecordClick = () => {
    localStorage.setItem('passportActiveSection', 'records');
    setActive('passport');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: GRAD }}>
        <div className="absolute -right-8 -top-8 opacity-10 text-[160px]">🐾</div>
        <p className="text-indigo-200 text-sm font-bold">Welcome back,</p>
        <h2 className="text-3xl font-black mt-0.5">{ownerName || 'Pet Owner'} 👋</h2>
        <p className="text-indigo-100 text-sm mt-1">{petName} is waiting for you today!</p>
        <div className="flex gap-6 mt-4">
          {[['Walks This Week', walks.length], ['Today\'s Appts', todayAppts.length], ['Prescriptions', rxs.length], ['Health Records', records.length]].map(([l, v]) => (
            <div key={l}><p className="text-xl font-extrabold">{v}</p><p className="text-xs text-indigo-200">{l}</p></div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {QUICK.map(q => (
          <motion.button key={q.key} whileHover={{ scale: 1.05 }} onClick={() => setActive(q.key)}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col items-center gap-2 hover:border-indigo-200 transition">
            <span className="text-2xl">{q.icon}</span>
            <span className="text-[10px] font-bold text-slate-600 text-center">{q.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Today's appointments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="font-extrabold text-slate-800 mb-3">📅 Today's Appointments</p>
        {todayAppts.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">No appointments today. <button onClick={() => setActive('cal-galaxy')} className="text-indigo-500 font-bold hover:underline">Book or View Calendar →</button></p>
        ) : (
          <div className="space-y-2">
            {todayAppts.map((a, i) => (
              <div key={i} onClick={() => setActive('cal-galaxy')}
                className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl cursor-pointer hover:bg-indigo-100/50 transition">
                <span className="text-xl">🏥</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-800">{a.vet || 'Veterinarian'}</p>
                  <p className="text-xs text-slate-500">{a.time} · {a.type || a.reason || 'General Checkup'}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 capitalize">{a.status || 'confirmed'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent prescriptions */}
      {rxs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="font-extrabold text-slate-800">💊 Recent Prescriptions</p>
            <button onClick={handleRxClick} className="text-xs font-bold text-indigo-600 hover:underline">View All →</button>
          </div>
          <div className="space-y-2">
            {rxs.slice(0, 3).map((r, i) => (
              <div key={i} onClick={handleRxClick}
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                <span className="text-xl">💊</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-800">{r.medication || r.medicine || r.name}</p>
                  <p className="text-xs text-slate-500">{r.dose || r.dosage || ''} · {r.days ? `${r.days} days` : r.duration || ''}</p>
                </div>
                <span className="text-xs text-slate-400">{r.date || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent health records */}
      {records.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="font-extrabold text-slate-800">📋 Health Records</p>
            <button onClick={handleRecordClick} className="text-xs font-bold text-emerald-600 hover:underline">View All →</button>
          </div>
          <div className="space-y-2">
            {records.slice(0, 3).map((r, i) => (
              <div key={i} onClick={handleRecordClick}
                className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl cursor-pointer hover:bg-emerald-100/60 transition">
                <span className="text-xl">📋</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-800">{r.diagnosis || r.type || 'Medical Record'}</p>
                  <p className="text-xs text-slate-500">{r.vet || 'Veterinarian'} · {r.date || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Profile Panel ──────────────────────────────────────────────────────────────
const ProfilePanel = () => {
  const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const pets  = JSON.parse(localStorage.getItem('ownerPets')  || '[]');
  const appts = JSON.parse(localStorage.getItem('ownerAppts') || '[]');
  const walks = JSON.parse(localStorage.getItem('petWalks')   || '[]');

  const [editing, setEditing] = React.useState(false);
  const [saved,   setSaved]   = React.useState(false);
  const [form, setForm] = React.useState({
    name:     savedUser.name     || '',
    email:    savedUser.email    || '',
    phone:    savedUser.phone    || '',
    location: savedUser.location || '',
    bio:      savedUser.bio      || '',
  });

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    const updated = { ...savedUser, ...form };
    localStorage.setItem('currentUser', JSON.stringify(updated));
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const FIELDS = [
    { key:'name',     label:'Full Name',      icon:'👤', placeholder:'Your full name',        type:'text' },
    { key:'email',    label:'Email Address',  icon:'📧', placeholder:'your@email.com',        type:'email' },
    { key:'phone',    label:'Phone Number',   icon:'📱', placeholder:'+91 98765 43210',       type:'tel' },
    { key:'location', label:'Location',       icon:'📍', placeholder:'City, Country',         type:'text' },
    { key:'bio',      label:'About Me',       icon:'✏️', placeholder:'Tell us about yourself', type:'text' },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible">
        {/* Banner */}
        <div className="h-24 rounded-t-2xl relative" style={{ background: GRAD }}>
          <div className="absolute inset-0 rounded-t-2xl opacity-20"
            style={{ background: 'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.1) 20px,rgba(255,255,255,0.1) 21px)' }} />
        </div>
        {/* Info row — sits below banner, no overlap */}
        <div className="px-6 pt-4 pb-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0"
              style={{ background: GRAD }}>
              {(form.name || 'U')[0].toUpperCase()}
            </div>
            {/* Name / email */}
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">{form.name || 'Pet Owner'}</h2>
              <p className="text-slate-500 text-sm mt-0.5">{form.email || 'No email set'}</p>
              {form.location && <p className="text-slate-400 text-xs mt-0.5">📍 {form.location}</p>}
              <span className="mt-1.5 inline-block px-3 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full">OWNER</span>
            </div>
          </div>
          <button onClick={() => setEditing(e => !e)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl border transition ${editing ? 'bg-slate-100 border-slate-200 text-slate-600' : 'text-white border-transparent'}`}
            style={!editing ? { background: GRAD } : {}}>
            {editing ? '✕ Cancel' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[['My Pets', pets.length, '🐾'], ['Appointments', appts.length, '📅'], ['Walks Logged', walks.length, '🚶']].map(([l, v, e]) => (
          <div key={l} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-xl mb-0.5">{e}</p>
            <p className="text-2xl font-extrabold text-slate-900">{v}</p>
            <p className="text-xs text-slate-400 mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* Edit / View Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="font-extrabold text-slate-800 text-base">
            {editing ? '✏️ Edit Profile Information' : '👤 Profile Information'}
          </p>
          {saved && (
            <motion.span initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
              className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
              ✅ Saved successfully!
            </motion.span>
          )}
        </div>

        <div className="space-y-4">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                {f.icon} {f.label}
              </label>
              {editing ? (
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                />
              ) : (
                <p className={`px-4 py-2.5 rounded-xl bg-slate-50 text-sm font-medium ${form[f.key] ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                  {form[f.key] || `Not set — click Edit to add`}
                </p>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <motion.button initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
            onClick={handleSave}
            className="mt-6 w-full py-3 text-white font-extrabold rounded-xl text-sm transition hover:-translate-y-0.5"
            style={{ background: GRAD }}>
            💾 Save Changes
          </motion.button>
        )}
      </div>

      {/* My Pets */}
      {pets.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="font-extrabold text-slate-800 mb-3">🐾 My Registered Pets</p>
          <div className="space-y-2">
            {pets.map((p, i) => (
              <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.07 }}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xl">{p.type === 'cat' ? '🐱' : p.type === 'bird' ? '🦜' : '🐕'}</span>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.breed} · {p.age} yrs · {p.weight || '—'} kg</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{p.gender || 'Pet'}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5">
        <p className="font-extrabold text-rose-600 mb-3 text-sm">⚠️ Account</p>
        <button onClick={() => {
          ['token','role','userId','userEmail','currentUser'].forEach(k => localStorage.removeItem(k));
          window.location.href = '/login';
        }} className="px-5 py-2 text-sm font-bold text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 transition">
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [chatOpen, setChatOpen]   = useState(false);

  // Seed shared data on first load
  useEffect(() => { db.seed(); }, []);

  // Live-reactive user/pet context — updates when any dashboard writes to localStorage
  const [userCtx, setUserCtx] = useState(() => ({
    currentUser: JSON.parse(localStorage.getItem('currentUser') || '{}'),
    ownerPets:   JSON.parse(localStorage.getItem('ownerPets')   || '[]'),
  }));
  useEffect(() => {
    const handler = () => setUserCtx({
      currentUser: JSON.parse(localStorage.getItem('currentUser') || '{}'),
      ownerPets:   JSON.parse(localStorage.getItem('ownerPets')   || '[]'),
    });
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const { currentUser, ownerPets } = userCtx;
  const petName   = ownerPets[0]?.name || 'Your Pet';
  const ownerName = currentUser.name   || 'Owner';

  const handleLogout = () => {
    ['token','role','userId','userEmail','currentUser'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  const checkUserStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (res.data.fullName && res.data.fullName !== currentUser.name) {
        currentUser.name = res.data.fullName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!localStorage.getItem('token') || role === 'VET' || role === 'ADMIN') {
      navigate('/login');
      return;
    }
    checkUserStatus();
    const interval = setInterval(checkUserStatus, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  const renderContent = (active) => {
    if (active === 'home')       return <HomePanel petName={petName} ownerName={ownerName} setActive={setActiveTab} />;
    if (active === 'activity')   return <ActivityTrackerTab />;
    if (active === 'mood')       return <AIMoodDetectionTab />;
    if (active === 'health')     return <HealthTrackerTab />;
    if (active === 'diet')       return <PetDietPlannerTab />;
    if (active === 'weight')     return <SmartWeightTab />;
    if (active === 'hydration')  return <SmartHydrationTab />;
    if (active === 'passport')   return <PetHealthPassportTab />;
    if (active === 'emergency')  return <EmergencySOSTab />;
    if (active === 'collar')     return <SmartCollarTab />;
    if (active === 'geofence')   return <GeoFenceTab />;
    if (active === 'location')   return <PetLocationDiscoveryTab />;
    if (active === 'lost')       return <LostPetAlertTab />;
    if (active === 'services')   return <NearbyServicesTab />;
    if (active === 'grooming')   return <AIGroomingTab />;
    if (active === 'translate')  return <AITranslatorTab />;
    if (active === 'companion')  return <VirtualPetCompanionTab />;
    if (active === 'twin')       return <DigitalTwinTab />;
    if (active === 'dna')        return <DNATab />;
    if (active === 'insurance')  return <InsuranceTab />;
    if (active === 'marketplace')return <Marketplace insideDashboard />;
    if (active === 'wishlist')   return <WishlistTab />;
    if (active === 'rewards')    return <RewardsTab />;
    if (active === 'challenges') return <PetChallengesTab />;
    if (active === 'community')  return <CommunityFeedTab />;
    if (active === 'playdates')  return <PlaydatesTab />;
    if (active === 'horoscope')  return <PetHoroscopeTab />;
    if (active === 'journal')    return <PetJournalTab />;
    if (active === 'memories')   return <MemoriesTab />;
    if (active === 'gallery')    return <PetMemoryGalleryTab />;
    if (active === 'wellness')   return <WellnessCoachTab />;
    if (active === 'bond')       return <AIBondAnalyzerTab />;
    if (active === 'lifespan')   return <LifeExpectancyTab />;
    if (active === 'personality')return <PetPersonalityTab />;
    if (active === 'pred-sos')   return <PredictiveEmergencyTab />;
    if (active === 'knowledge')  return <KnowledgeGalaxyTab />;
    if (active === 'seasonal')   return <SeasonalWellnessTab />;
    if (active === 'voice')      return <VoiceCommandTab />;
    if (active === 'travel')     return <PetTravelTab />;
    if (active === 'eco')        return <SustainabilityTab />;
    if (active === 'subscription')return <SubscriptionTab />;
    if (active === 'notifications')return <NotificationsPanel setActive={setActiveTab} />;
    if (active === 'aura')         return <AuraScannerTab />;
    if (active === 'voice-mem')    return <VoiceMemoriesTab />;
    if (active === 'destiny')      return <DestinyInsightsTab />;
    if (active === 'stress')       return <StressDetectorTab />;
    if (active === 'energy')       return <EnergyForecastTab />;
    if (active === 'capsule')      return <TimeCapsuleTab />;
    if (active === 'relmap')       return <RelationshipMapTab />;
    if (active === 'lifescore')    return <AILifeScorePanel />;
    if (active === 'universe')     return <WellnessUniversePanel />;
    if (active === 'avatar')       return <EmotionAvatarPanel />;
    if (active === 'orbit')        return <HealthOrbitPanel />;
    if (active === 'legacy')       return <LegacyVaultPanel />;
    if (active === 'reactor')      return <EnergyReactorPanel />;
    if (active === 'emotion-mirror') return <EmotionMirrorPanel />;
    if (active === 'happiness')    return <HappinessOceanPanel />;
    if (active === 'safety')       return <SafetyBubblePanel />;
    if (active === 'cal-galaxy')   return <CalendarGalaxyPanel />;
    if (active === 'pet-match')    return <CompatibilityMatcherPanel />;
    if (active === 'sixth-sense')  return <SixthSensePanel />;
    if (active === 'forest')       return <EnergyForestPanel />;
    if (active === 'comfort')      return <ComfortIndexPanel />;
    if (active === 'micro-emo')    return <MicroEmotionPanel />;
    if (active === 'family-tree')  return <FamilyTreePanel />;
    if (active === 'emotion-weather') return <PetEmotionWeatherPanel />;
    if (active === 'presence-sensor') return <SmartPresenceSensorPanel />;
    if (active === 'healing-freq')    return <HealingFrequencyEnginePanel />;
    if (active === 'star-map')        return <PetStarMapPanel />;
    if (active === 'micro-habit')     return <MicroHabitAnalyzerPanel />;
    if (active === 'safe-zones')      return <SafeEnergyZonesPanel />;
    if (active === 'future-memory')   return <FutureMemoryGeneratorPanel />;
    if (active === 'comfort-waves')   return <ComfortWavesPanel />;
    if (active === 'adventure')       return <AdventureEnginePanel />;
    if (active === 'emotion-crystal') return <EmotionCrystalPanel />;
    if (active === 'universal-dna')   return <UniversalExperienceDNAPanel />;
    if (active === 'emotion-stream')  return <DigitalEmotionStreamPanel />;
    if (active === 'behavior-waves')  return <AIBehaviorWavesPanel />;
    if (active === 'wellness-network')return <GlobalWellnessNetworkPanel />;
    if (active === 'insight-nebula')  return <AIInsightNebulaPanel />;
    if (active === 'resonance')       return <ExperienceResonanceEnginePanel />;
    if (active === 'activity-cosmos') return <RealtimeActivityCosmosPanel />;
    if (active === 'sync-field')      return <PetcareSyncFieldPanel />;
    if (active === 'wellness-oracle') return <FutureWellnessOraclePanel />;
    if (active === 'quantum-sphere')  return <QuantumIntelligenceSpherePanel />;
    if (active === 'pet-health-credit') return <PetHealthCreditPanel />;
    if (active === 'lost-pet-rescue') return <SmartLostPetRescuePanel />;
    if (active === 'expense-planner') return <PetExpensePlannerPanel />;
    if (active === 'digital-passport') return <DigitalPetPassportPanel />;
    if (active === 'disaster-rescue') return <DisasterRescuePanel />;
    if (active === 'blood-donor') return <PetBloodDonorNetworkPanel />;
    if (active === 'lifelong-companion') return <AILifelongCompanionPanel />;
    if (active === 'smart-city') return <SmartPetCityPanel />;
    if (active === 'profile')    return <ProfilePanel />;
    return null;
  };

  const TITLES = {
    home:'Dashboard', activity:'Activity Tracker', mood:'AI Mood Detection',
    health:'Health Tracker', diet:'AI Diet Planner', weight:'Weight Tracker',
    hydration:'Hydration Tracker', passport:'Health Passport', emergency:'Emergency SOS',
    collar:'Smart Collar', geofence:'Geofence Zones', location:'Pet Locations',
    lost:'Lost Pet Alert', services:'Nearby Services', grooming:'AI Grooming',
    translate:'AI Pet Translator', companion:'Virtual Companion', twin:'Digital Twin',
    dna:'DNA & Genomics', insurance:'Insurance', marketplace:'Marketplace',
    wishlist:'Wishlist', rewards:'Paw Points & Rewards', challenges:'Pet Challenges',
    community:'Community Feed', playdates:'Playdates', horoscope:'Pet Horoscope',
    journal:'Pet Journal', memories:'Memories', gallery:'Memory Gallery',
    wellness:'Wellness Coach', bond:'Bond Analyzer', lifespan:'Life Expectancy',
    personality:'Personality AI', 'pred-sos':'Predictive Emergency',
    knowledge:'Knowledge Galaxy', seasonal:'Seasonal Wellness',
    voice:'Voice Commands', travel:'Pet Travel Planner', eco:'Sustainability',
    subscription:'Subscription', notifications:'Notifications', profile:'My Profile',
    aura:'Aura Scanner', 'voice-mem':'Voice Memories', destiny:'Destiny Insights',
    stress:'Stress Detector', energy:'Energy Forecast', capsule:'Time Capsule', relmap:'Relationship Map',
    lifescore:'AI Life Score', universe:'Wellness Universe', avatar:'Emotion Avatar',
    orbit:'Health Orbit', legacy:'Legacy Vault', reactor:'Energy Reactor',
    'emotion-mirror':'Emotion Mirror', happiness:'Happiness Ocean', safety:'Safety Bubble',
    'cal-galaxy':'Calendar Galaxy', 'pet-match':'Compatibility Matcher',
    'sixth-sense':'Sixth Sense Engine', forest:'Energy Forest', comfort:'Comfort Index',
    'micro-emo':'Micro-Emotions', 'family-tree':'Family Tree',
    'pet-health-credit':'AI Pet Health Credit Score',
    'lost-pet-rescue':'Smart Lost Pet Rescue Network',
    'expense-planner':'AI Pet Expense Planner',
    'digital-passport':'Digital Pet Passport',
    'disaster-rescue':'Disaster Rescue System',
    'blood-donor':'Blood Donor Network',
    'lifelong-companion':'AI Lifelong Companion',
    'smart-city':'Smart Pet City Ecosystem',
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active={activeTab} setActive={setActiveTab} onLogout={handleLogout} petName={petName} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">🐾 Pet Owner Portal</p>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text" style={{ backgroundImage: GRAD }}>
              {TITLES[activeTab] || activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('notifications')} className="relative p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 transition">
              <Bell className="w-5 h-5 text-slate-500" />
            </button>
            <button onClick={() => setChatOpen(o => !o)} className="flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-xl shadow" style={{ background: GRAD }}>
              🤖 AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              title="My Profile"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-transparent hover:ring-indigo-400 hover:scale-110 transition-all"
              style={{ background: GRAD }}>
              {ownerName[0]}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}>
              {renderContent(activeTab)}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI Chat */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
            className="fixed right-6 bottom-6 z-50 w-96 shadow-2xl rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: GRAD }}>
              <span className="font-bold">🤖 PetCare AI Assistant</span>
              <button onClick={() => setChatOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <DashboardAIChat role="owner" petName={petName} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
