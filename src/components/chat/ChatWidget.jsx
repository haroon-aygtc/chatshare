import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// Default configuration
const defaultConfig = {
  businessContext: 'general',
  title: 'Chat Assistant',
  primaryColor: '#3b82f6',
  position: 'bottom-right',
  apiEndpoint: '/api/chat',
  embedded: false
};

const ChatWidget = (props) => {
  // Merge props with default config
  const config = { ...defaultConfig, ...props };
  
  const {
    businessContext,
    title,
    primaryColor,
    position,
    apiEndpoint,
    embedded,
    onClose
  } = config;
  
  const [isOpen, setIsOpen] = useState(embedded);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Initialize chat session and socket connection
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Generate a unique user ID if not already present
        if (!localStorage.getItem('userId')) {
          localStorage.setItem(
            'userId',
            `user-${Math.random().toString(36).substring(2, 9)}`,
          );
        }
        
        const userId = localStorage.getItem('userId') || 'anonymous';
        
        // Create a new chat session
        const response = await axios.post(`${apiEndpoint}/session`, {
          user_id: userId,
          business_context: businessContext
        });
        
        const newRoomId = response.data.session.room_id;
        setRoomId(newRoomId);
        
        // Initialize socket connection
        const socketUrl = process.env.REACT_APP_SOCKET_URL || window.location.origin;
        const newSocket = io(socketUrl, {
          transports: ['websocket', 'polling'],
          withCredentials: true
        });
        
        newSocket.on('connect', () => {
          console.log('Socket connected:', newSocket.id);
          setConnected(true);
          
          // Join the room
          newSocket.emit('join_room', newRoomId);
        });
        
        newSocket.on('receive_message', (message) => {
          setMessages(prev => [...prev, message]);
          if (message.role === 'assistant') {
            setIsLoading(false);
          }
        });
        
        newSocket.on('error', (error) => {
          console.error('Socket error:', error);
          setIsLoading(false);
        });
        
        newSocket.on('disconnect', () => {
          console.log('Socket disconnected');
          setConnected(false);
        });
        
        setSocket(newSocket);
        
        // Load previous messages if any
        try {
          const messagesResponse = await axios.get(`${apiEndpoint}/messages/${newRoomId}`);
          if (messagesResponse.data.messages && messagesResponse.data.messages.length > 0) {
            setMessages(messagesResponse.data.messages);
          }
        } catch (err) {
          console.error('Error loading messages:', err);
        }
      } catch (err) {
        console.error('Error initializing chat:', err);
      }
    };
    
    initializeChat();
    
    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [apiEndpoint, businessContext]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Send message function
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    setIsLoading(true);
    
    const userId = localStorage.getItem('userId') || 'anonymous';
    
    // If socket is connected, send via socket
    if (socket && connected && roomId) {
      socket.emit('send_message', {
        roomId,
        message: inputValue,
        userId,
        businessContext
      });
    } else {
      // Fallback to REST API
      try {
        await axios.post(`${apiEndpoint}/message`, {
          room_id: roomId,
          content: inputValue,
          user_id: userId,
          business_context: businessContext
        });
      } catch (err) {
        console.error('Error sending message:', err);
        setIsLoading(false);
      }
    }
    
    setInputValue('');
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Toggle widget open/closed
  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };
  
  // Toggle minimize/maximize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  // Handle close button
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };
  
  // Position styles
  const positionStyles = {
    position: embedded ? 'relative' : 'fixed',
    bottom: ['bottom-right', 'bottom-left'].includes(position) ? '20px' : 'auto',
    top: ['top-right', 'top-left'].includes(position) ? '20px' : 'auto',
    right: ['bottom-right', 'top-right'].includes(position) ? '20px' : 'auto',
    left: ['bottom-left', 'top-left'].includes(position) ? '20px' : 'auto',
    zIndex: 9999,
  };
  
  // If embedded, always show the widget
  if (embedded) {
    return (
      <div 
        className="chat-widget-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Header */}
        <div 
          className="chat-header"
          style={{
            padding: '12px 16px',
            backgroundColor: primaryColor,
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{title}</h3>
          {onClose && (
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        
        {/* Messages */}
        <div 
          className="chat-messages"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f9fafb'
          }}
        >
          {messages.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#6b7280' }}>
              <p>Send a message to start chatting</p>
            </div>
          ) : (
            <div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '12px'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: message.role === 'user' ? primaryColor : '#ffffff',
                      color: message.role === 'user' ? '#ffffff' : '#1f2937',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      border: message.role === 'user' ? 'none' : '1px solid #e5e7eb'
                    }}
                  >
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {message.content}
                    </p>
                    <div
                      style={{
                        fontSize: '12px',
                        marginTop: '4px',
                        color: message.role === 'user' ? 'rgba(255, 255, 255, 0.7)' : '#6b7280'
                      }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#d1d5db',
                          animation: 'bounce 1s infinite'
                        }}
                      />
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#d1d5db',
                          animation: 'bounce 1s infinite',
                          animationDelay: '0.2s'
                        }}
                      />
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#d1d5db',
                          animation: 'bounce 1s infinite',
                          animationDelay: '0.4s'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Input */}
        <div 
          className="chat-input"
          style={{
            padding: '12px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                resize: 'none',
                minHeight: '40px',
                maxHeight: '120px',
                fontFamily: 'inherit',
                fontSize: '14px',
                outline: 'none',
                ':focus': {
                  borderColor: primaryColor,
                  boxShadow: `0 0 0 2px ${primaryColor}25`
                }
              }}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                backgroundColor: primaryColor,
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                opacity: !inputValue.trim() || isLoading ? 0.7 : 1
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Non-embedded widget with toggle button
  return isOpen ? (
    <div 
      className="chat-widget-container"
      style={{
        ...positionStyles,
        display: 'flex',
        flexDirection: 'column',
        width: '350px',
        height: isMinimized ? 'auto' : '500px',
        maxHeight: '80vh',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'height 0.3s ease'
      }}
    >
      {/* Header */}
      <div 
        className="chat-header"
        style={{
          padding: '12px 16px',
          backgroundColor: primaryColor,
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'