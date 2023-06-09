import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Room from "../views/Room.vue";
import Login from "../views/Login.vue";
import Rooms from "../views/Rooms.vue";
import Register from "../views/Register.vue";
import User from "../views/User.vue";

const routes = [
  {
    path: "/",
    redirect: "/rooms",
  },
  {
    path: "/rooms",
    component: Rooms,
  },
  {
    path: "/rooms/:name",
    component: Room,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/user",
    component: User,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Setup authentication guard.
router.beforeEach((to, from, next) => {
  if (
    store.state.authenticated ||
    to.path == "/login" ||
    to.path == "/register"
  ) {
    next();
  } else {
    console.info("Unauthenticated user. Redirecting to login page.");
    next("/login");
  }
});



export default router;
