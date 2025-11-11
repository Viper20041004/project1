import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ChatWrapper, ChatHeader, ChatBody, ChatInputArea, ChatInput, SendButton, ChatToggleButton } from "./style";
import { MessageOutlined, SendOutlined, CloseOutlined , PlusOutlined  } from '@ant-design/icons';

// Use proxy in development, or full URL if VITE_API_URL is set
const API_URL = import.meta.env.VITE_API_URL || "";

const ChatComponent = () => {
  const messageAI = [{sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }]
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(messageAI);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput("");
    
    // Add user message immediately
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response");
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { sender: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Xin lỗi, đã xảy ra lỗi khi kết nối với server. Vui lòng thử lại sau." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRestart = () => {
    setMessages(messageAI);
  }

  return (
    <>
      <ChatWrapper isOpen={isOpen}>
        <ChatHeader>
          <div style={{display:'flex'}}>
              <span>💬 Chat hỗ trợ</span>
              <PlusOutlined onClick={handleRestart}  style={{cursor:'pointer' , marginLeft:'10px'}}/>
          </div>
          <CloseOutlined className="close" onClick={() => setIsOpen(false)} />
        </ChatHeader>

        <ChatBody ref={chatBodyRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.sender === "bot" ? (
                <ReactMarkdown
                  components={{
                    table: ({ node, ...props }) => (
                      <div style={{ overflowX: "auto", margin: "10px 0" }}>
                        <table style={{ borderCollapse: "collapse", width: "100%", border: "1px solid #ddd", fontSize: "13px" }} {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th style={{ border: "1px solid #ddd", padding: "10px 8px", backgroundColor: "#00285a", color: "#fff", textAlign: "left", fontWeight: "600" }} {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td style={{ border: "1px solid #ddd", padding: "10px 8px", verticalAlign: "top" }} {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p style={{ margin: "8px 0", lineHeight: "1.6" }} {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul style={{ margin: "8px 0", paddingLeft: "20px", lineHeight: "1.6" }} {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol style={{ margin: "8px 0", paddingLeft: "20px", lineHeight: "1.6" }} {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong style={{ fontWeight: "bold", color: "#1890ff" }} {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 style={{ margin: "16px 0 8px 0", fontSize: "16px", fontWeight: "600", color: "#00285a" }} {...props} />
                    ),
                  }}
                  rehypePlugins={[]}
                >
                  {msg.text.replace(/<br\s*\/?>/gi, '\n')}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <span style={{ fontStyle: "italic" }}>Đang suy nghĩ...</span>
            </div>
          )}
        </ChatBody>

        <ChatInputArea>
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            disabled={isLoading}
          />
          <SendButton onClick={handleSend} disabled={isLoading}>
            <SendOutlined style={{ fontSize: 18 }} />
          </SendButton>
        </ChatInputArea>
      </ChatWrapper>

      {!isOpen && (
        <ChatToggleButton onClick={() => setIsOpen(true)}>
          <MessageOutlined style={{ fontSize: 24 }} />
        </ChatToggleButton>
      )}
    </>
  );
};

export default ChatComponent;
