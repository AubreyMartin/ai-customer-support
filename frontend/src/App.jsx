import { useEffect, useRef, useState } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/react";
import "./App.css";

function formatConversationLabel(conversation) {
  if (conversation.title && conversation.title.trim()) {
    return conversation.title;
  }
  return "New conversation";
}

function formatConversationDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const fetchConversations = async () => {
    const token = await getToken();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load conversations");
    }

    return response.json();
  };

  const fetchConversationMessages = async (id) => {
    const token = await getToken();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/conversations/${id}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to load conversation messages");
    }

    return response.json();
  };

  // On sign-in: load the sidebar list, then open the most recent
  // conversation so a page reload picks up where the user left off.
  useEffect(() => {
    if (!isSignedIn) return;

    let isCancelled = false;

    const loadInitialState = async () => {
      setIsSidebarLoading(true);

      try {
        const list = await fetchConversations();
        if (isCancelled) return;

        setConversations(list);

        if (list.length > 0) {
          setIsConversationLoading(true);
          const history = await fetchConversationMessages(list[0].id);
          if (isCancelled) return;

          setConversationId(list[0].id);
          setMessages(
            history.map((entry) => ({
              role: entry.role,
              content: entry.content,
            })),
          );
        }
      } catch (error) {
        console.error("Error loading conversation history:", error);
      } finally {
        if (!isCancelled) {
          setIsSidebarLoading(false);
          setIsConversationLoading(false);
        }
      }
    };

    loadInitialState();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!isSignedIn) {
    return (
      <div className="app-layout">
        <div className="chat-app">
          <main className="messages">
            <div className="message assistant">
              <div className="message-bubble">
                Please sign in to access your private conversations.
              </div>
            </div>

            <div className="auth-actions">
              <SignInButton mode="modal">
                <button>Sign in</button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button>Create account</button>
              </SignUpButton>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const openConversation = async (id) => {
    if (id === conversationId) {
      setIsSidebarOpen(false);
      return;
    }

    setIsConversationLoading(true);
    setIsSidebarOpen(false);

    try {
      const history = await fetchConversationMessages(id);
      setConversationId(id);
      setMessages(
        history.map((entry) => ({
          role: entry.role,
          content: entry.content,
        })),
      );
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsConversationLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setIsSidebarOpen(false);
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);

    setMessage("");
    setIsLoading(true);

    const isNewConversation = !conversationId;

    try {
      const token = await getToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      setConversationId(data.conversation_id);

      const assistantMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);

      // Refresh the sidebar so a brand-new conversation appears, and so
      // existing conversations re-sort by their new "last updated" time.
      try {
        const list = await fetchConversations();
        setConversations(list);
        if (isNewConversation) {
          setConversationId(data.conversation_id);
        }
      } catch (refreshError) {
        console.error("Error refreshing conversation list:", refreshError);
      }
    } catch (error) {
      console.error("Error:", error);

      const errorMessage = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      };

      setMessages((previousMessages) => [...previousMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    startNewChat();
  };

  return (
    <div className="app-layout">
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span>Your chats</span>
          <button
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close chat list"
          >
            <span className="sidebar-close-cross" />
          </button>
        </div>

        <button className="new-chat-button" onClick={startNewChat}>
          <span className="new-chat-plus" />
          New chat
        </button>

        <div className="conversation-list">
          {conversations.length > 0 && (
            <div className="conversation-list-label">Recent</div>
          )}

          {isSidebarLoading && (
            <div className="conversation-list-empty">Loading chats...</div>
          )}

          {!isSidebarLoading && conversations.length === 0 && (
            <div className="conversation-list-empty">
              No conversations yet
            </div>
          )}

          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`conversation-item ${
                conversation.id === conversationId ? "active" : ""
              }`}
              onClick={() => openConversation(conversation.id)}
            >
              <span className="conversation-title">
                {formatConversationLabel(conversation)}
              </span>
              <span className="conversation-date">
                {formatConversationDate(conversation.updated_at)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div className="chat-app">
        <header className="chat-header">
          <div className="header-row header-row-top">
            <div className="header-brand">
              <button
                className="sidebar-toggle"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Show chat list"
              >
                <span className="sidebar-toggle-bars" />
              </button>

              <span className="logo-badge">◈</span>
              <h1>AI Customer Support</h1>
            </div>

            <div className="header-user">
              <UserButton />
            </div>
          </div>

          <div className="header-row header-row-bottom">
            <div className="status-pill">
              <span className="status-dot" />
              Online
            </div>

            <button onClick={clearChat} className="clear-button">
              Clear Chat
            </button>
          </div>
        </header>

        <main className="messages">
          {isConversationLoading && (
            <div className="message assistant">
              <div className="message-bubble">
                Loading your conversation...
              </div>
            </div>
          )}

          {!isConversationLoading && messages.length === 0 && (
            <div className="message assistant">
              <span className="message-avatar">AI</span>
              <div className="message-bubble">
                Hi! 👋 How can I help you today?
              </div>
            </div>
          )}

          {!isConversationLoading &&
            messages.map((currentMessage, index) => (
              <div
                key={index}
                className={`message ${currentMessage.role}`}
              >
                {currentMessage.role === "assistant" && (
                  <span className="message-avatar">AI</span>
                )}
                <div className="message-bubble">{currentMessage.content}</div>
              </div>
            ))}

          {isLoading && (
            <div className="message assistant">
              <span className="message-avatar">AI</span>
              <div className="message-bubble typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        <div className="input-area">
          <input
            type="text"
            placeholder="Ask a question..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
