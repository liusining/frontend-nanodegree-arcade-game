const xUnit = 101,
  yUnit = 83,
  numRows = 6,
  numCols = 5,
  enemyRows = [1, 2, 3];

// Enemies our player must avoid
class Enemy {
  constructor(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -(Math.random() * 300);
    this.row = row;
    this.y = row * yUnit - 20;
    this.speed = (Math.random() + 1) * 75;
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // TODO: learn to use proxy
    if (this.x > xUnit * numCols) {
      this.goDie();
    }
    this.x += dt * this.speed;
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  goDie() {
    allEnemies.splice(allEnemies.indexOf(this), 1);
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.column = 2;
    this.row = 5;
  }

  x() {
    return this.column * xUnit;
  }

  y() {
    return this.row * yUnit - 10;
  }

  update() {}

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x(), this.y());
  }

  handleInput(to) {
    if ((to === 'left' && this.column === 0) ||
      (to === 'right' && this.column === 4) ||
      (to === 'up' && this.row === 0) ||
      (to === 'down' && this.row === 5)) {
      return;
    }
    switch (to) {
    case 'left':
      this.column -= 1;
      break;
    case 'right':
      this.column += 1;
      break;
    case 'up':
      this.row -= 1;
      break;
    case 'down':
      this.row += 1;
      break;
    default:
    }
    if (this.row === 0) {
      win();
    }
  }

  goBack() {
    this.column = 2;
    this.row = 5;
  }

  checkCollisions() {
    for (let enemy of allEnemies) {
      if (enemy.row === this.row && (enemy.x + 80 > this.x() && enemy.x < this.x() + 80)) {
        this.goBack();
      }
    }
  }
}

function win() {
  setTimeout(function () {
    let result = confirm("You Win!\n Would you like to play again?");
    if (result) {
      location.reload();
    } else {
      stopGame();
    }
  }, 100);
  player.handleInput = function () {};
}

let player = new Player();
let enemy = new Enemy();

let allEnemies = enemyRows.map(row => new Enemy(row));

let genEnemies = setInterval(function () {
  let randomRow = Math.ceil((1 - Math.random()) * 3)
  allEnemies.push(new Enemy(randomRow));
}, 2000);

function stopGame() {
  clearInterval(genEnemies);
  allEnemies = [];
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});