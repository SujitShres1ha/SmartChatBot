'use client'
import React, { useEffect, useRef, useState } from "react"
import axios from "axios"

const ChatWindow = () => {
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [confirmEmergency, setConfirmEmergency] = useState(false)
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

  const handleEmergencyClick = () => {
    if (!confirmEmergency) {
      setConfirmEmergency(true)
      setTimeout(() => setConfirmEmergency(false), 5000)
    } else {
      alert("Contacting 911...")
      window.location.href = "tel:911"
    }
  }

  return (
    <div className="chat-window">
      <button onClick={clearChatHistory} className="clear">Clear Chat</button>

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
        <input 
          type="text" 
          value={userInput} 
          onChange={(e) => setUserInput(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage()
            }
          }}
          placeholder="Type your message..." />
        <button onClick={handleSendMessage}>Send</button>
        <button onClick={handleSpeechToText}>🎤</button>
      </div>
    </div>
  )
}

export default ChatWindow