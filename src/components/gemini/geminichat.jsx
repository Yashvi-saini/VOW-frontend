import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BASE_PROMPT = `
You are an AI assistant for **VOW (Virtual Organised World)** - a collaborative workspace platform.

Your job:
- Answer user questions accurately and politely about VOW platform features
- Base answers on the information below about the platform
- If you don't know something, say "I'm not sure about that, but I can help you find more information."
- Keep responses short and easy to read
**About VOW Platform:**

🏢 **Core Features:**
- Dashboard: Central hub for workspace management and overview
- File Sharing: Share and manage files within your workspace
- Meeting Management: Schedule, create, and join meetings with calendar integration
- Notifications: Stay updated with workspace activities
- Chat: Real-time communication with team members
- Map/Office Space: Virtual office environment with avatar presence
- Team Builder: Create and manage teams within workspaces

🔑 **Workspace Management:**
- Create Workspace: Set up new collaborative spaces with custom names
- Join Workspace: Join existing workspaces using invite codes
- Invite Members: Send email invitations to team members
- Workspace Navigation: Switch between multiple workspaces

👤 **User Features:**
- Profile Settings: Customize your profile information and avatar
- Profile Generation: Set up your user profile with personal details
- Authentication: Secure login, signup, password reset, and OTP verification

🎯 **Key Capabilities:**
- Real-time collaboration with Socket.IO integration
- Responsive design for desktop and mobile devices
- Secure workspace access with invite codes
- File transfer and document sharing
- Meeting scheduling with upcoming events view
- Search functionality across workspaces
- Contact and help support

some faqs
q1: How do I create a new workspace?
a1: To create a new workspace, click on the "Create Workspace" button in the sidebar, enter a unique name for your workspace, and confirm. You can then invite team members via email.
q2: How can I join an existing workspace?
a2: To join an existing workspace, click on the "Join Workspace" button in the sidebar, enter the invite code provided by the workspace admin.
q3: How do I share files within my workspace?
a3: To share files, navigate to the "File Sharing" section from the sidebar, click on the "Upload" button, and select the files you wish to share with your team members.
q4: How can I schedule a meeting?
a4: To schedule a meeting, go to the "Meeting Management" section in the sidebar, click on "Schedule Meeting," fill in the meeting details including date, time, and participants, and save the event. You can view upcoming meetings in the calendar view.
q5: who can create metings?
a5:only manager and superviser can create meetings.
Now answer the user's question clearly and professionally about VOW platform.
`;
const CANDIDATE_MODELS = [
  // try the newest you want first, then fall back
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "text-bison-001",
  "chat-bison-001",
];

const genAI = (() => {
  try {
    const k = import.meta.env.VITE_GEMINI_API_KEY;
    return new GoogleGenerativeAI(k);
  } catch (err) {
    console.error("Failed to construct GoogleGenerativeAI:", err);
    return null;
  }
})();

export default function GeminiChat({ onClose }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const chatRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Debug: print the key to confirm it's loaded (remove in production)
  useEffect(() => {
    console.log("DEBUG: VITE_GEMINI_API_KEY =>", import.meta.env.VITE_GEMINI_API_KEY ? "LOADED" : "MISSING");
  }, []);

  // Initialize chat: try candidate models until one works
  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!genAI) {
        console.error("genAI SDK is not initialized. Check import and constructor.");
        return;
      }

      // If the environment key is missing, log and bail
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        console.error("No Gemini API key found in import.meta.env.VITE_GEMINI_API_KEY");
        return;
      }

      console.log("Attempting to initialize a chat model from candidate list:", CANDIDATE_MODELS);

      for (const candidate of CANDIDATE_MODELS) {
        if (!mounted) return;
        try {
          console.log(`Trying model: ${candidate}`);
          const model = genAI.getGenerativeModel({ model: candidate });

          // Prefer startChat if available; fallback to generateContent usage later
          try {
            const session = await model.startChat({
              history: [],
            });
            if (session) {
              console.log(`✅ Initialized chat session with model: ${candidate}`);
              modelRef.current = model;
              chatRef.current = session;
              return;
            }
          } catch (chatErr) {
            // startChat failed — maybe model doesn't support chat; treat as a partial failure
            console.warn(`model.startChat failed for ${candidate}:`, chatErr?.message || chatErr);
            // try to use generateContent as fallback (no session)
            // We'll set modelRef and use model.generateContent later
            modelRef.current = model;
            chatRef.current = null;
            // Still return — we can send using generateContent without a session
            console.log(`✅ Using model (without chat session): ${candidate}`);
            return;
          }
        } catch (err) {
          // model lookup failed for this candidate
          console.warn(`Model ${candidate} not available or initialization failed:`, err?.message || err);
          // continue to next candidate
        }
      }

      console.error("No candidate models succeeded. Check API key, account access, or model names.");
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!genAI) {
      alert("Gemini SDK not initialized. Check console.");
      return;
    }
    if (!modelRef.current) {
      alert("No model available. Check console for model initialization errors.");
      return;
    }

    const userMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // If we have an active chat session, use it
      if (chatRef.current?.sendMessage) {
        // Prepend the base prompt to give context
        const fullPrompt = BASE_PROMPT + "\n\nUser question: " + trimmed;
        const result = await chatRef.current.sendMessage(fullPrompt);
        // handle streamed/response object - try .text()
        const text = await (result?.response?.text ? result.response.text() : Promise.resolve(String(result)));
        const aiMessage = { role: "ai", text };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // No session — use model.generateContent directly
        const fullPrompt = BASE_PROMPT + "\n\nUser question: " + trimmed;
        const result = await modelRef.current.generateContent(fullPrompt);
        const text = await (result?.response?.text ? result.response.text() : Promise.resolve(String(result)));
        const aiMessage = { role: "ai", text };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error("Gemini API error (sendMessage):", err);
      // Log structured info if available
      if (err?.response) {
        console.error("Response body:", err.response);
      }
      setMessages((prev) => [
        ...prev,
        { role: "helper", text: "Sorry, something went wrong. Check console for details." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };


  const handleClearAll = () => {
    if (window.confirm("Clear all chat messages?")) {
      setMessages([]);
      localStorage.removeItem("chatHistory");
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative w-full max-w-xl mx-auto p-6 bg-white rounded-xl shadow-xl" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl">✕</button>
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Gemini Chat (debug)</h2>

      <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4 pr-1">
       {messages.map((msg, i) => (
  <div
    key={i}
    className={`p-3 rounded-lg whitespace-pre-wrap ${
      msg.role === "user"
        ? "bg-purple-100 text-right"
        : msg.role === "ai"
        ? "bg-gray-100 text-left"
        : "bg-red-100 text-center"
    }`}
  >
    <div className="prose prose-sm max-w-none leading-relaxed text-gray-800 dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {msg.text}
      </ReactMarkdown>
    </div>
  </div>
))}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mb-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="flex-1 border border-gray-300 rounded-lg px-3 py-2" placeholder="Ask something..." />
        <button onClick={sendMessage} disabled={loading} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>

      <div className="flex gap-2 justify-between">
        <button onClick={handleClearAll} className="px-4 py-2 border border-red-400 text-red-600 rounded-lg hover:bg-red-50">Clear All</button>
      </div>
    </div>
  );
}
