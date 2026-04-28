import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, Settings, BarChart3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../utils/auth';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(auth.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    setUser(auth.getCurrentUser());
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
    navigate('/');
  };

  if (!user) {
    return (
      <Link to="/signin">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium"
        >
          Sign In
        </motion.button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-semibold"
      >
        {user.name.charAt(0).toUpperCase()}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-gray-900 border border-white/10 shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>

              <div className="p-2">
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    <span>Dashboard</span>
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ x: 4 }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>Settings</span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
