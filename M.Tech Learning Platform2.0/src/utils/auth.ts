// Authentication utilities
// This can be upgraded to use Supabase Auth when connected

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock user database (would be replaced with Supabase)
const USERS_KEY = 'protutor_users';
const SESSION_KEY = 'protutor_session';

export const auth = {
  // Sign up new user
  signUp: async (email: string, password: string, name: string): Promise<User> => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

    // Check if user exists
    if (users.find((u: User) => u.email === email)) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date().toISOString()
    };

    // Store user (in real app, would hash password and store in Supabase)
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Store password separately (mock - don't do this in production!)
    localStorage.setItem(`pwd_${email}`, password);

    // Create session
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

    return newUser;
  },

  // Sign in existing user
  signIn: async (email: string, password: string): Promise<User> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.email === email);

    if (!user) {
      throw new Error('User not found');
    }

    // Check password (mock)
    const storedPassword = localStorage.getItem(`pwd_${email}`);
    if (storedPassword !== password) {
      throw new Error('Invalid password');
    }

    // Create session
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));

    return user;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(SESSION_KEY);
  }
};
