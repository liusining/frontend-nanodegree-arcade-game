const xUnit = 101,
  yUnit = 83,
  numRows = 6,
  numCols = 5,
  enemyRows = [1, 2, 3];

// Enemies our player must avoid
class Enemy {
  /**
   * @description Represents an enemy bug.
   * @constructor
   * @param {number} row - The row where the bug run.
   */
  constructor(row) {
    this.sprite = 'images/enemy-bug.png';
    this.x = -(Math.random() * 300);
    this.row = row;
    this.y = row * yUnit - 20;
    this.speed = (Math.random() + 1) * 75;
  }

  /**
   * @description Update a bug's position.
   * @param {float} dt - The interval for bug to run.
   */
  update(dt) {
    if (this.x > xUnit * numCols) {
      this.goDie();
    }
    this.x += dt * this.speed;
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  /**
   * @description Remove bugs whose positions are out of range.
   */
  goDie() {
    allEnemies.splice(allEnemies.indexOf(this), 1);
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// The player you control
class Player {
  /**
   * @description Represents a player.
   * @constructor
   */
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.column = 2;
    this.row = 5;
  }

  /**
   * @description Calculate a player's x-axis value using its column value.
   */
  x() {
    return this.column * xUnit;
  }

  /**
   * @description Calculate a player's y-axis value using its row value.
   */
  y() {
    return this.row * yUnit - 10;
  }

  // Required method for the game engine.
  update() {}

  // Required method for the game. Render a player's image.
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x(), this.y());
  }

  /**
   * @description Update a player's column and row according to keyboard events.
   * @param {string} to - The direction a player is going.
   */
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

  /**
   * @description Make a player back to the start point once it encounter a bug.
   */
  goBack() {
    this.column = 2;
    this.row = 5;
  }

  /**
   * @description Check whether a play has encountered a bug.
   */
  checkCollisions() {
    for (let enemy of allEnemies) {
      if (enemy.row === this.row && (enemy.x + 80 > this.x() && enemy.x < this.x() + 80)) {
        this.goBack();
      }
    }
  }
}

/**
 * @description Display message to announce victory.
 */
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

/**
 * @description Stop a game by removing all bugs.
 */
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