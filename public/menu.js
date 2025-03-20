const burgerButton = document.getElementById('burger-button');
const menuSvg = document.getElementById('menu-svg');
const overlay = document.getElementById('overlay');

burgerButton.addEventListener('click', () => {
    const isMenuVisible = menuSvg.style.display === 'block';
    menuSvg.style.display = isMenuVisible ? 'none' : 'block';
    overlay.style.display = isMenuVisible ? 'none' : 'block';
});

// close the menu when clicking on the overlay (outside menu)
overlay.addEventListener('click', () => {
    menuSvg.style.display = 'none';
    overlay.style.display = 'none';
});