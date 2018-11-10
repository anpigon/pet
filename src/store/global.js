import util from '@/util';

const state = {
  global: {
    totalVestingFundSteem: 0,
    totalVestingShares: 0,
    rewardBalance: 0,
    recentClaims: 0,
    price: 0,
    priceKRW: 0,
  },
};

const getters = {
};

const actions = {
  setGlobal({ commit }, { global, rewardFund, price, coin }) {
    console.log('action.setGlobal', global, rewardFund, price, coin);
    const d = {};
    try {
      const base = util.parseFloat(price.base);
      const quote = util.parseFloat(price.quote);
      d.totalVestingFundSteem = util.parseFloat(global.total_vesting_fund_steem);
      d.totalVestingShares = util.parseFloat(global.total_vesting_shares);
      d.rewardBalance = parseFloat(rewardFund.reward_balance);
      d.recentClaims = parseFloat(rewardFund.recent_claims);
      d.price = (base / quote);
      try {
        d.priceKRW = coin.data.quotes.KRW.price;
      } catch (e) {
        console.log(e);
      }
    } catch (e2) {
      console.log(e2);
    }
    commit('setGlobal', d);
  },
};

const mutations = {
  setGlobal({ global }, {
    totalVestingFundSteem,
    totalVestingShares,
    rewardBalance,
    recentClaims,
    price,
    priceKRW,
  }) {
    console.log('global', global);
    global.totalVestingFundSteem = totalVestingFundSteem;
    global.totalVestingShares = totalVestingShares;
    global.rewardBalance = rewardBalance;
    global.recentClaims = recentClaims;
    global.price = price;
    global.priceKRW = priceKRW;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
