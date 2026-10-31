# Job Mailer

- `backend/`  - Express API (Groq extraction + Nodemailer)
- `frontend/` - Vite + React + pure CSS (CSS in `src/styles/`)

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env     # fill GROQ_API_KEY, EMAIL_USER, EMAIL_PASS
# put your resume at backend/resume.pdf (it is attached automatically)
npm run dev              # http://localhost:5000
```

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```
Open http://localhost:5173

## Production
- Backend: set `CLIENT_URL` to your frontend URL.
- Frontend: set `VITE_API_URL` to your backend URL, then `npm run build`.
