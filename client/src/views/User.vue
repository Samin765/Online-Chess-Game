<template>
    <div>
      <p>Hi, {{ username }}, you have {{ numwins }} wins.</p>
    </div>
</template>
  
<script>
export default {
  data() {
    return {
      username: '',
      numwins: 0
    };
  },
  mounted() {
    // Fetch the data from the server and update the variables
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      console.log("fetch call client side");
      try{
        const res = await fetch("/api/userdata", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const {username, numwins} = await res.json();
        console.log(username);
        this.username = username;
        this.numwins = numwins;
      }
      catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
