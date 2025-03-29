'use client'
import React, { useEffect, useRef, useState } from "react"
import axios from "axios"

const ChatWindow = () => {
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef()

  // Load messages from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("messages")
      if (savedMessages) setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Save messages and auto-scroll
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages))
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
  const [messages, setMessages] = useState([]); // Store chat history
  const [userInput, setUserInput] = useState(""); // Store user query
  const [isTyping, setIsTyping] = useState(false); // Typing indicator
  const [confirmEmergency, setConfirmEmergency] = useState(false); // Track emergency confirmation

  const handleEmergencyClick = () => {
    if (!confirmEmergency) {
      setConfirmEmergency(true); // Show confirmation state
      setTimeout(() => setConfirmEmergency(false), 5000); // Reset confirmation after 5 seconds
    } else {
      alert("Contacting 911...");
      // Simulate contacting 911 (e.g., redirect to a phone call)
      window.location.href = "tel:911";
    }
  };

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

  const handleSendMessage = async () => {
    if (!userInput.trim()) return
    const newMessage = { sender: "user", text: userInput }
    setMessages((prev) => [...prev, newMessage])
    setUserInput("")

    try {
      setIsTyping(true)
      const response = await axios.post("/api/queryResponse", { messages: [...messages, newMessage] })
      const botMessage = { sender: "model", text: response.data }
      setMessages((prev) => [...prev, botMessage])
    } catch {
      setMessages((prev) => [...prev, { sender: "model", text: "Sorry, I couldn't process your request." }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleAutomatedMessage = async (text) => {
    const automatedMessage = { sender: "user", text }
    setMessages((prev) => [...prev, automatedMessage])

    try {
      setIsTyping(true)
      const response = await axios.post("/api/queryResponse", { messages: [...messages, automatedMessage] })
      const botMessage = { sender: "model", text: response.data }
      setMessages((prev) => [...prev, botMessage])
    } catch {
      setMessages((prev) => [...prev, { sender: "model", text: "Sorry, I couldn't process your request." }])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChatHistory = () => setMessages([])

  const handleSpeechToText = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.")
      return
    }
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => setUserInput(event.results[0][0].transcript)
    recognition.start()
  }
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
      <button onClick={clearChatHistory}>Clear Chat</button>

      {/* Emergency Button */}
      <button className="emergency-button" onClick={handleEmergencyClick}>
        {confirmEmergency ? "Click Again to Confirm" : "Emergency 911"}
      </button>

      {/* Chat History */}
      <div className="chat-history flex flex-col overflow-y-scroll" ref={chatRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>{msg.text}</div>
        ))}
        {isTyping && <div className="chat-bubble model">Typing...</div>}
      </div>

      {/* Automated Message Buttons */}
      <div className="chat-actions">
        <button onClick={() => handleAutomatedMessage("What are the best hospitals in Arlington?")}>
          Best Hospitals in Arlington
        </button>
        <button onClick={() => handleAutomatedMessage("Where are the nearest police stations?")}>
          Nearest Police Stations
        </button>
        <button onClick={() => handleAutomatedMessage("Where are the nearest bus stops?")}>
          Nearest Bus Stops
        </button>
        <button onClick={() => handleAutomatedMessage("What are the popular restaurants nearby?")}>
          Popular Restaurants Nearby
        </button>
      </div>

      {/* Input Section */}
      <div className="chat-input">
        <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type your message..." />
        <button onClick={handleSendMessage}>Send</button>
        <button onClick={handleSpeechToText}>🎤</button>
      </div>
    </div>
  )
}

export default ChatWindow
