<template>
  <div class="stu-menu">
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>所有学生</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="stu-menu-main">
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
        <el-select v-model="selected">
          <el-option label="班级" value="clazz_id"></el-option>
          <el-option label="学生姓名" value="name"></el-option>
        </el-select>
        <el-input v-model="value" v-show="showInput==0" placeholder="请输入......"></el-input>
        <el-select v-model="value" placeholder="请选择" filterable v-show="showInput==1">
          <el-option
            v-for="item in classData"
            :key="item.id"
            :label="item.class_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select v-model="value" placeholder="请选择" filterable v-show="showInput==2">
          <el-option
            v-for="item in schoolData"
            :key="item.id"
            :label="item.school_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <button type="button"  class="pan-btn primary-btn" @click="stuQuery">立即查询</button>
      </div>
      <div class="table">
        <vue-element-loading
          :active="this.$store.state.vueElementLoading"
          spinner="bar-fade-scale"
          color="#7d76ca"
          size="60"
        />
        <el-table :data="studentData" stripe style="width: 100%">
          <el-table-column prop="id" label="学号" align="center" width="50"></el-table-column>
          <el-table-column prop="user.role_info.name" label="姓名" align="center" width="80"></el-table-column>
          <el-table-column prop="school.school_name" label="学校" align="center" width="180"></el-table-column>
          <el-table-column prop="clazz.class_name" label="班级" align="center" width="80"></el-table-column>
          <el-table-column
            prop="clazz.headmaster.role_info.name"
            label="班主任"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="clazz.headmaster.role_info.phone_number"
            label="班主任联系方式"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column prop="user.role_info.sex" label="性别" align="center" width="50"></el-table-column>
          <el-table-column prop="user.role_info.card" label="身份证号" align="center" width="180"></el-table-column>
          <el-table-column prop="user.role_info.birthday" label="出生日期" align="center" width="150"></el-table-column>
          <el-table-column prop="user.role_info.qq" label="QQ" align="center" width="120"></el-table-column>
          <el-table-column prop="user.role_info.email" label="email" align="center" width="180"></el-table-column>
          <el-table-column
            prop="user.role_info.phone_number"
            label="联系方式"
            align="center"
            width="150"
          ></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="edit(scope.row,scope.$index)"></i>
              <i class="el-icon-delete" @click="studelete(scope.$index,scope.row.id)"></i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 20, 25]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
        <el-dialog title="修改信息" :visible.sync="dialogVisible" :append-to-body="true">
          <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="学校" prop="school_name">
              <el-select v-model="editForm.school_name" placeholder="请选择学校" @change="schoolChange">
                <el-option
                  v-for="item in schoolData"
                  :key="item.id"
                  :label="item.school_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级" prop="class_name">
              <el-select v-model="editForm.class_name" placeholder="请选择班级">
                <el-option
                  v-for="item in classData"
                  :key="item.id"
                  :label="item.class_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="editForm.sex" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="-1"></el-option>
                <el-option label="保密" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="card">
              <el-input v-model="editForm.card"></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="editForm.birthday"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone_number">
              <el-input v-model="editForm.phone_number"></el-input>
            </el-form-item>
            <el-form-item label="QQ" prop="qq">
              <el-input v-model="editForm.qq"></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditForm()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import { isCardID, isTelOk, isChines, isQQ, isEmail } from "@/tools/regular";
import { getSchool, getClass } from "@/api/manager/manager_common";
import * as student from "@/api/manager/student";
export default {
  components: {
    VueElementLoading,
  },
  data() {
    return {
      school: 1,
      classId: "",
      classes: [],
      selected: "name",
      value: "",
      showInput: 0,
      studentData: [],
      schoolData: [],
      classData: [],
      dialogVisible: false,
      editForm: {
        name: "",
        school_name: "",
        class_name: "",
        sex: "",
        card: "",
        birthday: "",
        phone_number: "",
        qq: "",
        email: "",
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      index: 0,
      rules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback(new Error("请填写姓名"));
              else {
                const nameError = isChines(value);
                if (nameError != true) {
                  callback(new Error(nameError));
                } else {
                  callback();
                }
              }
              callback();
            },
            trigger: "blur",
            required: true,
          },
        ],
        school_name: [
          {
            trigger: "change",
            message: "请选择学校",
            required: true,
          },
        ],
        class_name: [
          {
            trigger: "change",
            message: "请选择班级",
            required: true,
          },
        ],
        sex: [
          {
            trigger: "change",
            message: "请选择性别",
            required: true,
          },
        ],
        card: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback(new Error("请输入身份证号"));
              else {
                const cardError = isCardID(value);
                if (cardError != true) {
                  callback(new Error(cardError));
                } else {
                  callback();
                }
              }
              callback();
            },
            trigger: "blur",
            required: true,
          },
        ],
        birthday: [
          {
            trigger: "change",
            message: "请选择生日",
            required: true,
          },
        ],
        phone_number: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback(new Error("请输入电话号码"));
              else {
                const telError = isTelOk(value);
                if (telError != true) {
                  callback(new Error(telError));
                } else {
                  callback();
                }
              }
              callback();
            },
            trigger: "blur",
            required: true,
          },
        ],
        qq: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback();
              else {
                if (!isQQ(value)) {
                  callback(new Error("QQ号码格式错误"));
                } else {
                  callback();
                }
              }
              callback();
            },
            required: false,
            trigger: "blur",
          },
        ],
        email: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback();
              else {
                if (!isEmail(value)) {
                  callback(new Error("邮箱格式错误"));
                } else {
                  callback();
                }
              }
              callback();
            },
            required: false,
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    selected: {
      handler(val) {
        switch (val) {
          case "name": {
            this.showInput = 0;
            break;
          }
          case "clazz_id": {
            this.showInput = 1;
            break;
          }
          case "school": {
            this.showInput = 2;
            break;
          }
        }
        this.value = "";
      },
    },
  },
  created() {
    this.school = parseInt(window.sessionStorage.getItem("stu_schoolId"));
    if (!this.school) {
      this.school = 1;
    }
    this.getStuData(this.school, this.pageSize, this.currentPage);
    this.getSchool();
    this.getClass(this.school);
  },
  methods: {
    hanleChange(current) {
      if (current == "clazz_id") {
        this.showInput = false;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getStuData(this.school, val, this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getStuData(this.school, this.pageSize, val);
    },
    async stuQuery() {
      this.$store.commit("updateLoading", true);
      const resultData = await student.queryStudent(
        this.school,
        this.selected,
        this.value
      );
      if (resultData) {
        this.$store.commit("updateLoading", false);
        this.value = "";
        this.studentData = resultData.results;
        this.total = resultData.count;
      }
    },
    async getStuData(schoolId, size, curren) {
      this.$store.commit("updateLoading", true);
      let resData = {
        index: curren,
        size: size,
        school_id: schoolId,
      };
      const resultsData = await student.getStuData(resData);
      if (resultsData) {
        this.total = resultsData.count;
        this.studentData = resultsData.results;
      }
    },
    async getSchool() {
      this.schoolData = await getSchool();
    },
    schoolChange(id) {
      this.editForm.class_name = "";
      this.getClass(id);
      this.value = "";
    },
    schoolSelect(id) {
      this.getStuData(id, this.pageSize, this.currentPage);
      this.getClass(id);
      this.value = "";
      window.sessionStorage.setItem("stu_schoolId", id);
    },
    async getClass(id) {
      this.classData = await getClass(id);
    },
    edit(row, index) {
      this.editForm.name = row.user.role_info.name;
      this.editForm.school_name = row.school.id;
      this.getClass(row.school.id);
      this.editForm.class_name = row.clazz.id;
      this.editForm.sex = row.user.role_info.sex;
      this.editForm.card = row.user.role_info.card;
      this.editForm.birthday = new Date(row.user.role_info.birthday).getTime();
      this.editForm.phone_number = row.user.role_info.phone_number;
      this.editForm.qq = row.user.role_info.qq;
      this.editForm.email = row.user.role_info.email;
      this.editForm.id = row.id;
      this.index = index;
      this.dialogVisible = true;
    },
    async submitEditForm() {
      if (this.editForm.sex == "男") this.editForm.sex = 1;
      if (this.editForm.sex == "保密") this.editForm.sex = 0;
      if (this.editForm.sex == "女") this.editForm.sex = -1;
      this.editForm.birthday =
        new Date(this.editForm.birthday).getTime() / 1000;
      const resultData = await student.submitEditForm(this.editForm);
      if (!resultData) {
        this.$message.success("修改成功");
        this.getStuData(this.school, this.pageSize, this.currentPage);
      }
      this.dialogVisible = resultData;
      this.editForm.birthday = this.editForm.birthday * 1000;
    },
    studelete(index, id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await student.deleteStudent(id);
          if (result) {
            this.studentData.splice(index, 1);
            this.$message.success("删除成功");
          }
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
.stu-menu {
  .top-bar {
    background-color: white;
    padding: 20px;
    margin-bottom: 30px;
    .el-breadcrumb__inner {
      cursor: default !important;
    }
  }
  .stu-menu-main {
    background-color: #fff;
    padding: 30px;
    .search {
      width: 45%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .el-input {
        width: 40%;
      }
    }
    .table {
      margin-top: 20px;
      i {
        margin: 0px 5px 0px 5px;
        cursor: pointer;
      }
    }
  }
}
</style>
