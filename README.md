# 🤖 AI Customer Support Chatbot

A full-stack AI customer support chatbot built with **React, Python, FastAPI, and the OpenAI API**.

This project demonstrates how a modern frontend application can communicate with a Python backend and securely integrate with an AI service.

> 🚧 This project is actively being developed step-by-step.

---

## 🎯 Project Goal

The goal is to build a customer support chatbot while understanding the complete application flow:

```text
React Frontend
      │
      │ POST /chat
      ▼
FastAPI Backend
      │
      │ OpenAI API
      ▼
AI Model
      │
      ▼
AI Response
      │
      ▼
React Chat Interface
```

The project focuses on practical AI integration, rather than simply calling an AI API from the frontend.

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

### Development

- Git
- GitHub
- VS Code
- Environment Variables

---

## 🚀 Current Status

### Completed

- [x] Project setup
- [x] Git repository
- [x] GitHub repository
- [x] Python virtual environment
- [x] FastAPI backend
- [x] `GET /` health endpoint
- [x] `POST /chat` endpoint
- [x] Pydantic request validation
- [x] CORS configuration
- [x] React frontend
- [x] React → FastAPI communication
- [x] Local end-to-end request flow
- [x] Environment variable setup
- [x] API key protection with `.gitignore`

### In Progress

- [ ] Professional chatbot UI
- [ ] Conversation history
- [ ] Loading states
- [ ] Error handling
- [ ] Real OpenAI response integration
- [ ] Customer-support system prompt
- [ ] Responsive design
- [ ] Deployment

---

## ✨ Current Features

### React Frontend

- Chat input
- Send message
- Display backend response
- React state management
- API communication using `fetch()`

### FastAPI Backend

- REST API
- `GET /` health check
- `POST /chat`
- JSON request/response handling
- Pydantic validation
- CORS configuration

---

## 💬 Current Chat Flow

At the moment, the backend uses a temporary response so the complete application flow can be developed and tested without requiring OpenAI API credits.

### Example Request

```json
{
  "message": "Where is my order?"
}
```

### Example Response

```json
{
  "reply": "You said: Where is my order?"
}
```

The temporary response will later be replaced with a real OpenAI response.

---

## 🔐 Security

The OpenAI API key is **never stored in the source code**.

The key is stored locally in:

```text
backend/.env
```

Example:

```env
OPENAI_API_KEY=your_api_key_here
```

The `.env` file is excluded from Git using `.gitignore`.

> ⚠️ Never commit an API key to GitHub or expose it in frontend JavaScript.

---

## 📁 Project Structure

```text
ai-customer-support/
│
├── backend/
│   ├── app.py
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

> `.env`, `venv`, and `node_modules` are local-only files and should not be committed to Git.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AubreyMartin/ai-customer-support.git
cd ai-customer-support
```

---

## 🐍 Backend Setup

Move into the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install fastapi uvicorn openai python-dotenv
```

Create a `.env` file:

```env
OPENAI_API_KEY=your_api_key_here
```

Start the backend:

```bash
python -m uvicorn app:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## ⚛️ Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔌 API

### `GET /`

Health check endpoint.

#### Response

```json
{
  "message": "AI Customer Support API is running!"
}
```

---

### `POST /chat`

Receives a customer message and returns a response.

#### Request

```json
{
  "message": "Where is my order?"
}
```

#### Current Response

```json
{
  "reply": "You said: Where is my order?"
}
```

---

## 🧠 What This Project Demonstrates

This project covers practical concepts including:

- React state management
- REST APIs
- HTTP GET and POST
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
- AI API integration

---

## 🗺️ Roadmap

### Phase 1 — Foundation

- [x] Project setup
- [x] Git/GitHub
- [x] FastAPI backend
- [x] React frontend
- [x] Frontend/backend communication

### Phase 2 — AI Integration

- [ ] OpenAI API integration
- [ ] Server-side AI requests
- [ ] AI response handling
- [ ] Error handling
- [ ] Secure API configuration

### Phase 3 — Chatbot Experience

- [ ] Conversation history
- [ ] User/AI message bubbles
- [ ] Loading indicator
- [ ] System prompt
- [ ] Customer-support context
- [ ] Clear conversation

### Phase 4 — Production

- [ ] Responsive design
- [ ] Testing
- [ ] Deployment
- [ ] Production environment variables
- [ ] Live demo

---

## 📸 Demo

A live demo and screenshots will be added after the chatbot UI and deployment are completed.

---

## 👨‍💻 Author

**Aubrey Martin**

Software engineer focused on React, JavaScript, and modern web application development.

---

## 📌 Project Status

🚧 **Actively developed**

This repository documents the project from initial API setup through AI integration and deployment.
