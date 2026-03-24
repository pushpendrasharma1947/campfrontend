import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchConversation, sendChatMessage } from "../api/api";
import { useAuth } from "../context/AuthContext";

const getUserId = (user) => {
  if (!user) return null;
  return user.id || user._id || user.sub || null;
};

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = useMemo(() => getUserId(user), [user]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let mounted = true;

    async function loadConversation() {
      try {
        setLoading(true);
        const data = await fetchConversation(conversationId);
        if (!mounted) return;
        const items = data?.messages || data?.messagesList || [];
        setMessages(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Unable to load conversation. Please try again.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    loadConversation();
    return () => {
      mounted = false;
    };
  }, [conversationId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    setError("");

    const outgoing = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, outgoing]);
    setInput("");

    try {
      const response = await sendChatMessage(conversationId, outgoing.content);
      const incoming = response?.message || response?.reply || {};

      if (incoming && (incoming.content || incoming.message)) {
        const msg = {
          role: incoming.role || "assistant",
          content: incoming.content || incoming.message,
        };
        setMessages((prev) => [...prev, msg]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatMessage = (msg) => {
    if (!msg) return "";
    if (typeof msg === "string") return msg;
    return msg.content || msg.message || "";
  };

  const isUserMessage = (msg) => {
    if (!msg) return false;
    if (msg.role) return msg.role === "user";
    if (msg.senderId || msg.userId) {
      const sender = msg.senderId || msg.userId;
      return String(sender) === String(userId);
    }
    return false;
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl flex-col px-4 py-10">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Chat</h1>
          <p className="mt-1 text-sm text-slate-600">Chat with the seller about this item.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Back
        </button>
      </header>

      {error ? (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-800">{error}</div>
      ) : null}

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50"
          style={{ minHeight: "320px" }}
        >
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading conversation…</div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-slate-500">
              <p>No conversation yet.</p>
              <p>Send the first message to start chatting.</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const content = formatMessage(message);
              const isUser = isUserMessage(message);
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isUser
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-800 border border-slate-200"
                    }`}
                  >
                    {content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
