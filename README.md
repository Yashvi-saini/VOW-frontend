# VOW (Virtual Organized World) - Frontend Web Application

[![React Version](https://img.shields.io/badge/React-v19.1.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v7.1.10-purple.svg)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux--Toolkit-v2.9.2-violet.svg)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.1.14-cyan.svg)](https://tailwindcss.com/)
[![Socket.io Client](https://img.shields.io/badge/Socket.io--Client-v4.8.1-black.svg)](https://socket.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-v2.0-blue.svg)](https://cloudinary.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google--GenAI-v1.29.0-orange.svg)](https://ai.google.dev/)
[![Backend Repository](https://img.shields.io/badge/Backend-VOW__backend-green.svg)](https://github.com/raj-krr/VOW_backend)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

**VOW (Virtual Organized World)** is an interactive, real-time spatial web application designed for distributed remote teams. Built on React 19, Vite, Redux Toolkit, and Socket.io, the frontend provides a 2D spatial virtual office interface where team members navigate custom avatars, initiate spontaneous 1-on-1 chats upon avatar collision, collaborate in real-time text channels & DMs, participate in WebRTC SFU video/audio meetings, and query an integrated Google Gemini AI workspace copilot.

> 🔗 **Repositories Ecosystem**:
> - 🎨 **Frontend Repository (This Repo)**: [https://github.com/raj-krr/VOW](https://github.com/raj-krr/VOW)
> - ⚙️ **Backend Repository**: [https://github.com/raj-krr/VOW_backend](https://github.com/raj-krr/VOW_backend)

---

## 🎯 Full-Stack Context & Problem VOW Solves

In conventional remote work setups, team members operate in static, disconnected browser tabs. Communication requires manual overhead: copying Zoom links, searching Slack handles, or sending calendar invites.

### How VOW Fixes It (Full-Stack Solution):
1. **Visual Co-Presence**: A live 2D virtual office grid map where team members see each other's avatars moving in real-time (~16Hz updates synchronized via WebSockets with the backend).
2. **Frictionless Spontaneous DM Chat**: Walking your avatar into another teammate's avatar on the 2D grid **automatically opens a direct 1-on-1 chat window**, simulating walking over to a colleague's desk in a physical office.
3. **Unified Workspace Interface**: Text channels, DMs, unread counters, WebRTC video conference rooms, Cloudinary media lightbox previews, and AI assistance all reside within a single responsive view.
4. **Role Governance & Security**: Dual-token JWT architecture (Master Auth Token + Workspace Session Token) enforcing granular privileges for **Managers**, **Supervisors**, and **Team Members**.

---

## 🚀 Key Frontend Features

### 1. 🎮 2D Spatial Office & Avatar Collision Engine
- **Spatial Avatar Navigation**: Smooth WASD / Arrow Key / Click-to-move spatial avatar controls synchronized at ~16Hz via WebSockets.
- **Proximity Collision Triggers**: Automatic avatar collision detection triggering direct message (DM) window opening.
- **Dynamic Tilemap & Layers**: Multi-layered canvas rendering (`AvatarsLayer`, tilemaps, furniture objects).
- **Self-Identification**: Clear `(You)` tag and distinct highlight border around your own avatar.

### 2. 💬 Real-Time Unified Chat System
- **Channel & DM Navigation**: Seamless tab switching between persistent team channels and private 1-on-1 DMs.
- **Real-Time Unread Counters**: Instant unread badges on workspace member items updated via Socket events (`unread_count_update`).
- **Media Lightbox & File Attachments**: Cloudinary image upload handling, inline file attachments, and full-screen image lightbox modal (`fileapitester.jsx`).
- **Emoji Picker & Reactions**: Full emoji selection (`emoji-picker-react`) and inline message reactions.

### 3. 🎥 WebRTC SFU Video/Audio Huddles
- **Multi-Party Conference**: Low-latency video and audio streams powered by SFU WebRTC signaling (`sfuSignaling.js`, `useSfuVideoCall.js`).
- **Controls**: Mute microphone, toggle camera, and screen sharing controls.

### 4. 🤖 Integrated Gemini AI Copilot
- **AI Workspace Chat**: Interactive drawer (`geminichat.jsx`, `geminiservice.js`) leveraging Google Gemini API (`@google/genai`) to answer questions, summarize team channels, and assist with workflows.

### 5. 🔐 Multi-Tenant Workspace & Role Views
- **RBAC Responsive Panels**: Customized action drawers and controls for **Manager**, **Supervisor**, and **Team Member** roles.
- **Invite Code & Team Builder**: Modal dialogs (`CreateTeamModal`, `SupervisorSelect`, `MemberMultiSelect`) for building workspace teams.

---

## 🏗️ Full-Stack & Frontend Architecture

### Full-Stack System Topology

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              VOW Frontend (React 19 + Vite)                            │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────────────────────┐ │
│ │   2D Office Canvas   │  │    Redux Toolkit     │  │       Chat & Media Panel       │ │
│ │  (Spatial Navigation)│  │ (State & Persistence)│  │ (ChatLayout / VideoConference) │ │
│ └──────────┬───────────┘  └──────────┬───────────┘  └───────────────┬────────────────┘ │
└────────────┼─────────────────────────┼──────────────────────────────┼──────────────────┘
             │                         │                              │
             │ REST API (Axios)        │ Socket.io & WebRTC           │ Cloudinary / AI
             ▼                         ▼                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         VOW Backend Server (Express 5 + TypeScript)                    │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────────────────────┐ │
│ │   REST Controllers   │  │ Socket.io Handlers   │  │      WebRTC SFU Signaling      │ │
│ │ (Auth, Workspace, DM)│  │(Presence, Spatial 16Hz)│ │     (Video / Audio Huddles)    │ │
│ └──────────┬───────────┘  └──────────┬───────────┘  └───────────────┬────────────────┘ │
└────────────┼─────────────────────────┼──────────────────────────────┼──────────────────┘
             │                         │                              │
             ▼                         ▼                              ▼
 ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────────┐
 │ MongoDB Atlas Database│   │ Cloudinary Media CDN  │   │  Google Gemini AI Service │
 └───────────────────────┘   └───────────────────────┘   └───────────────────────────┘
```

### Frontend State Architecture (Redux Toolkit)

- **`userSlice`**: Auth token, user profile data (name, email, avatar URL), authentication status.
- **`workspaceSlice`**: Active workspace ID, workspace metadata, members list, user role within current workspace.
- **`presenceSlice`**: Spatial positions `(x, y)` of all workspace members, online status, collision state events.
- **`teamSlice`**: Active team channels, selected channel/DM target, message logs, typing indicators, unread counters.

### Frontend Communication Layer (API & Sockets)
- **`src/api/authApi.js`**: Login, Signup, OTP verification, Password Reset endpoints.
- **`src/api/workspaceApi.js`**: Workspace creation, join via invite code, member listing.
- **`src/components/chat/socket.jsx`**: Central Socket.io connection (`send_message`, `receive_message`, `unread_count_update`).
- **`src/components/map/mapSocket.jsx`**: High-frequency spatial movement listener (`position_update`) broadcasting movements to `presenceSlice`.
- **`src/components/chat/sfuSignaling.js`**: WebRTC SFU offer/answer exchange and ICE candidate signaling.

---

## 📁 Source Code Directory Layout

```
VOW/src/
├── api/                       # Axios REST API Services
│   ├── authApi.js             # Authentication endpoints
│   ├── workspaceApi.js        # Workspace endpoints
│   └── chatApi.js             # Channel & DM endpoints
├── assets/                    # Static images, map tiles, and iconography
├── components/
│   ├── auth.js                # Auth helper utilities
│   ├── chat/                  # Chat subsystem
│   │   ├── ChatLayout.jsx     # Main chat wrapper & container
│   │   ├── chat.jsx           # Active channel / DM window
│   │   ├── input.jsx          # Text input, file upload button, emoji selector
│   │   ├── message.jsx        # Individual chat message bubble & media preview
│   │   ├── MembersSection.jsx # Member list with live presence & unread badges
│   │   ├── VideoConference.jsx# WebRTC SFU video/audio call view
│   │   ├── sfuSignaling.js    # WebRTC SFU signaling client
│   │   └── useSfuVideoCall.js # Custom hook managing WebRTC media streams
│   ├── map/                   # 2D Spatial Office map engine
│   │   ├── Map.jsx            # Main interactive canvas container
│   │   ├── AvatarsLayer.jsx   # Spatial avatar rendering & movement interpolation
│   │   ├── mapSocket.jsx      # Spatial socket connection & position handler
│   │   └── presenceSlice.js   # Redux slice storing avatar spatial coordinates
│   ├── dashboard/             # Dashboard widgets & role panels
│   └── common/                # Shared UI controls (Modals, Lightboxes, Buttons)
├── pages/                     # Application Route Pages
│   ├── home.jsx               # Landing page with hero banner & features
│   ├── login.jsx              # User login page
│   ├── signup.jsx             # User registration page
│   ├── verifyotp.jsx          # Email OTP verification page
│   ├── dashboard.jsx          # Core Virtual Workspace dashboard page
│   └── resetpassword.jsx      # Password reset workflow page
├── App.jsx                    # App router setup & protected routes
└── main.jsx                   # Entrypoint with Redux Provider & PersistGate
```

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Backend Service**: [VOW_backend](https://github.com/raj-krr/VOW_backend) running locally or hosted.

### 2. Installation

```bash
# Clone the frontend repository
git clone https://github.com/raj-krr/VOW.git
cd VOW

# Install npm dependencies
npm install

# Setup environment configuration
cp .env.example .env
```

### 3. Environment Configuration (`.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## ⚙️ Pairing With Backend Repository

To run the complete VOW platform locally:

1. Clone and launch the **Backend Repository**:
   ```bash
   git clone https://github.com/raj-krr/VOW_backend.git
   cd VOW_backend
   npm install
   npm run dev
   ```
2. Ensure the backend is running at `http://localhost:5000`.
3. Launch this frontend (`VOW`) repository on `http://localhost:5173`.

---

## 📄 License
Licensed under the [ISC License](LICENSE).
