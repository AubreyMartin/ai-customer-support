# AI Customer Support Chatbot

A full-stack customer-support chatbot built with React, FastAPI, OpenAI,  
PostgreSQL, and Clerk authentication.

Customers authenticate securely, send requests through a protected API, and  
have their conversations stored against their own user account in PostgreSQL.

> The application is deployed. Live AI responses require an OpenAI API key  
> with available API credits.

## Live Demo

- **Frontend:** [https://ai-customer-support-seven-omega.vercel.app/](https://ai-customer-support-seven-omega.vercel.app/)
- **Backend:** [https://ai-customer-support-blx6.onrender.com/](https://ai-customer-support-blx6.onrender.com/)
- **API documentation:** [https://ai-customer-support-blx6.onrender.com/docs](https://ai-customer-support-blx6.onrender.com/docs)

## Architecture

```
Customer
   |
   v
React + Vite (Vercel)
   |-- Clerk email-link / Google authentication
   |-- Authenticated POST /chat request
   v
FastAPI (Render)
   |-- Verifies the Clerk session token
   |-- Enforces conversation ownership
   |-- Stores user-scoped chats in PostgreSQL (Neon)
   |-- Sends customer questions to the OpenAI API
   v
AI response returned to the React interface
```

The OpenAI key and Clerk secret key remain on the backend and are never  
exposed to the browser.

## Features

### Authentication and security

- Passwordless email-link authentication with Clerk
- Google sign-in
- Signed-out users cannot access the chatbot
- User account management and sign-out
- Clerk session tokens attached to API requests
- Server-side token verification in FastAPI
- PostgreSQL conversations associated with Clerk user IDs
- Ownership checks prevent access to another user's conversation
- Secrets stored in environment variables

### React frontend

- Responsive customer-support chat interface
- User and assistant message bubbles
- Loading and error states
- Enter-to-send and automatic scrolling
- Clear-chat action
- Conversation UUID reuse during the active session
- Environment-based backend URL

### FastAPI backend

- Public health-check endpoint
- Protected `POST /chat` endpoint
- Pydantic request and response validation
- Clerk authentication dependency
- CORS configuration for local and deployed frontends
- Server-side OpenAI integration
- Customer-support system instructions
- Controlled authentication, quota, and API error responses

### PostgreSQL persistence

- Hosted Neon PostgreSQL database
- SQLModel and SQLAlchemy integration
- Separate conversation and message tables
- One-to-many conversation/message relationship
- UUID conversation identifiers
- Clerk user ID stored on every new conversation
- User and assistant message persistence

## Technology Stack

| Layer          | Technologies                                               |
| -------------- | ---------------------------------------------------------- |
| Frontend       | React, JavaScript, Vite, HTML, CSS                         |
| Authentication | Clerk React, email links, Google OAuth, JWT session tokens |
| Backend        | Python, FastAPI, Uvicorn, Pydantic                         |
| AI             | OpenAI API, OpenAI Python SDK                              |
| Database       | PostgreSQL, Neon, SQLModel, SQLAlchemy, Psycopg            |
| Deployment     | Vercel, Render, GitHub                                     |

## Project Structure

```
ai-customer-support/
├── backend/
│   ├── app.py             # FastAPI routes and chat workflow
│   ├── auth.py            # Clerk token verification
│   ├── database.py        # PostgreSQL engine and sessions
│   ├── models.py          # Conversation and message models
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Authenticated chat interface
│   │   ├── App.css
│   │   └── main.jsx       # ClerkProvider and React entry point
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

Local `.env` files, virtual environments, and `node_modules` are excluded  
from Git.

## Local Setup

### 1. Clone the repository

```
git clone https://github.com/AubreyMartin/ai-customer-support.git
cd ai-customer-support
```

### 2. Configure the backend

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
OPENAI_API_KEY=your_openai_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_AUTHORIZED_PARTIES=http://localhost:5173
```

Start FastAPI:

```
python -m uvicorn app:app --reload
```

### 3. Configure the frontend

```
cd ../frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://127.0.0.1:8000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start Vite:

```
npm run dev
```

The frontend runs at `http://localhost:5173`; FastAPI runs at  
`http://127.0.0.1:8000`.

## API

### `GET /`

Public health check:

```
{
  "message": "AI Customer Support API is running!"
}
```

### `POST /chat`

Requires a Clerk session token:

```
Authorization: Bearer <session-token>
Content-Type: application/json
```

Example request:

```
{
  "message": "Where is my order?",
  "conversation_id": null
}
```

Example response:

```
{
  "conversation_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "reply": "Please share your order number so I can help you check it."
}
```

The first request creates a conversation owned by the authenticated Clerk  
user. Later requests send the returned UUID to continue that conversation.  
FastAPI rejects attempts to continue conversations owned by another user.

## Verified Functionality

- React and FastAPI communicate locally and in deployed environments
- Clerk email-link and Google authentication work locally
- Signed-out chatbot access is blocked
- FastAPI verifies Clerk session tokens
- Authenticated conversations store a Clerk user ID in Neon
- User messages persist when the OpenAI API returns a quota error
- Frontend and backend production builds complete successfully

## Current Limitations

- Live AI responses require available OpenAI API credits
- Saved conversation history is not yet displayed after a page reload
- Final production Clerk verification and multi-user testing remain

## Roadmap

- Build the React chat interface and FastAPI API
- Integrate the OpenAI API server-side
- Deploy the frontend and backend
- Connect hosted PostgreSQL
- Persist conversations and messages
- Add Clerk email-link and Google authentication
- Protect the frontend and FastAPI chat endpoint
- Store conversations per authenticated user
- Enforce conversation ownership
- Complete production Clerk verification
- Test isolation with two user accounts
- Load saved conversation history in the frontend
- Verify assistant-message persistence with active OpenAI credits

## What This Project Demonstrates

- React state management and authenticated UI rendering
- REST API design and `fetch()` integration
- JWT authentication across separate frontend and backend services
- FastAPI dependencies and Pydantic validation
- PostgreSQL schema design and one-to-many relationships
- User-scoped data access and authorization checks
- Secure server-side AI integration
- Environment-based configuration
- Full-stack deployment with Vercel, Render, and Neon

## Author

**Aubrey Martin**

Developer focused on React, JavaScript, modern web applications, API  
integration, and practical AI-powered products.
