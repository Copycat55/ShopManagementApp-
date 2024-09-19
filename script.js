// Get location function
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Show position
function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById('location').value = `Lat: ${lat}, Lon: ${lon}`;
}

// Show error
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Add shop to local storage
document.getElementById('shopForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const shopCode = document.getElementById('shopCode').value;
    const shopName = document.getElementById('shopName').value;
    const shopKeeperName = document.getElementById('shopKeeperName').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const sample = document.getElementById('sample').value;
    const location = document.getElementById('location').value;
    const photoInput = document.getElementById('photo');
    
    // Handle photo
    const photo = photoInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(photo);
    reader.onload = function() {
        const shops = JSON.parse(localStorage.getItem('shops')) || [];
        
        const newShop = {
            shopCode,
            shopName,
            shopKeeperName,
            mobileNumber,
            sample,
            location,
            photo: reader.result,
        };
        
        shops.push(newShop);
        localStorage.setItem('shops', JSON.stringify(shops));
        
        // Send to Telegram
        sendToTelegram(newShop);
        
        // Clear form
        document.getElementById('shopForm').reset();
        displayShops();
    };
});

// Send shop details to Telegram
function sendToTelegram(shop) {
    const botToken = '6251472196:AAG3YQQy4jjBHHyk234EkLm894f81U1AEio';
    const channelId = '-2411359406';
    const message = `
        Shop Code: ${shop.shopCode}
        Shop Name: ${shop.shopName}
        Shop Keeper: ${shop.shopKeeperName}
        Mobile Number: ${shop.mobileNumber}
        Sample: ${shop.sample}
        Location: ${shop.location}
        Photo: ${shop.photo}
        #bot
    `;
    
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: channelId,
            text: message,
        })
    }).then(response => {
        if (!response.ok) {
            console.error('Failed to send message to Telegram');
        }
    }).catch(error => console.error('Error:', error));
}

// Display shops from local storage
function displayShops() {
    const shops = JSON.parse(localStorage.getItem('shops')) || [];
    const shopList = document.getElementById('shopList');
    shopList.innerHTML = '';

    shops.forEach(shop => {
        const shopItem = document.createElement('div');
        shopItem.classList.add('shop-item');
        shopItem.innerHTML = `
            <h3>${shop.shopName}</h3>
            <p>Shop Code: ${shop.shopCode}</p>
            <p>Shop Keeper: ${shop.shopKeeperName}</p>
            <p>Mobile Number: ${shop.mobileNumber}</p>
            <p>Sample: ${shop.sample}</p>
            <p>Location: ${shop.location}</p>
            <img src="${shop.photo}" alt="Shop Photo" style="max-width: 100px;">
        `;
        shopList.appendChild(shopItem);
    });
}

// Initial call to display shops on load
displayShops();
