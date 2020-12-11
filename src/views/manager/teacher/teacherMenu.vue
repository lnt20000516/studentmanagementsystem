<template>
  <div class="teach-menu">
    <div class="top-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item style="font-weight: 800"
          >教师管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>所有教师</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="teach-menu-main">
      <el-select
        v-model="school"
        placeholder="学校"
        filterable
        style="margin-bottom: 20px"
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
        <div class="input-group">
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option label="教师名称" value="name"></el-option>
            <el-option label="班级" value="class"></el-option>
            <el-option label="教师类别" value="role"></el-option>
            <el-option label="教师职称" value="title"></el-option>
          </el-select>
          <el-input
            v-model="searchValue"
            placeholder="请输入教师名称"
            v-show="isInput === 0"
          ></el-input>
          <el-select
            v-model="searchValue"
            placeholder="请选择班级"
            filterable
            v-show="isInput === 1"
          >
            <el-option
              v-for="item in classData"
              :key="item.id"
              :label="item.class_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="searchValue"
            placeholder="请选择教师类别"
            filterable
            v-show="isInput === 2"
          >
            <el-option label="普通教师" :value="0"></el-option>
            <el-option label="班主任" :value="3"></el-option>
          </el-select>
          <el-select
            v-model="searchValue"
            placeholder="请选择职称"
            v-show="isInput === 3"
          >
            <el-option label="三级教师" value="三级教师"></el-option>
            <el-option label="二级教师" value="二级教师"></el-option>
            <el-option label="一级教师" value="一级教师"></el-option>
            <el-option label="高级教师" value="高级教师"></el-option>
            <el-option label="正高级教师" value="正高级教师"></el-option>
          </el-select>
        </div>
        <div class="button-group">
          <button class="pan-btn primary-btn" @click="queryTeacher">
            <i
              class="el-icon-search"
              style="margin-right: 5px; margin-left: 0px"
            ></i>
            查询
          </button>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除所选教师"
            placement="top-start"
          >
            <el-button
              style="margin-left: 20px"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="batchDeletion"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="导出教师表"
            placement="top-start"
          >
            <el-button
              :loading="downloadLoading"
              type="success"
              circle
              icon="el-icon-download"
              @click="handleDownload"
            >
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="table">
        <vue-element-loading
          :active="this.$store.state.vueElementLoading"
          spinner="bar-fade-scale"
          color="#7d76ca"
          size="60"
        />
        <el-table
          :data="teacherData"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          ref="multipleTable"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            prop="id"
            label="工号"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="user.user_details.name"
            label="姓名"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="user.user_details.sex"
            label="性别"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="school.school_name"
            label="学校"
            align="center"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="title"
            label="职称"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="clazz.class_name"
            label="班级"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="type"
            label="教师类别"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="user.user_details.card"
            label="身份证号"
            align="center"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="user.user_details.birthday"
            label="出生日期"
            align="center"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="user.phone_number"
            label="电话号码"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="user.user_details.qq"
            label="QQ"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="user.user_details.email"
            label="Email"
            align="center"
            width="180"
          ></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="edit(scope.row)"></i>
              <i
                class="el-icon-delete"
                @click="del(scope.$index, scope.row.id)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          v-if="showAllpag"
        ></el-pagination>
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="total"
          v-else
        >
        </el-pagination>
        <el-dialog
          title="修改信息"
          :visible.sync="dialogVisible"
          :append-to-body="true"
        >
          <el-form :model="editForm" label-width="80px">
            <el-form-item label="姓名">
              <el-input v-model="editForm.user_details.name"></el-input>
            </el-form-item>
            <!-- <el-form-item label="学校">
              <el-select
                v-model="editForm.school_name"
                placeholder="请选择学校"
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
            <el-form-item label="班级">
              <el-select v-model="editForm.class_name" placeholder="请选择班级">
                <el-option
                  v-for="item in classData"
                  :key="item.id"
                  :label="item.class_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="性别">
              <el-select
                v-model="editForm.user_details.sex"
                placeholder="请选择性别"
              >
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="-1"></el-option>
                <el-option label="保密" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="editForm.user_details.card"></el-input>
            </el-form-item>
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="editForm.user_details.birthday"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="职称">
              <el-select v-model="editForm.title" placeholder="请选择职称">
                <el-option label="三级教师" value="三级教师"></el-option>
                <el-option label="二级教师" value="二级教师"></el-option>
                <el-option label="一级教师" value="一级教师"></el-option>
                <el-option label="高级教师" value="高级教师"></el-option>
                <el-option label="正高级教师" value="正高级教师"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="editForm.phone_number"></el-input>
            </el-form-item>
            <el-form-item label="QQ">
              <el-input v-model="editForm.user_details.qq"></el-input>
            </el-form-item>
            <el-form-item label="email">
              <el-input v-model="editForm.user_details.email"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <button
              class="pan-btn primary-btn"
              type="button"
              style="background-color: #fff; color: #5044d4; margin-right: 10px"
              @click="dialogVisible = false"
            >
              取 消
            </button>
            <button
              class="pan-btn primary-btn"
              type="button"
              @click="submitEditForm()"
            >
              确 定
            </button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import FilenameOption from "@/components/common/excel/FilenameOption";
import AutoWidthOption from "@/components/common/excel/AutoWidthOption";
import BookTypeOption from "@/components/common/excel/BookTypeOption";
import VueElementLoading from "vue-element-loading";
import * as teacher from "@/api/manager/teacher";
import { getSchool, getClass } from "@/api/manager/manager_common";
import { YMD, timeStamp } from "@/tools/dateConversion";
export default {
  created() {
    this.token = this.$store.state.userInfo.token;
    this.getSchool();
    this.getClass(this.school);
    this.getTeachData(this.school, this.pageSize, this.currentPage);
  },
  components: {
    VueElementLoading,
    FilenameOption,
    AutoWidthOption,
    BookTypeOption,
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
    selectValue(val) {
      if (val === "name") {
        this.isInput = 0;
      } else if (val === "class") {
        this.isInput = 1;
      } else if (val === "role") {
        this.isInput = 2;
      } else if (val === "title") {
        this.isInput = 3;
      }
      this.searchValue = "";
    },
  },
  data() {
    return {
      school: 1,
      downloadLoading: false,
      filename: "教师花名册",
      autoWidth: true,
      bookType: "xlsx",
      selectValue: "name",
      searchValue: "",
      teacherData: [],
      schoolData: [],
      classData: [],
      editForm: {
        id: 0,
        phone_number: "",
        user_details: {
          name: "",
          sex: -1,
          birthday: 0,
          card: "",
          qq: "",
          email: "",
        },
        title: "",
      },
      token: "",
      dialogVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isInput: 0,
      selectionData: [],
      showAllpag: true,
    };
  },
  methods: {
    resize() {
      const maxW = this.screenSize.maxW;
      const maxH = this.screenSize.maxH;
      if (maxW <= 500) {
        this.showAllpag = false;
      } else {
        this.showAllpag = true;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTeachData(this.school, val, this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTeachData(this.school, this.pageSize, val);
      this.$refs.multipleTable.clearSelection();
      this.selectionData = [];
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(async (excel) => {
        const tHeader = [
          "工号",
          "姓名",
          "性别",
          "学校",
          "职称",
          "班级",
          "教师类别",
          "身份证号",
          "出生日期",
          "电话号码",
          "QQ",
          "Email",
        ];
        const filterVal = [
          "id",
          "name",
          "sex",
          "school_name",
          "title",
          "class_name",
          "type",
          "card",
          "birthday",
          "phone_number",
          "qq",
          "email",
        ];
        const list = await this.getAllTeacherData();
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        });
        this.downloadLoading = false;
      });
    },
    async getAllTeacherData() {
      let teacherData = await teacher.getAllTeachData(this.school);
      teacherData = teacherData.results;
      let newTeacherData = [];
      teacherData.forEach((item, index) => {
        let temp = {
          id: item.id,
          name: item.user.user_details.name,
          sex: item.user.user_details.sex,
          school_name: item.school.school_name,
          title: item.title,
          class_name: item.clazz,
          type: item.type,
          card: item.user.user_details.card,
          birthday: item.user.user_details.birthday,
          phone_number: item.user.phone_number,
          qq: item.user.user_details.qq,
          email: item.user.user_details.email,
        };
        newTeacherData.push(temp);
      });
      return newTeacherData;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    async getSchool() {
      this.schoolData = await getSchool();
    },
    schoolSelect(id) {
      this.school = id;
      this.getTeachData(id);
      this.getClass(id);
      this.searchValue = "";
    },
    schoolChange(id) {
      this.editForm.school_name = id;
      this.getClass(id);
      this.editForm.class_name = "";
    },
    async getTeachData(schoolId, size, current) {
      this.$store.commit("updateLoading", true);
      const resultData = await teacher.getTeachData(schoolId, size, current);
      if (resultData) {
        this.total = resultData.count;
        this.teacherData = resultData.results;
      }
    },
    async getClass(id) {
      this.classData = await getClass(id);
    },
    async queryTeacher() {
      this.$store.commit("updateLoading", true);
      const resultData = await teacher.queryTeacher(
        this.school,
        this.selectValue,
        this.searchValue
      );
      if (resultData) {
        this.teacherData = resultData.results;
        this.total = resultData.count;
      }
    },
    async submitEditForm() {
      this.editForm.user_details.birthday =
        new Date(this.editForm.user_details.birthday).getTime() / 1000;
      const resultData = await teacher.submitEditForm(
        this.editForm.id,
        this.editForm
      );
      if (resultData) {
        this.dialogVisible = false;
        this.getTeachData(this.school, this.pageSize, this.currentPage);
      }
    },
    edit(row) {
      this.editForm.id = row.id;
      this.editForm.user_details.name = row.user.user_details.name;
      // if (row.school) {
      //   this.editForm.school_name = row.school.school_name;
      // } else {
      //   this.editForm.school_name = null;
      // }
      // if (row.clazz) {
      //   this.editForm.class_name = row.clazz.class_name;
      // } else {
      //   this.editForm.class_name = null;
      // }
      if (row.user.user_details.sex == "男") row.user.user_details.sex = 1;
      if (row.user.user_details.sex == "保密") row.user.user_details.sex = 0;
      if (row.user.user_details.sex == "女") row.user.user_details.sex = -1;
      this.editForm.user_details.sex = row.user.user_details.sex;
      this.editForm.user_details.card = row.user.user_details.card;
      this.editForm.user_details.birthday = new Date(
        row.user.user_details.birthday
      ).getTime();
      this.editForm.phone_number = row.user.phone_number;
      this.editForm.user_details.qq = row.user.user_details.qq;
      this.editForm.title = row.title;
      this.editForm.user_details.email = row.user.user_details.email;
      this.dialogVisible = true;
    },
    del(index, id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const resultData = await teacher.deleteTeacher(id);
          if (resultData) this.teacherData.splice(index, 1);
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    handleSelectionChange(val) {
      this.selectionData = [];
      val.forEach((item) => {
        this.selectionData.push(item.id);
      });
    },
    batchDeletion() {
      if (this.selectionData.length == 0) {
        this.$message.warning("您未选择任何教师");
      } else {
        let id_list = {
          id_list: this.selectionData,
        };
        this.$confirm("此操作将永久删除选中用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const resultData = await teacher.batchDeletion(this.selectionData);
            if (resultData) {
              if (this.selectionData.length >= this.pageSize) {
                this.currentPage -= 1;
              }
              if (this.currentPage <= 0) {
                this.currentPage = 1;
              }
              this.getTeachData(this.school, this.pageSize, this.currentPage);
            }
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
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
      width: 60%;
      margin-bottom: 30px;
      display: flex;
      .pan-btn {
        min-width: 80px;
      }
      .input-group {
        display: flex;
        flex-direction: row;
        align-items: center;
        .el-input,
        .el-select {
          width: 50%;
          margin: 0px 20px 0px 0px;
          min-width: 120px;
        }
      }
      .button-group {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
    i {
      margin-left: 10px;
      cursor: pointer;
    }
    .el-dialog {
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
.el-dialog .el-select,
.el-dialog .el-date-editor {
  width: 100%;
}
@media screen and (max-width: 500px) {
  .el-dialog {
    width: 90% !important;
  }
}
@media screen and (max-width: 625px) {
  .search {
    display: block !important;
  }
  .search .button-group {
    margin-top: 15px;
  }
}
</style>