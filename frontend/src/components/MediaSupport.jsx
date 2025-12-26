import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Video, Heart, Sparkles, Wind } from "lucide-react";

export default function MediaSupport() {
  const affirmations = [
    "You are doing the best you can, and that is enough.",
    "Your feelings are valid.",
    "You deserve peace.",
    "Healing takes time. Be gentle with yourself.",
    "You are stronger than you think."
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % affirmations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 py-12 px-4 relative overflow-hidden">
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 right-10 text-6xl opacity-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🎵
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-10 text-6xl opacity-10"
        animate={{
          y: [0, -15, 0],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        💚
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center space-x-3 mb-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Media Support</h1>
          </motion.div>
          <p className="text-lg text-gray-600">Relax, breathe, and find your peace</p>
        </motion.div>

        {/* Breathing Animation */}
        <motion.section
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-teal-100">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Wind className="w-6 h-6 text-teal-600" />
              <h3 className="text-2xl font-semibold text-gray-800">Breathing Exercise</h3>
            </div>
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-teal-400 to-green-500 rounded-full mx-auto shadow-2xl"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            <motion.p
              className="mt-6 text-gray-600 text-lg font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              Breathe In... and Out
            </motion.p>
            <p className="mt-2 text-sm text-gray-500">Follow the circle's rhythm</p>
          </div>
        </motion.section>

        {/* Affirmations */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-teal-100 text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-5"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h3 className="text-2xl font-semibold text-gray-800">Daily Affirmation</h3>
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="text-2xl font-medium text-gray-700 leading-relaxed px-4"
                >
                  "{affirmations[current]}"
                </motion.p>
              </AnimatePresence>
              <div className="flex justify-center space-x-2 mt-6">
                {affirmations.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === current ? "bg-teal-600" : "bg-gray-300"
                    }`}
                    animate={idx === current ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Music Player */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-teal-100">
            <div className="bg-gradient-to-r from-teal-600 to-green-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <Music className="w-6 h-6" />
                <h3 className="text-2xl font-semibold">Relaxing Music</h3>
              </div>
              <p className="text-sm text-white/90 mt-1">Let the calming sounds wash over you</p>
            </div>
            <div className="p-6">
              <iframe
                className="w-full rounded-2xl shadow-lg"
                height="215"
                src="https://www.youtube.com/embed/2OEL4P1Rz04"
                allow="autoplay; encrypted-media"
                title="Relaxing Music"
              />
            </div>
          </div>
        </motion.section>

        {/* Motivational Videos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-teal-100">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <Video className="w-6 h-6" />
                <h3 className="text-2xl font-semibold">Feel-Good Videos</h3>
              </div>
              <p className="text-sm text-white/90 mt-1">Uplift your spirit with inspiring content</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <iframe
                    className="w-full rounded-2xl shadow-lg"
                    height="200"
                    src="https://www.youtube.com/embed/ZToicYcHIOU"
                    title="Feel Good Video 1"
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <iframe
                    className="w-full rounded-2xl shadow-lg"
                    height="200"
                    src="https://www.youtube.com/embed/a3zBz1QqQ2c"
                    title="Feel Good Video 2"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Info Footer */}
        <motion.div
          className="mt-6 text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="flex items-center justify-center space-x-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span>Take your time and be gentle with yourself today</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </p>
        </motion.div>
      </div>
    </div>
  );
}