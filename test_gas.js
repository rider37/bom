const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxf6JTwUR5c8EA5V1Oi3LyRT53UgnP6yduzPe6p-lQZafTw7kh1F0-TfJpi5tlDRMW1/exec';

async function test() {
    try {
        console.log('Fetching from:', GAS_WEB_APP_URL);
        const response = await fetch(GAS_WEB_APP_URL);
        const text = await response.text();
        console.log('Response status:', response.status);
        console.log('Response body:', text);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
