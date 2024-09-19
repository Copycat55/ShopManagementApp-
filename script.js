// Variables to store shop data
let shops = [];

// Function to load shops from local storage
function loadShops() {
    const storedShops = localStorage.getItem('shops');
    if (storedShops) {
        shops = JSON.parse(storedShops);
    }
    displayShops();
}

// Function to display shops
function displayShops() {
    const shopList = document.getElementById('shop-list');
    shopList.innerHTML = '';
    shops.forEach((shop, index) => {
        const shopItem = document.createElement('div');
        shopItem.classList.add('shop-item');
        shopItem.innerHTML = `
            <h3>${shop.code} - ${shop.name}</h3>
            <p>Keeper: ${shop.shopkeeper} | Mobile: ${shop.mobile}</p>
            <p>Address: ${shop.address}</p>
            <p>Location: <a href="${shop.location}" target="_blank">View Location</a></p>
            <p><img src="${shop.photo}" alt="Shop Photo" class="shop-photo"></p>
            <button onclick="editShop(${index})">Edit</button>
            <button onclick="deleteShop(${index})">Delete</button>
        `;
        shopList.appendChild(shopItem);
    });
}

// Function to add a shop
function addShop(event) {
    event.preventDefault();
    const name = document.getElementById('shop-name').value;
    const shopkeeper = document.getElementById('shopkeeper-name').value;
    const mobile = document.getElementById('mobile-number').value;
    const sample = document.querySelector('input[name="sample"]:checked').value;
    const address = document.getElementById('address').value;
    const location = document.getElementById('location').value;
    const photoInput = document.getElementById('shop-photo');
    const photo = photoInput.files.length > 0 ? URL.createObjectURL(photoInput.files[0]) : '';

    const shopCode = document.getElementById('shop-code').value;
    
    const newShop = { code: shopCode, name, shopkeeper, mobile, sample, address, location, photo };
    shops.push(newShop);
    localStorage.setItem('shops', JSON.stringify(shops));
    
    // Send data to Telegram
    sendToTelegram(newShop);

    // Reset form
    document.getElementById('shop-form').reset();
    loadShops();
}

// Function to edit a shop
function editShop(index) {
    const shop = shops[index];
    document.getElementById('shop-name').value = shop.name;
    document.getElementById('shopkeeper-name').value = shop.shopkeeper;
    document.getElementById('mobile-number').value = shop.mobile;
    document.querySelector(`input[name="sample"][value="${shop.sample}"]`).checked = true;
    document.getElementById('address').value = shop.address;
    document.getElementById('location').value = shop.location;
    document.getElementById('shop-photo').value = ''; // Clear photo input
    document.getElementById('shop-code').value = shop.code; // Pre-fill shop code for editing
    deleteShop(index); // Remove shop from list to avoid duplicates
}

// Function to delete a shop
function deleteShop(index) {
    shops.splice(index, 1);
    localStorage.setItem('shops', JSON.stringify(shops));
    loadShops();
}

// Function to send shop details to Telegram
function sendToTelegram(shop) {
    const botId = '6251472196:AAG3YQQy4jjBHHyk234EkLm894f81U1AEio';
    const chatId = '-2411359406';
    const message = `New Shop Added:\nCode: ${shop.code}\nName: ${shop.name}\nKeeper: ${shop.shopkeeper}\nMobile: ${shop.mobile}\nAddress: ${shop.address}\nLocation: ${shop.location}`;
    const photoUrl = shop.photo ? shop.photo : '';
    const telegramApiUrl = `https://api.telegram.org/bot${botId}/sendPhoto?chat_id=${chatId}&photo=${photoUrl}&caption=${encodeURIComponent(message)}`;

    fetch(telegramApiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.ok) {
                console.error('Error sending message to Telegram:', data.description);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Function to export shops to Excel
function exportToExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(shops);
    XLSX.utils.book_append_sheet(wb, ws, 'Shops');
    XLSX.writeFile(wb, 'shops.xlsx');
}

// Function to import shops from Excel
function importFromExcel(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
        
        // Update shops with imported data
        shops = shops.concat(jsonData);
        localStorage.setItem('shops', JSON.stringify(shops));
        loadShops();
    };
    reader.readAsArrayBuffer(file);
}

// Event listener for loading shops
document.addEventListener('DOMContentLoaded', loadShops);
document.getElementById('shop-form').addEventListener('submit', addShop);
document.getElementById('import-file').addEventListener('change', importFromExcel);

// Event listener for getting location automatically
document.getElementById('get-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locationLink = `https://www.google.com/maps?q=${lat},${lon}`;
            document.getElementById('location').value = locationLink; // Set location link in input
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});
