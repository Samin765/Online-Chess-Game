<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <button
      class="navbar-toggler mx-2 mb-2"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbarNav" class="collapse navbar-collapse mx-2">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/login')">Login</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/rooms')">Rooms</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/register')"
            >Register</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="redirect('/user')"
            >User</a
          >
        </li>
      </ul>
    </div>
  </nav>
  <section class="container-fluid py-4">
    <router-view />
  </section>
</template>

<script>
import { io } from "socket.io-client";
// @ is an alias to /src
import "bootstrap";

export default {
  name: "App",
  components: {},
  data: () => ({ socket: io().connect() }),
  mounted() {
    const { commit, getters } = this.$store;
    const { push } = this.$router;
    this.$root.socket.on("msg", (lobbys) => {
      console.log(`${JSON.stringify(lobbys)} websocket`);
    });
    commit("setAuthenticated", false);
    push(getters.isAuthenticated === true ? "/rooms" : "/login");
  },
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
  },
};
</script>

<style>
@import url("bootstrap/dist/css/bootstrap.css");

html,
body {
  /* https://designs.ai/colors */
  background-color: #a7d7c5;
}
</style>
