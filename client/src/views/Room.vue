<template>
  <div>
    <div v-if="members > 1" class="chessboard">
      <div class="row" v-for="(row, i) in messages" :key="i">
        <div
          class="tile"
          v-for="(piece, j) in row"
          :key="j"
          :class="{ 'black-tile': (i + j) % 2 === 0 }"
          @click="handleClick(i, j)"
        >
          {{ piece }}
        </div>
      </div>
    </div>
    <div v-else>
      <p>Waiting for the other player to join/move...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoomView",
  components: {},
  data() {
    return {
      name: this.$route.params.name,
      messages: [],
      message: "",
      selectedTile: null,
      members: 0, // Store the room members here
    };
  },
  async mounted() {
    const res = await fetch(`/api/rooms/${this.name}/messages`);
    const { messages } = await res.json();
    this.messages = messages;
    const { socket } = this.$root;
    socket.on("msg", ({ messages, members }) => {
      if (messages === null) {
        this.$router.push("/rooms");
      }
      this.messages = messages;
      this.members = members;
      console.log("MEMBERS CLIENT:" + this.members);
    });
  },
  methods: {
    async decrementMembers(){
      console.log("DECREMENT MEMBERS!!!!");
      fetch("/api/decrement-members", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ roomName: this.name, members: this.members }),
})
  .then(response => response.json())
  .then(({ updated }) => {
    if (updated) {
      this.members = this.members - 1;
    } else {
      this.errorMessage = "Failed to decrement members count.";
    }
  })
  .catch((error) => {
    console.error("Error decrementing members count:", error);
  });

    },
   
    send() {
      fetch(`/api/rooms/${this.name}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: this.message }),
      }).catch(console.error);
      this.message = "";
    },
    handleClick(i, j) {
      if (this.selectedTile) {
        const oldPosition = this.selectedTile;
        const newPosition = [i, j];

        // make a fetch call to the server to update the move
        fetch(`/api/rooms/${this.name}/movePiece`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPosition, newPosition }),
        })
          .then(response => response.json())
          .then(({ game_over }) => {
            if (game_over) {
              this.$router.push("/rooms");
            } else {
              this.errorMessage = "Game still going";
            }
          })
          .catch((error) => {
            console.error("Error moving piece:", error);
          });

        // clear selection after sending the data
        this.selectedTile = null;
      } else if (this.messages[i][j] !== "") {
        // select piece
        this.selectedTile = [i, j];
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    // Check if the user is leaving the current route/view
    if (to.name !== "RoomView") {
      this.decrementMembers(); // Decrement members count before leaving
    }

    next(); // Proceed to the next route
  }, 
};
</script>

<style scoped>
.chessboard {
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
}
.tile {
  width: 30px;
  height: 30px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
}
.black-tile {
  background-color: black;
  color: white;
}
</style>
