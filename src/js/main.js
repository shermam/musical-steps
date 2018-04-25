//@ts-check

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let size;
let position;
let points;
let initialPosition;

function setup() {
    canvas.width = 500;
    canvas.height = 200;
    size = 10;
    position = initialPosition = canvas.height / 2;
    points = new Array(canvas.width / size);
}


function draw() {

    updatePoints();
    drawPoints();

    requestAnimationFrame(draw);
}

function updatePoints() {
    for (let i = 0; i < points.length - 1; i++) {
        points[i] = points[i + 1];
    }

    points[points.length - 1] = position;
}

function drawPoints() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.moveTo(0, canvas.height / 2)
    for (let i = 0; i < points.length; i++) {
        context.lineTo(size * i, points[i]);
    }

    context.stroke();
    context.closePath();
}

function updatePosition(e) {
    let motion = e.accelerationIncludingGravity.x;
    if (e.accelerationIncludingGravity.y > motion) {
        motion = e.accelerationIncludingGravity.y;
    }

    if (e.accelerationIncludingGravity.z > motion) {
        motion = e.accelerationIncludingGravity.z;
    }

    position = Math.round(initialPosition - motion * 5);
}

window.addEventListener('devicemotion', updatePosition);


setup();
draw();