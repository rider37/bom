import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import waydown from '../assets/record.png';
import { fetchReservedSeats, saveReservation, checkReservation, cancelReservation } from '../services/googleSheets';

const ReservationContainer = styled(motion.div)`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 100px 20px 50px;
  background: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  @media (max-width: 768px) {
    padding: 80px 10px 100px;
    align-items: flex-start;
    display: block; /* Change to block to allow proper scrolling flow */
  }
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  display: flex;
  overflow: hidden;
  min-height: 700px;

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
    border-radius: 20px;
    overflow: visible;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: var(--text-main);
  color: #fff;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${waydown}) center/cover;
    opacity: 0.3;
  }

  @media (max-width: 768px) {
    padding: 2rem;
    flex: none;
  }
`;

const PosterImage = styled.img`
  width: 250px;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  margin-bottom: 2rem;
  z-index: 1;

  @media (max-width: 768px) {
    width: 150px;
    margin-bottom: 1rem;
  }
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: 2.5rem;
  margin-bottom: 1rem;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  opacity: 0.9;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const RightPanel = styled.div`
  flex: 1.5;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    flex: none;
  }
`;

const StepTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--text-main);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  span {
    font-size: 1rem;
    color: var(--accent-color);
    font-family: var(--font-main);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.primary ? 'var(--accent-gradient)' : '#eee'};
  color: ${props => props.primary ? '#fff' : '#333'};
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  margin-right: 1rem;
  opacity: ${props => props.disabled ? 0.7 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;

const SeatMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  width: 100%; /* Ensure full width for scrolling */

  /* Custom Scrollbar for better UX on mobile */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    align-items: flex-start; /* Allow scrolling from start */
    padding-left: 0;
    padding-right: 0;
  }
`;

const SeatMapWrapper = styled.div`
  min-width: fit-content;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 0 1rem;
`;

const SectionContainer = styled.div`
  display: flex;
  gap: 4rem;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 1rem; /* Reduce gap further on mobile */
  }
`;

const SideSection = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;

  @media (max-width: 768px) {
    gap: 4px; /* Smaller gap on mobile */
  }
`;

const Seat = styled(motion.div)`
  width: 30px;
  height: 30px;
  background: ${props => props.occupied ? '#ddd' : (props.selected ? props.color : props.lightColor)};
  border: 1px solid ${props => props.occupied ? '#ccc' : props.color};
  border-radius: 6px;
  cursor: ${props => props.occupied ? 'not-allowed' : 'pointer'};
  pointer-events: ${props => props.occupied ? 'none' : 'auto'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  color: ${props => props.selected ? '#fff' : (props.occupied ? '#999' : props.color)};
  font-weight: bold;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 0.6rem;
    border-radius: 4px;
  }
`;

const Stage = styled.div`
  width: 80%;
  height: 40px;
  background: #333;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 50px 50px;
  margin-top: 1rem;
  font-weight: bold;
  letter-spacing: 5px;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: #fff;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Reservation = () => {
    const [step, setStep] = useState(0);
    const [ticketCount, setTicketCount] = useState(1);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [formData, setFormData] = useState({ name: '', phone: '', date: '2026.01.16' });

    // Check/Cancel Modal State
    const [showCheckModal, setShowCheckModal] = useState(false);
    const [checkData, setCheckData] = useState({ name: '', phone: '' });
    const [myReservations, setMyReservations] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        loadReservedSeats();
        setSelectedSeats([]); // Clear selection when date changes
    }, [formData.date]);

    const loadReservedSeats = async () => {
        const seats = await fetchReservedSeats(formData.date);
        setOccupiedSeats(seats);
    };

    const handleNext = () => {
        if (step === 0) {
            setStep(1);
        } else if (step === 1) {
            if (formData.name && formData.phone) {
                setStep(2);
            } else {
                alert('이름과 연락처를 입력해주세요.');
            }
        }
    };

    const toggleSeat = (id) => {
        if (occupiedSeats.includes(id)) return;

        if (selectedSeats.includes(id)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== id));
        } else {
            if (selectedSeats.length < ticketCount) {
                setSelectedSeats([...selectedSeats, id]);
            } else {
                alert(`최대 ${ticketCount}명까지 선택 가능합니다.`);
            }
        }
    };

    const handleConfirm = async () => {
        if (selectedSeats.length !== ticketCount) {
            alert(`${ticketCount}개의 좌석을 선택해주세요.`);
            return;
        }

        setIsLoading(true);
        const reservationData = {
            ...formData,
            ticketCount,
            seats: selectedSeats
        };

        const result = await saveReservation(reservationData);
        setIsLoading(false);

        if (result.status === 'success') {
            setShowSuccessModal(true);
            setStep(0);

            // Optimistically update occupied seats to prevent immediate re-selection
            setOccupiedSeats(prev => [...prev, ...selectedSeats]);

            setSelectedSeats([]);
            setFormData({ name: '', phone: '', date: '2026.01.16' });

            // Refresh seats after a short delay to allow backend to update
            setTimeout(() => loadReservedSeats(), 3000);
        } else {
            alert('예매 중 오류가 발생했습니다.\n' + (result.message || ''));
        }
    };

    const handleCheckReservation = async () => {
        if (!checkData.name || !checkData.phone) {
            alert('이름과 연락처를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await checkReservation(checkData.name, checkData.phone);
            console.log("Check Result:", result); // Debugging

            if (result.status === 'success') {
                setMyReservations(result.reservations);
            } else if (Array.isArray(result)) {
                // Handle case where old GAS script returns array of seats
                alert('시스템 업데이트가 필요합니다. 관리자에게 문의해주세요. (GAS 버전 불일치)');
            } else {
                // If reservations is empty but status is success, it means no match
                if (result.reservations && result.reservations.length === 0) {
                    setMyReservations([]);
                } else {
                    alert('예약 정보를 찾을 수 없거나 오류가 발생했습니다.\n' + (result.message || ''));
                }
            }
        } catch (e) {
            alert('오류가 발생했습니다: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelReservation = async () => {
        if (window.confirm('정말로 예약을 취소하시겠습니까?')) {
            setIsLoading(true);
            const result = await cancelReservation(checkData.name, checkData.phone);
            setIsLoading(false);

            if (result.status === 'success') {
                alert('예약이 취소되었습니다.');
                setMyReservations(null);
                setShowCheckModal(false);
                loadReservedSeats(); // Refresh seats
            } else {
                alert('취소 중 오류가 발생했습니다.');
            }
        }
    };

    // Helper to render a block of seats with correct ordering (Bottom-up)
    const renderSeatBlock = (prefix, startNum, rows, cols, color, lightColor, reverseRow = false) => {
        let seatElements = [];

        // We want row 1 (closest to stage) to be at the bottom visually.
        // In a grid, the first elements are at the top.
        // So we need to render the HIGHEST row numbers first.
        // Assuming row 1 is 1..cols, Row 2 is cols+1..2*cols, etc.
        // We render Row N, Row N-1, ... Row 1.

        for (let r = rows - 1; r >= 0; r--) {
            const rowStart = startNum + (r * cols);
            for (let c = 0; c < cols; c++) {
                // If reverseRow is true, we want numbers to go 8, 7, 6... 1 (Left to Right in grid)
                // which means visually 1 is on the Right.
                const num = reverseRow ? (rowStart + cols - 1 - c) : (rowStart + c);
                const id = `${prefix}-${num}`;
                seatElements.push(
                    <Seat
                        key={id}
                        color={color}
                        lightColor={lightColor}
                        occupied={occupiedSeats.includes(id)}
                        selected={selectedSeats.includes(id)}
                        onClick={() => toggleSeat(id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {num}
                    </Seat>
                );
            }
        }
        return seatElements;
    };

    return (
        <ReservationContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <ContentBox>
                <LeftPanel>
                    <PosterImage src={waydown} alt="Poster" />
                    <Title>갈라쇼 <br />&lt;The Record: 감정조각&gt;</Title>
                    <InfoText>
                        일시: 2026.01.16 - 01.17<br />
                        장소: 학산소극장<br />
                        러닝타임: 100분
                    </InfoText>
                </LeftPanel>

                <RightPanel>
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                            >
                                <StepTitle><span>Step 01</span>예매 안내</StepTitle>
                                <InfoText style={{ color: '#555' }}>
                                    본 공연은 무료 공연입니다.<br />
                                    원활한 관람을 위해 1인당 최대 10매까지 예매 가능합니다.<br />
                                    공연 시작 10분 전까지 티켓을 수령해주시기 바랍니다.
                                </InfoText>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Button primary onClick={handleNext} style={{ flex: 1 }}>예매하기</Button>
                                    <Button onClick={() => setShowCheckModal(true)} style={{ flex: 1, background: '#f0f0f0', color: '#333' }}>예약 확인</Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <StepTitle><span>Step 02</span>정보 입력</StepTitle>
                                <FormGroup>
                                    <Label>이름</Label>
                                    <Input
                                        type="text"
                                        placeholder="이름을 입력하세요"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>연락처</Label>
                                    <Input
                                        type="tel"
                                        placeholder="010-0000-0000"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>관람 일자</Label>
                                    <Select
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    >
                                        <option value="2026.01.16">(1회차)2026.01.16 (금)</option>
                                        <option value="2026.01.17">(2회차)2026.01.17 (토)</option>
                                    </Select>
                                </FormGroup>
                                <FormGroup>
                                    <Label>인원 선택</Label>
                                    <Select
                                        value={ticketCount}
                                        onChange={(e) => setTicketCount(Number(e.target.value))}
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}명</option>
                                        ))}
                                    </Select>
                                </FormGroup>
                                <div style={{ display: 'flex', marginTop: '2rem' }}>
                                    <Button type="button" onClick={() => setStep(0)}>이전</Button>
                                    <Button type="button" primary onClick={handleNext}>다음</Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <StepTitle><span>Step 03</span>좌석 선택</StepTitle>
                                <SeatMapContainer>
                                    <SeatMapWrapper>
                                        {/* Da-yeol (Top) - Purple */}
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ color: '#9370db', fontWeight: 'bold', display: 'block', textAlign: 'center', marginBottom: '10px' }}>다열</span>
                                            <div style={{ display: 'flex', gap: '6px', flexDirection: 'row-reverse' }}>
                                                {/* Da-yeol is 1 row of 18 */}
                                                {renderSeatBlock('다', 1, 1, 18, '#9370db', '#e6e6fa')}
                                            </div>
                                        </div>

                                        <SectionContainer>
                                            {/* Na-yeol (Left) - Cyan */}
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ color: '#40e0d0', fontWeight: 'bold', marginBottom: '10px' }}>나열</span>
                                                <SideSection>
                                                    {/* Na-yeol is 6 rows of 8. Reverse row numbering (Right to Left increasing) */}
                                                    {renderSeatBlock('나', 1, 6, 8, '#40e0d0', '#e0ffff', true)}
                                                </SideSection>
                                            </div>

                                            {/* Ga-yeol (Right) - Orange */}
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ color: '#ff7f50', fontWeight: 'bold', marginBottom: '10px' }}>가열</span>
                                                <SideSection>
                                                    {renderSeatBlock('가', 1, 6, 8, '#ff7f50', '#ffe4e1')}
                                                </SideSection>
                                            </div>
                                        </SectionContainer>

                                        <Stage>STAGE</Stage>
                                    </SeatMapWrapper>
                                </SeatMapContainer>

                                <div style={{ display: 'flex', marginTop: '2rem' }}>
                                    <Button type="button" onClick={() => setStep(1)}>이전</Button>
                                    <Button type="button" primary onClick={handleConfirm} disabled={isLoading}>
                                        {isLoading ? '처리중...' : '예매 완료'}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </RightPanel>
            </ContentBox>

            {/* Check Reservation Modal */}
            <AnimatePresence>
                {showCheckModal && (
                    <ModalOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCheckModal(false)}
                    >
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <CloseButton onClick={() => setShowCheckModal(false)}>&times;</CloseButton>
                            <StepTitle><span>Check</span>예약 확인</StepTitle>

                            {!myReservations ? (
                                <>
                                    <FormGroup>
                                        <Label>이름</Label>
                                        <Input
                                            type="text"
                                            placeholder="예약자 이름"
                                            value={checkData.name}
                                            onChange={(e) => setCheckData({ ...checkData, name: e.target.value })}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>연락처</Label>
                                        <Input
                                            type="tel"
                                            placeholder="예약자 연락처"
                                            value={checkData.phone}
                                            onChange={(e) => setCheckData({ ...checkData, phone: e.target.value })}
                                        />
                                    </FormGroup>
                                    <Button primary onClick={handleCheckReservation} style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
                                        {isLoading ? '조회중...' : '조회하기'}
                                    </Button>
                                </>
                            ) : (
                                <div style={{ marginTop: '1rem' }}>
                                    {myReservations.length > 0 ? (
                                        <>
                                            <p style={{ marginBottom: '1rem', color: 'green', fontWeight: 'bold' }}>예약 내역이 있습니다.</p>
                                            {myReservations.map((res, idx) => (
                                                <div key={idx} style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                                                    <p><strong>이름:</strong> {res.name}</p>
                                                    <p><strong>인원:</strong> {res.count}명</p>
                                                    <p><strong>좌석:</strong> {res.seats}</p>
                                                    <p><strong>날짜:</strong> {new Date(res.date).toLocaleDateString()}</p>
                                                </div>
                                            ))}
                                            <Button onClick={handleCancelReservation} style={{ width: '100%', background: '#ff6b6b', color: 'white' }} disabled={isLoading}>
                                                {isLoading ? '취소중...' : '예약 취소'}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <p style={{ marginBottom: '1rem', color: 'red' }}>예약 내역이 없습니다.</p>
                                            <Button onClick={() => setMyReservations(null)} style={{ width: '100%' }}>다시 조회</Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </ModalContent>
                    </ModalOverlay>
                )}
            </AnimatePresence>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <ModalOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSuccessModal(false)}
                    >
                        <ModalContent onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                            <CloseButton onClick={() => setShowSuccessModal(false)}>&times;</CloseButton>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                            <StepTitle style={{ justifyContent: 'center' }}>예매 완료!</StepTitle>
                            <p style={{ marginBottom: '2rem', color: '#666' }}>
                                공연 예매가 성공적으로 완료되었습니다.<br />
                                예약 확인 메뉴에서 내역을 확인하실 수 있습니다.
                            </p>
                            <Button primary onClick={() => setShowSuccessModal(false)} style={{ width: '100%', margin: 0 }}>확인</Button>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </AnimatePresence>
        </ReservationContainer>
    );
};

export default Reservation;
