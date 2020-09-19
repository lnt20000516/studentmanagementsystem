<template>
  <div>
    <el-container>
      <el-aside :class="[{'open':!isOpen}]">
        <div class="index-menu">
          <div class="header">
            <img src="../../assets/img/logo.png" width="40px" height="40px" />
            <div @click="open" v-show="showSvg">
              <menu-close style="cursor: pointer;" v-show="isOpen"></menu-close>
              <menu-open style="cursor: pointer;" v-show="!isOpen"></menu-open>
            </div>
          </div>
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            active-text-color="#fff"
            background-color="#2B2F3A"
            text-color="#8991A9"
            style="border-right:none"
            router
          >
            <el-submenu index="schoolManager">
              <template slot="title">
                <i>
                  <school-manager></school-manager>
                </i>
                <span>学校管理</span>
              </template>
              <el-menu-item index="schoolMenu">
                <template slot="title">
                  <i>
                    <stu-menu></stu-menu>
                  </i>
                  <span>所有学校</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="classManager">
              <template slot="title">
                <i>
                  <class-manager></class-manager>
                </i>
                <span>班级管理</span>
              </template>
              <el-menu-item index="classMenu">
                <template slot="title">
                  <i>
                    <stu-menu></stu-menu>
                  </i>
                  <span>所有班级</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="teacher">
              <template slot="title">
                <i>
                  <teach-manager></teach-manager>
                </i>
                <span>教师管理</span>
              </template>
              <el-menu-item index="teachersMenu">
                <template slot="title">
                  <i>
                    <stu-menu></stu-menu>
                  </i>
                  <span>教师名单</span>
                </template>
              </el-menu-item>
              <el-menu-item index="teachersAdd">
                <template slot="title">
                  <i>
                    <stu-add></stu-add>
                  </i>
                  <span>添加老师</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="student">
              <template slot="title">
                <i>
                  <manager-svg></manager-svg>
                </i>
                <span>学生管理</span>
              </template>
              <el-menu-item index="studentsMenu">
                <template slot="title">
                  <i>
                    <stu-menu></stu-menu>
                  </i>
                  <span>学生名单</span>
                </template>
              </el-menu-item>
              <el-menu-item index="studentsAdd">
                <template slot="title">
                  <i>
                    <stu-add></stu-add>
                  </i>
                  <span>添加学生</span>
                </template>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="clockManager">
              <template slot="title">
                <i>
                  <clock-svg></clock-svg>
                </i>
                <span>打卡管理</span>
              </template>
              <el-menu-item index="schoolRecord">
                <template slot="title">
                  <i>
                    <clock-record></clock-record>
                  </i>
                  <span>到校打卡记录</span>
                </template>
              </el-menu-item>
              <el-menu-item index="homeRecord">
                <template slot="title">
                  <i>
                    <clock-record></clock-record>
                  </i>
                  <span>到家打卡记录</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <div :class="[{'margin-left':isOpen}]">
            <img src="../../assets/img/logo2.png" alt width="150px" height="50px" />
          </div>
          <div class="head-right dl">
            <img
              :src="userDetails.user_details.avatar"
              width="50px"
              height="50px"
              @click="showDlog=true"
              class="dl"
            />
            <div class="head-dialog animate__animated animate__flipInY dl" v-show="showDlog">
              <div class="dialog-top dl">
                <img :src="userDetails.user_details.avatar" width="40px" height="40px" class="dl" />
                <p
                  style="white-space: nowrap;overflow: hidden;text-overflow:ellipsis;"
                  class="dl"
                >{{userDetails.user_details.name}}</p>
              </div>
              <ul class="dl">
                <li class="dl" v-waves>
                  <sex-svg class="dl"></sex-svg>
                  <p class="dl">{{userDetails.user_details.sex}}</p>
                </li>
                <li class="dl" v-waves>
                  <phone-svg class="dl"></phone-svg>
                  <p class="dl">{{userDetails.phone_number}}</p>
                </li>
                <li @click="loginOut" class="dl" v-waves>
                  <off-svg class="dl"></off-svg>
                  <p class="dl">退出登录</p>
                </li>
              </ul>
            </div>
          </div>
        </el-header>
        <el-main :class="[{'margin-left':isOpen}]" :style="{height:maxHeight+'px'}">
          <router-view class="animate__animated animate__zoomIn" style="animation-duration: 700ms"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template> 
<script>
import menuSvg from "@/assets/svg/managerIndexSvg/menu";
import managerSvg from "@/assets/svg/managerIndexMenuSvg/manager";
import stuMenu from "@/assets/svg/managerIndexMenuSvg/stuMenu";
import stuAdd from "@/assets/svg/managerIndexMenuSvg/stuAdd";
import teachManager from "@/assets/svg/managerIndexMenuSvg/teachManager";
import clockSvg from "@/assets/svg/managerIndexMenuSvg/clock";
import clockRecord from "@/assets/svg/managerIndexMenuSvg/clockRecord";
import classManager from "@/assets/svg/managerIndexMenuSvg/classManager";
import schoolManager from "@/assets/svg/managerIndexMenuSvg/schoolManager";
import menuClose from "@/assets/svg/managerIndexMenuSvg/menuClose";
import menuOpen from "@/assets/svg/managerIndexMenuSvg/menuOpen";
import sexSvg from "@/assets/svg/managerIndexSvg/sex";
import phoneSvg from "@/assets/svg/managerIndexSvg/phone";
import offSvg from "@/assets/svg/off";
import waves from "@/directive/waves/index.js";
export default {
  components: {
    menuSvg,
    managerSvg,
    stuMenu,
    stuAdd,
    teachManager,
    clockSvg,
    clockRecord,
    classManager,
    schoolManager,
    menuClose,
    menuOpen,
    sexSvg,
    phoneSvg,
    offSvg,
  },
  data() {
    return {
      activeMenu: "studentsMenu",
      isCollapse: true,
      isOpen: true,
      showSvg: false,
      maxHeight: 0,
      showDlog: false,
      userDetails: {},
    };
  },
  directives: {
    waves,
  },
  created() {
    this.activeMenu = this.$route.name;
    this.userDetails = this.$store.state.userInfo;
    if (this.userDetails.user_details.sex == 1)
      this.userDetails.user_details.sex = "男";
    if (this.userDetails.user_details.sex == -1)
      this.userDetails.user_details.sex = "女";
    if (this.userDetails.user_details.sex == 0)
      this.userDetails.user_details.sex = "保密";
  },
  mounted() {
    this.resize();
    document.body.onmouseover = (e) => {
      if (this.isOpen) {
        let flag = false;
        e.path.forEach((item) => {
          if (
            item.classList &&
            item.classList.value.indexOf("index-menu") >= 0
          ) {
            flag = true;
          }
        });
        this.isCollapse = !flag;
        this.showSvg = flag;
      } else {
        this.isCollapse = false;
      }
    };
    document.body.onclick = (e) => {
      let t = false;
      e.target.classList.forEach((item) => {
        if (item.indexOf("dl") >= 0) {
          t = true;
        }
      });
      this.showDlog = t;
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.activeMenu = val.name;
      },
      // 深度观察监听
      deep: true,
    },
    screenSize(newVal) {
      this.resize();
    },
  },
  methods: {
    handleMenu() {
      this.isCollapse = !this.isCollapse;
    },
    loginOut() {
      this.$cookies.remove("token");
      this.$cookies.remove("userInfo");
      this.$router.replace("/login&register/login");
    },
    open() {
      this.isOpen = !this.isOpen;
    },
    resize() {
      const maxW = this.screenSize.maxW;
      const maxH = this.screenSize.maxH;
      this.maxHeight = 660;
    },
  },
  computed: {
    screenSize() {
      return this.$store.state.screenWH;
    },
  },
};
</script>
<style lang="scss">
.el-header {
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #fff;
  z-index: 1000;
  box-shadow: 0 1px 15px 1px rgba(69, 65, 78, 0.1);
  transition: all 0.3s ease-in;
  .head-right {
    height: 100%;
    width: 60px;
    // background-color: #000;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    img {
      border-radius: 100%;
    }
    .head-dialog {
      width: 150px;
      padding-bottom: 10px;
      background-color: #000;
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 1000;
      min-width: 10rem;
      margin: 0.125rem 0 0;
      font-size: 0.875rem;
      color: #212529;
      text-align: left;
      background-color: #fff;
      box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.1);
      .dialog-top {
        height: 50px;
        background-color: rgb(117, 97, 238);
        display: flex;
        font-display: row;
        align-items: center;
        justify-content: center;
        padding: 0px 10px;
        p {
          font-size: 16px;
          font-weight: 400;
          color: #fff;
          margin-left: 10px;
        }
      }
    }
    ul {
      padding: 5px 0;
      li {
        font-size: 0.5rem;
        color: #7d7d80;
        font-weight: 600;
        line-height: 2.5;
        padding-left: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        svg {
          margin-right: 10px;
        }
      }
      li:hover {
        background-color: rgb(248, 249, 250);
      }
    }
  }
}
li {
  list-style: none;
}
.el-aside {
  text-align: center;
  width: auto !important;
  position: absolute;
  margin-top: 5px;
  z-index: 20000;
  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  .index-menu {
    background-color: #1e2128;
    min-height: 716px;
    .header {
      box-sizing: border-box;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
    }
    i {
      margin-right: 10px;
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }
}
.open {
  position: relative !important;
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px !important;
    overflow: hidden;
  }
}
.el-main {
  padding: 20px;
  background-color: rgb(237, 241, 245);
  transition: all 0.3s ease-in;
  // overflow: hidden;
}
.margin-left {
  margin-left: 65px;
}
.el-header .head-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.el-header .head-left p {
  font-weight: 900;
}
.el-header .head-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}
@media screen and (max-width: 500px) {
  .show {
    display: none;
  }
}
</style>