const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;
const BRICK_WIDTH = 15;
const BRICK_HEIGHT = 15;
const BRICKS_PER_ROW = 40;
const TOTAL_BRICKS = BRICKS_PER_ROW * 20;

let paddleX = (canvas.width - PADDLE_WIDTH) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height - 10;
let dx = 3;
let dy = -3;
let score = 0;

const bricks = [];
for (let i = 0; i < TOTAL_BRICKS; i++) {
  bricks.push({ x: (i % BRICKS_PER_ROW) * (BRICK_WIDTH + 2), y: Math.floor(i / BRICKS_PER_ROW) * (BRICK_HEIGHT + 2), isHit: false });
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  


function drawPaddle() {
  ctx.fillStyle = 'brown';
  ctx.fillRect(paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = 'green';
  ctx.fill();
}

function drawBricks() {
  ctx.fillStyle = 'blue';
  bricks.forEach(brick => {
    if (!brick.isHit) {
      ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle();
  drawBall();
  drawBricks();

  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
  // Update ball position
  ballX += dx;
  ballY += dy;

  // Check for collisions with canvas boundaries
  if (ballX < 0 || ballX > canvas.width - BALL_RADIUS * 2) {
    dx = -dx;
  }
  if (ballY < 0) {
    dy = -dy;
  }
  if (ballY > canvas.height - BALL_RADIUS * 2 + 7) {
    gameOver();
  }

  // Check for collision with paddle
  if (
    ballX > paddleX + 2  && 
    ballX < paddleX + PADDLE_WIDTH -2  &&
    ballY > canvas.height - PADDLE_HEIGHT - BALL_RADIUS * 2
  ) {
    ballY = canvas.height - PADDLE_HEIGHT - BALL_RADIUS * 2;
    dy = -dy;
  }
    // Check for collision with paddle right
    if (
        ballX > paddleX + PADDLE_WIDTH -2   && 
        ballX < paddleX + PADDLE_WIDTH + 3  &&
        ballY > canvas.height - PADDLE_HEIGHT - BALL_RADIUS * 2
      ) {
        ballY = canvas.height - PADDLE_HEIGHT - BALL_RADIUS * 2;
        dy = -dy;
        dx += getRandomInteger(-1, 6);
      }
    
       // Check for collision with paddle left
       if (
        ballX > paddleX -3  && 
        ballX < paddleX + 2 &&
        ballY > canvas.height - PADDLE_HEIGHT - BALL_RADIUS * 2
      ) {
        ballY = canvas.height - PADDLE_HEIGHT - BALL_RADIUS * 2;
        dy = -dy;
        dx += getRandomInteger(-6, 1);
      }




  // Check for collision with bricks
  bricks.forEach(brick => {
    if (!brick.isHit && ballX > brick.x && ballX < brick.x + BRICK_WIDTH && ballY > brick.y && ballY < brick.y + BRICK_HEIGHT) {
      dy = -dy;
      brick.isHit = true;
      score += 10;
    }
  });

  // Check if all bricks are hit
  if (bricks.every(brick => brick.isHit)) {
    gameOver();
  }
}

function gameOver() {
    clearInterval(gameInterval);
    alert(`Game Over! Your score is ${score}`);
    location.reload();
}

let leftPressed = false;
let rightPressed = false;

function movePaddle() {
  if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  } else if (rightPressed && paddleX < canvas.width - PADDLE_WIDTH) {
    paddleX += 5;
  }
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    leftPressed = true;
  } else if (event.key === 'ArrowRight') {
    rightPressed = true;
  }
});

document.addEventListener('keyup', event => {
  if (event.key === 'ArrowLeft') {
    leftPressed = false;
  } else if (event.key === 'ArrowRight') {
    rightPressed = false;
  }
});

setInterval(movePaddle, 0); // Set key repetition interval to zero


let gameInterval = setInterval(() => {
  update();
  draw();
}, 5);


