import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Title, Error, Input, Button, TextLink } from "./style";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        {
          username,
        }
      );

      if (!response.data) {
        setError("Credenciais inválidas.");
        return;
      }

      sessionStorage.setItem(
        "user",
        JSON.stringify({ username: username, id: response.data })
      );
      navigate("/chat");
    } catch (err) {
      setError("Credenciais inválidas.");
    }
  };

  return (
    <Container>
      <Title>Login</Title>
      {error && <Error>{error}</Error>}
      <Input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Button onClick={handleLogin}>Entrar</Button>

      <TextLink onClick={() => navigate("/register")}>
        Não tem login? Cadastre-se
      </TextLink>
    </Container>
  );
};

export default LoginPage;
