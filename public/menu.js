document.addEventListener('DOMContentLoaded', () => {
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