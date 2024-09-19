document.getElementById('shopForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const shopCode = document.getElementById('shopCode').value;
    const shopName = document.getElementById('shopName').value;
    const shopkeeperName = document.getElementById('shopkeeperName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const sample = document.getElementById('sample').value;
    const location = document.getElementById('location').value;
    const photo = document.getElementById('photo').files[0];

    if (shopCode && shopName && shopkeeperName && phoneNumber && location) {
        const shopData = {
            shopCode,
            shopName,
            shopkeeperName,
            phoneNumber,
            sample,
            location,
            photo
        };

        addShopToList(shopData);
        sendShopToTelegram(shopData);

        // Reset the form
        document.getElementById('shopForm').reset();
    } else {
        alert("Please fill all fields.");
    }
});

function addShopToList(shopData) {
    const shopList = document.getElementById('shopList');
    const listItem = document.createElement('li');
    
    listItem.innerHTML = `
        ${shopData.shopCode}: ${shopData.shopName} - ${shopData.shopkeeperName}
        <button onclick="editShop('${shopData.shopCode}')">Edit</button>
    `;
    
    shopList.appendChild(listItem);
}

function sendShopToTelegram(shopData) {
    const telegramMessage = `
        #bot
        *Shop Code*: ${shopData.shopCode}
        *Shop Name*: ${shopData.shopName}
        *Shopkeeper*: ${shopData.shopkeeperName}
        *Phone*: ${shopData.phoneNumber}
        *Sample*: ${shopData.sample}
        *Location*: ${shopData.location}
    `;

    const token = '6251472196:AAG3YQQy4jjBHHyk234EkLm894f81U1AEio';
    const chatId = '-2411359406';

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('text', telegramMessage);
    formData.append('parse_mode', 'Markdown');

    if (shopData.photo) {
        formData.append('photo', shopData.photo);
        fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
          .then(result => console.log(result))
          .catch(error => console.log('Error:', error));
    } else {
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
          .then(result => console.log(result))
          .catch(error => console.log('Error:', error));
    }
}

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

function editShop(shopCode) {
    alert("Editing for " + shopCode);
}

document.getElementById('exportBtn').addEventListener('click', function() {
    // Export logic goes here
});
