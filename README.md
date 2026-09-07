◈ AI Customer Support Chatbot

A full-stack AI customer support chatbot built with React, FastAPI,
OpenAI, and PostgreSQL.

This project demonstrates how a modern frontend application can
communicate with a Python backend, securely integrate with an AI
service, and persist conversations in a hosted SQL database.

🚧 The application is deployed. Live AI-generated responses require a
valid OpenAI API key with available API credits.

🎯 Project Goal

User
│
▼
React + Vite (Vercel)
│ POST /chat
▼
FastAPI + Python (Render)
├──────────────► PostgreSQL (Neon)
│ Stores conversations
│ and messages
│
└──► OpenAI API ──► AI Response
▼
React Chat Interface

The project focuses on practical AI integration rather than calling an
AI API directly from the frontend.

🌐 Live Demo

Frontend

https://ai-customer-support-seven-omega.vercel.app/

Deployed with Vercel.

Backend API

https://ai-customer-support-blx6.onrender.com/

Deployed with Render.

API Documentation

https://ai-customer-support-blx6.onrender.com/docs

The frontend/backend production connection is configured. AI responses
require a valid OpenAI API key and available API credits.

🛠️ Tech Stack

Frontend

React

JavaScript

Vite

HTML

CSS

Backend

Python

FastAPI

Uvicorn

Pydantic

SQLModel

SQLAlchemy

Psycopg

Database

PostgreSQL

Neon hosted database

Conversation and message persistence

AI

OpenAI API

OpenAI Python SDK

Development & Deployment

Git

GitHub

VS Code

Environment Variables

Vercel

Render

✨ Current Features

React Frontend

Chat input and send message

Conversation history

User/AI message bubbles

Loading and error states

Auto-scroll

Clear chat

Enter-to-send

Responsive layout

React state management

API communication using fetch()

Environment-based API configuration

FastAPI Backend

REST API

GET / health check

POST /chat

JSON request/response handling

Pydantic validation

CORS configuration

OpenAI server-side integration

Customer-support system instructions

API error handling

Graceful handling when an API key is not configured

Creates and continues conversations using UUIDs

Stores user and assistant messages in PostgreSQL

Automatically creates database tables during application startup

📌 Current Project Status

The frontend and backend are deployed. PostgreSQL connectivity and user-message
persistence have been verified against the hosted Neon database.

The OpenAI integration is implemented, but live assistant responses are currently
disabled because the API account requires available credits. Assistant-message
persistence will be verified after credits are enabled.

The production application includes:

Secure server-side OpenAI API integration

Customer-support system instructions

Conversation history

Loading and error states

API error handling

Environment-based configuration

Vercel frontend deployment

Render backend deployment

Hosted PostgreSQL integration

Persistent conversation and message tables

All API credentials are stored securely as backend environment variables and are never exposed to the frontend or committed to GitHub.

🔐 Security

Sensitive credentials are never committed to GitHub.

Local development uses environment variables stored in .env files,
which are excluded through .gitignore. Production secrets are
configured directly through the hosting provider.

Backend

OPENAI_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

Frontend

VITE_API_URL=https://ai-customer-support-blx6.onrender.com

The OpenAI API key is only used by the FastAPI backend and is never
exposed to the React frontend.

📁 Project Structure

ai-customer-support/
│
├── backend/
│ ├── app.py
│ ├── database.py
│ ├── models.py
│ ├── requirements.txt
│ ├── .env
│ └── venv/
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── ...
│
├── .gitignore
└── README.md

.env, venv, and node_modules are local-only and should not be
committed to Git.

⚙️ Getting Started

1. Clone the Repository

git clone https://github.com/AubreyMartin/ai-customer-support.git
cd ai-customer-support

2. Backend Setup

cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

Create backend/.env:

OPENAI_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

Start the backend:

python -m uvicorn app:app --reload

Local backend: http://127.0.0.1:8000

Interactive API docs: http://127.0.0.1:8000/docs

3. Frontend Setup

cd frontend
npm install

Create frontend/.env:

VITE_API_URL=http://127.0.0.1:8000

Start the frontend:

npm run dev

Local frontend: http://localhost:5173

🔌 API

GET /

Health check endpoint.

{
"message": "AI Customer Support API is running!"
}

POST /chat

Receives a customer message and returns an AI response when the OpenAI
API is configured.

Example request:

{
"message": "Where is my order?",
"conversation_id": null
}

The first request can omit conversation_id. The API creates a conversation and
returns its UUID:

{
"conversation_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
"reply": "Please share your order number so I can help you check it."
}

Send the returned UUID with later messages to continue the same conversation.

When the OpenAI API key is not configured, the backend returns a
controlled service-unavailable response rather than crashing.

🧠 What This Project Demonstrates

React state management

REST APIs

HTTP GET and POST requests

JSON request/response handling

fetch() API

FastAPI

Pydantic validation

CORS

Python virtual environments

Environment variables

API key security

Git/GitHub workflow

Frontend/backend architecture

Server-side AI API integration

PostgreSQL schema design

SQLModel and SQLAlchemy

One-to-many database relationships

Persistent chat storage

Error handling

Full-stack deployment

🗺️ Roadmap

Phase 1 --- Foundation

Project setup

Git/GitHub

FastAPI backend

React frontend

Frontend/backend communication

Customer support chat interface

Loading and error handling

Conversation management

Phase 2 --- AI Integration

OpenAI API integration

Server-side AI requests

AI response handling

Error handling

Secure API configuration

OpenAI integration is implemented. A valid API key and available API
credits are required to enable live AI responses.

Phase 3 --- Chatbot Experience

Conversation history

User/AI message bubbles

Loading indicator

System prompt

Customer-support context

Clear conversation

Phase 4 --- Production

Responsive design

Testing

Deployment

Production environment variables

Live demo

Phase 5 --- PostgreSQL Persistence

Create a hosted Neon PostgreSQL database

Connect FastAPI using SQLModel and Psycopg

Create conversations and messages tables

Store user messages with conversation UUIDs

Implement assistant-message persistence

Verify assistant persistence with active OpenAI API credits

Reuse the conversation UUID from the React frontend

Load stored chat history from the database

🚀 Deployment

Frontend --- Vercel

The React/Vite frontend is deployed on Vercel.

VITE_API_URL=https://ai-customer-support-blx6.onrender.com

Backend --- Render

The FastAPI backend is deployed on Render.

When available, configure the OpenAI API key as a Render environment
variable:

OPENAI_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

The API key must never be committed to the repository.

📸 Demo

Live application: https://ai-customer-support-seven-omega.vercel.app/

Backend health endpoint: https://ai-customer-support-blx6.onrender.com/

Interactive backend API documentation:
https://ai-customer-support-blx6.onrender.com/docs

👨‍💻 Author

Aubrey Martin

Developer focused on React, JavaScript, modern web application
development, API integration, and practical AI-powered applications.
