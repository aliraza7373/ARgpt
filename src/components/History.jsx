import { useSyncExternalStore } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Brand from "./Brand";
import { getCurrentUser, subscribeToAuth } from "../data/authStore";
import { createChat, deleteChat, getChats, subscribeToChats } from "../data/chatStore";

const History = () => {
  const history = useSyncExternalStore(subscribeToChats, getChats, getChats);
  const user = useSyncExternalStore(subscribeToAuth, getCurrentUser, getCurrentUser);
  const location = useLocation();
  const navigate = useNavigate();

  const startChat = () => {
    const chat = createChat();
    navigate(`/c/${chat.id}`);
  };

  const removeChat = (chatId) => {
    deleteChat(chatId);
    if (location.pathname === `/c/${chatId}`) navigate("/");
  };

  return (
    <aside className="history" aria-label="Chat history">
      <div className="history-top">
        <Brand className="brand" />
        <button className="new-chat-button" type="button" onClick={startChat}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>
          <span>New chat</span>
        </button>
      </div>

      <div className="history-list-wrap">
        <p className="history-label">Recent</p>
        <nav className="history-list">
          {history.map((chat) => {
            const isActive = location.pathname === `/c/${chat.id}`;
            return (
              <div className={`history-item${isActive ? " active" : ""}`} key={chat.id}>
                <Link
                  className="history-link"
                  to={`/c/${chat.id}`}
                  aria-current={isActive ? "page" : undefined}
                  title={chat.title}
                >
                  <span className="history-chat-icon" aria-hidden="true">
                    <svg viewBox="0 0 20 20"><path d="M4 4.75h12a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H8l-4.5 2v-11A1.5 1.5 0 0 1 5 4.75Z" /></svg>
                  </span>
                  <span className="history-title">{chat.title}</span>
                </Link>
                <button
                  className="delete-chat-button"
                  type="button"
                  aria-label={`Delete ${chat.title}`}
                  title="Delete chat"
                  onClick={() => removeChat(chat.id)}
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 6h11m-9.5 0 .6 10h6.8L14 6M8 6V4h4v2m-3 3v4m2-4v4" /></svg>
                </button>
              </div>
            );
          })}
          {history.length === 0 && <p className="history-empty">Your conversations will appear here.</p>}
        </nav>
      </div>

      <div className="history-footer">
        <span className="profile-avatar" aria-hidden="true">{user?.identifier.charAt(0).toUpperCase() || "G"}</span>
        <span className="profile-name" title={user?.identifier || "Guest"}>{user?.identifier || "Guest"}</span>
        <Link className="guest-plan-link" to="/plans" title="Explore plans">
          <span aria-hidden="true">&#10022;</span>
          <span>Plans</span>
        </Link>
        <Link className="profile-settings" to="/login" aria-label="Account options" title="Account options">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="2.5"/><path d="m16.1 11.5 1.2.9-1.2 2.1-1.4-.5a6 6 0 0 1-1.2.7l-.2 1.5h-2.5l-.3-1.5a6 6 0 0 1-1.2-.7l-1.4.5-1.2-2.1 1.2-.9a6 6 0 0 1 0-1.4l-1.2-.9 1.2-2.1 1.4.5a6 6 0 0 1 1.2-.7l.3-1.5h2.5l.2 1.5a6 6 0 0 1 1.2.7l1.4-.5 1.2 2.1-1.2.9a6 6 0 0 1 0 1.4Z" transform="translate(-1 -1)"/></svg>
        </Link>
      </div>
    </aside>
  );
};

export default History;
