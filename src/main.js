// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import steem from 'steem';
import App from './App';
import router from './router';
import store from './store';
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;

Vue.use(Vuetify);

Vue.prototype.$http = axios;
Vue.prototype.$steem = steem;

// Vue.filter('toFixed', function (v) {
//   console.log('toFixed')
//   if (!v) return 0
//   return parsetFloat(v).toFixed(3)
// });

// 작성일자 표시
Vue.filter('filterCreated', function (value) {
  if (!value) return '';
  const now = new Date()
  const created = new Date(value.toString() + 'Z')
  const elapsedSeconds = (now - created) / 1000 // 경과 시간(초)
  if (elapsedSeconds < 60) {
    return Math.round(elapsedSeconds) + '초 전';
  } else if (elapsedSeconds < 3600) {
    return Math.round(elapsedSeconds / 60) + '분 전';
  } else if (elapsedSeconds < 8640) {
    return Math.round(elapsedSeconds / 3600) + '시간 전';
  } else if (elapsedSeconds < 207360) {
    return '어제';
  } else {
    return `${(now.getFullYear() !== created.getFullYear() ? created.getFullYear() + '년 ' : '')}
                            ${(created.getMonth() + 1)}월
                            ${created.getDate()}일`;
  }
});

Vue.filter('format', function (value) {
  if (!value) return '';
  
  return value.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
