import { Stomp } from "@stomp/stompjs";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import * as S from "./style";
import axios from "axios";

interface Message {
  id: number;
  senderId: number;
  recieverId: number | null;
  createdAt: string;
  content: string;
  senderName: string;
  recieverName: string | null;
}

interface User {
  id: number;
  username: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<{ [key: number]: string[] }>({});
  const [publicMessages, setPublicMessages] = useState<string[]>([]);
  const [client, setClient] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [senderId, setSenderId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [writingText, setWritingText] = useState("");

  useEffect(() => {
    setSenderId(JSON.parse(sessionStorage.getItem("user") || "")?.id);
  }, []);

  useEffect(() => {
    if (!senderId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      handlePublicMessages();

      stompClient.subscribe("/topic/messages", (msg) => {
        const msgData = JSON.parse(msg.body);
        if (!selectedUser) {
          setPublicMessages((prevMessages) => [
            ...prevMessages,
            `${msgData?.senderName}: ${msgData?.message}`,
          ]);
        }
      });

      stompClient.subscribe("/topic/writing", (msg) => {
        setWritingText(msg.body);
        setTimeout(() => setWritingText(""), 3000);
      });

      stompClient.send("/app/activeusers", {}, JSON.stringify(senderId));

      stompClient.subscribe(`/topic/users/${senderId}`, (msg) => {
        const usersData = JSON.parse(msg.body);
        setUsers(usersData.filter((user: User) => user.id !== senderId));
      });

      if (selectedUser) {
        handleUserClick(selectedUser);
        stompClient.subscribe(`/topic/private/${senderId}`, (msg) => {
          const msgData = JSON.parse(msg.body);
          setMessages((prevMessages) => ({
            ...prevMessages,
            [selectedUser]: [
              ...(prevMessages[selectedUser] || []),
              `${msgData.senderName}: ${msgData.message}`,
            ],
          }));
        });
      }
    });

    setClient(stompClient);

    return () => {
      stompClient.disconnect();
    };
  }, [selectedUser, senderId]);

  const sendMessage = () => {
    if (client && client.connected && message.trim()) {
      const messageData = JSON.stringify({
        message: message,
        senderId: senderId ? Number(senderId) : null,
        receiverId: selectedUser ? selectedUser : null,
      });

      client.send("/app/send", {}, messageData);

      if (senderId) {
        client.send(`/app/activeusers/${senderId}`);
      }

      setMessage("");
    }
  };

  const handlePublicMessages = async () => {
    const response = await axios.get("http://localhost:8080/public");
    if (response.data) {
      setPublicMessages(
        response.data.map(
          (message: Message) => `${message.senderName}: ${message.content}`
        )
      );
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (client && client.connected && !selectedUser)
      client?.send("/app/writingUser", {}, senderId?.toString());
  }, [client, message, senderId, selectedUser]);

  const handleUserClick = (userId: number) => {
    setLoading(true);
    setMessages((prevMessages) => ({ ...prevMessages, [userId]: [] }));
    setPublicMessages([]);
    setSelectedUser(userId);

    axios
      .get(`http://localhost:8080/private/${userId}/${senderId}`)
      .then((response) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [userId]: response.data.map(
            (message: Message) => `${message.senderName}: ${message.content}`
          ),
        }));
      });

    setLoading(false);
  };

  useEffect(() => console.log(messages), [messages]);
  const handleBackToGeneralChat = () => {
    setSelectedUser(null);
    setMessages({});
    setPublicMessages([]);
    handlePublicMessages();
  };

  useEffect(() => {
    if (selectedUser) console.log(messages[selectedUser]);
  }, [selectedUser, messages]);

  return loading ? (
    <S.Container>
      <S.Header>Carregando...</S.Header>
      <S.LoadingSpinner />
    </S.Container>
  ) : (
    <S.Container>
      <S.Sidebar>
        <S.UserList>
          {users.map((user) => (
            <S.UserItem
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className={selectedUser === user.id ? "active" : ""}
            >
              {user.username}
            </S.UserItem>
          ))}
        </S.UserList>
      </S.Sidebar>

      <S.ChatArea>
        <S.Header>Chat</S.Header>

        {selectedUser && (
          <S.BackButton onClick={handleBackToGeneralChat}>
            Voltar para o chat geral
          </S.BackButton>
        )}
        <S.MessagesContainer>
          {(selectedUser ? messages[selectedUser] : publicMessages).map(
            (msg, index) => (
              <S.Message key={index}>{msg}</S.Message>
            )
          )}
        </S.MessagesContainer>
        {!selectedUser && (
          <S.TypingNotification>{writingText}</S.TypingNotification>
        )}
        <S.InputContainer>
          <S.Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
          />
          <S.SendButton onClick={sendMessage}>Enviar</S.SendButton>
        </S.InputContainer>
      </S.ChatArea>
    </S.Container>
  );
};

export default Chat;
