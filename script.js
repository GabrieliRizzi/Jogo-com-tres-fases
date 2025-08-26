const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let player = { x: 50, y: 180, width: 30, height: 30, dy: 0, gravity: 0.8, jump: -12, grounded: false };
let obstacles = [];
let gameOver = false;
let fase = 1;
let velocidade = 4;
let maxObstaculos = 3;
let statusText = document.getElementById("status");
let faseText = document.getElementById("fase");
let vidasText = document.getElementById("vidas");
let score = 0;
let vidas = 3;

function resetPlayer() {
  player.y = 180;
  player.dy = 0;
  player.grounded = false;
}

function loseVida() {
  vidas--;
  vidasText.innerText = "Vidas: " + vidas;
  if (vidas <= 0) {
    gameOver = true;
    statusText.innerText = "💀 Game Over! Aperte Espaço para reiniciar";
  } else {
    // respawn jogador
    resetPlayer();
    obstacles = [];
    statusText.innerText = "⚠️ Você perdeu uma vida! Restam " + vidas;
  }
}

function resetGame() {
  resetPlayer();
  obstacles = [];
  gameOver = false;
  statusText.innerText = "";
  score = 0;
  vidas = 3;
  vidasText.innerText = "Vidas: " + vidas;
  fase = 1;
  velocidade = 4;
  maxObstaculos = 3;
  canvas.style.backgroundColor = "#e0f7fa";
  faseText.innerText = "Fase: " + fase;
}

function nextFase() {
  fase++;
  if (fase > 3) {
    statusText.innerText = "🎉 Parabéns, você zerou o jogo!";
    gameOver = true;
    return;
  }

  velocidade += 2;
  maxObstaculos += 2;

  if (fase === 2) canvas.style.backgroundColor = "#ffe0b2";
  if (fase === 3) canvas.style.backgroundColor = "#c8e6c9";

  faseText.innerText = "Fase: " + fase;
  resetPlayer();
  obstacles = [];
  score = 0;
  statusText.innerText = "✅ Fase " + fase + " iniciada!";
}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function updateObstacles() {
  if (obstacles.length < maxObstaculos) {
    let height = Math.random() * 40 + 20;
    obstacles.push({
      x: canvas.width,
      y: canvas.height - height,
      width: 20,
      height: height
    });
  }

  obstacles.forEach(obs => obs.x -= velocidade);
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // colisão
  obstacles.forEach(obs => {
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      loseVida();
    }
  });

  // se passar de 20 obstáculos, muda de fase
  if (score > 20 * fase) {
    statusText.innerText = "✅ Fase " + fase + " concluída!";
    setTimeout(nextFase, 1000);
  }
}

function applyGravity() {
  player.y += player.dy;
  player.dy += player.gravity;
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    applyGravity();
    drawPlayer();
    updateObstacles();
    drawObstacles();
    score++;
    ctx.fillStyle = "black";
    ctx.fillText("Pontuação: " + score, 10, 20);
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    if (gameOver) {
      resetGame();
      gameOver = false;
    } else if (player.grounded) {
      player.dy = player.jump;
      player.grounded = false;
    }
  }
});

gameLoop();
