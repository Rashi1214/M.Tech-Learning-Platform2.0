import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Brain, Sparkles, Users, TrendingUp, BookOpen, Award, Star, ArrowRight, Search, Filter, Calendar, MessageSquare, BarChart3, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';
import TutorCard from './TutorCard';
import StatsCounter from './StatsCounter';
import AIChat from './AIChat';
import UserMenu from './UserMenu';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Refs for scrolling to sections
  const featuresRef = useRef<HTMLElement>(null);
  const tutorsRef = useRef<HTMLElement>(null);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    if (section === 'features' && featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'tutors' && tutorsRef.current) {
      tutorsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const tutors = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      specialty: 'Machine Learning & AI',
      rating: 4.9,
      students: 234,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      experience: '8 years',
      price: 150
    },
    {
      id: 2,
      name: 'Prof. James Kumar',
      specialty: 'Data Science & Analytics',
      rating: 4.8,
      students: 189,
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop',
      experience: '12 years',
      price: 180
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Deep Learning & Neural Networks',
      rating: 5.0,
      students: 312,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
      experience: '10 years',
      price: 200
    },
    {
      id: 4,
      name: 'Dr. Michael Zhang',
      specialty: 'Computer Vision & NLP',
      rating: 4.9,
      students: 267,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      experience: '9 years',
      price: 170
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Smart algorithms match you with the perfect tutor based on your learning style and goals',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Sparkles,
      title: 'Real-Time Collaboration',
      description: 'Interactive whiteboard, screen sharing, and live code collaboration tools',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Track your learning journey with detailed analytics and performance insights',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Certified Experts',
      description: 'Learn from M.Tech level professionals with proven track records',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { label: 'Expert Tutors', value: 500, suffix: '+' },
    { label: 'Students Enrolled', value: 10000, suffix: '+' },
    { label: 'Sessions Completed', value: 50000, suffix: '+' },
    { label: 'Success Rate', value: 98, suffix: '%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white overflow-x-hidden">
      <ParticleBackground />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ProTutor2.0
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('home')}
                className={`transition-colors ${activeSection === 'home' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('tutors')}
                className={`transition-colors ${activeSection === 'tutors' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}
              >
                Tutors
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className={`transition-colors ${activeSection === 'features' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}
              >
                Features
              </button>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowChat(!showChat)}
                className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </motion.button>
              <UserMenu />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <motion.div
          style={{ opacity }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-8">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">M.Tech Level Learning Platform</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Master Advanced
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                Tech Skills
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Connect with elite M.Tech level tutors. Learn AI, ML, Data Science with personalized guidance and real-time collaboration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/booking">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-lg flex items-center gap-2 shadow-lg shadow-purple-500/50"
                >
                  Find Your Tutor
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-colors"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24"
          >
            {stats.map((stat, index) => (
              <StatsCounter key={index} {...stat} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-400">
              Advanced tools for advanced learners
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutors Section */}
      <section ref={tutorsRef} className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              Meet Our Expert Tutors
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Learn from industry leaders and academic experts
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by subject, skill, or tutor name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium"
                >
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutors.map((tutor, index) => (
              <TutorCard key={tutor.id} tutor={tutor} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full font-medium border border-white/20 hover:bg-white/20 transition-colors"
            >
              View All Tutors
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse" />
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Level Up?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of students mastering advanced tech skills
              </p>
              <Link to="/booking">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-lg shadow-lg shadow-purple-500/50"
                >
                  Start Learning Today
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-bold">ProTutor2.0</span>
              </div>
              <p className="text-gray-400 text-sm">
                M.Tech level learning platform for advanced tech education
              </p>
            </div>

            {['Platform', 'Resources', 'Company'].map((section) => (
              <div key={section}>
                <h4 className="font-semibold mb-4">{section}</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="hover:text-white cursor-pointer transition-colors">Find Tutors</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Book Session</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Dashboard</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Analytics</li>
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            <p>© 2026 ProTutor2.0. M.Tech Level Educational Platform.</p>
          </div>
        </div>
      </footer>

      {/* AI Chat */}
      {showChat && <AIChat onClose={() => setShowChat(false)} />}
    </div>
  );
}
