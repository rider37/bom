import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Reservation from './components/Reservation';
import Contact from './components/Contact';
import { AnimatePresence } from 'framer-motion';

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background: var(--bg-gradient);
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
`;

function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
        <MainContent>
          <AnimatePresence mode="wait">
            {activeSection === 'home' && <Home key="home" />}
            {activeSection === 'reservation' && <Reservation key="reservation" />}
            {activeSection === 'contact' && <Contact key="contact" />}
          </AnimatePresence>
        </MainContent>
      </AppContainer>
    </>
  );
}

export default App;
