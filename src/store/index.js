import Vue from 'vue';
import Vuex from 'vuex';
import pets from './pets';
import global from './global';
import history from './history';
import account from './account';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    pets,
    global,
    history,
    account,
  },
});
