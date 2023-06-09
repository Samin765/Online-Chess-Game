<template>
  <div class="row">
    <div class="col"></div>
    <div class="col list-group">
      <button
        v-for="room in rooms"
        :key="room.name"
        type="button"
        class="list-group-item list-group-item-action my-2 py-2"
        @click="redirect(room.name)"
      >
        {{ room.name }}
      </button>
      <form class="col" @submit.prevent="authenticate()">
        <label for="username" class="form-label h4">Lobby name</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="form-control"
          placeholder="Lobbyname..."
        />
        <button type="submit" class="btn btn-dark mt-4 float-end">
          Create Room
        </button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
    <div class="col"></div>
  </div>
</template>

<script>
export default {
  name: "RoomsView",
  components: {},
  data: () => ({
    errorMessage: "",
    rooms: [],
    loading: true,
  }),
 

    mounted() {
  fetch("/api/getLobbies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  .then(response => response.json()) // Add this line
  .then(({lobbies}) => {
    // Now you can set this.rooms to the parsed JSON data
    this.rooms = lobbies;
  })
  .catch(error => {
    console.error("Error getting lobbies:", error);
  });
    },

      //this.$root.socket.emit('join', 'my-room');
    //this.rooms = lobbys; // Fetch initial rooms data
    //this.$root.socket.on("msg", (lobbys) => {
      //console.log(`${JSON.stringify(lobbys)} websocket`);
      //this.rooms = lobbys; // Update rooms when a message is received
    //});
  

  methods: {
    redirect(name) {
  const room = this.rooms.find((room) => room.name === name);
  if (room && room.members < 2) {
     // Increment the members count
    
    // Send the updated count to the server
    fetch("/api/update-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName: room.name, members: room.members }),
    })
       .then(response => response.json()) // Add this line
      .then(({updated}) => {
        if(updated){
          room.members = room.members + 1;
        }
        else{
              this.errorMessage = "Room is full. Cannot join at the moment.";

        }
    // Now you can set this.rooms to the parsed JSON data
    
  })
      .catch((error) => {
        console.error("Error updating members count:", error);
      });

    this.$router.push(`/rooms/${name}`);
  } else {
    this.errorMessage = "Room is full. Cannot join at the moment.";
  }
},
    authenticate() {
      const { commit, getters } = this.$store;
      const { push } = this.$router;

      fetch("/api/createroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: this.username }),
      })
        .then((res) => res.json())
        .then(({ authenticated }) => {
          commit("setAuthenticated", true);
          push(authenticated === true ? "/rooms" : "/rooms");
        })
        .catch(console.error);
    },
  },
};
</script>