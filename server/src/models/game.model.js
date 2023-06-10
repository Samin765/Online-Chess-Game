class Game {
  constructor(gameId) {
    this.player1Id = -1;
    this.player2Id = -1;
    this.gameId = gameId;
    this.gameBoard = [
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["r", "n", "b", "q", "k", "b", "n", "r"],
    ];
    this.turn = 0;
    this.gameOver = false;
    this.winner = -1;
  }
  // här kommer eventuella getters, setters elle andra "nödvändiga" metoder

  getGameId() {
    return this.gameId;
  }

  getGameOver() {
    return this.gameOver;
  }

  setGameOver() {
    this.gameOver = true;
  }

  getGameWinner() {
    return this.winner;
  }

  setGameWinner(name) {
    this.winner = name;
  }

  getPlayer1Id() {
    return this.player1Id;
  }

  getPlayer2Id() {
    return this.player2Id;
  }

  getGameBoard() {
    return this.gameBoard;
  }

  getTurn() {
    return this.turn;
  }

  setGameId(id) {
    this.gameId = id;
  }

  setPlayer1Id(id) {
    this.player1Id = id;
  }

  setPlayer2Id(id) {
    this.player2Id = id;
  }

  setGameBoard(gameBoard) {
    this.gameBoard = gameBoard;
  }

  setTurn(turn) {
    this.turn = turn;
  }
}

export default Game;
