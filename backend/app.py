import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient, ASCENDING, DESCENDING
from datetime import datetime
import google.generativeai as genai
from bson import ObjectId
from random import choice

# Load .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing in .env")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI missing in .env")

# Flask + CORS
app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]}},
    supports_credentials=True
)

# Gemini Model
genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """
You are Liora, a warm, emotionally intelligent mental health support companion.
Tone:
- Calm and kind
- Short sentences (1–4)
- Gentle emoji max 1
Never diagnose. Never ask why. If self-harm → recommend helpline: 1800-599-0019.
"""

model = genai.GenerativeModel("gemini-2.5-flash", system_instruction=SYSTEM_PROMPT)

# MongoDB
mongo = MongoClient(MONGO_URI)
db = mongo["liora"]
chat_collection = db["chat_messages"]
mood_collection = db["mood_results"]
appointments = db["appointments"]
community_posts = db["community_posts"]
journal = db["journal_entries"]

chat_collection.create_index([("user_id", ASCENDING), ("timestamp", DESCENDING)])
mood_collection.create_index([("user_id", ASCENDING), ("timestamp", DESCENDING)])
community_posts.create_index([("timestamp", DESCENDING)])
journal.create_index([("user_id", ASCENDING), ("timestamp", DESCENDING)])

COMMUNITY_NAMES = [
    "Calm Leaf", "Kind Breeze", "Warm Sunset", "Quiet River", "Moon Glow",
    "Brave Lotus", "Soft Dawn", "Gentle Cloud", "Ocean Hush", "Silent Bloom"
]

def get_recent_history(user_id, limit=8):
    msgs = list(chat_collection.find({"user_id": user_id}).sort("timestamp", DESCENDING).limit(limit))[::-1]
    formatted = []
    for m in msgs:
        role = "user" if m["role"] == "user" else "model"
        formatted.append({"role": role, "parts": [m["message"]]})
    return formatted

@app.route("/health")
def health():
    return jsonify({"ok": True})

# ================= Chat =================
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_msg = data.get("text", "").strip()
    user_id = request.headers.get("X-User-ID", "guest")

    if not user_msg:
        return jsonify({"error": "text required"}), 400

    convo = get_recent_history(user_id)
    convo.append({"role": "user", "parts": [user_msg]})

    try:
        response = model.generate_content(convo)
        bot = (response.text or "").strip() or "I'm here with you 💙"
    except:
        bot = "I'm having a little trouble right now. Let's try again soon 💛"

    now = datetime.utcnow()
    chat_collection.insert_many([
        {"user_id": user_id, "role": "user", "message": user_msg, "timestamp": now},
        {"user_id": user_id, "role": "assistant", "message": bot, "timestamp": now}
    ])
    return jsonify({"bot": bot})

# ================= Mood Test =================
PHQ9 = [
    "Little interest or pleasure in doing things?",
    "Feeling down or hopeless?",
    "Trouble sleeping?",
    "Feeling tired or low energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself?",
    "Trouble concentrating?",
    "Restlessness or slowed movement?",
    "Thoughts of self-harm?"
]

GAD7 = [
    "Feeling nervous or anxious?",
    "Not able to control worrying?",
    "Worrying about many things?",
    "Trouble relaxing?",
    "Restlessness?",
    "Irritability?",
    "Feeling something bad will happen?"
]

@app.route("/get-questions")
def get_questions():
    t = request.args.get("test_type", "phq9")
    return jsonify({"questions": PHQ9 if t == "phq9" else GAD7})

@app.route("/submit-answers", methods=["POST"])
def submit_answers():
    data = request.get_json(silent=True) or {}
    answers = data.get("answers", [])
    t = data.get("test_type", "phq9")
    user_id = request.headers.get("X-User-ID", "guest")

    if not answers:
        return jsonify({"error": "answers required"}), 400

    score = sum(int(a) for a in answers)

    category = (
        "Minimal" if score <= 4 else
        "Mild" if score <= 9 else
        "Moderate" if score <= 14 else
        ("Moderately Severe" if t == "phq9" and score <= 19 else "Severe")
    )

    mood_collection.insert_one({
        "user_id": user_id,
        "test_type": t,
        "score": score,
        "category": category,
        "timestamp": datetime.utcnow()
    })

    return jsonify({"score": score, "category": category})

# ✅ Corrected for your TrackMood component
@app.route("/mood-history", methods=["GET"])
def mood_history():
    user_id = request.headers.get("X-User-ID", "guest")
    records = mood_collection.find({"user_id": user_id}).sort("timestamp", ASCENDING)

    history = [{
        "date": r["timestamp"].strftime("%Y-%m-%d"),
        "test_type": r["test_type"],
        "score": r["score"],
        "category": r["category"]
    } for r in records]

    return jsonify(history)

# ================= Book Counselling =================
@app.route("/book-counselling", methods=["POST"])
def book_counselling():
    data = request.get_json(silent=True) or {}
    appointments.insert_one({
        "user_id": request.headers.get("X-User-ID", "guest"),
        "name": data.get("name", "Anonymous"),
        "email": data.get("email", ""),
        "counsellor_type": data.get("counsellor_type", "on-campus"),
        "date": data.get("date"),
        "time": data.get("time"),
        "timestamp": datetime.utcnow()
    })
    return jsonify({"success": True})

# ================= Community =================
@app.route("/community-post", methods=["POST"])
def community_post():
    data = request.get_json(silent=True) or {}
    text = (data.get("message") or "").strip()
    if not text:
        return jsonify({"error": "message required"}), 400

    community_posts.insert_one({
        "user_id": request.headers.get("X-User-ID", "guest"),
        "name": choice(COMMUNITY_NAMES),
        "message": text,
        "timestamp": datetime.utcnow(),
        "reactions": {"heart": 0, "hug": 0, "flower": 0}
    })
    return jsonify({"status": "posted"})

@app.route("/community-feed")
def community_feed():
    posts = community_posts.find().sort("timestamp", DESCENDING)
    return jsonify([{
        "id": str(p["_id"]),
        "name": p["name"],
        "message": p["message"],
        "reactions": p["reactions"],
        "date": p["timestamp"].strftime("%Y-%m-%d")
    } for p in posts])

@app.route("/react", methods=["POST"])
def react():
    data = request.get_json(silent=True) or {}
    pid, rtype = data.get("id"), data.get("type")
    if not pid or rtype not in {"heart", "hug", "flower"}:
        return jsonify({"error": "invalid reaction"}), 400
    community_posts.update_one({"_id": ObjectId(pid)}, {"$inc": {f"reactions.{rtype}": 1}})
    return jsonify({"status": "reacted"})

# ================= Journal =================
@app.route("/journal", methods=["POST"])
def journal_post():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    if not text:
        return jsonify({"error": "text required"}), 400
    journal.insert_one({
        "user_id": request.headers.get("X-User-ID", "guest"),
        "text": text,
        "timestamp": datetime.utcnow()
    })
    return jsonify({"status": "saved"})

@app.route("/journal", methods=["GET"])
def journal_history():
    user_id = request.headers.get("X-User-ID", "guest")
    entries = journal.find({"user_id": user_id}).sort("timestamp", DESCENDING)
    return jsonify([{
        "text": e["text"],
        "date": e["timestamp"].strftime("%Y-%m-%d")
    } for e in entries])

# Run
if __name__ == "__main__":
    app.run(debug=True)
