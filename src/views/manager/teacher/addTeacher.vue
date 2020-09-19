<template>
  <div class="add-student">
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>教师管理</el-breadcrumb-item>
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
          accept=".xls, .xlsx"
          :headers="header"
        >
          <button type="button" style="width:150px" class="pan-btn primary-btn">批量导入教师信息</button>
        </el-upload>
        <el-button
          type="text"
          style="color:#5044d4;margin-left:20px"
          @click="downloadExcel()"
        >下载教师样表</el-button>
      </div>
      <div class="add-form">
        <el-form
          :model="teacherForm"
          :rules="rules"
          ref="teacherForm"
          label-width="100px"
          class="form"
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
            <el-select v-model="teacherForm.school" placeholder="请选择" filterable>
              <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教师类型" prop="type">
            <el-select v-model="teacherForm.type" placeholder="请选择">
              <el-option label="课程教师" :value="0"></el-option>
              <el-option label="辅导员" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级" prop="class" v-if="teacherForm.type==1">
            <el-select v-model="teacherForm.class" placeholder="请选择" filterable>
              <el-option v-for="item in classes" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="身份证号" prop="cardId">
            <el-input v-model="teacherForm.cardId"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="teacherForm.phone"></el-input>
          </el-form-item>
          <el-form-item>
            <button
              type="button"
              class="pan-btn primary-btn"
              @click="submitForm('teacherForm')"
            >立即添加</button>
            <button
              type="button"
              style="background-color:#fff ;color:#5044d4"
              class="pan-btn primary-btn"
              @click="resetForm('teacherForm')"
            >重置</button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { isCardID, isTelOk, isChines } from "../../../tools/regular";
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
    };
    const checkCardId = (rule, value, callback) => {
      const isCardId = isCardID(value);
      if (isCardId != true || !value) {
        callback(isCardId);
      } else {
        callback();
      }
    };
    const checkPhone = (rule, value, callback) => {
      const isPhone = isTelOk(value);
      if (isPhone != true || !value) {
        callback(isPhone);
      } else {
        callback();
      }
    };
    return {
      teacherForm: {},
      header: {
        TOKEN: "",
      },
      classes: [
        {
          id: 0,
          name: "一班",
        },
        {
          id: 1,
          name: "二班",
        },
        {
          id: 2,
          name: "三班",
        },
      ],
      schools: [],
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
        class: [{ required: true, message: "请选择班级", trigger: "change" }],
        school: [{ required: true, message: "请选择学校", trigger: "change" }],
        cardId: [{ required: true, validator: checkCardId, trigger: "blur" }],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleExcelSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
      window.location.href = "http://39.108.164.247:8000/FileInfo/download/1";
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
      .form {
        width: 40%;
      }
    }
  }
}
.pan-btn {
  margin-left: 20px;
}
</style>