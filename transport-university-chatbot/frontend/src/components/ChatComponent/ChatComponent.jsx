import React, { useState } from "react";
import { ChatWrapper, ChatHeader, ChatBody, ChatInputArea, ChatInput, SendButton, ChatToggleButton } from "./style";
import { MessageOutlined, SendOutlined, CloseOutlined , PlusOutlined  } from '@ant-design/icons';

const ChatComponent = () => {
  const messageAI = [{sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }]
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(messageAI);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
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

        <ChatBody>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </ChatBody>

        <ChatInputArea>
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
          />
          <SendButton onClick={handleSend}>
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
