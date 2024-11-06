import { pannerInit } from "./panner.js"

var target = document.getElementById('ateneo_map')
pannerInit(target, {
    onDrag: function() {},
    onDragStart: function() {},
    onDragEnd: function() {},
    onClick: (x, y, clientX, clientY) => {
        var pin = document.createElement("img");
        pin.src = "./pannerjs/images/pin.png"
        pin.style = `position: absolute; translate: ${clientX}px ${clientY}px`
        pin.interfacePos = [x,y]
        pin.className = 'map-pin'
        target.querySelector(".panner_interface").append(pin)
    },
    zoom: {
        value: 2,
        allow: true,
        min: 1,
        max: 20,
        step: 0.5,
        center: null
    },
    pos: "center"
})