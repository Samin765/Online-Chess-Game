<template>
  <div>
    <p>
      Hi, {{ username }}, you have {{ numwins }} wins and {{ numplayed }} games
      played.
    </p>
    <ul>
      <li v-for="match in history" :key="match.id">
        Winner: {{ match.winner }}, Loser: {{ match.loser }}
      </li>
    </ul>
    <button type="button" @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  name: "UserProfile",
  data() {
    return {
      username: "",
      numwins: 0,
      numplayed: 0,
      history: [],
    };
  },
  mounted() {
    // Fetch the data from the server and update the variables
    this.fetchUserData();
  },
  methods: {
    async logout() {
      // Trigger the logout action and redirect to the login page
      await fetch("/api/logOut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      this.$store.commit("setAuthenticated", false); // servern ska hatera detta
      this.$router.push("/login");
    },
    async fetchUserData() {
      console.log("fetch call client side");
      try {
        const res = await fetch("/api/userdata", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const { username, numwins, numplayed, history } = await res.json();
        console.log(username);
        this.username = username;
        this.numwins = numwins;
        this.history = history;
        this.numplayed = numplayed;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
