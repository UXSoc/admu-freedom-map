document.addEventListener('DOMContentLoaded', function() {
    // Select elements
    const svg = d3.select('#map');
    const mapGroup = d3.select('#map-content'); // Contains your map image
    const pinContainer = d3.select('#pin-container');
    const popupForm = document.getElementById('popup-form');
    const pinMessage = document.getElementById('pin-message');
    const submitPin = document.getElementById('submit-pin');
    const pinWidth = 200;
    const pinHeight = 400;
    // Create a parent group for both map and pins
    const zoomGroup = svg.append('g');
    // Move existing groups into the zoom group
    zoomGroup.append(() => mapGroup.node());
    zoomGroup.append(() => pinContainer.node());

    // Set up zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.7, 6])
        .on('zoom', (event) => {
            // Apply transform to the parent group containing both map and pins
            zoomGroup.attr('transform', event.transform);
        });

    // Apply zoom to SVG
    svg.call(zoom)
        .on('dblclick.zoom', null);

    
    // Display all pins
    fetch('/api/posts')
    .then((response) => response.json())
    .then((data) => {
        data.forEach((item) => {
            if (item.isPosted) {
                // Add the pin to the map
                createPin(item.x, item.y);
            }
        });
    })
    .catch((error) => console.error('Error fetching pins:', error));

    
    let pinX = null, pinY = null;

    // Add pin on click
    svg.on('click', function(event) {
        // Get click position relative to the zoomGroup (untransformed coords)
        const [x, y] = d3.pointer(event, zoomGroup.node());
        pinX = x - pinWidth/2;
        pinY = y - pinHeight;
        
        popupForm.style.display = 'block';
        
        createPin(pinX, pinY);

        // Display coordinates
        const transform = d3.zoomTransform(svg.node());
        console.log(`Pin placed at original: (${x}, ${y})`);
        console.log(`Current view: (${transform.applyX(x)}, ${transform.applyY(y)})`);
    });

    submitPin.addEventListener('click', () => {
        const message = pinMessage.value.trim();
        if (!message || !(pinX) || !(pinY)) return;
    
        
        createPin(pinX, pinY);
        
        // Save the pin data to the database
        fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                x: pinX,
                y: pinY,
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

    function createPin(x, y) {
        return pinContainer.append('image')
            .attr('href', 'assets/pin-default.svg')
            .attr('x', x)
            .attr('y', y)
            .attr('width', 200)
            .attr('height', 400);
    }
});