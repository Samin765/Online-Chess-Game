import { createStore } from "vuex";

export default createStore({
  state: {
    authenticated: false,
    username: null,
    selectedTimes: [
      { selectedTime: "10:45", username: "admin3", booked: false },
      { selectedTime: "10:30", username: "admin1", booked: false },
      { selectedTime: "08:15", username: "admin2", booked: false },
      { selectedTime: "07:00", username: "admin1", booked: false },
    ],
    selectedtime: null,
    index: null,
  },
  getters: {
    isAuthenticated(state) {
      return state.authenticated;
    },
    getUsername(state) {
      return state.username;
    },
    getSelectedTimes(state) {
      return state.selectedTimes;
    },
    getSelectedTime(state) {
      return state.selectedtime;
    },
    getIndex(state) {
      return state.index;
    },
  },
  mutations: {
    setAuthenticated(state, authenticated) {
      state.authenticated = authenticated;
    },
    setUsername(state, username) {
      state.username = username;
    },
    setSelectedTimes(state, selectedtimes) {
      state.selectedTimes = selectedtimes;
    },
    setSelectedTime(state, selectedtime) {
      state.selectedtime = selectedtime;
    },
    setIndex(state, index) {
      state.index = index;
    },
    setIndexinSelectedTimes(state, { index, booked }) {
      state.selectedTimes[index].booked = booked;
    },
  },
  actions: {},
  modules: {},
});
