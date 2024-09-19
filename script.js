let leads = JSON.parse(localStorage.getItem('leads')) || [];

function displayLeads() {
    const leadList = document.getElementById('leadList');
    leadList.innerHTML = '';
    leads.forEach((lead, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${lead.shopCode || ''} ${lead.shopName || ''}</strong><br>
            ${lead.shopKeeperName || ''} | ${lead.mobileNumber || ''} | ${lead.address || ''}<br>
            <img src="${lead.shopPhoto || ''}" alt="Shop Photo" style="max-width: 100px;"><br>
            Location: <a href="https://www.google.com/maps?q=${lead.location}" target="_blank">View on Maps</a>
            <button onclick="editLead(${index})">Edit</button>
            <button onclick="deleteLead(${index})">Delete</button>
        `;
        leadList.appendChild(li);
    });
}

document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newLead = {
        shopCode: document.getElementById('shopCode').value,
        shopName: document.getElementById('shopName').value,
        shopKeeperName: document.getElementById('shopKeeperName').value,
        mobileNumber: document.getElementById('mobileNumber').value,
        address: document.getElementById('address').value,
        shopPhoto: document.getElementById('shopPhoto').value,
        location: document.getElementById('location').value
    };
    
    leads.push(newLead);
    localStorage.setItem('leads', JSON.stringify(leads));
    displayLeads();
    sendToTelegram(newLead);
    this.reset();
});

function editLead(index) {
    const lead = leads[index];
    document.getElementById('shopCode').value = lead.shopCode;
    document.getElementById('shopName').value = lead.shopName;
    document.getElementById('shopKeeperName').value = lead.shopKeeperName;
    document.getElementById('mobileNumber').value = lead.mobileNumber;
    document.getElementById('address').value = lead.address;
    document.getElementById('shopPhoto').value = lead.shopPhoto;
    document.getElementById('location').value = lead.location;
    leads.splice(index, 1);
    localStorage.setItem('leads', JSON.stringify(leads));
    displayLeads();
}

function deleteLead(index) {
    leads.splice(index, 1);
    localStorage.setItem('leads', JSON.stringify(leads));
    displayLeads();
}

document.getElementById('getLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locationString = `${lat},${lon}`;
            document.getElementById('location').value = locationString;
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function sendToTelegram(lead) {
    const message = `
        New Lead Added:
        Shop Code: ${lead.shopCode || ''}
        Shop Name: ${lead.shopName || ''}
        Shop Keeper: ${lead.shopKeeperName || ''}
        Mobile: ${lead.mobileNumber || ''}
        Address: ${lead.address || ''}
        Location: https://www.google.com/maps?q=${lead.location}
        Photo: ${lead.shopPhoto || ''}
    `;

    const botToken = "6251472196:AAG3YQQy4jjBHHyk234EkLm894f81U1AEio";
    const chatId = "-2411359406"; // Use channel ID here
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    
    fetch(url)
        .then(response => console.log('Message sent to Telegram:', response))
        .catch(error => console.error('Error sending message to Telegram:', error));
}

displayLeads();
