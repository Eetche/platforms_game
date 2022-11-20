const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')

const zoom = 30
const FPS = 60
const speed = 10

function getCanvasSize(size) {
  return {
    w: (canvas.width / size) * size,
    h: (canvas.height / size) * size,
  }
}

canvas.width = getCanvasSize(zoom).w
canvas.height = getCanvasSize(zoom).h

function clearScreen() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

const platformVertSize = zoom * 3

class Platform {
  constructor(side, x, y) {
    this.side = side
    this.x = x
    this.y = y
  }

  draw() {
    context.fillStyle = 'black'

    if (this.side == 'player') {
      context.fillRect(0, this.y, zoom, platformVertSize)
    } else if ((this.side = 'enemy')) {
      context.fillRect(canvas.width - zoom, this.y, zoom, platformVertSize)
    }
  }
}

class Ball {
  constructor(direction, x, y, size, side) {
    this.direction = direction
    this.x = x
    this.y = y
    this.size = size
    this.side = side
  }

  draw() {
    context.beginPath()
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    context.lineWidth = 2
    context.stroke()
  }

  move() {
    this.draw()

    if (this.side == 'player') {
      if (this.direction == 'top') {
        this.x -= 1
        this.y -= 1
      } else {
        this.x += 1
        this.y += 1
      }
    } else {
      if (this.direction == 'top') {
        this.x += 1
        this.y -= 1
      } else {
        this.x -= 1
        this.y += 1
      }
    }
  }
}

const ballFirstPos = {
  x: (zoom * canvas.width) / zoom / 2,
  y: (zoom * canvas.height) / zoom / 2,
}

function random(max) {
  return Math.floor(Math.random() * max)
}

function getRandomDirection() {
  let randomNum = random(3)

  const direction =
    randomNum == 0
      ? 'top'
      : randomNum == 1
      ? 'down'
      : randomNum == 2
      ? 'forward'
      : 'forward'

  return direction
}

const player = new Platform('player', 0)
const enemy = new Platform('enemy', 0)
const ball = new Ball(getRandomDirection(), ballFirstPos.x, ballFirstPos.y, 10, "enemy")

function ballCollision() {
  if (ball.x <= zoom && ball.y >= player.y && ball.y <= platformVertSize) {
    if (ball.y >= canvas.height) {
      ball.direction = 'top'
    } else {
      ball.direction = 'bottom'
    }
  } else if (
    ball.x <= zoom &&
    ball.y >= player.y &&
    ball.y <= platformVertSize
  ) {
    if (ball.y >= canvas.height) {
      ball.direction = 'top'
    } else {
      ball.direction = 'bottom'
    }
  }
}

function gameLoop() {
  setInterval(() => {
    clearScreen()
    player.draw()
    enemy.draw()
    ball.move()
  }, 1000 / FPS)
}

window.addEventListener('keydown', (e) => {
  console.log(player.y)

  let keyC = e.keyCode
  let platformSpeed = speed * 2

  // player control
  if (keyC == 38) {
    // UP
    player.y -= platformSpeed
  } else if (keyC == 40) {
    // DOWN
    player.y += platformSpeed
  }

  // enemy control
  if (keyC == 87) {
    // UP
    enemy.y -= platformSpeed
  } else if (keyC == 83) {
    // DOWN
    enemy.y += platformSpeed
  }
})

gameLoop()
