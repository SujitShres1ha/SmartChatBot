import React, { useState } from "react";
import axios from "axios";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]); // Store chat history
  const [userInput, setUserInput] = useState(""); // Store user query
  const [isTyping, setIsTyping] = useState(false); // Typing indicator

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user's message to chat history
    const newMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput(""); // Clear input field

    try {
      setIsTyping(true); // Show typing indicator

      // Send curated payload to backend
      const response = await axios.post("/api/queryResponse", { messages: [...messages, newMessage] });

      // Extract bot response and update chat history
      const botMessage = { sender: "model", text: response.data };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage = { sender: "model", text: "Sorry, I couldn't process your request." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false); // Hide typing indicator
    }
  };

  return (
    <div className="chat-window">
      {/* Chat History */}
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="chat-bubble model">Typing...</div>}
      </div>

      {/* Input Field */}
      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
