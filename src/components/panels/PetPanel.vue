<template>
  <v-card class='pet-info'>
    <v-card-text class='pt-1'>
      <div :class="{'triangle-border':true, 'scale-animaion':animaion}" v-html='message'></div>
      <div :class="{'pet-image': true, 'shake-animaion': petAnimaion }" @click.stop="petClick">
        <img :src='pet.img'>
        <div v-if="pet.id === 'ned'" class='star'>
          <v-icon dark>stars</v-icon> 특별 관리 대상
        </div>
      </div>
      <div :class="pet.color + ' pet-name'">{{ pet.name }}</div>
    </v-card-text>
    <v-card-text class='pt-0 pb-0'>
      <v-progress-circular :size="100" :width="15" color="teal" :value="pet.vp">파워<br>{{ pet.vp }}%</v-progress-circular>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <template v-if="ready">
        <template v-if="pet.wifs.length">
          <v-btn
            color="info"
            class='amber darken-4'
            @click.prevent="feed"
            :disabled="!ready"
            small dark 
            :loading='busy'>보팅받기</v-btn>
        </template>
        <template v-if="!pet.wifs.length">
          <v-btn
            color="info"
            class='blue darken-1'
            onclick="window.open('https://steemit.com/@ned')"
            small dark>방문하기</v-btn>
        </template>
      </template>
      <template v-if="!ready">
        <v-btn :disabled="true" :loading="true" small>보팅받기</v-btn>
      </template>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>
<script>
import steem from 'steem';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'PetPanel',
  props: ['pet', 'logPet', 'appid'],
  data() {
    return {
      busy: false,
      error: null,
      showHello: true,
      animaion: false,
      petAnimaion: false,
    };
  },
  watch: {
    'message': function() {
      this.animaion = true;
      // console.log('효과를 주자', this.animaion);
      setTimeout(() => {this.animaion = false}, 500);
    },
  },
  created() {
    this.hello();
  },
  computed: {
    ...mapState('global', ['global']),
    ...mapState('account', ['account', 'blogs']),
    ...mapState('history', ['history']),
    // elapsedSeconds() {
    //   return Date.now() - this.created;
    // },
    ready() {
      return (this.pet.upvoteValue > 0) && !this.wait;
    },
    message() {
      if (this.error) {
        return `<span class='small'>${this.error}</span>`;
      } else if (!this.pet.vp) {
        return `<span class='small'>${this.pet.message}</span>`;
      } else if (this.pet.vp < 10) {
        return `<span class='small'>나 지금 보팅 파워가</span> <b>${this.pet.vp}%</b><span class='small'>야.<br>다음에 이용해 줄래?</span>`;
      } else if (this.showHello) {
        return `<span class='small'>${this.pet.message}</span>`;
      }
      // return this.pet.upvoteValue.toFixed(3);
      // console.log(`<span class='small'>내 보팅 금액은</span> <b>${this.pet.upvoteValue.toFixed(3)}</b><span class='small'>이고, </span><br><span class='small'>한국돈으로는 </span> <b>${(this.pet.upvoteValue * this.global.priceKRW).toFixed(1)}원</b><span class='small'>이야~</span>`)
      const upvoteValue = parseFloat(this.pet.upvoteValue);
      const priceKRW = parseFloat(this.pet.upvoteValue * this.global.priceKRW);
      return `<span class='small'>내 보팅 금액은</span> <b>\$${upvoteValue > 1? upvoteValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : upvoteValue.toFixed(4).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</b><span class='small'>이고, </span>
        <br><span class='small'>한국돈으로는 </span> <b>${priceKRW > 1000? Math.round(priceKRW).toLocaleString() : priceKRW.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}원</b><span class='small'>이야~</span>`;
    },
  },
  methods: {
    ...mapActions('pets', ['setPet']),
    ...mapActions('account', ['setBlogs']),
    hello() {
      this.showHello = true;
      setTimeout(() => {
        this.showHello = false;
        // this.petAnimaion = false;
      }, 5000);
    },
    petClick() {
      this.petAnimaion = true;
      this.hello();
      setTimeout(() => {
        this.petAnimaion = false;
      }, 1000);
    },
    async feed() {
      // console.log(this.account.userid)
      // console.log(this.history.filter(h => (h.voter === this.pet.id)))
      const find = this.history.filter(h => {
        if (h.voter === this.pet.id && h.author === this.account.userid) {
          const now = Date.now();
          const timestamp = new Date(`${h.timestamp}Z`);
          const elapsedSeconds = (now - timestamp) / 1000;
          if (elapsedSeconds < (60 * 60 * 20)) {
            return true;
          }
        }
        return false;
      });
      console.log(find)
      if (find.length) {
        console.log('오늘 보팅 받았어.');
        this.error = '하루에 한번만 이용할 수 있어요.<br>다음에 이용해 주세요~';
        this.busy = false;
        return;
      }

      // console.log('feed', pet);
      this.busy = true;
      // let blog = this.blogs[Math.floor(Math.random() * this.blogs.length)]
      // let blogs = this.blogs.filter(e => !this.isVoted(e.active_votes, pet.id));
      // 사용자가 작성한 글 중에서 보팅 가능한 글 찾기
      const blogs = this.blogs.filter(e1 => !e1.active_votes.map(e2 => e2.voter).includes(this.pet.id));
      // console.log('선택:', blogs)
      if (blogs.length === 0) {
        console.log('보팅해줄글이엄써');
        this.error = `지금은 <b>${this.pet.name}</b>가 보팅할 수 있는 게시글이 없어요~`;
        this.busy = false;
        return;
      }
      // 보팅할 블로그 선택
      const blog = blogs[Math.floor(Math.random() * blogs.length)];
      console.log('선택:', blog.title);
      // const isVoted = this.isVoted(blog.active_votes, pet.id)
      // console.log('isVoted:', isVoted ? '이미 보팅 완료' : '보팅 해도됨')
      // if (!isVoted) {
      console.log('보팅');
      const { id, wifs } = this.pet; // 댓글을 남길 펫
      // await this.comment(id, wif, { title: blog.title, permlink: blog.permlink, author: blog.author, });
      const data = { 
        title: blog.title, 
        permlink: blog.permlink, 
        author: blog.author, 
        body: blog.body.slice(0, 200), 
        created: blog.created, 
        voter: id
      };
      await Promise.all([
        steem.broadcast.sendAsync({
          extensions: [],
          operations: [
            ['custom_json', {
              required_auths: [],
              required_posting_auths: [this.logPet.id],
              id: this.appid,
              json: JSON.stringify(data),
            }],
          ]}, this.logPet.wifs),
        steem.broadcast.sendAsync({
          extensions: [],
          operations: [
            ['vote', {
              voter: id,
              author: blog.author,
              permlink: blog.permlink,
              weight: 10000,
            }],
          ] }, wifs),
      ]).then(([custom, vote]) => {
        console.log('custom', custom);
        console.log('vote', vote);
        // 1. 펫 업데이트
        // 2. 사용자 블로그 게시글 업데이트
        // 3. 보팅 내역 업데이트

        const query = {
          tag: this.account.userid,
          limit: 100,
        };
        // Promise.all([
        //   this.$steem.api.getAccountsAsync([id]),
        //   this.$steem.api.getDiscussionsByBlogAsync(query),
        // ]).then(([pet, blog]) => {
        //   this.setPet(pet);
        //   this.setBlogs(blog);
        // });
        // this.$steem.api.getAccountsAsync([id]).then(pet => {
        //   this.setPet(pet);
        // });
        this.$steem.api.getDiscussionsByBlogAsync(query).then(blog => {
          this.setBlogs(blog);
        });
        
        this.error = '';
      });
      // }
      this.busy = false;
    },
  },
};
</script>

