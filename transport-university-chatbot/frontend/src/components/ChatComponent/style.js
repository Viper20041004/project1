import styled from "styled-components";

export const ChatWrapper = styled.div`
  position: fixed;
  bottom: 90px;
  right: 30px;
  width: 320px;
  height: 420px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  z-index: 9999;
`;

export const ChatHeader = styled.div`
  background: #00285a;
  color: #fff;
  font-weight: 600;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .close {
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const ChatBody = styled.div`
  flex: 1;
  padding: 10px 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f5f7fb;

  .message {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.4;
  }

  .message.bot {
    align-self: flex-start;
    background: #e9efff;
  }

  .message.user {
    align-self: flex-end;
    background: #ffcc00;
    color: #00285a;
    font-weight: 500;
  }
`;

export const ChatInputArea = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
  background: #fff;
`;

export const ChatInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 10px;
  border-radius: 8px;
  background: #f3f6fb;
`;

export const SendButton = styled.button`
  border: none;
  background: #00285a;
  color: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;

  &:hover {
    background: #ffcc00;
    color: #00285a;
  }
`;

export const ChatToggleButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #00285a;
  color: #fff;
  border: none;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;

  &:hover {
    background: #ffcc00;
    color: #00285a;
  }
`;
