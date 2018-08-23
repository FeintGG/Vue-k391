import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import routes from './routes';

import axios from 'axios';
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios'

// console.log(axios);


Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueAxios, axios)

const router = new VueRouter({
  routes: routes,
  mode: 'hash'
});


Vue.mixin({
  data(){
    return {
      get globalUrlPrefix(){
        return "http://localhost:3000";
      }
    }
  }
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
