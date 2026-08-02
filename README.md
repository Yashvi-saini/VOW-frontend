# VOW (Virtual Organized World) - Frontend Web Application

[![React Version](https://img.shields.io/badge/react-v19.1.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-v7.1.10-purple.svg)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/redux--toolkit-v2.9.2-violet.svg)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4.1.14-cyan.svg)](https://tailwindcss.com/)
[![Socket.io Client](https://img.shields.io/badge/socket.io--client-v4.8.1-black.svg)](https://socket.io/)
[![Cloudinary](https://img.shields.io/badge/cloudinary-v2.0-blue.svg)](https://cloudinary.com/)
[![Google Gemini AI](https://img.shields.io/badge/google--genai-v1.29.0-orange.svg)](https://ai.google.dev/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

**VOW (Virtual Organized World)** is a next-generation real-time virtual workspace application designed to bring distributed remote teams together in an interactive 2D office environment. It provides real-time spatial avatar movement, automatic DM chat opening on avatar collision, persistent channel and direct text messaging, real-time unread badges, WebRTC SFU video/audio conferencing, workspace role governance, Cloudinary media storage with full-screen lightbox previews, and an integrated Google Gemini AI copilot.

---

## ⚡ Key Highlights & Recent Features

- 🎮 **2D Spatial Office & Avatar Collisions**: Smooth ~16Hz spatial avatar navigation. Walking up to and colliding with another team member's avatar on the 2D map automatically opens the Direct Message (DM) chat window.
- 💬 **Unified Real-Time Messaging & Unread Badges**: Persistent team channels and Direct Messages (DMs) over a single unified WebSocket connection, complete with real-time unread message counters on workspace members.
- 🖼️ **Cloudinary Media Uploads & Fullscreen Lightbox**: Instant Cloudinary file/avatar uploads with fail-safe inline fallbacks, high-resolution full-screen image lightbox previews, and direct media downloads.
- 👥 **Workspace Presence & Self-Identification**: Live workspace member presence badges and clear self-identification tagged with `(You)` in member lists.
- 🎥 **WebRTC SFU Video/Audio Meetings**: High-performance multi-party video and audio meeting rooms with screen-sharing capabilities.

---

## 📚 Complete Project Documentation

The frontend repository is fully documented across dedicated technical guides in the [`docs/`](./docs) directory:

| Document | Description |
| :--- | :--- |
| 🏗️ **[System Architecture](./docs/ARCHITECTURE.md)** | High-level topology, technical stack, subsystem breakdown, state persistence, and sequence flows. |
| ⚡ **[Feature Catalog](./docs/FEATURES.md)** | Detailed functional specifications for Auth, Workspaces, 2D Spatial Office, Chat, SFU WebRTC, and Cloudinary Media. |
| 🧩 **[Components & State](./docs/COMPONENTS_AND_STATE.md)** | Exhaustive taxonomy of pages, component trees, Redux Toolkit slices, custom hooks, and REST API services. |
| 🚀 **[Suggestions & Improvements](./docs/SUGGESTIONS_AND_IMPROVEMENTS.md)** | Technical debt analysis, Canvas/WebGL migration roadmap, Vitest/Playwright testing strategy, and UX enhancements. |
| 🛠️ **[Errors & Troubleshooting](./docs/ERRORS_AND_TROUBLESHOOTING.md)** | Catalog of runtime issues, WebRTC ICE troubleshooting, Redux rehydration traps, and WebSockets diagnostic runbooks. |
| 💻 **[Development & Deployment](./docs/DEVELOPMENT_AND_DEPLOYMENT.md)** | Local setup guide, environment variable matrix, Vite configuration, Docker builds, and Vercel deployment. |

---

## 🎥 Demo & Previews

### 📸 UI Screenshots
<table>
  <tr>
    <td><img src="./public/pic2.png" width="380" alt="Landing Page"/></td>
    <td><img src="./public/pic3.png" width="380" alt="Dashboard Hub"/></td>
  </tr>
  <tr>
    <td><img src="./public/pic4.png" width="380" alt="2D Virtual Office Map"/></td>
    <td><img src="./public/pic5.png" width="380" alt="WebRTC Video Conference & Chat"/></td>
  </tr>
</table>

---

## 👥 User Roles & Permissions

- **Manager**: Creates and configures virtual workspaces, manages permissions, partitions teams/channels, and generates invite codes.
- **Supervisor**: Monitors team channels, coordinates daily operations, assigns tasks, and tracks attendance analytics.
- **Team Member**: Walks freely in the 2D office grid, joins voice/video rooms, participates in text chats, and shares files.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.x or higher (v20.x recommended)
- **npm**: v9.x or higher

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/raj-krr/VOW.git
cd VOW

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🛠️ Tech Stack Summary

- **Core**: React 19, Vite, JavaScript (ESM)
- **State Management**: Redux Toolkit, Redux Persist
- **Styling**: Tailwind CSS 4, Lucide Icons, React Icons
- **Real-Time Communication**: Socket.io Client (Unified Connection), WebRTC SFU Client
- **Media & File Storage**: Cloudinary SDK, Native Lightbox Modal

---

## 📄 License
This project is licensed under the ISC License.
