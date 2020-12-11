import Vue from 'vue'
import VueRouter from 'vue-router'
import cookies from 'vue-cookies'

import signIn from "./modules/login&register"
import manager from "./modules/manager"
import teacher from "./modules/teacher"
import store from '@/store'
Vue.use(VueRouter)

const baseRoutes = [{
    path: '/',
    name: 'Home',
    redirect: '/login&register'
  },
  {
    path: '/404',
    name: '404',
    component: () => import("@/views/error/404Page.vue"),
  },

];
const error = {
  path: '*',
  name: '404',
  component: () => import("@/views/error/404Page.vue"),
}
// http://192.168.19.156:8080/manager/administratorsMenu
const routes = baseRoutes.concat([signIn, manager, teacher, error]);

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});

//配置路由导航守卫

router.beforeEach((to, from, next) => {
  const token = cookies.isKey("token");
  if (!to.matched.some(record => record.meta.needLogin)) {
    next() //如果路由中有meta的needLogin，且为true，就进行登录验证，否则不进行登录验证
  } else {
    if (token) {
      next()
    } else {
      if (to.path.indexOf("login&register") >= 0) {
        next()
      } else {
        next({
          path: '/login&register/login'
        })
      }
    }
  }
  let role = null
  if (cookies.get("userInfo")) {
    role = cookies.get("userInfo").role;
  }
  window.sessionStorage.setItem("fromPath", from.path);
  if (to.path.indexOf("stuIndex") >= 0) {
    if (role === 1) {
      next();
    } else {
      next({
        path: '/404'
      })
    }
    return
  }

  if (to.path.indexOf("teachIndex") >= 0) {
    if (role === 0) {
      next();
    } else {
      next({
        path: '/404'
      })
    }
    return
  }
  if (to.path.indexOf("manager") >= 0) {
    const admin = ["/manager/administratorsMenu", "/manager/schoolMenu"];
    if (role === -1 || role === -2) {
      if (admin.includes(to.path)) {
        if (role === -1) {
          next();
        } else {
          next({
            path: '/404'
          })
        }
      }
      next();
    } else {
      next({
        path: '/404'
      })
    }
    return
  }
})
export default router;