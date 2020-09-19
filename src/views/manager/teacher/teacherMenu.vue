<template>
  <div class="teach-menu">
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>教师管理</el-breadcrumb-item>
        <el-breadcrumb-item>所有教师</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="teach-menu-main">
      <el-select
        v-model="school"
        placeholder="学校"
        filterable
        style="margin-bottom:20px"
        @change="schoolSelect"
      >
        <el-option
          v-for="item in schoolData"
          :key="item.id"
          :label="item.school_name"
          :value="item.id"
        ></el-option>
      </el-select>
      <div class="search">
        <el-select v-model="selectValue" placeholder="请选择">
          <el-option label="教师名称" value="name"></el-option>
          <el-option label="班级" value="class"></el-option>
        </el-select>
        <el-input v-model="searchValue" placeholder="请输入教师名称" v-if="isInput"></el-input>
        <el-select
          v-model="searchValue"
          placeholder="请选择班级"
          filterable
          @change="classSelect"
          v-else
        >
          <el-option
            v-for="item in classData"
            :key="item.id"
            :label="item.class_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <button class="pan-btn primary-btn" @click="queryTeacher">
          <i class="el-icon-search" style="margin-right:5px;margin-left:0px"></i>
          查询
        </button>
      </div>
      <div class="table">
        <vue-element-loading
          :active="this.$store.state.vueElementLoading"
          spinner="bar-fade-scale"
          color="#7d76ca"
          size="60"
        />
        <el-table :data="teacherData" style="width: 100%">
          <el-table-column prop="id" label="工号" align="center" width="50"></el-table-column>
          <el-table-column prop="user.role_info.name" label="姓名" align="center" width="80"></el-table-column>
          <el-table-column prop="user.role_info.sex" label="性别" align="center" width="50"></el-table-column>
          <el-table-column prop="school.school_name" label="学校" align="center" width="180"></el-table-column>
          <el-table-column prop="user.role_info.title" label="职称" align="center" width="80"></el-table-column>
          <el-table-column prop="clazz.class_name" label="班级" align="center" width="80"></el-table-column>
          <el-table-column prop="user.role_info.identity" label="教师类别" align="center" width="80"></el-table-column>
          <el-table-column prop="user.role_info.card" label="身份证号" align="center" width="180"></el-table-column>
          <el-table-column
            prop="user.role_info.phone_number"
            label="电话号码"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column prop="user.role_info.qq" label="QQ" align="center" width="120"></el-table-column>
          <el-table-column prop="user.role_info.email" label="Email" align="center" width="180"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="edit(scope.row)"></i>
              <i class="el-icon-delete" @click="del(scope.index,scope.row.id)"></i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[5,10,15,20,25]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
        <el-dialog title="修改信息" :visible.sync="dialogVisible" :append-to-body="true">
          <el-form :model="editForm" label-width="80px">
            <el-form-item label="姓名">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="学校">
              <el-select v-model="editForm.school_name" placeholder="请选择学校">
                <el-option
                  v-for="item in schoolData"
                  :key="item.id"
                  :label="item.school_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级">
              <el-select v-model="editForm.class_name" placeholder="请选择班级">
                <el-option
                  v-for="item in classData"
                  :key="item.id"
                  :label="item.class_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="editForm.sex" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="-1"></el-option>
                <el-option label="保密" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="editForm.card"></el-input>
            </el-form-item>
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="editForm.birth"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="editForm.phone_number"></el-input>
            </el-form-item>
            <el-form-item label="QQ">
              <el-input v-model="editForm.qq"></el-input>
            </el-form-item>
            <el-form-item label="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditForm()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
export default {
  created() {
    this.token = this.$store.state.userInfo.token;
    this.getSchool();
    this.getClass(this.school);
    this.getTeachData(this.school, this.pageSize, this.currentPage);
  },
  components: {
    VueElementLoading,
  },
  watch: {
    selectValue(val) {
      if (val === "name") {
        this.isInput = true;
      } else {
        this.isInput = false;
      }
      this.searchValue = "";
    },
  },
  data() {
    return {
      school: 1,
      selectValue: "name",
      searchValue: "",
      teacherData: [],
      schoolData: [],
      classData: [],
      editForm: {
        name: "",
        school_name: "",
        class_name: "",
        sex: "",
        card: "",
        birth: "",
        phone_number: "",
        qq: "",
        email: "",
        title: "",
        identity: "",
      },
      token: "",
      dialogVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isInput: true,
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTeachData(this.school, val, this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTeachData(this.school, this.pageSize, val);
    },
    getSchool() {
      this.$http
        .get("school/search", {
          headers: { TOKEN: this.token },
        })
        .then((res) => {
          this.schoolData = res.data.results;
        })
        .catch((error) => {
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
    schoolSelect(id) {
      this.getTeachData(id);
      this.getClass(id);
      this.searchValue = "";
    },
    getTeachData(schoolId, size, current) {
      this.$store.commit("updateLoading", true);
      this.$http
        .get("teacher/search", {
          params: {
            school: schoolId,
            index: current,
            size: size,
          },
          headers: {
            TOKEN: this.token,
          },
        })
        .then((res) => {
          this.$store.commit("updateLoading", false);
          this.teacherData = res.data.results;
          this.total = res.data.count;
          this.teacherData.forEach((item) => {
            if (item.user.role_info.sex == 1) item.user.role_info.sex = "男";
            if (item.user.role_info.sex == 0) item.user.role_info.sex = "保密";
            if (item.user.role_info.sex == -1) item.user.role_info.sex = "女";
          });
        })
        .catch((error) => {
          this.$store.commit("updateLoading", false);
          if (error.response) {
            this.$notify.error({
              title: "错误",
              message: error.response.data.message,
            });
            if (error.response.data.staus == "-109") {
              this.$router.push("/login&register");
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        });
    },
    getClass(id) {
      this.$http
        .get("classs/search", {
          params: {
            school_id: id,
          },
          headers: {
            TOKEN: this.token,
          },
        })
        .then((res) => {
          this.classData = res.data.results;
        })
        .catch((error) => {
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
    queryTeacher() {
      this.$store.commit("updateLoading", true);
      this.$http
        .get(
          "teacher/search?" +
            "school=" +
            this.school +
            "&" +
            this.selectValue +
            "=" +
            this.searchValue,
          {
            headers: {
              TOKEN: this.token,
            },
          }
        )
        .then((res) => {
          this.$store.commit("updateLoading", false);
          this.teacherData = res.data.results;
          this.total = res.data.count;
          this.teacherData.forEach((item) => {
            if (item.user.role_info.sex == 1) item.user.role_info.sex = "男";
            if (item.user.role_info.sex == 0) item.user.role_info.sex = "保密";
            if (item.user.role_info.sex == -1) item.user.role_info.sex = "女";
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
    submitEditForm() {},
    edit(row) {
      this.editForm.name = row.user.role_info.name;
      this.editForm.school_name = row.school.school_name;
      this.editForm.sex = row.user.role_info.sex;
      this.editForm.card = row.user.role_info.card;
      // this.editForm.birth = row.birthday;
      this.editForm.phone_number = row.user.role_info.phone_number;
      this.editForm.qq = row.user.role_info.qq;
      this.editForm.email = row.user.role_info.email;
      this.dialogVisible = true;
    },
    del(index, id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .delete("teacher/delete/" + id, {
              headers: {
                TOKEN: this.token,
              },
            })
            .then((res) => {
              this.teacherData.splice(index, 1);
              this.$message.success("删除成功");
            })
            .catch((error) => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
  },
};
</script>
<style scoped lang="scss">
@import "../../../styles/btn.scss";
.teach-menu {
  .top-bar {
    background-color: white;
    padding: 20px;
    margin-bottom: 30px;
    .el-breadcrumb__inner {
      cursor: default !important;
    }
  }
  .teach-menu-main {
    background-color: #fff;
    padding: 30px;
    .search {
      margin-bottom: 30px;
      .el-input,
      .el-select {
        width: 20%;
        margin: 0px 20px 0px 0px;
      }
    }
    i {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>