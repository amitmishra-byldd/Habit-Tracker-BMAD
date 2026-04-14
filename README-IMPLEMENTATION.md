# Story 1.1 Implementation - User Registration

This is the complete implementation of Story 1.1: User Registration from the Developer Habit Tracker.

## Project Structure

```
habbit-tracker/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── models/         # Mongoose schemas
│   │   ├── services/       # Business logic
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, rate limiting
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Password & JWT utilities
│   │   ├── server.ts       # Express app setup
│   │   └── index.ts        # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                # Environment variables
│
└── frontend/               # React/Vite UI
    ├── src/
    │   ├── api/           # API client
    │   ├── store/         # Zustand state management
    │   ├── hooks/         # TanStack Query hooks
    │   ├── pages/         # Page components
    │   ├── components/    # Reusable components
    │   ├── App.tsx        # Main app component
    │   ├── main.tsx       # Entry point
    │   └── index.css      # Tailwind styles
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── .env               # Environment variables
```

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas cloud)

### MongoDB Setup (Local)

If using local MongoDB:

```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Check connection
mongo --version
```

### MongoDB Setup (Cloud - MongoDB Atlas)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Add IP address to network access (0.0.0.0/0 for development)
4. Create a database user
5. Copy the connection string
6. Update `backend/.env` with the connection string

## Installation & Setup

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Verify .env file is present
cat .env

# Should show:
# PORT=5000
# NODE_ENV=development
# MONGODB_URI=mongodb://localhost:27017/habit-tracker
# JWT_SECRET=dev-secret-key-change-in-production
# ... etc
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Verify .env file
cat .env

# Should show:
# VITE_API_URL=http://localhost:5000
# VITE_APP_NAME=Habit Tracker
```

## Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev

# Expected output:
# ✓ MongoDB connected successfully
# ✓ Server running at http://localhost:5000
# ✓ Environment: development
```

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm run dev

# Expected output:
# ➜  Local:   http://localhost:3000
# ➜  Press h to show help
```

### Terminal 3 (Optional): Test API Endpoints

```bash
# Test health check
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@example.com",
    "username": "devuser",
    "password": "SecurePass123!"
  }'

# Expected response:
# {
#   "success": true,
#   "user": {
#     "id": "...",
#     "email": "developer@example.com",
#     "username": "devuser"
#   },
#   "message": "Registration successful"
# }
```

## Testing Story 1.1 in Browser

1. **Open Browser:** Navigate to `http://localhost:3000`
2. **Fill Registration Form:**
   - Email: `newdev@example.com`
   - Username: `newdev123`
   - Password: `SecurePass1!` (meets all requirements)
   - Confirm Password: `SecurePass1!`
3. **Submit Form**
4. **Verify:**
   - ✅ Form validation shows specific error messages for invalid inputs
   - ✅ Success toast appears after registration
   - ✅ Redirected to dashboard after 2 seconds
   - ✅ User data displayed on dashboard

## Testing Password Validation

The password must contain:

- ✅ At least 8 characters
- ✅ One uppercase letter (A-Z)
- ✅ One lowercase letter (a-z)
- ✅ One number (0-9)
- ✅ One special character (!@#$%^&\*, etc.)

**Valid passwords:**

- `SecurePass1!`
- `MyPassword123@`
- `TestP@ss456`

**Invalid passwords:**

- `password` - no uppercase, no number, no special char
- `PASSWORD123!` - no lowercase
- `Secure1!` - only 8 characters, but valid format

## Verifying Database

### Check MongoDB (Local)

```bash
# Connect to MongoDB shell
mongosh

# List databases
show databases

# Select habit-tracker database
use habit-tracker

# Show collections
show collections

# Query users
db.users.find()

# Expected output:
# {
#   "_id": ObjectId("..."),
#   "email": "newdev@example.com",
#   "username": "newdev123",
#   "passwordHash": "$2b$10$...",
#   "isActive": true,
#   "lastLoginAt": null,
#   "createdAt": ISODate("2026-04-13T..."),
#   "updatedAt": ISODate("2026-04-13T...")
# }
```

### Check MongoDB Atlas (Cloud)

1. Log into MongoDB Atlas
2. Go to your cluster
3. Click "Browse Collections"
4. Navigate to `habit-tracker` → `users`
5. Verify user document exists

## Troubleshooting

### "Cannot find module 'react'" Errors

This is normal until dependencies are installed. They disappear after `npm install`.

### "MongoDB connection error"

```
Failed to connect to MongoDB: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**

1. Ensure MongoDB is running: `brew services list | grep mongodb`
2. Or update `MONGODB_URI` in `backend/.env` to use MongoDB Atlas
3. Ensure the connection string is correct

### "Port 5000 already in use"

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in backend/.env
PORT=5001
```

### "Port 3000 already in use"

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in frontend/vite.config.ts
```

### CORS Errors

If you see CORS errors, ensure:

1. `FRONTEND_URL=http://localhost:3000` in `backend/.env`
2. Frontend and backend are running on correct ports
3. API client has `withCredentials: true`

### "Token mismatch" or "Invalid token"

Clear browser storage and try again:

1. Press F12 → Application → Local Storage
2. Delete all items
3. Reload page and try registering again

## Key Implementation Details

### Backend Architecture

- **Express.js** for HTTP routing
- **Mongoose** for MongoDB ODM with schema validation
- **bcryptjs** for password hashing (10 salt rounds)
- **jsonwebtoken** for JWT generation & verification
- **Zod** for request validation
- **express-rate-limit** for rate limiting
- **cors** & **helmet** for security

### Frontend Architecture

- **React 18** with TypeScript for type safety
- **Vite** for fast development builds
- **TanStack Query** for server state management
- **Zustand** for UI state management
- **react-hook-form** for form handling with validation
- **Tailwind CSS** for styling
- **Axios** for HTTP requests

### Key Features

✅ **Password Hashing:** bcrypt with 10 salt rounds  
✅ **JWT Authentication:** 24-hour expiration  
✅ **httpOnly Cookies:** Secure token storage  
✅ **Rate Limiting:** Max 5 registration attempts per minute per IP  
✅ **Input Validation:** Backend (Zod) + Frontend (react-hook-form)  
✅ **Error Handling:** Specific validation messages  
✅ **Responsive Design:** Works on mobile and desktop  
✅ **Auto-redirect:** To dashboard after successful registration

## Next Steps

After Story 1.1, implement:

1. **Story 1.2** - User Login & Session Management
2. **Story 1.3** - Logout & Session Cleanup
3. **Story 1.4** - Protected Routes & Access Control
4. **Story 1.5** - Error Handling & User Feedback
5. **Story 2.x** - Habit Management (CRUD)
6. **Story 3.x** - Dashboard & Tracking

## Documentation Links

- **Architecture:** `_bmad-output/planning-artifacts/architecture.md`
- **Epics & Stories:** `_bmad-output/planning-artifacts/epics-and-stories-complete.md`
- **Implementation Guide:** `_bmad-output/planning-artifacts/story-1-1-implementation-guide.md`

## Support

For issues or questions, refer to:

- Implementation guide for detailed code explanations
- Architecture document for design decisions
- MongoDB documentation for database troubleshooting
