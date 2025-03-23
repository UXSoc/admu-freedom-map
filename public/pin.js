const map = document.getElementById('map');
const mapContent = document.getElementById('map-content');
const popupForm = document.getElementById('popup-form');
const pinMessage = document.getElementById('pin-message');
const submitPin = document.getElementById('submit-pin');

let pinCoordinates = null;

// Function to get the current transformation matrix of the map
function getTransformMatrix() {
    const transform = mapContent.getAttribute('transform');
    if (!transform) {
        return { scale: 1, translateX: 0, translateY: 0 };
    }

    const match = transform.match(/translate\(([^,]+),([^)]+)\)\s*scale\(([^)]+)\)/);
    if (match) {
        return {
            translateX: parseFloat(match[1]),
            translateY: parseFloat(match[2]),
            scale: parseFloat(match[3]),
        };
    }

    return { scale: 1, translateX: 0, translateY: 0 };
}

/// Show the pop-up form on map click
map.addEventListener('click', (event) => {
    const rect = map.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Adjust coordinates based on the map's transformation
    const { scale, translateX, translateY } = getTransformMatrix();
    const adjustedX = (x - translateX) / scale;
    const adjustedY = (y - translateY) / scale;

    pinCoordinates = { x: adjustedX, y: adjustedY };
    popupForm.style.display = 'block';
});

// Display all pins
fetch('/api/posts')
    .then((response) => response.json())
    .then((data) => {
        data.forEach((item) => {
            if (item.isPosted) {
                console.log("Displayed pin:", item.message, item.x, item.y, item.isPosted);
                
                // Adjust pin coordinates based on the current transform matrix
                const adjustedX = item.x * scale + translateX;
                const adjustedY = item.y * scale + translateY;

                // Add the pin to the map
                const pin = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                pin.setAttribute('href', 'assets/pin-default.svg');
                pin.setAttribute('x', adjustedX - 100); // Adjust for pin size
                pin.setAttribute('y', adjustedY - 200); // Adjust for pin size
                pin.setAttribute('width', '200');
                pin.setAttribute('height', '400');
                document.getElementById('map-content').appendChild(pin);
            }
        });
    })
    .catch((error) => console.error('Error fetching pins:', error));

// Handle pin submission
submitPin.addEventListener('click', () => {
    const message = pinMessage.value.trim();
    if (!message || !pinCoordinates) return;

    // Add the pin to the map
    const pin = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    pin.setAttribute('href', 'assets/pin-default.svg');
    pin.setAttribute('x', pinCoordinates.x - 100);
    pin.setAttribute('y', pinCoordinates.y - 200);
    pin.setAttribute('width', '200');
    pin.setAttribute('height', '400');
    document.getElementById('map-content').appendChild(pin);

    // Save the pin data to the database
    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message,
            x: pinCoordinates.x,
            y: pinCoordinates.y,
        }),
    })
        .then((response) => response.json())
        .then((data) => console.log('Pin saved:', data))
        .catch((error) => console.error('Error saving pin:', error));

    // Reset the form
    pinMessage.value = '';
    popupForm.style.display = 'none';
    pinCoordinates = null;
});

