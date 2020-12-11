<template>
  <div class="add-student">
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item style="font-weight: 800"
          >教师管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>添加教师</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="add-student-main">
      <div class="upload">
        <el-upload
          class="upload-demo"
          action="http://39.108.164.247:8000/teacher/insert_file"
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
            批量导入教师信息
          </button>
        </el-upload>
        <el-button
          type="text"
          style="color: #5044d4; margin-left: 20px"
          @click="downloadExcel()"
          >下载教师样表</el-button
        >
      </div>
      <div class="add-form">
        <el-form
          :model="teacherForm"
          :rules="rules"
          ref="teacherForm"
          label-width="100px"
          class="form"
          :label-position="labelPosition"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="teacherForm.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="teacherForm.sex" placeholder="请选择">
              <el-option label="男" :value="0"></el-option>
              <el-option label="女" :value="1"></el-option>
              <el-option label="保密" :value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学校" prop="school">
            <el-select
              v-model="teacherForm.school"
              placeholder="请选择"
              filterable
            >
              <el-option
                v-for="item in schools"
                :key="item.id"
                :label="item.school_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教师职称" prop="title">
            <el-select v-model="teacherForm.title" placeholder="请选择">
              <el-option label="三级教师" value="三级教师"></el-option>
              <el-option label="二级教师" value="二级教师"></el-option>
              <el-option label="一级教师" value="一级教师"></el-option>
              <el-option label="高级教师" value="高级教师"></el-option>
              <el-option label="正高级教师" value="正高级教师"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号" prop="card">
            <el-input v-model="teacherForm.card"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone_number">
            <el-input v-model="teacherForm.phone_number"></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="qq">
            <el-input v-model="teacherForm.qq"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="teacherForm.email"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 15%">
            <button
              type="button"
              class="pan-btn primary-btn"
              @click="submitAddForm('teacherForm')"
            >
              立即添加
            </button>
            <button
              type="button"
              style="background-color: #fff; color: #5044d4; margin-left: 20px"
              class="pan-btn primary-btn"
              @click="resetAddForm('teacherForm')"
            >
              重置
            </button>
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
import * as regular from "@/tools/regular";
import { getSchool, getClass } from "@/api/manager/manager_common";
import * as teacher from "@/api/manager/teacher";
export default {
  created() {
    this.header.TOKEN = this.$store.state.userInfo.token;
    this.getSchool();
  },
  data() {
    const checkName = (rule, value, callback) => {
      const isName = regular.isChines(value);
      if (isName != true || !value) {
        callback(new Error(isName));
      } else {
        callback();
      }
    };
    const checkCardId = (rule, value, callback) => {
      const isCardId = regular.isCardID(value);
      if (isCardId != true || !value) {
        callback(new Error(isCardId));
      } else {
        callback();
      }
    };
    const checkPhone = (rule, value, callback) => {
      const isPhone = regular.isTelOk(value);
      if (isPhone != true || !value) {
        callback(new Error(isPhone));
      } else {
        callback();
      }
    };
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      if (!regular.isEmail(value)) callback(new Error("邮箱格式错误"));
      callback();
    };
    const checkQQ = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      if (!regular.isQQ(value)) callback(new Error("QQ格式错误"));
      callback();
    };
    return {
      teacherForm: {
        name: "",
        sex: 0,
        school: "",
        title: "一级",
        card: "",
        phone_number: "",
        qq: "",
        email: "",
      },
      header: {
        TOKEN: "",
      },
      schools: [],
      errorData: [],
      errorVisible: true,
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
        type: [{ required: true, message: "请选择性别", trigger: "change" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        school: [{ required: true, message: "请选择学校", trigger: "change" }],
        card: [{ required: true, validator: checkCardId, trigger: "blur" }],
        phone_number: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ],
        email: [{ required: false, validator: checkEmail, trigger: "blur" }],
        qq: [{ required: false, validator: checkQQ, trigger: "blur" }],
      },
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
    submitAddForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const resultData = teacher.submitAddForm(this.teacherForm);
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
    downloadExcel() {
      window.location.href = "http://39.108.164.247:8000/FileInfo/download/1";
    },
    async getSchool() {
      this.schools = await getSchool();
    },
  },
};
</script>
<style scoped lang="scss">
@import "../../../styles/btn.scss";
.add-student {
  .top-bar {
    background-color: white;
    padding: 20px;
    margin-bottom: 30px;
    .el-breadcrumb__inner {
      cursor: default !important;
    }
  }
  .add-student-main {
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
        margin-top: 20px;
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