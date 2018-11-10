import pets from '@/petsdata';
import util from '@/util';
import _ from 'lodash';

const state = {
  pets,
};

const getters = {
};

const actions = {
  setPet({ commit, state, rootState }, pet) {
    console.log('actions.setPet', pet);
    const elapsedSeconds = (new Date() - new Date(`${pet.last_vote_time}Z`)) / 1000; // 마지막 보팅 후 경과 시간
    const regeneratedPower = 1e4 * elapsedSeconds / 432e3; // 재생된 보팅파워
    const currentPower = Math.round(Math.min(pet.voting_power + regeneratedPower, 1e4)); // 현재 보팅파워
    const votePower = (currentPower / 100) || 0;
    const rate = parseInt((votePower * 100 + 49) / 50) * 100;

    let about = null;
    if (pet.json_metadata) {
      const metadata = JSON.parse(pet.json_metadata)
      console.log('metadata', metadata.profile)
      about = metadata.profile ? metadata.profile['about'] : null;
    }
    // const { profile: { about } } = pet.json_metadata ? JSON.parse(pet.json_metadata) : {profile:{ about: '' }};

    const { global } = rootState.global;
    const vestingSteem = util.formatterVestingSteem(pet.vesting_shares, global);
    const delegatedVestingSteem = util.formatterVestingSteem(pet.delegated_vesting_shares, global);
    const receivedVestingShares = util.formatterVestingSteem(pet.received_vesting_shares, global);
    const totalSteemPower = vestingSteem + receivedVestingShares - delegatedVestingSteem;
    const upvote = totalSteemPower / (global.totalVestingFundSteem / global.totalVestingShares) * rate * (global.rewardBalance / global.recentClaims);
    console.log('global:', rootState.global);
    console.log('pet.vesting_shares:', pet.vesting_shares);
    console.log('global:', rootState.global)
    console.log('vestingSteem:', rootState.global.totalVestingFundSteem, util.parseFloat(pet.vesting_shares), rootState.global.totalVestingShares);
    console.log('delegatedVestingSteem:', delegatedVestingSteem);
    console.log('receivedVestingShares:', receivedVestingShares);
    console.log('totalSteemPower:', totalSteemPower);
    console.log('upvote:', upvote);

    const vp = votePower;
    const remainHours = (1e4 - votePower) * 432e3 / 36e6;
    const upvoteValue = upvote * global.price || 0;
    commit('setPet', {
      id: pet.name,
      vp,
      remainHours,
      upvoteValue,
      about,
    });
  },
};

const mutations = {
  setPet({ pets }, { id, vp, remainHours, upvoteValue, about }) {
    const pet = _.find(pets, { id });
    // console.log('mutations.setPet', pets, pet);
    pet.vp = vp;
    pet.remainHours = remainHours;
    pet.upvoteValue = upvoteValue;
    pet.about = about;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
