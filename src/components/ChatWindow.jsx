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

  const handleHospitalButton = async () => {
    const automatedMessage = { sender: "user", text: "What are the best hospitals in Arlington?" };
    setMessages((prev) => [...prev, automatedMessage]);

    try {
      setIsTyping(true); // Show typing indicator

      // Send automated message to backend
      const response = await axios.post("/api/queryResponse", { messages: [...messages, automatedMessage] });

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
  }

  const handlePoliceStationButton = async () => {
    const automatedMessage = { sender: "user", text: "Where are the nearest police stations?" };
    setMessages((prev) => [...prev, automatedMessage]);

    try {
      setIsTyping(true); // Show typing indicator

      // Send automated message to backend
      const response = await axios.post("/api/queryResponse", { messages: [...messages, automatedMessage] });

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

  const handleBusStopsButton = async () => {
    const automatedMessage = { sender: "user", text: "Where are the nearest bus stops?" };
    setMessages((prev) => [...prev, automatedMessage]);

    try {
      setIsTyping(true); // Show typing indicator

      // Send automated message to backend
      const response = await axios.post("/api/queryResponse", { messages: [...messages, automatedMessage] });

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

  const handleRestaurantsButton = async () => {
    const automatedMessage = { sender: "user", text: "What are the popular restaurants nearby?" };
    setMessages((prev) => [...prev, automatedMessage]);

    try {
      setIsTyping(true); // Show typing indicator

      // Send automated message to backend
      const response = await axios.post("/api/queryResponse", { messages: [...messages, automatedMessage] });

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

  const handleSpeechToText = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition. Please use Chrome or Firefox.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US"; // Set language
    recognition.interimResults = false; // Only final results
    recognition.maxAlternatives = 1; // Limit to one result

    recognition.onstart = () => {
      console.log("Speech recognition started...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript; // Get the recognized text
      setUserInput(transcript); // Populate the input field with the recognized text
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
    };

    recognition.start(); // Start speech recognition
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

      {/* automated hospital button */}
      <div className="chat-actions">
        <button onClick={handleHospitalButton}>Best Hospitals in Arlington</button>
        <button onClick={handlePoliceStationButton}>Nearest Police Stations</button>
        <button onClick={handleBusStopsButton}>Nearest Bus Stops</button>
        <button onClick={handleRestaurantsButton}>Popular Restaurants Nearby</button>
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
        <button onClick={handleSpeechToText}>🎤</button> {/* Speech-to-text button */}
      </div>
    </div>
  );
};

export default ChatWindow;
