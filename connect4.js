class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.board = [];
    this.currPlayer = player_one;
    this.endMessage = `Player ${this.currPlayer === player_one ? 1 : 2} won the game!!`
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({length: this.width}));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');

    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', e => this.handleClick)

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer === player_one ? 1 : 2}`);
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = piece.classList.contains('p1') ? player_one.color : player_two.color;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt) {
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);

    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.playerNumber;
    this.placeInTable(y, x);
  
    // check for win
    if (this.checkForWin()) {
      for (let i = 0; i < this.width; i++) {
        document.getElementById(`${i}`).id = "7";
      }
      return this.endGame(this.endMessage);
    }
  
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    
    // switch players
    this.currPlayer = this.currPlayer === player_one ? player_two : player_one;
  }

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer.playerNumber
      );
    }
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color, playerNumber) {
    this.color = color;
    this.playerNumber = playerNumber;
  }
}

let player_one = new Player(null, 'player1');
let player_two = new Player(null, 'player2');












let ourGame = new Game(6,7);

document.querySelector("body").addEventListener("click", gameFlow);

function gameFlow(e) {
  if (e.target.id === "start-game" && document.querySelector("#board").innerText) {
    ourGame = new Game(6,7);
    ourGame.makeBoard();
    document.querySelector("#board").innerHTML = "";
    ourGame.makeHtmlBoard();
  }
  else if (e.target.id === "start-game") {
    ourGame.makeBoard();
    ourGame.makeHtmlBoard();
    player_one.color = document.querySelector("#player-1").value
    player_two.color = document.querySelector("#player-2").value

  }
  else if ([0,1,2,3,4,5,6].includes(+e.target.id)) {
    ourGame.handleClick(e)
  }
}
