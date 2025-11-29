document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.page-section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            
            // Update Menu Active State
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update Section Active State
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Reservation Logic
    const infoForm = document.getElementById('info-form');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const backBtn = document.getElementById('back-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    const seatsGrid = document.getElementById('seats-grid');
    const selectedSeatsDisplay = document.getElementById('selected-seats-display');

    let selectedSeats = [];

    // Initialize Seats
    function initSeats() {
        seatsGrid.innerHTML = '';
        for (let i = 0; i < 48; i++) { // 6 rows * 8 cols
            const seat = document.createElement('div');
            seat.classList.add('seat');
            
            // Randomly occupy some seats for demo
            if (Math.random() < 0.2) {
                seat.classList.add('occupied');
            }

            seat.addEventListener('click', () => {
                if (seat.classList.contains('occupied')) return;

                seat.classList.toggle('selected');
                const seatIndex = i + 1;
                
                if (seat.classList.contains('selected')) {
                    selectedSeats.push(seatIndex);
                } else {
                    selectedSeats = selectedSeats.filter(s => s !== seatIndex);
                }
                updateSelectedSeats();
            });
            seatsGrid.appendChild(seat);
        }
    }

    function updateSelectedSeats() {
        if (selectedSeats.length === 0) {
            selectedSeatsDisplay.textContent = '없음';
        } else {
            selectedSeatsDisplay.textContent = selectedSeats.sort((a,b) => a-b).join(', ') + '번';
        }
    }

    // Form Submit (Step 1 -> Step 2)
    infoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        if (name && phone) {
            step1.classList.remove('active');
            step2.classList.add('active');
            initSeats();
        }
    });

    // Back Button (Step 2 -> Step 1)
    backBtn.addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
        selectedSeats = [];
        updateSelectedSeats();
    });

    // Confirm Button
    confirmBtn.addEventListener('click', () => {
        if (selectedSeats.length === 0) {
            alert('좌석을 선택해주세요.');
            return;
        }
        alert('예매가 완료되었습니다!\n선택하신 좌석: ' + selectedSeats.join(', ') + '번');
        // Reset
        location.reload();
    });
});
