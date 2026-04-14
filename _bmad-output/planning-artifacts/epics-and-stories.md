# Developer Habit Tracker - Epics & User Stories

## Epic 1: User Authentication & Onboarding

**Epic Description:** Enable users to create accounts, securely authenticate, and get started with the application.

**Epic Goals:**

- Users can register with email/password
- Users can securely login/logout
- Authentication state persists across sessions
- Clear error messaging for auth failures
- Smooth onboarding flow to first habit creation

**Technical Scope:**

- JWT-based authentication
- Bcrypt password hashing
- HTTP-only secure cookies
- Session management via Redis
- Frontend auth state with Zustand

---

### Story 1.1: User Registration

**Story Title:** As a developer, I want to create an account with email and password so I can start tracking habits

**Story Description:**
Implement a registration flow that allows new users to create an account with email and password. The system should validate inputs, hash passwords securely, and provide clear feedback on registration success or failure.

**User Journey:**

1. User navigates to registration page
2. User enters email, username, and password
3. User clicks "Sign Up"
4. System validates inputs
5. System creates user account in MongoDB
6. User is redirected to login or directly logged in
7. Success notification shown

**Acceptance Criteria:**

- [ ] AC1: Registration form displays fields for email, username, and password (with confirm password)
- [ ] AC2: Form validation shows real-time errors for:
  - Invalid email format
  - Password < 8 characters
  - Username already taken
  - Email already registered
- [ ] AC3: Password is hashed with bcrypt (salt rounds: 10) before storage
- [ ] AC4: User record created in MongoDB with timestamps
- [ ] AC5: User receives success message and is redirected to login or dashboard
- [ ] AC6: Form has rate limiting (max 5 registration attempts per minute per IP)
- [ ] AC7: Passwords are never logged or exposed in errors
- [ ] AC8: Registration works on mobile and desktop

**Technical Notes:**

**Backend:**

- Endpoint: `POST /api/auth/register`
- Request body: `{ email, username, password }`
- Response: `{ success, user: { id, email, username }, message }`
- Validation: Use Zod for schema validation
- Use Mongoose User model with email/username unique indexes
- Hash password with bcrypt before saving

**Frontend:**

- Component: `RegisterPage.tsx`
- Form validation with react-hook-form
- Input sanitization before submission
- Error state managed with Zustand `useAuthStore`
- Loading state during API call
- No Redux needed - keep state in Zustand

```typescript
// Frontend state store
export const useAuthStore = create((set) => ({
  isLoading: false,
  error: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
```

**Dependencies:**

- bcrypt (hashing)
- Zod (validation)
- react-hook-form (form management)
- axios (API calls)

**Testing:**

- Unit: Password hashing, validation logic
- Integration: Full registration flow with test database
- E2E: User registers → sees success → can login

**Definition of Done:**

- Code reviewed and merged to main
- All acceptance criteria met
- Unit and integration tests passing (>80% coverage)
- No console errors
- Form accessibility tested (keyboard nav, screen reader)
- Error handling tested for edge cases

---

### Story 1.2: User Login & Session Management

**Story Title:** As a returning developer, I want to securely login to my account so I can access my habit tracking dashboard

**Story Description:**
Implement a secure login flow that authenticates users with email/password, generates JWT tokens, manages sessions, and maintains authentication state across browser sessions.

**User Journey:**

1. User navigates to login page
2. User enters email and password
3. User clicks "Login"
4. System validates credentials
5. System generates JWT and stores in httpOnly cookie
6. User is redirected to dashboard
7. Dashboard shows user's habits

**Acceptance Criteria:**

- [ ] AC1: Login form displays email and password fields
- [ ] AC2: Form shows clear error messages for:
  - Invalid credentials
  - Account not found
  - Account inactive
- [ ] AC3: Successful login generates JWT token
- [ ] AC4: JWT stored in httpOnly, Secure, SameSite cookie
- [ ] AC5: User redirected to dashboard (or previous page if accessing protected route)
- [ ] AC6: Authentication state persists across page refreshes
- [ ] AC7: "Remember me" checkbox stores credentials for 7 days (optional for MVP)
- [ ] AC8: Rate limiting on login (max 5 attempts per minute per IP)
- [ ] AC9: JWT expires after 24 hours
- [ ] AC10: Login works on mobile and desktop

**Technical Notes:**

**Backend:**

- Endpoint: `POST /api/auth/login`
- Request body: `{ email, password }`
- Response: `{ success, user: { id, email, username }, token }`
- Compare password with bcrypt.compare()
- Generate JWT with userId and email
- JWT signed with JWT_SECRET, expires in 24 hours
- Rate limiter middleware on auth endpoints

**Frontend:**

- Component: `LoginPage.tsx`
- Form managed with react-hook-form
- Zustand store tracks auth state:
  - `isAuthenticated`
  - `user` object
  - `isLoading`
  - `error`
- On successful login, store user + token in Zustand
- Redirect via React Router after successful auth
- Protected routes check `useAuthStore` for auth status

```typescript
// Backend JWT generation
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET!,
  { expiresIn: "24h" },
);

// Set httpOnly cookie
res.cookie("auth_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
});
```

**Dependencies:**

- jsonwebtoken (JWT creation)
- bcrypt (password comparison)
- Zod (validation)
- react-hook-form (form management)
- axios (API calls with credentials)

**Testing:**

- Unit: JWT generation, expiration, bcrypt compare
- Integration: Full login flow, session persistence
- E2E: Login → navigate → page refresh → still authenticated

**Definition of Done:**

- Code reviewed and merged
- All acceptance criteria met
- Unit and integration tests passing
- Session persists across browser refresh
- Logout clears session
- Protected routes redirect unauthenticated users to login

---

### Story 1.3: Logout & Session Cleanup

**Story Title:** As a user, I want to securely logout so my session is terminated

**Story Description:**
Implement a logout function that clears user session, invalidates JWT tokens, and redirects to login/home page.

**Acceptance Criteria:**

- [ ] AC1: Logout button visible in navbar (when authenticated)
- [ ] AC2: Clicking logout calls `POST /api/auth/logout`
- [ ] AC3: Server clears session from Redis cache
- [ ] AC4: Server invalidates JWT token (adds to blacklist if implemented)
- [ ] AC5: Frontend clears Zustand auth store
- [ ] AC6: User redirected to login page
- [ ] AC7: Protected routes are no longer accessible after logout
- [ ] AC8: Subsequent API calls fail with 401 Unauthorized

**Technical Notes:**

**Backend:**

- Endpoint: `POST /api/auth/logout`
- Clear JWT cookie: `res.clearCookie('auth_token')`
- Remove user session from Redis
- Response: `{ success, message }`

**Frontend:**

- Zustand action: `logout()` clears auth state
- API call to `/api/auth/logout`
- Navigate to login page via React Router
- Remove user from local store

```typescript
// Zustand logout action
const useAuthStore = create((set) => ({
  logout: () => set({ isAuthenticated: false, user: null, error: null }),
}));
```

**Testing:**

- Integration: Logout → protected route returns 401
- E2E: Login → logout → try to access dashboard → redirect to login

**Definition of Done:**

- Code reviewed
- All tests passing
- Session completely cleared
- Can immediately re-login

---

### Story 1.4: Protected Routes & Access Control

**Story Title:** As the system, I want to protect routes so only authenticated users can access the dashboard

**Story Description:**
Implement route protection and middleware that ensures only authenticated users can access protected pages. Unauthenticated users are redirected to login.

**Acceptance Criteria:**

- [ ] AC1: Dashboard route `/dashboard` requires authentication
- [ ] AC2: Settings route `/settings` requires authentication
- [ ] AC3: Unauthenticated users accessing protected routes redirected to login
- [ ] AC4: After successful login, user redirected to originally requested page
- [ ] AC5: Public routes (home, login, register) accessible without auth
- [ ] AC6: Invalid/expired JWT tokens redirect to login
- [ ] AC7: 401 errors show login prompt

**Technical Notes:**

**Frontend:**

- Component: `ProtectedRoute.tsx`
- Checks Zustand `useAuthStore.isAuthenticated`
- If not authenticated, redirects to `/login`
- If authenticated, renders protected component

```typescript
// ProtectedRoute.tsx
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route definition
<Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>} path="/dashboard" />
```

**Backend:**

- Middleware: `authMiddleware.ts` validates JWT on protected endpoints
- Returns 401 if token invalid/expired
- Attaches userId to request object for use in controllers

**Testing:**

- Unit: Auth middleware JWT validation
- E2E: Access protected route without login → redirect
- E2E: Login → access protected route → success

**Definition of Done:**

- All protected routes verified
- Tests passing
- Redirect flow working

---

### Story 1.5: Error Handling & User Feedback

**Story Title:** As a user, I want clear error messages when authentication fails so I understand what went wrong

**Story Description:**
Implement user-friendly error messages and feedback for all authentication scenarios (invalid credentials, duplicate email, server errors, etc.).

**Acceptance Criteria:**

- [ ] AC1: Registration errors display with specific messages:
  - "Email already registered"
  - "Username taken"
  - "Password too short (min 8 characters)"
  - "Invalid email format"
- [ ] AC2: Login errors display with specific messages:
  - "Invalid email or password"
  - "Account not found"
  - "Too many login attempts"
- [ ] AC3: Server errors (500) show generic "Something went wrong" message (don't expose details)
- [ ] AC4: Network errors show retry option
- [ ] AC5: Error messages display for 5 seconds then auto-dismiss
- [ ] AC6: Form keeps data when error occurs (so user doesn't re-enter)
- [ ] AC7: Success messages also shown (green toast)
- [ ] AC8: Errors are logged client-side but not exposed to user

**Technical Notes:**

**Frontend:**

- Use toast/notification library (react-toastify or similar)
- Zustand store tracks error state
- Display errors near form or in toast notification
- Errors auto-dismiss after 5 seconds

```typescript
// Error handling in Zustand
const useAuthStore = create((set) => ({
  showError: (message) => {
    set({ error: message });
    setTimeout(() => set({ error: null }), 5000);
  },
}));
```

**Backend:**

- Validate inputs and return specific error codes
- Never expose database/system errors to client
- Log detailed errors server-side for debugging

**Testing:**

- Unit: Error message formatting
- E2E: Trigger various errors → verify messages displayed

---

## Epic Acceptance Criteria (Epic 1)

**The entire Epic 1 is considered complete when:**

- [ ] Users can register with email/password
- [ ] Users can login securely
- [ ] Users can logout
- [ ] Authentication state persists across sessions
- [ ] Protected routes work correctly
- [ ] All auth errors handled gracefully
- [ ] Security best practices implemented (bcrypt, JWT, httpOnly cookies, rate limiting)
- [ ] All stories tested and integrated
- [ ] Zero security vulnerabilities found in auth flow
- [ ] Form accessibility meets WCAG 2.1 AA

---

## Technical Architecture for Epic 1

### Database Schema (MongoDB)

```typescript
// User document structure
{
  _id: ObjectId,
  email: String (unique, required),
  username: String (unique, required),
  passwordHash: String (required),
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  isActive: Boolean,
}
```

### API Endpoints

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/logout          - Logout user (clear session)
GET    /api/auth/me              - Get current user (requires auth)
```

### Frontend State (Zustand)

```typescript
interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  logout: () => void;
}
```

### Security Checklist

- [ ] Passwords hashed with bcrypt (10 salt rounds)
- [ ] JWT stored in httpOnly, Secure, SameSite cookie
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on backend (never trust client)
- [ ] HTTPS only in production
- [ ] CORS configured correctly
- [ ] No sensitive data in JWT payload
- [ ] Session timeout after 24 hours
- [ ] Logout properly clears cookies

---

## Dependencies Added for Epic 1

**Backend:**

```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.0",
  "zod": "^3.22.0",
  "express-rate-limit": "^7.0.0",
  "cookie-parser": "^1.4.6"
}
```

**Frontend:**

```json
{
  "zustand": "^4.4.0",
  "react-hook-form": "^7.47.0",
  "react-toastify": "^9.1.3",
  "axios": "^1.6.0"
}
```

---

## Story Estimation & Priority

| Story                 | Priority       | Complexity | Estimated Hours |
| --------------------- | -------------- | ---------- | --------------- |
| 1.1: Registration     | P1 (Critical)  | Medium     | 8               |
| 1.2: Login            | P1 (Critical)  | Medium     | 8               |
| 1.3: Logout           | P1 (Critical)  | Low        | 4               |
| 1.4: Protected Routes | P1 (Critical)  | Low        | 4               |
| 1.5: Error Handling   | P2 (Important) | Low        | 4               |

**Total Epic 1 Estimate:** ~28 hours

---

## Definition of Done (for all stories in Epic 1)

- [ ] Code peer reviewed and approved
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] No console errors or warnings
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] Performance acceptable (< 200ms response time)
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Merged to main branch
- [ ] Deployed to staging for QA

---

## Notes for Development Team

1. **Zustand Best Practices:** Keep auth store minimal - only store authenticated user and auth state, not local UI state
2. **Security First:** Never store passwords in any form except hashed in database
3. **Error Messages:** Be specific enough to help users but generic enough not to leak system info
4. **Mobile First:** Design forms to work well on mobile from the start
5. **Testing:** Write tests as you code, not after
6. **Database:** Add indexes to email and username fields for fast lookups

---

---

# Epic 2: Habit Management (CRUD & Core Features)

**Epic Description:** Enable users to create, read, update, and delete habits. This is the core feature of the application where users manage their daily tracking goals.

**Epic Goals:**

- Users can create new habits with name, description, and category
- Users can view all their habits
- Users can edit habit details
- Users can archive/delete habits
- Habits are organized by category
- Quick access to habit management from dashboard

**Technical Scope:**

- Habit CRUD endpoints (REST API)
- MongoDB Habit schema with validation
- TanStack Query for data fetching and caching
- Zustand for UI state (modals, filters)
- Habit form component (reusable for create/edit)
- Habit list/grid display

---

### Story 2.1: Create New Habit

**Story Title:** As a developer, I want to create a new habit so I can start tracking it

**Story Description:**
Implement functionality to create a new habit with name, description, and category. Users should be able to add habits from the dashboard via a modal form with real-time validation.

**User Journey:**

1. User clicks "Add Habit" button on dashboard
2. Modal opens with habit form
3. User enters habit name (required), description (optional), category (dropdown)
4. User clicks "Create"
5. Habit is saved to database
6. Modal closes, new habit appears in list
7. Success toast shown

**Acceptance Criteria:**

- [ ] AC1: "Add Habit" button visible and clickable on dashboard
- [ ] AC2: Modal form displays fields:
  - Habit name (required, max 100 chars)
  - Description (optional, max 500 chars)
  - Category dropdown (DSA, Projects, Learning, Other)
- [ ] AC3: Form validation shows errors for:
  - Empty habit name
  - Duplicate habit name for same user
  - Name exceeds 100 characters
- [ ] AC4: Form has "Create" and "Cancel" buttons
- [ ] AC5: On submit, POST request sent to `/api/habits`
- [ ] AC6: New habit added to TanStack Query cache immediately (optimistic update)
- [ ] AC7: Modal closes after successful creation
- [ ] AC8: Success toast shows "Habit created: [name]"
- [ ] AC9: User can create multiple habits
- [ ] AC10: Form works on mobile and desktop

**Technical Notes:**

**Backend:**

- Endpoint: `POST /api/habits`
- Request body: `{ name, description?, category }`
- Validates user is authenticated (middleware)
- Uses Mongoose Habit model with validation
- Enforces unique constraint: `(userId, name)`
- Returns: `{ success, habit: { id, name, description, category, createdAt } }`

```typescript
// Backend route
router.post("/habits", authMiddleware, async (req, res) => {
  const { name, description, category } = req.body;
  const userId = req.user.id; // From JWT

  // Validate
  if (!name || name.length > 100)
    return res.status(400).json({ error: "Invalid name" });

  // Create
  const habit = await Habit.create({
    userId,
    name,
    description: description || null,
    category: category || "Other",
  });

  res.status(201).json({ success: true, habit });
});
```

**Frontend:**

- Component: `AddHabitModal.tsx`
- Form managed with react-hook-form
- Zustand store: `useHabitUIStore` tracks `showAddModal`
- TanStack Query mutation: `useMutation` for POST request

```typescript
// Frontend hook with TanStack Query
export const useCreateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHabit) => axios.post("/api/habits", newHabit),
    onSuccess: (data) => {
      // Invalidate and refetch habits list
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      // Close modal
      useHabitUIStore.setState({ showAddModal: false });
      // Show success toast
      toast.success(`Habit created: ${data.data.habit.name}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to create habit");
    },
  });
};

// Zustand for UI state
export const useHabitUIStore = create((set) => ({
  showAddModal: false,
  showEditModal: false,
  selectedHabitId: null,
  setShowAddModal: (show) => set({ showAddModal: show }),
  setSelectedHabitId: (id) => set({ selectedHabitId: id }),
}));
```

**Dependencies:**

- react-hook-form (form management)
- TanStack Query (data fetching)
- Zustand (UI state)
- react-toastify (notifications)

**Testing:**

- Unit: Form validation logic
- Integration: Create habit → appears in list
- E2E: Click "Add Habit" → fill form → submit → success toast → habit visible

**Definition of Done:**

- Code reviewed
- All acceptance criteria met
- Tests passing (>80% coverage)
- No console errors
- Optimistic updates working
- Form validation thorough

---

### Story 2.2: View All Habits

**Story Title:** As a user, I want to see all my habits so I can manage them

**Story Description:**
Display all user habits in a list or grid view with habit details (name, category, current streak). Load habits from database on dashboard mount and keep synchronized.

**Acceptance Criteria:**

- [ ] AC1: Dashboard loads and displays user's habits
- [ ] AC2: Each habit shows:
  - Habit name
  - Description (if exists)
  - Category badge/tag
  - Current streak count
  - Last completed date
- [ ] AC3: Habits grouped by category (optional, nice-to-have)
- [ ] AC4: Archived habits hidden by default
- [ ] AC5: Show empty state if no habits: "No habits yet. Create one to get started!"
- [ ] AC6: List/grid view toggle (optional)
- [ ] AC7: Loading spinner while fetching habits
- [ ] AC8: Handles errors gracefully: "Failed to load habits"
- [ ] AC9: Habits update in real-time when created/updated
- [ ] AC10: Works on mobile and desktop

**Technical Notes:**

**Backend:**

- Endpoint: `GET /api/habits?archived=false`
- Query params: `archived` (boolean), `category` (string)
- Returns: `{ habits: [ { id, name, description, category, currentStreak, lastCompletedDate } ] }`
- Joins with Streaks collection for current streak

```typescript
router.get("/habits", authMiddleware, async (req, res) => {
  const { archived, category } = req.query;
  const filter = { userId: req.user.id, isArchived: archived === "true" };

  if (category) filter.category = category;

  const habits = await Habit.find(filter).lean();
  const streaks = await Streak.find({
    habitId: { $in: habits.map((h) => h._id) },
  }).lean();

  const habitsWithStreaks = habits.map((habit) => ({
    ...habit,
    currentStreak:
      streaks.find((s) => s.habitId === habit._id)?.currentStreak || 0,
  }));

  res.json({ habits: habitsWithStreaks });
});
```

**Frontend:**

- Component: `HabitList.tsx` / `HabitGrid.tsx`
- TanStack Query hook: `useQuery` to fetch habits

```typescript
export const useHabits = () => {
  return useQuery({
    queryKey: ['habits'],
    queryFn: () => axios.get('/api/habits').then(r => r.data.habits),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Component
function HabitList() {
  const { data: habits, isLoading, isError } = useHabits();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;
  if (!habits?.length) return <EmptyState />;

  return (
    <div className="habit-list">
      {habits.map(habit => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
}
```

**Testing:**

- Unit: Empty state rendering
- Integration: Fetch habits → display list
- E2E: Login → dashboard loads → habits visible

---

### Story 2.3: Edit Habit

**Story Title:** As a user, I want to edit habit details so I can keep them up-to-date

**Story Description:**
Allow users to modify habit name, description, and category. Clicking edit on a habit opens a pre-filled form in a modal.

**Acceptance Criteria:**

- [ ] AC1: Edit button visible on each habit card
- [ ] AC2: Clicking edit opens modal with pre-filled form
- [ ] AC3: Form fields editable:
  - Name (max 100 chars)
  - Description (max 500 chars)
  - Category dropdown
- [ ] AC4: "Update" and "Cancel" buttons in modal
- [ ] AC5: Form validation same as create (no empty name, etc.)
- [ ] AC6: On submit, PATCH request to `/api/habits/:id`
- [ ] AC7: Updated habit shown immediately in list (optimistic update)
- [ ] AC8: Modal closes after update
- [ ] AC9: Success toast: "Habit updated: [name]"
- [ ] AC10: Can't update to duplicate name for same user

**Technical Notes:**

**Backend:**

- Endpoint: `PATCH /api/habits/:id`
- Request body: `{ name?, description?, category? }`
- Verify user owns habit before updating
- Returns updated habit object

```typescript
router.patch("/habits/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updates = req.body;

  const habit = await Habit.findByIdAndUpdate(
    { _id: id, userId }, // Only update if user owns it
    updates,
    { new: true, runValidators: true },
  );

  if (!habit) return res.status(404).json({ error: "Habit not found" });
  res.json({ success: true, habit });
});
```

**Frontend:**

- Reuse `AddHabitModal` as `EditHabitModal` or make generic
- Pre-fill form with existing habit data
- TanStack Query mutation for PATCH

**Testing:**

- Edit habit → verify changes saved
- Try duplicate name → error
- Verify only owner can edit

---

### Story 2.4: Archive/Delete Habit

**Story Title:** As a user, I want to archive or delete habits I no longer track

**Story Description:**
Provide soft-delete (archive) functionality so users can hide habits without losing history. Also support permanent delete if needed.

**Acceptance Criteria:**

- [ ] AC1: Archive button on each habit card
- [ ] AC2: Confirmation dialog: "Archive [habit name]? You can restore it later."
- [ ] AC3: Archiving moves habit to "Archived" section (optional view)
- [ ] AC4: Archived habits hidden from main list
- [ ] AC5: Restore button to un-archive habit
- [ ] AC6: Delete button for permanent removal (optional)
- [ ] AC7: Delete confirmation: "Permanently delete [habit]? This cannot be undone."
- [ ] AC8: Delete also deletes associated completions
- [ ] AC9: Success toast: "Habit archived" or "Habit deleted"
- [ ] AC10: Habit immediately removed from list

**Technical Notes:**

**Backend:**

- Endpoint: `PATCH /api/habits/:id/archive` (sets `isArchived: true`)
- Endpoint: `DELETE /api/habits/:id` (permanent delete)
- Archive is soft-delete (data preserved for history)
- Delete is hard-delete (cascade delete completions and streaks)

```typescript
// Archive
router.patch("/habits/:id/archive", authMiddleware, async (req, res) => {
  const habit = await Habit.findByIdAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { isArchived: true },
    { new: true },
  );
  res.json({ success: true, habit });
});

// Permanent delete
router.delete("/habits/:id", authMiddleware, async (req, res) => {
  const habit = await Habit.findByIdAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  // Cascade delete
  await HabitCompletion.deleteMany({ habitId: req.params.id });
  await Streak.deleteMany({ habitId: req.params.id });

  res.json({ success: true });
});
```

**Testing:**

- Archive habit → disappears from list
- View archived → habit visible
- Restore → reappears in main list
- Delete → permanent removal

---

### Story 2.5: Habit Categories & Organization

**Story Title:** As a user, I want to organize habits by category so I can group related activities

**Story Description:**
Support habit categories (DSA, Projects, Learning, Other) with filtering and visual indicators (color badges/tags).

**Acceptance Criteria:**

- [ ] AC1: Category dropdown available in create/edit forms with predefined options
- [ ] AC2: Each habit shows category badge/tag with color
- [ ] AC3: Filter by category available on dashboard
- [ ] AC4: Category colors consistent (DSA=blue, Projects=green, Learning=orange, Other=gray)
- [ ] AC5: "All Categories" filter shows all habits
- [ ] AC6: Empty state when filtered category has no habits
- [ ] AC7: Category counts shown (optional): "DSA (3), Projects (2)"

**Technical Notes:**

**Frontend:**

- Define category constants with colors
- TanStack Query filtered queries by category
- Zustand tracks selected category filter

```typescript
// Category constants
const HABIT_CATEGORIES = {
  DSA: { label: "DSA", color: "bg-blue-500" },
  Projects: { label: "Projects", color: "bg-green-500" },
  Learning: { label: "Learning", color: "bg-orange-500" },
  Other: { label: "Other", color: "bg-gray-500" },
};

// Zustand filter state
const useHabitUIStore = create((set) => ({
  selectedCategory: "All",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
```

**Testing:**

- Create habits in different categories
- Filter by category → only show selected
- Verify colors consistent

---

## Epic 2 Acceptance Criteria

**The entire Epic 2 is considered complete when:**

- [ ] Users can create habits with name, description, category
- [ ] Users can view all habits in organized list
- [ ] Users can edit habit details
- [ ] Users can archive/delete habits
- [ ] Habits are filterable by category
- [ ] All CRUD operations reflected immediately in UI (optimistic updates)
- [ ] Validation errors handled gracefully
- [ ] TanStack Query caching working correctly
- [ ] Zustand UI state management functional
- [ ] Zero data loss scenarios (soft-delete for archive)
- [ ] All tests passing (>80% coverage)

---

## Epic 2 Technical Summary

### Database Schema (MongoDB)

```typescript
// Habit document
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String (required),
  description: String,
  category: String (enum: ['DSA', 'Projects', 'Learning', 'Other']),
  isArchived: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date,
}

// Indexes
Habit.index({ userId: 1, isArchived: 1 });
Habit.index({ userId: 1, name: 1 }, { unique: true });
```

### API Endpoints

```
GET    /api/habits              - List user's habits (with filters)
POST   /api/habits              - Create new habit
GET    /api/habits/:id          - Get habit details
PATCH  /api/habits/:id          - Update habit
PATCH  /api/habits/:id/archive  - Archive habit
DELETE /api/habits/:id          - Delete habit permanently
```

### Frontend State (Zustand)

```typescript
interface HabitUIStore {
  showAddModal: boolean;
  showEditModal: boolean;
  selectedHabitId: string | null;
  selectedCategory: string;
  setShowAddModal: (show: boolean) => void;
  setShowEditModal: (show: boolean) => void;
  setSelectedHabitId: (id: string | null) => void;
  setSelectedCategory: (category: string) => void;
}
```

### TanStack Query Hooks

```typescript
- useHabits() → GET /api/habits
- useCreateHabit() → POST /api/habits
- useUpdateHabit(id) → PATCH /api/habits/:id
- useArchiveHabit(id) → PATCH /api/habits/:id/archive
- useDeleteHabit(id) → DELETE /api/habits/:id
```

---

## Story Estimation & Priority (Epic 2)

| Story               | Priority       | Complexity | Estimated Hours |
| ------------------- | -------------- | ---------- | --------------- |
| 2.1: Create Habit   | P1 (Critical)  | Medium     | 6               |
| 2.2: View Habits    | P1 (Critical)  | Low        | 4               |
| 2.3: Edit Habit     | P1 (Critical)  | Medium     | 6               |
| 2.4: Archive/Delete | P1 (Critical)  | Medium     | 6               |
| 2.5: Categories     | P2 (Important) | Low        | 4               |

**Total Epic 2 Estimate:** ~26 hours

---

## Dependencies for Epic 2

**Backend:**

```json
{
  "mongoose": "^7.6.0"
}
```

**Frontend:**

```json
{
  "@tanstack/react-query": "^5.28.0",
  "zustand": "^4.4.0",
  "react-hook-form": "^7.47.0",
  "react-toastify": "^9.1.3"
}
```

---

**Document Version:** 1.1  
**Last Updated:** April 13, 2026  
**Status:** Ready for Sprint Planning
