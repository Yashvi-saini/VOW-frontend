# VOW Frontend - Errors, Diagnostics & Troubleshooting Runbook

This document catalogs common runtime errors, edge-case failures, diagnostic workflows, and resolution procedures for the **VOW Frontend**.

---

## 1. Catalog of Common Frontend Runtime Issues

### 1.1 `401 Unauthorized` & JWT Refresh Loop
- **Symptom**: Page continuously reloads or API calls fail with `HTTP 401 Unauthorized` after session expiry.
- **Root Cause**: `axiosConfig.js` includes `localStorage.getItem("accessToken")` in headers, but lacks automatic token refresh interceptor handling when `accessToken` expires.
- **Resolution**:
  Implement an Axios response interceptor for token refresh handling:
  ```javascript
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post("/auth/refresh", {}, { withCredentials: true });
          localStorage.setItem("accessToken", res.data.data.accessToken);
          error.config.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
          return api(error.config);
        } catch (refreshErr) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
  ```

### 1.2 WebRTC SFU ICE Connection Failure & Frozen Video
- **Symptom**: User joins a video conference room, but peer video streams show black boxes or freeze on frame 1.
- **Root Cause**: STUN/TURN server candidates are missing or blocked by local firewalls / strict NAT configurations.
- **Resolution**:
  Ensure STUN/TURN credentials are standard in `useSfuVideoCall.js`:
  ```javascript
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  });
  ```

### 1.3 Canvas Lag & Avatar Pathfinding Jitter
- **Symptom**: Avatar teleports erratically across the 2D map floor when rapidly clicking tiles.
- **Root Cause**: Multiple simultaneous `pathfinding` calculation instances firing in React render loops without clearing prior step intervals.
- **Resolution**:
  Cancel prior animation frame requests or step timeouts before computing a new A* path grid:
  ```javascript
  if (movementIntervalRef.current) {
    clearInterval(movementIntervalRef.current);
  }
  ```

### 1.4 Redux Store Rehydration Mismatch
- **Symptom**: User refreshes page and UI briefly flashes stale user profile or empty workspace data.
- **Root Cause**: `redux-persist` asynchronous rehydration loads faster/slower than React initial state render.
- **Resolution**: Ensure `PersistGate` is wrapping `<App />` in `src/main.jsx`:
  ```jsx
  import { PersistGate } from "redux-persist/integration/react";
  import { store, persistor } from "./components/store";

  ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
  ```

### 1.5 Gemini API Rate Limit (`429 Too Many Requests`)
- **Symptom**: AI Copilot chat returns `QuotaExceededError` or `429 Too Many Requests`.
- **Root Cause**: Unthrottled chat messages reaching Google Gemini free-tier quota limits.
- **Resolution**: Implement client-side debouncing and error fallback toast notifications in `geminichat.jsx`.

---

## 2. Production Incident Troubleshooting Matrix

| Error Message / Symptom | Probable Root Cause | Actionable Resolution Step |
| :--- | :--- | :--- |
| `WebSocket connection to 'ws://...' failed` | Socket backend URL port mismatch or missing CORS header. | Check `VITE_SOCKET_URL` in `.env` and verify backend `ALLOWED_ORIGINS`. |
| `Uncaught TypeError: Cannot read properties of undefined (reading '_id')` | Accessing unhydrated user or workspace Redux state. | Use optional chaining (`user?._id`) and add loading skeletons. |
| `CORS Error: No 'Access-Control-Allow-Origin' header` | Proxy server bypass or API URL mismatch. | Ensure Axios `baseURL` points to backend domain matching CORS allowlist. |
| `DOMException: Permission denied (Camera/Microphone)` | Browser camera/mic permissions blocked by user. | Prompt user to grant media permissions in browser site settings bar. |
| `S3 Direct Upload 403 Forbidden` | Presigned URL expired or AWS S3 CORS bucket configuration error. | Regenerate presigned upload URL; verify S3 `AllowedOrigins` includes frontend URL. |

---

## 3. Diagnostic & Inspection Procedures

### 3.1 Inspecting WebSockets Transport
To diagnose Socket.io connection state, open Chrome DevTools:
1. Open **Network** tab -> Filter by **WS** (WebSockets).
2. Click the `socket.io/?EIO=4&transport=websocket` connection frame.
3. Observe raw event payloads (`join`, `move`, `send_channel_message`).

### 3.2 Inspecting WebRTC Peer Connections
Open Google Chrome's built-in WebRTC diagnostic tool:
```
chrome://webrtc-internals
```
- Verify `RTCPeerConnection` stats.
- Inspect ICE Candidate pairs, bytes sent/received, and frame rate graphs.
