let shops = [];

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            document.getElementById('location').value = position.coords.latitude + ',' + position.coords.longitude;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

document.getElementById('shopForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const shop = {
        code: document.getElementById('shopCodePrefix').value + document.getElementById('shopCodeNumber').value,
        name: document.getElementById('name').value,
        keeper: document.getElementById('keeper').value,
        mobile: document.getElementById('mobile').value,
        sample: document.getElementById('sample').value,
        address: document.getElementById('address').value,
        photo: document.getElementById('photo').files[0],
        location: document.getElementById('location').value
    };
    
    shops.push(shop);
    updateShopList();
    sendToTelegram(shop);
    clearForm();
});

function updateShopList() {
    const shopListDiv = document.getElementById('shopsList');
    shopListDiv.innerHTML = '';
    shops.forEach((shop, index) => {
        const shopDiv = document.createElement('div');
        shopDiv.className = 'shop-entry';
        shopDiv.innerHTML = `
            <div>
                <strong>${shop.code} - ${shop.name}</strong><br>
                ${shop.keeper} - ${shop.mobile}<br>
                Sample: ${shop.sample} <br>
                Address: ${shop.address}
            </div>
        `;
        shopListDiv.appendChild(shopDiv);
    });
}

function sendToTelegram(shop) {
    const botToken = "6251472196:AAG3YQQy4jjBHHyk234EkLm894f81U1AEio"; // Your bot token
    const chatId = "@kudukkadairy"; // Your channel ID

    const googleMapsLink = `https://www.google.com/maps?q=${shop.location}`;

    const message = `New Shop Added:
Code: ${shop.code}
Name: ${shop.name}
Keeper: ${shop.keeper}
Mobile: ${shop.mobile}
Sample: ${shop.sample}
Address: ${shop.address}
Location: ${googleMapsLink}`;

    const textUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(textUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Message sent successfully:", data);
        })
        .catch(error => {
            console.error("Error sending message:", error);
        });

    // Send the photo
    if (shop.photo) {
        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("photo", shop.photo);

        const photoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

        fetch(photoUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Photo sent successfully:", data);
        })
        .catch(error => {
            console.error("Error sending photo:", error);
        });
    }
}

function exportToExcel() {
    const data = shops.map(shop => ({
        "Shop Code": shop.code,
        "Shop Name": shop.name,
        "Shop Keeper": shop.keeper,
        "Mobile Number": shop.mobile,
        "Sample Provided": shop.sample,
        "Shop Address": shop.address,
        "Location": shop.location
    }));

    const ws = XLSX.utils.json_to_sheet(data, { header: ["Shop Code", "Shop Name", "Shop Keeper", "Mobile Number", "Sample Provided", "Shop Address", "Location"] });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shops");

    XLSX.writeFile(wb, "shops.xlsx");
}

function clearForm() {
    document.getElementById('shopForm').reset();
}
