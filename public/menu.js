const burgerButton = document.getElementById('burger-button');
const menuSvg = document.getElementById('menu-about');
const overlay = document.getElementById('overlay');

function handleMenuButtonClick(targetSvg) {
    menuSvg.data = `assets/menu/${targetSvg}.svg`;
}

function attachMenuButtonListeners() {
    const svgDoc = menuSvg.contentDocument;

    if (!svgDoc) {
        console.error("SVG document not loaded yet.");
        return;
    }

    const aboutButton = svgDoc.querySelector('#about-button');
    const faqButton = svgDoc.querySelector('#faq-button');
    const modButton = svgDoc.querySelector('#mod-button');
    const backButton = svgDoc.querySelector('#back-button')

    if (aboutButton) {
        aboutButton.style.cursor = 'pointer';
        aboutButton.addEventListener('click', () => handleMenuButtonClick('menu-about'));
    }
    if (faqButton) {
        faqButton.style.cursor = 'pointer';
        faqButton.addEventListener('click', () => handleMenuButtonClick('menu-faq'));
    }
    if (modButton) {
        modButton.style.cursor = 'pointer';
        modButton.addEventListener('click', () => handleMenuButtonClick('menu-mod'));
    }
    if (backButton) {
        backButton.style.cursor = 'pointer';
        backButton.addEventListener('click', () => {
            menuSvg.style.display = 'none';
            overlay.style.display = 'none';
        });
    }
}

menuSvg.addEventListener('load', attachMenuButtonListeners);

burgerButton.addEventListener('click', () => {
    const isMenuVisible = menuSvg.style.display === 'block';
    menuSvg.style.display = isMenuVisible ? 'none' : 'block';
    overlay.style.display = isMenuVisible ? 'none' : 'block';

    if (!isMenuVisible && menuSvg.contentDocument) {
        attachMenuButtonListeners();
    }
});

overlay.addEventListener('click', () => {
    menuSvg.style.display = 'none';
    overlay.style.display = 'none';
});

if (menuSvg.contentDocument) {
    attachMenuButtonListeners();
}