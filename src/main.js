import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import http from "./api/request"
import animate from "animate.css";
import Velocity from "velocity-animate";


Vue.use(require('vue-cookies'))
Vue.use(ElementUI);
Vue.use(animate);
Vue.config.productionTip = false
Vue.prototype.$http = http


import * as filters from '@/filters/index'
// 导出的是对象，可以直接通过 key 和 value 来获得过滤器的名和过滤器的方法
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')