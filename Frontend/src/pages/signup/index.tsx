import { useState } from "react";
import { Stomp } from "@stomp/stompjs";
import axios from "axios";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import { Container, Title, Error, Input, Button, TextLink } from "./style";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/register",
        {
          username,
        }
      );

      if (response) {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
          stompClient.send("/app/activeusers", {});
        });

        navigate("/");
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(`Erro ao cadastrar: ${err.response.data}`);
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <Container>
      <Title>Cadastrar</Title>
      {error && <Error>{error}</Error>}
      <Input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Button onClick={handleRegister}>Cadastrar</Button>
      <TextLink onClick={() => navigate("/")}>
        Já tem cadastro? Faça o login
      </TextLink>
    </Container>
  );
};

export default RegisterPage;
