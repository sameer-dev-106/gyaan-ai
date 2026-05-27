# 🧠 Gyaan AI

A full-stack AI-powered chat application built with React and Node.js. Gyaan AI uses **Mistral AI** as the primary LLM with real-time **internet search** via Tavily, persistent **AI memory** that learns about you over time, and a complete **PWA** experience.

---

## ✨ Features

- 🤖 **AI Chat** — Powered by Mistral AI (`mistral-small-latest`) with LangChain orchestration
- 🌐 **Internet Search** — AI searches the web in real-time via Tavily for current information
- 🧠 **AI Memory** — Remembers facts about you across conversations; learns your preferences over time
- 👤 **Complete Profile** — Set your name, profession, location, language preference, and AI response style
- 🔐 **Authentication** — Register, email verification (via Resend), login with JWT cookies
- 💬 **Chat History** — All conversations saved per user with auto-generated titles
- ⚡ **Real-time** — Socket.IO for live message streaming
- 📱 **PWA** — Installable as a native-like app on desktop and mobile
- ⚙️ **Settings** — Change username, password, clear AI memory

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database |
| Socket.IO | Real-time communication |
| LangChain | AI orchestration |
| Mistral AI (`mistral-small-latest`) | Primary AI model |
| Google Gemini (`gemini-2.5-flash-lite`) | Secondary AI model (chat titles) |
| Tavily | Real-time web search tool |
| Resend | Transactional email (verification) |
| JWT + bcryptjs | Auth tokens + password hashing |

### Frontend

| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework |
| Redux Toolkit | Global state management |
| React Router v7 | Client-side routing |
| Socket.IO Client | Real-time updates |
| React Markdown + remark-gfm | Render AI markdown responses |
| SCSS Modules | Component styling |
| Lucide React | Icons |
| Vite PWA Plugin | Service worker + installability |

---

## 📁 Project Structure

```
Gyaan AI/
├── Backend/
│   ├── server.js
│   ├── public/                        # Built frontend (served by Express)
│   └── src/
│       ├── app.js                     # Express app setup
│       ├── config/
│       │   ├── config.js              # Environment variable exports
│       │   └── database.js            # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js     # Register, login, verify, profile, password
│       │   ├── chat.controller.js     # Send message, get chats/messages, delete
│       │   └── memory.controller.js   # Get memory, update preferences, clear facts
│       ├── middlewares/
│       │   ├── auth.middleware.js     # JWT cookie verification
│       │   └── error.middleware.js    # Global error handler
│       ├── models/
│       │   ├── user.model.js          # User schema (profileCompleted flag included)
│       │   ├── chat.model.js
│       │   ├── message.model.js
│       │   └── usermemory.model.js    # AI memory (preferences + facts)
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── chat.routes.js
│       │   └── memory.routes.js
│       ├── services/
│       │   ├── ai.service.js          # LangChain agent + tools
│       │   ├── internet.service.js    # Tavily web search
│       │   ├── memory.service.js      # Memory CRUD helpers
│       │   └── mail.service.js        # Resend email
│       ├── socket/
│       │   └── server.socket.js       # Socket.IO setup
│       └── validators/
│           └── auth.validator.js      # express-validator rules
│
└── Frontend/
    └── src/
        ├── app/                       # Router, Redux store, global styles
        ├── features/
        │   ├── auth/
        │   │   ├── pages/             # Login, Register, VerifyEmail, CheckInbox, CompleteProfile
        │   │   ├── components/        # AuthLeft, Protected
        │   │   ├── hooks/             # useAuth
        │   │   ├── services/          # auth.api.js
        │   │   └── auth.slice.js
        │   ├── chats/
        │   │   ├── pages/             # Dashboard
        │   │   ├── components/        # Sidebar, Topbar, MessageItem, InputArea, InstallPWA, ...
        │   │   ├── hooks/             # useChat
        │   │   ├── services/          # chat.api.js, chat.socket.js
        │   │   └── chat.slice.js
        │   └── settings/
        │       ├── pages/             # Settings
        │       ├── services/          # memory.api.js
        │       └── setting.slice.js
        └── shared/                    # Toast, global SCSS, variables, mixins
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- API keys: Mistral AI, Google Gemini, Tavily, Resend

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

Create a `.env` file in `Backend/`:

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
MISTRAL_API_KEY=your_mistral_api_key
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Create a `.env` file in `Frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Frontend runs on `http://localhost:5173`

---

## 🔌 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register new user + send verification email | ❌ |
| POST | `/login` | Login, returns JWT cookie + `profileCompleted` flag | ❌ |
| GET | `/verify-email?token=` | Verify email via token | ❌ |
| GET | `/me` | Get current logged-in user | ✅ |
| POST | `/logout` | Clear JWT cookie | ✅ |
| PUT | `/update-profile` | Update username | ✅ |
| PUT | `/change-password` | Change password | ✅ |

### Chat Routes — `/api/chats`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/message` | Send message (creates chat if no `chatId`) | ✅ |
| GET | `/` | Get all chats of logged-in user | ✅ |
| GET | `/:chatId/messages` | Get all messages in a chat | ✅ |
| DELETE | `/delete/:chatId` | Delete a chat and its messages | ✅ |

### Memory Routes — `/api/memory`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get user's memory (preferences + AI-extracted facts) | ✅ |
| PUT | `/preferences` | Update profile preferences (also marks `profileCompleted`) | ✅ |
| DELETE | `/facts` | Clear AI-extracted facts (keep preferences) | ✅ |

---

## 🔄 User Flow

```
Register → Check Inbox → Verify Email → Login
    └── First login?
          ├── profileCompleted = false → /complete-profile → Dashboard
          └── profileCompleted = true  → Dashboard
```

---

## 🤖 How the AI Works

1. User sends a message via the frontend
2. Backend saves the message to MongoDB
3. The **LangChain agent** loads the user's AI memory (preferences + past facts) and full conversation history
4. If the question needs current info, the agent calls the **Tavily search tool** automatically
5. AI response is saved to MongoDB and emitted back via Socket.IO
6. The agent also extracts new facts about the user from the conversation and stores them in memory
7. Chat titles are auto-generated using Gemini on the first message of each conversation

---

## 📱 PWA — Install as App

Gyaan AI is a fully installable PWA. When you open it in a supported browser (Chrome, Edge, etc.), an **Install App** button appears in the sidebar. Tap it to install directly to your home screen or desktop — no app store needed.

If you uninstall and want to reinstall, just open the browser version again and the install button will reappear.

---

## 🚀 Scripts

### Backend
```bash
npm run dev      # Start with nodemon (hot reload)
```

### Frontend
```bash
npm run dev      # Vite dev server
npm run build    # Production build → output to Backend/public
npm run preview  # Preview production build
npm run lint     # ESLint
```

---

## 📝 Environment Variables

| Variable | Where | Required | Description |
|---|---|---|---|
| `MONGO_URI` | Backend | ✅ | MongoDB connection string |
| `JWT_SECRET` | Backend | ✅ | Secret for JWT signing |
| `MISTRAL_API_KEY` | Backend | ✅ | Mistral AI API key |
| `GEMINI_API_KEY` | Backend | ✅ | Google Gemini API key |
| `TAVILY_API_KEY` | Backend | ✅ | Tavily search API key |
| `RESEND_API_KEY` | Backend | ✅ | Resend email API key |
| `BASE_URL` | Backend | ✅ | Backend base URL |
| `FRONTEND_URL` | Backend | ✅ | Frontend URL (for CORS + email links) |
| `NODE_ENV` | Backend | ✅ | `development` or `production` |
| `VITE_BACKEND_URL` | Frontend | ✅ | Backend URL for API calls |

---

## 🙏 Acknowledgements

- [LangChain](https://js.langchain.com/) — AI orchestration
- [Mistral AI](https://mistral.ai/) — Primary language model
- [Google Gemini](https://ai.google.dev/) — Chat title generation
- [Tavily](https://tavily.com/) — Real-time web search
- [Resend](https://resend.com/) — Email delivery
