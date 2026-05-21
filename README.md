# 🧠 Gyaan AI

A full-stack AI-powered chat application that lets you have intelligent conversations with an AI assistant. Gyaan AI uses **Mistral AI** as the primary LLM with **internet search capabilities** via Tavily, so it can answer both general and up-to-date questions.

---

## ✨ Features

- 🤖 **AI Chat** — Conversational AI powered by Mistral AI (`mistral-small-latest`)
- 🌐 **Internet Search** — AI can search the web in real-time using Tavily for current information
- 🔐 **Authentication** — Register, login, and email verification system
- 💬 **Chat History** — All conversations are saved per user
- 🏷️ **Auto Titles** — Chat titles are auto-generated from the first message
- ⚡ **Real-time** — Socket.IO integration for live communication
- 📱 **Responsive UI** — Clean React frontend with SCSS styling

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database |
| Socket.IO | Real-time communication |
| LangChain | AI orchestration framework |
| Mistral AI (`mistral-small-latest`) | Main AI model |
| Google Gemini (`gemini-2.5-flash-lite`) | Secondary AI model |
| Tavily | Internet search tool |
| JWT | Authentication tokens |
| Nodemailer | Email verification |
| bcryptjs | Password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework |
| Redux Toolkit | State management |
| React Router v7 | Client-side routing |
| Socket.IO Client | Real-time updates |
| React Markdown + remark-gfm | Render AI markdown responses |
| SCSS | Styling |
| Lucide React | Icons |

---

## 📁 Project Structure

```
Gyaan AI/
├── Backend/
│   ├── server.js                  # Entry point
│   └── src/
│       ├── app.js                 # Express app setup
│       ├── config/
│       │   ├── config.js          # Environment variables
│       │   └── database.js        # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js # Register, login, verify email
│       │   └── chat.controller.js # Send message, get chats/messages, delete
│       ├── middlewares/
│       │   ├── auth.middleware.js  # JWT verification
│       │   └── error.middleware.js # Global error handler
│       ├── models/
│       │   ├── user.model.js
│       │   ├── chat.model.js
│       │   └── message.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── chat.routes.js
│       ├── services/
│       │   ├── ai.service.js      # LangChain agent + Mistral AI
│       │   ├── internet.service.js # Tavily web search
│       │   └── mail.service.js    # Email via Nodemailer
│       ├── socket/
│       │   └── server.socket.js   # Socket.IO setup
│       └── validators/
│           └── auth.validator.js  # Input validation
└── Frontend/
    └── src/
        ├── app/                   # App entry, routes, store
        ├── features/
        │   ├── auth/              # Login, Register pages + auth slice
        │   └── chats/             # Dashboard, chat UI + chat slice
        └── shared/                # Global styles, mixins, variables
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- API Keys: Mistral AI, Google Gemini, Tavily, Google OAuth (for email)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Gyaan AI"
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
# Server
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/gyaan-ai

# Auth
JWT_SECRET=your_super_secret_jwt_key

# AI Models
GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key

# Google OAuth (for email sending via Nodemailer)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER_EMAIL=your_gmail_address
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

Start the backend:

```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔌 API Reference

### Auth Routes (`/api/auth`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register a new user | ❌ |
| POST | `/login` | Login and get JWT cookie | ❌ |
| GET | `/verify-email?token=...` | Verify email address | ❌ |
| GET | `/get-me` | Get current user info | ✅ |

### Chat Routes (`/api/chats`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/message` | Send a message (creates new chat if no `chatId`) | ✅ |
| GET | `/` | Get all chats of logged-in user | ✅ |
| GET | `/:chatId/messages` | Get all messages in a chat | ✅ |
| DELETE | `/delete/:chatId` | Delete a chat and its messages | ✅ |

---

## 🤖 How the AI Works

1. User sends a message via the frontend
2. Backend saves the message to MongoDB
3. The **LangChain agent** (with Mistral AI) processes the full conversation history
4. If the question needs current information, the agent automatically calls the **Tavily search tool**
5. The AI response is saved to MongoDB and returned to the frontend
6. Chat titles are auto-generated using Mistral AI on the first message of each conversation

---

## 🚀 Scripts

### Backend
```bash
npm run dev    # Start with nodemon (hot reload)
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📝 Environment Variables Summary

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `MISTRAL_API_KEY` | ✅ | Mistral AI API key |
| `TAVILY_API_KEY` | ✅ | Tavily search API key |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID (for email) |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret |
| `GOOGLE_REFRESH_TOKEN` | ✅ | Google OAuth refresh token |
| `GOOGLE_USER_EMAIL` | ✅ | Gmail address for sending emails |
| `BASE_URL` | ✅ | Backend base URL |
| `FRONTEND_URL` | ✅ | Frontend URL (for CORS) |
| `GOOGLE_CALLBACK_URL` | ❌ | Google OAuth callback URL |

---

## 🙏 Acknowledgements

- [LangChain](https://js.langchain.com/) for AI orchestration
- [Mistral AI](https://mistral.ai/) for the language model
- [Tavily](https://tavily.com/) for real-time web search
- [Google Gemini](https://ai.google.dev/) for secondary AI capabilities
