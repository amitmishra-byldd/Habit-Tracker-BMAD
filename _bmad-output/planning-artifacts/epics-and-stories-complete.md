# Developer Habit Tracker - Epics & User Stories

## Quick Navigation

- [Epic 1: User Authentication & Onboarding](#epic-1-user-authentication--onboarding) (5 stories)
- [Epic 2: Habit Management](#epic-2-habit-management-crud--core-features) (5 stories)
- [Epic 3: Dashboard & Progress Tracking](#epic-3-dashboard--daily-habit-tracking) (5 stories)

**Total:** 15 stories across 3 epics, ~82 hours MVP estimate

---

## Epic 1: User Authentication & Onboarding

**Epic Description:** Enable users to create accounts, securely authenticate, and get started with the application.

**Epic Goals:**

- Users can register with email/password
- Users can securely login/logout
- Authentication state persists across sessions
- Clear error messaging for auth failures

**Technical Scope:**

- JWT-based authentication with Zustand state management
- Bcrypt password hashing
- HTTP-only secure cookies
- Session management via Redis
- Protected routes with React Router

### Story 1.1: User Registration

**User Story:** As a developer, I want to create an account with email and password so I can start tracking habits

**Acceptance Criteria:**

- [ ] Registration form with email, username, password fields
- [ ] Real-time validation for email, password strength, duplicate usernames
- [ ] Passwords hashed with bcrypt (salt rounds: 10)
- [ ] User record created in MongoDB with timestamps
- [ ] Success redirect to login or dashboard
- [ ] Rate limiting (max 5 registration attempts per minute per IP)
- [ ] Passwords never logged or exposed in errors
- [ ] Works on mobile and desktop

**Technical Implementation:**

**Backend (Node.js/Express):**

```typescript
POST /api/auth/register
Request: { email, username, password }
Response: { success, user: { id, email, username }, message }

// Uses Mongoose User model with unique indexes
// Validates with Zod schema
// Hashes password with bcrypt before saving
```

**Frontend (React/TypeScript):**

```typescript
// Component: RegisterPage.tsx
// Form managed with react-hook-form
// Error state in Zustand useAuthStore
// Loading state during API call

const useAuthStore = create((set) => ({
  isLoading: false,
  error: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
```

**Estimated Hours:** 8  
**Priority:** P1 (Critical)  
**Dependencies:** bcryptjs, Zod, react-hook-form, axios

---

### Story 1.2: User Login & Session Management

**User Story:** As a returning developer, I want to securely login to my account so I can access my habit dashboard

**Acceptance Criteria:**

- [ ] Login form with email and password
- [ ] Clear error messages (invalid credentials, account not found, too many attempts)
- [ ] JWT token generated and stored in httpOnly cookie
- [ ] User redirected to dashboard (or previous page)
- [ ] Authentication state persists across page refreshes
- [ ] JWT expires after 24 hours
- [ ] Rate limiting on login (max 5 attempts per minute per IP)
- [ ] Works on mobile and desktop

**Technical Implementation:**

**Backend:**

```typescript
POST /api/auth/login
- Compare password with bcrypt.compare()
- Generate JWT signed with JWT_SECRET (24h expiration)
- Set httpOnly, Secure, SameSite cookie
- Return user object + token
```

**Frontend:**

```typescript
// LoginPage.tsx with TanStack Query
// Zustand tracks: isAuthenticated, user, isLoading, error
// Redirect via React Router after successful auth
// Protected routes check useAuthStore for auth status
```

**Estimated Hours:** 8  
**Priority:** P1 (Critical)  
**Dependencies:** jsonwebtoken, bcryptjs, react-hook-form

---

### Story 1.3: Logout & Session Cleanup

**User Story:** As a user, I want to securely logout so my session is terminated

**Acceptance Criteria:**

- [ ] Logout button in navbar (visible when authenticated)
- [ ] Calls POST /api/auth/logout to clear session
- [ ] Clears JWT cookie and Redis session
- [ ] Clears Zustand auth store
- [ ] Redirects to login page
- [ ] Protected routes no longer accessible
- [ ] Subsequent API calls return 401

**Estimated Hours:** 4  
**Priority:** P1 (Critical)

---

### Story 1.4: Protected Routes & Access Control

**User Story:** As the system, I want to protect routes so only authenticated users access the dashboard

**Acceptance Criteria:**

- [ ] Dashboard route requires authentication
- [ ] Settings route requires authentication
- [ ] Unauthenticated users redirected to login
- [ ] After login, user redirected to originally requested page
- [ ] Public routes (home, login, register) accessible without auth
- [ ] Invalid/expired JWT redirects to login with message

**Technical Implementation:**

```typescript
// ProtectedRoute.tsx
- Checks Zustand useAuthStore.isAuthenticated
- Redirects to /login if not authenticated
- Renders protected component if authenticated
```

**Estimated Hours:** 4  
**Priority:** P1 (Critical)

---

### Story 1.5: Error Handling & User Feedback

**User Story:** As a user, I want clear error messages when auth fails so I understand what went wrong

**Acceptance Criteria:**

- [ ] Registration-specific errors (email registered, username taken, weak password)
- [ ] Login-specific errors (invalid credentials, account not found, too many attempts)
- [ ] Server errors shown as generic "Something went wrong" (no details exposed)
- [ ] Network errors show retry option
- [ ] Error messages auto-dismiss after 5 seconds
- [ ] Form data preserved on error (no re-entry needed)
- [ ] Success messages also displayed (green toast)
- [ ] Errors logged client-side but not exposed to user

**Estimated Hours:** 4  
**Priority:** P2 (Important)

---

**Epic 1 Total:** 28 hours

---

## Epic 2: Habit Management (CRUD & Core Features)

**Epic Description:** Enable users to create, read, update, and delete habits—the core feature of the application.

**Epic Goals:**

- Users can create habits with name, description, category
- Users can view all habits in organized list
- Users can edit habit details
- Users can archive/delete habits
- Habits organized by category (DSA, Projects, Learning, Other)
- All CRUD operations use TanStack Query with Zustand UI state

### Story 2.1: Create New Habit

**User Story:** As a developer, I want to create a new habit so I can start tracking it

**Acceptance Criteria:**

- [ ] "Add Habit" button opens modal form
- [ ] Form fields: name (required), description (optional), category (dropdown)
- [ ] Validation: no empty names, max 100 chars, no duplicates per user
- [ ] POST /api/habits creates habit
- [ ] New habit immediately appears in list (optimistic update)
- [ ] Modal closes after creation
- [ ] Success toast: "Habit created: [name]"
- [ ] Works on mobile and desktop

**Technical Implementation:**

**Backend:**

```typescript
POST /api/habits
- Validates user is authenticated (JWT middleware)
- Validates inputs with Zod
- Enforces unique (userId, name) constraint
- Returns created habit with id, timestamps
```

**Frontend:**

```typescript
// AddHabitModal.tsx
// Form: react-hook-form
// State: Zustand useHabitUIStore
// Mutation: TanStack Query useMutation

export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newHabit) => axios.post("/api/habits", newHabit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      useHabitUIStore.setState({ showAddModal: false });
      toast.success(`Habit created!`);
    },
  });
};
```

**Estimated Hours:** 6  
**Priority:** P1 (Critical)  
**Dependencies:** TanStack Query, Zustand, react-hook-form, Zod

---

### Story 2.2: View All Habits

**User Story:** As a user, I want to see all my habits so I can manage them

**Acceptance Criteria:**

- [ ] Dashboard loads and displays user's active habits
- [ ] Each habit shows: name, category, current streak, last completed date
- [ ] Archived habits hidden by default
- [ ] Empty state: "No habits yet. Create one to get started!"
- [ ] Loading spinner while fetching
- [ ] Error handling with retry button
- [ ] Habits sync when created/updated (real-time)
- [ ] Works on mobile and desktop

**Technical Implementation:**

**Backend:**

```typescript
GET /api/habits?archived=false&category=DSA
- Returns array of habits for authenticated user
- Joins with Streaks collection for streak counts
- Supports filtering by category and archived status
```

**Frontend:**

```typescript
// HabitList.tsx
export const useHabits = () => {
  return useQuery({
    queryKey: ["habits"],
    queryFn: () => axios.get("/api/habits").then((r) => r.data.habits),
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};
```

**Estimated Hours:** 4  
**Priority:** P1 (Critical)

---

### Story 2.3: Edit Habit

**User Story:** As a user, I want to edit habit details to keep them up-to-date

**Acceptance Criteria:**

- [ ] Edit button on each habit card
- [ ] Modal opens with pre-filled form
- [ ] Editable fields: name, description, category
- [ ] Same validation as create (no empty, max 100 chars, no duplicates)
- [ ] PATCH /api/habits/:id updates habit
- [ ] Updated habit shows immediately (optimistic update)
- [ ] Success toast: "Habit updated: [name]"
- [ ] Can't update to duplicate name for same user

**Estimated Hours:** 6  
**Priority:** P1 (Critical)

---

### Story 2.4: Archive/Delete Habit

**User Story:** As a user, I want to archive or delete habits I no longer track

**Acceptance Criteria:**

- [ ] Archive button on habit card (soft delete)
- [ ] Confirmation dialog before archiving
- [ ] Archived habits hidden from main list
- [ ] Restore button to un-archive
- [ ] Delete button for permanent removal (optional)
- [ ] Delete confirmation with warning
- [ ] Delete cascades to completions and streaks
- [ ] Success toast after action

**Technical Implementation:**

**Backend:**

```typescript
PATCH /api/habits/:id/archive
- Sets isArchived: true (soft delete, data preserved)

DELETE /api/habits/:id
- Hard delete with cascade to HabitCompletion and Streak
```

**Estimated Hours:** 6  
**Priority:** P1 (Critical)

---

### Story 2.5: Habit Categories & Organization

**User Story:** As a user, I want to organize habits by category so I can group related activities

**Acceptance Criteria:**

- [ ] Category dropdown in create/edit forms
- [ ] Options: DSA (blue), Projects (green), Learning (orange), Other (gray)
- [ ] Each habit shows category badge with color
- [ ] Filter by category on dashboard
- [ ] "All Categories" filter shows all habits
- [ ] Category counts shown (optional): "DSA (3), Projects (2)"
- [ ] Empty state when filtered category has no habits

**Estimated Hours:** 4  
**Priority:** P2 (Important)

---

**Epic 2 Total:** 26 hours

---

## Epic 3: Dashboard & Daily Habit Tracking

**Epic Description:** Build the core dashboard where users track daily habit completion, view streaks, and see weekly progress. This is the main engagement surface.

**Epic Goals:**

- Users see all habits for today with completion status
- Users can quickly mark habits complete/incomplete
- Users see active streaks for motivation
- Users see weekly progress calendar
- Real-time updates via TanStack Query optimistic updates
- Mobile-friendly responsive design

### Story 3.1: Dashboard Layout & Habit List

**User Story:** As a user, I want to see all my habits on the dashboard so I can track them today

**Acceptance Criteria:**

- [ ] Dashboard displays today's date greeting
- [ ] Shows total habits, completed today, completion percentage
- [ ] Habit list with checkboxes for each habit
- [ ] Each habit shows name, category badge, current streak (🔥)
- [ ] Habits grouped by category (optional sections)
- [ ] Empty state: "No habits yet. Create one!"
- [ ] Loading spinner while fetching
- [ ] Error handling with retry
- [ ] Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] "Add New Habit" CTA button prominent

**Technical Implementation:**

**Backend:**

```typescript
GET /api/completions/today
- Returns today's habits with completion status
- Joins with streaks for current streak counts
- Returns summary stats (total, completed)
```

**Frontend:**

```typescript
// Dashboard.tsx / DashboardPage.tsx
export const useTodayHabits = () => {
  return useQuery({
    queryKey: ["completions", "today"],
    queryFn: () => axios.get("/api/completions/today").then((r) => r.data),
    staleTime: 1000 * 60 * 1, // 1 min
  });
};

// Components: DashboardStats, HabitList, StreakDisplay
```

**Estimated Hours:** 6  
**Priority:** P1 (Critical)

---

### Story 3.2: Mark Habit Complete/Incomplete

**User Story:** As a user, I want to quickly mark habits complete or incomplete to track my progress

**Acceptance Criteria:**

- [ ] Clicking checkbox marks habit complete for today
- [ ] Checkbox immediately checked (optimistic update)
- [ ] Streak count increments by 1
- [ ] Success toast: "Habit completed! 🎉"
- [ ] Can click again to uncheck (mark incomplete)
- [ ] Streak decrements on uncheck
- [ ] Hover shows cursor pointer
- [ ] Keyboard accessible (Space to toggle)
- [ ] Large touch target on mobile
- [ ] Error handling with rollback on failure
- [ ] Daily count in header updates immediately

**Technical Implementation:**

**Backend:**

```typescript
POST /api/habits/:id/complete
Request: { date, isCompleted: boolean }
- Creates/updates HabitCompletion record
- Recalculates streak
- Returns completion + updated streak
```

**Frontend:**

```typescript
export const useMarkHabitComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, date, isCompleted }) =>
      axios.post(`/api/habits/${habitId}/complete`, { date, isCompleted }),
    onMutate: async (data) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["completions", "today"] });
      const prev = queryClient.getQueryData(["completions", "today"]);

      // Update cache optimistically
      queryClient.setQueryData(["completions", "today"], (old) => ({
        ...old,
        stats: {
          ...old.stats,
          completed: data.isCompleted
            ? old.stats.completed + 1
            : old.stats.completed - 1,
        },
      }));

      return prev;
    },
    onError: (err, _, context) => {
      // Rollback on error
      queryClient.setQueryData(["completions", "today"], context);
      toast.error("Failed to update habit");
    },
    onSuccess: () => {
      toast.success("Habit completed! 🎉");
    },
  });
};
```

**Estimated Hours:** 6  
**Priority:** P1 (Critical)

---

### Story 3.3: Display Streaks & Motivation

**User Story:** As a user, I want to see my streaks so I'm motivated to maintain consistency

**Acceptance Criteria:**

- [ ] Current streak shown on each habit (e.g., "5 🔥")
- [ ] Streak count large and visually prominent
- [ ] Longest streak shown in habit details
- [ ] Streaks colored/highlighted distinctly
- [ ] Streak resets when habit missed (red indicator)
- [ ] Streak count updates immediately after completion
- [ ] Tooltip shows "5 day streak"
- [ ] Animations on streak increment (celebrate moment)
- [ ] Works on mobile

**Technical Implementation:**

**Frontend:**

```typescript
// StreakDisplay.tsx
function StreakDisplay({ current, longest }) {
  return (
    <div className="streak-display">
      <div className="current-streak">
        <span className="number">{current}</span>
        <span className="emoji">🔥</span>
      </div>
      <div className="longest-streak">
        Best: {longest}
      </div>
    </div>
  );
}
```

**Estimated Hours:** 4  
**Priority:** P1 (Critical)

---

### Story 3.4: Weekly Progress Calendar

**User Story:** As a user, I want to see my weekly progress as a calendar to identify patterns

**Acceptance Criteria:**

- [ ] Dashboard shows 7-day calendar grid (Mon-Sun)
- [ ] Color-coded cells: green=complete, light gray=incomplete
- [ ] Hover tooltip shows date
- [ ] Completion percentage below calendar (e.g., "5/7 days")
- [ ] One row per habit in list view
- [ ] Mobile-responsive: scrollable or stacked
- [ ] Calendar updates when habit marked complete
- [ ] Week navigation (prev/next week buttons)

**Technical Implementation:**

**Backend:**

```typescript
GET /api/completions/weekly?habitId=...&startDate=...
- Returns: { weekStart, weekEnd, completions: [...] }
- Completions include date and isCompleted status
```

**Frontend:**

```typescript
// WeeklyProgressCalendar.tsx
function WeeklyProgressCalendar({ completions }) {
  const completed = completions.filter(c => c.isCompleted).length;

  return (
    <div className="weekly-calendar">
      {completions.map(c => (
        <div key={c.date} className={c.isCompleted ? 'completed' : 'missed'} />
      ))}
      <div className="stats">{completed}/7 days</div>
    </div>
  );
}
```

**Estimated Hours:** 8  
**Priority:** P1 (Critical)

---

### Story 3.5: Dashboard Summary Stats

**User Story:** As a user, I want to see today's summary stats so I understand my progress at a glance

**Acceptance Criteria:**

- [ ] Summary stats displayed prominently
- [ ] Shows: total habits, completed today, completion %, best streak
- [ ] Stats update in real-time when habits marked complete
- [ ] Percentage shown as number + progress bar
- [ ] Mobile-responsive layout
- [ ] Cards/widgets with icons and colors
- [ ] Motivational message: "Great job! [percentage]% done"

**Estimated Hours:** 4  
**Priority:** P1 (Critical)

---

**Epic 3 Total:** 28 hours

---

## Project Summary

### All Epics

| Epic                              | Stories | Hours | Phase    |
| --------------------------------- | ------- | ----- | -------- |
| **Epic 1** - Auth & Onboarding    | 5       | 28h   | Week 1-2 |
| **Epic 2** - Habit Management     | 5       | 26h   | Week 3-4 |
| **Epic 3** - Dashboard & Tracking | 5       | 28h   | Week 5   |
| **Testing & Polish**              | -       | 10h   | Week 6   |

**Total MVP Estimate:** ~92 hours (~3 weeks full-time development)

---

## Technology Stack

**Frontend:**

- React 18+ with TypeScript
- TanStack Query (React Query) for server state
- Zustand for UI state management
- React Router v6 for routing
- React Hook Form for forms
- Tailwind CSS for styling
- Vite for build tool

**Backend:**

- Node.js 18+ with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Zod for validation
- Redis for sessions/caching

**Deployment:**

- Frontend: Vercel (auto-deploy)
- Backend: AWS ECS or Railway
- Database: MongoDB Atlas
- Cache: Redis ElastiCache

---

## Next Steps for Development

1. **Sprint Planning:** Break stories into tasks and assign to developers
2. **Database Setup:** Create MongoDB collections and indexes
3. **API Development:** Build all endpoints for Epic 1
4. **Frontend Setup:** Initialize React project with Vite, install dependencies
5. **Component Development:** Build components for Epic 1 stories
6. **Integration:** Connect frontend to backend APIs
7. **Testing:** Write unit, integration, and E2E tests
8. **Security Audit:** JWT implementation, password hashing, rate limiting
9. **Performance Testing:** Load testing, bundle size optimization
10. **QA & Deploy:** Beta testing, bug fixes, production deployment

---

**Document Version:** 2.0  
**Last Updated:** April 13, 2026  
**Total Stories:** 15 across 3 Epics  
**Status:** Ready for Sprint Planning & Development
