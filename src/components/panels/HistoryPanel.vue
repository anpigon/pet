<template>
  <div class='history'>
    <v-subheader class='subheader'>펫이 보팅 해준 글</v-subheader>
    <div class='mt-3' v-if="loading">
      <v-progress-circular
        :size="70"
        :width="7"
        color="purple"
        indeterminate
      ></v-progress-circular>
    </div>
    <v-fab-transition>
      <v-card v-if="!loading">
        <v-list two-line>
          <template v-for="(h, index) in history">
            <v-list-tile :key="h.id">
              <v-list-tile-content>
                <v-list-tile-title>
                  <a :href="'https://steemit.com/@' + h.author + '/' + h.permlink" onclick="return !window.open(this.href)">{{ h.title }}</a>
                </v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">{{ h.body }}</v-list-tile-sub-title>
                <v-list-tile-sub-title>
                  by <a :href="'https://steemit.com/@' + h.author" onclick="return !window.open(this.href)">@{{ h.author }}</a>
                </v-list-tile-sub-title>
                <!-- <div>
                  <v-chip color="primary" small text-color="white">Primary</v-chip>
                  <v-chip color="primary" small text-color="white">Primary</v-chip>
                </div> -->
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ h.timestamp | filterCreated }}</v-list-tile-action-text>
                <v-spacer></v-spacer>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index + 1 < history.length" :key="index"></v-divider>
        </template>
        </v-list>
      </v-card>
    </v-fab-transition>
  </div>
</template>
<script>
import _ from 'lodash';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'HistoryPanel',
  props: ['logPet', 'appid'],
  data() {
    return {
      loading: true,
      next: -1,
      // his: [],
    };
  },
  computed: {
    ...mapState('history', ['history']),
    today() {
      return new Date(`${new Date().toDateString()} 00`);
    },
  },
  created() {
    this.loadHistory();
    // console.log('history', d)
  },
  methods: {
    ...mapActions('history', ['setHistory']),
    async loadHistory() {
      // const id = 'guest123';
      this.loading = true;
      // console.log(this.logPet.id, this.appid);
      const his = await this.$steem.api.getAccountHistoryAsync(this.logPet.id, this.next, 1000)
        .then(r => r.filter(([, e]) => (e.op[0] === 'custom_json') && e.op[1].id === this.appid))
        .then(r => r.map(([, e]) => ({
          timestamp: e.timestamp,
          ...JSON.parse(e.op[1].json),
        })));
      // console.log(_.uniqWith(his, (a, b) => (a.permlink === b.permlink && a.author === b.author)));
      console.log('★★★★★★ History:', his);
      this.setHistory(_.uniqWith(his, (a, b) => (a.permlink === b.permlink && a.author === b.author)).reverse());
      this.loading = false;
    },
  },
};
</script>
<style scoped>
a {
  font-weight: 900;
}
</style>
