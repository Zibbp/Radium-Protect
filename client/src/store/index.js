import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    token: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setLoggedIn(state) {
      state.loggedIn = true;
    },
  },
  actions: {},
  modules: {},
});
