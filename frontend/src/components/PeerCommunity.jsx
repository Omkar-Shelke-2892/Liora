import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Send, Users, Sparkles } from "lucide-react";

export default function PeerCommunity() {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [showReplies, setShowReplies] = useState({});

  const userId = localStorage.getItem("liora_user_id") || "guest";

  // Fetch posts from backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/community-feed", {
      method: "GET",
      headers: { "X-User-ID": userId }
    })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  // Submit new post
  const submitPost = () => {
    if (!message.trim()) return;

    fetch("http://127.0.0.1:5000/community-post", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-User-ID": userId },
      body: JSON.stringify({ message }),
    })
      .then(() =>
        fetch("http://127.0.0.1:5000/community-feed").then((res) => res.json()).then(setPosts)
      );

    setMessage("");
  };

  // Reactions
  const sendReaction = (id, type) => {
    fetch("http://127.0.0.1:5000/react", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    }).then(() => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, reactions: { ...p.reactions, [type]: p.reactions[type] + 1 } } : p
        )
      );
    });
  };

  // Reply (Stored only in UI)
  const sendReply = (postId) => {
    const text = replyText[postId];
    if (!text?.trim()) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, replies: [...(p.replies || []), { name: "You", message: text }] }
          : p
      )
    );

    setReplyText((prev) => ({ ...prev, [postId]: "" }));
  };

  const toggleReplies = (postId) =>
    setShowReplies((prev) => ({ ...prev, [postId]: !prev[postId] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Users className="w-12 h-12 text-teal-600" />
            <h1 className="text-5xl font-bold text-gray-800">Peer Community</h1>
          </div>
          <p className="text-lg text-gray-600">A safe space to express and connect</p>
        </div>

        {/* Post Creator */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-teal-100 mb-8">
          <textarea
            className="w-full border-2 border-gray-200 p-4 rounded-xl bg-gray-50 focus:outline-none focus:border-teal-500 transition"
            placeholder="Share your thoughts... 🌿"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />

          <motion.button
            onClick={submitPost}
            disabled={!message.trim()}
            className={`mt-4 w-full py-3 px-6 rounded-xl font-semibold text-white ${
              message.trim()
                ? "bg-gradient-to-r from-teal-600 to-green-600 hover:shadow-lg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            whileHover={message.trim() ? { scale: 1.02 } : {}}
          >
            <Send className="inline w-5 mr-2" /> Share
          </motion.button>
        </div>

        {/* Post Feed */}
        <AnimatePresence>
          {posts.map((post) => {
            const userName = post.name || "Anonymous";
            const reactions = post.reactions || { heart: 0, hug: 0, flower: 0 };
            const replies = post.replies || [];

            return (
              <motion.div
                key={post.id}
                layout
                className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 mb-6"
              >
                {/* Name */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{userName}</p>
                    <p className="text-sm text-gray-500">{post.date}</p>
                  </div>
                </div>

                {/* Message */}
                <p className="text-gray-700 mb-4">{post.message}</p>

                {/* Reactions */}
                <div className="flex space-x-3 mb-4">
                  <button onClick={() => sendReaction(post.id, "heart")}>❤️ {reactions.heart}</button>
                  <button onClick={() => sendReaction(post.id, "hug")}>🤗 {reactions.hug}</button>
                  <button onClick={() => sendReaction(post.id, "flower")}>🌸 {reactions.flower}</button>
                </div>

                {/* Toggle Replies */}
                <button
                  className="text-teal-600 font-medium mb-2"
                  onClick={() => toggleReplies(post.id)}
                >
                  <MessageCircle className="inline w-4 mr-1" />
                  {showReplies[post.id] ? "Hide" : "View"} Replies ({replies.length})
                </button>

                {/* Replies */}
                {showReplies[post.id] && (
                  <div className="space-y-2 mb-4">
                    {replies.map((r, i) => (
                      <div key={i} className="pl-4 border-l-4 border-teal-300 bg-teal-50 p-2 rounded">
                        <strong>{r.name}:</strong> {r.message}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Box */}
                <div className="flex gap-2">
                  <input
                    className="flex-1 border-2 border-gray-200 p-2 rounded-xl focus:border-teal-500"
                    placeholder="Write a reply..."
                    value={replyText[post.id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [post.id]: e.target.value })
                    }
                  />
                  <button
                    onClick={() => sendReply(post.id)}
                    className="px-4 bg-teal-600 text-white rounded-xl"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
