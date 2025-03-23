const svg_map = d3.select("#map");
const g = d3.select("#map-content");

// SVG map dimensions
const mapWidth = 10535;
const mapHeight = 8575;

// viewBox dimensions
const viewBoxWidth = 4096;
const viewBoxHeight = 4096;

// Compute scaling to fit within the viewBox
const scale = Math.min(viewBoxWidth / mapWidth, viewBoxHeight / mapHeight);

// Compute translation to center the map
const translateX = (viewBoxWidth - mapWidth * scale) / 2;
const translateY = (viewBoxHeight - mapHeight * scale) / 2;

// zoom listener
const zoom = d3.zoom()
    .scaleExtent([0.4, 6]) // Minimum and maximum zoom levels
    .on("zoom", (event) => {
        g.attr("transform", event.transform);
    });

// Set initial zoom and transform
svg_map.call(
    zoom.transform,
    d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(scale)
);

// Set zoom listener
svg_map.call(zoom);