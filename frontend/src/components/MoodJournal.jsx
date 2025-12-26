import React, { useState, useEffect } from "react";

export default function MoodJournal() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/journal", {
      headers: { "X-User-ID": localStorage.getItem("liora_user_id") }
    })
      .then(res => res.json())
      .then(setHistory);
  }, []);

  const submit = () => {
    fetch("http://localhost:5000/journal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": localStorage.getItem("liora_user_id"),
      },
      body: JSON.stringify({ text })
    }).then(() => {
      setHistory([{ text, date: new Date().toISOString().slice(0,10) }, ...history]);
      setText("");
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl mb-4 text-gray-700">Your Journal ✍️</h2>

      <textarea
        className="w-full border rounded-md p-3 h-28 mb-3"
        placeholder="Write how you feel..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Entry
      </button>

      <div className="mt-6 space-y-4">
        {history.map((entry, i) => (
          <div key={i} className="p-3 border rounded-md bg-white shadow-sm">
            <p className="text-gray-500 text-sm">{entry.date}</p>
            <p>{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
