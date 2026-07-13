/**
 * dataBridge.js
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all shared localStorage keys
 * across Owner, Vet and Admin dashboards.
 *
 * Keys owned here:
 *   ownerPets · ownerAppts · allPrescriptions · medicalRecords
 *   platformEmergencies · ownerOrders · petWalks · petJournals
 *   petHydrationLogs · globalFeed · vetReviews · supportTickets
 *   auditLogs · pendingVets · notifications
 *
 * Usage:
 *   import { db, useSync, logActivity } from '../utils/dataBridge';
 *   const pets = db.get('ownerPets');     // read
 *   db.set('ownerPets', [...]);            // write + broadcast
 *   const { data } = useSync(['ownerPets','ownerAppts']); // live React hook
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';

// ── Default seed data ────────────────────────────────────────

const SEEDS = {
  ownerPets: [
    { id:'p1', name:'Bruno', breed:'Labrador',    age:3, weight:28, gender:'Male',   type:'dog', color:'Golden', dob:'2022-03-10', microchip:'MC-001-BRUNO' },
    { id:'p2', name:'Luna',  breed:'Persian Cat', age:2, weight:4,  gender:'Female', type:'cat', color:'White',  dob:'2023-01-15', microchip:'MC-002-LUNA'  },
  ],

  ownerAppts: [
    { id:'a1', pet:'Bruno', vet:'Dr. Priya', date:'2026-05-22', time:'10:00 AM', reason:'Annual Checkup',  status:'confirmed', vetId:'v1' },
    { id:'a2', pet:'Luna',  vet:'Dr. Arjun', date:'2026-06-01', time:'11:30 AM', reason:'Vaccination',     status:'pending',   vetId:'v2' },
    { id:'a3', pet:'Bruno', vet:'Dr. Priya', date:'2026-06-15', time:'09:00 AM', reason:'Dental Cleaning', status:'pending',   vetId:'v1' },
  ],

  allPrescriptions: [
    { id:'rx1', pet:'Bruno', medication:'Amoxicillin 250mg', dose:'1 tab twice daily', days:7,  vet:'Dr. Priya', date:'2026-05-10', status:'active',    refills:2 },
    { id:'rx2', pet:'Luna',  medication:'Prednisolone 5mg',  dose:'1 tab daily',       days:14, vet:'Dr. Arjun', date:'2026-05-08', status:'active',    refills:1 },
    { id:'rx3', pet:'Bruno', medication:'Flea Control Spot', dose:'Apply monthly',     days:30, vet:'Dr. Priya', date:'2026-04-01', status:'completed', refills:0 },
  ],

  medicalRecords: [
    { id:'mr1', pet:'Bruno', date:'2026-05-10', type:'Checkup',     notes:'Healthy. Weight stable. Minor ear wax.', vet:'Dr. Priya', vitals:{ temp:'38.5°C', hr:'72 bpm',  weight:'28 kg'   } },
    { id:'mr2', pet:'Luna',  date:'2026-05-08', type:'Vaccination', notes:'FVRCP booster administered.',            vet:'Dr. Arjun', vitals:{ temp:'38.2°C', hr:'140 bpm', weight:'4 kg'    } },
    { id:'mr3', pet:'Bruno', date:'2026-04-20', type:'Dental',      notes:'Tartar removed. Teeth clean.',           vet:'Dr. Priya', vitals:{ temp:'38.4°C', hr:'68 bpm',  weight:'27.5 kg' } },
  ],

  platformEmergencies: [
    { id:'e1', pet:'Bruno', owner:'Harish K', issue:'Seizure episode', severity:'high',   status:'resolved', time:'2026-05-18T08:30:00', vetId:'v1', vet:'Dr. Priya' },
    { id:'e2', pet:'Luna',  owner:'Priya M',  issue:'Not eating',      severity:'medium', status:'active',   time:'2026-05-19T14:00:00', vetId:'v2', vet:'Dr. Arjun' },
  ],

  ownerOrders: [
    { id:'o1', item:'Royal Canin Adult 10kg', qty:1, total:2400, status:'delivered', date:'2026-05-18', pet:'Bruno' },
    { id:'o2', item:'Pet Comfort Bed L',      qty:1, total:1800, status:'shipped',   date:'2026-05-19', pet:'Bruno' },
    { id:'o3', item:'Whiskas Tuna 12-Pack',   qty:2, total:960,  status:'pending',   date:'2026-05-19', pet:'Luna'  },
  ],

  petWalks: [
    { id:'w1', pet:'Bruno', date:'2026-05-19', duration:30, distance:2.1, route:'Park Loop',   calories:180 },
    { id:'w2', pet:'Bruno', date:'2026-05-18', duration:25, distance:1.8, route:'Street Walk', calories:150 },
    { id:'w3', pet:'Bruno', date:'2026-05-17', duration:40, distance:3.0, route:'Trail Path',  calories:240 },
  ],

  petJournals: [
    { id:'j1', pet:'Bruno', date:'2026-05-19', mood:'Happy', entry:'Bruno played fetch for 20 mins. Very energetic today!' },
    { id:'j2', pet:'Luna',  date:'2026-05-18', mood:'Calm',  entry:'Luna sat by the window all afternoon, watching birds.'  },
  ],

  petHydrationLogs: [
    { id:'h1', pet:'Bruno', date:'2026-05-19', amount:800, goal:1000, unit:'ml' },
    { id:'h2', pet:'Bruno', date:'2026-05-18', amount:950, goal:1000, unit:'ml' },
    { id:'h3', pet:'Luna',  date:'2026-05-19', amount:220, goal:300,  unit:'ml' },
  ],

  vetReviews: [
    { id:'r1', vet:'Dr. Priya', rating:5, comment:'Excellent care! Bruno recovered quickly.', owner:'Harish K', date:'2026-05-10' },
    { id:'r2', vet:'Dr. Arjun', rating:4, comment:'Very knowledgeable and gentle with Luna.', owner:'Priya M',  date:'2026-05-08' },
    { id:'r3', vet:'Dr. Priya', rating:5, comment:'Always on time and thorough.',              owner:'Kavya R',  date:'2026-04-22' },
  ],

  supportTickets: [
    { id:'t1', user:'Harish K', subject:'App crash on mobile',      status:'open',     priority:'high',   date:'2026-05-19', assignedTo:'Admin' },
    { id:'t2', user:'Priya M',  subject:'Prescription not syncing', status:'resolved', priority:'medium', date:'2026-05-18', assignedTo:'Admin' },
  ],

  auditLogs: [
    { id:'al1', action:'User login',           user:'Harish K', role:'OWNER',  time:'2026-05-19T09:00:00', ip:'192.168.1.10' },
    { id:'al2', action:'Prescription created', user:'Dr. Priya',role:'VET',    time:'2026-05-19T10:30:00', ip:'192.168.1.20' },
    { id:'al3', action:'Emergency flagged',    user:'System',   role:'SYSTEM', time:'2026-05-19T14:00:00', ip:'127.0.0.1'    },
  ],

  pendingVets: [
    { id:'pv1', name:'Dr. Kavya Sharma', specialty:'Dermatology', experience:5, clinic:'PetCare Clinic, Bangalore', status:'pending', date:'2026-05-18' },
    { id:'pv2', name:'Dr. Rohan Mehta',  specialty:'Orthopedics', experience:8, clinic:'Animal Care Centre, Mumbai', status:'pending', date:'2026-05-19' },
  ],

  notifications: [
    { id:'n1', type:'alert',  title:'Vaccination Due — Bruno', body:'Bordetella vaccination is overdue. Please schedule with your vet.', time:'09:00 AM', read:false },
    { id:'n2', type:'health', title:'Health Record Added',     body:'Dr. Priya has added a new clinical note for Bruno after the checkup.', time:'11:30 AM', read:false },
    { id:'n3', type:'order',  title:'Order Shipped 📦',        body:'Pet Comfort Bed L is on its way. Expected delivery: tomorrow.', time:'02:15 PM', read:false },
    { id:'n4', type:'appt',   title:'Appointment Confirmed',   body:'Your appointment with Dr. Priya on May 22 at 10:00 AM is confirmed.', time:'Yesterday', read:true },
  ],

  globalFeed: [],
};

// ── Core db helper ───────────────────────────────────────────

export const db = {
  /**
   * Read a key — returns parsed array/object, never null.
   */
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return Array.isArray(SEEDS[key]) ? [] : (SEEDS[key] ?? {});
      return JSON.parse(raw);
    } catch {
      return Array.isArray(SEEDS[key] ?? []) ? [] : {};
    }
  },

  /**
   * Write a key and fire a storage event so all listeners update.
   */
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('storage'));
  },

  /**
   * Merge an object into an existing array by id field.
   */
  upsert(key, item, idField = 'id') {
    const arr = this.get(key);
    const idx = arr.findIndex(x => x[idField] === item[idField]);
    const next = idx >= 0 ? arr.map((x, i) => i === idx ? { ...x, ...item } : x) : [...arr, item];
    this.set(key, next);
  },

  /**
   * Remove an item from an array by id.
   */
  remove(key, id, idField = 'id') {
    this.set(key, this.get(key).filter(x => x[idField] !== id));
  },

  /**
   * Seed all keys that are missing (first run only).
   * Safe to call multiple times — only writes if key doesn't exist.
   */
  seed() {
    Object.entries(SEEDS).forEach(([key, val]) => {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(val));
      }
    });
  },

  /**
   * Force-reset a single key back to seed data (for dev/testing).
   */
  reset(key) {
    if (SEEDS[key] !== undefined) {
      localStorage.setItem(key, JSON.stringify(SEEDS[key]));
      window.dispatchEvent(new Event('storage'));
    }
  },
};

// ── React hook ───────────────────────────────────────────────

/**
 * useSync(keys, [immediate])
 * Subscribes to storage events and re-reads the given keys.
 * Returns { data } where data[key] is always up to date.
 *
 * Example:
 *   const { data } = useSync(['ownerAppts','allPrescriptions']);
 *   const appts = data.ownerAppts;
 */
export function useSync(keys = [], immediate = true) {
  const read = () => {
    const obj = {};
    keys.forEach(k => { obj[k] = db.get(k); });
    return obj;
  };
  const [data, setData] = useState(read);
  useEffect(() => {
    if (immediate) setData(read());
    const handler = () => setData(read());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []); // eslint-disable-line
  return { data };
}

/**
 * logActivity — cross-dashboard activity feed writer.
 * Alias so old activityFeed.js imports still work if replaced.
 */
export const logActivity = (user, action, icon = '📌', type = 'info') => {
  const feed = db.get('globalFeed');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const next = [{ id: Date.now(), time, user, action, icon, type }, ...feed].slice(0, 50);
  db.set('globalFeed', next);
};

// Auto-seed on import (runs once when the module is first loaded)
db.seed();
