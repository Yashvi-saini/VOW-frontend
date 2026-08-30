# VOW Frontend - Feature Specification & Functional Catalog

This document details all user-facing, spatial, real-time, and AI features provided by the **VOW (Virtual Organized World) Frontend** web application.

---

## 1. Authentication & Identity Management

| Feature | Component / Module | Description |
| :--- | :--- | :--- |
| **Email & Password Signup** | `src/components/signup.jsx` | Multi-field user registration form with live field validation, password strength feedback, and auto avatar preview. |
| **OTP Verification Flow** | `src/pages/verifyotp.jsx` | 6-digit numeric input with countdown timer and automated resend button. Gated by `FlowProtectedRoute`. |
| **User Login & Session Persistence** | `src/pages/login.jsx` | Authentication modal storing JWT `accessToken` in `localStorage` and HTTP-Only cookies. Auto-redirects to `/dashboard`. |
| **Password Recovery Flow** | `src/components/forgotpassword.jsx`<br>`src/pages/resetpassword.jsx` | Two-stage password reset using OTP verification and success redirect screen (`resetsuccess.jsx`). |
| **Profile Settings & Avatars** | `src/components/profilegeneration/` | Profile update form with full name, organisation, gender selection, and DiceBear SVG avatar customizer (`ProfileSettings.jsx`). |
| **Role-Based Protection** | `src/ProtectedRoute.jsx` | Global route guard restricting protected pages (`/dashboard`, `/profile`, `/map`, `/workspace/:id/chat`) to authenticated sessions. |

---

## 2. Workspace & Team Management

| Feature | Component / Module | Description |
| :--- | :--- | :--- |
| **Create Virtual Workspace** | `CreateWorkspaceModal.jsx` | Modal allowing managers to name an office space, select map themes, and generate an 8-character invite code. |
| **Join Workspace via Code** | `JoinWorkspaceModal.jsx` | Input drawer for team members to join an existing workspace using an invite code. |
| **Workspace Dashboard & Hub** | `src/pages/dashboard.jsx` | Main hub displaying workspace list, member rosters, active meetings, and quick-action navigation sidebars. |
| **Team & Channel Creator** | `CreateTeamModal.jsx`<br>`SupervisorSelect.jsx` | Managers and supervisors can partition teams into sub-channels (Text vs. Voice) and assign team supervisors. |
| **Member Multi-Select** | `MemberMultiSelect.jsx` | Custom multi-select component for adding/removing team members from channel permissions. |

---

## 3. 2D Virtual World & Spatial Engine

| Feature | Component / Module | Description |
| :--- | :--- | :--- |
| **2D Floorplan Canvas** | `src/components/map/Map.jsx` | Interactive office map rendering desks, conference rooms, break lounges, and collision walls. |
| **Pathfinding Movement** | `Pathfinding.js` integration | Click-to-walk grid movement calculating non-colliding A* paths across floor tiles. |
| **Real-Time Avatar Layer** | `AvatarsLayer.jsx` | Dynamic rendering layer displaying active workspace members with smooth position interpolation. |
| **Spatial Presence Broadcast** | `mapSocket.jsx` | Bi-directional Socket.io transport broadcasting position updates `(x, y)` to all connected workspace peers in real time. |
| **Interactive Room Triggers** | `Map.jsx` | Walking into designated room bounds triggers automatic entrance into associated voice or video conference rooms. |

---

## 4. Real-Time Chat & Direct Messaging

| Feature | Component / Module | Description |
| :--- | :--- | :--- |
| **Channel Text Messaging** | `ChatRoomSection.jsx` | Real-time channel chat supporting rich text formatting, code blocks, and markdown (`react-markdown`, `remark-gfm`). |
| **1-on-1 Direct Messaging** | `MembersSection.jsx` | Private messaging between team members with online status badges and unread message counters. |
| **Emoji Reactions Picker** | `emojipicker.jsx`, `rection.jsx` | Interactive emoji selector (`emoji-picker-react`) attached to chat messages for instant reactions. |
| **File & Attachment Preview** | `input.jsx`, `message.jsx` | File attachment button allowing direct image, PDF, and document previews within the chat stream. |
| **Read Receipts** | `message.jsx` | Visual indicator tracking message delivery and read status per recipient. |

---

## 5. WebRTC SFU Video/Audio Conferencing

| Feature | Component / Module | Description |
| :--- | :--- | :--- |
| **WebSockets SFU Signaling** | `sfuSignaling.js` | Low-level WebSocket client establishing WebRTC peer connection handshakes with the backend SFU router. |
| **Video & Audio Call Controller**| `useSfuVideoCall.js` | React hook managing local media streams (`getUserMedia`), ICE candidate exchanges, and peer track additions. |
| **Participant Video Grid** | `VideoConference.jsx` | Responsive participant grid displaying live video feeds, speaking ring highlights, and name tags. |
| **Media Controls** | `VideoConference.jsx` | Floating toolbar containing Mute/Unmute Mic, Toggle Camera, Share Screen, and Leave Call controls. |
| **Proximity Voice Mode** | `useVoiceCall.js` | Proximity-based audio streaming activating voice chat only when avatars are within spatial radius. |

---

## 6. AWS S3 File Transfers & Storage

| Feature | Component / Module | Description |
| :--- | :--- | :--- |
| **Presigned URL Uploads** | `FileTransfer.jsx`<br>`src/api/file.js` | Direct browser-to-AWS-S3 upload pipeline requesting presigned PUT URLs to avoid backend memory bottlenecks. |
| **Workspace File Manager** | `filesSlice.js` | File gallery displaying workspace uploads, file type badges (Image, Code, Doc), file sizes, and uploader names. |
| **Secure Download URLs** | `file.js` | Requests short-lived presigned GET URLs for restricted document downloading and previews. |
| **File API Tester** | `src/pages/fileapitester.jsx` | Developer testing view for inspecting S3 upload performance and API responses. |

---

## 7. Gemini AI Assistant & Chat Copilot

| Feature | Component / Module | Description |
| :--- | :--- | :--- |
| **AI Chat Copilot Widget** | `geminichat.jsx` | Floating AI assistant drawer enabling users to query Google Gemini Pro (`@google/genai`). |
| **Contextual Summaries** | `geminichat.jsx` | Automatically generates executive recaps of long chat channels or missed team conversations. |
| **AI Service Client** | `geminiservice.js` | Standardized API client wrapping generative model initialization and prompt streaming. |
