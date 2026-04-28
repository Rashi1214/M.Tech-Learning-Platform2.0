import { motion } from 'motion/react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BookOpen, Clock, TrendingUp, Award, Calendar, Users, Zap, Target, ArrowLeft, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../../utils/auth';
import { database } from '../../utils/database';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(auth.getCurrentUser());
  const [userData, setUserData] = useState({
    profile: { totalSessions: 0, hoursLearned: 0, skillsAcquired: 0, avgPerformance: 0, userId: '' },
    progress: { weeklyData: [], monthlyData: [], achievements: [], userId: '' },
    bookings: []
  });

  useEffect(() => {
    // Check authentication
    const user = auth.getCurrentUser();
    if (!user) {
      navigate('/signin');
      return;
    }

    setCurrentUser(user);

    // Load user data
    const profile = database.getUserProfile(user.id);
    const progress = database.getLearningProgress(user.id);
    const bookings = database.getUserBookings(user.id);

    setUserData({ profile, progress, bookings });
  }, [navigate]);
  const handleDownloadReport = () => {
    // Generate a simple report as JSON
    const reportData = {
      generatedAt: new Date().toISOString(),
      stats: {
        totalSessions: 24,
        hoursLearned: 36,
        skillsAcquired: 12,
        avgPerformance: 94
      },
      weeklyProgress: [
        { day: 'Mon', hours: 4, sessions: 2 },
        { day: 'Tue', hours: 6, sessions: 3 },
        { day: 'Wed', hours: 5, sessions: 2 },
        { day: 'Thu', hours: 8, sessions: 4 },
        { day: 'Fri', hours: 7, sessions: 3 },
        { day: 'Sat', hours: 3, sessions: 1 },
        { day: 'Sun', hours: 3, sessions: 1 }
      ],
      monthlyPerformance: [
        { month: 'Jan', score: 78 },
        { month: 'Feb', score: 82 },
        { month: 'Mar', score: 85 },
        { month: 'Apr', score: 88 },
        { month: 'May', score: 91 },
        { month: 'Jun', score: 94 }
      ]
    };

    // Create downloadable file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protutor-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Total Sessions', value: userData.profile.totalSessions, change: '+12%', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Hours Learned', value: userData.profile.hoursLearned, change: '+8%', icon: Clock, color: 'from-blue-500 to-cyan-500' },
    { label: 'Skills Acquired', value: userData.profile.skillsAcquired, change: '+25%', icon: Award, color: 'from-green-500 to-emerald-500' },
    { label: 'Avg Performance', value: userData.profile.avgPerformance, change: '+5%', icon: TrendingUp, color: 'from-orange-500 to-red-500' }
  ];

  const weeklyProgress = userData.progress.weeklyData || [];

  const skillDistribution = [
    { name: 'Machine Learning', value: 35, color: '#a855f7' },
    { name: 'Data Science', value: 25, color: '#ec4899' },
    { name: 'Deep Learning', value: 20, color: '#3b82f6' },
    { name: 'NLP', value: 12, color: '#10b981' },
    { name: 'Computer Vision', value: 8, color: '#f59e0b' }
  ];

  const monthlyPerformance = userData.progress.monthlyData || [];

  const upcomingSessions = userData.bookings
    .filter(b => b.status === 'confirmed')
    .map(b => ({
      tutor: b.tutorName,
      subject: b.sessionType,
      date: new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: b.time
    }))
    .slice(0, 3);

  const achievements = userData.progress.achievements || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) return 'Today';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Learning Dashboard
              </h1>
              {currentUser && (
                <div className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">{currentUser.name}</span>
                </div>
              )}
            </div>
            <p className="text-gray-400 mt-2">Track your progress and achievements</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadReport}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold"
          >
            Download Report
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-400">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}{stat.label === 'Avg Performance' ? '%' : ''}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Weekly Progress
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="hours" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skill Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Skill Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ fill: '#ec4899', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Upcoming Sessions
            </h3>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold mb-1">{session.subject}</h4>
                      <p className="text-sm text-gray-400 mb-2">with {session.tutor}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{session.date}</span>
                        <span>{session.time}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-medium"
                    >
                      Join
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              {achievements.length > 0 ? achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{achievement.name}</h4>
                    <p className="text-sm text-gray-400 mb-1">{achievement.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(achievement.date)}</p>
                  </div>
                </motion.div>
              )) : (
                <p className="text-gray-400 text-center py-8">No achievements yet. Keep learning!</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
