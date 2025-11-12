import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { getUserMessages, sendMessageToUser } from "../api";

export default function AdminMessages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // === CONNECT SOCKET ===
  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current.emit("registerUser", "admin");

    socketRef.current.on("newMessage", (data) => {
      if (data.sender !== "admin") {
        // Mark unread if not currently selected
        setUnread((prev) =>
          prev.includes(data.sender) ? prev : [...prev, data.sender]
        );
      }

      // Auto-update chat if current user is sender
      if (selectedUser && data.sender === selectedUser) {
        setMessages((prev) => [...prev, data]);
      }

      // Refresh user order (unread float on top)
      setUsers((prev) => {
        const updated = prev.map((u) =>
          u.userId === data.sender ? { ...u, unread: true } : u
        );
        return updated.sort((a, b) => {
          const aUnread = unread.includes(a.userId);
          const bUnread = unread.includes(b.userId);
          return bUnread - aUnread;
        });
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedUser, unread]);

  // === AUTO SCROLL TO BOTTOM ===
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // === LOAD USERS ===
  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/messages");
      const data = await res.json();
      setUsers(
        data.sort((a, b) => {
          const aUnread = a.unread ? 1 : 0;
          const bUnread = b.unread ? 1 : 0;
          return bUnread - aUnread;
        })
      );
      const unreadUsers = data.filter((u) => u.unread);
      setUnread(unreadUsers.map((u) => u.userId));
    } catch {
      toast.error("Failed to load users");
    }
  };

  // === LOAD CHAT MESSAGES ===
  const loadMessages = async (userId) => {
    try {
      const data = await getUserMessages(userId);
      // Sort by timestamp (oldest → newest)
      const sorted = [...data].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sorted);
      setUnread((prev) => prev.filter((id) => id !== userId));
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === userId ? { ...u, unread: false } : u
        )
      );
    } catch {
      toast.error("Failed to load messages");
    }
  };

  // === SEND MESSAGE (REAL-TIME + BACKEND) ===
  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    const msg = {
      sender: "admin",
      receiver: selectedUser,
      message: input.trim(),
      timestamp: new Date(),
    };
    try {
      await sendMessageToUser(msg);
      socketRef.current.emit("sendMessage", msg); // real-time
      setMessages((prev) => [...prev, msg]);
      setInput("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  // === INITIAL LOAD ===
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl text-[#a17c4d] font-bold mb-4">
        Customer Messages
      </h1>

      <div className="flex gap-6 flex-grow overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-1/4 border-r border-gray-300 overflow-y-auto">
          <h3 className="text-[#a17c4d] mb-2 font-semibold">Users</h3>
          <ul>
            {users.map((u) => (
              <li
                key={u.userId || u}
                onClick={() => {
                  setSelectedUser(u.userId || u);
                  loadMessages(u.userId || u);
                }}
                className={`cursor-pointer p-2 rounded mb-1 transition-all ${
                  selectedUser === (u.userId || u)
                    ? "bg-[#f4eadc]"
                    : "hover:bg-[#f9f4ee]"
                } ${
                  unread.includes(u.userId || u)
                    ? "font-bold text-black"
                    : "text-gray-700"
                }`}
              >
                {u.userId || u}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <h2 className="text-[#a17c4d] font-semibold mb-2">
                Chat with {selectedUser}
              </h2>

              {/* CHAT AREA */}
              <div
                className="flex-1 border rounded p-3 overflow-y-auto bg-[#fffaf5]"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`mb-2 ${
                      m.sender === "admin" ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg shadow-sm ${
                        m.sender === "admin"
                          ? "bg-[#a17c4d] text-white"
                          : "bg-[#f0e6da] text-[#3b2a1a]"
                      }`}
                    >
                      {m.message}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* MESSAGE BOX FIXED AT BOTTOM */}
              <div className="flex mt-3 sticky bottom-0 bg-white py-2 border-t border-gray-200">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#a17c4d]"
                />
                <button
                  onClick={sendMessage}
                  className="bg-[#a17c4d] text-white px-6 rounded-r-full hover:bg-[#8d6c3f] transition-all"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center mt-8">
              Select a user to view chat
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
