<div align="center">

# AI Health Companion

### Personal Health Tracking & AI-Powered Analysis

A full-stack health monitoring platform that lets you log 10 health metrics, visualize trends through interactive charts, and receive AI-generated health insights — all backed by Prisma, NextAuth, and OpenAI.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Coming_Soon-0a0a0a?style=for-the-badge&labelColor=0a0a0a&color=3b82f6)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-0a0a0a?style=for-the-badge&labelColor=0a0a0a&color=22c55e)](#)

</div>

---

## Overview

AI Health Companion is a personal health dashboard that transforms raw health data into actionable insights. Track everything from BMI and blood tests to sleep quality and hydration — then let AI analyze your patterns and provide personalized recommendations.

---

## Features

| Feature | Description |
|:--------|:------------|
| **10 Health Modules** | BMI, blood tests, nutrition, sleep, exercise, water intake, calories, supplements, hair health, and skin health |
| **AI Health Analysis** | OpenAI-powered analysis with both standard and streaming (SSE) response endpoints |
| **Interactive Charts** | Data visualization powered by Recharts for trend analysis across all health metrics |
| **Authentication** | NextAuth.js with credentials provider, sign-in/sign-up flows, and route protection via middleware |
| **Dashboard Grid** | Modular dashboard layout with per-module input forms and aggregated insights |
| **AI Insights Panel** | Dedicated panel displaying AI-generated health recommendations and pattern analysis |
| **Profile Management** | User profile page with personal health data overview |
| **Responsive Design** | Mobile-first layout built with Tailwind CSS |

---

## Tech Stack

| Layer | Technologies |
|:------|:-------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4, PostCSS |
| **Database** | SQLite via Prisma ORM 6.9 |
| **Auth** | NextAuth.js 4.24 |
| **AI** | OpenAI API (streaming + standard) |
| **State** | Zustand 5 |
| **Animation** | Framer Motion 11 |
| **Charts** | Recharts 2.15 |
| **Password Hashing** | bcryptjs 3 |

---

## Project Structure

```
ai-health-companion/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.js                # Seed script
│   └── dev.db                 # SQLite dev database
├── src/
│   ├── app/
│   │   ├── auth/              # Sign-in & error pages
│   │   ├── log/               # Health data logging
│   │   ├── profile/           # User profile
│   │   └── api/
│   │       ├── analyze-health/       # AI analysis endpoint
│   │       ├── analyze-health/stream/ # Streaming AI (SSE)
│   │       ├── auth/                 # NextAuth + signup
│   │       └── health-data/          # CRUD API
│   ├── components/
│   │   ├── ai-insights/       # AI insights display
│   │   ├── charts/            # Data visualization
│   │   ├── dashboard/         # Module grid layout
│   │   └── modules/           # 10 health input modules
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── db.ts              # Prisma singleton
│   │   └── ai-analysis.ts     # OpenAI integration
│   ├── store/                 # Zustand state
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Route protection
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

```bash
git clone https://github.com/mohammadhossein-asadi/ai-health-companion.git
cd ai-health-companion
npm install
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Environment Configuration

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start
```

---

## Architecture

```
┌─────────────────────────────────────┐
│            Frontend                 │
│  Pages (App Router) + Components   │
│  Zustand Store + Recharts          │
├─────────────────────────────────────┤
│          API Layer                  │
│  /api/health-data (CRUD)           │
│  /api/analyze-health (AI)          │
│  /api/auth/* (NextAuth)            │
├─────────────────────────────────────┤
│          Data Layer                 │
│  Prisma ORM → SQLite               │
└─────────────────────────────────────┘
```

### Streaming AI Analysis

The `/api/analyze-health/stream` endpoint uses `ReadableStream` to deliver AI-generated health insights in real time, allowing the UI to render recommendations as they're generated rather than waiting for the full response.

---

## Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

---

## Author

**Mohammadhossein Asadi** — Frontend & Full-Stack Engineer

[![GitHub](https://img.shields.io/badge/GitHub-mohammadhossein--asadi-0a0a0a?style=flat-square&logo=github)](https://github.com/mohammadhossein-asadi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mohammadhossein--asadi-0a66c2?style=flat-square&logo=linkedin)](https://linkedin.com/in/mohammadhossein-asadi)

---

## License

This project is licensed under the [MIT License](LICENSE).
