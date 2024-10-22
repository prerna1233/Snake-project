
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const W = canvas.width = 500;
const H = canvas.height = 500;
const cellSize = 20; // Size of each cell

let snake, food, score, isGameOver, snakeDir, requestID;
let speed = 150; // Speed of the game in milliseconds

function initGame() {
    score = 0;
    isGameOver = false;
    snakeDir = { x: 1, y: 0 }; // Start moving to the right

    snake = [{ x: Math.floor(W / 2 / cellSize) * cellSize, y: Math.floor(H / 2 / cellSize) * cellSize }];
    spawnFood();
    updateScore();
    loop();
}

function spawnFood() {
    // Spawn food in a random location
    food = {
        x: Math.floor(Math.random() * (W / cellSize)) * cellSize,
        y: Math.floor(Math.random() * (H / cellSize)) * cellSize,
    };

    // Ensure food does not spawn on the snake
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            return spawnFood(); // Respawn food if it overlaps with the snake
        }
    }
}

function updateScore() {
    document.getElementById("score").textContent = score.toString().padStart(2, "0");
}

function loop() {
    if (isGameOver) return;
    setTimeout(() => {
        requestID = requestAnimationFrame(loop);
        ctx.clearRect(0, 0, W, H);
        drawBorders();

        // Move snake
        const head = { x: snake[0].x + snakeDir.x * cellSize, y: snake[0].y + snakeDir.y * cellSize };
        snake.unshift(head);

        // Check if snake ate the food
        if (head.x === food.x && head.y === food.y) {
            score++;
            updateScore();
            spawnFood(); // Spawn food in a new location
        } else {
            snake.pop(); // Remove last part if no food eaten
        }

        // Draw food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, cellSize, cellSize);

        // Draw snake
        ctx.fillStyle = "lightgreen";
        snake.forEach(part => ctx.fillRect(part.x, part.y, cellSize, cellSize));

        // Check for collisions
        if (checkCollision(head)) {
            gameOver();
        }
    }, speed);
}

function drawBorders() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, W, H);
}

function checkCollision(head) {
    // Check wall collisions
    if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H) return true;

    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

function gameOver() {
    isGameOver = true;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "30px Poppins, sans-serif";
    ctx.fillText("Game Over", W / 2, H / 2);
    cancelAnimationFrame(requestID);
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (snakeDir.y === 0) snakeDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (snakeDir.y === 0) snakeDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (snakeDir.x === 0) snakeDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (snakeDir.x === 0) snakeDir = { x: 1, y: 0 };
            break;
    }
});

document.getElementById("replay").addEventListener("click", initGame);

initGame();
