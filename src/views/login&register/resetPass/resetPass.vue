<template>
  <div>
    <div class="return">
      <left-svg></left-svg>
      <a href="login">返回登录</a>
    </div>

    <div class="reset_form" style="margin-top:50px">
      <el-form :model="resForm" :rules="rules" ref="resForm">
        <el-form-item prop="phone">
          <el-input v-model="resForm.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="resForm.code" placeholder="验证码">
            <template slot="append">
              <span :class="{code:true,disabled:!this.canClick}" @click="countDown()">{{content}}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input v-model="resForm.pass" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item prop="pass2">
          <el-input v-model="resForm.pass2" placeholder="确认密码" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('resForm')">立即创建</el-button>
          <el-button @click="resetForm('resForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import leftSvg from "@/assets/svg/left";
export default {
  data() {
    let passRuel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      }
      let reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/;
      if (!reg.test(value)) {
        callback(new Error("密码包含 数字,英文,字符中的两种以上，长度6-20"));
      } else {
        callback();
      }
    };
    let pass2Ruel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      }
      if (value != this.resForm.pass) {
        callback(new Error("两次密码不一致"));
      }
    };
    let phoneRuel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话号码"));
      }
      let reg = /^1[3456789]\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error("电话号码格式错误"));
      }
    };
    let codeRuel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      }
      let reqCode = 123;
      if (value != reqCode) {
        callback(new Error("验证码错误"));
      }
    };
    return {
      resForm: {
        pass: "",
        pass2: "",
        phone: "",
        code: "",
      },
      rules: {
        pass: [{ validator: passRuel, trigger: "blur" }],
        pass2: [{ validator: pass2Ruel, trigger: "blur" }],
        phone: [{ validator: phoneRuel, trigger: "blur" }],
        code: [{ validator: codeRuel, trigger: "blur" }],
      },
      content: "发送验证码", // 按钮里显示的内容
      totalTime: 60, //记录具体倒计时时间
      canClick: true, //添加canClick
    };
  },
  components: {
    leftSvg,
  },
  methods: {
    countDown() {
      if (!this.canClick) return;
      if (!/^1[3456789]\d{9}$/.test(this.resForm.phone)) {
        this.$message.error("手机号格式错误");
        return;
      }
      this.canClick = false;
      this.content = this.totalTime + "s后重新发送";
      let clock = window.setInterval(() => {
        this.totalTime--;
        this.content = this.totalTime + "s后重新发送";
        if (this.totalTime < 0) {
          window.clearInterval(clock);
          this.content = "重新发送验证码";
          this.totalTime = 10;
          this.canClick = true; //这里重新开启
        }
      }, 1000);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$alert("修改密码成功，返回登录", {
            confirmButtonText: "确定",
            callback: (action) => {
              this.$router.replace("/login");
            },
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toLogin() {},
  },
};
</script>
<style scoped>
.return {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.return a {
  text-decoration: none;
  color: #2c2c2c;
  margin-left: 10px;
}
.return a:hover {
  color: #409eff;
}
.code {
  cursor: pointer;
  color: #409eff;
}
.disabled {
  cursor: not-allowed;
}
</style>