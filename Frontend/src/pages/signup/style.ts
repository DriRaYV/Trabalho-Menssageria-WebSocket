import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
  padding: 20px;
`;

export const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

export const Error = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

export const Input = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

export const Button = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const TextLink = styled.p`
  font-size: 1rem;
  color: #0056b3;
  cursor: pointer;
  text-decoration: underline;
`;
