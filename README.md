# MSPID

> 🚧 **Status: Under Development**

[![Status](https://img.shields.io/badge/status-under%20development-orange)](https://github.com/)

This project is currently under active development and is not yet production-ready.
Features, architecture, APIs, and UI may change during development.

Some features may be incomplete or unstable. This repository represents an ongoing work in progress.

# AIShield

A multi-agent AI security system demonstrating how a Defender Agent can detect, evaluate, and prevent attacks before they reach the Target Agent.

## Architecture

```
Attacker Agent
      |
      v
Defender Agent
      |
      +---- BLOCK
      |
      +---- SANITIZE
      |
      +---- ALLOW
               |
               v
          Target Agent
               |
               v
       Output Leakage Detector
               |
               v
             User
```

## Tech Stack

**Backend:**
- Python 3.13
- FastAPI + Uvicorn
- Pydantic + Pydantic Settings
- pytest + pytest-asyncio

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Axios

**Development:**
- Git + GitHub
- VS Code

---

## Phase 1: Project Foundation (Complete)

### Backend Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── api/
│   │   └── health.py        # GET /api/v1/health
│   ├── core/
│   │   └── config.py        # Pydantic Settings
│   └── models/
│       └── health.py        # HealthResponse model
├── tests/
│   └── test_health.py       # Health endpoint tests
├── requirements.txt
├── pytest.ini
└── .env.example
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   └── HealthStatus.tsx # Backend connection indicator
│   ├── pages/
│   │   └── Home.tsx         # Main landing page
│   ├── services/
│   │   └── api.ts           # Axios + healthApi
│   ├── types/
│   │   └── health.ts        # HealthResponse interface
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts           # Proxy /api/* -> localhost:8000
├── tailwind.config.js
├── tsconfig.json
└── .env.example
```

---

## Getting Started

### Prerequisites
- Python 3.13+
- Node.js 18+ / npm 9+

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest -v

# Start server
uvicorn app.main:app --reload
```
- API: http://localhost:8000
- Health: http://localhost:8000/api/v1/health
- Docs: http://localhost:8000/docs

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```
- App: http://localhost:5173
- Proxies `/api/*` to `http://localhost:8000`

### Run Both (Two Terminals)
```bash
# Terminal 1 - Backend
cd backend && .venv\Scripts\activate && uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)
```bash
cp backend/.env.example backend/.env
```
| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | AIShield |
| `APP_VERSION` | Version string | 0.1.0 |
| `DEBUG` | Debug mode | true |
| `HOST` | Server host | 0.0.0.0 |
| `PORT` | Server port | 8000 |
| `API_PREFIX` | API route prefix | /api/v1 |

### Frontend (`frontend/.env`)
```bash
cp frontend/.env.example frontend/.env
```
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend base URL (prod) | http://localhost:8000 |

> **Note:** In development, Vite proxy handles API calls. `VITE_API_BASE_URL` is used only in production builds.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Welcome message |
| GET | `/api/v1/health` | Health check → `{"status": "ok"}` |

---

## Project Status

- [x] **Phase 1**: Project foundation (backend + frontend + health check)
- [ ] **Phase 2**: Agent development (Attacker, Defender, Target with AutoGen)
- [ ] **Phase 3**: ML security (TF-IDF + Logistic Regression)
- [ ] **Phase 4**: Defense logic (ALLOW/SANITIZE/BLOCK)
- [ ] **Phase 5**: Dashboard (Recharts visualization)
- [ ] **Phase 6**: Database (SQLite logging)
- [ ] **Phase 7**: Testing & documentation

---

## License

MIT License - see [LICENSE](LICENSE)
