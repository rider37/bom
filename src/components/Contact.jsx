import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ContactContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ContentBox = styled.div`
  background: rgba(255, 255, 255, 0.6);
  padding: 4rem;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.05);
  text-align: center;
  max-width: 600px;
  width: 100%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--text-main);
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.2rem;
    color: var(--accent-color);
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--text-main);
    line-height: 1.6;
  }
`;

const Contact = () => {
  return (
    <ContactContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <ContentBox>
        <Title>Contact Us</Title>
        <InfoItem>
          <h3>Address</h3>
          <p>인천광역시 인하로 100<br />인하대학교 나빌레관 108호</p>
        </InfoItem>
        <InfoItem>
          <h3>Email</h3>
          <p>musical0623@naver.com</p>
        </InfoItem>
        <InfoItem>
          <h3>Phone</h3>
          <p>010-1234-5678</p>
        </InfoItem>
      </ContentBox>
    </ContactContainer>
  );
};

export default Contact;
