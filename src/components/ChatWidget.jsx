// src/components/ChatWidget.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ChatWidget.css";
import { FaCommentDots } from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // create/load persistent user id
  useEffect(() => {
    let savedId = localStorage.getItem("tew_userId");
    if (!savedId) {
      savedId = "user-" + Date.now();
      localStorage.setItem("tew_userId", savedId);
    }
    setUserId(savedId);
  }, []);

  // fetch history (memoized)
  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${userId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, [userId]);

  // socket setup + listen for realtime messages
  useEffect(() => {
    if (!userId) return;

    socketRef.current = io("http://localhost:5000", { transports: ["websocket"] });

    socketRef.current.emit("registerUser", userId);

    socketRef.current.on("newMessage", (msg) => {
      if (msg.receiver === userId || msg.sender === userId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    fetchMessages();

    return () => {
      try {
        socketRef.current.disconnect();
      } catch (e) {}
    };
  }, [userId, fetchMessages]);

  // scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // send message
  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = { sender: userId, receiver: "admin", message: input.trim() };

    try {
      await axios.post("http://localhost:5000/api/messages", newMsg);
      socketRef.current?.emit("sendMessage", newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
      const el = document.querySelector(".chat-input");
      el?.focus();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // open chat
  const openChat = async () => {
    setIsOpen(true);
    await fetchMessages();
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  return (
    <>
      {/* Floating Chat Button only */}
      {!isOpen && (
        <div className="chat-floating-buttons" aria-hidden={isOpen ? "true" : "false"}>
          <button
            className="chat-open-btn"
            title="Open chat"
            aria-label="Open chat"
            onClick={openChat}
          >
            <FaCommentDots />
          </button>
        </div>
      )}

      {/* Chat box */}
      <div className={`chat-widget ${isOpen ? "open" : ""}`} aria-live="polite">
        {isOpen && (
          <div className="chat-box" role="dialog" aria-modal="false" aria-label="Customer chat">
            <div className="chat-header">
              <span className="title">Live Support</span>
              <button
                className="close-icon"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
              >
                ✖
              </button>
            </div>

            <div className="chat-body">
              <div className="messages" role="log">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`message ${msg.sender === userId ? "user" : "bot admin"}`}
                  >
                    {msg.message}
                  </div>
                ))}

                {/* FAQ Note */}
                <div className="faq-note" aria-hidden="true" style={{ marginTop: 8 }}>
                  <p style={{ margin: "6px 0", fontSize: 13 }}>
                    📦 Orders take <strong>3–5 working days</strong> for delivery.
                  </p>
                  <p style={{ margin: "6px 0", fontSize: 13 }}>
                    🌍 International shipping is handled via our <strong>contact options</strong>.
                  </p>
                </div>

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="chat-footer">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
                }
                className="chat-input"
                aria-label="Type your message"
                autoFocus
              />
              <button onClick={handleSend} className="send-btn" aria-label="Send message">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
