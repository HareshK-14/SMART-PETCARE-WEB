```
 ____                       _     ____      _      ____
/ ___| _ __ ___   __ _ _ __| |_  |  _ \ ___| |_   / ___|__ _ _ __ ___
\___ \| '_ ` _ \ / _` | '__| __| | |_) / _ \ __| | |   / _` | '__/ _ \
 ___) | | | | | | (_| | |  | |_  |  __/  __/ |_  | |__| (_| | | |  __/
|____/|_| |_| |_|\__,_|_|   \__| |_|   \___|\__|  \____\__,_|_|  \___|
```

## Smart Pet Care Platform

**AI-Assisted · Full-Stack · Vet-Friendly**

[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-API-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Node.js](https://img.shields.io/badge/Node.js-Auth_Server-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://smart-petcare-web.vercel.app)
[![Gemini](https://img.shields.io/badge/Gemini_API-AI_Layer-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev)

> **Smart Pet Care Platform** helps pet owners and veterinarians manage pet health together — AI-assisted symptom checks, appointment scheduling, vaccination tracking, and role-based portals, all in one connected web app.

🔗 **Live Demo:** [smart-petcare-web.vercel.app](https://smart-petcare-web.vercel.app)

[📖 Docs](docs/) · [🚀 Quick Start](#-quick-start) · [🎯 Features](#-key-features) · [🏗️ Architecture](#%EF%B8%8F-system-architecture)

---

## 📑 Table of Contents

| Core Sections | Technical | Resources |
|---|---|---|
| [🎯 Key Features](#-key-features) | [🏗️ System Architecture](#%EF%B8%8F-system-architecture) | [📁 Project Structure](#-project-structure) |
| [🆚 Why This Platform?](#-why-this-platform) | [🗄️ Database Schema](#%EF%B8%8F-database-schema) | [🚀 Quick Start](#-quick-start) |
| [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) | [🔐 Auth & Tunneling](#-auth--tunneling) | [🗺️ Roadmap](#%EF%B8%8F-roadmap) |

---

## 🎯 Key Features

| Feature | Description |
|---|---|
| 🐾 **Pet Profiles** | Centralized records for each pet — breed, age, medical notes |
| 💬 **AI Symptom Checker** | Chat-based triage that reads symptoms and suggests likely concerns before a vet visit |
| 📅 **Appointment Booking & Reminders** | Owners book vet slots; automatic reminders keep visits from being missed |
| 👩‍⚕️ **Vet & Owner Portals** | Separate role-based dashboards — vets manage patients, owners manage their pets |
| 💉 **Vaccination & Medical Record Tracker** | Full vaccination history and medical event log per pet, visible to both owner and vet |
| 📊 **Vitals & Wellness Logs** | Track weight, activity, and feeding trends over time |
| 🔐 **Authenticated Access** | Dedicated auth server issues and validates sessions for owners and vets |
| 🌐 **Live Deployment** | Publicly accessible at [smart-petcare-web.vercel.app](https://smart-petcare-web.vercel.app) |

---

## 🆚 Why This Platform?

| Capability | Typical Pet App | **Smart Pet Care Platform** |
|---|---|---|
| Symptom Guidance | None | 💬 AI-assisted symptom checker |
| Vet Communication | Phone/walk-in only | 📅 Integrated booking + reminders |
| Medical History | Scattered paper records | 💉 Centralized vaccination/medical tracker |
| Access Model | Single-user | 👩‍⚕️ Owner + Vet role-based portals |
| Data Ownership | Ad-hoc | 🗄️ Relational PostgreSQL store |

---

## 🏗️ System Architecture

```mermaid
graph TB
    A[🖥️ React Frontend - Vercel] --> B[🔐 Node/Express Auth Server]
    A --> C[☕ Spring Boot REST API]
    B --> C
    C --> D[🗄️ PostgreSQL Database]
    C --> E[💬 AI Symptom Checker]
    C --> F[📅 Appointment & Reminder Service]
    C --> G[💉 Vaccination Record Service]

    style A fill:#61DAFB
    style B fill:#339933
    style C fill:#6DB33F
    style D fill:#336791
    style E fill:#8E75B2
```

*The React frontend (deployed on Vercel) talks to a Node/Express auth layer for login/session handling, and to the Spring Boot API for pets, appointments, records, and AI features — all backed by PostgreSQL.*

---

## 🗄️ Database Schema

The schema and seed data live in [`database/schema.sql`](database/schema.sql). Core entities include pet profiles, owners, veterinarians, appointments, vaccination/medical records, and wellness logs.

**To initialize locally:**
```sql
-- inside pgAdmin or the psql console
\i database/schema.sql
```

---

## 🔐 Auth & Tunneling

- `auth-server.js` — a lightweight Node/Express server handling login and session validation, with credentials tracked in `auth-users.json` (local/dev use only — never commit real user data here).
- `cloudflared` — used to tunnel the local backend so the Vercel-deployed frontend can reach it during development. See `tunnel.log` / `tunnel-api.log` for recent tunnel sessions.

> ⚠️ For production, replace the file-based auth store with a proper database-backed user table and rotate any tunnel URLs regularly.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (deployed on Vercel) |
| Backend API | Spring Boot (Java) |
| Auth Server | Node.js / Express |
| Database | PostgreSQL |
| AI Layer | Symptom-checking / wellness insight engine (Gemini API) |
| Dev Tunneling | Cloudflare Tunnel (`cloudflared`) |
| Docs | Markdown-based project documentation |

---

## 📁 Project Structure

```
SMART-PETCARE-WEB/
│
├── database/
│   └── schema.sql            Pets · owners · vets · appointments · records
│
├── backend/                  Spring Boot REST API
│   └── src/main/java/...     Controllers · Services · Repositories · Entities
│
├── frontend/                 React web application
│   └── src/                  Components · Pages · Services · Hooks
│
├── docs/                     Project documentation
│
├── auth-server.js            Node/Express auth server (login/session)
├── auth-users.json           Local auth store (dev only)
├── cloudflared.exe           Cloudflare Tunnel binary (dev use)
├── package.json / package-lock.json
└── .vscode/                  Editor settings
```

---

## 🚀 Quick Start

**1 · Clone the repository**
```bash
git clone https://github.com/HareshK-14/SMART-PETCARE-WEB.git
cd SMART-PETCARE-WEB
```

**2 · Set up the database**
```bash
\i database/schema.sql
```

**3 · Run the Spring Boot backend**
```bash
cd backend
./mvnw spring-boot:run
```

**4 · Run the auth server**
```bash
node auth-server.js
```

**5 · Run the frontend**
```bash
cd frontend
npm install
npm run dev
```

**6 · (Optional) Tunnel your local backend for the deployed frontend**
```bash
cloudflared tunnel --url http://localhost:8080
```

---

## 🗺️ Roadmap

| Stage | Status | Description |
|---|---|---|
| 1 | ✅ Done | PostgreSQL schema and seed data |
| 2 | ✅ Done | Spring Boot REST API + Node/Express auth server |
| 3 | ✅ Done | React frontend deployed on Vercel |
| 4 | 🔄 In Progress | AI symptom checker + wellness insights |
| 5 | 🔲 Planned | Appointment reminders (email/SMS) |
| 6 | 🔲 Planned | Vaccination/medical record dashboard polish |
| 7 | 🔲 Planned | Docker Compose for one-command local setup |

---

## 👤 Author

**Haresh K.**
B.Tech Information Technology, V.S.B. Engineering College
[GitHub](https://github.com/HareshK-14) · [Live Demo](https://smart-petcare-web.vercel.app)

---

### ⭐ Star this repo if you find it useful!

Made with 🐾 for pet owners and their vets.
