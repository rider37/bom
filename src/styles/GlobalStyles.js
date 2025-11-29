import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --bg-gradient: linear-gradient(135deg, #fff9f0 0%, #fff0f5 100%);
    --glass-bg: rgba(255, 255, 255, 0.4);
    --glass-border: 1px solid rgba(255, 255, 255, 0.6);
    --glass-highlight: rgba(255, 255, 255, 0.8);
    --text-main: #5a4d4d; /* Softer brown-gray */
    --text-muted: #9c8c8c;
    --accent-color: #ff9a9e; /* Coral Pink */
    --accent-gradient: linear-gradient(120deg, #ff9a9e 0%, #fecfef 100%);
    --font-main: 'Gowun Batang', serif;
    --font-display: 'Gowun Batang', serif;
    --shadow: 0 10px 30px rgba(255, 154, 158, 0.2);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-main);
    background: var(--bg-gradient);
    color: var(--text-main);
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
  }
`;

export default GlobalStyles;
