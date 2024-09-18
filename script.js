let shops = [];

// Add shop function
document.getElementById('shopForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const prefix = document.getElementById('prefix').value;
    const shopNumber = document.getElementById('shopNumber').value;
    const shopName = document.getElementById('shopName').value;
    const shopKeeperName = document.getElementById('shopKeeperName').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const hasSample = document.getElementById('hasSample').value;
    const address = document.getElementById('address').value;
    const location = document.getElementById('location').value;
    const photo = document.getElementById('photo').files[0];

    if (!photo) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const newShop = {
            code: `${prefix}${shopNumber}`,
            name: shopName,
            keeper: shopKeeperName,
            mobile: mobileNumber,
            sample: hasSample,
            address: address,
            location: location,
            photo: e.target.result,
        };

        shops.push(newShop);
        displayShops();
        sendToTelegram(newShop);
    };

    reader.readAsDataURL(photo);
});

// Display shops
function displayShops() {
    const shopList = document.getElementById('shopList');
    shopList.innerHTML = '';
    shops.forEach(shop => {
        const div = document.createElement('div');
        div.classList.add('shop-item');
        div.innerHTML = `
            <h4>${shop.code} - ${shop.name}</h4>
            <p>Keeper: ${shop.keeper}</p>
            <p>Mobile: ${shop.mobile}</p>
            <p>Sample: ${shop.sample}</p>
            <p>Address: ${shop.address}</p>
            <p>Location: ${shop.location}</p>
            <img src="${shop.photo}" alt="Shop Photo" style="width: 100px; height: auto;">
        `;
        shopList.appendChild(div);
    });
}

// Send shop details to Telegram
function sendToTelegram(shop) {
    const botToken = "YOUR_BOT_TOKEN"; // Replace with your bot token
    const chatId = "YOUR_CHANNEL_ID"; // Replace with your channel ID
    const message = `New Shop Added:\nCode: ${shop.code}\nName: ${shop.name}\nKeeper: ${shop.keeper}\nMobile: ${shop.mobile}\nSample: ${shop.sample}\nAddress: ${shop.address}\nLocation: ${shop.location}`;
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Message sent successfully:", data);
        })
        .catch(error => {
            console.error("Error sending message:", error);
        });
}

// Export to Excel
function exportToExcel() {
    const data = shops.map(shop => ({
        ShopCode: shop.code,
        ShopName: shop.name,
        ShopKeeper: shop.keeper,
        MobileNumber: shop.mobile,
        Sample: shop.sample,
        Address: shop.address,
        Location: shop.location,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shops");
    
    XLSX.writeFile(wb, "shops.xlsx");
}
