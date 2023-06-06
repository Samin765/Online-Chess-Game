<template>
  <div class="room">
    <h1>Chess Room</h1>
    <div class="game">
      <div class="chessboard" v-if="isGameReady" ref="chessboardRef"></div>
      <div class="waiting" v-else>
        <p>Waiting for the second player to join...</p>
      </div>
      <div class="game-info" v-if="isGameReady && isGameStarted">
        <p>{{ currentPlayer.name }}'s Turn</p>
        <p v-if="gameStatus">{{ gameStatus }}</p>
        <button @click="restartGame">Restart Game</button>
      </div>
    </div>
  </div>
</template>

<script>
import Chess from "chess.js";
import Chessboard from "chessboardjs";

export default {
  name: "Room",
  data() {
    return {
      chess: null,
      currentPlayer: { name: "Player 1", color: "w" },
      gameStatus: null,
      isGameReady: false,
      isGameStarted: false,
    };
  },
  mounted() {
    // Simulate waiting for the second player to join
    setTimeout(() => {
      this.isGameReady = true;
      // Chess game initialization
      this.initializeChessboard();
    }, 5000); // Wait for 5 seconds (replace with your actual implementation)
  },
  methods: {
    initializeChessboard() {
      this.chess = new Chess();

      const config = {
        draggable: true,
        dropOffBoard: "trash",
        position: "start",
      };

      const chessboard = Chessboard(this.$refs.chessboardRef, config);
      this.updateChessboard(chessboard.position());

      chessboard.on("drop", (source, target) => {
        const move = this.chess.move({ from: source, to: target });
        if (move === null) return "snapback";

        this.updateChessboard(chessboard.position());

        // Check game status
        if (this.chess.in_checkmate()) {
          this.gameStatus = "Checkmate!";
        } else if (this.chess.in_draw()) {
          this.gameStatus = "Draw!";
        } else if (this.chess.in_check()) {
          this.gameStatus = "Check!";
        }

        // Switch players
        this.currentPlayer =
          this.currentPlayer.name === "Player 1"
            ? { name: "Player 2", color: "b" }
            : { name: "Player 1", color: "w" };
      });

      this.isGameStarted = true;
    },
    updateChessboard(position) {
      this.$refs.chessboardRef.chessboard.position(position);
    },
    restartGame() {
      // Restart the game (reset the chessboard)
      this.initializeChessboard();
      this.currentPlayer = { name: "Player 1", color: "w" };
      this.gameStatus = null;
    },
  },
};
</script>

<style>
.room {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chessboard {
  width: 400px;
  height: 400px;
}

.waiting {
  margin-top: 20px;
}
</style>
