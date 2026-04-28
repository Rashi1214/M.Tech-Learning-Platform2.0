import { motion } from 'motion/react';
import { Star, Users, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TutorCardProps {
  tutor: {
    id: number;
    name: string;
    specialty: string;
    rating: number;
    students: number;
    image: string;
    experience: string;
    price: number;
  };
  index: number;
}

export default function TutorCard({ tutor, index }: TutorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, rotateY: 5 }}
      className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all overflow-hidden"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="relative mb-4">
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <ImageWithFallback
              src={tutor.image}
              alt={tutor.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold">{tutor.rating}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-1 group-hover:text-purple-400 transition-colors">
          {tutor.name}
        </h3>
        <p className="text-sm text-purple-400 mb-4">{tutor.specialty}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{tutor.students} students</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{tutor.experience} experience</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <DollarSign className="w-4 h-4" />
            <span>${tutor.price}/hour</span>
          </div>
        </div>

        <Link to="/booking" className="block">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Book Session
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
