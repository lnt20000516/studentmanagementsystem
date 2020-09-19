<template>
  <div class="bg">
    <div class="box">
      <div class="box_left">
        <div class="text">
          <p class="title">{{title}}</p>
          <p class="name">中小学生管理系统</p>
        </div>
      </div>
      <div class="box_right animate__animated animate__flipInX">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import animate from "animate.css";
export default {
  data() {
    return {
      title: "欢迎登录",
    };
  },
  mounted() {
    if (this.$cookies.isKey("token")) {
      let userInfo = this.$cookies.get("userInfo");
      this.$store.commit("setUserInfo", userInfo);
      switch (userInfo.role) {
        case 1: {
          this.$router.replace("/stuIndex");
          break;
        }
        case 0: {
          this.$router.replace("/teachIndex");
          break;
        }
        case -1: {
          this.$router.replace("/manager");
          break;
        }
        case -2: {
          this.$router.replace("/manager");
          break;
        }
      }
    }
  },
  created() {
    if (this.$route.path === "/login") {
      this.title = "欢迎登录";
    } else if (this.$route.path === "/register") {
      this.title = "欢迎注册";
    } else if (this.$route.path === "/resetPass") {
      this.title = "忘记密码";
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        const url = ["login", "passLogin", "phoneLogin"];
        if (url.includes(val.name)) {
          this.title = "欢迎登录";
        } else if (val.name === "register") {
          this.title = "欢迎注册";
        } else if (val.name === "resetPass") {
          this.title = "忘记密码";
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
};
</script>
<style>
*,
::after,
::before {
  box-sizing: border-box;
}
.bg::before {
  content: "";
  width: 100%;
  height: 100%;
  background: url("../../assets/img/bg.jpg") no-repeat;
  background-size: cover;
  position: absolute;
  left: 0;
  top: 0;
  filter: blur(10px);
  z-index: 1;
}
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 auto;
  width: 65%;
  height: 80%;
  z-index: 20;
  transform: translate(-50%, -50%);
}
.box_left {
  width: 50%;
  height: 100%;
  background-color: rgba(121, 106, 238, 0.7);
  float: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 30px;
  border-radius: 5px 0px 0px 5px;
}
.box_right {
  width: 50%;
  height: 100%;
  background-color: #fff;
  float: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px 50px 20px 50px;
  border-radius: 0px 5px 5px 0px;
}
.box_left .text {
  display: flex;
  flex-direction: column;
}
.box_left .text .title {
  font-size: 45px;
  color: #fff;
  margin: 0;
  font-weight: 800;
}
.box_left .text .name {
  font-size: 18px;
  color: #fff;
  margin: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
@media screen and (max-width: 1000px) {
  .box {
    width: 80%;
    height: 60%;
  }
}
@media screen and (max-width: 500px) {
  .box_left {
    display: none;
  }
  .box_right {
    width: 100%;
  }
  .box {
    width: 100%;
    height: 100%;
  }
  .el-dialog {
    width: 70% !important;
  }
}
</style>