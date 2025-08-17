// Snake Game
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

// Game constants
const GRID_SIZE = 20;
const GAME_SPEED = 150; // milliseconds between updates
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameOver = false;
let gameLoop;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const scoreDisplay = document.getElementById('scoreDisplay');
const instructionText = document.getElementById('instructionText');

function updateInstructions() {
    if (isMobile) {
        instructionText.textContent = 'Swipe to change direction! Eat food to grow!';
    } else {
        instructionText.textContent = 'Use arrow keys or WASD to move! Eat food to grow!';
    }
}

function resetGame() {
    // Initialize snake in the middle of the canvas
    const startX = Math.floor(canvas.width / (2 * GRID_SIZE)) * GRID_SIZE;
    const startY = Math.floor(canvas.height / (2 * GRID_SIZE)) * GRID_SIZE;
    
    snake = [
        { x: startX, y: startY },
        { x: startX - GRID_SIZE, y: startY },
        { x: startX - GRID_SIZE * 2, y: startY }
    ];
    
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    gameOver = false;
    
    spawnFood();
    updateInstructions();
    updateScoreDisplay();
    
    // Clear existing game loop and start new one
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, GAME_SPEED);
}

function spawnFood() {
    const maxX = Math.floor(canvas.width / GRID_SIZE);
    const maxY = Math.floor(canvas.height / GRID_SIZE);
    
    do {
        food = {
            x: Math.floor(Math.random() * maxX) * GRID_SIZE,
            y: Math.floor(Math.random() * maxY) * GRID_SIZE
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function update() {
    if (gameOver) return;
    
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = { ...snake[0] };
    switch (direction) {
        case 'up': head.y -= GRID_SIZE; break;
        case 'down': head.y += GRID_SIZE; break;
        case 'left': head.x -= GRID_SIZE; break;
        case 'right': head.x += GRID_SIZE; break;
    }
    
    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver = true;
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScoreDisplay();
        spawnFood();
    } else {
        // Remove tail if no food was eaten
        snake.pop();
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head with different color
            ctx.fillStyle = '#2E7D32';
        } else {
            ctx.fillStyle = '#4CAF50';
        }
        ctx.fillRect(segment.x, segment.y, GRID_SIZE - 2, GRID_SIZE - 2);
    });
    
    // Draw food
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(food.x + GRID_SIZE/2, food.y + GRID_SIZE/2, GRID_SIZE/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw game over screen
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '24px Segoe UI';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        
        if (isMobile) {
            ctx.fillText('Tap to Restart', canvas.width / 2, canvas.height / 2 + 60);
        } else {
            ctx.fillText('Click or Press Space to Restart', canvas.width / 2, canvas.height / 2 + 60);
        }
    }
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `SCORE: ${score}`;
}

function changeDirection(newDirection) {
    // Prevent 180-degree turns
    if (
        (direction === 'up' && newDirection === 'down') ||
        (direction === 'down' && newDirection === 'up') ||
        (direction === 'left' && newDirection === 'right') ||
        (direction === 'right' && newDirection === 'left')
    ) {
        return;
    }
    nextDirection = newDirection;
}

// Touch/swipe handling for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: false });

canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            changeDirection('right');
        } else {
            changeDirection('left');
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            changeDirection('down');
        } else {
            changeDirection('up');
        }
    }
}, { passive: false });

// Keyboard controls
window.addEventListener('keydown', function(e) {
    e.preventDefault();
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            changeDirection('up');
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            changeDirection('down');
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            changeDirection('left');
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            changeDirection('right');
            break;
        case ' ':
            if (gameOver) {
                resetGame();
            }
            break;
    }
});

// Mouse click to restart
canvas.addEventListener('click', function(e) {
    if (gameOver) {
        resetGame();
    }
});

// Prevent context menu and text selection
canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

canvas.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

// Prevent scrolling on mobile
if (isMobile) {
    document.addEventListener('touchmove', function(e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Focus canvas for keyboard events
canvas.focus();

// Start the game
resetGame();

// Draw loop
function drawLoop() {
    draw();
    requestAnimationFrame(drawLoop);
}

drawLoop();
