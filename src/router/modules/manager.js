const router = {
  path: '/manager',
  name: 'manager',
  redirect: 'manager/studentsMenu',
  component: () => import("@/views/manager/index.vue"),
  children: [{
      path: 'studentsMenu',
      name: 'studentsMenu',
      component: () => import("@/views/manager/student/stuMenu.vue"),
      meta: {
        needLogin: true
      }
    },
    {
      path: 'studentsAdd',
      name: 'studentsAdd',
      component: () => import("@/views/manager/student/addStudent.vue"),
      meta: {
        needLogin: true
      }
    },
    {
      path: 'schoolMenu',
      name: 'schoolMenu',
      component: () => import("@/views/manager/school/schoolMenu.vue"),
      meta: {
        needLogin: true
      }
    },
    {
      path: 'classMenu',
      name: 'classMenu',
      component: () => import("@/views/manager/class/classMenu.vue"),
      meta: {
        needLogin: true
      }
    },
    {
      path: 'teachersMenu',
      name: 'teachersMenu',
      component: () => import("@/views/manager/teacher/teacherMenu.vue"),
      meta: {
        needLogin: true
      }
    },
    {
      path: 'teachersAdd',
      name: 'teachersAdd',
      component: () => import("@/views/manager/teacher/addTeacher.vue"),
      meta: {
        needLogin: true
      }
    },
    {
      path: 'parentMenu',
      name: 'parentMenu',
      component: () => import("@/views/manager/parent/parentMenu.vue"),
      meta: {
        needLogin: true
      }
    },
    {
      path: 'parentAdd',
      name: 'parentAdd',
      component: () => import("@/views/manager/parent/addParent.vue"),
      meta: {
        needLogin: true
      }
    },
    {
      path: 'administratorsMenu',
      name: 'administratorsMenu',
      component: () => import("@/views/manager/administrators/administratorsMenu"),
      meta: {
        needLogin: true
      }
    }
  ]
}
export default router