<template>
  <div class="row">
    <div>
      <p>{{ msg }}</p>
    </div>
    <div class="col"></div>
    <form class="col" @submit.prevent="authenticate()">
      <label for="username" class="form-label h4">Username</label>
      <input
        id="username"
        v-model="username"
        type="text"
        class="form-control"
        placeholder="username..."
        required
        pattern=".{3,}"
        title="Username must be at least 3 characters long"
      />
      <label for="password" class="form-label h4">Password</label>
      <input
        id="password"
        v-model="password"
        type="text"
        class="form-control"
        placeholder="password..."
        required
        pattern=".{3,}"
        title="Password must be at least 3 characters long"
      />

      <button type="submit" class="btn btn-dark mt-4 float-end">LOGIN</button>
    </form>
    <p v-if="failmsg" class="error-message">{{ failmsg }}</p>
    <div class="col"></div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  components: {},
  data: () => ({
    username: "",
    password: "",
    msg: "",
    failmsg: "",
  }),
  methods: {
    authenticate() {
      const { commit } = this.$store;
      const { push } = this.$router;

      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Login failed"); // Throw an error if the login fails
        })
        .then(({ authenticated }) => {
          commit("setAuthenticated", authenticated);
          push(authenticated === true ? "/rooms" : "/login");
        })
        .catch((error) => {
          console.error(error);
          this.failmsg = "Login failed. Please try again."; // Set the failmsg if there is an error
        });
    },
  },
};
</script>
