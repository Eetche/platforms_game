const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

const zoom = 30;
const FPS = 60;
const speed = 10;

let pause = false;

function getCanvasSize(size) {
  return {
    w: (canvas.width / size) * size,
    h: (canvas.height / size) * size,
  };
}

function clearScreen() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const platformVertSize = zoom * 3;

canvas.width = getCanvasSize(zoom).w;
canvas.height = getCanvasSize(platformVertSize).h;

class Platform {
  constructor(side, y) {
    this.side = side;
    this.y = y;
  }

  draw() {
    context.fillStyle = "black";

    if (this.side == "player") {
      context.fillRect(0, this.y, zoom, platformVertSize);
    } else if (this.side == "enemy") {
      context.fillRect(canvas.width - zoom, this.y, zoom, platformVertSize);
    }
  }

  move() {
    this.draw();

    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > canvas.height) [(this.y = canvas.height)];
  }
}

class Ball {
  constructor(direction, x, y, size, side) {
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.size = size;
    this.side = side;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    context.lineWidth = 2;
    context.fill();
    context.stroke();
  }

  move() {
    this.draw();

    if (this.side == "player") {
      if (this.direction == "top") {
        this.x += ballMoveSpeed.x;
        this.y -= ballMoveSpeed.y;
      } else if (this.direction == "bottom") {
        this.x += ballMoveSpeed.x;
        this.y += ballMoveSpeed.y;
      } else {
        this.x += ballMoveSpeed.x;
      }
    } else if (this.side == "enemy") {
      if (this.direction == "top") {
        this.x -= 1;
        this.y -= 1;
      } else if (this.side == "bottom") {
        this.x -= ballMoveSpeed.x;
        this.y += ballMoveSpeed.y;
      } else {
        this.x -= ballMoveSpeed.x;
      }
    }
  }
}

const ballMoveSpeed = {
  x: 1,
  y: 1,
};

const ballFirstPos = {
  x: (zoom * canvas.width) / zoom / 2,
  y: (zoom * canvas.height) / zoom / 2,
};

function random(min, max) {
  let result = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(result);
}

function getRandomDirection() {
  let randomNum = random(2);

  const direction = randomNum == 0 ? "top" : randomNum == 1 ? "down" : "top";

  return direction;
}

const player = new Platform("player", 0);
const enemy = new Platform("enemy", 0);

const ball = new Ball(
  getRandomDirection(),
  ballFirstPos.x,
  ballFirstPos.y,
  10,
  "player"
);

function ballCollision() {
  if (
    ball.x <= zoom * 2 &&
    ball.y >= player.y &&
    ball.y <= player.y + platformVertSize
  ) {
    if (ball.y >= canvas.height / 2) {
      ball.side = "player";
      if (random(0, 2) == 1) {
        ball.direction = "forward";
      } else {
        ball.direction = "top";
      }
    } else {
      if (random(0, 2) == 1) {
        ball.direction = "forward";
      } else {
        ball.direction = "bottom";
      }
      ball.side = "player";
    }
  } else if (
    ball.x >= canvas.height - zoom &&
    ball.y >= enemy.y &&
    ball.y <= enemy.y + platformVertSize
  ) {
    if (ball.y >= canvas.height / 2) {
      if (random(0, 2) == 1) {
        ball.direction = "forward";
      } else {
        ball.direction = "top";
      }
      ball.side = "enemy";
    } else {
      if (random(0, 2) == 1) {
        ball.direction = "forward";
      } else {
        ball.direction = "bottom";
      }
      ball.side = "enemy";
    }
  }

  if (
    ball.x >= canvas.width ||
    ball.y >= canvas.height ||
    ball.x < 0 ||
    ball.y < 0
  ) {
    gameReset();
  }
}

function gameReset() {
  player.x = 0;
  player.y = 0;
  enemy.x = 0;
  enemy.y = 0;
  ball.x = ballFirstPos.x;
  ball.y = ballFirstPos.y;
}

function gameLoop() {
  setInterval(() => {
    if (!pause) {
      clearScreen();
      player.move();
      enemy.move();
      ball.move();
      ballCollision();
    }
  }, 1000 / FPS);
}

window.addEventListener("keydown", (e) => {
  let keyC = e.keyCode;
  let platformSpeed = speed * 2;

  if (!pause) {
    // player control
    if (keyC == 38) {
      // UP
      player.y -= platformSpeed;
    } else if (keyC == 40) {
      // DOWN
      player.y += platformSpeed;
    }

    // enemy control
    if (keyC == 87) {
      // UP
      enemy.y -= platformSpeed;
    } else if (keyC == 83) {
      // DOWN
      enemy.y += platformSpeed;
    }
  }

  if (keyC == 32 && !pause) {
    pause = true;
  } else if (keyC == 32 && pause) {
    pause = false;
  }
});

gameLoop();
