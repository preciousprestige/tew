import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMessages, getUserMessages, sendMessageToUser } from "../api";
import { io } from "socket.io-client";

export default function AdminMessages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = React.useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("registerUser", "admin");

    socketRef.current.on("newMessage", (msg) => {
      if (msg.sender !== "admin") {
        setMessages((prev) =>
          selectedUser === msg.sender ? [...prev, msg] : prev
        );
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1,
        }));
      }
    });

    loadUsers();

    return () => socketRef.current.disconnect();
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const data = await getMessages();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const loadMessages = async (userId) => {
    try {
      const data = await getUserMessages(userId);
      setMessages(data);
      setUnreadCounts((prev) => {
        const newCounts = { ...prev };
        delete newCounts[userId];
        return newCounts;
      });
    } catch {
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    const msg = { sender: "admin", receiver: selectedUser, message: input.trim() };
    try {
      await sendMessageToUser(msg);
      socketRef.current.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setInput("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-[#a17c4d] font-bold mb-4">Customer Messages</h1>

      <div className="flex gap-6">
        {/* LEFT PANEL */}
        <div className="w-1/4 border-r border-gray-300">
          <h3 className="text-[#a17c4d] mb-2 font-semibold">Users</h3>
          <ul>
            {users.map((u) => {
              const userId = u.userId || u;
              return (
                <li
                  key={userId}
                  onClick={() => {
                    setSelectedUser(userId);
                    loadMessages(userId);
                  }}
                  className={`cursor-pointer p-2 rounded mb-1 ${
                    selectedUser === userId ? "bg-[#f4eadc]" : ""
                  } ${unreadCounts[userId] ? "font-bold" : "text-gray-700"}`}
                >
                  {userId}
                  {unreadCounts[userId] ? (
                    <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2">
                      {unreadCounts[userId]}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1">
          {selectedUser ? (
            <>
              <h2 className="text-[#a17c4d] font-semibold mb-2">
                Chat with {selectedUser}
              </h2>
              <div className="border rounded p-3 h-[400px] overflow-y-auto bg-[#fffaf5]">
                {messages.map((m, i) => (
                  <div key={i} className={`mb-2 ${m.sender === "admin" ? "text-right" : "text-left"}`}>
                    <span
                      className={`inline-block p-2 rounded ${
                        m.sender === "admin"
                          ? "bg-[#a17c4d] text-white"
                          : "bg-[#f0e6da] text-[#3b2a1a]"
                      }`}
                    >
                      {m.message}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex mt-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l p-2"
                />
                <button
                  onClick={sendMessage}
                  className="bg-[#a17c4d] text-white px-4 rounded-r"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a user to view chat</p>
          )}
        </div>
      </div>
    </div>
  );
}
