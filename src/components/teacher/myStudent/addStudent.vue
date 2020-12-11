<template>
  <div class="add-student">
    <div class="title-section">
      <span @click="show = 0">Add Students to my class</span>
    </div>
    <div class="add-main">
      <transition
        name="fade"
        enter-active-class="animate__animated animate__zoomIn animate__delay-1.5s"
      >
        <div class="card" v-if="show == 0">
          <div class="card-item" @click="show = 2">
            <img
              src="../../../assets/svg/teacher/addStudents/students.svg"
              alt=""
            />
            <p class="text">批量添加学生</p>
          </div>
          <div class="card-item" style="margin-left: 100px" @click="show = 1">
            <img
              src="../../../assets/svg/teacher/addStudents/student.svg"
              alt=""
            />
            <p class="text">单独添加学生</p>
          </div>
        </div>
      </transition>

      <el-form
        :model="stuForm"
        class="add-form animate__animated animate__fadeInUp"
        :label-position="top"
        v-if="show == 1"
      >
        <div class="form-item">
          <el-form-item label="姓名">
            <el-input v-model="stuForm.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="stuForm.sex" placeholder="性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="-1"></el-option>
              <el-option label="保密" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="stuForm.card" placeholder="身份证号"></el-input>
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="班级">
            <el-select v-model="stuForm.clazz" placeholder="班级">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话号码">
            <el-input
              v-model="stuForm.phone_number"
              placeholder="电话号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="email">
            <el-input v-model="stuForm.email" placeholder="email"></el-input>
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="qq">
            <el-input v-model="stuForm.qq" placeholder="qq"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="buttons">
          <el-button type="primary" v-waves @click="onSubmit">添加</el-button>
          <el-button v-waves plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import waves from "@/directive/waves/index.js";
export default {
  directives: {
    waves,
  },
  data() {
    return {
      show: 3,
      stuForm: {
        name: "",
        sex: "",
        card: "",
        clazz: "",
        phone_number: "",
        qq: "",
        email: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    scrollHandle(e) {
      const scroll = e.srcElement.scrollingElement.scrollTop;
      console.log(scroll);
      if (scroll >= 200) {
        if (this.show != 2 && this.show != 1) {
          this.show = 0;
        }
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.scrollHandle); // 绑定页面的滚动事件
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHandle, true);
  },
};
</script>
<style scoped lang='scss'>
.add-student {
  position: absolute;
  width: 100%;
  height: 70%;
  background-image: url("../../../assets/img/bg/bg2.png");
  background-repeat: no-repeat;
  background-size: contain;
  padding-top: 100px;
  .title-section {
    text-align: center;
    padding-bottom: 40px;
    span {
      color: #614caa;
      font-size: 16px;
      font-weight: 600;
      text-transform: capitalize;
      margin-bottom: 20px;
      display: block;
      cursor: pointer;
    }
  }
  .add-main {
    width: 80%;
    margin: 0px auto;
    .card {
      display: flex;
      align-items: center;
      justify-content: center;
      .card-item {
        background-color: #fff;
        padding: 30px 70px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        img {
          width: 100px;
          height: 100px;
        }
        .text {
          color: #614caa;
          font-size: 16px;
          font-weight: 600;
          text-transform: capitalize;
        }
      }
      .card-item:hover {
        box-shadow: 0px 0px 10px rgba($color: #727272, $alpha: 0.5);
      }
    }
    .add-form {
      width: 70%;
      margin: 0px auto;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      .form-item {
        width: 48%;
        .el-select {
          width: 100%;
        }
      }
      .buttons {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .el-button {
          width: 100px;
        }
      }
    }
  }
}
</style>