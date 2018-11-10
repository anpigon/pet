<template>
  <div id="app">
    <v-toolbar color="blue darken-2" dark app fixed dense>
      <v-icon>pets</v-icon>
      <v-toolbar-title>스팀잇 펫 연구소</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-toolbar-items>
        <v-btn flat>히스토리</v-btn>
        <v-divider vertical></v-divider>
      </v-toolbar-items> -->
      <v-divider vertical class='mr-4'></v-divider>
      <span>서버 상태 : {{server.status}}</span>
      <!-- <v-icon
        class="ml-3 mr-1"
        small
        :color="server.color">brightness_1</v-icon>  -->
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      server: {
        code: '',
        text: '',
        status: '',
        color: '',
      },
    };
  },
  beforeCreate() {
    this.$http.get('https://api.steemit.com').then((sr) => {
      this.server.code = sr.status;
      this.server.status = sr.data.status;
      if (sr.status === 200 && sr.data.status === 'OK') {
        this.server.color = 'green';
        this.server.ok = true;
        this.server.text = '좋음';
      } else {
        this.server.color = 'orange';
        this.server.ok = false;
        this.server.text = '나쁨';
      }
    }).catch((e) => {
      // console.log(e);
      this.server.status = e.toString();
      this.server.color = 'red';
      this.server.ok = false;
      this.server.text = '에러';
    });
    // try {
    //   const sr = await this.$http.get('https://api.steemit.com')
    //   this.server.code = sr.status;
    //   this.server.status = sr.data.status;
    //   if (sr.status === 200 && sr.data.status === 'OK') {
    //    this.server.color = 'green';
    //     this.server.ok = true;
    //   } else {
    //     this.server.color = 'orange';
    //     this.server.ok = false;
    //   }
    // } catch (e1) {
    //   console.log(e1);
    //   this.server.status = e1.toString();
    //   this.server.color = 'red';
    //   this.server.ok = false;
    // }
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
