import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, ArrowLeft, Brain, Heart, Sparkles, TrendingUp } from "lucide-react";

const options = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
];

export default function CheckMood() {
  const [testType, setTestType] = useState("phq9");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const userId = localStorage.getItem("liora_user_id");
    if (!userId) {
      localStorage.setItem("liora_user_id", crypto.randomUUID());
    }

    fetch(`http://127.0.0.1:5000/get-questions?test_type=${testType}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setResult(null);
      });
  }, [testType]);

  const handleTestTypeChange = (type) => {
    setTestType(type);
  };

  const handleAnswerSelect = (optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const goNext = () => {
    if (answers[currentQuestionIndex] === undefined) {
      alert("Please select an answer before continuing.");
      return;
    }

    setDirection(1);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      fetch("http://127.0.0.1:5000/submit-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": localStorage.getItem("liora_user_id"),
        },
        body: JSON.stringify({ test_type: testType, answers }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResult(data);
        });
    }
  };

  const goPrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const progressPercent = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
  };

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-2xl border-2 border-teal-200 rounded-3xl p-10 max-w-2xl text-center"
        >
          <motion.div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h2 className="text-4xl font-bold text-gray-800 mb-4">Assessment Complete</h2>
          <p className="text-lg text-gray-600 mb-6">
            {testType === "phq9" ? "Depression Test" : "Anxiety Test"}
          </p>

          <div className="bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-200 rounded-2xl p-8 mb-6">
            <p className="text-5xl font-bold text-gray-800">{result.score}</p>
            <p className="mt-2 text-xl font-semibold text-teal-700">{result.category}</p>
          </div>

          <motion.button
            onClick={() => window.location.href = "/track-mood"}
            className="mt-6 w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-4 rounded-xl font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            View Progress 📈
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-green-50">
        <div className="w-14 h-14 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border-2 border-teal-200 p-8">
        {/* Test Selector */}
        <div className="flex mb-6 border-b">
          {["phq9", "gad7"].map((type) => (
            <button
              key={type}
              onClick={() => handleTestTypeChange(type)}
              className={`flex-1 py-3 text-lg font-semibold transition-all ${
                testType === type ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {type === "phq9" ? "Depression Test" : "Anxiety Test"}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-6 text-sm font-semibold text-gray-700">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="h-3 bg-gray-200 rounded-full mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-600 to-green-600 rounded-full"
            animate={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestionIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="text-xl text-gray-800 mb-6"
          >
            {questions[currentQuestionIndex]}
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left py-4 px-6 rounded-xl border-2 transition-all ${
                answers[currentQuestionIndex] === index
                  ? "bg-teal-600 text-white border-teal-600 shadow-lg"
                  : "bg-gray-50 border-gray-200 hover:border-teal-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={goPrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <ArrowLeft className="inline w-5 h-5" /> Previous
          </button>

          <button
            onClick={goNext}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg"
          >
            {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"} <ArrowRight className="inline w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
