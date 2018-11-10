<template>
  <v-container grid-list-lg>
    <v-layout wrap>
      <v-flex xs12 md4>
        <v-layout>
          <v-flex xs12>
            <v-text-field
              v-model="username"
              color="blue darken-3"
              label="username"
              prefix="@"
              prepend-icon="person"
              :loading="loading"
              :error-messages="errorMessages"
              @keydown.enter="load"
              autofocus
              clearable>
                <v-progress-linear v-if="!loading" slot="progress" color="success" height="7"></v-progress-linear>
            </v-text-field>
            <!-- <v-alert :value="true" type="error">This is a error alert.</v-alert> -->
            <v-fab-transition>
              <template v-if="account.userid">
                <v-card>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-avatar>
                        <img :src="'//steemitimages.com/u/' + account.userid + '/avatar'">
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ account.name || account.userid }} <span class='small'>({{ account.reputation }})</span></v-list-tile-title>
                        <v-list-tile-sub-title>
                          <div>@{{ account.userid }}</div>
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-card-title class='pt-2 profile'>
                      <div>· 게시글: {{ account.postCount }} 개</div>
                      <div>· 나이: {{ account.age }} 일 <span class='small'>({{account.created }} 가입)</span></div>
                      <div>
                        · 스팀파워: {{ (account.vestingSteem - account.delegatedVestingSteem + account.receivedVestingShares).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') }} <span class='small'>STEEM</span>
                        <span class='small' v-if="account.delegatedVestingSteem + account.receivedVestingShares">
                          (
                          <span v-if="account.receivedVestingShares">+{{ account.receivedVestingShares.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') }}</span>
                          <span v-if="account.delegatedVestingSteem">-{{ account.delegatedVestingSteem.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') }}</span>
                          )
                        </span>
                      </div>
                    </v-card-title>
                  </v-list>
                </v-card>
              </template>
            </v-fab-transition>
            <div class='mt-3'
              v-if="loading">
              <v-progress-circular
                :size="70"
                :width="7"
                color="purple"
                indeterminate
              ></v-progress-circular>
            </div>
            <v-fab-transition>
              <div v-if="account.userid && ready && !loading">
                <v-subheader class='subheader'>@{{account.userid}}님의 아직 Payout 되지 않은 글</v-subheader>
                <v-card>
                  <v-card-text v-if="!blogs.length">
                    <div class='empty'>현재 보팅해줄 수 있는 게시글이 없습니다.</div>
                  </v-card-text>
                  <v-list two-line v-if="blogs.length">
                    <template v-for="(blog, index) in blogs">
                      <v-list-tile :key="blog.id">
                        <v-list-tile-content>
                          <v-list-tile-title>
                            <a :href="'https://steemit.com/@' + blog.author + '/' + blog.permlink" onclick="return !window.open(this.href)">{{ blog.title }}</a>
                          </v-list-tile-title>
                          <v-list-tile-sub-title class="text--primary">{{ blog.body }}</v-list-tile-sub-title>
                          <div>
                            <template v-for="vote in blog.active_votes">
                              <v-chip color="primary" :class="vote.color" dark small text-color="white" :key='vote.time'>{{vote.name}}</v-chip>
                            </template>
                          </div>
                          <!-- <v-list-tile-sub-title class='small'>{{ blog.net_votes }} 보팅 · {{ blog.children }} 댓글</v-list-tile-sub-title> -->
                          <v-list-tile-sub-title>
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-list-tile-action-text>{{ blog.created | filterCreated }}</v-list-tile-action-text>
                          <v-spacer></v-spacer>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-divider v-if="index + 1 < blogs.length" :key="index"></v-divider>
                  </template>
                  </v-list>
                </v-card>
              </div>
            </v-fab-transition>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 md8>
        <PetsPanel :logPet="logPet" :appid="appid"></PetsPanel>
        <HistoryPanel :logPet="logPet" :appid="appid"></HistoryPanel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from 'lodash';
import steem from 'steem';

import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'Main',
  data() {
    return {
      appid: 'anpigon_pets_vote',
      version: '0.0.1',
      ready: false,
      username: window.localStorage.getItem('un') || '',
      loading: false,
      errorMessages: [],
      server: {
        code: '',
        status: '',
        ok: false,
      },
      priceKRW: 0,
      // pets,
    };
  },
  computed: {
    ...mapState('global', ['global']),
    ...mapState('pets', ['pets']),
    ...mapState('account', ['account']),
    logPet() {
      return this.pets[1];
    },
    blogs() {
      // const petsid = this.pet.map(({id}) => id);
      // this.blogs.map(e => {
      //   e.active_votes, pet.id
      // });
      // _.find(e.active_votes, 'active')
      return this.$store.state.account.blogs;
    }
  },
  components: {
    PetsPanel: () => (import('@/components/panels/PetsPanel')),
    HistoryPanel: () => (import('@/components/panels/HistoryPanel')),
  },
  watch: {
    username(v) {
      // const { account } = this.$options.data();
      // this.account = account;
      this.init();
      if (!steem.utils.validateAccountName((v || "").trim())) {
        // this.init();
        // window.localStorage.removeItem('un');
        this.load();
      }
    },
  },
  // 초기 데이터 로딩
  async beforeCreate() {
    // global 조회
    await Promise.all([
      this.$steem.api.getDynamicGlobalPropertiesAsync(),
      this.$steem.api.getRewardFundAsync('post'),
      this.$steem.api.getCurrentMedianHistoryPriceAsync(),
      this.$http.get('https://api.coinmarketcap.com/v2/ticker/1312/?convert=KRW').then(d => d.data),
    ]).then(([global, rewardFund, price, coin]) => {
      this.setGlobal({ global, rewardFund, price, coin });
    });

    // await this.loadPets()
    for (let i = 0, l = this.pets.length; i < l; i++) {
      const [pet] = await this.$steem.api.getAccountsAsync([this.pets[i].id]);
      this.setPet(pet);
    }
  },
  created() {
    // console.log('********** this.$store', this.$store);
    // setTimeout(() => {
    //   const petsid = this.pets.map(({id}) => ({voter: id}));
    //   console.log('********** petsid', petsid);
    //   console.log('********** blogs', this.$store.state.account.blogs);
    //   this.$store.state.account.blogs.map(e => {
    //     console.log('********** find', _.find(e.active_votes, petsid));
    //     return e;
    //   });
    // }, 1000);
      // _.find(e.active_votes, 'active')
    if (this.username) {
      this.load();
    }

     // op 모니터링한다.
    this.$steem.api.streamOperations((e, [id, r]) => {
      if (e) return console.log(e);
      if (id === "custom_json" && r.id === this.appid) {
        console.log(r);
        // a.unshift(1);
        this.addHistory({
          timestamp: new Date().toISOString().slice(0, -1),
          ...JSON.parse(r.json)
        });
      }
      // 펫이 보팅한 경우 펫정보 업데이트
      if (id === "vote" && this.pets.map(e=>e.id).includes(r.voter)) {
        // console.log(r);
        // if (this.pets.map(e=>e.id).includes(r.voter)) {
        this.$steem.api.getAccountsAsync([r.voter])
          .then(([pet]) => {
            this.setPet(pet);
          });
        // }
        // if(r.author === this.account.userid)
      }
    });
  },
  methods: {
    ...mapActions('global', ['setGlobal']),
    ...mapActions('pets', ['setPet']),
    ...mapActions('account', ['setBlogs', 'setAccount']),
    ...mapMutations('account', ['init']),
    ...mapActions('history', ['addHistory']),
    // isVoted(activeVotes, voter) {
    //   return activeVotes.map(e => e.voter).includes(voter);
    // },
    load: _.debounce(
      async function () {
        this.loading = true;
        window.localStorage.removeItem('un');
        // const options = this.$options.data();
        // this.account = options.account;
        // // this.blogs = blogs;
        // this.setBlogs([]);

        this.username = (this.username || '').trim();
        const lookupResults = await steem.api.lookupAccountsAsync(this.username, 1);
        if (!lookupResults.includes(this.username)) {
          this.loading = false;
          this.errorMessages = ['사용자를 찾을 수 없습니다.'];
          // window.localStorage.removeItem('un');
          return;
        }

        window.localStorage.setItem('un', this.username);
        this.errorMessages = [];

        const [account] = await steem.api.getAccountsAsync([this.username]);
        this.setAccount(account);

        const query = {
          tag: this.account.userid,
          limit: 100,
        };
        console.log('query', query);
        this.setBlogs(await this.$steem.api.getDiscussionsByBlogAsync(query));

        this.ready = true;
        this.loading = false;
      },
      500, // 사용자가 입력을 기다리는 시간(밀리세컨드) 입니다.
    ),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.small, .xsmall {
  font-size: 0.9rem;
  color: #555;
}
.xsmall {
  font-size: 0.8rem;
}
.profile div {
  display: block;
  width: 100%;
  text-align: left;
}
.clear:after {
  display: block;
  clear: both;
  content: ' ';
}
.subheader {
  padding-left: 4px!important;
  margin-top: 8px!important;
  height: 40px;
}
.subheader.title {
  padding-top: 10px;
}
.empty{
  height: 48px;
  font-size: 14px;
  padding-top: 14px;
  color: #777;
}
body {
  background-color: #efefef;
}
@media only screen and (min-width: 960px) and (max-width: 1264px) {
  .container {
    max-width: 100%!important;
  }
}
</style>
<style scoped>
a {
  font-weight: 900;
}
</style>
