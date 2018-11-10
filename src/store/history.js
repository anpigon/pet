// import util from '@/util';

const state = {
  history: [],
};

const getters = {
};

const actions = {
  setHistory(context, list) {
    context.commit('setHistory', list);
  },
  addHistory(context, one) {
    context.commit('addHistory', one);
  },
};

const mutations = {
  setHistory (state, list) {
    state.history = list;
  },
  addHistory (state, one) {
    state.history.unshift(one);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
