// Elements
const vehicleInput = document.getElementById('vehicleNumber');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

// Emoji mapping for different fields
const fieldEmojis = {
    'Vehicle Number': '🔢',
    'Brand': '🏢',
    'Model': '🚙',
    'Owner': '👤',
    'Role': '🛡️',
    'Insurance By': '🏦',
    'Insurance Expiry': '📅',
    'Days Left': '⏳',
    'Owner Number': '👥',
    'Commercial': '🏗️',
    'Registration Date': '🗓️',
    'Vehicle Age': '🎂',
    'Insurance Eligible': '🛡️',
    'Pincode': '📍',
    'Vehicle Type': '🚘'
};

// Field mapping from API response to display labels
const fieldMapping = {
    'VEHICLE_NUM': 'Vehicle Number',
    'BRAND': 'Brand',
    'VEHICLE_MODEL': 'Model',
    'NAME': 'Owner',
    'ROLE': 'Role',
    'INSURANCE_BY': 'Insurance By',
    'insurance_Expiry_Date': 'Insurance Expiry',
    'DAYS_LEFT': 'Days Left',
    'OWNER_NUM': 'Owner Number',
    'isCommercial': 'Commercial',
    'REG_DATE': 'Registration Date',
    'AGE': 'Vehicle Age',
    'INSURANCE_ELIGIBLE': 'Insurance Eligible',
    'PINCODE': 'Pincode',
    'VEHICLE_TYPE': 'Vehicle Type'
};

async function searchVehicle() {
    const vehicleNumber = vehicleInput.value.trim();
    
    if (!vehicleNumber) {
        showError('Please enter a vehicle number');
        return;
    }

    showLoading();
    hideError();
    hideResult();

    try {
        const encodedNumber = encodeURIComponent(vehicleNumber);
        // The API endpoint will be at /api/vehicle-info in both development and production
        const response = await fetch(`/api/vehicle-info?number=${encodedNumber}`);
        const data = await response.json();

        if (data.status === 'success') {
            displayResult(data);
        } else {
            showError('Failed to fetch vehicle information. Please try again.');
        }
    } catch (error) {
        showError('An error occurred while fetching the data. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayResult(data) {
    const vehicleData = data.data;
    let html = '<div class="result-content">';

    // Display main fields first
    Object.entries(fieldMapping).forEach(([apiKey, displayLabel]) => {
        if (vehicleData[apiKey]) {
            const emoji = fieldEmojis[displayLabel] || '📌';
            html += createResultItem(emoji, displayLabel, vehicleData[apiKey]);
        }
    });

    // Add vehicle image if available
    if (data.image) {
        html += `
            <div class="result-item">
                <div class="result-label">🖼️ Vehicle Image</div>
                <div class="result-value">
                    <a href="${data.image}" target="_blank">View Image</a>
                </div>
            </div>`;
    }

    html += '</div>';
    resultDiv.innerHTML = html;
    showResult();
}

function createResultItem(emoji, label, value) {
    return `
        <div class="result-item">
            <div class="result-label">${emoji} ${label}</div>
            <div class="result-value">${value}</div>
        </div>`;
}

function showLoading() {
    loadingDiv.classList.remove('hidden');
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}

function showResult() {
    resultDiv.classList.remove('hidden');
}

function hideResult() {
    resultDiv.classList.add('hidden');
}

// Add event listener for Enter key
vehicleInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchVehicle();
    }
});
