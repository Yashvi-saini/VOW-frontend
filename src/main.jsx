import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
  import { Provider } from "react-redux";
import { store } from "./components/store";
import { setUserProfile } from "./components/userslice";

// Hydrate Redux user profile from localStorage once on app start (no direct LS reads in UI)
try {
  const raw = localStorage.getItem("user");
  const savedUser = raw ? JSON.parse(raw) : null;
const avatar = savedUser?.avatar || null;
  if (savedUser) {
    store.dispatch(
      setUserProfile({
        username: savedUser.username,
        fullName: savedUser.fullName,
        email: savedUser.email,
        avatar,
      })
    );
  }
} catch (e) {
  // ignore hydration errors
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

  

<Provider store={store}>
  <App />
</Provider>
  </React.StrictMode>
);
