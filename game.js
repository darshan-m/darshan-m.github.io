// Flappy Bird style game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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

function resetGame() {
    birdY = canvas.height / 2;
    birdV = 0;
    pipes = [];
    score = 0;
    gameOver = false;
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
    ctx.fillStyle = '#222';
    ctx.font = 'bold 32px Segoe UI';
    ctx.fillText(score, canvas.width / 2 - 10, 50);
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
        ctx.fillText('Press Space to Restart', canvas.width / 2 - 110, canvas.height / 2 + 20);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        if (gameOver) {
            resetGame();
        } else {
            birdV = FLAP;
        }
    }
});

resetGame();
gameLoop();
