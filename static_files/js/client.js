// Initial canvas setup
let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

const simulationSpace = document.querySelector('.simulationSpace');

c.width = simulationSpace.clientWidth - 4;
c.height = simulationSpace.clientHeight - 4;

// Mover Model
class Mover {
    constructor(x, y, r, color, mood) {
        this.x = x;
        this.y = y;
        if(Math.random() <= .5) {this.dx = 1} else {this.dx = -1}
        if(Math.random() <= .5) {this.dy = 1} else {this.dy = -1}
        this.a = 1;
        this.r = r;
        this.color = color;
        this.mood = mood;
    }
}

// Simulation model
let simulation = {
    moverCount: 0,
    movers: []
}

// Color constants
// secondary colors
const green = new Set(["blue", "yellow"]);
const orange = new Set(["red", "yellow"]);
const purple = new Set(["blue", "red"]);

// Tertiary colors
const yellowGreen = new Set(["green", "yellow"]);
const blueGreen = new Set(["green", "blue"]);
const bluePurple = new Set(["blue", "purple"]);
const redPurple = new Set(["red", "purple"]);
const redOrange = new Set(["red", "orange"]);
const yellowOrange = new Set(["orange", "yellow"]);

// Socket.io setup
let socket = io();

socket.on('newMover', (m) => {
    let newMover = new Mover(
        getRandNum(c.width), 
        getRandNum(c.height), 
        10, 
        m.color, 
        m.mood
    ); 
    simulation.movers.push(newMover);
    simulation.moverCount++;
});

// Sub-routines
function blendColors(m1, m2) {
    // Colliding movers color set
    const moverColors = new Set([m1.color, m2.color]);

    // Set equality function
    areSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

    // Blend colors
    // Secondary blends
    if(areSetsEqual(moverColors, green)) {
        m1.color = "green";
        m2.color = "green";
    }

    if(areSetsEqual(moverColors, orange)) {
        m1.color = "orange";
        m2.color = "orange";
    }

    if(areSetsEqual(moverColors, purple)) {
        m1.color = "purple";
        m2.color = "purple";
    }

    // Tertiary blends
    if(areSetsEqual(moverColors, yellowGreen)) {
        m1.color = "GreenYellow";
        m2.color = "GreenYellow";
    }
    if(areSetsEqual(moverColors, blueGreen)) {
        m1.color = "Teal";
        m2.color = "Teal";
    }
    if(areSetsEqual(moverColors, bluePurple)) {
        m1.color = "RebeccaPurple";
        m2.color = "RebeccaPurple";
    }
    if(areSetsEqual(moverColors, redPurple)) {
        m1.color = "MediumVioletRed";
        m2.color = "MediumVioletRed";
    }
    if(areSetsEqual(moverColors, redOrange)) {
        m1.color = "OrangeRed";
        m2.color = "OrangeRed";
    }
    if(areSetsEqual(moverColors, yellowOrange)) {
        m1.color = "Gold";
        m2.color = "Gold";
    }
}

function getRandNum(max) {
    return Math.floor(Math.random() * max) + 1;
}

function limitMovers(simualtion) {
    if(simulation.moverCount >= 300) {
        simulation.movers.shift();
        simulation.moverCount--;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
}

function checkCollisions(m1, movers) {
    movers.forEach((m2) => {
        if (m2 != m1) {
            let distanceBetweenMovers = Math.sqrt((m1.x - m2.x)**2 + (m1.y - m2.y)**2);
            if (distanceBetweenMovers < m1.r + m2.r) {
                if (Math.random() <= .01) {
                    blendColors(m1, m2);
                }
            }
        }
    });
}

function updateMover(mover) {
    if(mover.x >= c.width - mover.r || mover.x <= 0 + mover.r) {
        mover.dx *= -1;
    }

    if(mover.y >= c.height - mover.r || mover.y <= 0 + mover.r) {
        mover.dy *= -1;
    }

    mover.x += (mover.a * mover.mood)/2 * mover.dx;
    mover.y += (mover.a * mover.mood)/2 * mover.dy;
}

function drawMover(mover) {
    ctx.fill();
    ctx.fillStyle = mover.color;
    ctx.beginPath();
    ctx.arc(mover.x, mover.y, mover.r, 0, 2 * Math.PI);
    ctx.closePath();
}

function draw() {
    clearCanvas();
    limitMovers(simulation);
    simulation.movers.forEach((m) => {
        updateMover(m);
        checkCollisions(m, simulation.movers);
        drawMover(m);
    });
    window.requestAnimationFrame(draw);
}

// Main
window.requestAnimationFrame(draw);