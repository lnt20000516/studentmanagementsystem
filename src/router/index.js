import Vue from 'vue'
import VueRouter from 'vue-router'
import cookies from 'vue-cookies'

import signIn from "./modules/login&register"
import manager from "./modules/manager"
Vue.use(VueRouter)

const baseRoutes = {
  path: '/',
  name: 'Home',
  redirect: '/login&register'
};
const routes = [baseRoutes, signIn, manager];
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;