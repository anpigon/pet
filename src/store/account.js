import util from '@/util';
import Remarkable from 'remarkable';

const md = new Remarkable({ html: true, linkify: false });

const state = {
  account: {
    vestingSteem: 0,
    delegatedVestingSteem: 0,
    receivedVestingShares: 0,
    reputation: 0,
    created: '',
    age: 0,
    name: '',
    userid: '',
    // username: '',
    postCount: 0,
  },
  blogs: [],
};

const getters = {
};

const actions = {
  setAccount({ commit, state, rootState }, account) {
    console.log('actions.setAccount', account);
    const { global } = rootState.global;

    const vestingSteem = util.formatterVestingSteem(account.vesting_shares, global);
    const delegatedVestingSteem = util.formatterVestingSteem(account.delegated_vesting_shares, global);
    const receivedVestingShares = util.formatterVestingSteem(account.received_vesting_shares, global);
    const reputation = this._vm.$steem.formatter.reputation(account.reputation); // 명성도
    const d = new Date(`${account.created}Z`);
    const created = `${d.getFullYear()}년 ${(d.getMonth() + 1)}월 ${d.getDate()}일`;
    const age = Math.floor((Date.now() - d) / 864e5);
    const { profile: { name } } = account.json_metadata ? JSON.parse(account.json_metadata) : {profile:{ name: account.name }};
    // console.log(JSON.parse(account.json_metadata))
    // const name = name;
    const userid = account.name;
    const postCount = account.post_count;
    commit('setAccount', {
      vestingSteem,
      delegatedVestingSteem,
      receivedVestingShares,
      reputation,
      created,
      age,
      name,
      userid,
      postCount,
    });
  },
  setBlogs({ commit, state, rootState }, blogs) {
    console.log('actions.setBlogs', blogs);
    const petsid = rootState.pets.pets.map(({id}) => id);
    console.log('********** petsid', petsid);
    commit('setBlogs', blogs.filter((e) => {
      if (e.author !== state.account.userid) return false;
      const ct = new Date(`${e.cashout_time}Z`);
      const d = new Date();
      d.setHours(d.getHours() + 12);
      if (ct <= d) return false; // 페이아웃 12시간 전에는 보팅 불가
      // console.log('********** find', _.filter(e.active_votes, ({voter}) => petsid.includes(voter)));
      return true;
    }).map(e => (
      {
        id: e.id,
        title: e.title,
        author: e.author,
        net_votes: e.net_votes,
        children: e.children,
        created: e.created,
        permlink: e.permlink,
        active_votes: _.map(_.filter(e.active_votes, ({voter}) => petsid.includes(voter)), (e) => {
          const { name, color } = _.find(rootState.pets.pets, {id: e.voter});
          return {
            ...e, 
            name,
            color,
          }
        }),
        body: md.render(e.body).replace(/<\/?[^>]+(>|$)/g, ''),
      }
    )));
  },
};

const mutations = {
  init() {
    state.account.vestingSteem = null;
    state.account.delegatedVestingSteem = null;
    state.account.receivedVestingShares = null;
    state.account.reputation = null; // 명성도
    state.account.created = null;
    state.account.age = null;
    state.account.name = null;
    state.account.userid = null;
    state.account.postCount = null;
    state.blogs = [];
  },
  setAccount(state, { vestingSteem, delegatedVestingSteem, receivedVestingShares, reputation, created, age, name, userid, postCount }) {
    // console.log('mutationssetBlogs', blogs);
    state.account.vestingSteem = vestingSteem;
    state.account.delegatedVestingSteem = delegatedVestingSteem;
    state.account.receivedVestingShares = receivedVestingShares;
    state.account.reputation = reputation; // 명성도
    state.account.created = created;
    state.account.age = age;
    state.account.name = name;
    state.account.userid = userid;
    state.account.postCount = postCount;
  },
  setBlogs(state, blogs) {
    console.log('mutationssetBlogs', blogs);
    state.blogs = blogs;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
