<template>
  <div class="phone">
    <div class="in">
      <el-input v-model="user.phone_number" placeholder="手机号"></el-input>
      <el-input v-model="user.code" placeholder="验证码" style="margin-bottom:0">
        <template slot="append">
          <span :class="{code:true,disabled:!this.canClick}" @click="countDown()">{{content}}</span>
        </template>
      </el-input>
      <span style="margin:15px 0 15px 10px;float:right;width:5px;height:20px"></span>
      <el-button type="primary" v-waves @click="login()">登录</el-button>
    </div>
    <div class="btn">
      <span style="width:5px;height:20px"></span>
    </div>
  </div>
</template>
<script>
import * as login from "@/api/login&register/login&register";
import waves from "@/directive/waves/index.js";

export default {
  created() {
    const phone = window.localStorage.getItem("userPhone");
    if (phone) {
      this.user.phone_number = phone;
    }
  },
  directives: {
    waves,
  },
  data() {
    return {
      user: {
        phone_number: "",
        code: "",
      },
      content: "发送验证码", // 按钮里显示的内容
      totalTime: 60, //记录具体倒计时时间
      canClick: true, //添加canClick
    };
  },
  methods: {
    async countDown() {
      if (!this.canClick) return;
      if (!/^1[3456789]\d{9}$/.test(this.user.phone_number)) {
        this.$message.error("手机号格式错误");
        return;
      }
      try {
        const { data: res } = await this.$http.post("user/sendCode", {
          phone_number: this.user.phone_number,
        });
        this.$message.success(res.message);
      } catch (err) {
        console.log(err);
      }

      this.canClick = false;
      this.content = this.totalTime + "s后重新发送";
      let clock = window.setInterval(() => {
        this.totalTime--;
        this.content = this.totalTime + "s后重新发送";
        if (this.totalTime < 0) {
          window.clearInterval(clock);
          this.content = "重新发送验证码";
          this.totalTime = 60;
          this.canClick = true; //这里重新开启
        }
      }, 1000);
    },
    toRegister() {
      this.$router.replace("/register");
    },
    login() {
      login.phoneLogin(this.user);
    },
  },
};
</script>
<style>
.phone .in {
  margin-bottom: 25px;
}
.phone .in .el-input {
  margin-bottom: 25px;
}

.phone .in .el-button {
  width: 100%;
}

.phone .btn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.el-input-group__append {
  background: none;
  padding: 0 10px 0 10px;
}
.code {
  cursor: pointer;
  color: #409eff;
}
.disabled {
  cursor: not-allowed;
  color: #ddd;
}
</style>