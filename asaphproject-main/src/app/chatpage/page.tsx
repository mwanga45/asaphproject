"use client"
import React, { useState, useRef, useEffect } from 'react'
import { 
  FaPaperPlane, 
  FaRobot, 
  FaUser, 
  FaMicrophone, 
  FaPaperclip,
  FaBrain,
  FaLightbulb,
  FaChartLine,
  FaCog,
  FaTrash,
  FaDownload
} from 'react-icons/fa'
import "./chat.css"
import axios from 'axios'
import { apiURL } from '../utils/Urlport'

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'chart' | 'insight';
  confidence?: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI healthcare assistant. I can help you analyze patient data, generate insights, and create charts. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Backend API URL - correct path to the chat endpoint
  const API_BASE_URL = `${apiURL}api/service`

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check if backend is connected
  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`)
      if (response.status === 200) {
        setIsConnected(true)
        console.log('Backend connected successfully')
      }
    } catch (error) {
      console.error('Backend connection failed:', error)
      setIsConnected(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      // Send request to backend chat endpoint
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: inputMessage,
        context: 'healthcare'
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 second timeout
      })

      if (response.data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.data.message,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        }

        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('API request failed')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble connecting to my AI service right now. Please check your connection and try again.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        setInputMessage('Analyze patient data for this week')
        setIsRecording(false)
      }, 2000)
    }
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: 'Hello! I\'m your AI healthcare assistant. I can help you analyze patient data, generate insights, and create charts. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }])
  }

  const exportChat = () => {
    const chatData = messages.map(msg => ({
      sender: msg.sender,
      text: msg.text,
      timestamp: msg.timestamp.toLocaleString()
    }))
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-chat-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="ai-avatar">
            <FaBrain />
          </div>
          <div className="header-info">
            <h1>AI Healthcare Assistant</h1>
            <p>Powered by Advanced Analytics</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="action-btn" onClick={exportChat} title="Export Chat">
            <FaDownload />
          </button>
          <button className="action-btn" onClick={clearChat} title="Clear Chat">
            <FaTrash />
          </button>
          <button className="action-btn" title="Settings">
            <FaCog />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-avatar">
                {message.sender === 'ai' ? <FaRobot /> : <FaUser />}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.text}</p>
                  {message.type === 'insight' && message.confidence && (
                    <div className="insight-indicator">
                      <FaLightbulb />
                      <span>AI Insight • {message.confidence}% confidence</span>
                    </div>
                  )}
                  {message.type === 'chart' && (
                    <div className="chart-indicator">
                      <FaChartLine />
                      <span>Chart Generated</span>
                    </div>
                  )}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message ai">
              <div className="message-avatar">
                <FaRobot />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p>AI is thinking...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <button className="input-btn attachment-btn" title="Attach File">
            <FaPaperclip />
          </button>
          <div className="text-input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about patient data, insights, or charts..."
              rows={1}
              className="message-input"
            />
          </div>
          <button 
            className={`input-btn voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleVoiceInput}
            title="Voice Input"
          >
            <FaMicrophone />
          </button>
          <button 
            className="input-btn send-btn"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            title="Send Message"
          >
            <FaPaperPlane />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => setInputMessage('Analyze patient trends')}>
            📊 Analyze Trends
          </button>
          <button className="quick-action-btn" onClick={() => setInputMessage('Generate weekly report')}>
            📈 Weekly Report
          </button>
          <button className="quick-action-btn" onClick={() => setInputMessage('Show patient statistics')}>
            👥 Patient Stats
          </button>
        </div>
      </div>

      {/* AI Status */}
      <div className="ai-status">
        <div className="status-indicator">
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span>AI Assistant {isConnected ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    </div>
  )
}
