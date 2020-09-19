<template>
  <div>
    <div class="in">
      <el-input v-model="user.user_name" placeholder="用户名"></el-input>
      <el-input v-model="user.password" placeholder="密码" show-password style="margin-bottom:0"></el-input>
      <el-checkbox v-model="rememberPass" style="margin:15px 0 15px 0;float:right">记住密码</el-checkbox>
      <el-button type="primary" @click="login()">登录</el-button>
    </div>
    <div class="btn">
      <a
        href="/login&register/resetPass"
        style="font-size:15px;color:#409eff; text-decoration: none;"
      >忘记密码</a>
      <el-tooltip content="用户名为注册时身份证，默认密码为注册时的手机号码，登录后请前往个人中心页面修改密码" placement="bottom" effect="light">
        <p style="font-size:15px;color:#409eff; cursor: default;">默认密码</p>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    let user = window.localStorage.getItem("user");
    if (user) {
      user = user.split("&");
      this.user.user_name = user[1];
      if (user[3] == "true") {
        this.user.password = user[2];
        this.rememberPass = true;
      } else {
        this.rememberPass = false;
      }
    }
  },
  data() {
    return {
      user: {
        user_name: "",
        password: "",
      },
      rememberPass: false,
    };
  },
  methods: {
    login() {
      this.$http
        .post("user/login", this.user)
        .then((res) => {
          let resData = {};
          resData = Object.assign(res.data.role_info, res.data.data);
          this.$cookies.set("token", res.data.data.token, 1 * 60 * 60);
          this.$cookies.set("userInfo", resData, 1 * 60 * 60);
          window.localStorage.setItem(
            "user",
            res.data.data.id +
              "&" +
              this.user.user_name +
              "&" +
              this.user.password +
              "&" +
              this.rememberPass
          );
          window.localStorage.removeItem("userPhone");
          this.$store.commit("setUserInfo", resData);
          switch (res.data.data.role) {
            case 1: {
              this.$router.push("/stuIndex");
              break;
            }
            case 0: {
              this.$router.push("/teachIndex");
              break;
            }
            case -1: {
              this.$router.push("/manager");
              break;
            }
          }
          this.$message.success("登录成功");
        })
        .catch((error) => {
          if (error.response) {
            this.$notify.error({
              title: "错误",
              message: error.response.data.message,
            });
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        });
    },
  },
};
</script>
<style  scoped>
.in {
  margin-bottom: 25px;
}
.in .el-input {
  margin-bottom: 25px;
}

.in .el-button {
  width: 100%;
}

.btn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>