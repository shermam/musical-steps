//@ts-check

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const beep = new Audio('kick.wav');
const h1 = document.querySelector('h1');
const amplitudeTrashold = 10;

let size;
let points;
let position;
let lastPosition;
let secondToLastPosition;
let initialPosition;

let normalizedPosition;
let normalizationSamplePoll;
let normalizedPoints;
let poolSize;

let lastPeek;
let lastValey;

function setup() {
    canvas.width = 500;
    canvas.height = 200;
    size = 2;
    position = initialPosition = normalizedPosition = canvas.height / 2;
    points = new Array(canvas.width / size);
    poolSize = 4;
    normalizationSamplePoll = new Array(poolSize);
    normalizedPoints = new Array(canvas.width / size);
    lastPeek = 0;
    lastValey = 0;
}


function draw() {

    updatePoints();
    normalize();
    drawPoints();

    showAmplitude();

    requestAnimationFrame(draw);
}

function showAmplitude() {
    h1.innerHTML = `Amplitude: ${lastValey - lastPeek}`;
}

function normalize() {

    const normal = points
        .slice(-poolSize)
        .reduce((p, c, i, a) => p + (c / a.length), 0);

    for (let i = 0; i < normalizedPoints.length - 1; i++) {
        normalizedPoints[i] = normalizedPoints[i + 1];
    }

    normalizedPoints[normalizedPoints.length - 1] = normal;

    if (normalizedPosition === normal) {
        return;
    }

    secondToLastPosition = lastPosition;
    lastPosition = normalizedPosition;
    normalizedPosition = normal;

    beepIfPeek();
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
    context.strokeStyle = 'black';
    context.moveTo(0, canvas.height / 2)
    for (let i = 0; i < points.length; i++) {
        context.lineTo(size * i, points[i]);
    }

    context.stroke();
    context.closePath();

    context.beginPath();
    context.strokeStyle = 'red';
    context.moveTo(0, canvas.height / 2)
    for (let i = 0; i < normalizedPoints.length; i++) {
        context.lineTo(size * i, (normalizedPoints[i + (poolSize/2)] || points[i]) * 1);
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

    motion = Math.round(initialPosition - motion * 5);

    position = motion;
}

function simulate(e) {

    position = e.offsetY;
}

function beepIfPeek() {

    if (secondToLastPosition < lastPosition &&
        normalizedPosition < lastPosition    
    ) {
        lastValey = lastPosition;
    }

    if (secondToLastPosition > lastPosition &&
        normalizedPosition > lastPosition    
    ) {
        lastPeek = lastPosition;

        if (lastValey - lastPeek > amplitudeTrashold) {
            beep.pause();
            beep.currentTime = 0;
            beep.play();
        }
    }
}

canvas.addEventListener('click', e => beep.play())

window.addEventListener('mousemove', simulate);
window.addEventListener('devicemotion', updatePosition);


setup();
draw();