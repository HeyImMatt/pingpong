class Paddle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xSpeed = 0;
    this.ySpeed = 0;
  }
  render() {
    context.fillStyle = '#FFFFFF';
    context.fillRect(this.x, this.y, this.width, this.height);
  }
  move(x, y) {
    this.x += x;
    this.y += y;
    this.xSpeed = x;
    this.ySpeed = y;
    if (this.x < 0) {
      this.x = 0;
      this.xSpeed = 0;
    } else if (this.x + this.width > 400) {
      this.x = 400 - this.width;
      this.xSpeed = 0;
    }
  }
}

class Player {
  constructor() {
    this.paddle = new Paddle(175, 580, 50, 10);
  }
  render() {
    this.paddle.render();
  }
  update() {
    for (let key in keysDown) {
      let value = Number(key);
      if (value === 37) {
        this.paddle.move(-4, 0);
      } else if (value === 39) {
        this.paddle.move(4, 0);
      }
    }
  }
}

class Computer {
  constructor() {
    this.paddle = new Paddle(175, 10, 50, 10);
  }
  render() {
    this.paddle.render();
  }
  update(ball) {
    let xPos = ball.x;
    let diff = -(this.paddle.x + this.paddle.width / 2 - xPos);
    if (diff < 0 && diff < -4) {
      diff = -5;
    } else if (diff > 0 && diff > 4) {
      diff = 5;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
      this.paddle.x < 0;
    } else if (this.paddle.x + this.paddle.width > 400) {
      this.paddle.x = 400 - this.paddle.width;
    }
  }
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 3;
    this.radius = 5;
  }
  render() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStlye = '#FFFFFF';
    context.fill();
  }

  update(paddle1, paddle2) {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    let topX = this.x - 5;
    let topY = this.y - 5;
    let bottomX = this.x + 5;
    let bottomY = this.y + 5;

    if (this.x - 5 < 0) {
      this.x = 5;
      this.xSpeed = -this.xSpeed;
    } else if (this.x + 5 > 400) {
      this.x = 395;
      this.xSpeed = -this.xSpeed;
    }
    if (this.y < 0 || this.y > 600) {
      scoreUpdate(this.y);
      this.xSpeed = 0;
      this.ySpeed = 3;
      this.x = 200;
      this.y = 300;
    }
    if (topY > 300) {
      if (
        topY < paddle1.y + paddle1.height &&
        bottomY > paddle1.y &&
        topX < paddle1.x + paddle1.width &&
        bottomX > paddle1.x
      ) {
        this.ySpeed = -3;
        this.xSpeed += paddle1.xSpeed / 2;
        this.y += this.ySpeed;
      }
    } else {
      if (
        topY < paddle2.y + paddle2.height &&
        bottomY > paddle2.y &&
        topX < paddle2.x + paddle2.width &&
        bottomX > paddle2.x
      ) {
        this.ySpeed = 3;
        this.xSpeed += paddle2.xSpeed / 2;
        this.y += this.ySpeed;
      }
    }
  }
}

const animate =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

const canvas = document.createElement('canvas');
const width = 400;
const height = 600;
canvas.width = width;
canvas.height = height;
const context = canvas.getContext('2d');
let gameEnd = false;

onload = () => {
  document.getElementById('main-container').appendChild(canvas);
  animate(step);
};

function step() {
  update();
  render();
  if (gameEnd === false) {
    animate(step);
  }
}

function update() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
}

function render() {
  context.fillStyle = '#000000';
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
}

function scoreUpdate(ballPos) {
  let computerScoreEl = document.getElementById('computer-score');
  let playerScoreEl = document.getElementById('player-score');
  let playerScore = parseInt(playerScoreEl.textContent);
  let computerScore = parseInt(computerScoreEl.textContent);
  if (ballPos < 0) {
    if (playerScore < 4) {
      playerScore++;
      playerScoreEl.textContent = `${playerScore}`;
    } else {
      playerScore++;
      playerScoreEl.textContent = `${playerScore}`;
      gameOver('You Win!');
    }
  } else if (ballPos > 600) {
    if (computerScore < 4) {
      computerScore++;
      computerScoreEl.textContent = `${computerScore}`;
    } else {
      computerScore++;
      computerScoreEl.textContent = `${computerScore}`;
      gameOver('You Lost');
    }
  }
}

function gameOver(result) {
  gameEnd = true;
  document.getElementById('result').textContent = result;
  document.getElementById('game-over').style.display = 'flex';
}

const player = new Player();
const computer = new Computer();
const ball = new Ball(200, 300);
const keysDown = {};

addEventListener('keydown', function (event) {
  keysDown[event.keyCode] = true;
});

addEventListener('keyup', function (event) {
  delete keysDown[event.keyCode];
});

document.querySelector('button').addEventListener('click', () => {
  location.reload();
});
