import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import heroBg from '../assets/main_background.png';
import poster1 from '../assets/be_loved.jpg';
import poster2 from '../assets/connect10n.jpg';
import poster3 from '../assets/to_me_from_me.jpg';
import waydown from '../assets/waydown.jpg';

const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  background: var(--bg-color);
  
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const Section = styled.section`
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 4rem 2rem;
`;

const HeroSection = styled(Section)`
  background: url(${heroBg}) no-repeat center center/cover;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.3);
  }
`;

const HeroContent = styled(motion.div)`
  z-index: 1;
  text-align: center;
  color: #fff;
  
  h1 {
    font-family: var(--font-display);
    font-size: 5rem;
    margin-bottom: 1rem;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  
  p {
    font-size: 1.5rem;
    font-weight: 300;
    letter-spacing: 2px;
  }
`;

// --- About Section (Activities) ---
const AboutSection = styled(Section)`
  background: linear-gradient(135deg, #fff9f0 0%, #fff0f5 100%);
`;

const ContentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
  max-width: 900px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--text-main);
  margin-bottom: 2rem;
  
  span {
    color: var(--accent-color);
  }
`;

const TextBlock = styled.div`
  margin-bottom: 2rem;
  line-height: 1.8;
  color: var(--text-muted);
  font-size: 1.1rem;
  
  strong {
    color: var(--text-main);
    font-weight: 700;
  }
`;

// --- History Section ---
const HistorySection = styled(Section)`
  background: #fff;
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
  padding: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--accent-color);
    border-radius: 10px;
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  gap: 2rem;
  align-items: baseline;
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Year = styled.div`
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--accent-color);
  font-weight: bold;
  min-width: 100px;
`;

const Events = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--text-main);
  font-size: 1.1rem;
`;

// --- Recruitment Section ---
const RecruitmentSection = styled(Section)`
  background: linear-gradient(180deg, #fff0f5 0%, #fff 100%);
  height: auto; /* Allow content to expand */
  min-height: 100vh;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  margin-bottom: 3rem;
`;

const TeamCard = styled(motion.div)`
  background: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
  
  h3 {
    color: var(--accent-color);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-family: var(--font-display);
  }
  
  .slogan {
    font-style: italic;
    color: #666;
    margin-bottom: 1rem;
    display: block;
    font-weight: 600;
  }
  
  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-muted);
  }
`;

const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 20px;
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  flex: 1;
  min-width: 250px;
  
  h4 {
    color: var(--text-main);
    font-size: 1.2rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 0.5rem;
    display: inline-block;
  }
  
  ul {
    list-style: none;
    padding: 0;
    li {
      margin-bottom: 0.5rem;
      color: var(--text-muted);
      font-size: 0.95rem;
    }
  }
`;

// --- Gallery Section (Marquee) ---
const GallerySection = styled(Section)`
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const MarqueeContainer = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
`;

const MarqueeTrack = styled(motion.div)`
  display: flex;
  gap: 3rem;
  padding: 2rem 0;
  width: max-content;
`;

const PosterItem = styled(motion.div)`
  height: 60vh;
  aspect-ratio: 2/3;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(255,255,255,0.1);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const OutroSection = styled(Section)`
  background: var(--text-main);
  color: #fff;
  text-align: center;
  
  h2 {
    font-family: var(--font-display);
    font-size: 3rem;
    margin-bottom: 2rem;
  }
  
  p {
    font-size: 1.2rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }
`;

const Home = () => {
  const posters = [poster1, poster2, poster3, waydown, poster1, poster2, poster3, waydown];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>극단 봄</h1>
          <p>봄, 모든 것의 시작</p>
        </HeroContent>
      </HeroSection>

      {/* About Section */}
      <AboutSection>
        <ContentCard
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <SectionTitle>극단 봄에선 <span>어떤 활동을?</span></SectionTitle>
          <TextBlock>
            <p>방학 중에는 <strong>정기공연</strong>을, 학기 중에는 간소한 형태의 <strong>갈라쇼나 단막극</strong>을 준비합니다.</p>
            <p>뮤지컬을 사랑하는 인하대 학우들이 모여 공연을 올리며 뮤지컬을 접해보지 못한 많은 분들께 공연을 제공합니다.</p>
          </TextBlock>
          <TextBlock style={{ fontSize: '0.95rem', background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '10px' }}>
            <p><strong>정기공연:</strong> 하나의 뮤지컬 전체를 연습하여 하나의 극을 그대로 올리는 공연</p>
            <p><strong>갈라쇼:</strong> 각각 다른 뮤지컬의 넘버들을 모아 올리는 공연</p>
          </TextBlock>
        </ContentCard>
      </AboutSection>

      {/* History Section */}
      <HistorySection>
        <SectionTitle>극단 봄의 <span>발자취</span></SectionTitle>
        <TimelineContainer>
          <TimelineItem initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Year>2025</Year>
            <Events>
              <p>1학기 학기공연 To me, From me.</p>
            </Events>
          </TimelineItem>
          <TimelineItem initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Year>2024</Year>
            <Events>
              <p>1학기 학기공연 BELOVED</p>
              <p>1학기 정기공연 뮤지컬 레미제라블</p>
              <p>2학기 학기공연 CONNECT1ON</p>
            </Events>
          </TimelineItem>
          <TimelineItem initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Year>2023</Year>
            <Events>
              <p>1학기 학기공연 봄, 컬러풀!</p>
              <p>1학기 정기공연 뮤지컬 원더: 방랑자들</p>
              <p>2학기 학기공연 링, 송, 봄</p>
            </Events>
          </TimelineItem>
          <TimelineItem initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Year>2022</Year>
            <Events>
              <p>1학기 학기공연 뮤지컬 아이러브유</p>
              <p>1학기 정기공연 뮤지컬 서울</p>
              <p>2학기 학기공연 봄, 갈라쇼, 어썸!</p>
            </Events>
          </TimelineItem>
        </TimelineContainer>
      </HistorySection>

      {/* Recruitment Section */}
      <RecruitmentSection>
        <SectionTitle>12기 <span>모집 분야</span></SectionTitle>
        <GridContainer>
          <TeamCard whileHover={{ y: -10 }}>
            <h3>배우팀</h3>
            <span className="slogan">"극단 봄의 얼굴이 되어주는 팀"</span>
            <p>캐릭터 분석과 꾸준한 연습을 통해 무대 위에서 노래와 연기, 춤으로 관객들에게 감동을 전합니다.</p>
          </TeamCard>
          <TeamCard whileHover={{ y: -10 }}>
            <h3>연출팀</h3>
            <span className="slogan">"전하고자 하는 메세지를 연구하고 무대를 통해 표현하는 팀"</span>
            <p>배우들의 연기와 노래, 춤을 디렉팅하며 무대, 조명, 음향 등을 다른 팀들과 소통하여 하나의 작품을 만듭니다.</p>
          </TeamCard>
          <TeamCard whileHover={{ y: -10 }}>
            <h3>무대팀</h3>
            <span className="slogan">"무대 진행에 필요한 세트, 의상, 소품을 직접 구상하고 제작하며, 공연장에서는 백스테이지를 빛내는 팀"</span>
            <p>무대를 창의적으로 디자인하고 공연에서 무대 전환과 점검, 배우 분장 등을 담당하여 멋진 공연을 만듭니다.</p>
          </TeamCard>
          <TeamCard whileHover={{ y: -10 }}>
            <h3>홍보팀</h3>
            <span className="slogan">"뮤지컬과 극단 봄의 매력을 널리 알리는 콘텐츠 기획 및 제작팀"</span>
            <p>SNS를 운영하며 공연을 위한 홍보물 제작(카드뉴스, 캐스팅보드), 공연 촬영을 담당합니다. 연습현장에서는 영상 촬영, 컨셉 기획 등을 담당합니다.</p>
          </TeamCard>
        </GridContainer>

        <InfoBox>
          <InfoItem>
            <h4>모집 안내</h4>
            <ul>
              <li><strong>지원 자격:</strong> 학번, 나이, 성별, 경험 관계없이 뮤지컬, 연기를 사랑하는 누구나 가능</li>
              <li><strong>모집 기간:</strong> ~9월 5일(금) 까지</li>
              <li><strong>면접 일정:</strong> 9월 8일(월)-9월 12일(금)</li>
            </ul>
          </InfoItem>
          <InfoItem>
            <h4>주요 일정</h4>
            <ul>
              <li>매주 금요일 6시부터 운영진 회의 및 단체 연습 진행</li>
              <li>신입단원 환영회 및 OT: 9월 26일(금)</li>
              <li>공연 일정: 12월 19(금) - 20(토) (예정)</li>
            </ul>
          </InfoItem>
          <InfoItem>
            <h4>지원 방법</h4>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              극단 봄 카카오톡 채널을 통해<br />
              <strong>"지원서 받겠습니다"</strong>라고 보내주시면<br />
              지원서 링크를 보내드립니다.
            </p>
          </InfoItem>
        </InfoBox>
      </RecruitmentSection>

      {/* Gallery Section */}
      <GallerySection>
        <MarqueeContainer>
          <MarqueeTrack
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {posters.map((src, index) => (
              <PosterItem key={index} whileHover={{ scale: 1.05 }}>
                <img src={src} alt={`Poster ${index + 1}`} />
              </PosterItem>
            ))}
          </MarqueeTrack>
        </MarqueeContainer>
      </GallerySection>

      <OutroSection>
        <h2>See you on Stage</h2>
        <p>당신의 봄을 기다립니다.</p>
        <p>Contact: 010-1234-5678</p>
      </OutroSection>
    </HomeContainer>
  );
};

export default Home;
