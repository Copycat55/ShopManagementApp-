// Telegram bot details
const botToken = '6251472196:AAG3YQQy4jjBHHyk234EkLm894f81U1AEio';
const chatId = '@kudukkadairy';

// Handle form submission
document.getElementById('shopForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const shopCode = document.getElementById('shopCode').value;
    const shopName = document.getElementById('shopName').value;
    const sample = document.getElementById('sample').value;
    const visitDate = document.getElementById('visitDate').value;
    const location = document.getElementById('location').value;
    const shopKeeperName = document.getElementById('shopKeeperName').value;
    const mobileNumber = document.getElementById('mobileNumber').value;

    // Construct Telegram message
    const message = `Shop Code: ${shopCode}\nShop Name: ${shopName}\nSample: ${sample}\nVisit Date: ${visitDate}\nLocation: ${location}\nShopkeeper: ${shopKeeperName}\nMobile: ${mobileNumber}`;

    // Send message to Telegram
    sendMessageToTelegram(message);

    // Clear the form after submission
    document.getElementById('shopForm').reset();
});

// Function to send message to Telegram
function sendMessageToTelegram(message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => console.log('Message sent successfully:', data))
        .catch(error => console.error('Error sending message:', error));
}

// Get current location
document.getElementById('getLocationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('location').value = `https://www.google.com/maps?q=${lat},${lon}`;
        }, function() {
            alert('Unable to retrieve your location. Please allow location access.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

// Add shop to list (for display purpose)
document.getElementById('addShopBtn').addEventListener('click', function() {
    const shopName = document.getElementById('shopName').value;
    const shopItem = document.createElement('div');
    shopItem.className = 'shop-item';
    shopItem.innerHTML = `<p>${shopName}</p>`;
    document.getElementById('shopList').appendChild(shopItem);
});
