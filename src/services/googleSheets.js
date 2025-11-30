const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxf6JTwUR5c8EA5V1Oi3LyRT53UgnP6yduzPe6p-lQZafTw7kh1F0-TfJpi5tlDRMW1/exec';

export const fetchReservedSeats = async (date) => {
    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?t=${Date.now()}&date=${date || '2026.01.16'}`);
        const data = await response.json();
        // The new doGet returns an array of seats directly, or an empty array on error
        if (Array.isArray(data)) {
            return data;
        } else if (data.status === 'success' && data.reservedSeats) {
            // Fallback for old structure if any
            return data.reservedSeats;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Network error fetching seats:', error);
        return [];
    }
};

export const saveReservation = async (reservationData) => {
    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...reservationData, action: 'reserve' }),
        });
        return { status: 'success' };
    } catch (error) {
        console.error('Error saving reservation:', error);
        return { status: 'error', message: error.toString() };
    }
};

export const checkReservation = async (name, phone) => {
    try {
        // Use GET for checking to avoid CORS issues with reading response
        const queryParams = new URLSearchParams({
            action: 'check',
            name: name,
            phone: phone,
            t: Date.now() // Cache busting
        });

        const response = await fetch(`${GAS_WEB_APP_URL}?${queryParams.toString()}`, {
            method: 'GET',
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking reservation:', error);
        return { status: 'error', message: error.toString() };
    }
};

export const cancelReservation = async (name, phone) => {
    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // We don't strictly need response body for cancel if we assume success
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'cancel', name, phone }),
        });
        return { status: 'success' };
    } catch (error) {
        console.error('Error canceling reservation:', error);
        return { status: 'error', message: error.toString() };
    }
};
