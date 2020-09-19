<template>
  <div>
    <div class="register_form">
      <el-form :model="registerData" :rules="rules" ref="registerData">
        <el-form-item prop="type">
          <el-radio-group v-model="registerData.type">
            <el-radio label="0">老师</el-radio>
            <el-radio label="1">学生</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="school">
          <el-form-item prop="school">
            <el-select v-model="registerData.school" placeholder="请选择学校">
              <el-option
                v-for="item in schools"
                :key="item.id"
                :label="item.school_name"
                :value="item.school_name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="key">
            <el-input v-model="registerData.key" placeholder="注册码"></el-input>
          </el-form-item>
        </div>

        <el-form-item prop="userName">
          <el-input v-model="registerData.userName" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="registerData.name" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input v-model="registerData.pass" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item prop="pass2">
          <el-input v-model="registerData.pass2" placeholder="确认密码" show-password></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="registerData.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="registerData.code" placeholder="验证码">
            <template slot="append">
              <span :class="{code:true,disabled:!this.canClick}" @click="countDown()">{{content}}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('registerData')">立即注册</el-button>
          <el-button @click="resetForm('registerData')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="re">
        <p style="font-size:13px;color:#aaa">已有账户？</p>
        <a href="/login" style="font-size:15px;color:#409eff; text-decoration: none;">登录</a>
      </div>
    </div>
  </div>
</template>
<script>
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
      } else {
        callback();
      }
      if (value != this.registerData.pass) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    let phoneRuel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话号码"));
      } else {
        callback();
      }
      let reg = /^1[3456789]\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error("电话号码格式错误"));
      } else {
        callback();
      }
    };
    let codeRuel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      registerData: {
        userName: "",
        pass: "",
        pass2: "",
        phone: "",
        code: "",
        type: "0",
        school: "",
        key: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        pass: [{ validator: passRuel, trigger: "blur" }],
        pass2: [{ validator: pass2Ruel, trigger: "blur" }],
        phone: [{ validator: phoneRuel, trigger: "blur" }],
        code: [{ validator: codeRuel, trigger: "blur" }],
        type: [{ required: true, message: "请选择角色", trigger: "change" }],
        school: [{ required: true, message: "请选择学校", trigger: "change" }],
        key: [
          { required: true, message: "请输入注册码", trigger: "blur" },
          {
            min: 6,
            max: 6,
            message: "长度6个字符",
            trigger: "blur",
          },
        ],
      },
      content: "发送验证码", // 按钮里显示的内容
      totalTime: 60, //记录具体倒计时时间
      canClick: true, //添加canClick
      schools: [],
    };
  },
  created() {
    this.getSchool();
  },
  methods: {
    async countDown() {
      if (!this.canClick) return;
      if (!/^1[3456789]\d{9}$/.test(this.registerData.phone)) {
        this.$message.error("手机号格式错误");
        return;
      }
      const { data: res } = await this.$http.post("user/sendCode", {
        phone_number: this.registerData.phone,
      });
      if (res.code != 200) {
        this.$message.error("系统错误");
        return;
      } else {
        this.$message.success(res.message);
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
    getSchool() {
      this.$http
        .get("school/getAll")
        .then((res) => {
          this.schools = res.data;
        })
        .catch((error) => {
          if (error.response) {
            this.$message.error(error.response.data.message);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const register_resData = {
            user_name: this.registerData.userName,
            password: this.registerData.pass,
            phone_number: this.registerData.phone,
            code: this.registerData.code,
            role: parseInt(this.registerData.type),
            name: this.registerData.name,
            invitation_code: this.registerData.key,
            school: this.registerData.school,
          };
          console.log(register_resData);
          this.$http
            .post("user/insert", register_resData)
            .then((res) => {
              console.log(res)
              // this.$cookies.set(
              //   "activeUser",
              //   res.data.data.id + "&" + res.data.data.user_name,
              //   24 * 60 * 60
              // );
              // this.$router.push("/stuIndex");
              this.$message.success("注册成功");
              this.$refs[formName].resetFields();
            })
            .catch((error) => {
              if (error.response) {
                this.$message.error(error.response.data.message);
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log("Error", error.message);
              }
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
    toLogin() {
      this.$router.push("/login");
    },
  },
};
</script>
<style >
.re {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.register_form .el-form-item {
  margin-bottom: 14px;
}
.el-form-item__error {
  font-size: 10px;
  padding-top: 2px;
}
.register_form .school {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.register_form .school .el-input {
  width: 150px;
}
</style>