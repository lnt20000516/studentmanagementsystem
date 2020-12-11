<template>
  <div class="index-header flex-row">
    <div class="left">
      <img
        src="../../assets/img/logo2.png"
        alt=""
        width="130vw"
        height="50vh"
      />
    </div>
    <div class="right flex-row">
      <router-link
        v-for="(item, index) in menuTitle"
        :key="index"
        :to="item.route"
        class="menu-item"
        >{{ item.title }}
      </router-link>
      <div class="avatar flex-row">
        <img :src="user.avatar" alt="" width="50px" height="50px" />
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人主页</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuTitle: [
        {
          title: "首页",
          route: "/teacher",
        },
        {
          title: "学生",
          route: "/teacher/myStudent",
        },
        {
          title: "课程",
          route: "/teacher",
        },
        {
          title: "课程表",
          route: "/teacher",
        },
        {
          title: "家长",
          route: "/teacher",
        },
        {
          title: "作业",
          route: "/teacher",
        },
      ],
      user: {
        avatar: require("@/assets/img/test.jpg"),
        name: "lnt",
      },
    };
  },
};
</script>
<style scoped lang='scss'>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.index-header {
  justify-content: space-between;
  width: 80%;
  margin: 0 auto;
  a {
    text-decoration: none;
    outline: none;
  }
  .right {
    .menu-item {
      font-weight: 700;
      font-size: 14px;
      color: #111;
      padding-left: 18px !important;
      padding-right: 18px !important;
    }
    .menu-item:hover {
      color: #6610f2;
    }
    .avatar {
      img {
        border-radius: 50%;
        margin-left: 20px;
        margin-right: 10px;
      }
      .el-dropdown-link {
        cursor: pointer;
      }
    }
  }
}
</style>