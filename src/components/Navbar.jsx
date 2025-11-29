import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  right: 0;
  padding: 2rem 3rem;
  z-index: 100;
  display: flex;
  gap: 3rem;
`;

const NavItem = styled(motion.div)`
  font-family: var(--font-main);
  font-weight: 500;
  font-size: 1.1rem;
  color: var(--text-main);
  cursor: pointer;
  position: relative;
  
  &:hover {
    color: var(--accent-color);
  }

  ${props => props.active && `
    color: var(--accent-color);
    font-weight: 700;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--accent-color);
      border-radius: 2px;
    }
  `}
`;

const Navbar = ({ activeSection, setActiveSection }) => {
    const menuItems = [
        { id: 'home', label: '홈' },
        { id: 'reservation', label: '예매' },
        { id: 'contact', label: '문의' },
    ];

    return (
        <NavContainer
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {menuItems.map((item) => (
                <NavItem
                    key={item.id}
                    active={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {item.label}
                </NavItem>
            ))}
        </NavContainer>
    );
};

export default Navbar;
