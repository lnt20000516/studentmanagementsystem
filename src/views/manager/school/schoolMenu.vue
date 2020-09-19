<template>
  <div class="school-menu">
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>学校管理</el-breadcrumb-item>
        <el-breadcrumb-item>所有学校</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="school-menu-main">
      <div class="head">
        <div class="search">
          <!-- <el-input v-model="school" placeholder="请输入学校名称"></el-input> -->
          <md-input v-model="school" icon="el-icon-search" name="title" placeholder="请输入学校名称">学校名称</md-input>
          <button class="pan-btn primary-btn" @click="querySchool">立即查询</button>
        </div>
        <div class="add">
          <button
            class="pan-btn primary-btn animate__animated animate__rotateInDownLeft"
            v-if="!isAdd"
            @click="isAdd=!isAdd"
            style="animation-duration: 500ms"
          >添加学校</button>
          <el-form
            :inline="true"
            :model="schoolAddForm"
            class="demo-form-inline animate__animated animate__rotateInDownLeft"
            :rules="rules"
            ref="schoolAddForm"
            style="animation-duration: 500ms"
            v-else
          >
            <el-form-item label="学校名称" prop="school_name">
              <el-input v-model="schoolAddForm.school_name" placeholder="请输入学校名称"></el-input>
            </el-form-item>
            <el-form-item label="学校简介" prop="school_info">
              <el-input v-model="schoolAddForm.school_info" placeholder="请输入学校简介"></el-input>
            </el-form-item>
            <el-form-item>
              <button
                type="button"
                class="pan-btn primary-btn"
                @click="submitAddForm('schoolAddForm')"
              >添加</button>
              <button
                type="button"
                style="background-color:#fff ;color:#5044d4"
                class="pan-btn primary-btn"
                @click="resetAddForm('schoolAddForm')"
              >重置</button>
              <button
                style="background-color:#fff ;color:#5044d4"
                class="pan-btn primary-btn"
                @click="isAdd=!isAdd"
              >取消</button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="table">
        <vue-element-loading
          :active="this.$store.state.vueElementLoading"
          spinner="bar-fade-scale"
          color="#7d76ca"
          size="60"
        />
        <el-form :rules="rules" :model="schoolForm" ref="schoolForm">
          <el-table :data="schoolData" stripe style="width: 100%">
            <el-table-column prop="id" label="学校ID" align="center"></el-table-column>
            <el-table-column prop="school_name" label="学校名称" align="center">
              <template slot-scope="{row}">
                <el-form-item v-show="row.isEdit" prop="school_name">
                  <el-input v-model="schoolForm.school_name"></el-input>
                </el-form-item>
                <span v-show="!row.isEdit">{{row.school_name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="school_info" label="描述" align="center">
              <template slot-scope="{row}">
                <el-form-item v-show="row.isEdit" prop="school_info">
                  <el-input v-model="schoolForm.school_info"></el-input>
                </el-form-item>
                <span v-show="!row.isEdit">{{row.school_info}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="school_date" label="注册时间" align="center" v-if="showTableCol"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div v-show="scope.row.isEdit">
                  <i class="el-icon-check" @click="submitSchool('schoolForm',scope.row)"></i>
                  <i class="el-icon-close" @click="cansolSubmit('schoolForm',scope.row)"></i>
                </div>

                <div v-show="!scope.row.isEdit">
                  <i class="el-icon-edit" @click="editSchool(scope.row)"></i>
                  <i
                    class="el-icon-delete"
                    @click="deleteSchool(scope.$index,scope.row.id,schoolData)"
                  ></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import MdInput from "@/components/common/MDinput";

export default {
  components: {
    VueElementLoading,
    MdInput,
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入学校名称"));
      } else {
        callback();
      }
    };
    const checkInfo = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入学校注册码"));
      } else {
        callback();
      }
    };
    return {
      school: "",
      schoolData: [],
      rules: {
        school_name: [{ validator: checkName, trigger: "blur" }],
        school_info: [{ validator: checkInfo, trigger: "blur" }],
      },
      schoolForm: {
        school_name: "",
        school_info: "",
      },
      schoolAddForm: {
        school_name: "",
        school_info: "",
        school_date: "",
      },
      isAdd: false,
      showTableCol: true,
      currentPage: 1,
      total: 10,
      pageSize: 10,
      token: "",
    };
  },
  created() {
    this.token = this.$store.getters.getUserInfo.token;
    this.getSchoolData(this.pageSize, this.currentPage);
  },
  methods: {
    handleSizeChange(val) {
      this.getSchoolData(val, this.currentPage);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.getSchoolData(this.pageSize, val);
      this.currentPage = val;
    },
    getSchoolData(size, current) {
      this.$store.commit("updateLoading", true);
      this.$http
        .get("school/search", {
          params: {
            index: current,
            size: size,
          },
          headers: {
            TOKEN: this.token,
          },
        })
        .then((res) => {
          this.$store.commit("updateLoading", false);
          this.schoolData = res.data.results;
          this.total = res.data.count;
          this.schoolData.forEach((item) => {
            item.isEdit = false;
            let date = new Date(item.school_date);
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) month = "0" + month;
            if (day < 10) day = "0" + day;
            item.school_date = date.getFullYear() + "-" + month + "-" + day;
          });
        })
        .catch((error) => {
          this.$store.commit("updateLoading", false);
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
    deleteSchool(index, id, rows) {
      console.log(index);
      this.$confirm("此操作将永久删除该学校, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .delete("school/delete/" + id)
            .then((res) => {
              rows.splice(index, 1);
              this.$message.success("删除成功");
            })
            .catch((error) => {
              if (error.response) {
                console.log(error.response.data.message);
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log("Error", error.message);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    editSchool(row) {
      this.schoolForm.school_name = row.school_name;
      this.schoolForm.school_info = row.school_info;
      row.isEdit = true;
    },
    submitSchool(formName, row) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .patch("school/partialUpdate/" + row.id, this.schoolForm, {
              headers: {
                TOKEN: this.token,
              },
            })
            .then((res) => {
              row.school_name = this.schoolForm.school_name;
              row.school_info = this.schoolForm.school_info;
              this.$message.success("修改成功");
              row.isEdit = false;
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
    cansolSubmit(formName, row) {
      this.$refs[formName].resetFields();
      row.isEdit = false;
    },
    querySchool() {
      this.$store.commit("updateLoading", true);
      this.$http
        .get("school/search", {
          params: {
            school_name: this.school,
          },
          headers: {
            TOKEN: this.token,
          },
        })
        .then((res) => {
          this.$store.commit("updateLoading", false);
          this.schoolData = res.data.results;
          this.schoolData.forEach((item) => {
            item.isEdit = false;
            let date = new Date(item.school_date);
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) month = "0" + month;
            if (day < 10) day = "0" + day;
            item.school_date = date.getFullYear() + "-" + month + "-" + day;
          });
          this.$message.success("查询成功");
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
    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.schoolAddForm.school_date = new Date();
          this.$http
            .post("school/insert", this.schoolAddForm, {
              headers: {
                TOKEN: this.token,
              },
            })
            .then((res) => {
              res.data.data.school_date = res.data.data.school_date.slice(
                0,
                10
              );
              this.schoolData.push(res.data.data);
              this.$message.success("添加成功");
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
    resetAddForm(formName) {
      this.$refs[formName].resetFields();
    },
    resize() {
      const maxW = this.screenSize.maxW;
      const maxH = this.screenSize.maxH;
      if (maxW <= 500) {
        this.showTableCol = false;
      } else {
        this.showTableCol = true;
      }
    },
  },
  computed: {
    screenSize() {
      return this.$store.state.screenWH;
    },
  },
  watch: {
    screenSize(newVal) {
      this.resize();
    },
  },
  mounted() {
    this.resize();
  },
};
</script>
<style lang="scss">
@import "../../../styles/btn.scss";
.school-menu {
  width: 100%;
  .school-menu-main {
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
        .material-input__component {
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
      i {
        margin: 0px 5px 0px 5px;
        cursor: pointer;
      }
    }
    .add {
      .pan-btn {
        margin-left: 20px;
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

@media screen and (max-width: 1436px) {
  .school-menu .school-menu-main .head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  .school-menu .school-menu-main .head .search {
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 540px) {
  .school-menu .school-menu-main .head .el-form-item {
    margin-bottom: 17px;
  }
}
</style>
