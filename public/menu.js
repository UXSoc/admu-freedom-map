const burgerButton = document.getElementById('burger-button');
const menuSvgObject = document.getElementById('menu-about');
const overlay = document.getElementById('overlay');

const mobileBreakpoint = 480;

function getMenuSVGPath(baseName) {
    if (window.innerWidth <= mobileBreakpoint) {
        return `assets/menu/mobile/${baseName}-mobile.svg`;
    } else {
        return `assets/menu/web/${baseName}-web.svg`;
    }
}

function handleMenuButtonClick(target) {
    loadMenuSVG(target);
}

function loadMenuSVG(baseName) {
    menuSvgObject.data = getMenuSVGPath(baseName);
}

function attachMenuButtonListeners() {
    const svgDoc = menuSvgObject.contentDocument;

    if (!svgDoc) {
        console.error("SVG document not loaded yet.");
        return;
    }

    const aboutButton = svgDoc.querySelector('#about-button');
    const faqButton = svgDoc.querySelector('#faq-button');
    const modButton = svgDoc.querySelector('#mod-button');
    const backButton = svgDoc.querySelector('#back-button');

    const buttons = [aboutButton, faqButton, modButton, backButton];
    buttons.forEach(button => {
        if (button) {
            button.style.cursor = 'pointer';
            button.addEventListener('click', () => {
                const id = button.id;
                if (id === 'about-button') {
                    loadMenuSVG('menu-about');
                } else if (id === 'faq-button') {
                    loadMenuSVG('menu-faq');
                } else if (id === 'mod-button') {
                    loadMenuSVG('menu-mod');
                } else if (id === 'back-button') {
                    hideMenu();
                }
            });
        }
    });
}

function hideMenu() {
    menuSvgObject.style.display = 'none';
    overlay.style.display = 'none';
}

menuSvgObject.addEventListener('load', attachMenuButtonListeners);

burgerButton.addEventListener('click', () => {
    const isMenuVisible = menuSvgObject.style.display === 'block';
    menuSvgObject.style.display = isMenuVisible ? 'none' : 'block';
    overlay.style.display = isMenuVisible ? 'none' : 'block';

    if (!isMenuVisible) {
        loadMenuSVG('menu-about');
    } else if (menuSvgObject.contentDocument) {
        attachMenuButtonListeners();
    }
});

overlay.addEventListener('click', hideMenu);

loadMenuSVG('menu-about');