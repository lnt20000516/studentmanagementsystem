<template>
  <div class="add-parent">
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item style="font-weight: 800"
          >家长管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>添加家长</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="add-parent-main">
      <div class="upload">
        <el-upload
          class="upload-demo"
          action="http://39.108.164.247:8000/parent/insertFile"
          :limit="1"
          :on-success="handleExcelSuccess"
          :on-exceed="handleExceed"
          :on-error="handleExcelError"
          accept=".xls, .xlsx"
          :headers="header"
        >
          <button
            type="button"
            style="width: 150px"
            class="pan-btn primary-btn"
          >
            批量导入家长信息
          </button>
        </el-upload>
        <el-button
          type="text"
          style="color: #5044d4; margin-left: 20px"
          @click="downloadExcel()"
          >下载家长样表</el-button
        >
      </div>
      <div class="add-form">
        <el-form
          :model="parentForm"
          :rules="rules"
          ref="parentForm"
          label-width="100px"
          class="form"
          :label-position="labelPosition"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="parentForm.name"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="card">
            <el-input v-model="parentForm.card"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone_number">
            <el-input v-model="parentForm.phone_number"></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="qq">
            <el-input v-model="parentForm.qq"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="parentForm.email"></el-input>
          </el-form-item>
          <el-form-item>
            <button
              class="pan-btn primary-btn"
              type="button"
              @click="submitAddFrom('parentForm')"
            >
              立即添加
            </button>
            <el-button
              type="button"
              style="background-color: #fff; color: #5044d4; margin-left: 20px"
              class="pan-btn primary-btn"
              @click="resetAddForm('parentForm')"
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
import * as parent from "@/api/manager/parent";
export default {
  created() {
    this.header.TOKEN = this.$store.state.userInfo.token;
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
      errorData: [],
      errorVisible: true,
      parentForm: {
        name: "",
        card: "",
        phone_number: "",
        qq: "",
        email: "",
      },
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
        card: [{ required: true, validator: checkCardId, trigger: "blur" }],
        phone_number: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ],
        email: [{ required: false, validator: checkEmail, trigger: "blur" }],
      },
      labelPosition: "right",
    };
  },
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
      if (res.code != 200) {
        this.$message.error(res.message);
      }
      this.errorData = [];
      this.errorVisible = false;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    handleExcelError(err, file, fileList) {
      this.$message.error("上传失败，请重新上传");
      const error = JSON.parse(err.message);
      this.errorData = error.err_data;
      this.errorVisible = true;
    },
    downloadExcel() {
      window.location.href = "http://39.108.164.247:8000/FileInfo/download/3";
    },
    submitAddFrom(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const resultData = await parent.submitAddFrom(this.parentForm);
          if (resultData) {
            this.$refs[formName].resetFields();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetAddForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style  lang="scss">
@import "../../../styles/btn.scss";
.add-parent {
  .top-bar {
    background-color: white;
    padding: 20px;
    margin-bottom: 30px;
    .el-breadcrumb__inner {
      cursor: default !important;
    }
  }
  .add-parent-main {
    background-color: #fff;
    padding: 30px;
    .upload {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 250px;
      justify-content: space-between;
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
      height: 300px;
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