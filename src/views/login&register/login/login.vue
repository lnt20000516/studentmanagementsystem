<template>
  <div>
    <div class="tab">
      <span :class="{tab_item:true, active:isActive==1?true:false }" @click="phoneLogin()">短信登录</span>
      <span :class="{tab_item:true, active:isActive==2?true:false }" @click="passLogin()">密码登录</span>
    </div>
    <div class="loginMain">
      <router-view></router-view>
    </div>
    <el-divider>
      <p style="color: #ccc; font-size: 13px;">第三方登录方式</p>
    </el-divider>
    <div class="outher">
      <el-tooltip class="item" effect="dark" content="开发中..." placement="top-end">
        <qq-svg class="svg"></qq-svg>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="开发中..." placement="top">
        <we-chat class="svg"></we-chat>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="开发中..." placement="top-start">
        <wei-bo class="svg"></wei-bo>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import qqSvg from "@/assets/svg/login/qqSvg";
import weChat from "@/assets/svg/login/weChat";
import weiBo from "@/assets/svg/login/weibo";
export default {
  components: {
    qqSvg,
    weChat,
    weiBo,
  },
  created() {
    const path = this.$route.path;
    if (path.indexOf("passLogin") >= 0) {
      this.isActive = 2;
    } else if (path.indexOf("phoneLogin")) {
      this.isActive = 1;
    }
  },
  data() {
    return {
      isActive: 1,
    };
  },
  methods: {
    phoneLogin() {
      this.isActive = 1;
      this.$router.replace("phoneLogin");
    },
    passLogin() {
      this.isActive = 2;
      this.$router.replace("passLogin");
    },
  },
};
</script>
<style >
.loginMain {
  width: 100%;
}
.outher {
  display: flex;
  justify-content: center;
}
.outher .svg {
  margin: 0px 20px 0px 20px;
  cursor: pointer;
}
.tab {
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}
.tab .tab_item {
  text-align: center;
  width: 50%;
  height: 30px;
  cursor: pointer;
}
.tab a {
  text-decoration: none;
  color: #000;
}
.tab .active {
  border-bottom: 1px solid #409eff;
}
</style>