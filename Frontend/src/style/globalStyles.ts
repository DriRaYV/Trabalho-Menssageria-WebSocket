import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: monospace;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #fafafa;
    color: #333;
    width: 100vw;
    height: 100vh;
    line-height: 1.6;
    display: flex ;
    align-items: center;
    justify-content: center;
  }

 
`;

export default GlobalStyle;
