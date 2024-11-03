"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Move socket initialization outside the component to avoid re-connecting

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  const getFirstName = (name: string | null | undefined) => {
    if (!name) return "";
    return name.split(" ")[0];
  };

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    socket.on("join", (userId) => {
      setActiveUsers((prevActiveUsers) => [...prevActiveUsers, userId]);
    });

    socket.on("leave", (userId) => {
      setActiveUsers((prevActiveUsers) =>
        prevActiveUsers.filter((id) => id !== userId)
      );
    });

    socket.on("activeUsers", (activeUsers) => {
      setActiveUsers(activeUsers);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("join");
      socket.off("leave");
      socket.off("activeUsers");
      socket.off("message");
    };
  }, []);

  // Handle message sending
  const sendMessage = () => {
    if (inputValue.trim()) {
      socket.emit("message", inputValue); // Emit message to server
      setInputValue(""); // Clear input field
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <h1>Welcome, {getFirstName(session?.user?.name)}!</h1>
      
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">Messages:</h3>
        <div className="overflow-y-auto h-64 mb-4 bg-white rounded-md p-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className="mb-2 p-3 bg-gray-200 rounded-md text-gray-800"
            >
              {message}
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          className="mt-2 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>

      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">Active Users:</h3>
        <ul>
          {activeUsers.map((userId) => (
            <li key={userId} className="text-gray-600">
              {userId} is online
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}