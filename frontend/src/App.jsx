import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

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
  };
  return (
    <div className="chat-app">
      <header className="chat-header">
        <h1>🤖 AI Customer Support</h1>
        <div className="status">● Online</div>

        <button onClick={clearChat} className="clear-button">
          Clear Chat
        </button>
      </header>

      <main className="messages">
        {messages.length === 0 && (
          <div className="message assistant">
            <div className="message-bubble">
              Hi! 👋 How can I help you today?
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-bubble">{msg.content}</div>
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
