const router = {
  path: '/teacher',
  name: 'teacher',
  component: () => import("@/views/teacher/index.vue"),
  redirect: 'teacher/home',
  children: [{
      path: 'home',
      name: 'home',
      component: () => import("@/views/teacher/home"),
    },
    {
      path: 'myStudent',
      name: 'myStudent',
      component: () => import("@/views/teacher/myStudent"),
    },
  ]
}

export default router