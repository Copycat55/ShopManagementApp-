// IndexedDB initialization
let db;
let request = indexedDB.open("shopDB", 1);
request.onupgradeneeded = function(event) {
  db = event.target.result;
  let shopStore = db.createObjectStore("shops", { keyPath: "shopCode" });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayShops();
};

// Add shop
document.getElementById("shop-form").addEventListener("submit", function(e) {
  e.preventDefault();
  let shopName = document.getElementById("shop-name").value;
  let shopCode = document.getElementById("shop-code").value;
  let shopKeeper = document.getElementById("shop-keeper").value;
  let phone = document.getElementById("phone").value;
  let sample = document.getElementById("sample").value;
  let location = document.getElementById("location").value;
  let photo = document.getElementById("photo").files[0];

  let shop = { shopName, shopCode, shopKeeper, phone, sample, location, photo };
  let tx = db.transaction("shops", "readwrite");
  let store = tx.objectStore("shops");
  store.add(shop);

  tx.oncomplete = function() {
    displayShops();
    sendToTelegram(shop);
  };
});

// Display shops
function displayShops() {
  let tx = db.transaction("shops", "readonly");
  let store = tx.objectStore("shops");
  let request = store.getAll();
  
  request.onsuccess = function() {
    let shopsList = document.getElementById("shops-list");
    shopsList.innerHTML = "";
    request.result.forEach(shop => {
      let li = document.createElement("li");
      li.innerHTML = `
        <strong>${shop.shopName}</strong> (${shop.shopCode}) - ${shop.shopKeeper}
        <button onclick="editShop('${shop.shopCode}')">Edit</button>
        <button onclick="deleteShop('${shop.shopCode}')">Delete</button>
      `;
      shopsList.appendChild(li);
    });
  };
}

// Edit shop
function editShop(shopCode) {
  // Logic to edit the shop
}

// Delete shop
function deleteShop(shopCode) {
  let tx = db.transaction("shops", "readwrite");
  let store = tx.objectStore("shops");
  store.delete(shopCode);
  
  tx.oncomplete = function() {
    displayShops();
  };
}

// Send to Telegram
function sendToTelegram(shop) {
  let formData = new FormData();
  formData.append('chat_id', '-2411359406'); // Use your channel ID
  formData.append('caption', `
    #bot New Shop Added
    Name: ${shop.shopName}
    Code: ${shop.shopCode}
    Location: ${shop.location}
  `);
  formData.append('photo', shop.photo);

  fetch(`https://api.telegram.org/bot6251472196:AAG3YQQy4jjBHHyk234EkLm894f81U1AEio/sendPhoto`, {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (!data.ok) {
      console.error('Error:', data.description);
      alert('Failed to send shop details to Telegram');
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

// Excel Export
document.getElementById("export-excel").addEventListener("click", function() {
  // Export logic here
});

// Geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Set the latitude and longitude in your fields
  document.getElementById("latitude").value = lat;
  document.getElementById("longitude").value = lon;

  // Optional: You can create a link to Google Maps
  const locationLink = `https://www.google.com/maps/@${lat},${lon},15z`;
  document.getElementById("locationLink").innerHTML = `<a href="${locationLink}" target="_blank">View Location on Map</a>`;
}

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
