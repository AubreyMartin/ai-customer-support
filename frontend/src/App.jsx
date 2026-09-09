import { useEffect, useRef, useState } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/react";
import "./App.css";

function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!isSignedIn) {
    return (
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
    );
  }

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);

    setMessage("");
    setIsLoading(true);

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
    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="chat-app">
      <header className="chat-header">
        <h1>◈ AI Customer Support</h1>

        <div className="status">● Online</div>

        <button onClick={clearChat} className="clear-button">
          Clear Chat
        </button>

        <UserButton showName />
      </header>

      <main className="messages">
        {messages.length === 0 && (
          <div className="message assistant">
            <div className="message-bubble">
              Hi! 👋 How can I help you today?
            </div>
          </div>
        )}

        {messages.map((currentMessage, index) => (
          <div key={index} className={`message ${currentMessage.role}`}>
            <div className="message-bubble">{currentMessage.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant">
            <div className="message-bubble">Typing...</div>
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
  );
}

export default App;
