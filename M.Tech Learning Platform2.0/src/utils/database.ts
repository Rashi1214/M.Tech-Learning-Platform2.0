// Database utilities for storing user data
// This can be upgraded to use Supabase Database when connected

export interface UserProfile {
  userId: string;
  totalSessions: number;
  hoursLearned: number;
  skillsAcquired: number;
  avgPerformance: number;
}

export interface Booking {
  id: string;
  userId: string;
  tutorId: number;
  tutorName: string;
  sessionType: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface LearningProgress {
  userId: string;
  weeklyData: Array<{ day: string; hours: number; sessions: number }>;
  monthlyData: Array<{ month: string; score: number }>;
  achievements: Array<{ name: string; description: string; date: string }>;
}

const PROFILES_KEY = 'protutor_profiles';
const BOOKINGS_KEY = 'protutor_bookings';
const PROGRESS_KEY = 'protutor_progress';

export const database = {
  // User Profile Operations
  getUserProfile: (userId: string): UserProfile => {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}');
    return profiles[userId] || {
      userId,
      totalSessions: 0,
      hoursLearned: 0,
      skillsAcquired: 0,
      avgPerformance: 0
    };
  },

  updateUserProfile: (userId: string, updates: Partial<UserProfile>): void => {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}');
    profiles[userId] = { ...profiles[userId], ...updates, userId };
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  },

  // Booking Operations
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    const newBooking: Booking = {
      ...booking,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return newBooking;
  },

  getUserBookings: (userId: string): Booking[] => {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    return bookings.filter((b: Booking) => b.userId === userId);
  },

  updateBooking: (bookingId: string, updates: Partial<Booking>): void => {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    const index = bookings.findIndex((b: Booking) => b.id === bookingId);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    }
  },

  // Learning Progress Operations
  getLearningProgress: (userId: string): LearningProgress => {
    const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    return progress[userId] || {
      userId,
      weeklyData: [
        { day: 'Mon', hours: 0, sessions: 0 },
        { day: 'Tue', hours: 0, sessions: 0 },
        { day: 'Wed', hours: 0, sessions: 0 },
        { day: 'Thu', hours: 0, sessions: 0 },
        { day: 'Fri', hours: 0, sessions: 0 },
        { day: 'Sat', hours: 0, sessions: 0 },
        { day: 'Sun', hours: 0, sessions: 0 }
      ],
      monthlyData: [
        { month: 'Jan', score: 0 },
        { month: 'Feb', score: 0 },
        { month: 'Mar', score: 0 },
        { month: 'Apr', score: 0 },
        { month: 'May', score: 0 },
        { month: 'Jun', score: 0 }
      ],
      achievements: []
    };
  },

  updateLearningProgress: (userId: string, updates: Partial<LearningProgress>): void => {
    const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    progress[userId] = { ...progress[userId], ...updates, userId };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  },

  addAchievement: (userId: string, achievement: { name: string; description: string }): void => {
    const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    if (!progress[userId]) {
      progress[userId] = database.getLearningProgress(userId);
    }
    progress[userId].achievements.push({
      ...achievement,
      date: new Date().toISOString()
    });
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
};

// Initialize demo data for first-time users
export const initializeDemoData = (userId: string): void => {
  // Set demo profile
  database.updateUserProfile(userId, {
    userId,
    totalSessions: 24,
    hoursLearned: 36,
    skillsAcquired: 12,
    avgPerformance: 94
  });

  // Set demo progress
  database.updateLearningProgress(userId, {
    userId,
    weeklyData: [
      { day: 'Mon', hours: 4, sessions: 2 },
      { day: 'Tue', hours: 6, sessions: 3 },
      { day: 'Wed', hours: 5, sessions: 2 },
      { day: 'Thu', hours: 8, sessions: 4 },
      { day: 'Fri', hours: 7, sessions: 3 },
      { day: 'Sat', hours: 3, sessions: 1 },
      { day: 'Sun', hours: 3, sessions: 1 }
    ],
    monthlyData: [
      { month: 'Jan', score: 78 },
      { month: 'Feb', score: 82 },
      { month: 'Mar', score: 85 },
      { month: 'Apr', score: 88 },
      { month: 'May', score: 91 },
      { month: 'Jun', score: 94 }
    ],
    achievements: [
      { name: 'First Session', description: 'Completed your first learning session', date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Quick Learner', description: 'Completed 10 sessions in one month', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Dedicated Student', description: 'Maintained 90+ performance for 30 days', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Skill Master', description: 'Mastered 5 different AI skills', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  });
};
