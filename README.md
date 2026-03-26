PCB Schematic AI - FastAPI (Gemini) + React+TypeScript Prototype

This scaffold contains a backend (FastAPI + Gemini/Vertex AI integration stub)
and a frontend (React + TypeScript + Vite) prototype.

Important: Do NOT commit your Google service account JSON key or real .env files.

Quick start (local)
1. Create service account JSON and set env:
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
   export GCP_PROJECT="your-gcp-project-id"
   export LOCATION="us-central1"
   export GEMINI_MODEL="models/gemini-pro-1"

2. Backend
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

3. Frontend
   cd ../frontend
   npm install
   npm run dev
   Open http://localhost:5173

Structure
- frontend/    React + TypeScript prototype
- backend/     FastAPI + Gemini integration scaffold
- data/        runtime (uploads & generated files)
