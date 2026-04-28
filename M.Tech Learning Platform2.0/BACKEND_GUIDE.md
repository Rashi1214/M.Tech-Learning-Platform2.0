# ProTutor2.0 Backend Guide

## Current Backend Implementation

ProTutor2.0 currently uses **LocalStorage-based backend** for data persistence. This works entirely in the browser without requiring a server.

### Features Implemented

✅ **Authentication System**
- User Sign Up / Sign In
- Session Management
- Password Storage (mock implementation)
- User Profile Management

✅ **Database Operations**
- User Profiles (stats, performance metrics)
- Booking Management
- Learning Progress Tracking
- Achievement System

✅ **Data Persistence**
All data is stored in the browser's LocalStorage:
- `protutor_users` - User accounts
- `protutor_session` - Current user session
- `protutor_profiles` - User profile data
- `protutor_bookings` - Session bookings
- `protutor_progress` - Learning progress and achievements

## How It Works

### Authentication Flow
1. User signs up → Creates account in LocalStorage
2. User signs in → Validates credentials and creates session
3. User navigates → Session checked on protected routes
4. User signs out → Session cleared

### Data Flow
1. **Sign In/Sign Up** → Creates user account with demo data
2. **Book Session** → Saves booking to LocalStorage
3. **Dashboard** → Loads all user data from LocalStorage
4. **Download Report** → Exports data as JSON

## Files Structure

```
src/
├── utils/
│   ├── auth.ts           # Authentication utilities
│   └── database.ts       # Database operations
└── app/
    └── components/
        ├── SignInPage.tsx    # Authentication UI
        ├── Dashboard.tsx     # User dashboard with data
        ├── BookingPage.tsx   # Session booking
        └── UserMenu.tsx      # User profile menu
```

## Upgrading to Supabase

To upgrade to a real backend with Supabase:

### Step 1: Connect Supabase
Click the "Connect Supabase" button that was presented in the chat.

### Step 2: Create Database Tables

```sql
-- Users table (handled by Supabase Auth)
-- No need to create manually

-- User Profiles
CREATE TABLE user_profiles (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  total_sessions INTEGER DEFAULT 0,
  hours_learned INTEGER DEFAULT 0,
  skills_acquired INTEGER DEFAULT 0,
  avg_performance INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  tutor_id INTEGER,
  tutor_name TEXT,
  session_type TEXT,
  date DATE,
  time TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Progress
CREATE TABLE learning_progress (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  weekly_data JSONB,
  monthly_data JSONB,
  achievements JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 3: Update Code to Use Supabase

Replace LocalStorage calls with Supabase queries:

```typescript
// Before (LocalStorage)
const users = JSON.parse(localStorage.getItem('protutor_users') || '[]');

// After (Supabase)
const { data: users } = await supabase
  .from('user_profiles')
  .select('*');
```

### Step 4: Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Similar policies for bookings and learning_progress
```

## Benefits of Supabase Upgrade

1. **Real Database** - PostgreSQL database instead of LocalStorage
2. **Multi-Device Sync** - Access your data from any device
3. **Security** - Row Level Security protects user data
4. **Scalability** - Handles thousands of concurrent users
5. **Real-time** - Live updates across devices
6. **OAuth** - Google, GitHub, etc. authentication
7. **Storage** - File uploads for profile pictures, documents

## Testing the Current Backend

### 1. Create an Account
- Go to `/signin`
- Toggle to "Sign Up"
- Enter: Name, Email, Password
- Demo data is automatically created

### 2. Book a Session
- Navigate to `/booking`
- Choose session type, date, time
- Complete booking
- Check Dashboard to see the booking

### 3. View Dashboard
- Go to `/dashboard`
- See your stats, progress, bookings
- Download report as JSON

### 4. Sign Out
- Click user avatar in top right
- Select "Sign Out"
- Session cleared

## API Documentation

### `auth.ts`
```typescript
auth.signUp(email, password, name) → Promise<User>
auth.signIn(email, password) → Promise<User>
auth.signOut() → Promise<void>
auth.getCurrentUser() → User | null
auth.isAuthenticated() → boolean
```

### `database.ts`
```typescript
database.getUserProfile(userId) → UserProfile
database.updateUserProfile(userId, updates)
database.createBooking(booking) → Booking
database.getUserBookings(userId) → Booking[]
database.updateBooking(bookingId, updates)
database.getLearningProgress(userId) → LearningProgress
database.updateLearningProgress(userId, updates)
database.addAchievement(userId, achievement)
initializeDemoData(userId) → void
```

## Notes

⚠️ **Current Limitations:**
- Data only persists in browser (cleared if cache cleared)
- No server-side validation
- Passwords stored in plain text (mock only)
- No email verification
- Single-device only

✨ **Production Ready When:**
- Connected to Supabase
- RLS policies enabled
- OAuth configured
- Email verification enabled
- File storage configured
