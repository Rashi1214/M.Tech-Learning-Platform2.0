import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, CreditCard, Check, ArrowLeft, Video, FileText, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../utils/auth';
import { database } from '../../utils/database';

export default function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState('video');

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      navigate('/signin');
    }
  }, [navigate]);

  const tutor = {
    id: 1,
    name: 'Dr. Sarah Chen',
    specialty: 'Machine Learning & AI',
    rating: 4.9,
    price: 150,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
  };

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const sessionTypes = [
    { id: 'video', name: 'Video Call', icon: Video, description: '1-on-1 video session' },
    { id: 'chat', name: 'Chat Session', icon: MessageSquare, description: 'Text-based learning' },
    { id: 'review', name: 'Code Review', icon: FileText, description: 'Review your code' }
  ];

  const handleBooking = () => {
    const user = auth.getCurrentUser();
    if (!user) {
      navigate('/signin');
      return;
    }

    // Save booking to database
    const booking = database.createBooking({
      userId: user.id,
      tutorId: tutor.id,
      tutorName: tutor.name,
      sessionType,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed'
    });

    console.log('Booking created:', booking);

    // Update user stats
    const profile = database.getUserProfile(user.id);
    database.updateUserProfile(user.id, {
      totalSessions: profile.totalSessions + 1
    });

    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tutor Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <img src={tutor.image} alt={tutor.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-2">{tutor.name}</h3>
              <p className="text-purple-400 text-center mb-4">{tutor.specialty}</p>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold">${tutor.price}</span>
                <span className="text-gray-400">/hour</span>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Session Type</span>
                  <span className="font-medium capitalize">{sessionType}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Date</span>
                  <span className="font-medium">{selectedDate || 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Time</span>
                  <span className="font-medium">{selectedTime || 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-white/10">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-bold">${tutor.price}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Booking Steps */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10'
                  }`}>
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${
                      step > s ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Session Type */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-6">Choose Session Type</h2>
                <div className="grid gap-4">
                  {sessionTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSessionType(type.id)}
                      className={`p-6 rounded-2xl border transition-all text-left ${
                        sessionType === type.id
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          sessionType === type.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-white/10'
                        }`}>
                          <type.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">{type.name}</h3>
                          <p className="text-gray-400">{type.description}</p>
                        </div>
                        {sessionType === type.id && (
                          <Check className="w-6 h-6 text-purple-400" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-lg mt-8"
                >
                  Continue to Date & Time
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-6">Select Date & Time</h2>

                {/* Date Selection */}
                <div>
                  <label className="flex items-center gap-2 text-lg mb-4">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    Choose Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="flex items-center gap-2 text-lg mb-4">
                    <Clock className="w-5 h-5 text-purple-400" />
                    Choose Time
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {availableTimes.map((time) => (
                      <motion.button
                        key={time}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-white/10 rounded-xl font-semibold border border-white/20"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(3)}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold mb-6">Payment Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 bg-white/10 rounded-xl font-semibold border border-white/20"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBooking}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Complete Booking
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold mb-4">Booking Confirmed!</h2>
                <p className="text-xl text-gray-400 mb-8">
                  Your session with {tutor.name} has been scheduled
                </p>
                <div className="max-w-md mx-auto p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type</span>
                      <span className="font-medium capitalize">{sessionType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold"
                    >
                      View Dashboard
                    </motion.button>
                  </Link>
                  <Link to="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-white/10 rounded-xl font-semibold border border-white/20"
                    >
                      Back to Home
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
