document.getElementById('shopForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get stored shops or start with an empty array
    let shops = JSON.parse(localStorage.getItem('shops')) || [];

    // Automatically generate the next shop code (e.g., S1, S2, etc.)
    const nextShopCode = `S${shops.length + 1}`;

    const shop = {
        shopCode: nextShopCode,
        shopName: document.getElementById('shopName').value,
        shopkeeperName: document.getElementById('shopkeeperName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        sample: document.getElementById('sample').value,
        visitDate: document.getElementById('visitDate').value,
        location: document.getElementById('location').value,
        photo: document.getElementById('photo').files[0] ? URL.createObjectURL(document.getElementById('photo').files[0]) : null
    };

    // Save shop to localStorage
    shops.push(shop);
    localStorage.setItem('shops', JSON.stringify(shops));

    // Send shop details to Telegram (optional, if you have the function set up)
    sendToTelegram(shop);

    // Update UI
    showShops();

    // Reset form
    document.getElementById('shopForm').reset();
}); 

// Display shops
function showShops() {
    let shops = JSON.parse(localStorage.getItem('shops')) || [];
    const shopList = document.getElementById('shopList');
    shopList.innerHTML = '';

    shops.forEach((shop, index) => {
        const shopItem = document.createElement('div');
        shopItem.innerHTML = `
            <strong>${shop.shopName}</strong><br>
            Shopkeeper: ${shop.shopkeeperName}<br>
            Phone: ${shop.phoneNumber}<br>
            Sample: ${shop.sample}<br>
            Visit Date: ${shop.visitDate}<br>
            Location: ${shop.location}<br>
            <img src="${shop.photo}" alt="Photo" style="max-width: 100px;"/><br>
            <button onclick="editShop(${index})">Edit</button>
            <button onclick="deleteShop(${index})">Delete</button>
        `;
        shopList.appendChild(shopItem);
    });
}

// Edit shop
function editShop(index) {
    let shops = JSON.parse(localStorage.getItem('shops')) || [];
    const shop = shops[index];

    // Fill form with existing data
    document.getElementById('shopName').value = shop.shopName;
    document.getElementById('shopkeeperName').value = shop.shopkeeperName;
    document.getElementById('phoneNumber').value = shop.phoneNumber;
    document.getElementById('sample').value = shop.sample;
    document.getElementById('visitDate').value = shop.visitDate;
    document.getElementById('location').value = shop.location;

    // Remove the shop from the list for editing
    shops.splice(index, 1);
    localStorage.setItem('shops', JSON.stringify(shops));

    showShops();
}

// Delete shop
function deleteShop(index) {
    let shops = JSON.parse(localStorage.getItem('shops')) || [];
    shops.splice(index, 1);
    localStorage.setItem('shops', JSON.stringify(shops));

    showShops();
}

// Capture location automatically
document.getElementById('getLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('location').value = `Lat: ${lat}, Lon: ${lon}`;
        }, function(error) {
            alert('Error getting location: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

// Display shops on page load
showShops();

function sendToTelegram(shop) {
    const token = '6251472196:AAG3YQQy4jjBHHyk234EkLm894f81U1AEio';  // Replace with your actual Bot Token
    const chatId = '-2411359406';  // Replace with your channel or group ID
    const message = `
        Shop Name: ${shop.shopName}
        Shopkeeper: ${shop.shopkeeperName}
        Phone: ${shop.phoneNumber}
        Sample: ${shop.sample}
        Visit Date: ${shop.visitDate}
        Location: ${shop.location}
    `;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Shop details sent to Telegram.');
            } else {
                console.log('Failed to send message:', data);
            }
        })
        .catch(error => console.error('Error sending message:', error));
}

document.getElementById('exportBtn').addEventListener('click', function() {
    let shops = JSON.parse(localStorage.getItem('shops')) || [];

    if (shops.length === 0) {
        alert('No shop data available to export.');
        return;
    }

    // Define the data structure to match the format you need for billing (e.g., Get Swipe format)
    const data = shops.map(shop => ({
        'Shop Code': shop.shopCode,
        'Shop Name': shop.shopName,
        'Shopkeeper Name': shop.shopkeeperName,
        'Phone Number': shop.phoneNumber,
        'Sample': shop.sample,
        'Visit Date': shop.visitDate,
        'Location': shop.location
    }));

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Shops');

    // Export the workbook to Excel format
    XLSX.writeFile(wb, 'shop_data.xlsx');
});