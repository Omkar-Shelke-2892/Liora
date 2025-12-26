import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Calendar, BarChart3, Sparkles, Heart } from "lucide-react";

const moodEmojis = {
  "Minimal": "🙂",
  "Mild": "😐",
  "Moderate": "☁️",
  "Moderately Severe": "🌧️",
  "Severe": "🌩️",
};

const moodColors = {
  "Minimal": "from-green-400 to-emerald-500",
  "Mild": "from-blue-400 to-cyan-500",
  "Moderate": "from-yellow-400 to-orange-500",
  "Moderately Severe": "from-orange-500 to-red-500",
  "Severe": "from-red-500 to-pink-600",
};

export default function TrackMood() {
  const [history, setHistory] = useState([]);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("liora_user_id");
    if (!userId) return;

    fetch("http://127.0.0.1:5000/mood-history", {
      headers: { "X-User-ID": userId }
    })
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        setHistory(sorted);
      })
      .catch(() => setHistory([]));
  }, []);

  const calculateTrend = () => {
    if (history.length < 2) return "stable";
    const recent = history.slice(-3);
    const past = history.slice(0, -3);

    const avgRecent = recent.reduce((s, e) => s + e.score, 0) / recent.length;
    const avgPast = past.reduce((s, e) => s + e.score, 0) / past.length;

    return avgRecent < avgPast ? "improving" : avgRecent > avgPast ? "attention" : "stable";
  };

  const trend = calculateTrend();

  // No history screen
  if (history.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-teal-200 text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Mood History Yet</h2>
          <p className="text-gray-600 mb-6 text-lg">Take your first mood test to begin tracking 💚</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-teal-600 to-green-600 text-white py-3 px-6 rounded-xl font-semibold"
            onClick={() => (window.location.href = "/check-mood")}
          >
            Take Mood Test
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 py-12 px-6">

      <motion.h1 className="text-4xl font-bold text-center text-gray-800 mb-10 flex items-center justify-center gap-3">
        <BarChart3 className="text-teal-600" /> Your Mood Journey
      </motion.h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        <StatCard icon={<Calendar />} label="Total Tests" value={history.length} />
        <StatCard
          icon={
            trend === "improving" ? <TrendingDown className="text-green-600" /> :
            trend === "attention" ? <TrendingUp className="text-red-600" /> :
            <Heart className="text-blue-600" />
          }
          label="Trend"
          value={
            trend === "improving" ? "Improving" :
            trend === "attention" ? "Needs Support" : "Stable"
          }
        />
        <StatCard
          icon={<Sparkles />}
          label="Latest Mood"
          value={history[history.length - 1]?.category}
          emoji={moodEmojis[history[history.length - 1]?.category]}
        />
      </div>

      {/* Toggle */}
      <div className="text-center mb-8">
        <button
          className={`px-6 py-3 rounded-l-full ${!showChart ? "bg-teal-600 text-white" : "bg-white border"}`}
          onClick={() => setShowChart(false)}
        >
          Timeline
        </button>
        <button
          className={`px-6 py-3 rounded-r-full ${showChart ? "bg-teal-600 text-white" : "bg-white border"}`}
          onClick={() => setShowChart(true)}
        >
          Chart
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* Timeline View */}
        {!showChart && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative ml-6">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-green-500 rounded-full" />
              <div className="space-y-8">
                {history.map((entry, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="relative pl-10">
                    <div className="absolute left-[-0.65rem] top-1 w-6 h-6 bg-white border-4 border-teal-500 rounded-full shadow-lg flex items-center justify-center text-lg">
                      {moodEmojis[entry.category]}
                    </div>
                    <div className={`bg-gradient-to-r ${moodColors[entry.category]} text-white p-5 rounded-xl shadow-lg`}>
                      <p className="opacity-90 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="font-bold text-lg">{entry.category}</p>
                      <p className="opacity-90 text-sm mt-1">{entry.test_type === "phq9" ? "Depression Test" : "Anxiety Test"}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Chart View */}
        {showChart && (
          <motion.div
            key="chart"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-3xl shadow-xl border-2 border-teal-100 max-w-5xl mx-auto"
          >
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="date" tick={{ fill: '#555' }} />
                <YAxis tick={{ fill: '#555' }} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#0d9488" fill="url(#colorMood)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, emoji }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-teal-100 text-center">
      <div className="text-3xl mb-1">{emoji || icon}</div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}
