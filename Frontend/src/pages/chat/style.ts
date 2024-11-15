import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

export const Sidebar = styled.div`
  width: 250px;
  background-color: #f4f4f4;
  padding: 10px;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

export const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const UserItem = styled.li`
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #ddd;
  }

  &.active {
    background-color: #007bff;
    color: white;
  }
`;

export const ChatArea = styled.div`
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

export const BackButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
`;

export const MessagesContainer = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

export const Message = styled.div`
  padding: 8px 12px;
  margin: 5px 0;
  background-color: #e3f2fd;
  border-radius: 8px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);

  &.sender {
    background-color: #c8e6c9;
    text-align: right;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const SendButton = styled.button`
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #45a049;
  }

  &:focus {
    outline: none;
  }
`;

export const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  &::before {
    content: "";
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const TypingNotification = styled.p`
  font-style: italic;
  color: gray;
  margin: 5px 0;
`;
