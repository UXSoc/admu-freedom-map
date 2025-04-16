const mapImage = document.querySelector('#map image');

fetch(mapImage.getAttribute('href'))
    .then(response => response.text())
    .then(svgContent => {
        // Replace the <image> element with the actual SVG content
        const parser = new DOMParser();
        const svgDocument = parser.parseFromString(svgContent, 'image/svg+xml').documentElement;
        const mapContent = document.getElementById('map-content');
        mapContent.replaceChild(svgDocument, mapImage);

        // Add hover effects to all shapes in the SVG
        const shapes = svgDocument.querySelectorAll('path, rect, circle, polygon'); // Add more tags if needed
        shapes.forEach(shape => {
            shape.addEventListener('mouseenter', () => {
                shape.style.filter = 'drop-shadow(0 0 10px #FFD700)'; // Glow effect
                shape.style.cursor = 'pointer';
            });
            shape.addEventListener('mouseleave', () => {
                shape.style.filter = 'none'; // Remove glow effect
            });
        });
    })
    .catch(error => console.error('Error loading SVG:', error));