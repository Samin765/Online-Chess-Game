<template>
    <div>
      <h3>Chessboard</h3>
      <div>{{ player1 }} vs {{ player2 }}</div>
      <div>{{ currentPlayer }}'s turn</div>
      <table>
        <!-- Render the chessboard grid here -->
      </table>
      <div v-if="gameStatus === 'check'">Check!</div>
      <div v-if="gameStatus === 'checkmate'">Checkmate!</div>
      <div v-if="gameStatus === 'stalemate'">Stalemate!</div>
      <button v-if="gameStatus" @click="restartGame">Restart Game</button>
    </div>
  </template>
  
  <script>
  import Chess from "chess.js";
  
  export default {
    name: "Chessboard",
    props: {
      player1: String,
      player2: String,
      roomName: String,
    },
    data() {
      return {
        chess: null,
        currentPlayer: this.player1,
        gameStatus: null,
      };
    },
    mounted() {
      this.chess = new Chess();
    },
    methods: {
      handleMove(source, target) {
        // Handle the move on the chessboard
        const move = this.chess.move({ from: source, to: target });
        if (move) {
          // Move was valid, update the chessboard and check game status
          this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
          this.checkGameStatus();
          this.$emit("move", move);
        }
      },
      checkGameStatus() {
        // Check game status (check, checkmate, stalemate, etc.)
        if (this.chess.in_check()) {
          this.gameStatus = "check";
        } else if (this.chess.in_checkmate()) {
          this.gameStatus = "checkmate";
          this.$emit("gameOver", "checkmate");
        } else if (this.chess.in_stalemate()) {
          this.gameStatus = "stalemate";
          this.$emit("gameOver", "stalemate");
        } else {
          this.gameStatus = null;
        }
      },
      restartGame() {
        // Restart the game
        this.chess.reset();
        this.currentPlayer = this.player1;
        this.gameStatus = null;
      },
    },
  };
  </script>
  