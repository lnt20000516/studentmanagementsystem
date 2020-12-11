<template>
  <div class="class-menu">
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item style="font-weight: 800"
          >班级管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>所有班级</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="class-menu-main">
      <el-select
        v-model="school"
        placeholder="学校"
        filterable
        style="margin-bottom: 20px"
        @change="schoolSelect"
        v-show="role==-1"
      >
        <el-option
          v-for="item in schoolData"
          :key="item.id"
          :label="item.school_name"
          :value="item.id"
        ></el-option>
      </el-select>
      <div class="head">
        <div class="search">
          <el-input
            v-model="className"
            placeholder="请输入班级名称"
            @keyup.enter.native="queryClass"
          ></el-input>
          <button class="pan-btn primary-btn" @click="queryClass">
            立即查询
          </button>
        </div>
        <div class="add">
          <button @click="dialogclassFrom = true" class="pan-btn primary-btn">
            添加班级
          </button>

          <el-dialog
            title="添加班级"
            :visible.sync="dialogclassFrom"
            :append-to-body="true"
            width="30%"
          >
            <el-form
              :model="classAddForm"
              :rules="rules"
              ref="classAddForm"
              label-width="80px"
            >
              <el-form-item label="班级名称" prop="class_name">
                <el-input
                  v-model="classAddForm.class_name"
                  placeholder="请输入班级名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="学校" prop="school">
                <el-select
                  v-model="classAddForm.school"
                  placeholder="学校"
                  filterable
                  @change="dialogSchoolChange"
                >
                  <el-option
                    v-for="item in schoolData"
                    :key="item.id"
                    :label="item.school_name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班主任" prop="teacher">
                <el-select
                  v-model="classAddForm.teacher"
                  placeholder="老师"
                  filterable
                >
                  <el-option
                    v-for="item in teacherData"
                    :key="item.id"
                    :label="item.user.user_details.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <button
                style="background-color: #fff; color: #5044d4"
                class="pan-btn primary-btn"
                @click="cansoleAddClass('classAddForm')"
              >
                取 消
              </button>
              <button
                class="pan-btn primary-btn"
                @click="submitAddClass('classAddForm')"
              >
                确 定
              </button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div class="table">
        <vue-element-loading
          :active="this.$store.state.vueElementLoading"
          spinner="bar-fade-scale"
          color="#7d76ca"
          size="60"
        />
        <el-table :data="classData" stripe style="width: 100%">
          <el-table-column
            prop="id"
            label="班级ID"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="class_name"
            label="班级名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="school.school_name"
            label="学校"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="headmaster.user_details.name"
            label="班主任"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="headmaster.phone_number"
            label="班主任联系电话"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <i
                class="el-icon-delete"
                @click="deleteClass(scope.$index, scope.row.id)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          v-if="showAllPag"
        ></el-pagination>
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="total"
          v-else
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import * as classs from "@/api/manager/class";
import { getSchool, getTeachData } from "@/api/manager/manager_common";
export default {
  components: {
    VueElementLoading,
  },
  created() {
    if (this.role == -1) {
      this.getSchoolData();
    }
    this.getClassData(this.school);
  },
  data() {
    return {
      school: 1,
      schoolData: [],
      className: "",
      classAddForm: {
        teacher: "",
        school: "",
        class_name: "",
      },
      teacherData: [],
      classData: [],
      dialogclassFrom: false,
      rules: {
        class_name: [
          { required: true, message: "请输入班级名称", trigger: "blur" },
        ],
        school: [{ required: true, message: "请选择学校", trigger: "change" }],
        teacher: [
          { required: true, message: "请选择班主任", trigger: "change" },
        ],
      },
      currentPage: 1,
      total: 10,
      pageSize: 10,
      showAllPag: true,
    };
  },
  computed: {
    screenSize() {
      return this.$store.state.screenWH;
    },
    role() {
      return this.$store.state.userInfo.role;
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
        this.showAllPag = false;
      } else {
        this.showAllPag = true;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getClassData(this.school);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getClassData(this.school);
    },
    schoolSelect(schoolId) {
      this.getClassData(schoolId);
    },
    async getSchoolData() {
      const resultData = await getSchool();
      if (resultData) {
        this.schoolData = resultData;
      }
    },
    async queryClass() {
      this.$store.commit("updateLoading", true);
      const resultData = await classs.queryClass(this.school, this.className);
      if (resultData) {
        this.classData = resultData.results;
        this.total = resultData.count;
      }
      this.$store.commit("updateLoading", false);
    },
    dialogSchoolChange(id) {
      this.getTeacherData(id);
      this.classAddForm.teacher = "";
    },
    async getTeacherData(schoolId) {
      this.teacherData = await getTeachData(schoolId);
    },
    async getClassData(schoolId) {
      this.$store.commit("updateLoading", true);
      const resultData = await classs.getClassData(
        schoolId,
        this.currentPage,
        this.pageSize
      );
      if (resultData) {
        this.total = resultData.count;
        this.classData = resultData.results;
      }
      this.$store.commit("updateLoading", false);
    },
    submitAddClass(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const resultData = await classs.submitAddClass(this.classAddForm);
          if (resultData) {
            this.$message.success("添加成功");
            this.dialogclassFrom = false;
            this.getClassData(this.classAddForm.school);
            this.school = this.classAddForm.school;
            this.$refs[formName].resetFields();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cansoleAddClass(formName) {
      this.dialogclassFrom = false;
      this.$refs[formName].resetFields();
    },
    deleteClass(index, id) {
      this.$confirm(
        "此操作将永久删除该班级,并将该班级与老师的绑定解除，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const resultData = await classs.deleteClass(id);
          if (resultData) {
            this.classData.splice(index, 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss">
@import "../../../styles/btn.scss";
.class-menu {
  width: 100%;
  .class-menu-main {
    background-color: white;
    padding: 30px;
    .head {
      display: flex;
      flex-direction: row;
      align-items: center;

      .search {
        width: 30%;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 2%;
        min-width: 300px;
        .el-input {
          width: 65%;
          margin-right: 20px;
        }
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .table {
      margin-top: 20px;
      .table i {
        margin: 0px 5px 0px 5px;
        cursor: pointer;
      }
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
i {
  cursor: pointer;
}
.el-dialog .el-select {
  width: 100%;
}
.pan-btn {
  margin-left: 10px;
  min-width: 80px;
}

@media screen and (max-width: 1436px) {
  .class-menu .class-menu-main .head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  .class-menu .class-menu-main .head .search {
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 540px) {
  .class-menu .class-menu-main .head .el-form-item {
    margin-bottom: 17px;
  }
}
@media screen and (max-width: 500px) {
  .el-dialog {
    width: 80% !important;
  }
  .search .el-input {
    width: 130px !important;
  }
}
</style>
