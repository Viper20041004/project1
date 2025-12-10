import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from 'react-redux';
import { message } from 'antd';
import {
  ChatWrapper,
  ChatHeader,
  ChatContainer,
  ChatSidebar,
  ChatHistoryItem,
  ChatHistoryEmpty,
  ChatMainArea,
  ChatBody,
  ChatInputArea,
  ChatInput,
  SendButton,
  ChatToggleButton
} from "./style";
import { MessageOutlined, SendOutlined, CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { chatService } from '../../services/api';

const ChatComponent = () => {
  const messageAI = [{ sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }]
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(messageAI);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null); // Keep for UI, but backend returns flat history for now
  const chatBodyRef = useRef(null);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Load history when chat opens and user is logged in
  useEffect(() => {
    if (isOpen && user.isAuthenticated) {
      fetchHistory();
    }
  }, [isOpen, user.isAuthenticated]);

  const fetchHistory = async () => {
    try {
      const res = await chatService.getHistory(50, 0); // Limit 50 for now
      // Transform backend history to UI format if needed
      // The backend returns a flat list of messages. 
      // Current UI expects "chat sessions" (chatHistory list of objects with messages)
      // But the backend design seems to be a single continuous chat log or similar.
      // Let's adapt: We will treat the history from backend as the current conversation.

      if (res.data && res.data.items) {
        const historyMessages = res.data.items.map(item => ({
          sender: item.role === 'user' ? 'user' : 'bot',
          text: item.message || item.response, // Backend has message or response depending on role? No, check schema
          // Actually schema says: message (input), response (output).
          // So each history item is a PAIR? or single?
          // Checking backend: ChatHistory model has (message, response). So each row is a Exchange.
        }));

        // Flatten the pairs: User msg, then Bot msg
        const flatMessages = [];
        res.data.items.forEach(item => {
          flatMessages.push({ sender: 'user', text: item.message, id: item.id });
          if (item.response) {
            flatMessages.push({ sender: 'bot', text: item.response, id: item.id + '_bot' });
          }
        });

        // If history is empty, show default welcome
        if (flatMessages.length > 0) {
          setMessages(flatMessages);
        } else {
          setMessages(messageAI);
        }
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!user.isAuthenticated) {
      message.warning("Vui lòng đăng nhập để chat!");
      return;
    }

    const userMessage = input.trim();
    setInput("");

    // Optimistic UI update
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await chatService.send(userMessage);
      const botResponse = res.data.response;

      setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: "bot", text: "Xin lỗi, tôi gặp sự cố khi kết nối. Vui lòng thử lại." }]);
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
    // Logic to start new conversation? 
    // For now, clear local messages to default, but backend might persist history.
    // If we want "New Chat", we might need session IDs in backend.
    // Current implementation is simple: just clear view.
    setMessages(messageAI);
  };

  // If not logged in, don't show the toggle button? Or show it but prompt login?
  // Requirements: "chỉ được chat khi đã đăng nhập"
  if (!user.isAuthenticated) {
    return null; // Hid chat completely
  }

  return (
    <>
      <ChatWrapper isOpen={isOpen}>
        <ChatHeader>
          <div style={{ display: 'flex' }}>
            <span>💬 Chat hỗ trợ</span>
            <PlusOutlined onClick={handleRestart} style={{ cursor: 'pointer', marginLeft: '10px' }} title="Làm mới cuộc hội thoại" />
          </div>
          <CloseOutlined className="close" onClick={() => setIsOpen(false)} />
        </ChatHeader>

        <ChatContainer>
          {/* Sidebar disabled for now as backend returns flat list, complex history grouping needs more backend support */}
          {/* <ChatSidebar> ... </ChatSidebar> */}

          {/* Main Chat Area */}
          <ChatMainArea style={{ width: '100%' }}>
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
          </ChatMainArea>
        </ChatContainer>
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
