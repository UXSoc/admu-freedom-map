window.addEventListener('DOMContentLoaded', () => {
    const thumb = document.getElementById('zoom-thumb');
    const bar = document.getElementById('zoom-bar');
    const barHeight = bar.clientHeight;
    let dragging = false;

    const minZoom = 0.5;
    const maxZoom = 3;
    const zoomStep = 0.1;
  
    function setThumbPositionFromZoom(zoom) {
      const ratio = (zoom - minZoom) / (maxZoom - minZoom);
      const pos = barHeight - (ratio * barHeight) - (thumb.offsetHeight / 2);
      thumb.style.top = `${pos}px`;
    }
  
    function calculateZoomFromPosition(posY) {
      const clampedY = Math.max(0, Math.min(posY, barHeight));
      const ratio = 1 - clampedY / barHeight;
      return minZoom + ratio * (maxZoom - minZoom);
    }
  
    function updateZoomFromThumb(y) {
      const barRect = bar.getBoundingClientRect();
      const offsetY = y - barRect.top;
      const zoomValue = calculateZoomFromPosition(offsetY);
      if (panner) {
        const centerX = panner.pixel_width / 2;
        const centerY = panner.pixel_height / 2;
        zoom(panner, zoomValue, centerX, centerY);
        setThumbPositionFromZoom(zoomValue);
      }
    }
  
    thumb.addEventListener('mousedown', (e) => {
      dragging = true;
      e.preventDefault();
    });
  
    window.addEventListener('mouseup', () => {
      dragging = false;
    });
  
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      updateZoomFromThumb(e.clientY);
    });

    bar.addEventListener('click', (e) => {
      updateZoomFromThumb(e.clientY);
    });
  
    setThumbPositionFromZoom(panner?.zoom || 1);
  });
  