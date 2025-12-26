import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Brain } from "lucide-react";

import SupportChatbot from "./components/SupportChatbot.jsx";
import CheckMood from "./components/CheckMood.jsx";
import TrackMood from "./components/TrackMood.jsx";
import BookCounselling from "./components/BookCounselling.jsx";
import PeerCommunity from "./components/PeerCommunity.jsx";
import MediaSupport from "./components/MediaSupport.jsx";

const features = [
  { id: 1, title: "Support Chatbot", icon: "💬", description: "Your AI companion for mental health support and guidance.", link: "/support-chatbot" },
  { id: 2, title: "Track Mood", icon: "📈", description: "Monitor your emotional journey and identify patterns over time.", link: "/track-mood" },
  { id: 3, title: "Check Mood", icon: "🔎", description: "Quick tools to assess and understand your current state of mind.", link: "/check-mood" },
  { id: 4, title: "Book Counselling", icon: "📅", description: "Connect with licensed mental health professionals who care.", link: "/book-counselling" },
  { id: 5, title: "Peer Community", icon: "🌐", description: "Share experiences and find support in a safe, moderated space.", link: "/peer-community" },
  { id: 6, title: "Media Support", icon: "🎥", description: "Curated videos, articles, and resources for your wellbeing.", link: "/media-support" }
];

const navItems = [
  { name: "Home", path: "/" },
  { name: "Support", path: "/support-chatbot" },
  { name: "Track", path: "/track-mood" },
  { name: "Check", path: "/check-mood" },
  { name: "Counselling", path: "/book-counselling" },
  { name: "Community", path: "/peer-community" },
  { name: "Media", path: "/media-support" }
];

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/support-chatbot" element={<SupportChatbot />} />
          <Route path="/check-mood" element={<CheckMood />} />
          <Route path="/track-mood" element={<TrackMood />} />
          <Route path="/book-counselling" element={<BookCounselling />} />
          <Route path="/peer-community" element={<PeerCommunity />} />
          <Route path="/media-support" element={<MediaSupport />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function HomePage() {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Feedback submitted: ${feedback}\nEmail: ${email}`);
    setFeedback("");
    setEmail("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-green-600 to-emerald-600 min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 text-center px-4">
          <motion.p
            className="text-5xl md:text-6xl font-serif text-white mb-8 italic"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            "Find your peace"
          </motion.p>

          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-10 text-6xl opacity-20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🌸
          </motion.div>
          
          <motion.div
            className="absolute bottom-20 right-10 text-6xl opacity-20"
            animate={{
              y: [0, -15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            🍃
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Your Journey to Wellness
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={feature.link}>
                <motion.div
                  className="bg-white rounded-2xl shadow-md overflow-hidden h-full"
                  whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-teal-100 to-green-100 p-8 flex items-center justify-center">
                    <motion.div
                      className="text-7xl"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    
                    <motion.button
                      className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-colors w-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore
                    </motion.button>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency Helplines */}
      <div className="bg-gray-50 py-16">
        <motion.section
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-teal-600"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🆘 Indian Mental Health Emergency Helplines</h2>
            <div className="space-y-4">
              {[
                { name: "National Helpline", number: "14416" },
                { name: "KIRAN", number: "1800-599-0019" },
                { name: "Sneha India", number: "044-24640050" }
              ].map((helpline, index) => (
                <motion.div
                  key={helpline.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={`tel:${helpline.number}`}
                    className="block p-4 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
                  >
                    <motion.p
                      className="text-lg font-semibold text-teal-700"
                      whileHover={{ x: 5 }}
                    >
                      {helpline.name}: {helpline.number}
                    </motion.p>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Feedback Form */}
        <motion.section
          className="max-w-xl mx-auto mt-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">We Value Your Feedback</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.textarea
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-600 transition-colors"
                placeholder="Share your thoughts with us..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                whileFocus={{ scale: 1.02 }}
              />
              
              <motion.input
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-600 transition-colors"
                placeholder="Your email (optional)..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              />
              
              <motion.button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Submit Feedback
              </motion.button>
            </form>
          </motion.div>
        </motion.section>
      </div>

      {/* Footer */}
      <motion.footer
        className="bg-gray-800 text-white py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.p
            className="text-lg"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
          >
            Liora © 2024 | 
            <motion.a
              href="/privacy"
              className="text-white hover:text-teal-400 mx-2 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              Privacy Policy
            </motion.a> | 
            <motion.a
              href="/terms"
              className="text-white hover:text-teal-400 mx-2 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              Terms of Service
            </motion.a>
          </motion.p>
        </div>
      </motion.footer>
    </motion.div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [inputName, setInputName] = useState("");

  useEffect(() => {
    // Check if user already has an ID
    const userId = localStorage.getItem("liora_user_id");
    const storedName = localStorage.getItem("liora_user_name");
    
    if (userId && storedName) {
      setIsLoggedIn(true);
      setUserName(storedName);
    }
  }, []);

  const handleLogin = () => {
    if (!inputName.trim()) {
      alert("Please enter your name");
      return;
    }

    // Generate unique user ID
    const userId = crypto.randomUUID();
    localStorage.setItem("liora_user_id", userId);
    localStorage.setItem("liora_user_name", inputName.trim());
    
    setUserName(inputName.trim());
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setInputName("");
  };

  const handleLogout = () => {
    localStorage.removeItem("liora_user_id");
    localStorage.removeItem("liora_user_name");
    setIsLoggedIn(false);
    setUserName("");
  };

  return (
    <Router>
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
        }}
      >
        <div className="min-h-screen bg-white/70 backdrop-blur-sm">
          {/* Glassmorphism Header */}
          <motion.header
            className="sticky top-0 z-50 backdrop-blur-md bg-white/30 shadow-lg border-b border-white/20"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                {/* Logo and Brand */}
                <Link to="/">
                  <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                      Liora
                    </span>
                  </motion.div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-1 backdrop-blur-lg bg-white/40 px-4 py-2 rounded-full shadow-lg border border-white/30">
                  {navItems.map((item) => (
                    <Link key={item.path} to={item.path}>
                      <motion.span
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 rounded-full transition-colors"
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.name}
                      </motion.span>
                    </Link>
                  ))}
                </nav>

                {/* User Profile */}
                {isLoggedIn ? (
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center space-x-3 backdrop-blur-lg bg-white/40 px-4 py-2 rounded-full shadow-lg border border-white/30 cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <span className="hidden sm:inline text-sm font-semibold text-gray-700">
                        {userName}
                      </span>
                    </div>
                    
                    {/* Logout Dropdown */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 backdrop-blur-lg bg-white/90 rounded-2xl shadow-lg border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setShowLoginModal(true)}
                    className="backdrop-blur-lg bg-gradient-to-r from-teal-500 to-green-600 text-white px-6 py-2 rounded-full shadow-lg border border-white/30 font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                )}
              </div>

              {/* Mobile Navigation */}
              <nav className="md:hidden flex justify-center mt-4 overflow-x-auto pb-2">
                <div className="flex space-x-2 backdrop-blur-lg bg-white/40 px-3 py-2 rounded-full shadow-lg border border-white/30">
                  {navItems.map((item) => (
                    <Link key={item.path} to={item.path}>
                      <motion.span
                        className="px-3 py-1 text-xs font-medium text-gray-700 hover:text-teal-600 rounded-full whitespace-nowrap"
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.name}
                      </motion.span>
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </motion.header>

          <AnimatedRoutes />

          {/* Login Modal */}
          <AnimatePresence>
            {showLoginModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                onClick={() => setShowLoginModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-2 border-teal-100"
                >
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Brain className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Liora</h2>
                    <p className="text-gray-600">Enter your name to get started</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      placeholder="Your name..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none text-lg"
                      autoFocus
                    />

                    <motion.button
                      onClick={handleLogin}
                      className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue
                    </motion.button>

                    <button
                      onClick={() => setShowLoginModal(false)}
                      className="w-full text-gray-600 py-2 text-sm hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-6">
                    Your privacy matters. We only store your name locally for a personalized experience.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Router>
  );
}