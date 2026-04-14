# Developer Habit Tracker – UX Design Document

## 1. User Flow

1. **Registration**: New users sign up with username, email, and password.
2. **Login**: Existing users log in with email and password.
3. **Dashboard**: Authenticated users land on the dashboard, see a welcome message and their habit list.
4. **Habit Management**:
   - Add new habit (modal/form)
   - View, edit, archive, restore, or delete habits
   - See feedback for all actions

---

## 2. Screens & Layouts

### 2.1 Register Page

- **Layout**: Centered card, vertical stack
- **Components**:
  - App logo/title
  - Input fields: Username, Email, Password
  - Register button
  - Link to Login
- **States**:
  - Loading: Button shows spinner/disabled
  - Error: Inline error message or toast
  - Success: Redirect to dashboard, show toast

### 2.2 Login Page

- **Layout**: Centered card, vertical stack
- **Components**:
  - App logo/title
  - Input fields: Email, Password
  - Login button
  - Link to Register
- **States**:
  - Loading: Button shows spinner/disabled
  - Error: Inline error message or toast
  - Success: Redirect to dashboard, show toast

### 2.3 Dashboard Page

- **Layout**: Responsive container, max-width, vertical stack
- **Components**:
  - Header: App title, Logout button
  - Welcome card: Username, email
  - Habit section:
    - "Add Habit" button (opens modal)
    - HabitList (cards or list items)
- **States**:
  - Loading: Skeletons or spinner
  - Empty: "No habits yet. Start by adding one!"
  - Error: Toast or inline error

### 2.4 Create/Edit Habit Modal/Form

- **Layout**: Centered modal overlay
- **Components**:
  - Title: "Add Habit" or "Edit Habit"
  - Input fields: Name, Description, Category (select)
  - Actions: Cancel, Save/Add
- **States**:
  - Loading: Save/Add button shows spinner/disabled
  - Error: Inline error or toast
  - Success: Modal closes, toast shown

### 2.5 Habit List UI

- **Layout**: List or cards, vertical stack
- **Components**:
  - Habit card/item:
    - Name, category, description
    - Status (archived badge)
    - Actions: Edit, Archive/Restore, Delete
- **States**:
  - Loading: Skeletons or spinner
  - Empty: "No habits yet."
  - Error: Toast or inline error

---

## 3. UX Behavior

- **Success/Error Feedback**:
  - Use toast notifications for all actions (login, register, CRUD)
  - Inline errors for form validation
- **Loading States**:
  - Show loading spinner or skeletons for API calls
  - Disable buttons during loading
- **Empty States**:
  - Friendly message and illustration/icon
  - Prompt to add first habit
- **Form Validation**:
  - Show inline errors for required fields, invalid input
- **Accessibility**:
  - All buttons and inputs accessible by keyboard
  - Sufficient color contrast

---

## 4. UI Style Guide

- **Theme**: Minimal, developer-focused, light mode
- **Colors**: Neutral grays, blue accents (Tailwind: `gray-800`, `gray-100`, `blue-600`)
- **Typography**: Sans-serif, clear hierarchy, monospace for code/labels
- **Spacing**: Generous padding/margin, whitespace
- **Borders**: Subtle rounded corners (`rounded`, `rounded-lg`)
- **Shadows**: Soft card shadows (`shadow`, `shadow-lg`)
- **Buttons**: Prominent, filled for primary actions, subtle for secondary
- **Inputs**: Clean, focus ring, clear labels
- **Modals**: Centered, overlay, focus trap
- **Icons**: Simple SVG or Heroicons

---

## 5. Component Breakdown

### Reusable Components

- **Button**: Primary, secondary, loading
- **Input**: Text, password, textarea, select
- **Modal**: Overlay, focus trap
- **Toast**: Success/error notifications
- **HabitCard/HabitListItem**: Displays habit info and actions
- **FormField**: Label + input + error
- **Loader/Skeleton**: For loading states

### Page Components

- **RegisterForm**
- **LoginForm**
- **DashboardHeader**
- **HabitList**
- **AddHabitModal**
- **EditHabitModal**

---

## 6. Practical Implementation Notes

- Use Tailwind CSS utility classes for all layout and styling
- Keep all forms accessible and keyboard-friendly
- Use Zustand for UI state (modals, toasts)
- Use TanStack Query for all data fetching and mutations
- Keep all feedback instant and clear
- All components should be easily composable and reusable

---

## 7. Example Layout Sketches (ASCII)

### Register/Login Page

```
+-----------------------------+
|   [App Logo]                |
|   Register / Login          |
|   [ Username ]              |
|   [ Email ]                 |
|   [ Password ]              |
|   [ Register/Login Button ] |
|   [ Link to Login/Register ]|
+-----------------------------+
```

### Dashboard

```
+---------------------------------------------------+
| Dashboard        [Logout]                         |
+---------------------------------------------------+
| Welcome, username (email)                         |
+---------------------------------------------------+
| [ + Add Habit ]                                   |
|                                                   |
| [Habit 1] [Edit] [Archive] [Delete]               |
| [Habit 2] [Edit] [Restore] [Delete]               |
| ...                                               |
| [No habits yet. Start by adding one!]             |
+---------------------------------------------------+
```

### Add/Edit Habit Modal

```
+-----------------------------+
|  Add/Edit Habit             |
|  [ Name        ]            |
|  [ Description ]            |
|  [ Category v ]             |
|  [Cancel]   [Save/Add]      |
+-----------------------------+
```

---

> This document is ready for direct implementation in React + Tailwind. All components and states are clearly defined for a modern, developer-focused UX.
