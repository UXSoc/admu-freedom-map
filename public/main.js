document.addEventListener('DOMContentLoaded', function() {
    // PIN LOGIC 
    
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
    let clickedPin = false; // variable to check if user is currently clicking/hovering on an existing pin
    fetch('/api/posts')
    .then((response) => response.json())
    .then((data) => {
        data.forEach((item) => {
            if (item.isPosted) {
                // Add the pin to the map
                const pin = pinContainer.append('image')
                    .attr('href', 'assets/pin-default.svg')
                    .attr('x', item.x)
                    .attr('y', item.y)
                    .attr('width', 200)
                    .attr('height', 400)
                    .attr('class', 'map-pin');
                
                // Create a speech bubble for the pin
                const speechBubble = document.createElement('div');
                speechBubble.className = 'speech-bubble';
                speechBubble.textContent = item.message;
                speechBubble.style.display = 'none';
                document.body.appendChild(speechBubble);

                // Add hover event listeners
                pin.on('mouseenter', function (event) {
                    clickedPin = true;
                    
                    // Change pin color to pink
                    d3.select(this).attr('href', 'assets/pin-highlighted.svg');

                    // Get the pin's position in the viewport
                    const pinBBox = this.getBoundingClientRect();
                    const bubbleX = pinBBox.x + pinBBox.width / 2;
                    const bubbleY = pinBBox.y - 10; // Position above the pin

                    // Position and show the speech bubble
                    speechBubble.style.left = `${bubbleX}px`;
                    speechBubble.style.top = `${bubbleY}px`;
                    speechBubble.style.display = 'block';

                    // Check if the user is on a mobile device
                    if (/Mobi|Android/i.test(navigator.userAgent)) {
                        removeTempPin(true);
                    }
                });


                pin.on('mouseleave', function () {
                    clickedPin = false;
                    // Revert pin color to default
                    d3.select(this).attr('href', 'assets/pin-default.svg');

                    // Hide the speech bubble
                    speechBubble.style.display = 'none';
                });
            }
        });
    })
    .catch((error) => console.error('Error fetching pins:', error));

    
    let pinX = null, pinY = null;

    let tempPin = null;

    // on mouse click
    mapGroup.on('click', function(event) {
        // if an existing pin is clicked/hovered, don't add pin
        if (clickedPin) { return; }

        addTempPin(event);
    });

    // on pop-up close, hide pop-up and remove temporary pin
    document.querySelectorAll('.popup .close').forEach(button => {
        button.addEventListener('click', () => {
            const popup = button.closest('.popup');
            if (popup) {
                popup.style.display = 'none';
            }
            
            removeTempPin(false);
        });
    });

    submitPin.addEventListener('click', () => {
        const message = pinMessage.value.trim();
        if (!message || !(pinX) || !(pinY)) return;
        
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
            .then((data) => {
                console.log('Pin saved:', data);

                // Show notification
                const notification = document.createElement('div');
                notification.className = 'notification';
                notification.textContent = "We've sent your message to the admins for approval!";
                document.body.appendChild(notification);

                // Fade out and remove notification
                setTimeout(() => {
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 1000);
                }, 3000);
            })
            .catch((error) => console.error('Error saving pin:', error));

        removeTempPin(true);
    });

    function addTempPin(event) {
        // Get click position relative to the zoomGroup (untransformed coords)
        const [x, y] = d3.pointer(event, zoomGroup.node());
        pinX = x - pinWidth / 2;
        pinY = y - pinHeight + pinHeight*0.07; // png of pin has free space at the bottom; add negative bottom margin to fix

        popupForm.style.display = 'block';

        if (tempPin) {
            // Update position of the existing temporary pin
            tempPin
                .attr('x', pinX)
                .attr('y', pinY);
        } else {
            // Create a new temporary pin
            tempPin = pinContainer.append('image')
                .attr('href', 'assets/pin-default.svg')
                .attr('x', pinX)
                .attr('y', pinY)
                .attr('width', 200)
                .attr('height', 400)
                .attr('opacity', "40%");
        }

        // Display coordinates
        const transform = d3.zoomTransform(svg.node());
        console.log(`Pin placed at original: (${x}, ${y})`);
        console.log(`Current view: (${transform.applyX(x)}, ${transform.applyY(y)})`);
    }

    function removeTempPin(includePopup){
        // Reset the form
        if (includePopup){
            pinMessage.value = '';
            popupForm.style.display = 'none';
            pinCoordinates = null;
        }

        if (tempPin) {
            tempPin.remove();
            tempPin = null;
        }
    }


    // MENU LOGIC
    const burgerButton = document.getElementById('burger-button');
    const overlay = document.getElementById('overlay');
    const menuContainer = document.getElementById('menu-container');
    const menuSvgObject = document.getElementById('menu-svg');

    const mobileBreakpoint = 768; // Define the breakpoint for mobile vs web
    const menuSections = ['menu-about', 'menu-faq', 'menu-mod'];

    // Fetch and render Markdown content
    function fetchMarkdown(section) {
        const markdownPath = `assets/menu/${section}.md`;

        fetch(markdownPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${markdownPath}`);
                }
                return response.text();
            })
            .then((markdown) => {
                // Use marked.parse to parse Markdown into HTML
                const htmlContent = marked.parse(markdown);
                addMenuText(htmlContent);
            })
            .catch((error) => console.error('Error fetching Markdown content:', error));
    }

    // Preload all menu SVGs
    function preloadMenus() {
        menuSections.forEach((section) => {
            const objectElement = document.createElement('object');
            objectElement.type = 'image/svg+xml';
            objectElement.data = getMenuSVGPath(section);
            objectElement.style.display = 'none';
            document.body.appendChild(objectElement);
        });
    }

    // Get the correct SVG path based on screen size
    function getMenuSVGPath(baseName) {
        if (window.innerWidth <= mobileBreakpoint) {
            return `assets/menu/mobile/${baseName}-mobile.svg`;
        } else {
            return `assets/menu/web/${baseName}-web.svg`;
        }
    }

    // Show the selected menu section
    function showMenuSection(section) {
        // Remove any existing load event listener
        menuSvgObject.removeEventListener('load', handleSvgLoad);

        // Update the SVG data
        menuSvgObject.data = getMenuSVGPath(section);
        menuContainer.style.display = 'block';
        overlay.style.display = 'block';

        // Attach the load event listener
        menuSvgObject.addEventListener('load', handleSvgLoad);

        // Fetch and render the Markdown content for the section
        fetchMarkdown(section);
    }

    // Handle the SVG load event
    function handleSvgLoad() {
        const svgDoc = menuSvgObject.contentDocument;

        if (!svgDoc) {
            console.error('SVG document not loaded yet.');
            return;
        }

        // Attach event listeners to menu buttons
        const aboutButton = svgDoc.querySelector('#about-button');
        const faqButton = svgDoc.querySelector('#faq-button');
        const modButton = svgDoc.querySelector('#mod-button');
        const closeButton = svgDoc.querySelector('#back-button');

        // Add hover effect to change cursor to pointer
        [aboutButton, faqButton, modButton, closeButton].forEach((button) => {
            if (button) {
                button.style.cursor = 'pointer'; // Change cursor to pointer on hover
            }
        });

        if (aboutButton) {
            aboutButton.addEventListener('click', () => showMenuSection('menu-about'));
        }
        if (faqButton) {
            faqButton.addEventListener('click', () => showMenuSection('menu-faq'));
        }
        if (modButton) {
            modButton.addEventListener('click', () => showMenuSection('menu-mod'));
        }
        if (closeButton) {
            closeButton.addEventListener('click', hideMenu);
            removeTempPin(true);
        }
    }

    // Add text content to the menu section
    function addMenuText(content) {
        // Remove any existing text container
        const existingTextContainer = document.querySelector('.menu-text-container');
        if (existingTextContainer) {
            existingTextContainer.remove();
        }

        // Create a new text container
        const textContainer = document.createElement('div');
        textContainer.className = 'menu-text-container';
        textContainer.innerHTML = content; // Rendered HTML from Markdown

        // Append the text container to the menu container
        menuContainer.appendChild(textContainer);
    }

    // Hide the menu
    function hideMenu() {
        menuContainer.style.display = 'none';
        overlay.style.display = 'none';
    }

    // Show the "about" menu section when the burger button is clicked
    burgerButton.addEventListener('click', () => {
        showMenuSection('menu-about');
    });

    // Hide the menu when the overlay is clicked
    overlay.addEventListener('click', hideMenu);

    // Preload all menus
    preloadMenus();

});