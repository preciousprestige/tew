import React, { useState } from "react";
import "./ChatWidget.css";
import { FaHome, FaCommentDots } from "react-icons/fa";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [faqOpen, setFaqOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hello! How can we help you today?" },
    { id: 2, from: "user", text: "When will my order arrive?" },
  ]);

  const faqs = [
    { id: 1, question: "How long does delivery take?", answer: "3-5 working days." },
    { id: 2, question: "Do you ship internationally?", answer: "Yes, we do through contact options." },
  ];

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMessage = { id: Date.now(), from: "user", text: input.trim() };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="chat-widget">
      {isOpen ? (
        <div className="chat-box">
          <div className="chat-tabs">
            <FaHome
              className={activeTab === "home" ? "active-icon" : ""}
              onClick={() => {
                setActiveTab("home");
                setFaqOpen(false);
              }}
            />
            <FaCommentDots
              className={activeTab === "chat" ? "active-icon" : ""}
              onClick={() => {
                setActiveTab("chat");
                setFaqOpen(false);
              }}
            />
            <span className="close-icon" onClick={() => setIsOpen(false)}>✖</span>
          </div>

          {/* HOME TAB */}
          {activeTab === "home" && !faqOpen && (
            <div className="chat-home">
              <h3 style={{ fontWeight: 500, fontSize: "18px" }}>Hi there 👋</h3>
              <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                Need help? Search our help center or start a conversation:
              </p>
              <button className="faq-btn" onClick={() => setFaqOpen(true)}>View FAQs</button>
            </div>
          )}

          {/* FAQ VIEW */}
          {activeTab === "home" && faqOpen && (
            <div className="faq-section">
              <h4>Frequently Asked Questions</h4>
              <ul>
                {faqs.map((faq) => (
                  <li key={faq.id}>
                    <strong>{faq.question}</strong>
                    <p>{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <div className="chat-convo">
              <div className="messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.from}`}>
                    {msg.text}
                  </div>
                ))}
              </div>
              <textarea
                placeholder="Type your message..."
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="send-btn" onClick={handleSend}>Send</button>
            </div>
          )}
        </div>
      ) : (
        <div className="chat-icon" onClick={() => setIsOpen(true)}>
          <FaCommentDots />
        </div>
      )}
    </div>
  );
}
