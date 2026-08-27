# ◈ AI Customer Support Chatbot

A full-stack AI customer support chatbot built with **React, Python,
FastAPI, and the OpenAI API**.

This project demonstrates how a modern frontend application can
communicate with a Python backend, securely integrate with an AI
service, and be deployed as a full-stack application.

> 🚧 The application is deployed. Live AI-generated responses require a
> valid OpenAI API key with available API credits.

---

## 🎯 Project Goal

```text
User
  │
  ▼
React + Vite (Vercel)
  │ POST /chat
  ▼
FastAPI + Python (Render)
  │ OpenAI API
  ▼
OpenAI Model
  │
  ▼
AI Response
  │
  ▼
React Chat Interface
```

The project focuses on practical AI integration rather than calling an
AI API directly from the frontend.

---

## 🌐 Live Demo

### Frontend

https://ai-customer-support-seven-omega.vercel.app/

Deployed with **Vercel**.

### Backend API

https://ai-customer-support-blx6.onrender.com/

Deployed with **Render**.

### API Documentation

https://ai-customer-support-blx6.onrender.com/docs

> The frontend/backend production connection is configured. AI responses
> require a valid OpenAI API key and available API credits.

---

## 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- Vite
- HTML
- CSS

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

### AI

- OpenAI API
- OpenAI Python SDK

### Development & Deployment

- Git
- GitHub
- VS Code
- Environment Variables
- Vercel
- Render

---

## ✨ Current Features

### React Frontend

- Chat input and send message
- Conversation history
- User/AI message bubbles
- Loading and error states
- Auto-scroll
- Clear chat
- Enter-to-send
- Responsive layout
- React state management
- API communication using `fetch()`
- Environment-based API configuration

### FastAPI Backend

- REST API
- `GET /` health check
- `POST /chat`
- JSON request/response handling
- Pydantic validation
- CORS configuration
- OpenAI server-side integration
- Customer-support system instructions
- API error handling
- Graceful handling when an API key is not configured

---

## 📌 Current Project Status

The application is fully deployed and operational.

The React frontend communicates with the FastAPI backend, which securely sends customer messages to the OpenAI API and returns AI-generated customer-support responses.

The production application includes:

- Secure server-side OpenAI API integration
- Customer-support system instructions
- Conversation history
- Loading and error states
- API error handling
- Environment-based configuration
- Vercel frontend deployment
- Render backend deployment
- Live AI-generated responses

All API credentials are stored securely as backend environment variables and are never exposed to the frontend or committed to GitHub.

---

## 🔐 Security

Sensitive credentials are never committed to GitHub.

Local development uses environment variables stored in `.env` files,
which are excluded through `.gitignore`. Production secrets are
configured directly through the hosting provider.

### Backend

```env
OPENAI_API_KEY=your_api_key_here
```

### Frontend

```env
VITE_API_URL=https://ai-customer-support-blx6.onrender.com
```

The OpenAI API key is only used by the FastAPI backend and is never
exposed to the React frontend.

---

## 📁 Project Structure

```text
ai-customer-support/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env
│   └── venv/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

`.env`, `venv`, and `node_modules` are local-only and should not be
committed to Git.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AubreyMartin/ai-customer-support.git
cd ai-customer-support
```

### 2. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
OPENAI_API_KEY=your_api_key_here
```

Start the backend:

```bash
python -m uvicorn app:app --reload
```

Local backend: `http://127.0.0.1:8000`

Interactive API docs: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Local frontend: `http://localhost:5173`

---

## 🔌 API

### `GET /`

Health check endpoint.

```json
{
  "message": "AI Customer Support API is running!"
}
```

### `POST /chat`

Receives a customer message and returns an AI response when the OpenAI
API is configured.

Example request:

```json
{
  "message": "Where is my order?"
}
```

When the OpenAI API key is not configured, the backend returns a
controlled service-unavailable response rather than crashing.

---

## 🧠 What This Project Demonstrates

- React state management
- REST APIs
- HTTP GET and POST requests
- JSON request/response handling
- `fetch()` API
- FastAPI
- Pydantic validation
- CORS
- Python virtual environments
- Environment variables
- API key security
- Git/GitHub workflow
- Frontend/backend architecture
- Server-side AI API integration
- Error handling
- Full-stack deployment

---

## 🗺️ Roadmap

### Phase 1 --- Foundation

- [x] Project setup
- [x] Git/GitHub
- [x] FastAPI backend
- [x] React frontend
- [x] Frontend/backend communication
- [x] Customer support chat interface
- [x] Loading and error handling
- [x] Conversation management

### Phase 2 --- AI Integration

- [x] OpenAI API integration
- [x] Server-side AI requests
- [x] AI response handling
- [x] Error handling
- [x] Secure API configuration

> OpenAI integration is implemented. A valid API key and available API
> credits are required to enable live AI responses.

### Phase 3 --- Chatbot Experience

- [x] Conversation history
- [x] User/AI message bubbles
- [x] Loading indicator
- [x] System prompt
- [x] Customer-support context
- [x] Clear conversation

### Phase 4 --- Production

- [x] Responsive design
- [x] Testing
- [x] Deployment
- [x] Production environment variables
- [x] Live demo

---

## 🚀 Deployment

### Frontend --- Vercel

The React/Vite frontend is deployed on Vercel.

```env
VITE_API_URL=https://ai-customer-support-blx6.onrender.com
```

### Backend --- Render

The FastAPI backend is deployed on Render.

When available, configure the OpenAI API key as a Render environment
variable:

```env
OPENAI_API_KEY=your_api_key_here
```

The API key must never be committed to the repository.

---

## 📸 Demo

Live application: https://ai-customer-support-seven-omega.vercel.app/

Backend health endpoint: https://ai-customer-support-blx6.onrender.com/

Interactive backend API documentation:
https://ai-customer-support-blx6.onrender.com/docs

---

## 👨‍💻 Author

**Aubrey Martin**

Developer focused on React, JavaScript, modern web application
development, API integration, and practical AI-powered applications.
