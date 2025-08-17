// Flappy Bird style game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions based on screen size
function setCanvasSize() {
    canvas.width = window.innerWidth > 768 ? 480 : window.innerWidth * 0.9;
    canvas.height = window.innerHeight > 640 ? 640 : window.innerHeight * 0.8;
}

// Initial canvas size setup
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

const GRAVITY = 0.5;
const FLAP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const BIRD_SIZE = 32;
let birdY = canvas.height / 2;
let birdV = 0;
let pipes = [];
let score = 0;
let gameOver = false;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const scoreDisplay = document.getElementById('scoreDisplay');
const instructionText = document.getElementById('instructionText');

function updateInstructions() {
    if (isMobile) {
        instructionText.textContent = 'Tap anywhere to flap! Avoid the pipes!';
    } else {
        instructionText.textContent = 'Tap, click, or press Space to flap. Avoid the pipes!';
    }
}

function resetGame() {
    birdY = canvas.height / 2;
    birdV = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    updateInstructions();
    updateScoreDisplay();
    for (let i = 0; i < 3; i++) {
        pipes.push({
            x: canvas.width + i * 200,
            top: Math.random() * (canvas.height - PIPE_GAP - 40) + 20
        });
    }
}

function drawBird() {
    ctx.save();
    ctx.translate(60, birdY);
    ctx.rotate(birdV * 0.03);
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawPipes() {
    ctx.fillStyle = '#4caf50';
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.top + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.top - PIPE_GAP);
    });
}

function drawScore() {
    // No longer drawing directly on canvas, using DOM element
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `SCORE: ${score}`;
}

function update() {
    if (gameOver) return;
    birdV += GRAVITY;
    birdY += birdV;

    // Bird collision with ground/ceiling
    if (birdY + BIRD_SIZE / 2 > canvas.height || birdY - BIRD_SIZE / 2 < 0) {
        gameOver = true;
    }

    // Move pipes
    pipes.forEach(pipe => {
        pipe.x -= 3;
    });

    // Add new pipe
    if (pipes[0].x < -PIPE_WIDTH) {
        pipes.shift();
        pipes.push({
            x: canvas.width,
            top: Math.random() * (canvas.height - PIPE_GAP - 40) + 20
        });
        score++;
        updateScoreDisplay();
    }

    // Bird collision with pipes
    pipes.forEach(pipe => {
        if (
            60 + BIRD_SIZE / 2 > pipe.x &&
            60 - BIRD_SIZE / 2 < pipe.x + PIPE_WIDTH &&
            (birdY - BIRD_SIZE / 2 < pipe.top || birdY + BIRD_SIZE / 2 > pipe.top + PIPE_GAP)
        ) {
            gameOver = true;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPipes();
    drawBird();
    drawScore();
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Segoe UI';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2 - 20);
        ctx.font = '24px Segoe UI';
        if (isMobile) {
            ctx.fillText('Tap to Restart', canvas.width / 2 - 80, canvas.height / 2 + 20);
        } else {
            ctx.fillText('Tap or Click to Restart', canvas.width / 2 - 110, canvas.height / 2 + 20);
        }
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Flap or restart on key, click, or touch
function flapOrRestart() {
    if (gameOver) {
        resetGame();
    } else {
        birdV = FLAP;
    }
}

// Prevent context menu on long press (mobile)
canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Prevent text selection on mobile
canvas.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

window.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        flapOrRestart();
    }
});

// Enhanced mobile touch support
const gameContainer = document.querySelector('.game-container');

// Touch events with better handling
gameContainer.addEventListener('touchstart', function(e) {
    if (e.target === canvas) {
        e.preventDefault();
        e.stopPropagation();
        flapOrRestart();
    }
}, { passive: false });

gameContainer.addEventListener('touchend', function(e) {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, { passive: false });

// Mouse events for desktop
gameContainer.addEventListener('mousedown', function(e) {
    e.preventDefault();
    flapOrRestart();
});

// Prevent scrolling on mobile when touching the game
if (isMobile) {
    document.addEventListener('touchmove', function(e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Focus canvas for keyboard events on desktop
canvas.focus();

resetGame();
updateInstructions(); // Initial call to set instructions
updateScoreDisplay(); // Initial call to set score display
gameLoop();
