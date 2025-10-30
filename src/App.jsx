import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ChatApp from "./components/chat/chat";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatApp username="UserA" roomId="room1" />} />
        <Route path="/chat" element={ <ChatApp username="UserB" roomId="room1" />} />
      </Routes> 
    </Router>
  );
};  

export default App;
