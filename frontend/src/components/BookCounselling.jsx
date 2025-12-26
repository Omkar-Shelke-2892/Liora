import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Mail, User, CheckCircle, Heart } from "lucide-react";

export default function BookCounselling() {
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    fetch("http://127.0.0.1:5000/book-counselling", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": localStorage.getItem("liora_user_id") || "guest",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || "Appointment booked successfully.");
        setIsSubmitting(false);

        setTimeout(() => {
          setForm({ name: "", email: "", date: "", time: "" });
          setMessage("");
        }, 3000);
      })
      .catch(() => {
        setMessage("Something went wrong. Please try again.");
        setIsSubmitting(false);
      });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const floatingHeartVariants = {
    float: {
      y: [-5, 5, -5],
      rotate: [-5, 5, -5],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 py-12 px-4 relative overflow-hidden">
      <motion.div className="absolute top-20 left-10 text-6xl opacity-20" variants={floatingHeartVariants} animate="float">🍃</motion.div>
      <motion.div className="absolute bottom-20 right-10 text-6xl opacity-20" variants={floatingHeartVariants} animate="float" transition={{ delay: 1 }}>🌿</motion.div>

      <motion.div className="max-w-2xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div className="inline-block mb-4" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Book Your Counselling Session</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Our professional counsellors are here to support you.</p>
        </motion.div>

        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6" />
                  <p>{message}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="bg-white rounded-3xl shadow-2xl overflow-hidden" variants={itemVariants}>
          <div className="bg-gradient-to-r from-teal-600 to-green-600 p-8 text-white">
            <div className="flex items-center space-x-3 mb-2"><Heart className="w-6 h-6" /><h2 className="text-2xl font-bold">Appointment Details</h2></div>
            <p className="text-white/90">Fill in your preferred date and time</p>
          </div>

          <div className="p-8 space-y-6">
            {[{ name: "name", icon: User, label: "Your Name (Optional)" }, { name: "email", icon: Mail, label: "Email Address (Optional)", type: "email" }].map(field => (
              <motion.div variants={itemVariants} key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                <div className="relative">
                  <field.icon className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                  <input name={field.name} type={field.type || "text"} value={form[field.name]} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 outline-none" />
                </div>
              </motion.div>
            ))}

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "date", type: "date", label: "Preferred Date", icon: Calendar },
                { name: "time", type: "time", label: "Preferred Time", icon: Clock }
              ].map(field => (
                <motion.div variants={itemVariants} key={field.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label} <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <field.icon className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                    <input required name={field.name} type={field.type} value={form[field.name]} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 outline-none" />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button onClick={submitForm} disabled={isSubmitting} className="w-full py-4 text-white bg-gradient-to-r from-teal-600 to-green-600 rounded-xl font-bold shadow-lg">
              {isSubmitting ? "Booking..." : "Book Appointment →"}
            </motion.button>
          </div>
        </motion.div>

        <p className="text-center mt-6 text-sm text-gray-600">Need urgent help? Call: <span className="font-semibold text-teal-700">1800-599-0019</span></p>
      </motion.div>
    </div>
  );
}
