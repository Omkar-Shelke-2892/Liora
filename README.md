# Liora – Full-Stack Web Application

Liora is a full-stack web application built with a Python Flask backend and a modern Vite + Tailwind CSS frontend.  
The project is structured to keep backend and frontend concerns cleanly separated while allowing smooth API communication between them.

---

## Tech Stack

**Backend**
- Python
- Flask

**Frontend**
- Vite
- Tailwind CSS
- JavaScript

**Tools**
- npm
- pip
- Git

---

## Project Structure

```

liora/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── README.md
│
├── .gitignore
└── README.md

````

---

## Prerequisites

Make sure the following are installed on your system:

- Python 3.9 or higher
- Node.js 18 or higher
- npm
- Git

---

## Backend Setup (Flask)

### 1. Navigate to backend folder
```bash
cd backend
````

### 2. Create virtual environment

```bash
python -m venv venv
```

### 3. Activate virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Environment variables

Create a `.env` file using the provided template:

```
Copy .env.example → .env
```

Fill in the required values as needed.
**Do not commit `.env` to GitHub.**

### 6. Run backend server

```bash
python app.py
```

Backend will run on:

```
http://localhost:5000
```

---

## Frontend Setup (Vite + Tailwind)

### 1. Navigate to frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## API Communication

* Backend runs on `http://localhost:5000`
* Frontend runs on `http://localhost:5173`
* Frontend makes API calls to the Flask backend
* Ensure the backend server is running before accessing frontend features that depend on APIs

---

## Git & Repository Notes

The following files/folders are intentionally **ignored**:

* `.env`
* `venv/`
* `node_modules/`
* `dist/`
* log files

Refer to `.gitignore` for details.

---

## Common Issues

* **Backend not reachable**: Ensure Flask server is running on port 5000
* **API errors from frontend**: Check backend logs and CORS configuration if applicable
* **Dependency issues**: Delete `venv` or `node_modules` and reinstall dependencies

---

## Author

**Omkar Shelke**

---

## License

This project is for educational and demonstration purposes.
