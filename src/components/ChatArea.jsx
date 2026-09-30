import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import AccountControl from "./AccountControl";
import { addMessage, getChat, subscribeToChats } from "../data/chatStore";

const ChatArea = () => {
  const params = useParams();
  return <ChatConversation key={params.chat_id} chatId={params.chat_id} />;
};

const ChatConversation = ({ chatId }) => {
  const getCurrentChat = useCallback(() => getChat(chatId), [chatId]);
  const chat = useSyncExternalStore(subscribeToChats, getCurrentChat, getCurrentChat);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const conversationRef = useRef(null);
  const activeRequestRef = useRef(0);

  useEffect(() => {
    return () => {
      activeRequestRef.current += 1;
    };
  }, []);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (conversation) {
      conversation.scrollTo({ top: conversation.scrollHeight, behavior: "smooth" });
    }
  }, [chat?.messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isSending || !chat) return;

    const requestChatId = chatId;
    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;
    const userMessage = { id: crypto.randomUUID(), sender: "user", text };
    const updatedChat = addMessage(requestChatId, userMessage);
    if (!updatedChat) return;
    const nextMessages = updatedChat.messages;

    setDraft("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("The chat API returned a page instead of JSON. Redeploy the Vercel project with its /api/chat function.");
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The assistant could not reply.");

      const repliedChat = addMessage(requestChatId, {
        id: crypto.randomUUID(),
        sender: "ai",
        text: result.answer,
      });
      if (!repliedChat) throw new Error("This conversation was deleted.");
    } catch (sendError) {
      if (activeRequestRef.current === requestId) {
        setError(sendError.message);
      }
    } finally {
      if (activeRequestRef.current === requestId) {
        setIsSending(false);
      }
    }
  };

  return (
    <div className="chat-area">
      <header className="chat-header">
        <h2>NEXUS</h2>
        <span className="model-badge">Gemini 3.5 Flash-Lite</span>
        <AccountControl />
      </header>

      {chat ? (
      <div className="chat">
        <div className="conversation" ref={conversationRef}>
          {chat.messages.length === 0 && (
            <div className="empty-chat-state">
              <div className="empty-chat-mark" aria-hidden="true">✳</div>
              <h1>What can I help with?</h1>
              <p>Ask a question, explore an idea, or get help with a task.</p>
            </div>
          )}
          {chat.messages.map((message) => (
            <div className={`message ${message.sender}`} key={message.id}>
              <p>{message.sender === "user" ? "You" : "NEXUS"}</p>
              <p>{message.text}</p>
            </div>
          ))}
          {isSending && <div className="message ai"><p>NEXUS</p><p className="thinking">Thinking...</p></div>}
        </div>

        <div className="composer-dock">
          {error && <p className="composer-error" role="alert">{error}</p>}
          <form className="composer" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Message NEXUS"
              aria-label="Message NEXUS"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={isSending}
            />
            <button className="composer-send" type="submit" aria-label="Send message" disabled={isSending || !draft.trim()}>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15V5m0 0L6 9m4-4 4 4" /></svg>
            </button>
          </form>
          <p className="composer-note">Gemini can make mistakes. Check important info.</p>
        </div>
      </div>
      ) : (
        <div className="chat-not-found">
          <h1>We couldn’t find that conversation.</h1>
          <Link to="/">Back to your chats</Link>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
