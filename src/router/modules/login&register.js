let routes = {
  path: '/login&register',
  name: 'login&register',
  component: () => import("../../views/login&register/index.vue"),
  redirect: 'login&register/login',
  children: [{
      path: 'login',
      name: 'login',
      component: () => import("@/views/login&register/login/login.vue"),
      redirect: 'login/phoneLogin',
      children: [{
          path: 'phoneLogin',
          name: 'phoneLogin',
          component: () => import('@/views/login&register/login/phoneLogin.vue'),
        },
        {
          path: 'passLogin',
          name: 'passLogin',
          component: () => import('@/views/login&register/login/passLogin.vue'),
        },
      ]
    },
    {
      path: 'register',
      name: 'register',
      component: () => import("@/views/login&register/register/register.vue"),
    },
    {
      path: 'resetPass',
      name: 'resetPass',
      component: () => import("@/views/login&register/resetPass/resetPass.vue"),
    }
  ]
}
export default routes