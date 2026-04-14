---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - prd.md
workflowType: "architecture"
project_name: "Developer Habit Tracker"
user_name: "Developer"
date: "2026-04-13"
---

# Architecture Decision Document: Developer Habit Tracker

## Executive Summary

This document outlines the technical architecture for **Developer Habit Tracker**, a web application designed to help developers build and maintain consistent coding habits. The architecture prioritizes simplicity, scalability, and developer experience through a modern, decoupled full-stack design.

**Key Architectural Decisions:**

- Frontend: React with TypeScript for type-safe component architecture
- Backend: Node.js/Express with REST API
- Database: PostgreSQL for reliable relational data
- Authentication: JWT-based session management
- Deployment: Cloud-native architecture (AWS/Vercel)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Web Browser (Desktop/Mobile)                        │   │
│  │  ├─ React/TypeScript Application                    │   │
│  │  ├─ TanStack Query (Server State)                   │   │
│  │  ├─ Zustand (Client State/UI)                       │   │
│  │  └─ Local Storage (Session Cache)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                        HTTPS/REST API
                             │
┌────────────────────────────┴────────────────────────────────┐
│                      API Layer (BFF)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Node.js/Express Server                              │   │
│  │  ├─ Route Handlers                                  │   │
│  │  ├─ Middleware (Auth, Validation, Logging)          │   │
│  │  ├─ Business Logic                                  │   │
│  │  └─ JWT Token Management                            │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                    Database Queries (SQL)
                             │
┌────────────────────────────┴────────────────────────────────┐
│                    Data Layer                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MongoDB (Cloud or Self-Hosted)                      │   │
│  │  ├─ Users Collection                                │   │
│  │  ├─ Habits Collection                               │   │
│  │  ├─ Habit_Completions Collection                    │   │
│  │  └─ Streaks Collection (Computed/Cached)            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Redis Cache (Session & Streak Cache)                │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Layers

| Layer              | Component            | Responsibility                                   |
| ------------------ | -------------------- | ------------------------------------------------ |
| **Presentation**   | React SPA            | UI rendering, user interaction, state management |
| **API Gateway**    | Express.js Server    | Request routing, authentication, validation      |
| **Business Logic** | Service Layer        | Habit management, streak calculation, user logic |
| **Data Access**    | Repository/ORM Layer | Database queries, data persistence               |
| **Storage**        | MongoDB + Redis      | Persistent data, caching, sessions               |

---

## 2. Frontend Architecture

### 2.1 Technology Stack

| Component        | Choice                       | Rationale                                          |
| ---------------- | ---------------------------- | -------------------------------------------------- |
| **Framework**    | React 18+                    | Modern, component-based, large ecosystem           |
| **Language**     | TypeScript                   | Type safety, better DX, catches errors early       |
| **Server State** | TanStack Query (React Query) | Automatic caching, background sync, stale-while-rv |
| **Client State** | Zustand / Jotai              | Lightweight, minimal boilerplate, excellent DX     |
| **HTTP Client**  | Axios / Fetch API            | Easy API integration, interceptors for auth        |
| **Styling**      | Tailwind CSS / CSS Modules   | Utility-first, rapid UI development, maintainable  |
| **Build Tool**   | Vite                         | Fast builds, dev server, optimized bundles         |
| **Testing**      | Jest + React Testing Library | Unit & component testing                           |
| **Routing**      | React Router v6              | Client-side routing, nested routes                 |

### 2.2 Frontend Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── HabitList.tsx
│   │   │   ├── StreakDisplay.tsx
│   │   │   └── WeeklyProgress.tsx
│   │   ├── Habits/
│   │   │   ├── AddHabitModal.tsx
│   │   │   ├── EditHabitModal.tsx
│   │   │   └── HabitCard.tsx
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── Common/
│   │       ├── Navbar.tsx
│   │       ├── Loading.tsx
│   │       └── ErrorBoundary.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── habitApi.ts
│   │   │   ├── authApi.ts
│   │   │   └── userApi.ts
│   │   └── utils/
│   │       ├── dateUtils.ts
│   │       └── streakCalculator.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── habitsSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── store.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useHabits.ts
│   │   └── useFetch.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── habit.ts
│   │   └── user.ts
│   ├── styles/
│   │   └── tailwind.css
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── jest.config.js
```

### 2.3 Key Components

#### Dashboard Component

- **Responsibility:** Main hub for habit tracking
- **Features:**
  - Render all habits for the current day
  - Show completion status
  - Display active streaks
  - Weekly progress grid
  - Quick add habit button
- **State:** Habits list, selected date, filter/sort options

#### Habit Card Component

- **Responsibility:** Individual habit display
- **Features:**
  - Habit name and description
  - Checkbox to mark complete/incomplete
  - Current streak display
  - Edit/Delete buttons
- **Props:** Habit object, onToggle callback, onEdit callback

#### Weekly Progress Component

- **Responsibility:** 7-day completion calendar
- **Features:**
  - Grid showing completion status for each day
  - Color-coded cells (completed, pending, missed)
  - Completion percentage calculation
  - Drill-down to specific habits
- **State:** Selected week, habit filter

### 2.4 State Management Strategy

**TanStack Query (React Query) + Zustand Architecture:**

TanStack Query handles all **server state** (data from backend):

```typescript
// hooks/useHabits.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useHabits = () => {
  return useQuery({
    queryKey: ["habits"],
    queryFn: () => habitApi.getHabits(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
};

export const useMarkHabitComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      habitApi.markComplete(habitId, date),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["completions"] });
    },
  });
};
```

Zustand handles **client state** (UI state, preferences, local data):

```typescript
// store/uiStore.ts
import { create } from "zustand";

interface UIState {
  selectedDate: Date;
  showAddModal: boolean;
  showEditModal: boolean;
  theme: "light" | "dark";
  // Actions
  setSelectedDate: (date: Date) => void;
  setShowAddModal: (show: boolean) => void;
  setShowEditModal: (show: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedDate: new Date(),
  showAddModal: false,
  showEditModal: false,
  theme: "light",
  setSelectedDate: (date) => set({ selectedDate: date }),
  setShowAddModal: (show) => set({ showAddModal: show }),
  setShowEditModal: (show) => set({ showEditModal: show }),
  setTheme: (theme) => set({ theme }),
}));
```

**Why This Approach?**

- **TanStack Query:** Automatic caching, background sync, deduplication, garbage collection
- **Zustand:** Minimal boilerplate, no Redux DevTools needed, excellent DX for UI state
- **Separation:** Server state and UI state are managed independently
- **No Redux bloat:** Simple apps don't need Redux complexity

### 2.5 API Integration Layer

**Service Pattern:**

```typescript
// services/api/habitApi.ts
export const habitApi = {
  getHabits: (filters?: HabitFilters) =>
    axios.get("/api/habits", { params: filters }),

  createHabit: (habit: CreateHabitDTO) => axios.post("/api/habits", habit),

  updateHabit: (id: string, updates: UpdateHabitDTO) =>
    axios.patch(`/api/habits/${id}`, updates),

  deleteHabit: (id: string) => axios.delete(`/api/habits/${id}`),

  markComplete: (habitId: string, date: string) =>
    axios.post(`/api/habits/${habitId}/complete`, { date }),

  getCompletions: (habitId: string, startDate: string, endDate: string) =>
    axios.get(`/api/habits/${habitId}/completions`, {
      params: { startDate, endDate },
    }),
};
```

### 2.6 Frontend Performance Considerations

- **Code Splitting:** Route-based lazy loading for larger components
- **Memoization:** React.memo for expensive components (HabitCard, StreakDisplay)
- **Virtual Scrolling:** For lists with 100+ habits (future)
- **API Caching:** TanStack Query automatic caching and revalidation
- **Bundle Optimization:** Tree-shaking, minification via Vite
- **Image Optimization:** SVG icons, no unnecessary images in MVP

---

## 3. Backend Architecture

### 3.1 Technology Stack

| Component            | Choice                 | Rationale                                         |
| -------------------- | ---------------------- | ------------------------------------------------- |
| **Runtime**          | Node.js 18+            | Event-driven, non-blocking I/O                    |
| **Framework**        | Express.js             | Lightweight, flexible, large middleware ecosystem |
| **Language**         | TypeScript             | Type safety, catches errors, better refactoring   |
| **Database Driver**  | Mongoose (MongoDB ODM) | Schema validation, query builder, migrations      |
| **Authentication**   | jsonwebtoken (JWT)     | Stateless auth, scalable                          |
| **Password Hashing** | bcrypt                 | Industry standard, slow-by-design                 |
| **Validation**       | Joi / Zod              | Schema validation for requests                    |
| **Logging**          | Winston / Pino         | Structured logging, easy debugging                |
| **Testing**          | Jest + Supertest       | Unit & integration tests, API testing             |
| **Caching**          | Redis                  | Session storage, streak caching                   |

### 3.2 Backend Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Habit.ts
│   │   ├── HabitCompletion.ts
│   │   └── Streak.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── habits.ts
│   │   ├── completions.ts
│   │   └── users.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── habitController.ts
│   │   ├── completionController.ts
│   │   └── userController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── habitService.ts
│   │   ├── streakService.ts
│   │   └── completionService.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   └── logging.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── express.d.ts (extend Express namespace)
│   ├── utils/
│   │   ├── passwordHash.ts
│   │   ├── jwt.ts
│   │   └── streakCalculator.ts
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── 002_add_indexes.sql
│   └── app.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── package.json
├── tsconfig.json
├── jest.config.js
└── .env.example
```

### 3.3 Database Schema (MongoDB)

#### Users Collection

```typescript
// models/User.ts
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date, nullable: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export const User = model("User", userSchema);
```

#### Habits Collection

```typescript
// models/Habit.ts
const habitSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, nullable: true },
    category: {
      type: String,
      enum: ["DSA", "Projects", "Learning", "Other"],
      default: "Other",
    },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

habitSchema.index({ userId: 1, isArchived: 1 });
habitSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Habit = model("Habit", habitSchema);
```

#### Habit Completions Collection

```typescript
// models/HabitCompletion.ts
const habitCompletionSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true },
    completionDate: { type: Date, required: true },
    isCompleted: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

habitCompletionSchema.index(
  { habitId: 1, completionDate: 1 },
  { unique: true },
);
habitCompletionSchema.index({ habitId: 1, isCompleted: 1 });

export const HabitCompletion = model("HabitCompletion", habitCompletionSchema);
```

#### Streaks Collection (Cached/Computed)

```typescript
// models/Streak.ts
const streakSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedDate: { type: Date, nullable: true },
    streakBrokenDate: { type: Date, nullable: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

streakSchema.index({ habitId: 1 });

export const Streak = model("Streak", streakSchema);
```

**MongoDB Connection (Mongoose):**

```typescript
// config/database.ts
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
```

### 3.4 API Endpoints (RESTful)

#### Authentication

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/logout          - Logout user
POST   /api/auth/refresh-token   - Refresh JWT token
GET    /api/auth/me              - Get current user
```

#### Habits

```
GET    /api/habits               - List all user habits (with filters)
POST   /api/habits               - Create new habit
GET    /api/habits/:id           - Get habit details
PATCH  /api/habits/:id           - Update habit
DELETE /api/habits/:id           - Delete/archive habit
```

#### Completions

```
POST   /api/habits/:id/complete  - Mark habit complete for date
POST   /api/habits/:id/incomplete- Mark habit incomplete for date
GET    /api/habits/:id/completions - Get completion history for date range
GET    /api/completions/weekly   - Get weekly summary for all habits
```

#### Users

```
GET    /api/users/profile        - Get user profile
PATCH  /api/users/profile        - Update user profile
POST   /api/users/change-password- Change password
DELETE /api/users/account        - Delete user account
```

### 3.5 Business Logic: Streak Calculation

**Algorithm:**

```typescript
async calculateStreak(habitId: string, asOfDate: Date): Promise<StreakData> {
  // 1. Get all completions in reverse chronological order
  const completions = await HabitCompletion.findAll({
    habitId,
    orderBy: { completionDate: 'DESC' }
  });

  // 2. Traverse from today backwards, counting consecutive completed days
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  let expectedDate = new Date(asOfDate);

  for (const completion of completions) {
    if (isSameDay(completion.completionDate, expectedDate) &&
        completion.is_completed) {
      tempStreak++;
    } else if (completion.is_completed) {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
    expectedDate = addDays(expectedDate, -1);
  }

  longestStreak = Math.max(longestStreak, tempStreak);
  currentStreak = isSameDay(completions[0]?.completionDate, asOfDate)
    ? tempStreak : 0;

  return { currentStreak, longestStreak, lastCompletedDate };
}
```

### 3.6 Authentication Flow

**JWT Implementation:**

1. User registers with email/password
2. Backend hashes password with bcrypt (salt rounds: 10)
3. User logs in, backend verifies password, generates JWT
4. JWT contains: `{ userId, email, iat, exp }`
5. Frontend stores JWT in httpOnly cookie (secure by default)
6. Each request includes JWT in `Authorization: Bearer <token>` header
7. Backend middleware validates JWT signature and expiration
8. Token refresh endpoint allows issuing new token when expiring

**Security Considerations:**

- Tokens expire in 24 hours (refresh tokens: 7 days)
- httpOnly cookies prevent XSS token theft
- HTTPS only (no HTTP in production)
- CSRF tokens for state-changing operations
- Rate limiting on auth endpoints (5 attempts/minute)

---

## 4. Data Flow & API Request Examples

### 4.1 Daily Habit Logging Flow

```
User clicks "Complete" on habit card
         ↓
Frontend: POST /api/habits/{habitId}/complete { date: "2026-04-13" }
         ↓
Backend: Middleware validates JWT, extracts userId
         ↓
Backend: HabitCompletion.create({ habitId, date, is_completed: true })
         ↓
Backend: Streak recalculated (cache invalidated)
         ↓
Backend: Response { success: true, streak: 5, lastCompleted: "2026-04-13" }
         ↓
Frontend: Redux action dispatched, UI updated with new streak
         ↓
User sees streak increment in real-time
```

### 4.2 Weekly Dashboard Load Flow

```
User navigates to Dashboard
         ↓
Frontend: GET /api/habits (filter: { archived: false })
Frontend: GET /api/completions/weekly (start: Mon, end: Sun)
         ↓
Backend: Query habits by user_id
Backend: Query completions JOIN streaks for efficiency
         ↓
Backend: Return:
         {
           habits: [...],
           completions: { [habitId]: { [date]: boolean } },
           streaks: { [habitId]: { current: 5, longest: 12 } }
         }
         ↓
Frontend: Redux store updated with data
         ↓
UI renders Dashboard with all data populated
```

---

## 5. Infrastructure & Deployment

### 5.1 Hosting Architecture

```
┌─────────────────────────────────────────────────────┐
│              AWS / Vercel Infrastructure             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (Vercel)           Backend (AWS/Railway)  │
│  ├─ CDN Distribution         ├─ EC2/ECS Container   │
│  ├─ Automatic Deployments    ├─ Auto-scaling Group  │
│  └─ Edge Caching             └─ Load Balancer       │
│                                                     │
│  Database (MongoDB Atlas)    Cache (ElastiCache)    │
│  ├─ Multi-Region Sharding    ├─ Redis Cluster       │
│  ├─ Automated Backups        ├─ Session Store       │
│  └─ Point-in-time Recovery   └─ Streak Cache        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 5.2 Deployment Configurations

#### Frontend (Vercel)

- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Environment Variables:** API_URL, environment secrets
- **CDN:** Automatic with cache headers
- **Deployments:** Automated on GitHub push to main branch

#### Backend (AWS ECS / Railway)

- **Container:** Docker image (Node.js 18+ Alpine)
- **Environment Variables:** MONGODB_URI, JWT_SECRET, REDIS_URL, etc.
- **Health Check:** GET /health endpoint (200 OK if connected)
- **Logging:** CloudWatch / Datadog for centralized logging
- **Monitoring:** CPU, memory, request latency alerts

### 5.3 Database Setup

**MongoDB Atlas (Cloud):**

- **Cluster Tier:** M0 (free, MVP), upgrade to M2 as needed
- **Region:** Multi-region for latency optimization
- **Backups:** Automated daily snapshots, 7-day retention
- **Monitoring:** Built-in charts for performance analysis
- **Scaling:** Automatic vertical scaling based on load

**Redis ElastiCache:**

- **Node Type:** cache.t3.micro (MVP)
- **Engine:** Redis 7.0+
- **Cluster Mode:** Disabled for MVP
- **Automatic Failover:** Enabled
- **Backup:** Daily snapshots

### 5.4 Docker Configuration (Backend)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/app.js"]
```

### 5.5 CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          docker build -t app:${{ github.sha }} .
          docker tag app:${{ github.sha }} app:latest
      - run: docker push app:latest
      - run: kubectl set image deployment/api api=app:latest
```

---

## 6. Security Architecture

### 6.1 Security Layers

| Layer                | Measures                                                            |
| -------------------- | ------------------------------------------------------------------- |
| **Transport**        | HTTPS/TLS 1.3, secure cookies (HttpOnly, Secure, SameSite)          |
| **Authentication**   | JWT with expiration, bcrypt password hashing                        |
| **Authorization**    | Role-based access control (user owns their data only)               |
| **Input Validation** | Server-side schema validation (Zod/Joi)                             |
| **API Security**     | Rate limiting, CORS configured, no sensitive headers exposed        |
| **Database**         | SQL parameterized queries (no SQL injection), encrypted connections |
| **Monitoring**       | Logging, alerts for suspicious activity, automated security scans   |

### 6.2 CORS Configuration

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

### 6.3 Rate Limiting

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5 // Max 5 login attempts per 15 minutes
});

app.post('/api/auth/login', authLimiter, ...);
```

---

## 7. Performance Optimization

### 7.1 Frontend Optimizations

| Technique              | Implementation               | Impact                                |
| ---------------------- | ---------------------------- | ------------------------------------- |
| **Code Splitting**     | React.lazy() for routes      | ~40% reduction in initial bundle      |
| **Memoization**        | React.memo for HabitCard     | Prevents re-renders on parent updates |
| **Virtual Scrolling**  | react-window for 100+ habits | O(1) render time for large lists      |
| **API Caching**        | Redux + revalidation         | Faster navigation between screens     |
| **Image Optimization** | SVG icons, no raster images  | Smaller bundle, crisp on all devices  |

### 7.2 Backend Optimizations

| Technique              | Implementation                         | Impact                               |
| ---------------------- | -------------------------------------- | ------------------------------------ |
| **Database Indexing**  | Indexes on user_id, date               | Query time: O(log n) instead of O(n) |
| **Query Optimization** | Batch queries, SELECT only needed cols | ~70% faster endpoint responses       |
| **Caching**            | Redis for streaks, sessions            | ~500ms faster streak calculations    |
| **Connection Pooling** | pg pool with 10 connections            | Handles 100+ concurrent users        |
| **Gzip Compression**   | Enable on all responses                | ~60% smaller response payloads       |

### 7.3 Monitoring & Observability

**Key Metrics:**

- API response time (target: < 200ms p95)
- Database query time (target: < 50ms p95)
- Error rate (target: < 0.1%)
- Uptime (target: 99.9%)

**Tools:**

- Datadog / New Relic for APM
- CloudWatch for infrastructure metrics
- Sentry for error tracking
- LogRocket for frontend monitoring

---

## 8. Scalability Roadmap

### 8.1 Phase 1: MVP (Single Region, < 10K DAU)

**Components:**

- PostgreSQL single instance (db.t3.micro)
- Redis single node (cache.t3.micro)
- Backend: 1-2 instances behind load balancer
- Frontend: Vercel CDN (auto-scales)

**Bottleneck:** Database connections, single region latency

### 8.2 Phase 2: Growth (Multi-Region, 10K-100K DAU)

**Components:**

- PostgreSQL Multi-AZ with read replicas
- Redis cluster (sharded by user_id prefix)
- Backend: Auto-scaling group (2-10 instances)
- Frontend: Multi-region CDN distribution

**Optimization:** Add caching layer, database read replicas for dashboards

### 8.3 Phase 3: Scale (100K+ DAU)

**Components:**

- PostgreSQL with sharding by user_id
- Redis cluster with consistent hashing
- Microservices separation (auth, habits, notifications)
- Event streaming (Kafka) for real-time updates
- Search service (Elasticsearch) for habit analytics

---

## 9. Technology Decisions & Trade-offs

### 9.1 Decision: Express vs. NestJS

**Choice: Express.js**

| Aspect                   | Express             | NestJS                |
| ------------------------ | ------------------- | --------------------- |
| **Learning Curve**       | Low                 | High                  |
| **Setup Time**           | ~1 hour             | ~3 hours              |
| **Type Safety**          | Decorators optional | Built-in (TypeScript) |
| **Middleware Ecosystem** | Huge                | Growing               |
| **Testing**              | Standard            | Easier with DI        |

**Rationale:** MVP prioritizes speed and simplicity. Express allows rapid iteration with minimal boilerplate. Can migrate to NestJS if microservices needed.

### 9.2 Decision: Redux vs. TanStack Query + Zustand

**Choice: TanStack Query (React Query) + Zustand**

| Aspect                | Redux Toolkit          | TanStack Query + Zustand |
| --------------------- | ---------------------- | ------------------------ |
| **Boilerplate**       | High (slices, actions) | Minimal                  |
| **Server State Mgmt** | Manual                 | Automatic                |
| **Learning Curve**    | Steep                  | Gentle                   |
| **Bundle Size**       | ~8KB                   | ~10KB (both combined)    |
| **Caching Strategy**  | Manual                 | Built-in with TTL        |
| **Background Sync**   | Manual polling         | Built-in                 |
| **DevTools**          | Redux DevTools         | React Query DevTools     |

**Rationale:** TanStack Query provides automatic server state management (caching, deduplication, background sync) with minimal boilerplate. Zustand handles UI state elegantly without Redux complexity. Perfect for MVP where fast iteration matters. Can add Redux later if needed.

### 9.3 Decision: React vs. Vue

**Choice: React**

| Aspect             | React          | Vue       |
| ------------------ | -------------- | --------- |
| **Job Market**     | Highest demand | Growing   |
| **Learning Curve** | Moderate       | Low       |
| **Ecosystem**      | Largest        | Good      |
| **Performance**    | Excellent      | Excellent |
| **Community**      | Largest        | Smaller   |

**Rationale:** React has the largest ecosystem and talent pool. Better long-term sustainability.

### 9.4 Decision: MongoDB vs. PostgreSQL

**Choice: MongoDB**

| Aspect                | MongoDB               | PostgreSQL   |
| --------------------- | --------------------- | ------------ |
| **Data Model**        | Document (Flexible)   | Relational   |
| **Transactions**      | Multi-document ACID   | ACID         |
| **Query Complexity**  | Aggregation Pipeline  | SQL Joins    |
| **Joins**             | Denormalization       | Efficient    |
| **Scaling**           | Horizontal (sharding) | Vertical     |
| **Development Speed** | Faster schema changes | Schema-first |

**Rationale:** MongoDB provides flexibility for MVP rapid iteration. Mongoose provides schema validation and DX. Easy horizontal scaling and document model aligns well with habit tracking (habits with nested completions). Can easily handle future feature additions without migrations.

---

## 10. Testing Strategy

### 10.1 Frontend Testing

**Unit Tests (Jest + React Testing Library):**

```typescript
// HabitCard.test.tsx
describe('HabitCard', () => {
  it('should render habit name and streak', () => {
    const habit = { id: '1', name: 'DSA', currentStreak: 5 };
    const { getByText } = render(<HabitCard habit={habit} />);

    expect(getByText('DSA')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
  });

  it('should call onToggle when checkbox clicked', () => {
    const onToggle = jest.fn();
    const { getByRole } = render(
      <HabitCard habit={habit} onToggle={onToggle} />
    );

    fireEvent.click(getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith(habit.id);
  });
});
```

**Integration Tests:**

- Test Redux flow: dispatch action → state update → component re-render
- Test API integration: mock API responses, verify Redux actions dispatched

**E2E Tests (Cypress):**

- User journey: register → create habit → mark complete → see streak

### 10.2 Backend Testing

**Unit Tests:**

- Service layer: streakCalculator.test.ts
- Utilities: passwordHash.test.ts, jwt.test.ts

**Integration Tests (Supertest):**

```typescript
// habits.test.ts
describe("POST /api/habits", () => {
  it("should create habit for authenticated user", async () => {
    const response = await request(app)
      .post("/api/habits")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "DSA", category: "learning" });

    expect(response.status).toBe(201);
    expect(response.body.habit.name).toBe("DSA");
  });

  it("should return 401 if not authenticated", async () => {
    const response = await request(app)
      .post("/api/habits")
      .send({ name: "DSA" });

    expect(response.status).toBe(401);
  });
});
```

**Test Coverage Goals:**

- Frontend: 70% (focus on business logic)
- Backend: 80% (all services and critical paths)

### 10.3 Performance Testing

- Load testing: 100 concurrent users, measure response time
- Stress testing: Increase load until failure point
- Endurance testing: Run 24-hour test cycle

---

## 11. Deployment Checklist

- [ ] Environment variables configured (.env.production)
- [ ] Database migrations run on production
- [ ] API rate limiting configured
- [ ] HTTPS certificates installed
- [ ] CORS whitelist configured
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] Error monitoring (Sentry) configured
- [ ] Logging configured and centralized
- [ ] Backup strategy verified
- [ ] Disaster recovery plan documented
- [ ] Performance monitoring enabled
- [ ] Database indexes verified
- [ ] Load testing completed
- [ ] Security audit completed

---

## 12. Architecture Decisions Summary

| Decision   | Choice                               | Rationale                                     | Risk                                     |
| ---------- | ------------------------------------ | --------------------------------------------- | ---------------------------------------- |
| Frontend   | React + TypeScript                   | Modern, scalable, large ecosystem             | Learning curve for team                  |
| Backend    | Node.js/Express                      | Rapid development, JavaScript full-stack      | Less type safety than compiled languages |
| Database   | MongoDB + Mongoose                   | Flexible schema, horizontal scaling, fast dev | Requires careful index strategy          |
| State Mgmt | TanStack Query + Zustand             | Minimal boilerplate, automatic server sync    | Different mental model than Redux        |
| Auth       | JWT + bcrypt                         | Stateless, scalable, industry standard        | Token refresh complexity                 |
| Deployment | Vercel + AWS/Railway + MongoDB Atlas | Automatic deployments, easy scaling, no ops   | Vendor lock-in                           |
| Caching    | Redis + TanStack Query               | Fast session store, automatic data caching    | Adds operational complexity              |

---

## 13. Open Architecture Questions

1. **Should we implement real-time updates?** (WebSocket vs. polling)
2. **When should we add mobile native apps?** (Phase 2 or 3?)
3. **What's the long-term data retention policy?** (Delete old completions after 1 year?)
4. **Should we support habit syncing across devices?** (Desktop to mobile)
5. **When to implement advanced analytics?** (Trend detection, insights)

---

## Appendix: Technology References

### A. TypeScript Configuration

- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Path aliases for clean imports

### B. Performance Budgets

- Initial JS bundle: < 150KB (gzipped)
- API response: < 200ms (p95)
- Page load: < 2 seconds (4G)

### C. Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari 12+, Chrome Android)
- IE 11: Not supported

### D. Accessibility Standards

- WCAG 2.1 Level AA
- Color contrast: 4.5:1 for text
- Keyboard navigation: Full support

---

## Document Metadata

- **Version:** 1.0 (MVP Architecture)
- **Last Updated:** April 13, 2026
- **Status:** Approved for Implementation
- **Author:** Architecture Team
- **Next Review:** Q3 2026 (Post-MVP Launch)
