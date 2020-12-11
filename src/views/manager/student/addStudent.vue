<template>
  <div class="add-student">
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item style="font-weight: 800"
          >学生管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>添加学生</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="add-student-main">
      <div class="upload">
        <el-upload
          class="upload-demo"
          action="http://39.108.164.247:8000/student/insertFile"
          :limit="1"
          :on-success="handleExcelSuccess"
          :on-exceed="handleExceed"
          :on-error="handleExcelError"
          accept=".xls, .xlsx"
          :headers="header"
        >
          <button
            style="width: 150px"
            class="pan-btn primary-btn"
            type="button"
          >
            批量导入学生信息
          </button>
        </el-upload>
        <el-button
          style="color: #5044d4; margin-left: 20px"
          type="text"
          @click="downloadExcel()"
          >下载学生样表</el-button
        >
      </div>
      <div class="add-form">
        <el-form
          :model="stuForm"
          :rules="rules"
          ref="stuForm"
          label-width="100px"
          class="form"
          :label-position="labelPosition"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="stuForm.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="stuForm.sex" placeholder="请选择">
              <el-option label="男" :value="0"></el-option>
              <el-option label="女" :value="1"></el-option>
              <el-option label="保密" :value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学校" prop="school">
            <el-select
              v-model="stuForm.school"
              placeholder="请选择"
              filterable
              @change="schoolChange"
            >
              <el-option
                v-for="item in schoolData"
                :key="item.id"
                :label="item.school_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级" prop="clazz">
            <el-select v-model="stuForm.clazz" placeholder="请选择" filterable>
              <el-option
                v-for="item in classData"
                :key="item.id"
                :label="item.class_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号" prop="card">
            <el-input v-model="stuForm.card"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone_number">
            <el-input v-model="stuForm.phone_number"></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="qq">
            <el-input v-model="stuForm.qq"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="stuForm.email"></el-input>
          </el-form-item>
          <el-form-item>
            <button
              class="pan-btn primary-btn"
              type="button"
              @click="submitForm('stuForm')"
            >
              立即添加
            </button>
            <el-button
              type="button"
              style="background-color: #fff; color: #5044d4; margin-left: 20px"
              class="pan-btn primary-btn"
              @click="resetForm('stuForm')"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <div class="error" v-show="errorVisible">
          <el-alert
            class="error-alert animate__animated animate__fadeInDown"
            v-for="item in errorData"
            :key="item.index"
            :title="'行' + item.index + '   ' + item.message"
            type="error"
          >
          </el-alert>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { isCardID, isTelOk, isChines } from "@/tools/regular";
import * as student from "@/api/manager/student";
import { getSchool, getClass } from "@/api/manager/manager_common";
export default {
  computed: {
    screenSize() {
      return this.$store.state.screenWH;
    },
  },
  mounted() {
    this.resize();
  },
  watch: {
    screenSize(newVal) {
      this.resize();
    },
  },
  created() {
    this.header.TOKEN = this.$store.state.userInfo.token;
    this.getSchool();
  },
  data() {
    const checkName = (rule, value, callback) => {
      const isName = isChines(value);
      if (isName != true || !value) {
        callback(isName);
      } else {
        callback();
      }
      callback();
    };
    const checkCardId = (rule, value, callback) => {
      const isCardId = isCardID(value);
      if (isCardId != true || !value) {
        callback(isCardId);
      } else {
        callback();
      }
      callback();
    };
    const checkPhone = (rule, value, callback) => {
      const isPhone = isTelOk(value);
      if (isPhone != true || !value) {
        callback(isPhone);
      } else {
        callback();
      }
      callback();
    };
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      callback();
    };

    return {
      header: {
        TOKEN: "",
      },
      stuForm: {
        name: "",
        sex: "",
        card: "",
        clazz: "",
        phone_number: "",
        school: "",
        qq: "",
        email: "",
      },
      errorData: [],
      errorVisible: false,
      classData: [],
      schoolData: [],
      labelPosition: "right",
      rules: {
        name: [
          { required: true, validator: checkName, trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        clazz: [{ required: true, message: "请选择班级", trigger: "blur" }],
        school: [{ required: true, message: "请选择学校", trigger: "change" }],
        cardId: [{ required: true, validator: checkCardId, trigger: "blur" }],
        phone_number: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ],
        email: [{ required: false, validator: checkEmail, trigger: "blur" }],
      },
    };
  },
  methods: {
    resize() {
      const maxW = this.screenSize.maxW;
      const maxH = this.screenSize.maxH;
      if (maxW <= 500) {
        this.labelPosition = "top";
      } else {
        this.labelPosition = "right";
      }
    },
    handleExcelSuccess(res, file) {
      console.log(res);
      this.errorVisible = false;
      this.errorData = [];
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    handleExcelError(err, file, fileList) {
      this.$message.error("上传失败,请重新上传");
      const error = JSON.parse(err.message);
      this.errorData = error.err_data;
      this.errorVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.stuForm);
          const resultData = await student.submitAddForm(this.stuForm);
          if (resultData) {
            this.$refs[formName].resetFields();
            this.$message.success("添加成功");
          } else {
            this.$message.error("添加失败");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    downloadExcel() {
      window.location.href = "http://39.108.164.247:8000/FileInfo/download/2";
    },
    async getSchool() {
      this.schoolData = await getSchool();
    },
    schoolChange(id) {
      this.getClass(id);
      this.stuForm.clazz = "";
    },
    async getClass(id) {
      this.classData = await getClass(id);
    },
  },
};
</script>
<style lang="scss">
@import "../../../styles/btn.scss";
.add-student {
  .add-student-main {
    background-color: #fff;
    padding: 30px;
    .upload {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: 250px;
      justify-content: space-between;
    }
    .upload-dialog {
      width: 200px;
      height: 200px;
      position: absolute;
      top: 240px;
      left: 115px;
      background-color: #fff;
      z-index: 5000;
      box-shadow: 0px 0px 5px #ccc;
    }
    .add-form {
      margin-top: 3%;
      position: relative;
      .form {
        width: 40%;
      }
    }
    .error {
      width: 30%;
      position: absolute;
      height: 400px;
      overflow: auto;
      top: 0;
      right: 0;
      .error-alert {
        margin-top: 10px;
      }
    }
    .el-select {
      width: 100%;
    }
  }
  .top-bar {
    background-color: white;
    padding: 20px;
    margin-bottom: 30px;
    .el-breadcrumb__inner {
      cursor: default !important;
    }
  }
}
</style>
<style lang="scss">
@media screen and (max-width: 1200px) {
  .form {
    width: 60% !important;
  }
}
@media screen and (max-width: 700px) {
  .form {
    width: 80% !important;
  }
}
@media screen and (max-width: 500px) {
  .form {
    width: 100% !important;
  }
}
</style>