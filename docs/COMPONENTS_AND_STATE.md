# VOW Frontend - Components, State & API Service Specifications

This document provides a comprehensive technical catalog of the UI components, page routes, Redux Toolkit slices, custom hooks, and centralized REST API services in the **VOW Frontend**.

---

## 1. Page Routes & Navigation Taxonomy

| Route Path | Page Component | Guard / Protection | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Public | Landing page featuring product highlights, demo video embeds, and feature cards. |
| `/login` | `Login.jsx` | Public | Email and password login view with JWT token acquisition and password recovery links. |
| `/signup` | `Signup.jsx` | Public | Multi-step registration form initiating the email OTP verification pipeline. |
| `/forgot-password` | `ForgotPassword.jsx` | Public | Email submission form requesting a 6-digit password reset OTP. |
| `/verify-otp` | `VerifyOtp.jsx` | `FlowProtectedRoute` | Gated OTP entry view ensuring users complete signup or password reset flows before proceeding. |
| `/reset-password` | `ResetPassword.jsx` | `FlowProtectedRoute` | Password reset view unlocked only after successful OTP validation. |
| `/reset-success` | `ResetSuccess.jsx` | `FlowProtectedRoute` | Confirmation screen redirecting users back to login upon successful password update. |
| `/dashboard` | `Dashboard.jsx` | `ProtectedRoute` | Core workspace hub displaying workspace selection, member lists, meetings, and file manager. |
| `/profile` | `ProfilePage.jsx` | `ProtectedRoute` | Account profile customization view supporting avatar generation via DiceBear API. |
| `/map` | `Map.jsx` | `ProtectedRoute` + Session Flag | 2D interactive virtual office map featuring spatial avatar pathfinding and room zones. |
| `/workspace/:workspaceId/chat` | `ChatApp.jsx` | `ProtectedRoute` | Integrated channel text chat, 1-on-1 DMs, WebRTC video conferencing, and team tools. |
| `/TermsAndConditions` | `TermsAndConditions.jsx` | Public | Standard legal terms and privacy disclosures document. |

---

## 2. Redux State Store Breakdown (`src/components/store.js`)

The global state is managed via **Redux Toolkit** and persisted using **Redux Persist** (stored in `localStorage` under key `"root"` with a whitelist for `user` and `workspace`).

```
rootReducer
 ├── user      --> userSlice.js
 ├── workspace --> workspaceSlice.js
 ├── presence  --> presenceSlice.js
 ├── team      --> teamslices.js
 └── files     --> filesSlice.js
```

### 2.1 User Slice (`src/components/userslice.js`)
- **`user`**: Sanitized user object (`_id`, `email`, `fullName`, `avatar`, `isVerified`).
- **`token`**: JWT `accessToken` used for REST request authentication.
- **`signupPending`**: Boolean flag tracking whether user is midway through signup OTP verification.
- **`forgotRequested`**: Boolean flag tracking whether user requested a password recovery OTP.
- **Actions**: `setSignupPending`, `setForgotRequested`, `setAuthenticatedUser`, `logoutUser`.

### 2.2 Workspace Slice (`src/components/workspaceSlice.js`)
- **`activeWorkspace`**: Metadata object for the currently selected virtual office (`workspaceId`, `name`, `inviteCode`, `role`).
- **`workspaces`**: List of all workspaces joined or owned by the user.
- **`workspaceToken`**: Workspace-scoped JWT token for multi-tenant backend authorization.
- **Actions**: `setActiveWorkspace`, `setWorkspaces`, `setWorkspaceToken`, `clearWorkspaceState`.

### 2.3 Presence Slice (`src/components/map/presenceSlice.js`)
- **`localPosition`**: Coordinates `{ x, y }` of the logged-in user's avatar.
- **`peers`**: Key-value map of online users `{ [userId]: { x, y, name, avatar, status } }`.
- **`activeRoom`**: Current office sub-zone slug (e.g., `"conference-room-1"`).
- **Actions**: `setLocalPosition`, `updatePeerPosition`, `removePeer`, `setPresenceSync`.

### 2.4 Team Slice (`src/components/chat/teamslices.js`)
- **`teams`**: Array of workspace teams and sub-channels.
- **`selectedTeam`**: Active team object.
- **`selectedChannel`**: Active channel object (`text` vs `voice`).
- **Actions**: `setTeams`, `setSelectedTeam`, `setSelectedChannel`, `addChannel`.

### 2.5 Files Slice (`src/components/dashboard/filesSlice.js`)
- **`fileList`**: Array of uploaded file objects (`id`, `name`, `size`, `type`, `url`, `uploader`).
- **`isUploading`**: Upload progress indicator.
- **Actions**: `setFiles`, `addFile`, `removeFile`, `setUploading`.

---

## 3. Custom React Hooks

| Custom Hook | Source File | Description |
| :--- | :--- | :--- |
| **`useSfuVideoCall`** | `src/components/chat/useSfuVideoCall.js` | Manages WebRTC video call state, local media streams (`getUserMedia`), peer video tracks, screen sharing, and SFU socket signaling events. |
| **`useVoiceCall`** | `src/components/voice/useVoiceCall.js` | Handles proximity-based audio streaming, web audio context initialization, and mic mute toggles. |
| **`useMembers`** | `src/components/useMembers.js` | Fetches, caches, and filters workspace member rosters for search inputs and multi-select components. |
| **`useOutsideClick`** | `src/components/common/useOutsideClick.js` | Event listener hook detecting user clicks outside specified element refs to close modals and dropdown menus. |

---

## 4. Centralized REST API Service Modules (`src/api/`)

All HTTP communication is routed through a central Axios instance (`axiosConfig.js`) configured with base URL `import.meta.env.VITE_API_URL`, automatic Bearer token injection, and `withCredentials: true`.

| API Service File | Base Endpoint | Key Functions | Description |
| :--- | :--- | :--- | :--- |
| **`authApi.js`** | `/auth` | `loginUser`, `registerUser`, `verifyOtpApi`, `forgotPasswordApi`, `resetPasswordApi`, `isAuthenticated` | Manages login, registration, OTP validation, and authentication token verification. |
| **`workspaceApi.js`** | `/workspaces` | `createWorkspace`, `joinWorkspace`, `fetchUserWorkspaces`, `getWorkspaceDetails` | Handles workspace provisioning, invite code validation, and workspace token minting. |
| **`channelApi.js`** | `/channels` | `getChannels`, `createChannel`, `deleteChannel` | Manages text/voice channel allocation inside workspace teams. |
| **`messageApi.js`** | `/messages` | `getChannelMessages`, `getDirectMessages`, `sendMessage` | Fetches historical channel messages and 1-on-1 direct message conversations. |
| **`teamApi.js`** | `/teams` | `getTeams`, `createTeam`, `assignSupervisor` | Team roster creation and supervisor role assignment. |
| **`meetingApi.js`** | `/meeting` | `scheduleMeeting`, `getMeetings`, `endMeeting` | Schedules and manages video conference meeting rooms. |
| **`profileapi.js`** | `/me` | `getUserProfile`, `updateUserProfile` | Retrieves and updates user profile attributes and DiceBear avatar configuration. |
| **`layoutApi.js`** | `/maps` | `getBaseMap`, `saveCustomLayout` | Downloads floorplan layouts and custom tile maps. |
| **`file.js`** | `/files` | `getPresignedUploadUrl`, `uploadToS3`, `getPresignedDownloadUrl` | Requests AWS S3 presigned URLs for direct file uploads and download retrieval. |
